// ============================================================
// Z627.JS — Orari linea Z627
// Tutti i tempi sono in MINUTI dall'inizio della giornata
// dep = partenza BT301 (Via Buonarroti ang. Via Busto Arsizio)
// arr = arrivo LG090  (Legnano P.zza Popolo FS) — null = corsa breve
// val = validità: FR5=feriale, SC5=scolastico, SAB=sabato
// ============================================================
var Z627 = {
  meta: {
    linea: "Z627",
    partenza:     "Busto Garolfo – Via Buonarroti ang. Via Busto Arsizio (BT301)",
    destinazione: "Legnano – P.zza del Popolo FS (LG090)",
    durata_minuti: "~20",
    validita: {
      FR5: "Lun–Ven feriali",
      SC5: "Lun–Ven solo periodo scolastico",
      SAB: "Sabato feriale",
      domenica: "Nessun servizio"
    },
    eccezioni: "Non valido 3 settimane centrali agosto e festività natalizie",
    note: "Arrivi LG090 con ~ sono stimati (+20 min)"
  },

  // ── FERIALE (FR5 + SC5) ──────────────────────────────────
  feriale: [
    { dep: 352,  arr: 371,  val: "FR5", note: "" },
    { dep: 372,  arr: 391,  val: "SC5", note: "" },
    { dep: 386,  arr: 405,  val: "FR5", note: "" },
    { dep: 402,  arr: 421,  val: "SC5", note: "" },
    { dep: 414,  arr: 435,  val: "FR5", note: "" },
    { dep: 435,  arr: 458,  val: "FR5", note: "" },
    { dep: 437,  arr: null, val: "SC5", note: "⚠️ Termina al Liceo" },
    { dep: 439,  arr: null, val: "SC5", note: "⚠️ Termina al Liceo" },
    { dep: 445,  arr: null, val: "SC5", note: "⚠️ Termina al Liceo" },
    { dep: 476,  arr: 500,  val: "FR5", note: "" },
    { dep: 483,  arr: null, val: "SC5", note: "⚠️ Non arriva a P.zza Popolo FS" },
    { dep: 514,  arr: 536,  val: "FR5", note: "" },
    { dep: 544,  arr: 566,  val: "SC5", note: "" },
    { dep: 574,  arr: 596,  val: "SC5", note: "" },
    { dep: 604,  arr: 624,  val: "FR5", note: "" },
    { dep: 634,  arr: 654,  val: "FR5", note: "" },
    { dep: 664,  arr: 684,  val: "FR5", note: "" },
    { dep: 694,  arr: 714,  val: "FR5", note: "" },
    { dep: 724,  arr: 744,  val: "FR5", note: "" },
    { dep: 759,  arr: 779,  val: "SC5", note: "" },
    { dep: 766,  arr: null, val: "SC5", note: "⚠️ Termina al Liceo" },
    { dep: 779,  arr: 801,  val: "FR5", note: "" },
    { dep: 813,  arr: 834,  val: "SC5", note: "" },
    { dep: 814,  arr: 836,  val: "FR5", note: "" },
    { dep: 842,  arr: null, val: "SC5", note: "⚠️ Termina al Liceo" },
    { dep: 844,  arr: 866,  val: "FR5", note: "" },
    { dep: 869,  arr: 891,  val: "FR5", note: "" },
    { dep: 903,  arr: 923,  val: "SC5", note: "" },
    { dep: 904,  arr: 926,  val: "FR5", note: "" },
    { dep: 939,  arr: 960,  val: "FR5", note: "~" },
    { dep: 964,  arr: 985,  val: "FR5", note: "~" },
    { dep: 1024, arr: 1045, val: "FR5", note: "~" },
    { dep: 1051, arr: 1072, val: "FR5", note: "~" },
    { dep: 1085, arr: 1106, val: "FR5", note: "~" },
    { dep: 1106, arr: 1127, val: "FR5", note: "~" },
    { dep: 1144, arr: 1165, val: "FR5", note: "~" },
    { dep: 1174, arr: 1195, val: "FR5", note: "~" }
  ],

  // ── SABATO ───────────────────────────────────────────────
  sabato: [
    { dep: 387,  arr: 406,  val: "SAB", note: "" },
    { dep: 419,  arr: 439,  val: "SAB", note: "" },
    { dep: 477,  arr: 501,  val: "SAB", note: "" },
    { dep: 512,  arr: 536,  val: "SAB", note: "" },
    { dep: 542,  arr: 567,  val: "SAB", note: "" },
    { dep: 572,  arr: 596,  val: "SAB", note: "" },
    { dep: 602,  arr: 626,  val: "SAB", note: "" },
    { dep: 662,  arr: 686,  val: "SAB", note: "" },
    { dep: 722,  arr: 746,  val: "SAB", note: "" },
    { dep: 777,  arr: 801,  val: "SAB", note: "" },
    { dep: 842,  arr: 866,  val: "SAB", note: "" },
    { dep: 902,  arr: 926,  val: "SAB", note: "" },
    { dep: 964,  arr: 986,  val: "SAB", note: "" },
    { dep: 1022, arr: 1046, val: "SAB", note: "" },
    { dep: 1052, arr: 1076, val: "SAB", note: "" },
    { dep: 1082, arr: 1106, val: "SAB", note: "" },
    { dep: 1142, arr: 1166, val: "SAB", note: "" }
  ]
};
