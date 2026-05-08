const ALWAYS_VISIBLE_TYPES = new Set(['tripId', 'validity', 'flags']);

export const LINE_CONFIG = {
  "z649": {
    label: "Z649",
    type: "stopCode",
    "directions": [
      "andata",
      "ritorno"
    ],
    "tabId": "orari",
    "departureLocation": "Via Rossini",
    "arrivalLocation": "Molino Dorino M1",
    "shortRunLabel": "Arluno",
    "departureStop": "bt775",
    "arrivalStop": "md111",
    "shortRunCheck": "md111",
    "scheduleKeys": [
      "weekday_andata",
      "weekday_ritorno",
      "saturday_andata",
      "saturday_ritorno",
      "sunday_andata",
      "sunday_ritorno"
    ],
    "columns": {
      "andata": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "bt775",
          label: "Via Rossini 35",
          altKeys: [
            "via_giacomo_rossini_civ_35",
            "busto_g",
            "v_busto_a_n_131_deposito"
          ]
        },
        {
          key: "arluno",
          label: "Arluno",
          altKeys: [
            "via_adua_ang_giovanni_xxiii",
            "via_turati_58"
          ],
          hideable: true
        },
        {
          key: "ossona",
          label: "Ossona",
          altKeys: [
            "via_patriotti_fr_civ_118_a"
          ],
          hideable: true
        },
        {
          key: "casorezzo",
          label: "Casorezzo",
          altKeys: [
            "via_busto_gar_n_ang_v_s_salvatore"
          ],
          hideable: true
        },
        {
          key: "mantegazza",
          label: "Mantegazza",
          altKeys: [
            "via_madonnina_bivio"
          ],
          hideable: true
        },
        {
          key: "rogorotto",
          label: "Rogorotto",
          altKeys: [
            "via_santa_caterina_n_5"
          ],
          hideable: true
        },
        {
          key: "pg102",
          label: "Pregnana FS",
          altKeys: [
            "v_marconi_fr_civ_146_stazione_fs",
            "pregnana",
            "v_marconi_a_v_gorizia_rondo"
          ]
        },
        {
          key: "cornaredo",
          label: "Cornaredo",
          altKeys: [
            "via_san_carlo_ang_v_a_ponti"
          ],
          hideable: true
        },
        {
          key: "md111",
          label: "Molino Dorino M1",
          altKeys: [
            "mm_molino_dorino_arrivo",
            "vighignolo",
            "via_mereghetti_n_22"
          ],
          shortRunValue: "Arluno"
        },
        {
          key: "flags",
          label: "Tipo",
          type: "flags"
        }
      ],
      "ritorno": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "md001",
          label: "Molino Dorino M1",
          altKeys: [
            "mm_molino_dorino",
            "vighignolo"
          ]
        },
        {
          key: "pg101",
          label: "Pregnana FS",
          altKeys: [
            "v_marconi_fr_civ_67_stazione_fs",
            "pregnana"
          ]
        },
        {
          key: "rogorotto",
          label: "Rogorotto",
          altKeys: [
            "v_santa_caterina_n_4"
          ],
          hideable: true
        },
        {
          key: "mantegazza",
          label: "Mantegazza",
          altKeys: [
            "via_madonnina_bivio"
          ],
          hideable: true
        },
        {
          key: "arluno",
          label: "Arluno",
          altKeys: [
            "via_turati_fr_58",
            "p_zza_a_de_gasperi_municipio"
          ],
          hideable: true
        },
        {
          key: "ossona",
          label: "Ossona",
          altKeys: [
            "via_patrioti_n_4"
          ],
          hideable: true
        },
        {
          key: "casorezzo",
          label: "Casorezzo",
          altKeys: [
            "via_e_mattei_fr_civ_1"
          ],
          hideable: true
        },
        {
          key: "bt951",
          label: "Via Rossini area",
          altKeys: [
            "via_vincenzo_bellini_civ_44",
            "busto_g",
            "v_busto_a_n_131_deposito"
          ]
        },
        {
          key: "flags",
          label: "Tipo",
          type: "flags"
        }
      ]
    },
    "visibleStops": {
      "andata": [
        "bt775",
        "pg102",
        "md111"
      ],
      "ritorno": [
        "md001",
        "pg101",
        "bt951"
      ]
    },
    "liveStops": {
      "andata": {
        "departure": "bt775",
        "arrival": "md111"
      },
      "ritorno": {
        "departure": "md001",
        "arrival": "bt951"
      }
    },
    "referenceStops": {
      "andata": [
        "bt775"
      ],
      "ritorno": [
        "md001"
      ]
    },
    "connections": [
      {
        type: "M1",
        "stop": "md111",
        label: "M1",
        "travelTime": 3
      },
      {
        type: "S5_PREGNANA",
        "stop": "pg102",
        label: "S5/S6",
        "slotKey": "S5S6",
        "travelTime": 1
      }
    ],
    "showInLive": true,
    "noService": []
  },
  "z627": {
    label: "Z627",
    type: "stopCode",
    "directions": [
      "andata",
      "ritorno"
    ],
    "tabId": "z627",
    "departureLocation": "Via Buonarroti",
    "arrivalLocation": "Legnano FS",
    "shortRunLabel": "Liceo / tratta breve",
    "departureStop": "via_buonarroti_civ_3",
    "arrivalStop": "piazza_del_popolo_fs",
    "shortRunCheck": "piazza_del_popolo_fs",
    "scheduleKeys": [
      "weekday_andata",
      "weekday_ritorno",
      "saturday_andata",
      "saturday_ritorno"
    ],
    "columns": {
      "andata": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "via_buonarroti_civ_3",
          label: "Via Buonarroti BG",
          altKeys: [
            "via_buonarroti_a_v_carroccio",
            "via_buonarroti_ang_v_busto_a"
          ]
        },
        {
          key: "via_curiel_a_v_de_amicis",
          label: "Via Curiel BG",
          altKeys: [
            "via_curiel"
          ],
          hideable: true
        },
        {
          key: "via_per_busto_a_n_90_piscina",
          label: "BG Piscina",
          altKeys: [
            "via_per_busto_a_n_91_piscina"
          ],
          hideable: true
        },
        {
          key: "via_xx_settembre_ang_s_bernardino",
          label: "Legnano S.Bernardino",
          altKeys: [
            "v_xx_settembre_a_v_s_bernardino"
          ],
          hideable: true
        },
        {
          key: "piazza_del_popolo_fs",
          label: "Legnano FS",
          altKeys: [
            "austostazione_bus_stazione_ferroviaria",
            "piazza_del_popolo_fs_ang_via_c_colombo"
          ],
          shortRunValue: "Liceo / tratta breve"
        },
        {
          key: "flags",
          label: "Val.",
          type: "flags"
        }
      ],
      "ritorno": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "piazza_del_popolo_fs_ang_via_c_colombo",
          label: "Legnano FS",
          altKeys: [
            "piazza_del_popolo_fs",
            "austostazione_bus_stazione_ferroviaria"
          ]
        },
        {
          key: "v_xx_settembre_san_giorgio_s_l",
          label: "Legnano S.Giorgio",
          altKeys: [
            "v_xx_settembre_p_vittorio_veneto"
          ],
          hideable: true
        },
        {
          key: "via_buonarroti_civ_3",
          label: "Via Buonarroti BG",
          altKeys: [
            "via_buonarroti_a_v_carroccio"
          ]
        },
        {
          key: "via_curiel",
          label: "Via Curiel BG",
          altKeys: [
            "via_curiel_a_v_de_amicis"
          ],
          hideable: true
        },
        {
          key: "flags",
          label: "Val.",
          type: "flags"
        }
      ]
    },
    "visibleStops": {
      "andata": [
        "via_buonarroti_civ_3",
        "piazza_del_popolo_fs"
      ],
      "ritorno": [
        "piazza_del_popolo_fs_ang_via_c_colombo",
        "via_buonarroti_civ_3"
      ]
    },
    "liveStops": {
      "andata": {
        "departure": "via_buonarroti_civ_3",
        "arrival": "piazza_del_popolo_fs"
      },
      "ritorno": {
        "departure": "piazza_del_popolo_fs_ang_via_c_colombo",
        "arrival": "via_buonarroti_civ_3"
      }
    },
    "referenceStops": {
      "andata": [
        "via_buonarroti_civ_3"
      ],
      "ritorno": [
        "piazza_del_popolo_fs_ang_via_c_colombo"
      ]
    },
    "connections": [
      {
        type: "S5_LEGNANO",
        "stop": "piazza_del_popolo_fs",
        label: "S5",
        "slotKey": "S5_LEGNANO",
        "destination": "Cadorna",
        "travelToDest": 30
      }
    ],
    "showInLive": true,
    "noService": [
      "sunday"
    ]
  },
  "z644": {
    label: "Z644",
    type: "stopCode",
    "directions": [
      "andata",
      "ritorno"
    ],
    "tabId": "z644",
    "departureLocation": "Via Rossini 35",
    "arrivalLocation": "Parabiago FS",
    "shortRunLabel": "Via Butti",
    "departureStop": "via_giacomo_rossini_civ_35",
    "arrivalStop": "autostazione_park_fs",
    "shortRunCheck": "autostazione_park_fs",
    "scheduleKeys": [
      "weekday_andata",
      "weekday_ritorno",
      "saturday_andata",
      "saturday_ritorno"
    ],
    "columns": {
      "andata": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "via_concordia_n_9",
          label: "Arconate",
          altKeys: [
            "via_legnano_n_28"
          ],
          hideable: true
        },
        {
          key: "v_damiano_chiesa_civ_11",
          label: "Dairago",
          altKeys: [
            "via_damiano_chiesa_municipio"
          ],
          hideable: true
        },
        {
          key: "via_canova_ang_v_buonarroti",
          label: "Villa C.",
          altKeys: [
            "via_canova_ang_v_perugino"
          ],
          hideable: true
        },
        {
          key: "via_buonarroti_civ_3",
          label: "Via Buonarroti BG",
          altKeys: [
            "via_curiel_a_v_de_amicis",
            "via_curiel"
          ],
          hideable: true
        },
        {
          key: "via_busto_a_fr_civ_48",
          label: "Via Busto A.",
          altKeys: [],
          hideable: true
        },
        {
          key: "via_giacomo_rossini_civ_35",
          label: "Via Rossini 35",
          altKeys: [
            "via_matteotti_6",
            "via_parabiago_n_32"
          ]
        },
        {
          key: "autostazione_park_fs",
          label: "Parabiago FS",
          altKeys: [
            "viale_lombardia_fronte_eurospin",
            "via_spagliardi_plesso_maggiolini"
          ],
          shortRunValue: "Via Butti"
        },
        {
          key: "validity",
          label: "Val.",
          type: "validity"
        },
        {
          key: "note",
          label: "Note",
          alwaysVisible: true
        }
      ],
      "ritorno": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "autostazione_park_fs",
          label: "Parabiago FS",
          altKeys: [
            "viale_lombardia_lato_eurospin",
            "via_spagliardi_ist_maggiolini"
          ]
        },
        {
          key: "via_vincenzo_bellini_civ_44",
          label: "Via Rossini area",
          altKeys: [
            "v_montebianco_fr_civ_17",
            "via_parabiago_n_61"
          ]
        },
        {
          key: "v_busto_a_n_131_deposito",
          label: "Terminal BG",
          altKeys: [
            "via_per_busto_a_n_90_piscina"
          ],
          hideable: true
        },
        {
          key: "via_concordia_fr_civ_13",
          label: "Arconate",
          altKeys: [
            "via_legnano_n_11"
          ],
          hideable: true
        },
        {
          key: "via_verdi_n_13",
          label: "Dairago",
          altKeys: [
            "v_damiano_chiesa_civ_11"
          ],
          hideable: true
        },
        {
          key: "validity",
          label: "Val.",
          type: "validity"
        },
        {
          key: "note",
          label: "Note",
          alwaysVisible: true
        }
      ]
    },
    "visibleStops": {
      "andata": [
        "via_giacomo_rossini_civ_35",
        "autostazione_park_fs"
      ],
      "ritorno": [
        "autostazione_park_fs",
        "via_vincenzo_bellini_civ_44"
      ]
    },
    "liveStops": {
      "andata": {
        "departure": "via_giacomo_rossini_civ_35",
        "arrival": "autostazione_park_fs"
      },
      "ritorno": {
        "departure": "autostazione_park_fs",
        "arrival": "via_vincenzo_bellini_civ_44"
      }
    },
    "referenceStops": {
      "andata": [
        "via_giacomo_rossini_civ_35"
      ],
      "ritorno": [
        "autostazione_park_fs"
      ]
    },
    "connections": [
      {
        type: "S5_PARABI",
        "stop": "autostazione_park_fs",
        label: "S5",
        "slotKey": "S5_PARABI",
        "destination": "P.ta Garibaldi",
        "travelToDest": 25
      }
    ],
    "showInLive": true,
    "noService": [
      "sunday"
    ]
  },
  "z625": {
    label: "Z625",
    type: "stopCode",
    "directions": [
      "andata",
      "ritorno"
    ],
    "tabId": "z625",
    "departureLocation": "Via Curiel",
    "arrivalLocation": "Busto Arsizio FS",
    "shortRunLabel": "BA centro / tratta breve",
    "departureStop": "via_curiel",
    "arrivalStop": "piazza_volontari_della_liberta_fs",
    "shortRunCheck": "piazza_volontari_della_liberta_fs",
    "scheduleKeys": [
      "weekday_andata",
      "weekday_ritorno",
      "saturday_andata",
      "saturday_ritorno"
    ],
    "columns": {
      "andata": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "via_curiel",
          label: "Via Curiel BG",
          altKeys: [
            "via_buonarroti_civ_3",
            "via_buonarroti_a_v_carroccio"
          ]
        },
        {
          key: "via_per_busto_a_n_90_piscina",
          label: "BG Piscina",
          altKeys: [
            "via_per_busto_a_n_91_piscina"
          ],
          hideable: true
        },
        {
          key: "via_verdi_n_13",
          label: "Dairago",
          altKeys: [
            "v_damiano_chiesa_civ_11",
            "via_damiano_chiesa_municipio"
          ],
          hideable: true
        },
        {
          key: "piazza_volontari_della_liberta_fs",
          label: "Busto A. FS",
          altKeys: [
            "viale_boccaccio",
            "v_le_boccaccio_ang_v_ferrini"
          ]
        },
        {
          key: "validity",
          label: "Val.",
          type: "validity"
        },
        {
          key: "note",
          label: "Note",
          alwaysVisible: true
        }
      ],
      "ritorno": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "piazza_volontari_della_liberta_fs",
          label: "Busto A. FS",
          altKeys: [
            "v_le_cadorna_ang_v_piemonte",
            "v_le_boccaccio_ang_v_ferrini"
          ]
        },
        {
          key: "v_damiano_chiesa_civ_11",
          label: "Dairago",
          altKeys: [
            "via_verdi_n_24"
          ],
          hideable: true
        },
        {
          key: "via_curiel_a_v_de_amicis",
          label: "Arrivo BG",
          altKeys: [
            "via_buonarroti_ang_v_busto_a",
            "via_buonarroti_a_v_carroccio"
          ],
          shortRunValue: "No BG"
        },
        {
          key: "validity",
          label: "Val.",
          type: "validity"
        },
        {
          key: "note",
          label: "Note",
          alwaysVisible: true
        }
      ]
    },
    "visibleStops": {
      "andata": [
        "via_curiel",
        "piazza_volontari_della_liberta_fs"
      ],
      "ritorno": [
        "piazza_volontari_della_liberta_fs",
        "via_curiel_a_v_de_amicis"
      ]
    },
    "liveStops": {
      "andata": {
        "departure": "via_curiel",
        "arrival": "piazza_volontari_della_liberta_fs"
      },
      "ritorno": {
        "departure": "piazza_volontari_della_liberta_fs",
        "arrival": "via_curiel_a_v_de_amicis",
        "fallbackDeparture": "v_le_cadorna_ang_v_piemonte"
      }
    },
    "referenceStops": {
      "andata": [
        "via_curiel"
      ],
      "ritorno": [
        "piazza_volontari_della_liberta_fs",
        "v_le_cadorna_ang_v_piemonte"
      ]
    },
    "connections": [
      {
        type: "S5_BUSTO",
        "stop": "piazza_volontari_della_liberta_fs",
        label: "S5",
        "slotKey": "S5_BUSTO",
        "destination": "P.ta Garibaldi",
        "travelToDest": 40
      }
    ],
    "showInLive": true,
    "noService": [
      "sunday"
    ]
  },
  "z647": {
    label: "Z647",
    type: "stopCode",
    "directions": [
      "andata",
      "ritorno"
    ],
    "tabId": "z647",
    "departureLocation": "Via Buonarroti BG",
    "arrivalLocation": "Castano P.",
    "shortRunLabel": "tratta breve",
    "departureStop": "v_busto_a_n_131_deposito",
    "arrivalStop": "austostazione_bus_stazione_ferroviaria",
    "shortRunCheck": "austostazione_bus_stazione_ferroviaria",
    "scheduleKeys": [
      "saturday_andata",
      "saturday_ritorno"
    ],
    "columns": {
      "andata": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "v_busto_a_n_131_deposito",
          label: "BG Terminal",
          altKeys: [
            "via_per_busto_a_n_91_piscina"
          ]
        },
        {
          key: "v_montebianco_fr_civ_17",
          label: "BG Montebianco",
          altKeys: [],
          hideable: true
        },
        {
          key: "via_concordia_fr_civ_13",
          label: "Arconate",
          altKeys: [],
          hideable: true
        },
        {
          key: "austostazione_bus_stazione_ferroviaria",
          label: "Castano P.",
          altKeys: [
            "p_le_don_milani_omn_ist_torno"
          ]
        },
        {
          key: "flags",
          label: "Val.",
          type: "flags"
        }
      ],
      "ritorno": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "austostazione_bus_stazione_ferroviaria",
          label: "Castano P.",
          altKeys: [
            "p_le_don_milani_omn_ist_torno"
          ]
        },
        {
          key: "via_concordia_n_9",
          label: "Arconate",
          altKeys: [],
          hideable: true
        },
        {
          key: "via_giacomo_rossini_civ_35",
          label: "Via Rossini BG",
          altKeys: [
            "v_busto_a_n_131_deposito"
          ]
        },
        {
          key: "flags",
          label: "Val.",
          type: "flags"
        }
      ]
    },
    "visibleStops": {
      "andata": [
        "v_busto_a_n_131_deposito",
        "austostazione_bus_stazione_ferroviaria"
      ],
      "ritorno": [
        "austostazione_bus_stazione_ferroviaria",
        "via_giacomo_rossini_civ_35"
      ]
    },
    "liveStops": {
      "andata": {
        "departure": "v_busto_a_n_131_deposito",
        "arrival": "austostazione_bus_stazione_ferroviaria"
      },
      "ritorno": {
        "departure": "austostazione_bus_stazione_ferroviaria",
        "arrival": "via_giacomo_rossini_civ_35"
      }
    },
    "referenceStops": {
      "andata": [
        "v_busto_a_n_131_deposito"
      ],
      "ritorno": [
        "via_giacomo_rossini_civ_35"
      ]
    },
    "connections": [],
    "showInLive": false,
    "noService": [
      "sunday",
      "weekday"
    ]
  },
  "z642": {
    label: "Z642",
    type: "stopCode",
    "directions": [
      "andata",
      "ritorno"
    ],
    "tabId": "z642",
    "departureLocation": "Via Buonarroti BG",
    "arrivalLocation": "Legnano FS",
    "shortRunLabel": "tratta breve",
    "departureStop": "v_montebianco_fr_civ_17",
    "arrivalStop": "piazza_del_popolo_fs",
    "shortRunCheck": "piazza_del_popolo_fs",
    "scheduleKeys": [
      "weekday_andata",
      "weekday_ritorno"
    ],
    "columns": {
      "andata": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "via_buonarroti_a_v_carroccio",
          label: "Via Buonarroti BG",
          altKeys: [
            "via_curiel_a_v_de_amicis"
          ]
        },
        {
          key: "v_montebianco_fr_civ_17",
          label: "BG Montebianco",
          altKeys: []
        },
        {
          key: "via_xx_settembre_ang_s_bernardino",
          label: "Legnano S.Bernardino",
          altKeys: [
            "v_xx_settembre_a_v_s_bernardino"
          ],
          hideable: true
        },
        {
          key: "piazza_del_popolo_fs",
          label: "Legnano FS",
          altKeys: [
            "austostazione_bus_stazione_ferroviaria"
          ],
          shortRunValue: "tratta breve"
        },
        {
          key: "flags",
          label: "Val.",
          type: "flags"
        }
      ],
      "ritorno": [
        {
          key: "tripId",
          label: "Corsa",
          type: "tripId"
        },
        {
          key: "piazza_del_popolo_fs_ang_via_c_colombo",
          label: "Legnano FS",
          altKeys: [
            "piazza_del_popolo_fs",
            "austostazione_bus_stazione_ferroviaria"
          ]
        },
        {
          key: "v_xx_settembre_san_giorgio_s_l",
          label: "S.Giorgio",
          altKeys: [
            "localita_la_pergola_v_xx_settembre"
          ],
          hideable: true
        },
        {
          key: "via_giacomo_rossini_civ_35",
          label: "Via Rossini BG",
          altKeys: [
            "via_buonarroti_civ_3",
            "via_curiel"
          ]
        },
        {
          key: "v_montebianco_fr_civ_17",
          label: "BG Montebianco",
          altKeys: []
        },
        {
          key: "flags",
          label: "Val.",
          type: "flags"
        }
      ]
    },
    "visibleStops": {
      "andata": [
        "v_montebianco_fr_civ_17",
        "piazza_del_popolo_fs"
      ],
      "ritorno": [
        "piazza_del_popolo_fs_ang_via_c_colombo",
        "via_giacomo_rossini_civ_35"
      ]
    },
    "liveStops": {
      "andata": {
        "departure": "v_montebianco_fr_civ_17",
        "arrival": "piazza_del_popolo_fs"
      },
      "ritorno": {
        "departure": "piazza_del_popolo_fs_ang_via_c_colombo",
        "arrival": "via_giacomo_rossini_civ_35"
      }
    },
    "referenceStops": {
      "andata": [
        "v_montebianco_fr_civ_17"
      ],
      "ritorno": [
        "piazza_del_popolo_fs_ang_via_c_colombo"
      ]
    },
    "connections": [],
    "showInLive": false,
    "noService": [
      "sunday"
    ]
  }
};

export function getDirection(scheduleKey) {
  if (scheduleKey.endsWith('_outbound')) return 'outbound';
  if (scheduleKey.endsWith('_return')) return 'return';
  if (scheduleKey.endsWith('_andata')) return 'andata';
  if (scheduleKey.endsWith('_ritorno')) return 'ritorno';
  return 'all';
}

export function getColumns(lineId, scheduleKey) {
  const config = LINE_CONFIG[lineId];
  if (!config) return [];
  return config.columns[getDirection(scheduleKey)] || config.columns.all || config.columns.outbound || [];
}

export function getReferenceStop(config, scheduleKey) {
  const direction = getDirection(scheduleKey);
  const candidates = config.referenceStops?.[direction] || config.referenceStops?.all || config.referenceStops?.outbound || [config.departureStop];
  return candidates[0];
}

export function getLiveStops(config, scheduleKey) {
  const direction = getDirection(scheduleKey);
  const stops = config.liveStops?.[direction] || config.liveStops?.all || {};
  return {
    departure: stops.departure || config.departureStop,
    fallbackDeparture: stops.fallbackDeparture,
    arrival: stops.arrival || config.arrivalStop
  };
}

export function isHideableStopColumn(col) {
  if (!col || col.alwaysVisible || ALWAYS_VISIBLE_TYPES.has(col.type)) return false;
  if (col.key === 'note' || col.key?.startsWith('_connection_')) return false;
  return true;
}

export function getScheduleLabel(scheduleKey) {
  const labels = {
    weekday: 'Feriale',
    saturday: 'Sabato',
    sunday: 'Domenica/Festivo',
    weekday_outbound: 'Feriale andata',
    weekday_return: 'Feriale ritorno',
    saturday_outbound: 'Sabato andata',
    saturday_return: 'Sabato ritorno',
    weekday_andata: 'Feriale andata',
    weekday_ritorno: 'Feriale ritorno',
    saturday_andata: 'Sabato andata',
    saturday_ritorno: 'Sabato ritorno'
  };
  return labels[scheduleKey] || scheduleKey;
}

/**
 * Restituisce la scheduleKey di default per la linea dato il dayType.
 * - Se il dayType è in noService, ritorna null (nessun servizio).
 * - Per dayType 'sunday' cerca prima una chiave esatta 'sunday', poi fallback al primo key.
 * - Altrimenti cerca la prima chiave che inizia con dayType_ o uguale a dayType.
 */
export function getDefaultScheduleKey(config, dayType) {
  if (!config?.scheduleKeys?.length) return null;
  // Nessun servizio: ritorna null invece di una scheduleKey errata
  if (config.noService?.includes(dayType)) return null;
  if (dayType === 'sunday') return config.scheduleKeys.find(k => k === 'sunday') || config.scheduleKeys[0];
  const match = config.scheduleKeys.find(k => k === dayType || k.startsWith(`${dayType}_`));
  return match || config.scheduleKeys[0];
}
