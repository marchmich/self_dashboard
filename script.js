const listEl = document.getElementById("garden-list");
const imageEl = document.getElementById("garden-image");
const widthEl = document.getElementById("dim-width");
const lengthEl = document.getElementById("dim-length");
const areaEl = document.getElementById("area");
const bodyEl = document.getElementById("plots-body");
const gardenersEl = document.getElementById("gardeners-grid");
const gardenersNoteEl = document.getElementById("gardeners-note");

const PERSON_ICON = `<svg class="person-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor"
  stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="32" cy="22" r="10"/><path d="M14 54c2-11 9-18 18-18s16 7 18 18"/></svg>`;

// Show "—" until a stat has been filled in.
const stat = (value, unit = "") => (value == null ? "—" : `${fmt(value)}${unit}`);

const fmt = (n) => Number(n.toFixed(2)).toLocaleString("fr-FR", { useGrouping: false });

function renderList(selectedId) {
  listEl.innerHTML = "";
  for (const [id, garden] of Object.entries(GARDENS)) {
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = garden.name;
    link.className = "garden-link" + (id === selectedId ? " active" : "");
    if (id === selectedId) link.setAttribute("aria-current", "page");
    listEl.appendChild(link);
  }
}

function renderGarden(id) {
  const garden = GARDENS[id];

  widthEl.textContent = `${fmt(garden.width)}m`;
  lengthEl.textContent = `${fmt(garden.length)}m`;
  areaEl.textContent = `${fmt(garden.width * garden.length)} M2`;
  imageEl.src = garden.image;
  imageEl.alt = `Plan du jardin ${garden.name}`;

  bodyEl.innerHTML = "";
  const rows = garden.plots.length ? garden.plots : [{}];
  for (const plot of rows) {
    const surface = plot.nbPlanche * plot.longueur * plot.largeur;
    const cells = [
      plot.status ?? "",
      plot.type ?? "",
      plot.nbPlanche ?? "",
      plot.longueur != null ? `${fmt(plot.longueur)} m` : "",
      plot.largeur != null ? `${fmt(plot.largeur)} m` : "",
      Number.isFinite(surface) ? `${fmt(surface)} m²` : "",
    ];
    const tr = document.createElement("tr");
    for (const value of cells) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }
    bodyEl.appendChild(tr);
  }
}

function renderGardeners(id) {
  const people = (GARDENERS[id] || []).map((p) => (typeof p === "string" ? { name: p } : p));
  gardenersNoteEl.textContent = `· ${GARDENS[id].name} (${people.length})`;
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

function update() {
  const ids = Object.keys(GARDENS);
  const hash = location.hash.slice(1);
  const id = ids.includes(hash) ? hash : ids[0];
  renderList(id);
  renderGarden(id);
  renderGardeners(id);
}

window.addEventListener("hashchange", update);
update();
