#!/usr/bin/env node
// CSV -> JS converter for transit schedule data
// Usage: node tools/csv-to-js.mjs <lineId>
// Example: node tools/csv-to-js.mjs z627
//   Reads Orari_Z627/*.csv -> generates data/z627.js

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Per-line configuration ──────────────────────────────────────
// Add a new entry here when you prepare CSVs for another line.
// scheduleMap: maps CSV filename stem -> JS schedule key
const LINE_DEFS = {
  z627: {
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
    scheduleMap: {
      'Completa_Andata_FER':   'weekday_outbound',
      'Completa_Andata_S':     'saturday_outbound',
      'Completa_Ritorno_FER':  'weekday_return',
      'Completa_Ritorno_S':    'saturday_return',
    }
  },
  z625: {
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
    scheduleMap: {
      'Completa_Andata_FER':   'weekday_outbound',
      'Completa_Andata_S':     'saturday_outbound',
      'Completa_Ritorno_FER':  'weekday_return',
      'Completa_Ritorno_S':    'saturday_return',
    }
  },
  z642: {
    meta: {
      linea: "Z642",
      percorso_andata: "Magenta → Corbetta → S.Stefano Ticino → Arluno → Ossona → Casorezzo → Busto Garolfo → Villa Cortese → S.Giorgio → Legnano",
      percorso_ritorno: "Legnano → S.Giorgio → Villa Cortese → Busto Garolfo → Casorezzo → Ossona → Arluno → S.Stefano Ticino → Corbetta → Magenta",
      validita: {
        FR5: "Lun–Ven feriali",
        SC5: "Lun–Ven solo periodo scolastico",
        SAB: "Sabato feriale"
      },
      eccezioni: "Non valido nelle 3 settimane centrali di agosto e nelle festività natalizie"
    },
    scheduleMap: {
      'Completa_Andata_FER':   'weekday_outbound',
      'Completa_Andata_S':     'saturday_outbound',
      'Completa_Ritorno_FER':  'weekday_return',
      'Completa_Ritorno_S':    'saturday_return',
    }
  },
  z644: {
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
    scheduleMap: {
      'Completa_Andata_FER':   'weekday_outbound',
      'Completa_Andata_S':     'saturday_outbound',
      'Completa_Ritorno_FER':  'weekday_return',
      'Completa_Ritorno_S':    'saturday_return',
    }
  },
  z647: {
    meta: {
      linea: "Z647",
      percorso_principale: "Cornaredo/Arluno → Pregnana/Rogorotto → Casorezzo → Busto Garolfo → Arconate → Buscate → Castano P.",
      percorso_ritorno: "Castano P. → Buscate → Arconate → Busto Garolfo → Casorezzo → Arluno → Rogorotto/Pregnana/Cuggiono",
      validita: {
        SC5: "Lun–Ven solo periodo scolastico"
      },
      eccezioni: "Non valido nelle 3 settimane centrali di agosto e nei giorni 1 gennaio, 1 maggio e 25 dicembre"
    },
    scheduleMap: {
      'Completa_Andata_FER':   'weekday_outbound',
      'Completa_Ritorno_FER':  'weekday_return',
    }
  },
  z649: {
    meta: {
      linea: "Z649",
      partenza: "Busto Garolfo – Via Giacomo Rossini 35",
      capolinea: "Milano M1 – Molino Dorino",
      durata_minuti: "49-52",
      validita: {
        weekday: "Lun–Ven feriali",
        saturday: "Sabato feriale",
        sunday: "Domenica e festivi"
      },
      eccezioni: "Non valido 3 settimane centrali agosto e festività natalizie"
    },
    scheduleMap: {
      'Completa_Andata_FER':   'weekday',
      'Completa_Andata_S':     'saturday',
      'Completa_Andata_DOM':   'sunday',
      'Completa_Ritorno_FER':  'weekday_return',
      'Completa_Ritorno_S':    'saturday_return',
      'Completa_Ritorno_DOM':  'sunday_return',
    }
  },
};

// ── CSV parsing ─────────────────────────────────────────────────

function parseTime(cell) {
  const s = cell.trim();
  if (!s || s === '0') return null;
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function parseCsv(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(l => l.replace(/,/g, '').trim().length > 0);
  if (lines.length < 3) throw new Error(`CSV too short: ${filePath}`);

  const splitRow = line => line.split(',');
  const headerCells = splitRow(lines[0]);
  const cadenzaCells = splitRow(lines[1]);

  // Columns 0-2 are stopCode, city, stopName. Trip data starts at col 3.
  const tripCount = Math.max(headerCells.length, cadenzaCells.length) - 3;
  const tripIds = [];
  const validities = [];
  for (let i = 0; i < tripCount; i++) {
    const raw = (headerCells[i + 3] || '').trim();
    tripIds.push(raw ? parseInt(raw, 10) || null : null);
    validities.push((cadenzaCells[i + 3] || '').trim() || null);
  }

  const trips = tripIds.map((id, i) => ({
    tripId: id,
    stops: {},
    validity: validities[i],
    flags: [],
    note: ''
  }));

  // Parse stop rows
  const stopOrder = [];
  for (let r = 2; r < lines.length; r++) {
    const cells = splitRow(lines[r]);
    const code = (cells[0] || '').trim();
    if (!code) continue;
    stopOrder.push(code);

    for (let i = 0; i < tripCount; i++) {
      const mins = parseTime(cells[i + 3] || '');
      trips[i].stops[code] = mins;
    }
  }

  // Move validity from standalone field to flags array (like existing data)
  // Keep validity as-is for FR5/SC5/SAB/FI5/SIS; put it in flags if that's the style
  for (const trip of trips) {
    const v = trip.validity;
    if (v && v !== 'null') {
      trip.flags = [v];
      trip.validity = null;
    }
  }

  return { trips, stopOrder };
}

// ── JS generation ───────────────────────────────────────────────

function formatStops(stops, stopOrder) {
  const pairs = stopOrder
    .map(code => {
      const val = stops[code];
      const key = /^\d/.test(code) ? `"${code}"` : code;
      return `${key}:${val === null ? 'null' : val}`;
    });
  return `{${pairs.join(',')}}`;
}

function formatTrip(trip, stopOrder) {
  const flags = trip.flags.length ? JSON.stringify(trip.flags) : '[]';
  return `    {tripId:${trip.tripId || 'null'},stops:${formatStops(trip.stops, stopOrder)},validity:${trip.validity === null ? 'null' : JSON.stringify(trip.validity)},flags:${flags},note:"${trip.note || ''}"}`;
}

function generateJs(lineId, def, scheduleData) {
  const upper = lineId.toUpperCase();
  const metaJson = JSON.stringify(def.meta, null, 2).replace(/^/gm, '  ');

  let sections = [];
  const scheduleOrder = [
    'weekday', 'weekday_outbound', 'saturday', 'saturday_outbound',
    'sunday', 'weekday_return', 'saturday_return', 'sunday_return'
  ];

  for (const key of scheduleOrder) {
    if (!scheduleData[key]) continue;
    const { trips, stopOrder } = scheduleData[key];
    const tripsStr = trips.map(t => formatTrip(t, stopOrder)).join(',\n');
    sections.push(`  ${key}: [\n${tripsStr}\n  ]`);
  }

  return [
    '// ============================================================',
    `// ${upper}.JS`,
    '// Standardized schema v4.0.0',
    `// Generated by csv-to-js.mjs on ${new Date().toISOString().slice(0, 10)}`,
    '// ============================================================',
    `export const ${upper} = {`,
    `  meta: ${metaJson.trimStart()},`,
    '',
    `${sections.join(',\n\n')}`,
    '};',
    ''
  ].join('\n');
}

// ── Main ────────────────────────────────────────────────────────

const lineId = process.argv[2]?.toLowerCase();
if (!lineId || !LINE_DEFS[lineId]) {
  console.error(`Usage: node tools/csv-to-js.mjs <lineId>`);
  console.error(`Available: ${Object.keys(LINE_DEFS).join(', ')}`);
  process.exit(1);
}

const def = LINE_DEFS[lineId];
const csvDir = join(ROOT, `Orari_${lineId.toUpperCase()}`);

let csvFiles;
try {
  csvFiles = readdirSync(csvDir).filter(f => f.endsWith('.csv'));
} catch {
  console.error(`Directory not found: ${csvDir}`);
  console.error(`Create it with CSV files first (e.g., Completa_Andata_FER.csv)`);
  process.exit(1);
}

const scheduleData = {};
let totalTrips = 0;

for (const file of csvFiles) {
  const stem = basename(file, '.csv');
  const scheduleKey = def.scheduleMap[stem];
  if (!scheduleKey) {
    console.warn(`  SKIP: ${file} (no mapping in scheduleMap for "${stem}")`);
    continue;
  }

  const filePath = join(csvDir, file);
  console.log(`  ${file} -> ${scheduleKey}`);
  const { trips, stopOrder } = parseCsv(filePath);

  // Filter out trips where ALL stops are null (empty column)
  const validTrips = trips.filter(t =>
    Object.values(t.stops).some(v => v !== null)
  );

  scheduleData[scheduleKey] = { trips: validTrips, stopOrder };
  totalTrips += validTrips.length;
}

if (!totalTrips) {
  console.error('No valid trips found in any CSV.');
  process.exit(1);
}

const output = generateJs(lineId, def, scheduleData);
const outPath = join(ROOT, 'data', `${lineId}.js`);
writeFileSync(outPath, output, 'utf-8');

console.log(`\nGenerated: ${outPath}`);
console.log(`Schedules: ${Object.keys(scheduleData).join(', ')}`);
console.log(`Total trips: ${totalTrips}`);
