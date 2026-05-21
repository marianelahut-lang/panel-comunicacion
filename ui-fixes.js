/* ════════════════════════════════════════════════════════════════
   UI-FIXES.JS  ·  Panel de Comunicación — Municipalidad de Tres Arroyos
   ────────────────────────────────────────────────────────────────
   Soluciona los siguientes problemas reportados:

   1) Paneles que quedan "suspendidos" o superpuestos al cambiar
      entre secciones (Guardia, Publicaciones, Calendario).
   2) Modales que bloquean la interacción.
   3) Tipografías desproporcionadas (números muy grandes en mobile,
      títulos demasiado pesados).
   4) z-index inconsistentes entre overlays, modales y full-panels.
   5) overflow/scroll dobles o inestables.
   6) Estados pegados al pasar de mobile a desktop por resize.
   7) Sidebar/bottom-nav que aparece donde no corresponde.

   ────────────────────────────────────────────────────────────────
   NO modifica datos. NO toca Supabase. NO reescribe funciones.
   Solo inyecta CSS de override y aplica parches no destructivos
   a window.nav() y a eventos del window.
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════════════════════════════════
     CSS DE OVERRIDES
     ──────────────────────────────────────────────────────────── */
  var CSS = ""
    /* ─── 1. JERARQUÍA Z-INDEX ESTABLE ──────────────────────── */
    + "/* Z-INDEX: login(9999) > toast(9998) > mobile-bn(9000) > modales(5000) > evpanel(400) > full-panel(450) */\n"
    + ".toast{z-index:9998 !important}\n"
    + ".ov,.overlay{z-index:5000 !important}\n"
    + "#evpanel{z-index:400 !important}\n"

    /* ─── 2. LAYOUT GENERAL — UN SOLO SCROLL ────────────────── */
    + "html,body{overflow:hidden !important;height:100% !important;margin:0 !important}\n"
    + ".body{position:relative;isolation:isolate}\n"
    + ".content{overflow-y:auto !important;overflow-x:hidden !important;position:relative}\n"

    /* ─── 3. PANELES INACTIVOS REALMENTE OCULTOS ────────────── */
    /* Defensa contra estados inconsistentes: si tiene display:none inline,
       que NUNCA se vea por más !important que tenga otra regla */
    + "[id^=\"p-\"][style*=\"display:none\"],[id^=\"p-\"][style*=\"display: none\"]{display:none !important;visibility:hidden !important}\n"

    /* ─── 4. DESKTOP: SIN POSITION:FIXED EN PANELES ─────────── */
    /* En desktop, NUNCA aplicar comportamiento mobile aunque las clases
       hayan quedado pegadas por un resize */
    + "@media (min-width:701px){\n"
    + "  body.full-panel #p-calendario,body.full-panel #p-publicaciones,body.full-panel #p-guardias,\n"
    + "  body.show-calendario #p-calendario,body.show-publicaciones #p-publicaciones,body.show-guardias #p-guardias{\n"
    + "    position:static !important;top:auto !important;left:auto !important;right:auto !important;bottom:auto !important;\n"
    + "    width:auto !important;height:100% !important;z-index:auto !important;padding:0 !important\n"
    + "  }\n"
    /*   Sidebar siempre visible en desktop */
    + "  body.full-panel .sb,body.show-calendario .sb,body.show-publicaciones .sb,body.show-guardias .sb{\n"
    + "    display:block !important\n"
    + "  }\n"
    /*   Mobile bottom nav NUNCA en desktop */
    + "  #mobile-bottom-nav,#m4-mobilebar{display:none !important}\n"
    + "}\n"

    /* ─── 5. MOBILE: FULL-PANEL CON Z-INDEX CONTENIDO ───────── */
    + "@media (max-width:700px){\n"
    /*   Bajar z-index de full-panel para que NO supere a los modales */
    + "  body.show-calendario #p-calendario,body.show-publicaciones #p-publicaciones,body.show-guardias #p-guardias{\n"
    + "    z-index:450 !important\n"
    + "  }\n"
    /*   Safe area iOS para bottom nav */
    + "  #mobile-bottom-nav{padding-bottom:env(safe-area-inset-bottom,0) !important;height:calc(56px + env(safe-area-inset-bottom,0)) !important}\n"
    + "}\n"

    /* ─── 6. EVPANEL: NO BLOQUEAR CUANDO ESTÁ CERRADO ───────── */
    + "#evpanel[style*=\"display:none\"],#evpanel[style*=\"display: none\"]{visibility:hidden !important;pointer-events:none !important}\n"

    /* ─── 7. TIPOGRAFÍAS BALANCEADAS — DESKTOP ──────────────── */
    + ".ptitle{font-size:16px !important;line-height:1.25 !important;font-weight:700 !important}\n"
    + ".psub{font-size:11px !important;line-height:1.35 !important}\n"
    + ".wnum{font-size:14px !important}\n"
    + ".wdc.wdt .wnum{font-size:11px !important}\n"
    + ".mod-t{font-size:15px !important;line-height:1.3 !important}\n"
    + ".lbl{font-size:10px !important;letter-spacing:.07em !important}\n"

    /* ─── 8. TIPOGRAFÍAS BALANCEADAS — MOBILE ───────────────── */
    + "@media (max-width:700px){\n"
    + "  .ptitle{font-size:15px !important}\n"
    + "  .psub{font-size:10px !important}\n"
    + "  .mod-t{font-size:14px !important}\n"
    /*   Limitar tipografías "gigantes" inline en mobile */
    + "  [style*=\"font-size:48px\"],[style*=\"font-size: 48px\"]{font-size:28px !important}\n"
    + "  [style*=\"font-size:40px\"],[style*=\"font-size: 40px\"]{font-size:26px !important}\n"
    + "  [style*=\"font-size:38px\"],[style*=\"font-size: 38px\"]{font-size:24px !important}\n"
    + "  [style*=\"font-size:32px\"],[style*=\"font-size: 32px\"]{font-size:22px !important}\n"
    + "  [style*=\"font-size:28px\"],[style*=\"font-size: 28px\"]{font-size:20px !important}\n"
    + "  [style*=\"font-size:24px\"],[style*=\"font-size: 24px\"]{font-size:18px !important}\n"
    + "  [style*=\"font-size:22px\"],[style*=\"font-size: 22px\"]{font-size:17px !important}\n"
    + "  [style*=\"font-size:20px\"],[style*=\"font-size: 20px\"]{font-size:16px !important}\n"
    + "  [style*=\"font-size:18px\"],[style*=\"font-size: 18px\"]{font-size:15px !important}\n"
    + "}\n"

    /* ─── 9. WSHELL/WSCROLL — LAYOUT ESTABLE ───────────────── */
    + ".wshell{min-height:0 !important;display:flex !important;flex-direction:column !important;overflow:hidden}\n"
    + ".wscroll{flex:1 1 auto !important;min-height:0 !important}\n"

    /* ─── 10. PANELES PRINCIPALES — ANCHO Y BOX-SIZING ─────── */
    + "#p-publicaciones,#p-calendario,#p-guardias{width:100% !important;max-width:100% !important;box-sizing:border-box !important}\n"

    /* ─── 11. MODALES NO BLOQUEAN POR DETRÁS ───────────────── */
    + ".ov:not(.open),.overlay:not(.open){display:none !important;pointer-events:none !important}\n"

    /* ─── 12. CARDS DEL DASHBOARD/HOY — TAMAÑOS PROPORCIONALES */
    + "@media (max-width:700px){\n"
    + "  #p-hoy [style*=\"font-size:16px\"],#p-hoy [style*=\"font-size: 16px\"]{font-size:14px !important}\n"
    + "  #p-hoy [style*=\"font-size:14px\"],#p-hoy [style*=\"font-size: 14px\"]{font-size:13px !important}\n"
    + "}\n"

    /* ─── 13. KANBAN COLUMNAS — PROHIBIR DESBORDE ───────────── */
    + ".kanban{min-height:0 !important}\n"
    + ".kcol{max-height:calc(100vh - 180px)}\n"
    + "@media (max-width:700px){.kcol{max-height:calc(100dvh - 220px)}}\n"

    /* ─── 14. FOCUS VISIBLE — ACCESIBILIDAD ─────────────────── */
    + "button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #667eea !important;outline-offset:1px}\n";

  function injectCSS() {
    if (document.getElementById("ui-fixes-css")) return;
    var s = document.createElement("style");
    s.id = "ui-fixes-css";
    s.textContent = CSS;
    document.head.appendChild(s);
    console.log("[ui-fixes] CSS de overrides aplicado (" + CSS.length + " chars)");
  }

  /* ════════════════════════════════════════════════════════════
     PARCHE A window.nav() — LIMPIEZA AGRESIVA DE ESTADO
     ──────────────────────────────────────────────────────────── */
  var FULL_PANEL_IDS = ["calendario", "publicaciones", "guardias"];

  function limpiarClasesBody() {
    document.body.classList.remove(
      "full-panel",
      "show-calendario",
      "show-publicaciones",
      "show-guardias"
    );
  }

  function patchNav() {
    if (window._uiFixNavPatched) return;
    var orig = window.nav;
    if (typeof orig !== "function") {
      setTimeout(patchNav, 400);
      return;
    }
    window._uiFixNavPatched = true;

    window.nav = function (id, tab, sb) {
      var esMobile = window.innerWidth <= 700;
      var esFullPanel = FULL_PANEL_IDS.indexOf(id) !== -1;

      // SIEMPRE limpiar antes de aplicar nuevo estado
      // (esto evita que clases viejas se queden pegadas)
      limpiarClasesBody();

      var resultado = orig.apply(this, arguments);

      // En desktop, asegurar que nunca se aplique full-panel
      if (!esMobile) {
        limpiarClasesBody();
      } else if (esFullPanel) {
        // Mobile + full-panel: re-aplicar (orig ya lo hizo, pero por defensa)
        document.body.classList.add("full-panel", "show-" + id);
      }

      // Defensa: asegurar que SOLO el panel actual esté visible
      try {
        forceSinglePanelVisible(id);
      } catch (e) {
        console.warn("[ui-fixes] No se pudo forzar single panel:", e);
      }

      return resultado;
    };

    console.log("[ui-fixes] window.nav() parcheado — limpieza agresiva activa");
  }

  /* ════════════════════════════════════════════════════════════
     FORZAR QUE SOLO UN PANEL p-X ESTÉ VISIBLE
     ──────────────────────────────────────────────────────────── */
  function forceSinglePanelVisible(activeId) {
    var panels = document.querySelectorAll('[id^="p-"]');
    panels.forEach(function (p) {
      if (!p.id || p.id.indexOf("p-") !== 0) return;
      // Excluir el panel activo
      var nombre = p.id.slice(2); // "p-tablero" → "tablero"
      if (nombre === activeId) return;
      // Si por algún motivo está visible y NO es el activo, esconderlo
      if (p.style.display && p.style.display !== "none") {
        p.style.display = "none";
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     LISTENER DE RESIZE — LIMPIA AL PASAR A DESKTOP
     ──────────────────────────────────────────────────────────── */
  function setupResizeHandler() {
    var lastWidth = window.innerWidth;
    var ticking = false;

    window.addEventListener("resize", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var w = window.innerWidth;
        // Cruzó el breakpoint de mobile a desktop
        if (lastWidth <= 700 && w > 700) {
          limpiarClasesBody();
          console.log("[ui-fixes] Resize mobile→desktop: clases limpiadas");
        }
        lastWidth = w;
        ticking = false;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     TECLA ESCAPE — CIERRA MODALES Y SALE DE FULL-PANEL
     ──────────────────────────────────────────────────────────── */
  function setupEscapeHandler() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;

      // 1. Primero: cerrar cualquier modal/overlay abierto
      var abiertos = document.querySelectorAll(".ov.open, .overlay.open");
      if (abiertos.length > 0) {
        abiertos.forEach(function (o) { o.classList.remove("open"); });
        return;
      }

      // 2. Si no había modales, salir de full-panel (mobile)
      if (document.body.classList.contains("full-panel")) {
        limpiarClasesBody();
        if (typeof window.nav === "function") {
          // Volver a la pantalla principal según preferencia
          var fallback = document.getElementById("p-hoy") ? "hoy" : "tablero";
          window.nav(fallback);
        }
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     FAILSAFE: CADA 5s VERIFICAR QUE NO HAY PANELES DUPLICADOS
     ──────────────────────────────────────────────────────────── */
  function setupFailsafe() {
    setInterval(function () {
      // Contar paneles visibles
      var visibles = [];
      document.querySelectorAll('[id^="p-"]').forEach(function (p) {
        if (!p.id || p.id.indexOf("p-") !== 0) return;
        if (p.style.display !== "none" && p.offsetParent !== null) {
          visibles.push(p);
        }
      });
      if (visibles.length > 1) {
        console.warn("[ui-fixes] Detectados", visibles.length,
          "paneles visibles a la vez:",
          visibles.map(function (v) { return v.id; }).join(", "),
          "— ocultando los anteriores");
        // Dejar visible solo el último (suele ser el activo)
        visibles.slice(0, -1).forEach(function (p) { p.style.display = "none"; });
      }
    }, 5000);
  }

  /* ════════════════════════════════════════════════════════════
     INICIALIZACIÓN
     ──────────────────────────────────────────────────────────── */
  function init() {
    injectCSS();
    patchNav();
    setupResizeHandler();
    setupEscapeHandler();
    setupFailsafe();

    console.log(
      "%c[ui-fixes] Cargado correctamente — superposiciones corregidas, tipografías ajustadas",
      "color:#7c3aed;font-weight:bold;font-size:12px"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
