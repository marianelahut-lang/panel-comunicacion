/* ============================================================
   MEJORAS2.JS - Panel Comunicación Tres Arroyos
   Capa adicional sobre mejoras1.js (v3.11)
   ------------------------------------------------------------
   IMPORTANTE: Este archivo NO modifica index.html ni mejoras1.js.
   Solo se carga DESPUÉS de mejoras1.js y agrega funcionalidades
   nuevas. Si algo falla, se quita el <script> y el panel vuelve
   al estado anterior intacto.
   ------------------------------------------------------------
   ROADMAP:
   · F0 — BACKUP de datos del navegador               [ESTA FASE]
   · F1 — TIMELINE unificada + BOTONES RÁPIDOS en HOY
   · F2 — TARJETAS DE GUARDIA + DRAG & DROP en Tablero
   · F3 — AUTOMATIZACIÓN post-15hs + WhatsApp resumen
   ------------------------------------------------------------
   INSTALACIÓN:
   En index.html, antes de </body>, agregar UNA línea
   (debe ir DESPUÉS de mejoras1.js):

     <script src="mejoras1.js" defer></script>
     <script src="mejoras2.js" defer></script>   <!-- nueva -->

   ============================================================ */
(function(){
  "use strict";

  // ============================================================
  // FASE 0 — BACKUP DE DATOS DEL NAVEGADOR
  // ============================================================
  //
  // El panel guarda datos en dos lugares:
  //   1. Supabase (servidor) → tablas tareas, agenda, etc.
  //      Es persistente. NO necesita backup local.
  //   2. localStorage (navegador) → 13 claves identificadas.
  //      Si se limpia el navegador, se pierden.
  //
  // Este módulo agrega un botón "💾 Backup" flotante para:
  //   · Ver qué hay guardado (con tamaño y cantidad de items)
  //   · Descargar TODO el localStorage como JSON
  //   · Restaurar desde un JSON exportado previamente
  //
  // No depende de mejoras1.js: funciona aunque mejoras1 falle.
  // ============================================================

  var BK_VERSION = "f0-v1";

  // Claves CONOCIDAS del panel — se muestran agrupadas y con nombre claro
  // en el preview. Si aparecen otras (futuras versiones), van a "Otras claves".
  var CLAVES_CONOCIDAS = {
    "panel-comunicacion-reclamos-v1":          "📋 Reclamos vecinos",
    "panel-comunicacion-funcionarios-v1":      "👥 Funcionarios",
    "panel-comunicacion-contactos-medios-v1":  "📰 Contactos de medios",
    "panel-comunicacion-publicaciones-v1":     "📅 Publicaciones (locales)",
    "ct_medios_v2":     "📰 Contactos medios (v2 antigua)",
    "panelContactos":   "📞 Contactos del panel",
    "entrevistas":      "🎙 Entrevistas",
    "guardOverrides":   "🛡 Sobreescrituras de guardia",
    "_guardiaNotif":    "🔔 Notificaciones de guardia",
    "rec_v1":           "🗂 Recursos del equipo",
    "panelPass":        "🔑 Contraseña del panel",
    "darkMode":         "🌙 Preferencia tema"
  };

  // ─── 1. RECOLECCIÓN ───────────────────────────────────────
  function recolectarBackup(){
    var data = {
      meta: {
        timestamp: new Date().toISOString(),
        backupVersion: BK_VERSION,
        appVersion: (function(){
          var m = document.querySelector('meta[name="app-version"]');
          return m ? m.content : "desconocida";
        })(),
        url: location.href,
        userAgent: navigator.userAgent.substring(0, 120)
      },
      localStorage: {}
    };

    // Recorremos TODAS las claves (no solo las conocidas) por si hay
    // datos de versiones nuevas que todavía no documentamos.
    for(var i = 0; i < localStorage.length; i++){
      var k = localStorage.key(i);
      try { data.localStorage[k] = localStorage.getItem(k); }
      catch(_){ data.localStorage[k] = null; }
    }
    return data;
  }

  // ─── 2. DESCARGA ──────────────────────────────────────────
  function descargarBackup(){
    try {
      var data = recolectarBackup();
      var json = JSON.stringify(data, null, 2);
      var blob = new Blob([json], { type: "application/json" });
      var url  = URL.createObjectURL(blob);
      var fecha = new Date().toISOString().substring(0,10);
      var hora  = new Date().toTimeString().substring(0,5).replace(":","h");
      var a = document.createElement("a");
      a.href = url;
      a.download = "backup-panel-comunicacion-" + fecha + "-" + hora + ".json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);

      m2Toast("✓ Backup descargado (" + Object.keys(data.localStorage).length + " claves)", "ok");
    } catch(err){
      m2Toast("Error al generar backup: " + err.message, "err");
      console.error("[mejoras2/backup]", err);
    }
  }

  // ─── 3. PREVIEW ──────────────────────────────────────────
  function previewBackup(){
    var data = recolectarBackup();
    var keys = Object.keys(data.localStorage);
    var conocidas = [], desconocidas = [];

    keys.forEach(function(k){
      var v = data.localStorage[k] || "";
      var bytes = new Blob([v]).size;
      var sizeStr = bytes < 1024 ? bytes + " B" : (bytes/1024).toFixed(1) + " KB";

      // Si es un JSON array, mostrar cuántos items tiene
      var count = "";
      try {
        var p = JSON.parse(v);
        if(Array.isArray(p)) count = " · " + p.length + " items";
      } catch(_){}

      var entrada = { k: k, sizeStr: sizeStr, count: count, etiq: CLAVES_CONOCIDAS[k] || "" };
      if(CLAVES_CONOCIDAS[k]) conocidas.push(entrada);
      else desconocidas.push(entrada);
    });

    abrirModalPreview(conocidas, desconocidas, data.meta);
  }

  function abrirModalPreview(conocidas, desconocidas, meta){
    // Quitar modal previo si quedó
    var old = document.getElementById("m2-modal-bk");
    if(old) old.remove();

    var html =
      '<div id="m2-modal-bk" style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,sans-serif">' +
        '<div style="background:#fff;border-radius:12px;max-width:580px;width:100%;max-height:85vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.3)">' +

          // Header
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">' +
            '<div>' +
              '<div style="font-size:16px;font-weight:700;color:#111827">📦 Contenido del backup</div>' +
              '<div style="font-size:12px;color:#6b7280;margin-top:3px">' +
                meta.timestamp.substring(0,16).replace("T"," ") +
                ' · app ' + escH(meta.appVersion) +
              '</div>' +
            '</div>' +
            '<button onclick="document.getElementById(\'m2-modal-bk\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;padding:0 4px;line-height:1">×</button>' +
          '</div>' +

          // Body
          '<div style="padding:18px 22px">' +
            (conocidas.length > 0 ?
              '<div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:10px">Datos del panel (' + conocidas.length + ')</div>' +
              conocidas.map(function(e){
                return '<div style="padding:9px 12px;background:#f9fafb;border-radius:6px;margin-bottom:5px;display:flex;justify-content:space-between;gap:10px;font-size:12px;align-items:center">' +
                  '<div style="flex:1;min-width:0">' +
                    '<div style="font-weight:600;color:#111827">' + escH(e.etiq) + '</div>' +
                    '<div style="color:#6b7280;font-family:ui-monospace,monospace;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px">' + escH(e.k) + '</div>' +
                  '</div>' +
                  '<div style="color:#6b7280;text-align:right;flex-shrink:0;font-size:11px">' + escH(e.sizeStr + e.count) + '</div>' +
                '</div>';
              }).join("")
            : '<div style="font-size:13px;color:#9ca3af;text-align:center;padding:10px 0">No se detectaron datos del panel guardados localmente.</div>') +

            (desconocidas.length > 0 ?
              '<div style="font-size:13px;font-weight:600;color:#111827;margin:16px 0 8px">Otras claves (' + desconocidas.length + ')</div>' +
              '<div style="font-size:11px;color:#6b7280;margin-bottom:8px">Claves no identificadas — pueden ser de otras versiones o de otras apps del mismo dominio.</div>' +
              desconocidas.map(function(e){
                return '<div style="padding:7px 11px;background:#fef3c7;border-radius:6px;margin-bottom:4px;display:flex;justify-content:space-between;gap:10px;font-size:11px">' +
                  '<div style="font-family:ui-monospace,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">' + escH(e.k) + '</div>' +
                  '<div style="color:#92400e;flex-shrink:0">' + escH(e.sizeStr + e.count) + '</div>' +
                '</div>';
              }).join("")
            : '') +
          '</div>' +

          // Footer
          '<div style="padding:14px 22px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'m2-modal-bk\').remove()" style="padding:8px 16px;background:#fff;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:13px;font-family:inherit;color:#374151">Cerrar</button>' +
            '<button id="m2-modal-bk-dl" style="padding:8px 16px;background:#1e1b4b;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit">⬇ Descargar JSON</button>' +
          '</div>' +

        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML("beforeend", html);

    // Listener del botón Descargar
    var btnDl = document.getElementById("m2-modal-bk-dl");
    if(btnDl) btnDl.addEventListener("click", function(){
      descargarBackup();
      var m = document.getElementById("m2-modal-bk");
      if(m) m.remove();
    });
  }

  // ─── 4. RESTAURAR ────────────────────────────────────────
  function restaurarBackup(){
    var aviso = "⚠️ RESTAURAR BACKUP\n\n" +
                "Esto SOBRESCRIBE los datos guardados en este navegador con los del archivo.\n" +
                "NO toca Supabase: las tareas/reclamos del servidor siguen igual.\n\n" +
                "Recomendación: descargá primero un backup actual por si después querés volver.\n\n" +
                "¿Continuar?";
    if(!confirm(aviso)) return;

    var input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = function(e){
      var file = e.target.files && e.target.files[0];
      input.remove();
      if(!file) return;

      var reader = new FileReader();
      reader.onload = function(ev){
        try {
          var data = JSON.parse(ev.target.result);
          if(!data || !data.localStorage || typeof data.localStorage !== "object"){
            m2Toast("Archivo inválido: no parece un backup del panel", "err");
            return;
          }
          var nClaves = Object.keys(data.localStorage).length;
          var ts = (data.meta && data.meta.timestamp)
            ? data.meta.timestamp.substring(0,16).replace("T"," ")
            : "fecha desconocida";

          if(!confirm("Restaurar backup del " + ts + "?\n\n" +
                      "Se escribirán " + nClaves + " claves en localStorage.\n" +
                      "Después hay que RECARGAR la página.")) return;

          var ok = 0, fail = 0;
          Object.keys(data.localStorage).forEach(function(k){
            try {
              var v = data.localStorage[k];
              if(v === null || v === undefined) return;
              localStorage.setItem(k, v);
              ok++;
            } catch(_){ fail++; }
          });

          alert("✓ Restaurado: " + ok + " claves" +
                (fail ? " (" + fail + " fallaron)" : "") +
                "\n\nRecargá la página (F5) para ver los datos restaurados.");
        } catch(err){
          m2Toast("Error al leer el backup: " + err.message, "err");
          console.error("[mejoras2/backup] restore", err);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  // ─── 5. HELPERS ──────────────────────────────────────────
  function escH(s){
    return String(s || "").replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }

  function m2Toast(msg, tipo){
    // Usar el toast del panel si existe
    if(typeof window.toast === "function"){
      try { window.toast(msg, tipo); return; } catch(_){}
    }
    // Fallback propio
    var t = document.createElement("div");
    var col = tipo === "err" ? "#dc2626" : tipo === "ok" ? "#059669" : "#1e1b4b";
    t.style.cssText = "position:fixed;top:18px;left:50%;transform:translateX(-50%);" +
                      "background:" + col + ";color:#fff;padding:10px 18px;border-radius:8px;" +
                      "z-index:99999;font-size:13px;font-family:Inter,system-ui,sans-serif;" +
                      "box-shadow:0 4px 16px rgba(0,0,0,.25);max-width:90vw";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function(){
      t.style.opacity = "0";
      t.style.transition = "opacity .3s";
      setTimeout(function(){ t.remove(); }, 300);
    }, 2400);
  }

  // ─── 6. BOTÓN FLOTANTE ───────────────────────────────────
  function crearBotonBackup(){
    if(document.getElementById("m2-bk-wrap")) return;

    var wrap = document.createElement("div");
    wrap.id = "m2-bk-wrap";
    wrap.innerHTML =
      '<style>' +
        '#m2-bk-wrap{position:fixed;bottom:16px;right:16px;z-index:9990;font-family:Inter,system-ui,sans-serif}' +
        '#m2-bk-trig{background:#1e1b4b;color:#fff;border:none;border-radius:24px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.22);display:flex;align-items:center;gap:6px;font-family:inherit;transition:transform .15s,background .15s}' +
        '#m2-bk-trig:hover{background:#312e81;transform:translateY(-1px)}' +
        '#m2-bk-trig:active{transform:translateY(0)}' +
        '#m2-bk-menu{position:absolute;bottom:46px;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.15);padding:6px;min-width:230px;display:none}' +
        '#m2-bk-menu.open{display:block}' +
        '.m2-bk-mi{display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:9px 12px;border:none;background:none;font-size:13px;color:#111827;cursor:pointer;border-radius:6px;font-family:inherit}' +
        '.m2-bk-mi:hover{background:#f3f4f6}' +
        '.m2-bk-mi.danger{color:#dc2626}' +
        '.m2-bk-mi.danger:hover{background:#fef2f2}' +
        '.m2-bk-sep{height:1px;background:#e5e7eb;margin:4px 0}' +
        'body.dark #m2-bk-menu{background:#1f2937;border-color:#374151}' +
        'body.dark .m2-bk-mi{color:#e5e7eb}' +
        'body.dark .m2-bk-mi:hover{background:#374151}' +
        'body.dark .m2-bk-mi.danger:hover{background:#3f1d1d}' +
        'body.dark .m2-bk-sep{background:#374151}' +
        '@media(max-width:640px){#m2-bk-wrap{bottom:74px}}' +
      '</style>' +
      '<button id="m2-bk-trig" title="Backup y restauración de datos del navegador">💾 Backup</button>' +
      '<div id="m2-bk-menu" role="menu">' +
        '<button class="m2-bk-mi" data-act="preview">👁️ Ver qué hay guardado</button>' +
        '<button class="m2-bk-mi" data-act="download">⬇️ Descargar backup</button>' +
        '<div class="m2-bk-sep"></div>' +
        '<button class="m2-bk-mi danger" data-act="restore">📤 Restaurar desde archivo</button>' +
      '</div>';

    document.body.appendChild(wrap);

    var trig = wrap.querySelector("#m2-bk-trig");
    var menu = wrap.querySelector("#m2-bk-menu");

    trig.addEventListener("click", function(e){
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", function(e){
      if(!wrap.contains(e.target)) menu.classList.remove("open");
    });

    menu.querySelectorAll(".m2-bk-mi").forEach(function(b){
      b.addEventListener("click", function(){
        menu.classList.remove("open");
        var a = b.getAttribute("data-act");
        if(a === "download") descargarBackup();
        else if(a === "preview") previewBackup();
        else if(a === "restore") restaurarBackup();
      });
    });
  }

  // ─── 7. EXPONER API + INICIALIZAR ────────────────────────
  window.m2 = window.m2 || {};
  window.m2.backup = {
    download: descargarBackup,
    preview:  previewBackup,
    restore:  restaurarBackup,
    collect:  recolectarBackup
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", crearBotonBackup);
  } else {
    // El DOM ya está listo (mejoras1 se carga con defer también)
    crearBotonBackup();
  }

  console.log("[mejoras2] F0 backup listo. API disponible en window.m2.backup");

  // ============================================================
  // FIN FASE 0
  // ============================================================



  // ============================================================
  // FASE 1 — TIMELINE UNIFICADA + BOTONES RÁPIDOS + DESACTIVAR BRIEFING
  // ============================================================
  //
  // Esta fase modifica visualmente el panel HOY (renderizado por
  // mejoras1.js como #m1-panel-hoy) sin tocar mejoras1 ni index.html.
  //
  // Cambios:
  //   1. Desactiva el modal "Briefing" (modBriefing) que salta auto
  //      a los 1.8s. Los datos que mostraba ya están en la home.
  //   2. Agrega 2 botones rápidos arriba de la home:
  //        ➕ Nueva tarea           → abre openTaskMod() del panel
  //        📲 Enviar guardias por WA → modal con mensaje editable
  //   3. Reemplaza las cards "Agenda del día" + "Publicaciones de hoy"
  //      por UNA timeline vertical unificada ordenada por hora.
  //   4. Mantiene intactas: card "Guardia del día" y "Tareas urgentes".
  //
  // Si algo falla, se quita el <script> de mejoras2.js y vuelve todo
  // al estado anterior.
  // ============================================================

  // ─── F1.1 — DESACTIVAR MODAL BRIEFING ─────────────────────
  function desactivarBriefing(){
    if(document.getElementById("m2-css-no-briefing")) return;

    // CSS: oculta el modal aunque alguien lo abra
    var s = document.createElement("style");
    s.id = "m2-css-no-briefing";
    s.textContent =
      "#modBriefing{display:none!important;visibility:hidden!important;" +
      "pointer-events:none!important;opacity:0!important}";
    document.head.appendChild(s);

    // JS: neutralizar la función por si alguien la llama manualmente
    try { window.abrirBriefing = function(){}; } catch(_){}

    // Si el briefing ya se abrió antes de que cargáramos, cerrarlo
    setTimeout(function(){
      try {
        if(typeof window.closeBriefing === "function") window.closeBriefing();
        var m = document.getElementById("modBriefing");
        if(m) { m.classList.remove("open"); m.style.display = "none"; }
      } catch(_){}
    }, 100);

    console.log("[mejoras2] F1 briefing desactivado");
  }

  // ─── F1.2 — CARGAR ITEMS DEL DÍA (eventos + publicaciones) ─
  function cargarItemsDelDia(){
    var hoyStr = new Date().toISOString().substring(0,10);
    var items = [];
    var seenEv = {}, seenPub = {};

    // [a] Eventos del calendario (agendas locales + Google Cal)
    try {
      var srcEv = [];
      if(typeof window.agendas !== "undefined" && Array.isArray(window.agendas))
        srcEv = srcEv.concat(window.agendas);
      if(typeof window.gcalEvs !== "undefined" && Array.isArray(window.gcalEvs))
        srcEv = srcEv.concat(window.gcalEvs);

      srcEv.forEach(function(ev){
        if(!ev || String(ev.fecha || "").slice(0,10) !== hoyStr || ev.cancelado) return;
        if(ev.tipo === "entrevista") return; // las entrevistas tienen su propio bloque
        var k = (ev.descripcion || "").slice(0,30) + "|" + (ev.hora || "");
        if(seenEv[k]) return;
        seenEv[k] = 1;
        items.push({
          kind: "evento",
          hora: ev.hora || "",
          desc: ev.descripcion || "",
          lugar: ev.lugar || "",
          subtipo: ev.tipo || ""
        });
      });
    } catch(e){ console.warn("[m2/F1] eventos:", e); }

    // [b] Publicaciones — combina TODAS las fuentes posibles:
    //   - window.pubs        : tabla publicaciones de Supabase (panel original)
    //   - localStorage 'panel-comunicacion-publicaciones-v1' (mejoras1)
    //   - window._publicacionesCache (cache interno de mejoras1, si está expuesto)
    try {
      var srcPubs = [];
      if(Array.isArray(window.pubs)) srcPubs = srcPubs.concat(window.pubs);

      try {
        var raw = localStorage.getItem("panel-comunicacion-publicaciones-v1");
        var local = raw ? JSON.parse(raw) : [];
        if(Array.isArray(local)) srcPubs = srcPubs.concat(local);
      } catch(_){}

      if(Array.isArray(window._publicacionesCache)){
        srcPubs = srcPubs.concat(window._publicacionesCache);
      }

      srcPubs.forEach(function(p){
        if(!p) return;
        if(String(p.fecha || "").slice(0,10) !== hoyStr) return;
        var k = (p.descripcion || "").slice(0,40) + "|" + (p.hora || "");
        if(seenPub[k]) return;
        seenPub[k] = 1;
        var rNames = (p.redes || [p.red]).filter(Boolean).join(", ");
        items.push({
          kind: "publicacion",
          hora: p.hora || "",
          desc: p.descripcion || "",
          responsable: p.responsable || "",
          redes: rNames
        });
      });
    } catch(e){ console.warn("[m2/F1] pubs:", e); }

    // [d] Ordenar por hora ascendente
    items.sort(function(a, b){
      return (a.hora || "99:99").localeCompare(b.hora || "99:99");
    });

    return items;
  }

  // ─── F1.3 — RENDER DE LA TIMELINE ─────────────────────────
  function renderTimelineHTML(items){
    if(items.length === 0){
      return '' +
        '<div class="m2-card-hoy" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;margin-bottom:16px">' +
          '<div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:10px">📋 Hoy</div>' +
          '<div style="font-size:13px;color:#9ca3af;text-align:center;padding:18px 0">Sin actividades ni publicaciones programadas para hoy</div>' +
        '</div>';
    }

    var eventIco = {
      prensa:      { ico: "📻", col: "#ec4899" },
      municipal:   { ico: "🏛", col: "#22c55e" },
      publicacion: { ico: "📱", col: "#8b5cf6" }
    };
    var defaultEv = { ico: "🗓", col: "#3b82f6" };
    var pubIco    = { ico: "📱", col: "#8b5cf6" };

    var html =
      '<div class="m2-card-hoy" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;margin-bottom:16px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<div style="font-size:14px;font-weight:700;color:#111827">📋 Hoy ' +
            '<span style="font-size:11px;color:#6b7280;font-weight:500">(' + items.length + ' ' + (items.length === 1 ? "actividad" : "actividades") + ')</span>' +
          '</div>' +
          '<button onclick="if(typeof nav===\'function\')nav(\'calendario\')" style="font-size:11px;padding:5px 11px;background:#ede9fe;color:#6d28d9;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-family:inherit">Ver calendario →</button>' +
        '</div>' +
        '<div class="m2-timeline" style="position:relative;padding-left:14px;border-left:2px dashed #e5e7eb">';

    items.forEach(function(it){
      var hora = it.hora ? String(it.hora).substring(0,5) : "—";
      var ico, col;
      if(it.kind === "evento"){
        var et = eventIco[it.subtipo] || defaultEv;
        ico = et.ico; col = et.col;
      } else {
        ico = pubIco.ico; col = pubIco.col;
      }

      var subtxt = "";
      if(it.kind === "publicacion"){
        if(it.redes) subtxt += "[" + escH(it.redes) + "]";
        if(it.responsable) subtxt += (subtxt ? " · " : "") + escH(it.responsable);
      } else if(it.lugar){
        subtxt = "📍 " + escH(it.lugar);
      }

      html +=
        '<div class="m2-tl-item" style="position:relative;padding:6px 0 12px 18px">' +
          '<span style="position:absolute;left:-23px;top:5px;width:16px;height:16px;border-radius:50%;background:' + col + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;border:2px solid #fff;box-shadow:0 0 0 1px ' + col + '">' + ico + '</span>' +
          '<div style="display:flex;gap:10px;align-items:flex-start">' +
            '<span style="font-weight:700;color:' + col + ';font-size:13px;min-width:46px;font-family:ui-monospace,SFMono-Regular,monospace">' + escH(hora) + '</span>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-size:13px;color:#111827;line-height:1.45">' + escH(it.desc).substring(0,160) + '</div>' +
              (subtxt ? '<div style="font-size:11px;color:#6b7280;margin-top:3px">' + subtxt + '</div>' : "") +
            '</div>' +
          '</div>' +
        '</div>';
    });

    html += '</div></div>';
    return html;
  }

  // ─── F1.4 — BOTONES RÁPIDOS (HTML + ESTILOS) ──────────────
  function renderBotonesRapidosHTML(){
    return '' +
      '<div id="m2-quick-actions" style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">' +
        '<button class="m2-qa-btn m2-qa-primary" onclick="window.m2.actions.nuevaTarea()">' +
          '<span style="font-size:16px;line-height:1">➕</span>' +
          '<span>Nueva tarea</span>' +
        '</button>' +
        '<button class="m2-qa-btn m2-qa-wa" onclick="window.m2.actions.enviarGuardias()">' +
          '<span style="font-size:16px;line-height:1">📲</span>' +
          '<span>Enviar guardias por WhatsApp</span>' +
        '</button>' +
      '</div>';
  }

  function inyectarEstilosF1(){
    if(document.getElementById("m2-css-f1")) return;
    var s = document.createElement("style");
    s.id = "m2-css-f1";
    s.textContent =
      ".m2-qa-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:10px;border:none;cursor:pointer;font-size:13px;font-weight:600;font-family:Inter,system-ui,sans-serif;transition:transform .15s,box-shadow .15s,background .15s;flex:1;min-width:180px;justify-content:center}" +
      ".m2-qa-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.14)}" +
      ".m2-qa-btn:active{transform:translateY(0)}" +
      ".m2-qa-primary{background:#1e1b4b;color:#fff}" +
      ".m2-qa-primary:hover{background:#312e81}" +
      ".m2-qa-wa{background:#25D366;color:#fff}" +
      ".m2-qa-wa:hover{background:#1faf57}" +
      "body.dark .m2-qa-primary{background:#4338ca}" +
      "body.dark .m2-qa-primary:hover{background:#6366f1}" +
      "body.dark .m2-card-hoy{background:#1f2937!important;border-color:#374151!important;color:#e5e7eb}" +
      "body.dark .m2-card-hoy *{color:inherit}" +
      "body.dark .m2-timeline{border-left-color:#374151!important}" +
      "@media(max-width:640px){.m2-qa-btn{min-width:100%}}";
    document.head.appendChild(s);
  }

  // ─── F1.5 — APLICAR MEJORAS AL PANEL HOY ──────────────────
  function aplicarMejorasHoy(){
    var panelHoy = document.getElementById("m1-panel-hoy");
    if(!panelHoy) return;
    if(panelHoy.getAttribute("data-m2f1") === "1") {
      // Ya se aplicaron los cambios estructurales; solo refrescar timeline
      rerenderTimeline();
      return;
    }
    panelHoy.setAttribute("data-m2f1", "1");

    try {
      // [1] Insertar botones rápidos después del header oscuro
      var header = panelHoy.querySelector('div[style*="linear-gradient"]');
      if(header && header.parentNode === panelHoy){
        var divBotones = document.createElement("div");
        divBotones.innerHTML = renderBotonesRapidosHTML();
        var btnNode = divBotones.firstChild;
        if(btnNode) header.parentNode.insertBefore(btnNode, header.nextSibling);
      }

      // [2] Buscar las cards de Agenda del día y Publicaciones de hoy
      var cards = panelHoy.querySelectorAll('div[style*="background:#fff"]');
      var cardAgenda = null, cardPubs = null;
      cards.forEach(function(c){
        var txt = c.textContent || "";
        if(/Agenda del d[ií]a/.test(txt) && !cardAgenda) cardAgenda = c;
        else if(/Publicaciones de hoy/.test(txt) && !cardPubs) cardPubs = c;
      });

      // [3] Construir timeline y reemplazar la card "Agenda del día"
      if(cardAgenda){
        var items = cargarItemsDelDia();
        var timelineHTML = renderTimelineHTML(items);
        var temp = document.createElement("div");
        temp.innerHTML = timelineHTML;
        var newCard = temp.firstChild;
        if(newCard) cardAgenda.parentNode.replaceChild(newCard, cardAgenda);
      }

      // [4] Ocultar "Publicaciones de hoy" (ya está integrada en timeline)
      //     y hacer que la card de Guardia ocupe ancho completo.
      if(cardPubs){
        cardPubs.style.display = "none";
        var gridPadre = cardPubs.parentNode;
        if(gridPadre && gridPadre.style && /1fr 1fr/.test(gridPadre.style.gridTemplateColumns || "")){
          gridPadre.style.gridTemplateColumns = "1fr";
        }
      }

      // [5] Iniciar poller para re-renderizar cuando lleguen datos async
      //     (loadAll() de Supabase puede tardar 1-3 segundos)
      iniciarPollerTimeline();
    } catch(e){
      console.warn("[mejoras2/F1] aplicarMejorasHoy fallo:", e);
      panelHoy.removeAttribute("data-m2f1");
    }
  }

  // ─── F1.5b — RE-RENDER LIVIANO DE LA TIMELINE ─────────────
  // Vuelve a renderizar SOLO la timeline (no los botones ni la estructura)
  // cuando los datos async terminan de cargar. Compara firmas para no
  // re-renderizar de gusto.
  function rerenderTimeline(){
    var panelHoy = document.getElementById("m1-panel-hoy");
    if(!panelHoy) return;

    // Si el panel HOY no está visible (otra pestaña activa), saltar
    if(panelHoy.offsetParent === null) return;

    var oldTimeline = panelHoy.querySelector(".m2-card-hoy");
    if(!oldTimeline) return; // estructura todavía no aplicada

    var items = cargarItemsDelDia();

    // Firma para detectar cambios reales (evita parpadeo)
    var sig = items.length + ":" + items.map(function(i){
      return i.kind.charAt(0) + (i.hora || "") + (i.desc || "").substring(0,25);
    }).join("|");

    if(panelHoy.getAttribute("data-m2-sig") === sig) return;
    panelHoy.setAttribute("data-m2-sig", sig);

    var temp = document.createElement("div");
    temp.innerHTML = renderTimelineHTML(items);
    var newCard = temp.firstChild;
    if(newCard) oldTimeline.parentNode.replaceChild(newCard, oldTimeline);
  }

  // Poller liviano: cada 2s mira si hay cambios mientras HOY está visible.
  // Se detiene solo si la pestaña se va a background.
  var _m2Poller = null;
  function iniciarPollerTimeline(){
    if(_m2Poller) return;
    _m2Poller = setInterval(function(){
      // No correr si pestaña en background (evitar consumo)
      if(document.hidden) return;
      rerenderTimeline();
    }, 2000);
  }

  // ─── F1.6 — OBSERVER PARA DETECTAR RE-RENDERS ─────────────
  function iniciarObserverF1(){
    // Aplicación inmediata si ya existe
    if(document.getElementById("m1-panel-hoy")) aplicarMejorasHoy();

    var mo = new MutationObserver(function(muts){
      for(var i = 0; i < muts.length; i++){
        var m = muts[i];
        for(var j = 0; j < m.addedNodes.length; j++){
          var n = m.addedNodes[j];
          if(n.nodeType !== 1) continue;
          if(n.id === "m1-panel-hoy" ||
             (n.querySelector && n.querySelector("#m1-panel-hoy"))){
            // Pequeño delay para que mejoras1 termine de renderizar todo
            setTimeout(aplicarMejorasHoy, 50);
            return;
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // ─── F1.7 — ACCIONES DE BOTONES RÁPIDOS ───────────────────
  function accionNuevaTarea(){
    if(typeof window.openTaskMod === "function"){
      try { window.openTaskMod(); return; }
      catch(e){ console.warn("[m2] openTaskMod fallo:", e); }
    }
    // Fallback: navegar al tablero
    if(typeof window.nav === "function"){
      try { window.nav("tablero"); return; } catch(_){}
    }
    m2Toast("No se pudo abrir el formulario de nueva tarea", "err");
  }

  function accionEnviarGuardias(){
    // 1. Detectar guardia del día
    var hoyStr = new Date().toISOString().substring(0,10);
    var guardia = [];
    try {
      if(typeof window.getGuardia === "function"){
        guardia = window.getGuardia(hoyStr) || [];
      }
    } catch(e){ console.warn("[m2]", e); }

    if(!guardia.length || !guardia[0]){
      m2Toast("No hay guardia asignada para hoy. Asignala desde la sección Guardias.", "err");
      return;
    }

    var titular = guardia[0];
    var soporte = guardia[1] || "";

    // 2. Obtener teléfonos
    var telTitular = "", telSoporte = "";
    try {
      if(typeof window._tdGetTel === "function"){
        telTitular = window._tdGetTel(titular);
        if(soporte) telSoporte = window._tdGetTel(soporte);
      }
    } catch(e){ console.warn("[m2]", e); }

    if(!telTitular){
      m2Toast("Sin teléfono cargado para " + titular + ". Cargalo en la sección Equipo.", "err");
      return;
    }

    // 3. Armar datos para el resumen
    var items = cargarItemsDelDia();
    var nEventos = items.filter(function(i){ return i.kind === "evento"; }).length;
    var nPubs    = items.filter(function(i){ return i.kind === "publicacion"; }).length;

    var nUrgentes = 0;
    try {
      if(Array.isArray(window._tareasGlobalCache)){
        nUrgentes = window._tareasGlobalCache.filter(function(t){
          return /alta|urgent/i.test(t.prioridad || "") &&
                 /pendiente|proceso/i.test(t.estado || "");
        }).length;
      }
    } catch(_){}

    var hoy = new Date();
    var dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    var fechaFmt = dias[hoy.getDay()] + " " +
                   String(hoy.getDate()).padStart(2,"0") + "/" +
                   String(hoy.getMonth()+1).padStart(2,"0") + "/" +
                   hoy.getFullYear();

    abrirModalEnviarGuardias({
      titular: titular, soporte: soporte,
      telTitular: telTitular, telSoporte: telSoporte,
      fechaFmt: fechaFmt,
      nEventos: nEventos, nPubs: nPubs, nUrgentes: nUrgentes,
      items: items
    });
  }

  function abrirModalEnviarGuardias(data){
    // Mensaje sugerido para titular
    var msgTit = "🛡 *Guardia del día* — " + data.fechaFmt + "\n\n" +
      "Hola " + data.titular + ", sos la guardia *titular* hoy." +
      (data.soporte ? "\nSoporte: " + data.soporte : "") + "\n\n" +
      "📅 Resumen del día:\n" +
      "• " + data.nEventos + " evento" + (data.nEventos === 1 ? "" : "s") + " en agenda\n" +
      "• " + data.nPubs + " publicación" + (data.nPubs === 1 ? "" : "es") + " programada" + (data.nPubs === 1 ? "" : "s") + "\n" +
      "• " + data.nUrgentes + " tarea" + (data.nUrgentes === 1 ? "" : "s") + " urgente" + (data.nUrgentes === 1 ? "" : "s") + " pendiente" + (data.nUrgentes === 1 ? "" : "s") + "\n\n";

    if(data.items.length > 0){
      msgTit += "🕐 Cronograma:\n";
      data.items.slice(0, 10).forEach(function(it){
        var ico = it.kind === "evento" ? "🗓" : "📱";
        var hora = (it.hora || "--:--").substring(0,5);
        var desc = (it.desc || "").substring(0, 70);
        msgTit += ico + " " + hora + " — " + desc + "\n";
      });
      if(data.items.length > 10) msgTit += "... y " + (data.items.length - 10) + " más\n";
      msgTit += "\n";
    }

    msgTit += "Cualquier urgencia, avisar al equipo.\n— Comunicación · Municipalidad de Tres Arroyos";

    // Mensaje sugerido para soporte (más corto)
    var msgSop = "";
    if(data.soporte){
      msgSop = "🛡 *Guardia hoy* — " + data.fechaFmt + "\n\n" +
        "Hola " + data.soporte + ", sos el *soporte* de la guardia hoy.\n" +
        "Titular: " + data.titular + ".\n\n" +
        "Te paso por si necesitamos coordinar algo durante el día.\n" +
        "— Comunicación · Municipalidad de Tres Arroyos";
    }

    // Construir modal
    var old = document.getElementById("m2-modal-gd");
    if(old) old.remove();

    var html =
      '<div id="m2-modal-gd" style="position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,sans-serif">' +
        '<div style="background:#fff;border-radius:12px;max-width:580px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.3)">' +

          // Header
          '<div style="padding:18px 22px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">' +
            '<div>' +
              '<div style="font-size:16px;font-weight:700;color:#111827">📲 Enviar guardia por WhatsApp</div>' +
              '<div style="font-size:12px;color:#6b7280;margin-top:3px">' + escH(data.fechaFmt) + '</div>' +
            '</div>' +
            '<button onclick="document.getElementById(\'m2-modal-gd\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;padding:0 4px;line-height:1">×</button>' +
          '</div>' +

          // Body
          '<div style="padding:18px 22px">' +
            // Card titular
            '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:11px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:10px">' +
              '<div>' +
                '<div style="font-size:10px;color:#15803d;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Titular</div>' +
                '<div style="font-size:14px;font-weight:600;color:#111827;margin-top:2px">' + escH(data.titular) + '</div>' +
                '<div style="font-size:11px;color:#6b7280;font-family:ui-monospace,monospace">+' + escH(data.telTitular) + '</div>' +
              '</div>' +
              '<span style="background:#22c55e;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:600">✓ WhatsApp</span>' +
            '</div>' +

            // Mensaje titular (editable)
            '<div style="margin-bottom:14px">' +
              '<label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:6px">Mensaje para titular</label>' +
              '<textarea id="m2-gd-msg-tit" style="width:100%;min-height:170px;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:#111827;resize:vertical;box-sizing:border-box;line-height:1.5">' + escH(msgTit) + '</textarea>' +
            '</div>' +

            // Card soporte
            (data.soporte ?
              '<div style="background:' + (data.telSoporte ? "#fef3c7" : "#f3f4f6") + ';border:1px solid ' + (data.telSoporte ? "#fcd34d" : "#d1d5db") + ';border-radius:8px;padding:11px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:10px">' +
                '<div>' +
                  '<div style="font-size:10px;color:' + (data.telSoporte ? "#92400e" : "#6b7280") + ';font-weight:700;text-transform:uppercase;letter-spacing:.05em">Soporte</div>' +
                  '<div style="font-size:14px;font-weight:600;color:#111827;margin-top:2px">' + escH(data.soporte) + '</div>' +
                  '<div style="font-size:11px;color:#6b7280;font-family:ui-monospace,monospace">' + (data.telSoporte ? "+" + escH(data.telSoporte) : "Sin teléfono cargado") + '</div>' +
                '</div>' +
                (data.telSoporte
                  ? '<span style="background:#22c55e;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:600">✓ WhatsApp</span>'
                  : '<span style="background:#9ca3af;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:600">Sin tel.</span>') +
              '</div>' +
              (data.telSoporte ?
                '<div style="margin-bottom:8px">' +
                  '<label style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:6px">Mensaje para soporte</label>' +
                  '<textarea id="m2-gd-msg-sop" style="width:100%;min-height:90px;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:#111827;resize:vertical;box-sizing:border-box;line-height:1.5">' + escH(msgSop) + '</textarea>' +
                '</div>' : '')
              : '') +

            // Aviso
            '<div style="font-size:11px;color:#6b7280;margin-top:10px;padding:8px 11px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb">' +
              'ℹ️ Se abrirá WhatsApp Web en una pestaña nueva (o dos si hay soporte con teléfono). Si el navegador bloquea pop-ups, permitilos.' +
            '</div>' +
          '</div>' +

          // Footer
          '<div style="padding:14px 22px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:8px">' +
            '<button onclick="document.getElementById(\'m2-modal-gd\').remove()" style="padding:9px 16px;background:#fff;border:1px solid #d1d5db;border-radius:7px;cursor:pointer;font-size:13px;font-family:inherit;color:#374151">Cancelar</button>' +
            '<button id="m2-gd-send" style="padding:9px 18px;background:#25D366;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit">📲 Abrir WhatsApp</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML("beforeend", html);

    document.getElementById("m2-gd-send").addEventListener("click", function(){
      // Recuperar textos editados
      var msgT = (document.getElementById("m2-gd-msg-tit") || {}).value || msgTit;
      var sopEl = document.getElementById("m2-gd-msg-sop");
      var msgS = sopEl ? (sopEl.value || msgSop) : "";

      // Abrir WhatsApp titular
      var urlT = "https://wa.me/" + data.telTitular + "?text=" + encodeURIComponent(msgT);
      window.open(urlT, "_blank", "noopener,noreferrer");

      // Abrir WhatsApp soporte (con leve delay para evitar bloqueo de pop-up)
      if(data.telSoporte && msgS){
        setTimeout(function(){
          var urlS = "https://wa.me/" + data.telSoporte + "?text=" + encodeURIComponent(msgS);
          window.open(urlS, "_blank", "noopener,noreferrer");
        }, 600);
      }

      var modal = document.getElementById("m2-modal-gd");
      if(modal) modal.remove();
      m2Toast("✓ WhatsApp abierto" + (data.telSoporte ? " (titular + soporte)" : ""), "ok");
    });
  }

  // ─── F1.8 — INICIALIZACIÓN ───────────────────────────────
  function iniciarF1(){
    inyectarEstilosF1();
    desactivarBriefing();
    iniciarObserverF1();

    // Exponer acciones
    window.m2.actions = {
      nuevaTarea:     accionNuevaTarea,
      enviarGuardias: accionEnviarGuardias
    };

    // Re-aplicar cuando se hace clic en tab "Hoy" (puede re-renderizar)
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;
      var txt = (t.textContent || "").toLowerCase();
      if(/^\s*(hoy|🏠)/.test(txt) || (t.getAttribute && /hoy/.test(t.getAttribute("onclick") || ""))){
        setTimeout(function(){
          var p = document.getElementById("m1-panel-hoy");
          if(p){
            p.removeAttribute("data-m2f1");
            aplicarMejorasHoy();
          }
        }, 200);
      }
    }, true);

    console.log("[mejoras2] F1 timeline + botones rápidos listo");
  }

  // Iniciar F1 con delay leve para dar tiempo a que mejoras1 cargue datos
  function bootF1(){
    // Esperar a que el DOM esté listo
    var fn = function(){ setTimeout(iniciarF1, 600); };
    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }
  bootF1();

  // ============================================================
  // FIN FASE 1
  // ============================================================

})();
