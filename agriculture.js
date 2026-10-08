const COLUMNS = 5;

function iconSvg(key) {
  const paths = VEG_ICONS[key] || VEG_ICONS.leaf; // unknown icon names fall back to a leaf
  return `<svg class="veg-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function renderGrid(vegetables) {
  const grid = document.getElementById("veg-grid");
  grid.innerHTML = "";
  // Fill the last row so the checkerboard stays complete.
  const cellCount = Math.max(1, Math.ceil(vegetables.length / COLUMNS)) * COLUMNS;
  for (let i = 0; i < cellCount; i++) {
    const veg = vegetables[i];
    const row = Math.floor(i / COLUMNS);
    const col = i % COLUMNS;
    const cell = document.createElement("div");
    cell.className = "veg-cell " + ((row + col) % 2 ? "green" : "cream");

    if (veg) {
      const sold = veg.toBeSold || 0;
      const eaten = veg.forConsumption || 0;
      const total = sold + eaten;
      cell.classList.add("has-veg");
      cell.tabIndex = 0;
      cell.setAttribute("aria-label", `${veg.name}, ${fmtKg(total)}`);
      cell.innerHTML = `
        <h3 class="veg-name">${escapeHtml(veg.name)}</h3>
        ${iconSvg(veg.icon)}
        <p class="veg-total">${fmtKg(total)}</p>
        <dl class="veg-details">
          <div><dt>To be sold</dt><dd>${fmtKg(sold)}</dd></div>
          <div><dt>For consumption</dt><dd>${fmtKg(eaten)}</dd></div>
          <div><dt>Garden</dt><dd>${escapeHtml(veg.garden || "—")}</dd></div>
          <div><dt>Season</dt><dd>${escapeHtml(veg.season || "—")}</dd></div>
        </dl>`;
    }
    grid.appendChild(cell);
  }
}

function renderDonut(vegetables) {
  const sold = vegetables.reduce((s, v) => s + (v.toBeSold || 0), 0);
  const eaten = vegetables.reduce((s, v) => s + (v.forConsumption || 0), 0);
  const total = sold + eaten;
  const segments = [
    { label: "To be sold", value: sold, color: "var(--sold)" },
    { label: "For consumption", value: eaten, color: "var(--consumed)" },
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

function renderAgriculture(vegetables) {
  renderGrid(vegetables);
  renderDonut(vegetables);
}
