/* ════════════════════════════════════════════════════════════════
   UI-FIXES.JS  v2  ·  Panel Comunicación — Municipalidad Tres Arroyos
   ────────────────────────────────────────────────────────────────
   Cambios v2 sobre v1:
   - Overrides ESPECÍFICOS para clases .m7-* de la vista "Hoy"
     (donde están las tipografías que seguían viéndose grandes)
   - Reducción global de paddings/tamaños para un look más
     profesional y compacto de panel productivo
   - Diagnóstico de navegación: si clickeás un tab/sidebar y no
     se ejecuta nav(), queda log en consola
   - Mejor cleanup de estado entre cambios de pestaña
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════════════════════════════════
     CSS DE OVERRIDES
     ──────────────────────────────────────────────────────────── */
  var CSS = ""
    /* ─── 1. JERARQUÍA Z-INDEX ESTABLE ──────────────────────── */
    + ".toast{z-index:9998 !important}\n"
    + ".ov,.overlay{z-index:5000 !important}\n"
    + "#evpanel{z-index:400 !important}\n"

    /* ─── 2. LAYOUT GENERAL — UN SOLO SCROLL ────────────────── */
    + "html,body{overflow:hidden !important;height:100% !important;margin:0 !important}\n"
    + ".body{position:relative;isolation:isolate}\n"
    + ".content{overflow-y:auto !important;overflow-x:hidden !important;position:relative}\n"

    /* ─── 3. PANELES INACTIVOS REALMENTE OCULTOS ────────────── */
    + "[id^=\"p-\"][style*=\"display:none\"],[id^=\"p-\"][style*=\"display: none\"]{display:none !important;visibility:hidden !important}\n"

    /* ─── 4. DESKTOP: SIN POSITION:FIXED EN PANELES ─────────── */
    + "@media (min-width:701px){\n"
    + "  body.full-panel #p-calendario,body.full-panel #p-publicaciones,body.full-panel #p-guardias,\n"
    + "  body.show-calendario #p-calendario,body.show-publicaciones #p-publicaciones,body.show-guardias #p-guardias{\n"
    + "    position:static !important;top:auto !important;left:auto !important;right:auto !important;bottom:auto !important;\n"
    + "    width:auto !important;height:100% !important;z-index:auto !important;padding:0 !important\n"
    + "  }\n"
    + "  body.full-panel .sb,body.show-calendario .sb,body.show-publicaciones .sb,body.show-guardias .sb{display:block !important}\n"
    + "  #mobile-bottom-nav,#m4-mobilebar{display:none !important}\n"
    + "}\n"

    /* ─── 5. MOBILE: Z-INDEX CONTENIDO ──────────────────────── */
    + "@media (max-width:700px){\n"
    + "  body.show-calendario #p-calendario,body.show-publicaciones #p-publicaciones,body.show-guardias #p-guardias{z-index:450 !important}\n"
    + "  #mobile-bottom-nav{padding-bottom:env(safe-area-inset-bottom,0) !important;height:calc(56px + env(safe-area-inset-bottom,0)) !important}\n"
    + "}\n"

    /* ─── 6. EVPANEL Y MODALES ──────────────────────────────── */
    + "#evpanel[style*=\"display:none\"],#evpanel[style*=\"display: none\"]{visibility:hidden !important;pointer-events:none !important}\n"
    + ".ov:not(.open),.overlay:not(.open){display:none !important;pointer-events:none !important}\n"

    /* ─── 7. TIPOGRAFÍAS GLOBALES — MÁS COMPACTAS ──────────── */
    + ".ptitle{font-size:15px !important;line-height:1.25 !important;font-weight:700 !important}\n"
    + ".psub{font-size:11px !important;line-height:1.35 !important}\n"
    + ".wnum{font-size:13px !important}\n"
    + ".wdc.wdt .wnum{font-size:11px !important}\n"
    + ".mod-t{font-size:14px !important;line-height:1.3 !important}\n"
    + ".lbl{font-size:10px !important;letter-spacing:.07em !important}\n"

    /* ─── 8. VISTA HOY (.m7-*) — REDUCCIÓN ESPECÍFICA ───────── */
    /* Estas reglas son LO IMPORTANTE: vienen del mejoras7.js que generaba
       textos enormes en la vista "Hoy". Las ajustamos a tamaños de panel productivo. */
    + ".m7-card{padding:14px 18px !important;margin:0 0 12px !important;border-radius:12px !important;box-shadow:0 2px 8px rgba(15,23,42,.04) !important}\n"
    + ".m7-card-head{margin-bottom:10px !important}\n"
    + ".m7-card-head h3{font-size:15px !important;line-height:1.25 !important;font-weight:700 !important}\n"
    + ".m7-kicker{font-size:9px !important;font-weight:800 !important;margin-bottom:2px !important;letter-spacing:.1em !important}\n"
    + ".m7-count{padding:3px 9px !important;font-size:10px !important;font-weight:700 !important}\n"
    + ".m7-delay-row{padding:9px 12px !important;margin-top:6px !important;grid-template-columns:36px minmax(0,1fr) 60px !important;gap:10px !important;border-radius:9px !important}\n"
    + ".m7-delay-rank{width:26px !important;height:26px !important;border-radius:7px !important;font-size:11px !important;font-weight:700 !important}\n"
    + ".m7-delay-title{font-size:12px !important;font-weight:700 !important;line-height:1.3 !important}\n"
    + ".m7-delay-meta{font-size:10px !important;margin-top:3px !important;line-height:1.3 !important;color:#64748b !important}\n"
    + ".m7-delay-age{padding-left:10px !important}\n"
    + ".m7-delay-age strong{font-size:18px !important;font-weight:800 !important;line-height:1 !important}\n"
    + ".m7-delay-age span{font-size:8px !important;margin-top:3px !important;letter-spacing:.05em !important}\n"
    + ".m7-time{font-size:11px !important;font-weight:600 !important}\n"
    + ".m7-event-text strong{font-size:12px !important;font-weight:700 !important;line-height:1.25 !important}\n"
    + ".m7-event-text span{font-size:10px !important;line-height:1.25 !important;margin-top:2px !important}\n"
    + ".m7-event-row,.m7-pub-row{padding:8px 0 !important}\n"
    + ".m7-event-main{grid-template-columns:64px minmax(0,1fr) !important;gap:10px !important}\n"
    + ".m7-cover-btn{padding:4px 9px !important;font-size:10px !important;font-weight:600 !important}\n"
    + ".m7-guard{padding:9px !important;border-radius:10px !important;gap:9px !important}\n"
    + ".m7-avatar{width:30px !important;height:30px !important;font-size:11px !important}\n"
    + ".m7-guard strong{font-size:12px !important;font-weight:700 !important}\n"
    + ".m7-guard span{font-size:10px !important;margin-top:1px !important}\n"
    + ".m7-empty{padding:14px !important;font-size:11px !important;border-radius:9px !important}\n"
    + ".m7-grid{gap:14px !important;margin-top:12px !important}\n"

    /* ─── 9. MOBILE — TIPOGRAFÍAS LIMITADAS ─────────────────── */
    + "@media (max-width:700px){\n"
    + "  .ptitle{font-size:14px !important}\n"
    + "  .psub{font-size:10px !important}\n"
    + "  .mod-t{font-size:13px !important}\n"
    + "  .m7-card{padding:12px 14px !important;margin-bottom:10px !important}\n"
    + "  .m7-card-head h3{font-size:14px !important}\n"
    + "  .m7-delay-title{font-size:12px !important}\n"
    + "  .m7-delay-age strong{font-size:16px !important}\n"
    /*   Override de inline styles "gigantes" en mobile */
    + "  [style*=\"font-size:48px\"],[style*=\"font-size: 48px\"]{font-size:24px !important}\n"
    + "  [style*=\"font-size:40px\"],[style*=\"font-size: 40px\"]{font-size:22px !important}\n"
    + "  [style*=\"font-size:38px\"],[style*=\"font-size: 38px\"]{font-size:20px !important}\n"
    + "  [style*=\"font-size:32px\"],[style*=\"font-size: 32px\"]{font-size:18px !important}\n"
    + "  [style*=\"font-size:28px\"],[style*=\"font-size: 28px\"]{font-size:16px !important}\n"
    + "  [style*=\"font-size:24px\"],[style*=\"font-size: 24px\"]{font-size:15px !important}\n"
    + "  [style*=\"font-size:22px\"],[style*=\"font-size: 22px\"]{font-size:14px !important}\n"
    + "  [style*=\"font-size:20px\"],[style*=\"font-size: 20px\"]{font-size:14px !important}\n"
    + "  [style*=\"font-size:18px\"],[style*=\"font-size: 18px\"]{font-size:13px !important}\n"
    + "  [style*=\"font-size:17px\"],[style*=\"font-size: 17px\"]{font-size:13px !important}\n"
    + "  [style*=\"font-size:16px\"],[style*=\"font-size: 16px\"]{font-size:13px !important}\n"
    + "}\n"

    /* ─── 10. WSHELL/WSCROLL — LAYOUT ESTABLE ──────────────── */
    + ".wshell{min-height:0 !important;display:flex !important;flex-direction:column !important;overflow:hidden}\n"
    + ".wscroll{flex:1 1 auto !important;min-height:0 !important}\n"

    /* ─── 11. PANELES PRINCIPALES — ANCHO Y BOX-SIZING ─────── */
    + "#p-publicaciones,#p-calendario,#p-guardias{width:100% !important;max-width:100% !important;box-sizing:border-box !important}\n"

    /* ─── 12. KANBAN — NO DESBORDE ──────────────────────────── */
    + ".kanban{min-height:0 !important}\n"
    + ".kcol{max-height:calc(100vh - 180px)}\n"
    + "@media (max-width:700px){.kcol{max-height:calc(100dvh - 220px)}}\n"

    /* ─── 13. ASEGURAR INTERACTIVIDAD DE NAV/SIDEBAR ────────── */
    /* Esta es CRÍTICA si la navegación dejó de funcionar:
       asegura que los botones del nav superior y los items del sidebar
       SIEMPRE reciben clics, sin importar qué cubra encima */
    + ".ntab,.sbi,.mbn-btn{position:relative !important;z-index:10 !important;pointer-events:auto !important;cursor:pointer !important}\n"
    + ".ntabs,.sb{position:relative !important;z-index:5 !important;pointer-events:auto !important}\n"
    /* La vista Hoy no debe cubrir el sidebar/nav */
    + "#p-hoy{position:relative !important;z-index:1 !important}\n"
    + "#p-hoy.m7-hoy-stable{position:relative !important;z-index:1 !important}\n"
    + "#m7-hoy-panel{position:relative !important;z-index:1 !important;pointer-events:auto !important}\n"

    /* ─── 14. FOCUS VISIBLE ─────────────────────────────────── */
    + "button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #667eea !important;outline-offset:1px}\n";

  function injectCSS() {
    var existing = document.getElementById("ui-fixes-css");
    if (existing) existing.remove();  // Re-inyectar si ya existe (para que tome efecto la v2)
    var s = document.createElement("style");
    s.id = "ui-fixes-css";
    s.textContent = CSS;
    document.head.appendChild(s);
    console.log("[ui-fixes v2] CSS aplicado (" + CSS.length + " chars)");
  }

  /* ════════════════════════════════════════════════════════════
     PARCHE A window.nav() — LIMPIEZA AGRESIVA
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
      console.log("[ui-fixes v2] nav() llamado con id =", id);
      var esMobile = window.innerWidth <= 700;
      var esFullPanel = FULL_PANEL_IDS.indexOf(id) !== -1;

      // SIEMPRE limpiar antes de aplicar nuevo estado
      limpiarClasesBody();

      var resultado;
      try {
        resultado = orig.apply(this, arguments);
      } catch (e) {
        console.error("[ui-fixes v2] Error en nav() original:", e);
        throw e;
      }

      // En desktop, asegurar que nunca se aplique full-panel
      if (!esMobile) {
        limpiarClasesBody();
      } else if (esFullPanel) {
        document.body.classList.add("full-panel", "show-" + id);
      }

      // Forzar single panel visible
      try { forceSinglePanelVisible(id); } catch (e) {}

      return resultado;
    };

    console.log("[ui-fixes v2] window.nav() parcheado");
  }

  function forceSinglePanelVisible(activeId) {
    var panels = document.querySelectorAll('[id^="p-"]');
    panels.forEach(function (p) {
      if (!p.id || p.id.indexOf("p-") !== 0) return;
      var nombre = p.id.slice(2);
      if (nombre === activeId) return;
      if (p.style.display && p.style.display !== "none") {
        p.style.display = "none";
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     DIAGNÓSTICO DE NAVEGACIÓN — DETECTA CLICS QUE NO FUNCIONAN
     ──────────────────────────────────────────────────────────── */
  function setupNavDiagnostic() {
    document.addEventListener("click", function (e) {
      // Detectar clics en tabs superiores o items del sidebar
      var target = e.target.closest(".ntab, .sbi, .mbn-btn");
      if (!target) return;

      var label = (target.textContent || "").trim().substring(0, 30);
      var isOn = target.classList.contains("on") || target.classList.contains("mbn-active");

      // Tras un breve delay, verificar si el panel cambió
      var panelesAntes = obtenerPanelesVisibles();
      setTimeout(function () {
        var panelesDespues = obtenerPanelesVisibles();
        if (JSON.stringify(panelesAntes) === JSON.stringify(panelesDespues) && !isOn) {
          console.warn(
            "[ui-fixes v2] ⚠ Clic en \"" + label + "\" NO cambió el panel activo. " +
            "Panel visible: " + (panelesDespues[0] || "ninguno") + ". " +
            "Verificá que el handler onclick esté bien."
          );
        }
      }, 250);
    }, true);
  }

  function obtenerPanelesVisibles() {
    var arr = [];
    document.querySelectorAll('[id^="p-"]').forEach(function (p) {
      if (!p.id || p.id.indexOf("p-") !== 0) return;
      if (p.style.display !== "none" && p.offsetParent !== null) {
        arr.push(p.id);
      }
    });
    return arr;
  }

  /* ════════════════════════════════════════════════════════════
     RESIZE HANDLER
     ──────────────────────────────────────────────────────────── */
  function setupResizeHandler() {
    var lastWidth = window.innerWidth;
    var ticking = false;

    window.addEventListener("resize", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var w = window.innerWidth;
        if (lastWidth <= 700 && w > 700) {
          limpiarClasesBody();
          console.log("[ui-fixes v2] Resize mobile→desktop: limpiado");
        }
        lastWidth = w;
        ticking = false;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     TECLA ESCAPE
     ──────────────────────────────────────────────────────────── */
  function setupEscapeHandler() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;

      var abiertos = document.querySelectorAll(".ov.open, .overlay.open");
      if (abiertos.length > 0) {
        abiertos.forEach(function (o) { o.classList.remove("open"); });
        return;
      }

      if (document.body.classList.contains("full-panel")) {
        limpiarClasesBody();
        if (typeof window.nav === "function") {
          var fallback = document.getElementById("p-hoy") ? "hoy" : "tablero";
          window.nav(fallback);
        }
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     FAILSAFE PERIÓDICO
     ──────────────────────────────────────────────────────────── */
  function setupFailsafe() {
    setInterval(function () {
      var visibles = [];
      document.querySelectorAll('[id^="p-"]').forEach(function (p) {
        if (!p.id || p.id.indexOf("p-") !== 0) return;
        if (p.style.display !== "none" && p.offsetParent !== null) {
          visibles.push(p);
        }
      });
      if (visibles.length > 1) {
        console.warn("[ui-fixes v2] " + visibles.length +
          " paneles visibles, dejando solo el último");
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
    setupNavDiagnostic();
    setupFailsafe();

    console.log(
      "%c[ui-fixes v2] Listo — tipografías reducidas (incluye .m7-*), nav diagnóstico activo",
      "color:#7c3aed;font-weight:bold;font-size:12px"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
