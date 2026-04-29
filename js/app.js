// ============================================================
// APP.JS — Trasporti LIVE v3.6.1
// Dipende da: data/config.js, data/z649.js, data/z627.js,
//             data/z644.js, data/z625.js, data/z647.js, data/z642.js
// ============================================================

// ── Inizializzazione ─────────────────────────────────────────
function loadData() {
  var w = localStorage.getItem('walkRossini');
  var c = localStorage.getItem('driveCanegrate');
  document.getElementById('walkRossini').value    = w != null ? w : CFG.defaults.walkRossini;
  document.getElementById('walkCanegrate').value  = c != null ? c : CFG.defaults.driveCanegrate;
  document.getElementById('appTitle').textContent =
    'Trasporti LIVE v' + CFG.version + ' — ' + CFG.fermata;
  document.getElementById('dataVersion').textContent =
    'Dati aggiornati al: ' + CFG.lastUpdate;
  showZ647Orari('feriale_andata');
  showZ642Orari('feriale_andata');
  tick();
  setInterval(tick, 1000);
  document.getElementById('loadingOverlay').style.display = 'none';
}

// ── Utility ──────────────────────────────────────────────────
function minsToHHMM(m) {
  // No % 24: times past midnight show as 24:xx, not 00:xx
  var h  = Math.floor(m / 60);
  var mm = m % 60;
  return String(h).padStart(2,'0') + ':' + String(mm).padStart(2,'0');
}
function getDayType(date) {
  // Use local date string (YYYY-MM-DD) to avoid UTC midnight shift
  var y   = date.getFullYear();
  var mo  = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  var iso = y + '-' + mo + '-' + day;
  if (CFG.holidays && CFG.holidays.indexOf(iso) >= 0) return 'domenica';
  var d = date.getDay();
  if (d === 0) return 'domenica';
  if (d === 6) return 'sabato';
  return 'feriale';
}
// ── Utility: calcolo prossimo treno (generica) ─────────────────
// slots = minuti dentro l'ora in cui il treno parte (es. [1,16,31,46])
function calcNextTrain(afterMinutes, slots) {
  var hour = Math.floor(afterMinutes / 60);
  var min  = afterMinutes % 60;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}
var SLOTS_S5S6       = [1, 16, 31, 46];
var SLOTS_S5_LEGNANO = [3, 33];
var SLOTS_S5_PARABI  = [13, 43];
var SLOTS_S5_BUSTO   = [3, 33];
var SLOTS_RE_BUSTO   = [20, 50];
function calcNextS5S6(a)           { return calcNextTrain(a, SLOTS_S5S6); }
function calcNextS5Legnano(a)      { return calcNextTrain(a, SLOTS_S5_LEGNANO); }
function calcNextS5Parabiago(a)    { return calcNextTrain(a, SLOTS_S5_PARABI); }
function calcNextS5BustoArsizio(a) { return calcNextTrain(a, SLOTS_S5_BUSTO); }
function calcNextREBustoArsizio(a) { return calcNextTrain(a, SLOTS_RE_BUSTO); }

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
// La card è visibile solo finché effectiveNow < c.rossini (orario partenza da Via Rossini).
// Appena l'orario di partenza è raggiunto o superato, la card scompare.
function getNextZ649(effectiveNow, dayType, count) {
  count = count || 4;
  var schedule = Z649[dayType] || [];
  var results  = [];
  for (var i = 0; i < schedule.length && results.length < count; i++) {
    var c = schedule[i];
    // Mostra solo corse non ancora partite da Via Rossini
    if (c.rossini > effectiveNow && c.rossini <= effectiveNow + 180) {
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
      html += '<div class="option-group-title">🔄 Scendi a Pregnana FS <span class="opt-detail">';
      html += '(arr. ' + minsToHHMM(opt.arrPregnana) + ') → S5/S6 ~' + minsToHHMM(opt.nextTrain) + '</span>' + rapidoBadge + '</div>';
      opt.dests.forEach(function(d) {
        html += '<div class="route-line"><span class="route-arrow">└</span>';
        html += '<div class="route-info"><span class="route-dest">' + d.name + '</span>';
        html += '<div class="route-times">~' + minsToHHMM(d.arrival) + '</div></div></div>';
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
function renderUnifiedLive(allUpcoming, allDeparted, effectiveNow) {
  var container = document.getElementById('unifiedBusBlocks');
  if (container) {
    if (!allUpcoming.length) {
      container.innerHTML = '<div style="color:var(--muted);padding:1rem;text-align:center;">Nessuna corsa imminente.</div>';
    } else {
      container.innerHTML = allUpcoming.map(function(item, i) {
        var c = item.data;
        var line = item.line;
        var diff = item.dep - effectiveNow;
        var isShort = false;
        var badgesHtml = '';
        var bodyHtml = '';
        var noteHtml = c.note ? ' <span style="font-size:0.78rem;color:var(--faint);">' + c.note + '</span>' : '';
        
        if (line === 'z649') {
          isShort = !c.molino_dorino;
          var sc5Badge   = (c.flags && c.flags.indexOf('SC5') >= 0) ? ' <span class="badge badge-short">📚 SC5</span>' : '';
          var lastBadge  = (c.flags && c.flags.indexOf('last') >= 0) ? ' <span class="badge badge-short">🔚 Ultima</span>' : '';
          var shortBadge = isShort ? ' <span class="badge badge-short">⚠️ Corsa breve</span>' : '';
          badgesHtml = '<div class="bus-block-badges">' + sc5Badge + lastBadge + shortBadge + '</div>';
          
          bodyHtml = isShort
            ? '<div class="option-group"><div class="option-group-title" style="color:var(--muted);">⚠️ Corsa breve — termina ad Arluno, non arriva a Molino Dorino.</div><div class="estimate-note">Considera la prossima corsa completa per raggiungere Milano.</div></div>'
            : buildBusOptions(c);
        } else {
          isShort = !c.arrMins;
          var sc5Badge = (c.val === 'SC5') ? ' <span class="badge badge-short">📚 SC5</span>' : '';
          var shortBadge = isShort ? ' <span class="badge badge-short">⚠️ Corsa breve</span>' : '';
          badgesHtml = '<div class="bus-block-badges">' + sc5Badge + shortBadge + '</div>';
          
          if (line === 'z627') bodyHtml = buildZ627Options(c);
          if (line === 'z644') bodyHtml = buildZ644Options(c);
          if (line === 'z625') bodyHtml = buildZ625Options(c);
        }

        return [
          '<div class="bus-block" id="unifiedblock-' + i + '">',
          '  <div class="bus-block-header" onclick="toggleUnifiedBlock(' + i + ')">',
          '    <div class="bus-block-title">',
          '      <span class="bus-number">' + item.label + '</span>',
          '      <span class="bus-dep-time">' + minsToHHMM(item.dep) + '</span>',
          '      ' + urgencyBadge(Math.max(diff, 0)),
          '      <span class="bus-block-diff">tra ' + diff + ' min</span>',
          '      ' + noteHtml,
          '    </div>',
          '    ' + badgesHtml,
          '    <span class="collapse-icon">▼</span>',
          '  </div>',
          '  <div class="bus-block-body">' + bodyHtml + '</div>',
          '</div>'
        ].join('\n');
      }).join('\n');
    }
  }

  var deptSection = document.getElementById('departedSection');
  var deptBlocks  = document.getElementById('departedBlocks');
  if (!deptSection || !deptBlocks) return;

  if (!allDeparted.length) {
    deptSection.style.display = 'none';
    return;
  }
  
  deptSection.style.display = 'block';
  deptBlocks.innerHTML = allDeparted.map(function(item) {
    var c = item.data;
    var minsAgo = effectiveNow - item.dep;
    var isShort = (item.line === 'z649') ? !c.molino_dorino : !c.arrMins;
    
    return [
      '<div class="bus-block">',
      '  <div class="bus-block-header" style="cursor:default;">',
      '    <div class="bus-block-title">',
      '      <span class="bus-number">' + item.label + '</span>',
      '      <span class="bus-dep-time">' + minsToHHMM(item.dep) + '</span>',
      '      <span class="badge badge-short">🕐 partito ' + minsAgo + ' min fa</span>',
      (isShort ? '      <span class="badge badge-short">⚠️ Corsa breve</span>' : ''),
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }).join('\n');
}

function toggleUnifiedBlock(i) {
  document.querySelectorAll('#unifiedBusBlocks .bus-block').forEach(function(el, idx) {
    if (idx === i) el.classList.toggle('active');
    else           el.classList.remove('active');
  });
}

function toggleDeparted() {
  var blocks  = document.getElementById('departedBlocks');
  var toggle  = document.getElementById('departedToggle');
  if (!blocks) return;
  var isOpen = blocks.style.display !== 'none';
  blocks.style.display  = isOpen ? 'none'  : 'block';
  if (toggle) toggle.classList.toggle('open', !isOpen);
}

// ── Logica prossime corse altri bus (Z627/Z644/Z625) per tab LIVE ───
// depMins  = orario di partenza (da via Rossini o fermata più vicina)
// arrMins  = orario di arrivo alla stazione FS (usato come scadenza card)
function getNextBusLive(line, nowMins, dayType, count) {
  count = count || 3;
  var results = [];

  if (line === 'z627') {
    var key = dayType === 'sabato' ? 'sabato' : 'feriale';
    var sched = Z627[key] || [];
    for (var i = 0; i < sched.length && results.length < count; i++) {
      var c = sched[i];
      var exp = c.arr != null ? c.arr : c.dep + 25;
      if (c.dep <= nowMins + 180 && exp > nowMins) {
        results.push({ depMins: c.dep, arrMins: c.arr, val: c.val, note: c.note || '' });
      }
    }
  }

  if (line === 'z644') {
    var key644 = dayType === 'sabato' ? 'sabato_andata' : 'feriale_andata';
    var sched644 = Z644[key644] || [];
    for (var j = 0; j < sched644.length && results.length < count; j++) {
      var c644 = sched644[j];
      var exp644 = c644.parabiago_fs != null ? c644.parabiago_fs : (c644.parabiago_vb != null ? c644.parabiago_vb : c644.rossini + 25);
      if (c644.rossini <= nowMins + 180 && exp644 > nowMins) {
        results.push({ depMins: c644.rossini, arrMins: c644.parabiago_fs, val: c644.val, note: c644.parabiago_fs == null ? '⚠️ Non arriva FS' : '' });
      }
    }
  }

  if (line === 'z625') {
    var key625 = dayType === 'sabato' ? 'sabato_andata' : 'feriale_andata';
    var sched625 = Z625[key625] || [];
    for (var k = 0; k < sched625.length && results.length < count; k++) {
      var c625 = sched625[k];
      var dep625 = c625.dep_bg != null ? c625.dep_bg : null;
      if (dep625 == null) continue;
      var exp625 = c625.arr_ba_fs != null ? c625.arr_ba_fs : (c625.arr_ba != null ? c625.arr_ba : dep625 + 35);
      if (dep625 <= nowMins + 180 && exp625 > nowMins) {
        results.push({ depMins: dep625, arrMins: c625.arr_ba_fs, val: c625.val, note: c625.arr_ba_fs == null ? '⚠️ Non arriva FS' : '' });
      }
    }
  }

  return results;
}

// ── Costruzione body bus-block per Z627 ────────────────────────
function buildZ627Options(corsa) {
  if (!corsa.arrMins) {
    return '<div class="option-group"><div class="option-group-title" style="color:var(--muted);">⚠️ Corsa breve — non arriva a Legnano FS.</div><div class="estimate-note">Nessuna coincidenza ferroviaria disponibile.</div></div>';
  }
  var s5 = calcNextS5Legnano(corsa.arrMins + 1);
  var html = '<div class="option-group">';
  html += '<div class="option-group-title">🔵 Scendi a Legnano FS <span class="opt-detail">(arr. ~' + minsToHHMM(corsa.arrMins) + ') → S5</span></div>';
  html += '<div class="route-line"><span class="route-arrow">└</span>';
  html += '<div class="route-info"><span class="route-dest">🚂 S5 Legnano → Cadorna</span>';
  html += '<div class="route-times">S5 ~' + minsToHHMM(s5) + ' → <strong>Cadorna ~' + minsToHHMM(s5 + 30) + '</strong></div></div></div>';
  html += '<div class="estimate-note">⚠️ Orari S5 stimati (ogni 30 min). Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>';
  html += '</div>';
  return html;
}

// ── Costruzione body bus-block per Z644 ────────────────────────
function buildZ644Options(corsa) {
  if (!corsa.arrMins) {
    return '<div class="option-group"><div class="option-group-title" style="color:var(--muted);">⚠️ Corsa breve — termina a Via Butti, non arriva alla FS.</div><div class="estimate-note">Nessuna coincidenza ferroviaria disponibile.</div></div>';
  }
  var s5 = calcNextS5Parabiago(corsa.arrMins + 1);
  var html = '<div class="option-group">';
  html += '<div class="option-group-title">🔵 Scendi a Parabiago FS <span class="opt-detail">(arr. ~' + minsToHHMM(corsa.arrMins) + ') → S5</span></div>';
  html += '<div class="route-line"><span class="route-arrow">└</span>';
  html += '<div class="route-info"><span class="route-dest">🚂 S5 Parabiago → P.ta Garibaldi</span>';
  html += '<div class="route-times">S5 ~' + minsToHHMM(s5) + ' → <strong>P.ta Garibaldi ~' + minsToHHMM(s5 + 25) + '</strong></div></div></div>';
  html += '<div class="estimate-note">⚠️ Orari S5 stimati (ogni 30 min). Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>';
  html += '</div>';
  return html;
}

// ── Costruzione body bus-block per Z625 ────────────────────────
function buildZ625Options(corsa) {
  if (!corsa.arrMins) {
    return '<div class="option-group"><div class="option-group-title" style="color:var(--muted);">⚠️ Non arriva a Busto Arsizio FS.</div><div class="estimate-note">Nessuna coincidenza ferroviaria disponibile.</div></div>';
  }
  var s5 = calcNextS5BustoArsizio(corsa.arrMins + 1);
  var re = calcNextREBustoArsizio(corsa.arrMins + 1);
  var html = '<div class="option-group">';
  html += '<div class="option-group-title">🔵 Scendi a Busto Arsizio FS <span class="opt-detail">(arr. ~' + minsToHHMM(corsa.arrMins) + ') → S5 / RE</span></div>';
  html += '<div class="route-line"><span class="route-arrow">└</span>';
  html += '<div class="route-info"><span class="route-dest">🚂 S5 → P.ta Garibaldi</span>';
  html += '<div class="route-times">S5 ~' + minsToHHMM(s5) + ' → <strong>P.ta Garibaldi ~' + minsToHHMM(s5 + 40) + '</strong></div></div></div>';
  html += '<div class="route-line"><span class="route-arrow">└</span>';
  html += '<div class="route-info"><span class="route-dest">🚄 RE → P.ta Garibaldi</span>';
  html += '<div class="route-times">RE ~' + minsToHHMM(re) + ' → <strong>P.ta Garibaldi ~' + minsToHHMM(re + 30) + '</strong></div></div></div>';
  html += '<div class="estimate-note">⚠️ Orari stimati. Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>.</div>';
  html += '</div>';
  return html;
}

// ── Render bus-block singolo (Z627/Z644/Z625) ────────────────────
function renderCanegrateBlock(nowMins) {
  var container = document.getElementById('canegrateBlock');
  if (!container) return;
  var walkCanegrate = parseInt(document.getElementById('walkCanegrate').value) || CFG.defaults.driveCanegrate;
  var canArr        = nowMins + walkCanegrate;
  var t1            = calcNextS5S6(canArr + 1);
  var t2            = calcNextS5S6(t1 + 1);
  var html = '';
  html += '<div class="option-group" style="margin-top:0;">';
  html += '<div class="option-group-title" style="border-top:none;">🚗 Partenza in auto adesso → Canegrate FS (arr. ~' + minsToHHMM(canArr) + ')</div>';
  html += '<div class="route-line"><span class="route-arrow">└</span>';
  html += '<div class="route-info"><span class="route-dest">🚂 1° treno — Canegrate → Cadorna</span>';
  html += '<div class="route-times">S5/S6 ~' + minsToHHMM(t1) + ' → <strong>Cadorna ~' + minsToHHMM(t1 + CFG.canegrate.travelToMilano) + '</strong></div></div></div>';
  html += '<div class="route-line"><span class="route-arrow">└</span>';
  html += '<div class="route-info"><span class="route-dest">🚂 2° treno — Canegrate → Cadorna</span>';
  html += '<div class="route-times">S5/S6 ~' + minsToHHMM(t2) + ' → <strong>Cadorna ~' + minsToHHMM(t2 + CFG.canegrate.travelToMilano) + '</strong></div></div></div>';
  html += '<div class="estimate-note">⚠️ Orari stimati (S5/S6 ogni ~15 min). Verificare su <a href="https://www.trenord.it" target="_blank">Trenord.it</a>. <span class="badge badge-short" style="font-size:0.7rem;">🚗 Indipendente dal bus</span></div>';
  html += '</div>';
  container.innerHTML = html;
}

// ── Render prossime coincidenze treno (tab LIVE) ─────────────────
function renderTrainConnections() {
  // noop: sostituito da renderOtherBuses()
}

// ── Render tutti i bus nel tab LIVE ─────────────────────────────
function renderOtherBuses(nowMins, dayType) {
  var noServiceEl = document.getElementById('otherBusesNoService');
  if (noServiceEl) {
    noServiceEl.style.display = dayType === 'domenica' ? 'block' : 'none';
  }

  var z627deps = dayType !== 'domenica' ? getNextBusLive('z627', nowMins, dayType, 3) : [];
  var z644deps = dayType !== 'domenica' ? getNextBusLive('z644', nowMins, dayType, 3) : [];
  var z625deps = dayType !== 'domenica' ? getNextBusLive('z625', nowMins, dayType, 3) : [];

  renderOtherBusBlocks('z627LiveBlocks', 'z627', 'Z627', z627deps, nowMins, buildZ627Options);
  renderOtherBusBlocks('z644LiveBlocks', 'z644', 'Z644', z644deps, nowMins, buildZ644Options);
  renderOtherBusBlocks('z625LiveBlocks', 'z625', 'Z625', z625deps, nowMins, buildZ625Options);

  renderCanegrateBlock(nowMins);
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
  if (type === 'domenica') {
    document.getElementById('z627DayLabel').textContent = 'Orari Z627 — Domenica / Festivi';
    ['z627btnFeriale','z627btnSabato'].forEach(function(id){ var el=document.getElementById(id); if(el) el.classList.remove('active'); });
    var tb627 = document.getElementById('z627Body');
    if (tb627) tb627.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--muted);">🚫 Nessun servizio domenica e festivi.</td></tr>';
    return;
  }
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
    var arrCell   = c.arr ? minsToHHMM(c.arr) : '<span style="color:var(--faint)">—</span>';
    var s5Cell;
    if (c.arr != null) {
      var nextS5 = calcNextS5Legnano(c.arr + 1);
      s5Cell = '<span style="font-size:0.82rem;">🚂 S5 ~' + minsToHHMM(nextS5) + '</span>' +
               '<br><span style="font-size:0.7rem;color:var(--muted);">Cadorna ~' + minsToHHMM(nextS5 + 30) + '</span>';
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
  if (mode === 'domenica') {
    document.getElementById('z644DayLabel').textContent = 'Orari Z644 — Domenica / Festivi';
    Object.keys(Z644_BTN_MAP).forEach(function(m){ var el=document.getElementById(Z644_BTN_MAP[m]); if(el) el.classList.remove('active'); });
    var tb644 = document.getElementById('z644Body');
    if (tb644) tb644.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--muted);">🚫 Nessun servizio domenica e festivi.</td></tr>';
    return;
  }
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
      var s5Cell;
      if (c.parabiago_fs != null) {
        var nextS5pb = calcNextS5Parabiago(c.parabiago_fs + 1);
        s5Cell = '<span style="font-size:0.82rem;">🚂 S5 ~' + minsToHHMM(nextS5pb) + '</span>' +
                 '<br><span style="font-size:0.7rem;color:var(--muted);">P.ta Garibaldi ~' + minsToHHMM(nextS5pb + 25) + '</span>';
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
  if (mode === 'domenica') {
    document.getElementById('z625DayLabel').textContent = 'Orari Z625 — Domenica / Festivi';
    Object.keys(Z625_BTN_MAP).forEach(function(m){ var el=document.getElementById(Z625_BTN_MAP[m]); if(el) el.classList.remove('active'); });
    var tb625 = document.getElementById('z625Body');
    if (tb625) tb625.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--muted);">🚫 Nessun servizio domenica e festivi.</td></tr>';
    return;
  }
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
      var trainCell;
      if (c.arr_ba_fs != null) {
        var nextS5ba = calcNextS5BustoArsizio(c.arr_ba_fs + 1);
        var nextREba = calcNextREBustoArsizio(c.arr_ba_fs + 1);
        trainCell = '<span style="font-size:0.82rem;">🚂 S5 ~' + minsToHHMM(nextS5ba) + '</span>' +
                    '<br><span style="font-size:0.7rem;color:var(--muted);">P.ta Garibaldi ~' + minsToHHMM(nextS5ba + 40) + '</span>' +
                    '<br><span style="font-size:0.82rem;">🚄 RE ~' + minsToHHMM(nextREba) + '</span>' +
                    '<br><span style="font-size:0.7rem;color:var(--muted);">P.ta Garibaldi ~' + minsToHHMM(nextREba + 30) + '</span>';
      } else {
        trainCell = '<span style="color:var(--faint);font-size:0.75rem;">⚠️ non arriva FS</span>';
      }
      var noDep  = c.dep_bg == null;
      var cls    = isCurrent ? 'current-row' : (noDep ? 'short-row' : '');
      var depCell = c.dep_bg != null ? minsToHHMM(c.dep_bg) : '<span style="color:var(--faint)">— <small>(non da BG)</small></span>';
      var baCell  = c.arr_ba  != null ? minsToHHMM(c.arr_ba)  : '<span style="color:var(--faint)">—</span>';
      var fsCell  = c.arr_ba_fs != null ? minsToHHMM(c.arr_ba_fs) : '<span style="color:var(--faint)">⚠️ non arriva FS</span>';
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
      var depBaCell = c.dep_ba    != null ? minsToHHMM(c.dep_ba)    : '<span style="color:var(--faint)">—</span>';
      var depFsCell = c.dep_ba_fs != null ? minsToHHMM(c.dep_ba_fs) : '<span style="color:var(--faint)">—</span>';
      var arrBgCell = c.arr_bg    != null ? minsToHHMM(c.arr_bg)    : '<span style="color:var(--faint)">⚠️ non rientra BG</span>';
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
               : schedule[i].BT956     != null ? schedule[i].BT956 : null;
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
               : schedule[j].BT205     != null ? schedule[j].BT205 : null;
      if (refR != null && refR >= nowMins) { nextIdx2 = j; break; }
    }
    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls = i === nextIdx2 ? ' class="current-row"' : '';
      var arc  = c.AC627 != null ? minsToHHMM(c.AC627) : c.AC625 != null ? minsToHHMM(c.AC625) : '<span style="color:var(--faint)">—</span>';
      var p90  = c.BT951 != null ? minsToHHMM(c.BT951) : '<span style="color:var(--faint)">—</span>';
      var bgArr;
      if      (c.BT999_arr != null) bgArr = minsToHHMM(c.BT999_arr) + ' <span style="font-size:0.7rem;color:var(--ok);">🏁 cap.</span>';
      else if (c.BT205     != null) bgArr = minsToHHMM(c.BT205) + ' <span style="font-size:0.7rem;color:var(--muted);">transito</span>';
      else if (c.BT775     != null) bgArr = minsToHHMM(c.BT775) + ' <span style="font-size:0.7rem;color:var(--muted);">transito</span>';
      else bgArr = '<span style="color:var(--faint)">—</span>';
      var fHtml = flagsHtml(c.flags);
      return '<tr' + cls + '><td>' + c.corsa + '</td><td>' + arc + '</td><td>' + p90 + '</td><td>' + bgArr + '</td><td>' + fHtml + '</td></tr>';
    }).join('');
  }
}

// ── Tabella orari Z642 ───────────────────────────────────────
var Z642_BTN_MAP = {
  'feriale_andata':  'z642btnFerAnd',
  'feriale_ritorno': 'z642btnFerRit',
  'sabato_andata':   'z642btnSabAnd',
  'sabato_ritorno':  'z642btnSabRit'
};

function showZ642Orari(mode) {
  if (mode === 'domenica') {
    document.getElementById('z642DayLabel').textContent = 'Orari Z642 — Domenica / Festivi';
    Object.keys(Z642_BTN_MAP).forEach(function(m){ var el=document.getElementById(Z642_BTN_MAP[m]); if(el) el.classList.remove('active'); });
    var tb642 = document.getElementById('z642Body');
    if (tb642) tb642.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--muted);">🚫 Nessun servizio domenica e festivi.</td></tr>';
    return;
  }
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
      var refA = schedule[i].BT776 != null ? schedule[i].BT776 : schedule[i].BT956 != null ? schedule[i].BT956 : null;
      if (refA != null && refA >= nowMins) { nextIdx = i; break; }
    }
    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls   = i === nextIdx ? ' class="current-row"' : '';
      var bt776 = c.BT776 != null ? minsToHHMM(c.BT776) : '<span style="color:var(--faint)">—</span>';
      var bt956 = c.BT956 != null ? minsToHHMM(c.BT956) : '<span style="color:var(--faint)">—</span>';
      var lgFs, lgFsNote = '';
      if      (c.LG090 != null) { lgFs = minsToHHMM(c.LG090); lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">← S5 Trenord</span>'; }
      else if (c.LG112 != null) { lgFs = minsToHHMM(c.LG112); lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">← S5 Trenord</span>'; }
      else lgFs = '<span style="color:var(--faint)">—</span>';
      var lgCtr = c.LG003 != null ? minsToHHMM(c.LG003) : c.LG001 != null ? minsToHHMM(c.LG001) : '<span style="color:var(--faint)">—</span>';
      var fHtml = flagsHtml(c.flags);
      return '<tr' + cls + '><td>' + c.corsa + '</td><td>' + bt776 + '</td><td>' + bt956 + '</td><td>' + lgFs + lgFsNote + '</td><td>' + lgCtr + '</td><td>' + fHtml + '</td></tr>';
    }).join('');
  } else {
    if (thead) thead.innerHTML = [
      '<th>Corsa</th>',
      '<th>Legnano FS ' + trainBadge('S5') + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">LG090/LG112</span></th>',
      '<th>Via Buonarroti<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">BT701</span></th>',
      '<th>Area Via Rossini<br><span style="font-size:0.7rem;font-weight:400;color:var(--muted);">BT775</span></th>',
      '<th>Val.</th>'
    ].join('');
    var nextIdx2 = -1;
    for (var j = 0; j < schedule.length; j++) {
      var refR = schedule[j].BT701 != null ? schedule[j].BT701 : schedule[j].BT775 != null ? schedule[j].BT775 : null;
      if (refR != null && refR >= nowMins) { nextIdx2 = j; break; }
    }
    if (tbody) tbody.innerHTML = schedule.map(function(c, i) {
      var cls   = i === nextIdx2 ? ' class="current-row"' : '';
      var lgFs, lgFsNote = '';
      if      (c.LG112 != null) { lgFs = minsToHHMM(c.LG112); lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">→ S5 Trenord</span>'; }
      else if (c.LG090 != null) { lgFs = minsToHHMM(c.LG090); lgFsNote = '<br><span style="font-size:0.7rem;color:var(--ok);">→ S5 Trenord</span>'; }
      else lgFs = '<span style="color:var(--faint)">—</span>';
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

  var allUpcoming = [];
  var allDeparted = [];

  // Z649
  var z649deps = getNextZ649(effectiveNow, dt, 5);
  z649deps.forEach(function(item) {
    allUpcoming.push({ line: 'z649', label: 'Z649', dep: item.rossini, data: item });
  });
  var z649past = (Z649[dt] || []).filter(function(item) {
    return item.rossini <= effectiveNow && item.rossini >= effectiveNow - 30;
  });
  z649past.forEach(function(item) {
    allDeparted.push({ line: 'z649', label: 'Z649', dep: item.rossini, data: item });
  });

  // Other lines
  if (dt !== 'domenica') {
    ['z627', 'z644', 'z625'].forEach(function(line) {
      var deps = getNextBusLive(line, effectiveNow, dt, 5);
      deps.forEach(function(item) {
        if (item.depMins <= effectiveNow) {
          if (item.depMins >= effectiveNow - 30) {
            allDeparted.push({ line: line, label: line.toUpperCase(), dep: item.depMins, data: item });
          }
        } else {
          allUpcoming.push({ line: line, label: line.toUpperCase(), dep: item.depMins, data: item });
        }
      });
    });
  }

  allUpcoming.sort(function(a, b) { return a.dep - b.dep; });
  allDeparted.sort(function(a, b) { return b.dep - a.dep; });

  var upcomingZ649 = allUpcoming.filter(function(item) { return item.line === 'z649'; });

  if (!upcomingZ649.length) {
    document.getElementById('cntMins').textContent  = '--';
    document.getElementById('cntTime').textContent  = 'Nessuna corsa Z649 imminente';
    document.getElementById('cntBadge').innerHTML   = '';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('mainCountdown').className = 'countdown-card';
  } else {
    var next = upcomingZ649[0].data;
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

    var mt = document.getElementById('mainTimeline');
    if (mt) {
      mt.style.display = 'block';
      var arr = next.molino_dorino;
      var loc = 'Molino Dorino M1';
      if (!arr) { arr = next.rossini + 20; loc = 'Arluno'; } // rough fallback for short trips
      mt.innerHTML = buildTransitTimeline(next.rossini, arr, 'Via Rossini 35', loc);
    }

  }

  renderUnifiedLive(allUpcoming, allDeparted, effectiveNow);

  var noServiceEl = document.getElementById('otherBusesNoService');
  if (noServiceEl) noServiceEl.style.display = dt === 'domenica' ? 'block' : 'none';
  renderCanegrateBlock(nowMins);
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

  if (tab === 'live')     { lastMins = -1; tick(); } // force full refresh
  if (tab === 'orari')    showZ649Orari(dt);
  if (tab === 'z627')     showZ627Orari(dt === 'domenica' ? 'domenica' : dt === 'sabato' ? 'sabato' : 'feriale');
  if (tab === 'z644')     showZ644Orari(dt === 'domenica' ? 'domenica' : dt === 'sabato' ? 'sabato_andata' : 'feriale_andata');
  if (tab === 'z625')     showZ625Orari(dt === 'domenica' ? 'domenica' : dt === 'sabato' ? 'sabato_andata' : 'feriale_andata');
  if (tab === 'z647')     showZ647Orari('feriale_andata');
  if (tab === 'z642')     showZ642Orari(dt === 'domenica' ? 'domenica' : dt === 'sabato' ? 'sabato_andata' : 'feriale_andata');
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
    lastMins = -1;
    tick();
  });
});
\n
function buildTransitTimeline(depTime, arrTime, startLoc, endLoc) {
  var dur = (arrTime != null) ? (arrTime - depTime) : '?';
  var arrStr = (arrTime != null) ? minsToHHMM(arrTime) : '--:--';
  return [
    '<div class="transit-timeline">',
    '  <div class="transit-point">',
    '    <div class="transit-time">' + minsToHHMM(depTime) + '</div>',
    '    <div class="transit-loc">' + startLoc + '</div>',
    '  </div>',
    '  <div class="transit-duration">',
    '    <span class="duration-line"></span>',
    '    <span class="duration-pill">' + dur + ' min</span>',
    '    <span class="duration-line"></span>',
    '  </div>',
    '  <div class="transit-point right">',
    '    <div class="transit-time">' + arrStr + '</div>',
    '    <div class="transit-loc">' + endLoc + '</div>',
    '  </div>',
    '</div>'
  ].join('');
}
