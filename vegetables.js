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
