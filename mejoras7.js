/* ============================================================
   MEJORAS7.JS - Panel Comunicacion Tres Arroyos
   Parche final de estabilizacion - 2026-05-20
   ------------------------------------------------------------
   Este archivo NO borra ni migra informacion cargada.
   No toca funcionarios, guardias, equipo, entrevistas ni reclamos.
   Solo limpia cruces visuales del DOM, agrega acceso al generador,
   refuerza renders fragiles y mejora la vista Hoy.
   ============================================================ */
(function(){
  "use strict";

  var GENERADOR_URL = "generador-flyers.html";
  var PAGINAS = ["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","entrevistas","contactos","recursos","metricas","dashboard","agente"];

  function ready(fn){
    if(document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function txt(s){ return String(s || "").replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function norm(s){ return String(s || "").trim().toLowerCase(); }
  function today0(){ var d = new Date(); d.setHours(0,0,0,0); return d; }
  function ageDays(value){
    if(!value) return 0;
    var d = new Date(value);
    if(isNaN(d)) return 0;
    d.setHours(0,0,0,0);
    return Math.max(0, Math.floor((today0() - d) / 86400000));
  }
  function isActiveTask(t){
    var e = norm(t && t.estado);
    return e !== "completo" && e !== "completa" && e !== "realizada" && e !== "realizado" && e !== "lista para publicar";
  }
  function visible(el){
    return !!el && window.getComputedStyle(el).display !== "none" && window.getComputedStyle(el).visibility !== "hidden";
  }
  function activeDisplay(id){
    return (id === "calendario" || id === "publicaciones") ? "flex" : "block";
  }

  /* Acceso al generador */
  function abrirGenerador(){ window.location.href = GENERADOR_URL; }
  window.abrirGeneradorFlyers = abrirGenerador;

  function iconoFlyer(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 7h8M8 11h8M8 15h5"></path></svg>';
  }

  function agregarAccesoGenerador(){
    var ntabs = q(".ntabs");
    if(ntabs && !document.getElementById("ntab-generador-flyers")){
      var btn = document.createElement("button");
      btn.id = "ntab-generador-flyers";
      btn.className = "ntab";
      btn.type = "button";
      btn.textContent = "Generador";
      btn.title = "Abrir generador de flyers municipales";
      btn.onclick = abrirGenerador;
      ntabs.appendChild(btn);
    }
    var sb = q("aside.sb");
    if(sb && !document.getElementById("sbi-generador-flyers")){
      var sep = document.createElement("div"); sep.className = "div m7-generator-sep";
      var sec = document.createElement("div"); sec.className = "sb-sec m7-generator-sec"; sec.textContent = "Herramientas";
      var b = document.createElement("button");
      b.id = "sbi-generador-flyers";
      b.className = "sbi";
      b.type = "button";
      b.innerHTML = iconoFlyer() + "Generador de flyers";
      b.onclick = abrirGenerador;
      sb.appendChild(sep); sb.appendChild(sec); sb.appendChild(b);
    }
    var mobile = document.getElementById("mobile-bottom-nav");
    if(mobile && !document.getElementById("mbn-generador-flyers")){
      var mb = document.createElement("button");
      mb.id = "mbn-generador-flyers";
      mb.className = "mbn-btn";
      mb.type = "button";
      mb.innerHTML = iconoFlyer() + "<span>Flyers</span>";
      mb.onclick = abrirGenerador;
      mobile.appendChild(mb);
    }
  }

  /* Limpiezas visuales menores */
  function limpiarSidebarFantasma(){
    var sb = q("aside.sb");
    if(!sb) return;
    var walker = document.createTreeWalker(sb, NodeFilter.SHOW_TEXT, null, false);
    var node, borrar = [];
    while((node = walker.nextNode())){
      if(/^Tareas del d/i.test((node.nodeValue || "").trim())) borrar.push(node);
    }
    borrar.forEach(function(n){ try{ n.parentNode.removeChild(n); }catch(_){} });
    var fPanel = document.getElementById("fPanel") || document.getElementById("fpanel");
    if(fPanel){ fPanel.style.display = "none"; fPanel.style.margin = "4px 8px 6px"; }
    var sbpersons = document.getElementById("sbpersons");
    if(sbpersons) sbpersons.style.display = "none";
