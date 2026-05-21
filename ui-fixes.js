/* ════════════════════════════════════════════════════════════════
   UI-FIXES.JS  v3  ·  Panel Comunicación — Municipalidad Tres Arroyos
   ────────────────────────────────────────────────────────────────
   Cambios v3 sobre v2:
   - Nuevo enfoque: visibilidad de paneles por CSS + data-attribute.
     El body lleva data-active-panel="hoy|tablero|..." y el CSS
     muestra SOLO ese panel. Inmune a wrappers que peleen por
     mostrar otros paneles (que era el bucle anterior).
   - Eliminado el setInterval de detección (causaba spam de logs)
   - MutationObserver liviano que sincroniza data-active-panel
     con el tab que esté .on
   - Logs reducidos a lo esencial
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════════════════════════════════
     LISTA DE PANELES Y SU TIPO DE DISPLAY
     ──────────────────────────────────────────────────────────── */
  var PANEL_IDS = [
    "tablero", "material", "publicaciones", "calendario", "guardias",
    "equipo", "metricas", "medios", "entrevistas", "contactos",
    "recursos", "reclamos", "hoy", "dashboard", "agente"
  ];

  // Algunos paneles necesitan display:flex (no block)
  var FLEX_PANELS = { publicaciones: 1, calendario: 1 };

  /* ════════════════════════════════════════════════════════════
     CSS — VISIBILIDAD POR data-active-panel
     ──────────────────────────────────────────────────────────── */
  function generarCSSVisibility() {
    var parts = [];

    // 1. Cuando body tiene data-active-panel, ocultar TODOS los p-X
    var selectoresOcultar = PANEL_IDS.map(function (id) {
      return "body[data-active-panel] #p-" + id;
    }).join(",\n");
    parts.push(selectoresOcultar +
      "{display:none !important;visibility:hidden !important;pointer-events:none !important}");

    // 2. Mostrar SOLO el panel activo, con su display correspondiente
    PANEL_IDS.forEach(function (id) {
      var disp = FLEX_PANELS[id] ? "flex" : "block";
      parts.push(
        "body[data-active-panel=\"" + id + "\"] #p-" + id + "{" +
        "display:" + disp + " !important;" +
        "visibility:visible !important;" +
        "pointer-events:auto !important" +
        "}"
      );
    });

    return parts.join("\n") + "\n";
  }

  /* ════════════════════════════════════════════════════════════
     CSS COMPLETO DE OVERRIDES
     ──────────────────────────────────────────────────────────── */
  var CSS = generarCSSVisibility()
    /* ─── JERARQUÍA Z-INDEX ESTABLE ─────────────────────────── */
    + ".toast{z-index:9998 !important}\n"
    + ".ov,.overlay{z-index:5000 !important}\n"
    + "#evpanel{z-index:400 !important}\n"

    /* ─── LAYOUT GENERAL — UN SOLO SCROLL ───────────────────── */
    + "html,body{overflow:hidden !important;height:100% !important;margin:0 !important}\n"
    + ".body{position:relative;isolation:isolate}\n"
    + ".content{overflow-y:auto !important;overflow-x:hidden !important;position:relative}\n"

    /* ─── DESKTOP: SIN POSITION:FIXED EN PANELES ────────────── */
    + "@media (min-width:701px){\n"
    + "  body.full-panel #p-calendario,body.full-panel #p-publicaciones,body.full-panel #p-guardias,\n"
    + "  body.show-calendario #p-calendario,body.show-publicaciones #p-publicaciones,body.show-guardias #p-guardias{\n"
    + "    position:static !important;top:auto !important;left:auto !important;right:auto !important;bottom:auto !important;\n"
    + "    width:auto !important;height:100% !important;z-index:auto !important;padding:0 !important\n"
    + "  }\n"
    + "  body.full-panel .sb,body.show-calendario .sb,body.show-publicaciones .sb,body.show-guardias .sb{display:block !important}\n"
    + "  #mobile-bottom-nav,#m4-mobilebar{display:none !important}\n"
    + "}\n"

    /* ─── MOBILE: Z-INDEX CONTENIDO ─────────────────────────── */
    + "@media (max-width:700px){\n"
    + "  body.show-calendario #p-calendario,body.show-publicaciones #p-publicaciones,body.show-guardias #p-guardias{z-index:450 !important}\n"
    + "  #mobile-bottom-nav{padding-bottom:env(safe-area-inset-bottom,0) !important;height:calc(56px + env(safe-area-inset-bottom,0)) !important}\n"
    + "}\n"

    /* ─── MODALES Y EVPANEL ─────────────────────────────────── */
    + ".ov:not(.open),.overlay:not(.open){display:none !important;pointer-events:none !important}\n"
    + "#evpanel[style*=\"display:none\"],#evpanel[style*=\"display: none\"]{visibility:hidden !important;pointer-events:none !important}\n"

    /* ─── TIPOGRAFÍAS GLOBALES — COMPACTAS ──────────────────── */
    + ".ptitle{font-size:15px !important;line-height:1.25 !important;font-weight:700 !important}\n"
    + ".psub{font-size:11px !important;line-height:1.35 !important}\n"
    + ".wnum{font-size:13px !important}\n"
    + ".wdc.wdt .wnum{font-size:11px !important}\n"
    + ".mod-t{font-size:14px !important;line-height:1.3 !important}\n"
    + ".lbl{font-size:10px !important;letter-spacing:.07em !important}\n"

    /* ─── VISTA HOY (.m7-*) — REDUCCIÓN ESPECÍFICA ──────────── */
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

    /* ─── MOBILE — TIPOGRAFÍAS LIMITADAS ────────────────────── */
    + "@media (max-width:700px){\n"
    + "  .ptitle{font-size:14px !important}\n"
    + "  .psub{font-size:10px !important}\n"
    + "  .mod-t{font-size:13px !important}\n"
    + "  .m7-card{padding:12px 14px !important;margin-bottom:10px !important}\n"
    + "  .m7-card-head h3{font-size:14px !important}\n"
    + "  .m7-delay-title{font-size:12px !important}\n"
    + "  .m7-delay-age strong{font-size:16px !important}\n"
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

    /* ─── WSHELL/WSCROLL ESTABLE ────────────────────────────── */
    + ".wshell{min-height:0 !important;display:flex !important;flex-direction:column !important;overflow:hidden}\n"
    + ".wscroll{flex:1 1 auto !important;min-height:0 !important}\n"

    /* ─── ANCHO COMPLETO PARA PANELES ───────────────────────── */
    + "#p-publicaciones,#p-calendario,#p-guardias{width:100% !important;max-width:100% !important;box-sizing:border-box !important}\n"

    /* ─── KANBAN CONTENIDO ──────────────────────────────────── */
    + ".kanban{min-height:0 !important}\n"
    + ".kcol{max-height:calc(100vh - 180px)}\n"
    + "@media (max-width:700px){.kcol{max-height:calc(100dvh - 220px)}}\n"

    /* ─── ASEGURAR INTERACTIVIDAD DE NAV/SIDEBAR ────────────── */
    + ".ntab,.sbi,.mbn-btn{position:relative !important;z-index:10 !important;pointer-events:auto !important;cursor:pointer !important}\n"
    + ".ntabs,.sb{position:relative !important;z-index:5 !important;pointer-events:auto !important}\n"
    + "#p-hoy{position:relative !important;z-index:1 !important}\n"
    + "#p-hoy.m7-hoy-stable{position:relative !important;z-index:1 !important}\n"
    + "#m7-hoy-panel{position:relative !important;z-index:1 !important;pointer-events:auto !important}\n"

    /* ─── FOCUS ACCESIBLE ───────────────────────────────────── */
    + "button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #667eea !important;outline-offset:1px}\n";

  function injectCSS() {
    var existing = document.getElementById("ui-fixes-css");
    if (existing) existing.remove();
    var s = document.createElement("style");
    s.id = "ui-fixes-css";
    s.textContent = CSS;
    document.head.appendChild(s);
    console.log("[ui-fixes v3] CSS aplicado (" + CSS.length + " chars)");
  }

  /* ════════════════════════════════════════════════════════════
     DETECTAR EL PANEL ACTIVO Y MARCARLO EN BODY
     ──────────────────────────────────────────────────────────── */
  function detectarPanelActivo() {
    // Estrategia 1: buscar el .ntab activo (.on) y mapear a id
    var activeNtab = document.querySelector(".ntab.on");
    if (activeNtab) {
      // El texto del tab puede ser "Tablero", "Hoy", etc. Si tiene onclick="nav('hoy',...)"
      var onclick = activeNtab.getAttribute("onclick") || "";
      var m = onclick.match(/nav\(['"]([a-z]+)['"]/);
      if (m && m[1]) return m[1];
    }

    // Estrategia 2: buscar el .sbi activo
    var activeSbi = document.querySelector(".sbi.on");
    if (activeSbi) {
      var oc2 = activeSbi.getAttribute("onclick") || "";
      var m2 = oc2.match(/nav\(['"]([a-z]+)['"]/);
      if (m2 && m2[1]) return m2[1];
    }

    // Estrategia 3: leer cuál p-X tiene display !== "none"
    for (var i = 0; i < PANEL_IDS.length; i++) {
      var p = document.getElementById("p-" + PANEL_IDS[i]);
      if (p && p.style.display && p.style.display !== "none") {
        return PANEL_IDS[i];
      }
    }

    return null;
  }

  function aplicarPanelActivo(id) {
    if (!id) return;
    if (document.body.dataset.activePanel === id) return; // sin cambios
    document.body.dataset.activePanel = id;
    console.log("[ui-fixes v3] Panel activo:", id);
  }

  /* ════════════════════════════════════════════════════════════
     PARCHE A window.nav() — SETEAR ACTIVE PANEL
     ──────────────────────────────────────────────────────────── */
  function patchNav() {
    if (window._uiFixNavPatched) return;
    var orig = window.nav;
    if (typeof orig !== "function") {
      setTimeout(patchNav, 400);
      return;
    }
    window._uiFixNavPatched = true;

    window.nav = function (id, tab, sb) {
      // Antes de llamar al nav original, setear el atributo
      // (la CSS ya hará que solo se vea el panel activo)
      aplicarPanelActivo(id);

      // Limpiar clases mobile en desktop
      if (window.innerWidth > 700) {
        document.body.classList.remove(
          "full-panel", "show-calendario", "show-publicaciones", "show-guardias"
        );
      }

      try {
        return orig.apply(this, arguments);
      } catch (e) {
        console.error("[ui-fixes v3] Error en nav():", e);
        throw e;
      }
    };

    console.log("[ui-fixes v3] window.nav() parcheado");
  }

  /* ════════════════════════════════════════════════════════════
     OBSERVER LIVIANO: SI CAMBIA .on EN TABS/SIDEBAR, SINCRONIZAR
     ──────────────────────────────────────────────────────────── */
  function setupTabObserver() {
    var nav = document.querySelector(".ntabs");
    var sb = document.querySelector(".sb");

    if (!nav && !sb) {
      setTimeout(setupTabObserver, 500);
      return;
    }

    var sincronizar = function () {
      var id = detectarPanelActivo();
      if (id) aplicarPanelActivo(id);
    };

    var mo = new MutationObserver(sincronizar);
    if (nav) mo.observe(nav, { attributes: true, subtree: true, attributeFilter: ["class"] });
    if (sb) mo.observe(sb, { attributes: true, subtree: true, attributeFilter: ["class"] });

    // Primera sincronización
    sincronizar();
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
          document.body.classList.remove(
            "full-panel", "show-calendario", "show-publicaciones", "show-guardias"
          );
        }
        lastWidth = w;
        ticking = false;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     TECLA ESCAPE — CERRAR MODALES
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
        document.body.classList.remove(
          "full-panel", "show-calendario", "show-publicaciones", "show-guardias"
        );
        if (typeof window.nav === "function") {
          var fallback = document.getElementById("p-hoy") ? "hoy" : "tablero";
          window.nav(fallback);
        }
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     DIAGNÓSTICO DE NAVEGACIÓN — SOLO LOG SI HAY PROBLEMA REAL
     ──────────────────────────────────────────────────────────── */
  function setupNavDiagnostic() {
    document.addEventListener("click", function (e) {
      var target = e.target.closest(".ntab, .sbi, .mbn-btn");
      if (!target) return;

      var label = (target.textContent || "").trim().substring(0, 30);
      var panelAntes = document.body.dataset.activePanel || "";

      setTimeout(function () {
        var panelDespues = document.body.dataset.activePanel || "";
        if (panelAntes === panelDespues) {
          console.warn(
            "[ui-fixes v3] ⚠ Clic en \"" + label + "\" no cambió el panel " +
            "(sigue en \"" + panelDespues + "\"). Revisar handler onclick."
          );
        }
      }, 300);
    }, true);
  }

  /* ════════════════════════════════════════════════════════════
     INICIALIZACIÓN
     ──────────────────────────────────────────────────────────── */
  function init() {
    injectCSS();
    patchNav();
    setupTabObserver();
    setupResizeHandler();
    setupEscapeHandler();
    setupNavDiagnostic();

    console.log(
      "%c[ui-fixes v3] Listo — visibilidad CSS-driven, sin loops, tipografías ajustadas",
      "color:#7c3aed;font-weight:bold;font-size:12px"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
