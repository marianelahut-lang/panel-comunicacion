/*
  UI-FIXES.JS
  Estabilizador final de navegacion.

  Este archivo carga ultimo y neutraliza la falla visible actual:
  los clicks llegan a nav(), pero otras capas vuelven a ocultar el panel
  activo o dejan Hoy por encima con display forzado.
*/
(function(){
  "use strict";

  var PANEL_IDS = [
    "hoy","tablero","material","publicaciones","calendario","guardias",
    "equipo","metricas","medios","reclamos","entrevistas","contactos",
    "recursos","biblioteca","agente"
  ];

  var FLEX = { publicaciones:true, calendario:true, guardias:true };
  var ALIAS = {
    agenda:"publicaciones",
    publicacion:"publicaciones",
    publicaciones:"publicaciones",
    guardia:"guardias",
    equipo:"equipo",
    team:"equipo",
    metrica:"metricas",
    metricas:"metricas",
    medio:"medios",
    medios:"medios",
    entrevista:"entrevistas",
    entrevistas:"entrevistas",
    contacto:"contactos",
    contactos:"contactos",
    recurso:"recursos",
    recursos:"recursos",
    biblioteca:"recursos"
  };

  function norm(id){
    id = String(id || "hoy").trim().toLowerCase();
    return ALIAS[id] || id;
  }

  function displayFor(id){
    return FLEX[id] ? "flex" : "block";
  }

  function mainEl(){
    return document.getElementById("main") || document.querySelector(".content");
  }

  function movePanelIntoMain(id){
    var main = mainEl();
    var panel = document.getElementById("p-" + id);
    if (main && panel && panel.parentElement !== main) main.appendChild(panel);
    return panel;
  }

  function repairStructure(){
    var main = mainEl();
    if (!main) return;

    ["recursos","agente"].forEach(movePanelIntoMain);

    var medios = Array.prototype.slice.call(document.querySelectorAll('[id="p-medios"]'));
    medios.forEach(function(el, idx){
      if (idx > 0) el.id = "p-medios-cobertura";
    });

    if (!document.getElementById("p-hoy")) {
      var hoy = document.createElement("div");
      hoy.id = "p-hoy";
      hoy.style.setProperty("display", "none", "important");
      var first = document.getElementById("p-tablero") || main.firstElementChild;
      if (first && first.parentElement === main) main.insertBefore(hoy, first);
      else main.appendChild(hoy);
    }

    cleanSidebarText();
  }

  function panels(){
    repairStructure();
    var main = mainEl();
    if (!main) return [];
    return Array.prototype.slice.call(main.querySelectorAll(":scope > [id^='p-']"));
  }

  function cleanSidebarText(){
    var sidebar = document.querySelector("aside.sb");
    if (!sidebar || typeof NodeFilter === "undefined") return;
    try {
      var walker = document.createTreeWalker(sidebar, NodeFilter.SHOW_TEXT, null, false);
      var node, remove = [];
      while ((node = walker.nextNode())) {
        if (/^\s*Tareas del d\s*$/i.test(node.nodeValue || "")) remove.push(node);
      }
      remove.forEach(function(n){ if (n.parentNode) n.parentNode.removeChild(n); });
    } catch (_e) {}
  }

  function closeClosedModals(){
    document.querySelectorAll(".ov,.overlay").forEach(function(modal){
      if (!modal.classList.contains("open")) {
        modal.classList.remove("show", "active", "on");
        modal.style.setProperty("display", "none", "important");
        modal.setAttribute("aria-hidden", "true");
      }
    });
    document.querySelectorAll(".overlay-backdrop,.modal-backdrop,#overlay").forEach(function(overlay){
      overlay.remove();
    });
  }

  function setPanelState(panel, active, id){
    if (!panel) return;
    var pid = (panel.id || "").replace(/^p-/, "");

    panel.classList.toggle("active", active);
    panel.classList.toggle("show", active);
    panel.classList.remove("open");

    if (active) {
      panel.hidden = false;
      panel.removeAttribute("hidden");
      panel.removeAttribute("aria-hidden");
      panel.style.setProperty("display", displayFor(id), "important");
      panel.style.setProperty("visibility", "visible", "important");
      panel.style.removeProperty("opacity");
    } else {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
      panel.classList.remove("m7-hoy-stable");
      panel.style.setProperty("display", "none", "important");
      panel.style.setProperty("visibility", "hidden", "important");
    }

    if (pid === "hoy" && !active) panel.classList.remove("m7-hoy-stable");
  }

  function buttonId(btn){
    if (!btn) return "";
    var direct = btn.getAttribute("data-mid") || btn.getAttribute("data-nav") || btn.dataset.nav || "";
    if (direct) return norm(direct);
    var onclick = btn.getAttribute("onclick") || "";
    var m = onclick.match(/(?:nav|exitFullPanel)\(['\"]([^'\"]+)['\"]/);
    return m ? norm(m[1]) : "";
  }

  function setActiveButtons(id, explicitButton){
    document.querySelectorAll(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]").forEach(function(btn){
      var active = buttonId(btn) === id || btn === explicitButton;
      btn.classList.toggle("on", active);
      btn.classList.toggle("mbn-active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function callRender(id){
    var map = {
      hoy:["_renderHoy","renderPanelHoyCustom","renderHoyRedisenado"],
      tablero:["renderKanban"],
      material:["renderMaterial"],
      publicaciones:["renderPubDay","renderWeek"],
      calendario:["renderCal","renderCalDay"],
      guardias:["initGuardias","renderGuardias","renderGuardDay"],
      equipo:["renderTeam","renderPersons"],
      metricas:["renderMetricas"],
      medios:["renderNoticias","renderMedioSum","renderMediosList"],
      reclamos:["renderReclamos"],
      entrevistas:["renderEntrevistas"],
      contactos:["renderContactos","renderContactosMediosModulo"],
      recursos:["loadRecursos","renderRecursos"]
    };
    (map[id] || []).forEach(function(fn){
      try { if (typeof window[fn] === "function") window[fn](); } catch (e) { console.warn("[ui-fixes] render fallo", fn, e); }
    });
  }

  function showOnly(id, explicitButton, skipRender){
    id = norm(id);
    repairStructure();

    if (id !== "agente") {
      window._agenteActual = null;
      var agente = document.getElementById("p-agente");
      if (agente) setPanelState(agente, false, id);
    }

    var target = document.getElementById("p-" + id);
    if (!target && id === "biblioteca") target = document.getElementById("p-recursos");
    if (!target) {
      id = "tablero";
      target = document.getElementById("p-tablero") || panels()[0];
    }

    panels().forEach(function(panel){
      setPanelState(panel, panel === target, id);
    });
    setPanelState(target, true, id);

    document.body.setAttribute("data-active-panel", id);
    document.body.classList.remove("show-calendario", "show-publicaciones", "show-guardias");
    if (window.innerWidth <= 700 && (id === "calendario" || id === "publicaciones" || id === "guardias")) {
      document.body.classList.add("full-panel", "show-" + id);
    } else {
      document.body.classList.remove("full-panel");
    }

    setActiveButtons(id, explicitButton);
    closeClosedModals();

    var main = mainEl();
    if (main) main.scrollTop = 0;

    if (!skipRender) {
      setTimeout(function(){
        callRender(id);
        showOnly(id, explicitButton, true);
      }, 30);
      setTimeout(function(){ showOnly(id, explicitButton, true); }, 180);
    }
  }

  function finalNav(id, tab, sb){
    id = norm(id);
    showOnly(id, sb || tab || null, false);
    return false;
  }

  function installNav(){
    window.nav = finalNav;
    window.nav._stableFinal = true;
    window.nav._v4patched = true;
    window.nav._v5patched = true;
    window.nav.__patcheadoActivo = true;
    window.exitFullPanel = function(id){
      document.body.classList.remove("full-panel", "show-calendario", "show-publicaciones", "show-guardias");
      return finalNav(id || document.body.getAttribute("data-active-panel") || "hoy");
    };
  }

  function css(){
    if (document.getElementById("ui-fixes-root-css")) return;
    var st = document.createElement("style");
    st.id = "ui-fixes-root-css";
    st.textContent = [
      "html,body{font-size:13px;line-height:1.38}",
      "button,.btn,.ntab,.sbi{font-size:12px}",
      "input,select,textarea{font-size:13px}",
      ".ptitle,.pgtitle{font-size:16px}",
      "h1{font-size:21px}h2{font-size:18px}h3{font-size:16px}",
      "#p-hoy.m7-hoy-stable .m7-card-head h3{font-size:18px!important}",
      "#p-hoy.m7-hoy-stable .m7-delay-title{font-size:15px!important;line-height:1.25!important}",
      "#p-hoy.m7-hoy-stable .m7-delay-meta{font-size:12px!important}",
      "#p-hoy.m7-hoy-stable .m7-delay-age strong{font-size:26px!important}",
      ".ov:not(.open),.overlay:not(.open){display:none!important;pointer-events:none!important}",
      ".ov.open,.overlay.open{display:flex;pointer-events:auto}",
      "#login{z-index:9999}.ov.open,.overlay.open{z-index:1200}#toast{z-index:2200}.topbar{z-index:100}.sb{z-index:90}#evpanel{z-index:800}",
      ".content{overflow-y:auto;overflow-x:hidden}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function clickCapture(e){
    var btn = e.target.closest(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]");
    if (!btn) return;
    var id = buttonId(btn);
    if (!id) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    finalNav(id, null, btn);
  }

  function run(){
    css();
    installNav();
    repairStructure();
    closeClosedModals();
    var active = norm(document.body.getAttribute("data-active-panel") || "hoy");
    if (!document.getElementById("p-" + active)) active = "hoy";
    showOnly(active, null, false);
  }

  document.addEventListener("click", clickCapture, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once:true });
  else run();

  setTimeout(run, 250);
  setTimeout(run, 900);
  setTimeout(function(){ showOnly(norm(document.body.getAttribute("data-active-panel") || "hoy"), null, true); }, 1800);

  window.uiFixesRun = run;
  console.log("[ui-fixes] navegacion raiz estable activa 2026-05-21c");
})();
