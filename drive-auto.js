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
    function cleanCardText(v){return String(v||'').replace(/\s+/g,' ').trim()}
    function visibleTasksFromBoard(){
      var out=[];
      var cols=Array.prototype.slice.call(document.querySelectorAll('#kb .kc'));
      cols.forEach(function(col){
        var head=cleanCardText(col.querySelector('.kct')?col.querySelector('.kct').textContent:'').toLowerCase();
        var status=head.indexOf('proceso')>=0?'En proceso':head.indexOf('pendiente')>=0?'Pendiente':'';
        if(!status)return;
        Array.prototype.slice.call(col.querySelectorAll('.kk')).forEach(function(card){
          var title=card.querySelector('.kkt');
          var desc=cleanCardText(title?title.textContent:card.textContent);
          if(desc)out.push({status:status,desc:desc});
        });
      });
      return out;
    }
    function buildTasksMessage(name,tasks){
      var msg='Hola '+(name||'')+'! Te paso tus tareas pendientes y en proceso, ordenadas de mas viejas a mas nuevas:\n\n';
      tasks.forEach(function(t,i){msg+=(i+1)+'. ['+t.status+'] '+t.desc+'\n'});
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
      btn.title=!sel.value?'Elegi un agente':phone?'Enviar tareas visibles por WhatsApp a '+(a&&a.name||label):'Cargar WhatsApp de '+(a&&a.name||label);
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
      var tasks=visibleTasksFromBoard();
      if(!tasks.length){if(hasFn('toast'))toast('No hay tareas visibles en Pendiente o En proceso','inf');return}
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
  function installTaskModalWhatsapp(){
    function selectedAgents(){
      var sel=byId('tkAsg');
      var list=(window.state&&state.agents)||[];
      if(!sel)return [];
      return Array.prototype.slice.call(sel.selectedOptions).map(function(o){
        var a=hasFn('getAg')?getAg(o.value):list.find(function(x){return x.id===o.value});
        if(a)return a;
        return list.find(function(x){return norm(x.name)===norm(o.textContent)})||{id:o.value,name:o.textContent||''};
      }).filter(Boolean);
    }
    function savePhoneToAgent(agent, phone){
      phone=String(phone||'').replace(/\D/g,'');
      if(!agent||!phone)return phone;
      agent.phone=phone;
      agent.updated=Date.now();
      try{if(hasFn('saveState'))saveState();else localStorage.setItem('pcomTA_v6',JSON.stringify(state))}catch(e){}
      return phone;
    }
    function taskMessage(){
      var desc=(byId('tkDesc')&&byId('tkDesc').value||'').trim();
      var pr=byId('tkPr')?byId('tkPr').value:'Media';
      var st=byId('tkSt')&&hasFn('statusLabel')?statusLabel(byId('tkSt').value):(byId('tkSt')?byId('tkSt').value:'Pendiente');
      var due=byId('tkDue')&&byId('tkDue').value;
      var tags=(byId('tkTags')&&byId('tkTags').value||'').trim();
      var notes=(byId('tkNotes')&&byId('tkNotes').value||'').trim();
      var id=(byId('tkId')&&byId('tkId').value||'').trim();
      var dueText=due&&hasFn('fmtDate')?fmtDate(due):due;
      var msg='Hola! Te paso esta tarea:\n\n*'+desc+'*\n\n';
      msg+='Prioridad: '+(pr||'Media')+'\n';
      msg+='Estado: '+(st||'Pendiente')+'\n';
      if(dueText)msg+='Vencimiento: '+dueText+'\n';
      if(tags)msg+='Etiquetas: '+tags+'\n';
      if(notes)msg+='\nObservaciones / link:\n'+notes+'\n';
      if(id)msg+='\nID tarea: '+id;
      return msg;
    }
    function askAndSaveMissingPhones(agents){
      var changed=false;
      agents.forEach(function(a){
        var phone=a&&a.phone?String(a.phone).replace(/\D/g,''):'';
        if(phone)return;
        phone=prompt('WhatsApp de '+(a.name||'la agente')+' con codigo pais, por ejemplo 5492983...','')||'';
        phone=String(phone).replace(/\D/g,'');
        if(phone){
          savePhoneToAgent(a,phone);
          changed=true;
        }
      });
      if(changed){
        try{if(hasFn('renderEquipo'))renderEquipo()}catch(e){}
        try{if(hasFn('renderAll'))renderAll()}catch(e){}
      }
      return agents.filter(function(a){return a&&a.phone&&String(a.phone).replace(/\D/g,'')});
    }
    function loadTaskPhones(){
      var agents=selectedAgents();
      if(!agents.length){if(hasFn('toast'))toast('Selecciona al menos un responsable','err');return}
      var missing=agents.filter(function(a){return !(a&&a.phone&&String(a.phone).replace(/\D/g,''))});
      if(!missing.length){if(hasFn('toast'))toast('Los responsables seleccionados ya tienen WhatsApp','suc');return}
      askAndSaveMissingPhones(missing);
      var stillMissing=missing.filter(function(a){return !(a&&a.phone&&String(a.phone).replace(/\D/g,''))});
      if(hasFn('toast'))toast(stillMissing.length?'Quedaron telefonos sin cargar':'Telefonos guardados','suc');
    }
    function sendTask(){
      var desc=(byId('tkDesc')&&byId('tkDesc').value||'').trim();
      if(!desc){if(hasFn('toast'))toast('Completa la descripcion antes de enviar','err');return}
      var agents=selectedAgents();
      if(!agents.length){if(hasFn('toast'))toast('Selecciona al menos un responsable','err');return}
      askAndSaveMissingPhones(agents);
      var ready=agents.filter(function(a){return a&&a.phone&&String(a.phone).replace(/\D/g,'')}).map(function(a){return {name:a.name||'',phone:String(a.phone).replace(/\D/g,'')}});
      if(!ready.length){if(hasFn('toast'))toast('Carga el WhatsApp del responsable para enviar','err');return}
      if(ready.length>1&&!confirm('Se abriran '+ready.length+' chats de WhatsApp. Continuar?'))return;
      var msg=taskMessage();
      ready.forEach(function(a){
        if(hasFn('waOpen'))waOpen(a.phone,msg);
        else window.open('https://wa.me/'+a.phone+'?text='+encodeURIComponent(msg),'_blank');
      });
      if(hasFn('toast'))toast('WhatsApp abierto','suc');
    }
    function paintTaskButton(){
      var footer=document.querySelector('#tkMod .mf');
      if(!footer||byId('tkWaTask'))return;
      var loadBtn=document.createElement('button');
      loadBtn.type='button';
      loadBtn.id='tkLoadPhones';
      loadBtn.className='btn';
      loadBtn.textContent='Cargar telefonos';
      loadBtn.onclick=function(e){e.preventDefault();e.stopPropagation();loadTaskPhones()};
      var btn=document.createElement('button');
      btn.type='button';
      btn.id='tkWaTask';
      btn.className='btn btn-w';
      btn.textContent='WA tarea';
      btn.onclick=function(e){e.preventDefault();e.stopPropagation();sendTask()};
      var cancel=footer.querySelector('button[onclick*="closeModal"]');
      footer.insertBefore(loadBtn,cancel||footer.firstChild);
      footer.insertBefore(btn,cancel||footer.firstChild);
    }
    if(hasFn('editTask')&&!editTask.__waTaskModal){
      var originalEditTask=editTask;
      window.editTask=function(){var r=originalEditTask.apply(this,arguments);setTimeout(paintTaskButton,0);return r};
      editTask.__waTaskModal=true;
    }
    paintTaskButton();
    setTimeout(paintTaskButton,600);
    setTimeout(paintTaskButton,1600);
  }
  function installAll(){installAgentWhatsappFilter();installTaskModalWhatsapp()}
  function loadOriginal(){
    var s=document.createElement('script');
    s.src=originalUrl;
    s.async=false;
    s.onload=function(){setTimeout(installAll,0)};
    s.onerror=function(){installAll()};
    document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadOriginal,{once:true});else loadOriginal();
})();