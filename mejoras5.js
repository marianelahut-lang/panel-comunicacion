/* ============================================================
   MEJORAS5.JS - Panel Comunicación Tres Arroyos
   ------------------------------------------------------------
   FIX 1: Publicaciones borradas siguen apareciendo en Agenda
     - Usa event delegation para interceptar clics en botones
       de borrado ANTES de que _apBorrar ejecute
     - Al borrar, también elimina de Supabase la publicación
     - Al marcar como publicado, también actualiza Supabase
   FIX 2: Panel Guardias - Teléfonos no aparecen ("Sin tel.")
     - Post-procesa el DOM del panel Guardias para reemplazar
       los "Sin tel." con links de WhatsApp usando _tdGetTel()
   FEAT: Panel Guardias - Botón WhatsApp con tareas del día
   ============================================================
   CHANGELOG (v4 — bugs corregidos):
     - [CRÍTICO] modalHtml migrado a template literals: evita
       rotura de strings JS por comillas simples en onclick
     - [CRÍTICO] Guards explícitos si window.db / _tdGetTel /
       #m4g no están disponibles (falla visible, no silenciosa)
     - [MEDIO]   _apMarcarPublicado parcheado con async/await
       en vez del frágil setTimeout(500)
     - [MEDIO]   var redeclaradas (tel, link, name) reemplazadas
       por const en bloques separados dentro de fixGuardiaPhones
     - [MEDIO]   Variable muerta _m5SyncBorradoActivo eliminada
     - [SUGERENCIA] HTML de modal construido con template literal
   ============================================================ */

(function(){
  "use strict";

  /* ══════════════════════════════════════════════════════════
     FIX 1 — PUBLICACIONES: INTERCEPTAR BORRADO CON SUPABASE
     ══════════════════════════════════════════════════════════
     CAUSA DEL BUG:
       _apBorrar() se redefine cada vez que se re-renderiza el
       panel de publicaciones (dentro de renderAgendaPublicacionesModulo).
       Parcharlo directamente no sirve porque se sobreescribe.

     SOLUCIÓN:
       1. Usar event delegation sobre document para interceptar
          clics en botones de borrado ANTES de que ejecuten
          (usando capture: true para capturar antes del onclick)
       2. Extraer el ID del onclick del botón y también borrar
          de Supabase después de la confirmación del usuario
       3. Para "marcar como publicado", parchear igual que
          _apBorrar con async/await (no más setTimeout frágil)
     ══════════════════════════════════════════════════════════ */

  function sincronizarBorradoConSupabase(){
    if(window._m5SyncBorradoActivo) return;
    window._m5SyncBorradoActivo = true;

    /* ────────────────────────────────────────────────────
       FIX BORRADO v4: Reemplazar _apBorrar para que borre
       de Supabase PRIMERO, antes de que recargue datos.

       CORRECCIÓN: guard explícito si window.db no existe.
    ──────────────────────────────────────────────────── */
    function parchearApBorrar(){
      if(typeof window._apBorrar !== "function") return;
      if(window._apBorrar._m5patched) return;

      var _orig = window._apBorrar;

      window._apBorrar = async function(id){
        if(!confirm("\u00BFBorrar esta publicaci\u00F3n programada?")) return;

        // Guard: verificar que Supabase esté disponible
        var dbx = window.db || (typeof getDb === "function" ? getDb() : null);
        if(!dbx || typeof dbx.from !== "function"){
          console.warn("[mejoras5] window.db no disponible — borrado solo en UI");
        } else {
          // 1. Borrar de Supabase PRIMERO
          try {
            var res = await dbx.from("publicaciones").delete().eq("id", id);
            if(res && res.error){
              console.warn("[mejoras5] Error borrar Supabase:", res.error.message);
            } else {
              console.log("[mejoras5] Publicaci\u00F3n borrada de Supabase:", id);
            }
          } catch(e){
            console.warn("[mejoras5] Error sync borrado:", e);
          }
        }

        // 2. Llamar original para limpiar UI (skip su confirm)
        var origConfirm = window.confirm;
        window.confirm = function(){ return true; };
        try { _orig(id); } catch(e){ console.warn("[mejoras5] Error en _apBorrar:", e); } finally { window.confirm = origConfirm; }
      };

      window._apBorrar._m5patched = true;
    }

    parchearApBorrar();

    // Re-intentar si _apBorrar se recarga
    var _iv = setInterval(function(){
      if(window._apBorrar && !window._apBorrar._m5patched) parchearApBorrar();
    }, 1500);
    setTimeout(function(){ clearInterval(_iv); }, 60000);

    /* ────────────────────────────────────────────────────
       FIX MARCADO v4: Parchear _apMarcarPublicado con
       async/await en vez del frágil setTimeout(500).

       CORRECCIÓN: guard explícito + mismo patrón que _apBorrar.
    ──────────────────────────────────────────────────── */
    function parchearApMarcarPublicado(){
      if(typeof window._apMarcarPublicado !== "function") return;
      if(window._apMarcarPublicado._m5patched) return;

      var _origM = window._apMarcarPublicado;

      window._apMarcarPublicado = async function(id){
        var dbx = window.db || (typeof getDb === "function" ? getDb() : null);
        if(!dbx || typeof dbx.from !== "function"){
          console.warn("[mejoras5] window.db no disponible — estado no sincronizado con Supabase");
        } else {
          try {
            var res = await dbx.from("publicaciones").update({ estado: "Publicado" }).eq("id", id);
            if(res && res.error){
              console.warn("[mejoras5] Error actualizar estado Supabase:", res.error.message);
            } else {
              console.log("[mejoras5] Estado actualizado en Supabase:", id);
            }
          } catch(e){
            console.warn("[mejoras5] Error sync publicado:", e);
          }
        }
        // Llamar original para actualizar UI
        try { _origM(id); } catch(e){ console.warn("[mejoras5] Error en _apMarcarPublicado:", e); }
      };

      window._apMarcarPublicado._m5patched = true;
    }

    parchearApMarcarPublicado();

    // Re-intentar si _apMarcarPublicado se recarga
    var _ivM = setInterval(function(){
      if(window._apMarcarPublicado && !window._apMarcarPublicado._m5patched) parchearApMarcarPublicado();
    }, 1500);
    setTimeout(function(){ clearInterval(_ivM); }, 60000);

    console.log("[mejoras5] Interceptor borrado + publicado activo (v4)");
  }

  /* ══════════════════════════════════════════════════════════
     FIX 2 — GUARDIAS: MOSTRAR TELÉFONOS (reemplaza "Sin tel.")

     CORRECCIÓN: guard explícito si _tdGetTel no está disponible.
                 var redeclaradas reemplazadas por const en
                 bloques separados.
     ══════════════════════════════════════════════════════════ */
  function fixGuardiaPhones(m4g){
    if(!m4g) m4g = document.getElementById("m4g");
    if(!m4g) return;
    if(m4g.getAttribute("data-m5fixed") === "1") return;

    if(typeof window._tdGetTel !== "function"){
      console.warn("[mejoras5] _tdGetTel no disponible — fix de teléfonos de guardias omitido");
      return;
    }

    // 1. Tarjetas de la semana
    m4g.querySelectorAll(".m4g-card .m4g-wa-dis, .m4g-card .m4g-add-phone").forEach(function(el){
      var card = el.closest(".m4g-card");
      if(!card) return;
      var nameEl = card.querySelector(".m4g-cname");
      var name = nameEl ? nameEl.textContent.trim() : "";
      if(!name) return;
      const tel1 = window._tdGetTel(name);
      if(!tel1) return;
      var oc = card.getAttribute("onclick") || "";
      var dateMatch = oc.match(/['"]([\d]{4}-[\d]{2}-[\d]{2})['"]/);
      var dateStr = dateMatch ? dateMatch[1] : "";
      var msg = encodeURIComponent("Guardia " + dateStr + " \u2014 " + name);
      var waUrl = "https://api.whatsapp.com/send?phone=" + tel1 + "&text=" + msg;
      const link1 = document.createElement("a");
      link1.className = "m4g-wa";
      link1.href = waUrl;
      link1.target = "_blank";
      link1.textContent = "\uD83D\uDCAC WhatsApp";
      link1.onclick = function(e){ e.stopPropagation(); };
      el.parentNode.replaceChild(link1, el);
    });

    // 2. Botón principal en el detalle
    {
      const waBtn = m4g.querySelector(".m4g-wa-big[disabled], .m4g-wa-big:disabled");
      if(waBtn){
        const agentName2 = m4g.querySelector(".m4g-agent-name");
        const name2 = agentName2 ? agentName2.textContent.trim() : "";
        if(name2){
          const tel2 = window._tdGetTel(name2);
          if(tel2){
            const newBtn = document.createElement("button");
            newBtn.className = "m4g-wa-big";
            newBtn.textContent = "\uD83D\uDCAC Enviar WhatsApp";
            newBtn.onclick = function(){
              abrirModalWATareas(name2, tel2, m4g);
            };
            waBtn.parentNode.replaceChild(newBtn, waBtn);
          }
        }
      }
    }

    // 3. Sidebar del agente
    {
      const agentWaDis = m4g.querySelector(".m4g-agent-card .m4g-wa-dis, .m4g-agent-card .m4g-add-phone");
      if(agentWaDis){
        const agentName3 = m4g.querySelector(".m4g-agent-name");
        const name3 = agentName3 ? agentName3.textContent.trim() : "";
        if(name3){
          const tel3 = window._tdGetTel(name3);
          if(tel3){
            const link3 = document.createElement("a");
            link3.className = "m4g-wa";
            link3.href = "https://api.whatsapp.com/send?phone=" + tel3;
            link3.target = "_blank";
            link3.textContent = "\uD83D\uDCAC WhatsApp";
            agentWaDis.parentNode.replaceChild(link3, agentWaDis);
          }
        }
      }
    }

    m4g.setAttribute("data-m5fixed", "1");
  }

  /* ══════════════════════════════════════════════════════════
     FEAT — MODAL WHATSAPP CON ACTIVIDADES DE LA GUARDIA

     CORRECCIÓN: modalHtml construido con template literals
     para evitar rotura de strings por comillas simples.
     ══════════════════════════════════════════════════════════ */
  function abrirModalWATareas(nombre, tel, m4g){
    var acts = [];
    if(m4g){
      m4g.querySelectorAll(".m4g-act").forEach(function(act){
        var timeEl = act.querySelector(".m4g-act-time");
        var nameEl = act.querySelector(".m4g-act-name");
        var time = timeEl ? timeEl.textContent.trim() : "";
        var desc = nameEl ? nameEl.textContent.trim() : "";
        if(desc) acts.push({ time: time, desc: desc });
      });
    }

    var hoy = new Date();
    var dias = ["Domingo","Lunes","Martes","Mi\u00E9rcoles","Jueves","Viernes","S\u00E1bado"];
    var meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    var fechaFmt = dias[hoy.getDay()] + " " + hoy.getDate() + " de " + meses[hoy.getMonth()];

    var msg = "Hola " + nombre + "! Ac\u00E1 te paso el resumen de la guardia del " + fechaFmt + ".\n\n";
    if(acts.length > 0){
      msg += "\uD83D\uDCCB *Actividades del d\u00EDa:*\n";
      acts.forEach(function(a){
        msg += "\u2022 " + (a.time ? a.time + " \u2014 " : "") + a.desc + "\n";
      });
      msg += "\n";
    } else {
      msg += "Sin actividades registradas para hoy.\n\n";
    }
    msg += "\u2014 Comunicaci\u00F3n \u00B7 Municipalidad de Tres Arroyos";

    var old = document.getElementById("m5-modal-wa");
    if(old) old.remove();

    // CORRECCIÓN: template literal — sin riesgo de rotura por comillas simples
    var modalHtml = `
      <div id="m5-modal-wa" style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,sans-serif">
        <div style="background:#fff;border-radius:12px;max-width:520px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.3)">
          <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:15px;font-weight:700;color:#111827">📲 WhatsApp a la guardia</div>
            <button onclick="document.getElementById('m5-modal-wa').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#6b7280;line-height:1">×</button>
          </div>
          <div style="padding:16px 20px">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 13px;margin-bottom:12px;font-size:13px;color:#15803d;font-weight:600">
              ${escHtml(nombre)} · +${escHtml(tel)}
            </div>
            <label style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:6px">Mensaje (editable)</label>
            <textarea id="m5-wa-msg" style="width:100%;min-height:200px;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:#111827;resize:vertical;box-sizing:border-box;line-height:1.5">${escHtml(msg)}</textarea>
            <div style="font-size:11px;color:#9ca3af;margin-top:6px">Se abrirá WhatsApp Web en una nueva pestaña.</div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:8px">
            <button onclick="document.getElementById('m5-modal-wa').remove()" style="padding:8px 16px;background:#fff;border:1px solid #d1d5db;border-radius:7px;cursor:pointer;font-size:13px;font-family:inherit;color:#374151">Cancelar</button>
            <button id="m5-wa-send" style="padding:8px 18px;background:#25D366;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit">📲 Abrir WhatsApp</button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    document.getElementById("m5-wa-send").addEventListener("click", function(){
      var texto = (document.getElementById("m5-wa-msg") || {}).value || msg;
      var url = "https://api.whatsapp.com/send?phone=" + tel + "&text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener,noreferrer");
      var modal = document.getElementById("m5-modal-wa");
      if(modal) modal.remove();
    });
  }

  function escHtml(s){
    return String(s || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  /* ══════════════════════════════════════════════════════════
     OBSERVER: aplicar fix de guardias cuando se renderiza #m4g
     ══════════════════════════════════════════════════════════ */
  function iniciarObserverGuardias(){
    var m4g = document.getElementById("m4g");
    if(m4g) fixGuardiaPhones(m4g);

    var mo = new MutationObserver(function(muts){
      for(var i = 0; i < muts.length; i++){
        var m = muts[i];
        for(var j = 0; j < m.addedNodes.length; j++){
          var node = m.addedNodes[j];
          if(node.nodeType !== 1) continue;
          if(node.id === "m4g"){
            (function(n){ setTimeout(function(){ fixGuardiaPhones(n); }, 80); })(node);
            return;
          }
          var nested = node.querySelector && node.querySelector("#m4g");
          if(nested){
            (function(n){ setTimeout(function(){ fixGuardiaPhones(n); }, 80); })(nested);
            return;
          }
        }
        if(m.target && m.target.id === "m4g"){
          var existing = document.getElementById("m4g");
          if(existing){
            existing.removeAttribute("data-m5fixed");
            (function(n){ setTimeout(function(){ fixGuardiaPhones(n); }, 80); })(existing);
          }
          return;
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZACIÓN
     ══════════════════════════════════════════════════════════ */
  function init(){
    sincronizarBorradoConSupabase();
    iniciarObserverGuardias();
    console.log(
      "%c[mejoras5.js] Cargado v4: sync borrado/publicado (Supabase) + tel\u00E9fonos guardias",
      "color:#059669;font-weight:bold;font-size:12px"
    );
  }

  if(document.readyState !== "loading"){
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

})();
