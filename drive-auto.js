/* Carga los ajustes existentes y agrega WA al filtro de agentes del tablero. */
(function(){
  'use strict';
  var originalUrl='https://cdn.jsdelivr.net/gh/marianelahut-lang/panel-comunicacion@3b0f64417298eb60c3dfc8fe49f521538f49a588/drive-auto.js';
  function byId(id){return document.getElementById(id)}
  function hasFn(name){return typeof window[name]==='function'}
  function installAgentWhatsappFilter(){
    function getAgent(id){
      try{return hasFn('getAg')?getAg(id):(window.state&&state.agents||[]).find(function(a){return a.id===id})}catch(e){return null}
    }
    function update(){
      var sel=byId('fAg'),btn=byId('fAgWa');
      if(!sel||!btn)return;
      var a=sel.value?getAgent(sel.value):null;
      btn.disabled=!a;
      btn.style.opacity=btn.disabled?'.45':'';
      btn.title=!a?'Elegi un agente':a.phone?'Enviar WhatsApp a '+a.name:'Cargar WhatsApp de '+a.name;
      btn.textContent=a?'WA '+(a.name||'WhatsApp'):'WA';
    }
    function saveAgentPhone(a, phone){
      a.phone=String(phone||'').replace(/\D/g,'');
      a.updated=Date.now();
      try{if(hasFn('saveState'))saveState();else localStorage.setItem('pcomTA_v6',JSON.stringify(state))}catch(e){}
      try{if(hasFn('renderEquipo'))renderEquipo()}catch(e){}
      update();
    }
    function send(){
      var sel=byId('fAg'),a=sel&&sel.value?getAgent(sel.value):null;
      if(!a){if(hasFn('toast'))toast('Elegi un agente','inf');return}
      if(!a.phone){
        var phone=prompt('WhatsApp de '+(a.name||'la agente')+' con codigo pais, por ejemplo 5492983...',a.phone||'');
        if(!phone)return;
        phone=String(phone).replace(/\D/g,'');
        if(!phone){if(hasFn('toast'))toast('Numero invalido','err');return}
        saveAgentPhone(a,phone);
      }
      if(hasFn('waOpen'))waOpen(a.phone,'');
      else window.open('https://wa.me/'+String(a.phone||'').replace(/\D/g,''),'_blank');
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