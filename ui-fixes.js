/*
  UI-FIXES.JS
  Final limpio sin archivos ni modales nuevos.
  Ordena navegacion, visibilidad, Hoy, Guardias, Calendario, Equipo y oculta Metricas.
*/
(function(){
  "use strict";

  var PAGES = ["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","entrevistas","contactos","recursos","agente"];
  var FLEX = { publicaciones:true, calendario:true };
  var ALIAS = { agenda:"publicaciones", publicacion:"publicaciones", publicaciones:"publicaciones", guardia:"guardias", team:"equipo", medio:"medios", entrevista:"entrevistas", contacto:"contactos", recurso:"recursos", biblioteca:"recursos", metricas:"hoy", metrica:"hoy" };

  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(id){ id = String(id || "hoy").trim().toLowerCase(); return ALIAS[id] || id; }
  function mainEl(){ return document.getElementById("main") || q(".content"); }
  function disp(id){ return FLEX[id] ? "flex" : "block"; }
  function todayISO(){ try { return new Date(typeof TODAY !== "undefined" ? TODAY : new Date()).toISOString().slice(0,10); } catch(_){ return new Date().toISOString().slice(0,10); } }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }
  function dataArr(name){ try { return Array.isArray(window[name]) ? window[name] : []; } catch(_){ return []; } }
  function isLate(ev){ var h = parseInt(String((ev && ev.hora) || "").split(":")[0], 10); return !isNaN(h) && h >= 15; }
  function eventId(ev){ if(!ev.id) ev.id = "ui_" + String(ev.fecha||"").slice(0,10) + "_" + String(ev.hora||"") + "_" + String(ev.descripcion||"").slice(0,30).replace(/\W+/g,"_"); return ev.id; }
  function getGuard(ds){ try { return typeof getGuardia === "function" ? (getGuardia(ds) || []) : []; } catch(_){ return []; } }
  function member(name){ try { return typeof gm === "function" ? (gm(name) || {}) : {}; } catch(_){ return {}; } }

  function ensureStructure(){
    var main = mainEl(); if(!main) return;
    ["recursos","agente"].forEach(function(id){ var p=q("#p-"+id); if(p && p.parentElement !== main) main.appendChild(p); });
    qa('[id="p-medios"]').forEach(function(el, i){ if(i>0) el.id = "p-medios-cobertura"; });
    if(!q("#p-hoy")){
      var hoy=document.createElement("div"); hoy.id="p-hoy"; hoy.style.display="none";
      var first=q("#p-tablero") || main.firstElementChild;
      if(first && first.parentElement===main) main.insertBefore(hoy, first); else main.appendChild(hoy);
    }
    cleanSidebar();
  }

  function panels(){ ensureStructure(); var main=mainEl(); return main ? qa(":scope > [id^='p-']", main) : []; }

  function buttonId(btn){
    if(!btn) return "";
    var direct = btn.getAttribute("data-mid") || btn.getAttribute("data-nav") || (btn.dataset && btn.dataset.nav) || "";
    if(direct) return norm(direct);
    var onclick = btn.getAttribute("onclick") || "";
    var m = onclick.match(/(?:nav|exitFullPanel)\(['\"]([^'\"]+)['\"]/);
    return m ? norm(m[1]) : "";
  }

  function cleanSidebar(){
    qa(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]").forEach(function(btn){
      if(buttonId(btn) === "hoy" && (btn.textContent||"").indexOf("Hoy") === -1) btn.textContent = "☀ Hoy";
      if(buttonId(btn) === "metricas") btn.style.setProperty("display","none","important");
    });
    var sb=q("aside.sb");
    if(sb && typeof NodeFilter !== "undefined"){
      try{
        var w=document.createTreeWalker(sb, NodeFilter.SHOW_TEXT, null, false), n, rm=[];
        while((n=w.nextNode())) if(/^\s*Tareas del d\s*$/i.test(n.nodeValue||"")) rm.push(n);
        rm.forEach(function(x){ if(x.parentNode) x.parentNode.removeChild(x); });
      }catch(_e){}
    }
  }

  function closeFloating(){
    qa(".ov,.overlay").forEach(function(m){
      if(!m.classList.contains("open")){
        m.classList.remove("show","active","on");
        m.style.setProperty("display","none","important");
        m.style.setProperty("pointer-events","none","important");
        m.setAttribute("aria-hidden","true");
      }
    });
    qa(".overlay-backdrop,.modal-backdrop,#overlay").forEach(function(o){ o.remove(); });
  }

  function setActiveButtons(id, explicit){
    qa(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]").forEach(function(btn){
      var bid=buttonId(btn), on=(bid===id || btn===explicit);
      btn.classList.toggle("on", on);
      btn.classList.toggle("mbn-active", on);
      if(on) btn.setAttribute("aria-current","page"); else btn.removeAttribute("aria-current");
    });
  }

  function setPanel(panel, active, id){
    if(!panel) return;
    panel.classList.toggle("active", active);
    panel.classList.toggle("show", active);
    panel.classList.remove("open");
    if(active){
      panel.hidden=false; panel.removeAttribute("hidden"); panel.removeAttribute("aria-hidden");
      panel.style.setProperty("display", disp(id), "important");
      panel.style.setProperty("visibility", "visible", "important");
    }else{
      panel.hidden=true; panel.setAttribute("aria-hidden","true");
      panel.classList.remove("m7-hoy-stable");
      panel.style.setProperty("display", "none", "important");
      panel.style.setProperty("visibility", "hidden", "important");
    }
  }

  function showOnly(id, btn, skipRender){
    id=norm(id);
    ensureStructure();
    if(id !== "agente"){
      window._agenteActual = null;
      var ag=q("#p-agente"); if(ag) setPanel(ag, false, id);
    }
    var target=q("#p-"+id);
    if(!target){ id="hoy"; target=q("#p-hoy") || q("#p-tablero"); }
    panels().forEach(function(p){ setPanel(p, p===target, id); });
    setPanel(target, true, id);
    document.body.setAttribute("data-active-panel", id);
    document.body.classList.remove("full-panel","show-calendario","show-publicaciones","show-guardias");
    if(window.innerWidth <= 700 && (id==="calendario" || id==="publicaciones" || id==="guardias")) document.body.classList.add("full-panel","show-"+id);
    setActiveButtons(id, btn || null);
    closeFloating();
    if(!skipRender){
      callRender(id);
      setTimeout(function(){ callRender(id); showOnly(id, btn, true); }, 160);
    }
  }

  function installNav(){
    window.nav = function(id, tab, sb){ showOnly(norm(id), sb || tab || null, false); return false; };
    window.nav._stableFinal = true;
    window.nav._v4patched = true;
    window.nav._v5patched = true;
    window.nav.__patcheadoActivo = true;
    window.exitFullPanel = function(id){ document.body.classList.remove("full-panel","show-calendario","show-publicaciones","show-guardias"); return window.nav(id || document.body.getAttribute("data-active-panel") || "hoy"); };
  }

  function ageDays(t){ var d = t.fecha || t.created_at || t.updated_at; var dt = d ? new Date(d) : new Date(); var n = Math.floor((new Date() - dt)/86400000); return isNaN(n) ? 0 : Math.max(0,n); }
  function pendingTasks(){
    return dataArr("tasks").filter(function(t){
      var e=String(t.estado||"Pendiente").toLowerCase();
      return e !== "completo" && e !== "completa" && e !== "realizada" && e !== "realizado" && e !== "listo s/publicar" && e !== "lista para publicar";
    }).sort(function(a,b){ return ageDays(b)-ageDays(a); }).slice(0,10);
  }

  function todaysEvents(){
    var ds=todayISO(), seen={};
    return dataArr("agendas").concat(dataArr("gcalEvs")).filter(function(ev){
      if(!ev || String(ev.fecha||"").slice(0,10)!==ds || ev.cancelado || ev.tipo==="entrevista") return false;
      var k=String(ev.descripcion||"").slice(0,60)+"|"+String(ev.hora||"");
      if(seen[k]) return false; seen[k]=1; eventId(ev); return true;
    }).sort(function(a,b){ return String(a.hora||"99:99").localeCompare(String(b.hora||"99:99")); });
  }

  function todaysInterviews(){
    var ds=todayISO();
    return dataArr("entrevistas").filter(function(e){ return String(e.fecha||"").slice(0,10)===ds && String(e.estado||"").toLowerCase()!=="cancelada"; });
  }

  function coverState(){ try { return window.cobSel || (typeof cobSel !== "undefined" ? cobSel : {}); } catch(_){ return {}; } }
  function toggleCoverage(id){
    var ev = todaysEvents().filter(function(x){ return eventId(x)===id; })[0];
    if(!ev) return;
    window.cobSel = coverState();
    window.cobSel[id] = !window.cobSel[id];
    try { if(typeof renderGuardias === "function") renderGuardias(); } catch(_e){}
    try { if(typeof renderCal === "function") renderCal(); } catch(_e){}
    renderHoyFinal();
  }
  window.uiToggleCoverage = toggleCoverage;

  function renderHoyFinal(){
    var page=q("#p-hoy"); if(!page) return;
    var ds=todayISO(), now=new Date(), g=getGuard(ds), evs=todaysEvents(), tks=pendingTasks(), ents=todaysInterviews(), cstate=coverState();
    page.classList.remove("m7-hoy-stable");
    page.classList.add("ui-hoy-final");
    var meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    var dias=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
    window.__uiEventMap = {}; evs.forEach(function(ev){ window.__uiEventMap[eventId(ev)] = ev; });
    page.innerHTML = '<div class="ui-hoy-head"><div><div class="ui-kicker">Hoy</div><h1>'+dias[now.getDay()]+' '+now.getDate()+' de '+meses[now.getMonth()]+'</h1></div><button class="ui-btn" onclick="openTaskMod()">+ Nueva tarea</button></div>'+
      '<div class="ui-hoy-grid">'+
      '<section class="ui-panel"><h2>Guardia del día</h2><div class="ui-guards">'+(g.length?g.map(function(n,i){ var m=member(n); return '<div class="ui-guard"><span style="background:'+(m.color||'#667eea')+'">'+esc(String(n).slice(0,2).toUpperCase())+'</span><div><strong>'+esc(n)+'</strong><small>'+(i===0?'titular':'soporte')+'</small></div></div>'; }).join(''):'<p class="ui-empty">Sin guardia asignada.</p>')+'</div></section>'+
      '<section class="ui-panel"><h2>Eventos de hoy</h2>'+(evs.length?evs.map(function(ev){ var id=eventId(ev), on=!!cstate[id]; return '<div class="ui-event" onclick="openEvPanel && openEvPanel(window.__uiEventMap['+JSON.stringify(id)+'])"><div><strong>'+(ev.hora?esc(String(ev.hora).slice(0,5))+' · ':'')+esc(ev.descripcion||'Evento')+'</strong><small>'+(isLate(ev)?'Después de las 15 · ':'')+(ev.lugar?esc(ev.lugar):'')+'</small></div><button onclick="event.stopPropagation();uiToggleCoverage('+JSON.stringify(id)+')" class="ui-cover '+(on?'on':'')+'">'+(on?'Cubrir':'No cubrir')+'</button></div>'; }).join(''):'<p class="ui-empty">Sin eventos cargados para hoy.</p>')+'</section>'+
      '<section class="ui-panel ui-wide"><h2>10 actividades pendientes con mayor demora</h2>'+(tks.length?tks.map(function(t,i){ return '<button class="ui-task" onclick="editTask && editTask('+JSON.stringify(String(t.id))+')"><span>'+(i+1)+'</span><div><strong>'+esc(t.descripcion||'Sin descripción')+'</strong><small>'+esc(t.responsable||'Sin asignar')+' · '+esc(t.estado||'Pendiente')+' · '+ageDays(t)+' días</small></div></button>'; }).join(''):'<p class="ui-empty">Sin actividades pendientes.</p>')+'</section>'+
      '<section class="ui-panel"><h2>Entrevistas pactadas</h2>'+(ents.length?ents.map(function(e){ return '<div class="ui-line"><strong>'+esc(e.hora||'')+' '+esc(e.funcionario||e.nombre||e.titulo||'Funcionario')+'</strong><small>'+esc(e.tema||e.descripcion||'Entrevista')+'</small></div>'; }).join(''):'<p class="ui-empty">Sin entrevistas pactadas para hoy.</p>')+'</section>'+
      '</div>';
  }

  function hideMetrics(){
    qa(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]").forEach(function(b){ if(buttonId(b)==="metricas") b.style.setProperty("display","none","important"); });
    var p=q("#p-metricas"); if(p) setPanel(p,false,"hoy");
  }

  function patchKanban(){
    var k=q("#kanban"); if(!k) return;
    qa(".kcol", k).forEach(function(col){ var h=(q(".khdr",col)||col).textContent.toLowerCase(); if(h.indexOf("realizada")!==-1 || h.indexOf("realizado")!==-1) col.style.setProperty("display","none","important"); });
  }

  function patchCalendar(){
    var cal=q("#p-calendario"); if(!cal) return;
    cal.classList.add("ui-cal-final");
    qa("#calwscroll [onclick*='openEvPanel'],#calwscroll [onclick*='editPubItem'],#cal-day-content [onclick*='openEvPanel'],#cal-day-content [onclick*='editPubItem']").forEach(function(el){
      el.style.setProperty("white-space","normal","important"); el.style.setProperty("word-break","normal","important"); el.style.setProperty("overflow-wrap","break-word","important"); el.style.setProperty("font-size","11px","important"); el.style.setProperty("line-height","1.18","important");
      qa("*", el).forEach(function(ch){ ch.style.setProperty("white-space","normal","important"); ch.style.setProperty("font-size","11px","important"); ch.style.setProperty("line-height","1.18","important"); });
    });
    var ds=todayISO(), g=getGuard(ds), host=q("#cal-guardia-dia");
    if(!host && q("#cal-day-content")){ host=document.createElement("div"); host.id="cal-guardia-dia"; q("#cal-day-content").parentElement.insertBefore(host, q("#cal-day-content")); }
    if(host) host.innerHTML = '<div class="ui-cal-guard">Guardia de hoy: '+(g.length?g.map(esc).join(' · '):'sin asignar')+'</div>';
  }

  function patchTeam(){
    var p=q("#p-equipo"); if(!p) return;
    qa(".tmcard", p).forEach(function(card){
      var btn=q("button[onclick*='abrirPanelAgente']", card);
      if(btn && !btn._uiWaText){ btn._uiWaText=true; btn.title="Enviar pendientes y en proceso desde el panel del agente"; }
    });
  }

  function callRender(id){
    try{
      if(id==="hoy") renderHoyFinal();
      if(id==="tablero" && typeof renderKanban==="function") { renderKanban(); patchKanban(); }
      if(id==="material" && typeof renderMaterial==="function") renderMaterial();
      if(id==="publicaciones" && typeof renderPubDay==="function") renderPubDay();
      if(id==="calendario"){ if(typeof renderCal==="function") renderCal(); if(typeof renderCalDay==="function") renderCalDay(); patchCalendar(); }
      if(id==="guardias" && typeof renderGuardias==="function") renderGuardias();
      if(id==="equipo" && typeof renderTeam==="function") { renderTeam(); patchTeam(); }
      if(id==="medios" && typeof renderNoticias==="function") { renderNoticias(); if(typeof renderMedioSum==="function") renderMedioSum(); }
      if(id==="contactos" && typeof renderContactos==="function") renderContactos();
      if(id==="entrevistas" && typeof renderEntrevistas==="function") renderEntrevistas();
      if(id==="recursos" && typeof loadRecursos==="function") loadRecursos();
    }catch(e){ console.warn("[ui-fixes] render", id, e); }
    hideMetrics();
  }

  function installAgentPanel(){
    if(typeof window.abrirPanelAgente !== "function" || window.abrirPanelAgente._uiFinal) return;
    var orig=window.abrirPanelAgente;
    window.abrirPanelAgente=function(nombre){
      window._agenteActual=nombre || window._agenteActual || "";
      try{ orig.apply(this, arguments); }catch(e){ console.warn("[ui-fixes] abrirPanelAgente", e); }
      setTimeout(function(){ showOnly("agente", null, true); }, 0);
    };
    window.abrirPanelAgente._uiFinal=true;
  }

  function css(){
    if(q("#ui-final-css")) return;
    var st=document.createElement("style"); st.id="ui-final-css";
    st.textContent=[
      "html,body{font-size:13px!important;line-height:1.36!important}",
      "button,.btn,.ntab,.sbi,input,select,textarea{font-size:12px!important}",
      "#p-metricas,[onclick*=\"metricas\"],[data-mid=\"metricas\"],[data-nav=\"metricas\"]{display:none!important}",
      "#p-hoy.ui-hoy-final{background:#f3f6fb!important;padding:14px!important;overflow:auto!important;height:100%!important}",
      ".ui-hoy-head{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin-bottom:12px}.ui-hoy-head h1{font-size:20px!important;margin:0}.ui-kicker{font-size:11px;color:#ef4444;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.ui-btn{border:0;border-radius:8px;background:#667eea;color:#fff;padding:8px 12px;font-weight:800;cursor:pointer}",
      ".ui-hoy-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ui-panel{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px}.ui-panel h2{font-size:15px!important;margin:0 0 10px}.ui-wide{grid-column:1/-1}.ui-empty{font-size:12px;color:#94a3b8;margin:8px 0}.ui-guards{display:flex;gap:8px;flex-wrap:wrap}.ui-guard{display:flex;align-items:center;gap:8px;background:#f8fafc;border-radius:9px;padding:8px 10px}.ui-guard span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:11px}.ui-guard strong{display:block;font-size:13px}.ui-guard small,.ui-line small{display:block;font-size:11px;color:#64748b}",
      ".ui-event{display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #eef2f7;padding:8px 0;cursor:pointer}.ui-event strong{display:block;font-size:12px}.ui-event small{display:block;font-size:11px;color:#64748b;margin-top:2px}.ui-cover{border:1px solid #d1d5db;background:#fff;border-radius:999px;padding:5px 9px;font-weight:800;color:#64748b;white-space:nowrap}.ui-cover.on{background:#dcfce7;border-color:#86efac;color:#15803d}",
      ".ui-task{width:100%;display:grid;grid-template-columns:32px 1fr;gap:10px;text-align:left;border:1px solid #fecaca;background:#fff1f2;border-radius:9px;padding:8px 10px;margin:7px 0;cursor:pointer}.ui-task>span{width:28px;height:28px;border-radius:8px;background:#eef2f7;display:grid;place-items:center;font-weight:800}.ui-task strong{font-size:12px;line-height:1.25}.ui-task small{display:block;font-size:11px;color:#64748b;margin-top:2px}.ui-line{border-bottom:1px solid #eef2f7;padding:7px 0}",
      "#p-calendario.ui-cal-final #calwscroll{overflow-x:auto!important}#p-calendario.ui-cal-final #calwscroll>div{min-width:1180px!important}.ui-cal-guard{font-size:12px;font-weight:700;color:#475569;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:7px 10px;margin:6px 0}",
      ".ov:not(.open),.overlay:not(.open){display:none!important;pointer-events:none!important}.ov.open,.overlay.open{display:flex!important;pointer-events:auto!important}#toast{z-index:3500!important}.topbar{z-index:100!important}.sb{z-index:90!important}.content{overflow-y:auto!important;overflow-x:hidden!important}",
      "@media(max-width:800px){.ui-hoy-grid{grid-template-columns:1fr}.ui-hoy-head{align-items:flex-start;flex-direction:column}}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function clickCapture(e){
    var agentBtn=e.target.closest('[onclick*="abrirPanelAgente"]'); if(agentBtn) return;
    var btn=e.target.closest(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]"); if(!btn) return;
    var id=buttonId(btn); if(!id) return;
    e.preventDefault(); e.stopPropagation(); if(typeof e.stopImmediatePropagation==="function") e.stopImmediatePropagation();
    window.nav(id, null, btn);
  }

  function run(){ css(); installNav(); installAgentPanel(); ensureStructure(); hideMetrics(); closeFloating(); var active=norm(document.body.getAttribute("data-active-panel") || "hoy"); showOnly(active, null, false); }

  document.addEventListener("click", clickCapture, true);
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, {once:true}); else run();
  setTimeout(run,250); setTimeout(run,900); setTimeout(function(){ installAgentPanel(); hideMetrics(); callRender(norm(document.body.getAttribute("data-active-panel")||"hoy")); },1800);

  window.uiFixesRun=run;
  console.log("[ui-fixes] final limpio segun especificacion 2026-05-21g");
})();
