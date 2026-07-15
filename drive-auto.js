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

/* Productividad y cuidado de espacio: resumen diario + limpieza segura. */
(function(){
  'use strict';
  var LS_KEY='pcomTA_v6';
  var OPT_META_KEY='pcomTA_last_optimize_meta';
  var warnedLarge=false;

  function byId(id){return document.getElementById(id)}
  function hasFn(name){return typeof window[name]==='function'}
  function ready(){try{return typeof state==='object'&&state&&state.config&&hasFn('saveState')}catch(e){return false}}
  function toastSafe(msg,type){try{if(hasFn('toast'))toast(msg,type||'inf')}catch(e){}}
  function isDataUrl(v){return typeof v==='string'&&/^data:[^;]+;base64,/.test(v)}
  function storageBytes(){try{return (localStorage.getItem(LS_KEY)||'').length*2}catch(e){return 0}}
  function fmtBytes(n){
    if(!n)return '0 KB';
    if(n<1024*1024)return Math.round(n/1024)+' KB';
    return (n/1024/1024).toFixed(1)+' MB';
  }
  function today(){
    if(hasFn('todayISO'))return todayISO();
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function dateLabel(iso){try{return hasFn('fmtDate')?fmtDate(iso):iso}catch(e){return iso}}
  function personName(id){
    try{
      if(!id)return '';
      var a=hasFn('getAg')?getAg(id):(state.agents||[]).find(function(x){return x.id===id});
      return a&&a.name||id;
    }catch(e){return id||''}
  }
  function compactAttachment(a, stats){
    if(!a||typeof a!=='object')return a;
    if(isDataUrl(a.data)&&(a.drive||a.driveId||a.webViewLink||a.url)){
      delete a.data;
      a.optimized=true;
      stats.driveCopies++;
    }
    return a;
  }
  function optimizeSpace(silent){
    if(!ready())return {changed:false};
    var stats={flyers:0,driveCopies:0,changed:false};
    (state.recursos||[]).forEach(function(r){
      if(!r||typeof r!=='object')return;
      var isFlyer=r.autoFlyer||r.cat==='Flyers generados';
      if(isFlyer&&isDataUrl(r.url)){
        r.url='';
        r.drivePendiente=false;
        r.optimized=true;
        r.updated=Date.now();
        if(String(r.desc||'').indexOf('PNG no guardado')<0){
          r.desc=(r.desc?r.desc+' · ':'')+'PNG no guardado para ahorrar espacio';
        }
        stats.flyers++;
      }
    });
    (state.publicaciones||[]).forEach(function(p){
      if(Array.isArray(p.archivos))p.archivos=p.archivos.map(function(a){return compactAttachment(a,stats)});
    });
    (state.reclamos||[]).forEach(function(r){
      if(Array.isArray(r.fotos))r.fotos=r.fotos.map(function(a){return compactAttachment(a,stats)});
    });
    stats.changed=stats.flyers>0||stats.driveCopies>0;
    if(stats.changed){
      try{localStorage.setItem(OPT_META_KEY,JSON.stringify({at:Date.now(),flyers:stats.flyers,driveCopies:stats.driveCopies}))}catch(e){}
      try{window.__pcomOptimizing=true;saveState()}finally{window.__pcomOptimizing=false}
      try{if(hasFn('renderRec'))renderRec();if(hasFn('renderAll'))renderAll()}catch(e){}
    }
    if(!silent){
      toastSafe(stats.changed?'Espacio optimizado: '+stats.flyers+' flyers y '+stats.driveCopies+' copias de Drive compactadas':'No habia archivos seguros para compactar','suc');
    }
    updateStorageBox();
    return stats;
  }
  function buildDaySummary(){
    if(!ready())return '';
    var d=today();
    var lines=['Resumen de hoy - '+dateLabel(d),''];
    var guardia=(state.guardias&&state.guardias[d])||{};
    var g=[];
    if(guardia.titular)g.push('Titular: '+personName(guardia.titular));
    if(guardia.soporte)g.push('Soporte: '+personName(guardia.soporte));
    lines.push('Guardia: '+(g.length?g.join(' | '):'Sin asignar'));
    var ev=(state.events||[]).filter(function(x){return x.date===d}).sort(function(a,b){return String(a.time||'').localeCompare(String(b.time||''))});
    lines.push('', 'Eventos ('+ev.length+')');
    lines=lines.concat(ev.length?ev.map(function(e){return '- '+(e.time?e.time+' ':'')+(e.desc||'Evento')+(e.loc?' - '+e.loc:'')}):['- Sin eventos']);
    var pub=(state.publicaciones||[]).filter(function(x){return x.date===d}).sort(function(a,b){return String(a.time||'').localeCompare(String(b.time||''))});
    lines.push('', 'Publicaciones ('+pub.length+')');
    lines=lines.concat(pub.length?pub.map(function(p){return '- '+(p.time?p.time+' ':'')+(p.desc||'Publicacion')+' ['+(p.status||'Pendiente')+']'}):['- Sin publicaciones']);
    var ent=(state.entrevistas||[]).filter(function(x){return x.date===d}).sort(function(a,b){return String(a.time||'').localeCompare(String(b.time||''))});
    lines.push('', 'Entrevistas ('+ent.length+')');
    lines=lines.concat(ent.length?ent.map(function(e){return '- '+(e.time?e.time+' ':'')+(e.medio||'Medio')+' / '+(e.funcionario||'Funcionario')+(e.tema?' - '+e.tema:'')}):['- Sin entrevistas']);
    var tasks=(state.tasks||[]).filter(function(t){return t.status!=='done'&&t.status!=='realizada'&&(t.due===d||(!t.due&&t.status!=='done'))}).slice(0,12);
    lines.push('', 'Tareas a mirar ('+tasks.length+')');
    lines=lines.concat(tasks.length?tasks.map(function(t){return '- '+(t.desc||'Tarea')+(t.due?' (vence '+dateLabel(t.due)+')':'')}):['- Sin tareas destacadas']);
    return lines.join('\n');
  }
  async function copyDaySummary(){
    var text=buildDaySummary();
    try{await navigator.clipboard.writeText(text)}
    catch(e){var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
    toastSafe('Resumen de hoy copiado','suc');
  }
  function paintDaySummaryButton(){
    var view=byId('v-hoy');
    if(!view||byId('copyDaySummary'))return;
    var host=view.querySelector('.hero')||view;
    var btn=document.createElement('button');
    btn.type='button';
    btn.id='copyDaySummary';
    btn.className='btn btn-p btn-s';
    btn.style.marginTop='12px';
    btn.textContent='Copiar resumen de hoy';
    btn.onclick=function(e){e.preventDefault();e.stopPropagation();copyDaySummary()};
    host.appendChild(btn);
  }
  function updateStorageBox(){
    var box=byId('storageCareBox');
    if(!box)return;
    var bytes=storageBytes();
    var last='';
    try{
      var meta=JSON.parse(localStorage.getItem(OPT_META_KEY)||'null');
      if(meta)last='Ultima limpieza: '+new Date(meta.at).toLocaleString('es-AR')+' · '+(meta.flyers||0)+' flyers · '+(meta.driveCopies||0)+' copias Drive';
    }catch(e){}
    box.querySelector('[data-size]').textContent='Datos del panel: '+fmtBytes(bytes);
    box.querySelector('[data-last]').textContent=last||'No borra adjuntos que no tengan copia en Drive.';
  }
  function paintStorageBox(){
    var mod=byId('cfgMod');
    var body=mod&&mod.querySelector('.mb');
    if(!body||byId('storageCareBox')){updateStorageBox();return}
    var box=document.createElement('div');
    box.id='storageCareBox';
    box.className='card';
    box.style.margin='0 0 14px';
    box.innerHTML='<div class="fb"><div><div class="ct-t">Espacio y datos</div><div class="ct-s" data-size>Datos del panel: --</div><div class="ct-s" data-last>No borra adjuntos que no tengan copia en Drive.</div></div><button class="btn btn-p btn-s" type="button" data-opt>Optimizar espacio</button></div>';
    body.insertBefore(box,body.firstChild);
    box.querySelector('[data-opt]').onclick=function(e){e.preventDefault();optimizeSpace(false)};
    updateStorageBox();
  }
  function installSaveGuard(){
    if(!ready()||saveState.__storageCare)return false;
    var original=saveState;
    window.saveState=function(){
      if(!window.__pcomOptimizing){
        try{
          var before=storageBytes();
          if(before>3.5*1024*1024)optimizeSpace(true);
          if(before>4.5*1024*1024&&!warnedLarge){
            warnedLarge=true;
            toastSafe('El panel tiene muchos datos guardados. Conviene subir archivos a Drive y optimizar espacio.','inf');
          }
        }catch(e){}
      }
      return original.apply(this,arguments);
    };
    saveState.__storageCare=true;
    return true;
  }
  function install(){
    if(!ready())return false;
    installSaveGuard();
    optimizeSpace(true);
    paintDaySummaryButton();
    paintStorageBox();
    if(hasFn('renderHoy')&&!renderHoy.__summaryButton){
      var originalHoy=renderHoy;
      window.renderHoy=function(){var r=originalHoy.apply(this,arguments);setTimeout(paintDaySummaryButton,0);return r};
      renderHoy.__summaryButton=true;
    }
    if(hasFn('openModal')&&!openModal.__storageBox){
      var originalOpen=openModal;
      window.openModal=function(id){var r=originalOpen.apply(this,arguments);if(id==='cfgMod')setTimeout(paintStorageBox,0);return r};
      openModal.__storageBox=true;
    }
    setInterval(updateStorageBox,5000);
    return true;
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      if(install()||tries>30)clearInterval(iv);
    },500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* Calendario oficial: carga y refresco automatico para todos los agentes. */
(function(){
  'use strict';
  var CAL_ID='642f04e4333c91e3c67f35a779bd775a7c4cc6d05700da68376b0ff313ea9f0b@group.calendar.google.com';
  var CAL_URL='https://calendar.google.com/calendar/ical/642f04e4333c91e3c67f35a779bd775a7c4cc6d05700da68376b0ff313ea9f0b%40group.calendar.google.com/public/basic.ics';
  var SYNC_MS=5*60*1000;
  var timer=null;
  var syncing=false;

  function byId(id){return document.getElementById(id)}
  function hasFn(name){return typeof window[name]==='function'}
  function ready(){
    try{return typeof state==='object'&&state&&state.config&&Array.isArray(state.events)&&hasFn('saveState')}
    catch(e){return false}
  }
  function toastSafe(msg,type){try{if(hasFn('toast'))toast(msg,type||'inf')}catch(e){}}
  function setStatus(html,color){
    var el=byId('gcStat');
    if(!el)return;
    el.innerHTML=html;
    if(color)el.style.color=color;
  }
  function refreshControls(){
    if(!ready())return;
    var gc=byId('gcUrl');
    if(gc)gc.value=state.config.googleCalendarUrl||CAL_URL;
    var btn=byId('autoSyncBtn');
    if(btn)btn.textContent=state.config.googleAutoSync?' Auto-sync: ON (cada 5 min)':' Auto-sync: OFF';
    var del=byId('gcDel');
    if(del)del.classList.toggle('hide',!state.config.googleCalendarId);
  }
  function ensureConfig(){
    if(!ready())return false;
    state.config.googleCalendarId=CAL_ID;
    state.config.googleCalendarUrl=CAL_URL;
    state.config.googleAutoSync=true;
    state.config.syncMode='auto';
    state.config.__calendarRealtimeConfigured=true;
    try{saveState()}catch(e){}
    refreshControls();
    return true;
  }
  function parseDate(s){
    if(!s)return null;
    var m=String(s).match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(?:\d{2})?Z?)?/);
    if(!m)return null;
    if(m[4]&&m[5]){
      var d=new Date(m[1]+'-'+m[2]+'-'+m[3]+'T'+m[4]+':'+m[5]+':00Z');
      return {date:m[1]+'-'+m[2]+'-'+m[3],time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
    }
    return {date:m[1]+'-'+m[2]+'-'+m[3],time:''};
  }
  function parseICS(text){
    if(window.parseICS&&window.parseICS!==parseICS)return window.parseICS(text);
    if(!text||text.indexOf('BEGIN:VCALENDAR')<0)return [];
    var lines=text.replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,'').split(/\r?\n/);
    var events=[],cur=null;
    lines.forEach(function(line){
      if(line==='BEGIN:VEVENT'){cur={};return}
      if(line==='END:VEVENT'){if(cur)events.push(cur);cur=null;return}
      if(!cur)return;
      var idx=line.indexOf(':');
      if(idx<0)return;
      var key=line.slice(0,idx).split(';')[0];
      var val=line.slice(idx+1).replace(/\\n/g,'\n').replace(/\\,/g,',').replace(/\\;/g,';').replace(/\\\\/g,'\\');
      cur[key]=val;
    });
    return events;
  }
  function eventId(ev,dt){
    return 'gcal_'+(ev.UID||(dt.date+'_'+dt.time+'_'+(ev.SUMMARY||'').slice(0,20)));
  }
  async function fetchICS(){
    var proxies=[
      function(u){return 'https://corsproxy.io/?'+encodeURIComponent(u)},
      function(u){return 'https://api.allorigins.win/raw?url='+encodeURIComponent(u)},
      function(u){return 'https://api.codetabs.com/v1/proxy/?quest='+u}
    ];
    for(var i=0;i<proxies.length;i++){
      var url=proxies[i](CAL_URL);
      try{
        setStatus('Actualizando calendario via '+url.split('/')[2]+'...','var(--ac)');
        var r=await fetch(url,{cache:'no-store'});
        if(!r.ok)continue;
        var txt=await r.text();
        if(txt.indexOf('BEGIN:VCALENDAR')>=0)return {text:txt,via:url.split('/')[2]};
      }catch(e){}
    }
    return null;
  }
  async function syncOfficialCalendar(opts){
    opts=opts||{};
    if(syncing||!ensureConfig())return;
    syncing=true;
    try{
      var got=await fetchICS();
      if(!got){
        setStatus('<span style="color:var(--rd)">No se pudo descargar el calendario</span><br><span class="t-m">Verifica que siga publico en Google Calendar.</span>');
        if(!opts.silent)toastSafe('No se pudo actualizar el calendario','err');
        return;
      }
      var imported=0,updated=0,skipped=0,seen={};
      parseICS(got.text).forEach(function(ev){
        var dt=parseDate(ev.DTSTART);
        if(!dt||!dt.date){skipped++;return}
        var id=eventId(ev,dt);
        seen[id]=true;
        var data={
          id:id,date:dt.date,time:dt.time,desc:ev.SUMMARY||'(sin titulo)',loc:ev.LOCATION||'',
          type:'Agenda Intendente',cover:false,gcalSource:true,gcalCalendarId:CAL_ID,
          gcalUID:ev.UID||'',notes:ev.DESCRIPTION||'',updated:Date.now()
        };
        var exists=state.events.find(function(x){return x.id===id||(x.gcalUID&&data.gcalUID&&x.gcalUID===data.gcalUID)});
        if(exists){Object.assign(exists,data);updated++}
        else{state.events.push(data);imported++}
      });
      var before=state.events.length;
      state.events=state.events.filter(function(e){return !(e.gcalSource&&(e.gcalCalendarId===CAL_ID||!e.gcalCalendarId)&&!seen[e.id])});
      var removed=before-state.events.length;
      saveState();
      try{if(hasFn('renderCal'))renderCal();if(hasFn('renderHoy'))renderHoy();if(hasFn('updateBadges'))updateBadges()}catch(e){}
      setStatus('<span style="color:var(--gr)">Calendario actualizado via '+got.via+'</span><br><span class="t-m">'+imported+' nuevos · '+updated+' actualizados · '+removed+' quitados · '+skipped+' omitidos</span>');
      refreshControls();
      if(!opts.silent)toastSafe('Calendario sincronizado','suc');
    }finally{
      syncing=false;
    }
  }
  function schedule(){
    if(timer)clearInterval(timer);
    if(!ensureConfig())return;
    timer=setInterval(function(){syncOfficialCalendar({silent:true})},SYNC_MS);
  }
  function installOverrides(){
    if(!ready())return false;
    window.syncGoogleCal=function(){return syncOfficialCalendar({silent:false})};
    window.scheduleAutoSync=schedule;
    window.autoSyncToggle=function(){
      ensureConfig();
      schedule();
      syncOfficialCalendar({silent:true});
      toastSafe('Auto-sync activado','suc');
    };
    schedule();
    setTimeout(function(){syncOfficialCalendar({silent:true})},1200);
    refreshControls();
    return true;
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      if(installOverrides()||tries>30)clearInterval(iv);
    },500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* Calendario PRENSA: sincronizacion adicional sin reemplazar Intendente. */
(function(){
  'use strict';
  var PRESS_ID='5544ba9213caabc95391100bdbbf45c01574bd0112e1ad7198123c4a36a8de61@group.calendar.google.com';
  var PRESS_URL='https://calendar.google.com/calendar/ical/5544ba9213caabc95391100bdbbf45c01574bd0112e1ad7198123c4a36a8de61%40group.calendar.google.com/public/basic.ics';
  var SYNC_MS=5*60*1000;
  var timer=null;
  var syncing=false;
  var previousManualSync=null;

  function byId(id){return document.getElementById(id)}
  function hasFn(name){return typeof window[name]==='function'}
  function ready(){
    try{
      return typeof state==='object'&&state&&state.config&&state.config.__calendarRealtimeConfigured&&
        Array.isArray(state.events)&&hasFn('saveState')&&hasFn('syncGoogleCal');
    }catch(e){return false}
  }
  function toastSafe(msg,type){try{if(hasFn('toast'))toast(msg,type||'inf')}catch(e){}}
  function setStatus(html,color){
    var el=byId('gcStat');
    if(!el)return;
    el.innerHTML=html;
    if(color)el.style.color=color;
  }
  function parseDate(s){
    if(!s)return null;
    var m=String(s).match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(?:\d{2})?(Z)?)?/);
    if(!m)return null;
    if(!m[4]||!m[5])return {date:m[1]+'-'+m[2]+'-'+m[3],time:''};
    if(m[6]){
      var d=new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]),Number(m[4]),Number(m[5])));
      return {
        date:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),
        time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')
      };
    }
    return {date:m[1]+'-'+m[2]+'-'+m[3],time:m[4]+':'+m[5]};
  }
  function parseICS(text){
    if(!text||text.indexOf('BEGIN:VCALENDAR')<0)return [];
    var lines=text.replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,'').split(/\r?\n/);
    var events=[],cur=null;
    lines.forEach(function(line){
      if(line==='BEGIN:VEVENT'){cur={};return}
      if(line==='END:VEVENT'){if(cur)events.push(cur);cur=null;return}
      if(!cur)return;
      var idx=line.indexOf(':');
      if(idx<0)return;
      var key=line.slice(0,idx).split(';')[0];
      var val=line.slice(idx+1).replace(/\\n/g,'\n').replace(/\\,/g,',').replace(/\\;/g,';').replace(/\\\\/g,'\\');
      cur[key]=val;
    });
    return events;
  }
  function eventId(ev,dt){
    return 'gcal_prensa_'+(ev.UID||(dt.date+'_'+dt.time+'_'+(ev.SUMMARY||'').slice(0,20)));
  }
  async function fetchICS(){
    var proxies=[
      function(u){return 'https://corsproxy.io/?'+encodeURIComponent(u)},
      function(u){return 'https://api.allorigins.win/raw?url='+encodeURIComponent(u)},
      function(u){return 'https://api.codetabs.com/v1/proxy/?quest='+u}
    ];
    for(var i=0;i<proxies.length;i++){
      var url=proxies[i](PRESS_URL);
      try{
        var r=await fetch(url,{cache:'no-store'});
        if(!r.ok)continue;
        var txt=await r.text();
        if(txt.indexOf('BEGIN:VCALENDAR')>=0)return {text:txt,via:url.split('/')[2]};
      }catch(e){}
    }
    return null;
  }
  async function syncPressCalendar(opts){
    opts=opts||{};
    if(syncing||!ready())return;
    syncing=true;
    try{
      var got=await fetchICS();
      if(!got){
        setStatus('<span style="color:var(--rd)">Intendente conectado; PRENSA no pudo descargarse</span><br><span class="t-m">Reintentaremos automaticamente.</span>');
        if(!opts.silent)toastSafe('No se pudo actualizar PRENSA','err');
        return;
      }
      var imported=0,updated=0,skipped=0,seen={};
      parseICS(got.text).forEach(function(ev){
        var dt=parseDate(ev.DTSTART);
        if(!dt||!dt.date){skipped++;return}
        var id=eventId(ev,dt);
        seen[id]=true;
        var data={
          id:id,date:dt.date,time:dt.time,desc:ev.SUMMARY||'(sin titulo)',loc:ev.LOCATION||'',
          type:'Prensa / Medio',cover:false,gcalSource:true,gcalCalendarId:PRESS_ID,
          gcalUID:ev.UID||'',notes:ev.DESCRIPTION||'',updated:Date.now()
        };
        var exists=state.events.find(function(x){return x.id===id});
        if(exists){
          var currentCover=exists.cover;
          Object.assign(exists,data);
          if(typeof currentCover==='boolean')exists.cover=currentCover;
          updated++;
        }else{
          state.events.push(data);
          imported++;
        }
      });
      var before=state.events.length;
      state.events=state.events.filter(function(e){
        return !(e.gcalSource&&e.gcalCalendarId===PRESS_ID&&!seen[e.id]);
      });
      var removed=before-state.events.length;
      saveState();
      try{
        if(hasFn('renderCal'))renderCal();
        if(hasFn('renderHoy'))renderHoy();
        if(hasFn('updateBadges'))updateBadges();
      }catch(e){}
      setStatus('<span style="color:var(--gr)">Intendente + PRENSA actualizados</span><br><span class="t-m">PRENSA: '+imported+' nuevos · '+updated+' actualizados · '+removed+' quitados · '+skipped+' omitidos</span>');
      if(!opts.silent)toastSafe('Calendario PRENSA sincronizado','suc');
    }finally{
      syncing=false;
    }
  }
  function install(){
    if(!ready()||window.__pcomPressCalendarInstalled)return false;
    previousManualSync=window.syncGoogleCal;
    window.syncGoogleCal=async function(){
      if(previousManualSync)await previousManualSync();
      return syncPressCalendar({silent:false});
    };
    window.syncPressCalendar=syncPressCalendar;
    window.__pcomPressCalendarInstalled=true;
    timer=setInterval(function(){syncPressCalendar({silent:true})},SYNC_MS);
    setTimeout(function(){syncPressCalendar({silent:true})},1200);
    return true;
  }
  function boot(){
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      if(install()||tries>40)clearInterval(iv);
    },500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
