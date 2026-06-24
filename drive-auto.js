/* Carga los ajustes existentes y agrega WA al filtro de agentes del tablero. */
(function(){
  'use strict';
  var originalUrl='https://cdn.jsdelivr.net/gh/marianelahut-lang/panel-comunicacion@3b0f64417298eb60c3dfc8fe49f521538f49a588/drive-auto.js';
  function byId(id){return document.getElementById(id)}
  function hasFn(name){return typeof window[name]==='function'}
  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
  function installAgentWhatsappFilter(){
    function getAgentFromSelect(sel){
      try{
        var list=(window.state&&state.agents)||[];
        var id=sel&&sel.value;
        var a=id&&hasFn('getAg')?getAg(id):list.find(function(x){return x.id===id});
        if(a)return a;
        var label=sel&&sel.selectedOptions&&sel.selectedOptions[0]?sel.selectedOptions[0].textContent:'';
        return list.find(function(x){return norm(x.name)===norm(label)})||null;
      }catch(e){return null}
    }
    function update(){
      var sel=byId('fAg'),btn=byId('fAgWa');
      if(!sel||!btn)return;
      var a=getAgentFromSelect(sel);
      btn.disabled=false;
      btn.removeAttribute('disabled');
      btn.style.opacity='';
      btn.title=!sel.value?'Elegi un agente':a&&a.phone?'Enviar WhatsApp a '+a.name:a?'Cargar WhatsApp de '+a.name:'Buscar agente seleccionado';
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
      var sel=byId('fAg'),a=getAgentFromSelect(sel);
      if(!sel||!sel.value){if(hasFn('toast'))toast('Elegi un agente','inf');return}
      if(!a){if(hasFn('toast'))toast('No encontre esa agente en Equipo','err');return}
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