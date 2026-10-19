const PRODUCT_KEY = "dashboard-product";

function iconSvg(key, className) {
  const paths = VEG_ICONS[key] || VEG_ICONS.leaf; // unknown icon names fall back to a leaf
  return `<svg class="${className}" viewBox="0 0 64 64" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

const kg = (v) => (isNum(v) ? fmtKg(v) : "—");
// FCFA with the USD equivalent underneath.
const money = (v) => (isNum(v) ? `${fmtFcfa(v)}<span class="usd">${fmtUsd(v)}</span>` : "—");

// The card under the dropdown shows the selected product.
function showVegDetails(veg) {
  document.getElementById("veg-panel").innerHTML = `
    <div class="veg-panel-head">
      ${iconSvg(veg.icon || iconForName(veg.name), "veg-panel-icon")}
      <div>
        <h3 class="veg-panel-name">${escapeHtml(veg.name)}</h3>
        <p class="veg-panel-type">${escapeHtml(veg.type || "")}</p>
      </div>
    </div>
    <div class="veg-panel-groups">
      <div>
        <h4 class="veg-panel-group">Weight</h4>
        <dl class="veg-panel-stats">
          <div><dt>Total</dt><dd>${kg(veg.totalWeight)}</dd></div>
          <div><dt>Market sale</dt><dd>${kg(veg.marketWeight)}</dd></div>
          <div><dt>Family consumption</dt><dd>${kg(veg.familyWeight)}</dd></div>
        </dl>
      </div>
      <div>
        <h4 class="veg-panel-group">Revenue</h4>
        <dl class="veg-panel-stats">
          <div><dt>Total</dt><dd>${money(veg.totalRevenue)}</dd></div>
          <div><dt>Market sale</dt><dd>${money(veg.marketRevenue)}</dd></div>
          <div><dt>Family consumption</dt><dd>${money(veg.familyRevenue)}</dd></div>
        </dl>
      </div>
    </div>`;
}

function renderProductPicker(vegetables) {
  const select = document.getElementById("product-select");
  select.innerHTML = "";
  if (!vegetables.length) {
    document.getElementById("veg-panel").innerHTML = '<p class="veg-panel-hint">No products yet.</p>';
    return;
  }
  vegetables.forEach((veg, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = veg.name;
    select.appendChild(option);
  });
  // Re-open on the product chosen last time, if it's still in the list.
  const saved = vegetables.findIndex((v) => v.name === storage.get(PRODUCT_KEY));
  select.value = saved === -1 ? 0 : saved;
  showVegDetails(vegetables[select.value]);
  select.onchange = () => {
    const veg = vegetables[select.value];
    storage.set(PRODUCT_KEY, veg.name);
    showVegDetails(veg);
  };
}

function renderDonut(vegetables) {
  const sold = vegetables.reduce((s, v) => s + (v.marketWeight || 0), 0);
  const eaten = vegetables.reduce((s, v) => s + (v.familyWeight || 0), 0);
  const total = sold + eaten;
  const segments = [
    { label: "Market sale", value: sold, color: "var(--sold)" },
    { label: "Family consumption", value: eaten, color: "var(--consumed)" },
  ];

  const svg = document.getElementById("donut");
  const tooltip = document.getElementById("donut-tooltip");
  svg.innerHTML = "";
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const gap = 2; // px of surface between segments
  const pct = (v) => (total ? Math.round((v / total) * 100) : 0);
  let offset = 0;

  for (const seg of total ? segments : []) {
    const length = (seg.value / total) * circumference;
    const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    arc.setAttribute("cx", 100);
    arc.setAttribute("cy", 100);
    arc.setAttribute("r", r);
    arc.setAttribute("class", "donut-seg");
    arc.style.stroke = seg.color;
    arc.setAttribute("stroke-dasharray", `${Math.max(length - gap, 0)} ${circumference}`);
    arc.setAttribute("stroke-dashoffset", -offset);
    arc.addEventListener("mousemove", (e) => {
      tooltip.innerHTML = `<strong>${seg.label}</strong><br>${pct(seg.value)}% · ${fmtKg(seg.value)}`;
      tooltip.hidden = false;
      const box = svg.parentElement.getBoundingClientRect();
      tooltip.style.left = `${e.clientX - box.left + 12}px`;
      tooltip.style.top = `${e.clientY - box.top + 12}px`;
    });
    arc.addEventListener("mouseleave", () => (tooltip.hidden = true));
    svg.appendChild(arc);
    offset += length;
  }

  const pcts = segments.map((s) => (total ? `${pct(s.value)}%` : "—"));
  document.getElementById("donut-center").textContent = total ? pcts.join(" / ") : "No data";
  document.getElementById("donut-legend").innerHTML = segments
    .map((s, i) => `<li><span class="swatch" style="background:${s.color}"></span>${s.label} <span class="legend-value">${pcts[i]}</span></li>`)
    .join("");
}

// Destination table next to the donut; each row wears its donut colour.
function renderDestinations(destinations) {
  const body = document.getElementById("destinations-body");
  body.innerHTML = "";
  if (!destinations.length) {
    body.innerHTML = '<tr><td colspan="4" class="empty-cell">No data</td></tr>';
    return;
  }
  for (const d of destinations) {
    const key = slugify(d.destination);
    const color = key.includes("market") ? "var(--sold)" : key.includes("famil") ? "var(--consumed)" : "";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="dest-name">${color ? `<span class="swatch" style="background:${color}"></span>` : ""}${escapeHtml(d.destination)}</td>
      <td>${isNum(d.entries) ? fmtInt(d.entries) : "—"}</td>
      <td>${isNum(d.cost) ? fmtInt(d.cost) : "—"}</td>
      <td>${isNum(d.cost) ? fmtUsd(d.cost).replace(" USD", "") : "—"}</td>`;
    body.appendChild(tr);
  }
}

function renderAgriculture(vegetables, destinations = []) {
  renderProductPicker(vegetables);
  renderDonut(vegetables);
  renderDestinations(destinations);
}

// Production by garden (below the destination table).
function renderProduction(rows) {
  const body = document.getElementById("production-body");
  body.innerHTML = "";
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty-cell">No data</td></tr>';
    return;
  }
  for (const r of rows) {
    const perSqm = isNum(r.kgPerSqm) ? r.kgPerSqm
      : isNum(r.kgProduced) && isNum(r.surface) && r.surface ? r.kgProduced / r.surface : null;
    const cells = [
      r.garden,
      isNum(r.kgProduced) ? fmtKg(r.kgProduced) : "—",
      isNum(r.surface) ? `${Number(r.surface.toFixed(2)).toLocaleString("fr-FR")} m²` : "—",
      isNum(perSqm) ? fmt(perSqm) : "—",
      isNum(r.waterMetric) ? fmt(r.waterMetric) : "—",
    ];
    const tr = document.createElement("tr");
    for (const value of cells) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }
    body.appendChild(tr);
  }
}
