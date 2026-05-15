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

})();
