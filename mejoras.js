// === MEJORAS PANEL COMUNICACION TA v2.0 ===
(function(){
'use strict';
var CSS='.rec-tab{padding:7px 14px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;font-size:12px;font-weight:500;color:#6b7280;font-family:Inter,sans-serif}'+
'.rec-tab.on{color:#6d28d9;border-bottom-color:#6d28d9}'+
'.rec-card{background:#fff;border:0.5px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:8px}'+
'.rec-inp{width:100%;padding:7px 10px;border:0.5px solid #d1d5db;border-radius:7px;font-size:13px;font-family:Inter,sans-serif;outline:none;box-sizing:border-box;background:#fff;color:#111827}'+
'.rec-lbl{display:block;font-size:10px;font-weight:500;color:#6b7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em}'+
'.rec-prim{padding:7px 14px;background:#6d28d9;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500}'+
'.rec-wa{background:#25d366;color:#fff;width:100%;padding:10px;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:7px}'+
'.rec-wa:disabled{background:#d1d5db;cursor:not-allowed}'+
'.rec-sm{padding:4px 7px;border:0.5px solid #e5e7eb;border-radius:5px;background:transparent;cursor:pointer;font-size:11px}'+
'.rec-av{width:32px;height:32px;border-radius:50%;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:#6d28d9;flex-shrink:0}'+
'.sbi{padding:8px 14px!important;font-size:12px!important;gap:9px!important;border-radius:8px!important;margin:1px 6px!important;transition:background .12s,color .12s!important}'+
'.sbi svg{width:15px!important;height:15px!important;flex-shrink:0!important}'+
'.sbi.on{border-radius:8px!important}'+
'.pv-wrap{display:flex;gap:6px;align-items:center;padding:8px 0 0}'+
'.pv-btn{padding:5px 14px;border:0.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;transition:all .15s;background:#fff;color:#374151;font-family:Inter,sans-serif}'+
'.pv-btn.on{background:#6d28d9;color:#fff;border-color:#6d28d9}'+
'.content{animation:pvFade .15s ease}'+
'@keyframes pvFade{from{opacity:.85}to{opacity:1}}'+
'.ptitle{font-size:15px!important;font-weight:600!important}'+
'body.dark .rec-card{background:#252830;border-color:#373b47}'+
'body.dark .rec-inp{background:#1e2028;border-color:#373b47;color:#e2e8f0}'+
'body.dark .rec-lbl{color:#8892a4}'+
'body.dark .rec-tab{color:#8892a4}'+
'body.dark .rec-tab.on{color:#a78bfa;border-bottom-color:#a78bfa}'+
'body.dark .rec-sm{border-color:#373b47;color:#8892a4}'+
'body.dark .rec-av{background:#2d2d5e;color:#a78bfa}'+
'body.dark .pv-btn{background:#252830;color:#8892a4;border-color:#373b47}'+
'body.dark .pv-btn.on{background:#6d28d9;color:#fff}';
function inyectarCSS(){if(document.getElementById('pv-css'))return;var s=document.createElement('style');s.id='pv-css';s.textContent=CSS;document.head.appendChild(s);}
function ocultarMetricas(){document.querySelectorAll('.sbi').forEach(function(b){var t=b.textContent||'';if(t.includes('trica')){b.style.display='none';}});document.querySelectorAll('.ntab,[onclick]').forEach(function(b){var oc=b.getAttribute('onclick')||'';if(oc.toLowerCase().includes('metrica')){b.style.display='none';}});document.querySelectorAll('[id*="metricas"]').forEach(function(el){el.style.display='none';});}
var _pv=localStorage.getItem('pvista')||'hoy';
window.setPubVista=function(v){_pv=v;localStorage.setItem('pvista',v);_apv();_upvb();};
function _apv(){var p=document.getElementById('p-publicaciones');if(!p)return;var d=p.querySelector('.gw-desktop');var m=p.querySelector('.gw-mobile');if(_pv==='hoy'"{if(d)d.style.display='none';if(m)m.style.cssText='display:flex!important;flex:1;flex-direction:column;overflow:hidden';if(typeof pubDayOff!=='undefined')pubDayOff=0;if(typeof renderPubDay==='function')setTimeout(renderPubDay,0);}else{if(d)d.style.display='';if(m)m.style.cssText='';if(typeof renderWeek==='function')setTimeout(renderWeek,0);}}
function _upvb(){var h=document.getElementById('pvb-hoy');var s=document.getElementById('pvb-sem');if(h)h.className='pv-btn'+(_pv==='hoy'?' on':'');if(s)s.className='pv-btn'+(_pv==='semana'?' on':'');}
function insTPub(){var p=document.getElementById('p-publicaciones');if(!p||document.getElementById('pvb-hoy'))return;var pt=p.querySelector('.ptop');if(!pt)return;var w=document.createElement('div');w.className='pv-wrap';w.innerHTML='<span style="font-size:10px;color:#9ca3af;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Vista:</span><button id="pvb-hoy" class="pv-btn'+(_pv==='hoy'?' on':'')+'" onclick="setPubVista(\'hoy\')">Hoy</button><button id="pvb-sem" class="pv-btn'+(_pv==='semana'?' on':'')+'" onclick="setPubVista(\'semana\')">Semana</button>';pt.appendChild(w);}
function patchNav(){if(window.__nm||typeof window.nav!=='function')return;var _o=window.nav;window.nav=function(page,data,btn){_o.call(this,page,data,btn);setTimeout(function(){ocultarMetricas();if(page==='publicaciones'){insTPub();_apv();}if(page==='reclamos'&&typeof loadReclamos==='function')loadReclamos();},80);};window.__nm=true;}
function mejorarPBars(){document.querySelectorAll('[class*="progress"],[class*="gbar"]').forEach(function(b){if(!b.style.borderRadius)b.style.borderRadius='999px';});}
function init(){inyectarCSS();ocultarMetricas();patchNav();mejorarPBars();var pPub=document.getElementById('p-publicaciones');if(pPub&&getComputedStyle(pPub).display!=='none'){insTPub();_apv();}}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(init,500);});}else{setTimeout(init,500);}
})();
