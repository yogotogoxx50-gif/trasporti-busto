const ALWAYS_VISIBLE_TYPES = new Set(['tripId', 'validity', 'flags']);

export const LINE_CONFIG = {
  z649: {
    label: 'Z649',
    type: 'stopCode',
    directions: ['andata', 'ritorno'],
    tabId: 'orari',
    departureStop: 'bt775_busto_g',
    arrivalStop: 'md111_milano',
    shortRunCheck: 'md111_milano',
    departureLocation: 'Via Rossini',
    arrivalLocation: 'Molino Dorino M1',
    shortRunLabel: 'Arluno',
    scheduleKeys: [
      'weekday_andata', 'weekday_ritorno',
      'saturday_andata', 'saturday_ritorno',
      'sunday_andata', 'sunday_ritorno'
    ],
    columns: {
      andata: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'bt775_busto_g', label: 'Via Rossini 35', altKeys: ['bt775'] },
        { key: 'pg102_pregnana', label: 'Pregnana FS', altKeys: ['pg102', 'pg111_pregnana', 'pg111'] },
        { key: 'md111_milano', label: 'Molino Dorino M1', altKeys: ['md111'], shortRunValue: 'Arluno' },
        { key: 'flags', label: 'Tipo', type: 'flags' }
      ],
      ritorno: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'md001_milano', label: 'Molino Dorino M1', altKeys: ['md001'] },
        { key: 'pg101_pregnana', label: 'Pregnana FS', altKeys: ['pg101'] },
        { key: 'bt776_busto_g', label: 'Via Rossini 35', altKeys: ['bt776'] },
        { key: 'bt999_busto_g', label: 'Terminal BG', altKeys: ['bt999'] },
        { key: 'flags', label: 'Tipo', type: 'flags' }
      ]
    },
    visibleStops: {
      andata: ['bt775_busto_g', 'pg102_pregnana', 'md111_milano'],
      ritorno: ['md001_milano', 'pg101_pregnana', 'bt776_busto_g']
    },
    liveStops: {
      andata: { departure: 'bt775_busto_g', arrival: 'md111_milano' },
      ritorno: { departure: 'md001_milano', arrival: 'bt776_busto_g' }
    },
    referenceStops: {
      andata: ['bt775_busto_g'],
      ritorno: ['md001_milano']
    },
    connections: [
      { type: 'M1', stop: 'md111_milano', label: 'M1', travelTime: 3 },
      { type: 'S5_PREGNANA', stop: 'pg102_pregnana', label: 'S5/S6', slotKey: 'S5S6', travelTime: 1 }
    ],
    showInLive: true,
    noService: []
  },

  z627: {
    label: 'Z627',
    type: 'stopCode',
    directions: ['andata', 'ritorno'],
    tabId: 'z627',
    departureStop: 'bt301_busto_g',
    arrivalStop: 'lg090_legnano',
    shortRunCheck: 'lg090_legnano',
    departureLocation: 'Via Buonarroti',
    arrivalLocation: 'Legnano FS',
    shortRunLabel: 'Liceo / tratta breve',
    scheduleKeys: ['weekday_andata', 'weekday_ritorno', 'saturday_andata', 'saturday_ritorno'],
    columns: {
      andata: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'bt999_busto_g', label: 'BG Terminal', sublabel: 'bt999', hideable: true },
        { key: 'bt949_busto_g', label: 'BG Deposito 131', sublabel: 'bt949', hideable: true },
        { key: 'bt301_busto_g', label: 'Via Buonarroti', sublabel: 'bt301' },
        { key: 'bt703_busto_g', label: 'Via Buonarroti/Carroccio', sublabel: 'bt703', hideable: true },
        { key: 'bt704_busto_g', label: 'Via Curiel/De Amicis', sublabel: 'bt704', hideable: true },
        { key: 'vc801_villa_c', label: 'Villa C. P.Micca 17', sublabel: 'vc801', hideable: true },
        { key: 'vc050_villa_c', label: 'Villa C. Da Giussano 32', sublabel: 'vc050', hideable: true },
        { key: 'vc051_villa_c', label: 'Villa C. Da Giussano 50', sublabel: 'vc051', hideable: true },
        { key: 'sg801_s_giorgio', label: 'S.Giorgio Boccaccio/Magenta', sublabel: 'sg801', hideable: true },
        { key: 'sg050_s_giorgio', label: 'S.Giorgio Via Restelli 5', sublabel: 'sg050', hideable: true },
        { key: 'lg112_legnano', label: 'Legnano Liceo', sublabel: 'lg112', hideable: true },
        { key: 'lg611_legnano', label: 'Legnano XX Sett./S.Bernardino', sublabel: 'lg611', hideable: true },
        { key: 'lg508_legnano', label: 'Legnano Via Milano/S.Caterina', sublabel: 'lg508', hideable: true },
        { key: 'lg805_legnano', label: 'Legnano XX Sett. 7 (Poste)', sublabel: 'lg805', hideable: true },
        { key: 'lg090_legnano', label: 'Legnano FS', sublabel: 'lg090' },
        { key: 'lg003_legnano', label: 'Legnano Largo Tosi', sublabel: 'lg003', hideable: true },
        { key: 'lg002_legnano', label: 'Legnano C.so Sempione Madonnina', sublabel: 'lg002', hideable: true },
        { key: 'lg001_legnano', label: 'Legnano C.so Sempione Osp.Vecchio', sublabel: 'lg001', hideable: true },
        { key: 'cg999_cuggiono', label: 'Cuggiono V.IV Nov./XI Sett.', sublabel: 'cg999', hideable: true },
        { key: 'cg149_cuggiono', label: 'Cuggiono Via San Rocco 89', sublabel: 'cg149', hideable: true },
        { key: 'cg143_cuggiono', label: 'Cuggiono P.za Vittoria', sublabel: 'cg143', hideable: true },
        { key: 'cg190_cuggiono', label: 'Cuggiono Via Fermo Ospedale', sublabel: 'cg190', hideable: true },
        { key: 'in285_inveruno', label: 'Inveruno Via Marconi 57', sublabel: 'in285', hideable: true },
        { key: 'in802_inveruno', label: 'Inveruno Via Einaudi 6', sublabel: 'in802', hideable: true },
        { key: 'in275_inveruno', label: 'Inveruno V.le Lombardia/Liguria', sublabel: 'in275', hideable: true },
        { key: 'in350_inveruno', label: 'Inveruno Via Lombardia IPSIA', sublabel: 'in350', hideable: true },
        { key: 'in127_inveruno', label: 'Inveruno V.Varese/Don Paganini', sublabel: 'in127', hideable: true },
        { key: 'ac127_arconate', label: 'Arconate B.Vergine/Pioppi', sublabel: 'ac127', hideable: true },
        { key: 'ac625_arconate', label: 'Arconate Via Concordia 9', sublabel: 'ac625', hideable: true },
        { key: 'ac802_arconate', label: 'Arconate Via Varese 44', sublabel: 'ac802', hideable: true },
        { key: 'oc113_olcella', label: 'Olcella Via Montebello 16', sublabel: 'oc113', hideable: true },
        { key: 'dg801_dairago', label: 'Dairago Circonvallazione/Zara', sublabel: 'dg801', hideable: true },
        { key: 'dg142_dairago', label: 'Dairago D.Chiesa 11', sublabel: 'dg142', hideable: true },
        { key: 'dg097_dairago', label: 'Dairago Via Verdi 24', sublabel: 'dg097', hideable: true },
        { key: 'ct100_castano_p', label: 'Castano P. Autostazione', sublabel: 'ct100', hideable: true },
        { key: 'ct050_castano_p', label: 'Castano P. Via Tadini 16', sublabel: 'ct050', hideable: true },
        { key: 'ct027_castano_p', label: 'Castano P. Per Buscate S.Nitti', sublabel: 'ct027', hideable: true },
        { key: 'ct001_castano_p', label: 'Castano P. P.le Don Milani', sublabel: 'ct001', hideable: true },
        { key: 'bc802_buscate', label: 'Buscate S.P.34 Fr.Civ.28', sublabel: 'bc802', hideable: true },
        { key: 'bc211_buscate', label: 'Buscate Via Milano 26', sublabel: 'bc211', hideable: true },
        { key: '_connection_S5_LEGNANO', label: 'Coincidenza', sublabel: 'S5 -> Milano' },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ],
      ritorno: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'lg171_legnano', label: 'Legnano C.so Sempione Osp.', sublabel: 'lg171', hideable: true },
        { key: 'lg172_legnano', label: 'Legnano C.so Sempione Madonnina', sublabel: 'lg172', hideable: true },
        { key: 'lg173_legnano', label: 'Legnano Largo Tosi (portici)', sublabel: 'lg173', hideable: true },
        { key: 'lg990_legnano', label: 'Legnano P.za Monumento FS', sublabel: 'lg990', hideable: true },
        { key: 'lg091_legnano', label: 'Legnano FS / C.Colombo', sublabel: 'lg091' },
        { key: 'lg807_legnano', label: 'Legnano XX Sett. P.V.Veneto', sublabel: 'lg807', hideable: true },
        { key: 'lg061_legnano', label: 'Legnano XX Sett./S.Bernardino', sublabel: 'lg061', hideable: true },
        { key: 'lg025_legnano', label: 'Legnano XX Sett. (S.Giorgio SL)', sublabel: 'lg025', hideable: true },
        { key: 'sg001_s_giorgio', label: 'S.Giorgio La Pergola', sublabel: 'sg001', hideable: true },
        { key: 'sg807_s_giorgio', label: 'S.Giorgio Via Roma/Da Vinci', sublabel: 'sg807', hideable: true },
        { key: 'sg182_s_giorgio', label: 'S.Giorgio Via Roma/Acquedotto', sublabel: 'sg182', hideable: true },
        { key: 'vc005_villa_c', label: 'Villa C. Via Canova/Buonarroti', sublabel: 'vc005', hideable: true },
        { key: 'vc006_villa_c', label: 'Villa C. Via Canova/Perugino', sublabel: 'vc006', hideable: true },
        { key: 'vc807_villa_c', label: 'Villa C. P.Micca 38', sublabel: 'vc807', hideable: true },
        { key: 'bt701_busto_g', label: 'Via Curiel', sublabel: 'bt701', hideable: true },
        { key: 'bt702_busto_g', label: 'Via Don Longoni/Cellini', sublabel: 'bt702', hideable: true },
        { key: 'bt947_busto_g', label: 'Via Buonarroti 3', sublabel: 'bt947', hideable: true },
        { key: 'bt951_busto_g', label: 'BG Piscina 90', sublabel: 'bt951', hideable: true },
        { key: 'bt999_busto_g', label: 'BG Terminal', sublabel: 'bt999' },
        { key: 'dg099_dairago', label: 'Dairago Via Verdi 13', sublabel: 'dg099', hideable: true },
        { key: 'dg141_dairago', label: 'Dairago D.Chiesa Municipio', sublabel: 'dg141', hideable: true },
        { key: 'dg807_dairago', label: 'Dairago Circonvallazione 48', sublabel: 'dg807', hideable: true },
        { key: 'oc114_olcella', label: 'Olcella Via Montebello 11', sublabel: 'oc114', hideable: true },
        { key: 'ac809_arconate', label: 'Arconate Via Varese/Moina', sublabel: 'ac809', hideable: true },
        { key: 'ac035_arconate', label: 'Arconate Via Concordia Fr.13', sublabel: 'ac035', hideable: true },
        { key: 'ac811_arconate', label: 'Arconate Via Volta/XXIV Maggio', sublabel: 'ac811', hideable: true },
        { key: 'ac128_arconate', label: 'Arconate B.Vergine/Tigli', sublabel: 'ac128', hideable: true },
        { key: 'in128_inveruno', label: 'Inveruno V.Varese/Don Paganini', sublabel: 'in128', hideable: true },
        { key: 'in351_inveruno', label: 'Inveruno Via Lombardia IPSIA', sublabel: 'in351', hideable: true },
        { key: 'in235_inveruno', label: 'Inveruno V.le Lombardia/Magenta', sublabel: 'in235', hideable: true },
        { key: 'in801_inveruno', label: 'Inveruno Via Einaudi Fr.2', sublabel: 'in801', hideable: true },
        { key: 'in403_inveruno', label: 'Inveruno Via Marconi Fr.65', sublabel: 'in403', hideable: true },
        { key: 'cg250_cuggiono', label: 'Cuggiono Via Garibaldi 32', sublabel: 'cg250', hideable: true },
        { key: 'cg143_cuggiono', label: 'Cuggiono P.za Vittoria', sublabel: 'cg143', hideable: true },
        { key: 'cg178_cuggiono', label: 'Cuggiono Via Manzoni 1', sublabel: 'cg178', hideable: true },
        { key: 'cg998_cuggiono', label: 'Cuggiono V.IV Nov. dopo XI Sett.', sublabel: 'cg998', hideable: true },
        { key: 'bc250_buscate', label: 'Buscate Via Milano/P.Micca', sublabel: 'bc250', hideable: true },
        { key: 'bc801_buscate', label: 'Buscate S.P.34 Civ.28', sublabel: 'bc801', hideable: true },
        { key: 'ct021_castano_p', label: 'Castano P. Per Buscate/Nitti', sublabel: 'ct021', hideable: true },
        { key: 'ct110_castano_p', label: 'Castano P. P.za Garibaldi', sublabel: 'ct110', hideable: true },
        { key: 'ct100_castano_p', label: 'Castano P. Autostazione', sublabel: 'ct100', hideable: true },
        { key: 'ct011_castano_p', label: 'Castano P. P.le Don Milani', sublabel: 'ct011', hideable: true },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ]
    },
    visibleStops: {
      andata: ['bt301_busto_g', 'lg090_legnano'],
      ritorno: ['lg091_legnano', 'bt999_busto_g']
    },
    liveStops: {
      andata: { departure: 'bt301_busto_g', arrival: 'lg090_legnano' },
      ritorno: { departure: 'lg091_legnano', arrival: 'bt999_busto_g' }
    },
    referenceStops: {
      andata: ['bt301_busto_g'],
      ritorno: ['lg091_legnano']
    },
    connections: [
      { type: 'S5_LEGNANO', stop: 'lg090_legnano', label: 'S5', slotKey: 'S5_LEGNANO', destination: 'Cadorna', travelToDest: 30 }
    ],
    showInLive: true,
    noService: ['sunday']
  },

  z644: {
    label: 'Z644',
    type: 'stopCode',
    directions: ['andata', 'ritorno'],
    tabId: 'z644',
    departureStop: 'bt775_busto_g',
    arrivalStop: 'pb101_parabiago',
    shortRunCheck: 'pb101_parabiago',
    departureLocation: 'Via Rossini 35',
    arrivalLocation: 'Parabiago FS',
    shortRunLabel: 'Via Butti',
    scheduleKeys: ['weekday_andata', 'weekday_ritorno', 'saturday_andata', 'saturday_ritorno'],
    columns: {
      andata: [
        { key: 'bt775_busto_g', label: 'Via Rossini 35', altKeys: ['bt775', 'rossini'] },
        { key: 'pb101_parabiago', label: 'Parabiago FS', altKeys: ['pb101', 'parabiago_fs'], shortRunValue: 'Via Butti' },
        { key: '_connection_S5_PARABI', label: 'Coincidenza', sublabel: 'S5 -> Milano' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ],
      ritorno: [
        { key: 'pb990_parabiago', label: 'Parabiago FS', altKeys: ['pb990', 'parabiago_prt'] },
        { key: 'bt776_busto_g', label: 'Via Rossini 35', altKeys: ['bt776', 'rossini'] },
        { key: 'ac035_arconate', label: 'Arconate', altKeys: ['ac035', 'arconate'], shortRunValue: 'Dairago' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ]
    },
    visibleStops: {
      andata: ['bt775_busto_g', 'pb101_parabiago'],
      ritorno: ['pb990_parabiago', 'bt776_busto_g', 'ac035_arconate']
    },
    liveStops: {
      andata: { departure: 'bt775_busto_g', arrival: 'pb101_parabiago' },
      ritorno: { departure: 'pb990_parabiago', arrival: 'bt776_busto_g' }
    },
    referenceStops: { andata: ['bt775_busto_g'], ritorno: ['pb990_parabiago'] },
    connections: [
      { type: 'S5_PARABI', stop: 'pb101_parabiago', label: 'S5', slotKey: 'S5_PARABI', destination: 'P.ta Garibaldi', travelToDest: 25 }
    ],
    showInLive: true,
    noService: ['sunday']
  },

  z625: {
    label: 'Z625',
    type: 'stopCode',
    directions: ['andata', 'ritorno'],
    tabId: 'z625',
    departureStop: 'bt701_busto_g',
    arrivalStop: 'ba011_busto_a',
    shortRunCheck: 'ba011_busto_a',
    departureLocation: 'Via Curiel',
    arrivalLocation: 'Busto Arsizio FS',
    shortRunLabel: 'BA centro / tratta breve',
    scheduleKeys: ['weekday_andata', 'weekday_ritorno', 'saturday_andata', 'saturday_ritorno'],
    columns: {
      andata: [
        { key: 'bt701_busto_g', label: 'Partenza BT701', altKeys: ['bt701', 'curiel'], sublabel: 'Via Curiel' },
        { key: 'ba300_busto_a', label: 'BA Centro', altKeys: ['ba300', 'busto_arsizio'] },
        { key: 'ba011_busto_a', label: 'BA FS', altKeys: ['ba011', 'busto_arsizio_fs'] },
        { key: '_connection_S5_BUSTO', label: 'S5/RE', sublabel: '-> Milano' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ],
      ritorno: [
        { key: 'ba310_busto_a', label: 'Partenza BA', altKeys: ['ba310', 'dep_ba'] },
        { key: 'ba012_busto_a', label: 'Partenza BA FS', altKeys: ['ba012', 'dep_ba_fs'] },
        { key: 'bt704_busto_g', label: 'Arrivo Busto G.', altKeys: ['bt704', 'arr_bg'], shortRunValue: 'No BG' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ]
    },
    visibleStops: {
      andata: ['bt701_busto_g', 'ba300_busto_a', 'ba011_busto_a'],
      ritorno: ['ba310_busto_a', 'ba012_busto_a', 'bt704_busto_g']
    },
    liveStops: {
      andata: { departure: 'bt701_busto_g', arrival: 'ba011_busto_a' },
      ritorno: { departure: 'ba012_busto_a', arrival: 'bt704_busto_g', fallbackDeparture: 'ba310_busto_a' }
    },
    referenceStops: { andata: ['bt701_busto_g'], ritorno: ['ba012_busto_a', 'ba310_busto_a'] },
    connections: [
      { type: 'S5_BUSTO', stop: 'ba011_busto_a', label: 'S5', slotKey: 'S5_BUSTO', destination: 'P.ta Garibaldi', travelToDest: 40 },
      { type: 'RE_BUSTO', stop: 'ba011_busto_a', label: 'RE', slotKey: 'RE_BUSTO', destination: 'P.ta Garibaldi', travelToDest: 30 }
    ],
    showInLive: true,
    noService: ['sunday']
  },

  z647: {
    label: 'Z647',
    type: 'stopCode',
    directions: ['andata', 'ritorno'],
    tabId: 'z647',
    scheduleKeys: ['weekday_andata', 'weekday_ritorno'],
    columns: {
      andata: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'bt999_busto_g', label: 'BG Terminal', sublabel: 'bt999' },
        { key: 'bt949_busto_g', label: 'BG Deposito 131', sublabel: 'bt949' },
        { key: 'bt956_busto_g', label: 'BG Piscina/Montebianco', sublabel: 'bt956' },
        { key: 'ac035_arconate', label: 'Arconate', sublabel: 'ac035' },
        { key: 'ct011_castano_p', label: 'Castano P.', sublabel: 'ct011' },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ],
      ritorno: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'ac627_arconate', label: 'Arconate', sublabel: 'ac627', altKeys: ['ac625_arconate'] },
        { key: 'bt951_busto_g', label: 'BG Piscina 90', sublabel: 'bt951' },
        { key: 'bt999_busto_g', label: 'BG Terminal', sublabel: 'bt999', altKeys: ['bt205_busto_g', 'bt775_busto_g'] },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ]
    },
    visibleStops: {
      andata: ['bt999_busto_g', 'bt949_busto_g', 'bt956_busto_g', 'ac035_arconate', 'ct011_castano_p'],
      ritorno: ['ac627_arconate', 'bt951_busto_g', 'bt999_busto_g']
    },
    liveStops: {
      andata: { departure: 'bt956_busto_g', arrival: 'ct011_castano_p' },
      ritorno: { departure: 'bt951_busto_g', arrival: 'bt999_busto_g' }
    },
    referenceStops: {
      andata: ['bt999_busto_g', 'bt956_busto_g'],
      ritorno: ['bt951_busto_g', 'bt999_busto_g', 'bt205_busto_g']
    },
    connections: [],
    showInLive: false,
    noService: ['sunday', 'saturday']
  },

  z642: {
    label: 'Z642',
    type: 'stopCode',
    directions: ['andata', 'ritorno'],
    tabId: 'z642',
    scheduleKeys: ['weekday_andata', 'weekday_ritorno', 'saturday_andata', 'saturday_ritorno'],
    columns: {
      andata: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'bt776_busto_g', label: 'Via Buonarroti', sublabel: 'bt776' },
        { key: 'bt956_busto_g', label: 'Montebianco Fr.17', sublabel: 'bt956' },
        { key: 'lg090_legnano', label: 'Legnano FS', sublabel: 'lg090/lg112', altKeys: ['lg112_legnano'], trainBadge: 'S5' },
        { key: 'lg003_legnano', label: 'Legnano Centro', sublabel: 'lg003', altKeys: ['lg001_legnano'] },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ],
      ritorno: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'lg112_legnano', label: 'Legnano FS', sublabel: 'lg090/lg112', altKeys: ['lg090_legnano'], trainBadge: 'S5' },
        { key: 'bt701_busto_g', label: 'Via Buonarroti', sublabel: 'bt701' },
        { key: 'bt775_busto_g', label: 'Area Via Rossini', sublabel: 'bt775' },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ]
    },
    visibleStops: {
      andata: ['bt776_busto_g', 'bt956_busto_g', 'lg090_legnano', 'lg003_legnano'],
      ritorno: ['lg112_legnano', 'bt701_busto_g', 'bt775_busto_g']
    },
    liveStops: {
      andata: { departure: 'bt956_busto_g', arrival: 'lg090_legnano' },
      ritorno: { departure: 'lg112_legnano', arrival: 'bt701_busto_g' }
    },
    referenceStops: {
      andata: ['bt776_busto_g', 'bt956_busto_g'],
      ritorno: ['bt701_busto_g', 'bt775_busto_g']
    },
    connections: [],
    showInLive: false,
    noService: ['sunday']
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
