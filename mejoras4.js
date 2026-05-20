/* ============================================================
   MEJORAS4.JS - Panel Comunicacion Tres Arroyos v2.3
   Parche seguro: no borra ni migra informacion existente.
   - Telefonos de agentes en Guardias.
   - Backup preventivo antes de borrar.
   - Edicion/borrado robusto de publicaciones.
   - Borrado robusto de tareas/actividades.
============================================================ */
(function(){
"use strict";

var BACKUP_PREFIX="panel-comunicacion-autobackup-";
var AGENTES_FALLBACK={marianela:"5492983569618",yesi:"5492983548005",debora:"5492983604796",guada:"5492983544254",maiten:"5492983560222"};

function txt(s){return String(s||"").replace(/\s+/g," ").trim();}
function keyName(s){return txt(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function digits(s){return String(s||"").replace(/[^0-9]/g,"");}
function idEq(a,b){return String(a||"")===String(b||"");}
function getDb(){try{return window.db||(typeof db!=="undefined"?db:null);}catch(e){return window.db||null;}}
function say(m,t){try{if(typeof window.toast==="function")window.toast(m,t||"ok");}catch(e){}}

function recolectarLocalStorage(){var out={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);out[k]=localStorage.getItem(k);}}catch(e){}return out;}
function guardarBackupAutomatico(motivo){
  var stamp=new Date().toISOString().replace(/[:.]/g,"-");
  var payload={meta:{motivo:motivo||"cambio",timestamp:new Date().toISOString(),url:location.href,version:"mejoras4-v2.3"},localStorage:recolectarLocalStorage()};
  try{localStorage.setItem(BACKUP_PREFIX+stamp,JSON.stringify(payload));}catch(e){}
  return payload;
}
function descargarBackup(motivo){
  var payload=guardarBackupAutomatico(motivo||"manual");
  try{var blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="panel-comunicacion-backup-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}catch(e){}
}
function confirmarConBackup(mensaje,motivo){guardarBackupAutomatico(motivo);return confirm(mensaje+"\n\nSe guardo una copia local antes de continuar.");}

function inyectarEstilos(){
  if(document.getElementById("m4-ux-css"))return;
  var st=document.createElement("style");st.id="m4-ux-css";
  st.textContent=".m4-data-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:rgba(255,255,255,.78);font-size:10px;font-weight:600;white-space:nowrap}.m4-backup-btn{border-color:#8b5cf6!important;background:#f5f3ff!important;color:#6d28d9!important;font-weight:700!important}.m4g-phone{display:block;background:#25d366!important;color:#fff!important;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-decoration:none;margin-top:4px}.m4g-add-phone{display:block;background:#fff!important;color:#6c3fc5!important;border:1px dashed #8b5cf6!important;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-align:center;margin-top:4px;cursor:pointer;width:100%}.m4-mobilebar{display:none}@media(max-width:768px){.content{padding-bottom:68px!important}.m4-mobilebar{position:fixed;left:8px;right:8px;bottom:8px;z-index:800;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:6px;border-radius:14px;background:rgba(26,26,46,.96);box-shadow:0 8px 24px rgba(0,0,0,.22);backdrop-filter:blur(12px)}.m4-mobilebar button{border:0;background:transparent;color:rgba(255,255,255,.68);border-radius:10px;padding:7px 2px;font-family:Inter,sans-serif;font-size:10px;font-weight:700;cursor:pointer}.m4-mobilebar button.on{background:rgba(255,255,255,.16);color:#fff}}";
  document.head.appendChild(st);
}
function normalizarTextos(){
  var repl={"publicaciónes":"publicaciones","Publicaciónes":"Publicaciones","Publicacion":"Publicación","publicacion":"publicación","ContraseÃ±a":"Contraseña","ComunicaciÃ³n":"Comunicación","MÃ©tricas":"Métricas","SÃ­":"Sí"};
  try{var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),node;while((node=walker.nextNode())){var v=node.nodeValue;Object.keys(repl).forEach(function(k){v=v.split(k).join(repl[k]);});node.nodeValue=v;}}catch(e){}
}
function reforzarBackup(){
  try{var btn=document.querySelector("button[onclick*='Backup'], .m2-bk-mi, #m2-bk-open, #backupbtn");if(!btn){btn=document.createElement("button");btn.type="button";btn.className="btn sm m4-backup-btn";btn.textContent="Backup";btn.onclick=function(){descargarBackup("manual");};var tr=document.querySelector(".tr")||document.querySelector(".topbar");if(tr)tr.insertBefore(btn,tr.firstChild);}else{btn.classList.add("m4-backup-btn");btn.title="Descargar copia de seguridad de los datos guardados en este navegador";}}catch(e){}
  try{var tr2=document.querySelector(".tr");if(tr2&&!document.getElementById("m4-data-chip")){var chip=document.createElement("span");chip.id="m4-data-chip";chip.className="m4-data-chip";chip.textContent="Datos cuidados";chip.title="El panel guarda un backup automatico antes de borrar.";tr2.insertBefore(chip,tr2.firstChild);}}catch(e){}
}
function crearMobileBar(){
  if(document.getElementById("m4-mobilebar"))return;
  var bar=document.createElement("div");bar.id="m4-mobilebar";bar.className="m4-mobilebar";
  [["hoy","Hoy"],["publicaciones","Agenda"],["calendario","Calendario"],["guardias","Guardia"],["equipo","Equipo"]].forEach(function(it){var b=document.createElement("button");b.type="button";b.setAttribute("data-m4nav",it[0]);b.textContent=it[1];b.onclick=function(){if(typeof window.nav==="function")window.nav(it[0],b);};bar.appendChild(b);});
  document.body.appendChild(bar);
}
function marcarMobileActivo(id){try{document.querySelectorAll("[data-m4nav]").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-m4nav")===id);});}catch(e){}}

function telefonoAgente(nombre){
  var n=txt(nombre), k=keyName(n), tel="";
  try{if(typeof window.getContact==="function"){var c=window.getContact(n);if(c&&c.tel)tel=c.tel;}}catch(e){}
  if(!tel){try{var saved=JSON.parse(localStorage.getItem("panelContactos")||"{}");Object.keys(saved).some(function(nombreGuardado){if(keyName(nombreGuardado)===k){tel=digits(saved[nombreGuardado]&&saved[nombreGuardado].tel);return true;}return false;});}catch(e){}}
  if(!tel)tel=AGENTES_FALLBACK[k]||"";
  return digits(tel);
}
function guardarTelefonoAgente(nombre,tel){try{var saved=JSON.parse(localStorage.getItem("panelContactos")||"{}");var actual=saved[nombre]||{};actual.tel=digits(tel);saved[nombre]=actual;localStorage.setItem("panelContactos",JSON.stringify(saved));}catch(e){} }
function waUrl(tel,msg){return "https://api.whatsapp.com/send?phone="+digits(tel)+"&text="+encodeURIComponent(msg||"");}
function reemplazarTelefono(el,nombre,fecha,rol){
  var tel=telefonoAgente(nombre);
  if(tel){var a=document.createElement("a");a.className="m4g-phone";a.href=waUrl(tel,"Guardia del dia"+(fecha?" "+fecha:"")+" - "+nombre+(rol?" ("+rol+")":""));a.target="_blank";a.textContent="WhatsApp";a.onclick=function(ev){ev.stopPropagation();};el.replaceWith(a);return;}
  var b=document.createElement("button");b.type="button";b.className="m4g-add-phone";b.textContent="Agregar tel.";b.onclick=function(ev){ev.stopPropagation();var nuevo=prompt("Telefono de "+nombre+" con codigo pais","");if(!nuevo)return;guardarTelefonoAgente(nombre,nuevo);mejorarTelefonosGuardia();};el.replaceWith(b);
}
function mejorarTelefonosGuardia(){
  try{
    document.querySelectorAll("#m4g .m4g-card").forEach(function(card){var nameEl=card.querySelector(".m4g-cname");if(!nameEl)return;var old=card.querySelector(".m4g-wa-dis,.m4g-add-phone");if(old)reemplazarTelefono(old,txt(nameEl.textContent),"",txt((card.querySelector(".m4g-crole")||{}).textContent));});
    document.querySelectorAll("#m4g .m4g-agent-card").forEach(function(card){var nameEl=card.querySelector(".m4g-agent-name");if(!nameEl)return;var old=card.querySelector(".m4g-wa-dis,.m4g-add-phone");if(old)reemplazarTelefono(old,txt(nameEl.textContent),"",txt((card.querySelector(".m4g-agent-role")||{}).textContent));});
    var big=document.querySelector("#m4g .m4g-detail-header .m4g-wa-big:disabled");var agent=document.querySelector("#m4g .m4g-agent-name");if(big&&agent){var nombre=txt(agent.textContent),tel=telefonoAgente(nombre);if(tel){var nb=document.createElement("button");nb.className="m4g-wa-big";nb.textContent="Enviar WhatsApp";nb.onclick=function(){window.open(waUrl(tel,"Guardia del dia - "+nombre),"_blank");};big.replaceWith(nb);}}
  }catch(e){}
}

function quitarDeStoragePorId(id){
  try{Object.keys(localStorage).forEach(function(k){var raw=localStorage.getItem(k);if(!raw||raw.charAt(0)!=="[")return;var arr;try{arr=JSON.parse(raw);}catch(e){return;}if(!Array.isArray(arr))return;var next=arr.filter(function(item){return !(item&&idEq(item.id,id));});if(next.length!==arr.length)localStorage.setItem(k,JSON.stringify(next));});}catch(e){}
}
function rerenderTareas(){["renderKanban","renderMaterial","updateBadges","renderPersons","actualizarFPanel"].forEach(function(fn){try{if(typeof window[fn]==="function")window[fn]();}catch(e){}});}
function limpiarTareaLocal(id){
  if(!id)return;
  try{if(typeof _pendingDelete!=="undefined"&&_pendingDelete&&_pendingDelete.add)_pendingDelete.add(id);}catch(e){}
  try{if(Array.isArray(window.tasks))window.tasks=window.tasks.filter(function(t){return !idEq(t&&t.id,id);});}catch(e){}
  try{if(Array.isArray(tasks))tasks=tasks.filter(function(t){return !idEq(t&&t.id,id);});}catch(e){}
  quitarDeStoragePorId(id);
}
async function borrarTareaRobusto(id,descripcion){
  if(!id)return;
  var nombre=txt(descripcion)||"esta tarea";
  if(!confirmarConBackup("¿Eliminar \""+nombre+"\"?","eliminar tarea"))return;
  limpiarTareaLocal(id);
  try{if(typeof window.closeMod==="function")window.closeMod("modTask");}catch(e){}
  rerenderTareas();
  try{var dbx=getDb();if(dbx&&dbx.from){var res=await dbx.from("tareas").delete().eq("id",id);if(res&&res.error)throw res.error;}say("✓ Tarea eliminada");}catch(e){say("Eliminada de esta pantalla. Revisá conexión para sincronizar.","warn");try{console.warn("No se pudo sincronizar borrado de tarea",e);}catch(_e){}}
  setTimeout(function(){try{if(typeof _pendingDelete!=="undefined"&&_pendingDelete&&_pendingDelete.delete)_pendingDelete.delete(id);}catch(e){}},6000);
}
function instalarFixTareas(){
  window.deleteTask=function(id,descripcion){return borrarTareaRobusto(id,descripcion);};
  window.deleteTaskModal=function(){var id="",desc="esta tarea";try{id=(document.getElementById("editTid")||{}).value||"";}catch(e){}try{var t=(typeof tasks!=="undefined"&&Array.isArray(tasks))?tasks.find(function(x){return idEq(x&&x.id,id);}):null;if(t&&t.descripcion)desc=t.descripcion;else desc=(document.getElementById("fdesc")||{}).value||desc;}catch(e){}return borrarTareaRobusto(id,desc);};
}

function rerenderPublicaciones(){["renderWeek","renderPubDay","renderGuardias","renderGuardDay","renderCal","renderCalDay","updateBadges","renderPublicacionesEnGuardias"].forEach(function(fn){try{if(typeof window[fn]==="function")window[fn]();}catch(e){}});setTimeout(function(){normalizarTextos();mejorarTelefonosGuardia();},150);}
function limpiarPublicacionLocal(id){
  if(!id)return;
  try{if(Array.isArray(window.pubs))window.pubs=window.pubs.filter(function(p){return !idEq(p&&p.id,id);});}catch(e){}
  try{if(Array.isArray(pubs))pubs=pubs.filter(function(p){return !idEq(p&&p.id,id);});}catch(e){}
  try{if(Array.isArray(window._pubGuardia))window._pubGuardia=window._pubGuardia.filter(function(p){return !idEq(p&&p.id,id)&&!idEq(p&&p.id,"pub_"+id);});}catch(e){}
  try{if(typeof cobSel!=="undefined"){delete cobSel[id];delete cobSel["pub_"+id];}}catch(e){}
  quitarDeStoragePorId(id);
  try{document.querySelectorAll('[data-pub-id="'+String(id).replace(/"/g,'\\"')+'"]').forEach(function(el){el.remove();});}catch(e){}
}
async function borrarPublicacionRobusto(id,descripcion){
  if(!id)return;
  var nombre=txt(descripcion)||"esta publicación";
  if(!confirmarConBackup("¿Eliminar \""+nombre+"\"?","eliminar publicación"))return;
  limpiarPublicacionLocal(id);
  try{if(typeof window.closeMod==="function")window.closeMod("modPub");}catch(e){}
  rerenderPublicaciones();
  try{var dbx=getDb();if(dbx&&dbx.from){var res=await dbx.from("publicaciones").delete().eq("id",id);if(res&&res.error)throw res.error;}say("✓ Publicación eliminada");}catch(e){say("Eliminada de esta pantalla. Revisá conexión para sincronizar.","warn");try{console.warn("No se pudo sincronizar borrado de publicación",e);}catch(_e){}}
  rerenderPublicaciones();
}
function instalarFixPublicaciones(){
  window.editPubMod=function(id){if(typeof window.editPubItem==="function")return window.editPubItem(id);try{if(typeof editPubItem==="function")return editPubItem(id);}catch(e){}};
  window.eliminarPubDirecto=function(id,descripcion){return borrarPublicacionRobusto(id,descripcion);};
  window.m4gDelPub=function(id){return borrarPublicacionRobusto(id,"esta publicación");};
  window.deletePub=function(){var id="",desc="esta publicación";try{id=(document.getElementById("pubeid")||{}).value||"";}catch(e){}try{desc=(document.getElementById("pdesc")||{}).value||desc;}catch(e){}return borrarPublicacionRobusto(id,desc);};
}

function patchNav(){
  if(window._m4uxNavPatched)return;
  var orig=window.nav;if(typeof orig!=="function")return;
  window._m4uxNavPatched=true;
  window.nav=function(id){var r=orig.apply(this,arguments);marcarMobileActivo(id);setTimeout(reforzarTodo,250);return r;};
}
function observarCambios(){
  if(window._m4uxObs)return;
  try{var pending=false;window._m4uxObs=new MutationObserver(function(){if(pending)return;pending=true;setTimeout(function(){pending=false;reforzarTodo();},350);});window._m4uxObs.observe(document.body,{childList:true,subtree:true});}catch(e){}
}
function reforzarTodo(){normalizarTextos();reforzarBackup();instalarFixTareas();instalarFixPublicaciones();mejorarTelefonosGuardia();}
function inicializar(){inyectarEstilos();crearMobileBar();patchNav();observarCambios();reforzarTodo();setTimeout(reforzarTodo,900);}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(inicializar,800);});
else setTimeout(inicializar,800);
})();
