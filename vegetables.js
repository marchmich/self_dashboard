// EXAMPLE numbers for the public GitHub version only. The real figures stay in
// the private Google Sheet and are only shown by the Apps Script version.
// Fields match the sheet's columns: Product, Type, Total Weight (KG),
// Market Sale Weight (KG), Family Consumption Weight (KG), Market Sale Revenue
// (FCFA), Family Consumption Revenue (FCFA), Total Revenue (FCFA).
const example = (name, type) => ({
  name, type,
  totalWeight: 20, marketWeight: 6, familyWeight: 14,
  marketRevenue: 12000, familyRevenue: 28000, totalRevenue: 40000,
});

const VEGETABLES = [
  example("Amaranthe", "Culture maraîchère"),
  example("Arachide", "Culture maraîchère"),
  example("Aubergine", "Culture maraîchère"),
  example("Bananier", "Arbre fruitier à cycle court"),
  example("Carotte", "Culture maraîchère"),
  example("Choux", "Culture maraîchère"),
  example("Concombre", "Culture maraîchère"),
  example("Dossi", "Culture maraîchère"),
  example("Gombo", "Culture maraîchère"),
  example("Laitue", "Culture maraîchère"),
  example("Oignon", "Culture maraîchère"),
  example("Oranger", "Arbre fruitier pérenne"),
  example("Papayer", "Arbre fruitier à cycle court"),
  example("Piment", "Culture maraîchère"),
  example("Poivron", "Culture maraîchère"),
  example("Pomme de terre", "Culture maraîchère"),
  example("Tomate", "Culture maraîchère"),
];

// Example for the table next to the donut (sheet columns J–L).
const DESTINATIONS = [
  { destination: "Family Consumption", entries: 100, cost: 50000 },
  { destination: "Market Sale", entries: 300, cost: 150000 },
];

// Example for "Production by garden" (sheet columns N–R).
const PRODUCTION = [
  { garden: "Bessassi A", kgProduced: 100, surface: 200, kgPerSqm: 0.5, waterMetric: null },
  { garden: "Bessassi B", kgProduced: 100, surface: 200, kgPerSqm: 0.5, waterMetric: null },
  { garden: "Derrassi", kgProduced: 100, surface: 200, kgPerSqm: 0.5, waterMetric: null },
  { garden: "Kourel", kgProduced: 100, surface: 200, kgPerSqm: 0.5, waterMetric: null },
];

// Example monthly production (kg) for the chart, Jan–Dec 2025.
const MONTHLY = Object.fromEntries(VEGETABLES.map((veg, n) => [
  slugify(veg.name),
  Array.from({ length: 12 }, (_, i) => ({
    month: `2025-${String(i + 1).padStart(2, "0")}`,
    kg: Math.round(40 + 30 * Math.sin((i + n) / 2) + (n % 5) * 8),
  })),
]));

// Example per-garden harvest (from the entries tab in the real version).
const GARDEN_HARVEST = {
  "bessassi-a": [{ product: "Choux", entries: 12, kg: 140 }, { product: "Laitue", entries: 9, kg: 85.5 }, { product: "Tomate", entries: 6, kg: 40 }],
  "bessassi-b": [{ product: "Carotte", entries: 10, kg: 120 }, { product: "Amaranthe", entries: 8, kg: 64 }],
  "derrassi": [{ product: "Dossi", entries: 7, kg: 55 }, { product: "Gombo", entries: 5, kg: 30.25 }],
};
