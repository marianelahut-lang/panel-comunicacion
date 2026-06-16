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
        // Si esta computadora tenia datos locales que no llegaron a Supabase,
        // subimos el paquete completo despues de mezclar con la nube.
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
    // Si el usuario ya habia entrado antes de que este archivo terminara de cargar.
    setTimeout(function(){
      wrapSaveState();
      wrapStartApp();
      try {
        if(typeof currentUser === 'string' && currentUser) ensureSupabaseReadyAndRescueLocal();
      } catch(e) {}
    }, 1200);
    log('[auto-sync] guardado automatico activo');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
