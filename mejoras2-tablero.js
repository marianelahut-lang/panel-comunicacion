/* ============================================================
   MEJORAS2-TABLERO.JS - Panel Comunicación Tres Arroyos
   Capa de fix CSS para el Tablero (Kanban)
   ------------------------------------------------------------
   Objetivo:
     · Arreglar el scroll del Kanban (problema principal)
     · Headers de columna pegados arriba ("sticky") al scrollear
     · Cada columna con scroll vertical interno
     · Scroll horizontal del kanban estable
     · Responsive mobile/tablet/desktop
   ------------------------------------------------------------
   NO modifica:
     · Lógica de tareas
     · Datos en Supabase
     · Funciones renderKanban() ni openTaskMod()
     · Estructura HTML (solo agrega CSS sobreimpreso)
   ------------------------------------------------------------
   Instalación: agregar en index.html antes de </body>:
     <script src="mejoras2.js" defer></script>
     <script src="mejoras2-tablero.js" defer></script>   <!-- nuevo -->
   ============================================================ */
(function(){
  "use strict";

  var CSS_ID = "m2-tablero-css";

  // ─── CSS: fix de scroll y layout del tablero ──────────────
  function inyectarCSS(){
    if(document.getElementById(CSS_ID)) return;

    var css = [
      // ── Body con flag "tablero activo" ──
      // Cuando el tablero está visible, el contenedor padre no scrollea
      // (cada columna del kanban tiene su propio scroll interno).
      "body.m2-tab-active .content{overflow:hidden!important;padding-bottom:0!important}",

      // ── Tablero: ocupa toda la altura disponible ──
      "#p-tablero{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;height:100%!important;overflow:hidden}",
      "#p-tablero > .ptop{flex-shrink:0!important;margin-bottom:8px!important}",

      // ── Kanban: scroll horizontal entre columnas, sin vertical ──
      "#p-tablero > .kanban{flex:1 1 auto!important;min-height:0!important;height:auto!important;max-height:none!important;overflow-x:auto!important;overflow-y:hidden!important;align-items:stretch!important;padding:4px 2px 8px 2px!important;gap:12px!important}",

      // ── Columnas: ancho fijo, altura completa, contienen header+body ──
      ".kanban > .kcol{display:flex!important;flex-direction:column!important;flex-shrink:0!important;width:270px!important;max-width:270px!important;height:100%!important;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04)}",
      "body.dark .kanban > .kcol{background:#1f2937!important;border-color:#374151!important}",

      // ── Header de columna: sticky + sombra al scrollear ──
      ".kanban > .kcol > .khdr{flex-shrink:0!important;position:sticky;top:0;z-index:4;padding:10px 12px;border-bottom:1px solid #e5e7eb;background:inherit;display:flex;justify-content:space-between;align-items:center;gap:8px}",
      "body.dark .kanban > .kcol > .khdr{border-bottom-color:#374151}",

      // ── Body: scroll vertical interno por columna ──
      ".kanban > .kcol > .kbody{flex:1 1 auto!important;overflow-y:auto!important;overflow-x:hidden!important;min-height:0!important;padding:8px 8px 4px 8px!important;scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent}",

      // Scrollbar custom (webkit)
      ".kanban > .kcol > .kbody::-webkit-scrollbar{width:6px}",
      ".kanban > .kcol > .kbody::-webkit-scrollbar-track{background:transparent}",
      ".kanban > .kcol > .kbody::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}",
      ".kanban > .kcol > .kbody::-webkit-scrollbar-thumb:hover{background:#94a3b8}",
      "body.dark .kanban > .kcol > .kbody::-webkit-scrollbar-thumb{background:#4b5563}",

      // ── Botón "+ Agregar" pegado abajo de cada columna ──
      ".kanban > .kcol > .kbody > .kadd{position:sticky!important;bottom:-4px;margin-top:6px;z-index:2;padding-top:10px!important;background:linear-gradient(to bottom,rgba(249,250,251,0) 0%,#f9fafb 35%)!important}",
      "body.dark .kanban > .kcol > .kbody > .kadd{background:linear-gradient(to bottom,rgba(31,41,55,0) 0%,#1f2937 35%)!important}",

      // ── Tarjetas: spacing entre ellas ──
      ".kanban .tc{margin-bottom:6px}",
      ".kanban .tc:last-of-type{margin-bottom:2px}",

      // ── Scrollbar horizontal del kanban ──
      "#p-tablero > .kanban::-webkit-scrollbar{height:8px}",
      "#p-tablero > .kanban::-webkit-scrollbar-track{background:transparent}",
      "#p-tablero > .kanban::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px}",
      "#p-tablero > .kanban::-webkit-scrollbar-thumb:hover{background:#9ca3af}",
      "body.dark #p-tablero > .kanban::-webkit-scrollbar-thumb{background:#4b5563}",

      // ── TABLET (769–1100px): columnas un poco más finas ──
      "@media (min-width:769px) and (max-width:1100px){",
      "  .kanban > .kcol{width:240px!important;max-width:240px!important}",
      "}",

      // ── MOBILE (≤768px): columnas se apilan con max-height cada una ──
      "@media (max-width:768px){",
      "  body.m2-tab-active .content{overflow-y:auto!important}",
      "  #p-tablero{overflow:visible!important;height:auto!important}",
      "  #p-tablero > .kanban{flex-direction:column!important;overflow-x:hidden!important;overflow-y:visible!important;height:auto!important;padding:0!important;gap:10px!important}",
      "  .kanban > .kcol{width:100%!important;max-width:100%!important;height:auto!important;max-height:460px}",
      "  .kanban > .kcol > .kbody{max-height:380px}",
      "}",

      // ── Asegurar que el sidebar y main no se rompan ──
      "body.m2-tab-active #main{display:flex;flex-direction:column;min-height:0}"
    ].join("\n");

    var s = document.createElement("style");
    s.id = CSS_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ─── ESTADO: aplica clase al body si el tablero está visible ──
  function actualizarEstado(){
    var tab = document.getElementById("p-tablero");
    if(!tab){
      document.body.classList.remove("m2-tab-active");
      return;
    }
    // El tablero está "activo" si su display no es none Y si está en pantalla
    var styleHidden = tab.style.display === "none";
    var enPantalla  = tab.offsetParent !== null;
    var activo = !styleHidden && enPantalla;
    document.body.classList.toggle("m2-tab-active", activo);
  }

  // ─── INICIALIZACIÓN ───────────────────────────────────────
  function iniciar(){
    inyectarCSS();
    actualizarEstado();

    // Observer: cuando cambia el style del tablero (display:none ↔ block)
    var tab = document.getElementById("p-tablero");
    if(tab){
      var mo = new MutationObserver(actualizarEstado);
      mo.observe(tab, { attributes: true, attributeFilter: ["style"] });
    }

    // Backup: re-evaluar tras cualquier click (cambio de pestaña por nav())
    document.addEventListener("click", function(){
      setTimeout(actualizarEstado, 80);
    }, true);

    // Backup adicional: re-evaluar al cambiar tamaño (mobile rotación)
    window.addEventListener("resize", actualizarEstado);

    console.log("[mejoras2-tablero] CSS de scroll aplicado");
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
