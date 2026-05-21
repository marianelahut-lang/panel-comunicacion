/* ============================================================
   MEJORAS6.JS - Panel Comunicación Tres Arroyos
   ------------------------------------------------------------
   FIX 1: Columna "Realizada" no debe mostrarse en el Kanban
   FIX 2: Re-render de Hoy cuando carga GCal
   FIX 3: Tareas urgentes limitadas y ordenadas
   FIX 4: Rescate seguro de clicks de botones principales
   ============================================================
   v3-safe-clicks — 2026-05-21
   ============================================================ */

(function () {
  "use strict";

  function ocultarColRealizadaDOM() {
    var kanban = document.getElementById("kanban");
    if (!kanban) return;
    kanban.querySelectorAll(".kcol").forEach(function (col) {
      var hdr = col.querySelector(".khdr");
      if (hdr && hdr.textContent.trim().toLowerCase().includes("realizada")) col.style.display = "none";
    });
  }

  function iniciarObserverKanban() {
    var kanban = document.getElementById("kanban");
    if (!kanban) { setTimeout(iniciarObserverKanban, 500); return; }
    ocultarColRealizadaDOM();
    var mo = new MutationObserver(function () { ocultarColRealizadaDOM(); });
    mo.observe(kanban, { childList: true, subtree: true });
  }

  function iniciarObserverGCal() {
    var gcBtn = document.querySelector(".gcbtn");
    if (!gcBtn) { setTimeout(iniciarObserverGCal, 600); return; }
    var ya = false;
    var mo = new MutationObserver(function () {
      var txt = gcBtn.textContent || "";
      if (!ya && txt.match(/GCal\s*[·\·]\s*\d+\s*ev/i)) {
        ya = true;
        var phoy = document.getElementById("p-hoy");
        if (phoy && phoy.style.display !== "none") {
          setTimeout(function () { if (typeof window._renderHoy === "function") window._renderHoy(); }, 300);
        }
        setTimeout(function () { ya = false; }, 5000);
      }
    });
    mo.observe(gcBtn, { childList: true, subtree: true, characterData: true });
  }

  function parchearRenderHoy() {
    if (!window._renderHoy || window._renderHoy._m6patched) return;
    var orig = window._renderHoy;
    window._renderHoy = function () {
      orig.apply(this, arguments);
      setTimeout(reescribirCardUrgentes, 50);
    };
    window._renderHoy._m6patched = true;
  }

  function reescribirCardUrgentes() {
    var phoy = document.getElementById("p-hoy");
    if (!phoy) return;
    var cards = phoy.querySelectorAll("div"), urgCard = null;
    for (var i = 0; i < cards.length; i++) {
      var el = cards[i];
      if (el.children.length === 2 && el.children[0] && el.children[0].textContent.includes("Tareas urgentes")) { urgCard = el; break; }
    }
    if (!urgCard || !urgCard.children[1]) return;
    var cb = urgCard.children[1];
    var tareas = (typeof tasks !== "undefined" && Array.isArray(tasks)) ? tasks : [];
    var urgentes = tareas.filter(function (t) {
      return t.prioridad === "Alta" && t.estado !== "Completo" && t.estado !== "Listo s/publicar" && t.estado !== "Lista para publicar" && t.estado !== "Realizada";
    }).sort(function (a, b) { return String(a.created_at || "").localeCompare(String(b.created_at || "")); });
    var mostrar = urgentes.slice(0, 5);
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
      var desc = document.createElement("div");
      desc.style.cssText = "font-size:12px;font-weight:500;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;padding-right:20px";
      desc.textContent = t.descripcion || "";
      var meta = document.createElement("div");
      meta.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap;font-size:10px;color:#6b7280";
      meta.textContent = t.responsable || "";
      info.appendChild(desc); info.appendChild(meta);
      var delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.title = "Eliminar tarea";
      delBtn.style.cssText = "position:absolute;top:8px;right:0;background:none;border:none;cursor:pointer;color:#d1d5db;font-size:13px;padding:0;line-height:1;font-family:inherit";
      delBtn.onclick = function (e) { e.stopPropagation(); borrarTareaUrgente(t); };
      it.appendChild(chk); it.appendChild(info); it.appendChild(delBtn); cb.appendChild(it);
    });
  }

  function borrarTareaUrgente(t) {
    if (!confirm("¿Eliminar \"" + ((t.descripcion || "esta tarea").slice(0, 40)) + "\"?")) return;
    if (typeof tasks !== "undefined" && Array.isArray(tasks)) {
      var idx = tasks.findIndex(function (x) { return String(x.id) === String(t.id); });
      if (idx !== -1) tasks.splice(idx, 1);
    }
    var dbx = window.db || (typeof db !== "undefined" ? db : null);
    if (dbx && typeof dbx.from === "function") dbx.from("tareas").delete().eq("id", t.id).then(function(){}).catch(function(e){console.warn(e);});
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
      else if (intentos > 20) clearInterval(iv);
    }, 500);
    console.log("[mejoras6] modo seguro + rescate clicks");
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

/* ============================================================
   RESCATE SEGURO DE CLICKS — no bloquea eventos originales
   ============================================================ */
(function(){
  "use strict";

  function q(sel, root){ return (root || document).querySelector(sel); }
  function txt(el){ return String((el && el.textContent) || "").replace(/\s+/g," ").trim().toLowerCase(); }
  function openOverlay(id){ var m = document.getElementById(id); if(m){ m.classList.add("open"); m.style.display = "flex"; m.style.visibility = "visible"; m.style.pointerEvents = "auto"; } }
  function closed(id){ var m = document.getElementById(id); return !m || (!m.classList.contains("open") && getComputedStyle(m).display === "none"); }

  function injectCSS(){
    if(q("#m6-click-rescue-css")) return;
    var st = document.createElement("style");
    st.id = "m6-click-rescue-css";
    st.textContent = [
      ".ov:not(.open),.overlay:not(.open){pointer-events:none!important}",
      ".ov:not(.open){display:none!important;visibility:hidden!important}",
      "#installBanner.hidden,#install-banner.hidden{display:none!important;pointer-events:none!important}",
      ".toast:not(.show){pointer-events:none!important}",
      "button,.btn,.btn-sm,.btn-pri,.btn-sec,.kadd,.mcard button,.tc,select{pointer-events:auto!important}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function callInline(btn){
    var code = btn && btn.getAttribute && btn.getAttribute("onclick");
    if(!code) return false;
    try{ new Function("event", code).call(btn, window.event || null); return true; }
    catch(e){ console.warn("[click-rescue] inline failed", e); return false; }
  }

  function rescueClick(btn){
    var label = txt(btn);

    if(label.indexOf("nueva tarea") !== -1 || label === "+ agregar"){
      if(typeof window.openTaskMod === "function" && closed("modTask")){
        window.openTaskMod(null,"Pendiente");
        setTimeout(function(){ openOverlay("modTask"); }, 30);
        return true;
      }
    }

    if(label.indexOf("programar") !== -1){
      if(!closed("modProgram")) return false;
      if(callInline(btn)) return true;
      var card = btn.closest && btn.closest(".mcard");
      if(card && typeof window.openProgram === "function"){
        var title = (card.querySelector("div") ? card.querySelector("div").textContent : "Publicación").trim();
        window.openProgram("", title);
        setTimeout(function(){ openOverlay("modProgram"); }, 30);
        return true;
      }
    }

    if(label.indexOf("nuevo evento") !== -1){
      if(typeof window.openAgMod === "function" && closed("modAg")){
        var d = new Date().toISOString().slice(0,10);
        window.openAgMod(d);
        setTimeout(function(){ openOverlay("modAg"); }, 30);
        return true;
      }
    }

    if(label.indexOf("nueva publicación") !== -1 || label.indexOf("nueva publicacion") !== -1){
      if(typeof window.openPubMod === "function" && closed("modPub")){
        window.openPubMod();
        setTimeout(function(){ openOverlay("modPub"); }, 30);
        return true;
      }
    }

    if(label.indexOf("agregar persona") !== -1 || label.indexOf("nuevo integrante") !== -1){
      if(typeof window.openMemberMod === "function") { window.openMemberMod(); return true; }
      if(typeof window.openEquipoMod === "function") { window.openEquipoMod(); return true; }
      openOverlay("modEquipo"); return true;
    }

    if(label.indexOf("completo") !== -1 || label.indexOf("guardar") !== -1 || label.indexOf("cancelar") !== -1 || label.indexOf("eliminar") !== -1){
      return callInline(btn);
    }

    return false;
  }

  function initClickRescue(){
    injectCSS();
    document.addEventListener("click", function(ev){
      var btn = ev.target && ev.target.closest && ev.target.closest("button,.btn,.btn-sm,.btn-pri,.btn-sec,.kadd");
      if(!btn) return;
      setTimeout(function(){ rescueClick(btn); }, 80);
    }, false);
    console.log("[click-rescue] activo");
  }

  if(document.readyState !== "loading") initClickRescue();
  else document.addEventListener("DOMContentLoaded", initClickRescue);
})();
