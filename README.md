# Farm dashboard

A static dashboard with three tabs: **Agriculture**, **Energy** and **Water**
(Energy and Water are empty for now). The Agriculture tab has two sections.

**Agriculture** — a grid of vegetables with their harvest weight. Hover, tap or tab to
a vegetable to enlarge it and see how much is to be sold vs. kept, which garden
it grows in, and its season. The donut chart totals the sold / consumed split
across all vegetables. Data lives in `vegetables.js`, icons in `icons.js`.

**Gardens** — pick a garden (Bessasi A, Bessasi B, Derassi, Kourel) and the
dimensions around the plan, the total area, and the planche table update.

Open `index.html` in a browser — no build step needed.

## Two versions

- **GitHub Pages** (this folder): reads the numbers from `data.js`,
  `vegetables.js` and `gardeners.js`. Anyone with the address can see it.
- **Google Apps Script** (`apps-script/`): the same page, reading the numbers
  from a private Google Sheet. See [`apps-script/SETUP.md`](apps-script/SETUP.md).

Both share the display code (`common.js`, `tabs.js`, `icons.js`,
`agriculture.js`, `script.js`, `styles.css`). After changing any of it, run
`python3 tools/build_apps_script.py` to refresh `apps-script/Index.html`.

## Editing data

All values live in `data.js`. For each garden set `width`, `length` (metres) and
its `plots` rows. The total area is `width × length`; each row's
*Surface Cultivated* is `nbPlanche × longueur × largeur`. Add more objects to
`plots` to get more table rows, or a new key to `GARDENS` to add a garden.

**Gardeners** — under the table, one square per gardener of the selected garden.
Names live in `gardeners.js`; stats (planches, surface, harvest, crops) show
"—" until you add them there.
