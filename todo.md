# 🛠️ Todo — Trasporti LIVE (v3.7.0)

## ✅ Done (v3.6.1 — sessione precedente)

### Fix 1 — Holiday detection in `getDayType` ✅
### Fix 2 — `minsToHHMM` wraps silently at midnight ✅
### Fix 3 — `switchTab('live')` leaves Z649 cards stale ✅
### Fix 4 — Z627/Z644/Z625/Z642 schedule tabs show feriale on holidays ✅
### Fix 5 — `CFG.version` stale ✅
### Fix 6 — Hardcoded version in settings panel ✅
### Fix 7 — No PWA / offline support ✅

---

## ✅ Done (v3.7.0 — questa sessione)

### Grafico 1 — CSS inline styles → classi dedicate ✅
**File:** `index.html`
Aggiunte classi: `.no-service-notice`, `.bus-block-badges`, `.bus-block-diff`, `.opt-detail`, `.departed-header`, `.departed-section`, `.tab-bar-wrap`.

### Grafico 2 — Tab bar: scroll fade indicator ✅
**File:** `index.html`
Wrappato `<div class="tab-bar">` in `<div class="tab-bar-wrap">` con pseudo-elemento `::after` che mostra una sfumatura laterale destra.

### Grafico 3 — Bus block: badge su due righe ✅
**File:** `js/app.js`
Badge urgency rimane in prima riga. Badge secondari (SC5, Ultima, Corsa breve) spostati in `<div class="bus-block-badges">` su riga separata. "tra X min" in `.bus-block-diff`.

### Grafico 4 — Spaziatura uniforme tra sezioni LIVE ✅
**File:** `index.html`
Rimossi tutti gli `style="margin-top:..."` inline dai `.section-header`. La spaziatura è ora gestita dal CSS `.section-header { margin: 1.25rem 0 0.75rem }` già esistente.

### Grafico 5 — Header: bottone settings semplificato ✅
**File:** `index.html`
Rimosso il testo "Impostazioni" dal bottone, lasciato solo l'icona ⚙️ con `title="Impostazioni"`.

### Grafico 6 — Canegrate: titolo ridondante rimosso ✅
**File:** `index.html`
Eliminato il `section-header` esterno "🚗 Via Canegrate FS — Alternativa indipendente" che duplicava il titolo del `canegrate-block-title`.

### Fix 8 — S5/S6 orari stimati senza `~` ✅
**File:** `js/app.js` · `buildBusOptions`
Il titolo del gruppo Pregnana ora mostra `S5/S6 ~HH:MM` direttamente nell'`option-group-title`. Gli arrivi stimati nelle `route-times` mostrano già `~`.

### Architettura — `calcNextTrain` generica ✅
**File:** `js/app.js`
Le 5 funzioni `calcNextS5S6`, `calcNextS5Legnano`, `calcNextS5Parabiago`, `calcNextS5BustoArsizio`, `calcNextREBustoArsizio` ora sono wrapper di un'unica `calcNextTrain(afterMinutes, slots)`. Slot definiti come variabili `SLOTS_*`.

### Feature — Sezione "Partiti di recente" ✅
**File:** `index.html` + `js/app.js`
I bus Z649 già partiti (fino a 30 min fa) vengono spostati in una sezione collassabile "🕐 Partiti di recente" sotto le corse attive. Non mostrano più "In viaggio" nelle cards principali. La sezione è nascosta se non ci sono bus partiti.

---

## 🔲 Remaining

### Fix 9 — `getDayType` ha holidays solo fino al 2026 ✅
**File:** `data/config.js`
Il array `holidays` copre solo 2025–2026. Aggiunto commento prominente per avvisare di aggiungere le date per il 2027.

### Fix 10 — SW cache name va aggiornato ad ogni rilascio ✅
**File:** `sw.js`
Aggiornato a `trasporti-bg-v3.7.0` e aggiunto commento per ricordare di effettuare il bump ad ogni rilascio per invalidare la cache.

### Grafico 7 — Tabelle: scroll indicator su mobile ✅
**File:** `index.html`
Aggiunta la classe `.tab-bar-wrap` come wrapper dei div con `.orari-table` per le tabelle Z644, Z625, Z647, e Z642. Fornisce l'ombra per indicare lo scroll.

### Fix 8b — `~` mancante anche su altri blocchi stimati ✅
**File:** `js/app.js`
Aggiunto `~` prima dell'orario stimato nei titoli dei blocchi per Z627, Z644, Z625 e Canegrate.

---

## 💡 Feature Ideas

| Priority | Feature |
|---|---|
| 🟡 | "Parto tra X min" — offset slider per pianificare partenza futura |
| 🟡 | Favourite destinations pinned on the Live tab |
| 🟢 | Light mode toggle (CSS custom properties già in place) |
| 🟢 | Share link con `?t=17:30` per pre-settare orario di planning |
| 🟢 | Toast annuale su Jan 1 se anno corrente non è nei holidays |
| 🟢 | Icone PNG 192×512px reali per il PWA manifest |
