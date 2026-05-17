/* MEJORAS3.JS v10 */
(function(){"use strict";
function inyectarCSS(){if(document.getElementById("m4css"))return;
var s=document.createElement("style");s.id="m4css";var css="";
css+="#p-guardias .gwtbl{display:none!important}\n";
css+="#p-guardias .ptop,#p-guardias .ptitle{display:none!important}\n";
css+="#p-guardias #m1-pubs-guardias{display:none!important}\n";
css+="body:not(.m4tab-tablero) #p-tablero{display:none!important}\n";
css+="body.m4tab-calendario #m1-pubs-guardias{display:none!important}\n";
css+="#m4g{padding:0;font-family:inherit}\n";
css+="#m4g .m4g-header{background:linear-gradient(135deg,#6c3fc5,#8b5cf6);color:#fff;padding:14px 18px;border-radius:12px;margin-bottom:14px}\n";
css+="#m4g .m4g-header h2{margin:0;font-size:1.1rem;font-weight:800}\n";
css+="#m4g .m4g-nav{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}\n";
css+="#m4g .m4g-navbtn{background:#fff;border:1px solid #d0d7de;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:.88rem}\n";
css+="#m4g .m4g-navbtn:hover{background:#f0f0f0}\n";
css+="#m4g .m4g-week{flex:1;text-align:center;font-weight:700;font-size:.95rem;color:#333}\n";
css+="#m4g .m4g-grid{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}\n";
css+="#m4g .m4g-card{flex:1;min-width:110px;background:#fff;border:2px solid #e2d8f7;border-radius:12px;padding:10px 8px;cursor:pointer;text-align:center;transition:.2s}\n";
css+="#m4g .m4g-card:hover{border-color:#6c3fc5}\n";
css+="#m4g .m4g-card.m4g-active{border-color:#6c3fc5;background:#f5f0ff}\n";
css+="#m4g .m4g-card.m4g-today{border-color:#f59e0b}\n";
css+="#m4g .m4g-card.m4g-today .m4g-cday{color:#f59e0b}\n";
css+="#m4g .m4g-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#6c3fc5;color:#fff;font-weight:700;font-size:.9rem;margin:0 auto 4px}\n";
css+="#m4g .m4g-cday{font-weight:700;font-size:.8rem;margin-bottom:2px;color:#444}\n";
css+="#m4g .m4g-cname{font-size:.75rem;font-weight:600;color:#333}\n";
css+="#m4g .m4g-crole{font-size:.65rem;color:#888;margin-bottom:4px}\n";
css+="#m4g .m4g-cbadge{display:inline-block;background:#6c3fc5;color:#fff;border-radius:20px;padding:1px 8px;font-size:.65rem;font-weight:700;margin-bottom:4px}\n";
css+="#m4g .m4g-wa{display:block;background:#25d366;color:#fff;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-decoration:none;margin-top:4px}\n";
css+="#m4g .m4g-wa:hover{background:#1da851}\n";
css+="#m4g .m4g-prensa{display:block;background:#f97316;color:#fff;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-align:center;cursor:pointer;border:none;width:100%;margin-top:3px}\n";
css+="#m4g .m4g-prensa:hover{background:#ea6c0a}\n";
css+="#m4g .m4g-detail{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:14px;margin-top:10px}\n";
css+="#m4g .m4g-detail-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px}\n";
css+="#m4g .m4g-detail-title{font-weight:700;font-size:.95rem;color:#333}\n";
css+="#m4g .m4g-wa-big{background:#25d366;color:#fff;border:none;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:.82rem;font-weight:700}\n";
css+="#m4g .m4g-wa-big:hover{background:#1da851}\n";
css+="#m4g .m4g-empty{text-align:center;color:#aaa;padding:24px;font-size:.9rem}\n";
css+="#m4g .m4g-act{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid #f3f0fb}\n";
css+="#m4g .m4g-act:last-child{border-bottom:none}\n";
css+="#m4g .m4g-act-time{font-size:.8rem;font-weight:700;color:#6c3fc5;min-width:42px}\n";
css+="#m4g .m4g-act-body{flex:1}\n";
css+="#m4g .m4g-act-name{font-size:.85rem;font-weight:600;color:#222}\n";
css+="#m4g .m4g-badge{display:inline-block;border-radius:4px;padding:1px 6px;font-size:.62rem;font-weight:700;margin-right:4px}\n";
css+="#m4g .m4g-badge-ev{background:#dbeafe;color:#2563eb}\n";
css+="#m4g .m4g-badge-cob{background:#ede9fe;color:#6c3fc5}\n";
css+="#m4g .m4g-badge-pub{background:#fef3c7;color:#d97706}\n";
css+="#m4g .m4g-act-actions{display:flex;gap:4px;margin-left:auto;align-items:flex-start}\n";
css+="#m4g .m4g-act-btn{background:none;border:1px solid #ddd;border-radius:6px;padding:2px 6px;cursor:pointer;font-size:.75rem;color:#666}\n";
css+="#m4g .m4g-act-btn:hover{background:#f5f5f5;border-color:#999}\n";
css+="#m4g .m4g-act-btn.m4g-del{color:#dc2626;border-color:#fca5a5}\n";
css+="#m4g .m4g-act-btn.m4g-del:hover{background:#fef2f2}\n";
css+="#m4g .m4g-sidebar{min-width:180px;max-width:220px}\n";
css+="#m4g .m4g-resumen{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;margin-bottom:10px}\n";
css+="#m4g .m4g-resumen h4{margin:0 0 8px;font-size:.85rem;font-weight:700;color:#333}\n";
css+="#m4g .m4g-res-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:.8rem;color:#555}\n";
css+="#m4g .m4g-res-num{background:#6c3fc5;color:#fff;border-radius:10px;padding:1px 8px;font-size:.7rem;font-weight:700}\n";
css+="#m4g .m4g-agent-card{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;text-align:center}\n";
css+="#m4g .m4g-agent-av{width:44px;height:44px;border-radius:50%;background:#6c3fc5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;margin:0 auto 6px}\n";
css+="#m4g .m4g-agent-name{font-weight:700;font-size:.9rem;color:#333}\n";
css+="#m4g .m4g-agent-role{font-size:.75rem;color:#888;margin-bottom:8px}\n";
css+="#m4g .m4g-layout{display:flex;gap:12px;align-items:flex-start}\n";
css+="#m4g .m4g-main{flex:1;min-width:0}\n";
s["textContent"]=css;document.head.appendChild(s);}
function interceptFetch(){
if(window._m4fpatched)return;window._m4fpatched=true;
window._m4gcal=window._m4gcal||[];
var of=window.fetch;
window.fetch=function(){
var args=arguments;var url=args[0]||"";
var p=of.apply(this,args);
if(typeof url==="string"&&url.indexOf("googleapis.com/calendar")>-1){
p.then(function(r){var rc=r.clone();rc.json().then(function(d){
if(d&&d.items){d.items.forEach(function(ev){window._m4gcal.push(ev);});
if(window._m4renderPending){window._m4renderPending=false;renderM4G();}
}}).catch(function(){});}).catch(function(){});
}return p;};
}
function extractDays(){
var gp=document.getElementById("p-guardias");
if(!gp)return[];
var gwds=gp.querySelectorAll(".gwtbl .gwd");
var days=[];
gwds.forEach(function(gwd){
var gwag=gwd.querySelector(".gwag");if(!gwag)return;
var nc=gwag.cloneNode(true);
var rs=nc.querySelector(".gwrole");if(rs)rs.remove();
var name=nc.textContent.trim();
var roleEl=gwag.querySelector(".gwrole");
var role=roleEl?roleEl.textContent.trim():"";
var waLink="";var aEls=gwd.querySelectorAll("a");
aEls.forEach(function(a){if(a.href&&a.href.indexOf("whatsapp")>-1)waLink=a.href;});
var dateStr="";var editBtns=gwd.querySelectorAll("[onclick]");
editBtns.forEach(function(b){var oc=b.getAttribute("onclick");
var m=oc&&oc.match(/['"]([\d]{4}-[\d]{2}-[\d]{2})['"]/);
if(m&&!dateStr)dateStr=m[1];});
if(!dateStr){var hEl=gwd.querySelector(".gwdate,.gwhd");
if(hEl)dateStr=hEl.getAttribute("data-date")||"";}
var cobDiv=null;var divs=gwd.querySelectorAll("div");
divs.forEach(function(d){if(d.textContent.indexOf("Coberturas del")>-1)cobDiv=d;});
var cobs=[];
if(cobDiv){var rows=cobDiv.querySelectorAll(".gwact,.gwrow,li");
if(rows.length===0){var ch=Array.from(cobDiv.children);
ch.forEach(function(c,i){if(i>0){
var title=c.children&&c.children[1]?c.children[1].children[0].textContent.trim():c.textContent.trim();
var time=c.children&&c.children[1]&&c.children[1].children[1]?c.children[1].children[1].textContent.replace(/[^\d:]/g,"").trim():"00:00";
if(title)cobs.push({title:title,time:time||"00:00"});
}});}else{rows.forEach(function(r){
var t=r.textContent.trim();if(t)cobs.push({title:t,time:"00:00"});});}}
days.push({name:name,role:role,waLink:waLink,dateStr:dateStr,cobs:cobs});
});
return days;}
function getCalEvts(iso){
var evs=window._m4gcal||[];
return evs.filter(function(ev){
var dt=ev.start&&ev.start.dateTime?ev.start.dateTime:"";
var d=ev.start&&ev.start.date?ev.start.date:"";
return (dt&&dt.indexOf(iso)>-1)||(d&&d===iso);
}).map(function(ev){
var dt=ev.start&&ev.start.dateTime?ev.start.dateTime:"";
var t="00:00";
if(dt){var m=dt.match(/T(\d{2}:\d{2})/);if(m)t=m[1];}
return {title:ev.summary||"Evento",time:t,type:"ev",id:ev.id||""};
});}
function getPubs(iso){
var pubs=[];try{
var keys=Object.keys(localStorage);
keys.forEach(function(k){
var v=localStorage.getItem(k);if(!v)return;
try{var obj=JSON.parse(v);
if(Array.isArray(obj)){obj.forEach(function(p){
var pd=p.fecha||p.date||p.scheduledDate||"";
if(pd&&pd.indexOf(iso)>-1){
pubs.push({title:p.titulo||p.title||p.contenido||"Publicacion",time:p.hora||p.time||"20:00",type:"pub",id:p.id||k+"_"+pubs.length});
}});}}catch(e){}
});
}catch(e){}
return pubs;}
function todayISO(){var n=new Date();
return n.getFullYear()+"-"+(n.getMonth()<9?"0":"")+(n.getMonth()+1)+"-"+(n.getDate()<10?"0":"")+n.getDate();}
function fmtDate(iso){
var ds=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
var ms=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var p=iso.split("-");var d=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));
return ds[d.getDay()]+" "+d.getDate()+" DE "+ms[d.getMonth()].toUpperCase();}
function initials(n){var w=n.trim().split(" ");
return (w[0]?w[0][0]:"")+(w[1]?w[1][0]:"");}
var _m4selDay="";
var _m4days=[];
function renderM4G(){
var gp=document.getElementById("p-guardias");if(!gp)return;
var old=document.getElementById("m4g");if(old)old.remove();
_m4days=extractDays();
if(!_m4days.length){window._m4renderPending=true;return;}
var today=todayISO();
if(!_m4selDay||!_m4days.find(function(d){return d.dateStr===_m4selDay;})){
var td=_m4days.find(function(d){return d.dateStr===today;});
_m4selDay=td?td.dateStr:(_m4days[0]?_m4days[0].dateStr:"");}
var wrap=document.createElement("div");wrap.id="m4g";
var wfirst=_m4days[0]?_m4days[0].dateStr:"";
var wlast=_m4days[_m4days.length-1]?_m4days[_m4days.length-1].dateStr:"";
var wlabel="";
if(wfirst&&wlast){var pa=wfirst.split("-");var pb=wlast.split("-");
wlabel=parseInt(pa[2])+" "+["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"][parseInt(pa[1])-1];
wlabel+=" \u2014 "+parseInt(pb[2])+" "+["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"][parseInt(pb[1])-1]+" "+pb[0];}
var hh="<div class=\"m4g-header\"><h2>\uD83D\uDEE1\uFE0F Guardias Semanales</h2><div style=\"font-size:.8rem;opacity:.85\">Actividades semanales</div></div>";
var nv="<div class=\"m4g-nav\"><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(-1)\">\u2039 Ant</button><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(0)\">Hoy</button><div class=\"m4g-week\">"+wlabel+"</div><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(1)\">Sig \u203a</button></div>";
var dayAbbr=["DOM","LUN","MAR","MIE","JUE","VIE","SAB"];
var grid="<div class=\"m4g-grid\">";
_m4days.forEach(function(day){
var p=day.dateStr.split("-");
var dobj=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));
var dw=dayAbbr[dobj.getDay()];
var dn=dobj.getDate();
var isWE=(dobj.getDay()===0||dobj.getDay()===6);
var calEvts=getCalEvts(day.dateStr);
var pubEvts=getPubs(day.dateStr);
var allActs=calEvts.concat(pubEvts).concat(day.cobs.map(function(c){return {title:c.title,time:c.time,type:"cob"};}));
if(!isWE)allActs=allActs.filter(function(a){return a.time>="15:00";});
var cnt=allActs.length;
var isToday=(day.dateStr===today);
var isActive=(day.dateStr===_m4selDay);
var cls="m4g-card"+(isToday?" m4g-today":"")+(isActive?" m4g-active":"");
var av=initials(day.name).toUpperCase()||"?";
var waPhone=day.waLink.replace(/[^\d]/g,"");
var waMsg=encodeURIComponent("Guardia del dia "+fmtDate(day.dateStr)+" - "+day.name);
var waUrl=waPhone?"https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+waPhone+"&text="+waMsg:"#";
var prMsg=encodeURIComponent("Cobertura de prensa - "+fmtDate(day.dateStr)+"\n\nHola "+day.name+", te avisamos que tenes cobertura de prensa asignada para hoy.\nCualquier consulta coordinamos por aca.");
var prUrl=waPhone?"https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+waPhone+"&text="+prMsg:"#";
grid+="<div class=\""+cls+"\" onclick=\"m4gSelectDay('"+day.dateStr+"')\">";
grid+="<div class=\"m4g-cday\">"+dw+"<br>"+dn+"</div>";
grid+="<div class=\"m4g-avatar\">"+av+"</div>";
grid+="<div class=\"m4g-cname\">"+day.name+"</div>";
grid+="<div class=\"m4g-crole\">"+day.role+"</div>";
grid+="<div class=\"m4g-cbadge\">"+cnt+" act.</div>";
grid+="<a class=\"m4g-wa\" href=\""+waUrl+"\" target=\"_blank\" onclick=\"event.stopPropagation()\">\uD83D\uDCAC WhatsApp</a>";
grid+="<button class=\"m4g-prensa\" onclick=\"event.stopPropagation();window.open('"+prUrl+"','_blank')\">\uD83D\uDCF0 Cubrir con Prensa</button>";
grid+="</div>";
});
grid+="</div>";
var selDay=_m4days.find(function(d){return d.dateStr===_m4selDay;})||_m4days[0];
var detailHtml="";
if(selDay){
var p=selDay.dateStr.split("-");
var dobj2=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));
var isWE2=(dobj2.getDay()===0||dobj2.getDay()===6);
var calE=getCalEvts(selDay.dateStr);
var pubE=getPubs(selDay.dateStr);
var cobE=selDay.cobs.map(function(c){return {title:c.title,time:c.time,type:"cob"};});
var combined=calE.concat(pubE).concat(cobE);
if(!isWE2)combined=combined.filter(function(a){return a.time>="15:00";});
combined.sort(function(a,b){return a.time<b.time?-1:a.time>b.time?1:0;});
var waPhone2=selDay.waLink.replace(/[^\d]/g,"");
var waLines=["\uD83D\uDEE1\uFE0F *Guardia del dia* \u2014 "+fmtDate(selDay.dateStr),"","Hola "+selDay.name+", sos la guardia *"+selDay.role+"* hoy.","","\uD83D\uDCC5 Resumen del dia:"];
combined.forEach(function(a){waLines.push("\u2022 "+a.time+" "+a.title);});
if(!combined.length)waLines.push("\u2022 Sin actividades programadas");
var waBigMsg=encodeURIComponent(waLines.join("\n"));
var waBigUrl=waPhone2?"https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+waPhone2+"&text="+waBigMsg:"#";
var dTitle=fmtDate(selDay.dateStr).toUpperCase()+" - "+selDay.name.toUpperCase()+" ("+selDay.role+")";
detailHtml="<div class=\"m4g-layout\">";
detailHtml+="<div class=\"m4g-main\">";
detailHtml+="<div class=\"m4g-detail\">";
detailHtml+="<div class=\"m4g-detail-header\">";
detailHtml+="<div class=\"m4g-detail-title\">"+dTitle+"</div>";
detailHtml+="<button class=\"m4g-wa-big\" onclick=\"window.open('"+waBigUrl+"','_blank')\">\uD83D\uDCAC Enviar WhatsApp</button>";
detailHtml+="</div>";
if(!combined.length){
detailHtml+="<div class=\"m4g-empty\">Sin actividades</div>";
}else{
combined.forEach(function(a){
var badgeCls=a.type==="ev"?"m4g-badge-ev":a.type==="pub"?"m4g-badge-pub":"m4g-badge-cob";
var badgeTxt=a.type==="ev"?"EVENTO":a.type==="pub"?"PUBLICACION":"COBERTURA";
detailHtml+="<div class=\"m4g-act\">";
detailHtml+="<div class=\"m4g-act-time\">"+a.time+"</div>";
detailHtml+="<div class=\"m4g-act-body\">";
detailHtml+="<span class=\"m4g-badge "+badgeCls+"\">"+badgeTxt+"</span>";
detailHtml+="<span class=\"m4g-act-name\">"+a.title+"</span>";
detailHtml+="</div>";
if(a.type==="pub"){
detailHtml+="<div class=\"m4g-act-actions\">";
detailHtml+="<button class=\"m4g-act-btn\" title=\"Modificar\" onclick=\"m4gEditPub('"+a.id+"')\"  >\u270F\uFE0F</button>";
detailHtml+="<button class=\"m4g-act-btn m4g-del\" title=\"Eliminar\" onclick=\"m4gDelPub('"+a.id+"','"+selDay.dateStr+"')\" >\uD83D\uDDD1\uFE0F</button>";
detailHtml+="</div>";
}
detailHtml+="</div>";
});
}
detailHtml+="</div>";
detailHtml+="</div>";
var evCnt=combined.filter(function(a){return a.type==="ev";}).length;
var pubCnt=combined.filter(function(a){return a.type==="pub";}).length;
var cobCnt=combined.filter(function(a){return a.type==="cob";}).length;
var av2=initials(selDay.name).toUpperCase()||"?";
detailHtml+="<div class=\"m4g-sidebar\">";
detailHtml+="<div class=\"m4g-resumen\"><h4>Resumen del dia</h4>";
detailHtml+="<div class=\"m4g-res-row\"><span>Total</span><span class=\"m4g-res-num\">"+combined.length+"</span></div>";
detailHtml+="<div class=\"m4g-res-row\"><span>Eventos</span><span class=\"m4g-res-num\">"+evCnt+"</span></div>";
detailHtml+="<div class=\"m4g-res-row\"><span>Publicaciones</span><span class=\"m4g-res-num\">"+pubCnt+"</span></div>";
detailHtml+="<div class=\"m4g-res-row\"><span>Coberturas</span><span class=\"m4g-res-num\">"+cobCnt+"</span></div>";
detailHtml+="</div>";
detailHtml+="<div class=\"m4g-agent-card\">";
detailHtml+="<div class=\"m4g-agent-av\">"+av2+"</div>";
detailHtml+="<div class=\"m4g-agent-name\">"+selDay.name+"</div>";
detailHtml+="<div class=\"m4g-agent-role\">"+selDay.role+"</div>";
var waPhone3=selDay.waLink.replace(/[^\d]/g,"");
var waUrl3=waPhone3?"https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+waPhone3:"#";
detailHtml+="<a class=\"m4g-wa\" href=\""+waUrl3+"\" target=\"_blank\">\uD83D\uDCAC WhatsApp</a>";
detailHtml+="</div>";
detailHtml+="</div>";
detailHtml+="</div>";
}
wrap.innerHTML=hh+nv+grid+detailHtml;
gp.insertBefore(wrap,gp.firstChild);
}
window.m4gSelectDay=function(iso){_m4selDay=iso;renderM4G();};
window.m4gDelPub=function(id,iso){
if(!confirm("Eliminar esta publicacion?"))return;
try{var keys=Object.keys(localStorage);
keys.forEach(function(k){
var v=localStorage.getItem(k);if(!v)return;
try{var arr=JSON.parse(v);if(!Array.isArray(arr))return;
var orig=arr.length;
arr=arr.filter(function(p){return (p.id||"")!==id;});
if(arr.length<orig){localStorage.setItem(k,JSON.stringify(arr));
alert("Publicacion eliminada");_m4selDay=iso;renderM4G();}
}catch(e){}});
}catch(e){alert("No se pudo eliminar");}};
window.m4gEditPub=function(id){
try{var keys=Object.keys(localStorage);
keys.forEach(function(k){
var v=localStorage.getItem(k);if(!v)return;
try{var arr=JSON.parse(v);if(!Array.isArray(arr))return;
var pub=arr.find(function(p){return (p.id||"")===id;});
if(pub){
var nt=prompt("Titulo de la publicacion:",pub.titulo||pub.title||"");
if(nt===null)return;
var nh=prompt("Hora (HH:MM):",pub.hora||pub.time||"20:00");
if(nh===null)return;
pub.titulo=nt;pub.title=nt;pub.hora=nh;pub.time=nh;
localStorage.setItem(k,JSON.stringify(arr));
alert("Publicacion actualizada");renderM4G();}
}catch(e){}});
}catch(e){alert("No se pudo editar");}};
function inyectarHoyCalendario(){
var hoyDiv=document.getElementById("p-hoy");if(!hoyDiv)return;
var calDiv=hoyDiv.querySelector("#hoy-cal-m4g");
if(!calDiv){calDiv=document.createElement("div");calDiv.id="hoy-cal-m4g";
calDiv.style.cssText="background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;margin-top:10px;";
hoyDiv.appendChild(calDiv);}
var today=todayISO();
var evs=getCalEvts(today);
if(!evs.length){calDiv.innerHTML="<div style=\"color:#aaa;font-size:.85rem;padding:8px 0\">Sin eventos de calendario hoy</div>";return;}
var html="<h4 style=\"margin:0 0 8px;font-size:.85rem;font-weight:700;color:#6c3fc5\">\uD83D\uDCC5 Eventos hoy del calendario</h4>";
evs.sort(function(a,b){return a.time<b.time?-1:1;});
evs.forEach(function(e){html+="<div style=\"display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #f3f0fb\"><span style=\"color:#6c3fc5;font-weight:700;font-size:.8rem;min-width:42px\">"+e.time+"</span><span style=\"font-size:.83rem;color:#222\">"+e.title+"</span></div>";});
calDiv.innerHTML=html;}
function fixKanbanScroll(){
if(window._m4kanbanPatched)return;window._m4kanbanPatched=true;
var ork=window.renderKanban;
if(typeof ork==="function"){
window.renderKanban=function(){
var sp=window.scrollY;
ork.apply(this,arguments);
setTimeout(function(){window.scrollTo(0,sp);},50);
};}
}
function patchGoGuardWeek(){
if(window._m4gwPatched)return;window._m4gwPatched=true;
var og=window.goGuardWeek;
if(typeof og==="function"){
window.goGuardWeek=function(dir){
_m4selDay="";
og.apply(this,arguments);
setTimeout(function(){renderM4G();},900);
};}
}
function hideRealizada(){
var cols=document.querySelectorAll(".kanban-col,.kboard-col,[data-status]");
cols.forEach(function(c){
var h=c.querySelector("h3,h4,.col-header,.kboard-title");
if(h&&h.textContent.trim().toLowerCase().indexOf("realiz")>-1)c.style.display="none";
});
}
function setTabClass(id){
document.body.className=document.body.className.replace(/m4tab-\S+/g,"").trim();
document.body.classList.add("m4tab-"+id);
}
function patchNav(){
if(window._m4navPatched)return;window._m4navPatched=true;
var on=window.nav;
if(typeof on==="function"){
window.nav=function(id){
setTabClass(id);
on.apply(this,arguments);
if(id==="guardias"){setTimeout(function(){renderM4G();},400);}
if(id==="tablero"){setTimeout(function(){hideRealizada();},300);}
if(id==="hoy"){setTimeout(function(){inyectarHoyCalendario();},400);}
};}
}
function patchSyncGCal(){
if(window._m4syncPatched)return;window._m4syncPatched=true;
var os=window.syncGCal;
if(typeof os==="function"){
window.syncGCal=function(){
window._m4gcal=[];
os.apply(this,arguments);
setTimeout(function(){
if(document.getElementById("p-guardias")&&document.body.classList.contains("m4tab-guardias")){
renderM4G();}
inyectarHoyCalendario();
},2000);
};}
}
function init(){
interceptFetch();
inyectarCSS();
fixKanbanScroll();
patchNav();
patchGoGuardWeek();
patchSyncGCal();
var tabs=["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","recursos"];
tabs.forEach(function(t){
var el=document.getElementById("p-"+t);
if(el&&(el.style.display!=="none"&&el.offsetParent!==null)){setTabClass(t);}
});
setTimeout(function(){
renderM4G();
inyectarHoyCalendario();
hideRealizada();
},600);
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}
else{init();}
})();
