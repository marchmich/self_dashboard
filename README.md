# Gardens dashboard

A static dashboard: pick a garden (Bessasi A, Bessasi B, Derassi, Kourel) and the
dimensions around the plan, the total area, and the planche table update.

Open `index.html` in a browser — no build step needed.

## Editing data

All values live in `data.js`. For each garden set `width`, `length` (metres) and
its `plots` rows. The total area is `width × length`; each row's
*Surface Cultivated* is `nbPlanche × longueur × largeur`. Add more objects to
`plots` to get more table rows, or a new key to `GARDENS` to add a garden.
