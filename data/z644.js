// ============================================================
// Z644.JS — Orari linea Z644
// Tutti i tempi sono in MINUTI dall'inizio della giornata
// rossini       = Via Giacomo Rossini 35, Busto Garolfo (BT775/BT776)
// parabiago_fs  = Parabiago Piazza Pisoni / Autostazione FS (PB090) — null se corsa termina a Via Butti
// parabiago_vb  = Parabiago Via Butti 13 (PB100) — capolinea alt., non autostazione
// parabiago_prt = partenza da Parabiago (ritorno)
// arconate      = Arconate arrivo/partenza (AC628/AC035)
// val = FI5=feriale invernale, SC5=solo scolastico, SIS=sabato invernale
// ============================================================
var Z644 = {
  meta: {
    linea: "Z644",
    partenza_andata:  "Arconate / Dairago → Busto Garolfo – Via Rossini 35 → Parabiago FS",
    partenza_ritorno: "Parabiago FS → Busto Garolfo – Via Rossini 35 → Arconate",
    durata_andata:    "~22 min (Via Rossini → Parabiago FS)",
    durata_ritorno:   "~14 min (Parabiago FS → Via Rossini)",
    validita: {
      FI5: "Lun–Ven feriali invernale",
      SC5: "Lun–Ven solo periodo scolastico",
      SIS: "Sabato feriale invernale",
      domenica: "Nessun servizio"
    },
    eccezioni: "Non valido dal 20 luglio al 6 settembre e nelle festività natalizie",
    note: "Le corse senza parabiago_fs (→ PB100 Via Butti) NON arrivano all'autostazione FS"
  },

  // ── FERIALE ANDATA → Parabiago ──────────────────────────────
  feriale_andata: [
    { rossini: 399,  parabiago_fs: 411,  parabiago_vb: null, val: "FI5", note: "" },
    { rossini: 419,  parabiago_fs: null, parabiago_vb: 440,  val: "FI5", note: "" },
    { rossini: 445,  parabiago_fs: null, parabiago_vb: 473,  val: "SC5", note: "" },
    { rossini: 445,  parabiago_fs: null, parabiago_vb: 470,  val: "SC5", note: "Da Dairago" },
    { rossini: 449,  parabiago_fs: null, parabiago_vb: 473,  val: "FI5", note: "" },
    { rossini: 524,  parabiago_fs: 536,  parabiago_vb: null, val: "FI5", note: "" },
    { rossini: 579,  parabiago_fs: 591,  parabiago_vb: null, val: "FI5", note: "" },
    { rossini: 703,  parabiago_fs: null, parabiago_vb: 724,  val: "SC5", note: "" },
    { rossini: 774,  parabiago_fs: null, parabiago_vb: 793,  val: "SC5", note: "" },
    { rossini: 849,  parabiago_fs: null, parabiago_vb: 868,  val: "SC5", note: "" },
    { rossini: 876,  parabiago_fs: null, parabiago_vb: 894,  val: "SC5", note: "" },
    { rossini: 914,  parabiago_fs: 926,  parabiago_vb: null, val: "SC5", note: "" },
    { rossini: 954,  parabiago_fs: 966,  parabiago_vb: null, val: "FI5", note: "" },
    { rossini: 979,  parabiago_fs: 991,  parabiago_vb: null, val: "FI5", note: "" }
  ],

  // ── FERIALE RITORNO Parabiago → Busto Garolfo ───────────────
  feriale_ritorno: [
    { parabiago_prt: 415,  rossini: 429,  arconate: 436,  val: "FI5", note: "" },
    { parabiago_prt: 445,  rossini: 464,  arconate: 473,  val: "FI5", note: "" },
    { parabiago_prt: 480,  rossini: 499,  arconate: 508,  val: "FI5", note: "" },
    { parabiago_prt: 540,  rossini: 554,  arconate: 561,  val: "FI5", note: "" },
    { parabiago_prt: 595,  rossini: 609,  arconate: 616,  val: "FI5", note: "" },
    { parabiago_prt: 730,  rossini: 753,  arconate: 761,  val: "SC5", note: "" },
    { parabiago_prt: 800,  rossini: 823,  arconate: 831,  val: "SC5", note: "" },
    { parabiago_prt: 800,  rossini: 819,  arconate: null, val: "SC5", note: "Termina a Dairago" },
    { parabiago_prt: 855,  rossini: 874,  arconate: null, val: "SC5", note: "Termina a Dairago" },
    { parabiago_prt: 860,  rossini: 883,  arconate: 891,  val: "SC5", note: "" },
    { parabiago_prt: 905,  rossini: 924,  arconate: null, val: "SC5", note: "Termina a Dairago" },
    { parabiago_prt: 910,  rossini: 933,  arconate: 941,  val: "SC5", note: "" },
    { parabiago_prt: 940,  rossini: 954,  arconate: 961,  val: "SC5", note: "" },
    { parabiago_prt: 975,  rossini: 989,  arconate: 996,  val: "FI5", note: "" },
    { parabiago_prt: 995,  rossini: 1009, arconate: 1016, val: "FI5", note: "" }
  ],

  // ── SABATO ANDATA (SIS) ──────────────────────────────────────
  sabato_andata: [
    { rossini: 419,  parabiago_fs: null, parabiago_vb: 440,  val: "SIS", note: "" },
    { rossini: 449,  parabiago_fs: null, parabiago_vb: 473,  val: "SIS", note: "" },
    { rossini: 524,  parabiago_fs: 536,  parabiago_vb: null, val: "SIS", note: "" },
    { rossini: 954,  parabiago_fs: 966,  parabiago_vb: null, val: "SIS", note: "" }
  ],

  // ── SABATO RITORNO (SIS) ─────────────────────────────────────
  sabato_ritorno: [
    { parabiago_prt: 445,  rossini: 464,  arconate: 473,  val: "SIS", note: "" },
    { parabiago_prt: 480,  rossini: 499,  arconate: 508,  val: "SIS", note: "" },
    { parabiago_prt: 540,  rossini: 554,  arconate: 561,  val: "SIS", note: "" },
    { parabiago_prt: 975,  rossini: 989,  arconate: 996,  val: "SIS", note: "" }
  ]
};
