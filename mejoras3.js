/* ============================================================
MEJORAS3.JS - Panel Comunicación Tres Arroyos v4.0
Prompts 1-5: HOY separado / Calendario / Guardia / WhatsApp / Visual
============================================================
IMPORTANTE: Solo agrega CSS/comportamiento visual.
NO modifica datos, funcionarios, reclamos, sincronización ni BD.
============================================================ */
(function(){
"use strict";

/* ========================================================
CSS GENERAL (Prompt 5 - Mejora Visual)
======================================================== */
var CSS_M3 = "m3-css-main";
function inyectarCSS(){
if(document.getElementById(CSS_M3)) return;
var css = [
"/* HOY SEPARADO */",
"#m3-hoy-wrapper{display:flex;flex-direction:column;gap:16px;padding:16px 0}",
"#m3-hoy-wrapper .m3-section-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;margin:0 0 8px 0;padding-bottom:6px;border-bottom:1px solid #e5e7eb}",
"body.dark #m3-hoy-wrapper .m3-section-title{color:#9ca3af;border-color:#374151}",
"/* CARD BASE */",
".m3-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:12px}",
"body.dark .m3-card{background:#1f2937;border-color:#374151}",
"/* GRID HOY */",
".m3-hoy-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}",
"@media(max-width:900px){.m3-hoy-grid{grid-template-columns:1fr}}",
"/* TIMELINE */",
".m3-timeline-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px}",
"body.dark .m3-timeline-item{border-color:#374151}",
".m3-timeline-item:last-child{border-bottom:none}",
".m3-timeline-hora{font-size:12px;font-weight:700;color:#6366f1;min-width:42px;padding-top:1px}",
".m3-timeline-tipo-badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;padding:2px 6px;border-radius:20px;min-width:60px;justify-content:center;margin-top:1px}",
".m3-badge-evento{background:#dbeafe;color:#1d4ed8}",
".m3-badge-pub{background:#d1fae5;color:#065f46}",
".m3-badge-cobertura{background:#fef3c7;color:#92400e}",
".m3-badge-radio{background:#ede9fe;color:#5b21b6}",
"body.dark .m3-badge-evento{background:#1e3a5f;color:#93c5fd}",
"body.dark .m3-badge-pub{background:#064e3b;color:#6ee7b7}",
"body.dark .m3-badge-cobertura{background:#451a03;color:#fde68a}",
"body.dark .m3-badge-radio{background:#2e1065;color:#c4b5fd}",
".m3-timeline-texto{flex:1;font-size:13px;line-height:1.4;color:#111827}",
"body.dark .m3-timeline-texto{color:#e5e7eb}",
".m3-empty{text-align:center;color:#9ca3af;font-size:13px;padding:20px 0}",
"/* TABLERO SEPARADO */",
"#p-tablero::before{content:'TABLERO DE TAREAS';display:block;font-size:11px;font-weight:700;letter-spacing:.1em;color:#6b7280;padding:12px 0 4px 0;border-top:2px solid #e5e7eb;margin-bottom:4px}",
"body.dark #p-tablero::before{color:#9ca3af;border-color:#374151}",
"/* GUARDIA REDISEÑO */",
"#m3-guardia-panel{display:flex;flex-direction:column;gap:14px;margin-top:20px}",
".m3-guardia-header{display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:12px;color:#fff}",
".m3-guardia-fecha{font-size:18px;font-weight:700}",
".m3-guardia-fecha-sub{font-size:12px;opacity:.85;margin-top:1px}",
".m3-agentes-row{display:flex;gap:10px;flex-wrap:wrap}",
".m3-agente-card{flex:1;min-width:200px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;box-shadow:0 1px 3px rgba(0,0,0,.06)}",
"body.dark .m3-agente-card{background:#1f2937;border-color:#374151}",
".m3-agente-role{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}",
".m3-role-titular{color:#6366f1}",
".m3-role-soporte{color:#10b981}",
".m3-agente-nombre{font-size:15px;font-weight:700;color:#111827;margin-bottom:2px}",
"body.dark .m3-agente-nombre{color:#f9fafb}",
".m3-agente-horario{font-size:12px;color:#6b7280;margin-bottom:8px}",
".m3-btn-wa{display:flex;align-items:center;justify-content:center;gap:6px;background:#25d366;color:#fff;border:none;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;width:100%;transition:background .15s,transform .1s}",
".m3-btn-wa:hover{background:#1da851;transform:translateY(-1px)}",
".m3-guardia-actividades{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;box-shadow:0 1px 3px rgba(0,0,0,.06)}",
"body.dark .m3-guardia-actividades{background:#1f2937;border-color:#374151}",
".m3-section-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;margin:0 0 8px 0;padding-bottom:6px;border-bottom:1px solid #e5e7eb}",
"body.dark .m3-section-title{color:#9ca3af;border-color:#374151}",
".m3-guardia-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid #f3f4f6;font-size:13px}",
"body.dark .m3-guardia-item{border-color:#374151}",
".m3-guardia-item:last-child{border-bottom:none}",
".m3-guardia-hora{font-size:13px;font-weight:700;color:#6366f1;min-width:44px}",
".m3-guardia-titulo{font-size:13px;font-weight:600;color:#111827;margin-bottom:2px;line-height:1.3}",
"body.dark .m3-guardia-titulo{color:#f9fafb}",
".m3-empty-state{text-align:center;padding:24px 16px;color:#9ca3af;font-size:13px}",
"/* TOAST */",
"#m3-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(60px);background:#1f2937;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;z-index:99999;transition:transform .25s ease;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.3)}",
"#m3-toast.show{transform:translateX(-50%) translateY(0)}",
"/* VISUAL GENERAL (Prompt 5) */",
".content{padding:16px 20px!important}",
"@media(max-width:768px){.content{padding:12px 12px!important}}"
].join("\n");
var st = document.createElement("style");
st.id = CSS_M3;
st.textContent = css;
document.head.appendChild(st);
}

/* TOAST */
function m3Toast(msg){
var t = document.getElementById("m3-toast");
if(!t){ t = document.createElement("div"); t.id = "m3-toast"; document.body.appendChild(t); }
t.textContent = msg;
t.classList.add("show");
setTimeout(function(){ t.classList.remove("show"); }, 2500);
}

/* ========================================================
PROMPT 1 — PANEL HOY SEPARADO DEL TABLERO
Muestra: actividades del día, eventos, publicaciones, coberturas
======================================================== */
function construirPanelHoy(){
var panelHoy = document.getElementById("p-hoy");
if(!panelHoy) return;
if(document.getElementById("m3-hoy-wrapper")) return;
var hoy = new Date();
var yyyy = hoy.getFullYear();
var mm = String(hoy.getMonth()+1).padStart(2,"0");
var dd = String(hoy.getDate()).padStart(2,"0");
var fechaHoy = yyyy+"-"+mm+"-"+dd;
var items = [];
// 1. Coberturas (guardOverrides localStorage)
try {
  var gd = JSON.parse(localStorage.getItem("guardOverrides")||"{}");
  if(gd[fechaHoy] && gd[fechaHoy].coberturas){
    gd[fechaHoy].coberturas.forEach(function(c){
      items.push({ hora: c.hora||"", tipo: c.tipo||"cobertura", texto: c.titulo||c.text||"Cobertura" });
    });
  }
} catch(e){}
// 2. Publicaciones del DOM
try {
  document.querySelectorAll("[data-pub-fecha=\""+fechaHoy+"\"], .ap-item[data-fecha=\""+fechaHoy+"\"]").forEach(function(el){
    var hora = el.dataset.hora||el.dataset.pubHora||"";
    var txt = (el.querySelector(".ap-titulo,.pub-titulo")||{}).textContent||el.textContent.trim().substring(0,70);
    if(txt.trim()) items.push({ hora:hora, tipo:"pub", texto:txt.trim().substring(0,80) });
  });
} catch(e){}
// 3. Eventos del calendario del DOM
try {
  document.querySelectorAll("[data-cal-date=\""+fechaHoy+"\"] .cal-event,.cal-event[data-date=\""+fechaHoy+"\"]").forEach(function(el){
    var hora = el.dataset.hora||(el.querySelector(".cal-hora")||{}).textContent||"";
    var txt = ((el.querySelector(".cal-titulo,.cal-text")||{}).textContent||el.textContent).trim().substring(0,80);
    if(txt) items.push({ hora:hora, tipo:"evento", texto:txt });
  });
} catch(e){}
items.sort(function(a,b){ return parseInt((a.hora||"").replace(":",""))-parseInt((b.hora||"").replace(":",""));});
var DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var ft = DIAS[hoy.getDay()]+", "+hoy.getDate()+" de "+MESES[hoy.getMonth()]+" de "+yyyy;
var html = "<div id='m3-hoy-wrapper'>";
html += "<div class='m3-section-title'>📅 HOY — "+ft+"</div>";
html += "<div class='m3-card'>";
html += "<div class='m3-section-title'>📋 Actividades del Día</div>";
if(items.length === 0){
  html += "<div class='m3-empty'>Sin actividades cargadas para hoy</div>";
} else {
  items.forEach(function(item){
    var bc = item.tipo==="evento"?"m3-badge-evento":(item.tipo==="pub"?"m3-badge-pub":(item.tipo==="radio"?"m3-badge-radio":"m3-badge-cobertura"));
    var bi = item.tipo==="evento"?"🗓":(item.tipo==="pub"?"📢":(item.tipo==="radio"?"📻":"📷"));
    var bl = item.tipo==="evento"?"Evento":(item.tipo==="pub"?"Pub.":(item.tipo==="radio"?"Radio":"Cob."));
    html += "<div class='m3-timeline-item'>";
    html += "<span class='m3-timeline-hora'>"+(item.hora||"--:--")+"</span>";
    html += "<span class='m3-timeline-tipo-badge "+bc+"'>"+ bi+" "+bl+"</span>";
    html += "<span class='m3-timeline-texto'>"+item.texto+"</span>";
    html += "</div>";
  });
}
html += "</div></div>";
panelHoy.insertAdjacentHTML("afterbegin", html);
}

/* ========================================================
PROMPT 2 — FIX CALENDARIO
======================================================== */
function fixCalendario(){
var cal = document.getElementById("p-calendario");
if(!cal) return;
var obs = new MutationObserver(function(muts){
  muts.forEach(function(m){
    if(m.attributeName==="style"||m.attributeName==="class"){
      if(cal.style.display!=="none"&&cal.offsetParent) setTimeout(renderAgendaCal,150);
    }
  });
});
obs.observe(cal,{attributes:true});
document.querySelectorAll("[data-tab='calendario'],[onclick*='calendario']").forEach(function(b){
  b.addEventListener("click",function(){ setTimeout(renderAgendaCal,300); });
});
}
function renderAgendaCal(){
var cc = document.getElementById("cal-day-content");
if(!cc) return;
cc.style.display="none";
requestAnimationFrame(function(){
  cc.style.display="";
  var sc = document.getElementById("calwscroll");
  if(sc){ var h=new Date().getHours(); sc.scrollTop=Math.max(0,(h-1)*60); }
});
}

/* ========================================================
PROMPT 3 — PANEL DE GUARDIA REDISEÑADO (desde 15hs)
======================================================== */
function redisenarGuardia(){
var gpanel = document.getElementById("p-guardias");
if(!gpanel||document.getElementById("m3-guardia-panel")) return;
var hoy = new Date();
var DIAS=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var ft=DIAS[hoy.getDay()]+" "+hoy.getDate()+" de "+MESES[hoy.getMonth()];
var yyyy=hoy.getFullYear();
var mm=String(hoy.getMonth()+1).padStart(2,"0");
var dd=String(hoy.getDate()).padStart(2,"0");
var fk=yyyy+"-"+mm+"-"+dd;
var agentes=[];
var acts=[];
// Detectar agentes del día del DOM existente
var gdc=document.getElementById("guard-day-content");
if(gdc){
  gdc.querySelectorAll("[class*='titular']").forEach(function(el){ if(el.textContent.trim()) agentes.push({rol:"Titular",nombre:el.textContent.trim(),color:"m3-role-titular"}); });
  gdc.querySelectorAll("[class*='soporte']").forEach(function(el){ if(el.textContent.trim()) agentes.push({rol:"Soporte",nombre:el.textContent.trim(),color:"m3-role-soporte"}); });
  gdc.querySelectorAll("[class*='gcob'],[class*='cobertura']").forEach(function(el){
    var horaEl=el.querySelector("[class*='hora']");
    var hora=horaEl?horaEl.textContent.trim():"";
    var hn=parseInt((hora.replace(":","").replace("hs","").replace("h","").trim()||"0"));
    if(hn>=1500){
      var tEl=el.querySelector("[class*='titulo'],[class*='text']");
      var txt=tEl?tEl.textContent.trim():el.textContent.trim().substring(0,60);
      if(txt) acts.push({hora:hora,tipo:"cobertura",titulo:txt});
    }
  });
}
// Coberturas desde localStorage (desde 15hs)
try{
  var gd=JSON.parse(localStorage.getItem("guardOverrides")||"{}");
  if(gd[fk]&&gd[fk].coberturas) gd[fk].coberturas.forEach(function(c){
    var hn=parseInt((c.hora||"").replace(":",""));
    if(hn>=1500){
      var exists=acts.some(function(a){ return a.titulo===(c.titulo||c.text); });
      if(!exists) acts.push({hora:c.hora||"",tipo:c.tipo||"cobertura",titulo:c.titulo||c.text||"Cobertura"});
    }
  });
}catch(e){}
acts.sort(function(a,b){ return parseInt((a.hora||"").replace(":",""))-parseInt((b.hora||"").replace(":",""));});
// Deduplicar agentes
var nombresVistos={};
agentes=agentes.filter(function(a){ if(nombresVistos[a.nombre]) return false; nombresVistos[a.nombre]=true; return true; });
var html="<div id='m3-guardia-panel'>";
html+="<div class='m3-guardia-header'><div><div class='m3-guardia-fecha'>🛡️ Guardia del Día</div><div class='m3-guardia-fecha-sub'>"+ft+" · Actividades desde las 15:00 hs</div></div></div>";
if(agentes.length>0){
  html+="<div class='m3-agentes-row'>";
  agentes.forEach(function(ag){
    html+="<div class='m3-agente-card'>";
    html+="<div class='m3-agente-role "+ag.color+"'>" +ag.rol+"</div>";
    html+="<div class='m3-agente-nombre'>"+ ag.nombre+"</div>";
    html+="<div class='m3-agente-horario'>Horario: 15:00 — 23:59 hs</div>";
    html+="<button class='m3-btn-wa' data-agente='"+ag.nombre+"' onclick='m3EnviarWA(this)'>📱 WhatsApp</button>";
    html+="</div>";
  });
  html+="</div>";
}
html+="<div class='m3-guardia-actividades'>";
html+="<div class='m3-section-title'>📋 Actividades desde las 15:00 hs</div>";
if(acts.length===0){
  html+="<div class='m3-empty-state'>Sin actividades de guardia cargadas para hoy</div>";
} else {
  acts.forEach(function(act){
    var ic=act.tipo==="pub"?"📢":(act.tipo==="radio"?"📻":"📷");
    var bc=act.tipo==="pub"?"m3-badge-pub":(act.tipo==="radio"?"m3-badge-radio":"m3-badge-cobertura");
    var bl=act.tipo==="pub"?"Pub.":(act.tipo==="radio"?"Radio":"Cob.");
    html+="<div class='m3-guardia-item'>";
    html+="<span class='m3-guardia-hora'>"+(act.hora||"--:--")+"</span>";
    html+="<div><div class='m3-guardia-titulo'>"+act.titulo+"</div>";
    html+="<span class='m3-timeline-tipo-badge "+bc+"'>"+ic+" "+bl+"</span></div>";
    html+="</div>";
  });
}
html+="</div></div>";
var wrapper=document.createElement("div");
wrapper.innerHTML=html;
gpanel.appendChild(wrapper.firstElementChild);
}

/* ========================================================
PROMPT 4 — BOTÓN WHATSAPP POR AGENTE
======================================================== */
window.m3EnviarWA = function(btn){
var nombre = btn ? (btn.dataset.agente||btn.textContent.replace(/[📱WA\s]/g,"")) : "";
if(!nombre){ m3Toast("No se pudo identificar el agente"); return; }
var hoy=new Date();
var yyyy=hoy.getFullYear();
var mm=String(hoy.getMonth()+1).padStart(2,"0");
var dd=String(hoy.getDate()).padStart(2,"0");
var fk=yyyy+"-"+mm+"-"+dd;
var DIAS=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var ft=DIAS[hoy.getDay()]+", "+hoy.getDate()+" de "+MESES[hoy.getMonth()]+" de "+yyyy;
var cobs=[]; var pubs=[];
try{
  var gd=JSON.parse(localStorage.getItem("guardOverrides")||"{}");
  if(gd[fk]&&gd[fk].coberturas) gd[fk].coberturas.forEach(function(c){
    var hn=parseInt((c.hora||"").replace(":",""));
    if(hn>=1500){
      if(c.tipo==="pub") pubs.push((c.hora||"")+" - "+(c.titulo||c.text||"Publicación"));
      else cobs.push((c.hora||"")+" - "+(c.titulo||c.text||"Cobertura"));
    }
  });
}catch(e){}
var msg="Hola "+nombre+", estas son tus coberturas de hoy 👋\n\n";
msg+="📅 *"+ft+"*\n";
msg+="⏰ *Horario de guardia:* 15:00 — 23:59 hs\n\n";
if(cobs.length>0){ msg+="📷 *Coberturas:*\n"; cobs.forEach(function(c){ msg+="  • "+c+"\n"; }); msg+="\n"; }
if(pubs.length>0){ msg+="📢 *Publicaciones programadas:*\n"; pubs.forEach(function(p){ msg+="  • "+p+"\n"; }); msg+="\n"; }
if(cobs.length===0&&pubs.length===0) msg+="✅ Sin actividades de guardia cargadas por ahora.\n";
msg+="\n_Panel Comunicación - Municipalidad de Tres Arroyos_";
window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank");
};

/* Agregar botones WA en tarjetas de agente del DOM existente */
function agregarBotonesWA(){
document.querySelectorAll(".guard-day-col,.gday-col,[class*=guard-day]").forEach(function(col){
  if(col.querySelector(".m3-wa-added")) return;
  col.querySelectorAll("[class*=titular],[class*=soporte]").forEach(function(el){
    var nombre=el.textContent.trim();
    if(!nombre||nombre.length<2) return;
    if(el.nextElementSibling&&el.nextElementSibling.classList.contains("m3-wa-added")) return;
    var btn=document.createElement("button");
    btn.className="m3-btn-wa m3-wa-added";
    btn.style.cssText="font-size:11px;padding:5px 8px;margin-top:4px;width:auto";
    btn.innerHTML="📱 WA";
    btn.dataset.agente=nombre;
    btn.addEventListener("click",function(){ window.m3EnviarWA(this); });
    el.parentNode.insertBefore(btn,el.nextSibling);
  });
});
}

/* ========================================================
INICIALIZACIÓN
======================================================== */
function inicializar(){
inyectarCSS();
setTimeout(function(){
  construirPanelHoy();
  fixCalendario();
  redisenarGuardia();
  agregarBotonesWA();
  // Botones WA en guardias semanales existentes
  document.querySelectorAll("[id*=wa-btn],[class*=wa-btn],[class*=wabtn]").forEach(function(b){
    if(b.dataset.agenteWaM3) return;
    b.dataset.agenteWaM3="1";
    var orig=b.onclick;
    b.addEventListener("click",function(e){ e.stopPropagation(); window.m3EnviarWA(b); e.preventDefault(); });
  });
}, 900);
// MutationObserver para nuevos elementos
new MutationObserver(function(){ agregarBotonesWA(); }).observe(document.getElementById("main")||document.body,{childList:true,subtree:true});
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",inicializar);
} else {
  setTimeout(inicializar, 400);
}

})();
