/* ═══════════════════════════════════════════════════════════
   UI-FIXES.JS  v4  ·  Panel Comunicación — Municipalidad Tres Arroyos
   CORRECCIÓN DEFINITIVA: nav unificado, sin race conditions, sin MutationObserver
   ═══════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  var PANEL_IDS=["hoy","tablero","material","publicaciones","calendario","guardias","equipo","contactos","entrevistas","metricas","medios","reclamos","recursos","agente","dashboard"];
  var DISPLAY_MAP={publicaciones:"flex",calendario:"flex"};
  function activeDisplay(id){return DISPLAY_MAP[id]||"block";}

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

  function navUnificado(id){
    if(!id)return;
    var normalMap={publicaciones:"publicaciones",publicacion:"publicaciones",agenda:"publicaciones",guardias:"guardias",guardia:"guardias",equipo:"equipo",calendario:"calendario",tablero:"tablero",hoy:"hoy",material:"material",materiales:"material",medios:"medios",metricas:"metricas",contactos:"contactos",entrevistas:"entrevistas",recursos:"recursos",agente:"agente",reclamos:"reclamos",dashboard:"dashboard"};
    var pid=normalMap[id]||id;
    document.body.setAttribute("data-active-panel",pid);
    var cls=document.body.className.split(" ").filter(function(c){return c.indexOf("m4tab-")!==0;});
    cls.push("m4tab-"+pid);
    document.body.className=cls.join(" ").trim();
    PANEL_IDS.forEach(function(p){
      var el=document.getElementById("p-"+p);
      if(!el)return;
      if(p===pid){el.style.display=activeDisplay(p);el.removeAttribute("hidden");}
      else{el.style.display="none";el.setAttribute("hidden","");}
    });
    document.querySelectorAll(".sbi[data-mid]").forEach(function(b){b.dataset.mid===pid?b.classList.add("on"):b.classList.remove("on");});
    document.querySelectorAll(".ntab[data-mid]").forEach(function(b){b.dataset.mid===pid?b.classList.add("on"):b.classList.remove("on");});
    document.querySelectorAll(".mbn-btn[data-mid]").forEach(function(b){b.dataset.mid===pid?b.classList.add("on"):b.classList.remove("on");});
  }

  function patchNav(){
    var orig=window.nav;
    if(typeof orig!=="function"||orig._v4patched)return;
    window.nav=function(id){var r=orig.apply(this,arguments);navUnificado(id);return r;};
    window.nav._v4patched=true;window.nav._orig=orig;
  }

  function setupSidebarDelegation(){
    document.addEventListener("click",function(e){
      var btn=e.target.closest(".sbi[data-mid]");
      if(!btn)return;
      var mid=btn.dataset.mid;if(!mid)return;
      var oc=btn.getAttribute("onclick")||"";
      if(oc.indexOf("nav(")!==-1)return;
      e.stopPropagation();
      if(typeof window.nav==="function")window.nav(mid);else navUnificado(mid);
    },true);
    document.addEventListener("click",function(e){
      var tab=e.target.closest(".ntab[data-mid]");
      if(!tab)return;
      var oc=tab.getAttribute("onclick")||"";
      if(oc.indexOf("nav(")!==-1)return;
      var mid=tab.dataset.mid;if(!mid)return;
      if(typeof window.nav==="function")window.nav(mid);else navUnificado(mid);
    },true);
  }

  function cerrarModalesPorDefecto(){
    document.querySelectorAll(".ov,[id^='mod'],#evpanel").forEach(function(m){
      if(!m.classList.contains("on")&&m.id!=="app")m.style.display="none";
    });
  }

  function fixHoyButton(){
    var b=document.getElementById("ntab-hoy");
    if(b&&!b.dataset.mid){b.dataset.mid="hoy";if(!b.getAttribute("onclick"))b.addEventListener("click",function(){if(typeof window.nav==="function")window.nav("hoy");});}
  }

  function normalizarFuentes(){
    document.querySelectorAll("[style*='font-size']").forEach(function(el){
      var fs=parseInt(el.style.fontSize);if(fs&&fs>16)el.style.fontSize=Math.min(fs,15)+"px";
    });
  }

  function init(){
    inyectarCSS();
    cerrarModalesPorDefecto();
    setupSidebarDelegation();
    fixHoyButton();
    normalizarFuentes();
    var intentos=0;
    var iv=setInterval(function(){
      intentos++;
      if(typeof window.nav==="function"&&!window.nav._v4patched)patchNav();
      var panel=document.body.getAttribute("data-active-panel")||"hoy";
      navUnificado(panel);
      if(intentos>=5||window.nav&&window.nav._v4patched)clearInterval(iv);
    },200);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();
