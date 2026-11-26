/**
 * Kerplunk Media – Feedback → Google Sheets
 *
 * 1. Paste this into Apps Script and Save.
 * 2. Select "setup" in the toolbar and click Run once (authorize when asked).
 *    The Execution log shows the link to your sheet.
 * 3. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 */
const SHEET_NAME = 'Feedback';

const HEADERS = [
  'Timestamp',
  'Overall Rating (1-5)',
  'Experience',
  'Feedback',
];

// Works both when the script is attached to a sheet (Extensions → Apps Script)
// and when it was created on its own at script.google.com.
function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);

  const ss = SpreadsheetApp.create('Kerplunk Feedback');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function getSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold').setBackground('#0b1233').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(4, 500);
  }
  return sheet;
}

// Run this once from the editor: authorizes the script and creates the sheet.
function setup() {
  const sheet = getSheet_();
  Logger.log('Feedback sheet ready: ' + sheet.getParent().getUrl());
}

// Stops spreadsheet formula injection (text starting with = + - @).
function clean_(v) {
  if (v === undefined || v === null) return '';
  const s = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function rating_(v) {
  const n = Number(v);
  return n >= 1 && n <= 5 ? n : '';
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!rating_(d.overallRating)) throw new Error('Invalid rating');

    getSheet_().appendRow([
      new Date(),
      rating_(d.overallRating),
      clean_(d.sentiment),
      clean_(d.feedback),
    ]);

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ status: 'Kerplunk feedback endpoint is running' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
