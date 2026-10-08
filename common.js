// Shared helpers for the dashboard (used by both the GitHub site and Apps Script).
const fmt = (n) => Number(n.toFixed(2)).toLocaleString("fr-FR", { useGrouping: false });
const fmtKg = (n) => `${Number(n.toFixed(2)).toLocaleString("fr-FR")} kg`;
const fmtFcfa = (n) => `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

// Values can come from a Google Sheet, so never insert them into HTML unescaped.
const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch {} },
};
