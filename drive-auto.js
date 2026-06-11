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
    if(/[ÃƒÆ’Ãƒâ€šÃƒÂ¢]/.test(out)){
      try { out = decodeURIComponent(escape(out)); } catch(e) {}
      out = out
        .replace(/Ãƒâ€š/g, '')
        .replace(/ÃƒÆ’Ã‚Â¡/g, 'a').replace(/ÃƒÆ’Ã‚Â©/g, 'e').replace(/ÃƒÆ’Ã‚Â­/g, 'i').replace(/ÃƒÆ’Ã‚Â³/g, 'o').replace(/ÃƒÆ’Ã‚Âº/g, 'u').replace(/ÃƒÆ’Ã‚Â±/g, 'n')
        .replace(/ÃƒÆ’Ã‚Â/g, 'A').replace(/ÃƒÆ’Ã¢â‚¬Â°/g, 'E').replace(/ÃƒÆ’Ã‚Â/g, 'I').replace(/ÃƒÆ’Ã¢â‚¬Å“/g, 'O').replace(/ÃƒÆ’Ã…Â¡/g, 'U').replace(/ÃƒÆ’Ã¢â‚¬Ëœ/g, 'N')
        .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â|ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“/g, '-')
        .replace(/ÃƒÂ¢Ã‚Â­Ã‚Â|Ã¢Â­Â/g, '*');
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
      if (state.config.driveAutoSync === undefined || state.config.driveAutoSync === true) state.config.driveAutoSync = false;
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

  function isPublishedPublication(pub){
    return String((pub && pub.status) || '').trim().toLowerCase() === 'publicado';
  }

  function completePublishedTasks(){
    try{
      if(typeof state !== 'object' || !state || !Array.isArray(state.tasks) || !Array.isArray(state.publicaciones)) return false;
      var changed = false;
      state.publicaciones.filter(isPublishedPublication).forEach(function(pub){
        var task = pub.sourceTaskId ? state.tasks.find(function(t){ return t.id === pub.sourceTaskId; }) : null;
        if(!task){
          var desc = String(pub.desc || '').trim().toLowerCase();
          if(desc){
            task = state.tasks.find(function(t){
              return String(t.desc || '').trim().toLowerCase() === desc && t.status === 'publicar';
            });
          }
        }
        if(task && task.status !== 'realizada'){
          task.status = 'realizada';
          task.updated = Date.now();
          changed = true;
        }
      });
      return changed;
    }catch(e){
      console.warn('[drive-auto] complete published tasks', e);
      return false;
    }
  }

  function normalizeSearchText(value){
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function filterDifusionFuncionarios(){
    var list = document.getElementById('dfFuncList');
    if(!list) return;
    var query = normalizeSearchText(window.__dfFuncionarioSearch || '');
    var cards = Array.from(list.querySelectorAll('.li'));
    var visible = 0;
    cards.forEach(function(card){
      var match = !query || normalizeSearchText(card.textContent).indexOf(query) !== -1;
      card.style.display = match ? '' : 'none';
      if(match) visible++;
    });
    var empty = document.getElementById('dfFuncSearchEmpty');
    if(empty) empty.style.display = visible || !query ? 'none' : '';
  }

  function installDifusionFuncionarioSearch(){
    var list = document.getElementById('dfFuncList');
    if(!list || !list.parentNode) return;
    var search = document.getElementById('dfFuncSearch');
    if(!search){
      var wrap = document.createElement('div');
      wrap.id = 'dfFuncSearchWrap';
      wrap.style.cssText = 'margin:0 0 12px 0';
      wrap.innerHTML = '<input class="inp" id="dfFuncSearch" type="search" placeholder="Buscar funcionario..." autocomplete="off" style="width:100%">';
      list.parentNode.insertBefore(wrap, list);
      search = document.getElementById('dfFuncSearch');
    }
    search.value = window.__dfFuncionarioSearch || '';
    search.oninput = function(){
      window.__dfFuncionarioSearch = this.value;
      filterDifusionFuncionarios();
    };
    if(!document.getElementById('dfFuncSearchEmpty')){
      var empty = document.createElement('div');
      empty.id = 'dfFuncSearchEmpty';
      empty.className = 'emp';
      empty.style.display = 'none';
      empty.innerHTML = '<div class="emt">Sin resultados</div><div class="ems">Proba buscar por nombre, cargo o telefono.</div>';
      list.parentNode.insertBefore(empty, list.nextSibling);
    }
    setTimeout(filterDifusionFuncionarios, 0);
  }

  function manualShareCount(pub){
    var legacy = parseInt((pub && pub.compartidos_manual) || 0, 10) || 0;
    var instagram = parseInt((pub && pub.compartidos_manual_ig) || 0, 10) || 0;
    var facebook = parseInt((pub && pub.compartidos_manual_fb) || 0, 10) || 0;
    return instagram + facebook || legacy;
  }

  function setPubCompartidosManualCanal(pubId, canal, value){
    var pub = state.publicaciones.find(function(x){ return x.id === pubId; });
    if(!pub) return;
    var n = Math.max(0, parseInt(value || '0', 10) || 0);
    if(canal === 'ig') pub.compartidos_manual_ig = n;
    if(canal === 'fb') pub.compartidos_manual_fb = n;
    pub.compartidos_manual = (parseInt(pub.compartidos_manual_ig || 0, 10) || 0) + (parseInt(pub.compartidos_manual_fb || 0, 10) || 0);
    pub.updated = Date.now();
    if(typeof saveState === 'function') saveState();
    if(typeof renderDifusionWeekStats === 'function') renderDifusionWeekStats();
  }

  function renderManualShareInputs(pub){
    var ig = parseInt(pub.compartidos_manual_ig || 0, 10) || 0;
    var fb = parseInt(pub.compartidos_manual_fb || 0, 10) || 0;
    var legacy = parseInt(pub.compartidos_manual || 0, 10) || 0;
    if(!ig && !fb && legacy){
      fb = legacy;
      pub.compartidos_manual_fb = fb;
      pub.compartidos_manual = fb;
    }
    return '<div style="margin-top:8px;background:var(--bg-soft);border:1px solid var(--bd);border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;align-items:end">'
      + '<div><label style="font-size:12px;font-weight:800;color:var(--tx-s);display:block;margin-bottom:6px">Compartidos Instagram</label><input class="inp" type="number" min="0" value="'+ig+'" oninput="setPubCompartidosManualCanal(&quot;'+pub.id+'&quot;,&quot;ig&quot;,this.value)"></div>'
      + '<div><label style="font-size:12px;font-weight:800;color:var(--tx-s);display:block;margin-bottom:6px">Compartidos Facebook</label><input class="inp" type="number" min="0" value="'+fb+'" oninput="setPubCompartidosManualCanal(&quot;'+pub.id+'&quot;,&quot;fb&quot;,this.value)"></div>'
      + '<div class="ct-s">Carga manual para sumar compartidos que no esten asociados a un funcionario.</div>'
      + '</div>';
  }

  function installPublicationCollabFields(pub){
    var desc = document.getElementById('pbDesc');
    if(!desc || !desc.parentNode) return;
    var wrap = document.getElementById('pbCollabWrap');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = 'pbCollabWrap';
      wrap.className = 'fld';
      wrap.innerHTML = '<label>Colaborativo</label>'
        + '<label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--tx);cursor:pointer;margin-bottom:8px">'
        + '<input type="checkbox" id="pbCollab" style="width:16px;height:16px;accent-color:var(--ac)"> Es colaborativo</label>'
        + '<input class="inp" id="pbCollabCon" placeholder="Colaborativo con..." autocomplete="off">';
      desc.parentNode.insertAdjacentElement('afterend', wrap);
    }
    var isCollab = !!(pub && (pub.colaborativo || pub.collab || pub.colaborativoCon || pub.collabWith));
    var collabWith = (pub && (pub.colaborativoCon || pub.collabWith)) || '';
    var chk = document.getElementById('pbCollab');
    var inp = document.getElementById('pbCollabCon');
    if(chk) chk.checked = isCollab;
    if(inp) inp.value = collabWith;
  }

  function applyPublicationCollabFields(pub){
    if(!pub) return false;
    var chk = document.getElementById('pbCollab');
    var inp = document.getElementById('pbCollabCon');
    if(!chk && !inp) return false;
    var withText = inp ? inp.value.trim() : '';
    pub.colaborativo = !!((chk && chk.checked) || withText);
    pub.colaborativoCon = withText;
    pub.updated = Date.now();
    return true;
  }

  function findPublicationAfterSave(before){
    var id = before.id;
    if(id) return state.publicaciones.find(function(pub){ return pub.id === id; });
    var matches = state.publicaciones.filter(function(pub){
      return pub.desc === before.desc && pub.date === before.date && pub.time === before.time;
    });
    if(matches.length) return matches.sort(function(a,b){ return (b.created || b.updated || 0) - (a.created || a.updated || 0); })[0];
    return state.publicaciones.slice().sort(function(a,b){ return (b.created || b.updated || 0) - (a.created || a.updated || 0); })[0];
  }

  function calcFuncionariosInforme(){
    var pubs = typeof getDifusionPublicaciones === 'function' ? getDifusionPublicaciones() : [];
    var rows = (state.funcionarios || []).map(function(func){
      return {
        id: func.id,
        name: func.name || '(sin nombre)',
        role: func.role || 'Funcionario',
        phone: func.phone || '',
        compartio: 0,
        comento: 0,
        reacciono: 0,
        estado_wa: 0,
        no_corresponde: 0,
        total: 0
      };
    });
    var byId = {};
    rows.forEach(function(row){ byId[row.id] = row; });
    pubs.forEach(function(pub){
      var map = pub.funcionariosDifusion || {};
      Object.keys(map).forEach(function(funcId){
        var row = byId[funcId];
        if(!row) return;
        var rec = map[funcId] || {};
        ['compartio','comento','reacciono','estado_wa','no_corresponde'].forEach(function(key){
          if(rec[key]) row[key]++;
        });
      });
    });
    rows.forEach(function(row){
      row.total = row.compartio + row.comento + row.reacciono + row.estado_wa;
    });
    rows.sort(function(a,b){ return b.total - a.total || b.comento - a.comento || b.reacciono - a.reacciono || a.name.localeCompare(b.name); });
    return {pubs: pubs, rows: rows, generatedAt: new Date()};
  }

  function csvCell(value){
    return '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
  }

  function descargarInformeFuncionarios(){
    var data = calcFuncionariosInforme();
    var lines = [['Funcionario','Compartio redes','Comento','Reacciono','Estado WA','No corresponde','Total acciones'].map(csvCell).join(',')];
    data.rows.forEach(function(row){
      lines.push([row.name,row.compartio,row.comento,row.reacciono,row.estado_wa,row.no_corresponde,row.total].map(csvCell).join(','));
    });
    var blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'informe-funcionarios-difusion.csv';
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 500);
  }

  function descargarInformeFuncionariosDoc(){
    var data = calcFuncionariosInforme();
    var totals = data.rows.reduce(function(acc,row){
      acc.compartio += row.compartio;
      acc.comento += row.comento;
      acc.reacciono += row.reacciono;
      acc.estado_wa += row.estado_wa;
      acc.no_corresponde += row.no_corresponde;
      acc.total += row.total;
      return acc;
    }, {compartio:0,comento:0,reacciono:0,estado_wa:0,no_corresponde:0,total:0});
    var rows = data.rows.map(function(row){
      return '<tr><td>'+esc(row.name)+'</td><td>'+row.compartio+'</td><td>'+row.comento+'</td><td>'+row.reacciono+'</td><td>'+row.estado_wa+'</td><td>'+row.no_corresponde+'</td><td>'+row.total+'</td></tr>';
    }).join('');
    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Informe de funcionarios</title>'
      + '<style>body{font-family:Arial,sans-serif;color:#111}h1{font-size:22px;margin-bottom:4px}.meta{color:#555;margin-bottom:18px}.summary{margin:12px 0 18px}.summary span{display:inline-block;margin:0 10px 6px 0;font-weight:bold}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:7px;text-align:left;font-size:12px}th{background:#eee;text-transform:uppercase;font-size:11px}</style>'
      + '</head><body><h1>Informe de funcionarios</h1><div class="meta">Generado: '+data.generatedAt.toLocaleString('es-AR')+' · '+data.pubs.length+' publicaciones consideradas</div>'
      + '<div class="summary"><span>'+totals.compartio+' compartidos</span><span>'+totals.comento+' comentarios</span><span>'+totals.reacciono+' reacciones</span><span>'+totals.estado_wa+' estados WA</span><span>'+totals.no_corresponde+' no corresponde</span></div>'
      + '<table><thead><tr><th>Funcionario</th><th>Compartio</th><th>Comento</th><th>Reacciono</th><th>Estado WA</th><th>No corresponde</th><th>Total</th></tr></thead><tbody>'+rows+'</tbody></table></body></html>';
    var blob = new Blob([html], {type:'application/msword;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'informe-funcionarios-difusion.doc';
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 500);
  }

  function abrirInformeFuncionarios(){
    var data = calcFuncionariosInforme();
    var modal = document.getElementById('dfFuncReportMod');
    if(!modal){
      modal = document.createElement('div');
      modal.className = 'mov';
      modal.id = 'dfFuncReportMod';
      modal.innerHTML = '<div class="mod mod-l"><div class="mh"><div><div class="mt">Informe de funcionarios</div><div class="ct-s" id="dfFuncReportMeta"></div></div><button class="mx" onclick="closeModal(&quot;dfFuncReportMod&quot;)">x</button></div><div class="mb" id="dfFuncReportBody"></div><div class="mf"><button class="btn" onclick="descargarInformeFuncionarios()">Descargar CSV</button><button class="btn" onclick="descargarInformeFuncionariosDoc()">Descargar documento</button><button class="btn btn-p" onclick="window.print()">Imprimir</button><button class="btn" onclick="closeModal(&quot;dfFuncReportMod&quot;)">Cerrar</button></div></div>';
      document.body.appendChild(modal);
    }
    var meta = document.getElementById('dfFuncReportMeta');
    var body = document.getElementById('dfFuncReportBody');
    if(meta) meta.textContent = 'Generado: ' + data.generatedAt.toLocaleString('es-AR') + ' · ' + data.pubs.length + ' publicaciones consideradas';
    var totals = data.rows.reduce(function(acc,row){
      acc.compartio += row.compartio;
      acc.comento += row.comento;
      acc.reacciono += row.reacciono;
      acc.estado_wa += row.estado_wa;
      acc.no_corresponde += row.no_corresponde;
      acc.total += row.total;
      return acc;
    }, {compartio:0,comento:0,reacciono:0,estado_wa:0,no_corresponde:0,total:0});
    var summary = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:12px">'
      + '<span class="tag tag-g" style="justify-content:center;padding:8px">'+totals.compartio+' compartidos</span>'
      + '<span class="tag tag-b" style="justify-content:center;padding:8px">'+totals.comento+' comentarios</span>'
      + '<span class="tag tag-p" style="justify-content:center;padding:8px">'+totals.reacciono+' reacciones</span>'
      + '<span class="tag tag-x" style="justify-content:center;padding:8px">'+totals.estado_wa+' estados WA</span>'
      + '<span class="tag tag-r" style="justify-content:center;padding:8px">'+totals.no_corresponde+' no corresponde</span>'
      + '</div>';
    var table = '<div style="overflow:auto;border:1px solid var(--bd);border-radius:10px"><table style="width:100%;border-collapse:collapse;min-width:640px"><thead><tr>'
      + ['Funcionario','Compartio','Comento','Reacciono','Estado WA','No corresponde','Total'].map(function(h){ return '<th style="text-align:left;padding:10px;border-bottom:1px solid var(--bd);font-size:11px;text-transform:uppercase;color:var(--tx-m)">'+h+'</th>'; }).join('')
      + '</tr></thead><tbody>'
      + data.rows.map(function(row){
        return '<tr><td style="padding:10px;border-bottom:1px solid var(--bd-s);font-weight:800">'+esc(row.name)+'</td>'
          + '<td style="padding:10px;border-bottom:1px solid var(--bd-s)">'+row.compartio+'</td>'
          + '<td style="padding:10px;border-bottom:1px solid var(--bd-s)">'+row.comento+'</td>'
          + '<td style="padding:10px;border-bottom:1px solid var(--bd-s)">'+row.reacciono+'</td>'
          + '<td style="padding:10px;border-bottom:1px solid var(--bd-s)">'+row.estado_wa+'</td>'
          + '<td style="padding:10px;border-bottom:1px solid var(--bd-s)">'+row.no_corresponde+'</td>'
          + '<td style="padding:10px;border-bottom:1px solid var(--bd-s);font-weight:800">'+row.total+'</td></tr>';
      }).join('')
      + '</tbody></table></div>';
    if(body) body.innerHTML = summary + table;
    if(typeof openModal === 'function') openModal('dfFuncReportMod');
    else modal.classList.add('on');
  }

  function installFuncionariosInformeButton(){
    var box = document.getElementById('dfWeekStats');
    if(!box || document.getElementById('dfFuncReportBtn')) return;
    var header = box.querySelector('.ch');
    if(!header) return;
    var btn = document.createElement('button');
    btn.id = 'dfFuncReportBtn';
    btn.className = 'btn btn-p btn-s';
    btn.textContent = 'Informe funcionarios';
    btn.onclick = abrirInformeFuncionarios;
    header.appendChild(btn);
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

    if(typeof prepPub === 'function'){
      var originalPrepPub = prepPub;
      prepPub = function(pub){
        var result = originalPrepPub.apply(this, arguments);
        installPublicationCollabFields(pub || {});
        return result;
      };
    }

    if(typeof savePub === 'function'){
      var originalSavePub = savePub;
      savePub = function(){
        var before = {
          id: (document.getElementById('pbId') && document.getElementById('pbId').value) || '',
          desc: (document.getElementById('pbDesc') && document.getElementById('pbDesc').value.trim()) || '',
          date: (document.getElementById('pbDate') && document.getElementById('pbDate').value) || '',
          time: (document.getElementById('pbTime') && document.getElementById('pbTime').value) || ''
        };
        originalSavePub.apply(this, arguments);
        var savedPub = findPublicationAfterSave(before);
        if(applyPublicationCollabFields(savedPub)){
          if(typeof saveState === 'function') saveState();
        }
        if(completePublishedTasks()){
          if(typeof saveState === 'function') saveState();
          if(typeof renderAll === 'function') renderAll();
        }
      };
    }

    if(typeof renderTab === 'function'){
      var originalRenderTab = renderTab;
      renderTab = function(){
        if(completePublishedTasks() && typeof saveState === 'function') saveState();
        return originalRenderTab.apply(this, arguments);
      };
    }

    if(typeof renderMat === 'function'){
      var originalRenderMat = renderMat;
      renderMat = function(){
        if(completePublishedTasks() && typeof saveState === 'function') saveState();
        return originalRenderMat.apply(this, arguments);
      };
    }

    if(typeof renderDifusionModal === 'function'){
      var originalRenderDifusionModal = renderDifusionModal;
      renderDifusionModal = function(){
        var result = originalRenderDifusionModal.apply(this, arguments);
        installDifusionFuncionarioSearch();
        return result;
      };
    }

    window.setPubCompartidosManualCanal = setPubCompartidosManualCanal;

    if(typeof renderPubDifusionStats === 'function'){
      renderPubDifusionStats = function(pub){
        var box = document.getElementById('dfPubStats');
        if(!box) return;
        var totals = typeof calcPubDifusionStats === 'function' ? calcPubDifusionStats(pub) : {compartio:0,comento:0,reacciono:0,estado_wa:0,no_corresponde:0};
        var labels = {compartio:'compartieron',comento:'comentaron',reacciono:'reaccionaron',estado_wa:'estados WA',no_corresponde:'no corresponde'};
        var tags = [['compartio','tag-g'],['comento','tag-b'],['reacciono','tag-p'],['estado_wa','tag-x'],['no_corresponde','tag-r']].map(function(pair){
          var key = pair[0], cls = pair[1];
          var on = window._dfStatOpen === key;
          return '<button class="tag '+cls+'" style="justify-content:center;padding:8px;border:1px solid '+(on?'var(--tx)':'transparent')+';cursor:pointer" onclick="toggleDifusionStat(&quot;'+key+'&quot;)">'+(totals[key] || 0)+' '+labels[key]+'</button>';
        }).join('');
        var detail = '';
        if(window._dfStatOpen && typeof difusionActionNames === 'function'){
          var names = difusionActionNames(pub, window._dfStatOpen);
          var title = labels[window._dfStatOpen] || 'seleccionados';
          detail = '<div style="margin-top:8px;background:var(--bg-soft);border:1px solid var(--bd);border-radius:10px;padding:10px"><div class="ct-s" style="font-weight:800;margin-bottom:6px">'+esc(title.charAt(0).toUpperCase()+title.slice(1))+'</div>'+(names.length?'<div class="li-s">'+names.map(function(n){ return '<span class="tag tag-x">'+esc(n)+'</span>'; }).join('')+'</div>':'<div class="ct-s">Todavia no hay funcionarios en esta categoria.</div>')+'</div>';
        }
        box.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">'+tags+'</div>'+renderManualShareInputs(pub)+detail;
      };
    }

    if(typeof calcDifusionWeekStats === 'function'){
      var originalCalcDifusionWeekStats = calcDifusionWeekStats;
      calcDifusionWeekStats = function(){
        var stats = originalCalcDifusionWeekStats.apply(this, arguments);
        if(stats && stats.totals && Array.isArray(stats.pubs)){
          stats.totals.manual = stats.pubs.reduce(function(total, pub){ return total + manualShareCount(pub); }, 0);
        }
        return stats;
      };
    }

    window.descargarInformeFuncionarios = descargarInformeFuncionarios;
    window.descargarInformeFuncionariosDoc = descargarInformeFuncionariosDoc;
    window.abrirInformeFuncionarios = abrirInformeFuncionarios;

    if(typeof renderDifusionWeekStats === 'function'){
      var originalRenderDifusionWeekStats = renderDifusionWeekStats;
      renderDifusionWeekStats = function(){
        var result = originalRenderDifusionWeekStats.apply(this, arguments);
        installFuncionariosInformeButton();
        return result;
      };
    }

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
