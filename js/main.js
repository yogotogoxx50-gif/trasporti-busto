import { CFG } from '../data/config.js';
import { LINE_CONFIG, getDefaultScheduleKey, getLiveStops } from './line-config.js';
import { Z649 as _Z649 } from '../data/z649.js';
import { Z627 as _Z627 } from '../data/z627.js';
import { Z644 as _Z644 } from '../data/z644.js';
import { Z625 as _Z625 } from '../data/z625.js';
import { Z647 as _Z647 } from '../data/z647.js';
import { Z642 as _Z642 } from '../data/z642.js';
import { getDayType, dayTypeLabel, minsToHHMM, urgencyBadge, urgencyClass, buildTransitTimeline } from './utils.js';
import { getNextDepartures, renderUnifiedLive, renderCanegrateBlock, toggleUnifiedBlock, toggleDeparted, toggleCanegrate } from './live.js';
import { renderTimetable, showZ649Orari, showZ627Orari, showZ644Orari, showZ625Orari, showZ647Orari, showZ642Orari } from './timetable.js';
import { exportTimetables, importTimetables, initSettings } from './settings.js';

export let Z649 = _Z649;
export let Z627 = _Z627;
export let Z644 = _Z644;
export let Z625 = _Z625;
export let Z647 = _Z647;
export let Z642 = _Z642;

export { CFG };

let lastMins = -1;
let intervalId = null;
const TIME_TRAVEL_KEY = 'timeTravelDateTime';

function resetMinuteCache() {
  lastMins = -1;
}

export function getTimeTravelValue() {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(TIME_TRAVEL_KEY) || '';
}

export function getCurrentDate() {
  const value = getTimeTravelValue();
  if (!value) return new Date();
  const simulated = new Date(value);
  return Number.isNaN(simulated.getTime()) ? new Date() : simulated;
}

export function isTimeTravelActive() {
  return Boolean(getTimeTravelValue());
}

export function setTimeTravelValue(value) {
  if (typeof localStorage === 'undefined') return;
  if (value) localStorage.setItem(TIME_TRAVEL_KEY, value);
  else localStorage.removeItem(TIME_TRAVEL_KEY);
}

export function clearTimeTravelValue() {
  setTimeTravelValue('');
}

export function tick() {
  const now = getCurrentDate();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const days = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
  const dayNameEl = document.getElementById('dayName');
  if (dayNameEl) dayNameEl.textContent = days[now.getDay()];

  const dt = getDayType(now);
  const dayTypeEl = document.getElementById('dayType');
  if (dayTypeEl) {
    const suffix = isTimeTravelActive() ? ' · SIMULATO' : '';
    dayTypeEl.textContent = `${dayTypeLabel(dt).toUpperCase()}${suffix}`;
  }

  const nowMins = h * 60 + m;
  if (nowMins === lastMins) return;
  lastMins = nowMins;

  const walkRossiniInput = document.getElementById('walkRossini');
  const walkTime = walkRossiniInput ? (parseInt(walkRossiniInput.value, 10) || CFG.defaults.walkRossini) : CFG.defaults.walkRossini;
  const effectiveNow = nowMins + walkTime;

  let allUpcoming = [];
  let allDeparted = [];

  Object.keys(LINE_CONFIG).forEach(lineId => {
    const config = LINE_CONFIG[lineId];
    if (!config.showInLive) return;
    const { upcoming, departed } = getNextDepartures(lineId, nowMins, dt, 5);
    allUpcoming = allUpcoming.concat(upcoming);
    allDeparted = allDeparted.concat(departed);
  });

  allUpcoming.sort((a, b) => a.dep - b.dep);
  allDeparted.sort((a, b) => b.dep - a.dep);

  const mainLabel = document.getElementById('mainCountdownLabel');
  if (!allUpcoming.length) {
    const cntMins = document.getElementById('cntMins');
    const cntTime = document.getElementById('cntTime');
    const cntBadge = document.getElementById('cntBadge');
    const progressFill = document.getElementById('progressFill');
    const mainCountdown = document.getElementById('mainCountdown');
    const mainTimeline = document.getElementById('mainTimeline');

    if (cntMins) cntMins.textContent = '--';
    if (cntTime) cntTime.textContent = 'Nessuna corsa imminente';
    if (cntBadge) cntBadge.innerHTML = '';
    if (progressFill) progressFill.style.width = '0%';
    if (mainCountdown) mainCountdown.className = 'countdown-card';
    if (mainTimeline) mainTimeline.style.display = 'none';
    if (mainLabel) mainLabel.textContent = 'Prossima partenza';
  } else {
    const nextItem = allUpcoming[0];
    const trip = nextItem.data;
    const depTime = nextItem.dep;
    const config = LINE_CONFIG[nextItem.line];
    const liveStops = getLiveStops(config, nextItem.key);
    const isUnreachable = depTime < effectiveNow;
    const diff = isUnreachable ? (depTime - nowMins) : (depTime - effectiveNow);
    const urg = isUnreachable ? 'urgent' : urgencyClass(diff);

    if (mainLabel) mainLabel.textContent = `Prossimo ${nextItem.label} da ${config.departureLocation || 'Via Rossini'}`;

    const cntEl = document.getElementById('cntMins');
    const cntTime = document.getElementById('cntTime');
    const cntBadge = document.getElementById('cntBadge');
    const mainCountdown = document.getElementById('mainCountdown');
    const progressFill = document.getElementById('progressFill');

    if (cntEl) {
      cntEl.textContent = diff;
      if (isUnreachable) {
        cntEl.style.color = 'var(--urgent)';
        if (cntTime) cntTime.innerHTML = `<strong class="urgent-text">Perso?</strong> Parte tra ${diff} min (alle ${minsToHHMM(depTime)})`;
      } else {
        cntEl.style.color = '';
        if (cntTime) cntTime.textContent = `Parte alle ${minsToHHMM(depTime)}`;
      }
    }

    if (cntBadge) cntBadge.innerHTML = isUnreachable ? '<span class="badge badge-urgent">In partenza</span>' : urgencyBadge(diff);
    if (mainCountdown) mainCountdown.className = `countdown-card ${urg}`;

    const progress = Math.max(0, Math.min(100, ((30 - diff) / 30) * 100));
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
      progressFill.style.background = isUnreachable ? 'var(--urgent)' : '';
    }

    const mt = document.getElementById('mainTimeline');
    if (mt) {
      mt.style.display = 'block';
      const isShort = liveStops.arrival && trip.stops[liveStops.arrival] == null;
      const endLoc = isShort ? (config.shortRunLabel || 'Intermedia') : (config.arrivalLocation || 'Capolinea');
      const arrMins = isShort ? depTime + 20 : trip.stops[liveStops.arrival];
      mt.innerHTML = buildTransitTimeline(depTime, arrMins, config.departureLocation || 'Via Rossini', endLoc);
    }
  }

  renderUnifiedLive(allUpcoming, allDeparted, effectiveNow, nowMins);

  const noServiceEl = document.getElementById('otherBusesNoService');
  if (noServiceEl) noServiceEl.style.display = dt === 'sunday' ? 'block' : 'none';
  renderCanegrateBlock(nowMins);
}

export function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

  const content = document.getElementById(`content-${tab}`);
  if (content) content.classList.add('active');
  const button = document.getElementById(`tab-${tab}`);
  if (button) button.classList.add('active');

  const dt = getDayType(getCurrentDate());
  if (tab === 'live') {
    resetMinuteCache();
    tick();
  } else if (LINE_CONFIG[tab]) {
    renderTimetable(tab, getDefaultScheduleKey(LINE_CONFIG[tab], dt));
  } else if (tab === 'orari') {
    renderTimetable('z649', dt);
  }
}

export function loadData() {
  const savedData = localStorage.getItem('userTimetables');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.Z649) Z649 = parsed.Z649;
      if (parsed.Z627) Z627 = parsed.Z627;
      if (parsed.Z644) Z644 = parsed.Z644;
      if (parsed.Z625) Z625 = parsed.Z625;
      if (parsed.Z647) Z647 = parsed.Z647;
      if (parsed.Z642) Z642 = parsed.Z642;
      console.log('[Data] Orari caricati da memoria locale.');
    } catch (e) {
      console.error('Errore ripristino dati:', e);
    }
  }

  const w = localStorage.getItem('walkRossini');
  const c = localStorage.getItem('driveCanegrate');
  const walkRossiniInput = document.getElementById('walkRossini');
  const walkCanegrateInput = document.getElementById('walkCanegrate');
  const appTitleEl = document.getElementById('appTitle');
  const dataVersionEl = document.getElementById('dataVersion');

  if (walkRossiniInput) walkRossiniInput.value = w != null ? w : CFG.defaults.walkRossini;
  if (walkCanegrateInput) walkCanegrateInput.value = c != null ? c : CFG.defaults.driveCanegrate;
  if (appTitleEl) appTitleEl.textContent = `Trasporti LIVE v${CFG.version} - ${CFG.fermata}`;
  if (dataVersionEl) dataVersionEl.textContent = `Dati aggiornati al: ${savedData ? 'IMPORT UTENTE' : CFG.lastUpdate}`;

  renderTimetable('z649', getDayType(getCurrentDate()));
  tick();
  if (!intervalId) intervalId = setInterval(tick, 1000);
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) loadingOverlay.style.display = 'none';
}

if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
  window.renderTimetable = renderTimetable;
  window.showZ649Orari = showZ649Orari;
  window.showZ627Orari = showZ627Orari;
  window.showZ644Orari = showZ644Orari;
  window.showZ625Orari = showZ625Orari;
  window.showZ647Orari = showZ647Orari;
  window.showZ642Orari = showZ642Orari;
  window.toggleUnifiedBlock = toggleUnifiedBlock;
  window.toggleDeparted = toggleDeparted;
  window.toggleCanegrate = toggleCanegrate;
  window.exportTimetables = exportTimetables;
  window.importTimetables = importTimetables;
  window.forceRefresh = () => {
    resetMinuteCache();
    tick();
    const active = document.querySelector('.tab-content.active')?.id?.replace('content-', '');
    const dt = getDayType(getCurrentDate());
    if (active === 'orari') renderTimetable('z649', dt);
    else if (LINE_CONFIG[active]) renderTimetable(active, getDefaultScheduleKey(LINE_CONFIG[active], dt));
  };
  window.setTimeTravelValue = setTimeTravelValue;
  window.clearTimeTravelValue = clearTimeTravelValue;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initSettings();
  });
}

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(r => console.log('[SW] scope:', r.scope))
      .catch(e => console.warn('[SW] errore registrazione:', e));
  });
}
