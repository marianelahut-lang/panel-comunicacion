const DEFAULT_FOLDER_ID = '1A8PB1xKxivZl_Jd6Q2HLI_nITsgwq54f';

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload.action !== 'upload') {
      return jsonOutput({ ok: false, error: 'Accion no soportada' });
    }

    const folderId = payload.folderId || DEFAULT_FOLDER_ID;
    const folder = DriveApp.getFolderById(folderId);
    const safeName = cleanFileName(payload.filename || ('archivo-' + Date.now()));
    const mimeType = payload.mimeType || 'application/octet-stream';
    const bytes = Utilities.base64Decode(payload.data || '');

    if (!bytes.length) {
      return jsonOutput({ ok: false, error: 'Archivo vacio' });
    }

    const subfolder = getOrCreateSubfolder(folder, payload.context || 'panel');
    const blob = Utilities.newBlob(bytes, mimeType, safeName);
    const file = subfolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return jsonOutput({
      ok: true,
      file: {
        id: file.getId(),
        name: file.getName(),
        mimeType: file.getMimeType(),
        webViewLink: file.getUrl(),
        downloadUrl: 'https://drive.google.com/uc?export=download&id=' + file.getId(),
        folderId: subfolder.getId()
      }
    });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return jsonOutput({ ok: true, app: 'Panel Comunicacion Drive bridge' });
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function cleanFileName(name) {
  return String(name)
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || ('archivo-' + Date.now());
}

function getOrCreateSubfolder(parent, name) {
  const folderName = cleanFileName(name || 'panel');
  const found = parent.getFoldersByName(folderName);
  if (found.hasNext()) return found.next();
  return parent.createFolder(folderName);
}
