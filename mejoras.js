// === PANEL MEJORAS v3.3 - Municipalidad de Tres Arroyos ===
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

// Inyectar panel Reclamos en el DOM
function inyectarPanelReclamos(){
  if(document.getElementById("p-reclamos")) return;
  var div = document.createElement("div");
  div.id = "p-reclamos";
  div.className = "content";
  div.style.cssText = "display:none;flex-direction:column;height:100%;overflow:hidden";
  div.innerHTML = [
    "<div class=ptop style=flex-shrink:0;padding:10px 16px;border-bottom:1px solid #e5e7eb>",
    "<div style=display:flex;align-items:center;justify-content:space-between>",
    "<div><div class=ptitle>Reclamos municipales</div>",
    "<div class=psub id=rec-subtitle>Cargando...</div></div></div>",
    "<div style=display:flex;gap:0;border-bottom:0.5px solid #e5e7eb;margin-top:10px>",
    "<button class=rec-tab id=rec-tab-nuevo onclick=setRecTab('nuevo') style=padding:7px 14px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;font-size:12px;font-weight:500;color:#6d28d9;border-bottom-color:#6d28d9>+ Nuevo</button>",
    "<button class=rec-tab id=rec-tab-historial onclick=setRecTab('historial') style=padding:7px 14px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;font-size:12px;font-weight:500;color:#6b7280>Historial</button>",
    "<button class=rec-tab id=rec-tab-admin onclick=setRecTab('admin') style=padding:7px 14px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;font-size:12px;font-weight:500;color:#6b7280>Administrar</button>",
    "</div></div>",
    "<div id=rec-content style=flex:1;overflow-y:auto;padding:16px></div>"
  ].join("");
  var ref = document.querySelector(".content");
  if(ref && ref.parentNode) ref.parentNode.appendChild(div);
  else document.body.appendChild(div);
}

// Inyectar boton Reclamos en sidebar
function inyectarBtnReclamos(){
  if(document.getElementById("sbi-reclamos")) return;
  var pubBtn = null;
  document.querySelectorAll(".sbi").forEach(function(b){
    if((b.getAttribute("onclick")||"").indexOf("publicaciones") >= 0) pubBtn = b;
  });
  var btn = document.createElement("button");
  btn.id = "sbi-reclamos";
  btn.className = "sbi";
  btn.setAttribute("onclick", "nav('reclamos',null,this);loadReclamos()");
  btn.innerHTML = [
    "<svg viewBox=0 0 24 24 style=width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round>",
    "<circle cx=12 cy=12 r=10></circle>",
    "<line x1=12 y1=8 x2=12 y2=12></line>",
    "<line x1=12 y1=16 x2=12.01 y2=16></line></svg>",
    "Reclamos"
  ].join("");
  if(pubBtn && pubBtn.parentNode){
    pubBtn.parentNode.insertBefore(btn, pubBtn.nextSibling);
  } else {
    var sb = document.querySelector(".sb");
    if(sb) sb.appendChild(btn);
  }
}

// Cargar reclamos.js
window.cargarReclamos = function(){
  if(window._rL) return;
  var sc = document.createElement("script");
  sc.src = "reclamos.js";
  sc.onload = function(){
    window._rL = true;
    setTimeout(function(){
      if(typeof window.initReclamos === "function") window.initReclamos();
      inyectarPanelReclamos();
      inyectarBtnReclamos();
    }, 400);
  };
  document.head.appendChild(sc);
};

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
        setTimeout(function(){ if(typeof window.loadReclamos==="function") window.loadReclamos(); }, 600);
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
  }, 800);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(init, 600); });
} else { setTimeout(init, 600); }

})();
