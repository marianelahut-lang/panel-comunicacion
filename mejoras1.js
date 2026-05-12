/* ============================================================
   MEJORAS1.JS - Panel Comunicación Tres Arroyos
   v1.3 · Fix badges + Reclamos + UX
   ------------------------------------------------------------
   1. Captura errores globales para que un fallo no rompa el panel.
   2. FIX del error "Cannot set properties of null (textContent)":
      garantiza que los IDs sbt/sbm/sbag (badges contadores que el
      código original requiere) existan siempre en el DOM.
   3. Limpia el texto fantasma "Tareas del d..." del sidebar.
   4. Reconstruye el menú lateral copiando los botones de la barra
      superior (Hoy, Tablero, Material, Agenda, Calendario,
      Guardias, Equipo, Medios, Recursos) + Reclamos. Elimina
      "Filtrar persona" y "Todas las personas".
   5. MÓDULO RECLAMOS: guía de derivación con tarjetas por tipo
      de reclamo, funcionario asignado y botón directo de WhatsApp.
      Lee tabla 'reclamos' de Supabase o usa datos del xlsx local.
   6. Selector rápido de estado en cada tarjeta del Kanban con
      guardado automático en Supabase.
   7. Estilos + dark mode + responsive PC y celular.
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

  /* -------- 3. CREA CONTENEDORES FALTANTES + MÓDULO RECLAMOS -------- */

  // Datos del xlsx, embebidos como respaldo si la tabla de Supabase
  // no existe o no devuelve filas. Si Supabase responde con datos,
  // estos se descartan y se usan los de la base.
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

  // Funcionarios adicionales (sin reclamo asignado, disponibles como contacto)
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

  // Mapeo de tipo de reclamo → emoji (para datos que vengan de Supabase
  // sin la columna de ícono)
  var ICONO_RECLAMO = {
    "agua":"💧","asfalto":"🛣️","caño roto":"🔧","cano roto":"🔧",
    "pérdida de agua":"💦","perdida de agua":"💦",
    "calles de tierra":"🛤️","basura en la calle":"🗑️",
    "terreno en malas condiciones":"🌳","inundados":"🌊",
    "pastos crecidos":"🌿","otros":"📋"
  };

  function normalizarTelefono(t){
    if(t == null) return "";
    return String(t).replace(/[^\d]/g, "");
  }

  function normalizarReclamo(r){
    // Acepta varios nombres de columna posibles desde Supabase
    var rec  = r.reclamo || r.Reclamo || r.tipo || r.nombre || "";
    var func = r.funcionario || r.Funcionario || r.responsable || "";
    var tel  = normalizarTelefono(r.telefono || r.Telefono || r.tel || r.celular || "");
    var ic   = r.icono || ICONO_RECLAMO[(rec || "").toLowerCase().trim()] || "📌";
    return { reclamo: String(rec).trim(), funcionario: String(func).trim(), telefono: tel, icono: ic };
  }

  async function cargarReclamosDesdeSupabase(){
    if(typeof db === "undefined" || !db || !db.from) return null;
    try {
      var res = await db.from("reclamos").select("*");
      if(res && !res.error && res.data && res.data.length){
        return res.data
          .map(normalizarReclamo)
          .filter(function(x){ return x.reclamo && x.funcionario; });
      }
    } catch(_){}
    return null;
  }

  function escapeHTML(s){
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  function formatearTel(tel){
    // 5492983449098 → +54 9 2983 449098
    var t = normalizarTelefono(tel);
    if(t.length < 10) return tel;
    var m = t.match(/^54(9?)(\d{2,4})(\d+)$/);
    if(!m) return "+" + t;
    return "+54 " + (m[1] ? "9 " : "") + m[2] + " " + m[3];
  }

  function renderReclamos(lista){
    var cont = document.getElementById("p-reclamos");
    if(!cont) return;
    var cards = lista.map(function(r){
      var msg = encodeURIComponent("Hola " + r.funcionario.split(" ")[0] +
        ", te contacto desde Comunicación de la Muni por un reclamo de \"" +
        r.reclamo + "\".");
      var waLink = "https://wa.me/" + r.telefono + "?text=" + msg;
      return '' +
      '<div class="rec-card">' +
        '<div class="rec-ico">' + r.icono + '</div>' +
        '<div class="rec-body">' +
          '<div class="rec-tipo">' + escapeHTML(r.reclamo) + '</div>' +
          '<div class="rec-deriv">Derivar a</div>' +
          '<div class="rec-func">' + escapeHTML(r.funcionario) + '</div>' +
          '<div class="rec-tel">' + escapeHTML(formatearTel(r.telefono)) + '</div>' +
        '</div>' +
        '<a class="rec-wa" href="' + waLink + '" target="_blank" rel="noopener" ' +
          'title="Abrir chat de WhatsApp">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">' +
          '<path d="M17.6 6.3A8 8 0 0 0 4.5 16l-1.1 4 4.1-1.1A8 8 0 0 0 17.6 6.3zm-5.6 12a6.6 6.6 0 0 1-3.4-.9l-.2-.1-2.4.6.6-2.3-.2-.2A6.6 6.6 0 1 1 12 18.4zm3.6-5c-.2-.1-1.2-.6-1.4-.6s-.3-.1-.4.1-.5.6-.6.8-.2.1-.4 0a5.4 5.4 0 0 1-2.7-2.3c-.2-.3 0-.4.1-.6s.2-.3.4-.4l.2-.4v-.4l-.6-1.4c-.1-.3-.3-.3-.4-.3h-.4c-.1 0-.4.1-.5.3a2 2 0 0 0-.7 1.5 3.5 3.5 0 0 0 .8 1.9 8 8 0 0 0 3.2 2.8c1.9.8 1.9.5 2.3.5a1.7 1.7 0 0 0 1.2-.8 1.4 1.4 0 0 0 .1-.8c-.1-.1-.2-.1-.4-.2z"/>' +
          '</svg>WhatsApp</a>' +
      '</div>';
    }).join("");

    var extra = FUNCIONARIOS_EXTRA.map(function(f){
      var waLink = "https://wa.me/" + f.telefono;
      return '' +
      '<div class="rec-extra">' +
        '<div class="rec-extra-name">' + escapeHTML(f.nombre) + '</div>' +
        '<a class="rec-extra-wa" href="' + waLink + '" target="_blank" rel="noopener">' +
          '📱 ' + escapeHTML(formatearTel(f.telefono)) + '</a>' +
      '</div>';
    }).join("");

    cont.innerHTML =
      '<div class="ptop">' +
        '<div><div class="ptitle">Reclamos · Guía de derivación</div>' +
        '<div class="psub">' + lista.length + ' tipos de reclamo · ' +
          FUNCIONARIOS_EXTRA.length + ' contactos adicionales</div></div>' +
      '</div>' +
      '<div class="rec-grid">' + cards + '</div>' +
      '<div class="rec-extra-title">Otros contactos</div>' +
      '<div class="rec-extra-grid">' + extra + '</div>';
  }

  async function initReclamos(){
    var data = await cargarReclamosDesdeSupabase();
    if(!data || !data.length){
      console.log("[mejoras1] Reclamos: usando datos locales (no se encontró tabla 'reclamos' en Supabase o está vacía)");
      data = RECLAMOS_DATA;
    } else {
      console.log("[mejoras1] Reclamos: " + data.length + " filas cargadas desde Supabase");
    }
    renderReclamos(data);
  }

  function crearContenedoresFaltantes(){
    var main = document.getElementById("main");
    if(!main) return;

    // Reclamos: contenedor real con guía de derivación
    if(!document.getElementById("p-reclamos")){
      var div = document.createElement("div");
      div.id = "p-reclamos";
      div.style.cssText = "display:none;overflow-y:auto;height:100%";
      div.innerHTML =
        '<div class="ptop"><div><div class="ptitle">Reclamos</div>' +
        '<div class="psub">Cargando…</div></div></div>';
      main.appendChild(div);
      // Disparar carga (Supabase + fallback)
      initReclamos();
    }

    // Otros contenedores faltantes con placeholder
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

    // Recordar elementos internos que el código existente referencia
    // para no romper renders posteriores: los ocultamos pero los conservamos.
    var fPanel    = document.getElementById("fPanel");
    var sbpersons = document.getElementById("sbpersons");

    // Construir nuevos botones a partir de la nav superior
    var frag = document.createDocumentFragment();
    tabs.forEach(function(tab){
      var onclick = tab.getAttribute("onclick") || "";
      var m = onclick.match(/nav\(['"]([^'"]+)['"]/);
      if(!m) return;
      var id = m[1];
      var labelRaw = (tab.textContent || "").trim();
      // Sacar emoji de prefijo si lo trae (ej. "📊 Métricas" → "Métricas")
      var label = labelRaw.replace(
        /^[\u2600-\u27BF\uD83C-\uDBFF\uDC00-\uDFFF\uFE0F\u200D]+\s*/, ""
      );
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

    // CRÍTICO: el código original espera encontrar elementos con ID
    // "sbt", "sbm" y "sbag" en el DOM para actualizar contadores.
    // Si no existen, document.getElementById("sbt").textContent tira
    // "Cannot set properties of null (setting 'textContent')".
    // Como respaldo siempre creamos los placeholders ocultos.
    asegurarBadgePlaceholders(sb);

    // Visualizar el badge de Calendario (sbag) dentro del botón nuevo
    var btnCal = sb.querySelector('.sbi[data-mid="calendario"]');
    var sbag = document.getElementById("sbag");
    if(btnCal && sbag){
      sbag.style.cssText = "background:#ede9fe;color:#6d28d9;font-size:9px;" +
        "font-weight:700;padding:2px 7px;border-radius:10px;margin-left:auto";
      btnCal.appendChild(sbag);
    }

    // Reinsertar elementos preservados (ocultos) para que las funciones
    // del script principal (renderPersons, actualizarFPanel, etc.) sigan
    // encontrándolos y no tiren error.
    if(fPanel){    fPanel.style.display    = "none"; sb.appendChild(fPanel); }
    if(sbpersons){ sbpersons.style.display = "none"; sb.appendChild(sbpersons); }

    // Marcar el botón activo según la página visible
    actualizarBotonActivo();
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
  var ESTADOS = ["Pendiente","En proceso","Lista","Realizada","Lista para publicar"];
  var COLOR_ESTADO = {
    "Pendiente":           "#ef4444",
    "En proceso":          "#f59e0b",
    "Lista":               "#10b981",
    "Realizada":           "#7c3aed",
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
    var tarjetas = document.querySelectorAll(".kanban .tc");
    tarjetas.forEach(function(tc){
      if(tc.querySelector(".estado-selector-m1")) return;
      // ID
      var onclick = tc.getAttribute("onclick") || "";
      var m = onclick.match(/editTask\(['"]([^'"]+)['"]\)/);
      if(!m) return;
      var id = m[1];
      // Estado actual = nombre de la columna
      var col = tc.closest(".kcol");
      var estadoActual = "Pendiente";
      if(col){
        var hdr = col.querySelector(".khdr .kt");
        if(hdr){
          var lbl = (hdr.textContent || "").replace(/[\d\s]+$/g,"").trim();
          if(ESTADOS.indexOf(lbl) >= 0) estadoActual = lbl;
          else if(lbl === "Lista para publicar") estadoActual = "Lista para publicar";
        }
      }
      var color = COLOR_ESTADO[estadoActual] || "#6b7280";
      // Crear select
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
      setTimeout(agregarSelectoresEnTarjetas, 40);
      return r;
    };
    window.renderKanban.__patcheadoEstado = true;
    return true;
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
      /* Módulo Reclamos */
      "#p-reclamos{padding:0 16px 24px}",
      "#p-reclamos .ptop{padding:14px 0 12px;margin-bottom:0}",
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

  /* -------- INICIALIZACIÓN -------- */
  function init(){
    inyectarEstilos();
    asegurarBadgePlaceholders();   // ANTES de cualquier otra cosa
    limpiarSidebar();
    crearContenedoresFaltantes();
    sincronizarMenuLateral();
    patchearNav();
    patchearRenderKanban();

    // Re-aplicar correcciones por si el script inline cargó después
    var n = 0;
    var iv = setInterval(function(){
      asegurarBadgePlaceholders();
      // Si el sidebar todavía no fue reemplazado (porque .ntabs no estaba
      // listo al momento del init), reintentar.
      var sb = document.querySelector("aside.sb");
      if(sb && !sb.__menuSincronizado){
        if(sincronizarMenuLateral()) sb.__menuSincronizado = true;
      }
      if(!window.nav || !window.nav.__patcheadoActivo) patchearNav();
      if(!window.renderKanban || !window.renderKanban.__patcheadoEstado){
        patchearRenderKanban();
      }
      actualizarBotonActivo();
      agregarSelectoresEnTarjetas();
      if(++n >= 12) clearInterval(iv);
    }, 500);

    try {
      console.log("%c[mejoras1.js v1.3] correcciones + reclamos + badge-fix",
                  "color:#7c3aed;font-weight:bold");
    } catch(_){}
  }

  if(document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

})();
