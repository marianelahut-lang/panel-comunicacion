// === PANEL MEJORAS COMPLETO v3.0 â Municipalidad de Tres Arroyos ===
// Este archivo hace TODOS los cambios automÃ¡ticamente al cargarse.
// Solo requiere: <script src="mejoras.js"></script> en index.html
(function(){
'use strict';

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   1. CSS â Todos los estilos mejorados
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
var CSS=`
.sbi{padding:8px 14px!important;font-size:12px!important;gap:9px!important;border-radius:8px!important;margin:1px 6px!important;transition:background .12s,color .12s!important}
.sbi svg{width:15px!important;height:15px!important;flex-shrink:0!important}
.sbi.on{border-radius:8px!important}
.sb-sec{padding:10px 16px 3px!important;font-size:9px!important;font-weight:700!important;letter-spacing:.12em!important}
.pv-wrap{display:flex;gap:6px;align-items:center;padding:8px 0 2px}
.pv-btn{padding:5px 14px;border:0.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;transition:all .15s;background:#fff;color:#374151;font-family:Inter,sans-serif}
.pv-btn.on{background:#6d28d9!important;color:#fff!important;border-color:#6d28d9!important}
.rec-tab{padding:7px 14px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;font-size:12px;font-weight:500;color:#6b7280;font-family:Inter,sans-serif}
.rec-tab.on{color:#6d28d9;border-bottom-color:#6d28d9}
.rec-card{background:#fff;border:0.5px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:8px}
.rec-inp{width:100%;padding:7px 10px;border:0.5px solid #d1d5db;border-radius:7px;font-size:13px;font-family:Inter,sans-serif;outline:none;box-sizing:border-box;background:#fff;color:#111827}
.rec-lbl{display:block;font-size:10px;font-weight:500;color:#6b7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em}
// === PATCHES v4 ===
function _patchAll(){
// 1. Hide Tareas del dia button in agent panel
var btnTd=document.querySelector('[onclick*="abrirTareasDiarias"]');
if(btnTd)btnTd.style.display='none';
// 2. Remove Realizadas column from tablero (hide col-header + col items)
document.querySelectorAll('[data-estado="Realizada"],[id*="col-realizada"],.kcol').forEach(function(el){
var lbl=el.querySelector('.kcol-h span,span,.kcol-title');
if(lbl&&lbl.textContent.trim()==='Realizada')el.style.display='none';
});
// 3. Fix WhatsApp in agent panel to send pending+en-proceso tasks
if(typeof window.agCambiarEstado!=='undefined'){
var waBtn=document.querySelector('#p-agente button[onclick*="tdEnviarWA"],#p-agente .btn-pri');
}
}
setTimeout(function(){_patchAll();},1200);
if(document.readyState==='loading').rec-wa{background:#25d366;color:#fff;width:100%;padding:10px;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:7px}
.rec-wa:disabled{background:#d1d5db;cursor:not-allowed}
.rec-sm{padding:4px 7px;border:0.5px solid #e5e7eb;border-radius:5px;background:transparent;cursor:pointer;font-size:11px}
.rec-av{width:32px;height:32px;border-radius:50%;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:#6d28d9;flex-shrink:0}
body.dark .rec-card{background:#252830;border-color:#373b47}
body.dark .rec-inp{background:#1e2028;border-color:#373b47;color:#e2e8f0}
body.dark .rec-lbl{color:#8892a4}
body.dark .rec-tab{color:#8892a4}
body.dark .rec-tab.on{color:#a78bfa;border-bottom-color:#a78bfa}
body.dark .pv-btn{background:#252830!important;color:#8892a4!important;border-color:#373b47!important}
body.dark .pv-btn.on{background:#6d28d9!important;color:#fff!important;border-color:#6d28d9!important}
body.dark .rec-av{background:#2d2d5e;color:#a78bfa}
body.dark .rec-sm{border-color:#373b47;color:#8892a4}
.ptitle{font-size:15px!important;font-weight:600!important}#p-agente .ntab{color:rgba(55,65,81,.7)!important;background:transparent!important}#p-agente .ntab:hover{color:#374151!important;background:rgba(55,65,81,.08)!important}#p-agente .ntab.on{background:rgba(102,126,234,.12)!important;color:#667eea!important}body.dark #p-agente .ntab{color:rgba(148,163,184,.9)!important}body.dark #p-agente .ntab.on{color:#a78bfa!important;background:rgba(167,139,250,.15)!important}#fp-dw{display:none!important}#p-agente .ntab{color:rgba(55,65,81,.7)!important;background:transparent!important}#p-agente .ntab:hover{color:#374151!important;background:rgba(55,65,81,.08)!important}#p-agente .ntab.on{background:rgba(102,126,234,.12)!important;color:#667eea!important}#p-agente .ntab{color:rgba(55,65,81,.7)!important;background:transparent!important}
.content{animation:pvFade .15s ease}
@keyframes pvFade{from{opacity:.85}to{opacity:1}}
`;

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   2. DATOS RECLAMOS
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
var REC_F=[{id:1,nombre:"Carolina Turismo",tel:"5492983449098"},{id:2,nombre:"Eliana Rossi",tel:"5492983505668"},{id:3,nombre:"Emiliano Capandegui",tel:"5492983602937"},{id:4,nombre:"Bernardina Varese",tel:"5492983584387"},{id:5,nombre:"Damian Almeira",tel:"5492983650085"},{id:6,nombre:"Facundo Liebana",tel:"5492983382366"},{id:7,nombre:"Gabriel Francia",tel:"5492983385858"},{id:8,nombre:"Juan Apolonio",tel:"5492983409217"},{id:9,nombre:"Juan Serna Corp",tel:"5491154842469"},{id:10,nombre:"Julian Tornini",tel:"5492983305218"},{id:11,nombre:"Kevin Monrroy",tel:"5492983406170"},{id:12,nombre:"Martin Garate",tel:"5492983413996"},{id:13,nombre:"Mauro Daddario",tel:"5492983446264"},{id:14,nombre:"Mercedes Moreno",tel:"5492983447789"},{id:15,nombre:"Ignacio Quintas",tel:"5492983615881"},{id:16,nombre:"Nicolas Franganillo",tel:"5492983412126"},{id:17,nombre:"Pity Federico",tel:"5492983570209"},{id:18,nombre:"Tomas Paniga",tel:"5492983447249"},{id:19,nombre:"Valeria Guido",tel:"5491166920622"}];
var REC_T=[{id:1,nombre:"Agua"},{id:2,nombre:"Asfalto"},{id:3,nombre:"Cano Roto"},{id:4,nombre:"Perdida de Agua"},{id:5,nombre:"Calles de tierra"},{id:6,nombre:"Basura en la calle"},{id:7,nombre:"Terreno en malas condiciones"},{id:8,nombre:"Inundados"},{id:9,nombre:"Pastos Crecidos"},{id:10,nombre:"Otros"}];

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   3. ESTADO RECLAMOS
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
var recFuncs=[],recTipos=[],recReclamos=[],recTab='nuevo',recATab='funcionarios';
var recForm={tipo:'',dir:'',desc:'',urg:'Media',vecino:'',telV:'',fid:''},recEditF=null,recEditT=null;

function initReclamos(){
  try{
    recFuncs=JSON.parse(localStorage.getItem('rec-funcs')||'null')||JSON.parse(JSON.stringify(REC_F));
    recTipos=JSON.parse(localStorage.getItem('rec-tipos')||'null')||JSON.parse(JSON.stringify(REC_T));
    recReclamos=JSON.parse(localStorage.getItem('rec-reclamos')||'[]');
  }catch(e){recFuncs=JSON.parse(JSON.stringify(REC_F));recTipos=JSON.parse(JSON.stringify(REC_T));recReclamos=[];}
}
function loadReclamos(){if(!recFuncs.length)initReclamos();recTab='nuevo';recForm={tipo:'',dir:'',desc:'',urg:'Media',vecino:'',telV:'',fid:''};recEditF=null;recEditT=null;recUpdateBadge();recUpdateStats();setRecTab('nuevo');}
function recUpdateBadge(){var b=document.getElementById('sbr');if(b)b.textContent=recReclamos.length||'';}
function recUpdateStats(){var sub=document.getElementById('rec-subtitle');if(sub)sub.textContent=recReclamos.length+' reclamos - '+recFuncs.length+' funcionarios';var st=document.getElementById('rec-stats');if(!st)return;var a=recReclamos.filter(function(r){return r.urg==='Alta';}).length,m=recReclamos.filter(function(r){return r.urg==='Media';}).length,bj=recReclamos.filter(function(r){return r.urg==='Baja';}).length;st.innerHTML='<div style="text-align:center;padding:5px 10px;background:#fef2f2;border-radius:8px"><div style="font-size:18px;font-weight:500;color:#dc2626">'+a+'</div><div style="font-size:9px;color:#dc2626;font-weight:600">ALTA</div></div><div style="text-align:center;padding:5px 10px;background:#fffbeb;border-radius:8px"><div style="font-size:18px;font-weight:500;color:#d97706">'+m+'</div><div style="font-size:9px;color:#d97706;font-weight:600">MEDIA</div></div><div style="text-align:center;padding:5px 10px;background:#f0fdf4;border-radius:8px"><div style="font-size:18px;font-weight:500;color:#16a34a">'+bj+'</div><div style="font-size:9px;color:#16a34a;font-weight:600">BAJA</div></div>';}
function setRecTab(t){recTab=t;document.querySelectorAll('.rec-tab').forEach(function(b){b.classList.remove('on');});var btn=document.getElementById('rec-tab-'+t);if(btn)btn.classList.add('on');recRender();}
function setRecATab(t){recATab=t;recEditF=null;recEditT=null;recRender();}
function recUC(u){if(u==='Alta')return{c:'#dc2626',bg:'#fef2f2',br:'#fecaca'};if(u==='Baja')return{c:'#16a34a',bg:'#f0fdf4',br:'#bbf7d0'};return{c:'#d97706',bg:'#fffbeb',br:'#fde68a'};}
function recRender(){var el=document.getElementById('rec-content');if(!el)return;if(recTab==='nuevo')el.innerHTML=recNuevoHTML();else if(recTab==='historial')el.innerHTML=recHistorialHTML();else el.innerHTML=recAdminHTML();}
function recFobj(id){return recFuncs.find(function(f){return f.id==id;});}
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function recNuevoHTML(){var f=recForm,fo=recFobj(f.fid);var tOpts=recTipos.map(function(t){return '<option value="'+escH(t.nombre)+'"'+(f.tipo===t.nombre?' selected':'')+'>'+escH(t.nombre)+'</option>';}).join('');var fOpts=recFuncs.map(function(x){return '<option value="'+x.id+'"'+(f.fid==x.id?' selected':'')+'>'+escH(x.nombre)+'</option>';}).join('');var urgBtns=['Alta','Media','Baja'].map(function(u){var c=recUC(u),s=f.urg===u;return '<button onclick="recSetUrg(\''+u+'\');" style="flex:1;padding:7px 4px;border:1.5px solid '+(s?c.c:'#e5e7eb')+';border-radius:8px;background:'+(s?c.bg:'transparent')+';color:'+(s?c.c:'#6b7280')+';cursor:pointer;font-size:12px;font-weight:'+(s?'500':'400')+'">'+u+'</button>';}).join('');var fPrev=fo?'<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:#f9fafb;border-radius:8px;margin-bottom:12px;border:0.5px solid #e5e7eb"><div class="rec-av">'+escH(fo.nombre.charAt(0))+'</div><div><div style="font-size:13px;font-weight:500">'+escH(fo.nombre)+'</div><div style="font-size:11px;color:#16a34a">Cel: '+fo.tel+'</div></div></div>':'';var ok=!!(f.tipo&&f.fid&&f.desc);return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="rec-card"><p style="font-size:12px;font-weight:500;color:#6d28d9;margin:0 0 14px">DATOS DEL RECLAMO</p><div style="margin-bottom:10px"><label class="rec-lbl">Tipo *</label><select class="rec-inp" onchange="recSF('+\'tipo\'+',this.value)"><option value="">Seleccionar...</option>'+tOpts+'</select></div><div style="margin-bottom:10px"><label class="rec-lbl">Direccion</label><input class="rec-inp" placeholder="Ej: Calle 9 de Julio 450" value="'+escH(f.dir)+'" oninput="recSF('+\'dir\'+',this.value)"></div><div style="margin-bottom:10px"><label class="rec-lbl">Descripcion *</label><textarea class="rec-inp" style="height:72px;resize:vertical" oninput="recSF('+\'desc\'+',this.value)">'+escH(f.desc)+'</textarea></div><div><label class="rec-lbl">Urgencia</label><div style="display:flex;gap:6px">'+urgBtns+'</div></div></div><div><div class="rec-card" style="margin-bottom:10px"><p style="font-size:12px;font-weight:500;color:#6d28d9;margin:0 0 12px">DATOS DEL VECINO</p><div style="margin-bottom:10px"><label class="rec-lbl">Nombre</label><input class="rec-inp" placeholder="Nombre completo" value="'+escH(f.vecino)+'" oninput="recSF('+\'vecino\'+',this.value)"></div><div><label class="rec-lbl">Telefono</label><input class="rec-inp" placeholder="2983 123456" value="'+escH(f.telV)+'" oninput="recSF('+\'telV\'+',this.value)"></div></div><div class="rec-card"><p style="font-size:12px;font-weight:500;color:#6d28d9;margin:0 0 12px">FUNCIONARIO *</p><div style="margin-bottom:10px"><select class="rec-inp" onchange="recSF('+\'fid\'+',this.value)"><option value="">Seleccionar funcionario...</option>'+fOpts+'</select></div>'+fPrev+'<button onclick="recEnviar()" '+(ok?'':'disabled ')+'class="rec-wa" style="'+(ok?'':'background:#d1d5db;cursor:not-allowed')+'">Guardar y enviar por WhatsApp</button></div></div></div>';}
function recHistorialHTML(){if(!recReclamos.length)return '<div style="text-align:center;padding:3rem;color:#9ca3af"><p style="font-size:14px">No hay reclamos registrados</p></div>';return recReclamos.map(function(r){var c=recUC(r.urg);return '<div class="rec-card" style="display:flex;gap:12px"><div style="width:4px;border-radius:4px;background:'+c.c+';flex-shrink:0;align-self:stretch"></div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap"><span style="font-size:14px;font-weight:500">'+escH(r.tipo)+'</span><span style="font-size:10px;padding:2px 8px;border-radius:12px;background:'+c.bg+';color:'+c.c+';font-weight:500;border:0.5px solid '+c.br+'">'+r.urg+'</span><span style="font-size:11px;color:#9ca3af;margin-left:auto">'+r.fecha+' '+r.hora+'</span></div><p style="font-size:13px;color:#6b7280;margin:0 0 3px;line-height:1.4">'+escH(r.desc)+'</p>'+(r.dir?'<p style="font-size:11px;color:#9ca3af;margin:0 0 3px">Dir: '+escH(r.dir)+'</p>':'')+(r.vecino?'<p style="font-size:11px;color:#9ca3af;margin:0 0 3px">Vecino: '+escH(r.vecino)+(r.telV?' - '+r.telV:'')+'</p>':'')+'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:0.5px solid #f3f4f6"><span style="font-size:12px;color:#6b7280">'+escH(r.fNombre||'')+'</span><div style="display:flex;gap:5px"><button onclick="recRenviar('+r.id+')" class="rec-sm" style="color:#16a34a;border-color:#bbf7d0">Reenviar WA</button><button onclick="recBorrar('+r.id+')" class="rec-sm" style="color:#dc2626;border-color:#fecaca">Borrar</button></div></div></div></div>';}).join('');}
function recAdminHTML(){var at=recATab;var sub='<div style="display:flex;gap:0;border-bottom:0.5px solid #e5e7eb;margin-bottom:14px"><button onclick="setRecATab('+\'funcionarios\'+')" class="rec-tab'+(at==='funcionarios'?' on':'')+'" >Funcionarios ('+recFuncs.length+')</button><button onclick="setRecATab('+\'tipos\'+')" class="rec-tab'+(at==='tipos'?' on':'')+'" >Tipos de reclamo ('+recTipos.length+')</button></div>';if(at==='funcionarios'){var ef=recEditF;var form='<div class="rec-card" style="background:#f9fafb;margin-bottom:14px"><p style="font-size:12px;font-weight:500;margin:0 0 10px">'+(ef?'Editar funcionario':'Agregar funcionario')+'</p><div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end"><div><label class="rec-lbl">Nombre</label><input class="rec-inp" id="rec-fn" placeholder="Nombre completo" value="'+(ef?escH(ef.nombre):'')+'"></div><div><label class="rec-lbl">WhatsApp sin +</label><input class="rec-inp" id="rec-ft" placeholder="5492983XXXXXX" value="'+(ef?ef.tel:'')+'"></div><div style="display:flex;gap:4px"><button onclick="recSaveF()" class="rec-prim">'+(ef?'Guardar':'Agregar')+'</button>'+(ef?'<button onclick="recCancelF()" style="padding:7px 10px;background:#f3f4f6;color:#374151;border:none;border-radius:7px;cursor:pointer">X</button>':'')+'</div></div></div>';var list='<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'+recFuncs.map(function(f){return '<div class="rec-card" style="display:flex;align-items:center;gap:10px;margin-bottom:0"><div class="rec-av">'+f.nombre.charAt(0)+'</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+escH(f.nombre)+'</div><div style="font-size:11px;color:#16a34a">'+f.tel+'</div></div><div style="display:flex;gap:3px"><button onclick="recEditFn('+f.id+')" class="rec-sm">Editar</button><button onclick="recDelF('+f.id+')" class="rec-sm" style="color:#dc2626;border-color:#fecaca">Borrar</button></div></div>';}).join('')+'</div>';return sub+form+list;}else{var et=recEditT;var tform='<div class="rec-card" style="background:#f9fafb;margin-bottom:14px"><p style="font-size:12px;font-weight:500;margin:0 0 10px">'+(et?'Editar tipo':'Agregar tipo de reclamo')+'</p><div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end"><div><label class="rec-lbl">Nombre</label><input class="rec-inp" id="rec-tn" placeholder="Ej: Luminaria apagada" value="'+(et?escH(et.nombre):'')+'"></div><div style="display:flex;gap:4px"><button onclick="recSaveT()" class="rec-prim">'+(et?'Guardar':'Agregar')+'</button>'+(et?'<button onclick="recCancelT()" style="padding:7px 10px;background:#f3f4f6;color:#374151;border:none;border-radius:7px;cursor:pointer">X</button>':'')+'</div></div></div>';var tlist='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">'+recTipos.map(function(t){return '<div class="rec-card" style="display:flex;align-items:center;gap:8px;margin-bottom:0"><span style="font-size:13px;font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escH(t.nombre)+'</span><div style="display:flex;gap:3px"><button onclick="recEditTp('+t.id+')" class="rec-sm">Editar</button><button onclick="recDelT('+t.id+')" class="rec-sm" style="color:#dc2626;border-color:#fecaca">Borrar</button></div></div>';}).join('')+'</div>';return sub+tform+tlist;}}
function recSF(k,v){recForm[k]=v;recRender();}
function recSetUrg(u){recForm.urg=u;recRender();}
function recEnviar(){var f=recForm,fo=recFobj(f.fid);if(!f.tipo||!f.fid||!f.desc||!fo)return;var r={id:Date.now(),tipo:f.tipo,dir:f.dir,desc:f.desc,urg:f.urg,vecino:f.vecino,telV:f.telV,fNombre:fo.nombre,fTel:fo.tel,fecha:new Date().toLocaleDateString('es-AR'),hora:new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})};recReclamos.unshift(r);localStorage.setItem('rec-reclamos',JSON.stringify(recReclamos));recAbrirWA(r);recForm={tipo:'',dir:'',desc:'',urg:'Media',vecino:'',telV:'',fid:''};recUpdateBadge();recUpdateStats();recRender();}
function recRenviar(id){var r=recReclamos.find(function(x){return x.id===id;});if(r)recAbrirWA(r);}
function recAbrirWA(r){var msg=encodeURIComponent('RECLAMO MUNICIPAL\nMunicipalidad de Tres Arroyos\n\nTipo: '+r.tipo+'\nDireccion: '+(r.dir||'No especificada')+'\nDescripcion: '+r.desc+'\nUrgencia: '+r.urg+'\n'+(r.vecino?'Vecino: '+r.vecino+'\n':'')+(r.telV?'Tel: '+r.telV+'\n':'')+'Fecha: '+r.fecha+' '+r.hora+'\n\nDireccion de Comunicacion - Municipalidad de Tres Arroyos');window.open('https://wa.me/'+r.fTel+'?text='+msg,'_blank');}
function recBorrar(id){recReclamos=recReclamos.filter(function(x){return x.id!==id;});localStorage.setItem('rec-reclamos',JSON.stringify(recReclamos));recUpdateBadge();recUpdateStats();recRender();}
function recSaveF(){var n=((document.getElementById('rec-fn')||{}).value||'').trim(),t=((document.getElementById('rec-ft')||{}).value||'').trim();if(!n||!t)return;if(recEditF){recFuncs=recFuncs.map(function(f){return f.id===recEditF.id?Object.assign({},f,{nombre:n,tel:t}):f;});recEditF=null;}else{recFuncs.push({id:Date.now(),nombre:n,tel:t});}localStorage.setItem('rec-funcs',JSON.stringify(recFuncs));recRender();}
function recCancelF(){recEditF=null;recRender();}
function recEditFn(id){recEditF=Object.assign({},recFuncs.find(function(f){return f.id===id;}));recRender();setTimeout(function(){var n=document.getElementById('rec-fn'),t=document.getElementById('rec-ft');if(n)n.value=recEditF.nombre;if(t)t.value=recEditF.tel;},50);}
function recDelF(id){recFuncs=recFuncs.filter(function(f){return f.id!==id;});localStorage.setItem('rec-funcs',JSON.stringify(recFuncs));recRender();}
function recSaveT(){var n=((document.getElementById('rec-tn')||{}).value||'').trim();if(!n)return;if(recEditT){recTipos=recTipos.map(function(t){return t.id===recEditT.id?Object.assign({},t,{nombre:n}):t;});recEditT=null;}else{recTipos.push({id:Date.now(),nombre:n});}localStorage.setItem('rec-tipos',JSON.stringify(recTipos));recRender();}
function recCancelT(){recEditT=null;recRender();}
function recEditTp(id){recEditT=Object.assign({},recTipos.find(function(t){return t.id===id;}));recRender();setTimeout(function(){var n=document.getElementById('rec-tn');if(n)n.value=recEditT.nombre;},50);}
function recDelT(id){recTipos=recTipos.filter(function(t){return t.id!==id;});localStorage.setItem('rec-tipos',JSON.stringify(recTipos));recRender();}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   4. PUBLICACIONES TOGGLE HOY/SEMANA
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
var _pvista=localStorage.getItem('pvista')||'hoy';
window.setPubVista=function(v){_pvista=v;localStorage.setItem('pvista',v);_applyPV();_updatePVBtns();};
function _applyPV(){var p=document.getElementById('p-publicaciones');if(!p)return;var desk=p.querySelector('.gw-desktop');var mob=p.querySelector('.gw-mobile');if(_pvista==='hoy'){if(desk)desk.style.display='none';if(mob)mob.style.cssText='display:flex!important;flex:1;flex-direction:column;overflow:hidden';if(typeof pubDayOff!=='undefined')pubDayOff=0;if(typeof renderPubDay==='function')setTimeout(renderPubDay,0);}else{if(desk)desk.style.display='';if(mob)mob.style.cssText='';if(typeof renderWeek==='function')setTimeout(renderWeek,0);}}
function _updatePVBtns(){['hoy','sem'].forEach(function(v){var b=document.getElementById('pvb-'+v);if(b){b.className='pv-btn'+((v==='hoy'&&_pvista==='hoy')||(v==='sem'&&_pvista==='semana')?' on':'');}});}
function insertTogglePub(){var p=document.getElementById('p-publicaciones');if(!p||document.getElementById('pvb-hoy'))return;var ptop=p.querySelector('.ptop');if(!ptop)return;var w=document.createElement('div');w.className='pv-wrap';w.innerHTML='<span style="font-size:11px;color:#6b7280;font-weight:500;letter-spacing:.04em">VISTA:</span><button id="pvb-hoy" class="pv-btn'+(_pvista==='hoy'?' on':'')+'" onclick="setPubVista(\'hoy\')">Hoy</button><button id="pvb-sem" class="pv-btn'+(_pvista==='semana'?' on':'')+'" onclick="setPubVista(\'semana\')">Semana</button>';ptop.appendChild(w);}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   5. OCULTAR MÃTRICAS
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function ocultarMetricas(){
  document.querySelectorAll('.sbi,.ntab,[class*="tab"]').forEach(function(b){
    var t=b.textContent||'';
    var oc=b.getAttribute('onclick')||'';
    if((t.includes('trica')||oc.includes('metrica'))&&!b.dataset.metHidden){
      b.style.display='none';b.dataset.metHidden='1';
    }
  });
  document.querySelectorAll('[id*="metricas"],[id*="Metricas"]').forEach(function(el){el.style.display='none';});
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   6. INYECTAR PANEL RECLAMOS EN DOM
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function inyectarPanelReclamos(){
  if(document.getElementById('p-reclamos'))return;
  var panel=document.createElement('div');
  panel.id='p-reclamos';
  panel.className='content';
  panel.style.cssText='display:none;flex-direction:column;height:100%;overflow:hidden';
  panel.innerHTML='<div class="ptop" style="flex-shrink:0;padding:10px 16px;border-bottom:1px solid #e5e7eb"><div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px"><div><div class="ptitle">Reclamos municipales</div><div class="psub" id="rec-subtitle">Cargando...</div></div><div id="rec-stats" style="display:flex;gap:8px"></div></div><div style="display:flex;gap:0;border-bottom:0.5px solid #e5e7eb;margin-top:10px"><button class="rec-tab on" id="rec-tab-nuevo" onclick="setRecTab(\'nuevo\')">+ Nuevo reclamo</button><button class="rec-tab" id="rec-tab-historial" onclick="setRecTab(\'historial\')">Historial</button><button class="rec-tab" id="rec-tab-admin" onclick="setRecTab(\'admin\')">Administrar</button></div></div><div id="rec-content" style="flex:1;overflow-y:auto;padding:16px"></div>';
  // Add to the same container as other panels
  var existing=document.querySelector('.content');
  if(existing&&existing.parentNode){existing.parentNode.appendChild(panel);}
  else{document.body.appendChild(panel);}
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   7. INYECTAR BOTÃN SIDEBAR RECLAMOS
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function inyectarBtnReclamos(){
  if(document.getElementById('sbi-reclamos'))return;
  // Find Publicaciones sidebar button
  var pubBtn=null;
  document.querySelectorAll('.sbi').forEach(function(b){
    var oc=b.getAttribute('onclick')||'';
    if(oc.includes("'publicaciones'"))pubBtn=b;
  });
  if(!pubBtn){
    // Try by text
    document.querySelectorAll('.sbi').forEach(function(b){
      if(b.textContent.includes('Publicaciones'))pubBtn=b;
    });
  }
  var btn=document.createElement('button');
  btn.id='sbi-reclamos';
  btn.className='sbi';
  btn.setAttribute('onclick',"nav('reclamos',null,this);loadReclamos()");
  btn.innerHTML='<svg viewBox="0 0 24 24" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Reclamos<span class="sbadge hot" id="sbr" style="background:#ef4444;color:#fff;border-radius:10px;font-size:9px;padding:1px 5px;margin-left:auto"></span>';
  if(pubBtn&&pubBtn.parentNode){
    pubBtn.parentNode.insertBefore(btn,pubBtn.nextSibling);
  } else {
    // Fallback: find sidebar and append
    var sb=document.querySelector('.sb');
    if(sb)sb.appendChild(btn);
  }
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   8. PATCH NAV FUNCTION
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function patchNav(){
  if(window.__navMejorado||typeof window.nav!=='function')return;
  var _orig=window.nav;
  window.nav=function(page,data,btn){
    _orig.call(this,page,data,btn);
    setTimeout(function(){
      ocultarMetricas();
      if(page==='publicaciones'){insertTogglePub();_applyPV();}
      if(page==='reclamos'){if(!recFuncs.length)initReclamos();recUpdateBadge();recUpdateStats();setRecTab('nuevo');}
    },80);
  };
  window.__navMejorado=true;
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââ
   9. INIT
ââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function inyectarCSS(){if(document.getElementById('pm-css'))return;var s=document.createElement('style');s.id='pm-css';s.textContent=CSS;document.head.appendChild(s);}

function intentar(fn,veces,delay){veces=veces||1;try{fn();}catch(e){if(veces>1)setTimeout(function(){intentar(fn,veces-1,delay);},delay||100);}}

function init(){
  inyectarCSS();
  intentar(inyectarPanelReclamos,3,200);
  intentar(inyectarBtnReclamos,5,400);
  intentar(ocultarMetricas,3,200);
  intentar(patchNav,5,300);
  initReclamos();
  recUpdateBadge();
  // Check if publicaciones is active
  setTimeout(function(){
    var pPub=document.getElementById('p-publicaciones');
    if(pPub&&getComputedStyle(pPub).display!=='none'){insertTogglePub();_applyPV();}
  },600);
}

// Expose globals
window.loadReclamos=loadReclamos;
window.setRecTab=setRecTab;
window.setRecATab=setRecATab;
window.recSF=recSF;
window.recSetUrg=recSetUrg;
window.recEnviar=recEnviar;
window.recRenviar=recRenviar;
window.recBorrar=recBorrar;
window.recSaveF=recSaveF;
window.recCancelF=recCancelF;
window.recEditFn=recEditFn;
window.recDelF=recDelF;
window.recSaveT=recSaveT;
window.recCancelT=recCancelT;
window.recEditTp=recEditTp;
window.recDelT=recDelT;

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(init,500);});}
else{setTimeout(init,500);}
})();
