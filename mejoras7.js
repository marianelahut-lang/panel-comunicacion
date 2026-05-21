/* ============================================================
   MEJORAS7.JS - VERSION SEGURA
   ------------------------------------------------------------
   Este archivo reemplaza la estabilizacion agresiva anterior.
   No redibuja el panel Hoy, no intercepta navegacion y no instala
   observers permanentes que provoquen parpadeos.
   ============================================================ */
(function(){
  "use strict";

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function limpiarTextoRoto(){
    var map = {
      "Â·":"·",
      "Ã¡":"á", "Ã©":"é", "Ã­":"í", "Ã³":"ó", "Ãº":"ú", "Ã±":"ñ",
      "Ã":"Á", "Ã‰":"É", "Ã":"Í", "Ã“":"Ó", "Ãš":"Ú", "Ã‘":"Ñ",
      "dÃ­a":"día", "DÃ­a":"Día", "publicaciÃ³n":"publicación", "PublicaciÃ³n":"Publicación",
      "descripciÃ³n":"descripción", "DescripciÃ³n":"Descripción",
      "seleccionÃ¡":"seleccioná", "SeleccionÃ¡":"Seleccioná"
    };
    try{
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      var node, n = 0;
      while((node = walker.nextNode()) && n < 700){
        n++;
        var v = node.nodeValue || "";
        Object.keys(map).forEach(function(k){ v = v.split(k).join(map[k]); });
        node.nodeValue = v;
      }
    }catch(_e){}
  }

  function ocultarRealizada(){
    var kanban = q("#kanban");
    if(!kanban) return;
    qa(".kcol", kanban).forEach(function(col){
      var h = q(".khdr", col);
      if(h && /realizad/i.test(h.textContent || "")) col.style.setProperty("display", "none", "important");
    });
  }

  function mejorarCalendarioBasico(){
    qa("#calwscroll [onclick*='openEvPanel'],#calwscroll [onclick*='editPubItem'],#cal-day-content [onclick*='openEvPanel'],#cal-day-content [onclick*='editPubItem']").forEach(function(card){
      card.style.setProperty("white-space", "normal", "important");
      card.style.setProperty("word-break", "normal", "important");
      card.style.setProperty("overflow-wrap", "break-word", "important");
      card.style.setProperty("font-size", "11px", "important");
      card.style.setProperty("line-height", "1.18", "important");
      card.style.setProperty("min-width", "90px", "important");
      card.style.setProperty("min-height", "32px", "important");
      if(!card.title) card.title = (card.textContent || "").replace(/\s+/g," ").trim();
    });
  }

  function agregarAccesoGenerador(){
    function abrir(){ window.location.href = "generador-flyers.html"; }
    var sb = q("aside.sb");
    if(sb && !q("#sbi-generador-flyers")){
      var sep = document.createElement("div"); sep.className = "div";
      var sec = document.createElement("div"); sec.className = "sb-sec"; sec.textContent = "Herramientas";
      var b = document.createElement("button"); b.id = "sbi-generador-flyers"; b.className = "sbi"; b.type = "button";
      b.innerHTML = '<span>▣</span><span class="sbi-lbl">Generador de flyers</span>';
      b.onclick = abrir;
      sb.appendChild(sep); sb.appendChild(sec); sb.appendChild(b);
    }
  }

  function css(){
    if(q("#mejoras7-safe-css")) return;
    var st = document.createElement("style");
    st.id = "mejoras7-safe-css";
    st.textContent = [
      "#p-hoy{font-size:13px!important}",
      "#p-hoy .m7-card,#m7-hoy-panel{font-size:12px!important}",
      "#kanban{overflow-y:auto!important;overflow-x:auto!important}",
      "#kanban .kbody{overflow-y:auto!important}",
      "#calwscroll{overflow:auto!important}",
      "#calwscroll>div{min-width:1280px!important}",
      "#sbi-generador-flyers{border:1px solid rgba(102,126,234,.18)!important;background:rgba(102,126,234,.08)!important;color:#6d28d9!important;font-weight:800!important}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function run(){
    css();
    limpiarTextoRoto();
    ocultarRealizada();
    mejorarCalendarioBasico();
    agregarAccesoGenerador();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, {once:true});
  else run();
  setTimeout(run, 500);
  setTimeout(run, 1500);

  window.mejoras7SafeRun = run;
  console.log("[mejoras7] version segura cargada");
})();
