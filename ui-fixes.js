/* ═══════════════════════════════════════════════════════════
   UI-FIXES.JS  v4.1  ·  Panel Comunicación — Municipalidad Tres Arroyos
   CORRECCIÓN DEFINITIVA: sin parchear nav, usa delegación + MutationObserver
   ═══════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var PANEL_IDS=["hoy","tablero","material","publicaciones","calendario","guardias","equipo","contactos","entrevistas","metricas","medios","reclamos","recursos","agente","dashboard"];
  var DISPLAY_MAP={publicaciones:"flex",calendario:"flex"};
  function activeDisplay(id){return DISPLAY_MAP[id]||"block";}

  var normalMap={publicaciones:"publicaciones",publicacion:"publicaciones",agenda:"publicaciones",guardias:"guardias",guardia:"guardias",equipo:"equipo",calendario:"calendario",tablero:"tablero",hoy:"hoy",material:"material",materiales:"material",medios:"medios",metricas:"metricas",contactos:"contactos",entrevistas:"entrevistas",recursos:"recursos",agente:"agente",reclamos:"reclamos",dashboard:"dashboard"};

  function normalizarId(id){ return normalMap[id]||id; }

  /* ─── CSS BASE ───────────────────────────────────────── */
  function inyectarCSS(){
    var old=document.getElementById("ui-fixes-css");if(old)old.remove();
    var hideAll=PANEL_IDS.map(function(id){return"body[data-active-panel] #p-"+id;}).join(",");
    var showEach=PANEL_IDS.map(function(id){var d=activeDisplay(id);return"body[data-active-panel=\""+id+"\"] #p-"+id+"{display:"+d+"!important;}";}).join("");
    var css=hideAll+"{display:none!important;}"+showEach+
      "#login{z-index:9999!important;}.ov{z-index:5000!important;}.sb{z-index:100!important;}.navbar{z-index:90!important;}.toast-ct{z-index:8000!important;}"+
      ".ov:not(.on){display:none!important;}"+
      "html,body{font-size:13px!important;}h1,h2{font-size:clamp(16px,2vw,22px)!important;}h3{font-size:clamp(14px,1.5vw,18px)!important;}"+
      ".ptitle{font-size:15px!important;font-weight:700!important;}.psub{font-size:12px!important;}button,.btn{font-size:12px!important;}"+
      ".ntab,.sbi,.mbn-btn{position:relative!important;z-index:10!important;pointer-events:auto!important;cursor:pointer!important;}"+
      "body{overflow:hidden!important;}#app{overflow:hidden!important;}.content{overflow:hidden!important;}"+
      "[id^=\"p-\"]{overflow-y:auto!important;height:100%!important;}"+
      ".sbi.on{background:#2d2d5e!important;color:#fff!important;}.ntab.on{background:rgba(255,255,255,0.15)!important;}";
    var s=document.createElement("style");s.id="ui-fixes-css";s.textContent=css;document.head.appendChild(s);
  }

  /* ─── SYNC DE ESTADO DE BOTONES (sidebar, ntab, mbn) ── */
  function sincronizarBotones(pid){
    document.querySelectorAll(".sbi[data-mid]").forEach(function(b){b.dataset.mid===pid?b.classList.add("on"):b.classList.remove("on");});
    document.querySelectorAll(".ntab[data-mid]").forEach(function(b){b.dataset.mid===pid?b.classList.add("on"):b.classList.remove("on");});
    document.querySelectorAll(".mbn-btn[data-mid]").forEach(function(b){b.dataset.mid===pid?b.classList.add("on"):b.classList.remove("on");});
  }

  /* ─── SYNC DE PANELES (inline styles) ───────────────── */
  function sincronizarPaneles(pid){
    PANEL_IDS.forEach(function(p){
      var el=document.getElementById("p-"+p);
      if(!el)return;
      if(p===pid){el.style.display=activeDisplay(p);el.removeAttribute("hidden");}
      else{el.style.display="none";el.setAttribute("hidden","");}
    });
  }

  /* ─── FUNCIÓN PRINCIPAL NAV-UNIFICADO ───────────────── */
  function navUnificado(id){
    if(!id)return;
    var pid=normalizarId(id);
    document.body.setAttribute("data-active-panel",pid);
    var cls=document.body.className.split(" ").filter(function(c){return c.indexOf("m4tab-")!==0;});
    cls.push("m4tab-"+pid);
    document.body.className=cls.join(" ").trim();
    sincronizarPaneles(pid);
    sincronizarBotones(pid);
  }

  /* ─── DELEGACIÓN DE CLICKS CAPTURA LA NAVEGACIÓN ────── */
  function setupDelegacion(){
    // Capturar click en .sbi[data-mid] antes de nav()
    document.addEventListener("click",function(e){
      var btn=e.target.closest(".sbi[data-mid]");
      if(!btn)return;
      var mid=btn.dataset.mid;if(!mid)return;
      // No interferir si tiene onclick con nav() (lo llamara nav() que triggerea el observer)
      var oc=btn.getAttribute("onclick")||"";
      if(oc.indexOf("nav(")!==-1)return;
      e.stopPropagation();
      if(typeof window.nav==="function")window.nav(mid);
      else navUnificado(mid);
    },true);

    // ntab sin onclick
    document.addEventListener("click",function(e){
      var tab=e.target.closest(".ntab[data-mid]");
      if(!tab)return;
      var oc=tab.getAttribute("onclick")||"";
      if(oc.indexOf("nav(")!==-1)return;
      var mid=tab.dataset.mid;if(!mid)return;
      if(typeof window.nav==="function")window.nav(mid);
      else navUnificado(mid);
    },true);
  }

  /* ─── OBSERVER: data-active-panel -> sync botones ────── */
  function setupObserver(){
    var body=document.body;
    var obs=new MutationObserver(function(muts){
      muts.forEach(function(m){
        if(m.attributeName==="data-active-panel"){
          var pid=body.getAttribute("data-active-panel");
          if(pid){
            sincronizarBotones(pid);
            sincronizarPaneles(pid);
          }
        }
      });
    });
    obs.observe(body,{attributes:true,attributeFilter:["data-active-panel"]});
  }

  /* ─── MODALES CERRADOS ───────────────────────────────── */
  function cerrarModales(){
    document.querySelectorAll(".ov,[id^='mod'],#evpanel").forEach(function(m){
      if(!m.classList.contains("on")&&m.id!=="app")m.style.display="none";
    });
  }

  /* ─── FIX BOTÓN HOY ─────────────────────────────────── */
  function fixHoyButton(){
    var b=document.getElementById("ntab-hoy");
    if(b&&!b.dataset.mid){b.dataset.mid="hoy";if(!b.getAttribute("onclick"))b.addEventListener("click",function(){if(typeof window.nav==="function")window.nav("hoy");else navUnificado("hoy");});}
  }

  /* ─── NORMALIZAR FUENTES GRANDES ────────────────────── */
  function normalizarFuentes(){
    document.querySelectorAll("[style*='font-size']").forEach(function(el){
      var fs=parseInt(el.style.fontSize);if(fs&&fs>16)el.style.fontSize=Math.min(fs,15)+"px";
    });
  }

  /* ─── INIT ───────────────────────────────────────────── */
  function init(){
    inyectarCSS();
    cerrarModales();
    setupDelegacion();
    setupObserver();
    fixHoyButton();
    normalizarFuentes();
    // Sincronizar estado inicial
    var panel=document.body.getAttribute("data-active-panel")||"hoy";
    sincronizarBotones(panel);
    sincronizarPaneles(panel);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();
