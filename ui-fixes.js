/*
  UI-FIXES.JS  v5.0
  Panel Comunicacion - Municipalidad Tres Arroyos
  CORRECCION INTEGRAL DE RAIZ
  - Navegacion limpia (una seccion visible a la vez)
  - Modales cerrados por defecto
  - Tipografia compacta y profesional
  - Z-index y overlays corregidos
  - Topbar texto limpio
*/
(function(){
   "use strict";

 /* ===== CONFIGURACION ===== */
 var PANEL_IDS = [
      "hoy","tablero","material","publicaciones","calendario",
      "guardias","equipo","contactos","entrevistas","metricas",
      "medios","reclamos","recursos","agente","biblioteca"
    ];

 var DISPLAY_MAP = {
      publicaciones:"flex",
      calendario:"flex"
 };

 function activeDisplay(id){
      return DISPLAY_MAP[id] || "block";
 }

 var ALIAS_MAP = {
      publicaciones:"publicaciones",
      publicacion:"publicaciones",
      agenda:"publicaciones",
      "agenda-de-publicaciones":"publicaciones",
      guardias:"guardias",
      guardia:"guardias",
      equipo:"equipo",
      team:"equipo",
      metricas:"metricas",
      metrica:"metricas",
      medios:"medios",
      medio:"medios",
      entrevistas:"entrevistas",
      entrevista:"entrevistas",
      contactos:"contactos",
      contacto:"contactos",
      recursos:"recursos",
      recurso:"recursos",
      biblioteca:"biblioteca"
 };

 function normalizarId(id){
      if (!id) return "hoy";
      var lower = String(id).toLowerCase().trim();
      return ALIAS_MAP[lower] || lower;
 }

 /* ===== CSS BASE ===== */
 function inyectarCSS(){
      var old = document.getElementById("ui-fixes-css-v5");
      if (old) old.remove();

     var hideAll = PANEL_IDS.map(function(id){
            return "body[data-active-panel] #p-"+id;
     }).join(",");

     var showEach = PANEL_IDS.map(function(id){
            var d = activeDisplay(id);
            return 'body[data-active-panel="'+id+'"] #p-'+id+'{display:'+d+'!important;visibility:visible!important}';
     }).join("\n");

     var css = [
            /* --- Ocultar todas las secciones cuando hay panel activo --- */
            hideAll + "{display:none!important}",

            /* --- Mostrar solo la seccion activa --- */
            showEach,

            /* --- Topbar / Fuentes --- */
            "html,body{font-size:13px!important;line-height:1.4}",
            ".ntab{font-size:12px!important;font-weight:600!important;padding:4px 10px!important}",
            ".sbi{font-size:12px!important;font-weight:600!important}",
            ".ptitle,.pgtitle{font-size:15px!important;font-weight:700!important}",
            ".psub{font-size:12px!important;color:#6b7280}",
            "h1{font-size:20px!important;font-weight:700!important}",
            "h2{font-size:17px!important;font-weight:700!important}",
            "h3{font-size:15px!important;font-weight:600!important}",
            "h4{font-size:13px!important;font-weight:600!important}",
            "button{font-size:12px!important}",
            "input,select,textarea{font-size:13px!important}",
            ".card,.tc,.mcard,.tmcard{font-size:12px!important}",
            ".tc-t{font-size:11px!important;font-weight:500!important}",

            /* --- Modales cerrados por defecto --- */
            ".ov{display:none!important}",
            ".ov.open{display:flex!important}",
            ".ov.show{display:flex!important}",
            "#modTask:not(.open){display:none!important}",
            "#modPub:not(.open){display:none!important}",
            "#modAg:not(.open){display:none!important}",
            "#modEquipo:not(.open){display:none!important}",
            "#modProgram:not(.open){display:none!important}",
            "#modStats:not(.open){display:none!important}",
            "#modNoticia:not(.open){display:none!important}",
            "#modSettings:not(.open){display:none!important}",
            "#modEntrevista:not(.open){display:none!important}",
            "#modBriefing:not(.open){display:none!important}",
            "#modContacto:not(.open){display:none!important}",
            "#modMasiva:not(.open){display:none!important}",

            /* --- Z-index jerarquia limpia --- */
            "#login{z-index:9999!important}",
            ".ov.open{z-index:1000!important}",
            "#toast{z-index:2000!important}",
            ".topbar{z-index:100!important}",
            ".sb{z-index:90!important}",
            "#evpanel{z-index:800!important}",
            ".mob-menu{z-index:300!important}",

            /* --- Topbar limpio --- */
            ".logo-meta{display:none!important}",
            ".app-ver{font-size:10px!important;opacity:.7}",

    /* --- Sidebar activo --- */
            ".sbi.on{background:#ede9fe!important;color:#6d28d9!important;border-left:3px solid #7c3aed!important}",
            ".ntab.on{background:#f3f4f6!important;color:#111827!important;border-bottom:2px solid #6d28d9!important}",

            /* --- Responsive --- */
            "@media(max-width:768px){",
            ".sb{width:200px!important}",
            ".ntabs{overflow-x:auto!important;flex-wrap:nowrap!important}",
            ".ntab{white-space:nowrap!important;flex-shrink:0!important}",
            "}",

            /* --- Evitar scrollbars bloqueantes --- */
            ".content{overflow-y:auto!important;overflow-x:hidden!important}"

          ].join("\n");

     var st = document.createElement("style");
      st.id = "ui-fixes-css-v5";
      st.textContent = css;
      document.head.appendChild(st);
 }

 /* ===== NAVEGACION UNIFICADA ===== */
 function navUnificado(panelId, clickedEl){
      var id = normalizarId(panelId);

     /* 1. Ocultar todas las secciones */
     PANEL_IDS.forEach(function(pid){
            var panel = document.getElementById("p-"+pid);
            if (panel){
                     panel.hidden = true;
                     panel.style.display = "none";
            }
     });

     /* 2. Mostrar la seccion solicitada */
     var target = document.getElementById("p-"+id);
      if (target){
             target.hidden = false;
             target.style.display = activeDisplay(id);
      }

     /* 3. Actualizar data-attribute en body */
     document.body.setAttribute("data-active-panel", id);

     /* 4. Actualizar estado activo en botones de topbar */
     var allNtabs = document.querySelectorAll(".ntab");
      allNtabs.forEach(function(btn){
             var onclick = btn.getAttribute("onclick") || btn.dataset.nav || "";
             var match = onclick.match(/nav\(['"]([^'"]+)['"]/);
             if (match){
                      var btnId = normalizarId(match[1]);
                      if (btnId === id){
                                 btn.classList.add("on");
                      } else {
                                 btn.classList.remove("on");
                      }
             } else {
                      btn.classList.remove("on");
             }
      });
      /* Activar Hoy si aplica */
     var hoyBtn = document.getElementById("ntab-hoy");
      if (hoyBtn && id === "hoy") hoyBtn.classList.add("on");

     /* 5. Actualizar sidebar */
     var allSbi = document.querySelectorAll(".sbi");
      allSbi.forEach(function(btn){
             var onclick = btn.getAttribute("onclick") || btn.dataset.nav || "";
             var match = onclick.match(/nav\(['"]([^'"]+)['"]/);
             if (match){
                      var btnId = normalizarId(match[1]);
                      if (btnId === id){
                                 btn.classList.add("on");
                      } else {
                                 btn.classList.remove("on");
                      }
             } else {
                      btn.classList.remove("on");
             }
      });

     /* 6. Cerrar cualquier menu mobile abierto */
     var mobMenu = document.querySelector(".mob-menu, .mobile-menu, #mob-menu");
      if (mobMenu) mobMenu.classList.remove("open","show","active");

     /* 7. Scroll al top de la seccion */
     var contentEl = document.getElementById("main") || document.querySelector(".content");
      if (contentEl) contentEl.scrollTop = 0;

     console.log("[ui-fixes v5] nav ->", id);
 }

 /* ===== PARCHEAR FUNCION nav() GLOBAL ===== */
 function patchNav(){
      var original = window.nav;
      window.nav = function(panelId, clickedEl, extra){
             navUnificado(panelId, clickedEl);
             /* Llamar a la funcion original para logica extra (calendario, etc.) */
             if (typeof original === "function"){
                      try { original.call(this, panelId, clickedEl, extra); } catch(e){}
             }
      };
      window.nav._v5patched = true;
      console.log("[ui-fixes v5] nav() parchada");
 }

 /* ===== CERRAR TODOS LOS MODALES ===== */
 function cerrarTodosModales(){
      var modales = document.querySelectorAll(".ov, [id^='mod']");
      modales.forEach(function(m){
             m.classList.remove("open","show","active");
             if (m.classList.contains("ov") || m.id.startsWith("mod")){
                      m.style.display = "none";
             }
      });
      /* Limpiar overlay residual */
     var overlays = document.querySelectorAll(".overlay-backdrop, .modal-backdrop, #overlay");
      overlays.forEach(function(o){ o.remove(); });
      console.log("[ui-fixes v5] modales cerrados");
 }

 /* ===== CORREGIR TOPBAR ===== */
 function corregirTopbar(){
      /* Buscar el elemento con "Â·" (encoding roto) */
     var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while((node = walker.nextNode())){
             if(node.nodeValue && node.nodeValue.includes("Â·")){
                      node.nodeValue = node.nodeValue.replace(/Â·/g, "·");
             }
             if(node.nodeValue && node.nodeValue.includes("Ã©")){
                      node.nodeValue = node.nodeValue.replace(/Ã©/g, "é");
             }
             if(node.nodeValue && node.nodeValue.includes("Ã³")){
                      node.nodeValue = node.nodeValue.replace(/Ã³/g, "ó");
             }
             if(node.nodeValue && node.nodeValue.includes("Ã±")){
                      node.nodeValue = node.nodeValue.replace(/Ã±/g, "ñ");
             }
      }
 }

 /* ===== INICIALIZACION ===== */
 function init(){
      inyectarCSS();
      cerrarTodosModales();
      corregirTopbar();

     /* Parchear nav si ya existe, sino esperar */
     if (typeof window.nav === "function" && !window.nav._v5patched){
            patchNav();
     }

     /* Asegurar que la seccion activa este visible */
     var active = document.body.getAttribute("data-active-panel");
      if (!active){
             /* Activar Hoy por defecto */
        navUnificado("hoy", null);
      } else {
             navUnificado(active, null);
      }
 }

 /* ===== DELEGACION DE CLICKS EN EL DOCUMENTO ===== */
 document.addEventListener("click", function(e){
      var btn = e.target.closest(".sbi, .ntab, [data-nav]");
      if (!btn) return;

                             var onclick = btn.getAttribute("onclick") || "";
      var datanav = btn.getAttribute("data-nav") || "";

                             var match = onclick.match(/nav\(['"]([^'"]+)['"]/);
      if (match){
             e.preventDefault();
             e.stopPropagation();
             navUnificado(match[1], btn);
             return;
      }
      if (datanav){
             e.preventDefault();
             e.stopPropagation();
             navUnificado(datanav, btn);
             return;
      }
 }, true);

 /* ===== OBSERVER: cuando nav() se define despues ===== */
 var navCheckInterval = setInterval(function(){
      if (typeof window.nav === "function" && !window.nav._v5patched){
             patchNav();
             clearInterval(navCheckInterval);
      }
 }, 100);
   setTimeout(function(){ clearInterval(navCheckInterval); }, 10000);

 /* ===== ARRANQUE ===== */
 if (document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", function(){
             setTimeout(init, 50);
      });
 } else {
      setTimeout(init, 50);
 }

})();
