# Trasporti Busto Garolfo — Full Modernization Implementation Plan

## What This Document Is

A self-contained implementation plan for a complete refactoring of a bus transit PWA dashboard. This document includes all the context, current source code, target architecture, and step-by-step instructions needed to execute the refactoring from scratch — no prior conversation context required.

---

## 1. Project Overview

**What it does**: A Progressive Web App showing live bus schedules for Busto Garolfo (Milan metropolitan area, Italy). It covers 6 bus lines (Z625, Z627, Z642, Z644, Z647, Z649) plus Trenord train connections (S5/S6/RE). Features include:
- Live countdown to next departure with urgency indicators
- Timetable views for each line with weekday/saturday/sunday filters
- Train connection calculations (estimated times for connecting trains)
- "Canegrate by car" alternative route calculator
- Import/export of schedule data (users can override built-in schedules)
- PWA with service worker for offline use
- Dark theme, mobile-responsive design

**Hosting**: GitHub Pages (static files only, no server-side processing, no build step at runtime).

---

## 2. Current Problems

### 2.1 Inconsistent Data Schemas
Each bus line uses a completely different data format:
- **Z649**: `{ rossini, pregnana_fs, molino_dorino, flags }` — no `corsa` ID, no `val`
- **Z627**: `{ dep, arr, val, note }` — flat with generic field names
- **Z644**: `{ corsa, rossini, parabiago_fs, parabiago_vb, val, note }` — named stops
- **Z625**: `{ corsa, dep_bg, arr_ba, arr_ba_fs, val, note }` — yet another naming scheme
- **Z647/Z642**: `{ corsa, BT776, BT956, LG090, ... }` — 30-35 stop codes as keys with null for stops not served

### 2.2 Duplicate/Stale Files
- `data/config.json` (version 3.0) duplicates `data/config.js` (version 3.7.0)
- `data/z625.json`, `data/z627.json`, `data/z644.json`, `data/z649.json` duplicate the `.js` files
- `exported_data.json`, `parse_z627.py`, `3f7cf068-84ac-45c8-aea6-f60c2bd02919` are artifacts

### 2.3 Monolithic `app.js` (1179 lines)
- All logic in a single file
- 6 near-identical timetable renderer functions (`showZ649Orari`, `showZ627Orari`, `showZ644Orari`, `showZ625Orari`, `showZ647Orari`, `showZ642Orari`)
- 3 near-identical connection-builder functions (`buildZ627Options`, `buildZ644Options`, `buildZ625Options`)
- 2 separate "get next departures" functions (`getNextZ649`, `getNextBusLive`) with different interfaces

### 2.4 Old JavaScript Patterns
- `var` everywhere (no `const`/`let`)
- `function(){}` callbacks (no arrow functions)
- String concatenation with `+` for building HTML (no template literals)
- `indexOf() >= 0` instead of `.includes()`
- All data loaded via global `var` through `<script>` tags (no modules)

### 2.5 Mixed Language
- UI text is Italian
- Code comments are mixed Italian/English
- Variable names are mixed (`fermata`, `corsa`, `walkRossini`)

### 2.6 Inline CSS
- 172 lines of CSS embedded in `index.html` `<style>` tag

---

## 3. Goals & Design Principles

### Goals
1. **All English**: UI text, comments, variable names
2. **Full data standardization**: Unified trip schema across all 6 lines
3. **Modern ES modules**: `const`/`let`, arrow functions, template literals, `import`/`export`
4. **Must run on GitHub Pages**: No build step, no server. Use native `<script type="module">`
5. **Extensible**: Adding a new bus line = 1 data file + 1 config entry + 1 HTML tab button

### Design Principles
- **Data-driven, not code-driven**: Rendering logic reads configuration, not hardcoded per-line
- **Unified schema**: Every trip uses `{ tripId, stops: {...}, validity, flags, note }`
- **Dynamic schedule keys**: Any `{dayType}_{direction}` combination works without code changes
- **Easy stop management**: Adding/removing stops = data + config change only

---

## 4. Current File Inventory

```
project/
  index.html              (463 lines — HTML + 172 lines inline CSS)
  js/app.js               (1179 lines — monolithic logic)
  data/config.js          (65 lines — app config, holidays, destinations)
  data/config.json         [STALE DUPLICATE — delete]
  data/z649.js            (122 lines — Z649 schedule data)
  data/z649.json           [STALE DUPLICATE — delete]
  data/z627.js            (85 lines — Z627 schedule data)
  data/z627.json           [STALE DUPLICATE — delete]
  data/z644.js            (82 lines — Z644 schedule data)
  data/z644.json           [STALE DUPLICATE — delete]
  data/z625.js            (95 lines — Z625 schedule data)
  data/z625.json           [STALE DUPLICATE — delete]
  data/z647.js            (33 lines — Z647 schedule data)
  data/z642.js            (57 lines — Z642 schedule data)
  sw.js                   (83 lines — service worker)
  manifest.json           (20 lines — PWA manifest)
  package.json            (jsdom dependency — unused at runtime)
  exported_data.json       [ARTIFACT — delete]
  parse_z627.py            [ARTIFACT — delete]
  3f7cf068-...             [ARTIFACT — delete]
```

---

## 5. Current Source Code (Complete)

### 5.1 `data/config.js`
```js
var CFG = {
  holidays: [
    "2025-01-01","2025-01-06","2025-04-21","2025-04-25","2025-05-01",
    "2025-06-02","2025-08-15","2025-11-01","2025-12-08","2025-12-25","2025-12-26",
    "2026-01-01","2026-01-06","2026-04-06","2026-04-25","2026-05-01",
    "2026-06-02","2026-08-15","2026-11-01","2026-12-08","2026-12-25","2026-12-26"
  ],
  version: "3.7.0",
  lastUpdate: "2026-04-29",
  fermata: "Via Giacomo Rossini 35, Busto Garolfo (MI)",
  defaults: { walkRossini: 5, driveCanegrate: 8 },
  m1_destinations: [
    { id: "molino",     name: "🔵 Molino Dorino",          minutesFromMolino: 0  },
    { id: "pagano",     name: "🔵 Pagano / Buonarroti",    minutesFromMolino: 6  },
    { id: "cadorna",    name: "🔵🔴 Cadorna FNM",          minutesFromMolino: 10 },
    { id: "duomo",      name: "🔴🟡 Duomo",                minutesFromMolino: 12 },
    { id: "repubblica", name: "🔵🔴🟡 Repubblica",         minutesFromMolino: 14 },
    { id: "centrale",   name: "🟡 Centrale FS",            minutesFromMolino: 18 }
  ],
  s5s6_destinations: [
    { name: "🚂 Bovisa FNM",            minutesFromPregnana: 10 },
    { name: "🚂 P.ta Garibaldi",        minutesFromPregnana: 20 },
    { name: "🚂 Repubblica (Passante)", minutesFromPregnana: 25 },
    { name: "🚂 Dateo",                 minutesFromPregnana: 29 }
  ],
  canegrate: { travelToMilano: 25, note: "Stima Canegrate→Cadorna via Trenord" }
};
```

### 5.2 Data File Schemas (current — each line is different)

**Z649** (`data/z649.js`) — schedule keys: `feriale`, `sabato`, `domenica`
```js
{ rossini: 307, pregnana_fs: 336, molino_dorino: 351, flags: [] }
// molino_dorino = null for short runs that terminate at Arluno
// flags: ["SC5"] = school-only, ["last"] = last trip of day
```

**Z627** (`data/z627.js`) — schedule keys: `feriale`, `sabato`
```js
{ dep: 352, arr: 371, val: "FR5", note: "" }
// arr = null for short runs
// val: FR5=weekday, SC5=school, SAB=saturday
```

**Z644** (`data/z644.js`) — schedule keys: `feriale_andata`, `feriale_ritorno`, `sabato_andata`, `sabato_ritorno`
```js
// Outbound:
{ corsa: 302, rossini: 399, parabiago_fs: 411, parabiago_vb: null, val: "FI5" }
// parabiago_fs = null → short run (terminates at parabiago_vb = Via Butti)

// Return:
{ corsa: 301, parabiago_prt: 415, rossini: 429, arconate: 436, val: "FI5" }
```

**Z625** (`data/z625.js`) — schedule keys: `feriale_andata`, `feriale_ritorno`, `sabato_andata`, `sabato_ritorno`
```js
// Outbound:
{ corsa: 108, dep_bg: 416, arr_ba: 448, arr_ba_fs: 465, val: "SC5" }
// dep_bg = null → trip doesn't originate from Busto Garolfo

// Return:
{ corsa: 111, dep_ba: 466, dep_ba_fs: null, arr_bg: 498, val: "FR5" }
```

**Z647** (`data/z647.js`) — schedule keys: `feriale_andata`, `feriale_ritorno`
```js
// 30+ stop codes as keys, null if not served:
{ corsa: 902, CD166: 410, CD155: 411, PG055: 414, ..., BT956: 456, AC035: 465, CT011: 484, flags: ["SC5"] }
```

**Z642** (`data/z642.js`) — schedule keys: `feriale_andata`, `feriale_ritorno`, `sabato_andata`, `sabato_ritorno`
```js
// 35+ stop codes as keys, null if not served:
{ corsa: 102, MG306: null, ..., BT776: null, BT956: 360, ..., LG090: 376, LG003: 379, flags: ["SC5"] }
```

### 5.3 Key Logic in `app.js` (1179 lines)

**Core functions** (the ones that matter for refactoring):
- `loadData()` — init: restore from localStorage, set defaults, start tick
- `minsToHHMM(m)` — convert minutes-from-midnight to "HH:MM"
- `getDayType(date)` — returns `'feriale'`/`'sabato'`/`'domenica'` (checks holidays)
- `calcNextTrain(afterMinutes, slots)` — find next train given periodic slots
- `calcNextS5S6/Legnano/Parabiago/BustoArsizio/RE(a)` — wrapper functions for each train line
- `urgencyClass(diff)` / `urgencyBadge(diff)` — UI urgency helpers
- `getNextZ649(effectiveNow, dayType, count)` — find upcoming Z649 departures
- `getNextBusLive(line, nowMins, dayType, count)` — find upcoming Z627/Z644/Z625 departures
- `buildBusOptions(corsa)` — build connection options HTML for Z649 trips
- `buildZ627Options(corsa)` / `buildZ644Options(corsa)` / `buildZ625Options(corsa)` — same for other lines
- `renderUnifiedLive(allUpcoming, allDeparted, effectiveNow, nowMins)` — render live tab bus blocks
- `renderCanegrateBlock(nowMins)` — render the "drive to Canegrate" alternative
- `showZ649Orari(type)` / `showZ627Orari(type)` / `showZ644Orari(mode)` / `showZ625Orari(mode)` / `showZ647Orari(mode)` / `showZ642Orari(mode)` — timetable tab renderers (6 near-identical functions)
- `tick()` — main loop, runs every second (but only updates on minute change via `lastMins` guard)
- `switchTab(tab)` — tab switching
- `exportTimetables()` / `importTimetables(event)` — data import/export
- `buildTransitTimeline(depTime, arrTime, startLoc, endLoc)` — visual timeline component

**Train schedule slots** (minutes within each hour when trains depart):
```js
SLOTS_S5S6       = [1, 16, 31, 46]    // Pregnana/Canegrate, every 15 min
SLOTS_S5_LEGNANO = [3, 33]            // Legnano FS, every 30 min
SLOTS_S5_PARABI  = [13, 43]           // Parabiago FS, every 30 min
SLOTS_S5_BUSTO   = [3, 33]            // Busto Arsizio FS, every 30 min
SLOTS_RE_BUSTO   = [20, 50]           // RE at Busto Arsizio, every 30 min
```

### 5.4 `index.html` Structure

The HTML has:
1. **Head**: 172 lines of inline CSS, Google Fonts, PWA meta tags
2. **Loading overlay**: Spinner shown until `loadData()` completes
3. **Hero bar**: Sticky header with clock, day name, day type, settings button
4. **Tab bar**: 8 tabs (LIVE, Z649, Z627, Z644, Z625, Z647, Z642, DATI/Settings)
5. **Tab content sections**: Each line has its own `<div class="tab-content">` with a table, filter buttons, etc.
6. **Settings tab**: Walk time inputs, import/export buttons, info section
7. **Script tags**: 7 data scripts + app.js + inline DOMContentLoaded + service worker registration

**Important HTML element IDs referenced by JS** (must be preserved or remapped):
- Clock: `clock`, `dayName`, `dayType`
- Countdown: `mainCountdown`, `mainCountdownLabel`, `cntMins`, `cntTime`, `cntBadge`, `progressFill`, `mainTimeline`
- Live tab: `unifiedBusBlocks`, `otherBusesNoService`, `canegrateCard`, `canegrateNextTrain`, `canegrateBlock`, `departedSection`, `departedBlocks`, `departedToggle`
- Z649 tab: `orariDayLabel`, `orariBody`, `btnFeriale`, `btnSabato`, `btnDomenica`
- Z627 tab: `z627DayLabel`, `z627Body`, `z627TableHead`, `z627btnFeriale`, `z627btnSabato`
- Z644 tab: `z644DayLabel`, `z644Body`, `z644TableHead`, `z644btnAndata`, `z644btnRitorno`, `z644btnSabAnd`, `z644btnSabRit`
- Z625 tab: `z625DayLabel`, `z625Body`, `z625TableHead`, `z625btnFerAnd`, `z625btnFerRit`, `z625btnSabAnd`, `z625btnSabRit`
- Z647 tab: `z647DayLabel`, `z647Subtitle`, `z647FilterBar`, `z647TableHead`, `z647Body`, `z647Note`
- Z642 tab: `z642DayLabel`, `z642Subtitle`, `z642FilterBar`, `z642TableHead`, `z642Body`, `z642Note`
- Settings: `walkRossini`, `walkCanegrate`, `appTitle`, `dataVersion`, `importFile`, `importStatus`
- Loading: `loadingOverlay`

### 5.5 `sw.js` — Service Worker
Cache-first strategy. Precaches: `./`, `./index.html`, `./js/app.js`, all data `.js` files, `./manifest.json`. Cache version `trasporti-bg-v3.7.0`. Must be updated whenever file paths change.

### 5.6 `manifest.json`
```json
{
  "name": "Trasporti LIVE — Busto Garolfo",
  "short_name": "Trasporti BG",
  "lang": "it",
  "display": "standalone",
  "background_color": "#0b1020",
  "theme_color": "#22d3ee",
  "start_url": "./"
}
```

---

## 6. Target Architecture

### 6.1 File Structure
```
project/
  index.html                 (slimmed: no inline CSS, single module script tag)
  css/
    style.css                (extracted from index.html)
  js/
    main.js                  (entry point: imports, init, tick, tab switching)
    utils.js                 (minsToHHMM, getDayType, urgency helpers, timeline builder)
    trains.js                (SLOTS, calcNextTrain, all train calc wrappers)
    live.js                  (renderUnifiedLive, buildConnectionOptions, canegrate)
    timetable.js             (generic renderTimetable replacing 6 functions)
    settings.js              (import/export, localStorage)
    line-config.js           (LINE_CONFIG — drives all generic renderers)
  data/
    config.js                (holidays, version, defaults, destinations)
    z649.js                  (standardized schema)
    z627.js                  (standardized schema)
    z644.js                  (standardized schema)
    z625.js                  (standardized schema)
    z647.js                  (standardized schema)
    z642.js                  (standardized schema)
  sw.js                      (updated precache list)
  manifest.json              (lang: "en")
```

### 6.2 Unified Trip Schema

Every trip across ALL lines uses this format:
```js
{
  tripId: 302,                    // trip/corsa number (null if not applicable)
  stops: {                        // time in minutes from midnight (null = not served)
    rossini: 399,
    parabiago_fs: 411,
    parabiago_vb: null
  },
  validity: "FI5",                // FR5, SC5, SAB, FI5, SIS, etc.
  flags: [],                      // ["SC5"], ["last"], etc.
  note: ""                        // freeform note
}
```

For Z647/Z642 (30+ stops), the `stops` object simply has more keys using stop codes:
```js
{
  tripId: 902,
  stops: { CD166: 410, BT956: 456, AC035: 465, CT011: 484, /* ... */ },
  validity: "SC5",
  flags: ["SC5"],
  note: ""
}
```

### 6.3 Schedule Key Standardization

| Old (Italian) | New (English) |
|---|---|
| `feriale` | `weekday` |
| `sabato` | `saturday` |
| `domenica` | `sunday` |
| `feriale_andata` | `weekday_outbound` |
| `feriale_ritorno` | `weekday_return` |
| `sabato_andata` | `saturday_outbound` |
| `sabato_ritorno` | `saturday_return` |
| `festivo_andata` | `holiday_outbound` |
| `festivo_ritorno` | `holiday_return` |

The system must handle any `{dayType}_{direction}` combination dynamically.

### 6.4 LINE_CONFIG Object

This is the central configuration that drives the generic renderers. Example:

```js
export const LINE_CONFIG = {
  z649: {
    label: "Z649",
    type: "simple",
    departureStop: "rossini",
    arrivalStop: "molino_dorino",
    shortRunCheck: "molino_dorino",
    departureLocation: "Via Rossini",
    arrivalLocation: "Molino Dorino M1",
    shortRunLabel: "Arluno",
    scheduleKeys: ["weekday", "saturday", "sunday"],
    columns: {
      default: [
        { key: "#", type: "index" },
        { key: "rossini", label: "Via Rossini" },
        { key: "pregnana_fs", label: "Pregnana FS" },
        { key: "molino_dorino", label: "Molino Dorino", nullLabel: "Arluno" }
      ]
    },
    referenceStops: ["rossini"],
    connections: [
      { type: "M1", stop: "molino_dorino", label: "M1", destinations: "m1_destinations" },
      { type: "S5S6", stop: "pregnana_fs", label: "S5/S6", slotKey: "S5S6" }
    ],
    showInLive: true,
    noService: []
  },

  z627: {
    label: "Z627",
    type: "simple",
    departureStop: "buonarroti",
    arrivalStop: "legnano_fs",
    shortRunCheck: "legnano_fs",
    departureLocation: "Via Buonarroti",
    arrivalLocation: "Legnano FS",
    shortRunLabel: "Liceo",
    scheduleKeys: ["weekday", "saturday"],
    columns: {
      default: [
        { key: "buonarroti", label: "Departure", sublabel: "Via Buonarroti" },
        { key: "legnano_fs", label: "Legnano FS", sublabel: "LG090" },
        { key: "_connection_S5_LEGNANO", label: "Connection", sublabel: "S5 → Milan" }
      ]
    },
    referenceStops: ["buonarroti"],
    connections: [
      { type: "S5_LEGNANO", stop: "legnano_fs", label: "S5", slotKey: "S5_LEGNANO",
        travelTime: 30, destination: "Cadorna" }
    ],
    showInLive: true,
    noService: ["sunday"]
  },

  z644: {
    label: "Z644",
    type: "simple",
    departureStop: "rossini",
    arrivalStop: "parabiago_fs",
    shortRunCheck: "parabiago_fs",
    departureLocation: "Via Rossini 35",
    arrivalLocation: "Parabiago FS",
    shortRunLabel: "Via Butti",
    scheduleKeys: ["weekday_outbound", "weekday_return", "saturday_outbound", "saturday_return"],
    columns: {
      outbound: [
        { key: "rossini", label: "Via Rossini 35" },
        { key: "parabiago_fs", label: "Parabiago FS" },
        { key: "_connection_S5_PARABI", label: "Connection", sublabel: "S5 → Milan" }
      ],
      return: [
        { key: "parabiago_prt", label: "Parabiago FS" },
        { key: "rossini", label: "Via Rossini 35" },
        { key: "arconate", label: "Arconate" }
      ]
    },
    referenceStops: { outbound: ["rossini"], return: ["parabiago_prt"] },
    connections: [
      { type: "S5_PARABI", stop: "parabiago_fs", label: "S5", slotKey: "S5_PARABI",
        travelTime: 25, destination: "P.ta Garibaldi" }
    ],
    showInLive: true,
    noService: ["sunday"]
  },

  z625: {
    label: "Z625",
    type: "simple",
    departureStop: "curiel",
    arrivalStop: "busto_arsizio_fs",
    shortRunCheck: "busto_arsizio_fs",
    departureLocation: "Via Curiel",
    arrivalLocation: "Busto Arsizio FS",
    shortRunLabel: "No FS",
    scheduleKeys: ["weekday_outbound", "weekday_return", "saturday_outbound", "saturday_return"],
    columns: {
      outbound: [
        { key: "curiel", label: "Departure BT701", sublabel: "Via Curiel" },
        { key: "busto_arsizio", label: "BA Centro" },
        { key: "busto_arsizio_fs", label: "BA FS" },
        { key: "_connection_S5_BUSTO", label: "S5/RE", sublabel: "→ Milan" }
      ],
      return: [
        { key: "dep_ba", label: "Departure BA" },
        { key: "dep_ba_fs", label: "Departure BA FS" },
        { key: "arr_bg", label: "Arr. Busto G." }
      ]
    },
    referenceStops: { outbound: ["curiel"], return: ["dep_ba", "dep_ba_fs"] },
    connections: [
      { type: "S5_BUSTO", stop: "busto_arsizio_fs", label: "S5", slotKey: "S5_BUSTO",
        travelTime: 40, destination: "P.ta Garibaldi" },
      { type: "RE_BUSTO", stop: "busto_arsizio_fs", label: "RE", slotKey: "RE_BUSTO",
        travelTime: 30, destination: "P.ta Garibaldi" }
    ],
    showInLive: true,
    noService: ["sunday"]
  },

  z647: {
    label: "Z647",
    type: "stopCode",
    scheduleKeys: ["weekday_outbound", "weekday_return"],
    columns: {
      outbound: [
        { key: "tripId", label: "Trip", type: "tripId" },
        { key: "BT999_dep", label: "BG dep", sublabel: "Terminal" },
        { key: "BT949", label: "131 - Depot" },
        { key: "BT956", label: "91 - Pool" },
        { key: "AC035", label: "Arconate" },
        { key: "CT011", label: "Castano P." }
      ],
      return: [
        { key: "tripId", label: "Trip", type: "tripId" },
        { key: "AC627", label: "Arconate", altKeys: ["AC625"] },
        { key: "BT951", label: "90 - Pool" },
        { key: "BT999_arr", label: "BG arr", altKeys: ["BT205", "BT775"] }
      ]
    },
    referenceStops: { outbound: ["BT999_dep", "BT956"], return: ["BT951", "BT999_arr", "BT205"] },
    connections: [],
    showInLive: false,
    noService: ["sunday", "saturday"]
  },

  z642: {
    label: "Z642",
    type: "stopCode",
    scheduleKeys: ["weekday_outbound", "weekday_return", "saturday_outbound", "saturday_return"],
    columns: {
      outbound: [
        { key: "tripId", label: "Trip", type: "tripId" },
        { key: "BT776", label: "Via Buonarroti", sublabel: "BT776" },
        { key: "BT956", label: "Montebianco Fr.17", sublabel: "BT956" },
        { key: "LG090", label: "Legnano FS", sublabel: "LG090/LG112", altKeys: ["LG112"], trainBadge: "S5" },
        { key: "LG003", label: "Legnano Centro", altKeys: ["LG001"] }
      ],
      return: [
        { key: "tripId", label: "Trip", type: "tripId" },
        { key: "LG112", label: "Legnano FS", sublabel: "LG090/LG112", altKeys: ["LG090"], trainBadge: "S5" },
        { key: "BT701", label: "Via Buonarroti", sublabel: "BT701" },
        { key: "BT775", label: "Area Via Rossini", sublabel: "BT775" }
      ]
    },
    referenceStops: { outbound: ["BT776", "BT956"], return: ["BT701", "BT775"] },
    connections: [],
    showInLive: false,
    noService: ["sunday"]
  }
};
```

### 6.5 Data Migration Examples

**Z649 (before → after)**:
```js
// Before:
{ rossini: 307, pregnana_fs: 336, molino_dorino: 351, flags: [] }

// After:
{ tripId: null, stops: { rossini: 307, pregnana_fs: 336, molino_dorino: 351 }, validity: "FR5", flags: [], note: "" }
```

**Z627 (before → after)**:
```js
// Before:
{ dep: 352, arr: 371, val: "FR5", note: "" }

// After:
{ tripId: null, stops: { buonarroti: 352, legnano_fs: 371 }, validity: "FR5", flags: [], note: "" }
```

**Z644 outbound (before → after)**:
```js
// Before:
{ corsa: 302, rossini: 399, parabiago_fs: 411, parabiago_vb: null, val: "FI5" }

// After:
{ tripId: 302, stops: { rossini: 399, parabiago_fs: 411, parabiago_vb: null }, validity: "FI5", flags: [], note: "" }
```

**Z644 return (before → after)**:
```js
// Before:
{ corsa: 301, parabiago_prt: 415, rossini: 429, arconate: 436, val: "FI5" }

// After:
{ tripId: 301, stops: { parabiago_prt: 415, rossini: 429, arconate: 436 }, validity: "FI5", flags: [], note: "" }
```

**Z625 outbound (before → after)**:
```js
// Before:
{ corsa: 108, dep_bg: 416, arr_ba: 448, arr_ba_fs: 465, val: "SC5" }

// After:
{ tripId: 108, stops: { curiel: 416, busto_arsizio: 448, busto_arsizio_fs: 465 }, validity: "SC5", flags: [], note: "" }
```

**Z625 return (before → after)**:
```js
// Before:
{ corsa: 111, dep_ba: 466, dep_ba_fs: null, arr_bg: 498, val: "FR5" }

// After:
{ tripId: 111, stops: { dep_ba: 466, dep_ba_fs: null, arr_bg: 498 }, validity: "FR5", flags: [], note: "" }
```

**Z647/Z642 (before → after)**:
```js
// Before:
{ corsa: 902, CD166: 410, CD155: 411, ..., CT011: 484, flags: ["SC5"] }

// After:
{ tripId: 902, stops: { CD166: 410, CD155: 411, ..., CT011: 484 }, validity: "SC5", flags: ["SC5"], note: "" }
```

---

## 7. Step-by-Step Implementation

### Stage 0: Cleanup (5 min)
Delete these files:
- `data/config.json`, `data/z625.json`, `data/z627.json`, `data/z644.json`, `data/z649.json`
- `exported_data.json`, `parse_z627.py`, `3f7cf068-84ac-45c8-aea6-f60c2bd02919`
- `analisi_miglioramenti.md`, `todo.md`, `PROMPT_AI_dashboard_trasporti_live_v2.md` (planning docs)

### Stage 1: Extract CSS (10 min)
1. Create `css/style.css` — move all 172 lines from `<style>` tag in `index.html`
2. Replace `<style>...</style>` with `<link rel="stylesheet" href="./css/style.css">`
3. Add `'./css/style.css'` to `sw.js` PRECACHE_ASSETS

### Stage 2: Convert to ES Modules (30 min)
**Critical: This breaks `file://` protocol. ES modules require HTTP.**

1. All data files: change `var X = {...}` to `export const X = {...}` (keep `let` if reassigned)
2. `data/config.js`: `var CFG = {...}` → `export const CFG = {...}`
3. Create `js/main.js` as the new entry point with all imports
4. In `index.html`:
   - Remove all 7 `<script src="./data/...">` tags
   - Remove `<script src="./js/app.js"></script>`
   - Remove the inline `<script>document.addEventListener('DOMContentLoaded', loadData);</script>`
   - Add: `<script type="module" src="./js/main.js"></script>`
   - Keep the service worker registration script (inline, non-module)
5. Every function called from HTML `onclick` must be exposed: `window.switchTab = switchTab;` etc.
6. The full list of functions referenced by onclick in HTML:
   - `switchTab`, `showZ649Orari`, `showZ627Orari`, `showZ644Orari`, `showZ625Orari`, `showZ647Orari`, `showZ642Orari`
   - `toggleUnifiedBlock`, `toggleDeparted`, `toggleCanegrate`
   - `exportTimetables`, `importTimetables`

### Stage 3: Split app.js into Modules (1-2 hours)

Move functions from app.js into these modules (all using `export`):

**`js/utils.js`**: `minsToHHMM`, `getDayType`, `urgencyClass`, `urgencyBadge`, `valBadgeHtml`, `flagsHtml`, `trainBadge`, `buildTransitTimeline`

**`js/trains.js`**: `SLOTS` object, `calcNextTrain`, `calcNextS5S6`, `calcNextS5Legnano`, `calcNextS5Parabiago`, `calcNextS5BustoArsizio`, `calcNextREBustoArsizio`

**`js/live.js`**: `getNextZ649`, `getNextBusLive`, `buildBusOptions`, `buildZ627Options`, `buildZ644Options`, `buildZ625Options`, `renderUnifiedLive`, `renderCanegrateBlock`, `toggleUnifiedBlock`, `toggleDeparted`, `toggleCanegrate`

**`js/timetable.js`**: `showZ649Orari`, `showZ627Orari`, `showZ644Orari`, `showZ625Orari`, `showZ647Orari`, `showZ642Orari` (keep as-is for now, will be unified in Stage 5)

**`js/settings.js`**: `exportTimetables`, `importTimetables`, settings `change` listeners

**`js/main.js`**: `loadData`, `tick`, `switchTab`, all `window.*` assignments, `setInterval(tick, 1000)`, DOMContentLoaded listener

### Stage 4: Modernize JS Syntax (1-2 hours)

For every `.js` file:
- `var` → `const`/`let`
- `function(x){}` → `(x) => {}`
- `'string ' + var + ' string'` → `` `string ${var} string` ``
- `arr.indexOf(x) >= 0` → `arr.includes(x)`
- `for (var i = 0; ...)` → `for (const item of arr)` or `.map`/`.filter`/`.forEach`

### Stage 5: Standardize Data Schemas (2-3 hours)

This is the biggest change. Do it in sub-steps:

**5a.** Create `js/line-config.js` with the `LINE_CONFIG` object (see section 6.4 above)

**5b.** Convert all 6 data files to the unified trip schema (see section 6.5 examples). Change schedule keys from Italian to English.

**5c.** Update `getDayType()` to return `'weekday'`/`'saturday'`/`'sunday'` instead of Italian.

**5d.** Replace the 6 `show*Orari` functions with one generic `renderTimetable(lineId, scheduleKey)` that:
- Reads `LINE_CONFIG[lineId]` for column definitions
- Auto-generates filter buttons from `scheduleKeys`
- Uses `referenceStops` to determine "current row" highlighting
- Handles both `simple` and `stopCode` types
- For `_connection_*` columns, computes the next train time using `trains.js`

**5e.** Replace `getNextZ649` + `getNextBusLive` with one `getNextDepartures(lineId, nowMins, dayType, data, config, count)` that reads `config.departureStop` and `config.arrivalStop`.

**5f.** Replace `buildZ627Options` + `buildZ644Options` + `buildZ625Options` with one `buildConnectionOptions(lineId, trip, config)` that uses `config.connections` to determine which trains to calculate.

**5g.** Update import/export for backward compatibility:
```js
const migrateTrip = (trip) => {
  if (trip.stops) return trip;
  const { corsa, val, note, flags, ...stopFields } = trip;
  return { tripId: corsa ?? null, stops: stopFields, validity: val ?? '', flags: flags ?? [], note: note ?? '' };
};

const migrateScheduleKeys = (data) => {
  const keyMap = {
    feriale: 'weekday', sabato: 'saturday', domenica: 'sunday',
    feriale_andata: 'weekday_outbound', feriale_ritorno: 'weekday_return',
    sabato_andata: 'saturday_outbound', sabato_ritorno: 'saturday_return'
  };
  for (const [oldKey, newKey] of Object.entries(keyMap)) {
    if (data[oldKey] && !data[newKey]) {
      data[newKey] = data[oldKey].map(migrateTrip);
      delete data[oldKey];
    }
  }
  return data;
};
```

### Stage 6: Translate UI to English (1 hour)

**JavaScript strings to translate**:
- Day names: `['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato']` → `['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']`
- `'SBRIGATI'` → `'HURRY'`
- `'Ottimo timing'` → `'Good timing'`
- `'Hai tempo'` → `'Take your time'`
- `'Perso?'` → `'Missed?'`
- `'Corsa breve'` → `'Short run'`
- `'Ultima'` → `'Last'`
- `'partito X min fa'` → `'departed X min ago'`
- `'Prossima Partenza'` → `'Next Departure'`
- `'Prossime Partenze'` → `'Upcoming Departures'`
- `'Partiti di recente'` → `'Recently Departed'`
- `'Nessuna corsa imminente'` → `'No upcoming departures'`
- `'Nessun servizio domenica e festivi'` → `'No service on Sundays and holidays'`
- `'Capolinea Molino Dorino'` → `'Terminus Molino Dorino'`
- `'Scendi a ...'` → `'Get off at ...'`
- `'PIÙ RAPIDO'` → `'FASTEST'`
- `'In partenza'` → `'Departing'`
- `'Indipendente'` → `'Independent'`
- `'Parte alle ...'` → `'Departs at ...'`
- `'tra X min'` → `'in X min'`
- `'Avvio...'` → `'Loading...'`
- `'Avvio in corso...'` → `'Starting...'`

**HTML text to translate**:
- Tab: `DATI` → `DATA`
- Settings: `'Tempi di percorrenza'` → `'Travel Times'`
- `'Minuti a piedi → Via Rossini 35'` → `'Walk time (min) → Via Rossini 35'`
- `'Da casa tua alla fermata Z649'` → `'From your home to the Z649 stop'`
- `'Minuti in auto → Canegrate FS'` → `'Drive time (min) → Canegrate FS'`
- `'Dati e Backup'` → `'Data & Backup'`
- `'Esporta JSON'` → `'Export JSON'`, `'Importa JSON'` → `'Import JSON'`
- All disclaimer/estimate notes
- `<html lang="it">` → `<html lang="en">`
- `<title>` → `Transit LIVE — Busto Garolfo`

**manifest.json**: Change `"lang": "it"` → `"lang": "en"`, translate name/description.

### Stage 7: Final Cleanup (30 min)

1. Update `sw.js`:
   - Add `'./css/style.css'` and `'./js/line-config.js'` to precache
   - Verify all paths match actual files
   - Bump `CACHE_NAME` to `'trasporti-bg-v4.0.0'`

2. Version bump: `config.js` version → `"4.0.0"`

3. Update `manifest.json` with English text

4. Clean up `package.json` or delete if unused

---

## 8. Verification Checklist

After implementation, verify:

1. **Live tab**: Countdown shows next departure, updates every minute, urgency badges correct
2. **Bus blocks**: Expand/collapse works, connection times calculated correctly
3. **Canegrate block**: Shows next 2 trains, drive time adjustable from settings
4. **Departed section**: Shows buses from last 30 minutes, toggle works
5. **Each timetable tab** (Z649, Z627, Z644, Z625, Z647, Z642):
   - Filter buttons work (weekday/saturday/sunday or outbound/return)
   - Current row highlighted correctly
   - Short runs show warning styling
   - Train connections shown where applicable
6. **Settings**: Walk time persists in localStorage, export downloads valid JSON, import reloads
7. **Service worker**: App works offline after first visit
8. **Mobile**: Responsive at 375px width, tab bar scrolls horizontally
9. **No console errors**
10. **Sunday/holiday**: Day type detection works, "no service" messages show

---

## 9. Risks & Gotchas

1. **`file://` protocol breaks**: ES modules won't load. Document: use `npx serve .` or `python3 -m http.server` for local dev.
2. **onclick handlers**: Every function called from HTML onclick must be on `window`. Missing one = silent failure.
3. **Service worker cache**: Old cache may serve stale files. Bump `CACHE_NAME` AND unregister old SW during development (`navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()))`).
4. **Z649 has no `val` field**: Current Z649 trips don't have a `validity` field. Infer from `flags`: if flags includes "SC5" → validity "SC5", else "FR5". The schedule key already implies the day type.
5. **Z644 uses `FI5`/`SIS`** validity codes (not `FR5`/`SAB`). Preserve these as-is in the data.
6. **Import backward compat**: Users may have old-format data in localStorage. The migration function must handle both formats.
7. **Broken HTML comment on line 249**: `zione Precedenti (bus già partiti) -->` is a truncated comment — fix it.
8. **Unclosed div on line 259**: There's an extra `</div>` closing the tab-bar-wrap that shouldn't be there (or a missing opening), causing the Z649 tab to be inside the tab-bar-wrap. Fix the HTML nesting.
