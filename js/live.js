import { CFG } from '../data/config.js';
import { LINE_CONFIG, getLiveStops } from './line-config.js';
import * as DATA from './main.js';
import {
  minsToHHMM,
  urgencyBadge,
  buildTransitTimeline,
  normalizeTrip,
  isSchoolActive
} from './utils.js';
import {
  calcNextS5S6,
  calcNextS5Legnano,
  calcNextS5Parabiago,
  calcNextS5BustoArsizio,
  calcNextREBustoArsizio
} from './trains.js';

// ---------------------------------------------------------------
// Controlla se una corsa è di tipo SC5 (solo scolastico)
// Cerca in validity, flags e campo cadenza grezzo
// ---------------------------------------------------------------
function isSC5Trip(trip, raw) {
  return (
    (trip.validity || '').toUpperCase().includes('SC5') ||
    (trip.flags || []).some(f => f.toUpperCase() === 'SC5') ||
    (raw?.cadenza || '').toUpperCase().includes('SC5') ||
    (raw?.val    || '').toUpperCase().includes('SC5')
  );
}

export function getNextDepartures(lineId, nowMins, dayType, count = 3) {
  const config = LINE_CONFIG[lineId];
  if (!config || !config.showInLive) return { upcoming: [], departed: [] };

  const allData = DATA[lineId.toUpperCase()] || {};
  const keysToSearch = config.scheduleKeys.filter(key => key === dayType || key.startsWith(`${dayType}_`));
  const upcoming = [];
  const departed = [];

  // Stato scolastico calcolato una volta per tutte le corse
  const today = DATA.getCurrentDate ? DATA.getCurrentDate() : new Date();
  const schoolStatus = isSchoolActive(today);

  keysToSearch.forEach(key => {
    const schedule = allData[key] || [];
    const liveStops = getLiveStops(config, key);

    schedule.forEach(raw => {
      const trip = normalizeTrip(raw, lineId, key);

      // --- FILTRO SC5 ---
      // Se la corsa è scolastica e il periodo scolastico non è attivo, salta
      if (isSC5Trip(trip, raw) && !schoolStatus.active) return;

      const dep = trip.stops[liveStops.departure] ?? trip.stops[liveStops.fallbackDeparture];
      if (dep == null) return;

      const arr = liveStops.arrival ? trip.stops[liveStops.arrival] : null;
      const endMins = arr || dep + 30;

      if (dep > nowMins && dep <= nowMins + 180) {
        upcoming.push({ line: lineId, label: config.label, dep, data: trip, key, raw });
      } else if (dep <= nowMins && endMins > nowMins - 15) {
        departed.push({ line: lineId, label: config.label, dep, data: trip, key, raw });
      }
    });
  });

  return {
    upcoming: upcoming.slice(0, count),
    departed
  };
}

function nextTrainForSlot(slotKey, afterMinutes) {
  if (slotKey === 'S5S6') return calcNextS5S6(afterMinutes);
  if (slotKey === 'S5_LEGNANO') return calcNextS5Legnano(afterMinutes);
  if (slotKey === 'S5_PARABI') return calcNextS5Parabiago(afterMinutes);
  if (slotKey === 'S5_BUSTO') return calcNextS5BustoArsizio(afterMinutes);
  if (slotKey === 'RE_BUSTO') return calcNextREBustoArsizio(afterMinutes);
  return null;
}

export function buildBusOptions(trip, lineId) {
  const config = LINE_CONFIG[lineId];
  if (!config) return '';

  const walkCanegrate = parseInt(document.getElementById('walkCanegrate')?.value, 10) || CFG.defaults.driveCanegrate;
  const options = [];

  config.connections.forEach(conn => {
    const arrAtStop = trip.stops[conn.stop];
    if (arrAtStop == null) return;

    if (conn.type === 'M1') {
      const dests = CFG.m1_destinations.map(dest => ({
        name: dest.name,
        arrival: arrAtStop + (conn.travelTime || 0) + dest.minutesFromMolino
      }));
      const rep = dests.find(dest => dest.name.includes('Repubblica'));
      options.push({ type: 'molino', label: 'M1', arrAtStop, dests, repArrival: rep ? rep.arrival : Infinity });
      return;
    }

    const nextTrain = nextTrainForSlot(conn.slotKey, arrAtStop + (conn.travelTime || 1));
    if (!nextTrain) return;

    const dests = conn.type === 'S5_PREGNANA'
      ? CFG.s5s6_destinations.map(dest => ({ name: dest.name, arrival: nextTrain + dest.minutesFromPregnana }))
      : [{ name: conn.destination, arrival: nextTrain + (conn.travelToDest || 30) }];
    const rep = dests.find(dest => dest.name.includes('Repubblica') || dest.name.includes('Garibaldi') || dest.name.includes('Cadorna'));
    options.push({ type: conn.type, label: conn.label, arrAtStop, nextTrain, dests, repArrival: rep ? rep.arrival : Infinity });
  });

  if (lineId === 'z649') {
    const refTime = trip.stops.rossini;
    const canArr = refTime + walkCanegrate;
    const nextCanTrain = calcNextS5S6(canArr + 1);
    const canArrMilano = nextCanTrain + CFG.canegrate.travelToMilano;
    options.push({ type: 'canegrate', label: 'Auto', canArr, nextCanTrain, canArrMilano, repArrival: canArrMilano });
  }

  const fastest = options.reduce((best, opt) => opt.repArrival < best.repArrival ? opt : best, { repArrival: Infinity });

  return options.map(opt => {
    const rapidoBadge = opt.type === fastest.type ? ' <span class="badge badge-rapido">Piu rapido</span>' : '';

    if (opt.type === 'molino') {
      return [
        '<div class="option-group">',
        `<div class="option-group-title">Capolinea Molino Dorino <span class="opt-detail">(arr. ${minsToHHMM(opt.arrAtStop)}) -> M1</span>${rapidoBadge}</div>`,
        opt.dests.slice(1).map(dest => `
          <div class="route-line"><span class="route-arrow">-</span>
          <div class="route-info"><span class="route-dest">${dest.name}</span>
          <div class="route-times">~${minsToHHMM(dest.arrival)}</div></div></div>`).join(''),
        '</div>'
      ].join('');
    }

    if (opt.type === 'canegrate') {
      return [
        '<div class="option-group">',
        `<div class="option-group-title">Via Canegrate FS <span class="opt-detail">(auto ~${walkCanegrate} min)</span>${rapidoBadge}</div>`,
        '<div class="route-line"><span class="route-arrow">-</span>',
        '<div class="route-info"><span class="route-dest">Canegrate -> Cadorna (Trenord)</span>',
        `<div class="route-times">Treno ~${minsToHHMM(opt.nextCanTrain)} -> <strong>Cadorna ~${minsToHHMM(opt.canArrMilano)}</strong></div></div></div>`,
        '<div class="estimate-note">Orari stimati. Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>',
        '</div>'
      ].join('');
    }

    return [
      '<div class="option-group">',
      `<div class="option-group-title">Scendi alle ${minsToHHMM(opt.arrAtStop)} -> ${opt.label}${rapidoBadge}</div>`,
      opt.dests.map(dest => `
        <div class="route-line"><span class="route-arrow">-</span>
        <div class="route-info"><span class="route-dest">${dest.name}</span>
        <div class="route-times">~${minsToHHMM(dest.arrival)}</div></div></div>`).join(''),
      '<div class="estimate-note">Orari stimati. Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>',
      '</div>'
    ].join('');
  }).join('');
}

export function renderUnifiedLive(allUpcoming, allDeparted, effectiveNow, nowMins) {
  const container = document.getElementById('unifiedBusBlocks');
  if (container) {
    if (!allUpcoming.length) {
      container.innerHTML = '<div class="empty-state">Nessuna corsa imminente.</div>';
    } else {
      container.innerHTML = allUpcoming.map((item, i) => {
        const trip = item.data;
        const config = LINE_CONFIG[item.line];
        if (!config) return '';

        const liveStops = getLiveStops(config, item.key);
        const arrivalStop = liveStops.arrival;
        const isShort = arrivalStop && trip.stops[arrivalStop] == null;
        const sc5Badge = (trip.validity === 'SC5' || trip.flags.includes('SC5')) ? ' <span class="badge badge-short">SC5</span>' : '';
        const lastBadge = trip.flags.includes('last') ? ' <span class="badge badge-short">Ultima</span>' : '';
        const shortBadge = isShort ? ` <span class="badge badge-short">${config.shortRunLabel || 'Corsa breve'}</span>` : '';
        const badgesHtml = `<div class="bus-block-badges">${sc5Badge}${lastBadge}${shortBadge}</div>`;
        const bodyHtml = isShort
          ? `<div class="option-group"><div class="option-group-title option-muted">Corsa breve - termina a ${config.shortRunLabel || 'destinazione intermedia'}.</div></div>`
          : buildBusOptions(trip, item.line);

        const endLoc = isShort ? (config.shortRunLabel || 'Intermedia') : (config.arrivalLocation || 'Capolinea');
        const arrTime = isShort ? item.dep + 20 : trip.stops[arrivalStop];
        const timelineHtml = buildTransitTimeline(item.dep, arrTime, config.departureLocation || 'Via Rossini', endLoc);
        const noteHtml = trip.note ? `<div class="trip-note">${trip.note}</div>` : '';

        const isUnreachable = item.dep < effectiveNow;
        const displayDiff = isUnreachable ? (item.dep - nowMins) : (item.dep - effectiveNow);
        const urgencyHtml = isUnreachable ? '<span class="badge badge-urgent">Perso?</span>' : urgencyBadge(Math.max(displayDiff, 0));
        const diffLabel = isUnreachable ? `<span class="urgent-text">tra ${displayDiff} min</span>` : `tra ${displayDiff} min`;

        return [
          `<div class="bus-block" id="unifiedblock-${i}">`,
          `  <div class="bus-block-header" onclick="toggleUnifiedBlock(${i})">`,
          '    <div class="transit-top-row">',
          `      <div><span class="bus-number">${item.label}</span>${badgesHtml}</div>`,
          `      <div>${urgencyHtml}<span class="bus-block-diff">${diffLabel}</span></div>`,
          '    </div>',
          `    ${timelineHtml}`,
          noteHtml,
          '    <span class="collapse-icon-wrap">v</span>',
          '  </div>',
          `  <div class="bus-block-body">${bodyHtml}</div>`,
          '</div>'
        ].join('\n');
      }).join('\n');
    }
  }

  const deptSection = document.getElementById('departedSection');
  const deptBlocks = document.getElementById('departedBlocks');
  if (!deptSection || !deptBlocks) return;

  if (!allDeparted.length) {
    deptSection.style.display = 'none';
    return;
  }

  deptSection.style.display = 'block';
  if (!deptBlocks.style.display) deptBlocks.style.display = 'none';
  deptBlocks.innerHTML = allDeparted.map(item => {
    const config = LINE_CONFIG[item.line];
    const liveStops = getLiveStops(config, item.key);
    const isShort = liveStops.arrival && item.data.stops[liveStops.arrival] == null;
    const minsAgo = nowMins - item.dep;

    return [
      '<div class="bus-block">',
      '  <div class="bus-block-header bus-block-header-static">',
      '    <div class="bus-block-title">',
      `      <span class="bus-number">${item.label}</span>`,
      `      <span class="bus-dep-time">${minsToHHMM(item.dep)}</span>`,
      `      <span class="badge badge-short">partito ${minsAgo} min fa</span>`,
      (isShort ? `      <span class="badge badge-short">${config.shortRunLabel || 'Corsa breve'}</span>` : ''),
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }).join('\n');
}

export function toggleUnifiedBlock(i) {
  document.querySelectorAll('#unifiedBusBlocks .bus-block').forEach((el, idx) => {
    if (idx === i) el.classList.toggle('active');
    else el.classList.remove('active');
  });
}

export function toggleDeparted() {
  const blocks = document.getElementById('departedBlocks');
  const toggle = document.getElementById('departedToggle');
  if (!blocks) return;
  const isOpen = blocks.style.display !== 'none';
  blocks.style.display = isOpen ? 'none' : 'block';
  if (toggle) toggle.classList.toggle('open', !isOpen);
}

export function renderCanegrateBlock(nowMins) {
  const container = document.getElementById('canegrateBlock');
  if (!container) return;
  const walkCanegrate = parseInt(document.getElementById('walkCanegrate')?.value, 10) || CFG.defaults.driveCanegrate;
  const canArr = nowMins + walkCanegrate;
  const t1 = calcNextS5S6(canArr + 1);
  const t2 = calcNextS5S6(t1 + 1);

  const headerSummary = document.getElementById('canegrateNextTrain');
  if (headerSummary) headerSummary.textContent = `S5/S6 ~${minsToHHMM(t1)} -> Cadorna ~${minsToHHMM(t1 + CFG.canegrate.travelToMilano)}`;

  container.innerHTML = [
    '<div class="option-group option-group-flat">',
    `<div class="option-group-title option-title-flat">Arrivo Canegrate FS ~${minsToHHMM(canArr)} (auto ${walkCanegrate} min)</div>`,
    '<div class="route-line"><span class="route-arrow">-</span>',
    '<div class="route-info"><span class="route-dest">1 treno S5/S6 -> Cadorna</span>',
    `<div class="route-times">parte ~${minsToHHMM(t1)} -> <strong>Cadorna ~${minsToHHMM(t1 + CFG.canegrate.travelToMilano)}</strong></div></div></div>`,
    '<div class="route-line"><span class="route-arrow">-</span>',
    '<div class="route-info"><span class="route-dest">2 treno S5/S6 -> Cadorna</span>',
    `<div class="route-times">parte ~${minsToHHMM(t2)} -> <strong>Cadorna ~${minsToHHMM(t2 + CFG.canegrate.travelToMilano)}</strong></div></div></div>`,
    '</div>'
  ].join('');
}

export function toggleCanegrate() {
  const card = document.getElementById('canegrateCard');
  if (card) card.classList.toggle('active');
}

export const getNextZ649 = (now, dt, count) => getNextDepartures('z649', now, dt, count).upcoming;
export const getNextBusLive = (line, now, dt, count) => {
  const res = getNextDepartures(line, now, dt, count);
  return [...res.upcoming, ...res.departed].map(item => {
    const liveStops = getLiveStops(LINE_CONFIG[line], item.key);
    return {
      depMins: item.dep,
      arrMins: item.data.stops[liveStops.arrival],
      val: item.data.validity,
      note: item.data.note
    };
  });
};
