// 音声タスク追加アプリ：受け取ったテキストを対象シートの2行目に新規タスクとして挿入する
const SPREADSHEET_ID = '1nZ5A991aTfNPNZdSDq2XWcUj55lMT7qhGkQCfD7P0s4';
const TARGET_SHEET_GID = 0;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const text = (body.text || '').trim();
    if (!text) {
      return jsonOutput_({ ok: false, error: 'empty text' });
    }
    const sheet = getTargetSheet_();
    sheet.insertRowBefore(2);
    sheet.getRange(2, 2, 1, 4).setValues([[0, 0, '01_TODO', text]]);
    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function getTargetSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_SHEET_GID) return sheets[i];
  }
  throw new Error('target sheet not found (gid=' + TARGET_SHEET_GID + ')');
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
