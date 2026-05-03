import { LINE_CONFIG, getDirection, getReferenceStop, getScheduleLabel } from './line-config.js';
import * as DATA from './main.js';
import { getVisibleColumns } from './stop-settings.js';
import {
  minsToHHMM,
  valBadgeHtml,
  flagsHtml,
  trainBadge,
  normalizeTrip,
  getLineBannerInfo,
  isSchoolActive,
  LINE_SCHEDULE_META
} from './utils.js';
import {
  calcNextS5Legnano,
  calcNextS5Parabiago,
  calcNextS5BustoArsizio,
  calcNextREBustoArsizio
} from './trains.js';

function contentId(lineId) {
  return lineId === 'z649' ? 'orari' : lineId;
}

function tableHead(lineId) {
  return document.getElementById(`${lineId}TableHead`) || (lineId === 'z649' ? document.querySelector('#content-orari thead tr') : null);
}

function tableBody(lineId) {
  return document.getElementById(`${lineId}Body`) || (lineId === 'z649' ? document.getElementById('orariBody') : null);
}

// ---------------------------------------------------------------
// BANNER DI VALIDITÀ
// Mostra un riquadro colorato sopra la tabella con avvisi e note
// ---------------------------------------------------------------
function renderValidityBanner(lineId, date) {
  const cid = contentId(lineId);
  const container = document.querySelector(`#content-${cid} .container`);
  if (!container) return;

  // Rimuovi banner e note precedenti se esistono
  const existingBanner = container.querySelector('.schedule-banner');
  if (existingBanner) existingBanner.remove();
  const existingNotes = container.querySelector('.schedule-notes');
  if (existingNotes) existingNotes.remove();

  const banner = getLineBannerInfo(lineId, date);
  const meta   = LINE_SCHEDULE_META?.[lineId];

  // Costruisci HTML banner
  let html = '';

  if (banner.type === 'suspended') {
    html = `
      <div class="schedule-banner banner-suspended">
        <div class="banner-icon">⚠️</div>
        <div class="banner-body">
          ${banner.messages.map(m => `<div class="banner-line">${m}</div>`).join('')}
        </div>
      </div>`;
  } else if (banner.type === 'warning') {
    html = `
      <div class="schedule-banner banner-warning">
        <div class="banner-icon">📚</div>
        <div class="banner-body">
          ${banner.messages.map(m => `<div class="banner-line">${m}</div>`).join('')}
        </div>
      </div>`;
  }

  // Pannello note della linea (sempre visibile, collassabile)
  if (meta?.notes?.length) {
    const cadenceLegend = buildCadenceLegend(meta.cadences);
    html += `
      <details class="schedule-notes">
        <summary class="schedule-notes-title">ℹ️ Note orario ${lineId.toUpperCase()}</summary>
        <div class="schedule-notes-body">
          <ul>${meta.notes.map(n => `<li>${n}</li>`).join('')}</ul>
          ${cadenceLegend}
          <div class="notes-contact">📞 Movibus: <a href="tel:800984362">800 984 362</a> &mdash; <a href="mailto:info@movibus.it">info@movibus.it</a></div>
        </div>
      </details>`;
  }

  if (!html) return;

  // Inserisci dopo il titolo sezione (section-header)
  const sectionHeader = container.querySelector('.section-header');
  if (sectionHeader) {
    sectionHeader.insertAdjacentHTML('afterend', html);
  } else {
    container.insertAdjacentHTML('afterbegin', html);
  }
}

function buildCadenceLegend(cadences) {
  if (!cadences?.length) return '';
  // Importiamo CADENCE_LABELS dal bundle già re-esportato da utils
  const LABELS = {
    FR5: 'Da Lunedì a Venerdì feriali',
    SC5: 'Da Lunedì a Venerdì — solo periodo scolastico',
    SAB: 'Sabato feriale',
    F15: 'FR5 Invernale — Da Lunedì a Venerdì feriali',
    SIS: 'SAB Invernale — Sabato feriale',
    FES: 'Domenica e Festivi',
  };
  const items = cadences
    .filter(c => LABELS[c])
    .map(c => `<li><strong>${c}</strong>: ${LABELS[c]}</li>`)
    .join('');
  return items ? `<ul class="cadence-legend">${items}</ul>` : '';
}

// ---------------------------------------------------------------
// FILTER BUTTONS
// ---------------------------------------------------------------
function renderFilterButtons(lineId, activeKey) {
  const config = LINE_CONFIG[lineId];
  const container = document.querySelector(`#content-${contentId(lineId)} .filter-bar`);
  if (!config || !container) return;

  container.innerHTML = config.scheduleKeys.map(key => `
    <button class="filter-btn ${key === activeKey ? 'active' : ''}" onclick="renderTimetable('${lineId}', '${key}')">
      ${getScheduleLabel(key)}
    </button>
  `).join('');
}

// ---------------------------------------------------------------
// CONNECTION CELL
// ---------------------------------------------------------------
function connectionCell(col, config, trip) {
  const connId = col.key.replace('_connection_', '');
  const conn = config.connections.find(c => c.type === connId);
  if (!conn || trip.stops[conn.stop] == null) {
    return '<td><span class="muted-cell">-</span></td>';
  }

  let time;
  if (conn.slotKey === 'S5_LEGNANO') time = calcNextS5Legnano(trip.stops[conn.stop] + 1);
  else if (conn.slotKey === 'S5_PARABI') time = calcNextS5Parabiago(trip.stops[conn.stop] + 1);
  else if (conn.slotKey === 'S5_BUSTO') time = calcNextS5BustoArsizio(trip.stops[conn.stop] + 1);
  else if (conn.slotKey === 'RE_BUSTO') time = calcNextREBustoArsizio(trip.stops[conn.stop] + 1);
  else return '<td><span class="muted-cell">-</span></td>';

  return `<td><span class="train-time">${conn.label} ~${minsToHHMM(time)}</span>` +
    `<br><span class="cell-subtitle">${conn.destination} ~${minsToHHMM(time + (conn.travelToDest || 30))}</span></td>`;
}

function cellValue(trip, col) {
  let value = trip.stops[col.key];
  if (value == null && col.altKeys) {
    for (const alt of col.altKeys) {
      if (trip.stops[alt] != null) {
        value = trip.stops[alt];
        break;
      }
    }
  }
  return value;
}

// ---------------------------------------------------------------
// RENDER PRINCIPALE
// ---------------------------------------------------------------
export function renderTimetable(lineId, scheduleKey) {
  const config = LINE_CONFIG[lineId];
  if (!config) return;

  const now = DATA.getCurrentDate();

  // Banner validità (Step 3)
  renderValidityBanner(lineId, now);

  renderFilterButtons(lineId, scheduleKey);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const allData = DATA[lineId.toUpperCase()] || {};
  const refKey = getReferenceStop(config, scheduleKey);

  // Determina se le corse SC5 sono attive oggi
  const schoolStatus = isSchoolActive(now);

  const rows = (allData[scheduleKey] || [])
    .slice()
    .sort((a, b) => {
      const tripA = normalizeTrip(a);
      const tripB = normalizeTrip(b);
      return (tripA.stops[refKey] ?? 0) - (tripB.stops[refKey] ?? 0);
    });

  const labelEl = document.getElementById(`${lineId}DayLabel`) || document.getElementById('orariDayLabel');
  if (labelEl) labelEl.textContent = `Orari ${config.label} - ${getScheduleLabel(scheduleKey)}`;

  const thead = tableHead(lineId);
  const tbody = tableBody(lineId);
  if (!tbody) return;

  const columns = getVisibleColumns(lineId, scheduleKey);
  if (thead) {
    thead.innerHTML = columns.map(col => {
      let html = col.label;
      if (col.sublabel) html += `<br><span class="cell-subtitle">${col.sublabel}</span>`;
      if (col.trainBadge) html = html.replace(col.trainBadge, trainBadge(col.trainBadge));
      return `<th>${html}</th>`;
    }).join('');
  }

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${Math.max(columns.length, 1)}" class="empty-cell">Nessun servizio in questo periodo.</td></tr>`;
    return;
  }

  const nextIdx = rows.findIndex(raw => {
    const trip = normalizeTrip(raw);
    return (trip.stops[refKey] ?? 0) >= nowMins;
  });

  const direction = getDirection(scheduleKey);
  const liveArrival = config.liveStops?.[direction]?.arrival || config.liveStops?.all?.arrival || config.arrivalStop;

  tbody.innerHTML = rows.map((raw, i) => {
    const trip = normalizeTrip(raw);
    const isCurrent = i === nextIdx;
    const isShort = liveArrival && trip.stops[liveArrival] == null;

    // Corse SC5: grigio-out se fuori periodo scolastico
    const isSC5 = (trip.flags || []).includes('SC5') ||
                  (trip.validity || '').includes('SC5') ||
                  (raw.cadenza || '').includes('SC5') ||
                  (raw.flags || []).includes('SC5');
    const isInactiveSC5 = isSC5 && !schoolStatus.active;

    const cls = [
      isCurrent ? 'current-row' : '',
      isShort   ? 'short-row'   : '',
      isInactiveSC5 ? 'sc5-inactive' : ''
    ].filter(Boolean).join(' ');

    const cells = columns.map(col => {
      if (col.key === 'tripId') return `<td>${trip.tripId || (i + 1)}</td>`;
      if (col.type === 'validity') return `<td>${valBadgeHtml(trip.validity)}</td>`;
      if (col.type === 'flags')    return `<td>${flagsHtml(trip.flags)}</td>`;
      if (col.key === 'note') {
        // Aggiungi nota SC5 automatica se mancante
        let noteText = trip.note || '';
        if (isSC5 && !noteText.includes('scolastico')) {
          noteText = (noteText ? noteText + ' ' : '') + '<span class="badge badge-sc5 badge-mini">Solo scolastico</span>';
        }
        return `<td>${noteText || '<span class="muted-cell">-</span>'}</td>`;
      }
      if (col.key.startsWith('_connection_')) return connectionCell(col, config, trip);

      const value = cellValue(trip, col);
      if (value == null) return `<td><span class="muted-cell">${col.shortRunValue || '-'}</span></td>`;

      // Orario sfumato se corsa SC5 non attiva
      const timeStr = minsToHHMM(value);
      return isInactiveSC5
        ? `<td><span class="time-inactive" title="Corsa scolastica, non attiva oggi">${timeStr}</span></td>`
        : `<td>${timeStr}</td>`;
    });

    return `<tr class="${cls}">${cells.join('')}</tr>`;
  }).join('');
}

export const showZ649Orari = (type) => renderTimetable('z649', type);
export const showZ627Orari = (type) => renderTimetable('z627', type);
export const showZ644Orari = (type) => renderTimetable('z644', type);
export const showZ625Orari = (type) => renderTimetable('z625', type);
export const showZ647Orari = (type) => renderTimetable('z647', type);
export const showZ642Orari = (type) => renderTimetable('z642', type);
