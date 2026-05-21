/*
  UI-FIXES.JS
  Capa de compatibilidad no invasiva.

  Este archivo queda cargado por versiones anteriores de index.html, pero ya no
  reemplaza nav(), no intercepta clicks y no fuerza display con !important.
  La navegacion y la visibilidad pertenecen al codigo principal del panel.
*/
(function(){
  "use strict";

  var MODAL_SELECTOR = ".ov, .overlay";

  function closeDefaultModals(){
    document.querySelectorAll(MODAL_SELECTOR).forEach(function(modal){
      if (!modal.classList.contains("open")) {
        modal.classList.remove("show", "active", "on");
        modal.style.display = "none";
      }
    });
    document.querySelectorAll(".overlay-backdrop, .modal-backdrop, #overlay").forEach(function(overlay){
      overlay.remove();
    });
  }

  function cleanSidebarText(){
    var sidebar = document.querySelector("aside.sb");
    if (!sidebar || typeof NodeFilter === "undefined") return;
    try {
      var walker = document.createTreeWalker(sidebar, NodeFilter.SHOW_TEXT, null, false);
      var nodes = [];
      var node;
      while ((node = walker.nextNode())) {
        if (/^\s*Tareas del d\s*$/i.test(node.nodeValue || "")) nodes.push(node);
      }
      nodes.forEach(function(textNode){
        if (textNode.parentNode) textNode.parentNode.removeChild(textNode);
      });
    } catch (_e) {}
  }

  function normalizeInitialPanels(){
    var main = document.getElementById("main");
    if (!main) return;
    var active = document.body.getAttribute("data-active-panel") || "tablero";
    var panels = Array.prototype.slice.call(main.querySelectorAll(":scope > [id^='p-']"));
    var hasActive = panels.some(function(panel){ return panel.id === "p-" + active; });
    if (!hasActive) active = "tablero";
    panels.forEach(function(panel){
      var isActive = panel.id === "p-" + active;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
      panel.classList.toggle("show", isActive);
      panel.classList.remove("open");
      panel.style.display = isActive ? ((active === "calendario" || active === "publicaciones") ? "flex" : "block") : "none";
      panel.style.visibility = isActive ? "visible" : "";
    });
    document.body.setAttribute("data-active-panel", active);
  }

  function run(){
    cleanSidebarText();
    closeDefaultModals();
    normalizeInitialPanels();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  window.uiFixesRun = run;
  console.log("[ui-fixes] compatibilidad no invasiva activa");
})();
