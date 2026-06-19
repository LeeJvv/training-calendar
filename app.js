const STORAGE_KEY = "comrades2027TrainingCalendarStateV4";
const LEGACY_STORAGE_KEY = "comrades2027TrainingCalendarStateV1";
const SYNC_DEBOUNCE_MS = 1200;
const dayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const calendarHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sourceCsv = `week,startDate,mon,tue,wed,thu,fri,sat,sun,weeklyKm,phaseNotes
4,2026-07-06,Strength,8 km Easy,Strength,10 km,Strength,11 km Long Run/Race,5 km Recovery,34,Base Building (Recovery Week)
5,2026-07-13,Strength,8 km Easy,Strength,10 km,Strength,17 km Long Run/Race,5 km Recovery,40,Base Building
6,2026-07-20,Strength,8 km Easy,Strength,10 km,Strength,18 km Long Run/Race,5 km Recovery,41,Base Building
7,2026-07-27,Strength,8 km Easy,Strength,10 km,Strength,19 km Long Run/Race,5 km Recovery,42,Base Building
8,2026-08-03,Strength,8 km Easy,Strength,10 km,Strength,14 km Long Run/Race,5 km Recovery,37,Base Building (Recovery Week)
9,2026-08-10,Strength,8 km Easy,Strength,10 km,Strength,21 km Long Run/Race,5 km Recovery,44,Base Building
10,2026-08-17,Strength,8 km Easy,Strength,10 km,Strength,22 km Long Run/Race,5 km Recovery,45,Base Building
11,2026-08-24,Strength,8 km Easy,Strength,10 km,Strength,23 km Long Run/Race,5 km Recovery,46,Base Building
12,2026-08-31,Strength,8 km Easy,Strength,10 km,Strength,21 km Long Run/Race,5 km Recovery,44,21.1 km Race Target <2h
13,2026-09-07,Strength,10 km Easy,Strength,14 km,Strength,25 km Long Run/Race,8 km Recovery,57,Build Endurance
14,2026-09-14,Strength,10 km Easy,Strength,14 km,Strength,26 km Long Run/Race,8 km Recovery,58,Build Endurance
15,2026-09-21,Strength,10 km Easy,Strength,14 km,Strength,27 km Long Run/Race,8 km Recovery,59,Build Endurance
16,2026-09-28,Strength,10 km Easy,Strength,14 km,Strength,19 km Long Run/Race,8 km Recovery,51,Build Endurance (Recovery Week)
17,2026-10-05,Strength,10 km Easy,Strength,14 km,Strength,29 km Long Run/Race,8 km Recovery,61,Build Endurance
18,2026-10-12,Strength,10 km Easy,Strength,14 km,Strength,30 km Long Run/Race,8 km Recovery,62,Build Endurance
19,2026-10-19,Strength,10 km Easy,Strength,14 km,Strength,31 km Long Run/Race,8 km Recovery,63,Build Endurance
20,2026-10-26,Strength,10 km Easy,Strength,14 km,Strength,22 km Long Run/Race,8 km Recovery,54,Build Endurance (Recovery Week)
21,2026-11-02,Strength,10 km Easy,Strength,14 km,Strength,33 km Long Run/Race,8 km Recovery,65,Build Endurance
22,2026-11-09,Strength,10 km Easy,Strength,14 km,Strength,34 km Long Run/Race,8 km Recovery,66,Build Endurance
23,2026-11-16,Strength,10 km Easy,Strength,14 km,Strength,34 km Long Run/Race,8 km Recovery,66,Build Endurance
24,2026-11-23,Strength,10 km Easy,Strength,14 km,Strength,30 km Long Run/Race,8 km Recovery,62,30 km Race
25,2026-11-30,Strength,12 km Easy,Strength,16 km,Strength,31 km Long Run/Race,8 km Recovery,67,Marathon Preparation
26,2026-12-07,Strength,12 km Easy,Strength,16 km,Strength,32 km Long Run/Race,8 km Recovery,68,Marathon Preparation
27,2026-12-14,Strength,12 km Easy,Strength,16 km,Strength,33 km Long Run/Race,8 km Recovery,69,Marathon Preparation
28,2026-12-21,Strength,12 km Easy,Strength,16 km,Strength,23 km Long Run/Race,8 km Recovery,59,Marathon Preparation (Recovery Week)
29,2026-12-28,Strength,12 km Easy,Strength,16 km Hills,Strength,35 km Long Run/Race,8 km Recovery,71,Marathon Preparation
30,2027-01-04,Strength,12 km Easy,Strength,16 km Hills,Strength,36 km Long Run/Race,8 km Recovery,72,Marathon Preparation
31,2027-01-11,Strength,12 km Easy,Strength,16 km Hills,Strength,37 km Long Run/Race,8 km Recovery,73,Marathon Preparation
32,2027-01-18,Strength,12 km Easy,Strength,16 km Hills,Strength,26 km Long Run/Race,8 km Recovery,62,Marathon Preparation (Recovery Week)
33,2027-01-25,Strength,12 km Easy,Strength,16 km Hills,Strength,39 km Long Run/Race,8 km Recovery,75,Marathon Preparation
34,2027-02-01,Strength,12 km Easy,Strength,16 km Hills,Strength,42 km Long Run/Race,8 km Recovery,78,First Marathon Target 4h30-4h50
35,2027-02-08,Strength,12 km Easy,Strength,16 km Hills,Strength,41 km Long Run/Race,8 km Recovery,77,Marathon Preparation
36,2027-02-15,Strength,12 km Easy,Strength,16 km Hills,Strength,29 km Long Run/Race,8 km Recovery,65,Marathon Preparation (Recovery Week)
37,2027-02-22,Strength,14 km Easy,Strength,18 km Hills,Strength,37 km Long Run/Race,10 km Recovery,79,Comrades Specific
38,2027-03-01,Strength,14 km Easy,Strength,18 km Hills,Strength,38 km Long Run/Race,10 km Recovery,80,Comrades Specific
39,2027-03-08,Strength,14 km Easy,Strength,18 km Hills,Strength,39 km Long Run/Race,10 km Recovery,81,Comrades Specific
40,2027-03-15,Strength,14 km Easy,Strength,18 km Hills,Strength,28 km Long Run/Race,10 km Recovery,70,Comrades Specific (Recovery Week)
41,2027-03-22,Strength,14 km Easy,Strength,18 km Hills,Strength,41 km Long Run/Race,10 km Recovery,83,Comrades Specific
42,2027-03-29,Strength,14 km Easy,Strength,18 km Hills,Strength,50 km Long Run/Race,10 km Recovery,92,Om Die Dam 50 km
43,2027-04-05,Strength,14 km Easy,Strength,18 km Hills,Strength,43 km Long Run/Race,10 km Recovery,85,Comrades Specific
44,2027-04-12,Strength,14 km Easy,Strength,18 km Hills,Strength,30 km Long Run/Race,10 km Recovery,72,Comrades Specific (Recovery Week)
45,2027-04-19,Strength,14 km Easy,Strength,18 km Hills,Strength,45 km Long Run/Race,10 km Recovery,87,Comrades Specific
46,2027-04-26,Strength,14 km Easy,Strength,18 km Hills,Strength,46 km Long Run/Race,10 km Recovery,88,Comrades Specific
47,2027-05-03,Strength,14 km Easy,Strength,18 km Hills,Strength,42 km Long Run/Race,10 km Recovery,84,Cape Gate Vaal Marathon Qualifier
48,2027-05-10,Strength,14 km Easy,Strength,18 km Hills,Strength,33 km Long Run/Race,10 km Recovery,75,Comrades Specific (Recovery Week)
49,2027-05-17,Strength,10 km Easy,Strength,12 km,Strength,30 km Long Run/Race,5 km Recovery,57,Taper
50,2027-05-24,Strength,10 km Easy,Strength,12 km,Strength,20 km Long Run/Race,5 km Recovery,47,Taper
51,2027-05-31,Strength,10 km Easy,Strength,12 km,Strength,10 km Long Run/Race,5 km Recovery,37,Taper
52,2027-06-07,Strength,10 km Easy,Strength,12 km,Strength,89 km Long Run/Race,5 km Recovery,116,COMRADES TARGET 10-11 HOURS`;
const officeCsv = `month,dateRange,days
June,01/06/2026 - 03/07/2026,
July,03/07/2026 - 31/07/2026,Monday and Thursday
August,03/08/2026 - 04/09/2026,Monday and Friday
September,07/09/2026 - 02/10/2026,Monday and Thursday
October,05/10/2026 - 30/10/2026,Monday and Tuesday
November,02/11/2026 - 04/12/2026,Monday and Friday
December,07/12/2026 - 24/12/2026,Monday and Tuesday`;

const state = {
  view: "week",
  selectedWeek: 1,
  search: "",
  entries: {},
  syncUrl: "",
  syncSecret: "",
  lastSyncAt: "",
  deviceId: "",
};

const elements = {};
const dateFormatter = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short" });
const monthFormatter = new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" });
let syncTimer = null;
let syncInFlight = false;

function parsePlan() {
  return sourceCsv.trim().split("\n").slice(1).map((line) => {
    const cols = line.split(",");
    const week = Number(cols[0]);
    const startDate = cols[1];
    const phaseNotes = cols.slice(10).join(",");
    const sessions = dayNames.map((day, index) => {
      const planned = cols[index + 2];
      return {
        day,
        label: dayLabel(addDays(startDate, index)),
        date: addDays(startDate, index),
        planned,
        plannedKm: extractKm(planned),
      };
    });
    return {
      week,
      startDate,
      weeklyKm: Number(cols[9]),
      phaseNotes,
      sessions,
    };
  });
}

function parseOfficeDays() {
  const dayLookup = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  };
  const markers = {};

  officeCsv.trim().split("\n").slice(1).forEach((line) => {
    const cols = line.split(",");
    const dateRange = cols[1];
    const daysText = (cols.slice(2).join(",") || "").toLowerCase();
    const officeWeekdays = Object.keys(dayLookup)
      .filter((name) => daysText.includes(name))
      .map((name) => dayLookup[name]);

    if (!dateRange || !officeWeekdays.length) return;

    const [startText, endText] = dateRange.split(" - ");
    const current = parseSlashDate(startText);
    const end = parseSlashDate(endText);

    while (current <= end) {
      if (officeWeekdays.includes(current.getDay())) {
        markers[isoFromLocalDate(current)] = "Office";
      }
      current.setDate(current.getDate() + 1);
    }
  });

  return markers;
}

const plan = parsePlan();
const officeDays = parseOfficeDays();

function init() {
  cacheElements();
  loadState();
  wireEvents();
  registerServiceWorker();
  render();
}

function cacheElements() {
  [
    "plannedTotal",
    "actualTotal",
    "varianceTotal",
    "completionTotal",
    "todayButton",
    "searchInput",
    "weekPhase",
    "weekTitle",
    "prevWeek",
    "nextWeek",
    "weekView",
    "calendarView",
    "logView",
    "syncView",
    "syncUrl",
    "syncSecret",
    "saveSync",
    "pullSync",
    "pushSync",
    "syncStatus",
    "exportCsv",
    "exportJson",
    "importJson",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function wireEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    });
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderCurrentView();
  });

  elements.prevWeek.addEventListener("click", () => {
    const index = getSelectedWeekIndex();
    state.selectedWeek = plan[Math.max(0, index - 1)].week;
    render();
  });

  elements.nextWeek.addEventListener("click", () => {
    const index = getSelectedWeekIndex();
    state.selectedWeek = plan[Math.min(plan.length - 1, index + 1)].week;
    render();
  });

  elements.todayButton.addEventListener("click", () => {
    state.selectedWeek = getCurrentWeekNumber();
    state.view = "week";
    render();
  });

  elements.exportCsv.addEventListener("click", exportCsv);
  elements.exportJson.addEventListener("click", exportJson);
  elements.importJson.addEventListener("change", importJson);
  elements.saveSync.addEventListener("click", saveSyncSettings);
  elements.pullSync.addEventListener("click", () => pullSync(true));
  elements.pushSync.addEventListener("click", () => pushSync(true));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("comrades2027TrainingCalendarStateV3") || localStorage.getItem("comrades2027TrainingCalendarStateV2") || localStorage.getItem(LEGACY_STORAGE_KEY);
  state.deviceId = getDeviceId();
  if (!saved) {
    state.selectedWeek = getCurrentWeekNumber();
    return;
  }
  try {
    const parsed = JSON.parse(saved);
    state.entries = normalizeEntries(parsed.entries || {});
    state.selectedWeek = plan.some((week) => week.week === parsed.selectedWeek) ? parsed.selectedWeek : getCurrentWeekNumber();
    state.syncUrl = parsed.syncUrl || "";
    state.syncSecret = parsed.syncSecret || "";
    state.lastSyncAt = parsed.lastSyncAt || "";
    saveState();
  } catch {
    state.selectedWeek = getCurrentWeekNumber();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    entries: state.entries,
    selectedWeek: state.selectedWeek,
    syncUrl: state.syncUrl,
    syncSecret: state.syncSecret,
    lastSyncAt: state.lastSyncAt,
    deviceId: state.deviceId,
    updatedAt: new Date().toISOString(),
  }));
}

function render() {
  elements.searchInput.value = state.search;
  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.weekView.classList.toggle("hidden", state.view !== "week");
  elements.calendarView.classList.toggle("hidden", state.view !== "calendar");
  elements.logView.classList.toggle("hidden", state.view !== "log");
  elements.syncView.classList.toggle("hidden", state.view !== "sync");
  renderSummary();
  renderHeader();
  renderSyncSettings();
  renderCurrentView();
}

function renderHeader() {
  const week = getSelectedWeek();
  elements.weekPhase.textContent = week.phaseNotes;
  elements.weekTitle.textContent = `Week ${week.week}: ${formatDate(week.startDate)} - ${formatDate(addDays(week.startDate, 6))}`;
}

function renderCurrentView() {
  if (state.view === "week") renderWeek();
  if (state.view === "calendar") renderCalendar();
  if (state.view === "log") renderLog();
  if (state.view === "sync") renderSyncSettings();
}

function renderSummary() {
  const rows = allRows();
  const planned = rows.reduce((sum, row) => sum + row.plannedKm, 0);
  const actual = rows.reduce((sum, row) => sum + row.actualKm, 0);
  const done = rows.filter((row) => row.done).length;
  elements.plannedTotal.textContent = `${round(planned)} km`;
  elements.actualTotal.textContent = `${round(actual)} km`;
  elements.varianceTotal.textContent = `${signed(round(actual - planned))} km`;
  elements.completionTotal.textContent = `${Math.round((done / rows.length) * 100) || 0}%`;
}

function renderWeek() {
  const week = getSelectedWeek();
  elements.weekView.innerHTML = "";
  const rows = week.sessions.map((session) => mergedSession(week.week, session));
  const planned = rows.reduce((sum, row) => sum + row.plannedKm, 0);
  const actual = rows.reduce((sum, row) => sum + row.actualKm, 0);
  const meta = document.createElement("article");
  meta.className = "week-meta";
  meta.innerHTML = `
    <div><span class="meta-label">Planned</span><strong>${round(planned)} km</strong></div>
    <div><span class="meta-label">Actual</span><strong>${round(actual)} km</strong></div>
    <div><span class="meta-label">Variance</span><strong>${signed(round(actual - planned))} km</strong></div>
  `;
  elements.weekView.append(meta);
  rows.forEach((row) => elements.weekView.append(renderDayCard(row)));
}

function renderDayCard(row) {
  const node = document.getElementById("dayTemplate").content.firstElementChild.cloneNode(true);
  node.querySelector(".day-name").textContent = `${row.label} - Week ${row.week}`;
  node.querySelector(".day-date").textContent = formatDate(row.date);
  if (row.officeDay) {
    const badge = document.createElement("span");
    badge.className = "office-badge";
    badge.textContent = "Office";
    node.querySelector(".day-head").append(badge);
  }
  node.querySelector(".planned-text").value = row.planned;
  node.querySelector(".planned-km").value = blankZero(row.plannedKm);
  node.querySelector(".actual-km").value = blankZero(row.actualKm);
  node.querySelector(".notes").value = row.notes;
  node.querySelector(".done-toggle input").checked = row.done;

  node.querySelector(".planned-text").addEventListener("change", (event) => updateEntry(row.id, { planned: event.target.value, allowPlanOverride: true }));
  node.querySelector(".planned-km").addEventListener("change", (event) => updateEntry(row.id, { plannedKm: toNumber(event.target.value), allowPlanOverride: true }));
  node.querySelector(".actual-km").addEventListener("change", (event) => updateEntry(row.id, { actualKm: toNumber(event.target.value) }));
  node.querySelector(".notes").addEventListener("change", (event) => updateEntry(row.id, { notes: event.target.value }));
  node.querySelector(".done-toggle input").addEventListener("change", (event) => updateEntry(row.id, { done: event.target.checked }));
  return node;
}

function renderCalendar() {
  elements.calendarView.innerHTML = "";
  const rows = filteredRows();
  const rowsByDate = groupBy(rows, (row) => row.date);
  calendarMonths(rows).forEach((month) => {
    const panel = document.createElement("article");
    panel.className = "month-panel";
    panel.innerHTML = `<h3>${monthFormatter.format(localDate(`${month}-01`))}</h3><div class="calendar-grid"></div>`;
    const grid = panel.querySelector(".calendar-grid");
    calendarHeaders.forEach((label) => {
      const header = document.createElement("div");
      header.className = "calendar-header";
      header.textContent = label;
      grid.append(header);
    });
    for (let index = 0; index < calendarOffset(`${month}-01`); index += 1) {
      const blank = document.createElement("div");
      blank.className = "calendar-day calendar-blank";
      grid.append(blank);
    }
    monthDates(month).forEach((date) => {
      const row = (rowsByDate[date] || [])[0];
      const officeDay = Boolean(officeDays[date]);
      const cell = document.createElement("div");
      cell.className = `calendar-day ${row ? dayClasses(row).join(" ") : ""} ${officeDay ? "office-day" : ""} ${row ? "" : "calendar-empty"}`;
      cell.innerHTML = `<time>${localDate(date).getDate()}</time>`;
      cell.querySelector("time").textContent = localDate(date).getDate();
      if (officeDay) {
        const badge = document.createElement("span");
        badge.className = "office-badge calendar-office-badge";
        badge.textContent = "Office";
        cell.append(badge);
      }
      if (row) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${row.planned}${row.actualKm ? ` - ${row.actualKm} km` : ""}`;
        button.addEventListener("click", () => {
          state.selectedWeek = row.week;
          state.view = "week";
          render();
        });
        cell.append(button);
      }
      grid.append(cell);
    });
    elements.calendarView.append(panel);
  });
}

function renderLog() {
  elements.logView.innerHTML = "";
  filteredRows().filter((row) => row.done || row.actualKm || row.notes).forEach((row) => {
    const item = document.createElement("article");
    item.className = "log-row";
    item.innerHTML = `
      <div>
        <strong>${formatDate(row.date)} - ${row.planned}</strong>
        <span>Planned ${round(row.plannedKm)} km, actual ${round(row.actualKm)} km${row.notes ? ` - ${escapeHtml(row.notes)}` : ""}</span>
      </div>
      <span class="pill">${signed(round(row.actualKm - row.plannedKm))} km</span>
    `;
    item.addEventListener("click", () => {
      state.selectedWeek = row.week;
      state.view = "week";
      render();
    });
    elements.logView.append(item);
  });
  if (!elements.logView.children.length) {
    elements.logView.innerHTML = `<article class="log-row"><div><strong>No completed sessions yet</strong><span>Record actual kilometres or notes in the Week view.</span></div></article>`;
  }
}

function updateEntry(id, patch) {
  state.entries[id] = { ...(state.entries[id] || {}), ...patch, updatedAt: new Date().toISOString() };
  saveState();
  renderSummary();
  renderCurrentView();
  schedulePushSync();
}

function allRows() {
  return plan.flatMap((week) => week.sessions.map((session) => mergedSession(week.week, session)));
}

function filteredRows() {
  const query = state.search;
  if (!query) return allRows();
  return allRows().filter((row) => {
    return [row.week, row.date, row.planned, row.phaseNotes, row.notes, row.officeDay ? "office" : ""].join(" ").toLowerCase().includes(query);
  });
}

function calendarMonths(rows) {
  const rowMonths = rows.map((row) => row.date.slice(0, 7));
  const officeMonths = Object.keys(officeDays).map((date) => date.slice(0, 7));
  return [...new Set([...rowMonths, ...officeMonths])].sort();
}

function monthDates(month) {
  const dates = [];
  const current = localDate(`${month}-01`);
  while (isoFromLocalDate(current).startsWith(month)) {
    dates.push(isoFromLocalDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function mergedSession(weekNumber, session) {
  const id = `${weekNumber}-${session.day}`;
  const overrides = sanitizeEntry(id, state.entries[id] || {});
  const week = plan.find((item) => item.week === weekNumber) || plan[0];
  return {
    ...session,
    ...overrides,
    id,
    week: weekNumber,
    phaseNotes: week.phaseNotes,
    officeDay: Boolean(officeDays[session.date]),
    officeLabel: officeDays[session.date] || "",
    actualKm: toNumber(overrides.actualKm),
    plannedKm: overrides.plannedKm === undefined ? session.plannedKm : toNumber(overrides.plannedKm),
    notes: overrides.notes || "",
    done: Boolean(overrides.done),
  };
}

function exportCsv() {
  const header = ["date", "week", "day", "officeDay", "planned", "plannedKm", "actualKm", "varianceKm", "done", "notes", "phase"];
  const lines = [header, ...allRows().map((row) => [
    row.date,
    row.week,
    row.label,
    row.officeDay ? "yes" : "no",
    row.planned,
    row.plannedKm,
    row.actualKm,
    round(row.actualKm - row.plannedKm),
    row.done ? "yes" : "no",
    row.notes,
    row.phaseNotes,
  ])].map((line) => line.map(csvCell).join(","));
  download("comrades-training-actuals.csv", lines.join("\n"), "text/csv");
}

function exportJson() {
  download("comrades-training-backup.json", JSON.stringify({
    app: "Comrades Training Calendar",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: state.entries,
    syncUrl: state.syncUrl,
  }, null, 2), "application/json");
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(reader.result);
      state.entries = normalizeEntries(imported.entries || {});
      saveState();
      render();
      schedulePushSync();
    } catch {
      alert("That backup file could not be restored.");
    }
  });
  reader.readAsText(file);
  event.target.value = "";
}

function renderSyncSettings() {
  elements.syncUrl.value = state.syncUrl;
  elements.syncSecret.value = state.syncSecret;
  setSyncStatus(state.syncUrl ? `Connected. Last sync: ${state.lastSyncAt ? formatSyncTime(state.lastSyncAt) : "not yet"}` : "Not connected");
}

function saveSyncSettings() {
  state.syncUrl = normalizeSyncUrl(elements.syncUrl.value);
  state.syncSecret = elements.syncSecret.value.trim();
  saveState();
  renderSyncSettings();
  if (state.syncUrl && state.syncSecret) {
    pullSync(true);
  }
}

function schedulePushSync() {
  if (!canSync()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushSync(false), SYNC_DEBOUNCE_MS);
}

async function pushSync(manual) {
  if (!canSync() || syncInFlight) {
    if (manual) setSyncStatus("Add the Apps Script URL and sync password first.");
    return;
  }
  syncInFlight = true;
  setSyncStatus("Pushing changes to Google Sheets...");
  const payload = JSON.stringify({
    app: "Comrades Training Calendar",
    version: 2,
    deviceId: state.deviceId,
    updatedAt: new Date().toISOString(),
    entries: state.entries,
  });

  try {
    await fetch(state.syncUrl, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({
        action: "push",
        secret: state.syncSecret,
        payload,
      }),
    });
    state.lastSyncAt = new Date().toISOString();
    saveState();
    setSyncStatus("Pushed to Google Sheets. Pulling latest...");
    setTimeout(() => pullSync(false), 1600);
  } catch {
    setSyncStatus("Push failed. Check your connection and Sync settings.");
  } finally {
    syncInFlight = false;
  }
}

async function pullSync(manual) {
  if (!canSync()) {
    if (manual) setSyncStatus("Add the Apps Script URL and sync password first.");
    return;
  }
  setSyncStatus("Pulling latest from Google Sheets...");
  try {
    const data = await jsonp(`${state.syncUrl}?action=pull&secret=${encodeURIComponent(state.syncSecret)}&ts=${Date.now()}`);
    if (!data.ok) throw new Error(data.error || "Sync failed");
    state.entries = mergeEntries(state.entries, normalizeEntries(data.entries || {}));
    state.lastSyncAt = new Date().toISOString();
    saveState();
    render();
    setSyncStatus(`Synced ${Object.keys(state.entries).length} edited sessions.`);
  } catch {
    setSyncStatus("Pull failed. Check the Apps Script deployment URL and password.");
  }
}

function canSync() {
  return Boolean(state.syncUrl && state.syncSecret);
}

function setSyncStatus(message) {
  if (elements.syncStatus) elements.syncStatus.textContent = message;
}

function normalizeSyncUrl(value) {
  return value.trim().replace(/\?.*$/, "");
}

function mergeEntries(localEntries, cloudEntries) {
  const merged = { ...localEntries };
  Object.entries(cloudEntries).forEach(([id, cloudEntry]) => {
    const localEntry = merged[id];
    if (!localEntry || entryTime(cloudEntry) > entryTime(localEntry)) {
      merged[id] = cloudEntry;
    }
  });
  return merged;
}

function normalizeEntries(entries) {
  const validIds = validEntryIds();
  return Object.fromEntries(Object.entries(entries)
    .filter(([id]) => validIds.has(id))
    .map(([id, entry]) => [
      id,
      sanitizeEntry(id, { ...entry, updatedAt: entry.updatedAt || new Date(0).toISOString() }),
    ]));
}

function sanitizeEntry(id, entry) {
  const clean = { ...entry };
  const source = sourceSessionById(id);
  if (!source || !clean.allowPlanOverride || /office\s*day|office/i.test(String(clean.planned || ""))) {
    delete clean.planned;
    delete clean.plannedKm;
    delete clean.allowPlanOverride;
  }
  return clean;
}

function sourceSessionById(id) {
  const [weekText, day] = id.split("-");
  const week = plan.find((item) => item.week === Number(weekText));
  return week ? week.sessions.find((session) => session.day === day) : null;
}

function validEntryIds() {
  return new Set(plan.flatMap((week) => week.sessions.map((session) => `${week.week}-${session.day}`)));
}

function entryTime(entry) {
  return Date.parse(entry.updatedAt || 0) || 0;
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callback = `syncCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";
    window[callback] = (data) => {
      delete window[callback];
      script.remove();
      resolve(data);
    };
    script.onerror = () => {
      delete window[callback];
      script.remove();
      reject(new Error("JSONP failed"));
    };
    script.src = `${url}${separator}callback=${callback}`;
    document.body.append(script);
  });
}

function getDeviceId() {
  const key = "comrades2027TrainingCalendarDeviceId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(key, value);
  return value;
}

function formatSyncTime(isoDate) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function getSelectedWeek() {
  return plan.find((week) => week.week === state.selectedWeek) || plan[0];
}

function getSelectedWeekIndex() {
  const index = plan.findIndex((week) => week.week === state.selectedWeek);
  return index >= 0 ? index : 0;
}

function getCurrentWeekNumber() {
  const today = stripTime(new Date());
  const found = plan.find((week) => {
    const start = localDate(week.startDate);
    const end = localDate(addDays(week.startDate, 6));
    return today >= start && today <= end;
  });
  return found ? found.week : plan[0].week;
}

function addDays(isoDate, days) {
  const date = localDate(isoDate);
  date.setDate(date.getDate() + days);
  return isoFromLocalDate(date);
}

function localDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function parseSlashDate(value) {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function dayLabel(isoDate) {
  return dayLabels[calendarOffset(isoDate)];
}

function calendarOffset(isoDate) {
  const day = localDate(isoDate).getDay();
  return day === 0 ? 6 : day - 1;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isoFromLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(isoDate) {
  return dateFormatter.format(localDate(isoDate));
}

function extractKm(text) {
  const match = String(text).match(/(\d+(?:\.\d+)?)\s*km/i);
  return match ? Number(match[1]) : 0;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function blankZero(value) {
  return value ? String(value) : "";
}

function groupBy(rows, keyFn) {
  return rows.reduce((groups, row) => {
    const key = keyFn(row);
    groups[key] = groups[key] || [];
    groups[key].push(row);
    return groups;
  }, {});
}

function dayClasses(row) {
  const classes = [];
  if (row.done) classes.push("done");
  if (row.actualKm === 0 && row.plannedKm > 0 && localDate(row.date) < stripTime(new Date())) classes.push("missed");
  if (/race|target|comrades|dam|qualifier/i.test(row.phaseNotes) || /race/i.test(row.planned)) classes.push("race");
  if (/recovery/i.test(row.planned)) classes.push("recovery");
  if (row.officeDay) classes.push("office-day");
  return classes;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js?v=revised3").then((registration) => registration.update()).catch(() => {});
  }
}

init();
setTimeout(() => pullSync(false), 800);
