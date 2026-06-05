const DEFAULT_FOLDER_ID = '1A8PB1xKxivZl_Jd6Q2HLI_nITsgwq54f';
const STATE_FILE_NAME = 'panel-comunicacion-state.json';

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (payload.action === 'upload') {
      return handleUpload(payload);
    }
    if (payload.action === 'save_state') {
      return handleSaveState(payload);
    }
    if (payload.action === 'load_state') {
      return handleLoadState(payload);
    }
    if (payload.action === 'state_meta') {
      return handleStateMeta(payload);
    }

    return jsonOutput({ ok: false, error: 'Accion no soportada' });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return jsonOutput({ ok: true, app: 'Panel Comunicacion Drive bridge' });
}

function handleUpload(payload) {
  const folder = DriveApp.getFolderById(payload.folderId || DEFAULT_FOLDER_ID);
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
}

function handleSaveState(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const folder = DriveApp.getFolderById(payload.folderId || DEFAULT_FOLDER_ID);
    const filename = cleanFileName(payload.filename || STATE_FILE_NAME);
    const doc = {
      ok: true,
      updatedAt: new Date().toISOString(),
      updatedBy: payload.updatedBy || '',
      value: payload.value || {}
    };
    const content = JSON.stringify(doc);
    const existing = folder.getFilesByName(filename);
    let file;
    if (existing.hasNext()) {
      file = existing.next();
      file.setContent(content);
    } else {
      file = folder.createFile(filename, content, MimeType.PLAIN_TEXT);
    }
    return jsonOutput({
      ok: true,
      id: file.getId(),
      name: file.getName(),
      updatedAt: doc.updatedAt,
      updatedBy: doc.updatedBy
    });
  } finally {
    lock.releaseLock();
  }
}

function handleLoadState(payload) {
  const folder = DriveApp.getFolderById(payload.folderId || DEFAULT_FOLDER_ID);
  const filename = cleanFileName(payload.filename || STATE_FILE_NAME);
  const existing = folder.getFilesByName(filename);
  if (!existing.hasNext()) {
    return jsonOutput({ ok: true, value: null });
  }
  const file = existing.next();
  const doc = JSON.parse(file.getBlob().getDataAsString() || '{}');
  return jsonOutput({
    ok: true,
    id: file.getId(),
    name: file.getName(),
    updatedAt: doc.updatedAt || file.getLastUpdated().toISOString(),
    updatedBy: doc.updatedBy || '',
    value: doc.value || null
  });
}

function handleStateMeta(payload) {
  const folder = DriveApp.getFolderById(payload.folderId || DEFAULT_FOLDER_ID);
  const filename = cleanFileName(payload.filename || STATE_FILE_NAME);
  const existing = folder.getFilesByName(filename);
  if (!existing.hasNext()) {
    return jsonOutput({ ok: true, exists: false, updatedAt: null, updatedBy: '' });
  }
  const file = existing.next();
  let updatedBy = '';
  let updatedAt = file.getLastUpdated().toISOString();
  try {
    const doc = JSON.parse(file.getBlob().getDataAsString() || '{}');
    updatedBy = doc.updatedBy || '';
    updatedAt = doc.updatedAt || updatedAt;
  } catch (err) {}
  return jsonOutput({
    ok: true,
    exists: true,
    id: file.getId(),
    name: file.getName(),
    updatedAt: updatedAt,
    updatedBy: updatedBy
  });
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