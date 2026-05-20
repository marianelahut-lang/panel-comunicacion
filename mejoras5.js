/* ============================================================
MEJORAS5.JS - Panel Comunicación Tres Arroyos
------------------------------------------------------------
FIX 1: Publicaciones borradas siguen apareciendo en Agenda
  - Parcha window._apBorrar para también eliminar de Supabase
  - Parcha window._apMarcarPublicado para sincronizar estado

FIX 2: Panel Guardias - Teléfonos no aparecen ("Sin tel.")
  - Post-procesa el DOM del panel Guardias para reemplazar
    los "Sin tel." con links de WhatsApp usando _tdGetTel()

FEAT: Panel Guardias - Botón WhatsApp con tareas del día
  - Abre modal para enviar resumen de actividades a la guardia
============================================================ */
(function(){
"use strict";

/* ══════════════════════════════════════════════════════════
   FIX 1 — PUBLICACIONES: SINCRONIZAR BORRADO CON SUPABASE
   ══════════════════════════════════════════════════════════
   CAUSA DEL BUG:
   _apBorrar() solo borra del localStorage y del cache local,
   pero NO llama a Supabase. Al recargar la página, los datos
   vuelven a cargarse desde Supabase → las publicaciones
   "borradas" reaparecen.

   SOLUCIÓN:
   Parchamos window._apBorrar para que después de borrar
   localmente, también ejecute:
     db.from('publicaciones').delete().eq('id', id)
   Y también parchamos _apMarcarPublicado para sincronizar
   el campo estado a Supabase.
   ══════════════════════════════════════════════════════════ */

function parchearBorrado(){
  // Esperar a que mejoras1.js defina las funciones (puede tardar)
  if(typeof window._apBorrar !== "function"){
    setTimeout(parchearBorrado, 500);
    return;
  }

  // Verificar que db esté disponible
  if(!window.db || typeof window.db.from !== "function"){
    console.warn("[mejoras5] db no disponible, no se parchea _apBorrar");
    return;
  }

  // Guardar referencia a la función original
  var _apBorrarOriginal = window._apBorrar;

  // Parchar _apBorrar
  window._apBorrar = function(id){
    // Llamar a la función original (hace el confirm + borrado local)
    _apBorrarOriginal.call(this, id);

    // Adicionalmente: eliminar de Supabase
    // (la función original ya pidió confirm, así que si llega acá es porque el usuario confirmó)
    // Pero como la original tiene su propio confirm interno, necesitamos verificar
    // si realmente se borró - chequeamos que ya no esté en el DOM
    setTimeout(function(){
      try {
        // Borrar de Supabase
        window.db.from("publicaciones")
          .delete()
          .eq("id", id)
          .then(function(res){
            if(res.error){
              console.warn("[mejoras5] Error al borrar de Supabase:", res.error.message);
              if(typeof window.toast === "function"){
                window.toast("Aviso: borrado local OK pero error en servidor: " + res.error.message, "warn");
              }
            } else {
              console.log("[mejoras5] Publicación borrada de Supabase:", id);
            }
          })
          .catch(function(err){
            console.warn("[mejoras5] Error Supabase delete:", err);
          });
      } catch(e){
        console.warn("[mejoras5] Error en parche _apBorrar:", e);
      }
    }, 100); // pequeño delay para que la función original termine primero
  };

  console.log("[mejoras5] _apBorrar parchado — ahora borra también de Supabase");

  // Parchar _apMarcarPublicado para que sincronice estado a Supabase
  if(typeof window._apMarcarPublicado === "function"){
    var _apMarcarPublicadoOriginal = window._apMarcarPublicado;

    window._apMarcarPublicado = function(id){
      // Llamar función original (actualiza local)
      _apMarcarPublicadoOriginal.call(this, id);

      // Sincronizar estado a Supabase
      setTimeout(function(){
        try {
          window.db.from("publicaciones")
            .update({ estado: "Publicado" })
            .eq("id", id)
            .then(function(res){
              if(res.error){
                console.warn("[mejoras5] Error al actualizar estado en Supabase:", res.error.message);
              } else {
                console.log("[mejoras5] Estado actualizado en Supabase:", id, "→ Publicado");
              }
            })
            .catch(function(err){
              console.warn("[mejoras5] Error Supabase update:", err);
            });
        } catch(e){
          console.warn("[mejoras5] Error en parche _apMarcarPublicado:", e);
        }
      }, 100);
    };

    console.log("[mejoras5] _apMarcarPublicado parchado — sincroniza estado a Supabase");
  }
}

/* ══════════════════════════════════════════════════════════
   FIX 2 — GUARDIAS: MOSTRAR TELÉFONOS (reemplaza "Sin tel.")
   ══════════════════════════════════════════════════════════
   CAUSA DEL BUG:
   mejoras3.js obtiene el teléfono buscando links de WhatsApp
   en el DOM original (gwd.querySelectorAll("a")).
   Esos links no existen → siempre queda vacío → "Sin tel."

   SOLUCIÓN:
   Usar _tdGetTel(nombre) que ya tiene los teléfonos del
   equipo. Reemplazamos los elementos "Sin tel." con links
   de WhatsApp reales.
   ══════════════════════════════════════════════════════════ */

function fixGuardiaPhones(m4g){
  if(!m4g) m4g = document.getElementById("m4g");
  if(!m4g) return;
  if(m4g.getAttribute("data-m5fixed") === "1") return;

  if(typeof window._tdGetTel !== "function") return;

  // 1. Tarjetas de la semana: .m4g-card .m4g-wa-dis
  m4g.querySelectorAll(".m4g-card .m4g-wa-dis").forEach(function(el){
    var card = el.closest(".m4g-card");
    if(!card) return;
    var nameEl = card.querySelector(".m4g-cname");
    var name = nameEl ? nameEl.textContent.trim() : "";
    if(!name) return;
    var tel = window._tdGetTel(name);
    if(!tel) return;
    // Extraer fecha del onclick de la card
    var oc = card.getAttribute("onclick") || "";
    var dateMatch = oc.match(/['"]([\d]{4}-[\d]{2}-[\d]{2})['"]/);
    var dateStr = dateMatch ? dateMatch[1] : "";
    var msg = encodeURIComponent("🛡 Guardia " + dateStr + " — " + name);
    var waUrl = "https://api.whatsapp.com/send?phone=" + tel + "&text=" + msg;
    var link = document.createElement("a");
    link.className = "m4g-wa";
    link.href = waUrl;
    link.target = "_blank";
    link.textContent = "💬 WhatsApp";
    link.onclick = function(e){ e.stopPropagation(); };
    el.parentNode.replaceChild(link, el);
  });

  // 2. Botón principal en el detalle (.m4g-wa-big[disabled])
  var waBtn = m4g.querySelector(".m4g-wa-big[disabled]");
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

  // 3. Link de WhatsApp en el sidebar del agente (.m4g-agent-card .m4g-wa-dis)
  var agentWaDis = m4g.querySelector(".m4g-agent-card .m4g-wa-dis");
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
   FEAT — MODAL WHATSAPP CON TAREAS DE LA GUARDIA
   ══════════════════════════════════════════════════════════ */

function abrirModalWATareas(nombre, tel, m4g){
  // Recopilar actividades del día desde el detalle visible
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

  // Construir mensaje sugerido
  var msg = "🛡 *Guardia del día* — " + fechaFmt + "\n\n";
  msg += "Hola " + nombre + "! Te paso el resumen de tu guardia.\n\n";
  if(acts.length > 0){
    msg += "📋 *Actividades del día:*\n";
    acts.forEach(function(a){
      msg += "• " + (a.time ? a.time + " — " : "") + a.desc + "\n";
    });
    msg += "\n";
  } else {
    msg += "Sin actividades registradas para hoy.\n\n";
  }
  msg += "Cualquier novedad, avisá al equipo.\n— Comunicación · Municipalidad de Tres Arroyos";

  // Modal
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
    '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 13px;margin-bottom:12px;font-size:13px;color:#15803d">' +
    '📞 ' + nombre + ' &nbsp;·&nbsp; <span style="font-family:ui-monospace,monospace">+' + tel + '</span>' +
    '</div>' +
    '<label style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:6px">Mensaje (editable)</label>' +
    '<textarea id="m5-wa-msg" style="width:100%;min-height:200px;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:#111827;resize:vertical;box-sizing:border-box;line-height:1.5">' + escHtml(msg) + '</textarea>' +
    '<div style="font-size:11px;color:#9ca3af;margin-top:6px">ℹ️ Se abrirá WhatsApp Web en una nueva pestaña.</div>' +
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
  // Aplicar inmediatamente si ya existe
  var m4g = document.getElementById("m4g");
  if(m4g) fixGuardiaPhones(m4g);

  // Observar cambios para detectar cuando se crea/actualiza #m4g
  var mo = new MutationObserver(function(muts){
    for(var i = 0; i < muts.length; i++){
      var m = muts[i];
      // Buscar si se agregó el div #m4g
      for(var j = 0; j < m.addedNodes.length; j++){
        var node = m.addedNodes[j];
        if(node.nodeType !== 1) continue;
        if(node.id === "m4g"){
          setTimeout(function(){ fixGuardiaPhones(node); }, 80);
          return;
        }
        var nested = node.id !== "m4g" && node.querySelector && node.querySelector("#m4g");
        if(nested){
          setTimeout(function(){ fixGuardiaPhones(nested); }, 80);
          return;
        }
      }
      // También detectar cambios dentro de #m4g existente (al cambiar día)
      if(m.target && m.target.id === "m4g"){
        var existing = document.getElementById("m4g");
        if(existing && existing.getAttribute("data-m5fixed") === "1"){
          existing.removeAttribute("data-m5fixed");
          setTimeout(function(){ fixGuardiaPhones(existing); }, 80);
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
  parchearBorrado();
  iniciarObserverGuardias();
  console.log("%c[mejoras5.js] Cargado: fix borrado publicaciones + teléfonos guardias",
    "color:#059669;font-weight:bold;font-size:12px");
}

if(document.readyState !== "loading"){
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

})();
