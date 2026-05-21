/*
  UI-FIXES.JS
  Estabilizador final de navegacion.

  Carga al final del panel y corrige la falla actual: los clicks llegan a nav(),
  pero los paneles quedan ocultos o el area principal queda en blanco.
*/
(function(){
  "use strict";

  var FLEX = { publicaciones:true, calendario:true };
  var ALIAS = {
    agenda:"publicaciones",
    biblioteca:"recursos",
    recurso:"recursos",
    publicacion:"publicaciones",
    guardia:"guardias",
    metrica:"metricas",
    medio:"medios",
    entrevista:"entrevistas",
    contacto:"contactos"
  };

  function norm(id){
    id = String(id || "tablero").trim().toLowerCase();
    return ALIAS[id] || id;
  }

  function displayFor(id){
    return FLEX[id] ? "flex" : "block";
  }

  function panels(){
    var main = document.getElementById("main") || document.querySelector(".content");
    if (!main) return [];
    return Array.prototype.slice.call(main.querySelectorAll(":scope > [id^='p-']"));
  }

  function ensurePanel(id){
    var main = document.getElementById("main") || document.querySelector(".content");
    if (!main) return null;
    var panel = document.getElementById("p-" + id);
    if (!panel && id === "hoy") {
      var tablero = document.getElementById("p-tablero");
      panel = document.createElement("div");
      panel.id = "p-hoy";
      panel.style.display = "none";
      if (tablero && tablero.parentNode) tablero.parentNode.insertBefore(panel, tablero);
      else main.appendChild(panel);
    }
    return panel;
  }

  function buttonId(btn){
    if (!btn) return "";
    var direct = btn.getAttribute("data-mid") || btn.getAttribute("data-nav") || "";
    if (direct) return norm(direct);
    var onclick = btn.getAttribute("onclick") || "";
    var m = onclick.match(/(?:nav|exitFullPanel)\(['"]([^'"]+)['"]/);
    return m ? norm(m[1]) : "";
  }

  function setActiveButtons(id, explicitButton){
    document.querySelectorAll(".ntab,.sbi,.mbn-btn").forEach(function(btn){
      var bid = buttonId(btn);
      var active = bid === id || btn === explicitButton;
      btn.classList.toggle("on", active);
      btn.classList.toggle("mbn-active", active);
    });
  }

  function closeClosedModals(){
    document.querySelectorAll(".ov,.overlay").forEach(function(modal){
      if (!modal.classList.contains("open")) {
        modal.classList.remove("show", "active", "on");
        modal.style.display = "none";
      }
    });
    document.querySelectorAll(".overlay-backdrop,.modal-backdrop,#overlay").forEach(function(overlay){
      overlay.remove();
    });
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

  function showOnly(id, explicitButton){
    id = norm(id);
    var target = ensurePanel(id);
    var list = panels();
    if (!target && list.length) {
      id = "tablero";
      target = document.getElementById("p-tablero") || list[0];
    }

    list.forEach(function(panel){
      var active = panel === target;
      panel.hidden = false;
      panel.removeAttribute("hidden");
      panel.classList.toggle("active", active);
      panel.classList.toggle("show", active);
      panel.classList.remove("open");
      panel.style.display = active ? displayFor(id) : "none";
      panel.style.visibility = active ? "visible" : "";
    });

    if (target) {
      target.hidden = false;
      target.removeAttribute("hidden");
      target.style.display = displayFor(id);
      target.style.visibility = "visible";
    }

    document.body.setAttribute("data-active-panel", id);
    document.body.classList.remove("show-calendario", "show-publicaciones", "show-guardias");
    if (window.innerWidth <= 700 && (id === "calendario" || id === "publicaciones" || id === "guardias")) {
      document.body.classList.add("full-panel", "show-" + id);
    } else if (id !== "calendario" && id !== "publicaciones" && id !== "guardias") {
      document.body.classList.remove("full-panel");
    }

    setActiveButtons(id, explicitButton);
    closeClosedModals();

    var main = document.getElementById("main") || document.querySelector(".content");
    if (main) main.scrollTop = 0;

    setTimeout(function(){
      try { if (id === "tablero" && typeof window.renderKanban === "function") window.renderKanban(); } catch (_e) {}
      try { if (id === "guardias" && typeof window.initGuardias === "function") window.initGuardias(); } catch (_e) {}
      try { if (id === "guardias" && typeof window.renderGuardias === "function") window.renderGuardias(); } catch (_e) {}
      try { if (id === "equipo" && typeof window.renderTeam === "function") window.renderTeam(); } catch (_e) {}
      try { if (id === "metricas" && typeof window.renderMetricas === "function") window.renderMetricas(); } catch (_e) {}
      try { if (id === "medios" && typeof window.renderNoticias === "function") window.renderNoticias(); } catch (_e) {}
      try { if (id === "contactos" && typeof window.renderContactos === "function") window.renderContactos(); } catch (_e) {}
      try { if (id === "recursos" && typeof window.loadRecursos === "function") window.loadRecursos(); } catch (_e) {}
      showOnlyNoRender(id, explicitButton);
    }, 60);
  }

  function showOnlyNoRender(id, explicitButton){
    id = norm(id);
    var target = document.getElementById("p-" + id);
    panels().forEach(function(panel){
      var active = panel === target;
      panel.hidden = false;
      panel.removeAttribute("hidden");
      panel.style.display = active ? displayFor(id) : "none";
      panel.style.visibility = active ? "visible" : "";
      panel.classList.toggle("active", active);
      panel.classList.toggle("show", active);
      panel.classList.remove("open");
    });
    setActiveButtons(id, explicitButton);
    closeClosedModals();
  }

  function installNav(){
    if (typeof window.nav !== "function" || window.nav._stableFinal) return;
    var original = window.nav;
    window.nav = function(id, tab, sb){
      id = norm(id);
      var result;
      try { result = original.apply(this, arguments); } catch (e) { console.warn("[ui-fixes] nav original fallo", e); }
      showOnly(id, sb || tab || null);
      setTimeout(function(){ showOnlyNoRender(id, sb || tab || null); }, 180);
      return result;
    };
    window.nav._stableFinal = true;
    window.nav.__patcheadoActivo = true;
  }

  function run(){
    cleanSidebarText();
    closeClosedModals();
    installNav();
    var active = norm(document.body.getAttribute("data-active-panel") || "hoy");
    if (!document.getElementById("p-" + active)) active = "tablero";
    showOnly(active, null);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once:true });
  else run();

  setTimeout(run, 400);
  setTimeout(run, 1500);
  window.uiFixesRun = run;
  console.log("[ui-fixes] navegacion final estable activa");
})();
