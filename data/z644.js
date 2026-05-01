// ============================================================
// Z644.JS
// Standardized schema v4.0.0
// ============================================================
export const Z644 = {
  meta: {
  linea: "Z644",
  partenza_andata: "Arconate / Dairago → Busto Garolfo – Via Rossini 35 → Parabiago FS",
  partenza_ritorno: "Parabiago FS → Busto Garolfo – Via Rossini 35 → Arconate",
  durata_andata: "~22 min (Via Rossini → Parabiago FS)",
  durata_ritorno: "~14 min (Parabiago FS → Via Rossini)",
  validita: {
    FI5: "Lun–Ven feriali invernale",
    SC5: "Lun–Ven solo periodo scolastico",
    SIS: "Sabato feriale invernale",
    sunday: "Nessun servizio"
  },
  eccezioni: "Non valido dal 20 luglio al 6 settembre e nelle festività natalizie",
  note: "Le corse senza parabiago_fs (→ PB100 Via Butti) NON arrivano all'autostazione FS"
},

  weekday_outbound: [
  {
    tripId: 302,
    stops: {
      rossini: 399,
      parabiago_fs: 411,
      parabiago_vb: null
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 304,
    stops: {
      rossini: 419,
      parabiago_fs: null,
      parabiago_vb: 440
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 460,
    stops: {
      rossini: 445,
      parabiago_fs: null,
      parabiago_vb: 473
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 502,
    stops: {
      rossini: 445,
      parabiago_fs: null,
      parabiago_vb: 470
    },
    validity: "SC5",
    flags: [],
    note: "Da Dairago"
  },
  {
    tripId: 306,
    stops: {
      rossini: 449,
      parabiago_fs: null,
      parabiago_vb: 473
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 310,
    stops: {
      rossini: 524,
      parabiago_fs: 536,
      parabiago_vb: null
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 390,
    stops: {
      rossini: 579,
      parabiago_fs: 591,
      parabiago_vb: null
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 316,
    stops: {
      rossini: 703,
      parabiago_fs: null,
      parabiago_vb: 724
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 320,
    stops: {
      rossini: 774,
      parabiago_fs: null,
      parabiago_vb: 793
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 318,
    stops: {
      rossini: 849,
      parabiago_fs: null,
      parabiago_vb: 868
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 334,
    stops: {
      rossini: 876,
      parabiago_fs: null,
      parabiago_vb: 894
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 406,
    stops: {
      rossini: 879,
      parabiago_fs: null,
      parabiago_vb: 898
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 322,
    stops: {
      rossini: 914,
      parabiago_fs: 926,
      parabiago_vb: null
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 324,
    stops: {
      rossini: 954,
      parabiago_fs: 966,
      parabiago_vb: null
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 326,
    stops: {
      rossini: 979,
      parabiago_fs: 991,
      parabiago_vb: null
    },
    validity: "FI5",
    flags: [],
    note: ""
  }
],

  // ── FERIALE RITORNO Parabiago \u2192 Busto Garolfo ────────────────
  weekday_return: [
  {
    tripId: 301,
    stops: {
      parabiago_prt: 415,
      rossini: 429,
      arconate: 436
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 303,
    stops: {
      parabiago_prt: 445,
      rossini: 464,
      arconate: 473
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 305,
    stops: {
      parabiago_prt: 480,
      rossini: 499,
      arconate: 508
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 309,
    stops: {
      parabiago_prt: 540,
      rossini: 554,
      arconate: 561
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 393,
    stops: {
      parabiago_prt: 595,
      rossini: 609,
      arconate: 616
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 317,
    stops: {
      parabiago_prt: 730,
      rossini: 753,
      arconate: 761
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 315,
    stops: {
      parabiago_prt: 800,
      rossini: 823,
      arconate: 831
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 517,
    stops: {
      parabiago_prt: 800,
      rossini: 819,
      arconate: null
    },
    validity: "SC5",
    flags: [],
    note: "Termina a Dairago"
  },
  {
    tripId: 329,
    stops: {
      parabiago_prt: 855,
      rossini: 874,
      arconate: null
    },
    validity: "SC5",
    flags: [],
    note: "Termina a Dairago"
  },
  {
    tripId: 319,
    stops: {
      parabiago_prt: 860,
      rossini: 883,
      arconate: 891
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 339,
    stops: {
      parabiago_prt: 905,
      rossini: 924,
      arconate: null
    },
    validity: "SC5",
    flags: [],
    note: "Termina a Dairago"
  },
  {
    tripId: 333,
    stops: {
      parabiago_prt: 910,
      rossini: 933,
      arconate: 941
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 321,
    stops: {
      parabiago_prt: 940,
      rossini: 954,
      arconate: 961
    },
    validity: "SC5",
    flags: [],
    note: ""
  },
  {
    tripId: 323,
    stops: {
      parabiago_prt: 975,
      rossini: 989,
      arconate: 996
    },
    validity: "FI5",
    flags: [],
    note: ""
  },
  {
    tripId: 325,
    stops: {
      parabiago_prt: 995,
      rossini: 1009,
      arconate: 1016
    },
    validity: "FI5",
    flags: [],
    note: ""
  }
],

  // ── SABATO ANDATA (SIS) ─────────────────────────────────────
  saturday_outbound: [
  {
    tripId: 804,
    stops: {
      rossini: 419,
      parabiago_fs: null,
      parabiago_vb: 440
    },
    validity: "SIS",
    flags: [],
    note: ""
  },
  {
    tripId: 806,
    stops: {
      rossini: 449,
      parabiago_fs: null,
      parabiago_vb: 473
    },
    validity: "SIS",
    flags: [],
    note: ""
  },
  {
    tripId: 810,
    stops: {
      rossini: 524,
      parabiago_fs: 536,
      parabiago_vb: null
    },
    validity: "SIS",
    flags: [],
    note: ""
  },
  {
    tripId: 824,
    stops: {
      rossini: 954,
      parabiago_fs: 966,
      parabiago_vb: null
    },
    validity: "SIS",
    flags: [],
    note: ""
  }
],

  // ── SABATO RITORNO (SIS) ─────────────────────────────────────
  saturday_return: [
  {
    tripId: 803,
    stops: {
      parabiago_prt: 445,
      rossini: 464,
      arconate: 473
    },
    validity: "SIS",
    flags: [],
    note: ""
  },
  {
    tripId: 805,
    stops: {
      parabiago_prt: 480,
      rossini: 499,
      arconate: 508
    },
    validity: "SIS",
    flags: [],
    note: ""
  },
  {
    tripId: 809,
    stops: {
      parabiago_prt: 540,
      rossini: 554,
      arconate: 561
    },
    validity: "SIS",
    flags: [],
    note: ""
  },
  {
    tripId: 823,
    stops: {
      parabiago_prt: 975,
      rossini: 989,
      arconate: 996
    },
    validity: "SIS",
    flags: [],
    note: ""
  }
]
};
