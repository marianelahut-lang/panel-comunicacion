/* ============================================================
   MEJORAS7.JS - Panel Comunicacion Tres Arroyos
   Parche final de estabilizacion - 2026-05-20
   ------------------------------------------------------------
   Este archivo NO borra ni migra informacion cargada.
   No toca funcionarios, guardias, equipo, entrevistas ni reclamos.
   Solo limpia cruces visuales del DOM, agrega acceso al generador
   y refuerza renders fragiles despues de que el panel carga.
   ============================================================ */
(function(){
  "use strict";

  var GENERADOR_URL = "generador-flyers.html";

  function ready(fn){
    if(document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escAttr(s){
    return String(s || "").replace(/[&<>\"]/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];
    });
  }

  function toast(msg, type){
    try { if(typeof window.toast === "function") window.toast(msg, type || "ok"); }
    catch(_){}
  }

  /* ------------------------------------------------------------
     1. Limpieza de cruces visibles del HTML base
     ------------------------------------------------------------ */
  function limpiarSidebarFantasma(){
    var sb = q("aside.sb");
    if(!sb) return;

    var walker = document.createTreeWalker(sb, NodeFilter.SHOW_TEXT, null, false);
    var node, borrar = [];
    while((node = walker.nextNode())){
      var txt = (node.nodeValue || "").trim();
      if(/^Tareas del d/i.test(txt)) borrar.push(node);
    }
    borrar.forEach(function(n){ try { n.parentNode.removeChild(n); } catch(_){} });

    var fPanel = document.getElementById("fPanel");
    if(fPanel){
      fPanel.style.display = "none";
      fPanel.style.margin = "4px 8px 6px";
    }

    var sbpersons = document.getElementById("sbpersons");
    if(sbpersons) sbpersons.style.display = "none";
  }

  function limpiarLoginDuplicado(){
    var sel = document.getElementById("lu");
    if(!sel) return;
    var vacios = qa('option[value=""]', sel);
    vacios.forEach(function(opt, idx){ if(idx > 0) opt.remove(); });
  }

  function sincronizarVersionVisible(){
    var meta = q('meta[name="app-version"]');
    var version = meta && meta.content ? meta.content : "";
    if(!version) return;
    qa(".logo-s").forEach(function(el){
      el.textContent = "Muni · Tres Arroyos · " + version;
    });
  }

  function limpiarTextoRotoGeneral(){
    // Corrige un fragmento de CSS/HTML roto que aparece como texto en el panel de agente.
    qa("style").forEach(function(st){
      if(!st.textContent) return;
      st.textContent = st.textContent.replace(/id=\"ag-tab-hoy\"[^{}]*style-fix=\"light\"\.?/g, "");
    });
  }

  /* ------------------------------------------------------------
     2. Acceso al generador de flyers sin tocar datos del panel
     ------------------------------------------------------------ */
  function abrirGenerador(){ window.location.href = GENERADOR_URL; }
  window.abrirGeneradorFlyers = abrirGenerador;

  function crearIconoFlyer(){
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
      var sep = document.createElement("div");
      sep.className = "div m7-generator-sep";

      var sec = document.createElement("div");
      sec.className = "sb-sec m7-generator-sec";
      sec.textContent = "Herramientas";

      var b = document.createElement("button");
      b.id = "sbi-generador-flyers";
      b.className = "sbi";
      b.type = "button";
      b.innerHTML = crearIconoFlyer() + "Generador de flyers";
      b.title = "Abrir generador de flyers municipales";
      b.onclick = abrirGenerador;

      sb.appendChild(sep);
      sb.appendChild(sec);
      sb.appendChild(b);
    }

    var mobile = document.getElementById("mobile-bottom-nav");
    if(mobile && !document.getElementById("mbn-generador-flyers")){
      var mb = document.createElement("button");
      mb.id = "mbn-generador-flyers";
      mb.className = "mbn-btn";
      mb.type = "button";
      mb.innerHTML = crearIconoFlyer() + "<span>Flyers</span>";
      mb.onclick = abrirGenerador;
      mobile.appendChild(mb);
    }
  }

  /* ------------------------------------------------------------
     3. Defensa contra parches duplicados y renders fragiles
     ------------------------------------------------------------ */
  function patchRealtimeDuplicados(){
    function aplicar(db){
      if(!db || typeof db.channel !== "function" || db._m7channelPatched) return !!(db && db._m7channelPatched);
      db._m7channelPatched = true;
      var activos = {};
      var orig = db.channel.bind(db);
      db.channel = function(name){
        if(activos[name]){
          var noop = { on:function(){ return noop; }, subscribe:function(){ return noop; }, unsubscribe:function(){} };
          return noop;
        }
        activos[name] = true;
        return orig(name);
      };
      return true;
    }
    if(aplicar(window.db)) return;
    var n = 0;
    var iv = setInterval(function(){
      n++;
      var dbx = window.db || (typeof db !== "undefined" ? db : null);
      if(aplicar(dbx) || n > 30) clearInterval(iv);
    }, 300);
  }

  function patchRenderKanbanSeguro(){
    var orig = window.renderKanban;
    if(typeof orig !== "function" || orig._m7safe) return;
    window.renderKanban = function(){
      if(!document.getElementById("kanban")) return;
      if(typeof tasks === "undefined" || !Array.isArray(tasks)) return;
      var r = orig.apply(this, arguments);
      setTimeout(ocultarColumnaRealizada, 40);
      return r;
    };
    window.renderKanban._m7safe = true;
  }

  function ocultarColumnaRealizada(){
    var kanban = document.getElementById("kanban");
    if(!kanban) return;
    qa(".kcol", kanban).forEach(function(col){
      var hdr = q(".khdr", col);
      if(hdr && /realizada/i.test(hdr.textContent || "")) col.style.display = "none";
    });
  }

  function repararAgendaHoyPostGCal(){
    var gcBtn = q(".gcbtn");
    if(!gcBtn || gcBtn._m7gcalObserved) return;
    gcBtn._m7gcalObserved = true;
    var done = false;
    var mo = new MutationObserver(function(){
      var txt = gcBtn.textContent || "";
      if(!done && /GCal\s*[·.]\s*\d+\s*ev/i.test(txt)){
        done = true;
        var phoy = document.getElementById("p-hoy");
        if(phoy && phoy.style.display !== "none" && typeof window._renderHoy === "function"){
          setTimeout(window._renderHoy, 250);
        }
        setTimeout(function(){ done = false; }, 8000);
      }
    });
    mo.observe(gcBtn, {childList:true, subtree:true, characterData:true});
  }

  function ocultarDiasPasadosEnGuardias(){
    var bloque = document.getElementById("m1-pubs-guardias");
    if(!bloque) return;
    var ahora = new Date();
    var hoy = ahora.getFullYear() + "-" + String(ahora.getMonth()+1).padStart(2,"0") + "-" + String(ahora.getDate()).padStart(2,"0");
    qa("div[style*='margin-bottom']", bloque).forEach(function(block){
      var hdr = q("div[style*='text-transform']", block);
      if(!hdr) return;
      var m = (hdr.textContent || "").match(/(\d{1,2})\/(\d{1,2})/);
      if(!m) return;
      var fecha = ahora.getFullYear() + "-" + String(parseInt(m[2],10)).padStart(2,"0") + "-" + String(parseInt(m[1],10)).padStart(2,"0");
      if(fecha < hoy) block.style.display = "none";
    });
  }

  function patchNavPostRender(){
    var orig = window.nav;
    if(typeof orig !== "function" || orig._m7post) return;
    window.nav = function(id){
      var r = orig.apply(this, arguments);
      setTimeout(function(){
        limpiarCruces();
        if(id === "hoy" && typeof window._renderHoy === "function") window._renderHoy();
        if(id === "guardias") ocultarDiasPasadosEnGuardias();
        if(id === "tablero") ocultarColumnaRealizada();
      }, 120);
      return r;
    };
    window.nav._m7post = true;
  }

  /* ------------------------------------------------------------
     4. CSS de estabilizacion visual
     ------------------------------------------------------------ */
  function inyectarCSS(){
    if(document.getElementById("m7-final-css")) return;
    var st = document.createElement("style");
    st.id = "m7-final-css";
    st.textContent = [
      "#ntab-generador-flyers{background:rgba(102,126,234,.12)!important;color:#c4b5fd!important;border-radius:8px!important;padding:6px 12px!important}",
      "#ntab-generador-flyers:hover{background:rgba(102,126,234,.22)!important;color:#fff!important}",
      "#sbi-generador-flyers{border:1px solid rgba(102,126,234,.18)!important;background:rgba(102,126,234,.08)!important;color:#6d28d9!important;font-weight:800!important}",
      "#sbi-generador-flyers:hover{background:rgba(102,126,234,.15)!important}",
      "body.dark #sbi-generador-flyers{background:rgba(167,139,250,.12)!important;color:#c4b5fd!important;border-color:rgba(167,139,250,.24)!important}",
      "#mbn-generador-flyers svg{width:18px;height:18px;margin:0 auto 2px;display:block}",
      "#fPanel,#sbpersons{display:none!important}",
      ".m7-generator-sec{margin-top:10px!important}",
      "aside.sb{overflow-x:hidden}",
      ".ag-task-check{width:18px!important;height:18px!important;cursor:pointer!important;flex-shrink:0!important;margin-top:1px!important;accent-color:var(--acc,#667eea)!important}",
      "body.dark #m1-pubs-guardias [data-pub-id] > div > div:first-child{color:#f1f5f9!important}",
      "body.dark #m1-pubs-guardias [data-pub-id] > span:first-child{color:#c4b5fd!important}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function limpiarCruces(){
    limpiarSidebarFantasma();
    limpiarLoginDuplicado();
    sincronizarVersionVisible();
    limpiarTextoRotoGeneral();
    agregarAccesoGenerador();
    ocultarColumnaRealizada();
    ocultarDiasPasadosEnGuardias();
    repararAgendaHoyPostGCal();
  }

  function init(){
    inyectarCSS();
    patchRealtimeDuplicados();
    patchRenderKanbanSeguro();
    patchNavPostRender();
    limpiarCruces();

    var n = 0;
    var iv = setInterval(function(){
      n++;
      patchRenderKanbanSeguro();
      patchNavPostRender();
      limpiarCruces();
      if(n >= 20) clearInterval(iv);
    }, 500);

    try{
      var obs = new MutationObserver(function(){
        if(obs._m7pending) return;
        obs._m7pending = true;
        setTimeout(function(){ obs._m7pending = false; limpiarCruces(); }, 150);
      });
      obs.observe(document.body, {childList:true, subtree:true});
    } catch(_){}

    console.log("[mejoras7] Parche final cargado: panel estable + acceso generador");
  }

  ready(init);
})();
