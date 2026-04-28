// ============================================================
// APP.JS — Trasporti LIVE v3.1
// Dipende da: data/config.js, data/z649.js, data/z627.js
// (variabili globali CFG, Z649, Z627)
// ============================================================

// ── Inizializzazione ─────────────────────────────────────────
function loadData() {
  // I dati sono già disponibili come variabili globali (script tags)
  var w = localStorage.getItem('walkRossini');
  var c = localStorage.getItem('driveCanegrate');
  document.getElementById('walkRossini').value    = w != null ? w : CFG.defaults.walkRossini;
  document.getElementById('walkCanegrate').value  = c != null ? c : CFG.defaults.driveCanegrate;
  document.getElementById('dataVersion').textContent =
    'Ultimo aggiornamento: ' + CFG.lastUpdate + ' · v' + CFG.version;
  tick();
  setInterval(tick, 1000);
  document.getElementById('loadingOverlay').style.display = 'none';
}

// ── Utility ──────────────────────────────────────────────────
function minsToHHMM(m) {
  var h  = Math.floor(m / 60) % 24;
  var mm = m % 60;
  return String(h).padStart(2,'0') + ':' + String(mm).padStart(2,'0');
}
function getDayType(date) {
  var d = date.getDay();
  if (d === 0) return 'domenica';
  if (d === 6) return 'sabato';
  return 'feriale';
}
// Prossimo S5/S6: passano ogni 15 min ai minuti :01 :16 :31 :46
function calcNextS5S6(afterMinutes) {
  var slots = [1, 16, 31, 46];
  var hour  = Math.floor(afterMinutes / 60);
  var min   = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
function urgencyClass(diff) {
  if (diff < 5)  return 'urgent';
  if (diff <= 15) return 'soon';
  return 'later';
}
function urgencyBadge(diff) {
  if (diff < 5)   return '<span class="badge badge-urgent">⚡ SBRIGATI</span>';
  if (diff <= 15) return '<span class="badge badge-soon">✅ Ottimo timing</span>';
  return '<span class="badge badge-later">🕐 Hai tempo</span>';
}

// ── Logica prossime corse Z649 ───────────────────────────────
function getNextZ649(effectiveNow, dayType, count) {
  count = count || 4;
  var schedule = Z649[dayType] || [];
  var results  = [];
  for (var i = 0; i < schedule.length && results.length < count; i++) {
    var c = schedule[i];
    if (c.rossini > effectiveNow - 1 && c.rossini <= effectiveNow + 180) {
      results.push(c);
    }
  }
  return results;
}

// ── Costruzione opzioni per ogni corsa ───────────────────────
function buildBusOptions(corsa) {
  var walkCanegrate = parseInt(document.getElementById('walkCanegrate').value) || CFG.defaults.driveCanegrate;
  var options = [];

  // Opzione 1 — M1 via Molino Dorino
  if (corsa.molino_dorino) {
    var dests1 = CFG.m1_destinations.map(function(d) {
      return { name: d.name, arrival: corsa.molino_dorino + 3 + d.minutesFromMolino };
    });
    var rep1 = dests1.find(function(d){ return d.name.indexOf('Repubblica') >= 0; });
    options.push({ type: 'molino', dests: dests1, repArrival: rep1 ? rep1.arrival : Infinity });
  }

  // Opzione 2 — S5/S6 via Pregnana FS
  if (corsa.pregnana_fs) {
    var nextTrain = calcNextS5S6(corsa.pregnana_fs + 1);
    var dests2 = CFG.s5s6_destinations.map(function(d) {
      return { name: d.name, arrival: nextTrain + d.minutesFromPregnana };
    });
    var rep2 = dests2.find(function(d){ return d.name.indexOf('Repubblica') >= 0; });
    options.push({ type: 'pregnana', arrPregnana: corsa.pregnana_fs, nextTrain: nextTrain, dests: dests2, repArrival: rep2 ? rep2.arrival : Infinity });
  }

  // Opzione 3 — Auto fino a Canegrate FS
  var canArr       = corsa.rossini + walkCanegrate;
  var nextCanTrain = calcNextS5S6(canArr + 1);
  var canArrMilano = nextCanTrain + CFG.canegrate.travelToMilano;
  options.push({ type: 'canegrate', canArr: canArr, nextCanTrain: nextCanTrain, canArrMilano: canArrMilano, repArrival: canArrMilano });

  // Trova l'opzione più rapida per arrivare a Milano centro
  var minArr = Infinity, rapidoType = null;
  options.forEach(function(o) {
    if (o.repArrival < minArr) { minArr = o.repArrival; rapidoType = o.type; }
  });

  // Genera HTML
  var html = '';
  options.forEach(function(opt) {
    var isRapido   = opt.type === rapidoType;
    var rapidoBadge = isRapido ? ' <span class="badge badge-rapido">⚡ PIÙ RAPIDO</span>' : '';

    if (opt.type === 'molino') {
      html += '<div class="option-group">';
      html += '<div class="option-group-title">🔵 Capolinea Molino Dorino <span style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;">';
      html += '(arr. ' + minsToHHMM(corsa.molino_dorino) + ') → M1</span>' + rapidoBadge + '</div>';
      opt.dests.slice(1).forEach(function(d) {
        html += '<div class="route-line"><span class="route-arrow">└</span>';
        html += '<div class="route-info"><span class="route-dest">' + d.name + '</span>';
        html += '<div class="route-times">~' + minsToHHMM(d.arrival) + '</div></div></div>';
      });
      html += '</div>';
    }

    if (opt.type === 'pregnana') {
      html += '<div class="option-group">';
      html += '<div class="option-group-title">🔄 Scendi a Pregnana FS <span style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;">';
      html += '(arr. ' + minsToHHMM(opt.arrPregnana) + ') → S5/S6</span>' + rapidoBadge + '</div>';
      opt.dests.forEach(function(d) {
        html += '<div class="route-line"><span class="route-arrow">└</span>';
        html += '<div class="route-info"><span class="route-dest">' + d.name + '</span>';
        html += '<div class="route-times">S5/S6 ~' + minsToHHMM(opt.nextTrain) + ' → <strong>' + minsToHHMM(d.arrival) + '</strong></div></div></div>';
      });
      html += '<div class="estimate-note">⚠️ Orari S5/S6 stimati (ogni 15 min). Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>';
      html += '</div>';
    }

    if (opt.type === 'canegrate') {
      html += '<div class="option-group">';
      html += '<div class="option-group-title">🚗 Via Canegrate FS <span style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;">';
      html += '(auto ~' + walkCanegrate + ' min)</span>' + rapidoBadge + '</div>';
      html += '<div class="route-line"><span class="route-arrow">└</span>';
      html += '<div class="route-info"><span class="route-dest">🚂 Canegrate → Cadorna (Trenord)</span>';
      html += '<div class="route-times">Treno ~' + minsToHHMM(opt.nextCanTrain) + ' → <strong>Cadorna ~' + minsToHHMM(opt.canArrMilano) + '</strong></div></div></div>';
      html += '<div class="estimate-note">⚠️ Orari Canegrate stimati. Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>';
      html += '</div>';
    }
  });
  return html;
}

// ── Render bus blocks (schede corsa) ─────────────────────────
function renderBusBlocks(departures, effectiveNow) {
  var container = document.getElementById('busBlocks');
  if (!departures.length) {
    container.innerHTML = '<div style="color:var(--muted);padding:1rem;text-align:center;">Nessuna corsa nelle prossime 3 ore.</div>';
    return;
  }
  container.innerHTML = departures.map(function(c, i) {
    var diff    = c.rossini - effectiveNow;
    var isShort = !c.molino_dorino;
    var flags   = c.flags || [];
    var sc5Badge  = flags.indexOf('SC5')  >= 0 ? ' <span class="badge badge-short">📚 SC5</span>'  : '';
    var lastBadge = flags.indexOf('last') >= 0 ? ' <span class="badge badge-short">🔚 Ultima</span>' : '';
    var shortBadge = isShort ? ' <span class="badge badge-short">⚠️ Corsa breve</span>' : '';
    var bodyHtml = isShort
      ? '<div class="option-group"><div class="option-group-title" style="color:var(--muted);">⚠️ Corsa breve — termina ad Arluno, non arriva a Molino Dorino.</div><div class="estimate-note">Considera la prossima corsa completa per raggiungere Milano.</div></div>'
      : buildBusOptions(c);
    var isFirst = i === 0;
    return [
      '<div class="bus-block ' + (isFirst ? 'active' : '') + '" id="busblock-' + i + '">',
      '  <div class="bus-block-header" onclick="toggleBusBlock(' + i + ')">',
      '    <div class="bus-block-title">',
      '      <span class="bus-number">Z649</span>',
      '      <span class="bus-dep-time">' + minsToHHMM(c.rossini) + '</span>',
      '      ' + urgencyBadge(diff) + sc5Badge + lastBadge + shortBadge,
      '      <span style="font-size:0.82rem;color:var(--muted);">tra ' + diff + ' min</span>',
      '    </div>',
      '    <span class="collapse-icon">▼</span>',
      '  </div>',
      '  <div class="bus-block-body">' + bodyHtml + '</div>',
      '</div>'
    ].join('\n');
  }).join('\n');
}

function toggleBusBlock(i) {
  document.querySelectorAll('.bus-block').forEach(function(el, idx) {
    if (idx === i) el.classList.toggle('active');
    else           el.classList.remove('active');
  });
}

// ── Tabella orari Z649 ───────────────────────────────────────
function showZ649Orari(type) {
  var now     = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var schedule = (Z649[type] || []).slice().sort(function(a,b){ return a.rossini - b.rossini; });
  var labels   = { feriale: 'Feriale', sabato: 'Sabato', domenica: 'Domenica' };
  document.getElementById('orariDayLabel').textContent = 'Orari Z649 — ' + labels[type];
  ['Feriale','Sabato','Domenica'].forEach(function(l) {
    var el = document.getElementById('btn' + l);
    if (el) el.classList.toggle('active', l.toLowerCase() === type);
  });
  var nextIdx = schedule.findIndex(function(c){ return c.rossini >= nowMins; });
  var tbody = document.getElementById('orariBody');
  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;
    var isShort   = !c.molino_dorino;
    var cls       = isCurrent ? 'current-row' : (isShort ? 'short-row' : '');
    var flagHtml  = (c.flags||[]).map(function(f){
      return '<span class="badge badge-short" style="font-size:0.7rem;">' + f + '</span>';
    }).join(' ');
    return [
      '<tr class="' + cls + '">',
      '<td>' + (i + 1) + '</td>',
      '<td>' + minsToHHMM(c.rossini) + '</td>',
      '<td>' + minsToHHMM(c.pregnana_fs) + '</td>',
      '<td>' + (isShort ? '<span style="color:var(--faint)">Arluno ⚠️</span>' : minsToHHMM(c.molino_dorino)) + '</td>',
      '<td>' + (flagHtml || (isShort ? '<span class="badge badge-short">Breve</span>' : '<span style="color:var(--ok);font-size:0.75rem;">✓</span>')) + '</td>',
      '</tr>'
    ].join('');
  }).join('');
}

// ── Tabella orari Z627 ───────────────────────────────────────
function showZ627Orari(type) {
  var now     = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var schedule = Z627[type] || [];
  var labels   = { feriale: 'Feriale (FR5/SC5)', sabato: 'Sabato (SAB)' };
  document.getElementById('z627DayLabel').textContent = 'Orari Z627 — ' + labels[type];
  ['Feriale','Sabato'].forEach(function(l) {
    var el = document.getElementById('z627btn' + l);
    if (el) el.classList.toggle('active', l.toLowerCase() === type);
  });
  var nextIdx = schedule.findIndex(function(c){ return c.dep >= nowMins; });
  var tbody   = document.getElementById('z627Body');
  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;
    var isShort   = !c.arr;
    var cls       = isCurrent ? 'current-row' : (isShort ? 'short-row' : '');
    var valBadge  = '<span class="badge badge-short" style="font-size:0.7rem;">' + c.val + '</span>';
    return [
      '<tr class="' + cls + '">',
      '<td>' + minsToHHMM(c.dep) + '</td>',
      '<td>' + (c.arr ? minsToHHMM(c.arr) : '<span style="color:var(--faint)">—</span>') + '</td>',
      '<td>' + valBadge + '</td>',
      '<td style="font-size:0.75rem;color:var(--faint);">' + (c.note || '') + '</td>',
      '</tr>'
    ].join('');
  }).join('');
}

// ── Tick principale (ogni secondo) ───────────────────────────
var lastMins = -1;
function tick() {
  var now = new Date();
  var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

  // Orologio
  document.getElementById('clock').textContent =
    String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');

  var DAYS = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  document.getElementById('dayName').textContent = DAYS[now.getDay()];
  var dt = getDayType(now);
  document.getElementById('dayType').textContent = dt.toUpperCase();

  // Aggiorna i bus solo quando cambia il minuto
  var nowMins = h * 60 + m;
  if (nowMins === lastMins) return;
  lastMins = nowMins;

  var walkTime    = parseInt(document.getElementById('walkRossini').value) || CFG.defaults.walkRossini;
  var effectiveNow = nowMins + walkTime;
  var departures   = getNextZ649(effectiveNow, dt, 4);

  if (!departures.length) {
    document.getElementById('cntMins').textContent  = '--';
    document.getElementById('cntTime').textContent  = 'Nessuna corsa nelle prossime 3 ore';
    document.getElementById('cntBadge').innerHTML   = '';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('busBlocks').innerHTML  = '<div style="color:var(--muted);padding:1rem;text-align:center;">Nessuna corsa disponibile.</div>';
    document.getElementById('mainCountdown').className = 'countdown-card';
    return;
  }

  var next = departures[0];
  var diff = next.rossini - effectiveNow;
  var urg  = urgencyClass(diff);

  // Animazione numero countdown
  var cntEl = document.getElementById('cntMins');
  cntEl.textContent = diff;
  cntEl.classList.remove('fade-in');
  void cntEl.offsetWidth; // reflow
  cntEl.classList.add('fade-in');

  document.getElementById('cntTime').textContent    = 'Parte alle ' + minsToHHMM(next.rossini) + ' da Via Rossini 35';
  document.getElementById('cntBadge').innerHTML     = urgencyBadge(diff);
  document.getElementById('mainCountdown').className = 'countdown-card ' + urg;

  var progress = Math.max(0, Math.min(100, ((30 - diff) / 30) * 100));
  document.getElementById('progressFill').style.width = progress + '%';

  renderBusBlocks(departures, effectiveNow);
}

// ── Switch tab ───────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(function(el){ el.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(el){ el.classList.remove('active'); });
  var c = document.getElementById('content-' + tab);
  if (c) c.classList.add('active');
  var t = document.getElementById('tab-' + tab);
  if (t) t.classList.add('active');
  if (tab === 'orari') showZ649Orari(getDayType(new Date()));
  if (tab === 'z627') {
    var dt = getDayType(new Date());
    showZ627Orari(dt === 'sabato' ? 'sabato' : 'feriale');
  }
}

// ── Listeners impostazioni ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('walkRossini').addEventListener('change', function(e) {
    localStorage.setItem('walkRossini', e.target.value);
    lastMins = -1;
    tick();
  });
  document.getElementById('walkCanegrate').addEventListener('change', function(e) {
    localStorage.setItem('driveCanegrate', e.target.value);
  });
});
