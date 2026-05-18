/* MEJORAS3.JS v12b */
(function(){"use strict";
function inyectarCSS(){
if(document.getElementById("m4css"))return;
var s=document.createElement("style");s.id="m4css";var css="";
css+="#p-guardias .gwtbl{display:none!important}\n";
css+="#p-guardias .ptop,#p-guardias .ptitle{display:none!important}\n";
css+="#p-guardias #m1-pubs-guardias{display:none!important}\n";
css+="body:not(.m4tab-tablero) #p-tablero{display:none!important}\n";
css+=".kanban>.kcol{flex:none!important;width:265px!important;max-width:265px!important;min-width:265px!important}\n";
css+="#m4g{padding:0;font-family:inherit}\n";
css+="#m4g .m4g-header{background:linear-gradient(135deg,#6c3fc5,#8b5cf6);color:#fff;padding:14px 18px;border-radius:12px;margin-bottom:14px}\n";
css+="#m4g .m4g-header h2{margin:0;font-size:1.1rem;font-weight:800}\n";
css+="#m4g .m4g-nav{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}\n";
css+="#m4g .m4g-navbtn{background:#fff;border:1px solid #d0d7de;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:.88rem}\n";
css+="#m4g .m4g-navbtn:hover{background:#f0f0f0}\n";
css+="#m4g .m4g-week{flex:1;text-align:center;font-weight:700;font-size:.95rem;color:#333}\n";
css+="#m4g .m4g-grid{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}\n";
css+="#m4g .m4g-card{flex:1;min-width:115px;background:#fff;border:2px solid #e2d8f7;border-radius:12px;padding:10px 8px;cursor:pointer;text-align:center;transition:.2s}\n";
css+="#m4g .m4g-card:hover{border-color:#6c3fc5}\n";
css+="#m4g .m4g-card.m4g-active{border-color:#6c3fc5;background:#f5f0ff}\n";
css+="#m4g .m4g-card.m4g-today{border-color:#f59e0b}\n";
css+="#m4g .m4g-card.m4g-today .m4g-cday{color:#f59e0b}\n";
css+="#m4g .m4g-card.m4g-cob-on{border-color:#6c3fc5!important;background:#f5f0ff!important}\n";
css+="#m4g .m4g-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#6c3fc5;color:#fff;font-weight:700;font-size:.9rem;margin:0 auto 4px}\n";
css+="#m4g .m4g-cday{font-weight:700;font-size:.8rem;margin-bottom:2px;color:#444}\n";
css+="#m4g .m4g-cname{font-size:.75rem;font-weight:600;color:#333;display:block}\n";
css+="#m4g .m4g-crole{font-size:.65rem;color:#888;margin-bottom:4px;display:block}\n";
css+="#m4g .m4g-cbadge{display:inline-block;background:#6c3fc5;color:#fff;border-radius:20px;padding:1px 8px;font-size:.65rem;font-weight:700;margin-bottom:4px}\n";
css+="#m4g .m4g-wa{display:block;background:#25d366;color:#fff;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-decoration:none;margin-top:4px}\n";
css+="#m4g .m4g-wa:hover{background:#1da851}\n";
css+="#m4g .m4g-wa-dis{display:block;background:#e5e7eb;color:#9ca3af;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-align:center;margin-top:4px;cursor:not-allowed}\n";
css+="#m4g .m4g-cob-btn{display:block;background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-align:center;cursor:pointer;width:100%;margin-top:3px;box-sizing:border-box}\n";
css+="#m4g .m4g-cob-btn.on{background:#6c3fc5;color:#fff;border-color:#6c3fc5}\n";
css+="#m4g .m4g-act-cob{background:none;border:1px solid #e5e7eb;border-radius:6px;padding:2px 6px;cursor:pointer;font-size:.7rem;color:#9ca3af;margin-left:4px;white-space:nowrap}\n";
css+="#m4g .m4g-act-cob.on{background:#ede9fe;color:#6c3fc5;border-color:#6c3fc5;font-weight:700}\n";
css+="#m4g .m4g-detail{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:14px;margin-top:10px}\n";
css+="#m4g .m4g-detail-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px}\n";
css+="#m4g .m4g-detail-title{font-weight:700;font-size:.95rem;color:#333}\n";
css+="#m4g .m4g-wa-big{background:#25d366;color:#fff;border:none;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:.82rem;font-weight:700}\n";
css+="#m4g .m4g-wa-big:disabled{background:#d1d5db;color:#9ca3af;cursor:not-allowed}\n";
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
css+="#m4g .m4g-act-actions{display:flex;gap:4px;margin-left:auto;align-items:flex-start;flex-wrap:wrap;justify-content:flex-end}\n";
css+="#m4g .m4g-act-btn{background:none;border:1px solid #ddd;border-radius:6px;padding:2px 6px;cursor:pointer;font-size:.75rem;color:#666}\n";
css+="#m4g .m4g-act-btn.m4g-del{color:#dc2626;border-color:#fca5a5}\n";
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
css+="#hoy-cal-m4g{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;margin-bottom:12px}\n";
css+="#hoy-cal-m4g .hcm-ev{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f3f0fb}\n";
css+="#hoy-cal-m4g .hcm-ev:last-child{border-bottom:none}\n";
css+="#hoy-cal-m4g .hcm-time{color:#2563eb;font-weight:700;font-size:.8rem;min-width:42px}\n";
css+="#hoy-cal-m4g .hcm-title{font-size:.83rem;color:#222;flex:1}\n";
css+="#hoy-cal-m4g .hcm-cob-btn{background:none;border:1px solid #e5e7eb;border-radius:6px;padding:2px 7px;cursor:pointer;font-size:.7rem;color:#9ca3af;white-space:nowrap}\n";
css+="#hoy-cal-m4g .hcm-cob-btn.on{background:#ede9fe;color:#6c3fc5;border-color:#6c3fc5;font-weight:700}\n";
css+="#hoy-tasks-m4g{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;margin-bottom:12px}\n";
css+="#hoy-tasks-m4g .htm-header{font-size:.88rem;font-weight:700;color:#6c3fc5;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}\n";
css+="#hoy-tasks-m4g .htm-task{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid #f3f0fb;cursor:pointer}\n";
css+="#hoy-tasks-m4g .htm-task:last-child{border-bottom:none}\n";
css+="#hoy-tasks-m4g .htm-prio{display:inline-block;border-radius:4px;padding:1px 6px;font-size:.6rem;font-weight:700;flex-shrink:0;margin-top:2px}\n";
css+="#hoy-tasks-m4g .htm-prio-alta{background:#fee2e2;color:#dc2626}\n";
css+="#hoy-tasks-m4g .htm-prio-media{background:#fef3c7;color:#d97706}\n";
css+="#hoy-tasks-m4g .htm-prio-baja{background:#dcfce7;color:#16a34a}\n";
css+="#hoy-tasks-m4g .htm-title{font-size:.82rem;color:#222;flex:1;line-height:1.3}\n";
css+="#hoy-tasks-m4g .htm-status{font-size:.68rem;color:#888;flex-shrink:0}\n";
css+="#hoy-tasks-m4g .htm-more{font-size:.75rem;color:#6c3fc5;text-align:center;padding:4px;cursor:pointer;font-weight:600}\n";
s["textContent"]=css;document.head.appendChild(s);
}
function getPrensa(k){try{return localStorage.getItem("m4p_"+k)==="1";}catch(e){return false;}}
function setPrensa(k,v){try{localStorage.setItem("m4p_"+k,v?"1":"0");}catch(e){}}
function interceptFetch(){
if(window._m4fpatched)return;window._m4fpatched=true;
window._m4gcal=window._m4gcal||[];
var of=window.fetch;
window.fetch=function(){
var a2=arguments,u2=a2[0]||"";
var p2=of.apply(this,a2);
if(typeof u2==="string"&&u2.indexOf("googleapis.com/calendar")>-1){
p2.then(function(r){var rc=r.clone();rc.json().then(function(d){
if(d&&d.items){d.items.forEach(function(ev){window._m4gcal.push(ev);});
if(window._m4renderPending){window._m4renderPending=false;renderM4G();}
}}).catch(function(){});}).catch(function(){});
}return p2;};
}
function getKanbanTasks(){
var tasks=[];
var kanban=document.getElementById("kanban");if(!kanban)return tasks;
Array.from(kanban.children).forEach(function(col){
var hdr=col.querySelector(".khdr");
var hdrText=hdr?hdr.textContent.trim().toLowerCase():"";
if(hdrText.indexOf("realiz")>-1)return;
var kbody=col.querySelector(".kbody");if(!kbody)return;
var statusLabel=hdr?hdr.textContent.replace(/[0-9]/g,"").trim():"";
Array.from(kbody.children).forEach(function(card){
var oc=card.getAttribute("onclick");
var idm=oc&&oc.match(/editTask\(['"]([-\w]+)['"]\)/);
if(!idm)return;
var titleEl=card.querySelector(".tc-t");var title=titleEl?titleEl.textContent.trim().split("\n")[0].trim():"";
var prioEl=card.querySelector(".tg");var prio=prioEl?prioEl.textContent.trim().toLowerCase():"media";
var statEl=card.querySelector(".estado-selector");var stat=statEl?statEl.value||statusLabel:statusLabel;
if(title)tasks.push({id:idm[1],title:title,prio:prio,status:stat});
});
});
return tasks;
}
function extractDays(){
var gp=document.getElementById("p-guardias");
if(!gp)return[];
var days=[];
gp.querySelectorAll(".gwtbl .gwd").forEach(function(gwd){
var gwag=gwd.querySelector(".gwag");if(!gwag)return;
var ns=gwag.children[1];var name="",role="";
if(ns){
var re=ns.querySelector("span");role=re?re.textContent.trim():"";
var nc=ns.cloneNode(true);
var rs=nc.querySelector("span");if(rs)rs.remove();
nc.querySelectorAll("br").forEach(function(b){b.remove();});
name=nc.textContent.trim();
}
if(!name){var nc2=gwag.cloneNode(true);
nc2.querySelectorAll("span,div").forEach(function(e2){e2.remove();});
name=nc2.textContent.trim();}
var waLink="";
gwd.querySelectorAll("a").forEach(function(a){if(a.href&&a.href.indexOf("whatsapp")>-1)waLink=a.href;});
var dateStr="";
gwd.querySelectorAll("[onclick]").forEach(function(b){
var oc=b.getAttribute("onclick");
var mm=oc&&oc.match(/['"](\d{4}-\d{2}-\d{2})['"]/);
if(mm&&!dateStr)dateStr=mm[1];});
if(!dateStr){var hEl=gwd.querySelector(".gwdate,.gwhd");if(hEl)dateStr=hEl.getAttribute("data-date")||"";}  
var cobs=[];
days.push({name:name,role:role,waLink:waLink,dateStr:dateStr,cobs:cobs});
});
return days;
}
function getCalEvts(iso){
return (window._m4gcal||[]).filter(function(ev){
var dt=ev.start&&ev.start.dateTime?ev.start.dateTime:"";
var d=ev.start&&ev.start.date?ev.start.date:"";
return (dt&&dt.indexOf(iso)>-1)||(d&&d===iso);
}).map(function(ev){
var dt=ev.start&&ev.start.dateTime?ev.start.dateTime:"";
var t="00:00";if(dt){var mm=dt.match(/T(\d{2}:\d{2})/);if(mm)t=mm[1];}
return {title:ev.summary||"Evento",time:t,type:"ev",id:ev.id||""};
});
}
function getPubs(iso){
var pubs=[];
try{
Object.keys(localStorage).forEach(function(k){
if(k.indexOf("m4p_")===0)return;
var v=localStorage.getItem(k);if(!v)return;
try{
var obj=JSON.parse(v);
if(Array.isArray(obj)){
obj.forEach(function(p){
var pd=p.fecha||p.date||p.scheduledDate||"";
if(pd&&pd.indexOf(iso)>-1){
pubs.push({title:p.titulo||p.title||p.contenido||"Publicacion",time:p.hora||p.time||"20:00",type:"pub",id:p.id||k+"_"+pubs.length});
}
});
}
}catch(e2){}
});
}catch(e2){}
return pubs;
}
function todayISO(){
var n=new Date();
return n.getFullYear()+"-"+(n.getMonth()<9?"0":"")+(n.getMonth()+1)+"-"+(n.getDate()<10?"0":"")+n.getDate();
}
function fmtDate(iso){
var ds=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
var ms=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var pp=iso.split("-");
var d=new Date(parseInt(pp[0]),parseInt(pp[1])-1,parseInt(pp[2]));
return ds[d.getDay()]+" "+d.getDate()+" DE "+ms[d.getMonth()].toUpperCase();
}
function initials(n){
var w=n.trim().split(" ");
return (w[0]?w[0][0]:"")+(w[1]?w[1][0]:"");
}
function safeKey(s){return s.replace(/[^a-zA-Z0-9]/g,"").substring(0,12);}
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
_m4selDay=td?td.dateStr:(_m4days[0]?_m4days[0].dateStr:"");
}
var wrap=document.createElement("div");wrap.id="m4g";
var wf=_m4days[0]?_m4days[0].dateStr:"";
var wl=_m4days[_m4days.length-1]?_m4days[_m4days.length-1].dateStr:"";
var wlabel="";
if(wf&&wl){
var pa=wf.split("-"),pb=wl.split("-");
var mn=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
wlabel=parseInt(pa[2])+" "+mn[parseInt(pa[1])-1]+" \u2014 "+parseInt(pb[2])+" "+mn[parseInt(pb[1])-1]+" "+pb[0];
}
var hh="<div class=\"m4g-header\"><h2>\uD83D\uDEE1\uFE0F Guardias Semanales</h2><div style=\"font-size:.8rem;opacity:.85\">Actividades semanales</div></div>";
var nv="<div class=\"m4g-nav\"><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(-1)\">\u2039 Ant</button><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(0)\">Hoy</button><div class=\"m4g-week\">"+wlabel+"</div><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(1)\">Sig \u203a</button></div>";
var dayAbbr=["DOM","LUN","MAR","MIE","JUE","VIE","SAB"];
var grid="<div class=\"m4g-grid\">";
_m4days.forEach(function(day){
var pp=day.dateStr.split("-");
var dobj=new Date(parseInt(pp[0]),parseInt(pp[1])-1,parseInt(pp[2]));
var dw=dayAbbr[dobj.getDay()],dn=dobj.getDate();
var isWE=(dobj.getDay()===0||dobj.getDay()===6);
var allActs=getCalEvts(day.dateStr).concat(getPubs(day.dateStr)).concat(day.cobs.map(function(cc){return {title:cc.title,time:cc.time,type:"cob"};}));
if(!isWE)allActs=allActs.filter(function(a){return a.time>="15:00";});
var cnt=allActs.length;
var cobOn=getPrensa(day.dateStr);
var cls="m4g-card"+(day.dateStr===today?" m4g-today":"")+(day.dateStr===_m4selDay?" m4g-active":"")+(cobOn?" m4g-cob-on":"");
var av=initials(day.name).toUpperCase()||"?";
var wp=day.waLink.replace(/[^\d]/g,"");
var clbl=cobOn?"\u2705 Cubre \u2014 S\xED":"\uD83D\uDCCB Cubre \u2014 No";
var ccls="m4g-cob-btn"+(cobOn?" on":"");
var waHtml;
if(wp){
var wm=encodeURIComponent("Guardia del dia "+fmtDate(day.dateStr)+" - "+day.name);
var wu="https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+wp+"&text="+wm;
waHtml="<a class=\"m4g-wa\" href=\""+wu+"\" target=\"_blank\" onclick=\"event.stopPropagation()\">\uD83D\uDCAC WhatsApp</a>";
}else{
waHtml="<span class=\"m4g-wa-dis\">Sin tel.</span>";
}
grid+="<div class=\""+cls+"\" onclick=\"m4gSelectDay('"+day.dateStr+"')\">"
+"<div class=\"m4g-cday\">"+dw+"<br>"+dn+"</div>"
+"<div class=\"m4g-avatar\">"+av+"</div>"
+"<span class=\"m4g-cname\">"+day.name+"</span>"
+"<span class=\"m4g-crole\">"+day.role+"</span>"
+"<div class=\"m4g-cbadge\">"+cnt+" act.</div>"
+waHtml
+"<button class=\""+ccls+"\" onclick=\"event.stopPropagation();m4gTogglePrensa('"+day.dateStr+"')\">" + clbl + "</button>"
+"</div>";
});
grid+="</div>";
var sd=_m4days.find(function(d){return d.dateStr===_m4selDay;})||_m4days[0];
var detHtml="";
if(sd){
var p2=sd.dateStr.split("-");
var dobj2=new Date(parseInt(p2[0]),parseInt(p2[1])-1,parseInt(p2[2]));
var isWE2=(dobj2.getDay()===0||dobj2.getDay()===6);
var combined=getCalEvts(sd.dateStr).concat(getPubs(sd.dateStr)).concat(sd.cobs.map(function(cc){return {title:cc.title,time:cc.time,type:"cob"};}));
if(!isWE2)combined=combined.filter(function(a){return a.time>="15:00";});
combined.sort(function(a,b){return a.time<b.time?-1:a.time>b.time?1:0;});
var wp2=sd.waLink.replace(/[^\d]/g,"");
var wlines=["\uD83D\uDEE1\uFE0F *Guardia del d\u00eda* \u2014 "+fmtDate(sd.dateStr),""];
wlines.push("Hola "+sd.name+", sos la guardia *"+sd.role+"* hoy.");
wlines.push("");
wlines.push("\uD83D\uDCC5 Actividades desde las 15:00:");
combined.forEach(function(a){
var tipo=a.type==="ev"?"\uD83D\uDCC6":a.type==="pub"?"\uD83D\uDCF1":"\uD83D\uDCCB";
wlines.push(tipo+" "+a.time+" \u2014 "+a.title);
});
if(!combined.length)wlines.push("\u2022 Sin actividades programadas desde las 15:00");
var wbm=encodeURIComponent(wlines.join("\n"));
var waBtn;
if(wp2){
var wbu="https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+wp2+"&text="+wbm;
waBtn="<button class=\"m4g-wa-big\" onclick=\"window.open('"+wbu+"','_blank')\">\uD83D\uDCAC Enviar WhatsApp</button>";
}else{
waBtn="<button class=\"m4g-wa-big\" disabled>\uD83D\uDCAC Sin tel.</button>";
}
var dtitle=fmtDate(sd.dateStr).toUpperCase()+" - "+sd.name.toUpperCase()+" ("+sd.role+")";
detHtml="<div class=\"m4g-layout\">";
detHtml+="<div class=\"m4g-main\"><div class=\"m4g-detail\">";
detHtml+="<div class=\"m4g-detail-header\">";
detHtml+="<div class=\"m4g-detail-title\">"+dtitle+"</div>";
detHtml+=waBtn;
detHtml+="</div>";
if(!combined.length){
detHtml+="<div class=\"m4g-empty\">Sin actividades</div>";
}else{
combined.forEach(function(a){
var bc=a.type==="ev"?"m4g-badge-ev":a.type==="pub"?"m4g-badge-pub":"m4g-badge-cob";
var bt=a.type==="ev"?"EVENTO":a.type==="pub"?"PUBLICACION":"COBERTURA";
var pkey=sd.dateStr+"_"+safeKey(a.id||a.title);
var pOn=getPrensa(pkey);
var pLbl=pOn?"\u2705 Cobertura":"\uD83D\uDCCB Cobertura";
var pCls="m4g-act-cob"+(pOn?" on":"");
detHtml+="<div class=\"m4g-act\">";
detHtml+="<div class=\"m4g-act-time\">"+a.time+"</div>";
detHtml+="<div class=\"m4g-act-body\"><span class=\"m4g-badge "+bc+"\">"+bt+"</span> <span class=\"m4g-act-name\">"+a.title+"</span></div>";
detHtml+="<div class=\"m4g-act-actions\">";
detHtml+="<button class=\""+pCls+"\" onclick=\"m4gToggleActPrensa('"+pkey+"','"+sd.dateStr+"')\">" + pLbl + "</button>";
if(a.type==="pub"){
detHtml+="<button class=\"m4g-act-btn\" onclick=\"m4gEditPub('"+a.id+"')\">\u270F\uFE0F</button>";
detHtml+="<button class=\"m4g-act-btn m4g-del\" onclick=\"m4gDelPub('"+a.id+"','"+sd.dateStr+"')\">\uD83D\uDDD1\uFE0F</button>";
}
detHtml+="</div></div>";
});
}
detHtml+="</div></div>";
var evc=combined.filter(function(a){return a.type==="ev";}).length;
var pbc=combined.filter(function(a){return a.type==="pub";}).length;
var cbc=combined.filter(function(a){return a.type==="cob";}).length;
var prnCnt=combined.filter(function(a){return getPrensa(sd.dateStr+"_"+safeKey(a.id||a.title));}).length;
detHtml+="<div class=\"m4g-sidebar\"><div class=\"m4g-resumen\"><h4>Resumen del dia</h4>";
detHtml+="<div class=\"m4g-res-row\"><span>Total</span><span class=\"m4g-res-num\">"+combined.length+"</span></div>";
detHtml+="<div class=\"m4g-res-row\"><span>Eventos</span><span class=\"m4g-res-num\">"+evc+"</span></div>";
detHtml+="<div class=\"m4g-res-row\"><span>Publicaciones</span><span class=\"m4g-res-num\">"+pbc+"</span></div>";
detHtml+="<div class=\"m4g-res-row\"><span>Coberturas</span><span class=\"m4g-res-num\">"+cbc+"</span></div>";
if(prnCnt>0){detHtml+="<div class=\"m4g-res-row\"><span>\uD83D\uDCCB Cob.</span><span class=\"m4g-res-num\" style=\"background:#6c3fc5\">"+prnCnt+"</span></div>";}
detHtml+="</div>";
detHtml+="<div class=\"m4g-agent-card\">";
detHtml+="<div class=\"m4g-agent-av\">"+initials(sd.name).toUpperCase()+"</div>";
detHtml+="<div class=\"m4g-agent-name\">"+sd.name+"</div>";
detHtml+="<div class=\"m4g-agent-role\">"+sd.role+"</div>";
var wp3=sd.waLink.replace(/[^\d]/g,"");
if(wp3){
var wu3="https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+wp3;
detHtml+="<a class=\"m4g-wa\" href=\""+wu3+"\" target=\"_blank\">\uD83D\uDCAC WhatsApp</a>";
}else{
detHtml+="<span class=\"m4g-wa-dis\">Sin tel.</span>";
}
detHtml+="</div></div></div>";
}
wrap.innerHTML=hh+nv+grid+detHtml;
gp.insertBefore(wrap,gp.firstChild);
}
window.m4gSelectDay=function(iso){_m4selDay=iso;renderM4G();};
window.m4gTogglePrensa=function(iso){setPrensa(iso,!getPrensa(iso));renderM4G();};
window.m4gToggleActPrensa=function(key,iso){setPrensa(key,!getPrensa(key));_m4selDay=iso;renderM4G();};
window.m4gDelPub=function(id,iso){
if(!confirm("Eliminar esta publicacion?"))return;
try{Object.keys(localStorage).forEach(function(k){
if(k.indexOf("m4p_")===0)return;
var v=localStorage.getItem(k);if(!v)return;
try{var arr=JSON.parse(v);if(!Array.isArray(arr))return;
var orig=arr.length;
arr=arr.filter(function(p){return (p.id||"")!==id;});
if(arr.length<orig){localStorage.setItem(k,JSON.stringify(arr));
alert("Publicacion eliminada");_m4selDay=iso;renderM4G();}
}catch(e2){}});
}catch(e2){alert("No se pudo eliminar");}
};
window.m4gEditPub=function(id){
try{Object.keys(localStorage).forEach(function(k){
if(k.indexOf("m4p_")===0)return;
var v=localStorage.getItem(k);if(!v)return;
try{var arr=JSON.parse(v);if(!Array.isArray(arr))return;
var pub=arr.find(function(p){return (p.id||"")===id;});
if(pub){
var nt=prompt("Titulo:",pub.titulo||pub.title||"");if(nt===null)return;
var nh=prompt("Hora (HH:MM):",pub.hora||pub.time||"20:00");if(nh===null)return;
pub.titulo=nt;pub.title=nt;pub.hora=nh;pub.time=nh;
localStorage.setItem(k,JSON.stringify(arr));
alert("Publicacion actualizada");renderM4G();
}
}catch(e2){}});
}catch(e2){alert("No se pudo editar");}
};
function inyectarHoyCalendario(){
var hoy=document.getElementById("p-hoy");if(!hoy)return;
var ex=document.getElementById("hoy-cal-m4g");if(ex)ex.remove();
var evs=getCalEvts(todayISO());
if(!evs.length)return;
var cd=document.createElement("div");cd.id="hoy-cal-m4g";
var h="<div style=\"font-size:.88rem;font-weight:700;color:#6c3fc5;margin-bottom:8px\">\uD83D\uDCC5 Eventos del calendario hoy ("+evs.length+")</div>";
evs.sort(function(a,b){return a.time<b.time?-1:1;});
evs.forEach(function(e){
var ekey=todayISO()+"_"+safeKey(e.id||e.title);
var eOn=getPrensa(ekey);
var eLbl=eOn?"\u2705 Cobertura":"\uD83D\uDCCB Cobertura";
var eCls="hcm-cob-btn"+(eOn?" on":"");
h+="<div class=\"hcm-ev\"><span class=\"hcm-time\">"+e.time+"</span><span class=\"hcm-title\">"+e.title+"</span>";
h+="<button class=\""+eCls+"\" onclick=\"m4gHoyToggleCob('"+ekey+"')\">" + eLbl + "</button>";
h+="</div>";
});
cd.innerHTML=h;
var ch0=hoy.children[0];
if(ch0&&ch0.nextSibling){hoy.insertBefore(cd,ch0.nextSibling);}else{hoy.appendChild(cd);}
}
window.m4gHoyToggleCob=function(key){setPrensa(key,!getPrensa(key));inyectarHoyCalendario();};
function inyectarHoyTareas(){
var hoy=document.getElementById("p-hoy");if(!hoy)return;
var ex=document.getElementById("hoy-tasks-m4g");if(ex)ex.remove();
var tasks=getKanbanTasks();
if(!tasks.length)return;
var maxShow=8;
var td=document.createElement("div");td.id="hoy-tasks-m4g";
var total=tasks.length;
var h="<div class=\"htm-header\">\uD83D\uDCCB Tareas pendientes ("+total+")<a onclick=\"window.nav('tablero')\" style=\"font-size:.7rem;cursor:pointer;color:#6c3fc5;text-decoration:none\">Ver tablero \u2192</a></div>";
var shown=tasks.slice(0,maxShow);
shown.forEach(function(t){
var pc=t.prio==="alta"?"htm-prio-alta":t.prio==="baja"?"htm-prio-baja":"htm-prio-media";
var pl=t.prio==="alta"?"Alta":t.prio==="baja"?"Baja":"Media";
var st=t.status||"Pendiente";
h+="<div class=\"htm-task\" onclick=\"if(window.editTask)window.editTask('"+t.id+"')\">";
h+="<span class=\"htm-prio "+pc+"\">"+pl+"</span>";
h+="<span class=\"htm-title\">"+t.title.substring(0,80)+(t.title.length>80?"...":"")+"</span>";
h+="<span class=\"htm-status\">"+st+"</span>";
h+="</div>";
});
if(total>maxShow){h+="<div class=\"htm-more\" onclick=\"window.nav('tablero')\">+ "+(total-maxShow)+" m\u00e1s \u2192 Ver tablero</div>";}
td.innerHTML=h;
var calEl=document.getElementById("hoy-cal-m4g");
if(calEl&&calEl.nextSibling){hoy.insertBefore(td,calEl.nextSibling);}
else if(hoy.children[0]&&hoy.children[0].nextSibling){hoy.insertBefore(td,hoy.children[0].nextSibling);}
else{hoy.appendChild(td);}
}
function patchEnviarGuardias(){
if(window._m4wagPatched)return;window._m4wagPatched=true;
if(!window.m2||!window.m2.actions)return;
var orig=window.m2.actions.enviarGuardias;
window.m2.actions.enviarGuardias=function(){
orig.apply(this,arguments);
setTimeout(function(){
var iso=todayISO();
var evts=getCalEvts(iso);
var after15=evts.filter(function(e){return e.time>="15:00";});
var showEvts=after15.length?after15:evts;
if(!showEvts.length)return;
var evtLines=showEvts.map(function(e){return "\uD83D\uDCC6 "+e.time+" \u2014 "+e.title;}).join("\n");
var count=showEvts.length;
document.querySelectorAll("textarea").forEach(function(ta){
var v=ta.value;
if(v&&v.indexOf("0 eventos en agenda")>-1){
ta.value=v.replace("\u2022 0 eventos en agenda","\u2022 "+count+" eventos en agenda:\n"+evtLines);
var ev=new Event("input",{bubbles:true});ta.dispatchEvent(ev);
}
});
},700);
};
}
function fixKanbanScroll(){
if(window._m4kanbanPatched)return;window._m4kanbanPatched=true;
var ork=window.renderKanban;
if(typeof ork==="function"){window.renderKanban=function(){var sp=window.scrollY;ork.apply(this,arguments);
setTimeout(function(){window.scrollTo(0,sp);},50);};}
}
function patchGoGuardWeek(){
if(window._m4gwPatched)return;window._m4gwPatched=true;
var og=window.goGuardWeek;
if(typeof og==="function"){window.goGuardWeek=function(dir){_m4selDay="";og.apply(this,arguments);setTimeout(function(){renderM4G();},900);}}
}
function hideRealizada(){
document.querySelectorAll(".kanban>.kcol").forEach(function(col){
var hdr=col.querySelector(".khdr");
if(hdr&&hdr.textContent.toLowerCase().indexOf("realiz")>-1){
col.style.cssText+=" display:none!important;";
}
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
setTabClass(id);on.apply(this,arguments);
if(id==="guardias"){setTimeout(function(){renderM4G();},400);}
if(id==="tablero"){setTimeout(function(){hideRealizada();},300);}
if(id==="hoy"){setTimeout(function(){inyectarHoyCalendario();inyectarHoyTareas();},400);}
};
}
}
function patchSyncGCal(){
if(window._m4syncPatched)return;window._m4syncPatched=true;
var os=window.syncGCal;
if(typeof os==="function"){
window.syncGCal=function(){
window._m4gcal=[];
os.apply(this,arguments);
setTimeout(function(){
if(document.body.classList.contains("m4tab-guardias"))renderM4G();
if(document.body.classList.contains("m4tab-hoy")){inyectarHoyCalendario();inyectarHoyTareas();}
},2000);
};
}
}
function patchRenderKanban(){
if(window._m4rkPatched)return;window._m4rkPatched=true;
var ork2=window.renderKanban;
if(typeof ork2==="function"){
window.renderKanban=function(){
ork2.apply(this,arguments);
setTimeout(function(){
if(document.body.classList.contains("m4tab-hoy"))inyectarHoyTareas();
hideRealizada();
},200);
};
}
}
function init(){
interceptFetch();
inyectarCSS();
fixKanbanScroll();
patchNav();
patchGoGuardWeek();
patchSyncGCal();
patchRenderKanban();
patchEnviarGuardias();
var tabs=["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","recursos"];
tabs.forEach(function(t){
var el=document.getElementById("p-"+t);
if(el&&el.style.display!=="none"&&el.offsetParent!==null){setTabClass(t);}
});
setTimeout(function(){renderM4G();inyectarHoyCalendario();inyectarHoyTareas();hideRealizada();patchEnviarGuardias();},600);
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}
else{init();}
})();/* MEJORAS3.JS v12 */
(function(){"use strict";
function inyectarCSS(){
if(document.getElementById("m4css"))return;
var s=document.createElement("style");s.id="m4css";var css="";
css+="#p-guardias .gwtbl{display:none!important}\n";
css+="#p-guardias .ptop,#p-guardias .ptitle{display:none!important}\n";
css+="#p-guardias #m1-pubs-guardias{display:none!important}\n";
css+="body:not(.m4tab-tablero) #p-tablero{display:none!important}\n";
css+=".kanban>.kcol{flex:none!important;width:265px!important;max-width:265px!important;min-width:265px!important}\n";
css+="#m4g{padding:0;font-family:inherit}\n";
css+="#m4g .m4g-header{background:linear-gradient(135deg,#6c3fc5,#8b5cf6);color:#fff;padding:14px 18px;border-radius:12px;margin-bottom:14px}\n";
css+="#m4g .m4g-header h2{margin:0;font-size:1.1rem;font-weight:800}\n";
css+="#m4g .m4g-nav{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}\n";
css+="#m4g .m4g-navbtn{background:#fff;border:1px solid #d0d7de;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:.88rem}\n";
css+="#m4g .m4g-navbtn:hover{background:#f0f0f0}\n";
css+="#m4g .m4g-week{flex:1;text-align:center;font-weight:700;font-size:.95rem;color:#333}\n";
css+="#m4g .m4g-grid{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}\n";
css+="#m4g .m4g-card{flex:1;min-width:115px;background:#fff;border:2px solid #e2d8f7;border-radius:12px;padding:10px 8px;cursor:pointer;text-align:center;transition:.2s}\n";
css+="#m4g .m4g-card:hover{border-color:#6c3fc5}\n";
css+="#m4g .m4g-card.m4g-active{border-color:#6c3fc5;background:#f5f0ff}\n";
css+="#m4g .m4g-card.m4g-today{border-color:#f59e0b}\n";
css+="#m4g .m4g-card.m4g-today .m4g-cday{color:#f59e0b}\n";
css+="#m4g .m4g-card.m4g-cob-on{border-color:#6c3fc5!important;background:#f5f0ff!important}\n";
css+="#m4g .m4g-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#6c3fc5;color:#fff;font-weight:700;font-size:.9rem;margin:0 auto 4px}\n";
css+="#m4g .m4g-cday{font-weight:700;font-size:.8rem;margin-bottom:2px;color:#444}\n";
css+="#m4g .m4g-cname{font-size:.75rem;font-weight:600;color:#333;display:block}\n";
css+="#m4g .m4g-crole{font-size:.65rem;color:#888;margin-bottom:4px;display:block}\n";
css+="#m4g .m4g-cbadge{display:inline-block;background:#6c3fc5;color:#fff;border-radius:20px;padding:1px 8px;font-size:.65rem;font-weight:700;margin-bottom:4px}\n";
css+="#m4g .m4g-wa{display:block;background:#25d366;color:#fff;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-decoration:none;margin-top:4px}\n";
css+="#m4g .m4g-wa:hover{background:#1da851}\n";
css+="#m4g .m4g-wa-dis{display:block;background:#e5e7eb;color:#9ca3af;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-align:center;margin-top:4px;cursor:not-allowed}\n";
css+="#m4g .m4g-cob-btn{display:block;background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;border-radius:8px;padding:4px;font-size:.68rem;font-weight:700;text-align:center;cursor:pointer;width:100%;margin-top:3px;box-sizing:border-box}\n";
css+="#m4g .m4g-cob-btn.on{background:#6c3fc5;color:#fff;border-color:#6c3fc5}\n";
css+="#m4g .m4g-act-cob{background:none;border:1px solid #e5e7eb;border-radius:6px;padding:2px 6px;cursor:pointer;font-size:.7rem;color:#9ca3af;margin-left:4px;white-space:nowrap}\n";
css+="#m4g .m4g-act-cob.on{background:#ede9fe;color:#6c3fc5;border-color:#6c3fc5;font-weight:700}\n";
css+="#m4g .m4g-detail{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:14px;margin-top:10px}\n";
css+="#m4g .m4g-detail-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px}\n";
css+="#m4g .m4g-detail-title{font-weight:700;font-size:.95rem;color:#333}\n";
css+="#m4g .m4g-wa-big{background:#25d366;color:#fff;border:none;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:.82rem;font-weight:700}\n";
css+="#m4g .m4g-wa-big:disabled{background:#d1d5db;color:#9ca3af;cursor:not-allowed}\n";
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
css+="#m4g .m4g-act-actions{display:flex;gap:4px;margin-left:auto;align-items:flex-start;flex-wrap:wrap;justify-content:flex-end}\n";
css+="#m4g .m4g-act-btn{background:none;border:1px solid #ddd;border-radius:6px;padding:2px 6px;cursor:pointer;font-size:.75rem;color:#666}\n";
css+="#m4g .m4g-act-btn.m4g-del{color:#dc2626;border-color:#fca5a5}\n";
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
css+="#hoy-cal-m4g{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;margin-bottom:12px}\n";
css+="#hoy-cal-m4g .hcm-ev{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f3f0fb}\n";
css+="#hoy-cal-m4g .hcm-ev:last-child{border-bottom:none}\n";
css+="#hoy-cal-m4g .hcm-time{color:#2563eb;font-weight:700;font-size:.8rem;min-width:42px}\n";
css+="#hoy-cal-m4g .hcm-title{font-size:.83rem;color:#222;flex:1}\n";
css+="#hoy-cal-m4g .hcm-cob-btn{background:none;border:1px solid #e5e7eb;border-radius:6px;padding:2px 7px;cursor:pointer;font-size:.7rem;color:#9ca3af;white-space:nowrap}\n";
css+="#hoy-cal-m4g .hcm-cob-btn.on{background:#ede9fe;color:#6c3fc5;border-color:#6c3fc5;font-weight:700}\n";
css+="#hoy-tasks-m4g{background:#fff;border-radius:12px;border:1px solid #e2d8f7;padding:12px;margin-bottom:12px}\n";
css+="#hoy-tasks-m4g .htm-header{font-size:.88rem;font-weight:700;color:#6c3fc5;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}\n";
css+="#hoy-tasks-m4g .htm-task{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid #f3f0fb;cursor:pointer}\n";
css+="#hoy-tasks-m4g .htm-task:last-child{border-bottom:none}\n";
css+="#hoy-tasks-m4g .htm-prio{display:inline-block;border-radius:4px;padding:1px 6px;font-size:.6rem;font-weight:700;flex-shrink:0;margin-top:2px}\n";
css+="#hoy-tasks-m4g .htm-prio-alta{background:#fee2e2;color:#dc2626}\n";
css+="#hoy-tasks-m4g .htm-prio-media{background:#fef3c7;color:#d97706}\n";
css+="#hoy-tasks-m4g .htm-prio-baja{background:#dcfce7;color:#16a34a}\n";
css+="#hoy-tasks-m4g .htm-title{font-size:.82rem;color:#222;flex:1;line-height:1.3}\n";
css+="#hoy-tasks-m4g .htm-status{font-size:.68rem;color:#888;flex-shrink:0}\n";
css+="#hoy-tasks-m4g .htm-more{font-size:.75rem;color:#6c3fc5;text-align:center;padding:4px;cursor:pointer;font-weight:600}\n";
s["textContent"]=css;document.head.appendChild(s);
}
function getPrensa(k){try{return localStorage.getItem("m4p_"+k)==="1";}catch(e){return false;}}
function setPrensa(k,v){try{localStorage.setItem("m4p_"+k,v?"1":"0");}catch(e){}}
function interceptFetch(){
if(window._m4fpatched)return;window._m4fpatched=true;
window._m4gcal=window._m4gcal||[];
var of=window.fetch;
window.fetch=function(){
var a2=arguments,u2=a2[0]||"";
var p2=of.apply(this,a2);
if(typeof u2==="string"&&u2.indexOf("googleapis.com/calendar")>-1){
p2.then(function(r){var rc=r.clone();rc.json().then(function(d){
if(d&&d.items){d.items.forEach(function(ev){window._m4gcal.push(ev);});
if(window._m4renderPending){window._m4renderPending=false;renderM4G();}
}}).catch(function(){});}).catch(function(){});
}return p2;};
}
function getKanbanTasks(){
var tasks=[];
var kanban=document.getElementById("kanban");if(!kanban)return tasks;
Array.from(kanban.children).forEach(function(col){
var hdr=col.querySelector(".khdr");
var hdrText=hdr?hdr.textContent.trim().toLowerCase():"";
if(hdrText.indexOf("realiz")>-1)return;
var kbody=col.querySelector(".kbody");if(!kbody)return;
var statusLabel=hdr?hdr.textContent.replace(/[0-9]/g,"").trim():"";
Array.from(kbody.children).forEach(function(card){
var oc=card.getAttribute("onclick");
var idm=oc&&oc.match(/editTask\(['"]([-\w]+)['"]\)/);
if(!idm)return;
var titleEl=card.querySelector(".tc-t");var title=titleEl?titleEl.textContent.trim().split("\n")[0].trim():"";
var prioEl=card.querySelector(".tg");var prio=prioEl?prioEl.textContent.trim().toLowerCase():"media";
var statEl=card.querySelector(".estado-selector");var stat=statEl?statEl.value||statusLabel:statusLabel;
if(title)tasks.push({id:idm[1],title:title,prio:prio,status:stat});
});
});
return tasks;
}
function extractDays(){
var gp=document.getElementById("p-guardias");
if(!gp)return[];
var days=[];
gp.querySelectorAll(".gwtbl .gwd").forEach(function(gwd){
var gwag=gwd.querySelector(".gwag");if(!gwag)return;
var ns=gwag.children[1];var name="",role="";
if(ns){
var re=ns.querySelector("span");role=re?re.textContent.trim():"";
var nc=ns.cloneNode(true);
var rs=nc.querySelector("span");if(rs)rs.remove();
nc.querySelectorAll("br").forEach(function(b){b.remove();});
name=nc.textContent.trim();
}
if(!name){var nc2=gwag.cloneNode(true);
nc2.querySelectorAll("span,div").forEach(function(e2){e2.remove();});
name=nc2.textContent.trim();}
var waLink="";
gwd.querySelectorAll("a").forEach(function(a){if(a.href&&a.href.indexOf("whatsapp")>-1)waLink=a.href;});
var dateStr="";
gwd.querySelectorAll("[onclick]").forEach(function(b){
var oc=b.getAttribute("onclick");
var mm=oc&&oc.match(/['"](\d{4}-\d{2}-\d{2})['"]/);
if(mm&&!dateStr)dateStr=mm[1];});
if(!dateStr){var hEl=gwd.querySelector(".gwdate,.gwhd");if(hEl)dateStr=hEl.getAttribute("data-date")||"";}  
var cobs=[];
days.push({name:name,role:role,waLink:waLink,dateStr:dateStr,cobs:cobs});
});
return days;
}
function getCalEvts(iso){
return (window._m4gcal||[]).filter(function(ev){
var dt=ev.start&&ev.start.dateTime?ev.start.dateTime:"";
var d=ev.start&&ev.start.date?ev.start.date:"";
return (dt&&dt.indexOf(iso)>-1)||(d&&d===iso);
}).map(function(ev){
var dt=ev.start&&ev.start.dateTime?ev.start.dateTime:"";
var t="00:00";if(dt){var mm=dt.match(/T(\d{2}:\d{2})/);if(mm)t=mm[1];}
return {title:ev.summary||"Evento",time:t,type:"ev",id:ev.id||""};
});
}
function getPubs(iso){
var pubs=[];
try{
Object.keys(localStorage).forEach(function(k){
if(k.indexOf("m4p_")===0)return;
var v=localStorage.getItem(k);if(!v)return;
try{
var obj=JSON.parse(v);
if(Array.isArray(obj)){
obj.forEach(function(p){
var pd=p.fecha||p.date||p.scheduledDate||"";
if(pd&&pd.indexOf(iso)>-1){
pubs.push({title:p.titulo||p.title||p.contenido||"Publicacion",time:p.hora||p.time||"20:00",type:"pub",id:p.id||k+"_"+pubs.length});
}
});
}
}catch(e2){}
});
}catch(e2){}
return pubs;
}
function todayISO(){
var n=new Date();
return n.getFullYear()+"-"+(n.getMonth()<9?"0":"")+(n.getMonth()+1)+"-"+(n.getDate()<10?"0":"")+n.getDate();
}
function fmtDate(iso){
var ds=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
var ms=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var pp=iso.split("-");
var d=new Date(parseInt(pp[0]),parseInt(pp[1])-1,parseInt(pp[2]));
return ds[d.getDay()]+" "+d.getDate()+" DE "+ms[d.getMonth()].toUpperCase();
}
function initials(n){
var w=n.trim().split(" ");
return (w[0]?w[0][0]:"")+(w[1]?w[1][0]:"");
}
function safeKey(s){return s.replace(/[^a-zA-Z0-9]/g,"").substring(0,12);}
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
_m4selDay=td?td.dateStr:(_m4days[0]?_m4days[0].dateStr:"");
}
var wrap=document.createElement("div");wrap.id="m4g";
var wf=_m4days[0]?_m4days[0].dateStr:"";
var wl=_m4days[_m4days.length-1]?_m4days[_m4days.length-1].dateStr:"";
var wlabel="";
if(wf&&wl){
var pa=wf.split("-"),pb=wl.split("-");
var mn=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
wlabel=parseInt(pa[2])+" "+mn[parseInt(pa[1])-1]+" \u2014 "+parseInt(pb[2])+" "+mn[parseInt(pb[1])-1]+" "+pb[0];
}
var hh="<div class=\"m4g-header\"><h2>\uD83D\uDEE1\uFE0F Guardias Semanales</h2><div style=\"font-size:.8rem;opacity:.85\">Actividades semanales</div></div>";
var nv="<div class=\"m4g-nav\"><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(-1)\">\u2039 Ant</button><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(0)\">Hoy</button><div class=\"m4g-week\">"+wlabel+"</div><button class=\"m4g-navbtn\" onclick=\"goGuardWeek(1)\">Sig \u203a</button></div>";
var dayAbbr=["DOM","LUN","MAR","MIE","JUE","VIE","SAB"];
var grid="<div class=\"m4g-grid\">";
_m4days.forEach(function(day){
var pp=day.dateStr.split("-");
var dobj=new Date(parseInt(pp[0]),parseInt(pp[1])-1,parseInt(pp[2]));
var dw=dayAbbr[dobj.getDay()],dn=dobj.getDate();
var isWE=(dobj.getDay()===0||dobj.getDay()===6);
var allActs=getCalEvts(day.dateStr).concat(getPubs(day.dateStr)).concat(day.cobs.map(function(cc){return {title:cc.title,time:cc.time,type:"cob"};}));
if(!isWE)allActs=allActs.filter(function(a){return a.time>="15:00";});
var cnt=allActs.length;
var cobOn=getPrensa(day.dateStr);
var cls="m4g-card"+(day.dateStr===today?" m4g-today":"")+(day.dateStr===_m4selDay?" m4g-active":"")+(cobOn?" m4g-cob-on":"");
var av=initials(day.name).toUpperCase()||"?";
var wp=day.waLink.replace(/[^\d]/g,"");
var clbl=cobOn?"\u2705 Cubre \u2014 S\xED":"\uD83D\uDCCB Cubre \u2014 No";
var ccls="m4g-cob-btn"+(cobOn?" on":"");
var waHtml;
if(wp){
var wm=encodeURIComponent("Guardia del dia "+fmtDate(day.dateStr)+" - "+day.name);
var wu="https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+wp+"&text="+wm;
waHtml="<a class=\"m4g-wa\" href=\""+wu+"\" target=\"_blank\" onclick=\"event.stopPropagation()\">\uD83D\uDCAC WhatsApp</a>";
}else{
waHtml="<span class=\"m4g-wa-dis\">Sin tel.</span>";
}
grid+="<div class=\""+cls+"\" onclick=\"m4gSelectDay('"+day.dateStr+"')\">"
+"<div class=\"m4g-cday\">"+dw+"<br>"+dn+"</div>"
+"<div class=\"m4g-avatar\">"+av+"</div>"
+"<span class=\"m4g-cname\">"+day.name+"</span>"
+"<span class=\"m4g-crole\">"+day.role+"</span>"
+"<div class=\"m4g-cbadge\">"+cnt+" act.</div>"
+waHtml
+"<button class=\""+ccls+"\" onclick=\"event.stopPropagation();m4gTogglePrensa('"+day.dateStr+"')\">" + clbl + "</button>"
+"</div>";
});
grid+="</div>";
var sd=_m4days.find(function(d){return d.dateStr===_m4selDay;})||_m4days[0];
var detHtml="";
if(sd){
var p2=sd.dateStr.split("-");
var dobj2=new Date(parseInt(p2[0]),parseInt(p2[1])-1,parseInt(p2[2]));
var isWE2=(dobj2.getDay()===0||dobj2.getDay()===6);
var combined=getCalEvts(sd.dateStr).concat(getPubs(sd.dateStr)).concat(sd.cobs.map(function(cc){return {title:cc.title,time:cc.time,type:"cob"};}));
if(!isWE2)combined=combined.filter(function(a){return a.time>="15:00";});
combined.sort(function(a,b){return a.time<b.time?-1:a.time>b.time?1:0;});
var wp2=sd.waLink.replace(/[^\d]/g,"");
var wlines=["\uD83D\uDEE1\uFE0F *Guardia del d\u00eda* \u2014 "+fmtDate(sd.dateStr),""];
wlines.push("Hola "+sd.name+", sos la guardia *"+sd.role+"* hoy.");
wlines.push("");
wlines.push("\uD83D\uDCC5 Actividades desde las 15:00:");
combined.forEach(function(a){
var tipo=a.type==="ev"?"\uD83D\uDCC6":a.type==="pub"?"\uD83D\uDCF1":"\uD83D\uDCCB";
wlines.push(tipo+" "+a.time+" \u2014 "+a.title);
});
if(!combined.length)wlines.push("\u2022 Sin actividades programadas desde las 15:00");
var wbm=encodeURIComponent(wlines.join("\n"));
var waBtn;
if(wp2){
var wbu="https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+wp2+"&text="+wbm;
waBtn="<button class=\"m4g-wa-big\" onclick=\"window.open('"+wbu+"','_blank')\">\uD83D\uDCAC Enviar WhatsApp</button>";
}else{
waBtn="<button class=\"m4g-wa-big\" disabled>\uD83D\uDCAC Sin tel.</button>";
}
var dtitle=fmtDate(sd.dateStr).toUpperCase()+" - "+sd.name.toUpperCase()+" ("+sd.role+")";
detHtml="<div class=\"m4g-layout\">";
detHtml+="<div class=\"m4g-main\"><div class=\"m4g-detail\">";
detHtml+="<div class=\"m4g-detail-header\">";
detHtml+="<div class=\"m4g-detail-title\">"+dtitle+"</div>";
detHtml+=waBtn;
detHtml+="</div>";
if(!combined.length){
detHtml+="<div class=\"m4g-empty\">Sin actividades</div>";
}else{
combined.forEach(function(a){
var bc=a.type==="ev"?"m4g-badge-ev":a.type==="pub"?"m4g-badge-pub":"m4g-badge-cob";
var bt=a.type==="ev"?"EVENTO":a.type==="pub"?"PUBLICACION":"COBERTURA";
var pkey=sd.dateStr+"_"+safeKey(a.id||a.title);
var pOn=getPrensa(pkey);
var pLbl=pOn?"\u2705 Cobertura":"\uD83D\uDCCB Cobertura";
var pCls="m4g-act-cob"+(pOn?" on":"");
detHtml+="<div class=\"m4g-act\">";
detHtml+="<div class=\"m4g-act-time\">"+a.time+"</div>";
detHtml+="<div class=\"m4g-act-body\"><span class=\"m4g-badge "+bc+"\">"+bt+"</span> <span class=\"m4g-act-name\">"+a.title+"</span></div>";
detHtml+="<div class=\"m4g-act-actions\">";
detHtml+="<button class=\""+pCls+"\" onclick=\"m4gToggleActPrensa('"+pkey+"','"+sd.dateStr+"')\">" + pLbl + "</button>";
if(a.type==="pub"){
detHtml+="<button class=\"m4g-act-btn\" onclick=\"m4gEditPub('"+a.id+"')\">\u270F\uFE0F</button>";
detHtml+="<button class=\"m4g-act-btn m4g-del\" onclick=\"m4gDelPub('"+a.id+"','"+sd.dateStr+"')\">\uD83D\uDDD1\uFE0F</button>";
}
detHtml+="</div></div>";
});
}
detHtml+="</div></div>";
var evc=combined.filter(function(a){return a.type==="ev";}).length;
var pbc=combined.filter(function(a){return a.type==="pub";}).length;
var cbc=combined.filter(function(a){return a.type==="cob";}).length;
var prnCnt=combined.filter(function(a){return getPrensa(sd.dateStr+"_"+safeKey(a.id||a.title));}).length;
detHtml+="<div class=\"m4g-sidebar\"><div class=\"m4g-resumen\"><h4>Resumen del dia</h4>";
detHtml+="<div class=\"m4g-res-row\"><span>Total</span><span class=\"m4g-res-num\">"+combined.length+"</span></div>";
detHtml+="<div class=\"m4g-res-row\"><span>Eventos</span><span class=\"m4g-res-num\">"+evc+"</span></div>";
detHtml+="<div class=\"m4g-res-row\"><span>Publicaciones</span><span class=\"m4g-res-num\">"+pbc+"</span></div>";
detHtml+="<div class=\"m4g-res-row\"><span>Coberturas</span><span class=\"m4g-res-num\">"+cbc+"</span></div>";
if(prnCnt>0){detHtml+="<div class=\"m4g-res-row\"><span>\uD83D\uDCCB Cob.</span><span class=\"m4g-res-num\" style=\"background:#6c3fc5\">"+prnCnt+"</span></div>";}
detHtml+="</div>";
detHtml+="<div class=\"m4g-agent-card\">";
detHtml+="<div class=\"m4g-agent-av\">"+initials(sd.name).toUpperCase()+"</div>";
detHtml+="<div class=\"m4g-agent-name\">"+sd.name+"</div>";
detHtml+="<div class=\"m4g-agent-role\">"+sd.role+"</div>";
var wp3=sd.waLink.replace(/[^\d]/g,"");
if(wp3){
var wu3="https://api.whatsapp.com/send"+String.fromCharCode(63)+"phone="+wp3;
detHtml+="<a class=\"m4g-wa\" href=\""+wu3+"\" target=\"_blank\">\uD83D\uDCAC WhatsApp</a>";
}else{
detHtml+="<span class=\"m4g-wa-dis\">Sin tel.</span>";
}
detHtml+="</div></div></div>";
}
wrap.innerHTML=hh+nv+grid+detHtml;
gp.insertBefore(wrap,gp.firstChild);
}
window.m4gSelectDay=function(iso){_m4selDay=iso;renderM4G();};
window.m4gTogglePrensa=function(iso){setPrensa(iso,!getPrensa(iso));renderM4G();};
window.m4gToggleActPrensa=function(key,iso){setPrensa(key,!getPrensa(key));_m4selDay=iso;renderM4G();};
window.m4gDelPub=function(id,iso){
if(!confirm("Eliminar esta publicacion?"))return;
try{Object.keys(localStorage).forEach(function(k){
if(k.indexOf("m4p_")===0)return;
var v=localStorage.getItem(k);if(!v)return;
try{var arr=JSON.parse(v);if(!Array.isArray(arr))return;
var orig=arr.length;
arr=arr.filter(function(p){return (p.id||"")!==id;});
if(arr.length<orig){localStorage.setItem(k,JSON.stringify(arr));
alert("Publicacion eliminada");_m4selDay=iso;renderM4G();}
}catch(e2){}});
}catch(e2){alert("No se pudo eliminar");}
};
window.m4gEditPub=function(id){
try{Object.keys(localStorage).forEach(function(k){
if(k.indexOf("m4p_")===0)return;
var v=localStorage.getItem(k);if(!v)return;
try{var arr=JSON.parse(v);if(!Array.isArray(arr))return;
var pub=arr.find(function(p){return (p.id||"")===id;});
if(pub){
var nt=prompt("Titulo:",pub.titulo||pub.title||"");if(nt===null)return;
var nh=prompt("Hora (HH:MM):",pub.hora||pub.time||"20:00");if(nh===null)return;
pub.titulo=nt;pub.title=nt;pub.hora=nh;pub.time=nh;
localStorage.setItem(k,JSON.stringify(arr));
alert("Publicacion actualizada");renderM4G();
}
}catch(e2){}});
}catch(e2){alert("No se pudo editar");}
};
function inyectarHoyCalendario(){
var hoy=document.getElementById("p-hoy");if(!hoy)return;
var ex=document.getElementById("hoy-cal-m4g");if(ex)ex.remove();
var evs=getCalEvts(todayISO());
if(!evs.length)return;
var cd=document.createElement("div");cd.id="hoy-cal-m4g";
var h="<div style=\"font-size:.88rem;font-weight:700;color:#6c3fc5;margin-bottom:8px\">\uD83D\uDCC5 Eventos del calendario hoy ("+evs.length+")</div>";
evs.sort(function(a,b){return a.time<b.time?-1:1;});
evs.forEach(function(e){
var ekey=todayISO()+"_"+safeKey(e.id||e.title);
var eOn=getPrensa(ekey);
var eLbl=eOn?"\u2705 Cobertura":"\uD83D\uDCCB Cobertura";
var eCls="hcm-cob-btn"+(eOn?" on":"");
h+="<div class=\"hcm-ev\"><span class=\"hcm-time\">"+e.time+"</span><span class=\"hcm-title\">"+e.title+"</span>";
h+="<button class=\""+eCls+"\" onclick=\"m4gHoyToggleCob('"+ekey+"')\">" + eLbl + "</button>";
h+="</div>";
});
cd.innerHTML=h;
var ch0=hoy.children[0];
if(ch0&&ch0.nextSibling){hoy.insertBefore(cd,ch0.nextSibling);}else{hoy.appendChild(cd);}
}
window.m4gHoyToggleCob=function(key){setPrensa(key,!getPrensa(key));inyectarHoyCalendario();};
function inyectarHoyTareas(){
var hoy=document.getElementById("p-hoy");if(!hoy)return;
var ex=document.getElementById("hoy-tasks-m4g");if(ex)ex.remove();
var tasks=getKanbanTasks();
if(!tasks.length)return;
var maxShow=8;
var td=document.createElement("div");td.id="hoy-tasks-m4g";
var total=tasks.length;
var h="<div class=\"htm-header\">\uD83D\uDCCB Tareas pendientes ("+total+")<a onclick=\"window.nav('tablero')\" style=\"font-size:.7rem;cursor:pointer;color:#6c3fc5;text-decoration:none\">Ver tablero \u2192</a></div>";
var shown=tasks.slice(0,maxShow);
shown.forEach(function(t){
var pc=t.prio==="alta"?"htm-prio-alta":t.prio==="baja"?"htm-prio-baja":"htm-prio-media";
var pl=t.prio==="alta"?"Alta":t.prio==="baja"?"Baja":"Media";
var st=t.status||"Pendiente";
h+="<div class=\"htm-task\" onclick=\"if(window.editTask)window.editTask('"+t.id+"')\">";
h+="<span class=\"htm-prio "+pc+"\">"+pl+"</span>";
h+="<span class=\"htm-title\">"+t.title.substring(0,80)+(t.title.length>80?"...":"")+"</span>";
h+="<span class=\"htm-status\">"+st+"</span>";
h+="</div>";
});
if(total>maxShow){h+="<div class=\"htm-more\" onclick=\"window.nav('tablero')\">+ "+(total-maxShow)+" m\u00e1s \u2192 Ver tablero</div>";}
td.innerHTML=h;
var calEl=document.getElementById("hoy-cal-m4g");
if(calEl&&calEl.nextSibling){hoy.insertBefore(td,calEl.nextSibling);}
else if(hoy.children[0]&&hoy.children[0].nextSibling){hoy.insertBefore(td,hoy.children[0].nextSibling);}
else{hoy.appendChild(td);}
}
function patchEnviarGuardias(){
if(window._m4wagPatched)return;window._m4wagPatched=true;
if(!window.m2||!window.m2.actions)return;
var orig=window.m2.actions.enviarGuardias;
window.m2.actions.enviarGuardias=function(){
orig.apply(this,arguments);
setTimeout(function(){
var iso=todayISO();
var evts=getCalEvts(iso);
var after15=evts.filter(function(e){return e.time>="15:00";});
var showEvts=after15.length?after15:evts;
if(!showEvts.length)return;
var evtLines=showEvts.map(function(e){return "\uD83D\uDCC6 "+e.time+" \u2014 "+e.title;}).join("\n");
var count=showEvts.length;
document.querySelectorAll("textarea").forEach(function(ta){
var v=ta.value;
if(v&&v.indexOf("0 eventos en agenda")>-1){
ta.value=v.replace("\u2022 0 eventos en agenda","\u2022 "+count+" eventos en agenda:\n"+evtLines);
var ev=new Event("input",{bubbles:true});ta.dispatchEvent(ev);
}
});
},700);
};
}
function fixKanbanScroll(){
if(window._m4kanbanPatched)return;window._m4kanbanPatched=true;
var ork=window.renderKanban;
if(typeof ork==="function"){window.renderKanban=function(){var sp=window.scrollY;ork.apply(this,arguments);
setTimeout(function(){window.scrollTo(0,sp);},50);};}
}
function patchGoGuardWeek(){
if(window._m4gwPatched)return;window._m4gwPatched=true;
var og=window.goGuardWeek;
if(typeof og==="function"){window.goGuardWeek=function(dir){_m4selDay="";og.apply(this,arguments);setTimeout(function(){renderM4G();},900);}}
}
function hideRealizada(){
document.querySelectorAll(".kanban>.kcol").forEach(function(col){
var hdr=col.querySelector(".khdr");
if(hdr&&hdr.textContent.toLowerCase().indexOf("realiz")>-1)col.style.display="none";
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
setTabClass(id);on.apply(this,arguments);
if(id==="guardias"){setTimeout(function(){renderM4G();},400);}
if(id==="tablero"){setTimeout(function(){hideRealizada();},300);}
if(id==="hoy"){setTimeout(function(){inyectarHoyCalendario();inyectarHoyTareas();},400);}
};
}
}
function patchSyncGCal(){
if(window._m4syncPatched)return;window._m4syncPatched=true;
var os=window.syncGCal;
if(typeof os==="function"){
window.syncGCal=function(){
window._m4gcal=[];
os.apply(this,arguments);
setTimeout(function(){
if(document.body.classList.contains("m4tab-guardias"))renderM4G();
if(document.body.classList.contains("m4tab-hoy")){inyectarHoyCalendario();inyectarHoyTareas();}
},2000);
};
}
}
function patchRenderKanban(){
if(window._m4rkPatched)return;window._m4rkPatched=true;
var ork2=window.renderKanban;
if(typeof ork2==="function"){
window.renderKanban=function(){
ork2.apply(this,arguments);
setTimeout(function(){
if(document.body.classList.contains("m4tab-hoy"))inyectarHoyTareas();
hideRealizada();
},200);
};
}
}
function init(){
interceptFetch();
inyectarCSS();
fixKanbanScroll();
patchNav();
patchGoGuardWeek();
patchSyncGCal();
patchRenderKanban();
patchEnviarGuardias();
var tabs=["hoy","tablero","material","publicaciones","calendario","guardias","equipo","medios","reclamos","recursos"];
tabs.forEach(function(t){
var el=document.getElementById("p-"+t);
if(el&&el.style.display!=="none"&&el.offsetParent!==null){setTabClass(t);}
});
setTimeout(function(){renderM4G();inyectarHoyCalendario();inyectarHoyTareas();hideRealizada();patchEnviarGuardias();},600);
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}
else{init();}
})();
