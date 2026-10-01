// Garden data — edit these values to match your real measurements.
// width/length are in metres; the area is computed automatically.
// Each table row: surface cultivated = nbPlanche × longueur × largeur.
const GARDENS = {
  "bessasi-a": {
    name: "Bessasi A",
    width: 62,
    length: 62,
    image: "assets/garden.svg",
    plots: [
      { status: "Active", type: "Tomates", nbPlanche: 10, longueur: 20, largeur: 1.2 },
    ],
  },
  "bessasi-b": {
    name: "Bessasi B",
    width: 48,
    length: 35,
    image: "assets/garden.svg",
    plots: [
      { status: "Active", type: "Carottes", nbPlanche: 8, longueur: 15, largeur: 1 },
    ],
  },
  "derassi": {
    name: "Derassi",
    width: 80,
    length: 50,
    image: "assets/garden.svg",
    plots: [
      { status: "En jachère", type: "Laitues", nbPlanche: 12, longueur: 25, largeur: 1.2 },
    ],
  },
  "kourel": {
    name: "Kourel",
    width: 40,
    length: 30,
    image: "assets/garden.svg",
    plots: [
      { status: "Active", type: "Poivrons", nbPlanche: 6, longueur: 18, largeur: 1 },
    ],
  },
};
