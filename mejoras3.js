/* ============================================================
MEJORAS3.JS v2 - Panel Comunicación Tres Arroyos
FIXES: Separación módulos + Guardia operativa
============================================================
CORRECCIONES:
1. p-tablero OCULTO cuando no es la pestaña activa
2. Material y Reclamos sin tablero superpuesto
3. Columna Realizada eliminada del kanban
4. Panel guardia rediseñado (desde 15hs, cronológico)
5. Botones WhatsApp por agente
NO modifica datos ni lógica funcional.
============================================================ */
(function(){
"use strict";

/* CSS */
function inyectarCSS(){
if(document.getElementById("m4css")) return;
var css = [
"/* TABLERO: oculto por default, solo visible cuando activo */",
"#p-tablero{display:none!important}",
"body.m4tab-tablero #p-tablero{display:flex!important}",
"/* Quitar ::before de mejoras3 */",
"#p-tablero::before{display:none!important;content:none!important}",
"/* Columna Realizada oculta */",
".m4col-hide{display:none!important}",
"/* GUARDIA rediseño */",
"#m4gwrap{padding:0 0 24px 0}",
".m4gh{background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:14px;padding:18px 20px;color:#fff;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}",
".m4gh h2{font-size:20px;font-weight:700;margin:0 0 2px 0}",
".m4gh p{font-size:12px;opacity:.85;margin:0}",
".m4ghr{font-size:13px;background:rgba(255,255,255,.2);padding:6px 12px;border-radius:20px;font-weight:600}",
".m4ag-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px}",
".m4ag-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}",
"body.dark .m4ag-card{background:#1f2937;border-color:#374151}",
".m4ag-rol{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}",
".m4rol-tit{color:#4f46e5}",
".m4rol-sop{color:#10b981}",
".m4ag-nom{font-size:16px;font-weight:700;color:#111827;margin-bottom:2px}",
"body.dark .m4ag-nom{color:#f9fafb}",
".m4ag-hor{font-size:12px;color:#6b7280;margin-bottom:10px}",
".m4wabtn{display:flex;align-items:center;justify-content:center;gap:6px;background:#25d366;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;width:100%;transition:background .15s}",
".m4wabtn:hover{background:#1da851}",
".m4acts{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}",
"body.dark .m4acts{background:#1f2937;border-color:#374151}",
".m4acts-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb}",
"body.dark .m4acts-hdr{background:#111827;border-color:#374151}",
".m4acts-hdr h3{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;margin:0}",
".m4cnt-badge{font-size:11px;background:#ede9fe;color:#5b21b6;padding:3px 8px;border-radius:20px;font-weight:600}",
".m4act{display:flex;align-items:flex-start;gap:12px;padding:11px 16px;border-bottom:1px solid #f3f4f6;transition:background .1s}",
"body.dark .m4act{border-color:#374151}",
".m4act:last-child{border-bottom:none}",
".m4act:hover{background:#f9fafb}",
"body.dark .m4act:hover{background:#374151}",
".m4act-hora{font-size:13px;font-weight:700;color:#4f46e5;min-width:48px;padding-top:1px}",
".m4badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;margin-top:3px;white-space:nowrap}",
".m4bc{background:#fef3c7;color:#92400e}",
".m4bp{background:#d1fae5;color:#065f46}",
".m4be{background:#dbeafe;color:#1d4ed8}",
".m4br{background:#ede9fe;color:#5b21b6}",
".m4act-tit{font-size:13px;font-weight:600;color:#111827;line-height:1.4}",
"body.dark .m4act-tit{color:#f9fafb}",
".m4act-sub{font-size:11px;color:#6b7280}",
".m4empty{text-align:center;padding:28px 16px;color:#9ca3af;font-size:13px}"
].join("\n");
var st = document.createElement("style");
st.id = "m4css";
st.textContent = css;
document.head.appendChild(st);
}

/* === FIX NAVEGACION: Ocultar tablero cuando no esta activo === */
function checkTablero(){
var tb = document.getElementById("p-tablero");
if(!tb) return;
// Contar paneles visibles que NO son el tablero
var visible = 0;
document.querySelectorAll("#main > div[id^='p-']").forEach(function(p){
  if(p.id !== "p-tablero"){
    var d = p.style.display;
    if(d !== "none") visible++;
  }
});
if(visible > 0){
  // Otro panel activo: ocultar tablero
  tb.style.setProperty("display","none","important");
  document.body.classList.remove("m4tab-tablero");
} else {
  // Solo tablero: mostrar
  tb.style.removeProperty("display");
  document.body.classList.add("m4tab-tablero");
}
}

function parchearNav(){
if(window._m4navOK) return;
// Parchear función nav() global
if(window.nav){
  var orig = window.nav;
  window.nav = function(sec, extra, btn){
    orig.apply(this, arguments);
    var esTablero = (sec && (sec.indexOf("tablero") !== -1 || sec.indexOf("p-tablero") !== -1));
    if(esTablero){
      document.body.classList.add("m4tab-tablero");
      var tb = document.getElementById("p-tablero");
      if(tb) tb.style.removeProperty("display");
    } else {
      setTimeout(checkTablero, 50);
    }
  };
  window._m4navOK = true;
}
// Parchear botones .sbi del sidebar
document.querySelectorAll(".sbi").forEach(function(btn){
  if(btn.dataset.m4p) return;
  btn.dataset.m4p = "1";
  btn.addEventListener("click", function(){
    setTimeout(checkTablero, 80);
  });
});
// Parchear botones .ntab del topnav
document.querySelectorAll(".ntab").forEach(function(btn){
  if(btn.dataset.m4p) return;
  btn.dataset.m4p = "1";
  btn.addEventListener("click", function(){
    var txt = btn.textContent.trim().toLowerCase();
    if(txt.indexOf("tablero") !== -1){
      document.body.classList.add("m4tab-tablero");
      var tb = document.getElementById("p-tablero");
      if(tb) tb.style.removeProperty("display");
    } else {
      setTimeout(checkTablero, 80);
    }
  });
});
}

/* === FIX KANBAN: Ocultar columna Realizada === */
function ocultarRealizada(){
document.querySelectorAll(".kcol").forEach(function(col){
  if(col.classList.contains("m4col-hide")) return;
  var h = col.querySelector(".khdr");
  if(h && h.textContent.trim().toLowerCase().indexOf("realiz") !== -1){
    col.classList.add("m4col-hide");
  }
});
}

/* === GUARDIA REDISEÑO === */
function buildGuardia(){
var gp = document.getElementById("p-guardias");
if(!gp || document.getElementById("m4gwrap")) return;
var hoy = new Date();
var DIAS=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var ft=DIAS[hoy.getDay()]+" "+hoy.getDate()+" de "+MESES[hoy.getMonth()];
var yyyy=hoy.getFullYear(),mm=String(hoy.getMonth()+1).padStart(2,"0"),dd=String(hoy.getDate()).padStart(2,"0");
var fk=yyyy+"-"+mm+"-"+dd;
var agentes=[],acts=[];
// Leer datos desde localStorage
try{
  var gd=JSON.parse(localStorage.getItem("guardOverrides")||"{}");
  var day=gd[fk]||{};
  if(day.titular) agentes.push({rol:"Titular",nom:day.titular,rc:"m4rol-tit"});
  if(day.soporte) agentes.push({rol:"Soporte",nom:day.soporte,rc:"m4rol-sop"});
  if(day.coberturas) day.coberturas.forEach(function(c){
    var h=parseInt((c.hora||"0000").replace(":",""));
    if(h>=1500) acts.push({hora:c.hora||"",tipo:c.tipo||"cob",tit:c.titulo||c.text||"Cobertura"});
  });
}catch(e){}
// Leer del DOM de guardias existente
var gdc=document.getElementById("guard-day-content");
if(gdc){
  gdc.querySelectorAll("[class*=titular],[class*=agent-tit]").forEach(function(el){
    var n=el.textContent.trim();
    if(n && n.length>1 && !agentes.find(function(a){return a.nom===n;})){
      agentes.push({rol:"Titular",nom:n,rc:"m4rol-tit"});
    }
  });
  gdc.querySelectorAll("[class*=soporte],[class*=agent-sop]").forEach(function(el){
    var n=el.textContent.trim();
    if(n && n.length>1 && !agentes.find(function(a){return a.nom===n;})){
      agentes.push({rol:"Soporte",nom:n,rc:"m4rol-sop"});
    }
  });
  gdc.querySelectorAll("[class*=gcob],[class*=cob-item]").forEach(function(el){
    var hEl=el.querySelector("[class*=hora]");
    var hora=hEl?hEl.textContent.trim():"";
    var hNum=parseInt(hora.replace(":","").replace(/[^0-9]/g,"") || "0");
    if(hNum>=1500){
      var tEl=el.querySelector("[class*=titulo],[class*=text]");
      var txt=tEl?tEl.textContent.trim():el.textContent.trim().substring(0,60);
      if(txt&&!acts.find(function(a){return a.tit===txt;})){
        acts.push({hora:hora,tipo:"cob",tit:txt});
      }
    }
  });
}
acts.sort(function(a,b){
  return parseInt((a.hora||"").replace(":",""))-parseInt((b.hora||"").replace(":",""));
});
// Build HTML
var h="<div id='m4gwrap'>";
h+="<div class='m4gh'><div class='m4gh-left'><h2>🛡️ Guardia del Día</h2><p>"+ft+" · Actividades desde las 15:00 hs</p></div></div>";
if(agentes.length>0){
  h+="<div class='m4ag-grid'>";
  agentes.forEach(function(ag){
    h+="<div class='m4ag-card'>";
    h+="<div class='m4ag-rol "+ag.rc+"'>" +ag.rol+"</div>";
    h+="<div class='m4ag-nom'>"+ag.nom+"</div>";
    h+="<div class='m4ag-hor'>⏰ 15:00 — 23:59 hs</div>";
    h+="<button class='m4wabtn' data-agente='"+ag.nom+"' onclick='m4WA(this)'>📱 Enviar WhatsApp</button>";
    h+="</div>";
  });
  h+="</div>";
}
h+="<div class='m4acts'>";
h+="<div class='m4acts-hdr'><h3>📋 Actividades desde las 15:00 hs</h3>";
if(acts.length>0) h+="<span class='m4cnt-badge'>"+acts.length+" actividades</span>";
h+="</div>";
if(acts.length===0){
  h+="<div class='m4empty'>Sin actividades de guardia cargadas para hoy</div>";
} else {
  acts.forEach(function(act){
    var ico=act.tipo==="pub"?"📢":(act.tipo==="radio"?"📻":(act.tipo==="evento"?"🗓️":"📷"));
    var bc=act.tipo==="pub"?"m4bp":(act.tipo==="radio"?"m4br":(act.tipo==="evento"?"m4be":"m4bc"));
    var bl=act.tipo==="pub"?"Publicación":(act.tipo==="radio"?"Radio":(act.tipo==="evento"?"Evento":"Cobertura"));
    h+="<div class='m4act'>";
    h+="<div class='m4act-hora'>"+(act.hora||"—")+"</div>";
    h+="<div><div class='m4act-tit'>"+act.tit+"</div>";
    h+="<span class='m4badge "+bc+"'>"+ ico+" "+bl+"</span></div>";
    h+="</div>";
  });
}
h+="</div></div>";
var wr=document.createElement("div");
wr.innerHTML=h;
gp.insertBefore(wr.firstElementChild, gp.firstChild);
}

/* === WHATSAPP === */
window.m4WA=function(btn){
var nom=btn?btn.dataset.agente:"";
if(!nom) return;
var hoy=new Date();
var DIAS=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
var MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var ft=DIAS[hoy.getDay()]+", "+hoy.getDate()+" de "+MESES[hoy.getMonth()]+" de "+hoy.getFullYear();
var yyyy=hoy.getFullYear(),mm=String(hoy.getMonth()+1).padStart(2,"0"),dd=String(hoy.getDate()).padStart(2,"0");
var fk=yyyy+"-"+mm+"-"+dd;
var cobs=[],pubs=[];
try{
  var gd=JSON.parse(localStorage.getItem("guardOverrides")||"{}");
  var day=gd[fk]||{};
  if(day.coberturas) day.coberturas.forEach(function(c){
    var hh=parseInt((c.hora||"0").replace(":",""));
    if(hh>=1500){
      if(c.tipo==="pub") pubs.push((c.hora||"")+" - "+(c.titulo||c.text||"Pub."));
      else cobs.push((c.hora||"")+" - "+(c.titulo||c.text||"Cobertura"));
    }
  });
}catch(e){}
var msg="Hola "+nom+", estas son tus coberturas de hoy 👋\n\n";
msg+="📅 *"+ft+"*\n";
msg+="⏰ *Horario:* 15:00 — 23:59 hs\n\n";
if(cobs.length>0){msg+="📷 *Coberturas:*\n";cobs.forEach(function(c){msg+="  • "+c+"\n";});msg+="\n";}
if(pubs.length>0){msg+="📢 *Publicaciones:*\n";pubs.forEach(function(p){msg+="  • "+p+"\n";});msg+="\n";}
if(!cobs.length&&!pubs.length) msg+="✅ Sin actividades por ahora.\n";
msg+="\n_Panel Comunicación — Muni Tres Arroyos_";
window.open("https://wa.me/?text="+encodeURIComponent(msg),"_blank");
};

/* === INIT === */
function init(){
inyectarCSS();
setTimeout(function(){
  parchearNav();
  ocultarRealizada();
  buildGuardia();
  checkTablero();
}, 700);
// Recheck en intervalo
var n=0;
var iv=setInterval(function(){
  parchearNav();
  ocultarRealizada();
  checkTablero();
  if(++n>=15) clearInterval(iv);
}, 400);
// Observer en #main
var main=document.getElementById("main");
if(main){
  new MutationObserver(function(){checkTablero();ocultarRealizada();}).observe(main,{attributes:true,subtree:true,attributeFilter:["style"]});
}
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
} else {
  setTimeout(init,300);
}

})();
