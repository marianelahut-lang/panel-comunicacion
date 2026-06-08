/* Automatic Google Drive sync for Panel Comunicacion. */
(function(){
  'use strict';

  var DRIVE_AUTO_INTERVAL = 180000;
  var DRIVE_PUSH_DELAY = 20000;
  var timer = null;
  var pushTimer = null;
  var syncing = false;
  var pulling = false;

  function fixMojibakeText(value){
    if(typeof value !== 'string') return value;
    var original = value;
    var out = value;
    if(/[ÃƒÃ‚Ã¢]/.test(out)){
      try { out = decodeURIComponent(escape(out)); } catch(e) {}
      out = out
        .replace(/Ã‚/g, '')
        .replace(/ÃƒÂ¡/g, 'a').replace(/ÃƒÂ©/g, 'e').replace(/ÃƒÂ­/g, 'i').replace(/ÃƒÂ³/g, 'o').replace(/ÃƒÂº/g, 'u').replace(/ÃƒÂ±/g, 'n')
        .replace(/ÃƒÂ/g, 'A').replace(/Ãƒâ€°/g, 'E').replace(/ÃƒÂ/g, 'I').replace(/Ãƒâ€œ/g, 'O').replace(/ÃƒÅ¡/g, 'U').replace(/Ãƒâ€˜/g, 'N')
        .replace(/Ã¢â‚¬â€|Ã¢â‚¬â€œ/g, '-')
        .replace(/Ã¢Â­Â|â­/g, '*');
    }
    out = out.replace(/\s+\*/g, ' *').replace(/\s+/g, ' ').trim();
    return out || original;
  }

  function repairSavedText(){
    try{
      if(typeof state !== 'object' || !state) return;
      var keys = ['name','role','email','phone','program','type','desc','title','area','category','status','notes','responsable','vecino','direccion'];
      ['agents','funcionarios','medios','tasks','publicaciones','events','entrevistas','recursos','reclamos'].forEach(function(listKey){
        if(!Array.isArray(state[listKey])) return;
        state[listKey].forEach(function(item){
          if(!item || typeof item !== 'object') return;
          keys.forEach(function(k){ if(typeof item[k] === 'string') item[k] = fixMojibakeText(item[k]); });
        });
      });
      if(state.config && typeof state.config === 'object'){
        Object.keys(state.config).forEach(function(k){ if(typeof state.config[k] === 'string') state.config[k] = fixMojibakeText(state.config[k]); });
      }
      try { localStorage.setItem('pcomTA_v6', JSON.stringify(state)); } catch(e) {}
    }catch(e){ console.warn('[drive-auto] text repair', e); }
  }

  function repairLoginText(){
    try{
      repairSavedText();
      var sel = document.getElementById('loginUser');
      if(sel){
        Array.from(sel.options).forEach(function(opt, index){
          opt.textContent = index === 0 ? '-- selecciona --' : fixMojibakeText(opt.textContent);
        });
      }
      var labels = document.querySelectorAll('#loginOv .lt, #loginOv label, #loginOv input, #loginOv div');
      Array.from(labels).forEach(function(el){
        if(el.placeholder) el.placeholder = fixMojibakeText(el.placeholder);
        if(el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) el.textContent = fixMojibakeText(el.textContent);
      });
      document.title = fixMojibakeText(document.title);
    }catch(e){ console.warn('[drive-auto] login text repair', e); }
  }

  function ready(){
    try { return typeof driveReady === 'function' && driveReady(); } catch(e){ return false; }
  }

  function enabled(){
    try {
      if (!state.config) state.config = {};
      if (state.config.driveAutoSync === undefined) state.config.driveAutoSync = false;
      if (!state.config.driveSyncInterval) state.config.driveSyncInterval = DRIVE_AUTO_INTERVAL;
      return state.config.driveAutoSync !== false && ready();
    } catch(e){ return false; }
  }

  function cleanForCloud(){
    repairSavedText();
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
      repairSavedText();
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
    repairLoginText();
    clearInterval(timer);
    timer = null;
    if(!enabled()) return;
    timer = setInterval(pullNow, state.config.driveSyncInterval || DRIVE_AUTO_INTERVAL);
    setTimeout(pullNow, 2500);
  }

  function install(){
    if(window.__driveAutoInstalled) return;
    window.__driveAutoInstalled = true;

    repairLoginText();

    if(typeof initLogin === 'function'){
      var originalInitLogin = initLogin;
      initLogin = function(){
        repairSavedText();
        originalInitLogin.apply(this, arguments);
        repairLoginText();
      };
    }

    var originalSave = saveState;
    saveState = function(){
      repairSavedText();
      originalSave.apply(this, arguments);
      schedulePush();
    };

    var originalStart = startApp;
    startApp = function(){
      repairSavedText();
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
    setTimeout(repairLoginText, 300);
    setTimeout(repairLoginText, 1500);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
