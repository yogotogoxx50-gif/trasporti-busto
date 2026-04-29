// ============================================================
// Z647.JS — Orari linea Z647
// Tutti i tempi sono in MINUTI dall'inizio della giornata
// ============================================================
var Z647 = {
  meta: {
    linea: "Z647",
    percorso_principale: "Cornaredo/Arluno → Pregnana/Rogorotto → Casorezzo → Busto Garolfo → Arconate → Buscate → Castano P.",
    percorso_ritorno: "Castano P. → Buscate → Arconate → Busto Garolfo → Casorezzo → Arluno → Rogorotto/Pregnana/Cuggiono",
    validita: {
      SC5: "Lun–Ven solo periodo scolastico"
    },
    eccezioni: "Non valido nelle 3 settimane centrali di agosto e nei giorni 1 gennaio, 1 maggio e 25 dicembre"
  },

  feriale_andata: [
    { corsa: 902, CD166: 410, CD155: 411, PG055: 414, PG030: 417, PG099: 419, PG101: 420, MN015: 424, RG011: 426, AL050: null, AL195: null, AL196: null, "05011": null, CZ093: null, CZ094: null, CZ080: null, IN433: null, IN351: null, IN235: null, IN403: null, CG250: null, CG143: null, CG178: null, CG998: null, BT215: null, BT300: null, BT776: null, BT999_dep: null, BT949: null, BT956: 456, AC628: 462, AC035: 465, BC250: 474, CT011: 484, CT110: null, CT100: null, flags: ["SC5"] },
    { corsa: 904, CD166: null, CD155: null, PG055: null, PG030: null, PG099: null, PG101: null, MN015: null, RG011: null, AL050: 425, AL195: 427, AL196: 429, "05011": 434, CZ093: 437, CZ094: 440, CZ080: 443, IN433: 449, IN351: 453, IN235: 455, IN403: 457, CG250: 460, CG143: 462, CG178: 464, CG998: 466, BT215: null, BT300: null, BT776: null, BT999_dep: null, BT949: null, BT956: null, AC628: null, AC035: null, BC250: null, CT011: 474, CT110: null, CT100: null, flags: ["SC5"] },
    { corsa: 908, CD166: null, CD155: null, PG055: null, PG030: null, PG099: null, PG101: null, MN015: null, RG011: null, AL050: 428, AL195: 429, AL196: 433, "05011": 438, CZ093: 442, CZ094: 444, CZ080: 447, IN433: null, IN351: null, IN235: null, IN403: null, CG250: null, CG143: null, CG178: null, CG998: null, BT215: 452, BT300: 453, BT776: 454, BT999_dep: 775, BT949: 777, BT956: null, AC628: 781, AC035: 783, BC250: 792, CT011: 799, CT110: null, CT100: null, flags: ["SC5"] },
    { corsa: 906, CD166: null, CD155: null, PG055: null, PG030: null, PG099: null, PG101: null, MN015: null, RG011: null, AL050: null, AL195: null, AL196: null, "05011": null, CZ093: null, CZ094: null, CZ080: null, IN433: null, IN351: null, IN235: null, IN403: null, CG250: null, CG143: null, CG178: null, CG998: null, BT215: null, BT300: null, BT776: null, BT999_dep: 446, BT949: 448, BT956: 450, AC628: 454, AC035: 456, BC250: 463, CT011: 471, CT110: 475, CT100: 480, flags: ["SC5"] },
    { corsa: 910, CD166: null, CD155: null, PG055: null, PG030: null, PG099: null, PG101: null, MN015: null, RG011: null, AL050: null, AL195: null, AL196: null, "05011": null, CZ093: null, CZ094: null, CZ080: null, IN433: null, IN351: null, IN235: null, IN403: null, CG250: null, CG143: null, CG178: null, CG998: null, BT215: null, BT300: null, BT776: null, BT999_dep: 825, BT949: 827, BT956: null, AC628: 831, AC035: 832, BC250: 838, CT011: 846, CT110: null, CT100: null, flags: ["SC5"] }
  ],

  feriale_ritorno: [
    { corsa: 933, CT100: 483, CT050: 485, CT001: 488, BC211: 494, CG999: null, CG149: null, CG143: null, CG190: null, IN285: null, IN275: null, IN350: null, IN375: null, AC625: 501, AC627: 503, BT951: 506, BT999_arr: 507, BT205: null, BT775: null, BT400: null, BT211: null, CZ010: null, IN433: null, CZ088: null, CZ070: null, "05001": null, AL040: null, AL501: null, AL185: null, AL051: null, RG001: null, MN021: null, flags: ["SC5"] },
    { corsa: 905, CT100: null, CT050: null, CT001: 805, BC211: 811, CG999: null, CG149: null, CG143: null, CG190: null, IN285: null, IN275: null, IN350: null, IN375: null, AC625: 819, AC627: 820, BT951: null, BT999_arr: null, BT205: null, BT775: null, BT400: null, BT211: null, CZ010: null, IN433: null, CZ088: 835, CZ070: 838, "05001": 840, AL040: 845, AL501: 847, AL185: 849, AL051: 852, RG001: 854, MN021: 855, flags: ["SC5"] },
    { corsa: 907, CT100: null, CT050: null, CT001: 805, BC211: 811, CG999: 817, CG149: 819, CG143: 820, CG190: 821, IN285: 823, IN275: 826, IN350: 829, IN375: 831, AC625: null, AC627: null, BT951: null, BT999_arr: null, BT205: 824, BT775: 826, BT400: 829, BT211: 830, CZ010: 833, IN433: null, CZ088: 836, CZ070: 838, "05001": 841, AL040: 844, AL501: 845, AL185: 847, AL051: 849, RG001: 852, MN021: 854, flags: ["SC5"] },
    { corsa: 949, CT100: null, CT050: null, CT001: 860, BC211: 866, CG999: null, CG149: null, CG143: null, CG190: null, IN285: null, IN275: null, IN350: null, IN375: null, AC625: 873, AC627: 875, BT951: null, BT999_arr: null, BT205: null, BT775: null, BT400: null, BT211: null, CZ010: null, IN433: null, CZ088: 886, CZ070: 889, "05001": null, AL040: null, AL501: null, AL185: null, AL051: null, RG001: null, MN021: null, flags: ["SC5"] },
    { corsa: 909, CT100: null, CT050: null, CT001: 865, BC211: 870, CG999: 876, CG149: 878, CG143: 879, CG190: 880, IN285: 882, IN275: 885, IN350: 888, IN375: 890, AC625: null, AC627: null, BT951: null, BT999_arr: null, BT205: 878, BT775: 879, BT400: 880, BT211: 881, CZ010: 884, IN433: null, CZ088: 895, CZ070: 897, "05001": 900, AL040: 904, AL501: 905, AL185: 907, AL051: 909, RG001: null, MN021: null, flags: ["SC5"] },
    { corsa: 951, CT100: null, CT050: null, CT001: 925, BC211: 931, CG999: null, CG149: null, CG143: null, CG190: null, IN285: null, IN275: null, IN350: null, IN375: null, AC625: 938, AC627: 940, BT951: null, BT999_arr: null, BT205: 943, BT775: 944, BT400: 945, BT211: 946, CZ010: 949, IN433: null, CZ088: 951, CZ070: 954, "05001": 957, AL040: 961, AL501: 962, AL185: 964, AL051: 966, RG001: null, MN021: null, flags: ["SC5"] },
    { corsa: 953, CT100: null, CT050: null, CT001: 980, BC211: 986, CG999: null, CG149: null, CG143: null, CG190: null, IN285: null, IN275: null, IN350: null, IN375: null, AC625: 993, AC627: 995, BT951: null, BT999_arr: null, BT205: 998, BT775: 999, BT400: 1000, BT211: 1001, CZ010: 1004, IN433: 1010, CZ088: null, CZ070: null, "05001": null, AL040: null, AL501: null, AL185: null, AL051: null, RG001: null, MN021: null, flags: ["SC5"] }
  ]
};
