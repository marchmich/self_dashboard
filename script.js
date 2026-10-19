const listEl = document.getElementById("garden-list");
const widthEl = document.getElementById("dim-width");
const lengthEl = document.getElementById("dim-length");
const areaEl = document.getElementById("area");
const gardenersEl = document.getElementById("gardeners-grid");
const gardenersNoteEl = document.getElementById("gardeners-note");
const GARDEN_KEY = "dashboard-garden";

const PERSON_ICON = `<svg class="person-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor"
  stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="32" cy="22" r="10"/><path d="M14 54c2-11 9-18 18-18s16 7 18 18"/></svg>`;

// Show "—" until a stat has been filled in.
const stat = (value, unit = "") => (isNum(value) ? `${fmt(value)}${unit}` : "—");

let gardensData = {};
let gardenersData = {};
let gardenHarvestData; // undefined = still loading, null = not connected, {} = loaded

function renderList(selectedId) {
  listEl.innerHTML = "";
  for (const [id, garden] of Object.entries(gardensData)) {
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = garden.name;
    link.className = "garden-link" + (id === selectedId ? " active" : "");
    if (id === selectedId) link.setAttribute("aria-current", "page");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      selectGarden(id);
    });
    listEl.appendChild(link);
  }
}

function renderGarden(id) {
  const garden = gardensData[id];

  widthEl.textContent = isNum(garden.width) ? `${fmt(garden.width)}m` : "—";
  lengthEl.textContent = isNum(garden.length) ? `${fmt(garden.length)}m` : "—";
  areaEl.textContent = isNum(garden.width) && isNum(garden.length)
    ? `${fmt(garden.width * garden.length)} M2` : "—";
}

function renderGardeners(id) {
  const people = (gardenersData[id] || []).map((p) => (typeof p === "string" ? { name: p } : p));
  gardenersNoteEl.textContent = `· ${gardensData[id].name} (${people.length})`;
  gardenersEl.innerHTML = "";
  people.forEach((person, i) => {
    const cell = document.createElement("div");
    cell.className = "person-cell " + (i % 2 ? "orange" : "yellow");
    cell.tabIndex = 0;
    cell.setAttribute("aria-label", person.name);
    cell.innerHTML = `
      <h4 class="person-name"></h4>
      ${PERSON_ICON}
      <p class="person-total">${stat(person.harvest, " kg")}</p>
      <dl class="person-details">
        <div><dt>Planches</dt><dd>${stat(person.planches)}</dd></div>
        <div><dt>Surface</dt><dd>${stat(person.surface, " m²")}</dd></div>
        <div><dt>Harvest</dt><dd>${stat(person.harvest, " kg")}</dd></div>
        <div><dt>Crops</dt><dd class="crops"></dd></div>
      </dl>`;
    // Names and crops are set as text so they can never be read as HTML.
    cell.querySelector(".person-name").textContent = person.name;
    cell.querySelector(".crops").textContent = person.crops || "—";
    gardenersEl.appendChild(cell);
  });
}

// Per-garden harvest from the entries tab, largest first.
function renderGardenHarvest(id) {
  const body = document.getElementById("garden-harvest-body");
  document.getElementById("garden-harvest-note").textContent = id ? `· ${gardensData[id].name}` : "";
  const msg = (text) => { body.innerHTML = `<tr><td colspan="3" class="empty-cell">${text}</td></tr>`; };
  if (gardenHarvestData === undefined) return msg("Loading…");
  if (gardenHarvestData === null) return msg("Harvest entries aren't connected yet.");
  const rows = gardenHarvestData[id] || [];
  if (!rows.length) return msg("No entries recorded for this garden yet.");
  body.innerHTML = "";
  let total = 0;
  for (const r of rows) {
    total += r.kg || 0;
    const tr = document.createElement("tr");
    [r.product, fmtInt(r.entries), fmtKg(r.kg)].forEach((v) => {
      const td = document.createElement("td"); td.textContent = v; tr.appendChild(td);
    });
    body.appendChild(tr);
  }
  const tr = document.createElement("tr");
  tr.className = "total-row";
  tr.innerHTML = `<td>Total</td><td>${fmtInt(rows.reduce((s, r) => s + r.entries, 0))}</td><td>${fmtKg(total)}</td>`;
  body.appendChild(tr);
}

function setGardenHarvest(data) {
  gardenHarvestData = data;
  renderGardenHarvest(currentGardenId());
}

function currentGardenId() {
  const ids = Object.keys(gardensData);
  const fromHash = location.hash.slice(1);
  const saved = storage.get(GARDEN_KEY);
  if (ids.includes(fromHash)) return fromHash;
  if (ids.includes(saved)) return saved;
  return ids[0];
}

function showGarden(id) {
  if (!id) return; // no gardens yet
  renderList(id);
  renderGarden(id);
  renderGardeners(id);
  renderGardenHarvest(id);
}

function selectGarden(id) {
  storage.set(GARDEN_KEY, id);
  // Keep the address in sync where the browser allows it (it may not inside Apps Script).
  try { history.replaceState(null, "", `#${id}`); } catch {}
  showGarden(id);
}

function renderGardens(gardens, gardeners) {
  gardensData = gardens;
  gardenersData = gardeners;
  showGarden(currentGardenId());
}

window.addEventListener("hashchange", () => showGarden(currentGardenId()));
