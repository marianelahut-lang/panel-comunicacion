const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const agentes = ['Marianela','Maiten','Lina','Debora','Guada','Yesi','Sofia','Santiago'];

const rutas = [
  ['hoy','☀️ Hoy','Resumen operativo diario'],
  ['tablero','📋 Tablero','Tareas por estado'],
  ['material','📦 Material / Agenda','Contenidos listos y programados'],
  ['calendario','🗓️ Calendario','Eventos sincronizados'],
  ['guardias','⏰ Guardias','Semana y coberturas'],
  ['equipo','👥 Equipo','Agentes y carga de trabajo'],
  ['medios','📰 Medios','Contactos y gacetillas'],
  ['entrevistas','🤝 Entrevistas','Funcionarios y entrevistas'],
  ['recursos','🔗 Recursos','Links útiles']
];

let rutaActual = 'hoy';
let usuarioActual = '';

function cargarAgentes(){
  const select = $('#loginUser');
  if(!select) return;
  select.innerHTML = '<option value="">Seleccioná agente</option>' + agentes.map(nombre => `<option value="${nombre}">${nombre}</option>`).join('');
}

function construirNav(){
  const nav = $('#nav');
  if(!nav) return;
  nav.innerHTML = rutas.map(([id,label]) => `<button class="nav-btn ${id === rutaActual ? 'on' : ''}" data-ruta="${id}">${label}</button>`).join('');
  $$('.nav-btn', nav).forEach(btn => {
    btn.onclick = () => {
      rutaActual = btn.dataset.ruta;
      construirNav();
      render();
    };
  });
}

function login(){
  const user = $('#loginUser')?.value || '';
  const pass = $('#loginPass')?.value || '';
  const msg = $('#loginMsg');
  if(!user){ if(msg) msg.textContent = 'Seleccioná un agente'; return; }
  if(pass !== 'prensa2026'){ if(msg) msg.textContent = 'Contraseña incorrecta'; return; }
  usuarioActual = user;
  $('#login')?.classList.add('hidden');
  $('#app')?.classList.remove('hidden');
  const badge = $('#liveBadge');
  if(badge) badge.textContent = 'V2 base activa';
  construirNav();
  render();
}

function logout(){
  $('#app')?.classList.add('hidden');
  $('#login')?.classList.remove('hidden');
}

function render(){
  const ruta = rutas.find(r => r[0] === rutaActual) || rutas[0];
  const title = $('#pageTitle');
  const sub = $('#pageSub');
  if(title) title.textContent = ruta[1].replace(/^[^ ]+ /,'');
  if(sub) sub.textContent = ruta[2];
  const view = $('#view');
  if(!view) return;
  const vistas = {hoy, tablero, material, calendario, guardias, equipo, medios, entrevistas, recursos};
  view.innerHTML = (vistas[rutaActual] || hoy)();
}

function hoy(){
  const fecha = new Date().toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  return `<section class="hero"><p>Buenos días, ${usuarioActual}</p><h2>${fecha}</h2><div class="stat-row"><div class="stat"><b>—</b><span>Pendientes</span></div><div class="stat"><b>—</b><span>Mayor demora</span></div><div class="stat"><b>—</b><span>Agenda</span></div><div class="stat"><b>—</b><span>Guardia</span></div></div></section><div class="grid two" style="margin-top:16px"><section class="card"><h3>🗓️ Eventos de hoy</h3><div class="empty">Acá van a aparecer los eventos del calendario con botón Cubrir / Se cubre.</div></section><section class="card"><h3>⏰ Guardia del día</h3><div class="empty">Acá van a aparecer titular y soporte del día.</div></section></div><section class="card" style="margin-top:16px"><h3>🔥 10 actividades pendientes con mayor demora</h3><div class="empty">Acá van a aparecer las 10 actividades más antiguas, solo pendientes.</div></section>`;
}

function tablero(){
  const cols = ['Pendiente','En proceso','Lista','Lista para publicar'];
  return `<div class="toolbar"><div class="left"><input placeholder="Buscar tarea, etiqueta o responsable"></div><div class="right"><button class="primary">+ Nueva tarea</button></div></div><section class="kanban">${cols.map(c => `<div class="col"><h3>${c}<span class="pill">0</span></h3><div class="empty">Sin datos conectados todavía.</div></div>`).join('')}</section>`;
}
function material(){ return `<section class="card"><h3>📦 Material / Agenda</h3><div class="empty">Acá se va a unir Material disponible con Agenda de publicaciones.</div></section>`; }
function calendario(){ return `<section class="card"><h3>🗓️ Calendario</h3><div class="empty">Acá se van a mostrar eventos sincronizados, legibles, con vista día / mes.</div></section>`; }
function guardias(){ return `<section class="card"><h3>⏰ Guardias</h3><div class="empty">Acá se va a mostrar la semana completa, titular, soporte y WhatsApp.</div></section>`; }
function equipo(){ return `<section class="grid three">${agentes.map(a => `<article class="card"><h3>${a}</h3><p class="muted">Agente de comunicación</p><p><b>—</b> tareas asignadas</p><button class="ghost">Editar datos</button><button class="primary">WhatsApp tareas</button></article>`).join('')}</section>`; }
function medios(){ return `<section class="card"><h3>📰 Medios</h3><div class="empty">Acá se cargarán contactos y gacetillas masivas.</div></section>`; }
function entrevistas(){ return `<section class="card"><h3>🤝 Entrevistas</h3><div class="empty">Acá se mostrarán entrevistas pactadas y avisos a funcionarios.</div></section>`; }
function recursos(){ return `<section class="card"><h3>🔗 Recursos</h3><div class="empty">Acá se cargarán links editables de uso del equipo.</div></section>`; }

function init(){
  cargarAgentes();
  $('#loginBtn')?.addEventListener('click', login);
  $('#logoutBtn')?.addEventListener('click', logout);
  $('#refreshBtn')?.addEventListener('click', render);
  construirNav();
  render();
}

init();
console.log('Panel V2 base navegable cargado');
