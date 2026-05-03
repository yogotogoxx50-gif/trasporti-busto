// ============================================================
// SCHEDULE-META.JS — Metadati orari Movibus
// Fonte: note ufficiali PDF allegati ai file CSV in STOPS/
// Contiene: sigle cadenza, periodi di non validità, periodo
//           scolastico, banner di avviso per ogni linea.
// ============================================================

// ------------------------------------------------------------
// 1. MAPPA SIGLE CADENZA
//    Usata per mostrare badge leggibili nelle tabelle orari
// ------------------------------------------------------------
export const CADENCE_LABELS = {
  FR5: { short: 'Feriale',     long: 'Da Lunedì a Venerdì feriali',                          color: 'green'  },
  SC5: { short: 'Scolastico',  long: 'Da Lunedì a Venerdì feriali — solo periodo scolastico', color: 'orange' },
  SAB: { short: 'Sabato',      long: 'Sabato feriale',                                        color: 'blue'   },
  F15: { short: 'Fer.Inv.',    long: 'FR5 Invernale — Da Lunedì a Venerdì feriali',           color: 'green'  },
  SIS: { short: 'Sab.Inv.',    long: 'SAB Invernale — Sabato feriale',                        color: 'blue'   },
  FES: { short: 'Festivo',     long: 'Domenica e Festivi',                                    color: 'purple' },
};

// ------------------------------------------------------------
// 2. PERIODI DI NON VALIDITÀ
//    Ogni entry: { start: 'MM-DD', end: 'MM-DD', label, type }
//    type: 'agosto' | 'natale' | 'z644_estate' | 'festivo_speciale'
//    start/end vengono risolti rispetto all'anno corrente/prossimo
// ------------------------------------------------------------

// 3 settimane centrali di agosto = 9–29 agosto
// Festività natalizie = 24 dicembre – 6 gennaio (anno seguente)
export const SUSPENDED_PERIODS = {

  // Linee Z627, Z625, Z642, Z649, Z647 (file 1-4, 5, 8-11)
  standard: [
    {
      type: 'agosto',
      startMD: '08-09',
      endMD:   '08-29',
      label:   '3 settimane centrali di agosto',
      note:    "L'orario non è valido nelle 3 settimane centrali di agosto."
    },
    {
      type: 'natale',
      startMD: '12-24',
      endMD:   '01-06',   // anno seguente
      label:   'Festività natalizie',
      note:    "L'orario non è valido durante le festività natalizie (24 dic – 6 gen)."
    }
  ],

  // Linea Z644 (file 6-7): sospensione estiva più lunga
  z644: [
    {
      type: 'estate',
      startMD: '07-20',
      endMD:   '09-06',
      label:   'Sospensione estiva (20 lug – 6 set)',
      note:    "L'orario Z644 non è valido dal 20 luglio al 6 settembre."
    },
    {
      type: 'natale',
      startMD: '12-24',
      endMD:   '01-06',
      label:   'Festività natalizie',
      note:    "L'orario non è valido durante le festività natalizie (24 dic – 6 gen)."
    }
  ],

  // Linea Z647 (file 8-9): agosto + soli 3 festivi specifici
  z647: [
    {
      type: 'agosto',
      startMD: '08-09',
      endMD:   '08-29',
      label:   '3 settimane centrali di agosto',
      note:    "L'orario non è valido nelle 3 settimane centrali di agosto."
    },
    // I giorni fissi (1/1, 1/5, 25/12) sono già coperti da CFG.holidays in utils.js
    // ma aggiungiamo nota esplicativa
    {
      type: 'festivi_fissi',
      fixedDates: ['01-01', '05-01', '12-25'],
      label:   'Festivi fissi (1 gen, 1 mag, 25 dic)',
      note:    "Non valido il 1° gennaio, 1° maggio e 25 dicembre."
    }
  ]
};

// ------------------------------------------------------------
// 3. PERIODO SCOLASTICO REGIONE LOMBARDIA
//    Le corse SC5 circolano solo in questo periodo.
//    Aggiornare ogni anno scolastico.
//    Anno scolastico 2025/2026: 11 set 2025 – 12 giu 2026
// ------------------------------------------------------------
export const SCHOOL_PERIODS = [
  { start: '2025-09-11', end: '2026-06-12', label: 'A.S. 2025/2026' },
  { start: '2026-09-10', end: '2027-06-11', label: 'A.S. 2026/2027' }, // stima
];

// Interruzioni scolastiche invernali (vacanze natale dentro il periodo scolastico)
export const SCHOOL_BREAKS = [
  { start: '2025-12-24', end: '2026-01-06', label: 'Vacanze natalizie 2025/26' },
  { start: '2026-04-02', end: '2026-04-07', label: 'Vacanze pasquali 2026' },
];

// ------------------------------------------------------------
// 4. METADATI PER LINEA
//    validFrom: data di entrata in vigore dell'orario corrente
//    suspendedPeriodKey: quale entry di SUSPENDED_PERIODS usare
//    cadences: sigle usate in questa linea
//    notes: testo da mostrare nel banner informativo del tab
// ------------------------------------------------------------
export const LINE_SCHEDULE_META = {
  z627: {
    validFrom: '2025-09-13',
    suspendedPeriodKey: 'standard',
    cadences: ['FR5', 'SC5', 'SAB'],
    notes: [
      "Orario valido dal 13/09/2025.",
      "FR5 = feriale Lun–Ven. SC5 = solo periodo scolastico.",
      "SAB = Sabato feriale.",
      "Non valido nelle 3 settimane centrali di agosto e nelle festività natalizie."
    ]
  },
  z625: {
    validFrom: '2025-09-12',
    suspendedPeriodKey: 'standard',
    cadences: ['FR5', 'SC5', 'SAB'],
    notes: [
      "Orario valido dal 12/09/2025.",
      "FR5 = feriale Lun–Ven. SC5 = solo periodo scolastico.",
      "SAB = Sabato feriale.",
      "Non valido nelle 3 settimane centrali di agosto e nelle festività natalizie."
    ]
  },
  z642: {
    validFrom: '2025-09-12',
    suspendedPeriodKey: 'standard',
    cadences: ['FR5', 'SC5', 'SAB'],
    notes: [
      "Orario valido dal 12/09/2025.",
      "FR5 = feriale Lun–Ven. SC5 = solo periodo scolastico.",
      "SAB = Sabato feriale.",
      "Non valido nelle 3 settimane centrali di agosto e nelle festività natalizie."
    ]
  },
  z644: {
    validFrom: '2026-03-02',
    suspendedPeriodKey: 'z644',
    cadences: ['F15', 'SC5', 'SIS'],
    notes: [
      "Orario feriale valido dal 02/03/2026, sabato dal 07/03/2026.",
      "F15 = FR5 Invernale (Lun–Ven feriali). SC5 = solo periodo scolastico.",
      "SIS = SAB Invernale.",
      "Non valido dal 20 luglio al 6 settembre e nelle festività natalizie."
    ]
  },
  z647: {
    validFrom: '2025-09-12',
    suspendedPeriodKey: 'z647',
    cadences: ['SC5', 'FES', 'SAB'],
    notes: [
      "Orario valido dal 12/09/2025.",
      "SC5 = solo periodo scolastico (calendario Regione Lombardia).",
      "FES = Domenica e Festivi (valido dal 14/09/2025).",
      "SAB = Sabato feriale (valido dal 29/11/2025).",
      "Non valido nelle 3 settimane centrali di agosto e nei giorni 1 gen, 1 mag, 25 dic."
    ]
  },
  z649: {
    validFrom: '2025-11-03',
    suspendedPeriodKey: 'standard',
    cadences: ['FR5', 'SC5'],
    notes: [
      "Orario valido dal 03/11/2025.",
      "FR5 = feriale Lun–Ven. SC5 = solo periodo scolastico.",
      "Non valido nelle 3 settimane centrali di agosto e nelle festività natalizie."
    ]
  }
};

// ------------------------------------------------------------
// 5. FUNZIONI DI UTILITÀ
// ------------------------------------------------------------

/**
 * Dato un anno, risolve una stringa 'MM-DD' in oggetto Date.
 * Se il mese è gennaio (01) viene assegnato all'anno+1
 * (per gestire il periodo natale che sfora a gennaio).
 */
function resolveDate(MD, baseYear, isEndOfYear = false) {
  const [month, day] = MD.split('-').map(Number);
  const year = (isEndOfYear && month <= 2) ? baseYear + 1 : baseYear;
  return new Date(year, month - 1, day);
}

/**
 * Controlla se una data è dentro un periodo sospeso per una linea.
 * @param {string} lineId  — es. 'z627'
 * @param {Date}   date    — data da verificare
 * @returns {{ suspended: boolean, reason: string|null }}
 */
export function isScheduleSuspended(lineId, date) {
  const meta = LINE_SCHEDULE_META[lineId];
  if (!meta) return { suspended: false, reason: null };

  const key = meta.suspendedPeriodKey;
  const periods = SUSPENDED_PERIODS[key] || [];
  const year = date.getFullYear();
  const dateMs = date.getTime();

  for (const period of periods) {
    if (period.fixedDates) {
      // Festivi fissi: confronta MM-DD
      const mo = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      if (period.fixedDates.includes(`${mo}-${dd}`)) {
        return { suspended: true, reason: period.note };
      }
      continue;
    }

    // Determina se il periodo sfora nell'anno successivo (es. natale 24/12–06/01)
    const [startMonth] = period.startMD.split('-').map(Number);
    const [endMonth]   = period.endMD.split('-').map(Number);
    const crossYear    = endMonth < startMonth;

    const start = resolveDate(period.startMD, year);
    const end   = resolveDate(period.endMD, year, crossYear);

    // Normalizza a inizio giornata
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Se il periodo sfora anno: controlla anche l'anno precedente
    // (es. 24/12/2025 – 06/01/2026: a gennaio 2026 dobbiamo guardare baseYear=2025)
    const startPrev = crossYear ? resolveDate(period.startMD, year - 1) : null;
    const endPrev   = crossYear ? resolveDate(period.endMD, year - 1, true) : null;
    if (startPrev) startPrev.setHours(0, 0, 0, 0);
    if (endPrev)   endPrev.setHours(23, 59, 59, 999);

    if (
      (dateMs >= start.getTime() && dateMs <= end.getTime()) ||
      (startPrev && endPrev && dateMs >= startPrev.getTime() && dateMs <= endPrev.getTime())
    ) {
      return { suspended: true, reason: period.note };
    }
  }

  return { suspended: false, reason: null };
}

/**
 * Controlla se oggi è un giorno scolastico attivo (per mostrare corse SC5).
 * @param {Date} date
 * @returns {{ active: boolean, label: string|null }}
 */
export function isSchoolActive(date) {
  const dateMs = date.getTime();

  // Controlla se siamo dentro un periodo scolastico
  const inSchool = SCHOOL_PERIODS.some(p => {
    const s = new Date(p.start); s.setHours(0,0,0,0);
    const e = new Date(p.end);   e.setHours(23,59,59,999);
    return dateMs >= s.getTime() && dateMs <= e.getTime();
  });
  if (!inSchool) return { active: false, label: null };

  // Controlla se siamo in una pausa scolastica (vacanze)
  const inBreak = SCHOOL_BREAKS.some(p => {
    const s = new Date(p.start); s.setHours(0,0,0,0);
    const e = new Date(p.end);   e.setHours(23,59,59,999);
    return dateMs >= s.getTime() && dateMs <= e.getTime();
  });
  if (inBreak) return { active: false, label: 'vacanze scolastiche' };

  return { active: true, label: null };
}

/**
 * Restituisce le note formattate per il banner del tab di una linea.
 * @param {string} lineId
 * @param {Date}   date
 * @returns {{ type: 'ok'|'warning'|'suspended', messages: string[] }}
 */
export function getLineBannerInfo(lineId, date) {
  const meta = LINE_SCHEDULE_META[lineId];
  if (!meta) return { type: 'ok', messages: [] };

  const suspended = isScheduleSuspended(lineId, date);
  if (suspended.suspended) {
    return {
      type: 'suspended',
      messages: [
        `⚠️ Servizio sospeso: ${suspended.reason}`,
        'ℹ️ Contatti Movibus: 800 984 362 — info@movibus.it'
      ]
    };
  }

  const messages = [];
  const schoolCheck = isSchoolActive(date);

  if (meta.cadences.includes('SC5') && !schoolCheck.active) {
    const reason = schoolCheck.label ? ` (${schoolCheck.label})` : '';
    messages.push(`📚 Le corse SC5 (solo scolastico) non circolano oggi${reason}.`);
  }

  if (messages.length > 0) {
    return { type: 'warning', messages };
  }

  return { type: 'ok', messages: meta.notes || [] };
}
