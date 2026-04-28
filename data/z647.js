// ============================================================
// Z647.JS — Orari linea Z647
// Tutti i tempi sono in MINUTI dall'inizio della giornata
// dep  = partenza (minuti da mezzanotte, es. 480 = 08:00)
// arr  = arrivo stimato
// val  = FR5=feriale, SC5=scolastico, SAB=sabato
// ============================================================
var Z647 = {
  meta: {
    linea: "Z647",
    partenza:     "TODO — inserire fermata di partenza",
    destinazione: "TODO — inserire destinazione",
    durata_minuti: "TODO",
    validita: {
      FR5: "Lun\u2013Ven feriali",
      SC5: "Lun\u2013Ven solo periodo scolastico",
      SAB: "Sabato feriale",
      domenica: "Nessun servizio"
    },
    eccezioni: "TODO — verificare eccezioni estive/natalizie",
    note: ""
  },

  // ── FERIALE ANDATA ──────────────────────────────────────────
  feriale_andata: [
    // { corsa: 101, dep: 480, arr: 505, val: "FR5", note: "" }
  ],

  // ── FERIALE RITORNO ─────────────────────────────────────────
  feriale_ritorno: [
    // { corsa: 102, dep: 510, arr: 535, val: "FR5", note: "" }
  ],

  // ── SABATO ANDATA ────────────────────────────────────────────
  sabato_andata: [
    // { corsa: 701, dep: 480, arr: 505, val: "SAB" }
  ],

  // ── SABATO RITORNO ───────────────────────────────────────────
  sabato_ritorno: [
    // { corsa: 702, dep: 510, arr: 535, val: "SAB" }
  ]
};
