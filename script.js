const listEl = document.getElementById("garden-list");
const imageEl = document.getElementById("garden-image");
const widthEl = document.getElementById("dim-width");
const lengthEl = document.getElementById("dim-length");
const areaEl = document.getElementById("area");
const bodyEl = document.getElementById("plots-body");

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
  // Keep the drawing's proportions in line with the real dimensions.
  imageEl.style.aspectRatio = `${garden.width} / ${garden.length}`;

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

function update() {
  const ids = Object.keys(GARDENS);
  const hash = location.hash.slice(1);
  const id = ids.includes(hash) ? hash : ids[0];
  renderList(id);
  renderGarden(id);
}

window.addEventListener("hashchange", update);
update();
