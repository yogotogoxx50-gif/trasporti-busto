// ============================================================
// TRASPORTI LIVE v3.0 — app.js
// ============================================================

let CFG = null, Z649 = null, Z627 = null;

async function loadData() {
  const [cfg, z649, z627] = await Promise.all([
    fetch('./data/config.json').then(r => r.json()),
    fetch('./data/z649.json').then(r => r.json()),
    fetch('./data/z627.json').then(r => r.json()),
  ]);
  CFG = cfg; Z649 = z649; Z627 = z627;
  const w = localStorage.getItem('walkRossini');
  const c = localStorage.getItem('driveCanegrate');
  document.getElementById('walkRossini').value = w ?? CFG.defaults.walkRossini;
  document.getElementById('walkCanegrate').value = c ?? CFG.defaults.driveCanegrate;
  tick();
  setInterval(tick, 1000);
}

function minsToHHMM(m) {
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  return String(h).padStart(2,'0') + ':' + String(mm).padStart(2,'0');
}
function getDayType(date) {
  const d = date.getDay();
  if (d === 0) return 'domenica';
  if (d === 6) return 'sabato';
  return 'feriale';
}
function calcNextS5S6(afterMinutes) {
  const slots = [1, 16, 31, 46];
  const hour = Math.floor(afterMinutes / 60), min = afterMinutes % 60;
  for (const s of slots) if (s > min) return hour * 60 + s;
  return (hour + 1) * 60 + slots[0];
}
function urgencyClass(diff) {
  if (diff < 5) return 'urgent';
  if (diff <= 15) return 'soon';
  return 'later';
}
function urgencyBadge(diff) {
  if (diff < 5)  return '<span class="badge badge-urgent">⚡ SBRIGATI</span>';
  if (diff <= 15) return '<span class="badge badge-soon">✅ Ottimo timing</span>';
  return '<span class="badge badge-later">🕐 Hai tempo</span>';
}

function getNextZ649(effectiveNow, dayType, count) {
  count = count || 4;
  return (Z649[dayType] || [])
    .filter(function(c) { return c.rossini > effectiveNow - 1 && c.rossini <= effectiveNow + 180; })
    .slice(0, count);
}

function buildBusOptions(corsa) {
  var walkCanegrate = parseInt(document.getElementById('walkCanegrate').value || CFG.defaults.driveCanegrate);
  var options = [];

  if (corsa.molino_dorino) {
    var dests1 = CFG.m1_destinations.map(function(d) {
      return Object.assign({}, d, { arrival: corsa.molino_dorino + 3 + d.minutesFromMolino });
    });
    var rep1 = dests1.find(function(d){ return d.id==='repubblica'; });
    options.push({ type: 'molino', dests: dests1, repArrival: rep1 ? rep1.arrival : Infinity });
  }

  if (corsa.pregnana_fs) {
    var nextTrain = calcNextS5S6(corsa.pregnana_fs + 1);
    var dests2 = CFG.s5s6_destinations.map(function(d) {
      return Object.assign({}, d, { arrival: nextTrain + d.minutesFromPregnana });
    });
    var rep2 = dests2.find(function(d){ return d.name.indexOf('Repubblica') >= 0; });
    options.push({ type: 'pregnana', arrPregnana: corsa.pregnana_fs, nextTrain: nextTrain, dests: dests2, repArrival: rep2 ? rep2.arrival : Infinity });
  }

  var canArr = corsa.rossini + walkCanegrate;
  var nextCanTrain = calcNextS5S6(canArr + 1);
  var canArrMilano = nextCanTrain + CFG.canegrate.travelToMilano;
  options.push({ type: 'canegrate', canArr: canArr, nextCanTrain: nextCanTrain, canArrMilano: canArrMilano });

  var rapidoType = null, minArr = Infinity;
  options.forEach(function(o) {
    var arr = o.repArrival !== undefined ? o.repArrival : (o.canArrMilano || Infinity);
    if (arr < minArr) { minArr = arr; rapidoType = o.type; }
  });

  var html = '';
  options.forEach(function(opt) {
    var isRapido = opt.type === rapidoType;
    var rapidoBadge = isRapido ? '<span class="badge badge-rapido">⚡ PIÙ RAPIDO</span>' : '';
    if (opt.type === 'molino') {
      html += '<div class="option-group"><div class="option-group-title">🔵 Capolinea Molino Dorino <span style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;">(arr. ' + minsToHHMM(corsa.molino_dorino) + ') → M1</span> ' + rapidoBadge + '</div>';
      opt.dests.slice(1).forEach(function(d) {
        html += '<div class="route-line"><span class="route-arrow">└</span><div class="route-info"><span class="route-dest">' + d.name + '</span><div class="route-times">~' + minsToHHMM(d.arrival) + ' <span style="color:var(--faint)">(+' + (d.minutesFromMolino+3) + ' min dalla metro)</span></div></div></div>';
      });
      html += '</div>';
    }
    if (opt.type === 'pregnana') {
      html += '<div class="option-group"><div class="option-group-title">🔄 Scendi a Pregnana FS <span style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;">(arr. ' + minsToHHMM(opt.arrPregnana) + ') → S5/S6</span> ' + rapidoBadge + '</div>';
      opt.dests.forEach(function(d) {
        html += '<div class="route-line"><span class="route-arrow">└</span><div class="route-info"><span class="route-dest">' + d.name + '</span><div class="route-times">S5/S6 ~' + minsToHHMM(opt.nextTrain) + ' → <strong>' + minsToHHMM(d.arrival) + '</strong></div></div></div>';
      });
      html += '<div class="estimate-note">⚠️ Orari S5/S6 stimati. Verificare su Trenord.it.</div></div>';
    }
    if (opt.type === 'canegrate') {
      html += '<div class="option-group"><div class="option-group-title">🚗 Via Canegrate FS <span style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;">(auto ~' + walkCanegrate + ' min)</span> ' + rapidoBadge + '</div><div class="route-line"><span class="route-arrow">└</span><div class="route-info"><span class="route-dest">🚂 Trenord Canegrate → Cadorna</span><div class="route-times">Treno ~' + minsToHHMM(opt.nextCanTrain) + ' → <strong>Cadorna ~' + minsToHHMM(opt.canArrMilano) + '</strong></div></div></div><div class="estimate-note">⚠️ Orari Canegrate stimati. Verificare su Trenord.it.</div></div>';
    }
  });
  return html;
}

function renderBusBlocks(departures, effectiveNow) {
  var container = document.getElementById('busBlocks');
  if (!departures.length) {
    container.innerHTML = '<div style="color:var(--muted);padding:1rem;text-align:center;">Nessuna corsa nelle prossime 3 ore.</div>';
    return;
  }
  container.innerHTML = departures.map(function(c, i) {
    var diff = c.rossini - effectiveNow;
    var isShort = !c.molino_dorino;
    var flags = c.flags || [];
    var sc5 = flags.indexOf('SC5') >= 0 ? '<span class="badge badge-short">📚 SC5</span>' : '';
    var lastB = flags.indexOf('last') >= 0 ? '<span class="badge badge-short">🔚 Ultima</span>' : '';
    var bodyHtml = isShort
      ? '<div class="option-group"><div class="option-group-title" style="color:var(--muted);">⚠️ Corsa breve — termina ad Arluno, non arriva a Molino Dorino.</div><div class="estimate-note">Considera la prossima corsa completa per raggiungere Milano.</div></div>'
      : buildBusOptions(c);
    return '<div class="bus-block ' + (i===0?'active':'') + '" id="busblock-' + i + '"><div class="bus-block-header" onclick="toggleBusBlock(' + i + ')"><div class="bus-block-title"><span class="bus-number">Z649</span><span class="bus-dep-time">' + minsToHHMM(c.rossini) + '</span>' + urgencyBadge(diff) + ' ' + sc5 + ' ' + lastB + (isShort ? ' <span class="badge badge-short">⚠️ Corsa breve</span>' : '') + ' <span style="font-size:0.82rem;color:var(--muted);">tra ' + diff + ' min</span></div><span class="collapse-icon">▼</span></div><div class="bus-block-body">' + bodyHtml + '</div></div>';
  }).join('');
}

function toggleBusBlock(i) {
  document.querySelectorAll('.bus-block').forEach(function(el, idx) {
    if (idx === i) el.classList.toggle('active');
    else el.classList.remove('active');
  });
}

function showZ627Orari(type) {
  var schedule = Z627[type] || [];
  var now = new Date();
  var nowMins = now.getHours()*60+now.getMinutes();
  var tbody = document.getElementById('z627Body');
  var labels = { feriale:'Feriale (FR5/SC5)', sabato:'Sabato (SAB)' };
  document.getElementById('z627DayLabel').textContent = 'Orari Z627 — ' + labels[type];
  ['Feriale','Sabato'].forEach(function(l) {
    var el = document.getElementById('z627btn'+l);
    if (el) el.classList.toggle('active', l.toLowerCase()===type);
  });
  var nextIdx = schedule.findIndex(function(c){ return c.dep > nowMins - 1; });
  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;
    var isShort = !c.arr;
    var cls = isCurrent ? 'current-row' : (isShort ? 'short-row' : '');
    var valBadge = c.val === 'SC5' ? '<span class="badge badge-short" style="font-size:0.7rem;">SC5</span>' : '';
    return '<tr class="' + cls + '"><td>' + minsToHHMM(c.dep) + '</td><td>' + (c.arr ? minsToHHMM(c.arr) : '<span style="color:var(--faint)">—</span>') + '</td><td>' + valBadge + '</td><td style="font-size:0.75rem;color:var(--faint);">' + (c.note||'') + '</td></tr>';
  }).join('');
}

function showZ649Orari(type) {
  var now = new Date();
  var nowMins = now.getHours()*60+now.getMinutes();
  var schedule = Z649[type] || [];
  var labels = { feriale:'Feriale', sabato:'Sabato', domenica:'Domenica' };
  document.getElementById('orariDayLabel').textContent = 'Orari Z649 — ' + labels[type];
  ['Feriale','Sabato','Domenica'].forEach(function(l) {
    var el = document.getElementById('btn'+l);
    if (el) el.classList.toggle('active', l.toLowerCase()===type);
  });
  var nextIdx = schedule.findIndex(function(c){ return c.rossini > nowMins - 1; });
  var tbody = document.getElementById('orariBody');
  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;
    var isShort = !c.molino_dorino;
    var cls = isCurrent ? 'current-row' : (isShort ? 'short-row' : '');
    var flags = (c.flags||[]).map(function(f){ return '<span class="badge badge-short" style="font-size:0.7rem;">' + f + '</span>'; }).join(' ');
    return '<tr class="' + cls + '"><td>' + (i+1) + '</td><td>' + minsToHHMM(c.rossini) + '</td><td>' + minsToHHMM(c.pregnana_fs) + '</td><td>' + (isShort ? '<span style="color:var(--faint)">Arluno ⚠️</span>' : minsToHHMM(c.molino_dorino)) + '</td><td>' + (flags || (isShort ? '<span class="badge badge-short">Breve</span>' : '<span style="color:var(--ok);font-size:0.75rem;">✓</span>')) + '</td></tr>';
  }).join('');
}

var lastMins = -1;
function tick() {
  var now = new Date();
  var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  document.getElementById('clock').textContent =
    String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  var DAYS = ['Domenica','Luned\u00ec','Marted\u00ec','Mercoled\u00ec','Gioved\u00ec','Venerd\u00ec','Sabato'];
  document.getElementById('dayName').textContent = DAYS[now.getDay()];
  var dt = getDayType(now);
  document.getElementById('dayType').textContent = dt.toUpperCase();
  if (!Z649) return;
  var nowMins = h*60+m;
  if (nowMins === lastMins) return;
  lastMins = nowMins;
  var walkTime = parseInt(document.getElementById('walkRossini').value || CFG.defaults.walkRossini);
  var effectiveNow = nowMins + walkTime;
  var departures = getNextZ649(effectiveNow, dt, 4);
  if (!departures.length) {
    document.getElementById('cntMins').textContent = '--';
    document.getElementById('cntTime').textContent = 'Nessuna corsa nelle prossime 3 ore';
    document.getElementById('cntBadge').innerHTML = '';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('busBlocks').innerHTML = '<div style="color:var(--muted);padding:1rem;text-align:center;">Nessuna corsa disponibile.</div>';
    return;
  }
  var next = departures[0];
  var diff = next.rossini - effectiveNow;
  var urg = urgencyClass(diff);
  var cntEl = document.getElementById('cntMins');
  cntEl.textContent = diff;
  cntEl.classList.remove('fade-in'); void cntEl.offsetWidth; cntEl.classList.add('fade-in');
  document.getElementById('cntTime').textContent = 'Parte alle ' + minsToHHMM(next.rossini) + ' da Via Rossini 35';
  document.getElementById('cntBadge').innerHTML = urgencyBadge(diff);
  document.getElementById('mainCountdown').className = 'countdown-card ' + urg;
  var progress = Math.max(0, Math.min(100, ((30-diff)/30)*100));
  document.getElementById('progressFill').style.width = progress + '%';
  renderBusBlocks(departures, effectiveNow);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(function(el){ el.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(el){ el.classList.remove('active'); });
  var c = document.getElementById('content-'+tab);
  if (c) c.classList.add('active');
  var t = document.getElementById('tab-'+tab);
  if (t) t.classList.add('active');
  if (tab === 'orari') showZ649Orari(getDayType(new Date()));
  if (tab === 'z627') {
    var dt = getDayType(new Date());
    showZ627Orari(dt === 'sabato' ? 'sabato' : 'feriale');
  }
}

document.getElementById('walkRossini').addEventListener('change', function(e) {
  localStorage.setItem('walkRossini', e.target.value); lastMins = -1; tick();
});
document.getElementById('walkCanegrate').addEventListener('change', function(e) {
  localStorage.setItem('driveCanegrate', e.target.value);
});
