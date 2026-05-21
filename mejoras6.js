/* ============================================================
   MEJORAS6.JS - Panel Comunicación Tres Arroyos
   ------------------------------------------------------------
   FIX 1: Columna "Realizada" no debe mostrarse en el Kanban
     - Oculta la columna del DOM después de cada render
     - Se activa vía MutationObserver en #kanban

   FIX 2: "Agenda de hoy" queda vacía aunque GCal tiene eventos
     - _renderHoy() corre antes de que GCal termine de cargar
     - Observa el botón GCal y re-renderiza p-hoy al terminar

   FIX 3: "Tareas urgentes" — solo 5 más antiguas + botón borrar
     - Envuelve _renderHoy para reordenar por created_at ASC
     - Muestra máximo 5 (no 8)
     - Agrega botón ✕ para borrar cada tarea de Supabase

   FIX 4: Estabilización UI 2026-05-21
     - Cierra modales/overlays fantasma
     - Normaliza tipografías demasiado grandes
     - Refuerza botones Nueva tarea, Programar, Equipo y Calendario
     - Oculta Realizada como columna/opción visual del tablero
   ============================================================
   v2 — 2026-05-21
   ============================================================ */

(function () {
  "use strict";

  function ocultarColRealizadaDOM() {
    var kanban = document.getElementById("kanban");
    if (!kanban) return;
    kanban.querySelectorAll(".kcol").forEach(function (col) {
      var hdr = col.querySelector(".khdr");
      if (hdr && hdr.textContent.trim().toLowerCase().includes("realizada")) {
        col.style.display = "none";
      }
    });
  }

  function iniciarObserverKanban() {
    var kanban = document.getElementById("kanban");
    if (!kanban) {
      setTimeout(iniciarObserverKanban, 500);
      return;
    }
    ocultarColRealizadaDOM();
    var mo = new MutationObserver(function (muts) {
      var cambio = muts.some(function (m) { return m.addedNodes.length > 0; });
      if (cambio) ocultarColRealizadaDOM();
    });
    mo.observe(kanban, { childList: true, subtree: true });
    console.log("[mejoras6] Observer Kanban activo — columna Realizada oculta");
  }

  function iniciarObserverGCal() {
    var gcBtn = document.querySelector(".gcbtn");
    if (!gcBtn) {
      setTimeout(iniciarObserverGCal, 600);
      return;
    }
    var _yaRefrescado = false;
    var mo = new MutationObserver(function () {
      var txt = gcBtn.textContent || "";
      if (!_yaRefrescado && txt.match(/GCal\s*[·\·]\s*\d+\s*ev/i)) {
        _yaRefrescado = true;
        var phoy = document.getElementById("p-hoy");
        if (phoy && phoy.style.display !== "none") {
          setTimeout(function () {
            if (typeof window._renderHoy === "function") {
              window._renderHoy();
              console.log("[mejoras6] Agenda de hoy re-renderizada tras carga de GCal");
            }
          }, 300);
        }
        setTimeout(function () { _yaRefrescado = false; }, 5000);
      }
    });
    mo.observe(gcBtn, { childList: true, subtree: true, characterData: true });
    var _origNav = window.nav;
    if (typeof _origNav === "function" && !window._m6NavPatched) {
      window._m6NavPatched = true;
      window.nav = function (id) {
        var r = _origNav.apply(this, arguments);
        if (id === "hoy") {
          setTimeout(function () {
            var gcalCargado = typeof gcalEvs !== "undefined" && Array.isArray(gcalEvs) && gcalEvs.length > 0;
            if (gcalCargado && typeof window._renderHoy === "function") window._renderHoy();
          }, 200);
        }
        return r;
      };
    }
    console.log("[mejoras6] Observer GCal activo");
  }

  function parchearRenderHoy() {
    if (!window._renderHoy || window._renderHoy._m6patched) return;
    var _orig = window._renderHoy;
    window._renderHoy = function () {
      _orig.apply(this, arguments);
      setTimeout(reescribirCardUrgentes, 50);
    };
    window._renderHoy._m6patched = true;
    console.log("[mejoras6] _renderHoy parcheado");
  }

  function reescribirCardUrgentes() {
    var phoy = document.getElementById("p-hoy");
    if (!phoy) return;
    var cards = phoy.querySelectorAll("div"), urgCard = null;
    for (var i = 0; i < cards.length; i++) {
      var el = cards[i];
      if (el.children.length === 2) {
        var hdr = el.children[0];
        if (hdr && hdr.textContent.includes("Tareas urgentes")) { urgCard = el; break; }
      }
    }
    if (!urgCard) return;
    var cb = urgCard.children[1];
    if (!cb) return;
    var tareas = (typeof tasks !== "undefined" && Array.isArray(tasks)) ? tasks : [];
    var urgentes = tareas.filter(function (t) {
      return t.prioridad === "Alta" && t.estado !== "Completo" && t.estado !== "Listo s/publicar" && t.estado !== "Lista para publicar" && t.estado !== "Realizada";
    });
    urgentes.sort(function (a, b) { return String(a.created_at || "").localeCompare(String(b.created_at || "")); });
    var mostrar = urgentes.slice(0, 5), ocultas = urgentes.length - mostrar.length;
    while (cb.firstChild) cb.removeChild(cb.firstChild);
    if (!mostrar.length) {
      var emp = document.createElement("div");
      emp.style.cssText = "font-size:12px;color:#9ca3af;padding:8px 0;text-align:center";
      emp.textContent = "✅ Sin urgentes pendientes";
      cb.appendChild(emp);
      return;
    }
    mostrar.forEach(function (t) {
      var it = document.createElement("div");
      it.style.cssText = "display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;position:relative";
      var chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = t.estado === "Completo";
      chk.style.cssText = "margin-top:2px;width:16px;height:16px;cursor:pointer;accent-color:#6d28d9;flex-shrink:0";
      chk.onchange = function () {
        if (typeof tdToggle === "function") tdToggle(String(t.id));
        setTimeout(function () { if (typeof window._renderHoy === "function") window._renderHoy(); }, 400);
      };
      var info = document.createElement("div");
      info.style.flex = "1";
      info.style.minWidth = "0";
      var desc = document.createElement("div");
      desc.style.cssText = "font-size:12px;font-weight:500;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;padding-right:20px";
      desc.textContent = t.descripcion || "";
      var meta = document.createElement("div");
      meta.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap";
      var respEl = document.createElement("span");
      respEl.style.cssText = "font-size:10px;color:#6b7280";
      respEl.textContent = t.responsable || "";
      meta.appendChild(respEl);
      if (t.created_at) {
        var dias = Math.max(0, Math.floor((Date.now() - new Date(t.created_at)) / 86400000));
        if (dias > 0) {
          var ageEl = document.createElement("span");
          ageEl.style.cssText = "font-size:9px;padding:1px 5px;border-radius:4px;" + (dias > 14 ? "background:#fee2e2;color:#dc2626" : dias > 7 ? "background:#fffbeb;color:#d97706" : "background:#f3f4f6;color:#6b7280");
          ageEl.textContent = dias + "d";
          meta.appendChild(ageEl);
        }
      }
      info.appendChild(desc); info.appendChild(meta);
      var delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Eliminar tarea";
      delBtn.style.cssText = "position:absolute;top:8px;right:0;background:none;border:none;cursor:pointer;color:#d1d5db;font-size:13px;padding:0;line-height:1;font-family:inherit";
      delBtn.onmouseover = function () { this.style.color = "#dc2626"; };
      delBtn.onmouseout = function () { this.style.color = "#d1d5db"; };
      delBtn.onclick = function (e) { e.stopPropagation(); _borrarTareaUrgente(t); };
      it.appendChild(chk); it.appendChild(info); it.appendChild(delBtn); cb.appendChild(it);
    });
    if (ocultas > 0) {
      var mas = document.createElement("div");
      mas.style.cssText = "font-size:11px;color:#9ca3af;text-align:center;padding:7px 0 2px;cursor:pointer";
      mas.textContent = "+" + ocultas + " tarea" + (ocultas === 1 ? "" : "s") + " urgente" + (ocultas === 1 ? "" : "s") + " más → ir al Tablero";
      mas.onclick = function () { if (typeof nav === "function") nav("tablero"); };
      cb.appendChild(mas);
    }
  }

  function _borrarTareaUrgente(t) {
    var nombre = (t.descripcion || "esta tarea").slice(0, 40);
    if (!confirm("¿Eliminar \"" + nombre + "\"?")) return;
    if (typeof tasks !== "undefined" && Array.isArray(tasks)) {
      var idx = tasks.findIndex(function (x) { return String(x.id) === String(t.id); });
      if (idx !== -1) tasks.splice(idx, 1);
    }
    var dbx = window.db || (typeof db !== "undefined" ? db : null);
    if (dbx && typeof dbx.from === "function") {
      dbx.from("tareas").delete().eq("id", t.id).then(function (res) {
        if (res && res.error) console.warn("[mejoras6] Error Supabase borrar tarea:", res.error.message);
      }).catch(function (e) { console.warn("[mejoras6] Error:", e); });
    }
    if (typeof window._renderHoy === "function") window._renderHoy();
    if (typeof renderKanban === "function") setTimeout(renderKanban, 100);
    if (typeof updateBadges === "function") updateBadges();
    if (typeof toast === "function") toast("✓ Tarea eliminada");
  }

  function init() {
    iniciarObserverKanban();
    iniciarObserverGCal();
    var intentos = 0;
    var iv = setInterval(function () {
      intentos++;
      if (typeof window._renderHoy === "function") { parchearRenderHoy(); clearInterval(iv); }
      else if (intentos > 20) { clearInterval(iv); console.warn("[mejoras6] _renderHoy no encontrada después de 10s"); }
    }, 500);
    console.log("%c[mejoras6.js] Cargado v2", "color:#7c3aed;font-weight:bold;font-size:12px");
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

/* ============================================================
   ESTABILIZACIÓN FINAL DE PANELES Y BOTONES — 2026-05-21
   ============================================================ */
(function(){
  "use strict";

  var PAGE_IDS = ["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","entrevistas","contactos","recursos","metricas","dashboard","agente"];

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function run(fn, ms){ setTimeout(function(){ try{ fn(); }catch(e){ console.warn("[panel-final-fix]", e); } }, ms || 40); }
  function appVisible(){ var app = q("#app"); return !!app && (app.classList.contains("on") || getComputedStyle(app).display !== "none"); }

  function forceBaseCSS(){
    if(q("#panel-final-fix-css")) return;
    var st = document.createElement("style");
    st.id = "panel-final-fix-css";
    st.textContent = [
      "html,body{font-size:13px!important;overflow:hidden!important}",
      "#app{font-size:13px!important}",
      ".content{font-size:13px!important;overflow:auto!important}",
      ".ptitle{font-size:17px!important;line-height:1.2!important}",
      ".psub{font-size:11px!important}",
      ".btn,.ntab,.sbi{font-size:11px!important;line-height:1.2!important}",
      ".tc-t,.ntitle,.tmcard,.mcard{font-size:12px!important;line-height:1.35!important}",
      ".mod{font-size:13px!important;max-height:90vh!important;overflow:auto!important}",
      ".mod-t{font-size:16px!important;line-height:1.25!important}",
      ".fg input,.fg select,.fg textarea{font-size:12px!important;line-height:1.25!important}",
      ".ov:not(.open){display:none!important;pointer-events:none!important;visibility:hidden!important}",
      ".ov.open{display:flex!important;pointer-events:auto!important;visibility:visible!important}",
      "#evpanel:not(.open){display:none!important;pointer-events:none!important}",
      "#kanban .kcol[style*='display: none']{display:none!important}",
      "#calwscroll,#cal-day-content{position:relative!important;background:#fff!important;isolation:isolate!important}",
      "#calwscroll [onclick*='openEvPanel'],#calwscroll [onclick*='editPubItem'],#cal-day-content [onclick*='openEvPanel'],#cal-day-content [onclick*='editPubItem']{visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:30!important;min-height:24px!important;overflow:hidden!important}",
      "@media(max-width:760px){html,body,#app{font-size:12px!important}.ptitle{font-size:16px!important}.btn,.ntab,.sbi{font-size:10.5px!important}.mod{width:min(94vw,480px)!important}}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function closeGhostOverlays(){
    if(!appVisible()) return;
    qa(".ov").forEach(function(ov){
      if(!ov.classList.contains("open")){
        ov.style.display = "none";
        ov.style.pointerEvents = "none";
        ov.style.visibility = "hidden";
      }else{
        ov.style.pointerEvents = "auto";
        ov.style.visibility = "visible";
      }
    });
    qa("#evpanel").forEach(function(panel){
      if(!panel.classList.contains("open")){
        panel.style.display = "none";
        panel.style.pointerEvents = "none";
      }
    });
  }

  function getActivePage(){
    for(var i=0;i<PAGE_IDS.length;i++){
      var el = q("#p-" + PAGE_IDS[i]);
      if(el && !el.hidden && getComputedStyle(el).display !== "none") return PAGE_IDS[i];
    }
    return "hoy";
  }

  function normalizePages(active){
    active = active || getActivePage();
    PAGE_IDS.forEach(function(id){
      var el = q("#p-" + id);
      if(!el) return;
      if(id === active){
        el.hidden = false;
        el.style.display = (id === "calendario" || id === "publicaciones") ? "flex" : "block";
        el.style.visibility = "visible";
        el.style.pointerEvents = "auto";
      }else{
        el.hidden = true;
        el.style.display = "none";
        el.style.pointerEvents = "none";
      }
    });
    closeGhostOverlays();
  }

  function hideRealizadaEverywhere(){
    var kanban = q("#kanban");
    if(kanban){
      qa(".kcol", kanban).forEach(function(col){
        var hdr = q(".khdr", col);
        if(hdr && /realizada/i.test(hdr.textContent || "")) col.style.display = "none";
      });
    }
    var fest = q("#fest");
    if(fest){
      qa("option", fest).forEach(function(opt){
        if(/realizada/i.test(opt.value || opt.textContent || "")) opt.remove();
      });
      if(/realizada/i.test(fest.value || "")) fest.value = "Pendiente";
    }
  }

  function patchNav(){
    if(typeof window.nav !== "function" || window.nav._panelFinalFix) return;
    var orig = window.nav;
    window.nav = function(id){
      var r = orig.apply(this, arguments);
      run(function(){
        normalizePages(id);
        hideRealizadaEverywhere();
        if(id === "calendario") refreshCalendar();
        if(id === "tablero" && typeof window.renderKanban === "function") window.renderKanban();
        if(id === "equipo" && typeof window.renderTeam === "function") window.renderTeam();
      }, 80);
      run(function(){ normalizePages(id); closeGhostOverlays(); }, 350);
      return r;
    };
    window.nav._panelFinalFix = true;
  }

  function patchRenderers(){
    ["renderKanban","renderMaterial","renderWeek","renderPubDay","renderCal","renderCalDay","renderTeam","renderGuardias"].forEach(function(name){
      var orig = window[name];
      if(typeof orig !== "function" || orig._panelFinalFix) return;
      window[name] = function(){
        var r = orig.apply(this, arguments);
        run(function(){
          closeGhostOverlays();
          hideRealizadaEverywhere();
          if(name === "renderCal" || name === "renderCalDay" || name === "renderWeek") improveCalendarVisibility();
          bindCriticalButtons();
        }, 60);
        return r;
      };
      window[name]._panelFinalFix = true;
    });
  }

  function bindButtonByText(text, handler){
    qa("button").forEach(function(btn){
      var t = (btn.textContent || "").replace(/\s+/g," ").trim().toLowerCase();
      if(t.indexOf(text) !== -1 && !btn._panelFinalBound){
        btn._panelFinalBound = true;
        btn.addEventListener("click", function(ev){
          try{
            handler(btn, ev);
          }catch(e){ console.warn("[panel-final-fix] button", text, e); }
        }, true);
      }
    });
  }

  function bindCriticalButtons(){
    bindButtonByText("nueva tarea", function(btn, ev){
      if(typeof window.openTaskMod === "function"){
        ev.preventDefault(); ev.stopPropagation();
        window.openTaskMod(null, "Pendiente");
        run(function(){ var m=q("#modTask"); if(m){m.classList.add("open"); m.style.display="flex";} }, 20);
      }
    });
    bindButtonByText("programar", function(btn, ev){
      var card = btn.closest(".mcard");
      if(card && typeof window.openProgram === "function"){
        var onclick = btn.getAttribute("onclick") || "";
        if(onclick.indexOf("openProgram") !== -1) return;
        ev.preventDefault(); ev.stopPropagation();
        var title = (q("div", card)?.textContent || "Publicación").trim();
        window.openProgram("", title);
      }
    });
    bindButtonByText("agregar persona", function(btn, ev){
      if(typeof window.openMemberMod === "function"){
        ev.preventDefault(); ev.stopPropagation(); window.openMemberMod();
      }else if(typeof window.openEquipoMod === "function"){
        ev.preventDefault(); ev.stopPropagation(); window.openEquipoMod();
      }else{
        var m = q("#modEquipo");
        if(m){ ev.preventDefault(); ev.stopPropagation(); m.classList.add("open"); m.style.display="flex"; }
      }
    });
    bindButtonByText("nuevo evento", function(btn, ev){
      if(typeof window.openAgMod === "function"){
        ev.preventDefault(); ev.stopPropagation();
        var d = new Date();
        var iso = d.toISOString().slice(0,10);
        window.openAgMod(iso);
      }
    });
    bindButtonByText("nueva publicación", function(btn, ev){
      if(typeof window.openPubMod === "function"){
        ev.preventDefault(); ev.stopPropagation(); window.openPubMod();
      }
    });
  }

  function patchSaveProgram(){
    if(typeof window.saveProgram !== "function" || window.saveProgram._panelFinalFix) return;
    var orig = window.saveProgram;
    window.saveProgram = async function(){
      var r = await orig.apply(this, arguments);
      try{
        if(typeof window.renderWeek === "function") window.renderWeek();
        if(typeof window.renderPubDay === "function") window.renderPubDay();
        if(typeof window.renderMaterial === "function") window.renderMaterial();
        if(typeof window.updateBadges === "function") window.updateBadges();
        var pid = q("#p-publicaciones");
        if(pid && typeof window.nav === "function") window.nav("publicaciones");
      }catch(e){ console.warn("[panel-final-fix] saveProgram refresh", e); }
      return r;
    };
    window.saveProgram._panelFinalFix = true;
  }

  function improveCalendarVisibility(){
    qa("#calwscroll [onclick*='openEvPanel'],#calwscroll [onclick*='editPubItem'],#cal-day-content [onclick*='openEvPanel'],#cal-day-content [onclick*='editPubItem']").forEach(function(el){
      el.style.visibility = "visible";
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
      el.style.zIndex = "30";
      el.style.minHeight = "24px";
      if(el.style.display === "none") el.style.display = "block";
    });
    qa("#calwscroll [style*='background:#ef4444'],#cal-day-content [style*='background:#ef4444']").forEach(function(line){
      if(!/openEvPanel|editPubItem/.test(line.getAttribute("onclick") || "")){
        line.style.pointerEvents = "none";
        line.style.zIndex = "6";
      }
    });
  }

  function refreshCalendar(){
    if(typeof window.renderCal === "function") run(window.renderCal, 20);
    if(typeof window.renderCalDay === "function") run(window.renderCalDay, 80);
    run(improveCalendarVisibility, 180);
    run(improveCalendarVisibility, 600);
  }

  function initFinalFix(){
    forceBaseCSS();
    patchNav();
    patchRenderers();
    patchSaveProgram();
    bindCriticalButtons();
    closeGhostOverlays();
    hideRealizadaEverywhere();
    normalizePages(getActivePage());
    refreshCalendar();
    var count = 0;
    var iv = setInterval(function(){
      count++;
      patchNav(); patchRenderers(); patchSaveProgram(); bindCriticalButtons();
      closeGhostOverlays(); hideRealizadaEverywhere();
      if(getActivePage() === "calendario") improveCalendarVisibility();
      if(count > 30) clearInterval(iv);
    }, 500);
    try{
      new MutationObserver(function(){
        run(function(){ bindCriticalButtons(); closeGhostOverlays(); hideRealizadaEverywhere(); }, 80);
      }).observe(document.body, {childList:true, subtree:true});
    }catch(_e){}
    console.log("%c[panel-final-fix] UI estabilizada: botones, overlays, tipografía, calendario", "color:#16a34a;font-weight:bold");
  }

  if(document.readyState !== "loading") initFinalFix();
  else document.addEventListener("DOMContentLoaded", initFinalFix);
})();
