const SHEET_NAME = "Training Entries";
const SETTINGS_NAME = "Settings";
const SYNC_SECRET = "CHANGE_THIS_PASSWORD";

function doGet(event) {
  const callback = (event.parameter.callback || "callback").replace(/[^\w.$]/g, "");
  const result = handleRequest(event.parameter);
  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(result)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(event) {
  const result = handleRequest(event.parameter);
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(params) {
  try {
    if ((params.secret || "") !== SYNC_SECRET) {
      return { ok: false, error: "Invalid sync password" };
    }

    ensureWorkbook();

    if (params.action === "pull") {
      return { ok: true, entries: readEntries(), updatedAt: new Date().toISOString() };
    }

    if (params.action === "push") {
      const payload = JSON.parse(params.payload || "{}");
      writeEntries(payload.entries || {}, payload.deviceId || "");
      return { ok: true, entries: readEntries(), updatedAt: new Date().toISOString() };
    }

    return { ok: false, error: "Unknown action" };
  } catch (error) {
    return { ok: false, error: String(error && error.message ? error.message : error) };
  }
}

function ensureWorkbook() {
  const spreadsheet = SpreadsheetApp.getActive();
  let entries = spreadsheet.getSheetByName(SHEET_NAME);
  if (!entries) entries = spreadsheet.insertSheet(SHEET_NAME);
  if (entries.getLastRow() === 0) {
    entries.appendRow([
      "id",
      "week",
      "day",
      "planned",
      "plannedKm",
      "actualKm",
      "done",
      "notes",
      "updatedAt",
      "deviceId",
    ]);
    entries.setFrozenRows(1);
  }

  let settings = spreadsheet.getSheetByName(SETTINGS_NAME);
  if (!settings) settings = spreadsheet.insertSheet(SETTINGS_NAME);
  if (settings.getLastRow() === 0) {
    settings.appendRow(["key", "value"]);
    settings.appendRow(["createdAt", new Date().toISOString()]);
    settings.setFrozenRows(1);
  }
}

function readEntries() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return {};

  const rows = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  return rows.reduce((entries, row) => {
    const id = String(row[0] || "");
    if (!id) return entries;
    entries[id] = {
      planned: String(row[3] || ""),
      plannedKm: Number(row[4] || 0),
      actualKm: Number(row[5] || 0),
      done: String(row[6]).toLowerCase() === "true",
      notes: String(row[7] || ""),
      updatedAt: normalizeDate(row[8]),
    };
    return entries;
  }, {});
}

function writeEntries(entries, deviceId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const current = readEntries();
    Object.keys(entries).forEach((id) => {
      const incoming = entries[id] || {};
      const existing = current[id];
      if (!existing || Date.parse(incoming.updatedAt || 0) >= Date.parse(existing.updatedAt || 0)) {
        current[id] = incoming;
      }
    });

    const rows = Object.keys(current).sort(sortEntryIds).map((id) => {
      const entry = current[id] || {};
      const parts = id.split("-");
      return [
        id,
        Number(parts[0] || 0),
        parts[1] || "",
        entry.planned || "",
        Number(entry.plannedKm || 0),
        Number(entry.actualKm || 0),
        Boolean(entry.done),
        entry.notes || "",
        entry.updatedAt || new Date().toISOString(),
        deviceId,
      ];
    });

    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 10).clearContent();
    }
    if (rows.length) {
      sheet.getRange(2, 1, rows.length, 10).setValues(rows);
    }
  } finally {
    lock.releaseLock();
  }
}

function sortEntryIds(left, right) {
  const leftParts = left.split("-");
  const rightParts = right.split("-");
  const weekDiff = Number(leftParts[0] || 0) - Number(rightParts[0] || 0);
  if (weekDiff) return weekDiff;
  return dayIndex(leftParts[1]) - dayIndex(rightParts[1]);
}

function dayIndex(day) {
  return ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(day);
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString();
  return value ? String(value) : new Date(0).toISOString();
}
