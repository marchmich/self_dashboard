// Gardeners (maraîchères) per garden — keys match GARDENS in data.js.
// Stats are not filled in yet: add any of these fields to a gardener and
// they show up on that gardener's square, e.g.
//   { name: "YAROU Gani", planches: 4, surface: 96, harvest: 120, crops: "Tomates, Oignons" }
const GARDENERS = {
  "bessasi-a": [
    "YAROU Gani", "OROU B. Assiatou", "SASSANI Fatouma", "IDRISSOU Bona",
    "OROU BAKA Fati", "MASSO Noura", "KARAKA SATOU", "BAHKOTO Azera",
    "Boni Nana", "BONI Gnongbea", "ASSOUMA Adissa", "MAMA Adissa",
    "TOURE Samata", "KASSE Aouletou", "SALIFOU satou", "Sabi boum Mariama",
    "ILIASSOU Lamatou", "WAGBESA Rabiatou", "WONINA Lafatou", "BONI Nagado",
    "GOUNOU Zalia", "MAMA Adissa",
  ],
  "bessasi-b": [
    "AMADOU SATOU", "SAH RESO ZENABOU", "MOUSSA SATOU", "BOUKARI NAKOUMA",
    "SANNI OLI ZARA", "BONI FATI", "MEGOUNA ZENABOU", "SEH MERE ANATOU",
    "ALIOU LELA", "ALASSANE AISSATOU", "OROU GBASSI ZARA", "MOUSSA LAMATOU",
    "ISSA LAFA", "ISSIAKA ADAMA", "BAH SEH MAMATOU", "BAGOUDOU LALIA",
    "GABA FATI", "SOUMAILA ZINATOU", "GOUNOU ZALIA", "KARAKA GADO",
    "BAH KOTO AMINA",
  ],
  "derassi": [
    "YAROU Madeleine", "SOIBUI Bougnon", "GANBAKI Zenabou", "ZIME Fati",
    "MORA Adissa", "ABOU Mariam", "MAMA Awa", "GUERRA Oly",
    "YACOUBOU Zénabou", "MAMA biba", "TOTO Adama", "ZIME Kpagnéro",
    "SARE Maimou", "ISSFOU Safia", "MORA Zenabou",
  ],
  "kourel": [
    "DEMON AISSETOU", "WABI ADAMA", "GANI SEKO MARIAM", "DEBO KORA",
    "WABI MARIAM", "SACCA DAMA", "MORA MANOU",
  ],
};
