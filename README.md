# Farm dashboard

A static dashboard with three tabs: **Agriculture**, **Energy** and **Water**
(Energy and Water are empty for now). The Agriculture tab has two sections.

**Agriculture** — a grid of vegetables with their harvest weight. Hover, tap or tab to
a vegetable to enlarge it and see how much is to be sold vs. kept, which garden
it grows in, and its season. The donut chart totals the sold / consumed split
across all vegetables. Data and icons live in `vegetables.js`.

**Gardens** — pick a garden (Bessasi A, Bessasi B, Derassi, Kourel) and the
dimensions around the plan, the total area, and the planche table update.

Open `index.html` in a browser — no build step needed.

## Editing data

All values live in `data.js`. For each garden set `width`, `length` (metres) and
its `plots` rows. The total area is `width × length`; each row's
*Surface Cultivated* is `nbPlanche × longueur × largeur`. Add more objects to
`plots` to get more table rows, or a new key to `GARDENS` to add a garden.

**Gardeners** — under the table, one square per gardener of the selected garden.
Names live in `gardeners.js`; stats (planches, surface, harvest, crops) show
"—" until you add them there.
