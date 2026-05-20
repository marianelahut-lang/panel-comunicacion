/* ============================================================
   MEJORAS4.JS - Panel Comunicacion Tres Arroyos v2.0
   Capa segura de UX y datos:
   - Conserva las mejoras de cobertura de agenda de Hoy.
   - Agrega backup preventivo antes de acciones destructivas.
   - Ordena textos, accesos rapidos y navegacion mobile.
   - No borra ni migra informacion existente.
============================================================ */
(function(){
"use strict";

var STORAGE_KEY = "hoy_cubierto_v1";
var BACKUP_PREFIX = "panel-comunicacion-autobackup-";

function getCubiertos(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); }catch(e){ return {}; }
}
function setCubiertos(v){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(v||{})); }catch(e){}
}
function todayISO(){
  var n=new Date();
  return n.getFullYear()+"-"+(n.getMonth()<9?"0":"")+(n.getMonth()+1)+"-"+(n.getDate()<10?"0":"")+n.getDate();
}
function safeText(s){ return String(s||"").replace(/\s+/g," ").trim(); }
function cssEscape(v){
  try{ return window.CSS&&CSS.escape ? CSS.escape(String(v)) : String(v).replace(/"/g,"\\\""); }
  catch(e){ return String(v).replace(/"/g,"\\\""); }
}

function recolectarLocalStorage(){
  var out={};
  try{
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      out[k]=localStorage.getItem(k);
    }
  }catch(e){}
  return out;
}
function guardarBackupAutomatico(motivo){
  var stamp=new Date().toISOString().replace(/[:.]/g,"-");
  var payload={
    meta:{motivo:motivo||"cambio",timestamp:new Date().toISOString(),url:location.href,version:"mejoras4-v2"},
    localStorage:recolectarLocalStorage()
  };
  try{ localStorage.setItem(BACKUP_PREFIX+stamp, JSON.stringify(payload)); }catch(e){}
  return payload;
}
function descargarBackup(motivo){
  var payload=guardarBackupAutomatico(motivo);
  try{
    var blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="panel-comunicacion-backup-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },500);
  }catch(e){}
}
function confirmarConBackup(mensaje,motivo){
  guardarBackupAutomatico(motivo);
  return window.confirm(mensaje+"\n\nSe guardo un backup automatico local antes de continuar.");
}

function fixCSSHidden(){
  var m4css=document.getElementById("m4css");
  if(!m4css) return;
  if(m4css.textContent.indexOf("#hoy-cal-m4g,#hoy-tasks-m4g{display:none!important}")>-1){
    m4css.textContent=m4css.textContent.replace(
      "#hoy-cal-m4g,#hoy-tasks-m4g{display:none!important}",
      "/* hoy-cal y hoy-tasks: visibles */"
    );
  }
}

function extraerEventoDeFila(row,today){
  var timeSpan=row.children[0];
  if(!timeSpan||!timeSpan.textContent.match(/^\d{1,2}:\d{2}/)) return null;
  var hora=timeSpan.textContent.replace(/\s*hs\s*/i,"").trim();
  var titleDiv=row.children[2]||row.children[1];
  var title=safeText(titleDiv?titleDiv.textContent:"");
  return {hora:hora,title:title,key:today+"_"+hora+"_"+title.substring(0,20).replace(/[^a-zA-Z0-9]/g,"")};
}

window.mejorarAgendaHoy=function(){
  var m1hoy=document.getElementById("m1-panel-hoy");
  var agDiv=m1hoy?m1hoy.children[2]:null;
  var agPart=agDiv?agDiv.children[0]:null;
  if(!agPart) return;
  var cubiertos=getCubiertos();
  var today=todayISO();
  for(var i=0;i<agPart.children.length;i++){
    var row=agPart.children[i];
    var ev=extraerEventoDeFila(row,today);
    if(!ev) continue;
    var timeSpan=row.children[0];
    var isGuardia=ev.hora>="15:00";
    var isCubierto=!!cubiertos[ev.key];
    row.style.cssText="display:flex;gap:10px;padding:"+(isGuardia||isCubierto?"8px 10px":"8px 0")+";border-bottom:1px solid #f3f4f6;align-items:center;border-radius:"+(isGuardia||isCubierto?"6px":"0")+";margin-bottom:"+(isGuardia||isCubierto?"2px":"0");
    if(isCubierto&&isGuardia){row.style.background="#d1fae5";row.style.borderLeft="3px solid #059669";timeSpan.style.color="#059669";}
    else if(isCubierto){row.style.background="#ede9fe";row.style.borderLeft="3px solid #7c3aed";timeSpan.style.color="#7c3aed";}
    else if(isGuardia){row.style.background="#fef3c7";row.style.borderLeft="3px solid #f59e0b";timeSpan.style.color="#d97706";}
    else{row.style.background="";row.style.borderLeft="";timeSpan.style.color="#2563eb";}
    timeSpan.style.fontWeight="700";

    var badge=row.querySelector(".hoy-guardia-badge");
    if(isGuardia&&!badge){
      badge=document.createElement("span");
      badge.className="hoy-guardia-badge";
      badge.style.cssText="font-size:.6rem;font-weight:700;border-radius:4px;padding:1px 5px;white-space:nowrap;flex-shrink:0;display:inline-block";
      row.insertBefore(badge,timeSpan.nextSibling||row.firstChild);
    }
    if(isGuardia&&badge){
      badge.style.background=isCubierto?"#059669":"#fbbf24";
      badge.style.color=isCubierto?"#fff":"#78350f";
      badge.textContent=isCubierto?"Cubierto":"Guardia";
    }

    var ourBtn=row.querySelector(".hoy-cubrir-btn-m4");
    if(!ourBtn){
      var origBtn=row.querySelector("button:not(.hoy-cubrir-btn-m4)");
      if(origBtn) origBtn.remove();
      ourBtn=document.createElement("button");
      ourBtn.className="hoy-cubrir-btn-m4";
      ourBtn.setAttribute("data-key",ev.key);
      ourBtn.style.cssText="margin-left:auto;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:.72rem;white-space:nowrap;flex-shrink:0;transition:all .2s;font-weight:600;border:1px solid #d1d5db;background:#f9fafb;color:#6b7280";
      row.appendChild(ourBtn);
      ourBtn.addEventListener("click",function(e){
        e.stopPropagation();
        var k=this.getAttribute("data-key");
        var cv=getCubiertos();
        if(cv[k]) delete cv[k]; else cv[k]=true;
        setCubiertos(cv);
        window.mejorarAgendaHoy();
      });
    }
    ourBtn.textContent=isCubierto?(isGuardia?"Cubierto (Guardia)":"Cubierto"):"Cubrir";
    ourBtn.style.background=isCubierto?(isGuardia?"#d1fae5":"#ede9fe"):"#f9fafb";
    ourBtn.style.color=isCubierto?(isGuardia?"#059669":"#7c3aed"):"#6b7280";
    ourBtn.style.border=isCubierto?(isGuardia?"1px solid #059669":"1px solid #7c3aed"):"1px solid #d1d5db";
  }
};

function inyectarEstilosUX(){
  if(document.getElementById("m4-ux-css")) return;
  var st=document.createElement("style");
  st.id="m4-ux-css";
  st.textContent="\
  .m4-data-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:rgba(255,255,255,.78);font-size:10px;font-weight:600;white-space:nowrap}\
  .m4-mobilebar{display:none}\
  .m4-home-band{border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 1px 3px rgba(15,23,42,.05)}\
  .m4-home-title{font-size:13px;font-weight:800;color:#111827;margin-bottom:3px}\
  .m4-home-sub{font-size:11px;color:#6b7280;line-height:1.4}\
  .m4-backup-btn{border-color:#8b5cf6!important;background:#f5f3ff!important;color:#6d28d9!important;font-weight:700!important}\
  body.dark .m4-home-band{background:#252830;border-color:#373b47}\
  body.dark .m4-home-title{color:#f1f5f9}\
  body.dark .m4-home-sub{color:#94a3b8}\
  @media(max-width:768px){\
    .content{padding-bottom:68px!important}\
    .m4-mobilebar{position:fixed;left:8px;right:8px;bottom:8px;z-index:800;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:6px;border-radius:14px;background:rgba(26,26,46,.96);box-shadow:0 8px 24px rgba(0,0,0,.22);backdrop-filter:blur(12px)}\
    .m4-mobilebar button{border:0;background:transparent;color:rgba(255,255,255,.68);border-radius:10px;padding:7px 2px;font-family:Inter,sans-serif;font-size:10px;font-weight:700;cursor:pointer}\
    .m4-mobilebar button.on{background:rgba(255,255,255,.16);color:#fff}\
  }";
  document.head.appendChild(st);
}

function normalizarTextos(){
  var repl={
    "publicaciónes":"publicaciones",
    "Publicaciónes":"Publicaciones",
    "seleccióná":"seleccioná",
    "ContraseÃ±a":"Contraseña",
    "ComunicaciÃ³n":"Comunicación",
    "MÃ©tricas":"Métricas",
    "Publicacion":"Publicación",
    "publicacion":"publicación",
    "SÃ­":"Sí"
  };
  try{
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var node;
    while((node=walker.nextNode())){
      var v=node.nodeValue;
      Object.keys(repl).forEach(function(k){ v=v.split(k).join(repl[k]); });
      node.nodeValue=v;
    }
    document.querySelectorAll("option").forEach(function(opt){
      if(opt.textContent.trim().toLowerCase()==="sofia") opt.textContent="Sofía";
    });
  }catch(e){}
}

function reforzarBackup(){
  try{
    var btn=document.querySelector("button[onclick*='Backup'], .m2-bk-mi, #m2-bk-open, #backupbtn");
    if(!btn){
      btn=document.createElement("button");
      btn.type="button";
      btn.className="btn sm m4-backup-btn";
      btn.textContent="Backup";
      btn.onclick=function(){ descargarBackup("manual"); };
      var tr=document.querySelector(".tr")||document.querySelector(".topbar");
      if(tr) tr.insertBefore(btn,tr.firstChild);
    }else{
      btn.classList.add("m4-backup-btn");
      btn.title="Descargar copia de seguridad de los datos guardados en este navegador";
    }
  }catch(e){}
}

function sumarEstadoDatos(){
  var tr=document.querySelector(".tr");
  if(!tr||document.getElementById("m4-data-chip")) return;
  var chip=document.createElement("span");
  chip.id="m4-data-chip";
  chip.className="m4-data-chip";
  chip.textContent="Datos cuidados";
  chip.title="El panel guarda un backup automatico antes de acciones de borrado.";
  tr.insertBefore(chip,tr.firstChild);
}

function crearMobileBar(){
  if(document.getElementById("m4-mobilebar")) return;
  var bar=document.createElement("div");
  bar.id="m4-mobilebar";
  bar.className="m4-mobilebar";
  var items=[
    ["hoy","Hoy"],
    ["publicaciones","Agenda"],
    ["calendario","Calendario"],
    ["guardias","Guardia"],
    ["equipo","Equipo"]
  ];
  items.forEach(function(it){
    var b=document.createElement("button");
    b.type="button";
    b.setAttribute("data-m4nav",it[0]);
    b.textContent=it[1];
    b.onclick=function(){ if(typeof window.nav==="function") window.nav(it[0],b); };
    bar.appendChild(b);
  });
  document.body.appendChild(bar);
}
function marcarMobileActivo(id){
  document.querySelectorAll("[data-m4nav]").forEach(function(b){
    b.classList.toggle("on",b.getAttribute("data-m4nav")===id);
  });
}

function destacarHoy(){
  var hoy=document.getElementById("p-hoy");
  if(!hoy||document.getElementById("m4-home-band")) return;
  var band=document.createElement("div");
  band.id="m4-home-band";
  band.className="m4-home-band";
  band.innerHTML="<div class='m4-home-title'>Prioridad del día</div><div class='m4-home-sub'>Revisá primero urgentes, agenda y coberturas. Antes de borrar o restaurar datos, el panel guarda una copia local.</div>";
  hoy.insertBefore(band,hoy.firstChild);
}

function envolverAccionesDestructivas(){
  if(window._m4safeDeletePatched) return;
  window._m4safeDeletePatched=true;
  function wrap(name,label){
    var orig=window[name];
    if(typeof orig!=="function"||orig._m4safe) return;
    var wrapped=function(){
      if(!confirmarConBackup("¿Confirmás " + label + "?", label)) return;
      return orig.apply(this,arguments);
    };
    wrapped._m4safe=true;
    window[name]=wrapped;
  }
  wrap("eliminarPubDirecto","eliminar esta publicación");
  wrap("m4gDelPub","eliminar esta publicación");
  wrap("delTask","eliminar esta tarea");
  wrap("deleteTask","eliminar esta tarea");
  wrap("ctDelete","eliminar este contacto");
}

function patchNav(){
  if(window._m4uxNavPatched) return;
  var orig=window.nav;
  if(typeof orig!=="function") return;
  window._m4uxNavPatched=true;
  window.nav=function(id){
    var r=orig.apply(this,arguments);
    marcarMobileActivo(id);
    setTimeout(function(){
      normalizarTextos();
      reforzarBackup();
      sumarEstadoDatos();
      if(id==="hoy"){
        destacarHoy();
        window.mejorarAgendaHoy();
      }
    },250);
    return r;
  };
}

function observarCambios(){
  if(window._m4uxObs) return;
  try{
    var pending=false;
    window._m4uxObs=new MutationObserver(function(){
      if(pending) return;
      pending=true;
      setTimeout(function(){
        pending=false;
        normalizarTextos();
        reforzarBackup();
        envolverAccionesDestructivas();
      },350);
    });
    window._m4uxObs.observe(document.body,{childList:true,subtree:true});
  }catch(e){}
}

function inicializar(){
  fixCSSHidden();
  inyectarEstilosUX();
  normalizarTextos();
  reforzarBackup();
  sumarEstadoDatos();
  crearMobileBar();
  patchNav();
  observarCambios();
  envolverAccionesDestructivas();
  if((window._m4gcal||[]).length===0&&typeof window.syncGCal==="function"){
    window._m4gcal=[];
    window.syncGCal();
  }
  if(!window._m4navPatchedM4){
    window._m4navPatchedM4=true;
    var origNav=window.nav;
    if(typeof origNav==="function"){
      window.nav=function(id){
        var r=origNav.apply(this,arguments);
        marcarMobileActivo(id);
        if(id==="hoy") setTimeout(function(){ destacarHoy(); window.mejorarAgendaHoy(); },400);
        return r;
      };
    }
  }
  var targetNode=document.getElementById("m1-panel-hoy");
  if(targetNode&&!window._m4obsM4){
    window._m4obsM4=new MutationObserver(function(){
      clearTimeout(window._m4obsTimerM4);
      window._m4obsTimerM4=setTimeout(function(){
        var phoy=document.getElementById("p-hoy");
        if(phoy&&phoy.style.display!=="none"&&phoy.offsetParent!==null){
          destacarHoy();
          window.mejorarAgendaHoy();
        }
      },200);
    });
    window._m4obsM4.observe(targetNode,{childList:true,subtree:true});
  }
  setTimeout(function(){
    destacarHoy();
    window.mejorarAgendaHoy();
    normalizarTextos();
    envolverAccionesDestructivas();
  },800);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",function(){ setTimeout(inicializar,800); });
}else{
  setTimeout(inicializar,800);
}

})();
