const TAB_KEY = "dashboard-tab";
const tabs = [...document.querySelectorAll(".tab")];

function showTab(name) {
  for (const tab of tabs) {
    const selected = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", selected);
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  }
  try { localStorage.setItem(TAB_KEY, name); } catch {}
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab));
  // Arrow keys move between tabs.
  tab.addEventListener("keydown", (e) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = tabs[(i + step + tabs.length) % tabs.length];
    showTab(next.dataset.tab);
    next.focus();
  });
});

let saved = null;
try { saved = localStorage.getItem(TAB_KEY); } catch {}
showTab(tabs.some((t) => t.dataset.tab === saved) ? saved : "agriculture");
