// ============================================================
// CONFIG.JS — parametri statici dell'app
// Modifica qui tempi di percorrenza e destinazioni
// ============================================================
var CFG = {
  version: "3.6.0",
  lastUpdate: "2026-04-29",
  fermata: "Via Giacomo Rossini 35, Busto Garolfo (MI)",
  defaults: {
    walkRossini: 5,
    driveCanegrate: 8
  },
  // Destinazioni raggiungibili via M1 da Molino Dorino
  // minutesFromMolino = minuti AGGIUNTIVI dopo l'arrivo al capolinea
  m1_destinations: [
    { id: "molino",     name: "\uD83D\uDD35 Molino Dorino",          minutesFromMolino: 0  },
    { id: "pagano",     name: "\uD83D\uDD35 Pagano / Buonarroti",    minutesFromMolino: 6  },
    { id: "cadorna",    name: "\uD83D\uDD35\uD83D\uDD34 Cadorna FNM",           minutesFromMolino: 10 },
    { id: "duomo",      name: "\uD83D\uDD34\uD83D\uDFE1 Duomo",                 minutesFromMolino: 12 },
    { id: "repubblica", name: "\uD83D\uDD35\uD83D\uDD34\uD83D\uDFE1 Repubblica",          minutesFromMolino: 14 },
    { id: "centrale",   name: "\uD83D\uDFE1 Centrale FS",             minutesFromMolino: 18 }
  ],
  // Destinazioni raggiungibili via S5/S6 da Pregnana FS
  // minutesFromPregnana = minuti dopo la partenza del treno da Pregnana
  s5s6_destinations: [
    { name: "\uD83D\uDE82 Bovisa FNM",             minutesFromPregnana: 10 },
    { name: "\uD83D\uDE82 P.ta Garibaldi",         minutesFromPregnana: 20 },
    { name: "\uD83D\uDE82 Repubblica (Passante)",  minutesFromPregnana: 25 },
    { name: "\uD83D\uDE82 Dateo",                  minutesFromPregnana: 29 }
  ],
  // Parametri stima Canegrate
  canegrate: {
    travelToMilano: 25,
    note: "Stima Canegrate→Cadorna via Trenord"
  }
};
