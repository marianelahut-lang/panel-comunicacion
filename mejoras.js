// === PANEL MEJORAS v3.2 - Municipalidad de Tres Arroyos ===
(function(){
"use strict";

// CSS
var s = document.createElement("style");
s.id = "pm-css";
s.textContent = [
  ".sbi{padding:8px 14px!important;font-size:12px!important;gap:9px!important;border-radius:8px!important;margin:1px 6px!important;transition:background .12s,color .12s!important}",
  ".sbi svg{width:15px!important;height:15px!important;flex-shrink:0!important}",
  ".sbi.on{border-radius:8px!important}",
  ".pv-wrap{display:flex;gap:6px;align-items:center;padding:8px 0 2px}",
  ".pv-btn{padding:5px 14px;border:0.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;background:#fff;color:#374151;font-family:Inter,sans-serif}",
  ".pv-btn.on{background:#6d28d9!important;color:#fff!important;border-color:#6d28d9!important}",
  ".ptitle{font-size:15px!important;font-weight:600!important}",
  ".content{animation:pvFade .15s ease}",
  "@keyframes pvFade{from{opacity:.85}to{opacity:1}}"
].join("");
document.head.appendChild(s);

// Cargar reclamos.js
window.cargarReclamos = function(){
  if(window._rL) return;
  var sc = document.createElement("script");
  sc.src = "reclamos.js";
  sc.onload = function(){ window._rL = true; setTimeout(initRec, 400); };
  document.head.appendChild(sc);
};
function initRec(){
  if(typeof window.initReclamos === "function") window.initReclamos();
  if(typeof window.inyectarPanelReclamos === "function") window.inyectarPanelReclamos();
  if(typeof window.inyectarBtnReclamos === "function") window.inyectarBtnReclamos();
}

// Ocultar Metricas
function ocultarMetricas(){
  document.querySelectorAll(".sbi,.ntab").forEach(function(b){
    var t = b.textContent||"", oc = b.getAttribute("onclick")||"";
    if((t.indexOf("trica")>=0||oc.indexOf("metrica")>=0)&&!b.dataset.mh){
      b.style.display = "none"; b.dataset.mh = "1";
    }
  });
  document.querySelectorAll("[id*=metricas],[id*=Metricas]").forEach(function(el){
    el.style.display = "none";
  });
}

// Toggle Publicaciones
var _pv = localStorage.getItem("pvista") || "hoy";
window.setPubVista = function(v){ _pv=v; localStorage.setItem("pvista",v); applyPV(); updPVBtns(); };
function applyPV(){
  var p = document.getElementById("p-publicaciones");
  if(!p) return;
  var dk = p.querySelector(".gw-desktop"), mb = p.querySelector(".gw-mobile");
  if(_pv === "hoy"){
    if(dk) dk.style.display = "none";
    if(mb) mb.style.cssText = "display:flex!important;flex:1;flex-direction:column;overflow:hidden";
    if(typeof renderPubDay === "function") setTimeout(renderPubDay, 0);
  } else {
    if(dk) dk.style.display = "";
    if(mb) mb.style.cssText = "";
    if(typeof renderWeek === "function") setTimeout(renderWeek, 0);
  }
}
function updPVBtns(){
  var bH = document.getElementById("pvb-hoy"), bS = document.getElementById("pvb-sem");
  if(bH) bH.className = "pv-btn" + (_pv==="hoy" ? " on" : "");
  if(bS) bS.className = "pv-btn" + (_pv==="semana" ? " on" : "");
}
function insertTogglePub(){
  var p = document.getElementById("p-publicaciones");
  if(!p || document.getElementById("pvb-hoy")) return;
  var pt = p.querySelector(".ptop"); if(!pt) return;
  var w = document.createElement("div"); w.className = "pv-wrap";
  var bH = document.createElement("button");
  bH.id = "pvb-hoy"; bH.className = "pv-btn" + (_pv==="hoy"?" on":"");
  bH.textContent = "Hoy"; bH.onclick = function(){ window.setPubVista("hoy"); };
  var bS = document.createElement("button");
  bS.id = "pvb-sem"; bS.className = "pv-btn" + (_pv==="semana"?" on":"");
  bS.textContent = "Semana"; bS.onclick = function(){ window.setPubVista("semana"); };
  var sp = document.createElement("span");
  sp.style.cssText = "font-size:11px;color:#6b7280;font-weight:500";
  sp.textContent = "VISTA:";
  w.appendChild(sp); w.appendChild(bH); w.appendChild(bS);
  pt.appendChild(w);
}

// Patch nav
function patchNav(){
  if(window.__navM || typeof window.nav !== "function") return;
  var _o = window.nav;
  window.nav = function(page, data, btn){
    _o.call(this, page, data, btn);
    setTimeout(function(){
      ocultarMetricas();
      if(page === "publicaciones"){ insertTogglePub(); applyPV(); }
      if(page === "reclamos"){
        window.cargarReclamos();
        setTimeout(function(){ if(typeof window.loadReclamos==="function") window.loadReclamos(); }, 500);
      }
    }, 80);
  };
  window.__navM = true;
}

// Init
function init(){
  ocultarMetricas();
  patchNav();
  window.cargarReclamos();
  setTimeout(function(){
    var pP = document.getElementById("p-publicaciones");
    if(pP && getComputedStyle(pP).display !== "none"){ insertTogglePub(); applyPV(); }
  }, 700);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(init, 600); });
} else { setTimeout(init, 600); }

})();
