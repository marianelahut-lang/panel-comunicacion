/* ============================================================
   MEJORAS7.JS - Panel Comunicacion Tres Arroyos
   Estabilizacion completa - 2026-05-20c
   ------------------------------------------------------------
   Completa el archivo cortado, evita el error runtime por tokens
   sueltos, fuerza UI estable en Hoy/Calendario/Guardias y agrega
   acceso al generador sin tocar ni migrar datos.
   ============================================================ */
(function(){
  "use strict";

  var GENERADOR_URL = "generador-flyers.html";
  var PAGINAS = ["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","entrevistas","contactos","recursos","metricas","dashboard","agente"];
  var debounceTimer = null;

  function ready(fn){
    if(document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s){ return String(s || "").replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function norm(s){ return String(s || "").trim().toLowerCase(); }
  function visible(el){ return !!el && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden"; }
  function today0(){ var d = new Date(); d.setHours(0,0,0,0); return d; }
  function ageDays(value){
    if(!value) return 0;
    var d = new Date(value);
    if(isNaN(d)) return 0;
    d.setHours(0,0,0,0);
    return Math.max(0, Math.floor((today0() - d) / 86400000));
  }
  function isActiveTask(t){
    var e = norm(t && t.estado);
    return e !== "completo" && e !== "completa" && e !== "realizada" && e !== "realizado" && e !== "lista para publicar";
  }
  function activeDisplay(id){ return (id === "calendario" || id === "publicaciones") ? "flex" : "block"; }
  function schedule(fn, ms){ setTimeout(function(){ try{ fn(); }catch(e){ console.warn("[mejoras7]", e); } }, ms || 80); }

  function abrirGenerador(){ window.location.href = GENERADOR_URL; }
  window.abrirGeneradorFlyers = abrirGenerador;

  function iconoFlyer(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 7h8M8 11h8M8 15h5"></path></svg>';
  }

  function agregarAccesoGenerador(){
    var ntabs = q(".ntabs");
    if(ntabs && !q("#ntab-generador-flyers")){
      var btn = document.createElement("button");
      btn.id = "ntab-generador-flyers";
      btn.className = "ntab";
      btn.type = "button";
      btn.textContent = "Generador";
      btn.title = "Abrir generador de flyers municipales";
      btn.onclick = abrirGenerador;
      ntabs.appendChild(btn);
    }
    var sb = q("aside.sb");
    if(sb && !q("#sbi-generador-flyers")){
      var sep = document.createElement("div"); sep.className = "div m7-generator-sep";
      var sec = document.createElement("div"); sec.className = "sb-sec m7-generator-sec"; sec.textContent = "Herramientas";
      var b = document.createElement("button");
      b.id = "sbi-generador-flyers";
      b.className = "sbi";
      b.type = "button";
      b.innerHTML = iconoFlyer() + '<span class="sbi-lbl">Generador de flyers</span>';
      b.onclick = abrirGenerador;
      sb.appendChild(sep); sb.appendChild(sec); sb.appendChild(b);
    }
    var mobile = q("#mobile-bottom-nav");
    if(mobile && !q("#mbn-generador-flyers")){
      var mb = document.createElement("button");
      mb.id = "mbn-generador-flyers";
      mb.className = "mbn-btn";
      mb.type = "button";
      mb.innerHTML = iconoFlyer() + "<span>Flyers</span>";
      mb.onclick = abrirGenerador;
      mobile.appendChild(mb);
    }
  }

  function sincronizarVersionVisible(){
    var meta = q('meta[name="app-version"]');
    if(!meta || !meta.content) return;
    qa(".logo-s").forEach(function(el){ el.textContent = "Muni · Tres Arroyos · " + meta.content; });
  }

  function limpiarSidebarFantasma(){
    var sb = q("aside.sb");
    if(!sb) return;
    try{
      var walker = document.createTreeWalker(sb, NodeFilter.SHOW_TEXT, null, false);
      var node, borrar = [];
      while((node = walker.nextNode())){
        if(/^Tareas del d/i.test((node.nodeValue || "").trim())) borrar.push(node);
      }
      borrar.forEach(function(n){ if(n.parentNode) n.parentNode.removeChild(n); });
    }catch(_e){}
    var fPanel = q("#fPanel") || q("#fpanel");
    if(fPanel){ fPanel.style.display = "none"; fPanel.style.margin = "4px 8px 6px"; }
    var sbpersons = q("#sbpersons");
    if(sbpersons) sbpersons.style.display = "none";
  }

  function limpiarLoginDuplicado(){
    var sel = q("#lu");
    if(!sel) return;
    qa('option[value=""]', sel).forEach(function(opt, idx){ if(idx > 0) opt.remove(); });
  }

  function normalizarPaginasVisibles(active){
    if(!active || !q("#p-" + active)) return;
    PAGINAS.forEach(function(id){
      var el = q("#p-" + id);
      if(!el) return;
      if(id === active){
        el.hidden = false;
        el.style.display = activeDisplay(id);
        el.style.visibility = "visible";
      }else{
        el.hidden = true;
        el.style.display = "none";
      }
    });
    if(active === "hoy") estabilizarVistaHoy();
  }

  function patchRealtimeDuplicados(){
    function aplicar(db){
      if(!db || typeof db.channel !== "function" || db._m7channelPatched) return !!(db && db._m7channelPatched);
      db._m7channelPatched = true;
      var activos = {};
      var orig = db.channel.bind(db);
      db.channel = function(name){
        if(activos[name]){
          var noop = { on:function(){ return noop; }, subscribe:function(){ return noop; }, unsubscribe:function(){} };
          return noop;
        }
        activos[name] = true;
        return orig(name);
      };
      return true;
    }
    if(aplicar(window.db)) return;
    var n = 0;
    var iv = setInterval(function(){
      n++;
      var dbx = window.db || (typeof db !== "undefined" ? db : null);
      if(aplicar(dbx) || n > 30) clearInterval(iv);
    }, 300);
  }

  function ocultarColumnaRealizada(){
    var kanban = q("#kanban");
    if(!kanban) return;
    qa(".kcol", kanban).forEach(function(col){
      var hdr = q(".khdr", col);
      if(hdr && /realizada/i.test(hdr.textContent || "")) col.style.display = "none";
    });
  }

  function patchRenderKanbanSeguro(){
    var orig = window.renderKanban;
    if(typeof orig !== "function" || orig._m7safe) return;
    window.renderKanban = function(){
      if(!q("#kanban")) return;
      if(typeof tasks === "undefined" || !Array.isArray(tasks)) return;
      var r = orig.apply(this, arguments);
      schedule(function(){ ocultarColumnaRealizada(); renderTareasMayorDemora(); }, 50);
      return r;
    };
    window.renderKanban._m7safe = true;
  }

  function mejorarVisibilidadCalendario(){
    var selectors = '#calwscroll [onclick*="openEvPanel"],#calwscroll [onclick*="editPubItem"],#cal-day-content [onclick*="openEvPanel"],#cal-day-content [onclick*="editPubItem"]';
    qa(selectors).forEach(function(card){
      card.classList.add("m7-cal-event");
      card.style.opacity = "1";
      card.style.visibility = "visible";
      if(card.style.display === "none") card.style.display = "block";
      card.style.pointerEvents = "auto";
      card.style.zIndex = "40";
      if(!card.title) card.title = (card.textContent || "").trim().replace(/\s+/g, " ");
    });
    qa('#calwscroll [style*="background:#ef4444"]:not(button), #cal-day-content [style*="background:#ef4444"]:not(button)').forEach(function(line){
      line.style.pointerEvents = "none";
      line.style.zIndex = "6";
    });
  }

  function patchCalendarioVisible(){
    ["renderCal", "renderCalDay", "renderWeek", "buildWeek"].forEach(function(name){
      var orig = window[name];
      if(typeof orig !== "function" || orig._m7calVisible) return;
      window[name] = function(){
        var r = orig.apply(this, arguments);
        schedule(mejorarVisibilidadCalendario, 70);
        schedule(mejorarVisibilidadCalendario, 320);
        return r;
      };
      window[name]._m7calVisible = true;
    });
    ["calwscroll", "cal-day-content"].forEach(function(id){
      var el = q("#" + id);
      if(!el || el._m7calObserved) return;
      el._m7calObserved = true;
      try{ new MutationObserver(function(){ schedule(mejorarVisibilidadCalendario, 80); }).observe(el, {childList:true, subtree:true, attributes:true}); }catch(_e){}
    });
    mejorarVisibilidadCalendario();
  }

  function ocultarDiasPasadosEnGuardias(){
    var bloque = q("#m1-pubs-guardias");
    if(!bloque) return;
    var ahora = today0();
    var hoy = ahora.getFullYear() + "-" + String(ahora.getMonth()+1).padStart(2,"0") + "-" + String(ahora.getDate()).padStart(2,"0");
    qa("div[style*='margin-bottom']", bloque).forEach(function(block){
      var hdr = q("div[style*='text-transform']", block);
      if(!hdr) return;
      var m = (hdr.textContent || "").match(/(\d{1,2})\/(\d{1,2})/);
      if(!m) return;
      var fecha = ahora.getFullYear() + "-" + String(parseInt(m[2],10)).padStart(2,"0") + "-" + String(parseInt(m[1],10)).padStart(2,"0");
      if(fecha < hoy) block.style.display = "none";
    });
  }

  function estabilizarVistaHoy(){
    var host = q("#p-hoy");
    if(!host || !visible(host)) return;
    host.hidden = false;
    host.classList.add("m7-hoy-stable");
    host.style.display = "block";
    host.style.visibility = "visible";
    qa("#m1-panel-hoy").forEach(function(el, idx){ if(idx > 0 || el.parentNode !== host) el.remove(); });
    qa("#m7-tareas-demora").forEach(function(el, idx){ if(idx > 0 || el.parentNode !== host) el.remove(); });
    Array.prototype.slice.call(host.children).forEach(function(child){
      if(child.id === "m1-panel-hoy" || child.id === "m7-tareas-demora"){
        child.hidden = false;
        child.style.visibility = "visible";
        if(child.id === "m1-panel-hoy") child.style.display = "block";
      }else{
        child.hidden = true;
        child.style.display = "none";
      }
    });
  }

  function tareaClick(id){ return "if(typeof editTask==='function')editTask('" + String(id).replace(/'/g,"\\'") + "')"; }

  function renderTareasMayorDemora(){
    var host = q("#p-hoy");
    if(!host || !visible(host)) return;
    if(typeof tasks === "undefined" || !Array.isArray(tasks)) return;
    qa("#m7-tareas-demora").forEach(function(el, idx){ if(idx > 0 || el.parentNode !== host) el.remove(); });
    var list = tasks.filter(isActiveTask).map(function(t){ return { raw:t, age:ageDays(t.created_at || t.updated_at) }; })
      .sort(function(a,b){ return (b.age - a.age) || String(a.raw.created_at || "").localeCompare(String(b.raw.created_at || "")); })
      .slice(0, 5);
    var card = q("#m7-tareas-demora");
    if(!card){
      card = document.createElement("section");
      card.id = "m7-tareas-demora";
      card.className = "m7-delay-card";
      host.insertBefore(card, host.firstChild || null);
    }
    var rows = list.length ? list.map(function(item, idx){
      var t = item.raw;
      var age = item.age;
      var hot = age >= 14 ? " m7-delay-hot" : age >= 7 ? " m7-delay-warn" : "";
      return '<button class="m7-delay-row' + hot + '" onclick="' + tareaClick(t.id) + '">' +
        '<div class="m7-delay-rank">' + (idx + 1) + '</div>' +
        '<div class="m7-delay-main"><div class="m7-delay-title">' + esc(t.descripcion || "Tarea sin descripcion") + '</div>' +
        '<div class="m7-delay-meta">' + esc(t.responsable || "Sin asignar") + ' · ' + esc(t.estado || "Pendiente") + ' · Prioridad ' + esc(t.prioridad || "Media") + '</div></div>' +
        '<div class="m7-delay-age"><strong>' + age + '</strong><span>dias</span></div>' +
      '</button>';
    }).join("") : '<div class="m7-delay-empty">No hay tareas pendientes demoradas.</div>';
    card.innerHTML = '<div class="m7-delay-head"><div><div class="m7-delay-kicker">Seguimiento</div><h3>5 tareas pendientes con mayor demora</h3></div><span>' + list.length + '/5</span></div>' + rows;
    estabilizarVistaHoy();
  }

  function patchHoyMayorDemora(){
    ["_renderHoy", "saveTask", "deleteTask", "deleteTaskModal"].forEach(function(name){
      var orig = window[name];
      if(typeof orig !== "function" || orig._m7delay) return;
      window[name] = function(){
        var r = orig.apply(this, arguments);
        schedule(function(){ estabilizarVistaHoy(); renderTareasMayorDemora(); }, 60);
        schedule(function(){ estabilizarVistaHoy(); renderTareasMayorDemora(); }, 260);
        return r;
      };
      window[name]._m7delay = true;
    });
    estabilizarVistaHoy();
    renderTareasMayorDemora();
  }

  function patchNavPostRender(){
    var orig = window.nav;
    if(typeof orig !== "function" || orig._m7post) return;
    window.nav = function(id){
      var r = orig.apply(this, arguments);
      schedule(function(){
        normalizarPaginasVisibles(id);
        limpiarCruces();
        if(id === "hoy") { estabilizarVistaHoy(); renderTareasMayorDemora(); }
        if(id === "guardias") ocultarDiasPasadosEnGuardias();
        if(id === "tablero") ocultarColumnaRealizada();
        if(id === "calendario") patchCalendarioVisible();
      }, 140);
      return r;
    };
    window.nav._m7post = true;
  }

  function repararAgendaHoyPostGCal(){
    var gcBtn = q(".gcbtn");
    if(!gcBtn || gcBtn._m7gcalObserved) return;
    gcBtn._m7gcalObserved = true;
    var done = false;
    try{
      new MutationObserver(function(){
        var t = gcBtn.textContent || "";
        if(!done && /GCal\s*[·.]\s*\d+\s*ev/i.test(t)){
          done = true;
          var host = q("#p-hoy");
          if(host && visible(host) && typeof window._renderHoy === "function") schedule(window._renderHoy, 250);
          setTimeout(function(){ done = false; }, 8000);
        }
      }).observe(gcBtn, {childList:true, subtree:true, characterData:true});
    }catch(_e){}
  }

  function inyectarCSS(){
    if(q("#m7-final-css")) return;
    var st = document.createElement("style");
    st.id = "m7-final-css";
    st.textContent = [
      "#ntab-generador-flyers{background:rgba(102,126,234,.12)!important;color:#c4b5fd!important;border-radius:8px!important;padding:6px 12px!important}",
      "#sbi-generador-flyers{border:1px solid rgba(102,126,234,.18)!important;background:rgba(102,126,234,.08)!important;color:#6d28d9!important;font-weight:800!important}",
      "#fPanel,#sbpersons{display:none!important}",
      "aside.sb{overflow-x:hidden}",
      "#p-hoy.m7-hoy-stable{display:block!important;visibility:visible!important;overflow:auto!important;position:relative!important;min-height:100%!important;background:#f3f6fb!important;padding:16px 20px 26px!important}",
      "#p-hoy.m7-hoy-stable> :not(#m1-panel-hoy):not(#m7-tareas-demora){display:none!important;visibility:hidden!important}",
      "#p-hoy.m7-hoy-stable #m1-panel-hoy{display:block!important;width:100%!important;max-width:100%!important;overflow:visible!important;clear:both!important}",
      "#calwscroll,#cal-day-content{background:#fff!important;position:relative!important;isolation:isolate!important}",
      "#calwscroll .m7-cal-event,#cal-day-content .m7-cal-event{display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;min-height:24px!important;padding:5px 8px!important;border:1px solid #cbd5e1!important;border-left:5px solid #2563eb!important;border-radius:8px!important;background:#fff!important;color:#111827!important;box-shadow:0 3px 10px rgba(15,23,42,.18)!important;line-height:1.22!important;white-space:normal!important;overflow:hidden!important;z-index:40!important;pointer-events:auto!important}",
      ".m7-delay-card{width:100%;clear:both;display:block;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px 20px;margin:0 0 18px;box-shadow:0 8px 24px rgba(15,23,42,.06);box-sizing:border-box}",
      ".m7-delay-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}",
      ".m7-delay-kicker{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#ef4444;margin-bottom:4px}",
      ".m7-delay-head h3{font-size:18px;line-height:1.2;margin:0;color:#111827}",
      ".m7-delay-head span{background:#fee2e2;color:#b91c1c;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:800;white-space:nowrap}",
      ".m7-delay-row{width:100%;display:grid;grid-template-columns:34px 1fr 62px;align-items:center;gap:12px;text-align:left;background:#fff;border:1px solid #eef2f7;border-radius:10px;padding:10px 12px;margin-top:8px;cursor:pointer;font-family:Inter,sans-serif;color:#111827;transition:transform .12s,box-shadow .12s,border-color .12s;box-sizing:border-box}",
      ".m7-delay-rank{width:28px;height:28px;border-radius:9px;background:#f3f4f6;color:#4b5563;display:grid;place-items:center;font-weight:900;font-size:12px}",
      ".m7-delay-title{font-size:13px;font-weight:800;line-height:1.35;color:#111827}",
      ".m7-delay-meta{font-size:11px;color:#6b7280;margin-top:3px;line-height:1.3}",
      ".m7-delay-age{text-align:center;border-left:1px solid #eef2f7;padding-left:10px;color:#6b7280}",
      ".m7-delay-age strong{display:block;font-size:22px;line-height:1;color:#111827}",
      ".m7-delay-age span{display:block;font-size:9px;text-transform:uppercase;font-weight:800;letter-spacing:.06em;margin-top:2px}",
      ".m7-delay-row.m7-delay-warn{background:#fffbeb;border-color:#fde68a}",
      ".m7-delay-row.m7-delay-hot{background:#fef2f2;border-color:#fecaca}",
      "@media(max-width:1100px){#p-hoy.m7-hoy-stable [style*='grid-template-columns:1fr 1fr']{grid-template-columns:1fr!important;display:block!important}}",
      "@media(max-width:760px){.m7-delay-card{padding:14px;margin:0 0 12px}.m7-delay-row{grid-template-columns:28px 1fr 52px;gap:8px;padding:9px}.m7-delay-title{font-size:12px}.m7-delay-age strong{font-size:18px}}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function limpiarCruces(){
    limpiarSidebarFantasma();
    limpiarLoginDuplicado();
    sincronizarVersionVisible();
    agregarAccesoGenerador();
    ocultarColumnaRealizada();
    ocultarDiasPasadosEnGuardias();
    repararAgendaHoyPostGCal();
    patchCalendarioVisible();
    patchHoyMayorDemora();
    estabilizarVistaHoy();
    renderTareasMayorDemora();
  }

  function init(){
    inyectarCSS();
    patchRealtimeDuplicados();
    patchRenderKanbanSeguro();
    patchNavPostRender();
    patchCalendarioVisible();
    patchHoyMayorDemora();
    limpiarCruces();
    var n = 0;
    var iv = setInterval(function(){
      n++;
      patchRenderKanbanSeguro();
      patchNavPostRender();
      patchCalendarioVisible();
      patchHoyMayorDemora();
      limpiarCruces();
      if(n >= 24) clearInterval(iv);
    }, 500);
    try{
      var obs = new MutationObserver(function(){
        if(debounceTimer) return;
        debounceTimer = setTimeout(function(){ debounceTimer = null; limpiarCruces(); }, 180);
      });
      obs.observe(document.body, {childList:true, subtree:true});
    }catch(_e){}
    console.log("[mejoras7] estabilizacion completa 2026-05-20c");
  }

  ready(init);
})();
