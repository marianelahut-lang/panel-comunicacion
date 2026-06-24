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
    function taskTime(t){
      var vals=[t&&t.created,t&&t.createdAt,t&&t.created_at,t&&t.date,t&&t.fecha,t&&t.updated,t&&t.updatedAt,t&&t.updated_at,t&&t.due];
      for(var i=0;i<vals.length;i++){
        var v=vals[i];
        if(!v)continue;
        if(typeof v==='number')return v;
        var d=Date.parse(String(v));
        if(isFinite(d))return d;
      }
      var m=String(t&&t.id||'').match(/(\d{12,})/);
      return m?Number(m[1]):0;
    }
    function statusText(status){
      var s=String(status||'pendiente').toLowerCase();
      if(s==='proceso')return 'En proceso';
      if(s==='pendiente')return 'Pendiente';
      return status||'Pendiente';
    }
    function dueText(t){
      if(!t||!t.due)return '';
      try{return hasFn('fmtDate')?' | vence '+fmtDate(t.due):' | vence '+t.due}catch(e){return ' | vence '+t.due}
    }
    function agentTaskIds(sel,a,label){
      var ids=[];
      if(sel&&sel.value)ids.push(sel.value);
      if(a&&a.id)ids.push(a.id);
      if(a&&a.name)ids.push(a.name);
      if(label)ids.push(label);
      return ids.map(String).filter(function(v,i,arr){return v&&arr.indexOf(v)===i});
    }
    function taskBelongsToAgent(t,ids,label){
      var ass=t&&Array.isArray(t.assignees)?t.assignees:[];
      if(ass.some(function(x){return ids.indexOf(String(x))>=0 || norm(x)===norm(label)}))return true;
      if(t&&t.assignee&&(ids.indexOf(String(t.assignee))>=0 || norm(t.assignee)===norm(label)))return true;
      if(t&&t.responsable&&(ids.indexOf(String(t.responsable))>=0 || norm(t.responsable)===norm(label)))return true;
      return false;
    }
    function getTasksForAgent(sel,a,label){
      var ids=agentTaskIds(sel,a,label);
      return ((window.state&&state.tasks)||[]).filter(function(t){
        var st=String(t&&t.status||'pendiente').toLowerCase();
        if(st!=='pendiente'&&st!=='proceso')return false;
        return taskBelongsToAgent(t,ids,label);
      }).sort(function(x,y){return taskTime(x)-taskTime(y)});
    }
    function buildTasksMessage(name,tasks){
      var msg='Hola '+(name||'')+'! Te paso tus tareas pendientes y en proceso, ordenadas de mas viejas a mas nuevas:\n\n';
      tasks.forEach(function(t,i){
        var desc=String(t&&t.desc||t&&t.title||'(sin descripcion)').replace(/\s+/g,' ').trim();
        msg+=(i+1)+'. ['+statusText(t.status)+'] '+desc+dueText(t)+'\n';
      });
      msg+='\nGracias!';
      return msg;
    }
    function update(){
      var sel=byId('fAg'),btn=byId('fAgWa');
      if(!sel||!btn)return;
      var label=selectedLabel(sel),a=getAgentFromSelect(sel),phone=a&&a.phone?a.phone:getSavedPhone(label);
      btn.disabled=false;
      btn.removeAttribute('disabled');
      btn.style.opacity='';
      btn.title=!sel.value?'Elegi un agente':phone?'Enviar tareas por WhatsApp a '+(a&&a.name||label):'Cargar WhatsApp de '+(a&&a.name||label);
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
      var sel=byId('fAg'),label=selectedLabel(sel),a=getAgentFromSelect(sel),name=a&&a.name||label;
      if(!sel||!sel.value){if(hasFn('toast'))toast('Elegi un agente','inf');return}
      var phone=a&&a.phone?a.phone:getSavedPhone(label);
      if(!phone){
        phone=prompt('WhatsApp de '+(name||'la agente')+' con codigo pais, por ejemplo 5492983...',phone||'');
        if(!phone)return;
        phone=String(phone).replace(/\D/g,'');
        if(!phone){if(hasFn('toast'))toast('Numero invalido','err');return}
        saveAgentPhone(a,label,phone);
      }
      var tasks=getTasksForAgent(sel,a,label);
      if(!tasks.length){if(hasFn('toast'))toast('No hay tareas pendientes o en proceso para '+(name||'esta agente'),'inf');return}
      var msg=buildTasksMessage(name,tasks);
      if(hasFn('waOpen'))waOpen(phone,msg);
      else window.open('https://wa.me/'+String(phone||'').replace(/\D/g,'')+'?text='+encodeURIComponent(msg),'_blank');
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