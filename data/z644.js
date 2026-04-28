// ============================================================
// Z644.JS — Orari linea Z644
// Tutti i tempi sono in MINUTI dall'inizio della giornata
// rossini       = Via Giacomo Rossini 35, Busto Garolfo (BT775/BT776)
// parabiago_fs  = Parabiago Piazza Pisoni / Autostazione FS (PB090)
//                 null se la corsa termina a Via Butti (PB100)
// parabiago_vb  = Parabiago Via Butti 13 (PB100) — capolinea alternativo
// parabiago_prt = partenza da Parabiago (ritorno)
// arconate      = Arconate arrivo/partenza
// val = FI5=feriale invernale, SC5=solo scolastico, SIS=sabato invernale
// ============================================================
var Z644 = {
  meta: {
    linea: "Z644",
    partenza_andata:  "Arconate / Dairago \u2192 Busto Garolfo \u2013 Via Rossini 35 \u2192 Parabiago FS",
    partenza_ritorno: "Parabiago FS \u2192 Busto Garolfo \u2013 Via Rossini 35 \u2192 Arconate",
    durata_andata:    "~22 min (Via Rossini \u2192 Parabiago FS)",
    durata_ritorno:   "~14 min (Parabiago FS \u2192 Via Rossini)",
    validita: {
      FI5: "Lun\u2013Ven feriali invernale",
      SC5: "Lun\u2013Ven solo periodo scolastico",
      SIS: "Sabato feriale invernale",
      domenica: "Nessun servizio"
    },
    eccezioni: "Non valido dal 20 luglio al 6 settembre e nelle festivit\u00e0 natalizie",
    note: "Le corse senza parabiago_fs (\u2192 PB100 Via Butti) NON arrivano all'autostazione FS"
  },

  // ── FERIALE ANDATA \u2192 Parabiago ───────────────────────────────
  feriale_andata: [
    { corsa: 302, rossini: 399,  parabiago_fs: 411,  parabiago_vb: null, val: "FI5" },
    { corsa: 304, rossini: 419,  parabiago_fs: null, parabiago_vb: 440,  val: "FI5" },
    { corsa: 460, rossini: 445,  parabiago_fs: null, parabiago_vb: 473,  val: "SC5" },
    { corsa: 502, rossini: 445,  parabiago_fs: null, parabiago_vb: 470,  val: "SC5", note: "Da Dairago" },
    { corsa: 306, rossini: 449,  parabiago_fs: null, parabiago_vb: 473,  val: "FI5" },
    { corsa: 310, rossini: 524,  parabiago_fs: 536,  parabiago_vb: null, val: "FI5" },
    { corsa: 390, rossini: 579,  parabiago_fs: 591,  parabiago_vb: null, val: "FI5" },
    { corsa: 316, rossini: 703,  parabiago_fs: null, parabiago_vb: 724,  val: "SC5" },
    { corsa: 320, rossini: 774,  parabiago_fs: null, parabiago_vb: 793,  val: "SC5" },
    { corsa: 318, rossini: 849,  parabiago_fs: null, parabiago_vb: 868,  val: "SC5" },
    { corsa: 334, rossini: 876,  parabiago_fs: null, parabiago_vb: 894,  val: "SC5" },
    { corsa: 406, rossini: 879,  parabiago_fs: null, parabiago_vb: 898,  val: "SC5" },
    { corsa: 322, rossini: 914,  parabiago_fs: 926,  parabiago_vb: null, val: "SC5" },
    { corsa: 324, rossini: 954,  parabiago_fs: 966,  parabiago_vb: null, val: "FI5" },
    { corsa: 326, rossini: 979,  parabiago_fs: 991,  parabiago_vb: null, val: "FI5" }
  ],

  // ── FERIALE RITORNO Parabiago \u2192 Busto Garolfo ────────────────
  feriale_ritorno: [
    { corsa: 301, parabiago_prt: 415,  rossini: 429,  arconate: 436,  val: "FI5" },
    { corsa: 303, parabiago_prt: 445,  rossini: 464,  arconate: 473,  val: "FI5" },
    { corsa: 305, parabiago_prt: 480,  rossini: 499,  arconate: 508,  val: "FI5" },
    { corsa: 309, parabiago_prt: 540,  rossini: 554,  arconate: 561,  val: "FI5" },
    { corsa: 393, parabiago_prt: 595,  rossini: 609,  arconate: 616,  val: "FI5" },
    { corsa: 317, parabiago_prt: 730,  rossini: 753,  arconate: 761,  val: "SC5" },
    { corsa: 315, parabiago_prt: 800,  rossini: 823,  arconate: 831,  val: "SC5" },
    { corsa: 517, parabiago_prt: 800,  rossini: 819,  arconate: null, val: "SC5", note: "Termina a Dairago" },
    { corsa: 329, parabiago_prt: 855,  rossini: 874,  arconate: null, val: "SC5", note: "Termina a Dairago" },
    { corsa: 319, parabiago_prt: 860,  rossini: 883,  arconate: 891,  val: "SC5" },
    { corsa: 339, parabiago_prt: 905,  rossini: 924,  arconate: null, val: "SC5", note: "Termina a Dairago" },
    { corsa: 333, parabiago_prt: 910,  rossini: 933,  arconate: 941,  val: "SC5" },
    { corsa: 321, parabiago_prt: 940,  rossini: 954,  arconate: 961,  val: "SC5" },
    { corsa: 323, parabiago_prt: 975,  rossini: 989,  arconate: 996,  val: "FI5" },
    { corsa: 325, parabiago_prt: 995,  rossini: 1009, arconate: 1016, val: "FI5" }
  ],

  // ── SABATO ANDATA (SIS) ─────────────────────────────────────
  sabato_andata: [
    { corsa: 804, rossini: 419,  parabiago_fs: null, parabiago_vb: 440,  val: "SIS" },
    { corsa: 806, rossini: 449,  parabiago_fs: null, parabiago_vb: 473,  val: "SIS" },
    { corsa: 810, rossini: 524,  parabiago_fs: 536,  parabiago_vb: null, val: "SIS" },
    { corsa: 824, rossini: 954,  parabiago_fs: 966,  parabiago_vb: null, val: "SIS" }
  ],

  // ── SABATO RITORNO (SIS) ─────────────────────────────────────
  sabato_ritorno: [
    { corsa: 803, parabiago_prt: 445,  rossini: 464,  arconate: 473,  val: "SIS" },
    { corsa: 805, parabiago_prt: 480,  rossini: 499,  arconate: 508,  val: "SIS" },
    { corsa: 809, parabiago_prt: 540,  rossini: 554,  arconate: 561,  val: "SIS" },
    { corsa: 823, parabiago_prt: 975,  rossini: 989,  arconate: 996,  val: "SIS" }
  ]
};
