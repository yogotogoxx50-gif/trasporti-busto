// ============================================================
// Z625.JS — Orari linea Z625
// Tutti i tempi sono in MINUTI dall'inizio della giornata
// dep_bg     = partenza BT701 (Via Curiel / Via Busto Arsizio, Busto Garolfo)
//              ⚠️  ~6 min a piedi da Via Rossini 35 (350m)
// arr_ba     = arrivo BS090 (Busto Arsizio – Zona Centrale)
// arr_ba_fs  = arrivo BS071 (Busto Arsizio – Stazione FS Piazza Garibaldi)
//              null se la corsa non arriva alla FS
// dep_ba_fs  = partenza da Stazione FS (ritorno, solo alcune corse)
// val = FR5=feriale, SC5=scolastico, SAB=sabato
// ============================================================
var Z625 = {
  meta: {
    linea: "Z625",
    partenza:        "Busto Garolfo \u2013 Via Curiel / Via Busto Arsizio (BT701)",
    destinazione:    "Busto Arsizio \u2013 Stazione FS / Piazza Garibaldi",
    durata_minuti:   "~29 min (BT701 \u2192 BA centro)",
    walk_da_rossini: "~6 min a piedi (350m)",
    validita: {
      FR5: "Lun\u2013Ven feriali",
      SC5: "Lun\u2013Ven solo periodo scolastico",
      SAB: "Sabato feriale",
      domenica: "Nessun servizio"
    },
    eccezioni:       "Non valido nelle 3 settimane centrali agosto e festivit\u00e0 natalizie",
    coincidenze_ba:  "S5 Trenord (Milano Cadorna \u2194 Varese Nord), RE Varese\u2013Milano P.ta Garibaldi"
  },

  // ── FERIALE ANDATA BG \u2192 Busto Arsizio ────────────────────────
  feriale_andata: [
    { corsa: 108, dep_bg: 416,  arr_ba: 448,  arr_ba_fs: 465,  val: "SC5" },
    { corsa: 106, dep_bg: 420,  arr_ba: 454,  arr_ba_fs: 470,  val: "SC5" },
    { corsa: 104, dep_bg: 425,  arr_ba: 461,  arr_ba_fs: null, val: "FR5" },
    { corsa: 190, dep_bg: 441,  arr_ba: 483,  arr_ba_fs: null, val: "SC5" },
    { corsa: 110, dep_bg: 510,  arr_ba: 544,  arr_ba_fs: null, val: "FR5" },
    { corsa: 224, dep_bg: 545,  arr_ba: 576,  arr_ba_fs: null, val: "FR5" },
    { corsa: 124, dep_bg: 615,  arr_ba: 645,  arr_ba_fs: null, val: "FR5" },
    { corsa: 184, dep_bg: 705,  arr_ba: 735,  arr_ba_fs: null, val: "FR5" },
    { corsa: 282, dep_bg: null, arr_ba: 777,  arr_ba_fs: 790,  val: "SC5", note: "Parte da Dairago" },
    { corsa: 132, dep_bg: 755,  arr_ba: 785,  arr_ba_fs: null, val: "FR5" },
    { corsa: 218, dep_bg: null, arr_ba: 824,  arr_ba_fs: null, val: "SC5", note: "Parte da Dairago" },
    { corsa: 118, dep_bg: 810,  arr_ba: 841,  arr_ba_fs: 852,  val: "SC5" },
    { corsa: 120, dep_bg: 870,  arr_ba: 900,  arr_ba_fs: null, val: "SC5" },
    { corsa: 180, dep_bg: 922,  arr_ba: 952,  arr_ba_fs: 965,  val: "FR5" },
    { corsa: 666, dep_bg: 955,  arr_ba: 985,  arr_ba_fs: 997,  val: "FR5" },
    { corsa: 126, dep_bg: 1005, arr_ba: null, arr_ba_fs: 1046, val: "FR5" }
  ],

  // ── FERIALE RITORNO Busto Arsizio \u2192 BG ─────────────────────
  feriale_ritorno: [
    { corsa: 111, dep_ba: 466,  dep_ba_fs: null, arr_bg: 498,  val: "FR5" },
    { corsa: 171, dep_ba: null, dep_ba_fs: 470,  arr_bg: 519,  val: "SC5" },
    { corsa: 153, dep_ba: 475,  dep_ba_fs: null, arr_bg: 520,  val: "SC5" },
    { corsa: 101, dep_ba: 490,  dep_ba_fs: null, arr_bg: 524,  val: "SC5" },
    { corsa: 151, dep_ba: 550,  dep_ba_fs: null, arr_bg: null, val: "FR5" },
    { corsa: 223, dep_ba: 580,  dep_ba_fs: null, arr_bg: null, val: "FR5" },
    { corsa: 159, dep_ba: 650,  dep_ba_fs: null, arr_bg: null, val: "FR5" },
    { corsa: 199, dep_ba: 740,  dep_ba_fs: null, arr_bg: null, val: "FR5" },
    { corsa: 113, dep_ba: 793,  dep_ba_fs: 795,  arr_bg: null, val: "FR5" },
    { corsa: 115, dep_ba: 807,  dep_ba_fs: null, arr_bg: null, val: "SC5" },
    { corsa: 165, dep_ba: 830,  dep_ba_fs: null, arr_bg: 843,  val: "SC5" },
    { corsa: 163, dep_ba: 855,  dep_ba_fs: 855,  arr_bg: null, val: "SC5" },
    { corsa: 121, dep_ba: null, dep_ba_fs: null, arr_bg: 899,  val: "SC5" },
    { corsa: 169, dep_ba: 905,  dep_ba_fs: null, arr_bg: null, val: "SC5" },
    { corsa: 147, dep_ba: null, dep_ba_fs: 970,  arr_bg: 1052, val: "FR5" },
    { corsa: 191, dep_ba: 1017, dep_ba_fs: 1005, arr_bg: null, val: "FR5" },
    { corsa: 149, dep_ba: 1062, dep_ba_fs: 1050, arr_bg: null, val: "FR5" }
  ],

  // ── SABATO ANDATA BG \u2192 Busto Arsizio ─────────────────────
  sabato_andata: [
    { corsa: 704, dep_bg: 390,  arr_ba: 420,  val: "SAB" },
    { corsa: 790, dep_bg: 450,  arr_ba: 480,  val: "SAB" },
    { corsa: 710, dep_bg: 510,  arr_ba: 540,  val: "SAB" },
    { corsa: 744, dep_bg: 570,  arr_ba: 600,  val: "SAB" },
    { corsa: 784, dep_bg: 700,  arr_ba: 730,  val: "SAB" },
    { corsa: 732, dep_bg: 755,  arr_ba: 785,  val: "SAB" },
    { corsa: 718, dep_bg: 815,  arr_ba: 846,  val: "SAB" },
    { corsa: 780, dep_bg: 910,  arr_ba: 940,  val: "SAB" },
    { corsa: 766, dep_bg: 1005, arr_ba: 1035, val: "SAB" }
  ],

  // ── SABATO RITORNO Busto Arsizio \u2192 BG ─────────────────────
  sabato_ritorno: [
    { corsa: 711, dep_ba: 425,  arr_bg: null, val: "SAB" },
    { corsa: 701, dep_ba: 485,  arr_bg: null, val: "SAB" },
    { corsa: 751, dep_ba: 545,  arr_bg: null, val: "SAB" },
    { corsa: 741, dep_ba: 605,  arr_bg: null, val: "SAB" },
    { corsa: 799, dep_ba: 735,  arr_bg: null, val: "SAB" },
    { corsa: 713, dep_ba: 790,  arr_bg: null, val: "SAB" },
    { corsa: 763, dep_ba: 850,  arr_bg: null, val: "SAB" },
    { corsa: 747, dep_ba: 945,  arr_bg: null, val: "SAB" },
    { corsa: 771, dep_ba: 1040, arr_bg: null, val: "SAB" }
  ]
};
