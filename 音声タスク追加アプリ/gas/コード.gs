// 音声タスク追加アプリ：受け取ったテキストを対象シートの2行目に新規タスクとして挿入する
// 「アクセスできるユーザー：自分のみ」は他オリジンからのfetchがCORSでブロックされるため、
// 「全員」に緩めた上で、Googleログイン済みidトークンをGoogle側に問い合わせて
// 本人（OWNER_EMAIL）であることを確認してから書き込む。
const SPREADSHEET_ID = '1nZ5A991aTfNPNZdSDq2XWcUj55lMT7qhGkQCfD7P0s4';
const TARGET_SHEET_GID = 0;
const OWNER_EMAIL = 'kskakari@gmail.com';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!isOwner_(body.idToken)) {
      return jsonOutput_({ ok: false, error: 'unauthorized' });
    }
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

function isOwner_(idToken) {
  if (!idToken) return false;
  try {
    const res = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
      { muteHttpExceptions: true }
    );
    if (res.getResponseCode() !== 200) return false;
    const info = JSON.parse(res.getContentText());
    return info.email === OWNER_EMAIL && info.email_verified === 'true';
  } catch (err) {
    return false;
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
