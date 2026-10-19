const PRODUCT_KEY = "dashboard-product";
let currentVeg = null;
let monthlyData = null; // { productSlug: [{ month: "2025-03", kg }] }, or null when not connected

function iconSvg(key, className) {
  const paths = VEG_ICONS[key] || VEG_ICONS.leaf; // unknown icon names fall back to a leaf
  return `<svg class="${className}" viewBox="0 0 64 64" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

const kg = (v) => (isNum(v) ? fmtKg(v) : "—");
// FCFA with the USD equivalent underneath.
const money = (v) => (isNum(v) ? `${fmtFcfa(v)}<span class="usd">${fmtUsd(v)}</span>` : "—");

// The card under the dropdown shows the selected product; the chart beside it follows.
function showVegDetails(veg) {
  currentVeg = veg;
  renderTrend();
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

function renderAgriculture(vegetables, destinations = [], monthly = null) {
  monthlyData = monthly;
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

// ---------- Production per month (column chart for the selected product) ----------

const monthDate = (key) => new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, 1);
const monthShort = (key) => monthDate(key).toLocaleDateString("en-GB", { month: "short" });
const monthLong = (key) => monthDate(key).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

// Every month from the earliest to the latest entry across all products,
// so switching products keeps the same time axis.
function allMonths() {
  const keys = Object.values(monthlyData || {}).flat().map((d) => d.month).sort();
  if (!keys.length) return [];
  const months = [];
  const end = monthDate(keys[keys.length - 1]);
  for (let d = monthDate(keys[0]); d <= end; d.setMonth(d.getMonth() + 1)) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

function niceStep(raw) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

// Column with a 4px rounded top, anchored square on the baseline.
function columnPath(x, y, w, h) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

function renderTrend() {
  const box = document.getElementById("trend-chart");
  const tooltip = document.getElementById("trend-tooltip");
  tooltip.hidden = true;
  if (!currentVeg) return;
  document.getElementById("trend-title").textContent = `${currentVeg.name}: production per month (kg)`;

  if (!monthlyData) {
    box.innerHTML = '<p class="chart-empty">Monthly data isn\'t connected yet.</p>';
    return;
  }
  const months = allMonths();
  const byMonth = new Map((monthlyData[slugify(currentVeg.name)] || []).map((d) => [d.month, d.kg]));
  if (!months.length || !byMonth.size) {
    box.innerHTML = `<p class="chart-empty">No entries recorded for ${escapeHtml(currentVeg.name)} yet.</p>`;
    return;
  }

  const values = months.map((m) => byMonth.get(m) || 0);
  const W = Math.max(280, box.clientWidth || 520);
  const H = box.clientWidth < 420 ? 240 : 320;
  const m = { top: 12, right: 8, bottom: 28, left: 52 };
  const plotW = W - m.left - m.right;
  const plotH = H - m.top - m.bottom;
  const step = niceStep(Math.max(...values, 1) / 4);
  const yMax = Math.ceil(Math.max(...values, 1) / step) * step;
  const y = (v) => m.top + plotH - (v / yMax) * plotH;
  const band = plotW / months.length;
  const barW = Math.max(2, Math.min(36, band * 0.62));
  const labelEvery = Math.ceil(months.length / Math.max(1, Math.floor(plotW / 44)));

  let svg = "";
  for (let v = 0; v <= yMax + 1e-9; v += step) {
    svg += `<line class="grid" x1="${m.left}" x2="${W - m.right}" y1="${y(v)}" y2="${y(v)}"/>`;
    svg += `<text class="axis" x="${m.left - 8}" y="${y(v)}" text-anchor="end" dominant-baseline="middle">${fmtInt(v)}</text>`;
  }
  months.forEach((key, i) => {
    const cx = m.left + band * i + band / 2;
    const h = (values[i] / yMax) * plotH;
    if (h > 0) svg += `<path class="bar" data-i="${i}" d="${columnPath(cx - barW / 2, m.top + plotH - h, barW, h)}"/>`;
    if (i % labelEvery === 0) {
      // Show the year under January and under the first label.
      const year = key.endsWith("-01") || i === 0 ? ` ${key.slice(2, 4)}` : "";
      svg += `<text class="axis" x="${cx}" y="${H - 8}" text-anchor="middle">${monthShort(key)}${year}</text>`;
    }
    // Hover target: the whole column, wider than the bar.
    svg += `<rect class="hit" data-i="${i}" x="${m.left + band * i}" y="${m.top}" width="${band}" height="${plotH}"/>`;
  });
  svg += `<line class="baseline" x1="${m.left}" x2="${W - m.right}" y1="${m.top + plotH}" y2="${m.top + plotH}"/>`;

  const summary = months.map((k, i) => `${monthLong(k)}: ${fmtKg(values[i])}`).join(", ");
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
    aria-label="${escapeHtml(`${currentVeg.name}, production per month. ${summary}`)}">${svg}</svg>`;

  const svgEl = box.querySelector("svg");
  svgEl.querySelectorAll(".hit").forEach((hit) => {
    const i = Number(hit.dataset.i);
    hit.addEventListener("mouseenter", () => {
      svgEl.querySelector(`.bar[data-i="${i}"]`)?.classList.add("active");
      tooltip.innerHTML = `<strong>${monthLong(months[i])}</strong><br>${fmtKg(values[i])}`;
      tooltip.hidden = false;
    });
    hit.addEventListener("mousemove", (e) => {
      const fig = box.parentElement.getBoundingClientRect();
      const left = Math.min(e.clientX - fig.left + 12, fig.width - tooltip.offsetWidth - 4);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${e.clientY - fig.top + 12}px`;
    });
    hit.addEventListener("mouseleave", () => {
      svgEl.querySelector(`.bar[data-i="${i}"]`)?.classList.remove("active");
      tooltip.hidden = true;
    });
  });
}

// Redraw at the new width when the chart's box changes size.
if (window.ResizeObserver) {
  let lastWidth = 0;
  new ResizeObserver((entries) => {
    const width = Math.round(entries[0].contentRect.width);
    if (width !== lastWidth) { lastWidth = width; renderTrend(); }
  }).observe(document.getElementById("trend-chart"));
}
