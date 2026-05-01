import { LINE_CONFIG, getDirection, getReferenceStop, getScheduleLabel } from './line-config.js';
import * as DATA from './main.js';
import { getVisibleColumns } from './stop-settings.js';
import {
  minsToHHMM,
  valBadgeHtml,
  flagsHtml,
  trainBadge,
  normalizeTrip
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

export function renderTimetable(lineId, scheduleKey) {
  const config = LINE_CONFIG[lineId];
  if (!config) return;

  renderFilterButtons(lineId, scheduleKey);

  const now = DATA.getCurrentDate();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const allData = DATA[lineId.toUpperCase()] || {};
  const refKey = getReferenceStop(config, scheduleKey);
  const rows = (allData[scheduleKey] || [])
    .slice()
    .sort((a, b) => {
      const tripA = normalizeTrip(a, lineId, scheduleKey);
      const tripB = normalizeTrip(b, lineId, scheduleKey);
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
    const trip = normalizeTrip(raw, lineId, scheduleKey);
    return (trip.stops[refKey] ?? 0) >= nowMins;
  });

  const direction = getDirection(scheduleKey);
  const liveArrival = config.liveStops?.[direction]?.arrival || config.liveStops?.all?.arrival || config.arrivalStop;

  tbody.innerHTML = rows.map((raw, i) => {
    const trip = normalizeTrip(raw, lineId, scheduleKey);
    const isCurrent = i === nextIdx;
    const isShort = liveArrival && trip.stops[liveArrival] == null;
    const cls = isCurrent ? 'current-row' : (isShort ? 'short-row' : '');

    const cells = columns.map(col => {
      if (col.key === 'tripId') return `<td>${trip.tripId || (i + 1)}</td>`;
      if (col.type === 'validity') return `<td>${valBadgeHtml(trip.validity)}</td>`;
      if (col.type === 'flags') return `<td>${flagsHtml(trip.flags)}</td>`;
      if (col.key === 'note') return `<td>${trip.note || '<span class="muted-cell">-</span>'}</td>`;
      if (col.key.startsWith('_connection_')) return connectionCell(col, config, trip);

      const value = cellValue(trip, col);
      if (value == null) return `<td><span class="muted-cell">${col.shortRunValue || '-'}</span></td>`;
      return `<td>${minsToHHMM(value)}</td>`;
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
