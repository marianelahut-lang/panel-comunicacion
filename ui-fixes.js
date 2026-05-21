/*
  UI-FIXES.JS
  Capa de compatibilidad no invasiva.

  No reemplaza nav(), no intercepta clicks y no fuerza display con !important.
  Solo limpia overlays cerrados, texto suelto del sidebar y atributos hidden
  residuales que impedian abrir los modulos del panel.
*/
(function(){
  "use strict";

  var MODAL_SELECTOR = ".ov, .overlay";
  var PANEL_SELECTOR = "#main > [id^='p-']";

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

  function unlockPanels(){
    document.querySelectorAll(PANEL_SELECTOR).forEach(function(panel){
      panel.hidden = false;
      panel.removeAttribute("hidden");
      panel.classList.remove("open");
    });
  }

  function visiblePanelCount(){
    var count = 0;
    document.querySelectorAll(PANEL_SELECTOR).forEach(function(panel){
      if (panel.style.display && panel.style.display !== "none") count++;
    });
    return count;
  }

  function ensureOneVisible(){
    unlockPanels();
    if (visiblePanelCount() > 0) return;
    var fallback = document.getElementById("p-tablero");
    if (fallback) fallback.style.display = "block";
  }

  function patchNavAfterRender(){
    if (typeof window.nav !== "function" || window.nav._uiUnlockPatched) return;
    var original = window.nav;
    window.nav = function(){
      var result = original.apply(this, arguments);
      setTimeout(function(){
        unlockPanels();
        closeDefaultModals();
      }, 0);
      setTimeout(function(){
        unlockPanels();
        closeDefaultModals();
      }, 80);
      return result;
    };
    window.nav._uiUnlockPatched = true;
  }

  function run(){
    cleanSidebarText();
    closeDefaultModals();
    ensureOneVisible();
    patchNavAfterRender();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  setTimeout(run, 300);
  setTimeout(run, 1200);
  window.uiFixesRun = run;
  console.log("[ui-fixes] panel unlock activo");
})();
