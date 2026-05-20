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
  function paginaActiva(){
    for(var i = 0; i < PAGINAS.length; i++){
      var el = q("#p-" + PAGINAS[i]);
      if(el && !el.hidden && visible(el)) return PAGINAS[i];
    }
    return "";
  }
  function hoyActivo(){ return paginaActiva() === "hoy"; }
  function refrescarHoySiActivo(){
    if(hoyActivo()){
      estabilizarVistaHoy();
      renderTareasMayorDemora();
    }
  }
  function normalizarRotulos(){
    var fixes = {
      "publicaciónes": "publicaciones",
      "Publicaciónes": "Publicaciones",
      "Agenda de publicaciónes": "Agenda de publicaciones",
      "Eventos del dia": "Eventos del día",
      "Todo el dia": "Todo el día",
      "Tarea sin descripcion": "Tarea sin descripción",
      "Publicacion": "Publicación"
    };
    try{
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while((node = walker.nextNode())){
        var v = node.nodeValue;
        Object.keys(fixes).forEach(function(k){ v = v.split(k).join(fixes[k]); });
        node.nodeValue = v;
      }
    }catch(_e){}
  }

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

  function hoyISO(){
    try{ return (typeof iso === "function" && typeof TODAY !== "undefined") ? iso(TODAY) : new Date().toISOString().slice(0,10); }
    catch(_e){ return new Date().toISOString().slice(0,10); }
  }

  function horaCorta(h){
    if(!h) return "";
    return String(h).slice(0,5);
  }

  function jsq(s){
    return String(s == null ? "" : s).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g," ");
  }

  function fechaDeItem(x){
    return String((x && (x.fecha || x.dia || x.date || x.created_at)) || "").slice(0,10);
  }

  function listaEventosHoy(){
    var ds = hoyISO(), src = [], seen = {};
    try{ if(typeof agendas !== "undefined" && Array.isArray(agendas)) src = src.concat(agendas); }catch(_e){}
    try{ if(typeof gcalEvs !== "undefined" && Array.isArray(gcalEvs)) src = src.concat(gcalEvs); }catch(_e){}
    return src.filter(function(e){
      if(!e || e.cancelado || fechaDeItem(e) !== ds || e.tipo === "entrevista") return false;
      var k = (e.id || "") + "|" + (e.descripcion || "") + "|" + (e.hora || "");
      if(seen[k]) return false;
      seen[k] = true;
      return true;
    }).sort(function(a,b){ return String(a.hora || "99:99").localeCompare(String(b.hora || "99:99")); });
  }

  function listaPublicacionesHoy(){
    var ds = hoyISO(), src = [];
    try{ if(typeof pubs !== "undefined" && Array.isArray(pubs)) src = src.concat(pubs); }catch(_e){}
    try{ if(Array.isArray(window._pubGuardia)) src = src.concat(window._pubGuardia); }catch(_e){}
    return src.filter(function(p){
      if(!p || p.cancelado || fechaDeItem(p) !== ds) return false;
      var estado = norm(p.estado || p.status);
      return estado !== "publicado" && estado !== "publicada" && estado !== "realizada" && estado !== "realizado";
    }).sort(function(a,b){ return String(a.hora || "99:99").localeCompare(String(b.hora || "99:99")); });
  }

  function listaGuardiasHoy(){
    var ds = hoyISO();
    try{
      if(typeof getGuardia === "function"){
        var g = getGuardia(ds);
        return Array.isArray(g) ? g.filter(Boolean) : [];
      }
    }catch(_e){}
    return [];
  }

  function coberturaActiva(id){
    try{ return !!(typeof cobSel !== "undefined" && cobSel && cobSel[id]); }catch(_e){ return false; }
  }

  window.m7ToggleCobertura = function(id){
    try{
      if(typeof cobSel !== "undefined" && cobSel){
        cobSel[id] = !cobSel[id];
        if(typeof renderGuardDay === "function") renderGuardDay();
        if(typeof renderGuardias === "function") renderGuardias();
        if(typeof renderCal === "function") renderCal();
      }
    }catch(e){ console.warn("[mejoras7] cobertura", e); }
    schedule(renderHoyRedisenado, 40);
  };

  function tareaClick(id){ return "if(typeof editTask==='function')editTask('" + jsq(id) + "')"; }

  function eventoClick(id){
    return "if(typeof openEvPanel==='function'){var ev=(typeof agendas!=='undefined'?agendas:[]).concat(typeof gcalEvs!=='undefined'?gcalEvs:[]).find(function(x){return String(x.id)==='" + jsq(id) + "'});if(ev)openEvPanel(ev)}";
  }

  function renderTareasAntiguasHTML(){
    var list = [];
    try{
      if(typeof tasks !== "undefined" && Array.isArray(tasks)){
        list = tasks.filter(isActiveTask).map(function(t){ return { raw:t, age:ageDays(t.created_at || t.updated_at || t.fecha) }; })
          .sort(function(a,b){ return (b.age - a.age) || String(a.raw.created_at || "").localeCompare(String(b.raw.created_at || "")); })
          .slice(0, 5);
      }
    }catch(_e){}
    var rows = list.length ? list.map(function(item, idx){
      var t = item.raw, age = item.age;
      return '<button class="m7-delay-row" onclick="' + tareaClick(t.id) + '">' +
        '<div class="m7-delay-rank">' + (idx + 1) + '</div>' +
        '<div class="m7-delay-main"><div class="m7-delay-title">' + esc(t.descripcion || "Tarea sin descripción") + '</div>' +
        '<div class="m7-delay-meta">' + esc(t.responsable || "Sin asignar") + ' · ' + esc(t.estado || "Pendiente") + ' · Prioridad ' + esc(t.prioridad || "Media") + '</div></div>' +
        '<div class="m7-delay-age"><strong>' + age + '</strong><span>DIAS</span></div>' +
      '</button>';
    }).join("") : '<div class="m7-empty">No hay tareas pendientes demoradas.</div>';
    return '<section class="m7-card m7-delay-card"><div class="m7-card-head"><div><div class="m7-kicker">Seguimiento</div><h3>5 tareas pendientes con mayor demora</h3></div><span class="m7-count">' + list.length + '/5</span></div>' + rows + '</section>';
  }

  function renderAgendaHoyHTML(){
    var evs = listaEventosHoy();
    var rows = evs.length ? evs.map(function(e){
      var id = String(e.id || "");
      var activo = coberturaActiva(id);
      return '<div class="m7-event-row">' +
        '<button class="m7-event-main" onclick="' + eventoClick(id) + '">' +
          '<div class="m7-time">' + esc(horaCorta(e.hora) || "Todo el día") + '</div>' +
          '<div class="m7-event-text"><strong>' + esc(e.descripcion || "Evento") + '</strong>' +
          (e.lugar ? '<span>' + esc(e.lugar) + '</span>' : '') + '</div>' +
        '</button>' +
        '<button class="m7-cover-btn ' + (activo ? "on" : "") + '" onclick="m7ToggleCobertura(\'' + jsq(id) + '\')">' + (activo ? "Se cubre" : "No se cubre") + '</button>' +
      '</div>';
    }).join("") : '<div class="m7-empty">Sin eventos de calendario para hoy.</div>';
    return '<section class="m7-card"><div class="m7-card-head"><div><div class="m7-kicker blue">Calendario</div><h3>Eventos del día</h3></div><span class="m7-count blue">' + evs.length + '</span></div>' + rows + '</section>';
  }

  function renderGuardiasHoyHTML(){
    var guardias = listaGuardiasHoy();
    var body = guardias.length ? '<div class="m7-guards">' + guardias.map(function(n, idx){
      var rol = idx === 0 ? "Titular" : "Soporte";
      var color = "#667eea";
      try{ var m = typeof gm === "function" ? gm(n) : null; if(m && m.color) color = m.color; }catch(_e){}
      return '<div class="m7-guard"><div class="m7-avatar" style="background:' + esc(color) + '">' + esc(String(n).slice(0,2).toUpperCase()) + '</div><div><strong>' + esc(n) + '</strong><span>' + rol + '</span></div></div>';
    }).join("") + '</div>' : '<div class="m7-empty">Sin guardia asignada para hoy.</div>';
    return '<section class="m7-card"><div class="m7-card-head"><div><div class="m7-kicker green">Guardias</div><h3>Guardias asignadas</h3></div></div>' + body + '</section>';
  }

  function renderPublicacionesHoyHTML(){
    var list = listaPublicacionesHoy();
    var rows = list.length ? list.map(function(p){
      var desc = p.descripcion || p.desc || p.titulo || "Publicación";
      return '<div class="m7-pub-row"><div class="m7-time">' + esc(horaCorta(p.hora) || "--:--") + '</div><div class="m7-event-text"><strong>' + esc(desc) + '</strong><span>' + esc((p.cuenta || p.canal || p.estado || "Pendiente")) + '</span></div></div>';
    }).join("") : '<div class="m7-empty">Sin publicaciones pendientes para hoy.</div>';
    return '<section class="m7-card"><div class="m7-card-head"><div><div class="m7-kicker violet">Publicaciones</div><h3>Publicaciones a realizar</h3></div><span class="m7-count violet">' + list.length + '</span></div>' + rows + '</section>';
  }

  function renderHoyRedisenado(){
    var host = q("#p-hoy");
    if(!host || !visible(host)) return;
    host.hidden = false;
    host.classList.add("m7-hoy-stable");
    var panel = q("#m7-hoy-panel", host);
    if(!panel){
      panel = document.createElement("div");
      panel.id = "m7-hoy-panel";
      host.insertBefore(panel, host.firstChild || null);
    }
    panel.innerHTML = renderTareasAntiguasHTML() +
      '<div class="m7-grid">' +
        renderAgendaHoyHTML() +
        renderGuardiasHoyHTML() +
        renderPublicacionesHoyHTML() +
      '</div>';
    Array.prototype.slice.call(host.children).forEach(function(child){
      if(child.id === "m7-hoy-panel"){
        child.hidden = false;
        child.style.display = "block";
        child.style.visibility = "visible";
      }else{
        child.hidden = true;
        child.style.display = "none";
      }
    });
  }

  function estabilizarVistaHoy(){
    var host = q("#p-hoy");
    if(!host || !visible(host)) return;
    host.hidden = false;
    host.classList.add("m7-hoy-stable");
    host.style.display = "block";
    host.style.visibility = "visible";
    renderHoyRedisenado();
  }

  function renderTareasMayorDemora(){
    renderHoyRedisenado();
  }

  function patchHoyMayorDemora(){
    ["_renderHoy", "saveTask", "deleteTask", "deleteTaskModal"].forEach(function(name){
      var orig = window[name];
      if(typeof orig !== "function" || orig._m7delay) return;
      window[name] = function(){
        var r = orig.apply(this, arguments);
        schedule(refrescarHoySiActivo, 60);
        schedule(refrescarHoySiActivo, 260);
        return r;
      };
      window[name]._m7delay = true;
    });
    refrescarHoySiActivo();
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
      "#p-hoy.m7-hoy-stable{display:block!important;visibility:visible!important;overflow:auto!important;position:relative!important;min-height:100%!important;background:#f3f6fb!important;padding:22px 28px 32px!important}",
      "#p-hoy.m7-hoy-stable> :not(#m7-hoy-panel){display:none!important;visibility:hidden!important}",
      "#m7-hoy-panel{display:block!important;width:100%!important;max-width:1545px!important;margin:0 auto!important;overflow:visible!important;clear:both!important}",
      "#calwscroll,#cal-day-content{background:#fff!important;position:relative!important;isolation:isolate!important}",
      "#calwscroll .m7-cal-event,#cal-day-content .m7-cal-event{display:block!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;min-height:24px!important;padding:5px 8px!important;border:1px solid #cbd5e1!important;border-left:5px solid #2563eb!important;border-radius:8px!important;background:#fff!important;color:#111827!important;box-shadow:0 3px 10px rgba(15,23,42,.18)!important;line-height:1.22!important;white-space:normal!important;overflow:hidden!important;z-index:40!important;pointer-events:auto!important}",
      ".m7-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,.75fr);gap:18px;margin-top:18px;align-items:start}",
      ".m7-card{width:100%;clear:both;display:block;background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:24px 28px;margin:0 0 18px;box-shadow:0 10px 28px rgba(15,23,42,.06);box-sizing:border-box}",
      ".m7-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}",
      ".m7-kicker{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#ef4444;margin-bottom:4px}",
      ".m7-kicker.blue{color:#2563eb}.m7-kicker.green{color:#16a34a}.m7-kicker.violet{color:#7c3aed}",
      ".m7-card-head h3{font-size:24px;line-height:1.15;margin:0;color:#020617;font-weight:900}",
      ".m7-count{background:#fee2e2;color:#b91c1c;border-radius:999px;padding:8px 13px;font-size:13px;font-weight:900;white-space:nowrap}.m7-count.blue{background:#dbeafe;color:#1d4ed8}.m7-count.violet{background:#ede9fe;color:#6d28d9}",
      ".m7-delay-row{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 88px;align-items:center;gap:12px;text-align:left;background:#fff1f2;border:1px solid #fecaca;border-radius:12px;padding:14px 20px;margin-top:10px;cursor:pointer;font-family:Inter,sans-serif;color:#020617;box-sizing:border-box}",
      ".m7-delay-rank{width:38px;height:38px;border-radius:12px;background:#eef2f7;color:#334155;display:grid;place-items:center;font-weight:900;font-size:16px}",
      ".m7-delay-title{font-size:18px;font-weight:900;line-height:1.28;color:#020617}",
      ".m7-delay-meta{font-size:15px;color:#64748b;margin-top:5px;line-height:1.3}",
      ".m7-delay-age{text-align:center;border-left:1px solid #f3d4d7;padding-left:14px;color:#7f1d1d}",
      ".m7-delay-age strong{display:block;font-size:34px;line-height:.95;color:#020617;font-weight:950}",
      ".m7-delay-age span{display:block;font-size:11px;text-transform:uppercase;font-weight:900;letter-spacing:.06em;margin-top:4px}",
      ".m7-event-row,.m7-pub-row{display:flex;align-items:stretch;gap:10px;border-bottom:1px solid #eef2f7;padding:10px 0}.m7-event-row:last-child,.m7-pub-row:last-child{border-bottom:0}",
      ".m7-event-main{display:grid;grid-template-columns:78px minmax(0,1fr);gap:12px;align-items:start;flex:1;border:0;background:transparent;text-align:left;font-family:Inter,sans-serif;cursor:pointer;color:#020617;padding:0}",
      ".m7-time{font-size:15px;color:#64748b;font-weight:700;white-space:nowrap}",
      ".m7-event-text strong{display:block;font-size:17px;line-height:1.25;color:#020617;font-weight:850}.m7-event-text span{display:block;font-size:13px;line-height:1.25;color:#64748b;margin-top:3px}",
      ".m7-cover-btn{align-self:center;border:1px solid #cbd5e1;background:#f8fafc;color:#475569;border-radius:999px;padding:8px 12px;font:850 12px Inter,sans-serif;cursor:pointer;white-space:nowrap}.m7-cover-btn.on{background:#dcfce7;border-color:#86efac;color:#15803d}",
      ".m7-guards{display:grid;gap:10px}.m7-guard{display:flex;align-items:center;gap:12px;border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#f8fafc}.m7-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:900}.m7-guard strong{display:block;font-size:16px;color:#020617}.m7-guard span{display:block;font-size:12px;color:#64748b;margin-top:2px}",
      ".m7-empty{padding:18px;border-radius:12px;background:#f8fafc;color:#64748b;font-size:14px;text-align:center;border:1px dashed #dbe3ef}",
      "@media(max-width:1100px){.m7-grid{grid-template-columns:1fr}.m7-card-head h3{font-size:21px}}",
      "@media(max-width:760px){#p-hoy.m7-hoy-stable{padding:14px!important}.m7-card{padding:16px;margin-bottom:12px;border-radius:14px}.m7-delay-row{grid-template-columns:34px 1fr 58px;gap:8px;padding:10px}.m7-delay-rank{width:30px;height:30px;font-size:13px}.m7-delay-title,.m7-event-text strong{font-size:14px}.m7-delay-meta,.m7-event-text span{font-size:12px}.m7-delay-age strong{font-size:22px}.m7-event-main{grid-template-columns:64px 1fr}.m7-cover-btn{padding:7px 9px;font-size:11px}}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function limpiarCruces(){
    limpiarSidebarFantasma();
    limpiarLoginDuplicado();
    normalizarRotulos();
    sincronizarVersionVisible();
    agregarAccesoGenerador();
    ocultarColumnaRealizada();
    ocultarDiasPasadosEnGuardias();
    repararAgendaHoyPostGCal();
    patchCalendarioVisible();
    patchHoyMayorDemora();
    refrescarHoySiActivo();
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
