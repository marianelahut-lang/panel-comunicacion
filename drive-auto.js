/* Carga los ajustes existentes y agrega WA al filtro de agentes del tablero. */
(function(){
  'use strict';
  var originalUrl='https://cdn.jsdelivr.net/gh/marianelahut-lang/panel-comunicacion@3b0f64417298eb60c3dfc8fe49f521538f49a588/drive-auto.js';
  var WA_STORE='pcomTA_wa_filtro_agentes';
  function byId(id){return document.getElementById(id)}
  function hasFn(name){return typeof window[name]==='function'}
  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
  function readStore(){try{return JSON.parse(localStorage.getItem(WA_STORE)||'{}')}catch(e){return {}}}
  function writeStore(map){try{localStorage.setItem(WA_STORE,JSON.stringify(map||{}))}catch(e){}}
  function installAgentWhatsappFilter(){
    function selectedLabel(sel){return sel&&sel.selectedOptions&&sel.selectedOptions[0]?sel.selectedOptions[0].textContent.trim():''}
    function getAgentFromSelect(sel){
      try{
        var list=(window.state&&state.agents)||[];
        var id=sel&&sel.value;
        var a=id&&hasFn('getAg')?getAg(id):list.find(function(x){return x.id===id});
        if(a)return a;
        var label=selectedLabel(sel);
        return list.find(function(x){return norm(x.name)===norm(label)})||null;
      }catch(e){return null}
    }
    function getSavedPhone(label){var map=readStore();return map[norm(label)]||''}
    function savePhone(label, phone){var map=readStore();map[norm(label)]=String(phone||'').replace(/\D/g,'');writeStore(map)}
    function update(){
      var sel=byId('fAg'),btn=byId('fAgWa');
      if(!sel||!btn)return;
      var label=selectedLabel(sel),a=getAgentFromSelect(sel),phone=a&&a.phone?a.phone:getSavedPhone(label);
      btn.disabled=false;
      btn.removeAttribute('disabled');
      btn.style.opacity='';
      btn.title=!sel.value?'Elegi un agente':phone?'Enviar WhatsApp a '+(a&&a.name||label):'Cargar WhatsApp de '+(a&&a.name||label);
      btn.textContent=sel.value?'WA '+(a&&a.name||label||'Agente'):'WA';
    }
    function saveAgentPhone(a, label, phone){
      phone=String(phone||'').replace(/\D/g,'');
      if(a){
        a.phone=phone;
        a.updated=Date.now();
        try{if(hasFn('saveState'))saveState();else localStorage.setItem('pcomTA_v6',JSON.stringify(state))}catch(e){}
        try{if(hasFn('renderEquipo'))renderEquipo()}catch(e){}
      }
      savePhone(label,phone);
      update();
    }
    function send(){
      var sel=byId('fAg'),label=selectedLabel(sel),a=getAgentFromSelect(sel);
      if(!sel||!sel.value){if(hasFn('toast'))toast('Elegi un agente','inf');return}
      var phone=a&&a.phone?a.phone:getSavedPhone(label);
      if(!phone){
        phone=prompt('WhatsApp de '+(a&&a.name||label||'la agente')+' con codigo pais, por ejemplo 5492983...',phone||'');
        if(!phone)return;
        phone=String(phone).replace(/\D/g,'');
        if(!phone){if(hasFn('toast'))toast('Numero invalido','err');return}
        saveAgentPhone(a,label,phone);
      }
      if(hasFn('waOpen'))waOpen(phone,'');
      else window.open('https://wa.me/'+String(phone||'').replace(/\D/g,''),'_blank');
    }
    function paint(){
      var sel=byId('fAg');
      if(!sel||byId('fAgWa')){update();return}
      var btn=document.createElement('button');
      btn.type='button';
      btn.id='fAgWa';
      btn.className='btn btn-w';
      btn.textContent='WA';
      btn.onclick=function(e){e.preventDefault();e.stopPropagation();send()};
      sel.insertAdjacentElement('afterend',btn);
      sel.addEventListener('change',function(){setTimeout(update,0)});
      update();
    }
    if(hasFn('renderTab')&&!renderTab.__waAgentFilter){
      var original=renderTab;
      window.renderTab=function(){var r=original.apply(this,arguments);setTimeout(paint,0);return r};
      renderTab.__waAgentFilter=true;
    }
    paint();
    setTimeout(paint,600);
    setTimeout(paint,1600);
    setInterval(update,2000);
  }
  function loadOriginal(){
    var s=document.createElement('script');
    s.src=originalUrl;
    s.async=false;
    s.onload=function(){setTimeout(installAgentWhatsappFilter,0)};
    s.onerror=function(){installAgentWhatsappFilter()};
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadOriginal,{once:true});else loadOriginal();
})();