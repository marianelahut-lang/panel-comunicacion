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
   3. Para "marcar como publicado", usar el mismo approach
   ══════════════════════════════════════════════════════════ */

var _m5SyncBorradoActivo = false;

function sincronizarBorradoConSupabase(){
  if(_m5SyncBorradoActivo) return;
  _m5SyncBorradoActivo = true;

  // Event delegation en capture phase — interceptamos ANTES del onclick
  document.addEventListener("click", function(e){
    var btn = e.target;
    if(!btn) return;
    
    // Buscar botón con onclick que llame a _apBorrar
    var oc = btn.getAttribute && btn.getAttribute("onclick");
    if(!oc && btn.closest){
      var parent = btn.closest("[onclick*='_apBorrar']");
      if(parent) { btn = parent; oc = parent.getAttribute("onclick"); }
    }
    
    if(!oc || !oc.includes("_apBorrar")) return;
    
    // Extraer el ID de la publicación del onclick
    var match = oc.match(/_apBorrar\(\s*['"](.*?)['"]\s*\)/);
    if(!match || !match[1]) return;
    
    var pubId = match[1];
    
    // Registrar que se está borrando este ID
    // La confirmación la maneja _apBorrar internamente,
    // así que escuchamos DESPUÉS con un pequeño delay
    setTimeout(function(){
      // Verificar si el elemento ya no está en el DOM 
      // (señal de que el usuario confirmó el borrado)
      var stillExists = document.querySelector('[onclick*="' + pubId + '"]');
      if(stillExists) return; // el usuario canceló o no se borró
      
      // El elemento se fue del DOM → se borró. Sincronizar con Supabase
      try {
        if(!window.db || typeof window.db.from !== "function") return;
        window.db.from("publicaciones")
          .delete()
          .eq("id", pubId)
          .then(function(res){
            if(res.error){
              console.warn("[mejoras5] Error al borrar de Supabase:", res.error.message);
            } else {
              console.log("[mejoras5] ✓ Publicación borrada de Supabase:", pubId);
            }
          })
          .catch(function(err){
            console.warn("[mejoras5] Error Supabase delete:", err);
          });
      } catch(e){
        console.warn("[mejoras5] Error en sync borrado:", e);
      }
    }, 600); // delay para que _apBorrar termine su confirm + render
    
  }, true); // capture: true → ejecuta ANTES del onclick del botón

  // Interceptar también "marcar como publicado" (_apMarcarPublicado)
  document.addEventListener("click", function(e){
    var btn = e.target;
    if(!btn) return;
    
    var oc = btn.getAttribute && btn.getAttribute("onclick");
    if(!oc && btn.closest){
      var parent = btn.closest("[onclick*='_apMarcarPublicado']");
      if(parent) { btn = parent; oc = parent.getAttribute("onclick"); }
    }
    
    if(!oc || !oc.includes("_apMarcarPublicado")) return;
    
    var match = oc.match(/_apMarcarPublicado\(\s*['"](.*?)['"]\s*\)/);
    if(!match || !match[1]) return;
    var pubId = match[1];
    
    // Sincronizar estado a Supabase después de un breve delay
    setTimeout(function(){
      try {
        if(!window.db || typeof window.db.from !== "function") return;
        window.db.from("publicaciones")
          .update({ estado: "Publicado" })
          .eq("id", pubId)
          .then(function(res){
            if(res.error){
              console.warn("[mejoras5] Error al actualizar estado en Supabase:", res.error.message);
            } else {
              console.log("[mejoras5] ✓ Estado actualizado en Supabase:", pubId, "→ Publicado");
            }
          })
          .catch(function(err){
            console.warn("[mejoras5] Error Supabase update:", err);
          });
      } catch(e){
        console.warn("[mejoras5] Error en sync estado publicado:", e);
      }
    }, 500);
    
  }, true);

  console.log("[mejoras5] ✓ Interceptor de borrado/publicado activo");
}

/* ══════════════════════════════════════════════════════════
   FIX 2 — GUARDIAS: MOSTRAR TELÉFONOS (reemplaza "Sin tel.")
   ══════════════════════════════════════════════════════════ */

function fixGuardiaPhones(m4g){
  if(!m4g) m4g = document.getElementById("m4g");
  if(!m4g) return;
  if(m4g.getAttribute("data-m5fixed") === "1") return;
  if(typeof window._tdGetTel !== "function") return;

  // 1. Tarjetas de la semana
  m4g.querySelectorAll(".m4g-card .m4g-wa-dis, .m4g-card .m4g-add-phone").forEach(function(el){
    var card = el.closest(".m4g-card");
    if(!card) return;
    var nameEl = card.querySelector(".m4g-cname");
    var name = nameEl ? nameEl.textContent.trim() : "";
    if(!name) return;
    var tel = window._tdGetTel(name);
    if(!tel) return;
    var oc = card.getAttribute("onclick") || "";
    var dateMatch = oc.match(/['"]([\d]{4}-[\d]{2}-[\d]{2})['"]/);
    var dateStr = dateMatch ? dateMatch[1] : "";
    var msg = encodeURIComponent("Guardia " + dateStr + " — " + name);
    var waUrl = "https://api.whatsapp.com/send?phone=" + tel + "&text=" + msg;
    var link = document.createElement("a");
    link.className = "m4g-wa";
    link.href = waUrl;
    link.target = "_blank";
    link.textContent = "💬 WhatsApp";
    link.onclick = function(e){ e.stopPropagation(); };
    el.parentNode.replaceChild(link, el);
  });

  // 2. Botón principal en el detalle
  var waBtn = m4g.querySelector(".m4g-wa-big[disabled], .m4g-wa-big:disabled");
  if(waBtn){
    var agentName = m4g.querySelector(".m4g-agent-name");
    var name = agentName ? agentName.textContent.trim() : "";
    if(name){
      var tel = window._tdGetTel(name);
      if(tel){
        var newBtn = document.createElement("button");
        newBtn.className = "m4g-wa-big";
        newBtn.textContent = "💬 Enviar WhatsApp";
        newBtn.onclick = function(){
          abrirModalWATareas(name, tel, m4g);
        };
        waBtn.parentNode.replaceChild(newBtn, waBtn);
      }
    }
  }

  // 3. Sidebar del agente
  var agentWaDis = m4g.querySelector(".m4g-agent-card .m4g-wa-dis, .m4g-agent-card .m4g-add-phone");
  if(agentWaDis){
    var agentName = m4g.querySelector(".m4g-agent-name");
    var name = agentName ? agentName.textContent.trim() : "";
    if(name){
      var tel = window._tdGetTel(name);
      if(tel){
        var link = document.createElement("a");
        link.className = "m4g-wa";
        link.href = "https://api.whatsapp.com/send?phone=" + tel;
        link.target = "_blank";
        link.textContent = "💬 WhatsApp";
        agentWaDis.parentNode.replaceChild(link, agentWaDis);
      }
    }
  }

  m4g.setAttribute("data-m5fixed", "1");
}

/* ══════════════════════════════════════════════════════════
   FEAT — MODAL WHATSAPP CON ACTIVIDADES DE LA GUARDIA
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
  var dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  var meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  var fechaFmt = dias[hoy.getDay()] + " " + hoy.getDate() + " de " + meses[hoy.getMonth()];

  var msg = "Hola " + nombre + "! Acá te paso el resumen de la guardia del " + fechaFmt + ".\n\n";
  if(acts.length > 0){
    msg += "📋 *Actividades del día:*\n";
    acts.forEach(function(a){
      msg += "• " + (a.time ? a.time + " — " : "") + a.desc + "\n";
    });
    msg += "\n";
  } else {
    msg += "Sin actividades registradas para hoy.\n\n";
  }
  msg += "— Comunicación · Municipalidad de Tres Arroyos";

  var old = document.getElementById("m5-modal-wa");
  if(old) old.remove();

  var modalHtml =
    '<div id="m5-modal-wa" style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,sans-serif">' +
    '<div style="background:#fff;border-radius:12px;max-width:520px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.3)">' +
    '<div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center">' +
    '<div style="font-size:15px;font-weight:700;color:#111827">📲 WhatsApp a la guardia</div>' +
    '<button onclick="document.getElementById('m5-modal-wa').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#6b7280;line-height:1">×</button>' +
    '</div>' +
    '<div style="padding:16px 20px">' +
    '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 13px;margin-bottom:12px;font-size:13px;color:#15803d;font-weight:600">' +
    nombre + ' · +' + tel +
    '</div>' +
    '<label style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:6px">Mensaje (editable)</label>' +
    '<textarea id="m5-wa-msg" style="width:100%;min-height:200px;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:#111827;resize:vertical;box-sizing:border-box;line-height:1.5">' + escHtml(msg) + '</textarea>' +
    '<div style="font-size:11px;color:#9ca3af;margin-top:6px">Se abrirá WhatsApp Web en una nueva pestaña.</div>' +
    '</div>' +
    '<div style="padding:12px 20px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:8px">' +
    '<button onclick="document.getElementById('m5-modal-wa').remove()" style="padding:8px 16px;background:#fff;border:1px solid #d1d5db;border-radius:7px;cursor:pointer;font-size:13px;font-family:inherit;color:#374151">Cancelar</button>' +
    '<button id="m5-wa-send" style="padding:8px 18px;background:#25D366;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit">📲 Abrir WhatsApp</button>' +
    '</div>' +
    '</div>' +
    '</div>';

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  document.getElementById("m5-wa-send").addEventListener("click", function(){
    var texto = (document.getElementById("m5-wa-msg") || {}).value || msg;
    var url = "https://api.whatsapp.com/send?phone=" + tel + "&text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener,noreferrer");
    document.getElementById("m5-modal-wa")?.remove();
  });
}

function escHtml(s){
  return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
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
  console.log("%c[mejoras5.js] Cargado: sync borrado publicaciones (Supabase) + teléfonos guardias",
    "color:#059669;font-weight:bold;font-size:12px");
}

if(document.readyState !== "loading"){
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

})();
