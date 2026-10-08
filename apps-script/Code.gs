/**
 * Farm Dashboard — Google Apps Script server code.
 *
 * Paste this file as "Code.gs" in your Apps Script project, and Index.html as an
 * HTML file named "Index". See apps-script/SETUP.md for the full steps.
 *
 * The sheet itself is never shared: the page asks getDashboardData() for the
 * numbers, and only the columns listed below are sent to it.
 */

// The ID of your Google Sheet: the long code in its address, between "/d/" and "/edit".
// e.g. https://docs.google.com/spreadsheets/d/THIS_PART/edit
const SHEET_ID = '';

// The tab with the harvest table. Leave empty to use the first tab.
const HARVEST_TAB = '';

// Harvest columns → field names used by the dashboard. Headers are matched loosely:
// capitals, accents, spaces, line breaks and "(units)" are ignored.
const HARVEST_COLUMNS = {
  product: 'name',
  type: 'type',
  totalweight: 'totalWeight',
  marketsaleweight: 'marketWeight',
  familyconsumptionweight: 'familyWeight',
  marketsalerevenue: 'marketRevenue',
  familyconsumptionrevenue: 'familyRevenue',
  totalrevenue: 'totalRevenue',
};

// Two smaller tables on the same tab, beside the harvest table.
// Destination | Number of Entries | Cost (FCFA)   (columns J–L)
const DESTINATION_COLUMNS = { destination: 'destination', numberofentries: 'entries', cost: 'cost' };
// Garden | KG produced | Surface Cultivated (m2) | Kilos of Produce/sqm | Water Metric   (columns N–R)
const PRODUCTION_COLUMNS = { garden: 'garden', kgproduced: 'kgProduced', surfacecultivated: 'surface',
                             kilosofproducesqm: 'kgPerSqm', watermetric: 'waterMetric' };

// Optional tabs for the Gardens section. Until they exist in the sheet, the
// dashboard uses its built-in garden data.
const GARDEN_TABS = {
  Gardens:   { garden: 'garden', width: 'width', length: 'length' },
  Plots:     { garden: 'garden', status: 'status', type: 'type', nbplanche: 'nbPlanche',
               longueur: 'longueur', largeur: 'largeur' },
  Gardeners: { garden: 'garden', name: 'name', planches: 'planches', surface: 'surface',
               harvest: 'harvest', crops: 'crops' },
};

const NUMBER_FIELDS = ['totalWeight', 'marketWeight', 'familyWeight', 'marketRevenue',
                       'familyRevenue', 'totalRevenue', 'entries', 'cost', 'kgProduced',
                       'kgPerSqm', 'waterMetric', 'width', 'length', 'nbPlanche',
                       'longueur', 'largeur', 'planches', 'surface', 'harvest'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Farm Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Called by the page. Returns { vegetables, destinations, production, gardens?, gardeners? }. */
function getDashboardData() {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActive();
  if (!ss) {
    throw new Error('No Google Sheet found. Paste your sheet\'s ID into SHEET_ID at the top of Code.gs.');
  }

  const harvestSheet = HARVEST_TAB ? ss.getSheetByName(HARVEST_TAB) : ss.getSheets()[0];
  if (!harvestSheet) {
    const names = ss.getSheets().map(function (s) { return '"' + s.getName() + '"'; }).join(', ');
    throw new Error('The Google Sheet has no tab named "' + HARVEST_TAB + '". Its tabs are: ' + names + '.');
  }
  const result = {
    vegetables: readRows_(harvestSheet, HARVEST_COLUMNS).filter(function (row) { return row.name; }),
    destinations: readRows_(harvestSheet, DESTINATION_COLUMNS).filter(function (row) { return row.destination; }),
    production: readRows_(harvestSheet, PRODUCTION_COLUMNS).filter(function (row) { return row.garden; }),
  };

  if (ss.getSheetByName('Gardens')) {
    Object.assign(result, readGardens_(ss));
  }
  return result;
}

function readGardens_(ss) {
  const tab = function (name) {
    const sheet = ss.getSheetByName(name);
    return sheet ? readRows_(sheet, GARDEN_TABS[name]) : [];
  };

  const gardens = {};
  tab('Gardens').forEach(function (row) {
    if (!row.garden) return;
    gardens[slug_(row.garden)] = { name: row.garden, width: row.width, length: row.length, plots: [] };
  });

  tab('Plots').forEach(function (row) {
    const garden = gardens[slug_(row.garden)];
    if (!garden) return; // garden not listed in the Gardens tab
    delete row.garden;
    garden.plots.push(row);
  });

  const gardeners = {};
  tab('Gardeners').forEach(function (row) {
    const id = slug_(row.garden);
    if (!gardens[id] || !row.name) return;
    delete row.garden;
    (gardeners[id] = gardeners[id] || []).push(row);
  });

  return { gardens: gardens, gardeners: gardeners };
}

/** Reads a tab into objects, keeping only the listed columns. Row 1 holds the titles. */
function readRows_(sheet, columns) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalize_);
  return values.slice(1)
    .filter(function (row) { return row.some(function (cell) { return cell !== '' && cell !== null; }); })
    .map(function (row) {
      const obj = {};
      Object.keys(columns).forEach(function (header) {
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
    .replace(/\(.*?\)/g, '')                          // drop "(KG)", "(FCFA)"...
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
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
