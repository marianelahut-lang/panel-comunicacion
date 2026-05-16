/* ==================================================
   MEJORAS3.JS v5 - Panel Comunicacion Tres Arroyos
   Lee datos reales del DOM original.
   NO modifica datos ni logica funcional.
   ================================================== */

(function(){
"use strict";

function inyectarCSS(){
  if(document.getElementById("m4css")) return;
  var s=document.createElement("style");
  s.id="m4css";
  var css="";
  /* Tablero oculto por default */
  css+="#p-tablero{display:none!important}\n";
  css+="body.m4tab-tablero #p-tablero{display:flex!important}\n";
  /* Kanban columna Realizada */
  css+=".m4col-hide{display:none!important}\n";
  /* Ocultar original guard elements pero mantener botones editables */
  css+="#p-guardias .ptop{display:none!important}\n";
  css+="#p-guardias .gw-navrow{display:none!important}\n";
  css+="#p-guardias .acts.gw-mobile{display:none!important}\n";
  css+="#p-guardias .gw-mobile{display:none!important}\n";
  css+="#p-guardias #m1-pubs-guardias{display:none!important}\n";
  /* Ocultar el contenedor de la tabla semanal original */
  css+="#p-guardias .gwtbl{display:none!important}\n";
  /* Ocultar el ptitle dentro del primer gw-desktop */
  css+="#p-guardias .ptitle{display:none!important}\n";
  /* Panel nuevo */
  css+="#m4g{width:100%;padding:16px;box-sizing:border-box;font-family:inherit}\n";
  css+="#m4g .m4gh{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#6c3fc5,#4f46e5);color:#fff;border-radius:12px;padding:16px 20px;margin-bottom:16px}\n";
  css+="#m4g .m4gh h2{margin:0;font-size:1.1rem;font-weight:700}\n";
  css+="#m4g .m4gh p{margin:4px 0 0;font-size:.85rem;opacity:.85}\n";
  css+="#m4g .m4gnav{display:flex;align-items:center;gap:12px;margin-bottom:16px}\n";
  css+="#m4g .m4gnav button{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:.85rem;font-weight:600}\n";
  css+="#m4g .m4gwrange{flex:1;text-align:center;font-size:.9rem;font-weight:600;color:var(--color-fg-default,#1f2328)}\n";
  css+="#m4g .m4ghoy{background:#6c3fc5!important;color:#fff!important;border-color:#6c3fc5!important}\n";
  css+="#m4g .m4gdays{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:16px}\n";
  css+="@media(max-width:700px){#m4g .m4gdays{grid-template-columns:repeat(3,1fr)}}\n";
  css+="#m4g .m4gday{background:var(--color-canvas-subtle,#f6f8fa);border:2px solid var(--color-border-default,#d0d7de);border-radius:12px;padding:10px 8px;cursor:pointer;min-height:110px;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all .2s}\n";
  css+="#m4g .m4gday:hover{border-color:#6c3fc5}\n";
  css+="#m4g .m4gday.m4active{border-color:#6c3fc5!important;background:rgba(108,63,197,.08)!important}\n";
  css+="#m4g .m4gday.m4today{border-color:#f59e0b!important}\n";
  css+="#m4g .m4gdname{font-size:.7rem;font-weight:700;text-transform:uppercase;color:#888}\n";
  css+="#m4g .m4gdnum{font-size:1.2rem;font-weight:800;color:var(--color-fg-default,#1f2328)}\n";
  css+="#m4g .m4today .m4gdnum{color:#f59e0b}\n";
  css+="#m4g .m4active .m4gdnum{color:#6c3fc5}\n";
  css+="#m4g .m4gav{width:32px;height:32px;border-radius:50%;background:#6c3fc5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700}\n";
  css+="#m4g .m4ganame{font-size:.7rem;font-weight:600;text-align:center;line-height:1.2}\n";
  css+="#m4g .m4garole{font-size:.6rem;color:#888}\n";
  css+="#m4g .m4gcnt{background:#6c3fc5;color:#fff;border-radius:20px;padding:2px 8px;font-size:.65rem;font-weight:700;margin-top:2px}\n";
  css+="#m4g .m4gwa{background:#25d366;color:#fff;border:none;border-radius:8px;padding:3px 8px;font-size:.65rem;font-weight:700;cursor:pointer;margin-top:2px;width:100%}\n";
  css+="#m4g .m4gdetail{display:grid;grid-template-columns:1fr 220px;gap:16px}\n";
  css+="@media(max-width:700px){#m4g .m4gdetail{grid-template-columns:1fr}}\n";
  css+="#m4g .m4dbox{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:12px;padding:16px}\n";
  css+="#m4g .m4dhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px}\n";
  css+="#m4g .m4dtitle{font-size:.95rem;font-weight:700}\n";
  css+="#m4g .m4dbtns{display:flex;gap:6px;flex-wrap:wrap}\n";
  css+="#m4g .m4dedit{background:var(--color-canvas-subtle,#f6f8fa);border:1px solid var(--color-border-default,#d0d7de);border-radius:8px;padding:6px 12px;font-size:.8rem;cursor:pointer}\n";
  css+="#m4g .m4dwa{background:#25d366;color:#fff;border:none;border-radius:8px;padding:6px 14px;font-size:.8rem;font-weight:700;cursor:pointer}\n";
  css+="#m4g .m4alist{display:flex;flex-direction:column;gap:8px}\n";
  css+="#m4g .m4aitem{background:var(--color-canvas-default,#fff);border:1px solid var(--color-border-default,#d0d7de);border-radius:10px;padding:10px 12px;display:flex;align-items:flex-start;gap:10px}\n";
  css+="#m4g .m4atime{font-size:.85rem;font-weight:800;min-width:42px;color:#6c3fc5}\n";
  css+="#m4g .m4abadge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:6px;font-size:.65rem;font-weight:700;white-space:nowrap}\n";
  css+="#m4g .m4bev{background:#dbeafe;color:#1d4ed8}\n";
  css+="#m4g .m4bpub{background:#fce7f3;color:#be185d}\n";
  css+="#m4g .m4bcob{background:#dcfce7;color:#15803d}\n";
  css+="#m4g .m4atitle{font-size:.85rem;font-weight:600;line-height:1.3}\n";
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
    if(id==="guardias") setTimeout(buildGuardia,200);
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

/* LEER DATOS DEL DOM ORIGINAL */
function getWeekDaysFromDOM(){
  // Read the 7 day columns from the original hidden .gwb table
  var gwb=document.querySelector("#p-guardias .gwb");
  if(!gwb) return [];
  var days=[];
  var today=new Date();
  var todayStr=(today.getFullYear())+"-"+pad2(today.getMonth()+1)+"-"+pad2(today.getDate());
  // Get the week range text to determine year
  var rangeEl=document.querySelector("#p-guardias .gw-navrow .m4gwrange, #p-guardias .gw-navrow div");
  // For each of 7 day columns
  Array.from(gwb.children).forEach(function(col,i){
    var dateEl=col.querySelector(".gwdate");
    var dateText=dateEl?dateEl.textContent.trim():"";
    // Parse date like "16 may" -> get year from context
    var dateISO=parseDayText(dateText,today);
    var agentEls=col.querySelectorAll(".gwag");
    var agents=Array.from(agentEls).map(function(ag){
      var nameSpan=ag.querySelector(":scope > span");
      var rolSpan=ag.querySelector(":scope > span > span");
      var initDiv=ag.querySelector(":scope > div");
      var name="";
      if(nameSpan){
        Array.from(nameSpan.childNodes).forEach(function(node){
          if(node.nodeType===3) name+=node.textContent.trim();
        });
      }
      return {name:name,role:rolSpan?rolSpan.textContent.trim():"titular",ini:initDiv?initDiv.textContent.trim():initials(name)};
    });
    // Get activities (items in the day column after gwdate and gwags)
    var actItems=[];
    Array.from(col.children).forEach(function(child){
      if(child.classList.contains("gwdate")||child.classList.contains("gwags")||child.classList.contains("gwnb")||child.tagName==="BUTTON"||child.tagName==="A") return;
      // Check if this is a coverage/activity container
      var subItems=child.querySelectorAll(":scope > div");
      subItems.forEach(function(item){
        var txt=item.textContent.trim();
        // Parse time and title
        var timeMatch=txt.match(/(\d{1,2}[:\.]\d{2}|\d{1,2}\s*hs?)/i);
        var timeStr=timeMatch?timeMatch[0].replace(/\s/g,"").replace("hs",""):"";
        // Normalize time to HH:MM
        if(timeStr&&!timeStr.includes(":")){
          var h=parseInt(timeStr);
          if(!isNaN(h)) timeStr=pad2(h)+":00";
        }
        var hrNum=timeStr?parseInt(timeStr):0;
        var icon=item.querySelector("span");
        var iconTxt=icon?icon.textContent.trim():"";
        var title=txt.replace(timeMatch?timeMatch[0]:"","").replace(iconTxt,"").trim();
        title=title.substring(0,80);
        // Determine type by icon
        var type="cobertura";
        if(iconTxt==="🗓"||iconTxt==="📅") type="evento";
        else if(iconTxt==="📢"||iconTxt==="📱") type="publicacion";
        else if(iconTxt==="📻") type="radio";
        if(hrNum>=15&&title.length>2){
          actItems.push({time:timeStr||"15:00",type:type,title:title});
        }
      });
    });
    // Also check gw-mejora-v569 elements
    col.querySelectorAll(".gw-mejora-v569 > div").forEach(function(item){
      if(item.querySelector("button")) return; // skip WA button rows
      var txt=item.textContent.trim();
      // Count pubs and cobs from summary lines
    });
    var editBtn=col.querySelector(".gwnb");
    var editOnclick=editBtn?editBtn.getAttribute("onclick"):"null";
    var isToday=(dateISO===todayStr);
    var dayNames=["LUN","MAR","MIE","JUE","VIE","SAB","DOM"];
    days.push({dateText:dateText,dateISO:dateISO,isToday:isToday,agents:agents,activities:actItems,editOnclick:editOnclick,dayName:dayNames[i]||""});
  });
  return days;
}

function pad2(n){return n<10?"0"+n:""+n;}

function parseDayText(txt,refDate){
  // txt like "16 may" -> return YYYY-MM-DD
  var months={ene:1,feb:2,mar:3,abr:4,may:5,jun:6,jul:7,ago:8,sep:9,oct:10,nov:11,dic:12};
  var m=txt.match(/(\d+)\s*(\w+)/);
  if(!m) return "";
  var day=parseInt(m[1]);
  var monStr=(m[2]||"").toLowerCase().substring(0,3);
  var mon=months[monStr];
  if(!mon) return "";
  // Determine year from reference date
  var yr=refDate.getFullYear();
  // If month is much earlier than current, it might be next year
  var refMon=refDate.getMonth()+1;
  if(mon<refMon-3) yr+=1;
  return yr+"-"+pad2(mon)+"-"+pad2(day);
}

function initials(name){
  if(!name) return "?";
  return name.split(" ").filter(function(w){return w.length>0;}).map(function(w){return w[0];}).join("").substring(0,2).toUpperCase();
}

function getWeekRangeText(){
  var navEl=document.querySelector("#p-guardias .gw-navrow");
  if(!navEl) return "";
  // The range is usually in a div/span in the navrow
  var textNodes=Array.from(navEl.children).filter(function(c){
    return c.tagName!=="BUTTON"&&c.tagName!=="A"&&c.textContent.trim().length>3;
  });
  return textNodes.length?textNodes[0].textContent.trim():"";
}

function waMsg(agents,dateText,acts){
  var agName=agents.length?agents[0].name:"Sin asignar";
  var msg="Hola "+agName+", estas son tus coberturas del dia\n"+dateText+":\n\n";
  var a15=acts.filter(function(a){return parseInt(a.time||0)>=15;});
  if(!a15.length) msg+="Sin actividades asignadas desde las 15:00 hs.\n";
  else a15.forEach(function(a){
    var tp=a.type==="publicacion"?"Publicacion":a.type==="radio"?"Radio":"Cobertura/Evento";
    msg+=a.time+" hs - "+tp+": "+a.title+"\n";
  });
  return msg+"\nGracias!";
}

function bdg(type){
  if(type==="evento") return "<span class=\"m4abadge m4bev\">&#128197; EVENTO</span>";
  if(type==="publicacion") return "<span class=\"m4abadge m4bpub\">&#128226; PUBLICACION</span>";
  return "<span class=\"m4abadge m4bcob\">&#127919; COBERTURA</span>";
}

function dayCard(dayData,isActive){
  var cls="m4gday"+(dayData.isToday?" m4today":"")+(isActive?" m4active":"");
  var agents=dayData.agents||[];
  var acts=dayData.activities||[];
  var mainAgent=agents[0]||null;
  var iniStr=mainAgent?mainAgent.ini:"?";
  var wu=mainAgent?encodeURIComponent(waMsg(agents,dayData.dateText,acts)):"";
  var ah="";
  if(mainAgent){
    ah="<div class=\"m4gav\">"+iniStr+"</div>";
    ah+="<div class=\"m4ganame\">"+mainAgent.name+"</div>";
    ah+="<div class=\"m4garole\">"+mainAgent.role+"</div>";
    if(acts.length) ah+="<div class=\"m4gcnt\">"+acts.length+" act.</div>";
    ah+="<button class=\"m4gwa\" onclick=\"event.stopPropagation();window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; WA</button>";
  } else {
    ah="<div style=\"font-size:.65rem;color:#aaa;text-align:center\">Sin asignar</div>";
  }
  return "<div class=\""+cls+"\" data-date=\""+dayData.dateISO+"\" onclick=\"window.m4gSel('"+dayData.dateISO+"')\">"
    +"<div class=\"m4gdname\">"+dayData.dayName+"</div>"
    +"<div class=\"m4gdnum\">"+dayData.dateText+"</div>"
    +ah+"</div>";
}

function dayDetail(dateISO,allDays){
  var dayData=null;
  for(var i=0;i<allDays.length;i++){if(allDays[i].dateISO===dateISO){dayData=allDays[i];break;}}
  if(!dayData) return "<div class=\"m4empty\">Selecciona un dia.</div>";
  var agents=dayData.agents||[];
  var acts=dayData.activities||[];
  var mainAgent=agents[0]||null;
  var agName=mainAgent?mainAgent.name:"Sin asignar";
  var wu=encodeURIComponent(waMsg(agents,dayData.dateText,acts));
  var actsHTML="";
  if(!acts.length){
    actsHTML="<div class=\"m4empty\">Sin actividades desde las 15:00 hs.</div>";
  } else {
    acts.forEach(function(a){
      actsHTML+="<div class=\"m4aitem\">"
        +"<div class=\"m4atime\">"+(a.time||"")+"</div>"
        +"<div style=\"flex:1\">"+bdg(a.type)+"<div class=\"m4atitle\">"+(a.title||"")+"</div></div>"
        +"</div>";
    });
  }
  var ce=acts.filter(function(a){return a.type==="evento";}).length;
  var cp=acts.filter(function(a){return a.type==="publicacion";}).length;
  var cc=acts.filter(function(a){return a.type==="cobertura";}).length;
  // Edit button - use original app function
  var editH="";
  if(dayData.editOnclick&&dayData.editOnclick!=="null"){
    editH="<button class=\"m4dedit\" onclick=\""+dayData.editOnclick+"\">&#9998; Editar guardia</button>";
  }
  // Agent cards for all agents
  var agCardH="";
  agents.forEach(function(ag){
    var awu=encodeURIComponent(waMsg([ag],dayData.dateText,acts));
    agCardH+="<div class=\"m4agcard\">"
      +"<div class=\"m4agav\">"+ag.ini+"</div>"
      +"<div class=\"m4agname\">"+ag.name+"</div>"
      +"<div class=\"m4agrole\">"+ag.role+"</div>"
      +"<button class=\"m4agwa\" onclick=\"window.open('https://wa.me/?text="+awu+"','_blank')\">&#128172; WhatsApp</button>"
      +"</div>";
  });
  if(!agCardH) agCardH="<div class=\"m4empty\">Sin agente asignado</div>";
  return "<div class=\"m4gdetail\">"
    +"<div class=\"m4dbox\">"
      +"<div class=\"m4dhdr\">"
        +"<div><div class=\"m4dtitle\">"+dayData.dateText.toUpperCase()+" - "+agName.toUpperCase()+"</div>"
        +"<div style=\"font-size:.75rem;color:#888;margin-top:2px\">Actividades desde las 15:00 hs</div></div>"
        +"<div class=\"m4dbtns\">"
          +editH
          +"<button class=\"m4dwa\" onclick=\"window.open('https://wa.me/?text="+wu+"','_blank')\">&#128172; Enviar WA</button>"
        +"</div>"
      +"</div>"
      +"<div class=\"m4alist\">"+actsHTML+"</div>"
    +"</div>"
    +"<div class=\"m4sidebar\">"
      +"<div class=\"m4sum\"><h3>Resumen</h3>"
        +"<div class=\"m4srow\"><span>Total</span><span class=\"m4sval\">"+acts.length+"</span></div>"
        +"<div class=\"m4srow\"><span>Eventos</span><span class=\"m4sval\">"+ce+"</span></div>"
        +"<div class=\"m4srow\"><span>Publicaciones</span><span class=\"m4sval\">"+cp+"</span></div>"
        +"<div class=\"m4srow\"><span>Coberturas</span><span class=\"m4sval\">"+cc+"</span></div>"
      +"</div>"
      +agCardH
    +"</div>"
  +"</div>";
}

var m4gSelDay=null;

function buildGuardia(){
  var gp=document.querySelector("#p-guardias");
  if(!gp||getComputedStyle(gp).display==="none") return;
  // Remove previous injection
  var prev=document.querySelector("#m4g"); if(prev) prev.remove();
  var old=document.querySelector("#m4gwrap"); if(old) old.remove();
  // Also hide the gw-desktop wrappers that still show (the ones containing gwtbl is hidden by CSS)
  // But keep .gw-desktop > .gwtbl hidden so we can still read its data
  // Read data from original DOM
  var allDays=getWeekDaysFromDOM();
  var weekRange=getWeekRangeText();
  // If no week range from nav, build from day data
  if(!weekRange&&allDays.length){
    weekRange=allDays[0].dateText+" - "+allDays[6].dateText;
  }
  // Set selected day to today or first day
  var todayDay=null;
  var today=new Date();
  var todayISO=(today.getFullYear())+"-"+pad2(today.getMonth()+1)+"-"+pad2(today.getDate());
  allDays.forEach(function(d){if(d.isToday) todayDay=d.dateISO;});
  if(!m4gSelDay||!allDays.find(function(d){return d.dateISO===m4gSelDay;})){
    m4gSelDay=todayDay||(allDays.length?allDays[0].dateISO:"");
  }
  var dayCl=allDays.map(function(d){return dayCard(d,d.dateISO===m4gSelDay);}).join("");
  var detailH=dayDetail(m4gSelDay,allDays);
  var p=document.createElement("div");
  p.id="m4g";
  p.innerHTML=
    "<div class=\"m4gh\">"
      +"<div><h2>&#128737; Guardias Semanales</h2><p>Actividades desde las 15:00 hs</p></div>"
      +"<button onclick=\"m4gSelDay=null;buildGuardia()\" style=\"background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:.9rem\" title=\"Actualizar\">&#128472;</button>"
    +"</div>"
    +"<div class=\"m4gnav\">"
      +"<button onclick=\"goGuardWeek(-1);setTimeout(function(){m4gSelDay=null;buildGuardia();},500)\">&larr; Ant</button>"
      +"<div class=\"m4gwrange\">"+weekRange+"</div>"
      +"<button onclick=\"goGuardWeek(1);setTimeout(function(){m4gSelDay=null;buildGuardia();},500)\">Sig &rarr;</button>"
      +"<button class=\"m4ghoy\" onclick=\"goGuardWeek(0);setTimeout(function(){m4gSelDay=null;buildGuardia();},500)\">Hoy</button>"
    +"</div>"
    +"<div class=\"m4gdays\">"+dayCl+"</div>"
    +"<div id=\"m4gdwrap\">"+detailH+"</div>";
  gp.insertBefore(p,gp.firstChild);
  window.m4gSel=function(dateISO){
    m4gSelDay=dateISO;
    document.querySelectorAll(".m4gday").forEach(function(x){x.classList.toggle("m4active",x.dataset.date===dateISO);});
    var w=document.querySelector("#m4gdwrap"); if(w) w.innerHTML=dayDetail(dateISO,allDays);
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
