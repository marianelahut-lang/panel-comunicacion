// === PANEL MEJORAS v3.1 — Municipalidad de Tres Arroyos ===
(function(){
'use strict';

var s=document.createElement('style');
s.id='pm-css';
s.textContent='.sbi{padding:8px 14px!important;font-size:12px!important;gap:9px!important;border-radius:8px!important;margin:1px 6px!important;transition:background .12s,color .12s!important}.sbi svg{width:15px!important;height:15px!important;flex-shrink:0!important}.sbi.on{border-radius:8px!important}.sb-sec{padding:10px 16px 3px!important;font-size:9px!important;font-weight:700!important;letter-spacing:.12em!important}.pv-wrap{display:flex;gap:6px;align-items:center;padding:8px 0 2px}.pv-btn{padding:5px 14px;border:0.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;transition:all .15s;background:#fff;color:#374151;font-family:Inter,sans-serif}.pv-btn.on{background:#6d28d9!important;color:#fff!important;border-color:#6d28d9!important}.ptitle{font-size:15px!important;font-weight:600!important}.content{animation:pvFade .15s ease}@keyframes pvFade{from{opacity:.85}to{opacity:1}}body.dark .pv-btn{background:#252830!important;color:#8892a4!important;border-color:#373b47!important}body.dark .pv-btn.on{background:#6d28d9!important;color:#fff!important;border-color:#6d28d9!important}';
document.head.appendChild(s);

function cargarReclamos(){
  if(window._reclamosLoaded) return;
  var sc=document.createElement('script');
  sc.src='reclamos.js';
  sc.onload=function(){ window._reclamosLoaded=true; setTimeout(initRec,400); };
  document.head.appendChild(sc);
}
function initRec(){
  if(typeof window.initReclamos==='function') window.initReclamos();
  if(typeof window.inyectarPanelReclamos==='function') window.inyectarPanelReclamos();
  if(typeof window.inyectarBtnReclamos==='function') window.inyectarBtnReclamos();
}

function ocultarMetricas(){
  document.querySelectorAll('.sbi,.ntab').forEach(function(b){
    var t=b.textContent||'',oc=b.getAttribute('onclick')||'';
    if((t.includes('trica')||oc.includes('metrica'))&&!b.dataset.mh){
      b.style.display='none';b.dataset.mh='1';
    }
  });
  document.querySelectorAll('[id*="metricas"],[id*="Metricas"]').forEach(function(el){el.style.display='none';});
}

var _pv=localStorage.getItem('pvista')||'hoy';
window.setPubVista=function(v){_pv=v;localStorage.setItem('pvista',v);_applyPV();_updPVBtns();};
function _applyPV(){
  var p=document.getElementById('p-publicaciones');
  if(!p)return;
  var dk=p.querySelector('.gw-desktop'),mb=p.querySelector('.gw-mobile');
  if(_pv==='hoy'){
    if(dk)dk.style.display='none';
    if(mb)mb.style.cssText='display:flex!important;flex:1;flex-direction:column;overflow:hidden';
    if(typeof renderPubDay==='function')setTimeout(renderPubDay,0);
  }else{
    if(dk)dk.style.display='';
    if(mb)mb.style.cssText='';
    if(typeof renderWeek==='function')setTimeout(renderWeek,0);
  }
}
function _updPVBtns(){
  var bH=document.getElementById('pvb-hoy'),bS=document.getElementById('pvb-sem');
  if(bH)bH.className='pv-btn'+(_pv==='hoy'?' on':'');
  if(bS)bS.className='pv-btn'+(_pv==='semana'?' on':'');
}
function insertTogglePub(){
  var p=document.getElementById('p-publicaciones');
  if(!p||document.getElementById('pvb-hoy'))return;
  var pt=p.querySelector('.ptop');
  if(!pt)return;
  var w=document.createElement('div');
  w.className='pv-wrap';
  w.innerHTML='<span style="font-size:11px;color:#6b7280;font-weight:500">VISTA:</span><button id="pvb-hoy" class="pv-btn'+(_pv==='hoy'?' on':'')+'" onclick="setPubVista('hoy')">Hoy</button><button id="pvb-sem" class="pv-btn'+(_pv==='semana'?' on':'')+'" onclick="setPubVista('semana')">Semana</button>';
  pt.appendChild(w);
}

function patchNav(){
  if(window.__navM||typeof window.nav!=='function')return;
  var _o=window.nav;
  window.nav=function(page,data,btn){
    _o.call(this,page,data,btn);
    setTimeout(function(){
      ocultarMetricas();
      if(page==='publicaciones'){insertTogglePub();_applyPV();}
      if(page==='reclamos'){
        cargarReclamos();
        setTimeout(function(){if(typeof window.loadReclamos==='function')window.loadReclamos();},500);
      }
    },80);
  };
  window.__navM=true;
}

function init(){
  ocultarMetricas();
  patchNav();
  cargarReclamos();
  setTimeout(function(){
    var pP=document.getElementById('p-publicaciones');
    if(pP&&getComputedStyle(pP).display!=='none'){insertTogglePub();_applyPV();}
  },700);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){setTimeout(init,600);});
}else{setTimeout(init,600);}
})();
