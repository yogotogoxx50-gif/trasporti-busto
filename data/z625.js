// ============================================================
// Z625.JS
// Standardized schema v4.0.0
// ============================================================
export const Z625 = {
  meta: {
  linea: "Z625",
  partenza_andata: "Busto Garolfo → Busto Arsizio FS",
  partenza_ritorno: "Busto Arsizio FS → Busto Garolfo",
  validita: {
    FR5: "Lun–Ven feriali",
    SC5: "Lun–Ven solo periodo scolastico",
    SAB: "Sabato feriale",
    sunday: "Nessun servizio"
  }
},

  weekday_outbound: [
  {
    tripId: 108,
    stops: {
      curiel: 416,
      busto_arsizio: 448,
      busto_arsizio_fs: 465
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 106,
    stops: {
      curiel: 420,
      busto_arsizio: 454,
      busto_arsizio_fs: 470
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 104,
    stops: {
      curiel: 425,
      busto_arsizio: 461,
      busto_arsizio_fs: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 190,
    stops: {
      curiel: 441,
      busto_arsizio: 483,
      busto_arsizio_fs: null
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 110,
    stops: {
      curiel: 510,
      busto_arsizio: 544,
      busto_arsizio_fs: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 224,
    stops: {
      curiel: 545,
      busto_arsizio: 576,
      busto_arsizio_fs: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 124,
    stops: {
      curiel: 615,
      busto_arsizio: 645,
      busto_arsizio_fs: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 184,
    stops: {
      curiel: 705,
      busto_arsizio: 735,
      busto_arsizio_fs: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 282,
    stops: {
      curiel: null,
      busto_arsizio: 777,
      busto_arsizio_fs: 790
    },
    validity: "SC5",
    flags: [],
    note: "Parte da Dairago"
  },
  {
    tripId: 132,
    stops: {
      curiel: 755,
      busto_arsizio: 785,
      busto_arsizio_fs: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 218,
    stops: {
      curiel: null,
      busto_arsizio: 824,
      busto_arsizio_fs: null
    },
    validity: "SC5",
    flags: [],
    note: "Parte da Dairago"
  },
  {
    tripId: 118,
    stops: {
      curiel: 810,
      busto_arsizio: 841,
      busto_arsizio_fs: 852
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 120,
    stops: {
      curiel: 870,
      busto_arsizio: 900,
      busto_arsizio_fs: null
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 180,
    stops: {
      curiel: 922,
      busto_arsizio: 952,
      busto_arsizio_fs: 965
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 666,
    stops: {
      curiel: 955,
      busto_arsizio: 985,
      busto_arsizio_fs: 997
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 126,
    stops: {
      curiel: 1005,
      busto_arsizio: null,
      busto_arsizio_fs: 1046
    },
    validity: "FR5",
    flags: [],
    note: ""
  }
],

  // ── FERIALE RITORNO Busto Arsizio \u2192 BG ─────────────────────
  weekday_return: [
  {
    tripId: 111,
    stops: {
      dep_ba: 466,
      dep_ba_fs: null,
      arr_bg: 498
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 171,
    stops: {
      dep_ba: null,
      dep_ba_fs: 470,
      arr_bg: 519
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 153,
    stops: {
      dep_ba: 475,
      dep_ba_fs: null,
      arr_bg: 520
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 101,
    stops: {
      dep_ba: 490,
      dep_ba_fs: null,
      arr_bg: 524
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 151,
    stops: {
      dep_ba: 550,
      dep_ba_fs: null,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 223,
    stops: {
      dep_ba: 580,
      dep_ba_fs: null,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 159,
    stops: {
      dep_ba: 650,
      dep_ba_fs: null,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 199,
    stops: {
      dep_ba: 740,
      dep_ba_fs: null,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 113,
    stops: {
      dep_ba: 793,
      dep_ba_fs: 795,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 115,
    stops: {
      dep_ba: 807,
      dep_ba_fs: null,
      arr_bg: null
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 165,
    stops: {
      dep_ba: 830,
      dep_ba_fs: null,
      arr_bg: 843
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 163,
    stops: {
      dep_ba: 855,
      dep_ba_fs: 855,
      arr_bg: null
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 121,
    stops: {
      dep_ba: null,
      dep_ba_fs: null,
      arr_bg: 899
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 169,
    stops: {
      dep_ba: 905,
      dep_ba_fs: null,
      arr_bg: null
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 147,
    stops: {
      dep_ba: null,
      dep_ba_fs: 970,
      arr_bg: 1052
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 191,
    stops: {
      dep_ba: 1017,
      dep_ba_fs: 1005,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  },
  {
    tripId: 149,
    stops: {
      dep_ba: 1062,
      dep_ba_fs: 1050,
      arr_bg: null
    },
    validity: "FR5",
    flags: [],
    note: ""
  }
],

  // ── SABATO ANDATA BG \u2192 Busto Arsizio ─────────────────────
  saturday_outbound: [
  {
    tripId: 704,
    stops: {
      curiel: 390,
      busto_arsizio: 420
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 790,
    stops: {
      curiel: 450,
      busto_arsizio: 480
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 710,
    stops: {
      curiel: 510,
      busto_arsizio: 540
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 744,
    stops: {
      curiel: 570,
      busto_arsizio: 600
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 784,
    stops: {
      curiel: 700,
      busto_arsizio: 730
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 732,
    stops: {
      curiel: 755,
      busto_arsizio: 785
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 718,
    stops: {
      curiel: 815,
      busto_arsizio: 846
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 780,
    stops: {
      curiel: 910,
      busto_arsizio: 940
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 766,
    stops: {
      curiel: 1005,
      busto_arsizio: 1035
    },
    validity: "SAB",
    flags: [],
    note: ""
  }
],

  // ── SABATO RITORNO Busto Arsizio \u2192 BG ─────────────────────
  saturday_return: [
  {
    tripId: 711,
    stops: {
      dep_ba: 425,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 701,
    stops: {
      dep_ba: 485,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 751,
    stops: {
      dep_ba: 545,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 741,
    stops: {
      dep_ba: 605,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 799,
    stops: {
      dep_ba: 735,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 713,
    stops: {
      dep_ba: 790,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 763,
    stops: {
      dep_ba: 850,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 747,
    stops: {
      dep_ba: 945,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  },
  {
    tripId: 771,
    stops: {
      dep_ba: 1040,
      arr_bg: null
    },
    validity: "SAB",
    flags: [],
    note: ""
  }
]
};
