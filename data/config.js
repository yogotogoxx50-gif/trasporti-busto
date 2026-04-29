// ============================================================
// CONFIG.JS — parametri statici dell'app
// Modifica qui tempi di percorrenza e destinazioni
// ============================================================
var CFG = {
  // Festività italiane (trattate come domenica: orario domenicale)
  // ⚠️ ATTENZIONE: Aggiornare ogni anno con la data di Pasquetta!
  // I dati attuali coprono solo fino a Dicembre 2026.
  holidays: [
    // 2025
    "2025-01-01", // Capodanno
    "2025-01-06", // Epifania
    "2025-04-21", // Pasquetta
    "2025-04-25", // Liberazione
    "2025-05-01", // Festa del Lavoro
    "2025-06-02", // Festa della Repubblica
    "2025-08-15", // Ferragosto
    "2025-11-01", // Tutti i Santi
    "2025-12-08", // Immacolata
    "2025-12-25", // Natale
    "2025-12-26", // Santo Stefano
    // 2026
    "2026-01-01", // Capodanno
    "2026-01-06", // Epifania
    "2026-04-06", // Pasquetta
    "2026-04-25", // Liberazione
    "2026-05-01", // Festa del Lavoro
    "2026-06-02", // Festa della Repubblica
    "2026-08-15", // Ferragosto
    "2026-11-01", // Tutti i Santi
    "2026-12-08", // Immacolata
    "2026-12-25", // Natale
    "2026-12-26"  // Santo Stefano
  ],
  version: "3.7.0",
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
