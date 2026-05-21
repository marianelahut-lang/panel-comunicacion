/*
  UI-FIXES.JS
  Estabilizador final de navegacion y correcciones visuales.
  Ultima capa: no agrega datos, solo ordena UI, navegacion y fallbacks.
*/
(function(){
  "use strict";

  var PANEL_IDS = ["hoy","tablero","material","publicaciones","calendario","guardias","equipo","metricas","medios","reclamos","entrevistas","contactos","recursos","biblioteca","agente"];
  var FLEX = { publicaciones:true, calendario:true };
  var ALIAS = { agenda:"publicaciones", publicacion:"publicaciones", publicaciones:"publicaciones", guardia:"guardias", equipo:"equipo", team:"equipo", metrica:"metricas", metricas:"metricas", medio:"medios", medios:"medios", entrevista:"entrevistas", entrevistas:"entrevistas", contacto:"contactos", contactos:"contactos", recurso:"recursos", recursos:"recursos", biblioteca:"recursos" };

  function norm(id){ id = String(id || "hoy").trim().toLowerCase(); return ALIAS[id] || id; }
  function q(sel, root){ return (root || document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function mainEl(){ return document.getElementById("main") || document.querySelector(".content"); }
  function displayFor(id){ return FLEX[id] ? "flex" : "block"; }

  function movePanelIntoMain(id){ var main = mainEl(), panel = document.getElementById("p-" + id); if(main && panel && panel.parentElement !== main) main.appendChild(panel); return panel; }

  function cleanSidebarText(){
    var sidebar = document.querySelector("aside.sb");
    if(!sidebar || typeof NodeFilter === "undefined") return;
    try{
      var walker = document.createTreeWalker(sidebar, NodeFilter.SHOW_TEXT, null, false), node, remove=[];
      while((node = walker.nextNode())) if(/^\s*Tareas del d\s*$/i.test(node.nodeValue || "")) remove.push(node);
      remove.forEach(function(n){ if(n.parentNode) n.parentNode.removeChild(n); });
    }catch(_e){}
  }

  function repairStructure(){
    var main = mainEl(); if(!main) return;
    ["recursos","agente"].forEach(movePanelIntoMain);
    var medios = qa('[id="p-medios"]');
    medios.forEach(function(el, idx){ if(idx > 0) el.id = "p-medios-cobertura"; });
    if(!document.getElementById("p-hoy")){
      var hoy = document.createElement("div"); hoy.id = "p-hoy"; hoy.style.setProperty("display","none","important");
      var first = document.getElementById("p-tablero") || main.firstElementChild;
      if(first && first.parentElement === main) main.insertBefore(hoy, first); else main.appendChild(hoy);
    }
    cleanSidebarText();
  }

  function panels(){ repairStructure(); var main = mainEl(); return main ? qa(":scope > [id^='p-']", main) : []; }

  function closeClosedModals(){
    qa(".ov,.overlay").forEach(function(modal){
      if(!modal.classList.contains("open")){
        modal.classList.remove("show","active","on");
        modal.style.setProperty("display","none","important");
        modal.style.setProperty("pointer-events","none","important");
        modal.setAttribute("aria-hidden","true");
      }
    });
    qa(".overlay-backdrop,.modal-backdrop,#overlay").forEach(function(o){ o.remove(); });
  }

  function setPanelState(panel, active, id){
    if(!panel) return;
    var pid = (panel.id || "").replace(/^p-/,"");
    panel.classList.toggle("active", active);
    panel.classList.toggle("show", active);
    panel.classList.remove("open");
    if(active){
      panel.hidden = false; panel.removeAttribute("hidden"); panel.removeAttribute("aria-hidden");
      panel.style.setProperty("display", displayFor(id), "important");
      panel.style.setProperty("visibility", "visible", "important");
      panel.style.removeProperty("opacity");
    }else{
      panel.hidden = true; panel.setAttribute("aria-hidden","true");
      panel.classList.remove("m7-hoy-stable");
      panel.style.setProperty("display", "none", "important");
      panel.style.setProperty("visibility", "hidden", "important");
    }
    if(pid === "hoy" && !active) panel.classList.remove("m7-hoy-stable");
  }

  function buttonId(btn){
    if(!btn) return "";
    var direct = btn.getAttribute("data-mid") || btn.getAttribute("data-nav") || btn.dataset.nav || "";
    if(direct) return norm(direct);
    var onclick = btn.getAttribute("onclick") || "";
    var m = onclick.match(/(?:nav|exitFullPanel)\(['\"]([^'\"]+)['\"]/);
    return m ? norm(m[1]) : "";
  }

  function setActiveButtons(id, explicitButton){
    qa(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]").forEach(function(btn){
      var active = buttonId(btn) === id || btn === explicitButton;
      btn.classList.toggle("on", active); btn.classList.toggle("mbn-active", active);
      if(active) btn.setAttribute("aria-current","page"); else btn.removeAttribute("aria-current");
    });
  }

  function hideRealizada(){
    var kanban = q("#kanban");
    if(kanban){
      qa(".kcol", kanban).forEach(function(col){
        var txt = (col.textContent || "").toLowerCase();
        var hdr = q(".khdr,.kt", col);
        var htxt = (hdr && hdr.textContent || txt).toLowerCase();
        if(htxt.indexOf("realizada") !== -1 || htxt.indexOf("realizado") !== -1) col.style.setProperty("display","none","important");
      });
    }
    var fest = q("#fest");
    if(fest){
      qa("option", fest).forEach(function(opt){ if(/realizad/i.test(opt.textContent || opt.value || "")) opt.remove(); });
      if(/realizad/i.test(fest.value || "")) fest.value = "Pendiente";
    }
  }

  function compactHoy(){
    var hoy = q("#p-hoy"); if(!hoy) return;
    hoy.classList.add("ui-hoy-compacto");
    var main = mainEl(); if(main && document.body.getAttribute("data-active-panel") === "hoy") main.style.setProperty("scroll-behavior","auto","important");
  }

  function fixCalendarReadable(){
    var cal = q("#p-calendario"); if(!cal) return;
    cal.classList.add("ui-cal-readable");
    ["#calwscroll","#cal-day-content"].forEach(function(sel){ var el=q(sel); if(el) el.classList.add("ui-cal-readable-host"); });
    qa("#calwscroll [onclick*='openEvPanel'],#calwscroll [onclick*='editPubItem'],#cal-day-content [onclick*='openEvPanel'],#cal-day-content [onclick*='editPubItem']").forEach(function(el){
      el.classList.add("ui-cal-event-readable");
      el.style.setProperty("white-space","normal","important");
      el.style.setProperty("word-break","normal","important");
      el.style.setProperty("overflow-wrap","break-word","important");
      el.style.setProperty("font-size","11px","important");
      el.style.setProperty("line-height","1.2","important");
      el.style.setProperty("min-width","94px","important");
      el.style.setProperty("min-height","34px","important");
      el.style.setProperty("padding","5px 7px","important");
      el.style.setProperty("z-index","40","important");
      qa("*", el).forEach(function(ch){
        ch.style.setProperty("white-space","normal","important");
        ch.style.setProperty("word-break","normal","important");
        ch.style.setProperty("overflow-wrap","break-word","important");
        ch.style.setProperty("font-size","11px","important");
        ch.style.setProperty("line-height","1.18","important");
      });
    });
  }

  function getTeamList(){ try{ return (typeof teams !== "undefined" && Array.isArray(teams)) ? teams : []; }catch(_e){ return []; } }
  function findTeamByText(card){
    var text = (card && card.textContent || "").replace(/\s+/g," ").trim();
    var list = getTeamList();
    for(var i=0;i<list.length;i++) if(list[i].nombre && text.toLowerCase().indexOf(String(list[i].nombre).toLowerCase()) !== -1) return list[i];
    return null;
  }

  function ensureTeamModal(){
    var m = q("#uiTeamModal"); if(m) return m;
    m = document.createElement("div"); m.id = "uiTeamModal"; m.className = "overlay";
    m.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:3000;align-items:center;justify-content:center;padding:16px";
    m.innerHTML = '<div class="mod" style="width:min(520px,95vw);background:#fff;border-radius:16px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)">'+
      '<div style="font-size:18px;font-weight:900;margin-bottom:12px">Editar integrante</div>'+ 
      '<input type="hidden" id="uiTeamId">'+
      '<div class="fg"><label>Nombre</label><input id="uiTeamNombre" type="text"></div>'+ 
      '<div class="fg"><label>Email</label><input id="uiTeamEmail" type="email"></div>'+ 
      '<div class="fg"><label>Teléfono / WhatsApp</label><input id="uiTeamTel" type="text"></div>'+ 
      '<div class="fg"><label>Rol</label><input id="uiTeamRol" type="text"></div>'+ 
      '<div class="fr" style="gap:8px;justify-content:flex-end;margin-top:12px">'+
      '<button class="btn-sec" type="button" onclick="window.uiTeamClose()">Cancelar</button>'+ 
      '<button class="btn-pri" type="button" onclick="window.uiTeamSave()">Guardar</button>'+ 
      '</div></div>';
    m.addEventListener("click", function(e){ if(e.target === m) window.uiTeamClose(); });
    document.body.appendChild(m); return m;
  }

  window.uiTeamClose = function(){ var m=q("#uiTeamModal"); if(m){ m.classList.remove("open"); m.style.display="none"; } };
  window.uiTeamOpen = function(member){
    var m = ensureTeamModal(); member = member || {};
    q("#uiTeamId").value = member.id || member.nombre || "";
    q("#uiTeamNombre").value = member.nombre || "";
    q("#uiTeamEmail").value = member.email || member.mail || "";
    q("#uiTeamTel").value = member.telefono || member.tel || member.whatsapp || "";
    q("#uiTeamRol").value = member.rol || member.cargo || "";
    m.classList.add("open"); m.style.display="flex"; m.style.pointerEvents="auto";
  };
  window.uiTeamSave = async function(){
    var id = q("#uiTeamId").value;
    var row = { nombre:q("#uiTeamNombre").value.trim(), email:q("#uiTeamEmail").value.trim(), telefono:q("#uiTeamTel").value.trim().replace(/[^0-9]/g,""), rol:q("#uiTeamRol").value.trim() };
    if(!row.nombre){ alert("El nombre es obligatorio"); return; }
    var list = getTeamList(); var old = list.find(function(x){ return String(x.id||x.nombre) === String(id) || x.nombre === id; });
    var data = Object.assign({}, old || {}, row);
    try{
      var dbx = window.db || (typeof db !== "undefined" ? db : null);
      if(dbx && dbx.from){
        if(old && old.id) await dbx.from("equipo").update(data).eq("id", old.id);
        else if(old && old.nombre) await dbx.from("equipo").update(data).eq("nombre", old.nombre);
        else await dbx.from("equipo").insert(data);
      }
    }catch(e){ console.warn("[ui-fixes] equipo save", e); }
    if(old) Object.assign(old, data); else list.push(Object.assign({id:"loc_"+Date.now()}, data));
    window.uiTeamClose();
    if(typeof window.renderTeam === "function") window.renderTeam();
    if(typeof window.renderPersons === "function") window.renderPersons();
    if(typeof toast === "function") toast("✓ Integrante actualizado");
  };

  function patchTeamClicks(){
    var panel = q("#p-equipo"); if(!panel) return;
    qa("button", panel).forEach(function(btn){
      var t=(btn.textContent||"").toLowerCase();
      if(t.indexOf("agregar persona")!==-1 && !btn._uiAddTeam){
        btn._uiAddTeam=true; btn.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); if(typeof window.openMemberMod==="function") window.openMemberMod(); else window.uiTeamOpen({}); }, true);
      }
    });
    qa(".person,.member,.tmcard,.card,[onclick*='edit'],[onclick*='Person'],[onclick*='Team']", panel).forEach(function(card){
      if(card._uiEditTeam || card.tagName === "BUTTON" || card.closest("button")) return;
      var m=findTeamByText(card); if(!m) return;
      card._uiEditTeam=true; card.style.cursor="pointer";
      card.addEventListener("dblclick", function(e){ e.preventDefault(); e.stopPropagation(); window.uiTeamOpen(m); }, true);
    });
  }

  function callRender(id){
    var map = { hoy:["_renderHoy","renderPanelHoyCustom"], tablero:["renderKanban"], material:["renderMaterial"], publicaciones:["renderPubDay","renderWeek"], calendario:["renderCal","renderCalDay"], guardias:["initGuardias","renderGuardias","renderGuardDay"], equipo:["renderTeam","renderPersons"], metricas:["renderMetricas"], medios:["renderNoticias","renderMedioSum","renderMediosList"], reclamos:["renderReclamos"], entrevistas:["renderEntrevistas"], contactos:["renderContactos","renderContactosMediosModulo"], recursos:["loadRecursos","renderRecursos"], agente:["agRenderLista","agRenderStats","agRenderProgreso"] };
    (map[id] || []).forEach(function(fn){ try{ if(typeof window[fn] === "function") window[fn](); }catch(e){ console.warn("[ui-fixes] render fallo", fn, e); } });
    setTimeout(function(){ if(id==="hoy") compactHoy(); if(id==="tablero") hideRealizada(); if(id==="calendario") fixCalendarReadable(); if(id==="equipo") patchTeamClicks(); }, 80);
    setTimeout(function(){ if(id==="tablero") hideRealizada(); if(id==="calendario") fixCalendarReadable(); if(id==="equipo") patchTeamClicks(); }, 350);
  }

  function showOnly(id, explicitButton, skipRender){
    id = norm(id); repairStructure();
    var previous = norm(document.body.getAttribute("data-active-panel") || "");
    if(id !== "agente"){
      window._agenteActual = null;
      var agente = document.getElementById("p-agente"); if(agente) setPanelState(agente, false, id);
    }
    var target = document.getElementById("p-" + id); if(!target && id === "biblioteca") target = document.getElementById("p-recursos");
    if(!target){ id="tablero"; target=document.getElementById("p-tablero") || panels()[0]; }
    panels().forEach(function(panel){ setPanelState(panel, panel === target, id); }); setPanelState(target, true, id);
    document.body.setAttribute("data-active-panel", id);
    document.body.classList.remove("show-calendario","show-publicaciones","show-guardias");
    if(window.innerWidth <= 700 && (id==="calendario"||id==="publicaciones"||id==="guardias")) document.body.classList.add("full-panel","show-"+id); else document.body.classList.remove("full-panel");
    setActiveButtons(id, explicitButton); closeClosedModals();
    if(id==="hoy") compactHoy(); if(id==="tablero") hideRealizada(); if(id==="calendario") fixCalendarReadable(); if(id==="equipo") patchTeamClicks();
    var main=mainEl(); if(main && !skipRender && previous !== id) main.scrollTop=0;
    if(!skipRender){ setTimeout(function(){ callRender(id); showOnly(id, explicitButton, true); }, 30); setTimeout(function(){ showOnly(id, explicitButton, true); }, 180); }
  }

  function finalNav(id, tab, sb){ id=norm(id); showOnly(id, sb || tab || null, false); return false; }
  function installNav(){ window.nav=finalNav; window.nav._stableFinal=true; window.nav._v4patched=true; window.nav._v5patched=true; window.nav.__patcheadoActivo=true; window.exitFullPanel=function(id){ document.body.classList.remove("full-panel","show-calendario","show-publicaciones","show-guardias"); return finalNav(id || document.body.getAttribute("data-active-panel") || "hoy"); }; }
  function installAgentPanel(){
    if(typeof window.abrirPanelAgente !== "function" || window.abrirPanelAgente._uiFixed) return;
    var original=window.abrirPanelAgente;
    window.abrirPanelAgente=function(nombre){ window._agenteActual=nombre || window._agenteActual || ""; try{ original.apply(this, arguments); }catch(e){ console.warn("[ui-fixes] abrirPanelAgente fallo", e); } setTimeout(function(){ showOnly("agente", null, true); var panel=movePanelIntoMain("agente"); if(panel){ panel.hidden=false; panel.removeAttribute("hidden"); panel.removeAttribute("aria-hidden"); panel.style.setProperty("display","block","important"); panel.style.setProperty("visibility","visible","important"); } },0); };
    window.abrirPanelAgente._uiFixed=true;
  }

  function css(){
    if(document.getElementById("ui-fixes-root-css")) return;
    var st=document.createElement("style"); st.id="ui-fixes-root-css";
    st.textContent=[
      "html,body{font-size:13px!important;line-height:1.34!important}","button,.btn,.ntab,.sbi{font-size:12px!important}","input,select,textarea{font-size:13px!important}",".ptitle,.pgtitle{font-size:16px!important}","h1{font-size:20px!important}h2{font-size:17px!important}h3{font-size:15px!important}",
      "#p-tablero #kanban .kcol:has(.khdr),#p-tablero #kanban .kcol{min-width:280px!important}",
      "#p-tablero #kanban .kcol:has(.khdr:contains('Realizada')){display:none!important}",
      "#p-hoy.m7-hoy-stable,#p-hoy.ui-hoy-compacto{font-size:12px!important;padding:8px 12px 14px!important;overflow:auto!important;min-height:auto!important}","#p-hoy #m7-hoy-panel{max-width:none!important;margin:0!important;width:100%!important}","#p-hoy .m7-grid{gap:12px!important;margin-top:12px!important}","#p-hoy .m7-card{padding:10px 12px!important;margin-bottom:8px!important;border-radius:8px!important;box-shadow:0 4px 14px rgba(15,23,42,.05)!important}","#p-hoy .m7-card-head h3{font-size:14px!important;line-height:1.18!important;font-weight:800!important}","#p-hoy .m7-delay-title{font-size:12px!important;line-height:1.22!important;font-weight:700!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}","#p-hoy .m7-delay-age strong{font-size:18px!important;line-height:1!important}",
      "#p-calendario.ui-cal-readable #calwscroll{overflow-x:auto!important;overflow-y:auto!important}","#p-calendario.ui-cal-readable #calwscroll>div{min-width:1180px!important}","#p-calendario.ui-cal-readable [onclick*='openEvPanel'],#p-calendario.ui-cal-readable [onclick*='editPubItem'],.ui-cal-event-readable{min-width:96px!important;max-width:180px!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;font-size:11px!important;line-height:1.18!important;padding:5px 7px!important;border-radius:8px!important;background:#fff!important;color:#111827!important;box-shadow:0 2px 8px rgba(15,23,42,.14)!important}","#p-calendario.ui-cal-readable [onclick*='openEvPanel'] *,#p-calendario.ui-cal-readable [onclick*='editPubItem'] *{white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;font-size:11px!important;line-height:1.18!important}",
      "#uiTeamModal .fg{margin-bottom:10px}#uiTeamModal label{display:block;font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px}#uiTeamModal input{width:100%;border:1px solid #d1d5db;border-radius:8px;padding:8px 10px;font-size:13px}#uiTeamModal .btn-pri{background:#667eea;color:#fff;border:none;border-radius:8px;padding:8px 13px;font-weight:800}#uiTeamModal .btn-sec{background:#f3f4f6;color:#374151;border:1px solid #d1d5db;border-radius:8px;padding:8px 13px;font-weight:700}",
      ".ov:not(.open),.overlay:not(.open){display:none!important;pointer-events:none!important}",".ov.open,.overlay.open{display:flex!important;pointer-events:auto!important}","#login{z-index:9999}.ov.open,.overlay.open{z-index:1200}#uiTeamModal.open{z-index:3000!important}#toast{z-index:3500}.topbar{z-index:100}.sb{z-index:90}#evpanel{z-index:800}",".content{overflow-y:auto!important;overflow-x:hidden!important;scroll-behavior:auto!important}"
    ].join("\n");
    document.head.appendChild(st);
  }

  function clickCapture(e){
    var agentBtn=e.target.closest('[onclick*="abrirPanelAgente"]'); if(agentBtn) return;
    var btn=e.target.closest(".ntab,.sbi,.mbn-btn,[data-mid],[data-nav]"); if(!btn) return;
    var id=buttonId(btn); if(!id) return; e.preventDefault(); e.stopPropagation(); if(typeof e.stopImmediatePropagation==="function") e.stopImmediatePropagation(); finalNav(id,null,btn);
  }

  function run(){
    css(); installNav(); installAgentPanel(); repairStructure(); closeClosedModals();
    var active=norm(document.body.getAttribute("data-active-panel") || "hoy"); if(!document.getElementById("p-"+active)) active="hoy";
    showOnly(active,null,false); hideRealizada(); fixCalendarReadable(); patchTeamClicks();
  }

  document.addEventListener("click", clickCapture, true);
  document.addEventListener("dblclick", function(e){ var panel=q("#p-equipo"); if(!panel || document.body.getAttribute("data-active-panel")!=="equipo") return; var card=e.target.closest(".card,.tmcard,.person,.member,div"); var m=findTeamByText(card); if(m){ e.preventDefault(); e.stopPropagation(); window.uiTeamOpen(m); } }, true);

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, {once:true}); else run();
  setTimeout(run,250); setTimeout(run,900); setTimeout(function(){ installAgentPanel(); showOnly(norm(document.body.getAttribute("data-active-panel") || "hoy"), null, true); hideRealizada(); fixCalendarReadable(); patchTeamClicks(); },1800);
  setInterval(function(){ var active=document.body.getAttribute("data-active-panel"); if(active==="tablero") hideRealizada(); if(active==="calendario") fixCalendarReadable(); if(active==="equipo") patchTeamClicks(); },1200);

  window.uiFixesRun=run;
  console.log("[ui-fixes] tablero calendario equipo corregidos 2026-05-21f");
})();
