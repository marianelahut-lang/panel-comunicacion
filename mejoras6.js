/* ============================================================
   MEJORAS6.JS - Panel Comunicación Tres Arroyos
   ------------------------------------------------------------
   FIX 1: Columna "Realizada" no debe mostrarse en el Kanban
     - Oculta la columna del DOM después de cada render
     - Se activa vía MutationObserver en #kanban

   FIX 2: "Agenda de hoy" queda vacía aunque GCal tiene eventos
     - _renderHoy() corre antes de que GCal termine de cargar
     - Observa el botón GCal y re-renderiza p-hoy al terminar

   FIX 3: "Tareas urgentes" — solo 5 más antiguas + botón borrar
     - Envuelve _renderHoy para reordenar por created_at ASC
     - Muestra máximo 5 (no 8)
     - Agrega botón ✕ para borrar cada tarea de Supabase
   ============================================================
   v1 — 2026-05-20
   ============================================================ */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════
     FIX 1 — KANBAN: OCULTAR COLUMNA "REALIZADA"
     ══════════════════════════════════════════════════════════
     La función renderKanban() incluye "Realizada" en COLS[]
     aunque filtra esas tareas en ft[]. La columna siempre
     aparece con 0 ítems. La ocultamos del DOM después de
     cada render, sin tocar el código original.
  ══════════════════════════════════════════════════════════ */

  function ocultarColRealizadaDOM() {
    var kanban = document.getElementById("kanban");
    if (!kanban) return;
    kanban.querySelectorAll(".kcol").forEach(function (col) {
      var hdr = col.querySelector(".khdr");
      if (hdr && hdr.textContent.trim().toLowerCase().includes("realizada")) {
        col.style.display = "none";
      }
    });
  }

  function iniciarObserverKanban() {
    var kanban = document.getElementById("kanban");
    if (!kanban) {
      setTimeout(iniciarObserverKanban, 500);
      return;
    }
    // Ocultar al arranque
    ocultarColRealizadaDOM();

    // Ocultar cada vez que se re-renderiza el kanban
    var mo = new MutationObserver(function (muts) {
      var cambio = muts.some(function (m) { return m.addedNodes.length > 0; });
      if (cambio) ocultarColRealizadaDOM();
    });
    mo.observe(kanban, { childList: true });

    console.log("[mejoras6] Observer Kanban activo — columna Realizada oculta");
  }

  /* ══════════════════════════════════════════════════════════
     FIX 2 — AGENDA DE HOY: RE-RENDER CUANDO GCAL CARGA
     ══════════════════════════════════════════════════════════
     _renderHoy() se llama con 100ms delay (nav patch), pero
     GCal termina de sincronizar varios segundos después.
     Observamos el botón GCal y re-renderizamos p-hoy si
     está visible en ese momento.
  ══════════════════════════════════════════════════════════ */

  function iniciarObserverGCal() {
    // El botón GCal muestra "GCal · 472 ev" cuando termina de cargar
    var gcBtn = document.querySelector(".gcbtn");
    if (!gcBtn) {
      setTimeout(iniciarObserverGCal, 600);
      return;
    }

    var _yaRefrescado = false;

    var mo = new MutationObserver(function () {
      var txt = gcBtn.textContent || "";
      // Detectar que GCal terminó: texto cambia de "Sin sincronización" → "GCal · N ev"
      if (!_yaRefrescado && txt.match(/GCal\s*[·\·]\s*\d+\s*ev/i)) {
        _yaRefrescado = true;
        var phoy = document.getElementById("p-hoy");
        if (phoy && phoy.style.display !== "none") {
          setTimeout(function () {
            if (typeof window._renderHoy === "function") {
              window._renderHoy();
              console.log("[mejoras6] Agenda de hoy re-renderizada tras carga de GCal");
            }
          }, 300);
        }
        // Resetear flag para próximas sincronizaciones manuales
        setTimeout(function () { _yaRefrescado = false; }, 5000);
      }
    });

    mo.observe(gcBtn, { childList: true, subtree: true, characterData: true });

    // También parchear nav() para re-render si GCal ya cargó al navegar a "hoy"
    var _origNav = window.nav;
    if (typeof _origNav === "function" && !window._m6NavPatched) {
      window._m6NavPatched = true;
      window.nav = function (id) {
        var r = _origNav.apply(this, arguments);
        if (id === "hoy") {
          setTimeout(function () {
            var gcalCargado = typeof gcalEvs !== "undefined" && Array.isArray(gcalEvs) && gcalEvs.length > 0;
            if (gcalCargado && typeof window._renderHoy === "function") {
              window._renderHoy();
            }
          }, 200);
        }
        return r;
      };
    }

    console.log("[mejoras6] Observer GCal activo — agenda de hoy se re-renderizará al cargar");
  }

  /* ══════════════════════════════════════════════════════════
     FIX 3 — TAREAS URGENTES: 5 MÁS ANTIGUAS + BOTÓN BORRAR
     ══════════════════════════════════════════════════════════
     La función original hace:
       urgentes = tasks.filter(Alta && no Completo).slice(0,8)
     Sin ordenar por antigüedad y sin botón de borrar.

     Envolvemos _renderHoy para interceptar el card de urgentes
     y reescribir su contenido con:
       - Orden por created_at ASC (más antiguas primero)
       - Máximo 5 items
       - Botón ✕ que borra de Supabase + refresca
  ══════════════════════════════════════════════════════════ */

  function parchearRenderHoy() {
    if (!window._renderHoy || window._renderHoy._m6patched) return;

    var _orig = window._renderHoy;

    window._renderHoy = function () {
      // Llamar la función original (que construye todo el HTML)
      _orig.apply(this, arguments);

      // Ahora post-procesar el card de "Tareas urgentes"
      setTimeout(reescribirCardUrgentes, 50);
    };

    window._renderHoy._m6patched = true;
    console.log("[mejoras6] _renderHoy parcheado — urgentes: 5 más antiguas + borrar");
  }

  function reescribirCardUrgentes() {
    var phoy = document.getElementById("p-hoy");
    if (!phoy) return;

    // Encontrar el card de "Tareas urgentes" por su título
    var cards = phoy.querySelectorAll("div");
    var urgCard = null;
    for (var i = 0; i < cards.length; i++) {
      var el = cards[i];
      if (el.children.length === 2) {
        var hdr = el.children[0];
        if (hdr && hdr.textContent.includes("Tareas urgentes")) {
          urgCard = el;
          break;
        }
      }
    }
    if (!urgCard) return;

    var cb = urgCard.children[1]; // el body del card
    if (!cb) return;

    // Obtener las tareas urgentes del estado global
    var tareas = (typeof tasks !== "undefined" && Array.isArray(tasks)) ? tasks : [];
    var urgentes = tareas.filter(function (t) {
      return t.prioridad === "Alta" &&
             t.estado !== "Completo" &&
             t.estado !== "Listo s/publicar" &&
             t.estado !== "Realizada";
    });

    // Ordenar por created_at ASC (más antiguas primero)
    urgentes.sort(function (a, b) {
      var fa = a.created_at || "";
      var fb = b.created_at || "";
      return String(fa).localeCompare(String(fb));
    });

    // Tomar solo las 5 más antiguas
    var mostrar = urgentes.slice(0, 5);
    var ocultas = urgentes.length - mostrar.length;

    // Limpiar el body del card
    while (cb.firstChild) cb.removeChild(cb.firstChild);

    if (!mostrar.length) {
      var emp = document.createElement("div");
      emp.style.cssText = "font-size:12px;color:#9ca3af;padding:8px 0;text-align:center";
      emp.textContent = "✅ Sin urgentes pendientes";
      cb.appendChild(emp);
      return;
    }

    // Renderizar las 5 más antiguas con botón de borrar
    mostrar.forEach(function (t) {
      var it = document.createElement("div");
      it.style.cssText = "display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;position:relative";

      // Checkbox
      var chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = t.estado === "Completo";
      chk.style.cssText = "margin-top:2px;width:16px;height:16px;cursor:pointer;accent-color:#6d28d9;flex-shrink:0";
      chk.onchange = (function (tid) {
        return function () {
          if (typeof tdToggle === "function") tdToggle(String(tid));
          setTimeout(function () {
            if (typeof window._renderHoy === "function") window._renderHoy();
          }, 400);
        };
      })(t.id);

      // Info
      var info = document.createElement("div");
      info.style.flex = "1";
      info.style.minWidth = "0";

      var desc = document.createElement("div");
      desc.style.cssText = "font-size:12px;font-weight:500;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;padding-right:20px";
      desc.textContent = t.descripcion || "";

      var meta = document.createElement("div");
      meta.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap";

      var respEl = document.createElement("span");
      respEl.style.cssText = "font-size:10px;color:#6b7280";
      respEl.textContent = t.responsable || "";
      meta.appendChild(respEl);

      // Antigüedad en días
      if (t.created_at) {
        var dias = Math.max(0, Math.floor((Date.now() - new Date(t.created_at)) / 86400000));
        if (dias > 0) {
          var ageEl = document.createElement("span");
          ageEl.style.cssText = "font-size:9px;padding:1px 5px;border-radius:4px;" +
            (dias > 14 ? "background:#fee2e2;color:#dc2626" :
             dias > 7  ? "background:#fffbeb;color:#d97706" :
                         "background:#f3f4f6;color:#6b7280");
          ageEl.textContent = dias + "d";
          meta.appendChild(ageEl);
        }
      }

      info.appendChild(desc);
      info.appendChild(meta);

      // Botón borrar ✕
      var delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Eliminar tarea";
      delBtn.style.cssText = [
        "position:absolute;top:8px;right:0",
        "background:none;border:none;cursor:pointer",
        "color:#d1d5db;font-size:13px;padding:0;line-height:1",
        "flex-shrink:0;font-family:inherit"
      ].join(";");
      delBtn.onmouseover = function () { this.style.color = "#dc2626"; };
      delBtn.onmouseout  = function () { this.style.color = "#d1d5db"; };
      delBtn.onclick = (function (tarea) {
        return function (e) {
          e.stopPropagation();
          _borrarTareaUrgente(tarea);
        };
      })(t);

      it.appendChild(chk);
      it.appendChild(info);
      it.appendChild(delBtn);
      cb.appendChild(it);
    });

    // Mostrar contador de ocultas
    if (ocultas > 0) {
      var mas = document.createElement("div");
      mas.style.cssText = "font-size:11px;color:#9ca3af;text-align:center;padding:7px 0 2px;cursor:pointer";
      mas.textContent = "+" + ocultas + " tarea" + (ocultas === 1 ? "" : "s") + " urgente" + (ocultas === 1 ? "" : "s") + " más → ir al Tablero";
      mas.onclick = function () {
        if (typeof nav === "function") nav("tablero");
      };
      cb.appendChild(mas);
    }
  }

  function _borrarTareaUrgente(t) {
    var nombre = (t.descripcion || "esta tarea").slice(0, 40);
    if (!confirm("¿Eliminar \"" + nombre + "\"?")) return;

    // 1. Quitar del array local
    if (typeof tasks !== "undefined" && Array.isArray(tasks)) {
      var idx = tasks.findIndex(function (x) { return String(x.id) === String(t.id); });
      if (idx !== -1) tasks.splice(idx, 1);
    }

    // 2. Borrar de Supabase
    var dbx = window.db || (typeof db !== "undefined" ? db : null);
    if (dbx && typeof dbx.from === "function") {
      dbx.from("tareas").delete().eq("id", t.id)
        .then(function (res) {
          if (res && res.error) console.warn("[mejoras6] Error Supabase borrar tarea:", res.error.message);
          else console.log("[mejoras6] Tarea borrada de Supabase:", t.id);
        })
        .catch(function (e) { console.warn("[mejoras6] Error:", e); });
    }

    // 3. Refrescar UI
    if (typeof window._renderHoy === "function") window._renderHoy();
    if (typeof renderKanban === "function") setTimeout(renderKanban, 100);
    if (typeof updateBadges === "function") updateBadges();

    if (typeof toast === "function") toast("✓ Tarea eliminada");
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZACIÓN
  ══════════════════════════════════════════════════════════ */

  function init() {
    iniciarObserverKanban();
    iniciarObserverGCal();

    // Esperar a que _renderHoy esté definida (se define en mejoras posteriores)
    var intentos = 0;
    var iv = setInterval(function () {
      intentos++;
      if (typeof window._renderHoy === "function") {
        parchearRenderHoy();
        clearInterval(iv);
      } else if (intentos > 20) {
        clearInterval(iv);
        console.warn("[mejoras6] _renderHoy no encontrada después de 10s");
      }
    }, 500);

    console.log("%c[mejoras6.js] Cargado: Kanban sin Realizada + Agenda GCal + Urgentes (5 más antiguas + borrar)",
      "color:#7c3aed;font-weight:bold;font-size:12px");
  }

  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

})();
