#!/usr/bin/env node
// ============================================================
// orari-json-to-js.mjs
// Converte orari.json → data/zXXX.js (uno per linea)
// Uso: node tools/orari-json-to-js.mjs
//      node tools/orari-json-to-js.mjs z649   (solo una linea)
// ============================================================
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Helpers ──────────────────────────────────────────────────

function parseTime(str) {
  const m = (str || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/** Controlla se Comune è un codice fermata vero (es. BT775, MD111, PG102) */
function isStopCode(comune) {
  return /^[A-Z]{2,3}\d{3,4}$/.test(comune || '');
}

/**
 * Determina la chiave univoca per una fermata:
 * - Se Comune è un codice fermata (BT775, MD111…) → usa quello in lowercase
 * - Altrimenti → sanitizza il nome Fermata
 */
function makeStopKey(comune, fermata) {
  if (isStopCode(comune)) {
    return comune.toLowerCase();
  }
  // Sanitizza: lowercase, spazi→underscore, rimuovi caratteri speciali
  return fermata
    .toLowerCase()
    .replace(/[àáâä]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Mappatura Tipo_Giorno+Direzione → scheduleKey
const SCHEDULE_KEY_MAP = {
  'FERIALE|ANDATA':  'weekday_andata',
  'FERIALE|RITORNO': 'weekday_ritorno',
  'SABATO|ANDATA':   'saturday_andata',
  'SABATO|RITORNO':  'saturday_ritorno',
  'FESTIVO|ANDATA':  'sunday_andata',
  'FESTIVO|RITORNO': 'sunday_ritorno',
};

const SCHEDULE_ORDER = [
  'weekday_andata', 'weekday_ritorno',
  'saturday_andata', 'saturday_ritorno',
  'sunday_andata', 'sunday_ritorno',
];

// ── Parser ───────────────────────────────────────────────────

function buildSchedule(entries) {
  /**
   * Raggruppa per (Fermata, Comune) mantenendo l'ordine di prima apparizione.
   * Usa (Comune-se-stopcode, altrimenti Fermata) come chiave unica stop.
   * Restituisce { trips, stopOrder, stopMeta }
   */
  const stopMap = new Map(); // stopKey → { fermata, comune, times[] }
  const stopOrder = [];

  for (const entry of entries) {
    const key = makeStopKey(entry.Comune, entry.Fermata);
    if (!stopMap.has(key)) {
      stopMap.set(key, { fermata: entry.Fermata, comune: entry.Comune, times: [] });
      stopOrder.push(key);
    }
    const t = parseTime(entry.Orario);
    if (t !== null) stopMap.get(key).times.push(t);
  }

  // Numero corse = max lunghezza tra tutti gli stop
  const tripCount = Math.max(...[...stopMap.values()].map(g => g.times.length));
  if (tripCount === 0) return { trips: [], stopOrder, stopMeta: stopMap };

  // Ricostruisce trip per posizione
  const trips = [];
  for (let i = 0; i < tripCount; i++) {
    const stops = {};
    let hasAny = false;
    for (const key of stopOrder) {
      const t = stopMap.get(key).times[i] ?? null;
      stops[key] = t;
      if (t !== null) hasAny = true;
    }
    if (hasAny) trips.push({ tripId: i + 1, stops });
  }

  return { trips, stopOrder, stopMeta: stopMap };
}

// ── Generatore JS ────────────────────────────────────────────

function formatStops(stops, stopOrder) {
  return '{' + stopOrder.map(k => `"${k}":${stops[k] === null ? 'null' : stops[k]}`).join(',') + '}';
}

function generateJs(lineId, schedules) {
  const upper = lineId.toUpperCase();
  const date = new Date().toISOString().slice(0, 10);

  const sections = SCHEDULE_ORDER
    .filter(k => schedules[k])
    .map(k => {
      const { trips, stopOrder } = schedules[k];
      const rows = trips.map(t =>
        `    { tripId: ${String(t.tripId).padStart(3)}, stops: ${formatStops(t.stops, stopOrder)} }`
      ).join(',\n');
      return `  "${k}": [\n${rows}\n  ]`;
    });

  return [
    '// ============================================================',
    `// ${upper}.JS — AUTO-GENERATO da tools/orari-json-to-js.mjs`,
    `// Fonte: orari.json  |  Generato il: ${date}`,
    '// NON modificare manualmente — rieseguire lo script.',
    '// ============================================================',
    `export const ${upper} = {`,
    sections.join(',\n\n'),
    '};',
    '',
  ].join('\n');
}

// ── Stampa riepilogo fermate per line-config.js ───────────────

function printStopSummary(lineId, schedules) {
  console.log(`\n  ── Fermate rilevate per ${lineId.toUpperCase()} ──`);
  const seen = new Set();
  for (const key of SCHEDULE_ORDER) {
    if (!schedules[key]) continue;
    const { stopOrder, stopMeta } = schedules[key];
    for (const sk of stopOrder) {
      if (seen.has(sk)) continue;
      seen.add(sk);
      const meta = stopMeta.get(sk);
      const coded = isStopCode(meta.comune) ? ` [${meta.comune}]` : '';
      console.log(`    "${sk}"${coded}  ←  ${meta.fermata} (${meta.comune})`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────

const rawData = JSON.parse(readFileSync(join(ROOT, 'orari.json'), 'utf-8'));
const filterLine = process.argv[2]?.toLowerCase();

const allLines = [...new Set(rawData.map(r => r.Linea))];
const targetLines = filterLine
  ? allLines.filter(l => l.toLowerCase() === filterLine)
  : allLines;

if (!targetLines.length) {
  console.error(`Linea non trovata: ${filterLine}. Disponibili: ${allLines.join(', ')}`);
  process.exit(1);
}

let totalTrips = 0;

for (const linea of targetLines) {
  const lineId = linea.toLowerCase();
  const lineEntries = rawData.filter(r => r.Linea === linea);

  const combos = [...new Set(lineEntries.map(r => `${r.Tipo_Giorno}|${r.Direzione}`))];
  const schedules = {};

  for (const combo of combos) {
    const schedKey = SCHEDULE_KEY_MAP[combo];
    if (!schedKey) { console.warn(`  ⚠ Combo ignorata: ${combo}`); continue; }
    const [tipo, dir] = combo.split('|');
    const subset = lineEntries.filter(r => r.Tipo_Giorno === tipo && r.Direzione === dir);
    schedules[schedKey] = buildSchedule(subset);
  }

  const js = generateJs(lineId, schedules);
  const outPath = join(ROOT, 'data', `${lineId}.js`);
  writeFileSync(outPath, js, 'utf-8');

  const lineTrips = Object.values(schedules).reduce((s, sc) => s + sc.trips.length, 0);
  totalTrips += lineTrips;
  console.log(`✓ data/${lineId}.js  (${lineTrips} corse totali)`);
  printStopSummary(lineId, schedules);
}

console.log(`\n✅ Completato. ${targetLines.length} linee, ${totalTrips} corse totali.`);
console.log('\nℹ️  Aggiorna js/line-config.js con le chiavi fermata stampate sopra.');
