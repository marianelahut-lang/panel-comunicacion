/* ============================================================
   MEJORAS4.JS - Panel Comunicacion Tres Arroyos v1.0
   Mejoras al tablero HOY:
   1. Casilla "Cubrir" en cada evento del calendario
   2. Al marcar cubierto -> color morado
   3. Eventos despues de las 15hs -> badge Guardia (amarillo)
   4. Guardia cubierta -> color verde
   El estado se guarda en localStorage y persiste entre sesiones.
============================================================ */
(function(){
"use strict";

var STORAGE_KEY = 'hoy_cubierto_v1';

function getCubiertos(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); }catch(e){ return {}; }
}

function todayISO(){
  var n=new Date();
  return n.getFullYear()+'-'+(n.getMonth()<9?'0':'')+(n.getMonth()+1)+'-'+(n.getDate()<10?'0':'')+n.getDate();
}

function fixCSSHidden(){
  var m4css=document.getElementById('m4css');
  if(!m4css) return;
  if(m4css.textContent.indexOf('#hoy-cal-m4g,#hoy-tasks-m4g{display:none!important}')>-1){
    m4css.textContent=m4css.textContent.replace(
      '#hoy-cal-m4g,#hoy-tasks-m4g{display:none!important}',
      '/* hoy-cal y hoy-tasks: visibles */'
    );
  }
}

window.mejorarAgendaHoy=function(){
  var m1hoy=document.getElementById('m1-panel-hoy');
  var agDiv=m1hoy?m1hoy.children[2]:null;
  var agPart=agDiv?agDiv.children[0]:null;
  if(!agPart) return;
  var cubiertos=getCubiertos();
  var today=todayISO();
  for(var i=0;i<agPart.children.length;i++){
    var row=agPart.children[i];
    var timeSpan=row.children[0];
    if(!timeSpan||!timeSpan.textContent.match(/^\d{1,2}:\d{2}/)) continue;
    var hora=timeSpan.textContent.replace(/\s*hs\s*/i,'').trim();
    var isGuardia=hora>='15:00';
    var titleDiv=row.children[2]||row.children[1];
    var title=titleDiv?titleDiv.textContent.trim():'';
    var key=today+'_'+hora+'_'+title.substring(0,20).replace(/[^a-zA-Z0-9]/g,'');
    var isCubierto=!!cubiertos[key];
    if(isCubierto&&isGuardia){
      row.style.cssText='display:flex;gap:10px;padding:8px 10px;border-bottom:1px solid #f3f4f6;align-items:center;background:#d1fae5;border-left:3px solid #059669;border-radius:6px;margin-bottom:2px';
    }else if(isCubierto){
      row.style.cssText='display:flex;gap:10px;padding:8px 10px;border-bottom:1px solid #f3f4f6;align-items:center;background:#ede9fe;border-left:3px solid #7c3aed;border-radius:6px;margin-bottom:2px';
    }else if(isGuardia){
      row.style.cssText='display:flex;gap:10px;padding:8px 10px;border-bottom:1px solid #f3f4f6;align-items:center;background:#fef3c7;border-left:3px solid #f59e0b;border-radius:6px;margin-bottom:2px';
    }else{
      row.style.cssText='display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;align-items:center';
    }
    if(isCubierto&&isGuardia){timeSpan.style.color='#059669';timeSpan.style.fontWeight='700';}
    else if(isCubierto){timeSpan.style.color='#7c3aed';timeSpan.style.fontWeight='700';}
    else if(isGuardia){timeSpan.style.color='#d97706';timeSpan.style.fontWeight='700';}
    else{timeSpan.style.color='#2563eb';timeSpan.style.fontWeight='700';}
    var badge=row.querySelector('.hoy-guardia-badge');
    if(isGuardia&&!badge){
      badge=document.createElement('span');badge.className='hoy-guardia-badge';
      badge.style.cssText='font-size:.6rem;font-weight:700;border-radius:4px;padding:1px 5px;white-space:nowrap;flex-shrink:0;display:inline-block';
      if(timeSpan.nextSibling){row.insertBefore(badge,timeSpan.nextSibling);}else{row.appendChild(badge);}
    }
    if(isGuardia&&badge){
      if(isCubierto){badge.style.background='#059669';badge.style.color='#fff';badge.textContent='✅ Guardia Cubierta';}
      else{badge.style.background='#fbbf24';badge.style.color='#78350f';badge.textContent='🛡️ Guardia';}
    }
    var ourBtn=row.querySelector('.hoy-cubrir-btn-m4');
    if(!ourBtn){
      var origBtn=row.querySelector('button:not(.hoy-cubrir-btn-m4)');
      if(origBtn)origBtn.remove();
      ourBtn=document.createElement('button');ourBtn.className='hoy-cubrir-btn-m4';
      ourBtn.setAttribute('data-key',key);
      ourBtn.style.cssText='margin-left:auto;border-radius:6px;padding:3px 10px;cursor:pointer;font-size:.72rem;white-space:nowrap;flex-shrink:0;transition:all .2s;font-weight:600;border:1px solid #d1d5db;background:#f9fafb;color:#6b7280';
      row.appendChild(ourBtn);
      ourBtn.addEventListener('click',function(e){
        e.stopPropagation();
        var k=this.getAttribute('data-key');
        var cv=getCubiertos();
        if(cv[k]){delete cv[k];}else{cv[k]=true;}
        localStorage.setItem(STORAGE_KEY,JSON.stringify(cv));
        window.mejorarAgendaHoy();
      });
    }
    if(isCubierto&&isGuardia){
      ourBtn.textContent='✅ Cubierto (Guardia)';
      ourBtn.style.background='#d1fae5';ourBtn.style.color='#059669';ourBtn.style.border='1px solid #059669';
    }else if(isCubierto){
      ourBtn.textContent='✅ Cubierto';
      ourBtn.style.background='#ede9fe';ourBtn.style.color='#7c3aed';ourBtn.style.border='1px solid #7c3aed';
    }else{
      ourBtn.textContent='📋 Cubrir';
      ourBtn.style.background='#f9fafb';ourBtn.style.color='#6b7280';ourBtn.style.border='1px solid #d1d5db';
    }
  }
};

function inicializar(){
  fixCSSHidden();
  if((window._m4gcal||[]).length===0&&typeof window.syncGCal==='function'){
    window._m4gcal=[];window.syncGCal();
  }
  if(!window._m4navPatchedM4){
    window._m4navPatchedM4=true;
    var origNav=window.nav;
    if(typeof origNav==='function'){
      window.nav=function(id){origNav.apply(this,arguments);if(id==='hoy'){setTimeout(window.mejorarAgendaHoy,400);}};
    }
  }
  var targetNode=document.getElementById('m1-panel-hoy');
  if(targetNode&&!window._m4obsM4){
    window._m4obsM4=new MutationObserver(function(){
      clearTimeout(window._m4obsTimerM4);
      window._m4obsTimerM4=setTimeout(function(){
        var phoy=document.getElementById('p-hoy');
        if(phoy&&phoy.style.display!=='none'&&phoy.offsetParent!==null){
          window.mejorarAgendaHoy();
        }
      },200);
    });
    window._m4obsM4.observe(targetNode,{childList:true,subtree:true});
  }
  setTimeout(window.mejorarAgendaHoy,800);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){setTimeout(inicializar,800);});
}else{
  setTimeout(inicializar,800);
}

})();
