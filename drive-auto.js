/* Refuerzo de sincronizacion + ajustes de difusion. */
(function(){
  'use strict';

  var pushTimer=null, pullTimer=null, pullActive=false, syncStarted=false, installed=false, tabWrapped=false;
  function log(){try{console.log.apply(console,arguments)}catch(e){}}
  function hasFn(name){return typeof window[name]==='function'}
  function byId(id){return document.getElementById(id)}
  function num(v){return Math.max(0,parseInt(v||'0',10)||0)}
  function cleanText(){
    try{
      if(!window.state)return;
      var keys=['name','role','email','phone','program','type','desc','title','area','category','status','notes','responsable','vecino','direccion'];
      ['agents','funcionarios','medios','tasks','publicaciones','events','entrevistas','recursos','reclamos'].forEach(function(list){
        (state[list]||[]).forEach(function(item){
          keys.forEach(function(k){if(typeof item[k]==='string')item[k]=item[k].replace(/\s+/g,' ').trim()});
        });
      });
      localStorage.setItem('pcomTA_v6',JSON.stringify(state));
    }catch(e){log('[drive-auto] clean',e)}
  }
  function taskTime(t){
    var vals=[t&&t.updatedAt,t&&t.updated_at,t&&t.modifiedAt,t&&t.modified_at,t&&t.updated,t&&t.createdAt,t&&t.created_at,t&&t.created,t&&t.date,t&&t.fecha,t&&t.due];
    for(var i=0;i<vals.length;i++){var v=vals[i];if(!v)continue;if(typeof v==='number')return v;var d=Date.parse(String(v));if(isFinite(d))return d}
    var m=String(t&&t.id||'').match(/(\d{12,})/);return m?Number(m[1]):0;
  }
  function refreshTasks(){
    try{if(state&&Array.isArray(state.tasks))state.tasks.sort(function(a,b){return taskTime(b)-taskTime(a)})}catch(e){}
    try{if(hasFn('renderTab'))renderTab()}catch(e){}
    try{if(hasFn('updateBadges'))updateBadges()}catch(e){}
  }
  function schedulePush(delay){
    if(!hasFn('syncPush'))return;
    clearTimeout(pushTimer);
    pushTimer=setTimeout(function(){try{if(hasFn('setSyncStatus'))setSyncStatus('syncing','Guardando en la nube...');syncPush()}catch(e){log('[drive-auto] push',e)}},delay||10000);
  }
  function pullNow(){
    if(pullActive||!hasFn('syncPull'))return;
    pullActive=true;
    Promise.resolve(syncPull()).then(refreshTasks).catch(function(e){log('[drive-auto] pull',e)}).finally(function(){pullActive=false});
  }
  function startLivePull(){
    if(pullTimer)return;
    pullTimer=setInterval(function(){if(!document.hidden)pullNow()},20000);
    window.addEventListener('focus',pullNow);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)pullNow()});
    setTimeout(pullNow,2500);
  }
  function wrapTab(){
    if(tabWrapped||!hasFn('renderTab'))return;
    var original=renderTab;
    window.renderTab=function(){refreshTasks();return original.apply(this,arguments)};
    tabWrapped=true;
  }
  function hasLocalData(){
    try{
      if(!state)return false;
      return ['tasks','publicaciones','events','entrevistas','recursos','reclamos'].some(function(k){return Array.isArray(state[k])&&state[k].length})||(state.guardias&&Object.keys(state.guardias).length);
    }catch(e){return false}
  }
  function ensureCloud(){
    if(syncStarted||!hasFn('syncInit'))return;
    syncStarted=true;
    var hadLocal=hasLocalData();
    try{
      if(hasFn('setSyncStatus'))setSyncStatus('syncing','Actualizando datos de la nube...');
      Promise.resolve(syncInit({manual:true})).then(function(){
        cleanText();wrapTab();refreshTasks();startLivePull();schedulePush(hadLocal?1500:5000);
      }).catch(function(e){log('[drive-auto] init',e);if(hasFn('setSyncStatus'))setSyncStatus('error','No se pudo conectar a la nube')});
    }catch(e){log('[drive-auto] init',e)}
  }
  function wrapSave(){
    if(!hasFn('saveState')||saveState.__driveAuto)return;
    var original=saveState;
    window.saveState=function(){cleanText();var r=original.apply(this,arguments);schedulePush(10000);return r};
    saveState.__driveAuto=true;
  }
  function wrapStart(){
    if(!hasFn('startApp')||startApp.__driveAuto)return;
    var original=startApp;
    window.startApp=function(){var r=original.apply(this,arguments);setTimeout(ensureCloud,1200);return r};
    startApp.__driveAuto=true;
  }

  function installDifusion(){
    try{
      if(Array.isArray(window.DIFUSION_FUNC_ACCIONES)&&!DIFUSION_FUNC_ACCIONES.some(function(x){return x&&x[0]==='reposteo'})){
        var i=DIFUSION_FUNC_ACCIONES.findIndex(function(x){return x&&x[0]==='estado_wa'});
        DIFUSION_FUNC_ACCIONES.splice(i>=0?i:DIFUSION_FUNC_ACCIONES.length,0,['reposteo','Reposteo']);
      }
    }catch(e){}
    if(hasFn('funcionarioDifusionCompleto'))window.funcionarioDifusionCompleto=function(r){return !!(r&&(r.compartio||r.comento||r.reacciono||r.reposteo||r.estado_wa||r.no_corresponde))};
    if(hasFn('calcPubDifusionStats'))window.calcPubDifusionStats=function(p){
      var fb=num(p&&p.compartidos_manual_fb),ig=num(p&&p.compartidos_manual_ig),old=num(p&&p.compartidos_manual);
      var t={compartio:0,comento:0,reacciono:0,reposteo:0,estado_wa:0,no_corresponde:0,manual:fb+ig+old,manual_fb:fb,manual_ig:ig,manual_legacy:old};
      var map=(p&&p.funcionariosDifusion)||{};
      (state.funcionarios||[]).forEach(function(f){var r=map[f.id]||{};['compartio','comento','reacciono','reposteo','estado_wa','no_corresponde'].forEach(function(k){if(r[k])t[k]++})});
      return t;
    };
    window.setPubCompartidosManual=function(pubId,value,canal){
      var p=(state.publicaciones||[]).find(function(x){return x.id===pubId});if(!p)return;
      if(canal==='fb')p.compartidos_manual_fb=num(value);else if(canal==='ig')p.compartidos_manual_ig=num(value);else p.compartidos_manual=num(value);
      p.updated=Date.now();saveState();if(hasFn('renderDifusionWeekStats'))renderDifusionWeekStats();if(window._diffPubId===pubId&&hasFn('renderPubDifusionStats'))renderPubDifusionStats(p);
    };
    if(hasFn('renderPubDifusionStats'))window.renderPubDifusionStats=function(p){
      var box=byId('dfPubStats');if(!box)return;
      var t=calcPubDifusionStats(p),labels={compartio:'compartieron',comento:'comentaron',reacciono:'reaccionaron',reposteo:'repostearon',estado_wa:'estados WA',no_corresponde:'no corresponde'};
      var tags=[['compartio','tag-g'],['comento','tag-b'],['reacciono','tag-p'],['reposteo','tag-c'],['estado_wa','tag-x'],['no_corresponde','tag-r']].map(function(x){
        var k=x[0],v=k==='compartio'?t.compartio+t.manual:t[k],on=window._dfStatOpen===k;
        return '<button class="tag '+x[1]+'" style="justify-content:center;padding:8px;border:1px solid '+(on?'var(--tx)':'transparent')+';cursor:pointer" onclick="toggleDifusionStat(\''+k+'\')">'+v+' '+labels[k]+'</button>';
      }).join('');
      var detail='';
      if(window._dfStatOpen){var names=difusionActionNames(p,window._dfStatOpen),title=labels[window._dfStatOpen]||'seleccionados';detail='<div style="margin-top:8px;background:var(--bg-soft);border:1px solid var(--bd);border-radius:10px;padding:10px"><div class="ct-s" style="font-weight:800;margin-bottom:6px">'+esc(title.charAt(0).toUpperCase()+title.slice(1))+'</div>'+(names.length?'<div class="li-s">'+names.map(function(n){return '<span class="tag tag-x">'+esc(n)+'</span>'}).join('')+'</div>':'<div class="ct-s">Todavia no hay funcionarios en esta categoria.</div>')+'</div>'}
      var legacy=t.manual_legacy?'<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:var(--tx-s)">Sin discriminar <input class="inp" type="number" min="0" value="'+esc(t.manual_legacy)+'" oninput="setPubCompartidosManual(\''+p.id+'\',this.value)" style="width:92px"></label>':'';
      var manual='<div style="margin-top:8px;background:var(--bg-soft);border:1px solid var(--bd);border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;align-items:end"><div><div style="font-size:12px;font-weight:800;color:var(--tx-s);margin-bottom:3px">Compartidos manuales</div><div class="ct-s">Suma los compartidos que no esten asociados a un funcionario.</div></div><label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:var(--tx-s)">Facebook <input class="inp" type="number" min="0" value="'+esc(t.manual_fb)+'" oninput="setPubCompartidosManual(\''+p.id+'\',this.value,\'fb\')" style="width:92px"></label><label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:var(--tx-s)">Instagram <input class="inp" type="number" min="0" value="'+esc(t.manual_ig)+'" oninput="setPubCompartidosManual(\''+p.id+'\',this.value,\'ig\')" style="width:92px"></label>'+legacy+'</div>';
      box.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">'+tags+'</div>'+manual+detail;
    };
    window.calcDifusionWeekStats=function(){
      var end=stripTime(new Date()),start=addDays(end,-13),sem={start:start,end:end,startIso:dateISO(start),endIso:dateISO(end),label:fmtDate(dateISO(start))+' al '+fmtDate(dateISO(end))};
      var pubs=getDifusionPublicaciones().filter(function(p){return p.date>=sem.startIso&&p.date<=sem.endIso}),totals={compartio:0,comento:0,reacciono:0,reposteo:0,estado_wa:0,no_corresponde:0,manual:0},per={};
      pubs.forEach(function(p){totals.manual+=num(p.compartidos_manual)+num(p.compartidos_manual_fb)+num(p.compartidos_manual_ig);var map=p.funcionariosDifusion||{};(state.funcionarios||[]).forEach(function(f){var r=map[f.id]||{};if(!per[f.id])per[f.id]={f:f,compartio:0,comento:0,reacciono:0,reposteo:0,estado_wa:0,no_corresponde:0,total:0};['compartio','comento','reacciono','reposteo','estado_wa','no_corresponde'].forEach(function(k){if(r[k]){totals[k]++;per[f.id][k]++;if(k==='compartio'||k==='reacciono'||k==='reposteo')per[f.id].total++}})})});
      var ranking=Object.values(per).filter(function(x){return x.total>0}).sort(function(a,b){return b.total-a.total||b.compartio-a.compartio||b.reposteo-a.reposteo||b.reacciono-a.reacciono}).slice(0,5);
      return {sem:sem,pubs:pubs,totals:totals,ranking:ranking};
    };
    window.descargarDifusionUltimos4Dias=function(){
      var end=stripTime(new Date()),start=addDays(end,-3),si=dateISO(start),ei=dateISO(end),per={};
      getDifusionPublicaciones().filter(function(p){return p.date>=si&&p.date<=ei}).forEach(function(p){var map=p.funcionariosDifusion||{};(state.funcionarios||[]).forEach(function(f){var r=map[f.id]||{};if(!per[f.id])per[f.id]={nombre:f.name||'',area:f.role||'',compartidos:0,reacciones:0,reposteos:0,comentarios:0,estado_wa:0,no_corresponde:0,acciones:0};if(r.compartio){per[f.id].compartidos++;per[f.id].acciones++}if(r.reacciono){per[f.id].reacciones++;per[f.id].acciones++}if(r.reposteo){per[f.id].reposteos++;per[f.id].acciones++}if(r.comento)per[f.id].comentarios++;if(r.estado_wa)per[f.id].estado_wa++;if(r.no_corresponde)per[f.id].no_corresponde++})});
      var rows=Object.values(per).filter(function(x){return x.acciones||x.comentarios||x.estado_wa||x.no_corresponde}).sort(function(a,b){return b.acciones-a.acciones||b.compartidos-a.compartidos||b.reposteos-a.reposteos||a.nombre.localeCompare(b.nombre)});
      var csv=[['Desde','Hasta','Funcionario','Area','Compartidos','Reacciones','Reposteos','Comentarios','Estados WA','No corresponde','Acciones']];
      rows.forEach(function(r){csv.push([si,ei,r.nombre,r.area,r.compartidos,r.reacciones,r.reposteos,r.comentarios,r.estado_wa,r.no_corresponde,r.acciones])});
      if(!rows.length)csv.push([si,ei,'Sin acciones registradas','','0','0','0','0','0','0','0']);
      var text=csv.map(function(row){return row.map(function(v){v=String(v==null?'':v);return /[",\n;]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(';')}).join('\n');
      var blob=new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='estadistica-difusion-ultimos-4-dias-'+ei+'.csv';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
    };
    window.renderDifusionWeekStats=function(){
      var box=byId('dfWeekStats');if(!box)return;var st=calcDifusionWeekStats(),t=st.totals;
      var ranking=st.ranking.length?st.ranking.map(function(x,i){return '<div class="li" style="padding:9px;cursor:default"><div class="li-i" style="width:30px;height:30px;border-radius:8px;background:var(--ac-s);color:var(--ac)">'+(i+1)+'</div><div class="li-b"><div class="li-t">'+esc(x.f.name||'')+'</div><div class="li-s"><span class="tag tag-g">'+x.compartio+' compartidos</span><span class="tag tag-p">'+x.reacciono+' reacciones</span><span class="tag tag-c">'+x.reposteo+' reposteos</span></div></div></div>'}).join(''):'<div class="emp" style="padding:14px"><div class="emt">Sin acciones registradas en las ultimas 2 semanas</div></div>';
      box.innerHTML='<div class="card"><div class="ch"><div><div class="ct-t">Estadistica ultimas 2 semanas</div><div class="ct-s">'+st.sem.label+'</div></div><div class="fl"><button class="btn btn-s" onclick="descargarDifusionUltimos4Dias()">Descargar 4 dias</button><span class="tag tag-p">'+st.pubs.length+' publicaciones</span></div></div><div class="grid g2" style="margin-top:12px"><div><div class="li" style="cursor:default"><div class="li-i" style="background:var(--gr-s);color:var(--gr)">-></div><div class="li-b"><div class="li-t">Acciones registradas</div><div class="li-s"><span class="tag tag-g">'+(t.compartio+t.manual)+' compartidos</span><span class="tag tag-a">'+t.manual+' manuales</span><span class="tag tag-p">'+t.reacciono+' reacciones</span><span class="tag tag-c">'+t.reposteo+' reposteos</span></div></div></div></div><div><div class="ct-s" style="font-weight:800;margin-bottom:8px">Funcionarios destacados</div>'+ranking+'</div></div></div>';
    };
  }
  function installSearch(){
    if(hasFn('openDifusion')&&!openDifusion.__searchPatch){var o=openDifusion;window.openDifusion=function(id){var r=o.apply(this,arguments);setTimeout(function(){if(byId('dfFuncSearch'))byId('dfFuncSearch').value=''},0);return r};openDifusion.__searchPatch=true}
    if(hasFn('renderDifusionModal')&&!renderDifusionModal.__searchPatch){var original=renderDifusionModal;window.renderDifusionModal=function(){original.apply(this,arguments);var list=byId('dfFuncList');if(!list)return;var s=byId('dfFuncSearch');if(!s){s=document.createElement('input');s.className='inp';s.id='dfFuncSearch';s.placeholder='Buscar funcionario, area o WhatsApp...';s.style.marginBottom='12px';s.oninput=function(){renderDifusionModal()};list.parentNode.insertBefore(s,list)}var q=(s.value||'').trim().toLowerCase();if(q)Array.prototype.forEach.call(list.children,function(row){row.style.display=(row.textContent||'').toLowerCase().indexOf(q)>=0?'':'none'})};renderDifusionModal.__searchPatch=true}
  }
  function installTask(){
    if(hasFn('editTask')&&!editTask.__collabPatch){var e=editTask;window.editTask=function(id){var r=e.apply(this,arguments);setTimeout(function(){if(!byId('tkCollab')&&byId('tkAsg')){var label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg-soft);font-size:13px;font-weight:700;color:var(--tx);cursor:pointer;margin-bottom:14px';label.innerHTML='<input type="checkbox" id="tkCollab" style="width:16px;height:16px;accent-color:var(--ac)"> Tarea colaborativa';var fld=byId('tkAsg').closest?byId('tkAsg').closest('.fld'):byId('tkAsg').parentNode;if(fld&&fld.parentNode)fld.parentNode.insertBefore(label,fld.nextSibling)}var t=id?(state.tasks||[]).find(function(x){return x.id===id}):null;if(byId('tkCollab'))byId('tkCollab').checked=!!(t&&t.collaborative)},0);return r};editTask.__collabPatch=true}
    if(hasFn('saveTask')&&!saveTask.__collabPatch){var s=saveTask;window.saveTask=function(){var id=byId('tkId')?byId('tkId').value:'',collab=!!(byId('tkCollab')&&byId('tkCollab').checked),r=s.apply(this,arguments);setTimeout(function(){var t=id?(state.tasks||[]).find(function(x){return x.id===id}):(state.tasks||[])[(state.tasks||[]).length-1];if(t&&t.collaborative!==collab){t.collaborative=collab;t.updated=Date.now();saveState();if(hasFn('renderAll'))renderAll()}},0);return r};saveTask.__collabPatch=true}
  }
  function install(){
    if(installed)return;installed=true;wrapSave();wrapStart();wrapTab();installDifusion();installSearch();installTask();
    setTimeout(function(){installed=false;wrapSave();wrapStart();wrapTab();installDifusion();installSearch();installTask();refreshTasks();try{if(typeof currentUser==='string'&&currentUser)ensureCloud()}catch(e){}},1200);
    log('[drive-auto] activo');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();