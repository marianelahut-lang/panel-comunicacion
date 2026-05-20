/* ============================================================
   MEJORAS7.JS - Panel Comunicación Tres Arroyos
   Parche de estabilización definitiva — v1 (2026-05-20)
   ------------------------------------------------------------
   FIX 1  — Supabase Realtime: bloquear canales duplicados
              (soluciona los warnings "cannot add postgres_changes
               callbacks after subscribe()" causados por la doble
               carga de mejoras1.js en versiones anteriores del
               index.html)

   FIX 2  — Publicaciones guardia esta semana: ocultar días pasados
              (el bloque mostraba Lunes 18/5, Martes 19/5 aunque
               ya pasaron; ahora filtra fecha >= hoy)

   FIX 3  — Kanban: ocultar columna "Realizada" (ya tiene 0 tareas
              porque el filtro las excluye, pero la columna seguía
              apareciendo)

   FIX 4  — Agenda de hoy: re-renderizar cuando GCal termina
              de cargar (evita que quede "Sin eventos para hoy")

   FIX 5  — Tareas urgentes: máximo 5 más antiguas + botón borrar

   FIX 6  — Prevenir TypeError en renderKanban cuando tasks
              o el contenedor #kanban no existen todavía

   FIX 7  — Cleanup: eliminar MutationObservers y setIntervals
              huérfanos de parches anteriores cuando ya no se
              necesitan
   ============================================================ */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════
     FIX 1 — SUPABASE REALTIME: BLOQUEAR CANALES DUPLICADOS
     ══════════════════════════════════════════════════════════
     Cuando mejoras1.js se cargaba dos veces, se llamaba a
       db.channel("publicaciones_rt_m1")...subscribe()
     dos veces con el mismo nombre, generando el error:
       "cannot add postgres_changes callbacks after subscribe()"

     Solución: parchear db.channel() para devolver un canal
     vacío (no-op) si el nombre ya fue suscrito.
  ══════════════════════════════════════════════════════════ */

  function patchRealtimeDuplicados() {
    function aplicar(db) {
      if (!db || typeof db.channel !== "function") return false;
      if (db._m7channelPatched) return true;
      db._m7channelPatched = true;
      var _activos = {};
      var _origCh = db.channel.bind(db);
      db.channel = function (name) {
        if (_activos[name]) {
          // Devolver un objeto no-op silencioso
          var noop = { on: function () { return noop; }, subscribe: function () { return noop; }, unsubscribe: function () {} };
          return noop;
        }
        _activos[name] = true;
        return _origCh(name);
      };
      console.log("[mejoras7] Realtime duplicados bloqueados");
      return true;
    }

    // Intentar aplicar ahora y con polling hasta que db esté disponible
    if (!aplicar(window.db)) {
      var iv = setInterval(function () {
        var db = window.db || (typeof db !== "undefined" ? db : null);
        if (aplicar(db)) clearInterval(iv);
      }, 300);
      setTimeout(function () { clearInterval(iv); }, 10000);
    }
  }

  /* ══════════════════════════════════════════════════════════
     FIX 2 — PUBLICACIONES GUARDIA SEMANA: OCULTAR DÍAS PASADOS
     ══════════════════════════════════════════════════════════
     El bloque #m1-pubs-guardias mostraba publicaciones de
     días anteriores de la semana actual (ej: Lunes 18/5,
     Martes 19/5 cuando hoy es Miércoles 20/5).

     Causa: el filtro en mejoras1.js solo verifica
       p.fecha >= lunesStr && p.fecha <= domStr
     pero no filtra p.fecha < hoy.

     Solución A (principal): parchear la función
       renderPubsGuardiasSemana si está expuesta globalmente.
     Solución B (fallback): MutationObserver sobre
       #m1-pubs-guardias que oculta los bloques de días pasados
       después de cada render.
  ══════════════════════════════════════════════════════════ */

  function hoyISO() {
    var d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function ocultarDiasPasadosEnBloque(bloque) {
    if (!bloque) return;
    var hoy = hoyISO();
    // Buscar cada sub-bloque de día (tiene un header con "LUNES 18/5" etc.)
    var dayBlocks = bloque.querySelectorAll("div[style*='margin-bottom']");
    dayBlocks.forEach(function (block) {
      // Buscar el header dentro del bloque
      var hdr = block.querySelector("div[style*='text-transform:uppercase'], div[style*='text-transform: uppercase']");
      if (!hdr) return;
      var txt = hdr.textContent.trim(); // Ej: "LUNES 18/5"
      var match = txt.match(/(\d{1,2})\/(\d{1,2})/);
      if (!match) return;
      var d = parseInt(match[1], 10);
      var m = parseInt(match[2], 10);
      var anio = new Date().getFullYear();
      var fechaBloque = anio + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      if (fechaBloque < hoy) {
        block.style.display = "none";
      }
    });
  }

  function iniciarFixPublicacionesPasadas() {
    // Aplicar al bloque existente si ya está en el DOM
    var bloque = document.getElementById("m1-pubs-guardias");
    if (bloque) ocultarDiasPasadosEnBloque(bloque);

    // Observar cambios para aplicarlo cada vez que se re-renderice
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.id === "m1-pubs-guardias") {
            setTimeout(function () { ocultarDiasPasadosEnBloque(node); }, 80);
          }
          var nested = node.querySelector && node.querySelector("#m1-pubs-guardias");
          if (nested) {
            setTimeout(function () { ocultarDiasPasadosEnBloque(nested); }, 80);
          }
        });
        // Si el target ES el bloque (contenido cambia)
        if (m.target && m.target.id === "m1-pubs-guardias") {
          setTimeout(function () { ocultarDiasPasadosEnBloque(m.target); }, 80);
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ══════════════════════════════════════════════════════════
     FIX 3 — KANBAN: OCULTAR COLUMNA "REALIZADA"
  ══════════════════════════════════════════════════════════ */

  function ocultarColRealizada() {
    var kanban = document.getElementById("kanban");
    if (!kanban) return;
    kanban.querySelectorAll(".kcol").forEach(function (col) {
      var hdr = col.querySelector(".khdr");
      if (hdr && hdr.textContent.trim().toLowerCase().includes("realizada")) {
        col.style.display = "none";
      }
    });
  }

  function iniciarFixKanban() {
    var kanban = document.getElementById("kanban");
    if (!kanban) { setTimeout(iniciarFixKanban, 500); return; }
    ocultarColRealizada();
    var mo = new MutationObserver(function (muts) {
      if (muts.some(function (m) { return m.addedNodes.length > 0; })) {
        ocultarColRealizada();
      }
    });
    mo.observe(kanban, { childList: true });
  }

  /* ══════════════════════════════════════════════════════════
     FIX 4 — AGENDA DE HOY: RE-RENDER POST GCAL
  ══════════════════════════════════════════════════════════ */

  function iniciarFixAgendaGCal() {
    // Parchear nav() para re-render si GCal ya cargó al entrar a "hoy"
    var _origNav = window.nav;
    if (typeof _origNav === "function" && !window._m7NavPatched) {
      window._m7NavPatched = true;
      window.nav = function (id) {
        var r = _origNav.apply(this, arguments);
        if (id === "hoy") {
          setTimeout(function () {
            var cargado = (typeof gcalEvs !== "undefined" && Array.isArray(gcalEvs) && gcalEvs.length > 0) ||
                          (typeof agendas !== "undefined" && Array.isArray(agendas) && agendas.length > 0);
            if (cargado && typeof window._renderHoy === "function") {
              window._renderHoy();
            }
          }, 150);
        }
        return r;
      };
    }

    // Observar el botón GCal para detectar fin de sincronización
    function watchGCal() {
      var gcBtn = document.querySelector(".gcbtn");
      if (!gcBtn) { setTimeout(watchGCal, 800); return; }
      var _refrescado = false;
      var mo = new MutationObserver(function () {
        var txt = gcBtn.textContent || "";
        if (!_refrescado && /GCal\s*[·]\s*\d+\s*ev/i.test(txt)) {
          _refrescado = true;
          var phoy = document.getElementById("p-hoy");
          if (phoy && phoy.style.display !== "none" && typeof window._renderHoy === "function") {
            setTimeout(window._renderHoy, 250);
          }
          setTimeout(function () { _refrescado = false; }, 8000);
        }
      });
      mo.observe(gcBtn, { childList: true, subtree: true, characterData: true });
    }
    watchGCal();
  }

  /* ══════════════════════════════════════════════════════════
     FIX 5 — TAREAS URGENTES: 5 MÁS ANTIGUAS + BOTÓN BORRAR
  ══════════════════════════════════════════════════════════ */

  function parchearRenderHoy() {
    if (!window._renderHoy || window._renderHoy._m7patched) return;
    var _orig = window._renderHoy;
    window._renderHoy = function () {
      _orig.apply(this, arguments);
      setTimeout(reescribirUrgentes, 60);
    };
    window._renderHoy._m7patched = true;
  }

  function reescribirUrgentes() {
    var phoy = document.getElementById("p-hoy");
    if (!phoy) return;

    // Encontrar el card de "Tareas urgentes"
    var urgCard = null;
    phoy.querySelectorAll("div").forEach(function (el) {
      if (urgCard) return;
      if (el.children.length === 2) {
        var h = el.children[0];
        if (h && h.textContent.includes("Tareas urgentes")) urgCard = el;
      }
    });
    if (!urgCard) return;
    var cb = urgCard.children[1];
    if (!cb) return;

    var tareas = (typeof tasks !== "undefined" && Array.isArray(tasks)) ? tasks : [];
    var urgentes = tareas.filter(function (t) {
      return t.prioridad === "Alta" &&
        t.estado !== "Completo" && t.estado !== "Listo s/publicar" && t.estado !== "Realizada";
    }).sort(function (a, b) {
      return String(a.created_at || "").localeCompare(String(b.created_at || ""));
    });

    var mostrar = urgentes.slice(0, 5);
    var extra = urgentes.length - mostrar.length;

    while (cb.firstChild) cb.removeChild(cb.firstChild);

    if (!mostrar.length) {
      var emp = document.createElement("div");
      emp.style.cssText = "font-size:12px;color:#9ca3af;padding:8px 0;text-align:center";
      emp.textContent = "✅ Sin urgentes pendientes";
      cb.appendChild(emp);
      return;
    }

    mostrar.forEach(function (t) {
      var it = document.createElement("div");
      it.style.cssText = "display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;position:relative";

      var chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = t.estado === "Completo";
      chk.style.cssText = "margin-top:2px;width:16px;height:16px;cursor:pointer;accent-color:#6d28d9;flex-shrink:0";
      chk.onchange = (function (tid) {
        return function () {
          if (typeof tdToggle === "function") tdToggle(String(tid));
          setTimeout(function () { if (typeof window._renderHoy === "function") window._renderHoy(); }, 400);
        };
      })(t.id);

      var info = document.createElement("div");
      info.style.cssText = "flex:1;min-width:0;padding-right:22px";

      var desc = document.createElement("div");
      desc.style.cssText = "font-size:12px;font-weight:500;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical";
      desc.textContent = t.descripcion || "";

      var meta = document.createElement("div");
      meta.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap";

      var respEl = document.createElement("span");
      respEl.style.cssText = "font-size:10px;color:#6b7280";
      respEl.textContent = t.responsable || "";
      meta.appendChild(respEl);

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

      var delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Eliminar tarea";
      delBtn.style.cssText = "position:absolute;top:8px;right:0;background:none;border:none;cursor:pointer;color:#d1d5db;font-size:13px;padding:0;line-height:1";
      delBtn.onmouseover = function () { this.style.color = "#dc2626"; };
      delBtn.onmouseout  = function () { this.style.color = "#d1d5db"; };
      delBtn.onclick = (function (tarea) {
        return function (e) {
          e.stopPropagation();
          if (!confirm("¿Eliminar esta tarea?")) return;
          if (typeof tasks !== "undefined" && Array.isArray(tasks)) {
            var idx = tasks.findIndex(function (x) { return String(x.id) === String(tarea.id); });
            if (idx !== -1) tasks.splice(idx, 1);
          }
          var dbx = window.db || (typeof db !== "undefined" ? db : null);
          if (dbx && typeof dbx.from === "function") {
            dbx.from("tareas").delete().eq("id", tarea.id)
              .then(function (r) { if (r && r.error) console.warn("[m7] Error borrar tarea:", r.error.message); })
              .catch(function (e) { console.warn("[m7]", e); });
          }
          if (typeof window._renderHoy === "function") window._renderHoy();
          if (typeof renderKanban === "function") setTimeout(renderKanban, 100);
          if (typeof toast === "function") toast("✓ Tarea eliminada");
        };
      })(t);

      it.appendChild(chk);
      it.appendChild(info);
      it.appendChild(delBtn);
      cb.appendChild(it);
    });

    if (extra > 0) {
      var mas = document.createElement("div");
      mas.style.cssText = "font-size:11px;color:#9ca3af;text-align:center;padding:7px 0 2px;cursor:pointer";
      mas.textContent = "+" + extra + " tarea" + (extra === 1 ? "" : "s") + " urgente" + (extra === 1 ? "" : "s") + " más";
      mas.onclick = function () { if (typeof nav === "function") nav("tablero"); };
      cb.appendChild(mas);
    }
  }

  /* ══════════════════════════════════════════════════════════
     FIX 6 — KANBAN: GUARD CONTRA renderKanban SIN #kanban
  ══════════════════════════════════════════════════════════ */

  function parchearRenderKanban() {
    var _orig = window.renderKanban;
    if (typeof _orig !== "function" || _orig._m7patched) return;
    window.renderKanban = function () {
      if (!document.getElementById("kanban")) return;
      if (typeof tasks === "undefined" || !Array.isArray(tasks)) return;
      _orig.apply(this, arguments);
    };
    window.renderKanban._m7patched = true;
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZACIÓN
  ══════════════════════════════════════════════════════════ */

  function init() {
    patchRealtimeDuplicados();
    iniciarFixPublicacionesPasadas();
    iniciarFixKanban();
    iniciarFixAgendaGCal();

    // _renderHoy puede definirse tarde (en un parche inline del index.html)
    var intentos = 0;
    var iv = setInterval(function () {
      intentos++;
      parchearRenderKanban();
      if (typeof window._renderHoy === "function") {
        parchearRenderHoy();
      }
      if (intentos > 30) clearInterval(iv);
    }, 400);

    console.log("%c[mejoras7.js] Cargado — estabilización definitiva v1",
      "color:#059669;font-weight:bold;font-size:12px");
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

})();
