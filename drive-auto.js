/* Refuerzo de sincronizacion automatica para Panel Comunicacion.
   Este archivo se carga al final de index.html. Su objetivo principal es:
   - activar Supabase aunque el panel este en modo manual/ahorro;
   - mezclar nube + datos locales al ingresar;
   - subir automaticamente el paquete completo despues de cada guardado;
   - rescatar datos locales que hayan quedado solo en una computadora. */
(function(){
  'use strict';

  var supaPushTimer = null;
  var supaReadyStarted = false;
  var installStarted = false;
  var livePullTimer = null;
  var livePullActive = false;
  var renderTabWrapped = false;
  var lastStatus = '';

  function log(){
    try { console.log.apply(console, arguments); } catch(e) {}
  }

  function setStatus(level, message){
    lastStatus = message || lastStatus;
    try {
      if(typeof setSyncStatus === 'function') setSyncStatus(level, message);
    } catch(e) {}
  }

  function cleanLocalText(){
    try{
      if(typeof state !== 'object' || !state) return;
      var keys = ['name','role','email','phone','program','type','desc','title','area','category','status','notes','responsable','vecino','direccion'];
      ['agents','funcionarios','medios','tasks','publicaciones','events','entrevistas','recursos','reclamos'].forEach(function(listKey){
        if(!Array.isArray(state[listKey])) return;
        state[listKey].forEach(function(item){
          if(!item || typeof item !== 'object') return;
          keys.forEach(function(k){
            if(typeof item[k] === 'string') item[k] = item[k].replace(/\s+/g, ' ').trim();
          });
        });
      });
      try { localStorage.setItem('pcomTA_v6', JSON.stringify(state)); } catch(e) {}
    }catch(e){ log('[auto-sync] clean text', e); }
  }

  function parseTaskTime(task){
    if(!task || typeof task !== 'object') return 0;
    var candidates = [
      task.updatedAt, task.updated_at, task.modifiedAt, task.modified_at,
      task.updated, task.createdAt, task.created_at, task.created,
      task.date, task.fecha, task.due
    ];
    for(var i = 0; i < candidates.length; i++){
      var value = candidates[i];
      if(!value) continue;
      if(typeof value === 'number') return value;
      var parsed = value instanceof Date ? value.getTime() : Date.parse(String(value));
      if(Number.isFinite(parsed)) return parsed;
    }
    if(typeof task.id === 'string'){
      var match = task.id.match(/(\d{12,})/);
      if(match) return Number(match[1]);
    }
    return 0;
  }

  function sortTasksNewestFirst(){
    try{
      if(!state || !Array.isArray(state.tasks)) return;
      state.tasks.sort(function(a, b){
        return parseTaskTime(b) - parseTaskTime(a);
      });
    }catch(e){ log('[auto-sync] ordenar tareas', e); }
  }

  function refreshTaskBoard(){
    sortTasksNewestFirst();
    try { if(typeof renderTab === 'function') renderTab(); } catch(e) {}
    try { if(typeof updateBadges === 'function') updateBadges(); } catch(e) {}
  }

  function scheduleSupaPush(delay){
    if(typeof syncPush !== 'function') return;
    clearTimeout(supaPushTimer);
    supaPushTimer = setTimeout(function(){
      try {
        setStatus('syncing', 'Guardando en la nube...');
        syncPush();
      } catch(e){
        log('[auto-sync] supabase push', e);
        setStatus('error', 'No se pudo subir a la nube');
      }
    }, delay || 10000);
  }

  function livePullNow(){
    if(livePullActive || typeof syncPull !== 'function') return;
    livePullActive = true;
    try{
      Promise.resolve(syncPull()).then(function(){
        refreshTaskBoard();
      }).catch(function(e){
        log('[auto-sync] live pull', e);
      }).finally(function(){
        livePullActive = false;
      });
    }catch(e){
      livePullActive = false;
      log('[auto-sync] live pull', e);
    }
  }

  function startLiveSync(){
    if(livePullTimer) return;
    livePullTimer = setInterval(function(){
      if(!document.hidden) livePullNow();
    }, 20000);
    window.addEventListener('focus', livePullNow);
    document.addEventListener('visibilitychange', function(){
      if(!document.hidden) livePullNow();
    });
    setTimeout(livePullNow, 2500);
  }

  function wrapRenderTab(){
    if(renderTabWrapped || typeof renderTab !== 'function') return;
    var originalRenderTab = renderTab;
    renderTab = function(){
      sortTasksNewestFirst();
      return originalRenderTab.apply(this, arguments);
    };
    renderTabWrapped = true;
  }

  function localHasSharedContent(){
    try{
      if(typeof state !== 'object' || !state) return false;
      var lists = ['tasks','publicaciones','events','entrevistas','recursos','reclamos'];
      var hasLists = lists.some(function(k){ return Array.isArray(state[k]) && state[k].length > 0; });
      var hasGuardias = state.guardias && typeof state.guardias === 'object' && Object.keys(state.guardias).length > 0;
      return hasLists || hasGuardias;
    }catch(e){ return false; }
  }

  function ensureSupabaseReadyAndRescueLocal(){
    if(supaReadyStarted || typeof syncInit !== 'function') return;
    supaReadyStarted = true;
    var hadLocal = localHasSharedContent();
    try{
      setStatus('syncing', 'Actualizando datos de la nube...');
      Promise.resolve(syncInit({manual:true})).then(function(){
        cleanLocalText();
        wrapRenderTab();
        refreshTaskBoard();
        startLiveSync();
        if(hadLocal) scheduleSupaPush(1500);
        else scheduleSupaPush(5000);
      }).catch(function(e){
        log('[auto-sync] supabase init', e);
        setStatus('error', 'No se pudo conectar a la nube');
      });
    }catch(e){
      log('[auto-sync] supabase init', e);
      setStatus('error', 'No se pudo conectar a la nube');
    }
  }

  function wrapSaveState(){
    if(typeof saveState !== 'function' || saveState.__autoSyncWrapped) return;
    var originalSaveState = saveState;
    saveState = function(){
      cleanLocalText();
      originalSaveState.apply(this, arguments);
      scheduleSupaPush(10000);
    };
    saveState.__autoSyncWrapped = true;
  }

  function wrapStartApp(){
    if(typeof startApp !== 'function' || startApp.__autoSyncWrapped) return;
    var originalStartApp = startApp;
    startApp = function(){
      var result = originalStartApp.apply(this, arguments);
      setTimeout(ensureSupabaseReadyAndRescueLocal, 1200);
      return result;
    };
    startApp.__autoSyncWrapped = true;
  }

  function install(){
    if(installStarted) return;
    installStarted = true;
    wrapSaveState();
    wrapStartApp();
    wrapRenderTab();
    setTimeout(function(){
      wrapSaveState();
      wrapStartApp();
      wrapRenderTab();
      refreshTaskBoard();
      try {
        if(typeof currentUser === 'string' && currentUser) ensureSupabaseReadyAndRescueLocal();
      } catch(e) {}
    }, 1200);
    log('[auto-sync] guardado automatico activo');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();

/* Ajustes de difusion y tareas colaborativas aplicados desde archivo externo. */
(function(){
  'use strict';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
    else fn();
  }

  function n(value){
    return Math.max(0, parseInt(value || '0', 10) || 0);
  }

  function installDifusionPatch(){
    try{
      if(typeof DIFUSION_FUNC_ACCIONES !== 'undefined' && Array.isArray(DIFUSION_FUNC_ACCIONES) && !DIFUSION_FUNC_ACCIONES.some(function(x){return x && x[0] === 'reposteo';})){
        var idx = DIFUSION_FUNC_ACCIONES.findIndex(function(x){return x && x[0] === 'estado_wa';});
        DIFUSION_FUNC_ACCIONES.splice(idx >= 0 ? idx : DIFUSION_FUNC_ACCIONES.length, 0, ['reposteo','Reposteo']);
      }
    }catch(e){}

    if(typeof funcionarioDifusionCompleto === 'function'){
      funcionarioDifusionCompleto = function(rec){
        return !!(rec && (rec.compartio || rec.comento || rec.reacciono || rec.reposteo || rec.estado_wa || rec.no_corresponde));
      };
    }

    if(typeof calcPubDifusionStats === 'function'){
      calcPubDifusionStats = function(p){
        var manualFb = n(p && p.compartidos_manual_fb);
        var manualIg = n(p && p.compartidos_manual_ig);
        var manualLegacy = n(p && p.compartidos_manual);
        var totals = {compartio:0, comento:0, reacciono:0, reposteo:0, estado_wa:0, no_corresponde:0, manual:manualFb + manualIg + manualLegacy, manual_fb:manualFb, manual_ig:manualIg, manual_legacy:manualLegacy};
        var map = (p && p.funcionariosDifusion) || {};
        (state.funcionarios || []).forEach(function(f){
          var rec = map[f.id] || {};
          ['compartio','comento','reacciono','reposteo','estado_wa','no_corresponde'].forEach(function(k){
            if(rec[k]) totals[k]++;
          });
        });
        return totals;
      };
    }

    window.setPubCompartidosManual = setPubCompartidosManual = function(pubId, value, canal){
      var p = state.publicaciones.find(function(x){return x.id === pubId;});
      if(!p) return;
      if(canal === 'fb') p.compartidos_manual_fb = n(value);
      else if(canal === 'ig') p.compartidos_manual_ig = n(value);
      else p.compartidos_manual = n(value);
      p.updated = Date.now();
      saveState();
      if(typeof renderDifusionWeekStats === 'function') renderDifusionWeekStats();
      if(window._diffPubId === pubId && typeof renderPubDifusionStats === 'function') renderPubDifusionStats(p);
    };

    if(typeof renderPubDifusionStats === 'function'){
      renderPubDifusionStats = function(p){
        var box = $('dfPubStats');
        if(!box) return;
        var t = calcPubDifusionStats(p);
        var labels = {compartio:'compartieron', comento:'comentaron', reacciono:'reaccionaron', reposteo:'repostearon', estado_wa:'estados WA', no_corresponde:'no corresponde'};
        var tags = [['compartio','tag-g'],['comento','tag-b'],['reacciono','tag-p'],['reposteo','tag-c'],['estado_wa','tag-x'],['no_corresponde','tag-r']].map(function(pair){
          var k = pair[0], cls = pair[1];
          var on = window._dfStatOpen === k;
          var value = k === 'compartio' ? t.compartio + t.manual : t[k];
          return '<button class="tag '+cls+'" style="justify-content:center;padding:8px;border:1px solid '+(on?'var(--tx)':'transparent')+';cursor:pointer" onclick="toggleDifusionStat(\''+k+'\')">'+value+' '+labels[k]+'</button>';
        }).join('');
        var detail = '';
        if(window._dfStatOpen){
          var names = difusionActionNames(p, window._dfStatOpen);
          var title = labels[window._dfStatOpen] || 'seleccionados';
          detail = '<div style="margin-top:8px;background:var(--bg-soft);border:1px solid var(--bd);border-radius:10px;padding:10px"><div class="ct-s" style="font-weight:800;margin-bottom:6px">'+esc(title.charAt(0).toUpperCase()+title.slice(1))+'</div>'+(names.length?'<div class="li-s">'+names.map(function(name){return '<span class="tag tag-x">'+esc(name)+'</span>';}).join('')+'</div>':'<div class="ct-s">Todavia no hay funcionarios en esta categoria.</div>')+'</div>';
        }
        var legacy = t.manual_legacy ? '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:var(--tx-s)">Sin discriminar <input class="inp" type="number" min="0" value="'+esc(t.manual_legacy)+'" oninput="setPubCompartidosManual(\''+p.id+'\',this.value)" style="width:92px"></label>' : '';
        var manual = '<div style="margin-top:8px;background:var(--bg-soft);border:1px solid var(--bd);border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;align-items:end"><div><div style="font-size:12px;font-weight:800;color:var(--tx-s);margin-bottom:3px">Compartidos manuales</div><div class="ct-s">Suma los compartidos que no esten asociados a un funcionario.</div></div><label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:var(--tx-s)">Facebook <input class="inp" type="number" min="0" value="'+esc(t.manual_fb)+'" oninput="setPubCompartidosManual(\''+p.id+'\',this.value,\'fb\')" style="width:92px"></label><label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:var(--tx-s)">Instagram <input class="inp" type="number" min="0" value="'+esc(t.manual_ig)+'" oninput="setPubCompartidosManual(\''+p.id+'\',this.value,\'ig\')" style="width:92px"></label>'+legacy+'</div>';
        box.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">'+tags+'</div>'+manual+detail;
      };
    }

    window.calcDifusionWeekStats = calcDifusionWeekStats = function(){
      var end = stripTime(new Date());
      var start = addDays(end, -13);
      var sem = {start:start, end:end, startIso:dateISO(start), endIso:dateISO(end), label:fmtDate(dateISO(start))+' al '+fmtDate(dateISO(end))};
      var pubs = getDifusionPublicaciones().filter(function(p){return p.date >= sem.startIso && p.date <= sem.endIso;});
      var totals = {compartio:0, comento:0, reacciono:0, reposteo:0, estado_wa:0, no_corresponde:0, manual:0};
      var perFunc = {};
      pubs.forEach(function(p){
        totals.manual += n(p.compartidos_manual) + n(p.compartidos_manual_fb) + n(p.compartidos_manual_ig);
        var map = p.funcionariosDifusion || {};
        (state.funcionarios || []).forEach(function(f){
          var rec = map[f.id] || {};
          if(!perFunc[f.id]) perFunc[f.id] = {f:f, compartio:0, comento:0, reacciono:0, reposteo:0, estado_wa:0, no_corresponde:0, total:0};
          ['compartio','comento','reacciono','reposteo','estado_wa','no_corresponde'].forEach(function(k){
            if(rec[k]){
              totals[k]++;
              perFunc[f.id][k]++;
              if(k === 'compartio' || k === 'reacciono' || k === 'reposteo') perFunc[f.id].total++;
            }
          });
        });
      });
      var ranking = Object.values(perFunc).filter(function(x){return x.total > 0;}).sort(function(a,b){
        return b.total - a.total || b.compartio - a.compartio || b.reposteo - a.reposteo || b.reacciono - a.reacciono;
      }).slice(0, 12);
      return {sem:sem, pubs:pubs, totals:totals, ranking:ranking};
    };

    window.renderDifusionWeekStats = renderDifusionWeekStats = function(){
      var box = $('dfWeekStats');
      if(!box) return;
      var st = calcDifusionWeekStats();
      var t = st.totals;
      var ranking = st.ranking.length ? st.ranking.map(function(x,i){
        return '<div class="li" style="padding:9px;cursor:default"><div class="li-i" style="width:30px;height:30px;border-radius:8px;background:var(--ac-s);color:var(--ac)">'+(i+1)+'</div><div class="li-b"><div class="li-t">'+esc(x.f.name||'')+'</div><div class="li-s"><span class="tag tag-g">'+x.compartio+' compartidos</span><span class="tag tag-p">'+x.reacciono+' reacciones</span><span class="tag tag-c">'+x.reposteo+' reposteos</span></div></div></div>';
      }).join('') : '<div class="emp" style="padding:14px"><div class="emt">Sin acciones registradas en las ultimas 2 semanas</div></div>';
      box.innerHTML = '<div class="card"><div class="ch"><div><div class="ct-t">Estadistica ultimas 2 semanas</div><div class="ct-s">'+st.sem.label+'</div></div><span class="tag tag-p">'+st.pubs.length+' publicaciones</span></div><div class="grid g2" style="margin-top:12px"><div><div class="li" style="cursor:default"><div class="li-i" style="background:var(--gr-s);color:var(--gr)">-></div><div class="li-b"><div class="li-t">Acciones registradas</div><div class="li-s"><span class="tag tag-g">'+(t.compartio+t.manual)+' compartidos</span><span class="tag tag-a">'+t.manual+' manuales</span><span class="tag tag-p">'+t.reacciono+' reacciones</span><span class="tag tag-c">'+t.reposteo+' reposteos</span></div></div></div></div><div><div class="ct-s" style="font-weight:800;margin-bottom:8px">Funcionarios</div>'+ranking+'</div></div></div>';
    };
  }

  function installDifusionSearchPatch(){
    if(typeof openDifusion === 'function' && !openDifusion.__searchPatch){
      var originalOpenDifusion = openDifusion;
      openDifusion = function(pubId){
        var result = originalOpenDifusion.apply(this, arguments);
        setTimeout(function(){
          if($('dfFuncSearch')) $('dfFuncSearch').value = '';
        }, 0);
        return result;
      };
      openDifusion.__searchPatch = true;
    }
    if(typeof renderDifusionModal === 'function' && !renderDifusionModal.__searchPatch){
      var originalRenderDifusionModal = renderDifusionModal;
      renderDifusionModal = function(){
        originalRenderDifusionModal.apply(this, arguments);
        var list = $('dfFuncList');
        if(!list) return;
        var search = $('dfFuncSearch');
        if(!search){
          search = document.createElement('input');
          search.className = 'inp';
          search.id = 'dfFuncSearch';
          search.placeholder = 'Buscar funcionario, area o WhatsApp...';
          search.style.marginBottom = '12px';
          search.oninput = function(){ renderDifusionModal(); };
          list.parentNode.insertBefore(search, list);
        }
        var q = (search.value || '').trim().toLowerCase();
        if(!q) return;
        Array.prototype.forEach.call(list.children, function(row){
          var txt = (row.textContent || '').toLowerCase();
          row.style.display = txt.indexOf(q) >= 0 ? '' : 'none';
        });
      };
      renderDifusionModal.__searchPatch = true;
    }
  }

  function installTaskPatch(){
    if(typeof editTask === 'function' && !editTask.__collabPatch){
      var originalEditTask = editTask;
      editTask = function(id){
        var result = originalEditTask.apply(this, arguments);
        setTimeout(function(){
          if(!$('tkCollab') && $('tkAsg')){
            var label = document.createElement('label');
            label.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg-soft);font-size:13px;font-weight:700;color:var(--tx);cursor:pointer;margin-bottom:14px';
            label.innerHTML = '<input type="checkbox" id="tkCollab" style="width:16px;height:16px;accent-color:var(--ac)"> Tarea colaborativa';
            var fld = $('tkAsg').closest ? $('tkAsg').closest('.fld') : $('tkAsg').parentNode;
            if(fld && fld.parentNode) fld.parentNode.insertBefore(label, fld.nextSibling);
          }
          var t = id ? state.tasks.find(function(x){return x.id === id;}) : null;
          if($('tkCollab')) $('tkCollab').checked = !!(t && t.collaborative);
        }, 0);
        return result;
      };
      editTask.__collabPatch = true;
    }

    if(typeof saveTask === 'function' && !saveTask.__collabPatch){
      var originalSaveTask = saveTask;
      saveTask = function(){
        var id = $('tkId') ? $('tkId').value : '';
        var collab = !!($('tkCollab') && $('tkCollab').checked);
        var result = originalSaveTask.apply(this, arguments);
        setTimeout(function(){
          var t = id ? state.tasks.find(function(x){return x.id === id;}) : state.tasks[state.tasks.length - 1];
          if(t && t.collaborative !== collab){
            t.collaborative = collab;
            t.updated = Date.now();
            saveState();
            if(typeof renderAll === 'function') renderAll();
          }
        }, 0);
        return result;
      };
      saveTask.__collabPatch = true;
    }
  }

  function install(){
    installDifusionPatch();
    installDifusionSearchPatch();
    installTaskPatch();
    try{
      if(typeof renderDifusionWeekStats === 'function') renderDifusionWeekStats();
    }catch(e){}
  }

  ready(function(){
    install();
    setTimeout(install, 1000);
    setTimeout(install, 3000);
  });
})();
