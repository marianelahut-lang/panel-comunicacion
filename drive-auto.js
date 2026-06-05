/* Automatic Google Drive sync for Panel Comunicacion. */
(function(){
  'use strict';

  var DRIVE_AUTO_INTERVAL = 180000;
  var DRIVE_PUSH_DELAY = 20000;
  var timer = null;
  var pushTimer = null;
  var syncing = false;
  var pulling = false;

  function ready(){
    try { return typeof driveReady === 'function' && driveReady(); } catch(e){ return false; }
  }

  function enabled(){
    try {
      if (!state.config) state.config = {};
      if (state.config.driveAutoSync === undefined) state.config.driveAutoSync = true;
      if (!state.config.driveSyncInterval) state.config.driveSyncInterval = DRIVE_AUTO_INTERVAL;
      return state.config.driveAutoSync !== false && ready();
    } catch(e){ return false; }
  }

  function cleanForCloud(){
    var toSave = typeof stripEmbeddedFilesForStorage === 'function' ? stripEmbeddedFilesForStorage(state) : JSON.parse(JSON.stringify(state || {}));
    delete toSave._supaTables;
    delete toSave._datosDetectados;
    return toSave;
  }

  async function request(action, extra){
    var body = Object.assign({
      action: action,
      folderId: state.config.driveFolderId,
      filename: 'panel-comunicacion-state.json'
    }, extra || {});
    var r = await fetch(state.config.driveScriptUrl, {
      method: 'POST',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(body)
    });
    var out = await r.json().catch(function(){ return null; });
    if(!out || !out.ok) throw new Error((out && out.error) || 'Error de Drive');
    return out;
  }

  async function pushNow(){
    if(syncing || !enabled() || pulling) return;
    syncing = true;
    try{
      var out = await request('save_state', {
        value: cleanForCloud(),
        updatedBy: currentUser || 'desconocido'
      });
      state.config.driveLastUpdatedAt = out.updatedAt || new Date().toISOString();
      if(typeof setSyncStatus === 'function') setSyncStatus('synced','Drive sincronizado');
    }catch(e){
      console.warn('[drive-auto] push', e);
      if(typeof setSyncStatus === 'function') setSyncStatus('error','Error Drive');
    }finally{
      syncing = false;
    }
  }

  async function pullNow(){
    if(syncing || !enabled()) return;
    syncing = true;
    try{
      var meta = await request('state_meta');
      if(!meta.updatedAt || meta.updatedAt === state.config.driveLastUpdatedAt){
        if(typeof setSyncStatus === 'function') setSyncStatus('synced','Drive al dia');
        return;
      }
      var out = await request('load_state');
      if(!out.value) return;
      pulling = true;
      if(typeof mergeRemoteState === 'function') await mergeRemoteState(out.value, out.updatedAt ? new Date(out.updatedAt).getTime() : Date.now());
      state.config.driveLastUpdatedAt = out.updatedAt || meta.updatedAt;
      if(typeof saveState === 'function') saveState();
      if(typeof renderAll === 'function') renderAll();
      if(typeof initFilters === 'function') initFilters();
      if(typeof setSyncStatus === 'function') setSyncStatus('synced','Drive actualizado');
    }catch(e){
      console.warn('[drive-auto] pull', e);
      if(typeof setSyncStatus === 'function') setSyncStatus('error','Error Drive');
    }finally{
      pulling = false;
      syncing = false;
    }
  }

  function schedulePush(){
    if(!enabled() || pulling) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushNow, DRIVE_PUSH_DELAY);
  }

  function start(){
    clearInterval(timer);
    timer = null;
    if(!enabled()) return;
    timer = setInterval(pullNow, state.config.driveSyncInterval || DRIVE_AUTO_INTERVAL);
    setTimeout(pullNow, 2500);
  }

  function install(){
    if(window.__driveAutoInstalled) return;
    window.__driveAutoInstalled = true;

    var originalSave = saveState;
    saveState = function(){
      originalSave.apply(this, arguments);
      schedulePush();
    };

    var originalStart = startApp;
    startApp = function(){
      originalStart.apply(this, arguments);
      setTimeout(start, 1800);
    };

    var originalSaveDrive = saveDriveCfg;
    saveDriveCfg = function(){
      if(document.getElementById('drvAutoSync')) state.config.driveAutoSync = document.getElementById('drvAutoSync').checked;
      originalSaveDrive.apply(this, arguments);
      start();
    };

    window.driveAutoSyncNow = function(){ start(); return pullNow(); };
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();