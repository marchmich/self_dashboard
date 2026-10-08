/**
 * Farm Dashboard — Google Apps Script server code.
 *
 * Paste this file as "Code.gs" in the Apps Script project attached to your
 * Google Sheet (Extensions → Apps Script), and Index.html as an HTML file
 * named "Index". See apps-script/SETUP.md for the full steps.
 *
 * The sheet itself is never shared: the page asks getDashboardData() for
 * the numbers, and only the columns listed in TABS below are sent.
 */

// Leave empty when this script is attached to the sheet (Extensions → Apps Script).
// For a standalone script, paste the sheet's ID here (the long code in its URL).
const SHEET_ID = '';

// Tab name → column header → field name used by the dashboard.
// Headers are matched loosely: case, accents, spaces and "(units)" are ignored,
// so "Width (m)", "width" and "WIDTH" all work.
const TABS = {
  Gardens:    { garden: 'garden', width: 'width', length: 'length' },
  Plots:      { garden: 'garden', status: 'status', type: 'type', nbplanche: 'nbPlanche',
                longueur: 'longueur', largeur: 'largeur' },
  Gardeners:  { garden: 'garden', name: 'name', planches: 'planches', surface: 'surface',
                harvest: 'harvest', crops: 'crops' },
  Vegetables: { name: 'name', icon: 'icon', tobesold: 'toBeSold',
                forconsumption: 'forConsumption', garden: 'garden', season: 'season' },
};
const NUMBER_FIELDS = ['width', 'length', 'nbPlanche', 'longueur', 'largeur',
                       'planches', 'surface', 'harvest', 'toBeSold', 'forConsumption'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Farm Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Called by the page. Returns { gardens, gardeners, vegetables }. */
function getDashboardData() {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActive();
  const tab = (name) => readTab_(ss, name, TABS[name]);

  const gardens = {};
  tab('Gardens').forEach((row) => {
    if (!row.garden) return;
    gardens[slug_(row.garden)] = { name: row.garden, width: row.width, length: row.length, plots: [] };
  });

  tab('Plots').forEach((row) => {
    const garden = gardens[slug_(row.garden)];
    if (!garden) return; // garden not listed in the Gardens tab
    delete row.garden;
    garden.plots.push(row);
  });

  const gardeners = {};
  tab('Gardeners').forEach((row) => {
    const id = slug_(row.garden);
    if (!gardens[id] || !row.name) return;
    delete row.garden;
    (gardeners[id] = gardeners[id] || []).push(row);
  });

  const vegetables = tab('Vegetables').filter((row) => row.name);

  return { gardens, gardeners, vegetables };
}

/** Reads one tab into objects, keeping only the configured columns. */
function readTab_(ss, tabName, columns) {
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) throw new Error('The Google Sheet has no tab named "' + tabName + '".');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalize_);
  return values.slice(1)
    .filter((row) => row.some((cell) => cell !== '' && cell !== null))
    .map((row) => {
      const obj = {};
      Object.keys(columns).forEach((header) => {
        const field = columns[header];
        const index = headers.indexOf(header);
        const raw = index === -1 ? '' : row[index];
        obj[field] = NUMBER_FIELDS.indexOf(field) !== -1 ? toNumber_(raw) : toText_(raw);
      });
      return obj;
    });
}

function normalize_(header) {
  return String(header).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // drop accents
    .replace(/\(.*?\)/g, '')                          // drop "(m)", "(kg)"...
    .replace(/[^a-z0-9]/g, '');
}

function toNumber_(value) {
  if (typeof value === 'number') return value;
  const text = String(value).trim().replace(/\s/g, '').replace(',', '.');
  if (text === '') return null;
  const n = Number(text);
  return isFinite(n) ? n : null;
}

function toText_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }
  return String(value === null ? '' : value).trim();
}

function slug_(name) {
  return String(name).toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
