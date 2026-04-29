// ============================================================
// APP.JS — Trasporti LIVE v3.6.0
// Dipende da: data/config.js, data/z649.js, data/z627.js,
//             data/z644.js, data/z625.js, data/z647.js, data/z642.js
// ============================================================

// ── Inizializzazione ─────────────────────────────────────────
function loadData() {
  var w = localStorage.getItem('walkRossini');
  var c = localStorage.getItem('driveCanegrate');
  document.getElementById('walkRossini').value    = w != null ? w : CFG.defaults.walkRossini;
  document.getElementById('walkCanegrate').value  = c != null ? c : CFG.defaults.driveCanegrate;
  document.getElementById('dataVersion').textContent =
    'Ultimo aggiornamento: ' + CFG.lastUpdate + ' · v' + CFG.version;
  showZ647Orari('feriale_andata');
  showZ642Orari('feriale_andata');
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
function calcNextS5S6(afterMinutes) {
  var slots = [1, 16, 31, 46];
  var hour  = Math.floor(afterMinutes / 60);
  var min   = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
// Calcola il prossimo S5 da Legnano FS (slot: :03 e :33 di ogni ora)
function calcNextS5Legnano(afterMinutes) {
  var slots = [3, 33];
  var hour  = Math.floor(afterMinutes / 60);
  var min   = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
// Calcola il prossimo S5 da Parabiago FS (slot: :13 e :43 di ogni ora)
function calcNextS5Parabiago(afterMinutes) {
  var slots = [13, 43];
  var hour  = Math.floor(afterMinutes / 60);
  var min   = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
// Calcola il prossimo S5 da Busto Arsizio FS (slot: :03 e :33)
function calcNextS5BustoArsizio(afterMinutes) {
  var slots = [3, 33];
  var hour  = Math.floor(afterMinutes / 60);
  var min   = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
// Calcola il prossimo RE (Regionale Espresso) da Busto Arsizio FS (slot: :20 e :50)
function calcNextREBustoArsizio(afterMinutes) {
  var slots = [20, 50];
  var hour  = Math.floor(afterMinutes / 60);
  var min   = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
function urgencyClass(diff) {
  if (diff < 5)   return 'urgent';
  if (diff <= 15) return 'soon';
  return 'later';
}
function urgencyBadge(diff) {
  if (diff < 5)   return '<span class="badge badge-urgent">⚡ SBRIGATI</span>';
  if (diff <= 15) return '<span class="badge badge-soon">✅ Ottimo timing</span>';
  return '<span class="badge badge-later">🕐 Hai tempo</span>';
}
function valBadgeHtml(val) {
  return '<span class="badge badge-short" style="font-size:0.7rem;">' + val + '</span>';
}
function flagsHtml(flags) {
  return (flags || []).map(function(f){
    return '<span class="badge badge-short" style="font-size:0.7rem;">' + f + '</span>';
  }).join(' ');
}
function trainBadge(label) {
  return '<span class="badge badge-rapido" style="font-size:0.7rem;">🚂 ' + label + '</span>';
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

// ── Costruzione opzioni per ogni corsa Z649 ─────────────────────
function buildBusOptions(corsa) {
  var walkCanegrate = parseInt(document.getElementById('walkCanegrate').value) || CFG.defaults.driveCanegrate;
  var options = [];

  if (corsa.molino_dorino) {
    var dests1 = CFG.m1_destinations.map(function(d) {
      return { name: d.name, arrival: corsa.molino_dorino + 3 + d.minutesFromMolino };
    });
    var rep1 = dests1.find(function(d){ return d.name.indexOf('Repubblica') >= 0; });
    options.push({ type: 'molino', dests: dests1, repArrival: rep1 ? rep1.arrival : Infinity });
  }

  if (corsa.pregnana_fs) {
    var nextTrain = calcNextS5S6(corsa.pregnana_fs + 1);
    var dests2 = CFG.s5s6_destinations.map(function(d) {
      return { name: d.name, arrival: nextTrain + d.minutesFromPregnana };
    });
    var rep2 = dests2.find(function(d){ return d.name.indexOf('Repubblica') >= 0; });
    options.push({ type: 'pregnana', arrPregnana: corsa.pregnana_fs, nextTrain: nextTrain, dests: dests2, repArrival: rep2 ? rep2.arrival : Infinity });
  }

  var canArr       = corsa.rossini + walkCanegrate;
  var nextCanTrain = calcNextS5S6(canArr + 1);
  var canArrMilano = nextCanTrain + CFG.canegrate.travelToMilano;
  options.push({ type: 'canegrate', canArr: canArr, nextCanTrain: nextCanTrain, canArrMilano: canArrMilano, repArrival: canArrMilano });

  var minArr = Infinity, rapidoType = null;
  options.forEach(function(o) {
    if (o.repArrival < minArr) { minArr = o.repArrival; rapidoType = o.type; }
  });

  var html = '';
  options.forEach(function(opt) {
    var isRapido    = opt.type === rapidoType;
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

// ── Render bus blocks Z649 ───────────────────────────────────
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
    var sc5Badge   = flags.indexOf('SC5')  >= 0 ? ' <span class="badge badge-short">📚 SC5</span>'  : '';
    var lastBadge  = flags.indexOf('last') >= 0 ? ' <span class="badge badge-short">🔚 Ultima</span>' : '';
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
  var now      = new Date();
  var nowMins  = now.getHours() * 60 + now.getMinutes();
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
  var now      = new Date();
  var nowMins  = now.getHours() * 60 + now.getMinutes();
  var schedule = Z627[type] || [];
  var labels   = { feriale: 'Feriale (FR5/SC5)', sabato: 'Sabato (SAB)' };
  document.getElementById('z627DayLabel').textContent = 'Orari Z627 — ' + labels[type];
  ['Feriale','Sabato'].forEach(function(l) {
    var el = document.getElementById('z627btn' + l);
    if (el) el.classList.toggle('active', l.toLowerCase() === type);
  });
  var nextIdx = schedule.findIndex(function(c){ return c.dep >= nowMins; });
  var tbody   = document.getElementById('z627Body');
  // Intestazione con colonna coincidenza S5
  var thead = document.getElementById('z627TableHead');
  if (thead) {
    thead.innerHTML = [
      '<th>Partenza BT301<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">Via Buonarroti</span></th>',
      '<th>Arr. Legnano FS<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">LG090</span></th>',
      '<th>Coinc. ' + trainBadge('S5') + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">→ Milano</span></th>',
      '<th>Val.</th>',
      '<th>Note</th>'
    ].join('');
  }
  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;
    var noArr     = !c.arr;
    var cls       = isCurrent ? 'current-row' : (noArr ? 'short-row' : '');

    var arrCell = c.arr
      ? minsToHHMM(c.arr)
      : '<span style="color:var(--faint)">—</span>';

    // Calcolo coincidenza S5 solo se c.arr è valorizzato
    var s5Cell;
    if (c.arr != null) {
      var nextS5 = calcNextS5Legnano(c.arr + 1);
      // S5 Legnano→Cadorna: ~30 min
      var arrCadorna = nextS5 + 30;
      s5Cell = '<span style="font-size:0.82rem;">🚂 S5 ~' + minsToHHMM(nextS5) + '</span>' +
               '<br><span style="font-size:0.7rem;color:var(--muted);">Cadorna ~' + minsToHHMM(arrCadorna) + '</span>';
    } else {
      s5Cell = '<span style="color:var(--faint);font-size:0.75rem;">—</span>';
    }

    return [
      '<tr class="' + cls + '">',
      '<td>' + minsToHHMM(c.dep) + '</td>',
      '<td>' + arrCell + '</td>',
      '<td>' + s5Cell + '</td>',
      '<td>' + valBadgeHtml(c.val) + '</td>',
      '<td style="font-size:0.75rem;color:var(--faint);">' + (c.note || '') + '</td>',
      '</tr>'
    ].join('');
  }).join('');
}

// ── Tabella orari Z644 ───────────────────────────────────────
var Z644_BTN_MAP = {
  'feriale_andata':  'z644btnAndata',
  'feriale_ritorno': 'z644btnRitorno',
  'sabato_andata':   'z644btnSabAnd',
  'sabato_ritorno':  'z644btnSabRit'
};

function showZ644Orari(mode) {
  var now     = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var schedule = Z644[mode] || [];

  var labels = {
    feriale_andata:  'Feriale Andata → Parabiago',
    feriale_ritorno: 'Feriale Ritorno → Arconate',
    sabato_andata:   'Sabato Andata → Parabiago',
    sabato_ritorno:  'Sabato Ritorno → Arconate'
  };
  document.getElementById('z644DayLabel').textContent = 'Orari Z644 — ' + labels[mode];

  Object.keys(Z644_BTN_MAP).forEach(function(m) {
    var el = document.getElementById(Z644_BTN_MAP[m]);
    if (el) el.classList.toggle('active', m === mode);
  });

  var isAndata = mode.indexOf('andata') >= 0;

  var nextIdx;
  if (isAndata) {
    nextIdx = schedule.findIndex(function(c){ return c.rossini >= nowMins; });
  } else {
    nextIdx = schedule.findIndex(function(c){ return c.parabiago_prt >= nowMins; });
  }

  var thead = document.getElementById('z644TableHead');
  if (thead) {
    if (isAndata) {
      thead.innerHTML = '<th>Via Rossini 35</th><th>Parabiago FS</th><th>Coinc. ' + trainBadge('S5') + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">→ Milano</span></th><th>Val.</th><th>Note</th>';
    } else {
      thead.innerHTML = '<th>Parabiago FS</th><th>Via Rossini 35</th><th>Arconate</th><th>Val.</th><th>Note</th>';
    }
  }

  var tbody = document.getElementById('z644Body');

  if (!schedule.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);">Nessun servizio in questo periodo.</td></tr>';
    return;
  }

  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;

    if (isAndata) {
      var noFS = !c.parabiago_fs;
      var cls  = isCurrent ? 'current-row' : (noFS ? 'short-row' : '');
      var dest = c.parabiago_fs
        ? minsToHHMM(c.parabiago_fs)
        : '<span style="color:var(--faint)">Via Butti ' + (c.parabiago_vb ? minsToHHMM(c.parabiago_vb) : '—') + ' ⚠️</span>';

      // Coincidenza S5 da Parabiago FS solo se la corsa arriva in FS
      var s5Cell;
      if (c.parabiago_fs != null) {
        var nextS5pb = calcNextS5Parabiago(c.parabiago_fs + 1);
        // S5 Parabiago→Porta Garibaldi: ~25 min
        var arrPg = nextS5pb + 25;
        s5Cell = '<span style="font-size:0.82rem;">🚂 S5 ~' + minsToHHMM(nextS5pb) + '</span>' +
                 '<br><span style="font-size:0.7rem;color:var(--muted);">P.ta Garibaldi ~' + minsToHHMM(arrPg) + '</span>';
      } else {
        s5Cell = '<span style="color:var(--faint);font-size:0.75rem;">⚠️ non arriva FS</span>';
      }

      return [
        '<tr class="' + cls + '">',
        '<td>' + minsToHHMM(c.rossini) + '</td>',
        '<td>' + dest + '</td>',
        '<td>' + s5Cell + '</td>',
        '<td>' + valBadgeHtml(c.val) + '</td>',
        '<td style="font-size:0.75rem;color:var(--faint);">' + (c.note || '') + '</td>',
        '</tr>'
      ].join('');
    } else {
      var cls2  = isCurrent ? 'current-row' : '';
      var arArc = c.arconate ? minsToHHMM(c.arconate) : '<span style="color:var(--faint)">Dairago ⚠️</span>';
      return [
        '<tr class="' + cls2 + '">',
        '<td>' + minsToHHMM(c.parabiago_prt) + '</td>',
        '<td>' + minsToHHMM(c.rossini) + '</td>',
        '<td>' + arArc + '</td>',
        '<td>' + valBadgeHtml(c.val) + '</td>',
        '<td style="font-size:0.75rem;color:var(--faint);">' + (c.note || '') + '</td>',
        '</tr>'
      ].join('');
    }
  }).join('');
}

// ── Tabella orari Z625 ───────────────────────────────────────
var Z625_BTN_MAP = {
  'feriale_andata':  'z625btnFerAnd',
  'feriale_ritorno': 'z625btnFerRit',
  'sabato_andata':   'z625btnSabAnd',
  'sabato_ritorno':  'z625btnSabRit'
};

function showZ625Orari(mode) {
  var now     = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var schedule = Z625[mode] || [];

  var labels = {
    feriale_andata:  'Feriale Andata → Busto Arsizio',
    feriale_ritorno: 'Feriale Ritorno → Busto Garolfo',
    sabato_andata:   'Sabato Andata → Busto Arsizio',
    sabato_ritorno:  'Sabato Ritorno → Busto Garolfo'
  };
  document.getElementById('z625DayLabel').textContent = 'Orari Z625 — ' + labels[mode];

  Object.keys(Z625_BTN_MAP).forEach(function(m) {
    var el = document.getElementById(Z625_BTN_MAP[m]);
    if (el) el.classList.toggle('active', m === mode);
  });

  var isAndata = mode.indexOf('andata') >= 0;

  var thead = document.getElementById('z625TableHead');
  if (thead) {
    if (isAndata) {
      thead.innerHTML = [
        '<th>Partenza BT701<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">Via Curiel</span></th>',
        '<th>Arr. BA Centro</th>',
        '<th>Arr. BA FS</th>',
        '<th>Coinc. ' + trainBadge('S5') + ' / ' + trainBadge('RE') + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">→ Milano</span></th>',
        '<th>Val.</th>',
        '<th>Note</th>'
      ].join('');
    } else {
      thead.innerHTML = '<th>Partenza BA</th><th>Partenza BA FS</th><th>Arr. Busto G.</th><th>Val.</th><th>Note</th>';
    }
  }

  var tbody = document.getElementById('z625Body');

  if (!schedule.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);">Nessun servizio in questo periodo.</td></tr>';
    return;
  }

  var nextIdx;
  if (isAndata) {
    nextIdx = schedule.findIndex(function(c){
      var dep = c.dep_bg != null ? c.dep_bg : (c.arr_ba != null ? c.arr_ba - 29 : null);
      return dep != null && dep >= nowMins;
    });
  } else {
    nextIdx = schedule.findIndex(function(c){
      var dep = c.dep_ba != null ? c.dep_ba : c.dep_ba_fs;
      return dep != null && dep >= nowMins;
    });
  }

  tbody.innerHTML = schedule.map(function(c, i) {
    var isCurrent = i === nextIdx;

    if (isAndata) {
      // Calcolo coincidenze S5 + RE da Busto Arsizio FS
      var trainCell;
      if (c.arr_ba_fs != null) {
        var nextS5ba  = calcNextS5BustoArsizio(c.arr_ba_fs + 1);
        var nextREba  = calcNextREBustoArsizio(c.arr_ba_fs + 1);
        // S5 BA FS → Porta Garibaldi: ~40 min | RE → Porta Garibaldi: ~30 min
        var arrPgS5   = nextS5ba + 40;
        var arrPgRE   = nextREba + 30;
        trainCell = '<span style="font-size:0.82rem;">🚂 S5 ~' + minsToHHMM(nextS5ba) + '</span>' +
                    '<br><span style="font-size:0.7rem;color:var(--muted);">P.ta Garibaldi ~' + minsToHHMM(arrPgS5) + '</span>' +
                    '<br><span style="font-size:0.82rem;">🚄 RE ~' + minsToHHMM(nextREba) + '</span>' +
                    '<br><span style="font-size:0.7rem;color:var(--muted);">P.ta Garibaldi ~' + minsToHHMM(arrPgRE) + '</span>';
      } else {
        trainCell = '<span style="color:var(--faint);font-size:0.75rem;">⚠️ non arriva FS</span>';
      }

      var noDep  = c.dep_bg == null;
      var cls    = isCurrent ? 'current-row' : (noDep ? 'short-row' : '');

      var depCell = c.dep_bg != null
        ? minsToHHMM(c.dep_bg)
        : '<span style="color:var(--faint)">— <small>(non da BG)</small></span>';

      var baCell  = c.arr_ba != null
        ? minsToHHMM(c.arr_ba)
        : '<span style="color:var(--faint)">—</span>';

      var fsCell  = c.arr_ba_fs != null
        ? minsToHHMM(c.arr_ba_fs)
        : '<span style="color:var(--faint)">⚠️ non arriva FS</span>';

      return [
        '<tr class="' + cls + '">',
        '<td>' + depCell + '</td>',
        '<td>' + baCell  + '</td>',
        '<td>' + fsCell  + '</td>',
        '<td>' + trainCell + '</td>',
        '<td>' + valBadgeHtml(c.val) + '</td>',
        '<td style="font-size:0.75rem;color:var(--faint);">' + (c.note || '') + '</td>',
        '</tr>'
      ].join('');

    } else {
      var cls2 = isCurrent ? 'current-row' : '';

      var depBaCell   = c.dep_ba    != null ? minsToHHMM(c.dep_ba)    : '<span style="color:var(--faint)">—</span>';
      var depFsCell   = c.dep_ba_fs != null ? minsToHHMM(c.dep_ba_fs) : '<span style="color:var(--faint)">—</span>';
      var arrBgCell   = c.arr_bg    != null
        ? minsToHHMM(c.arr_bg)
        : '<span style="color:var(--faint)">⚠️ non rientra BG</span>';

      return [
        '<tr class="' + cls2 + '">',
        '<td>' + depBaCell + '</td>',
        '<td>' + depFsCell + '</td>',
        '<td>' + arrBgCell + '</td>',
        '<td>' + valBadgeHtml(c.val) + '</td>',
        '<td style="font-size:0.75rem;color:var(--faint);">' + (c.note || '') + '</td>',
        '</tr>'
      ].join('');
    }
  }).join('');
}

// ── Tabella orari Z647 ───────────────────────────────────────
// Fermate mostrate:
//   Andata: BT999_dep (BG dep) | BT949 (131-Deposito) | BT956 (91-Piscina) | AC035 (Arconate) | CT011 (Castano P.)
//   Ritorno: BT951 (90-Piscina rit.) | BT999_arr (BG arr) oppure BT205/BT775 (BG transito)
// Coincidenze: nessuna stazione ferroviaria nel percorso Z647.

var Z647_BTN_MAP = {
  'feriale_andata':  'z647btnFerAnd',
  'feriale_ritorno': 'z647btnFerRit'
};

function showZ647Orari(mode) {
  var now     = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var schedule = Z647[mode] || [];

  var labels = {
    feriale_andata:  'Feriale Andata → Castano P.',
    feriale_ritorno: 'Feriale Ritorno → Arluno/Pregnana'
  };
  document.getElementById('z647DayLabel').textContent = 'Orari Z647 — ' + (labels[mode] || mode);

  var filterBar = document.getElementById('z647FilterBar');
  if (filterBar) {
    filterBar.innerHTML = Object.keys(Z647_BTN_MAP).map(function(m) {
      var active = m === mode ? ' active' : '';
      return '<button class="filter-btn' + active + '" id="' + Z647_BTN_MAP[m] + '" onclick="showZ647Orari(\'' + m + '\')">' + labels[m] + '</button>';
    }).join('');
  }

  var isAndata = mode === 'feriale_andata';

  var subtitleEl = document.getElementById('z647Subtitle');
  if (subtitleEl) {
    subtitleEl.innerHTML = isAndata
      ? 'Busto Garolfo → Arconate → Buscate → Castano P. &nbsp;|&nbsp; <span style="color:var(--faint);">Solo periodo scolastico (SC5)</span>'
      : 'Castano P. → Arconate → Busto Garolfo → Casorezzo → Arluno &nbsp;|&nbsp; <span style="color:var(--faint);">Solo periodo scolastico (SC5)</span>';
  }

  var noteEl = document.getElementById('z647Note');
  if (noteEl) {
    noteEl.innerHTML = '⚠️ Tutte le corse sono <strong>SC5</strong>: attive solo Lun–Ven durante il periodo scolastico. Non valido 3 settimane centrali agosto e nei giorni 1 gen, 1 mag, 25 dic.' +
      ' &nbsp;|&nbsp; 🚂 <strong>Nessuna coincidenza ferroviaria disponibile</strong>: il percorso Z647 (Busto Garolfo ↔ Castano Primo) non transita per stazioni Trenord/FNM.';
  }

  var thead = document.getElementById('z647TableHead');
  var tbody = document.getElementById('z647Body');

  if (!schedule.length) {
    if (thead) thead.innerHTML = '<th colspan="6" style="text-align:center;color:var(--muted);">Nessun servizio.</th>';
    if (tbody) tbody.innerHTML = '';
    return;
  }

  if (isAndata) {
    if (thead) thead.innerHTML = [
      '<th>Corsa</th>',
      '<th>BG dep<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">Capolinea</span></th>',
      '<th>131 – Deposito</th>',
      '<th>91 – Piscina ↓</th>',
      '<th>Arconate</th>',
      '<th>Castano P.</th>',
      '<th>Val.</th>'
    ].join('');

    var nextIdx = -1;
    for (var i = 0; i < schedule.length; i++) {
      var refA = schedule[i].BT999_dep != null ? schedule[i].BT999_dep
               : schedule[i].BT956     != null ? schedule[i].BT956
               : null;
      if (refA != null && refA >= nowMins) { nextIdx = i; break; }
    }

    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls = i === nextIdx ? ' class="current-row"' : '';
      var bgDep   = c.BT999_dep != null ? minsToHHMM(c.BT999_dep) : '<span style="color:var(--faint)">—</span>';
      var dep131  = c.BT949     != null ? minsToHHMM(c.BT949)     : '<span style="color:var(--faint)">—</span>';
      var dep91   = c.BT956     != null ? minsToHHMM(c.BT956)     : '<span style="color:var(--faint)">—</span>';
      var arc     = c.AC035     != null ? minsToHHMM(c.AC035)     : '<span style="color:var(--faint)">—</span>';
      var castano = c.CT011     != null ? minsToHHMM(c.CT011)     : '<span style="color:var(--faint)">—</span>';
      var fHtml   = flagsHtml(c.flags);
      return '<tr' + cls + '><td>' + c.corsa + '</td><td>' + bgDep + '</td><td>' + dep131 + '</td><td>' + dep91 + '</td><td>' + arc + '</td><td>' + castano + '</td><td>' + fHtml + '</td></tr>';
    }).join('');

  } else {
    // Ritorno: BT951 = Per Busto A. 90-Piscina (rit.), BT999_arr = BG capolinea
    // Per le corse che transitano (non terminano a BG): BT205 o BT775 = fermata BG transito
    if (thead) thead.innerHTML = [
      '<th>Corsa</th>',
      '<th>Arconate</th>',
      '<th>90 – Piscina ↑</th>',
      '<th>BG arr<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">o transito</span></th>',
      '<th>Val.</th>'
    ].join('');

    var nextIdx2 = -1;
    for (var j = 0; j < schedule.length; j++) {
      var refR = schedule[j].BT951     != null ? schedule[j].BT951
               : schedule[j].BT999_arr != null ? schedule[j].BT999_arr
               : schedule[j].BT205     != null ? schedule[j].BT205
               : null;
      if (refR != null && refR >= nowMins) { nextIdx2 = j; break; }
    }

    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls = i === nextIdx2 ? ' class="current-row"' : '';
      var arc  = c.AC627     != null ? minsToHHMM(c.AC627)
               : c.AC625     != null ? minsToHHMM(c.AC625) : '<span style="color:var(--faint)">—</span>';
      var p90  = c.BT951     != null ? minsToHHMM(c.BT951) : '<span style="color:var(--faint)">—</span>';
      // BG: se ha BT999_arr è capolinea, altrimenti mostra BT205 (transito) con nota
      var bgArr;
      if (c.BT999_arr != null) {
        bgArr = minsToHHMM(c.BT999_arr) + ' <span style="font-size:0.7rem;color:var(--ok);">🏁 cap.</span>';
      } else if (c.BT205 != null) {
        bgArr = minsToHHMM(c.BT205) + ' <span style="font-size:0.7rem;color:var(--muted);">transito</span>';
      } else if (c.BT775 != null) {
        bgArr = minsToHHMM(c.BT775) + ' <span style="font-size:0.7rem;color:var(--muted);">transito</span>';
      } else {
        bgArr = '<span style="color:var(--faint)">—</span>';
      }
      var fHtml = flagsHtml(c.flags);
      return '<tr' + cls + '><td>' + c.corsa + '</td><td>' + arc + '</td><td>' + p90 + '</td><td>' + bgArr + '</td><td>' + fHtml + '</td></tr>';
    }).join('');
  }
}

// ── Tabella orari Z642 ───────────────────────────────────────
// Fermate mostrate (andata Magenta→Legnano):
//   BT776 = Via Giacomo Rossini / Buonarroti (1a fermata BG)
//   BT956 = Montebianco Fr.17 (ultima BG prima VC)
//   LG090 = Legnano FS S5 🚂  |  LG001 = Legnano centro
// Fermate mostrate (ritorno Legnano→Magenta):
//   BT701 = Buonarroti / Via Curiel (1a fermata BG in ritorno)
//   BT775 = fermata BG area Rossini
//   LG090 o LG112 = Legnano FS (partenza)
// Coincidenze: LG090 = Legnano FS → S5 Trenord (Milano Cadorna/Varese)

var Z642_BTN_MAP = {
  'feriale_andata':  'z642btnFerAnd',
  'feriale_ritorno': 'z642btnFerRit',
  'sabato_andata':   'z642btnSabAnd',
  'sabato_ritorno':  'z642btnSabRit'
};

function showZ642Orari(mode) {
  var now     = new Date();
  var nowMins = now.getHours() * 60 + now.getMinutes();
  var schedule = Z642[mode] || [];

  var labels = {
    feriale_andata:  'Feriale Andata → Legnano',
    feriale_ritorno: 'Feriale Ritorno → Magenta',
    sabato_andata:   'Sabato Andata → Legnano',
    sabato_ritorno:  'Sabato Ritorno → Magenta'
  };
  document.getElementById('z642DayLabel').textContent = 'Orari Z642 — ' + (labels[mode] || mode);

  var filterBar = document.getElementById('z642FilterBar');
  if (filterBar) {
    var modesAvail = ['feriale_andata','feriale_ritorno','sabato_andata','sabato_ritorno'].filter(function(m){
      return Array.isArray(Z642[m]) && Z642[m].length > 0;
    });
    filterBar.innerHTML = modesAvail.map(function(m) {
      var active = m === mode ? ' active' : '';
      return '<button class="filter-btn' + active + '" id="' + (Z642_BTN_MAP[m] || '') + '" onclick="showZ642Orari(\'' + m + '\')">' + (labels[m] || m) + '</button>';
    }).join('');
  }

  var isAndata = mode.indexOf('andata') >= 0;

  var subtitleEl = document.getElementById('z642Subtitle');
  if (subtitleEl) {
    subtitleEl.innerHTML = isAndata
      ? 'Busto Garolfo Via Buonarroti / Via Rossini → Legnano FS &nbsp;<span class="badge badge-rapido" style="font-size:0.7rem;">🚂 S5</span>'
      : 'Legnano FS → Busto Garolfo Via Buonarroti / Via Rossini → Magenta &nbsp;<span class="badge badge-rapido" style="font-size:0.7rem;">🚂 S5</span>';
  }

  var noteEl = document.getElementById('z642Note');
  if (noteEl) {
    noteEl.innerHTML = '⚠️ Legnano FS (LG090/LG112): coincidenza <strong>S5 Trenord</strong> (Milano Cadorna ↔ Varese Nord). Non valido 3 settimane centrali agosto e festività natalizie.';
  }

  var thead = document.getElementById('z642TableHead');
  var tbody = document.getElementById('z642Body');

  if (!schedule.length) {
    if (thead) thead.innerHTML = '<th colspan="6" style="text-align:center;color:var(--muted);">Nessun servizio.</th>';
    if (tbody) tbody.innerHTML = '';
    return;
  }

  if (isAndata) {
    // Colonne: Corsa | BT776 Buonarroti | BT956 Montebianco | LG090 Legnano FS 🚂 | Val.
    if (thead) thead.innerHTML = [
      '<th>Corsa</th>',
      '<th>Via Buonarroti<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">BT776</span></th>',
      '<th>Montebianco Fr.17<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">BT956</span></th>',
      '<th>Legnano FS ' + trainBadge('S5') + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">LG090/LG112</span></th>',
      '<th>Legnano Centro</th>',
      '<th>Val.</th>'
    ].join('');

    var nextIdx = -1;
    for (var i = 0; i < schedule.length; i++) {
      var refA = schedule[i].BT776 != null ? schedule[i].BT776
               : schedule[i].BT956 != null ? schedule[i].BT956 : null;
      if (refA != null && refA >= nowMins) { nextIdx = i; break; }
    }

    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls    = i === nextIdx ? ' class="current-row"' : '';
      var bt776  = c.BT776 != null ? minsToHHMM(c.BT776) : '<span style="color:var(--faint)">—</span>';
      var bt956  = c.BT956 != null ? minsToHHMM(c.BT956) : '<span style="color:var(--faint)">—</span>';
      // Legnano FS: prova LG090 poi LG112
      var lgFs, lgFsNote = '';
      if (c.LG090 != null) {
        lgFs = minsToHHMM(c.LG090);
        lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">← S5 Trenord</span>';
      } else if (c.LG112 != null) {
        lgFs = minsToHHMM(c.LG112);
        lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">← S5 Trenord</span>';
      } else {
        lgFs = '<span style="color:var(--faint)">—</span>';
      }
      // Legnano centro: LG003 o LG001
      var lgCtr = c.LG003 != null ? minsToHHMM(c.LG003)
                : c.LG001 != null ? minsToHHMM(c.LG001)
                : '<span style="color:var(--faint)">—</span>';
      var fHtml  = flagsHtml(c.flags);
      return '<tr' + cls + '><td>' + c.corsa + '</td><td>' + bt776 + '</td><td>' + bt956 + '</td><td>' + lgFs + lgFsNote + '</td><td>' + lgCtr + '</td><td>' + fHtml + '</td></tr>';
    }).join('');

  } else {
    // Ritorno: Corsa | Legnano FS (LG090/LG112) | BT701 Buonarroti (1a BG) | BT775 area Rossini | Val.
    if (thead) thead.innerHTML = [
      '<th>Corsa</th>',
      '<th>Legnano FS ' + trainBadge('S5') + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">LG090/LG112</span></th>',
      '<th>Via Buonarroti<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">BT701</span></th>',
      '<th>Area Via Rossini<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">BT775</span></th>',
      '<th>Val.</th>'
    ].join('');

    var nextIdx2 = -1;
    for (var j = 0; j < schedule.length; j++) {
      var refR = schedule[j].BT701 != null ? schedule[j].BT701
               : schedule[j].BT775 != null ? schedule[j].BT775 : null;
      if (refR != null && refR >= nowMins) { nextIdx2 = j; break; }
    }

    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls   = i === nextIdx2 ? ' class="current-row"' : '';
      // Legnano FS partenza
      var lgFs, lgFsNote = '';
      if (c.LG112 != null) {
        lgFs = minsToHHMM(c.LG112);
        lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">→ S5 Trenord</span>';
      } else if (c.LG090 != null) {
        lgFs = minsToHHMM(c.LG090);
        lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">→ S5 Trenord</span>';
      } else {
        lgFs = '<span style="color:var(--faint)">—</span>';
      }
      var bt701 = c.BT701 != null ? minsToHHMM(c.BT701) : '<span style="color:var(--faint)">—</span>';
      var bt775 = c.BT775 != null ? minsToHHMM(c.BT775) : '<span style="color:var(--faint)">—</span>';
      var fHtml = flagsHtml(c.flags);
      return '<tr' + cls + '><td>' + c.corsa + '</td><td>' + lgFs + lgFsNote + '</td><td>' + bt701 + '</td><td>' + bt775 + '</td><td>' + fHtml + '</td></tr>';
    }).join('');
  }
}

// ── Tick principale (ogni secondo) ───────────────────────────
var lastMins = -1;
function tick() {
  var now = new Date();
  var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

  document.getElementById('clock').textContent =
    String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');

  var DAYS = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  document.getElementById('dayName').textContent = DAYS[now.getDay()];
  var dt = getDayType(now);
  document.getElementById('dayType').textContent = dt.toUpperCase();

  var nowMins = h * 60 + m;
  if (nowMins === lastMins) return;
  lastMins = nowMins;

  var walkTime     = parseInt(document.getElementById('walkRossini').value) || CFG.defaults.walkRossini;
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

  var cntEl = document.getElementById('cntMins');
  cntEl.textContent = diff;
  cntEl.classList.remove('fade-in');
  void cntEl.offsetWidth;
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

  var dt = getDayType(new Date());

  if (tab === 'orari')  showZ649Orari(dt);
  if (tab === 'z627')   showZ627Orari(dt === 'sabato' ? 'sabato' : 'feriale');
  if (tab === 'z644')   showZ644Orari(dt === 'sabato' ? 'sabato_andata' : 'feriale_andata');
  if (tab === 'z625')   showZ625Orari(dt === 'sabato' ? 'sabato_andata' : 'feriale_andata');
  if (tab === 'z647')   showZ647Orari('feriale_andata');
  if (tab === 'z642')   showZ642Orari(dt === 'sabato' ? 'sabato_andata' : 'feriale_andata');
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
