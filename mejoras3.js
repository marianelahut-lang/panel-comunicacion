/* ==================================================
   MEJORAS3.JS v4 - Panel Comunicacion Tres Arroyos
   FIXES: Separacion modulos + Guardia semanal
   NO modifica datos ni logica funcional.
   ================================================== */

(function(){
"use strict";

/* CSS */
function inyectarCSS(){
  if(document.getElementById("m4css")) return;
  var s=document.createElement("style");
  s.id="m4css";
  var css="";
  css+="#p-tablero{display:none!important}\n";
  css+="body.m4tab-tablero #p-tablero{display:flex!important}\n";
  css+=".m4col-hide{display:none!important}\n";
  css+="#p-guardias .ptop,#p-guardias .gw-navrow,#p-guardias .gw-desktop,#p-guardias .gw-mobile,#p-guardias .acts,#p-guardias #m1-pubs-guardias{display:none!important}\n";
  css+="#m4g{width:100%;padding:16px;box-sizing:border-box}\n";
  css+="#m4g .m4gh{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#6c3fc5,#4f46e5);color:#fff;border-radius:12px;padding:16px 20px;margin-bottom:16px}\n";
  css+="#m4g .m4gh h2{margin:0;font-size:1.1rem;font-weight:700}\n";
  css+="#m4g .m4gh p{margin:4px 0 0;font-size:.85rem;opacity:.85}\n";
  css+="#m4g .m4gnav{display:flex;align-items:center;gap:12px;margin-bottom:16px}\n";
  css+="#m4g .m4gnav button{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:.85rem;font-weight:600}\n";
  css+="#m4g .m4gwrange{flex:1;text-align:center;font-size:.9rem;font-weight:600}\n";
  css+="#m4g .m4ghoy{background:#6c3fc5!important;color:#fff!important;border-color:#6c3fc5!important}\n";
  css+="#m4g .m4gdays{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:16px}\n";
  css+="@media(max-width:700px){#m4g .m4gdays{grid-template-columns:repeat(3,1fr)}}\n";
  css+="#m4g .m4gday{background:var(--color-canvas-subtle,#f6f8fa);border:2px solid var(--color-border-default,#d0d7de);border-radius:12px;padding:10px 8px;cursor:pointer;min-height:110px;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all .2s}\n";
  css+="#m4g .m4gday:hover{border-color:#6c3fc5}\n";
  css+="#m4g .m4gday.m4active{border-color:#6c3fc5!important;background:rgba(108,63,197,.08)!important}\n";
  css+="#m4g .m4gday.m4today{border-color:#f59e0b!important}\n";
  css+="#m4g .m4gdname{font-size:.7rem;font-weight:700;text-transform:uppercase;color:#888}\n";
  css+="#m4g .m4gdnum{font-size:1.2rem;font-weight:800}\n";
  css+="#m4g .m4today .m4gdnum{color:#f59e0b}\n";
  css+="#m4g .m4active .m4gdnum{color:#6c3fc5}\n";
  css+="#m4g .m4gav{width:32px;height:32px;border-radius:50%;background:#6c3fc5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700}\n";
  css+="#m4g .m4ganame{font-size:.7rem;font-weight:600;text-align:center;line-height:1.2}\n";
  css+="#m4g .m4garole{font-size:.6rem;color:#888}\n";
  css+="#m4g .m4gcnt{background:#6c3fc5;color:#fff;border-radius:20px;padding:2px 8px;font-size:.65rem;font-weight:700;margin-top:2px}\n";
  css+="#m4g .m4gwa{background:#25d366;color:#fff;border:none;border-radius:8px;padding:3px 8px;font-size:.65rem;font-weight:700;cursor:pointer;margin-top:2px;width:100%}\n";
  css+="#m4g .m4gdetail{display:grid;grid-template-columns:1fr 200px;gap:16px}\n";
  css+="@media(max-width:700px){#m4g .m4gdetail{grid-template-columns:1fr}}\n";
  css+="#m4g .m4dbox{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:12px;padding:16px}\n";
  css+="#m4g .m4dhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px}\n";
  css+="#m4g .m4dtitle{font-size:.95rem;font-weight:700}\n";
  css+="#m4g .m4dwa{background:#25d366;color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:.8rem;font-weight:700;cursor:pointer}\n";
  css+="#m4g .m4alist{display:flex;flex-direction:column;gap:8px}\n";
  css+="#m4g .m4aitem{background:var(--color-canvas-default,#fff);border:1px solid var(--color-border-default,#d0d7de);border-radius:10px;padding:10px 12px;display:flex;align-items:flex-start;gap:10px}\n";
  css+="#m4g .m4atime{font-size:.85rem;font-weight:800;min-width:42px;color:#6c3fc5}\n";
  css+="#m4g .m4abadge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:6px;font-size:.65rem;font-weight:700;white-space:nowrap}\n";
  css+="#m4g .m4bev{background:#dbeafe;color:#1d4ed8}\n";
  css+="#m4g .m4bpub{background:#fce7f3;color:#be185d}\n";
  css+="#m4g .m4bcob{background:#dcfce7;color:#15803d}\n";
  css+="#m4g .m4brad{background:#fef3c7;color:#b45309}\n";
  css+="#m4g .m4atitle{font-size:.85rem;font-weight:600;line-height:1.3}\n";
  css+="#m4g .m4aplace{font-size:.75rem;color:#888;margin-top:2px}\n";
  css+="#m4g .m4empty{text-align:center;color:#aaa;padding:24px;font-size:.85rem}\n";
  css+="#m4g .m4sidebar{display:flex;flex-direction:column;gap:12px}\n";
  css+="#m4g .m4sum{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:12px;padding:14px}\n";
  css+="#m4g .m4sum h3{font-size:.85rem;font-weight:700;margin:0 0 10px}\n";
  css+="#m4g .m4srow{display:flex;justify-content:space-between;padding:4px 0;font-size:.8rem;border-bottom:1px solid var(--color-border-muted,#eaeef2)}\n";
  css+="#m4g .m4srow:last-child{border-bottom:none}\n";
  css+="#m4g .m4sval{font-weight:700;background:#6c3fc5;color:#fff;padding:1px 8px;border-radius:10px;font-size:.75rem}\n";
  css+="#m4g .m4agcard{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:12px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:8px}\n";
  css+="#m4g .m4agav{width:48px;height:48px;border-radius:50%;background:#6c3fc5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700}\n";
  css+="#m4g .m4agname{font-size:.9rem;font-weight:700}\n";
  css+="#m4g .m4agrole{font-size:.75rem;color:#888}\n";
  css+="#m4g .m4agwa{background:#25d366;color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:.8rem;font-weight:700;cursor:pointer;width:100%}\n";
  s.textContent=css;
  document.head.appendChild(s);
}

/* TABLERO FIX */
function checkTablero(){
  var t=document.querySelector("#p-tablero");
  if(!t) return;
  if(document.body.classList.contains("m4tab-tablero")) t.style.removeProperty("display");
  else t.style.setProperty("display","none","important");
}

function parchearNav(){
  var orig=window.nav;
  if(typeof orig!=="function"||window._m4navOK) return;
  window._m4navOK=true;
  window.nav=function(id){
    document.body.classList.toggle("m4tab-tablero",id==="tablero");
    checkTablero();
    var r=orig.apply(this,arguments);
    if(id==="guardias") setTimeout(buildGuardia,100);
    return r;
  };
  document.querySelectorAll(".ntab,.sbi").forEach(function(b){
    b.addEventListener("click",function(){
      var tid=this.dataset.tab||(this.getAttribute("onclick")||"");
      document.body.classList.toggle("m4tab-tablero",tid.indexOf("tablero")>-1);
      checkTablero();
    },{capture:true});
  });
}

/* KANBAN REALIZADA */
function ocultarRealizada(){
  document.querySelectorAll(".kanban-col,.k-col,.kanban-column,.board-column").forEach(function(col){
    var h=col.querySelector("h3,h4,.col-title,.k-title");
    if(h&&/realizada/i.test(h.textContent)) col.style.setProperty("display","none","important");
    else if(!h&&/realizada/i.test(col.textContent.substring(0,80))) col.style.setProperty("display","none","important");
  });
}

/* GUARD HELPERS */
var m4gWeekOff=0,m4gSelDay=null;

function getWeekDays(off){
  var t=new Date(),dow=t.getDay(),mon=new Date(t);
  mon.setDate(t.getDate()-(dow===0?6:dow-1)+off*7);
  var d=[];
  for(var i=0;i<7;i++){var x=new Date(mon);x.setDate(mon.getDate()+i);d.push(x);}
  return d;
}

function fmtD(d){
  var m=d.getMonth()+1,dd=d.getDate();
  return d.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(dd<10?"0":"")+dd;
}

function ini(name){
  if(!name) return "?";
  return name.split(" ").map(function(w){return w[0]||"";}).join("").substring(0,2).toUpperCase();
}

function fmtWeek(days){
  var o={day:"numeric",month:"short"};
  return days[0].toLocaleDateString("es-AR",o)+" - "+days[6].toLocaleDateString("es-AR",o)+" "+days[0].getFullYear();
}

function getAgent(days,d){
  var gp=document.querySelector("#p-guardias");
  if(!gp) return null;
  try{var wd=window.semanaGuardia||window.guardWeek;if(wd&&wd[fmtD(d)]) return wd[fmtD(d)];}catch(e){}
  var cols=gp.querySelectorAll(".gw-desktop td,.gw-desktop th");
  var idx=days.findIndex(function(x){return fmtD(x)===fmtD(d);});
  if(cols[idx]){var nm=cols[idx].querySelector(".agent-name,strong,b");if(nm) return {name:nm.textContent.trim(),role:"titular"};}
  return null;
}

function getActs(dateStr){
  var a=[];
  try{
    var ov=JSON.parse(localStorage.getItem("guardOverrides")||"{}"),dov=ov[dateStr];
    if(dov&&Array.isArray(dov)) dov.forEach(function(x){if(parseInt(x.hora||0)>=15) a.push({time:x.hora,type:x.tipo||"cobertura",title:x.titulo||x.title||"",place:x.lugar||""}); });
  }catch(e){}
  a.sort(function(x,y){return (x.time||"").localeCompare(y.time||"");});
  return a;
}

function bdg(t){
  t=(t||"").toLowerCase();
  if(t==="evento"||t==="calendar") return "<span class=\"m4abadge m4bev\">&#128197; EVENTO</span>";
  if(t==="publicacion"||t==="pub") return "<span class=\"m4abadge m4bpub\">&#128226; PUBLICACION</span>";
  if(t==="cobertura"||t==="cob") return "<span class=\"m4abadge m4bcob\">&#127919; COBERTURA</span>";
  if(t==="radio") return "<span class=\"m4abadge m4brad\">&#128251; RADIO</span>";
  return "<span class=\"m4abadge m4bev\">"+t+"</span>";
}

function waMsg(n,d,a){
  var dl=d.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  var m="Hola "+n+", estas son tus coberturas del dia\n"+dl+":\n\n";
  if(!a.length) m+="Sin actividades desde las 15:00 hs.\n";
  else a.forEach(function(x){var tp=x.type==="publicacion"||x.type==="pub"?"Publicacion":x.type==="cobertura"||x.type==="cob"?"Cobertura":x.type==="radio"?"Radio":"Evento";m+=x.time+" hs - "+tp+": "+x.title+(x.place?" - "+x.place:"")+"\n";});
  return m+"\nGracias!";
}

function dayCard(dayDate,days,isToday,isActive){
  var ds=fmtD(dayDate),agent=getAgent(days,dayDate),acts=getActs(ds);
  var an=agent?agent.name:"Sin asignar",ar=agent?agent.role||"titular":"";
  var dn=["LUN","MAR","MIE","JUE","VIE","SAB","DOM"][days.findIndex(function(d){return fmtD(d)===ds;})]||"";
  var mth=dayDate.toLocaleDateString("es-AR",{month:"short"});
  var cls="m4gday"+(isToday?" m4today":"")+(isActive?" m4active":"");
  var wu=encodeURIComponent(waMsg(an,dayDate,acts));
  var ah=agent
    ? "<div class=\"m4gav\">"+ini(an)+"</div><div class=\"m4ganame\">"+an+"</div><div class=\"m4garole\">"+ar+"</div>"+(acts.length?"<div class=\"m4gcnt\">"+acts.length+" act.</div>":"")+"<button class=\"m4gwa\" onclick=\"event.stopPropagation();window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; WA</button>"
    : "<div style=\"font-size:.65rem;color:#aaa;text-align:center\">Sin asignar</div>";
  return "<div class=\""+cls+"\" data-date=\""+ds+"\" onclick=\"window.m4gSel('"+ds+"')\"><div class=\"m4gdname\">"+dn+"</div><div class=\"m4gdnum\">"+dayDate.getDate()+" <span style=\"font-size:.65rem\">"+ mth+"</span></div>"+ah+"</div>";
}

function dayDetail(ds,days){
  var d=days.find(function(x){return fmtD(x)===ds;});
  if(!d) return "<div class=\"m4empty\">Selecciona un dia para ver el detalle.</div>";
  var a=getActs(ds),agent=getAgent(days,d),an=agent?agent.name:"Sin asignar",ar=agent?agent.role||"":"",in2=ini(an);
  var dl=d.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"}).toUpperCase();
  var wu=encodeURIComponent(waMsg(an,d,a));
  var ah="";
  if(!a.length) ah="<div class=\"m4empty\">Sin actividades desde las 15:00 hs para este dia.</div>";
  else a.forEach(function(x){ah+="<div class=\"m4aitem\"><div class=\"m4atime\">"+(x.time||"")+"</div><div style=\"flex:1\">"+bdg(x.type)+"<div class=\"m4atitle\">"+(x.title||"")+"</div>"+(x.place?"<div class=\"m4aplace\">"+x.place+"</div>":"")+"</div></div>";});
  var ce=a.filter(function(x){return x.type==="evento";}).length;
  var cp=a.filter(function(x){return x.type==="publicacion"||x.type==="pub";}).length;
  var cc=a.filter(function(x){return x.type==="cobertura"||x.type==="cob";}).length;
  return "<div class=\"m4gdetail\"><div class=\"m4dbox\"><div class=\"m4dhdr\"><div><div class=\"m4dtitle\">"+dl+" - "+an.toUpperCase()+"</div><div style=\"font-size:.75rem;color:#888;margin-top:2px\">Actividades desde las 15:00 hs</div></div><button class=\"m4dwa\" onclick=\"window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; Enviar WA</button></div><div class=\"m4alist\">"+ah+"</div></div>"
    +"<div class=\"m4sidebar\"><div class=\"m4sum\"><h3>Resumen</h3><div class=\"m4srow\"><span>Total</span><span class=\"m4sval\">"+a.length+"</span></div><div class=\"m4srow\"><span>Eventos</span><span class=\"m4sval\">"+ce+"</span></div><div class=\"m4srow\"><span>Pubs</span><span class=\"m4sval\">"+cp+"</span></div><div class=\"m4srow\"><span>Coberturas</span><span class=\"m4sval\">"+cc+"</span></div></div>"
    +"<div class=\"m4agcard\"><div class=\"m4agav\">"+in2+"</div><div class=\"m4agname\">"+an+"</div><div class=\"m4agrole\">"+ar+"</div><button class=\"m4agwa\" onclick=\"window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; WhatsApp</button></div></div></div>";
}

function buildGuardia(){
  var gp=document.querySelector("#p-guardias");
  if(!gp||getComputedStyle(gp).display==="none") return;
  var prev=document.querySelector("#m4g"); if(prev) prev.remove();
  var old=document.querySelector("#m4gwrap"); if(old) old.remove();
  gp.querySelectorAll(".ptop,.gw-navrow,.gw-desktop,.gw-mobile,.acts,#m1-pubs-guardias").forEach(function(el){el.style.setProperty("display","none","important");});
  var today=new Date(),ts=fmtD(today),days=getWeekDays(m4gWeekOff);
  if(!m4gSelDay||!days.find(function(d){return fmtD(d)===m4gSelDay;})){var ti=days.find(function(d){return fmtD(d)===ts;});m4gSelDay=ti?ts:fmtD(days[0]);}
  var p=document.createElement("div"); p.id="m4g";
  p.innerHTML="<div class=\"m4gh\"><div><h2>&#128737; Guardias Semanales</h2><p>Actividades desde las 15:00 hs</p></div><button onclick=\"m4gWeekOff=0;m4gSelDay=null;buildGuardia()\" style=\"background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer\">&#128472;</button></div>"
    +"<div class=\"m4gnav\"><button onclick=\"m4gWeekOff--;buildGuardia()\">&larr; Ant</button><div class=\"m4gwrange\">"+fmtWeek(days)+"</div><button onclick=\"m4gWeekOff++;buildGuardia()\">Sig &rarr;</button><button class=\"m4ghoy\" onclick=\"m4gWeekOff=0;m4gSelDay=null;buildGuardia()\">Hoy</button></div>"
    +"<div class=\"m4gdays\">"+days.map(function(d){return dayCard(d,days,fmtD(d)===ts,fmtD(d)===m4gSelDay);}).join("")+"</div>"
    +"<div id=\"m4gdwrap\">"+dayDetail(m4gSelDay,days)+"</div>";
  gp.insertBefore(p,gp.firstChild);
  window.m4gSel=function(ds){
    m4gSelDay=ds;
    document.querySelectorAll(".m4gday").forEach(function(x){x.classList.toggle("m4active",x.dataset.date===ds);});
    var w=document.querySelector("#m4gdwrap"); if(w) w.innerHTML=dayDetail(ds,days);
  };
}

/* INIT */
function init(){
  inyectarCSS();
  parchearNav();
  checkTablero();
  ocultarRealizada();
  var gp=document.querySelector("#p-guardias");
  if(gp&&getComputedStyle(gp).display!=="none") buildGuardia();
  var obs=new MutationObserver(function(){
    checkTablero(); ocultarRealizada();
    var g=document.querySelector("#p-guardias");
    if(g&&getComputedStyle(g).display!=="none"&&!document.querySelector("#m4g")) buildGuardia();
  });
  document.querySelectorAll("[id^=p-]").forEach(function(el){obs.observe(el,{attributes:true,attributeFilter:["style","class"]});});
  var main=document.querySelector("#main,main,.main-content"); if(main) obs.observe(main,{childList:true,subtree:false,attributes:true,attributeFilter:["style","class"]});
  var n=0,iv=setInterval(function(){
    checkTablero(); ocultarRealizada();
    var g=document.querySelector("#p-guardias");
    if(g&&getComputedStyle(g).display!=="none"&&!document.querySelector("#m4g")) buildGuardia();
    if(++n>=20) clearInterval(iv);
  },400);
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();

})();
