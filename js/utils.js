import { CFG } from '../data/config.js';
export { isScheduleSuspended, isSchoolActive, getLineBannerInfo, CADENCE_LABELS, LINE_SCHEDULE_META } from '../data/schedule-meta.js';

export function minsToHHMM(m) {
  const wrapped = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function getDayType(date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const iso = `${y}-${mo}-${day}`;
  if (CFG.holidays?.includes(iso)) return 'sunday';
  const d = date.getDay();
  if (d === 0) return 'sunday';
  if (d === 6) return 'saturday';
  return 'weekday';
}

export function dayTypeLabel(dayType) {
  return {
    weekday: 'Feriale',
    saturday: 'Sabato',
    sunday: 'Domenica/Festivo'
  }[dayType] || dayType;
}

export function urgencyClass(diff) {
  if (diff < 5) return 'urgent';
  if (diff <= 15) return 'soon';
  return 'later';
}

export function urgencyBadge(diff) {
  if (diff < 5) return '<span class="badge badge-urgent">Sbrigati</span>';
  if (diff <= 15) return '<span class="badge badge-soon">Ottimo timing</span>';
  return '<span class="badge badge-later">Hai tempo</span>';
}

export function valBadgeHtml(val) {
  if (!val) return '<span class="muted-cell">-</span>';
  return `<span class="badge badge-short badge-mini">${val}</span>`;
}

export function flagsHtml(flags) {
  if (!flags?.length) return '<span class="muted-cell">-</span>';
  return flags.map(flag => `<span class="badge badge-short badge-mini">${flag}</span>`).join(' ');
}

export function trainBadge(label) {
  return `<span class="badge badge-rapido badge-mini">${label}</span>`;
}

export function buildTransitTimeline(depTime, arrTime, startLoc, endLoc) {
  const dur = arrTime != null ? arrTime - depTime : '?';
  const arrStr = arrTime != null ? minsToHHMM(arrTime) : '--:--';
  return [
    '<div class="transit-timeline">',
    '  <div class="transit-point">',
    `    <div class="transit-time">${minsToHHMM(depTime)}</div>`,
    `    <div class="transit-loc">${startLoc}</div>`,
    '  </div>',
    '  <div class="transit-duration">',
    '    <span class="duration-line"></span>',
    `    <span class="duration-pill">${dur} min</span>`,
    '    <span class="duration-line"></span>',
    '  </div>',
    '  <div class="transit-point right">',
    `    <div class="transit-time">${arrStr}</div>`,
    `    <div class="transit-loc">${endLoc}</div>`,
    '  </div>',
    '</div>'
  ].join('');
}

export function normalizeTrip(trip, lineId, scheduleKey) {
  // Formato nuovo (stopCode / z627 / z642 / z647): trip.stops già popolato
  if (trip.stops) return {
    tripId: trip.tripId ?? null,
    stops: trip.stops,
    validity: trip.validity ?? trip.val ?? null,
    flags: trip.flags || [],
    note: trip.note || ''
  };

  // Formato legacy (z649, z644, z625 con campi flat)
  const stops = {};
  const tripId = trip.corsa || trip.tripId || null;
  const validity = trip.val || trip.validity || null;
  const flags = trip.flags || [];
  const note = trip.note || '';
  const isOutbound = scheduleKey.includes('andata') || scheduleKey.includes('outbound');

  if (lineId === 'z649') {
    stops.rossini = trip.rossini;
    stops.pregnana_fs = trip.pregnana_fs;
    stops.molino_dorino = trip.molino_dorino;
  } else if (lineId === 'z644') {
    if (isOutbound) {
      stops.rossini = trip.rossini;
      stops.parabiago_fs = trip.parabiago_fs;
      stops.parabiago_vb = trip.parabiago_vb;
    } else {
      stops.parabiago_prt = trip.parabiago_prt;
      stops.rossini = trip.rossini;
      stops.arconate = trip.arconate;
    }
  } else if (lineId === 'z625') {
    if (isOutbound) {
      stops.curiel = trip.dep_bg;
      stops.busto_arsizio = trip.arr_ba;
      stops.busto_arsizio_fs = trip.arr_ba_fs;
    } else {
      stops.dep_ba = trip.dep_ba;
      stops.dep_ba_fs = trip.dep_ba_fs;
      stops.arr_bg = trip.arr_bg;
    }
  } else {
    Object.keys(trip).forEach(key => {
      if (!['corsa', 'tripId', 'val', 'validity', 'flags', 'note'].includes(key)) {
        stops[key] = trip[key];
      }
    });
  }

  return { tripId, stops, validity, flags, note };
}
