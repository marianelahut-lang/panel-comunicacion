/* ============================================================
   MEJORAS1.JS - Panel Comunicación Tres Arroyos
   v2.3 · Rediseño panel agente + ocultar WhatsApp/Tareas día
   ------------------------------------------------------------
   1. Captura errores globales sin romper la UI.
   2. Garantiza placeholders sbt/sbm/sbag (fix textContent null).
   3. Limpia "Tareas del d..." y deduplica botones del sidebar.
   4. Menú lateral con botones de la nav superior + Reclamos.
      Renombra Publicaciones → Agenda. Oculta Métricas.
   5. MÓDULO RECLAMOS con 4 pestañas:
      · 📋 Lista · ➕ Nuevo · 👥 Funcionarios · 📊 Historial
   6. PANEL AGENTE rediseñado:
      · Iconos y emojis visibles (Hoy/Pendientes/Esta semana/Todas)
      · Filtros con estilo de pills modernas (hover, activo violeta)
      · Barra de progreso con gradiente rojo→naranja→verde
      · Tareas con hover lift effect y animación de entrada
      · Checkboxes más grandes con color de marca
      · Botón "+ Agregar" con gradiente violeta
      · Botones "WhatsApp" y "Tareas del día" del header ocultos
        de forma agresiva (CSS + JS por texto, onclick y posición)
      · Selector de estado en cada tarea (Pendiente/En proceso/
        Lista/Lista para publicar) con guardado en Supabase
   7. Selector rápido de estado en el Kanban + oculta "Realizada".
   8. Estilos + dark mode + responsive PC y celular.
   ============================================================ */
(function(){
  "use strict";

  /* -------- 1. CAPTURA ERRORES GLOBALES -------- */
  window.addEventListener("error", function(e){
    // Loguea pero no deja que el error tire la UI
    try { console.warn("[mejoras1] Error capturado:", e.message); } catch(_) {}
  });
  window.addEventListener("unhandledrejection", function(e){
    try { console.warn("[mejoras1] Promesa rechazada:", e.reason); } catch(_) {}
  });

  /* -------- 2. LIMPIA TEXTO FANTASMA "Tareas del d" -------- */
  function limpiarSidebar(){
    var sb = document.querySelector("aside.sb");
    if(!sb) return;
    var walker = document.createTreeWalker(sb, NodeFilter.SHOW_TEXT, null, false);
    var node, toRemove = [];
    while((node = walker.nextNode())){
      var v = (node.nodeValue || "").trim();
      if(v && v.indexOf("Tareas del d") === 0){
        toRemove.push(node);
      }
    }
    toRemove.forEach(function(n){ try { n.parentNode.removeChild(n); } catch(_){} });
  }

  /* -------- 3. CREA CONTENEDORES FALTANTES + MÓDULO RECLAMOS V2 -------- */

  // ============ DATOS DEL XLSX (guía de derivación) ============
  var RECLAMOS_DATA = [
    { reclamo:"Agua",                         funcionario:"Carolina turismo",       telefono:"5492983449098", icono:"💧" },
    { reclamo:"Asfalto",                      funcionario:"Eliana Rossi",           telefono:"5492983505668", icono:"🛣️" },
    { reclamo:"Caño Roto",                    funcionario:"Emiliano Capandegui",    telefono:"5492983602937", icono:"🔧" },
    { reclamo:"Pérdida de Agua",              funcionario:"Bernardina Varese",      telefono:"5492983584387", icono:"💦" },
    { reclamo:"Calles de tierra",             funcionario:"Damián Almeira",         telefono:"5492983650085", icono:"🛤️" },
    { reclamo:"Basura en la calle",           funcionario:"Facundo Liebana",        telefono:"5492983382366", icono:"🗑️" },
    { reclamo:"Terreno en malas condiciones", funcionario:"Gabriel Francia",        telefono:"5492983385858", icono:"🌳" },
    { reclamo:"Inundados",                    funcionario:"Juan Apolonio",          telefono:"5492983409217", icono:"🌊" },
    { reclamo:"Pastos crecidos",              funcionario:"Juan Serna corporativo", telefono:"5491154842469", icono:"🌿" },
    { reclamo:"Otros",                        funcionario:"Julián Tornini",         telefono:"5492983305218", icono:"📋" }
  ];

  var FUNCIONARIOS_EXTRA = [
    { nombre:"Kevin Monrroy",       telefono:"5492983406170" },
    { nombre:"Martín Garate",       telefono:"5492983413996" },
    { nombre:"Mauro Daddario",      telefono:"5492983446264" },
    { nombre:"Mercedes Moreno",     telefono:"5492983447789" },
    { nombre:"Ignacio Quintas",     telefono:"5492983615881" },
    { nombre:"Nicolás Franganillo", telefono:"5492983412126" },
    { nombre:"Pity Federico",       telefono:"5492983570209" },
    { nombre:"Tomás Paniga",        telefono:"5492983447249" },
    { nombre:"Valeria Guido",       telefono:"5491166920622" }
  ];

  var ICONO_RECLAMO = {
    "agua":"💧","asfalto":"🛣️","caño roto":"🔧","cano roto":"🔧",
    "pérdida de agua":"💦","perdida de agua":"💦",
    "calles de tierra":"🛤️","basura en la calle":"🗑️",
    "terreno en malas condiciones":"🌳","inundados":"🌊",
    "pastos crecidos":"🌿","otros":"📋"
  };

  // Estados del seguimiento del reclamo
  var ESTADOS_RECLAMO = [
    { id:"pendiente",  label:"Pendiente",  color:"#f59e0b", bg:"#fef3c7", emoji:"🟡" },
    { id:"en-proceso", label:"En proceso", color:"#3b82f6", bg:"#dbeafe", emoji:"🔵" },
    { id:"resuelto",   label:"Resuelto",   color:"#10b981", bg:"#d1fae5", emoji:"✅" }
  ];

  var RECLAMOS_STORAGE_KEY = "panel-comunicacion-reclamos-v1";

  // ============ HELPERS ============
  function escapeHTML(s){
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  function normalizarTelefono(t){
    if(t == null) return "";
    return String(t).replace(/[^\d]/g, "");
  }

  function formatearTel(tel){
    var t = normalizarTelefono(tel);
    if(t.length < 10) return tel;
    var m = t.match(/^54(9?)(\d{2,4})(\d+)$/);
    if(!m) return "+" + t;
    return "+54 " + (m[1] ? "9 " : "") + m[2] + " " + m[3];
  }

  function formatearFecha(iso){
    try {
      var d = new Date(iso);
      return d.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit", year:"numeric" }) +
        " " + d.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit" });
    } catch(_){ return ""; }
  }

  // ============ PERSISTENCIA ============
  function cargarReclamosVecinos(){
    try {
      var raw = localStorage.getItem(RECLAMOS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(_){ return []; }
  }

  function guardarReclamosVecinos(lista){
    try {
      localStorage.setItem(RECLAMOS_STORAGE_KEY, JSON.stringify(lista));
      return true;
    } catch(e){ console.error("[mejoras1] Error guardando reclamos:", e); return false; }
  }

  // ============ RENDER PRINCIPAL DEL MÓDULO ============
  function renderReclamosModulo(){
    var cont = document.getElementById("p-reclamos");
    if(!cont) return;
    var lista = cargarReclamosVecinos();
    cont.innerHTML =
      '<div class="ptop">' +
        '<div>' +
          '<div class="ptitle">Reclamos vecinales</div>' +
          '<div class="psub" id="rec-psub">' + lista.length + ' reclamo' + (lista.length === 1 ? '' : 's') + ' cargado' + (lista.length === 1 ? '' : 's') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="rec-tabs">' +
        '<button class="rec-tab" data-tab="lista" onclick="window._recTab(\'lista\')">📋 Lista</button>' +
        '<button class="rec-tab" data-tab="nuevo" onclick="window._recTab(\'nuevo\')">➕ Nuevo reclamo</button>' +
        '<button class="rec-tab" data-tab="funcionarios" onclick="window._recTab(\'funcionarios\')">👥 Funcionarios</button>' +
        '<button class="rec-tab" data-tab="historial" onclick="window._recTab(\'historial\')">📊 Historial</button>' +
      '</div>' +
      '<div id="rec-content"></div>';
    // Tab por defecto: si hay reclamos, mostrar lista. Si no, formulario.
    window._recTab(lista.length > 0 ? "lista" : "nuevo");
  }

  window._recTab = function(tab){
    document.querySelectorAll(".rec-tab").forEach(function(t){
      t.classList.toggle("on", t.getAttribute("data-tab") === tab);
    });
    var cont = document.getElementById("rec-content");
    if(!cont) return;
    if(tab === "nuevo")             cont.innerHTML = renderFormNuevo();
    else if(tab === "lista")        cont.innerHTML = renderListaReclamos();
    else if(tab === "funcionarios") cont.innerHTML = renderAgendaFuncionarios();
    else if(tab === "historial")    cont.innerHTML = renderHistorialReclamos();
  };

  // ============ FORMULARIO NUEVO RECLAMO ============
  function renderFormNuevo(reclamoEditar){
    var editing = !!reclamoEditar;
    var tiposOpts = '<option value="">— Elegir tipo —</option>' +
      RECLAMOS_DATA.map(function(r){
        var sel = editing && reclamoEditar.tipo === r.reclamo ? " selected" : "";
        return '<option value="' + escapeHTML(r.reclamo) + '"' + sel + '>' +
          r.icono + ' ' + escapeHTML(r.reclamo) + '</option>';
      }).join("");

    // Lista de funcionarios desde la AGENDA (CRUD, editable por la usuaria)
    var funcsAgenda = cargarFuncionariosAgenda();
    var funcOpts = '<option value="">— Elegir funcionario —</option>' +
      funcsAgenda.map(function(f){
        var val = f.nombre + "|" + f.telefono;
        var sel = editing && reclamoEditar.funcionario === f.nombre ? " selected" : "";
        var label = f.nombre + (f.area ? " — " + f.area : "");
        return '<option value="' + escapeHTML(val) + '"' + sel + '>' +
          escapeHTML(label) + '</option>';
      }).join("");

    var v = reclamoEditar || {};
    return '' +
    '<form class="rec-form" onsubmit="return window._recGuardar(event,' + (editing ? "'" + v.id + "'" : "null") + ')">' +
      '<div class="rec-form-row">' +
        '<label>Tipo de reclamo *</label>' +
        '<select id="r-tipo" required onchange="window._recAutoFunc()">' + tiposOpts + '</select>' +
      '</div>' +
      '<div class="rec-form-row">' +
        '<label>Funcionario asignado *</label>' +
        '<select id="r-func" required>' + funcOpts + '</select>' +
        '<div class="rec-hint">Se auto-completa al elegir el tipo. Podés cambiarlo.</div>' +
      '</div>' +
      '<div class="rec-form-row2">' +
        '<div>' +
          '<label>Vecino (nombre) *</label>' +
          '<input id="r-vecino" required value="' + escapeHTML(v.vecino || "") + '" placeholder="Ej: Juan Pérez">' +
        '</div>' +
        '<div>' +
          '<label>Teléfono del vecino</label>' +
          '<input id="r-vtel" type="tel" value="' + escapeHTML(v.vecino_tel || "") + '" placeholder="Ej: 2983 449098">' +
        '</div>' +
      '</div>' +
      '<div class="rec-form-row">' +
        '<label>Dirección</label>' +
        '<input id="r-dir" value="' + escapeHTML(v.direccion || "") + '" placeholder="Ej: Av. San Martín 1234">' +
      '</div>' +
      '<div class="rec-form-row">' +
        '<label>Descripción del reclamo *</label>' +
        '<textarea id="r-desc" rows="4" required placeholder="Detalle lo que el vecino reportó...">' + escapeHTML(v.descripcion || "") + '</textarea>' +
      '</div>' +
      '<div class="rec-form-actions">' +
        '<button type="button" class="rec-btn rec-btn-sec" onclick="window._recTab(\'lista\')">Cancelar</button>' +
        '<button type="submit" class="rec-btn rec-btn-pri" data-action="guardar">' +
          (editing ? '💾 Guardar cambios' : '💾 Guardar reclamo') +
        '</button>' +
        (editing ? '' :
          '<button type="button" class="rec-btn rec-btn-wa" onclick="window._recGuardarYEnviar()">' +
            '💾 + 💬 Guardar y avisar por WhatsApp</button>') +
      '</div>' +
    '</form>';
  }

  window._recAutoFunc = function(){
    var tipoEl = document.getElementById("r-tipo");
    var selFunc = document.getElementById("r-func");
    if(!tipoEl || !selFunc) return;
    var tipo = tipoEl.value;
    var match = RECLAMOS_DATA.find(function(r){ return r.reclamo === tipo; });
    if(!match) return;
    // Buscar el funcionario sugerido en las opciones (agenda)
    for(var i = 0; i < selFunc.options.length; i++){
      var opt = selFunc.options[i];
      var nombre = (opt.value || "").split("|")[0];
      if(nombre === match.funcionario){
        selFunc.selectedIndex = i;
        return;
      }
    }
  };

  window._recGuardar = function(ev, idEdit){
    if(ev) ev.preventDefault();
    return _recGuardarCore(false, idEdit);
  };

  window._recGuardarYEnviar = function(){
    _recGuardarCore(true, null);
  };

  function _recGuardarCore(enviarWA, idEdit){
    var tipo = (document.getElementById("r-tipo") || {}).value;
    var funcRaw = (document.getElementById("r-func") || {}).value;
    var vecino = ((document.getElementById("r-vecino") || {}).value || "").trim();
    var vtel = ((document.getElementById("r-vtel") || {}).value || "").trim();
    var dir = ((document.getElementById("r-dir") || {}).value || "").trim();
    var desc = ((document.getElementById("r-desc") || {}).value || "").trim();

    if(!tipo || !funcRaw || !vecino || !desc){
      toast("Completá los campos obligatorios (*)", true);
      return false;
    }
    var parts = funcRaw.split("|");
    var lista = cargarReclamosVecinos();

    if(idEdit){
      // Editar existente
      var r = lista.find(function(x){ return x.id === idEdit; });
      if(r){
        r.tipo = tipo;
        r.funcionario = parts[0];
        r.funcionario_tel = parts[1];
        r.vecino = vecino;
        r.vecino_tel = vtel;
        r.direccion = dir;
        r.descripcion = desc;
        r.fecha_modificacion = new Date().toISOString();
      }
    } else {
      // Crear nuevo
      var ahora = new Date().toISOString();
      var reclamo = {
        id: "r" + Date.now() + Math.floor(Math.random()*1000),
        tipo: tipo,
        funcionario: parts[0],
        funcionario_tel: parts[1],
        vecino: vecino,
        vecino_tel: vtel,
        direccion: dir,
        descripcion: desc,
        estado: "pendiente",
        fecha_creacion: ahora,
        historial: [{ estado:"pendiente", fecha: ahora }]
      };
      lista.unshift(reclamo);
      if(enviarWA) setTimeout(function(){ enviarReclamoWA(reclamo); }, 200);
    }

    if(guardarReclamosVecinos(lista)){
      toast(idEdit ? "✓ Reclamo actualizado" : "✓ Reclamo guardado");
      setTimeout(function(){ window._recTab("lista"); }, 400);
    } else {
      toast("✗ No se pudo guardar", true);
    }
    return false;
  }

  function enviarReclamoWA(reclamo){
    var icon = ICONO_RECLAMO[(reclamo.tipo || "").toLowerCase().trim()] || "📌";
    var msg = "*🚨 NUEVO RECLAMO VECINAL*\n\n" +
      icon + " *Tipo:* " + reclamo.tipo + "\n" +
      "👤 *Vecino:* " + reclamo.vecino + "\n" +
      (reclamo.vecino_tel ? "📞 *Tel del vecino:* " + reclamo.vecino_tel + "\n" : "") +
      (reclamo.direccion ? "📍 *Dirección:* " + reclamo.direccion + "\n" : "") +
      "\n📝 *Descripción:*\n" + reclamo.descripcion +
      "\n\n_Enviado desde Comunicación · Muni Tres Arroyos_";
    var url = "https://wa.me/" + reclamo.funcionario_tel + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  }

  // ============ LISTA DE RECLAMOS ============
  function renderListaReclamos(){
    var lista = cargarReclamosVecinos();
    if(!lista.length){
      return '<div class="rec-empty">' +
        '<div style="font-size:48px;margin-bottom:12px">📭</div>' +
        '<div class="rec-empty-title">No hay reclamos cargados</div>' +
        '<div class="rec-empty-sub">Empezá cargando el primer reclamo de un vecino.</div>' +
        '<button class="rec-btn rec-btn-pri" onclick="window._recTab(\'nuevo\')" style="margin-top:14px">' +
          '➕ Cargar primer reclamo</button>' +
      '</div>';
    }

    var estadosOpts = '<option value="">Todos los estados</option>' +
      ESTADOS_RECLAMO.map(function(e){
        return '<option value="' + e.id + '">' + e.emoji + ' ' + e.label + '</option>';
      }).join("");

    var filtros =
      '<div class="rec-filtros">' +
        '<input id="rec-search" class="rec-search" placeholder="🔍 Buscar por vecino, tipo, funcionario..." oninput="window._recFiltrar()">' +
        '<select id="rec-filtro-estado" onchange="window._recFiltrar()">' + estadosOpts + '</select>' +
      '</div>';

    var items = lista.map(function(r){ return renderReclamoCard(r); }).join("");
    return filtros + '<div id="rec-lista">' + items + '</div>';
  }

  function renderReclamoCard(r){
    var estadoInfo = ESTADOS_RECLAMO.find(function(e){ return e.id === r.estado; }) || ESTADOS_RECLAMO[0];
    var icon = ICONO_RECLAMO[(r.tipo || "").toLowerCase().trim()] || "📌";
    var fechaC = formatearFecha(r.fecha_creacion);
    var estadoOpts = ESTADOS_RECLAMO.map(function(e){
      return '<option value="' + e.id + '"' + (e.id === r.estado ? " selected" : "") + '>' +
        e.emoji + ' ' + e.label + '</option>';
    }).join("");

    var searchKey = ((r.vecino || "") + " " + (r.tipo || "") + " " + (r.funcionario || "") + " " + (r.direccion || "")).toLowerCase();

    return '<div class="rec-item" data-id="' + r.id + '" data-estado="' + r.estado + '" data-search="' + escapeHTML(searchKey) + '">' +
      '<div class="rec-item-head">' +
        '<div class="rec-item-tipo"><span class="rec-item-tipo-ico">' + icon + '</span>' + escapeHTML(r.tipo) + '</div>' +
        '<select class="rec-item-estado" ' +
          'style="border-color:' + estadoInfo.color + ';color:' + estadoInfo.color + ';background:' + estadoInfo.bg + '" ' +
          'onchange="window._recCambiarEstado(\'' + r.id + '\', this.value)">' + estadoOpts + '</select>' +
      '</div>' +
      '<div class="rec-item-body">' +
        '<div class="rec-item-row"><strong>👤 Vecino:</strong> ' + escapeHTML(r.vecino) +
          (r.vecino_tel ? ' · <a href="https://wa.me/' + normalizarTelefono(r.vecino_tel.length < 11 ? "549" + normalizarTelefono(r.vecino_tel) : r.vecino_tel) + '" target="_blank" rel="noopener" style="color:#16a34a">📱 ' + escapeHTML(r.vecino_tel) + '</a>' : "") +
        '</div>' +
        (r.direccion ? '<div class="rec-item-row"><strong>📍 Dirección:</strong> ' + escapeHTML(r.direccion) + '</div>' : "") +
        '<div class="rec-item-row"><strong>👨‍💼 Funcionario:</strong> ' + escapeHTML(r.funcionario) + '</div>' +
        '<div class="rec-item-desc">' + escapeHTML(r.descripcion) + '</div>' +
        '<div class="rec-item-meta">📅 Creado: ' + fechaC +
          (r.fecha_modificacion ? ' · Modificado: ' + formatearFecha(r.fecha_modificacion) : "") + '</div>' +
      '</div>' +
      '<div class="rec-item-actions">' +
        '<button class="rec-btn-mini rec-btn-wa-mini" onclick="window._recEnviarWA(\'' + r.id + '\')" title="Enviar al funcionario por WhatsApp">💬 WhatsApp</button>' +
        '<button class="rec-btn-mini" onclick="window._recEditar(\'' + r.id + '\')" title="Editar">✏️ Editar</button>' +
        '<button class="rec-btn-mini rec-btn-del" onclick="window._recBorrar(\'' + r.id + '\')" title="Borrar">🗑️</button>' +
      '</div>' +
    '</div>';
  }

  window._recFiltrar = function(){
    var search = ((document.getElementById("rec-search") || {}).value || "").toLowerCase().trim();
    var estado = (document.getElementById("rec-filtro-estado") || {}).value || "";
    document.querySelectorAll(".rec-item").forEach(function(it){
      var mS = !search || (it.getAttribute("data-search") || "").indexOf(search) >= 0;
      var mE = !estado || it.getAttribute("data-estado") === estado;
      it.style.display = (mS && mE) ? "" : "none";
    });
  };

  window._recCambiarEstado = function(id, nuevoEstado){
    var lista = cargarReclamosVecinos();
    var r = lista.find(function(x){ return x.id === id; });
    if(!r) return;
    r.estado = nuevoEstado;
    r.historial = r.historial || [];
    r.historial.push({ estado: nuevoEstado, fecha: new Date().toISOString() });
    if(guardarReclamosVecinos(lista)){
      toast("✓ Estado actualizado a: " + nuevoEstado);
      window._recTab("lista");
    }
  };

  window._recEnviarWA = function(id){
    var lista = cargarReclamosVecinos();
    var r = lista.find(function(x){ return x.id === id; });
    if(r) enviarReclamoWA(r);
  };

  window._recEditar = function(id){
    var lista = cargarReclamosVecinos();
    var r = lista.find(function(x){ return x.id === id; });
    if(!r) return;
    document.querySelectorAll(".rec-tab").forEach(function(t){
      t.classList.toggle("on", t.getAttribute("data-tab") === "nuevo");
    });
    var cont = document.getElementById("rec-content");
    if(cont) cont.innerHTML = renderFormNuevo(r);
  };

  window._recBorrar = function(id){
    if(!confirm("¿Borrar este reclamo? Esta acción no se puede deshacer.")) return;
    var lista = cargarReclamosVecinos();
    var nueva = lista.filter(function(x){ return x.id !== id; });
    if(guardarReclamosVecinos(nueva)){
      toast("Reclamo borrado");
      window._recTab("lista");
      // Actualizar subtítulo
      var psub = document.getElementById("rec-psub");
      if(psub) psub.textContent = nueva.length + ' reclamo' + (nueva.length === 1 ? '' : 's') + ' cargado' + (nueva.length === 1 ? '' : 's');
    }
  };

  // ============ AGENDA DE FUNCIONARIOS (CRUD) ============
  var FUNCIONARIOS_STORAGE_KEY = "panel-comunicacion-funcionarios-v1";

  function cargarFuncionariosAgenda(){
    try {
      var raw = localStorage.getItem(FUNCIONARIOS_STORAGE_KEY);
      if(raw){
        var parsed = JSON.parse(raw);
        if(Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch(_){}
    // Inicialización por defecto con los 19 contactos del xlsx
    var base = RECLAMOS_DATA.map(function(r){
      return {
        id: "f" + Math.random().toString(36).slice(2,9),
        nombre: r.funcionario,
        telefono: r.telefono,
        area: ""
      };
    }).concat(FUNCIONARIOS_EXTRA.map(function(f){
      return {
        id: "f" + Math.random().toString(36).slice(2,9),
        nombre: f.nombre,
        telefono: f.telefono,
        area: ""
      };
    }));
    guardarFuncionariosAgenda(base);
    return base;
  }

  function guardarFuncionariosAgenda(lista){
    try {
      localStorage.setItem(FUNCIONARIOS_STORAGE_KEY, JSON.stringify(lista));
      return true;
    } catch(e){ console.error("[mejoras1] Error guardando agenda:", e); return false; }
  }

  function renderAgendaFuncionarios(){
    var lista = cargarFuncionariosAgenda();
    var cards = lista.map(function(f){
      var waUrl = "https://wa.me/" + normalizarTelefono(f.telefono);
      return '<div class="rec-func-card" data-id="' + f.id + '" ' +
        'data-search="' + escapeHTML(((f.nombre || "") + " " + (f.area || "")).toLowerCase()) + '">' +
        '<div class="rec-func-card-head">' +
          '<div class="rec-func-card-name">' + escapeHTML(f.nombre) + '</div>' +
          (f.area ? '<div class="rec-func-card-area">' + escapeHTML(f.area) + '</div>' : '') +
        '</div>' +
        '<div class="rec-func-card-tel">📞 ' + escapeHTML(formatearTel(f.telefono)) + '</div>' +
        '<div class="rec-func-card-actions">' +
          '<a class="rec-btn-mini rec-btn-wa-mini" href="' + waUrl + '" target="_blank" rel="noopener">💬 WhatsApp</a>' +
          '<button class="rec-btn-mini" onclick="window._funcEditar(\'' + f.id + '\')">✏️ Editar</button>' +
          '<button class="rec-btn-mini rec-btn-del" onclick="window._funcBorrar(\'' + f.id + '\')">🗑️</button>' +
        '</div>' +
      '</div>';
    }).join("");

    return '<div class="rec-func-toolbar">' +
      '<button class="rec-btn rec-btn-pri" onclick="window._funcNuevo()">+ Agregar funcionario</button>' +
      '<input class="rec-search" id="func-search" placeholder="🔍 Buscar funcionario o área..." oninput="window._funcFiltrar()">' +
      '</div>' +
      '<div id="func-form-container"></div>' +
      '<div class="rec-func-grid" id="rec-func-grid">' + cards + '</div>';
  }

  function renderFuncionarioForm(f){
    var editing = !!f;
    f = f || {};
    return '<form class="rec-form rec-func-form" ' +
      'onsubmit="return window._funcGuardar(event, \'' + (editing ? f.id : '') + '\')">' +
      '<div class="rec-form-row2">' +
        '<div>' +
          '<label>Nombre *</label>' +
          '<input id="func-nombre" required value="' + escapeHTML(f.nombre || "") + '" placeholder="Ej: Juan Pérez">' +
        '</div>' +
        '<div>' +
          '<label>Área / Cargo</label>' +
          '<input id="func-area" value="' + escapeHTML(f.area || "") + '" placeholder="Ej: Obras Públicas">' +
        '</div>' +
      '</div>' +
      '<div class="rec-form-row">' +
        '<label>Teléfono (con código de país) *</label>' +
        '<input id="func-tel" required value="' + escapeHTML(f.telefono || "") + '" placeholder="5492983449098">' +
        '<div class="rec-hint">Formato sin espacios ni símbolos. Ej: 5492983449098</div>' +
      '</div>' +
      '<div class="rec-form-actions">' +
        '<button type="button" class="rec-btn rec-btn-sec" onclick="document.getElementById(\'func-form-container\').innerHTML=\'\'">Cancelar</button>' +
        '<button type="submit" class="rec-btn rec-btn-pri">💾 ' + (editing ? "Guardar cambios" : "Agregar") + '</button>' +
      '</div>' +
    '</form>';
  }

  window._funcNuevo = function(){
    var c = document.getElementById("func-form-container");
    if(c) c.innerHTML = renderFuncionarioForm(null);
  };

  window._funcEditar = function(id){
    var lista = cargarFuncionariosAgenda();
    var f = lista.find(function(x){ return x.id === id; });
    if(!f) return;
    var c = document.getElementById("func-form-container");
    if(c) c.innerHTML = renderFuncionarioForm(f);
  };

  window._funcGuardar = function(ev, id){
    if(ev) ev.preventDefault();
    var nombre = ((document.getElementById("func-nombre") || {}).value || "").trim();
    var area = ((document.getElementById("func-area") || {}).value || "").trim();
    var tel = normalizarTelefono((document.getElementById("func-tel") || {}).value || "");
    if(!nombre || !tel){
      toast("Nombre y teléfono son obligatorios", true);
      return false;
    }
    var lista = cargarFuncionariosAgenda();
    if(id){
      var f = lista.find(function(x){ return x.id === id; });
      if(f){ f.nombre = nombre; f.area = area; f.telefono = tel; }
    } else {
      lista.push({
        id: "f" + Date.now() + Math.floor(Math.random()*1000),
        nombre: nombre, area: area, telefono: tel
      });
    }
    if(guardarFuncionariosAgenda(lista)){
      toast(id ? "✓ Funcionario actualizado" : "✓ Funcionario agregado");
      window._recTab("funcionarios");
    }
    return false;
  };

  window._funcBorrar = function(id){
    if(!confirm("¿Borrar este funcionario de la agenda? Esta acción no se puede deshacer.")) return;
    var lista = cargarFuncionariosAgenda();
    var nueva = lista.filter(function(x){ return x.id !== id; });
    if(guardarFuncionariosAgenda(nueva)){
      toast("Funcionario eliminado");
      window._recTab("funcionarios");
    }
  };

  window._funcFiltrar = function(){
    var search = ((document.getElementById("func-search") || {}).value || "").toLowerCase().trim();
    document.querySelectorAll(".rec-func-card").forEach(function(c){
      var match = !search || (c.getAttribute("data-search") || "").indexOf(search) >= 0;
      c.style.display = match ? "" : "none";
    });
  };

  // ============ HISTORIAL DE RECLAMOS (agrupado por tipo o funcionario) ============
  function renderHistorialReclamos(){
    var lista = cargarReclamosVecinos();
    if(!lista.length){
      return '<div class="rec-empty">' +
        '<div style="font-size:48px;margin-bottom:12px">📭</div>' +
        '<div class="rec-empty-title">No hay reclamos para mostrar</div>' +
        '<div class="rec-empty-sub">Los reclamos cargados van a aparecer agrupados acá.</div>' +
        '<button class="rec-btn rec-btn-pri" onclick="window._recTab(\'nuevo\')" style="margin-top:14px">' +
          '➕ Cargar primer reclamo</button>' +
        '</div>';
    }

    var modo = window._recHistMode || "tipo";

    // Estadísticas globales
    var estadoCount = { pendiente: 0, "en-proceso": 0, resuelto: 0 };
    lista.forEach(function(r){
      if(estadoCount[r.estado] !== undefined) estadoCount[r.estado]++;
    });

    // Toolbar con toggle de modo
    var toolbar = '<div class="rec-hist-toolbar">' +
      '<div class="rec-hist-modes">' +
        '<button class="rec-hist-mode' + (modo==="tipo" ? " on" : "") + '" ' +
          'onclick="window._recHistSetMode(\'tipo\')">📂 Por tipo</button>' +
        '<button class="rec-hist-mode' + (modo==="funcionario" ? " on" : "") + '" ' +
          'onclick="window._recHistSetMode(\'funcionario\')">👤 Por funcionario</button>' +
      '</div>' +
      '<div class="rec-hist-stats">' +
        '<span class="rec-hist-stat" style="background:#fef3c7;color:#92400e">🟡 ' + estadoCount.pendiente + ' pend.</span>' +
        '<span class="rec-hist-stat" style="background:#dbeafe;color:#1e40af">🔵 ' + estadoCount["en-proceso"] + ' en proc.</span>' +
        '<span class="rec-hist-stat" style="background:#d1fae5;color:#065f46">✅ ' + estadoCount.resuelto + ' resueltos</span>' +
        '<span class="rec-hist-stat" style="background:#ede9fe;color:#5b21b6;font-weight:800">Total: ' + lista.length + '</span>' +
      '</div>' +
      '</div>';

    // Agrupar
    var grupos = {};
    lista.forEach(function(r){
      var key = modo === "tipo" ? (r.tipo || "Sin tipo") : (r.funcionario || "Sin asignar");
      if(!grupos[key]) grupos[key] = [];
      grupos[key].push(r);
    });

    // Render grupos ordenados (por cantidad descendente)
    var keys = Object.keys(grupos).sort(function(a, b){ return grupos[b].length - grupos[a].length; });

    var html = keys.map(function(key){
      var arr = grupos[key];
      var icono = modo === "tipo" ?
        (ICONO_RECLAMO[(key || "").toLowerCase().trim()] || "📌") :
        "👤";

      var itemsHTML = arr.map(function(r){
        var estadoInfo = ESTADOS_RECLAMO.find(function(e){ return e.id === r.estado; }) || ESTADOS_RECLAMO[0];
        var fechaCorta = "";
        try { fechaCorta = new Date(r.fecha_creacion).toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit", year:"2-digit" }); } catch(_){}
        var meta = modo === "tipo" ?
          escapeHTML(r.funcionario || "Sin asignar") :
          escapeHTML(r.tipo || "");
        return '<div class="rec-hist-item" onclick="window._recVerDetalle(\'' + r.id + '\')">' +
          '<span class="rec-hist-estado" title="' + estadoInfo.label + '" ' +
            'style="background:' + estadoInfo.bg + ';color:' + estadoInfo.color + '">' +
            estadoInfo.emoji + '</span>' +
          '<div class="rec-hist-info">' +
            '<div class="rec-hist-vecino">' + escapeHTML(r.vecino) + '</div>' +
            '<div class="rec-hist-meta">' + meta + ' · ' + fechaCorta + '</div>' +
          '</div>' +
          '<div class="rec-hist-actions">' +
            '<button class="rec-btn-mini" onclick="event.stopPropagation();window._recEditar(\'' + r.id + '\')" title="Editar">✏️</button>' +
            '<button class="rec-btn-mini rec-btn-wa-mini" onclick="event.stopPropagation();window._recEnviarWA(\'' + r.id + '\')" title="WhatsApp">💬</button>' +
          '</div>' +
        '</div>';
      }).join("");

      return '<div class="rec-hist-grupo">' +
        '<div class="rec-hist-grupo-head">' +
          '<span class="rec-hist-grupo-ico">' + icono + '</span>' +
          '<span class="rec-hist-grupo-name">' + escapeHTML(key) + '</span>' +
          '<span class="rec-hist-grupo-count">' + arr.length + '</span>' +
        '</div>' +
        '<div class="rec-hist-grupo-items">' + itemsHTML + '</div>' +
      '</div>';
    }).join("");

    return toolbar + '<div class="rec-hist-grupos">' + html + '</div>';
  }

  window._recHistSetMode = function(modo){
    window._recHistMode = modo;
    window._recTab("historial");
  };

  window._recVerDetalle = function(id){
    // Cambiar a tab Lista, scrollear y resaltar el reclamo
    window._recTab("lista");
    setTimeout(function(){
      var el = document.querySelector('.rec-item[data-id="' + id + '"]');
      if(el){
        try { el.scrollIntoView({ behavior:"smooth", block:"center" }); } catch(_){}
        el.style.transition = "box-shadow .3s";
        el.style.boxShadow = "0 0 0 3px #7c3aed";
        setTimeout(function(){ el.style.boxShadow = ""; }, 2000);
      }
    }, 250);
  };

  // ============ GUÍA DE DERIVACIÓN (tipo → funcionario) ============
  function renderGuiaDerivacion(){
    var cards = RECLAMOS_DATA.map(function(r){
      var msg = encodeURIComponent("Hola " + r.funcionario.split(" ")[0] +
        ", te contacto desde Comunicación de la Muni por un reclamo de \"" + r.reclamo + "\".");
      var waLink = "https://wa.me/" + r.telefono + "?text=" + msg;
      return '<div class="rec-card">' +
        '<div class="rec-ico">' + r.icono + '</div>' +
        '<div class="rec-body">' +
          '<div class="rec-tipo">' + escapeHTML(r.reclamo) + '</div>' +
          '<div class="rec-deriv">Derivar a</div>' +
          '<div class="rec-func">' + escapeHTML(r.funcionario) + '</div>' +
          '<div class="rec-tel">' + escapeHTML(formatearTel(r.telefono)) + '</div>' +
        '</div>' +
        '<a class="rec-wa" href="' + waLink + '" target="_blank" rel="noopener">💬 WA</a>' +
      '</div>';
    }).join("");
    var extras = FUNCIONARIOS_EXTRA.map(function(f){
      return '<div class="rec-extra">' +
        '<div class="rec-extra-name">' + escapeHTML(f.nombre) + '</div>' +
        '<a class="rec-extra-wa" href="https://wa.me/' + f.telefono + '" target="_blank" rel="noopener">' +
          '📱 ' + escapeHTML(formatearTel(f.telefono)) + '</a>' +
      '</div>';
    }).join("");
    return '<div class="rec-grid">' + cards + '</div>' +
      '<div class="rec-extra-title">Otros contactos disponibles</div>' +
      '<div class="rec-extra-grid">' + extras + '</div>';
  }

  // ============ CREAR CONTENEDORES FALTANTES ============
  function crearContenedoresFaltantes(){
    var main = document.getElementById("main");
    if(!main) return;

    if(!document.getElementById("p-reclamos")){
      var div = document.createElement("div");
      div.id = "p-reclamos";
      div.style.cssText = "display:none;overflow-y:auto;height:100%";
      div.innerHTML = '<div class="ptop"><div><div class="ptitle">Reclamos</div>' +
        '<div class="psub">Cargando…</div></div></div>';
      main.appendChild(div);
      renderReclamosModulo();
    }

    [
      { id:"p-recursos", titulo:"Recursos",  subtitulo:"Documentos y enlaces del equipo" },
      { id:"p-agente",   titulo:"Agente",    subtitulo:"" }
    ].forEach(function(f){
      if(document.getElementById(f.id)) return;
      var d = document.createElement("div");
      d.id = f.id;
      d.style.cssText = "display:none";
      d.innerHTML =
        '<div class="ptop"><div><div class="ptitle">' + f.titulo + '</div>' +
        '<div class="psub">' + f.subtitulo + '</div></div></div>' +
        '<div style="padding:40px 20px;text-align:center;color:#6b7280">' +
          '<div style="font-size:48px;margin-bottom:12px">🚧</div>' +
          '<div style="font-size:14px;font-weight:600;margin-bottom:6px;color:inherit">' +
            'Módulo en preparación</div>' +
          '<div style="font-size:12px;color:inherit">' +
            'Este módulo se está configurando. Pronto va a estar disponible.</div>' +
        '</div>';
      main.appendChild(d);
    });
  }

  /* -------- 4. SINCRONIZA MENÚ LATERAL CON LA NAV SUPERIOR --------
     Reemplaza el contenido del sidebar por los mismos botones que
     están en la barra superior (Hoy, Tablero, Material, Agenda,
     Calendario, Guardias, Equipo, Medios, Recursos). Elimina el
     selector "Filtrar persona" / "Todas las personas".               */
  var ICON_MAP = {
    hoy:           "☀️",
    tablero:       "📋",
    material:      "📦",
    publicaciones: "📅",
    agenda:        "📅",
    calendario:    "🗓️",
    guardias:      "⏰",
    equipo:        "👥",
    metricas:      "📊",
    medios:        "📰",
    recursos:      "📌",
    entrevistas:   "🎤",
    contactos:     "📞",
    reclamos:      "📢",
    dashboard:     "📈",
    agente:        "🧑‍💼"
  };

  function sincronizarMenuLateral(){
    var sb = document.querySelector("aside.sb");
    var ntabs = document.querySelector(".ntabs");
    if(!sb || !ntabs) return false;
    var tabs = ntabs.querySelectorAll(".ntab");
    if(!tabs.length) return false;

    // Botones de la nav superior a OCULTAR del sidebar
    // (Métricas: la usuaria pidió eliminarla)
    var OCULTOS = { "metricas": true };
    // Botones a RENOMBRAR: id → nuevo texto
    var RENOMBRAR = { "publicaciones": "Agenda" };

    // Recordar elementos internos que el código existente referencia
    var fPanel    = document.getElementById("fPanel");
    var sbpersons = document.getElementById("sbpersons");

    // Construir nuevos botones a partir de la nav superior
    var frag = document.createDocumentFragment();
    var yaIncluidos = {};
    tabs.forEach(function(tab){
      var onclick = tab.getAttribute("onclick") || "";
      var m = onclick.match(/nav\(['"]([^'"]+)['"]/);
      if(!m) return;
      var id = m[1];
      if(OCULTOS[id]) return;          // saltar los ocultos
      if(yaIncluidos[id]) return;      // deduplicar
      yaIncluidos[id] = true;

      var labelRaw = (tab.textContent || "").trim();
      var label = labelRaw.replace(
        /^[\u2600-\u27BF\uD83C-\uDBFF\uDC00-\uDFFF\uFE0F\u200D]+\s*/, ""
      );
      // Aplicar renombre si corresponde
      if(RENOMBRAR[id]) label = RENOMBRAR[id];
      var icon = ICON_MAP[id] || "•";

      var btn = document.createElement("button");
      btn.className = "sbi";
      btn.setAttribute("data-mid", id);
      btn.setAttribute("onclick", "nav('" + id + "',null,this)");
      btn.innerHTML =
        '<span style="font-size:14px;width:20px;display:inline-block;' +
        'text-align:center;flex-shrink:0">' + icon + '</span>' +
        '<span style="flex:1;text-align:left">' + label + '</span>';
      frag.appendChild(btn);
    });

    // Vaciar el sidebar y poner el nuevo contenido
    sb.innerHTML = "";
    sb.appendChild(frag);

    // Agregar "Reclamos" al final si no estaba en la nav superior
    if(!sb.querySelector('.sbi[data-mid="reclamos"]')){
      var btnRec = document.createElement("button");
      btnRec.className = "sbi";
      btnRec.setAttribute("data-mid", "reclamos");
      btnRec.setAttribute("onclick", "nav('reclamos',null,this)");
      btnRec.innerHTML =
        '<span style="font-size:14px;width:20px;display:inline-block;' +
        'text-align:center;flex-shrink:0">📢</span>' +
        '<span style="flex:1;text-align:left">Reclamos</span>';
      sb.appendChild(btnRec);
    }

    // Agregar "Contactos medios" al final si no estaba en la nav superior
    if(!sb.querySelector('.sbi[data-mid="contactos"]')){
      var btnCM = document.createElement("button");
      btnCM.className = "sbi";
      btnCM.setAttribute("data-mid", "contactos");
      btnCM.setAttribute("onclick", "nav('contactos',null,this)");
      btnCM.innerHTML =
        '<span style="font-size:14px;width:20px;display:inline-block;' +
        'text-align:center;flex-shrink:0">📞</span>' +
        '<span style="flex:1;text-align:left">Contactos medios</span>';
      sb.appendChild(btnCM);
    }

    asegurarBadgePlaceholders(sb);

    // Visualizar el badge de Calendario (sbag) dentro del botón nuevo
    var btnCal = sb.querySelector('.sbi[data-mid="calendario"]');
    var sbag = document.getElementById("sbag");
    if(btnCal && sbag){
      sbag.style.cssText = "background:#ede9fe;color:#6d28d9;font-size:9px;" +
        "font-weight:700;padding:2px 7px;border-radius:10px;margin-left:auto";
      btnCal.appendChild(sbag);
    }

    // Reinsertar elementos preservados (ocultos)
    if(fPanel){    fPanel.style.display    = "none"; sb.appendChild(fPanel); }
    if(sbpersons){ sbpersons.style.display = "none"; sb.appendChild(sbpersons); }

    // Ocultar también el botón Métricas de la NAV SUPERIOR
    document.querySelectorAll(".ntabs .ntab").forEach(function(t){
      var oc = t.getAttribute("onclick") || "";
      var mm = oc.match(/nav\(['"]([^'"]+)['"]/);
      if(mm && OCULTOS[mm[1]]) t.style.display = "none";
      // Renombrar también en la nav superior
      if(mm && RENOMBRAR[mm[1]]){
        var lblRaw = (t.textContent || "").trim();
        var lbl = lblRaw.replace(/^[\u2600-\u27BF\uD83C-\uDBFF\uDC00-\uDFFF\uFE0F\u200D]+\s*/, "");
        if(lbl !== RENOMBRAR[mm[1]]){
          t.textContent = RENOMBRAR[mm[1]];
        }
      }
    });

    actualizarBotonActivo();
    sb.__menuSincronizado = true;
    return true;
  }

  function asegurarBadgePlaceholders(sb){
    // Estos IDs son referenciados por el código original con
    // document.getElementById(id).textContent = ...
    // Si no existen, falla. Garantizamos que siempre existan.
    var ids = ["sbt", "sbm", "sbag"];
    var contenedor = sb || document.querySelector("aside.sb") || document.body;
    ids.forEach(function(id){
      if(!document.getElementById(id)){
        var span = document.createElement("span");
        span.id = id;
        span.className = "sbadge";
        span.textContent = "0";
        span.style.display = "none";
        contenedor.appendChild(span);
      }
    });
  }

  function actualizarBotonActivo(){
    var ntabs = document.querySelector(".ntabs");
    if(!ntabs) return;
    var activeId = null;
    var activeTab = ntabs.querySelector(".ntab.on");
    if(activeTab){
      var oc = activeTab.getAttribute("onclick") || "";
      var m = oc.match(/nav\(['"]([^'"]+)['"]/);
      if(m) activeId = m[1];
    }
    document.querySelectorAll("aside.sb .sbi").forEach(function(b){
      if(b.getAttribute("data-mid") === activeId) b.classList.add("on");
      else b.classList.remove("on");
    });
  }

  // Hook a `nav` para mantener sincronizado el botón activo
  function patchearNav(){
    if(typeof window.nav !== "function") return false;
    if(window.nav.__patcheadoActivo) return true;
    var orig = window.nav;
    window.nav = function(){
      var r;
      try { r = orig.apply(this, arguments); } catch(e){ console.warn(e); }
      setTimeout(actualizarBotonActivo, 20);
      return r;
    };
    window.nav.__patcheadoActivo = true;
    return true;
  }

  /* -------- 5. SELECTOR RÁPIDO DE ESTADO -------- */
  // "Realizada" se quitó porque era redundante con "Lista".
  var ESTADOS = ["Pendiente","En proceso","Lista","Lista para publicar"];
  var COLOR_ESTADO = {
    "Pendiente":           "#ef4444",
    "En proceso":          "#f59e0b",
    "Lista":               "#10b981",
    "Lista para publicar": "#6d28d9"
  };

  window.cambiarEstadoTarea = async function(id, nuevoEstado, ev){
    if(ev) ev.stopPropagation();
    try {
      if(typeof db === "undefined" || !db || !db.from){
        toast("Sin conexión a la base", true);
        return;
      }
      var res = await db.from("tareas").update({
        estado: nuevoEstado,
        updated_at: new Date().toISOString()
      }).eq("id", id);
      if(res && res.error) throw res.error;
      // Actualiza local
      if(typeof tasks !== "undefined" && Array.isArray(tasks)){
        var t = tasks.find(function(x){ return String(x.id) === String(id); });
        if(t) t.estado = nuevoEstado;
      }
      // Re-render
      if(typeof renderKanban === "function") renderKanban();
      toast("✓ Estado: " + nuevoEstado);
    } catch(err){
      console.error("[mejoras1] Error cambiando estado:", err);
      toast("✗ No se pudo guardar", true);
    }
  };

  function toast(msg, isError){
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:20px;left:50%;" +
      "transform:translateX(-50%);background:" + (isError?"#ef4444":"#10b981") +
      ";color:#fff;padding:10px 18px;border-radius:8px;font-size:12px;" +
      "font-weight:700;z-index:99999;box-shadow:0 6px 16px rgba(0,0,0,.25);" +
      "font-family:Inter,sans-serif;opacity:0;transition:opacity .25s";
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.style.opacity = "1"; });
    setTimeout(function(){ t.style.opacity = "0"; }, 1800);
    setTimeout(function(){ try{ t.remove(); }catch(_){} }, 2200);
  }

  function agregarSelectoresEnTarjetas(){
    // Busca tarjetas de tareas en el Kanban Y en el panel de detalle del agente
    var selectores = [
      ".kanban .tc",
      "#p-equipo .tc",
      "#p-guardias .tc",
      "#p-equipo [onclick*='editTask']",
      "#p-guardias [onclick*='editTask']"
    ].join(",");
    var tarjetas = document.querySelectorAll(selectores);
    tarjetas.forEach(function(tc){
      if(tc.querySelector(".estado-selector-m1")) return;
      // Si tc es un elemento interno con onclick, subir al contenedor padre razonable
      // (a veces el onclick está en el div externo y la "tarjeta visible" es ese)
      var onclick = tc.getAttribute("onclick") || "";
      var m = onclick.match(/editTask\(['"]([^'"]+)['"]\)/);
      if(!m) return;
      var id = m[1];

      // Determinar estado actual
      var estadoActual = "Pendiente";
      // 1) Si está dentro del Kanban, leer la columna
      var col = tc.closest(".kcol");
      if(col){
        var hdr = col.querySelector(".khdr .kt");
        if(hdr){
          var lbl = (hdr.textContent || "").replace(/[\d\s]+$/g,"").trim();
          if(ESTADOS.indexOf(lbl) >= 0) estadoActual = lbl;
        }
      } else {
        // 2) Panel agente: buscar pills/badges con el estado actual en la tarjeta
        var txtNodo = tc.textContent || "";
        ESTADOS.forEach(function(e){
          if(txtNodo.indexOf(e) >= 0) estadoActual = e;
        });
      }

      var color = COLOR_ESTADO[estadoActual] || "#6b7280";
      var sel = document.createElement("select");
      sel.className = "estado-selector-m1";
      sel.setAttribute("data-id", id);
      sel.style.cssText =
        "margin-top:8px;width:100%;padding:5px 8px;border-radius:6px;" +
        "border:1.5px solid " + color + ";font-size:10px;font-weight:700;" +
        "color:" + color + ";background:#fff;cursor:pointer;" +
        "font-family:Inter,sans-serif;outline:none;appearance:menulist";
      ESTADOS.forEach(function(e){
        var opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;
        if(e === estadoActual) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener("click",  function(ev){ ev.stopPropagation(); });
      sel.addEventListener("change", function(ev){
        ev.stopPropagation();
        window.cambiarEstadoTarea(id, this.value, ev);
      });
      tc.appendChild(sel);
    });
  }

  function patchearRenderKanban(){
    if(typeof window.renderKanban !== "function") return false;
    if(window.renderKanban.__patcheadoEstado) return true;
    var orig = window.renderKanban;
    window.renderKanban = function(){
      var r;
      try { r = orig.apply(this, arguments); } catch(e){ console.warn(e); }
      setTimeout(function(){
        agregarSelectoresEnTarjetas();
        ocultarColumnaRealizada();
      }, 40);
      return r;
    };
    window.renderKanban.__patcheadoEstado = true;
    return true;
  }

  // Oculta la columna "Realizada" del Kanban porque es redundante con "Lista"
  function ocultarColumnaRealizada(){
    document.querySelectorAll(".kanban .kcol").forEach(function(col){
      var hdr = col.querySelector(".khdr .kt");
      if(!hdr) return;
      var lbl = (hdr.textContent || "").replace(/[\d\s]+$/g,"").trim();
      if(lbl === "Realizada"){
        col.style.display = "none";
      }
    });
  }

  /* -------- 6. ESTILOS (colores + responsive + sidebar) -------- */
  function inyectarEstilos(){
    if(document.getElementById("mejoras1-styles")) return;
    var st = document.createElement("style");
    st.id = "mejoras1-styles";
    st.textContent = [
      /* Sidebar: layout de los botones espejados de la nav superior */
      "aside.sb{padding:10px 8px!important;display:flex!important;" +
        "flex-direction:column!important;gap:2px!important;" +
        "white-space:normal!important}",
      "aside.sb .sbi{display:flex!important;align-items:center!important;" +
        "gap:10px!important;padding:9px 12px!important;border-radius:8px!important;" +
        "border:none!important;background:transparent!important;" +
        "font-size:12px!important;font-weight:600!important;cursor:pointer!important;" +
        "color:#4b5563!important;font-family:Inter,sans-serif!important;" +
        "transition:all .15s!important;text-align:left!important;width:100%!important}",
      "aside.sb .sbi:hover{background:#f3f4f6!important;color:#111827!important}",
      "aside.sb .sbi.on{background:#ede9fe!important;color:#6d28d9!important;" +
        "box-shadow:inset 3px 0 0 #7c3aed!important}",
      /* Dark mode del sidebar */
      "body.dark aside.sb .sbi{color:#94a3b8!important}",
      "body.dark aside.sb .sbi:hover{background:#252830!important;color:#e2e8f0!important}",
      "body.dark aside.sb .sbi.on{background:#2d2d5e!important;color:#a78bfa!important;" +
        "box-shadow:inset 3px 0 0 #7c3aed!important}",
      /* Identidad visual de cada estado del Kanban */
      ".khdr.p1{border-left:5px solid #ef4444!important}",
      ".khdr.p2{border-left:5px solid #f59e0b!important}",
      ".khdr.p3{border-left:5px solid #10b981!important}",
      ".khdr.p4{border-left:5px solid #7c3aed!important}",
      ".khdr.p5{border-left:5px solid #6d28d9!important}",
      /* Selector de estado en la tarjeta */
      ".estado-selector-m1{transition:box-shadow .15s}",
      ".estado-selector-m1:hover{box-shadow:0 0 0 2px rgba(102,126,234,.15)}",
      ".estado-selector-m1:focus{box-shadow:0 0 0 2px rgba(102,126,234,.35)}",
      "body.dark .estado-selector-m1{background:#252830!important}",
      /* === Módulo Reclamos v2 === */
      "#p-reclamos{padding:0 16px 24px}",
      "#p-reclamos .ptop{padding:14px 0 12px;margin-bottom:0}",
      /* Tabs */
      ".rec-tabs{display:flex;gap:6px;padding:8px 0 14px;border-bottom:1px solid #e5e7eb;margin-bottom:16px}",
      ".rec-tab{padding:8px 14px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;" +
        "font-size:12px;font-weight:600;color:#6b7280;cursor:pointer;font-family:Inter,sans-serif;" +
        "transition:all .15s;display:inline-flex;align-items:center;gap:6px}",
      ".rec-tab:hover{background:#f9fafb;color:#111827;border-color:#d1d5db}",
      ".rec-tab.on{background:#7c3aed;color:#fff;border-color:#7c3aed;box-shadow:0 2px 6px rgba(124,58,237,.3)}",
      /* Formulario */
      ".rec-form{max-width:720px;display:flex;flex-direction:column;gap:14px}",
      ".rec-form-row{display:flex;flex-direction:column;gap:5px}",
      ".rec-form-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}",
      ".rec-form label{font-size:11px;font-weight:700;color:#374151;" +
        "text-transform:uppercase;letter-spacing:.03em}",
      ".rec-form input,.rec-form select,.rec-form textarea{padding:9px 12px;border:1.5px solid #e5e7eb;" +
        "border-radius:8px;font-size:13px;font-family:Inter,sans-serif;outline:none;" +
        "background:#fff;color:#111827;transition:border-color .15s}",
      ".rec-form input:focus,.rec-form select:focus,.rec-form textarea:focus{border-color:#7c3aed;" +
        "box-shadow:0 0 0 3px rgba(124,58,237,.1)}",
      ".rec-form textarea{resize:vertical;min-height:80px;font-family:Inter,sans-serif}",
      ".rec-hint{font-size:10px;color:#9ca3af;margin-top:2px}",
      ".rec-form-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;padding-top:8px;" +
        "border-top:1px solid #e5e7eb;margin-top:6px}",
      ".rec-btn{padding:9px 14px;border-radius:8px;border:none;font-size:12px;font-weight:700;" +
        "cursor:pointer;font-family:Inter,sans-serif;transition:all .15s;display:inline-flex;" +
        "align-items:center;gap:6px}",
      ".rec-btn-pri{background:#7c3aed;color:#fff}",
      ".rec-btn-pri:hover{background:#6d28d9;transform:translateY(-1px);box-shadow:0 4px 10px rgba(124,58,237,.3)}",
      ".rec-btn-sec{background:#f3f4f6;color:#374151}",
      ".rec-btn-sec:hover{background:#e5e7eb}",
      ".rec-btn-wa{background:#25d366;color:#fff}",
      ".rec-btn-wa:hover{background:#1ebe5b;transform:translateY(-1px);box-shadow:0 4px 10px rgba(37,211,102,.35)}",
      /* Estado vacío */
      ".rec-empty{padding:50px 20px;text-align:center;color:#9ca3af}",
      ".rec-empty-title{font-size:15px;font-weight:700;color:#374151;margin-bottom:6px}",
      ".rec-empty-sub{font-size:12px;color:#6b7280}",
      /* Filtros */
      ".rec-filtros{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}",
      ".rec-filtros .rec-search{flex:1;min-width:200px;padding:8px 12px;border:1.5px solid #e5e7eb;" +
        "border-radius:8px;font-size:12px;outline:none;font-family:Inter,sans-serif}",
      ".rec-filtros select{padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:8px;" +
        "font-size:12px;font-family:Inter,sans-serif;background:#fff;cursor:pointer;outline:none}",
      /* Tarjeta de reclamo cargado */
      ".rec-item{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;" +
        "margin-bottom:10px;transition:box-shadow .15s}",
      ".rec-item:hover{box-shadow:0 4px 14px rgba(0,0,0,.06)}",
      ".rec-item-head{display:flex;justify-content:space-between;align-items:center;gap:10px;" +
        "margin-bottom:10px;flex-wrap:wrap}",
      ".rec-item-tipo{font-size:14px;font-weight:700;color:#111827;display:flex;align-items:center;gap:8px}",
      ".rec-item-tipo-ico{font-size:20px}",
      ".rec-item-estado{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;" +
        "border:1.5px solid;cursor:pointer;font-family:Inter,sans-serif;outline:none}",
      ".rec-item-body{display:flex;flex-direction:column;gap:6px;font-size:12px;color:#4b5563}",
      ".rec-item-row strong{color:#374151;font-weight:700}",
      ".rec-item-desc{background:#f9fafb;border-left:3px solid #7c3aed;padding:8px 10px;" +
        "border-radius:4px;margin-top:4px;color:#374151;line-height:1.4;white-space:pre-wrap}",
      ".rec-item-meta{font-size:10px;color:#9ca3af;margin-top:4px;font-style:italic}",
      ".rec-item-actions{display:flex;gap:6px;margin-top:10px;padding-top:10px;" +
        "border-top:1px solid #f3f4f6;flex-wrap:wrap}",
      ".rec-btn-mini{padding:5px 10px;border-radius:6px;border:1px solid #e5e7eb;background:#fff;" +
        "font-size:11px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;color:#4b5563;" +
        "transition:all .15s}",
      ".rec-btn-mini:hover{background:#f3f4f6;border-color:#d1d5db}",
      ".rec-btn-wa-mini{background:#25d366;color:#fff;border-color:#25d366}",
      ".rec-btn-wa-mini:hover{background:#1ebe5b;border-color:#1ebe5b;color:#fff}",
      ".rec-btn-del:hover{background:#fee2e2;border-color:#fca5a5;color:#dc2626}",
      /* Dark mode formulario / lista */
      "body.dark .rec-tab{background:#252830!important;color:#94a3b8!important;border-color:#373b47!important}",
      "body.dark .rec-tab:hover{background:#2d3140!important;color:#e2e8f0!important}",
      "body.dark .rec-tab.on{background:#7c3aed!important;color:#fff!important}",
      "body.dark .rec-form input,body.dark .rec-form select,body.dark .rec-form textarea{" +
        "background:#252830!important;color:#e2e8f0!important;border-color:#373b47!important}",
      "body.dark .rec-form label{color:#cbd5e1!important}",
      "body.dark .rec-btn-sec{background:#373b47!important;color:#e2e8f0!important}",
      "body.dark .rec-item{background:#252830!important;border-color:#373b47!important}",
      "body.dark .rec-item-tipo{color:#f1f5f9!important}",
      "body.dark .rec-item-body{color:#cbd5e1!important}",
      "body.dark .rec-item-desc{background:#2a2d38!important;color:#e2e8f0!important}",
      "body.dark .rec-btn-mini{background:#373b47!important;color:#cbd5e1!important;border-color:#4b5260!important}",
      "body.dark .rec-filtros .rec-search,body.dark .rec-filtros select{" +
        "background:#252830!important;color:#e2e8f0!important;border-color:#373b47!important}",
      /* === Agenda de funcionarios === */
      ".rec-func-toolbar{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center}",
      ".rec-func-toolbar .rec-search{flex:1;min-width:200px;padding:8px 12px;border:1.5px solid #e5e7eb;" +
        "border-radius:8px;font-size:12px;outline:none;font-family:Inter,sans-serif}",
      ".rec-func-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}",
      ".rec-func-card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px;" +
        "display:flex;flex-direction:column;gap:8px;transition:all .15s}",
      ".rec-func-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.07);border-color:#c4b5fd;transform:translateY(-1px)}",
      ".rec-func-card-head{display:flex;flex-direction:column;gap:2px}",
      ".rec-func-card-name{font-size:13px;font-weight:700;color:#111827}",
      ".rec-func-card-area{font-size:10px;color:#6b7280;font-style:italic}",
      ".rec-func-card-tel{font-size:11px;color:#4b5563;font-family:monospace}",
      ".rec-func-card-actions{display:flex;gap:5px;flex-wrap:wrap;padding-top:8px;border-top:1px solid #f3f4f6}",
      ".rec-func-form{background:#f9fafb;padding:14px;border-radius:10px;margin-bottom:14px;" +
        "border:1px dashed #c4b5fd}",
      /* Dark mode agenda */
      "body.dark .rec-func-card{background:#252830!important;border-color:#373b47!important}",
      "body.dark .rec-func-card-name{color:#f1f5f9!important}",
      "body.dark .rec-func-card-tel{color:#cbd5e1!important}",
      "body.dark .rec-func-form{background:#252830!important;border-color:#7c3aed!important}",
      /* === Historial de reclamos (agrupado) === */
      ".rec-hist-toolbar{display:flex;justify-content:space-between;align-items:center;" +
        "margin-bottom:14px;flex-wrap:wrap;gap:10px}",
      ".rec-hist-modes{display:flex;gap:6px}",
      ".rec-hist-mode{padding:7px 12px;border-radius:7px;border:1px solid #e5e7eb;" +
        "background:#fff;font-size:11px;font-weight:600;cursor:pointer;color:#6b7280;" +
        "font-family:Inter,sans-serif;transition:all .15s;display:inline-flex;align-items:center;gap:6px}",
      ".rec-hist-mode:hover{background:#f9fafb;color:#111827}",
      ".rec-hist-mode.on{background:#7c3aed!important;color:#fff!important;border-color:#7c3aed!important}",
      ".rec-hist-stats{display:flex;gap:6px;flex-wrap:wrap}",
      ".rec-hist-stat{padding:3px 9px;border-radius:10px;font-size:10px;font-weight:700}",
      ".rec-hist-grupo{margin-bottom:14px;background:#fff;border:1px solid #e5e7eb;" +
        "border-radius:10px;overflow:hidden}",
      ".rec-hist-grupo-head{display:flex;align-items:center;gap:10px;padding:10px 14px;" +
        "background:#f9fafb;border-bottom:1px solid #e5e7eb}",
      ".rec-hist-grupo-ico{font-size:18px}",
      ".rec-hist-grupo-name{font-size:13px;font-weight:700;color:#111827;flex:1}",
      ".rec-hist-grupo-count{background:#ede9fe;color:#6d28d9;padding:2px 8px;" +
        "border-radius:10px;font-size:10px;font-weight:700}",
      ".rec-hist-grupo-items{padding:6px 8px}",
      ".rec-hist-item{display:flex;align-items:center;gap:10px;padding:8px 10px;" +
        "border-radius:6px;cursor:pointer;transition:background .15s}",
      ".rec-hist-item:hover{background:#f9fafb}",
      ".rec-hist-estado{font-size:14px;padding:3px 7px;border-radius:5px;font-weight:700;" +
        "min-width:30px;text-align:center}",
      ".rec-hist-info{flex:1;min-width:0}",
      ".rec-hist-vecino{font-size:12px;font-weight:700;color:#111827}",
      ".rec-hist-meta{font-size:10px;color:#6b7280;margin-top:2px}",
      ".rec-hist-actions{display:flex;gap:4px;flex-shrink:0}",
      /* Dark mode historial */
      "body.dark .rec-hist-mode{background:#252830!important;color:#94a3b8!important;border-color:#373b47!important}",
      "body.dark .rec-hist-mode:hover{background:#2d3140!important;color:#e2e8f0!important}",
      "body.dark .rec-hist-grupo{background:#252830!important;border-color:#373b47!important}",
      "body.dark .rec-hist-grupo-head{background:#1e2128!important;border-color:#373b47!important}",
      "body.dark .rec-hist-grupo-name{color:#f1f5f9!important}",
      "body.dark .rec-hist-item:hover{background:#2a2d38!important}",
      "body.dark .rec-hist-vecino{color:#f1f5f9!important}",
      /* === REDISEÑO PANEL AGENTE (Equipo / Guardias) v2.3 === */
      /* 1) Forzar visibilidad de iconos/emojis */
      "#p-equipo *,#p-guardias *{opacity:1!important}",
      "#p-equipo button,#p-equipo a,#p-guardias button,#p-guardias a{opacity:1!important;filter:none!important}",
      /* 2) Ocultar definitivamente WhatsApp / Tareas del día */
      "button[onclick*='whatsappAgente'],button[onclick*='abrirWaAgente']," +
        "button[onclick*='tareasDelDia'],button[onclick*='TareasDelDia']," +
        "a[onclick*='tareasDelDia']{display:none!important}",
      /* 3) Filtros (Hoy / Pendientes / Esta semana / Todas) visibles y modernos */
      "#p-equipo button[onclick*='filtrar'],#p-equipo button[onclick*='Filter']," +
        "#p-guardias button[onclick*='filtrar'],#p-guardias button[onclick*='Filter']{" +
        "padding:8px 14px!important;border-radius:8px!important;border:1.5px solid #e5e7eb!important;" +
        "background:#fff!important;color:#374151!important;font-size:11px!important;font-weight:700!important;" +
        "cursor:pointer!important;transition:all .15s!important;margin-right:6px!important;opacity:1!important}",
      "#p-equipo button[onclick*='filtrar']:hover,#p-guardias button[onclick*='filtrar']:hover{" +
        "background:#f3f4f6!important;border-color:#a78bfa!important;transform:translateY(-1px)}",
      "#p-equipo button[onclick*='filtrar'].on,#p-equipo button[onclick*='filtrar'].activo," +
        "#p-guardias button[onclick*='filtrar'].on,#p-guardias button[onclick*='filtrar'].activo{" +
        "background:#7c3aed!important;color:#fff!important;border-color:#7c3aed!important;" +
        "box-shadow:0 2px 8px rgba(124,58,237,.3)!important}",
      /* 4) Barra de progreso con gradiente */
      "#p-equipo [class*='progress'] [class*='bar'],#p-equipo [class*='progress'] [class*='fill']," +
        "#p-guardias [class*='progress'] [class*='bar'],#p-guardias [class*='progress'] [class*='fill']," +
        "#p-equipo [class*='progreso']>div,#p-guardias [class*='progreso']>div{" +
        "background:linear-gradient(90deg,#ef4444 0%,#f59e0b 30%,#10b981 100%)!important;" +
        "border-radius:99px!important;transition:width .6s ease!important;" +
        "box-shadow:0 1px 3px rgba(0,0,0,.1)!important}",
      /* 5) Tareas: hover lift effect + redondeo */
      "#p-equipo [class*='task'],#p-equipo [class*='tarea']," +
        "#p-guardias [class*='task'],#p-guardias [class*='tarea']," +
        "#p-equipo .tc,#p-guardias .tc{transition:all .2s!important;border-radius:10px!important}",
      "#p-equipo [class*='task']:hover,#p-equipo [class*='tarea']:hover," +
        "#p-guardias [class*='task']:hover,#p-guardias [class*='tarea']:hover," +
        "#p-equipo .tc:hover,#p-guardias .tc:hover{" +
        "transform:translateX(3px);box-shadow:0 4px 12px rgba(0,0,0,.07)!important}",
      /* 6) Headers de sección PENDIENTES/EN PROCESO/COMPLETADAS */
      "#p-equipo h2,#p-equipo h3,#p-guardias h2,#p-guardias h3{" +
        "font-size:12px!important;letter-spacing:.05em!important;font-weight:800!important}",
      /* 7) Tareas completadas: opacidad suave pero íconos visibles */
      "#p-equipo [class*='completada'],#p-guardias [class*='completada']{opacity:.75!important}",
      "#p-equipo [class*='completada'] *,#p-guardias [class*='completada'] *{opacity:1!important}",
      /* 8) Checkboxes más grandes y con color de marca */
      "#p-equipo input[type='checkbox'],#p-guardias input[type='checkbox']{" +
        "width:18px!important;height:18px!important;cursor:pointer!important;accent-color:#7c3aed!important}",
      /* 9) Botón + Agregar más prominente */
      "#p-equipo button[onclick*='agregar'],#p-equipo button[onclick*='Agregar']," +
        "#p-guardias button[onclick*='agregar'],#p-guardias button[onclick*='Agregar']{" +
        "background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)!important;color:#fff!important;" +
        "border:none!important;padding:9px 18px!important;border-radius:8px!important;" +
        "font-weight:700!important;cursor:pointer!important;" +
        "box-shadow:0 2px 8px rgba(124,58,237,.3)!important;transition:all .15s!important}",
      "#p-equipo button[onclick*='agregar']:hover,#p-guardias button[onclick*='agregar']:hover{" +
        "transform:translateY(-1px);box-shadow:0 4px 12px rgba(124,58,237,.4)!important}",
      /* 10) Animación de entrada para tareas */
      "@keyframes m1-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}",
      "#p-equipo [class*='task'],#p-equipo [class*='tarea'],#p-equipo .tc," +
        "#p-guardias [class*='task'],#p-guardias [class*='tarea'],#p-guardias .tc{" +
        "animation:m1-fade-in .3s ease backwards}",
      /* 11) Selector de estado en el panel agente */
      "#p-equipo .estado-selector-m1,#p-guardias .estado-selector-m1{" +
        "max-width:220px;font-weight:700!important}",
      /* 12) Dark mode adaptado */
      "body.dark #p-equipo button[onclick*='filtrar'],body.dark #p-guardias button[onclick*='filtrar']{" +
        "background:#2a2d38!important;color:#e2e8f0!important;border-color:#373b47!important}",
      ".rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));" +
        "gap:12px;margin-bottom:24px}",
      ".rec-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;" +
        "padding:14px;display:flex;gap:12px;align-items:flex-start;" +
        "transition:all .15s;position:relative}",
      ".rec-card:hover{box-shadow:0 6px 20px rgba(102,126,234,.12);" +
        "transform:translateY(-2px);border-color:#c4b5fd}",
      ".rec-ico{font-size:30px;line-height:1;flex-shrink:0;width:42px;" +
        "height:42px;display:flex;align-items:center;justify-content:center;" +
        "background:#f5f3ff;border-radius:10px}",
      ".rec-body{flex:1;min-width:0}",
      ".rec-tipo{font-size:13px;font-weight:700;color:#111827;margin-bottom:6px;" +
        "line-height:1.2}",
      ".rec-deriv{font-size:9px;color:#9ca3af;font-weight:600;text-transform:uppercase;" +
        "letter-spacing:.04em;margin-bottom:2px}",
      ".rec-func{font-size:12px;color:#4b5563;font-weight:600;margin-bottom:2px}",
      ".rec-tel{font-size:10px;color:#9ca3af;font-family:monospace}",
      ".rec-wa{position:absolute;top:10px;right:10px;background:#25d366;color:#fff;" +
        "padding:5px 9px;border-radius:6px;font-size:10px;font-weight:700;" +
        "text-decoration:none;display:inline-flex;align-items:center;gap:4px;" +
        "transition:all .15s;font-family:Inter,sans-serif}",
      ".rec-wa:hover{background:#1ebe5b;transform:scale(1.05);box-shadow:0 3px 10px rgba(37,211,102,.35)}",
      ".rec-wa svg{flex-shrink:0}",
      ".rec-extra-title{font-size:11px;font-weight:700;color:#6b7280;" +
        "text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px;padding-top:10px;" +
        "border-top:1px solid #e5e7eb}",
      ".rec-extra-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}",
      ".rec-extra{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;" +
        "padding:8px 10px;display:flex;justify-content:space-between;align-items:center;gap:8px}",
      ".rec-extra-name{font-size:11px;font-weight:600;color:#374151}",
      ".rec-extra-wa{font-size:10px;color:#16a34a;text-decoration:none;font-weight:600;" +
        "white-space:nowrap;font-family:monospace}",
      ".rec-extra-wa:hover{text-decoration:underline}",
      /* Dark mode Reclamos */
      "body.dark .rec-card{background:#252830!important;border-color:#373b47!important}",
      "body.dark .rec-card:hover{border-color:#7c3aed!important}",
      "body.dark .rec-ico{background:#2d2d5e!important}",
      "body.dark .rec-tipo{color:#f1f5f9!important}",
      "body.dark .rec-func{color:#cbd5e1!important}",
      "body.dark .rec-extra{background:#2a2d38!important;border-color:#373b47!important}",
      "body.dark .rec-extra-name{color:#e2e8f0!important}",
      "body.dark .rec-extra-title{color:#94a3b8!important;border-color:#373b47!important}",
      /* Responsive: tablet */
      "@media(max-width:1024px){",
        ".kanban{gap:8px!important}",
        ".kcol{min-width:180px!important}",
      "}",
      /* Responsive: mobile */
      "@media(max-width:640px){",
        ".kanban{flex-direction:column!important;gap:10px!important;overflow-x:hidden!important}",
        ".kcol{min-width:100%!important;width:100%!important;flex:none!important}",
        "aside.sb{flex-direction:row!important;overflow-x:auto!important;" +
          "-webkit-overflow-scrolling:touch!important;height:auto!important;" +
          "padding:6px 8px!important;width:100%!important}",
        "aside.sb .sbi{flex-shrink:0!important;width:auto!important;" +
          "padding:6px 10px!important}",
        ".ptop{flex-wrap:wrap!important;gap:8px!important}",
      "}"
    ].join("");
    document.head.appendChild(st);
  }

  // Oculta los botones WhatsApp y "Tareas del día" del detalle de agente
  // (la usuaria pidió eliminarlos porque se superponían y no los usa).
  // Búsqueda agresiva: en todo el documento, por texto y onclick.
  function ocultarBotonesAgente(){
    document.querySelectorAll("button, a").forEach(function(el){
      if(el.__m1Hidden) return;
      // No tocar mis propios controles
      var cls = String(el.className || "");
      if(/(?:rec-|estado-selector|sbi|ntab|sbadge)/.test(cls)) return;
      var id = String(el.id || "");
      if(/(?:rec-|estado-)/.test(id)) return;

      var txt = (el.textContent || "").trim();
      var txtL = txt.toLowerCase();
      var onclick = (el.getAttribute("onclick") || "").toLowerCase();
      var href = (el.getAttribute("href") || "").toLowerCase();
      var title = (el.getAttribute("title") || "").toLowerCase();

      // Coincidencia exacta o muy cercana
      var esWhatsApp =
        txtL === "whatsapp" ||
        txtL === "📱 whatsapp" ||
        txtL === "💬 whatsapp" ||
        /^[\s\u200d\ufe0f]*(?:📱|💬|📞)?[\s\u200d\ufe0f]*whatsapp[\s\u200d\ufe0f]*$/i.test(txt) ||
        onclick.indexOf("whatsappagente") >= 0 ||
        onclick.indexOf("abrirwaagente") >= 0 ||
        title === "whatsapp";

      var esTareasDelDia =
        /^[\s\u200d\ufe0f📋📆📅]*tareas del d[íi]a[\s\u200d\ufe0f]*$/i.test(txt) ||
        onclick.indexOf("tareasdeldi") >= 0 ||
        onclick.indexOf("tareas_del_dia") >= 0 ||
        title.indexOf("tareas del d") >= 0;

      if(!esWhatsApp && !esTareasDelDia) return;

      // Excepción: NO ocultar enlaces a wa.me dentro de tarjetas de reclamos,
      // ni botones de WA dentro de tarjetas de funcionarios.
      if(esWhatsApp){
        var parent = el.parentElement;
        var maxLevels = 6, lvl = 0;
        while(parent && lvl < maxLevels){
          var pc = String(parent.className || "");
          if(/(?:rec-card|rec-item|rec-func-card|rec-extra|rec-hist-item|rec-grid)/.test(pc)){
            return; // está dentro de mis componentes, no tocar
          }
          parent = parent.parentElement;
          lvl++;
        }
        // También dejar pasar si está dentro de mensajes WA de la lista
        if(href.indexOf("wa.me") >= 0){
          var anc = el.closest(".rec-item, .rec-card, .rec-extra, .rec-func-card, .rec-hist-item");
          if(anc) return;
        }
      }

      // Si está visible y arriba en pantalla, ocultar
      var rect = el.getBoundingClientRect();
      if(rect.top < 250 && rect.width > 0){
        el.style.setProperty("display", "none", "important");
        el.__m1Hidden = true;
      }
    });
  }

  /* -------- INICIALIZACIÓN -------- */
  function init(){
    inyectarEstilos();
    asegurarBadgePlaceholders();   // ANTES de cualquier otra cosa
    limpiarSidebar();
    crearContenedoresFaltantes();
    sincronizarMenuLateral();
    patchearNav();
    patchearRenderKanban();
    observarSidebar();

    // Re-aplicar correcciones por si el script inline cargó después
    var n = 0;
    var iv = setInterval(function(){
      asegurarBadgePlaceholders();
      var sb = document.querySelector("aside.sb");
      if(sb && !sb.__menuSincronizado){
        sincronizarMenuLateral();
      }
      deduplicarSidebar();
      ocultarFiltroPersonas();
      ocultarColumnaRealizada();
      ocultarBotonesAgente();
      if(!window.nav || !window.nav.__patcheadoActivo) patchearNav();
      if(!window.renderKanban || !window.renderKanban.__patcheadoEstado){
        patchearRenderKanban();
      }
      actualizarBotonActivo();
      agregarSelectoresEnTarjetas();
      if(++n >= 16) clearInterval(iv);
    }, 500);

    // Observador global del main: cuando se abre el detalle de un agente,
    // re-aplicar fixes (ocultar botones, agregar selectores)
    try {
      var main = document.getElementById("main");
      if(main){
        var moMain = new MutationObserver(function(){
          ocultarBotonesAgente();
          agregarSelectoresEnTarjetas();
          ocultarColumnaRealizada();
        });
        moMain.observe(main, { childList: true, subtree: true });
      }
    } catch(_){}

    try {
      console.log("%c[mejoras1.js v2.4] + contactos medios en sidebar",
                  "color:#7c3aed;font-weight:bold");
    } catch(_){}
  }

  // Quita filas duplicadas del sidebar (mismo data-mid)
  function deduplicarSidebar(){
    var sb = document.querySelector("aside.sb");
    if(!sb) return;
    var seen = {};
    Array.prototype.slice.call(sb.querySelectorAll(".sbi[data-mid]")).forEach(function(btn){
      var mid = btn.getAttribute("data-mid");
      if(seen[mid]) { try { btn.remove(); } catch(_){} }
      else seen[mid] = true;
    });
  }

  // Oculta cualquier rastro del filtro "Todas las personas" / "Filtrar persona"
  function ocultarFiltroPersonas(){
    var fp = document.getElementById("fPanel");
    var sp = document.getElementById("sbpersons");
    if(fp) fp.style.display = "none";
    if(sp) sp.style.display = "none";
    // Esconder elementos en el sidebar cuyo texto contenga "Todas las per"
    document.querySelectorAll("aside.sb > *").forEach(function(el){
      if(el.classList && el.classList.contains("sbi") && el.hasAttribute("data-mid")) return;
      var t = (el.textContent || "").toLowerCase();
      if(t.indexOf("todas las per") >= 0 || t.indexOf("filtrar persona") >= 0){
        el.style.display = "none";
      }
    });
  }

  // Observa el sidebar: si el código original lo modifica, limpiamos
  function observarSidebar(){
    var sb = document.querySelector("aside.sb");
    if(!sb || sb.__observado) return;
    try {
      var mo = new MutationObserver(function(){
        deduplicarSidebar();
        ocultarFiltroPersonas();
      });
      mo.observe(sb, { childList: true, subtree: false });
      sb.__observado = true;
    } catch(_){}
  }

  if(document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

})();
