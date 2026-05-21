/*
  UI-FIXES.JS - reglas finales del panel
  - Navegacion estable
  - Hoy: solo 10 pendientes con mayor demora
  - Agenda de hoy y Calendario: opcion Cubrir / No cubrir
  - Tablero: eliminar columna Realizada
*/
(function(){
  "use strict";

  var PAGES = ["hoy","tablero","material","publicaciones","calendario","guardias","equipo","metricas","medios","reclamos","entrevistas","contactos","recursos","biblioteca","agente","dashboard","cobertura"];
  var FLEX = { publicaciones:true, calendario:true };
  var ALIAS = { agenda:"publicaciones", publicacion:"publicaciones", publicaciones:"publicaciones", guardia:"guardias", guardias:"guardias", biblioteca:"recursos", recurso:"recursos", recursos:"recursos", contacto:"contactos", contactos:"contactos", medio:"medios", medios:"medios", metrica:"metricas", metricas:"metricas" };

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(id){ id = String(id || "hoy").trim().toLowerCase(); return ALIAS[id] || id; }
  function mainEl(){ return q("#main") || q(".content"); }
  function displayFor(id){ return FLEX[id] ? "flex" : "block"; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function daysOld(value){ var d = value ? new Date(value) : null; if(!d || isNaN(d)) return 0; d.setHours(0,0,0,0); var n = new Date(); n.setHours(0,0,0,0); return Math.max(0, Math.floor((n-d)/86400000)); }
  function activeTasks(){ try{ return Array.isArray(tasks) ? tasks : []; }catch(_e){ return []; } }

  function cleanBrokenText(){
    var map = {"Â·":"·","Ã¡":"á","Ã©":"é","Ã­":"í","Ã³":"ó","Ãº":"ú","Ã±":"ñ","dÃ­a":"día","DÃ­a":"Día","publicaciÃ³n":"publicación","descripciÃ³n":"descripción"};
    try{
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false), node, n=0;
      while((node = w.nextNode()) && n < 900){ n++; var v=node.nodeValue||""; Object.keys(map).forEach(function(k){ v=v.split(k).join(map[k]); }); node.nodeValue=v; }
    }catch(_e){}
  }

  function closeClosedModals(){
    qa(".ov,.overlay").forEach(function(m){
      if(!m.classList.contains("open")){
        m.classList.remove("show","active","on");
        m.style.setProperty("display","none","important");
        m.style.setProperty("pointer-events","none","important");
      }
    });
  }

  function buttonId(btn){
    if(!btn) return "";
    var direct = btn.getAttribute("data-mid") || btn.getAttribute("data-nav") || (btn.dataset && btn.dataset.nav) || "";
    if(direct) return norm(direct);
    var onclick = btn.getAttribute("onclick") || "";
    var m = onclick.match(/(?:nav|exitFullPanel)\(['\"]([^'\"]+)['\"]/);
    return m ? norm(m[1]) : "";
  }

  function setActiveButtons(id, explicit){
    qa(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]").forEach(function(btn){
      var on = btn === explicit || buttonId(btn) === id;
      btn.classList.toggle("on", on); btn.classList.toggle("mbn-active", on);
      if(on) btn.setAttribute("aria-current","page"); else btn.removeAttribute("aria-current");
    });
  }

  function showOnly(id, explicit, skipRender){
    id = norm(id);
    var main = mainEl();
    PAGES.forEach(function(p){
      var el = q("#p-" + p);
      if(!el) return;
      if(main && el.parentElement !== main && p !== "cobertura") main.appendChild(el);
      var on = p === id || (id === "recursos" && p === "biblioteca");
      el.hidden = !on;
      el.style.setProperty("display", on ? displayFor(id) : "none", "important");
      el.style.setProperty("visibility", on ? "visible" : "hidden", "important");
      el.classList.toggle("active", on);
      el.classList.toggle("show", on);
    });
    document.body.setAttribute("data-active-panel", id);
    setActiveButtons(id, explicit || null);
    closeClosedModals();
    if(!skipRender){
      setTimeout(function(){ renderFor(id); showOnly(id, explicit, true); }, 40);
      setTimeout(finalRules, 220);
    }else{
      finalRules();
    }
    return false;
  }

  function renderFor(id){
    var map = { hoy:["_renderHoy","renderPanelHoyCustom"], tablero:["renderKanban"], material:["renderMaterial"], publicaciones:["renderPubDay","renderWeek"], calendario:["renderCal","renderCalDay"], guardias:["initGuardias","renderGuardias","renderGuardDay"], equipo:["renderTeam","renderPersons"], medios:["renderNoticias","renderMedioSum","renderMediosList"], reclamos:["renderReclamos"], entrevistas:["renderEntrevistas"], contactos:["renderContactos","renderContactosMediosModulo"], recursos:["loadRecursos","renderRecursos"], metricas:["renderMetricas"] };
    (map[id] || []).forEach(function(fn){ try{ if(typeof window[fn] === "function") window[fn](); }catch(e){ console.warn("[ui-fixes] render", fn, e); } });
  }

  function installNav(){
    window.nav = function(id, tab, sb){ return showOnly(id, sb || tab || null, false); };
    window.nav._stableFinal = true; window.nav._v4patched = true; window.nav._v5patched = true;
    window.exitFullPanel = function(id){ document.body.classList.remove("full-panel","show-calendario","show-publicaciones","show-guardias"); return showOnly(id || document.body.getAttribute("data-active-panel") || "hoy", null, false); };
  }

  function removeRealizadaColumn(){
    var kanban = q("#kanban"); if(!kanban) return;
    qa(".kcol", kanban).forEach(function(col){
      var head = q(".khdr,.kt", col);
      var text = (head ? head.textContent : col.textContent || "").toLowerCase();
      if(/realizad/.test(text)) col.remove();
    });
    var fest = q("#fest");
    if(fest){ qa("option", fest).forEach(function(o){ if(/realizad/i.test(o.textContent || o.value || "")) o.remove(); }); if(/realizad/i.test(fest.value||"")) fest.value="Pendiente"; }
  }

  function installKanbanPatch(){
    if(typeof window.renderKanban === "function" && !window.renderKanban._uiNoRealizada){
      var orig = window.renderKanban;
      window.renderKanban = function(){ var r = orig.apply(this, arguments); setTimeout(removeRealizadaColumn, 20); setTimeout(removeRealizadaColumn, 180); return r; };
      window.renderKanban._uiNoRealizada = true;
    }
  }

  function hideLegacyUrgentes(){
    var host = q("#p-hoy"); if(!host) return;
    qa("section, .card, .m7-card, div", host).forEach(function(el){
      if(el.id === "ui-top10-pendientes" || el.closest && el.closest("#ui-top10-pendientes")) return;
      var text = (el.textContent || "").replace(/\s+/g," ").trim().toLowerCase();
      if(text.indexOf("tareas urgentes") !== -1){
        // ocultar la tarjeta contenedora, no cada texto interno suelto
        var parent = el;
        for(var i=0;i<4 && parent && parent.parentElement && parent.parentElement.id !== "p-hoy";i++){
          if((parent.parentElement.textContent || "").toLowerCase().indexOf("tareas urgentes") !== -1) parent = parent.parentElement;
        }
        parent.style.setProperty("display", "none", "important");
        parent.classList.add("ui-hide-legacy-urgent");
      }
    });
  }

  function renderTop10Pendientes(){
    var host = q("#p-hoy"); if(!host) return;
    var list = activeTasks().filter(function(t){ var e=String(t.estado||"").toLowerCase(); return e !== "completo" && e !== "completa" && e !== "realizada" && e !== "realizado" && e !== "lista para publicar" && e !== "listo s/publicar"; })
      .map(function(t){ return {t:t, age:daysOld(t.created_at || t.updated_at || t.fecha)}; })
      .sort(function(a,b){ return (b.age-a.age) || String(a.t.created_at||"").localeCompare(String(b.t.created_at||"")); })
      .slice(0,10);
    var card = q("#ui-top10-pendientes", host);
    if(!card){ card = document.createElement("section"); card.id = "ui-top10-pendientes"; card.className = "ui-top10-card"; var insertAfter = qa("#p-hoy > *", host)[1] || host.firstChild; if(insertAfter && insertAfter.parentNode) insertAfter.parentNode.insertBefore(card, insertAfter.nextSibling); else host.insertBefore(card, host.firstChild); }
    card.innerHTML = '<div class="ui-top10-head"><div><div class="ui-kicker">Seguimiento</div><h3>10 actividades pendientes con mayor demora</h3></div><span>'+list.length+'/10</span></div>' +
      (list.length ? list.map(function(x, i){ var t=x.t; return '<button class="ui-top10-row" type="button" data-task-id="'+esc(t.id)+'">' +
        '<b>'+(i+1)+'</b><div><strong>'+esc(t.descripcion || "Sin descripción")+'</strong><small>'+esc(t.responsable || "Sin asignar")+' · '+esc(t.estado || "Pendiente")+' · Prioridad '+esc(t.prioridad || "Media")+'</small></div><em>'+x.age+'<small>días</small></em></button>'; }).join("") : '<div class="ui-empty">No hay actividades pendientes.</div>');
    qa("[data-task-id]", card).forEach(function(btn){ if(btn._bound) return; btn._bound=true; btn.addEventListener("click", function(){ var id=this.getAttribute("data-task-id"); if(typeof window.editTask === "function") window.editTask(id); else if(typeof window.openTaskMod === "function") window.openTaskMod(id); }); });
    hideLegacyUrgentes();
  }

  function coverageKey(el){
    var onclick = el.getAttribute && (el.getAttribute("onclick") || "") || "";
    var m = onclick.match(/String\(x\.id\)==='([^']+)'/) || onclick.match(/openEvPanel\(['\"]([^'\"]+)/) || onclick.match(/editPubItem\(['\"]([^'\"]+)/);
    return m ? m[1] : (el.textContent || "").replace(/\s+/g," ").trim().slice(0,110);
  }
  function coverMap(){ try{ return JSON.parse(localStorage.getItem("ui_cover_map") || "{}"); }catch(_e){ return {}; } }
  function saveCoverMap(m){ try{ localStorage.setItem("ui_cover_map", JSON.stringify(m)); }catch(_e){} }
  function isCovered(key){ try{ if(typeof cobSel !== "undefined" && cobSel && key in cobSel) return !!cobSel[key]; }catch(_e){} var m=coverMap(); return !!m[key]; }
  function setCovered(key, value){ try{ if(typeof cobSel !== "undefined" && cobSel) cobSel[key]=value; }catch(_e){} var m=coverMap(); m[key]=value; saveCoverMap(m); }

  function addCoverButtonTo(el){
    if(!el || el._coverReady || (el.querySelector && el.querySelector(".ui-cover-toggle"))) return;
    var key = coverageKey(el); if(!key || key.length < 6) return;
    el._coverReady = true;
    var btn = document.createElement("button"); btn.type="button"; btn.className="ui-cover-toggle"; btn.dataset.coverKey = key;
    function paint(){ var on=isCovered(key); btn.textContent = on ? "✓ Se cubre" : "Cubrir"; btn.classList.toggle("on", on); }
    btn.addEventListener("click", function(ev){ ev.preventDefault(); ev.stopPropagation(); if(typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation(); setCovered(key, !isCovered(key)); paint(); });
    paint();
    el.appendChild(btn);
  }

  function addCoverButtons(){
    // Calendario completo
    qa("#p-calendario [onclick*='openEvPanel'],#p-calendario [onclick*='editPubItem']").forEach(addCoverButtonTo);

    // Agenda de hoy: filas visibles con hora aunque no tengan onclick
    var host = q("#p-hoy"); if(!host) return;
    qa("div, li, button", host).forEach(function(el){
      if(el.closest && (el.closest("#ui-top10-pendientes") || el.closest(".ui-hide-legacy-urgent"))) return;
      if(el.querySelector && el.querySelector(".ui-cover-toggle")) return;
      var text = (el.textContent || "").replace(/\s+/g," ").trim();
      var looksAgenda = /(\b\d{1,2}:\d{2}\s*hs\b|\b\d{1,2}:\d{2}\b)/i.test(text) && text.length > 12 && text.length < 260;
      var hasAgendaTitle = text.toLowerCase().indexOf("agenda de hoy") !== -1;
      if(looksAgenda && !hasAgendaTitle){
        var row = el;
        for(var i=0;i<2 && row.parentElement && row.parentElement.id !== "p-hoy";i++){
          var ptxt = (row.parentElement.textContent || "").replace(/\s+/g," ").trim();
          if(ptxt.length < 320) row = row.parentElement;
        }
        addCoverButtonTo(row);
      }
    });
  }

  function fixCalendarReadable(){
    var cal = q("#p-calendario"); if(!cal) return;
    cal.classList.add("ui-cal-readable");
    var sc = q("#calwscroll"); if(sc){ sc.style.setProperty("overflow","auto","important"); var inner=sc.firstElementChild; if(inner) inner.style.setProperty("min-width","1480px","important"); }
    qa("#p-calendario [onclick*='openEvPanel'],#p-calendario [onclick*='editPubItem']").forEach(function(el){
      el.classList.add("ui-cal-event-readable");
      el.style.setProperty("white-space","normal","important"); el.style.setProperty("word-break","normal","important"); el.style.setProperty("overflow-wrap","break-word","important");
      el.style.setProperty("font-size","10.5px","important"); el.style.setProperty("line-height","1.18","important"); el.style.setProperty("min-width","110px","important"); el.style.setProperty("min-height","38px","important");
      if(!el.title) el.title=(el.textContent||"").replace(/\s+/g," ").trim();
    });
  }

  function clickRescue(){
    document.addEventListener("click", function(ev){
      var btn = ev.target && ev.target.closest && ev.target.closest("button,.btn,.btn-sm,.btn-pri,.btn-sec,.kadd"); if(!btn) return;
      setTimeout(function(){
        var label=(btn.textContent||"").toLowerCase();
        if(label.indexOf("programar") !== -1 && typeof window.openProgram === "function"){
          var card = btn.closest(".mcard,.card,div"); var title = card ? (card.textContent||"Publicación").replace(/Programar|Completo/g,"").trim() : "Publicación";
          if(!q("#modProgram.open")) window.openProgram("", title);
        }
        if((label.indexOf("nueva tarea") !== -1 || label === "+ agregar") && typeof window.openTaskMod === "function" && !q("#modTask.open")) window.openTaskMod(null,"Pendiente");
      }, 70);
    }, false);
  }

  function css(){
    if(q("#ui-final-rules-css")) return;
    var st=document.createElement("style"); st.id="ui-final-rules-css";
    st.textContent = [
      "html,body{font-size:13px!important;line-height:1.34!important}",
      ".content{overflow-y:auto!important;overflow-x:hidden!important;scroll-behavior:auto!important}",
      "#kanban{height:calc(100vh - 155px)!important;overflow-x:auto!important;overflow-y:hidden!important;align-items:stretch!important}",
      "#kanban .kcol{height:100%!important;min-width:300px!important}",
      "#kanban .kbody{max-height:calc(100vh - 245px)!important;overflow-y:auto!important;overflow-x:hidden!important}",
      "#ui-top10-pendientes{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:14px 16px;margin:14px 0;box-shadow:0 8px 20px rgba(15,23,42,.05)}",
      ".ui-top10-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.ui-top10-head h3{font-size:17px!important;margin:0}.ui-top10-head span{background:#fee2e2;color:#b91c1c;border-radius:999px;padding:6px 10px;font-weight:900}.ui-kicker{font-size:10px;text-transform:uppercase;color:#ef4444;font-weight:900;letter-spacing:.08em}",
      ".ui-top10-row{width:100%;display:grid;grid-template-columns:34px minmax(0,1fr) 52px;gap:10px;align-items:center;border:1px solid #fecaca;background:#fff1f2;border-radius:10px;padding:8px 10px;margin:7px 0;text-align:left;cursor:pointer;font-family:Inter,sans-serif}.ui-top10-row>b{width:28px;height:28px;border-radius:9px;background:#eef2f7;display:grid;place-items:center}.ui-top10-row strong{display:block;font-size:13px;line-height:1.22}.ui-top10-row small{display:block;font-size:11px;color:#64748b;margin-top:2px}.ui-top10-row em{text-align:center;font-style:normal;font-weight:900;font-size:18px}.ui-top10-row em small{font-size:8px;text-transform:uppercase;color:#7f1d1d}",
      "#p-calendario.ui-cal-readable #calwscroll{overflow:auto!important}#p-calendario.ui-cal-readable #calwscroll>div{min-width:1480px!important}",
      ".ui-cal-event-readable{min-width:110px!important;max-width:220px!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;font-size:10.5px!important;line-height:1.18!important}",
      ".ui-cover-toggle{display:inline-flex!important;margin-top:5px!important;padding:3px 7px!important;border:1px solid #93c5fd!important;border-radius:999px!important;background:#eff6ff!important;color:#1d4ed8!important;font:800 10px Inter,sans-serif!important;cursor:pointer!important;white-space:nowrap!important;align-items:center!important;justify-content:center!important}.ui-cover-toggle.on{background:#dcfce7!important;border-color:#86efac!important;color:#15803d!important}",
      ".ui-hide-legacy-urgent{display:none!important}",
      ".ov:not(.open),.overlay:not(.open){display:none!important;pointer-events:none!important}.ov.open,.overlay.open{display:flex!important;pointer-events:auto!important}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function finalRules(){
    cleanBrokenText(); removeRealizadaColumn(); renderTop10Pendientes(); hideLegacyUrgentes(); fixCalendarReadable(); addCoverButtons();
  }

  function run(){
    css(); installNav(); installKanbanPatch(); closeClosedModals();
    var active = norm(document.body.getAttribute("data-active-panel") || "hoy");
    if(!q("#p-"+active)) active="hoy";
    showOnly(active, null, false);
    finalRules();
  }

  document.addEventListener("click", function(e){
    var navBtn = e.target && e.target.closest && e.target.closest(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]");
    if(!navBtn) return;
    var id = buttonId(navBtn); if(!id) return;
    e.preventDefault(); e.stopPropagation(); if(typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    showOnly(id, navBtn, false);
  }, true);
  clickRescue();

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, {once:true}); else run();
  setTimeout(run, 300); setTimeout(finalRules, 900); setTimeout(finalRules, 1800);
  setInterval(function(){ var active=document.body.getAttribute("data-active-panel"); if(active==="hoy"||active==="tablero"||active==="calendario") finalRules(); }, 1500);

  window.uiFixesRun = run;
  console.log("[ui-fixes] hoy unico top10 + cubrir agenda");
})();
