/* MEJORAS3.JS v6 */
(function(){"use strict";

function inyectarCSS(){
  if(document.getElementById("m4css")) return;
  var s=document.createElement("style");s.id="m4css";
  var css="";
  css+="#p-guardias .ptop,#p-guardias .gw-navrow,#p-guardias .acts.gw-mobile,#p-guardias .gw-mobile,#p-guardias #m1-pubs-guardias,#p-guardias .gwtbl,#p-guardias .ptitle{display:none!important}\n";
  css+="body:not(.m4tab-tablero) #p-tablero{display:none!important}\n";
  css+="#m4g{width:100%;padding:16px;box-sizing:border-box}\n";
  css+="#m4g .m4gh{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#6c3fc5,#4f46e5);color:#fff;border-radius:12px;padding:14px 20px;margin-bottom:14px}\n";
  css+="#m4g .m4gh h2{margin:0;font-size:1rem;font-weight:700}\n#m4g .m4gh p{margin:3px 0 0;font-size:.8rem;opacity:.85}\n";
  css+="#m4g .m4gnav{display:flex;align-items:center;gap:10px;margin-bottom:14px}\n";
  css+="#m4g .m4gnav button{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:8px;padding:5px 10px;cursor:pointer;font-size:.82rem;font-weight:600}\n";
  css+="#m4g .m4gwrange{flex:1;text-align:center;font-size:.88rem;font-weight:600}\n";
  css+="#m4g .m4ghoy{background:#6c3fc5!important;color:#fff!important;border-color:#6c3fc5!important}\n";
  css+="#m4g .m4gdays{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:14px}\n";
  css+="@media(max-width:700px){#m4g .m4gdays{grid-template-columns:repeat(3,1fr)}}\n";
  css+="#m4g .m4gday{background:var(--color-canvas-subtle,#f6f8fa);border:2px solid var(--color-border-default,#d0d7de);border-radius:10px;padding:8px 6px;cursor:pointer;min-height:100px;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .2s}\n";
  css+="#m4g .m4gday:hover,#m4g .m4gday.m4active{border-color:#6c3fc5!important;background:rgba(108,63,197,.07)!important}\n";
  css+="#m4g .m4gday.m4today{border-color:#f59e0b!important}\n";
  css+="#m4g .m4gdname{font-size:.65rem;font-weight:700;text-transform:uppercase;color:#888}\n";
  css+="#m4g .m4gdnum{font-size:1.05rem;font-weight:800}\n";
  css+="#m4g .m4today .m4gdnum{color:#f59e0b}\n#m4g .m4active .m4gdnum{color:#6c3fc5}\n";
  css+="#m4g .m4gav{width:28px;height:28px;border-radius:50%;background:#6c3fc5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700}\n";
  css+="#m4g .m4ganame{font-size:.62rem;font-weight:600;text-align:center;line-height:1.2}\n";
  css+="#m4g .m4garole{font-size:.56rem;color:#888}\n";
  css+="#m4g .m4gcnt{background:#6c3fc5;color:#fff;border-radius:20px;padding:1px 5px;font-size:.58rem;font-weight:700}\n";
  css+="#m4g .m4gwa{background:#25d366;color:#fff;border:none;border-radius:6px;padding:2px 5px;font-size:.58rem;font-weight:700;cursor:pointer;width:100%}\n";
  css+="#m4g .m4gdetail{display:grid;grid-template-columns:1fr 210px;gap:14px}\n";
  css+="@media(max-width:700px){#m4g .m4gdetail{grid-template-columns:1fr}}\n";
  css+="#m4g .m4dbox{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:10px;padding:14px}\n";
  css+="#m4g .m4dhdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px}\n";
  css+="#m4g .m4dtitle{font-size:.9rem;font-weight:700}\n";
  css+="#m4g .m4dbtns{display:flex;gap:5px;flex-wrap:wrap}\n";
  css+="#m4g .m4dedit{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:7px;padding:5px 10px;font-size:.78rem;cursor:pointer}\n";
  css+="#m4g .m4dwa{background:#25d366;color:#fff;border:none;border-radius:7px;padding:5px 12px;font-size:.78rem;font-weight:700;cursor:pointer}\n";
  css+="#m4g .m4alist{display:flex;flex-direction:column;gap:6px}\n";
  css+="#m4g .m4aitem{background:var(--color-canvas-default,#fff);border:1px solid var(--color-border-default,#d0d7de);border-radius:8px;padding:8px 10px;display:flex;align-items:flex-start;gap:8px}\n";
  css+="#m4g .m4atime{font-size:.82rem;font-weight:800;min-width:44px;color:#6c3fc5}\n";
  css+="#m4g .m4abadge{display:inline-flex;align-items:center;gap:2px;padding:1px 6px;border-radius:5px;font-size:.62rem;font-weight:700;white-space:nowrap;margin-bottom:2px}\n";
  css+="#m4g .m4bev{background:#dbeafe;color:#1d4ed8}\n#m4g .m4bpub{background:#fce7f3;color:#be185d}\n#m4g .m4bcob{background:#dcfce7;color:#15803d}\n#m4g .m4brad{background:#fef3c7;color:#b45309}\n";
  css+="#m4g .m4atitle{font-size:.82rem;font-weight:600;line-height:1.3}\n";
  css+="#m4g .m4empty{text-align:center;color:#aaa;padding:20px;font-size:.82rem}\n";
  css+="#m4g .m4sidebar{display:flex;flex-direction:column;gap:10px}\n";
  css+="#m4g .m4sum{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:10px;padding:12px}\n";
  css+="#m4g .m4sum h3{font-size:.82rem;font-weight:700;margin:0 0 8px}\n";
  css+="#m4g .m4srow{display:flex;justify-content:space-between;padding:3px 0;font-size:.78rem;border-bottom:1px solid var(--color-border-muted,#eaeef2)}\n";
  css+="#m4g .m4srow:last-child{border-bottom:none}\n";
  css+="#m4g .m4sval{font-weight:700;background:#6c3fc5;color:#fff;padding:1px 7px;border-radius:9px;font-size:.72rem}\n";
  css+="#m4g .m4agcard{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:10px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px}\n";
  css+="#m4g .m4agav{width:40px;height:40px;border-radius:50%;background:#6c3fc5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700}\n";
  css+="#m4g .m4agname{font-size:.85rem;font-weight:700}\n#m4g .m4agrole{font-size:.72rem;color:#888}\n";
  css+="#m4g .m4agwa{background:#25d366;color:#fff;border:none;border-radius:7px;padding:5px 12px;font-size:.78rem;font-weight:700;cursor:pointer;width:100%}\n";
  s.textContent=css;
  document.head.appendChild(s);
}

function setTabClass(id){
  document.body.classList.toggle("m4tab-tablero",id==="tablero");
  document.body.classList.toggle("m4tab-calendario",id==="calendario"||id==="publicaciones");
  var t=document.querySelector("#p-tablero");
  if(t){if(id==="tablero") t.style.removeProperty("display"); else t.style.setProperty("display","none","important");}
}

function parchearNav(){
  var orig=window.nav;
  if(typeof orig!=="function"||window._m4navOK) return;
  window._m4navOK=true;
  window.nav=function(id){
    setTabClass(id);
    var r=orig.apply(this,arguments);
    if(id==="guardias") setTimeout(buildGuardia,200);
    return r;
  };
  document.querySelectorAll(".ntab,.sbi").forEach(function(b){
    b.addEventListener("click",function(){
      var tid=this.dataset.tab||(this.getAttribute("onclick")||"");
      var id=tid.indexOf("tablero")>-1?"tablero":tid.indexOf("calendario")>-1?"calendario":tid.indexOf("publicaciones")>-1?"publicaciones":"";
      if(id) setTabClass(id);
    },{capture:true});
  });
}

function ocultarRealizada(){
  document.querySelectorAll(".kanban .kcol").forEach(function(col){
    var hdr=col.querySelector(".khdr .kt");
    if(!hdr) return;
    var lbl=(hdr.textContent||"").replace(/[\d\s]+$/g,"").trim();
    if(lbl==="Realizada") col.style.setProperty("display","none","important");
  });
}

function fixScrollTablero(){
  var origRK=window.renderKanban;
  if(typeof origRK!=="function"||window._m4rkOK) return;
  window._m4rkOK=true;
  window.renderKanban=function(){
    var scrollPos={};
    document.querySelectorAll(".kanban .kcol .kcards").forEach(function(kc,i){scrollPos[i]=kc.scrollTop;});
    var kanban=document.querySelector(".kanban");
    var kanbanH=kanban?kanban.scrollLeft:0;
    var r=origRK.apply(this,arguments);
    requestAnimationFrame(function(){
      document.querySelectorAll(".kanban .kcol .kcards").forEach(function(kc,i){if(scrollPos[i]) kc.scrollTop=scrollPos[i];});
      if(kanban&&kanbanH) kanban.scrollLeft=kanbanH;
      ocultarRealizada();
    });
    return r;
  };
}

function pad2(n){return n<10?"0"+n:""+n;}
function isWeekend(iso){if(!iso) return false; var d=new Date(iso+"T12:00:00"); var dw=d.getDay(); return dw===0||dw===6;}
function ini(name){if(!name) return "?"; return name.split(" ").filter(function(w){return w.length>0;}).map(function(w){return w[0];}).join("").substring(0,2).toUpperCase();}
function parseDayText(txt,ref){
  var M={ene:1,feb:2,mar:3,abr:4,may:5,jun:6,jul:7,ago:8,sep:9,oct:10,nov:11,dic:12};
  var m=txt.match(/(\d+)\s*(\w+)/);
  if(!m) return "";
  var day=parseInt(m[1]),monStr=(m[2]||"").toLowerCase().substring(0,3),mon=M[monStr];
  if(!mon) return "";
  var yr=ref.getFullYear();
  if(mon<ref.getMonth()-2) yr+=1;
  return yr+"-"+pad2(mon)+"-"+pad2(day);
}
function getWeekRangeText(){
  var navEl=document.querySelector("#p-guardias .gw-navrow");
  if(!navEl) return "";
  var textEls=Array.from(navEl.children).filter(function(c){return c.tagName!=="BUTTON"&&c.tagName!=="A"&&c.textContent.trim().length>3;});
  return textEls.length?textEls[0].textContent.trim():"";
}
var m4gSelDay=null;
function getWeekDaysFromDOM(){
  var gwb=document.querySelector("#p-guardias .gwb");
  if(!gwb) return [];
  var today=new Date();
  var todayStr=today.getFullYear()+"-"+pad2(today.getMonth()+1)+"-"+pad2(today.getDate());
  var dnames=["LUN","MAR","MIE","JUE","VIE","SAB","DOM"];
  var days=[];
  Array.from(gwb.children).forEach(function(col,i){
    var dateEl=col.querySelector(".gwdate");
    var dateText=dateEl?dateEl.textContent.trim():"";
    var dateISO=parseDayText(dateText,today);
    var weekend=isWeekend(dateISO);
    var agents=Array.from(col.querySelectorAll(".gwag")).map(function(ag){
      var ns=ag.querySelector(":scope > span");
      var rs=ag.querySelector(":scope > span > span");
      var id=ag.querySelector(":scope > div");
      var name="";
      if(ns) Array.from(ns.childNodes).forEach(function(node){if(node.nodeType===3) name+=node.textContent.trim();});
      return {name:name,role:rs?rs.textContent.trim():"titular",ini:id?id.textContent.trim():ini(name)};
    });
    var actItems=[];
    var minHour=weekend?0:15;
    Array.from(col.children).forEach(function(child){
      var cls=child.className||"";
      if(/gwdate|gwags|gwnb/.test(cls)||child.tagName==="BUTTON"||child.tagName==="A") return;
      Array.from(child.children).forEach(function(item){
        var txt=item.textContent.trim();
        if(txt.length<3||txt.indexOf("WhatsApp")>-1||txt.indexOf("Mail")>-1||txt.indexOf("Editar")>-1) return;
        var tm=txt.match(/(\d{1,2})[:\.](\d{2})|^(\d{1,2})\s*hs/i);
        var hr=0,ts="";
        if(tm){hr=parseInt(tm[1]||tm[3]||0);ts=pad2(hr)+":"+(tm[2]||"00");}
        if(hr>0&&hr<minHour) return;
        var iconEl=item.querySelector(":scope > span");
        var iconTxt=iconEl?iconEl.textContent.trim():"";
        var title=txt.replace(tm?tm[0]:"","").replace(iconTxt,"").trim().replace(/^[\s\-:]+/,"").substring(0,100);
        if(title.length<2) return;
        var type="cobertura";
        if(iconTxt==="\uD83D\uDDD3"||iconTxt==="\uD83D\uDCC5"||txt.indexOf("\uD83D\uDDD3")>-1) type="evento";
        else if(iconTxt==="\uD83D\uDCE2"||iconTxt==="\uD83D\uDCF1"||txt.indexOf("pub")>-1) type="publicacion";
        else if(iconTxt==="\uD83D\uDCFB") type="radio";
        actItems.push({time:ts,type:type,title:title});
      });
    });
    var seen={},dedup=[];
    actItems.forEach(function(a){var k=a.time+a.title.substring(0,15); if(!seen[k]){seen[k]=1;dedup.push(a);}});
    dedup.sort(function(a,b){return (a.time||"99:99").localeCompare(b.time||"99:99");});
    var eb=col.querySelector(".gwnb");
    var eo=eb?(eb.getAttribute("onclick")||""):"";
    days.push({dateText:dateText,dateISO:dateISO,isToday:dateISO===todayStr,isWeekend:weekend,agents:agents,activities:dedup,editOnclick:eo,dayName:dnames[i]||""});
  });
  return days;
}
function waMsg(agents,dateText,acts){
  var agName=agents.length?agents[0].name:"Sin asignar";
  var msg="Hola "+agName+", estas son tus actividades del dia "+dateText+":\n\n";
  if(!acts.length) msg+="Sin actividades.\n";
  else acts.forEach(function(a){var tp=a.type==="publicacion"?"Pub":a.type==="radio"?"Radio":"Cobertura"; msg+=(a.time?a.time+" hs - ":"")+tp+": "+a.title+"\n";});
  return msg+"\nGracias!";
}
function bdg(t){if(t==="evento") return "<span class=\"m4abadge m4bev\">&#128197; EVENTO</span>"; if(t==="publicacion") return "<span class=\"m4abadge m4bpub\">&#128226; PUB</span>"; if(t==="radio") return "<span class=\"m4abadge m4brad\">&#128251; RADIO</span>"; return "<span class=\"m4abadge m4bcob\">&#127919; COB</span>";}
function dayCard(d,active){
  var cls="m4gday"+(d.isToday?" m4today":"")+(active?" m4active":"");
  var ma=d.agents&&d.agents[0];
  var wu=ma?encodeURIComponent(waMsg(d.agents,d.dateText,d.activities)):"";
  var ah="";
  if(ma){ah="<div class=\"m4gav\">"+ma.ini+"</div><div class=\"m4ganame\">"+ma.name+"</div><div class=\"m4garole\">"+ma.role+"</div>"+(d.activities.length?"<div class=\"m4gcnt\">"+d.activities.length+" act.</div>":"")+(wu?"<button class=\"m4gwa\" onclick=\"event.stopPropagation();window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; WA</button>":"");}
  else ah="<div style=\"font-size:.6rem;color:#aaa;text-align:center\">Sin asignar</div>";
  var wb=d.isWeekend?"<div style=\"font-size:.52rem;background:#f3e8ff;color:#6c3fc5;border-radius:3px;padding:1px 3px\">GUARDIA</div>":"";
  return "<div class=\""+cls+"\" data-date=\""+d.dateISO+"\" onclick=\"window.m4gSel('"+d.dateISO+"')\"><div class=\"m4gdname\">"+d.dayName+"</div><div class=\"m4gdnum\">"+d.dateText+"</div>"+wb+ah+"</div>";
}
function dayDetail(dateISO,allDays){
  var d=null; for(var i=0;i<allDays.length;i++){if(allDays[i].dateISO===dateISO){d=allDays[i];break;}}
  if(!d) return "<div class=\"m4empty\">Selecciona un dia.</div>";
  var agents=d.agents||[],acts=d.activities||[];
  var agName=agents.length?agents[0].name:"Sin asignar";
  var wu=encodeURIComponent(waMsg(agents,d.dateText,acts));
  var timeLabel=d.isWeekend?"Todas las actividades del dia":"Actividades desde las 15:00 hs";
  var ah="";
  if(!acts.length) ah="<div class=\"m4empty\">Sin actividades para este dia.</div>";
  else acts.forEach(function(a){ah+="<div class=\"m4aitem\">"+(a.time?"<div class=\"m4atime\">"+a.time+"</div>":"")+"<div style=\"flex:1\">"+bdg(a.type)+"<div class=\"m4atitle\">"+(a.title||"")+"</div></div></div>";});
  var ce=acts.filter(function(a){return a.type==="evento";}).length;
  var cp=acts.filter(function(a){return a.type==="publicacion";}).length;
  var cc=acts.filter(function(a){return a.type==="cobertura";}).length;
  var editH=d.editOnclick?"<button class=\"m4dedit\" onclick=\""+d.editOnclick+"\">&#9998; Editar guardia</button>":"";
  var ac="";
  agents.forEach(function(ag){var aw=encodeURIComponent(waMsg([ag],d.dateText,acts)); ac+="<div class=\"m4agcard\"><div class=\"m4agav\">"+ag.ini+"</div><div class=\"m4agname\">"+ag.name+"</div><div class=\"m4agrole\">"+ag.role+"</div><button class=\"m4agwa\" onclick=\"window.open('https://wa.me/?text="+aw+"','_blank')\">&#128172; WA</button></div>";});
  if(!ac) ac="<div class=\"m4agcard\"><div class=\"m4empty\">Sin agente</div></div>";
  var out="<div class=\"m4gdetail\"><div class=\"m4dbox\"><div class=\"m4dhdr\"><div><div class=\"m4dtitle\">"+d.dateText.toUpperCase()+" - "+agName.toUpperCase();
  if(d.isWeekend) out+=" <span style=\"background:#f3e8ff;color:#6c3fc5;border-radius:5px;padding:1px 5px;font-size:.68rem\">FIN DE SEMANA</span>";
  out+="</div><div style=\"font-size:.73rem;color:#888;margin-top:2px\">"+timeLabel+"</div></div>";
  out+="<div class=\"m4dbtns\">"+editH+"<button class=\"m4dwa\" onclick=\"window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; Enviar WA</button></div></div>";
  out+="<div class=\"m4alist\">"+ah+"</div></div>";
  out+="<div class=\"m4sidebar\"><div class=\"m4sum\"><h3>Resumen</h3><div class=\"m4srow\"><span>Total</span><span class=\"m4sval\">"+acts.length+"</span></div><div class=\"m4srow\"><span>Eventos</span><span class=\"m4sval\">"+ce+"</span></div><div class=\"m4srow\"><span>Pubs</span><span class=\"m4sval\">"+cp+"</span></div><div class=\"m4srow\"><span>Coberturas</span><span class=\"m4sval\">"+cc+"</span></div></div>"+ac+"</div></div>";
  return out;
}
function buildGuardia(){
  var gp=document.querySelector("#p-guardias");
  if(!gp||getComputedStyle(gp).display==="none") return;
  var prev=document.querySelector("#m4g"); if(prev) prev.remove();
  var old=document.querySelector("#m4gwrap"); if(old) old.remove();
  var allDays=getWeekDaysFromDOM();
  var weekRange=getWeekRangeText();
  if(!weekRange&&allDays.length) weekRange=allDays[0].dateText+" - "+allDays[6].dateText;
  var today=new Date();
  var todayISO=today.getFullYear()+"-"+pad2(today.getMonth()+1)+"-"+pad2(today.getDate());
  if(!m4gSelDay||!allDays.find(function(d){return d.dateISO===m4gSelDay;})){
    var ti=allDays.find(function(d){return d.isToday;});
    m4gSelDay=ti?ti.dateISO:(allDays.length?allDays[0].dateISO:"");
  }
  var dayCl=allDays.map(function(d){return dayCard(d,d.dateISO===m4gSelDay);}).join("");
  var detailH=dayDetail(m4gSelDay,allDays);
  var p=document.createElement("div"); p.id="m4g";
  p.innerHTML="<div class=\"m4gh\"><div><h2>&#128737; Guardias Semanales</h2><p>Actividades desde las 15hs. Sab/Dom: todo el dia</p></div><button onclick=\"m4gSelDay=null;buildGuardia()\" style=\"background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:.85rem\" title=\"Actualizar\">&#128472;</button></div>"
    +"<div class=\"m4gnav\"><button onclick=\"goGuardWeek(-1);setTimeout(function(){m4gSelDay=null;buildGuardia();},600)\">&larr; Ant</button>"
    +"<div class=\"m4gwrange\">"+weekRange+"</div>"
    +"<button onclick=\"goGuardWeek(1);setTimeout(function(){m4gSelDay=null;buildGuardia();},600)\">Sig &rarr;</button>"
    +"<button class=\"m4ghoy\" onclick=\"goGuardWeek(0);setTimeout(function(){m4gSelDay=null;buildGuardia();},600)\">Hoy</button></div>"
    +"<div class=\"m4gdays\">"+dayCl+"</div>"
    +"<div id=\"m4gdwrap\">"+detailH+"</div>";
  gp.insertBefore(p,gp.firstChild);
  window.m4gSel=function(dateISO){
    m4gSelDay=dateISO;
    document.querySelectorAll(".m4gday").forEach(function(x){x.classList.toggle("m4active",x.dataset.date===dateISO);});
    var w=document.querySelector("#m4gdwrap"); if(w) w.innerHTML=dayDetail(dateISO,allDays);
  };
}

function init(){
  inyectarCSS();
  parchearNav();
  fixScrollTablero();
  // Detect current tab
  var body=document.body;
  var tb=document.querySelector("#p-tablero");
  if(tb&&getComputedStyle(tb).display!=="none") body.classList.add("m4tab-tablero");
  else if(tb) tb.style.setProperty("display","none","important");
  ocultarRealizada();
  var gp=document.querySelector("#p-guardias");
  if(gp&&getComputedStyle(gp).display!=="none") buildGuardia();
  var obs=new MutationObserver(function(){
    ocultarRealizada();
    var g=document.querySelector("#p-guardias");
    if(g&&getComputedStyle(g).display!=="none"&&!document.querySelector("#m4g")) buildGuardia();
  });
  document.querySelectorAll("[id^=p-]").forEach(function(el){obs.observe(el,{attributes:true,attributeFilter:["style","class"]});});
  var main=document.querySelector("#main,main,.main-content"); if(main) obs.observe(main,{childList:true,subtree:false,attributes:true,attributeFilter:["style","class"]});
  var n=0,iv=setInterval(function(){
    ocultarRealizada();
    var g=document.querySelector("#p-guardias");
    if(g&&getComputedStyle(g).display!=="none"&&!document.querySelector("#m4g")) buildGuardia();
    if(++n>=20) clearInterval(iv);
  },400);
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();

})();
