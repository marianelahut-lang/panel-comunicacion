/* ============================================================
MEJORAS3.JS v2 - Panel Comunicación Tres Arroyos
FIXES: Separación módulos + Guardia operativa
============================================================
CORRECCIONES:
1. p-tablero OCULTO cuando no es la pestaña activa
2. Material y Reclamos sin tablero superpuesto
3. Columna Realizada eliminada del kanban
4. Panel guardia rediseñado (desde 15hs, cronológico)
5. Botones WhatsApp por agente
NO modifica datos ni lógica funcional.
============================================================ */
(function(){
"use strict";

/* CSS */
function inyectarCSS(){
if(document.getElementById("m4css")) return;
var css = [
"/* TABLERO: oculto por default, solo visible cuando activo */",
"#p-tablero{display:none!important}",
"body.m4tab-tablero #p-tablero{display:flex!important}",
"/* Quitar ::before de mejoras3 */",
"#p-tablero::before{display:none!important;content:none!important}",
"/* Columna Realizada oculta */",
".m4col-hide{display:none!important}",
"/* GUARDIA rediseño */",
"#m4gwrap{padding:0 0 24px 0}",
".m4gh{background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:14px;padding:18px 20px;color:#fff;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}",
".m4gh h2{font-size:20px;font-weight:700;margin:0 0 2px 0}",
".m4gh p{font-size:12px;opacity:.85;margin:0}",
".m4ghr{font-size:13px;background:rgba(255,255,255,.2);padding:6px 12px;border-radius:20px;font-weight:600}",
".m4ag-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px}",
".m4ag-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}",
"body.dark .m4ag-card{background:#1f2937;border-color:#374151}",
".m4ag-rol{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}",
".m4rol-tit{color:#4f46e5}",
".m4rol-sop{color:#10b981}",
".m4ag-nom{font-size:16px;font-weight:700;color:#111827;margin-bottom:2px}",
"body.dark .m4ag-nom{color:#f9fafb}",
".m4ag-hor{font-size:12px;color:#6b7280;margin-bottom:10px}",
".m4wabtn{display:flex;align-items:center;justify-content:center;gap:6px;background:#25d366;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;width:100%;transition:background .15s}",
".m4wabtn:hover{background:#1da851}",
".m4acts{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}",
"body.dark .m4acts{background:#1f2937;border-color:#374151}",
".m4acts-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb}",
"body.dark .m4acts-hdr{background:#111827;border-color:#374151}",
".m4acts-hdr h3{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;margin:0}",
".m4cnt-badge{font-size:11px;background:#ede9fe;color:#5b21b6;padding:3px 8px;border-radius:20px;font-weight:600}",
".m4act{display:flex;align-items:flex-start;gap:12px;padding:11px 16px;border-bottom:1px solid #f3f4f6;transition:background .1s}",
"body.dark .m4act{border-color:#374151}",
".m4act:last-child{border-bottom:none}",
".m4act:hover{background:#f9fafb}",
"body.dark .m4act:hover{background:#374151}",
".m4act-hora{font-size:13px;font-weight:700;color:#4f46e5;min-width:48px;padding-top:1px}",
".m4badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;margin-top:3px;white-space:nowrap}",
".m4bc{background:#fef3c7;color:#92400e}",
".m4bp{background:#d1fae5;color:#065f46}",
".m4be{background:#dbeafe;color:#1d4ed8}",
".m4br{background:#ede9fe;color:#5b21b6}",
".m4act-tit{font-size:13px;font-weight:600;color:#111827;line-height:1.4}",
"body.dark .m4act-tit{color:#f9fafb}",
".m4act-sub{font-size:11px;color:#6b7280}",
".m4empty{text-align:center;padding:28px 16px;color:#9ca3af;font-size:13px}"
].join("\n");
var st = document.createElement("style");
st.id = "m4css";
st.textContent = css;
document.head.appendChild(st);
}

   MEJORAS3.JS v3 - Panel Comunicación Tres Arroyos
   FIXES: Separación módulos + Guardia semanal rediseñada
   ============================================================
   CORRECCIONES:
   1. p-tablero OCULTO cuando no es la pestaña activa
   2. Material y Reclamos sin tablero superpuesto
   3. Columna Realizada eliminada del kanban
   4. Panel guardia REDISEÑADO completo (vista semanal, agentes, WhatsApp)
   5. Botones WhatsApp por agente con mensaje automático
   NO modifica datos ni lógica funcional.
   ============================================================ */

(function(){
"use strict";

/* ============ CSS ============ */
function inyectarCSS(){
  if(document.getElementById('m4css')) return;
  const s=document.createElement('style');
  s.id='m4css';
  s.textContent=`
    /* TABLERO: oculto por default, solo visible cuando activo */
    #p-tablero{display:none!important}
    body.m4tab-tablero #p-tablero{display:flex!important}

    /* Ocultar columna Realizada del kanban */
    .m4col-hide{display:none!important}

    /* ===== GUARDIA REDISEÑADA ===== */
    /* Ocultar elementos originales del panel guardia */
    #p-guardias .ptop,
    #p-guardias .gw-navrow,
    #p-guardias .gw-desktop,
    #p-guardias .gw-mobile,
    #p-guardias .acts,
    #p-guardias #m1-pubs-guardias {
      display:none!important;
    }

    /* Contenedor principal */
    #m4g-panel {
      width:100%; padding:16px; box-sizing:border-box;
      font-family:inherit;
    }

    /* Header */
    #m4g-panel .m4g-header {
      display:flex; align-items:center; justify-content:space-between;
      background:linear-gradient(135deg,#6c3fc5,#4f46e5);
      color:#fff; border-radius:12px; padding:16px 20px;
      margin-bottom:16px;
    }
    #m4g-panel .m4g-header h2 { margin:0; font-size:1.1rem; font-weight:700; }
    #m4g-panel .m4g-header p { margin:4px 0 0; font-size:.85rem; opacity:.85; }
    #m4g-panel .m4g-header-btns { display:flex; gap:8px; align-items:center; }
    #m4g-panel .m4g-view-btn {
      padding:6px 12px; border-radius:8px; border:none; cursor:pointer;
      font-size:.8rem; font-weight:600; transition:all .2s;
    }
    #m4g-panel .m4g-view-btn.active { background:#fff; color:#6c3fc5; }
    #m4g-panel .m4g-view-btn:not(.active) { background:rgba(255,255,255,.2); color:#fff; }

    /* Navegación de semana */
    #m4g-panel .m4g-weeknav {
      display:flex; align-items:center; gap:12px; margin-bottom:16px;
    }
    #m4g-panel .m4g-weeknav button {
      background:var(--color-canvas-subtle,#f6f8fa); border:1px solid var(--color-border-default,#d0d7de);
      border-radius:8px; padding:6px 12px; cursor:pointer; font-size:.85rem; font-weight:600;
      transition:background .2s;
    }
    #m4g-panel .m4g-weeknav button:hover { background:var(--color-canvas-default,#fff); }
    #m4g-panel .m4g-weeknav .m4g-weekrange {
      flex:1; text-align:center; font-size:.9rem; font-weight:600;
      color:var(--color-fg-default,#1f2328);
    }
    #m4g-panel .m4g-weeknav .m4g-today-btn {
      background:#6c3fc5!important; color:#fff!important; border-color:#6c3fc5!important;
    }

    /* Grid de días */
    #m4g-panel .m4g-days {
      display:grid; grid-template-columns:repeat(7,1fr); gap:8px;
      margin-bottom:16px;
    }
    @media(max-width:700px){
      #m4g-panel .m4g-days { grid-template-columns:repeat(3,1fr); }
    }

    /* Tarjeta de día */
    #m4g-panel .m4g-day {
      background:var(--color-canvas-subtle,#f6f8fa);
      border:2px solid var(--color-border-default,#d0d7de);
      border-radius:12px; padding:10px 8px; cursor:pointer;
      transition:all .2s; min-height:110px;
      display:flex; flex-direction:column; align-items:center; gap:4px;
    }
    #m4g-panel .m4g-day:hover { border-color:#6c3fc5; background:rgba(108,63,197,.05); }
    #m4g-panel .m4g-day.m4g-day-active {
      border-color:#6c3fc5!important; background:rgba(108,63,197,.08)!important;
    }
    #m4g-panel .m4g-day.m4g-day-today { border-color:#f59e0b!important; }
    #m4g-panel .m4g-day-name { font-size:.7rem; font-weight:700; text-transform:uppercase; color:#888; }
    #m4g-panel .m4g-day-num { font-size:1.2rem; font-weight:800; color:var(--color-fg-default,#1f2328); }
    #m4g-panel .m4g-day-today .m4g-day-num { color:#f59e0b; }
    #m4g-panel .m4g-day-active .m4g-day-num { color:#6c3fc5; }

    /* Avatar en tarjeta de día */
    #m4g-panel .m4g-day-avatar {
      width:32px; height:32px; border-radius:50%;
      background:#6c3fc5; color:#fff; display:flex; align-items:center; justify-content:center;
      font-size:.75rem; font-weight:700; flex-shrink:0;
    }
    #m4g-panel .m4g-day-agent { font-size:.7rem; font-weight:600; text-align:center; line-height:1.2; }
    #m4g-panel .m4g-day-role { font-size:.6rem; color:#888; }
    #m4g-panel .m4g-day-count {
      background:#6c3fc5; color:#fff; border-radius:20px;
      padding:2px 8px; font-size:.65rem; font-weight:700;
      margin-top:2px;
    }
    #m4g-panel .m4g-day-noassign { font-size:.65rem; color:#aaa; text-align:center; }

    /* Botón WA en tarjeta de día */
    #m4g-panel .m4g-day-wa {
      background:#25d366; color:#fff; border:none; border-radius:8px;
      padding:3px 8px; font-size:.65rem; font-weight:700; cursor:pointer;
      margin-top:2px; width:100%; display:flex; align-items:center; justify-content:center; gap:3px;
    }
    #m4g-panel .m4g-day-wa:hover { background:#1ebe5a; }

    /* Panel de detalle del día */
    #m4g-panel .m4g-detail {
      display:grid; grid-template-columns:1fr 200px; gap:16px;
    }
    @media(max-width:700px){
      #m4g-panel .m4g-detail { grid-template-columns:1fr; }
    }

    #m4g-panel .m4g-detail-box {
      background:var(--color-canvas-subtle,#f6f8fa);
      border:1px solid var(--color-border-default,#d0d7de);
      border-radius:12px; padding:16px;
    }

    #m4g-panel .m4g-detail-header {
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:12px; flex-wrap:wrap; gap:8px;
    }
    #m4g-panel .m4g-detail-title { font-size:.95rem; font-weight:700; }
    #m4g-panel .m4g-detail-wa {
      background:#25d366; color:#fff; border:none; border-radius:8px;
      padding:6px 14px; font-size:.8rem; font-weight:700; cursor:pointer;
      display:flex; align-items:center; gap:5px;
    }
    #m4g-panel .m4g-detail-wa:hover { background:#1ebe5a; }

    /* Lista de actividades */
    #m4g-panel .m4g-act-list { display:flex; flex-direction:column; gap:8px; }
    #m4g-panel .m4g-act-item {
      background:var(--color-canvas-default,#fff);
      border:1px solid var(--color-border-default,#d0d7de);
      border-radius:10px; padding:10px 12px;
      display:flex; align-items:flex-start; gap:10px;
    }
    #m4g-panel .m4g-act-time {
      font-size:.85rem; font-weight:800; min-width:42px;
      color:#6c3fc5;
    }
    #m4g-panel .m4g-act-badge {
      display:inline-flex; align-items:center; gap:3px;
      padding:2px 8px; border-radius:6px;
      font-size:.65rem; font-weight:700; white-space:nowrap;
    }
    #m4g-panel .m4g-badge-evento { background:#dbeafe; color:#1d4ed8; }
    #m4g-panel .m4g-badge-pub { background:#fce7f3; color:#be185d; }
    #m4g-panel .m4g-badge-cob { background:#dcfce7; color:#15803d; }
    #m4g-panel .m4g-badge-radio { background:#fef3c7; color:#b45309; }

    #m4g-panel .m4g-act-info { flex:1; }
    #m4g-panel .m4g-act-title { font-size:.85rem; font-weight:600; line-height:1.3; }
    #m4g-panel .m4g-act-place { font-size:.75rem; color:#888; margin-top:2px; }

    #m4g-panel .m4g-act-empty {
      text-align:center; color:#aaa; padding:24px;
      font-size:.85rem;
    }

    /* Sidebar resumen */
    #m4g-panel .m4g-sidebar { display:flex; flex-direction:column; gap:12px; }
    #m4g-panel .m4g-summary {
      background:var(--color-canvas-subtle,#f6f8fa);
      border:1px solid var(--color-border-default,#d0d7de);
      border-radius:12px; padding:14px;
    }
    #m4g-panel .m4g-summary h3 { font-size:.85rem; font-weight:700; margin:0 0 10px; }
    #m4g-panel .m4g-summary-row {
      display:flex; justify-content:space-between; align-items:center;
      padding:4px 0; font-size:.8rem; border-bottom:1px solid var(--color-border-muted,#eaeef2);
    }
    #m4g-panel .m4g-summary-row:last-child { border-bottom:none; }
    #m4g-panel .m4g-summary-val {
      font-weight:700; background:#6c3fc5; color:#fff;
      padding:1px 8px; border-radius:10px; font-size:.75rem;
    }
    #m4g-panel .m4g-agent-card {
      background:var(--color-canvas-subtle,#f6f8fa);
      border:1px solid var(--color-border-default,#d0d7de);
      border-radius:12px; padding:14px; display:flex; flex-direction:column; align-items:center; gap:8px;
    }
    #m4g-panel .m4g-agent-avatar {
      width:48px; height:48px; border-radius:50%;
      background:#6c3fc5; color:#fff; display:flex; align-items:center; justify-content:center;
      font-size:1rem; font-weight:700;
    }
    #m4g-panel .m4g-agent-name { font-size:.9rem; font-weight:700; }
    #m4g-panel .m4g-agent-role { font-size:.75rem; color:#888; }
    #m4g-panel .m4g-agent-wa {
      background:#25d366; color:#fff; border:none; border-radius:8px;
      padding:6px 14px; font-size:.8rem; font-weight:700; cursor:pointer; width:100%;
    }
  `;
  document.head.appendChild(s);
}

/* ============ TABLERO FIX ============ */
function checkTablero(){
  const t=document.querySelector('#p-tablero');
  if(!t) return;
  if(document.body.classList.contains('m4tab-tablero')){
    t.style.removeProperty('display');
  } else {
    t.style.setProperty('display','none','important');
  }
}

function parchearNav(){
  const orig=window.nav;
  if(typeof orig!=='function'||window._m4navOK) return;
  window._m4navOK=true;
  window.nav=function(id,...args){
    document.body.classList.toggle('m4tab-tablero', id==='tablero');
    checkTablero();
    return orig.call(this,id,...args);
  };
  document.querySelectorAll('.ntab,.sbi').forEach(btn=>{
    btn.addEventListener('click',function(){
      const tid=this.dataset.tab||this.getAttribute('onclick')||'';
      const isT=tid.includes('tablero');
      document.body.classList.toggle('m4tab-tablero',isT);
      checkTablero();
    },{capture:true});
  });
}

/* ============ KANBAN FIX ============ */
function ocultarRealizada(){
  document.querySelectorAll('.kanban-col,.k-col,[class*="kanban"],[class*="column"]').forEach(col=>{
    const h=col.querySelector('h3,h4,.col-title,.k-title');
    if(h&&/realizada/i.test(h.textContent)){
      col.style.setProperty('display','none','important');
    }
  });
}

/* ============ GUARDIA PANEL BUILDER ============ */
// Week offset (0 = current week)
let m4gWeekOffset = 0;
let m4gSelectedDay = null; // Date string YYYY-MM-DD

function getWeekDays(offset){
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const mon = new Date(today);
  mon.setDate(today.getDate() - (dow===0?6:dow-1) + offset*7);
  const days = [];
  for(let i=0;i<7;i++){
    const d = new Date(mon);
    d.setDate(mon.getDate()+i);
    days.push(d);
  }
  return days;
}

function fmtDate(d){
  return d.toISOString().split('T')[0];
}

function dayNames(){ return ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM']; }

function getInitials(name){
  if(!name) return '?';
  return name.split(' ').map(w=>w[0]||'').join('').substring(0,2).toUpperCase();
}

function fmtWeekRange(days){
  const opts={day:'numeric',month:'short'};
  const s=days[0].toLocaleDateString('es-AR',opts);
  const e=days[6].toLocaleDateString('es-AR',opts);
  const y=days[0].getFullYear();
  return s+' — '+e+' '+y;
}

function getGuardData(dateStr){
  // Read from existing DOM guard data
  // Look for agent assigned to this day in the existing weekly calendar
  const gp=document.querySelector('#p-guardias');
  if(!gp) return {agent:null,role:'',activities:[]};
  
  // Try to find day cell in the original gw-desktop table
  const table=gp.querySelector('.gw-desktop table,.gw-desktop [class*="week"]');
  // Also check window guardData if available
  const wd = window.guardData || window.weekData || null;
  return {agent:null, role:'', activities:[]};
}

function getActivitiesForDay(dateStr){
  // Collect activities from existing DOM for a given date
  const acts = [];
  
  // 1. Check guard overrides
  try {
    const ov = JSON.parse(localStorage.getItem('guardOverrides')||'{}');
    const dayOv = ov[dateStr];
    if(dayOv && Array.isArray(dayOv)){
      dayOv.forEach(a=>{
        if(a.hora && parseInt(a.hora)>=15){
          acts.push({time:a.hora,type:a.tipo||'cobertura',title:a.titulo||a.title||'',place:a.lugar||a.place||''});
        }
      });
    }
  } catch(e){}
  
  // 2. Check calendar events from DOM
  const calEls = document.querySelectorAll('[data-date="'+dateStr+'"] .cal-event, [data-fecha="'+dateStr+'"] .event-item');
  calEls.forEach(el=>{
    const timeEl=el.querySelector('.time,.hora');
    const titleEl=el.querySelector('.title,.titulo');
    const hr = timeEl ? parseInt(timeEl.textContent) : 0;
    if(hr>=15){
      acts.push({time:timeEl?timeEl.textContent:'15:00',type:'evento',title:titleEl?titleEl.textContent:(el.textContent.substring(0,50)),place:''});
    }
  });
  
  // 3. Check publications from DOM
  const pubEls = document.querySelectorAll('[data-date="'+dateStr+'"] .pub-item, .pub-card[data-fecha="'+dateStr+'"]');
  pubEls.forEach(el=>{
    const timeEl=el.querySelector('.time,.hora');
    const titleEl=el.querySelector('.title,.titulo');
    const hr = timeEl ? parseInt(timeEl.textContent) : 20;
    if(hr>=15){
      acts.push({time:timeEl?timeEl.textContent:'20:00',type:'publicacion',title:titleEl?titleEl.textContent:(el.textContent.substring(0,50)),place:''});
    }
  });
  
  // 4. Try window global data
  try {
    const gd = window.actividades || window.guardActivities || [];
    if(Array.isArray(gd)){
      gd.forEach(a=>{
        if((a.fecha||'').startsWith(dateStr) || a.date===dateStr){
          const hr = a.hora ? parseInt(a.hora) : 0;
          if(hr>=15){
            acts.push({time:a.hora||'15:00',type:a.tipo||a.type||'cobertura',title:a.titulo||a.title||'',place:a.lugar||a.place||''});
          }
        }
      });
    }
  } catch(e){}
  
  acts.sort((a,b)=>(a.time||'').localeCompare(b.time||''));
  return acts;
}

function getAgentForDay(days, dayDate){
  // Try to read agent data from existing guard DOM
  const gp = document.querySelector('#p-guardias');
  if(!gp) return null;
  
  // The original panel shows agents in a weekly table
  // Each day column has agent info
  const dateStr = fmtDate(dayDate);
  
  // Try window data
  try {
    const wd = window.semanaGuardia || window.guardWeek || window.weekGuard;
    if(wd && wd[dateStr]) return wd[dateStr];
  } catch(e){}
  
  // Try reading from existing DOM cells
  // The .gw-desktop table has day columns
  const desktopDiv = gp.querySelector('.gw-desktop');
  if(desktopDiv){
    // Find all day columns - they're table cells or divs with date data
    const dayCells = desktopDiv.querySelectorAll('td,th,.day-cell,.gw-day');
    // Day index: 0=Mon based on days array
    const dayIndex = days.findIndex(d=>fmtDate(d)===dateStr);
    if(dayIndex>=0 && dayCells[dayIndex]){
      const cell = dayCells[dayIndex];
      const nameEl = cell.querySelector('.agent-name,.nombre,strong,b');
      if(nameEl) return {name: nameEl.textContent.trim(), role:'titular'};
    }
  }
  return null;
}

function badgeHTML(type){
  const map={
    evento:['📅','m4g-badge-evento','EVENTO'],
    publicacion:['📢','m4g-badge-pub','PUBLICACIÓN'],
    pub:['📢','m4g-badge-pub','PUBLICACIÓN'],
    cobertura:['🎯','m4g-badge-cob','COBERTURA'],
    cob:['🎯','m4g-badge-cob','COBERTURA'],
    radio:['📻','m4g-badge-radio','RADIO'],
  };
  const t=(type||'').toLowerCase();
  const m=map[t]||['🗓','m4g-badge-evento',type||'ACTIVIDAD'];
  return '<span class="m4g-act-badge '+m[1]+'">'+m[0]+' '+m[2]+'</span>';
}

function buildDetailPanel(dateStr, days){
  const d = days.find(x=>fmtDate(x)===dateStr);
  if(!d) return '<div class="m4g-act-empty">Seleccioná un día para ver el detalle.</div>';
  
  const acts = getActivitiesForDay(dateStr);
  const agent = getAgentForDay(days, d);
  
  const dateLabel = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
  const agentName = agent ? agent.name : 'Sin asignar';
  const agentInitials = getInitials(agentName);
  const agentRole = agent ? (agent.role||'titular') : '';
  
  // WA message
  const waMsg = buildWAMsg(agentName, d, acts);
  const waEncoded = encodeURIComponent(waMsg);
  
  let actsHTML = '';
  if(acts.length===0){
    actsHTML='<div class="m4g-act-empty">Sin actividades desde las 15:00 hs para este día.</div>';
  } else {
    actsHTML = acts.map(a=>`
      <div class="m4g-act-item">
        <div class="m4g-act-time">${a.time||''}</div>
        <div style="display:flex;flex-direction:column;gap:4px;flex:1">
          ${badgeHTML(a.type)}
          <div class="m4g-act-info">
            <div class="m4g-act-title">${a.title||''}</div>
            ${a.place?'<div class="m4g-act-place">'+a.place+'</div>':''}
          </div>
        </div>
      </div>
    `).join('');
  }
  
  // Summary counts
  const cEv = acts.filter(a=>a.type==='evento').length;
  const cPub = acts.filter(a=>['publicacion','pub'].includes(a.type)).length;
  const cCob = acts.filter(a=>['cobertura','cob'].includes(a.type)).length;
  
  return `
    <div class="m4g-detail">
      <div class="m4g-detail-box">
        <div class="m4g-detail-header">
          <div>
            <div class="m4g-detail-title">${dateLabel} — ${agentName.toUpperCase()}</div>
            <div style="font-size:.75rem;color:#888;margin-top:2px">Actividades desde las 15:00 hs</div>
          </div>
          <button class="m4g-detail-wa" onclick="window.open('https://wa.me/?text=${waEncoded}','_blank')">
            💬 Enviar cobertura por WhatsApp
          </button>
        </div>
        <div class="m4g-act-list">
          ${actsHTML}
        </div>
      </div>
      <div class="m4g-sidebar">
        <div class="m4g-summary">
          <h3>📊 Resumen del día</h3>
          <div class="m4g-summary-row"><span>Total actividades</span><span class="m4g-summary-val">${acts.length}</span></div>
          <div class="m4g-summary-row"><span>Eventos</span><span class="m4g-summary-val">${cEv}</span></div>
          <div class="m4g-summary-row"><span>Publicaciones</span><span class="m4g-summary-val">${cPub}</span></div>
          <div class="m4g-summary-row"><span>Coberturas</span><span class="m4g-summary-val">${cCob}</span></div>
        </div>
        <div class="m4g-agent-card">
          <div class="m4g-agent-avatar">${agentInitials}</div>
          <div class="m4g-agent-name">${agentName}</div>
          <div class="m4g-agent-role">${agentRole}</div>
          <button class="m4g-agent-wa" onclick="window.open('https://wa.me/?text=${waEncoded}','_blank')">💬 WhatsApp</button>
        </div>
      </div>
    </div>
  `;
}

function buildWAMsg(agentName, dateObj, acts){
  const dateLabel = dateObj.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  let msg = 'Hola '+agentName+', estas son tus coberturas del día\n';
  msg += dateLabel+':\n\n';
  if(acts.length===0){
    msg += 'Sin actividades asignadas desde las 15:00 hs.\n';
  } else {
    acts.forEach(a=>{
      const tipo = a.type==='publicacion'||a.type==='pub'?'Publicación':
                   a.type==='cobertura'||a.type==='cob'?'Cobertura':
                   a.type==='radio'?'Radio':'Evento';
      msg += a.time+' hs — '+tipo+': '+a.title;
      if(a.place) msg += ' — '+a.place;
      msg += '\n';
    });
  }
  msg += '\n¡Gracias!';
  return msg;
}

function buildDayCard(dayDate, days, isToday, isActive){
  const dateStr = fmtDate(dayDate);
  const agent = getAgentForDay(days, dayDate);
  const acts = getActivitiesForDay(dateStr);
  const agentName = agent ? agent.name : null;
  const agentRole = agent ? (agent.role||'titular') : '';
  const initials = agentName ? getInitials(agentName) : '?';
  const waMsg = buildWAMsg(agentName||'Sin asignar', dayDate, acts);
  const waEncoded = encodeURIComponent(waMsg);
  
  const dayN = dayNames()[days.indexOf(dayDate)];
  const dayNum = dayDate.getDate();
  const month = dayDate.toLocaleDateString('es-AR',{month:'short'});
  
  let classes = 'm4g-day';
  if(isToday) classes += ' m4g-day-today';
  if(isActive) classes += ' m4g-day-active';
  
  const agentHTML = agentName ? `
    <div class="m4g-day-avatar">${initials}</div>
    <div class="m4g-day-agent">${agentName}</div>
    <div class="m4g-day-role">${agentRole}</div>
    ${acts.length>0?'<div class="m4g-day-count">'+acts.length+' act.</div>':''}
    <button class="m4g-day-wa" onclick="event.stopPropagation();window.open('https://wa.me/?text=${waEncoded}','_blank')">💬 WhatsApp</button>
  ` : '<div class="m4g-day-noassign">Sin asignar</div>';
  
  return `<div class="${classes}" data-date="${dateStr}" onclick="window.m4gSelectDay('${dateStr}')">
    <div class="m4g-day-name">${dayN}</div>
    <div class="m4g-day-num">${dayNum} <span style="font-size:.65rem;font-weight:500">${month}</span></div>
    ${agentHTML}
  </div>`;
}

function buildGuardia(){
  const gp = document.querySelector('#p-guardias');
  if(!gp) return;
  
  // Remove previous injection
  const prev = document.querySelector('#m4g-panel');
  if(prev) prev.remove();
  // Also remove old m4gwrap if exists
  const oldWrap = document.querySelector('#m4gwrap');
  if(oldWrap) oldWrap.remove();
  
  // Hide original elements (CSS handles it, but also JS for safety)
  gp.querySelectorAll('.ptop,.gw-navrow,.gw-desktop,.gw-mobile,.acts,#m1-pubs-guardias').forEach(el=>{
    el.style.setProperty('display','none','important');
  });
  
  const today = new Date();
  const todayStr = fmtDate(today);
  const days = getWeekDays(m4gWeekOffset);
  
  // Default selected day = today if in current week, else first day of week
  if(!m4gSelectedDay || !days.find(d=>fmtDate(d)===m4gSelectedDay)){
    const todayInWeek = days.find(d=>fmtDate(d)===todayStr);
    m4gSelectedDay = todayInWeek ? todayStr : fmtDate(days[0]);
  }
  
  const weekRange = fmtWeekRange(days);
  
  // Build day cards
  const dayCards = days.map(d=>buildDayCard(d, days, fmtDate(d)===todayStr, fmtDate(d)===m4gSelectedDay)).join('');
  
  // Build detail
  const detailHTML = buildDetailPanel(m4gSelectedDay, days);
  
  const panel = document.createElement('div');
  panel.id = 'm4g-panel';
  panel.innerHTML = `
    <div class="m4g-header">
      <div>
        <h2>🛡️ Guardias Semanales</h2>
        <p>Actividades desde las 15:00 hs</p>
      </div>
      <div class="m4g-header-btns">
        <button class="m4g-view-btn active">Vista semana</button>
        <button class="m4g-view-btn" onclick="buildGuardia()">🔄</button>
      </div>
    </div>
    <div class="m4g-weeknav">
      <button onclick="m4gWeekOffset--;buildGuardia()">← Ant</button>
      <div class="m4g-weekrange">${weekRange}</div>
      <button onclick="m4gWeekOffset++;buildGuardia()">Sig →</button>
      <button class="m4g-today-btn" onclick="m4gWeekOffset=0;m4gSelectedDay=null;buildGuardia()">Hoy</button>
    </div>
    <div class="m4g-days" id="m4g-days-grid">
      ${dayCards}
    </div>
    <div id="m4g-detail-wrap">
      ${detailHTML}
    </div>
  `;
  
  // Insert at top of guard panel
  gp.insertBefore(panel, gp.firstChild);
  
  // Global select day function
  window.m4gSelectDay = function(dateStr){
    m4gSelectedDay = dateStr;
    // Update active state on cards
    document.querySelectorAll('.m4g-day').forEach(c=>{
      c.classList.toggle('m4g-day-active', c.dataset.date===dateStr);
    });
    // Re-render detail
    const wrap = document.querySelector('#m4g-detail-wrap');
    if(wrap) wrap.innerHTML = buildDetailPanel(dateStr, days);
  };
}

/* ============ INIT ============ */
function init(){
  inyectarCSS();
  parchearNav();
  checkTablero();
  ocultarRealizada();
  
  // Build guard panel if on guardias tab
  if(document.querySelector('#p-guardias[style*="block"]') || 
     getComputedStyle(document.querySelector('#p-guardias')||document.body).display==='block'){
    buildGuardia();
  }
  
  // Watch for tab changes to rebuild guard panel when switched to
  const obs = new MutationObserver(()=>{
    const gp = document.querySelector('#p-guardias');
    if(gp && getComputedStyle(gp).display!=='none'){
      if(!document.querySelector('#m4g-panel')){
        buildGuardia();
      }
    }
    checkTablero();
    ocultarRealizada();
  });
  
  const main = document.querySelector('#main,main,.main-content,[id*=main]');
  if(main) obs.observe(main, {childList:true, subtree:false, attributes:true, attributeFilter:['style','class']});
  
  // Also watch all panel elements
  document.querySelectorAll('[id^="p-"]').forEach(el=>{
    obs.observe(el, {attributes:true, attributeFilter:['style','class']});
  });
  
  // Periodic check (15 times)
  let n=0;
  const iv=setInterval(()=>{
    checkTablero();
    ocultarRealizada();
    const gp=document.querySelector('#p-guardias');
    if(gp && getComputedStyle(gp).display!=='none' && !document.querySelector('#m4g-panel')){
      buildGuardia();
    }
    if(++n>=15) clearInterval(iv);
  },400);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
} else {
  init();
}

})();
