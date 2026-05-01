const ALWAYS_VISIBLE_TYPES = new Set(['tripId', 'validity', 'flags']);

export const LINE_CONFIG = {
  z649: {
    label: 'Z649',
    type: 'simple',
    directions: ['all'],
    tabId: 'orari',
    departureStop: 'rossini',
    arrivalStop: 'molino_dorino',
    shortRunCheck: 'molino_dorino',
    departureLocation: 'Via Rossini',
    arrivalLocation: 'Molino Dorino M1',
    shortRunLabel: 'Arluno',
    scheduleKeys: ['weekday', 'saturday', 'sunday'],
    columns: {
      all: [
        { key: 'rossini', label: 'Via Rossini' },
        { key: 'pregnana_fs', label: 'Pregnana FS' },
        { key: 'molino_dorino', label: 'Molino Dorino', shortRunValue: 'Arluno' },
        { key: 'flags', label: 'Tipo', type: 'flags' }
      ]
    },
    visibleStops: { all: ['rossini', 'pregnana_fs', 'molino_dorino'] },
    liveStops: { all: { departure: 'rossini', arrival: 'molino_dorino' } },
    referenceStops: { all: ['rossini'] },
    connections: [
      { type: 'M1', stop: 'molino_dorino', label: 'M1', travelTime: 3 },
      { type: 'S5_PREGNANA', stop: 'pregnana_fs', label: 'S5/S6', slotKey: 'S5S6', travelTime: 1 }
    ],
    showInLive: true,
    noService: []
  },

  z627: {
    label: 'Z627',
    type: 'simple',
    directions: ['all'],
    tabId: 'z627',
    departureStop: 'buonarroti',
    arrivalStop: 'legnano_fs',
    shortRunCheck: 'legnano_fs',
    departureLocation: 'Via Buonarroti',
    arrivalLocation: 'Legnano FS',
    shortRunLabel: 'Liceo / tratta breve',
    scheduleKeys: ['weekday', 'saturday'],
    columns: {
      all: [
        { key: 'buonarroti', label: 'Partenza BT301', sublabel: 'Via Buonarroti' },
        { key: 'legnano_fs', label: 'Arrivo LG090', sublabel: 'Legnano FS' },
        { key: '_connection_S5_LEGNANO', label: 'Coincidenza', sublabel: 'S5 -> Milano' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ]
    },
    visibleStops: { all: ['buonarroti', 'legnano_fs'] },
    liveStops: { all: { departure: 'buonarroti', arrival: 'legnano_fs' } },
    referenceStops: { all: ['buonarroti'] },
    connections: [
      { type: 'S5_LEGNANO', stop: 'legnano_fs', label: 'S5', slotKey: 'S5_LEGNANO', destination: 'Cadorna', travelToDest: 30 }
    ],
    showInLive: true,
    noService: ['sunday']
  },

  z644: {
    label: 'Z644',
    type: 'directional',
    directions: ['outbound', 'return'],
    tabId: 'z644',
    departureStop: 'rossini',
    arrivalStop: 'parabiago_fs',
    shortRunCheck: 'parabiago_fs',
    departureLocation: 'Via Rossini 35',
    arrivalLocation: 'Parabiago FS',
    shortRunLabel: 'Via Butti',
    scheduleKeys: ['weekday_outbound', 'weekday_return', 'saturday_outbound', 'saturday_return'],
    columns: {
      outbound: [
        { key: 'rossini', label: 'Via Rossini 35' },
        { key: 'parabiago_fs', label: 'Parabiago FS', shortRunValue: 'Via Butti' },
        { key: '_connection_S5_PARABI', label: 'Coincidenza', sublabel: 'S5 -> Milano' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ],
      return: [
        { key: 'parabiago_prt', label: 'Parabiago FS' },
        { key: 'rossini', label: 'Via Rossini 35' },
        { key: 'arconate', label: 'Arconate', shortRunValue: 'Dairago' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ]
    },
    visibleStops: {
      outbound: ['rossini', 'parabiago_fs'],
      return: ['parabiago_prt', 'rossini', 'arconate']
    },
    liveStops: {
      outbound: { departure: 'rossini', arrival: 'parabiago_fs' },
      return: { departure: 'parabiago_prt', arrival: 'rossini' }
    },
    referenceStops: { outbound: ['rossini'], return: ['parabiago_prt'] },
    connections: [
      { type: 'S5_PARABI', stop: 'parabiago_fs', label: 'S5', slotKey: 'S5_PARABI', destination: 'P.ta Garibaldi', travelToDest: 25 }
    ],
    showInLive: true,
    noService: ['sunday']
  },

  z625: {
    label: 'Z625',
    type: 'directional',
    directions: ['outbound', 'return'],
    tabId: 'z625',
    departureStop: 'curiel',
    arrivalStop: 'busto_arsizio_fs',
    shortRunCheck: 'busto_arsizio_fs',
    departureLocation: 'Via Curiel',
    arrivalLocation: 'Busto Arsizio FS',
    shortRunLabel: 'BA centro / tratta breve',
    scheduleKeys: ['weekday_outbound', 'weekday_return', 'saturday_outbound', 'saturday_return'],
    columns: {
      outbound: [
        { key: 'curiel', label: 'Partenza BT701', sublabel: 'Via Curiel' },
        { key: 'busto_arsizio', label: 'BA Centro' },
        { key: 'busto_arsizio_fs', label: 'BA FS' },
        { key: '_connection_S5_BUSTO', label: 'S5/RE', sublabel: '-> Milano' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ],
      return: [
        { key: 'dep_ba', label: 'Partenza BA' },
        { key: 'dep_ba_fs', label: 'Partenza BA FS' },
        { key: 'arr_bg', label: 'Arrivo Busto G.', shortRunValue: 'No BG' },
        { key: 'validity', label: 'Val.', type: 'validity' },
        { key: 'note', label: 'Note', alwaysVisible: true }
      ]
    },
    visibleStops: {
      outbound: ['curiel', 'busto_arsizio', 'busto_arsizio_fs'],
      return: ['dep_ba', 'dep_ba_fs', 'arr_bg']
    },
    liveStops: {
      outbound: { departure: 'curiel', arrival: 'busto_arsizio_fs' },
      return: { departure: 'dep_ba_fs', arrival: 'arr_bg', fallbackDeparture: 'dep_ba' }
    },
    referenceStops: { outbound: ['curiel'], return: ['dep_ba_fs', 'dep_ba'] },
    connections: [
      { type: 'S5_BUSTO', stop: 'busto_arsizio_fs', label: 'S5', slotKey: 'S5_BUSTO', destination: 'P.ta Garibaldi', travelToDest: 40 },
      { type: 'RE_BUSTO', stop: 'busto_arsizio_fs', label: 'RE', slotKey: 'RE_BUSTO', destination: 'P.ta Garibaldi', travelToDest: 30 }
    ],
    showInLive: true,
    noService: ['sunday']
  },

  z647: {
    label: 'Z647',
    type: 'stopCode',
    directions: ['outbound', 'return'],
    tabId: 'z647',
    scheduleKeys: ['weekday_outbound', 'weekday_return'],
    columns: {
      outbound: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'BT999_dep', label: 'BG partenza', sublabel: 'Terminal' },
        { key: 'BT949', label: 'Deposito 131' },
        { key: 'BT956', label: 'Piscina 91' },
        { key: 'AC035', label: 'Arconate' },
        { key: 'CT011', label: 'Castano P.' },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ],
      return: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'AC627', label: 'Arconate', altKeys: ['AC625'] },
        { key: 'BT951', label: 'Piscina 90' },
        { key: 'BT999_arr', label: 'BG arrivo', altKeys: ['BT205', 'BT775'] },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ]
    },
    visibleStops: {
      outbound: ['BT999_dep', 'BT949', 'BT956', 'AC035', 'CT011'],
      return: ['AC627', 'BT951', 'BT999_arr']
    },
    liveStops: {
      outbound: { departure: 'BT956', arrival: 'CT011' },
      return: { departure: 'BT951', arrival: 'BT999_arr' }
    },
    referenceStops: { outbound: ['BT999_dep', 'BT956'], return: ['BT951', 'BT999_arr', 'BT205'] },
    connections: [],
    showInLive: false,
    noService: ['sunday', 'saturday']
  },

  z642: {
    label: 'Z642',
    type: 'stopCode',
    directions: ['outbound', 'return'],
    tabId: 'z642',
    scheduleKeys: ['weekday_outbound', 'weekday_return', 'saturday_outbound', 'saturday_return'],
    columns: {
      outbound: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'BT776', label: 'Via Buonarroti', sublabel: 'BT776' },
        { key: 'BT956', label: 'Montebianco Fr.17', sublabel: 'BT956' },
        { key: 'LG090', label: 'Legnano FS', sublabel: 'LG090/LG112', altKeys: ['LG112'], trainBadge: 'S5' },
        { key: 'LG003', label: 'Legnano Centro', altKeys: ['LG001'] },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ],
      return: [
        { key: 'tripId', label: 'Corsa', type: 'tripId' },
        { key: 'LG112', label: 'Legnano FS', sublabel: 'LG090/LG112', altKeys: ['LG090'], trainBadge: 'S5' },
        { key: 'BT701', label: 'Via Buonarroti', sublabel: 'BT701' },
        { key: 'BT775', label: 'Area Via Rossini', sublabel: 'BT775' },
        { key: 'flags', label: 'Val.', type: 'flags' }
      ]
    },
    visibleStops: {
      outbound: ['BT776', 'BT956', 'LG090', 'LG003'],
      return: ['LG112', 'BT701', 'BT775']
    },
    liveStops: {
      outbound: { departure: 'BT956', arrival: 'LG090' },
      return: { departure: 'LG112', arrival: 'BT701' }
    },
    referenceStops: { outbound: ['BT776', 'BT956'], return: ['BT701', 'BT775'] },
    connections: [],
    showInLive: false,
    noService: ['sunday']
  }
};

export function getDirection(scheduleKey) {
  if (scheduleKey.endsWith('_outbound')) return 'outbound';
  if (scheduleKey.endsWith('_return')) return 'return';
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
    saturday_return: 'Sabato ritorno'
  };
  return labels[scheduleKey] || scheduleKey;
}

export function getDefaultScheduleKey(config, dayType) {
  if (!config?.scheduleKeys?.length) return null;
  if (config.noService?.includes(dayType)) return dayType;
  if (dayType === 'sunday') return config.scheduleKeys.find(k => k === 'sunday') || config.scheduleKeys[0];
  const match = config.scheduleKeys.find(k => k === dayType || k.startsWith(`${dayType}_`));
  return match || config.scheduleKeys[0];
}
