const COLUMNS = 5;
const grid = document.getElementById("veg-grid");
const fmtKg = (n) => `${Number(n.toFixed(1)).toLocaleString("fr-FR")} kg`;

function iconSvg(key) {
  return `<svg class="veg-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${VEG_ICONS[key]}</svg>`;
}

function renderGrid() {
  // Fill the last row so the checkerboard stays complete.
  const cellCount = Math.ceil(VEGETABLES.length / COLUMNS) * COLUMNS;
  for (let i = 0; i < cellCount; i++) {
    const veg = VEGETABLES[i];
    const row = Math.floor(i / COLUMNS);
    const col = i % COLUMNS;
    const cell = document.createElement("div");
    cell.className = "veg-cell " + ((row + col) % 2 ? "green" : "cream");

    if (veg) {
      const total = veg.toBeSold + veg.forConsumption;
      cell.classList.add("has-veg");
      cell.tabIndex = 0;
      cell.setAttribute("aria-label", `${veg.name}, ${fmtKg(total)}`);
      cell.innerHTML = `
        <h3 class="veg-name">${veg.name}</h3>
        ${iconSvg(veg.icon)}
        <p class="veg-total">${fmtKg(total)}</p>
        <dl class="veg-details">
          <div><dt>To be sold</dt><dd>${fmtKg(veg.toBeSold)}</dd></div>
          <div><dt>For consumption</dt><dd>${fmtKg(veg.forConsumption)}</dd></div>
          <div><dt>Garden</dt><dd>${veg.garden}</dd></div>
          <div><dt>Season</dt><dd>${veg.season}</dd></div>
        </dl>`;
    }
    grid.appendChild(cell);
  }
}

function renderDonut() {
  const sold = VEGETABLES.reduce((s, v) => s + v.toBeSold, 0);
  const eaten = VEGETABLES.reduce((s, v) => s + v.forConsumption, 0);
  const total = sold + eaten;
  const segments = [
    { label: "To be sold", value: sold, color: "var(--sold)" },
    { label: "For consumption", value: eaten, color: "var(--consumed)" },
  ];

  const svg = document.getElementById("donut");
  const tooltip = document.getElementById("donut-tooltip");
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const gap = 2; // px of surface between segments
  let offset = 0;

  for (const seg of segments) {
    const length = (seg.value / total) * circumference;
    const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    arc.setAttribute("cx", 100);
    arc.setAttribute("cy", 100);
    arc.setAttribute("r", r);
    arc.setAttribute("class", "donut-seg");
    arc.style.stroke = seg.color;
    arc.setAttribute("stroke-dasharray", `${Math.max(length - gap, 0)} ${circumference}`);
    arc.setAttribute("stroke-dashoffset", -offset);
    const pct = Math.round((seg.value / total) * 100);
    arc.addEventListener("mousemove", (e) => {
      tooltip.innerHTML = `<strong>${seg.label}</strong><br>${pct}% · ${fmtKg(seg.value)}`;
      tooltip.hidden = false;
      const box = svg.parentElement.getBoundingClientRect();
      tooltip.style.left = `${e.clientX - box.left + 12}px`;
      tooltip.style.top = `${e.clientY - box.top + 12}px`;
    });
    arc.addEventListener("mouseleave", () => (tooltip.hidden = true));
    svg.appendChild(arc);
    offset += length;
  }

  const pcts = segments.map((s) => `${Math.round((s.value / total) * 100)}%`);
  document.getElementById("donut-center").textContent = pcts.join(" / ");
  document.getElementById("donut-legend").innerHTML = segments
    .map((s, i) => `<li><span class="swatch" style="background:${s.color}"></span>${s.label} <span class="legend-value">${pcts[i]}</span></li>`)
    .join("");
}

renderGrid();
renderDonut();
