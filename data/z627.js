// ============================================================
// Z627.JS
// Standardized schema v4.0.0
// ============================================================
export const Z627 = {
  meta: {
  linea: "Z627",
  partenza: "Busto Garolfo – Via Buonarroti ang. Via Busto Arsizio (BT301)",
  destinazione: "Legnano – P.zza del Popolo FS (LG090)",
  durata_minuti: "~20",
  validita: {
    FR5: "Lun–Ven feriali",
    SC5: "Lun–Ven solo periodo scolastico",
    SAB: "Sabato feriale",
    sunday: "Nessun servizio"
  },
  eccezioni: "Non valido 3 settimane centrali agosto e festività natalizie",
  note: "Arrivi LG090 con ~ sono stimati (+20 min)"
},

  weekday: [
  {
    tripId: null,
    stops: {
      buonarroti: 352,
      legnano_fs: 371
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 372,
      legnano_fs: 391
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 386,
      legnano_fs: 405
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 402,
      legnano_fs: 421
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 414,
      legnano_fs: 435
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 435,
      legnano_fs: 458
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 437,
      legnano_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "⚠️ Termina al Liceo"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 439,
      legnano_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "⚠️ Termina al Liceo"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 445,
      legnano_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "⚠️ Termina al Liceo"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 476,
      legnano_fs: 500
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 483,
      legnano_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "⚠️ Non arriva a P.zza Popolo FS"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 514,
      legnano_fs: 536
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 544,
      legnano_fs: 566
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 574,
      legnano_fs: 596
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 604,
      legnano_fs: 624
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 634,
      legnano_fs: 654
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 664,
      legnano_fs: 684
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 694,
      legnano_fs: 714
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 724,
      legnano_fs: 744
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 759,
      legnano_fs: 779
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 766,
      legnano_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "⚠️ Termina al Liceo"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 779,
      legnano_fs: 801
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 813,
      legnano_fs: 834
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 814,
      legnano_fs: 836
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 842,
      legnano_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "⚠️ Termina al Liceo"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 844,
      legnano_fs: 866
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 869,
      legnano_fs: 891
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 903,
      legnano_fs: 923
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 904,
      legnano_fs: 926
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 939,
      legnano_fs: 960
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 964,
      legnano_fs: 985
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1024,
      legnano_fs: 1045
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1051,
      legnano_fs: 1072
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1085,
      legnano_fs: 1106
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1106,
      legnano_fs: 1127
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1144,
      legnano_fs: 1165
    },
    validity: "FR5",
    flags: [],
    note: "~"
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1174,
      legnano_fs: 1195
    },
    validity: "FR5",
    flags: [],
    note: "~"
  }
],

  // ── SABATO ───────────────────────────────────────────────
  saturday: [
  {
    tripId: null,
    stops: {
      buonarroti: 387,
      legnano_fs: 406
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 419,
      legnano_fs: 439
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 477,
      legnano_fs: 501
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 512,
      legnano_fs: 536
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 542,
      legnano_fs: 567
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 572,
      legnano_fs: 596
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 602,
      legnano_fs: 626
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 662,
      legnano_fs: 686
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 722,
      legnano_fs: 746
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 777,
      legnano_fs: 801
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 842,
      legnano_fs: 866
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 902,
      legnano_fs: 926
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 964,
      legnano_fs: 986
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1022,
      legnano_fs: 1046
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1052,
      legnano_fs: 1076
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1082,
      legnano_fs: 1106
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: null,
    stops: {
      buonarroti: 1142,
      legnano_fs: 1166
    },
    validity: "SAB",
    flags: [],
    note: ""
  }
]
};
