// === PANEL MEJORAS v4.0 - Municipalidad de Tres Arroyos ===
(function(){
"use strict";

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
.rec-sm{padding:4px 7px;border:0.5px solid #e5e7eb;border-radius:5px;background:transparent;cursor:pointer;font-size:11px}
.rec-av{width:32px;height:32px;border-radius:50%;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#6d28d9}
body.dark .rec-card{background:#252830;border-color:#373b47}
body.dark .rec-inp{background:#1e2028;border-color:#373b47;color:#e2e8f0}
body.dark .rec-lbl{color:#8892a4}
body.dark .rec-tab{color:#8892a4}
body.dark .rec-tab.on{color:#a78bfa;border-bottom-color:#a78bfa}
body.dark .pv-btn{background:#252830!important;color:#8892a4!important;border-color:#373b47!important}
.ptitle{font-size:15px!important;font-weight:600!important}
#p-agente .ntab{color:rgba(55,65,81,.7)!important;font-size:13px!important}
.kcol-card .estado-sel,.task-card .estado-sel{font-size:10px;padding:2px 6px;border-radius:5px;border:1px solid #d1d5db;cursor:pointer;background:#fff;color:#374151;font-family:Inter,sans-serif;margin-top:4px;display:block;width:100%}
body.dark .kcol-card .estado-sel{background:#252830;color:#e2e8f0;border-color:#373b47}
.agenda-wrap{padding:16px;height:calc(100% - 32px);overflow:auto;background:#f9fafb}
body.dark .agenda-wrap{background:#1a1d26}
.agenda-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px}
.agenda-title{font-size:18px;font-weight:700;color:#111827}
body.dark .agenda-title{color:#f1f5f9}
.agenda-view-btn{padding:5px 12px;border:0.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;background:#fff;color:#374151;transition:all .15s;font-family:Inter,sans-serif}
.agenda-view-btn.on{background:#6d28d9!important;color:#fff!important;border-color:#6d28d9!important}
body.dark .agenda-view-btn{background:#252830;color:#8892a4;border-color:#373b47}
.agenda-week{display:flex;gap:0;overflow-x:auto;min-height:400px}
.agenda-day-col{min-width:145px;flex:1;border-right:0.5px solid #e5e7eb;padding:0 8px 16px}
body.dark .agenda-day-col{border-color:#373b47}
.agenda-day-name{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding-bottom:6px;border-bottom:0.5px solid #e5e7eb;position:sticky;top:0;background:#f9fafb;z-index:1}
body.dark .agenda-day-name{color:#8892a4;border-color:#373b47;background:#1a1d26}
.agenda-day-hoy .agenda-day-name{color:#6d28d9!important;border-bottom-color:#6d28d9!important}
.agenda-item{background:#fff;border:0.5px solid #e5e7eb;border-radius:8px;padding:8px;margin-bottom:6px;cursor:pointer;transition:all .15s;position:relative}
.agenda-item:hover{border-color:#6d28d9;box-shadow:0 2px 8px rgba(109,40,217,.1)}
body.dark .agenda-item{background:#252830;border-color:#373b47}
.agenda-item-time{font-size:10px;font-weight:700;color:#6d28d9;margin-bottom:2px}
.agenda-item-text{font-size:12px;font-weight:500;color:#111827;line-height:1.4}
body.dark .agenda-item-text{color:#f1f5f9}
.agenda-item-red{font-size:10px;color:#6b7280;margin-top:2px}
.agenda-item-del{position:absolute;top:4px;right:4px;background:none;border:none;cursor:pointer;color:#9ca3af;font-size:14px;line-height:1;padding:2px 4px;border-radius:4px}
.agenda-item-del:hover{color:#ef4444;background:#fee2e2}
.agenda-new-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;background:#6d28d9;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.agenda-new-btn:hover{background:#5b21b6}
.agenda-empty{text-align:center;padding:24px 8px;color:#9ca3af;font-size:12px}
.agenda-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center}
.agenda-modal-box{background:#fff;border-radius:12px;padding:24px;width:420px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,.3)}
body.dark .agenda-modal-box{background:#252830}
.agenda-modal-title{font-size:16px;font-weight:700;margin-bottom:16px;color:#111827}
body.dark .agenda-modal-title{color:#f1f5f9}
.agenda-form-row{margin-bottom:12px}
.agenda-form-label{display:block;font-size:11px;font-weight:600;color:#6b7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em}
.agenda-form-input{width:100%;padding:8px 10px;border:0.5px solid #d1d5db;border-radius:7px;font-size:13px;font-family:Inter,sans-serif;outline:none;box-sizing:border-box;background:#fff;color:#111827}
body.dark .agenda-form-input{background:#1e2028;border-color:#373b47;color:#f1f5f9}
.agenda-form-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
.agenda-btn-cancel{padding:7px 16px;border:0.5px solid #e5e7eb;border-radius:7px;background:transparent;cursor:pointer;font-size:13px;font-family:Inter,sans-serif}
.agenda-btn-save{padding:7px 16px;background:#6d28d9;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;font-family:Inter,sans-serif}
`;

function inyectarCSS(){var st=document.getElementById("pm1-css");if(!st){st=document.createElement("style");st.id="pm1-css";document.head.appendChild(st);}st.textContent=CSS;}

function _patchAll(){
  var btnTd=document.querySelector("[onclick*=\"abrirTareasDiarias\"]");
  if(btnTd)btnTd.style.display="none";
  document.querySelectorAll("[data-estado=\"Realizada\"],[id*=col-realizada]").forEach(function(el){el.style.display="none";});
  document.querySelectorAll(".kcol,.kcol-col,[class*=kanban-col]").forEach(function(el){
    try{var lbl=el.querySelector(".kcol-h span,.kcol-title,.col-title");if(lbl&&lbl.textContent&&lbl.textContent.trim()==="Realizada")el.style.display="none";}catch(e){}
  });
  document.querySelectorAll(".sbi").forEach(function(b){
    try{var t=b.textContent||"";if(t.indexOf("erson")>-1||t.indexOf("Todas las")>-1)b.style.display="none";}catch(e){}
  });
  _hideNuevaTareaBtn();
  _fixAgenteBtns();
  _addEstadoSelectors();
}

function _hideNuevaTareaBtn(){
  document.querySelectorAll("[onclick*=nuevaTarea],[onclick*=\"nuevaTarea\"],.btn-nueva-tarea").forEach(function(el){
    if(!el.closest("#p-agente"))el.style.display="none";
  });
}

function _fixAgenteBtns(){
  var pAg=document.getElementById("p-agente");if(!pAg)return;
  var els=pAg.querySelectorAll("[onclick*=EnviarWA],[onclick*=WA],[onclick*=cerrar],[onclick*=Cerrar],[class*=btn-pri],[class*=btn-close]");
  els.forEach(function(b){b.style.cssText+="position:relative!important;top:auto!important;right:auto!important;z-index:1!important;margin:0 4px!important;display:inline-flex!important;";});
}

function _addEstadoSelectors(){
  if(!window.agCambiarEstado)return;
  document.querySelectorAll(".kcol-card,.tarea-card,.task-card").forEach(function(card){
    if(card.querySelector(".estado-sel"))return;
    var m=card.getAttribute("onclick")||"";
    var tArr=m.match(/\d+/);
    var tid=card.getAttribute("data-id")||card.getAttribute("data-tid")||(tArr?tArr[0]:null);
    if(!tid)return;
    var estado=card.getAttribute("data-estado")||"Pendiente";
    var sel=document.createElement("select");
    sel.className="estado-sel";
    [["Pendiente","Pendiente"],["En proceso","En proceso"],["Lista","Lista"]].forEach(function(o){
      var op=document.createElement("option");op.value=o[0];op.textContent=o[1];if(o[0]===estado)op.selected=true;sel.appendChild(op);
    });
    sel.addEventListener("change",function(e){
      e.stopPropagation();
      try{window.agCambiarEstado(String(tid),sel.value);}catch(err){}
      card.setAttribute("data-estado",sel.value);
    });
    card.appendChild(sel);
  });
}

/* === RECLAMOS === */
var recReclamos=[];var recForm={tipo:"",fid:null,desc:"",fo:"",urg:"",dir:"",u:""};
var recTab="nuevo";var recATab="t";
function initReclamos(){
  if(!recReclamos.length){
    try{var s=localStorage.getItem("recReclamos");if(s)recReclamos=JSON.parse(s);}catch(e){}
    recReclamos=recReclamos||[];
    recForm={tipo:"",fid:null,desc:"",fo:"",urg:"",dir:"",u:""};recTab="nuevo";
  }
  recRender();
}
function loadReclamos(){if(!recReclamos.length)initReclamos();recTab="nuevo";recForm={tipo:"",fid:null,desc:"",fo:"",urg:"",dir:"",u:""};recRender();}
function recUpdateBadge(){var b=document.getElementById("sbr");if(b)b.textContent=recReclamos.length||"";}
function recUpdateStats(){var sub=document.getElementById("rec-subtitle");if(sub)sub.textContent=recReclamos.length+" reclamos | "+recReclamos.filter(function(r){return r.estado==="Abierto";}).length+" abiertos";}
function setRecTab(t){recTab=t;document.querySelectorAll(".rec-tab").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-t")===t);});recRender();}
function setRecATab(t){recATab=t;recRender();}
function recUC(u){if(u==="Alta")return{c:"#dc2626",bg:"#fef2f2",br:"#fecaca"};if(u==="Baja")return{c:"#16a34a",bg:"#f0fdf4",br:"#bbf7d0"};return{c:"#d97706",bg:"#fffbeb",br:"#fde68a"};}
function recRender(){var el=document.getElementById("rec-content");if(!el)return;el.innerHTML=(recTab==="nuevo"?recNuevoHTML():recHistorialHTML());recUpdateStats();}
function recFobj(id){return recReclamos.find(function(f){return f.id==id;});}
function escH(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function recSF(k,v){recForm[k]=v;}
function recSetUrg(u){recForm.urg=u;recRender();}
function recEnviar(){
  var f=recForm;if(!f.tipo||!f.desc)return;
  var r={id:Date.now(),tipo:f.tipo,desc:f.desc,fo:f.fo||new Date().toLocaleDateString("es-AR"),urg:f.urg,dir:f.dir,u:f.u,estado:"Abierto",fecha:new Date().toLocaleDateString("es-AR")};
  recReclamos.push(r);
  try{localStorage.setItem("recReclamos",JSON.stringify(recReclamos));}catch(e){}
  recForm={tipo:"",fid:null,desc:"",fo:"",urg:"",dir:"",u:""};
  recTab="historial";recRender();recUpdateBadge();
}
function recRenviar(id){var r=recFobj(id);if(r)recAbrirWA(r);}
function recAbrirWA(r){var msg=encodeURIComponent("RECLAMO MUNICIPAL\nMunicipalidad de Tres Arroyos\n\nTipo: "+r.tipo+"\nDescripcion: "+r.desc+(r.dir?"\nDireccion: "+r.dir:"")+"\nUrgencia: "+(r.urg||"Normal"));window.open("https://wa.me/?text="+msg,"_blank");}
function recBorrar(id){recReclamos=recReclamos.filter(function(x){return x.id!==id;});try{localStorage.setItem("recReclamos",JSON.stringify(recReclamos));}catch(e){}recRender();recUpdateBadge();}
function recNuevoHTML(){
  var tipos=["Baches","Alumbrado","Residuos","Reclamo vecinal","Obra publica","Otro"];
  var tiposHTML=tipos.map(function(t){return '<option value="'+t+'"'+( recForm.tipo===t?" selected":"")+'>'+t+"</option>";}).join("");
  var h="";
  h+='<div class="rec-card"><p class="rec-lbl">Tipo de reclamo</p>';
  h+='<select class="rec-inp" onchange="window.recSF(\'tipo\',this.value)">';
  h+='<option value="">Seleccionar...</option>'+tiposHTML+'</select></div>';
  h+='<div class="rec-card"><p class="rec-lbl">Descripcion</p>';
  h+='<textarea class="rec-inp" rows="3" placeholder="Descripcion..." oninput="window.recSF(\'desc\',this.value)">'+escH(recForm.desc)+'</textarea></div>';
  h+='<div class="rec-card"><p class="rec-lbl">Direccion</p>';
  h+='<input class="rec-inp" type="text" placeholder="Calle y numero..." oninput="window.recSF(\'dir\',this.value)" value="'+escH(recForm.dir)+'"></div>';
  h+='<div class="rec-card" style="display:flex;gap:12px"><div style="flex:1"><p class="rec-lbl">Urgencia</p>';
  h+='<select class="rec-inp" onchange="window.recSF(\'urg\',this.value)">';
  h+='<option value="">Normal</option><option value="Alta"'+(recForm.urg==="Alta"?" selected":"")+ '>Alta</option><option value="Baja"'+(recForm.urg==="Baja"?" selected":"")+'>Baja</option></select></div>';
  h+='<div style="flex:1"><p class="rec-lbl">Vecino / Fuente</p>';
  h+='<input class="rec-inp" type="text" placeholder="Nombre..." oninput="window.recSF(\'u\',this.value)" value="'+escH(recForm.u)+'"></div></div>';
  h+='<button style="width:100%;padding:10px;background:#6d28d9;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;margin-top:4px" onclick="window.recEnviar()">Guardar reclamo</button>';
  return h;
}
function recHistorialHTML(){
  if(!recReclamos.length)return '<div style="text-align:center;padding:32px;color:#9ca3af">No hay reclamos registrados</div>';
  return recReclamos.slice().reverse().map(function(r){
    var uc=recUC(r.urg);
    var h='<div class="rec-card"><div style="display:flex;justify-content:space-between;align-items:flex-start">';
    h+='<span style="font-size:11px;padding:2px 8px;border-radius:20px;background:'+uc.bg+';color:'+uc.c+';border:1px solid '+uc.br+'">'+escH(r.urg||"Normal")+'</span>';
    h+='<div><button class="rec-sm" onclick="window.recRenviar('+r.id+')">WA</button> <button class="rec-sm" onclick="window.recBorrar('+r.id+')">X</button></div></div>';
    h+='<p style="font-size:13px;font-weight:500;margin:6px 0 2px">'+escH(r.tipo)+": "+escH(r.desc)+'</p>';
    h+=(r.dir?'<p style="font-size:11px;color:#6b7280">'+escH(r.dir)+'</p>':"");
    h+='</div>';
    return h;
  }).join("");
}

/* === AGENDA DE CONTENIDOS === */
var agendaItems=[];var agendaView="semana";
function agendaLoad(){try{var s=localStorage.getItem("agendaContenidos");if(s)agendaItems=JSON.parse(s);}catch(e){agendaItems=[];}agendaItems=agendaItems||[];}
function agendaSave(){try{localStorage.setItem("agendaContenidos",JSON.stringify(agendaItems));}catch(e){}}
function agendaFormatDate(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function agendaGetWeekDates(){var dias=[];var hoy=new Date();hoy.setHours(0,0,0,0);var dow=hoy.getDay();var lunes=new Date(hoy);lunes.setDate(hoy.getDate()-(dow===0?6:dow-1));for(var i=0;i<7;i++){var d=new Date(lunes);d.setDate(lunes.getDate()+i);dias.push(d);}return dias;}
function agendaSetView(v){agendaView=v;agendaRender();}
function agendaDeleteItem(id){agendaItems=agendaItems.filter(function(x){return x.id!==id;});agendaSave();agendaRender();}
function agendaNewItem(){agendaOpenModal(null);}
function agendaEditItem(id){agendaOpenModal(id);}
function agendaRender(){
  var el=document.getElementById("agenda-content");if(!el)return;
  el.innerHTML=(agendaView==="semana"?agendaWeekHTML():agendaDayHTML());
  var sB=document.getElementById("agenda-btn-sem");var dB=document.getElementById("agenda-btn-dia");
  if(sB)sB.classList.toggle("on",agendaView==="semana");
  if(dB)dB.classList.toggle("on",agendaView==="dia");
}
function agendaSaveModal(id){
  var titulo=(document.getElementById("agf-titulo")||{}).value||"";
  var fecha=(document.getElementById("agf-fecha")||{}).value||"";
  var hora=(document.getElementById("agf-hora")||{}).value||"";
  var red=(document.getElementById("agf-red")||{}).value||"";
  if(!titulo.trim())return;
  if(id){var idx=agendaItems.findIndex(function(x){return x.id===id;});if(idx>-1)agendaItems[idx]={id:id,titulo:titulo,fecha:fecha,hora:hora,red:red};}
  else{agendaItems.push({id:Date.now(),titulo:titulo,fecha:fecha,hora:hora,red:red});}
  agendaSave();var m=document.getElementById("agenda-modal");if(m)m.remove();agendaRender();
}
function agendaOpenModal(id){
  var ex=id?agendaItems.find(function(x){return x.id===id;}):null;
  var hoyStr=agendaFormatDate(new Date());
  var tit=ex?ex.titulo:"",fec=ex?ex.fecha:hoyStr,hor=ex?ex.hora:"",red=ex?ex.red:"";
  var m=document.createElement("div");m.className="agenda-modal";m.id="agenda-modal";
  var h='<div class="agenda-modal-box"><h3 class="agenda-modal-title">'+(id?"Editar":"Nueva")+' publicacion</h3>';
  h+='<div class="agenda-form-row"><label class="agenda-form-label">Titulo</label>';
  h+='<input id="agf-titulo" class="agenda-form-input" type="text" placeholder="Descripcion del contenido..." value="'+tit+'"></div>';
  h+='<div style="display:flex;gap:12px">';
  h+='<div class="agenda-form-row" style="flex:1"><label class="agenda-form-label">Fecha</label><input id="agf-fecha" class="agenda-form-input" type="date" value="'+fec+'"></div>';
  h+='<div class="agenda-form-row" style="flex:1"><label class="agenda-form-label">Hora</label><input id="agf-hora" class="agenda-form-input" type="time" value="'+hor+'"></div></div>';
  h+='<div class="agenda-form-row"><label class="agenda-form-label">Red social</label>';
  h+='<input id="agf-red" class="agenda-form-input" type="text" placeholder="Instagram, Facebook, Twitter..." value="'+red+'"></div>';
  h+='<div class="agenda-form-actions">';
  h+='<button class="agenda-btn-cancel" onclick="document.getElementById(\"agenda-modal\").remove()">Cancelar</button>';
  h+='<button class="agenda-btn-save" onclick="agendaSaveModal('+(id||"null")+')">Guardar</button></div></div>';
  m.innerHTML=h;document.body.appendChild(m);
}

function agendaWeekHTML(){
  var dias=agendaGetWeekDates();
  var hoyStr=agendaFormatDate(new Date());
  var dns=["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  var html='<div class="agenda-week">';
  dias.forEach(function(d,i){
    var dateStr=agendaFormatDate(d);
    var isHoy=dateStr===hoyStr;
    var items=agendaItems.filter(function(it){return it.fecha===dateStr;}).sort(function(a,b){return(a.hora||"").localeCompare(b.hora||"");});
    var dNum=String(d.getDate()).padStart(2,"0");
    html+="<div class=\"agenda-day-col"+(isHoy?" agenda-day-hoy":"")+"\">"; 
    html+='<div class="agenda-day-name">'+dns[i]+' '+dNum+(isHoy?" HOY":"")+'</div>';
    if(!items.length)html+='<div class="agenda-empty">-</div>';
    items.forEach(function(it){
      html+='<div class="agenda-item" onclick="agendaEditItem('+ it.id+')"><div class="agenda-item-time">'+(it.hora||"Sin hora")+'</div><div class="agenda-item-text">'+escH(it.titulo)+'</div>'+(it.red?'<div class="agenda-item-red">&#128241; '+escH(it.red)+'</div>':"")+'<button class="agenda-item-del" onclick="event.stopPropagation();agendaDeleteItem('+it.id+')" title="Eliminar">&times;</button></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  return html;
}
function agendaDayHTML(){
  var hoy=new Date();hoy.setHours(0,0,0,0);
  var dateStr=agendaFormatDate(hoy);
  var items=agendaItems.filter(function(it){return it.fecha===dateStr;}).sort(function(a,b){return(a.hora||"").localeCompare(b.hora||"");});
  var dn=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"][hoy.getDay()];
  var html='<div style="padding:8px 0"><h3 style="font-size:15px;font-weight:700;color:#6d28d9;margin-bottom:12px">'+dn+" "+hoy.getDate()+"/"+(hoy.getMonth()+1)+"/"+hoy.getFullYear()+'</h3>';
  if(!items.length)html+='<div class="agenda-empty" style="padding:40px">Sin contenido programado para hoy</div>';
  items.forEach(function(it){
    html+='<div class="agenda-item" onclick="agendaEditItem('+ it.id+')"><div class="agenda-item-time">&#9200; '+(it.hora||"Sin hora")+'</div><div class="agenda-item-text">'+escH(it.titulo)+'</div>'+(it.red?'<div class="agenda-item-red">&#128241; '+escH(it.red)+'</div>':"")+'<button class="agenda-item-del" onclick="event.stopPropagation();agendaDeleteItem('+it.id+')" title="Eliminar">&times;</button></div>';
  });
  html+='</div>';
  return html;
}

/* === INYECTAR PANELES === */
function inyectarPanelReclamos(){
  if(document.getElementById("p-reclamos"))return;
  var panel=document.createElement("div");
  panel.id="p-reclamos";panel.className="content";
  panel.style.cssText="display:none;flex-direction:column;height:100%;overflow:hidden;";
  var h='<div style="padding:16px;height:calc(100% - 32px);overflow:auto;">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><h2 style="font-size:18px;font-weight:700">Reclamos municipales</h2><span id="rec-subtitle" style="font-size:12px;color:#6b7280"></span></div>';
  h+='<div style="display:flex;gap:0;margin-bottom:12px;border-bottom:1px solid #e5e7eb"><button class="rec-tab on" data-t="nuevo" onclick="window.setRecTab(\'nuevo\')">+ Nuevo</button><button class="rec-tab" data-t="historial" onclick="window.setRecTab(\'historial\')">Historial</button></div>';
  h+='<div id="rec-content"></div></div>';
  panel.innerHTML=h;
  var existing=document.querySelector(".content");
  if(existing&&existing.parentNode)existing.parentNode.appendChild(panel);
  else document.body.appendChild(panel);
}

function inyectarPanelAgenda(){
  if(document.getElementById("p-agenda"))return;
  var panel=document.createElement("div");
  panel.id="p-agenda";panel.className="content";
  panel.style.cssText="display:none;flex-direction:column;height:100%;overflow:hidden;";
  var h='<div class="agenda-wrap"><div class="agenda-header">';
  h+='<h2 class="agenda-title">Agenda de Contenidos</h2>';
  h+='<div style="display:flex;gap:8px;align-items:center">';
  h+='<button id="agenda-btn-dia" class="agenda-view-btn" onclick="agendaSetView(\'dia\')">Hoy</button>';
  h+='<button id="agenda-btn-sem" class="agenda-view-btn on" onclick="agendaSetView(\'semana\')">Semana</button>';
  h+='<button class="agenda-new-btn" onclick="agendaNewItem()">+ Nueva publicacion</button>';
  h+='</div></div><div id="agenda-content"></div></div>';
  panel.innerHTML=h;
  var existing=document.querySelector(".content");
  if(existing&&existing.parentNode)existing.parentNode.appendChild(panel);
  else document.body.appendChild(panel);
}

function patchNav(){
  document.querySelectorAll("nav a, .tab-btn, .ntab, [onclick*=\"publicaciones\"]").forEach(function(el){
    try{
      var t=el.textContent&&el.textContent.trim();
      if(t==="Publicaciones"||t==="publicaciones"){
        el.textContent="Agenda";
        var oc=el.getAttribute("onclick")||"";
        if(oc)el.setAttribute("onclick",oc.replace(/p-publicaciones/g,"p-agenda").replace(/publicaciones/g,"agenda"));
      }
    }catch(e){}
  });
}

/* === EXPONER GLOBALES === */
window.setRecTab=setRecTab;window.setRecATab=setRecATab;
window.recSF=recSF;window.recSetUrg=recSetUrg;
window.recEnviar=recEnviar;window.recRenviar=recRenviar;
window.recAbrirWA=recAbrirWA;window.recBorrar=recBorrar;
window.recRender=recRender;window.loadReclamos=loadReclamos;
window.initReclamos=initReclamos;
window.agendaSetView=agendaSetView;window.agendaDeleteItem=agendaDeleteItem;
window.agendaNewItem=agendaNewItem;window.agendaEditItem=agendaEditItem;
window.agendaSaveModal=agendaSaveModal;window.agendaRender=agendaRender;
window.agendaOpenModal=agendaOpenModal;
window.escH=escH;

/* === INIT === */
function init(){
  try{inyectarCSS();}catch(e){}
  try{_patchAll();}catch(e){}
  try{inyectarPanelReclamos();}catch(e){}
  try{inyectarPanelAgenda();}catch(e){}
  try{agendaLoad();agendaRender();}catch(e){}
  try{initReclamos();}catch(e){}
  try{patchNav();}catch(e){}
  setTimeout(function(){try{_patchAll();patchNav();}catch(e){}},600);
  setTimeout(function(){try{_patchAll();patchNav();_addEstadoSelectors();agendaRender();}catch(e){}},1500);
  setTimeout(function(){try{_patchAll();patchNav();_addEstadoSelectors();}catch(e){}},3500);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",function(){setTimeout(init,300);});
}else{setTimeout(init,300);}

})();
