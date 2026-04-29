# 🔍 Analisi Completa — Trasporti LIVE v3.6.1

## 📋 Stato attuale dal Todo

**7 fix completati** (holidays, midnight wrap, tab stale, domenica, version, PWA).
**3 fix rimasti** (Fix 8–10) + 6 feature ideas.

---

## 🎨 Problemi Grafici e di Allineamento

### 1. **Tab bar: troppi tab, overflow illeggibile su mobile**
La tab bar ha **8 bottoni** (`LIVE`, `Z649`, `Z627`, `Z644`, `Z625`, `Z647`, `Z642`, `DATI`). Su schermi < 400px scorrono orizzontalmente senza alcun indicatore visivo che ci siano altri tab nascosti.

**Fix proposto:**
- Aggiungere sfumatura laterale (fade gradient) per indicare lo scroll
- Raggruppare i tab orari in un sottomenu / dropdown "📅 Orari" che si espande
- O usare icone più compatte e un font più piccolo per i tab secondari

### 2. **Header (hero-bar): allineamento verticale disomogeneo**
- Il `.clock` è `1.5rem` font-weight 700, il `.day-name` è `0.9rem` e il `.day-type` `0.75rem` — il blocco giorno è molto piccolo rispetto all'orologio
- Il bottone "⚙️ Impostazioni" nell'header **duplica** il tab "⚙️ DATI" nella tab bar — confusione UX
- Nessun logo / icona brand nell'header

**Fix proposto:**
- Rimuovere il bottone impostazioni dall'header (già raggiungibile via tab)
- Aggiungere una piccola icona 🚌 o il nome dell'app
- Bilanciare meglio le dimensioni: orologio a sinistra, giorno+tipo a destra, con font size più armoniche

### 3. **Countdown card: layout wrapping su mobile**
- `.countdown-top` usa `flex-wrap: wrap` — su schermi stretti il badge urgenza va a capo in modo sgraziato
- La progress bar sottostante non ha label — non è chiaro cosa rappresenti

**Fix proposto:**
- Badge urgenza posizionato in alto a destra della card (position absolute o grid layout)
- Aggiungere label alla progress bar ("Tempo rimanente")

### 4. **Bus blocks: badge soup 🍲**
Ogni bus block header contiene fino a **5 badge** sulla stessa riga (urgency + SC5 + last + short + "tra X min"). Su mobile questi vanno tutti a capo in modo caotico.

```
Z649  07:30  ⚡ SBRIGATI  📚 SC5  🔚 Ultima  ⚠️ Corsa breve  tra 3 min
```

**Fix proposto:**
- Badge urgenza: mantenerlo
- Info secondarie (SC5, Ultima, Corsa breve): spostarle in una riga sotto il titolo
- "tra X min": integrato nel countdown, non come testo libero

### 5. **Sezioni LIVE: spaziatura inconsistente**
- Z649 section header: `margin-top` implicito
- Z627: `margin-top: 1.5rem` (inline style)
- Z644, Z625: `margin-top: 1rem` (inline style)
- Canegrate: `margin-top: 1rem` (inline style)

**Fix proposto:** Rimuovere tutti gli inline `margin-top` e usare un valore consistente in CSS (es. `.section-header { margin-top: 1.5rem; }`).

### 6. **Tabelle orari: colonne schiacciate su mobile**
Le tabelle Z625 (6 colonne) e Z642 (6 colonne) sono quasi illeggibili su mobile. L'`overflow-x: auto` funziona, ma l'utente non ha indicazione visiva dello scroll orizzontale.

**Fix proposto:**
- Aggiungere indicatore scroll (gradient fade destra) sui wrapper tabella
- Su mobile, considerare un layout a card invece che tabella per le righe
- Minimo: aggiungere `-webkit-overflow-scrolling: touch` e un sottile bordo di suggerimento

### 7. **Blocco Canegrate: doppia intestazione ridondante**
Ci sono:
1. Un `section-header` "🚗 Via Canegrate FS — Alternativa indipendente"
2. Una `canegrate-block-title` "🚗 Via Canegrate FS" con badge "🚗 Indipendente dal bus"
3. Un sottotitolo "Parti in auto adesso → Canegrate FS → S5/S6 → Cadorna"

Sono 3 livelli di intestazione che dicono la stessa cosa.

**Fix proposto:** Eliminare il `section-header` esterno. Tenere solo il block con titolo + sottotitolo.

### 8. **Inline styles ovunque nel HTML e nel JS**
Ci sono **decine** di `style="..."` inline sia in `index.html` che nel JS (generazione HTML in `app.js`). Questo rende la manutenzione impossibile e crea inconsistenza.

**Esempi critici:**
- `style="margin-top:1.5rem;"` sui section headers
- `style="font-size:0.82rem;color:var(--muted);"` nei bus block
- `style="color:var(--text);font-weight:400;text-transform:none;letter-spacing:0;"` ripetuto N volte in option-group-title

**Fix proposto:** Creare classi CSS dedicate per tutti questi pattern ripetuti.

---

## ⚙️ Problemi di Architettura / Codice

### 9. **app.js è un monolite da 1015 righe**
Tutto in un singolo file: utility, logica Z649, logica Z627, Z644, Z625, Z647, Z642, rendering, tick, tab switching. 

**Fix proposto:** Separare in moduli:
- `js/utils.js` — minsToHHMM, getDayType, urgency*, badge helpers
- `js/live.js` — tick, renderBusBlocks, renderOtherBuses, renderCanegrate
- `js/orari.js` — showZ649Orari, showZ627Orari, showZ644Orari, showZ625Orari, showZ647Orari, showZ642Orari
- `js/app.js` — loadData, switchTab, listeners (orchestratore)

### 10. **Codice duplicato nei calcoli treno**
Le funzioni `calcNextS5S6`, `calcNextS5Legnano`, `calcNextS5Parabiago`, `calcNextS5BustoArsizio`, `calcNextREBustoArsizio` sono tutte **identiche** tranne l'array `slots`.

```javascript
// Tutte hanno questa struttura identica:
function calcNextXxx(afterMinutes) {
  var slots = [...]; // unica differenza
  var hour = Math.floor(afterMinutes / 60);
  var min = afterMinutes % 60;
  for (...) { ... }
  return (hour + 1) * 60 + slots[0];
}
```

**Fix:** Una funzione generica `calcNextTrain(afterMinutes, slots)`.

### 11. **HTML generato con concatenazione di stringhe**
Tutto l'HTML dinamico è costruito con `+` string concatenation. Questo è:
- Difficile da leggere e debuggare
- Propenso a bug XSS (nessun escaping)
- Impossibile da formattare

**Fix proposto:** Usare template literals (backtick) o almeno una funzione helper `h()` per i tag.

### 12. **`var` ovunque, nessun `const`/`let`**
L'intero codebase usa `var`. Dato che state già usando `padStart`, `findIndex`, `forEach` (ES6+), conviene usare `const`/`let` per scope corretto.

---

## 🐛 Bug / Fix rimasti dal Todo

### Fix 8 — Tilde `~` mancante su S5/S6
Confermato: in `renderBusBlocks` → `buildBusOptions`, il titolo `option-group-title` per Pregnana mostra l'orario senza `~` nella headline del gruppo. Serve aggiungere `~` davanti a tutti gli orari stimati S5/S6/RE nei titoli dei gruppi.

### Fix 9 — Holidays solo fino al 2026
Confermato: `CFG.holidays` copre solo 2025–2026. Aggiungere un commento prominente e un meccanismo di avviso (toast su Jan 1 se anno corrente non coperto).

### Fix 10 — Cache name SW hardcoded
Confermato: `sw.js` ha `trasporti-bg-v3.6.1` hardcoded. Se i dati cambiano senza aggiornare il nome cache, gli utenti vedono dati vecchi.

---

## 🎯 Priorità Miglioramenti (Ordinata per impatto)

| # | Tipo | Miglioramento | Impatto |
|---|------|--------------|---------|
| 1 | 🎨 CSS | Rimuovere inline styles → classi CSS dedicate | Alto |
| 2 | 🎨 UX | Tab bar: raggruppamento o scroll indicator | Alto |
| 3 | 🎨 UX | Bus block: riorganizzare badge su 2 righe | Alto |
| 4 | 🎨 CSS | Spaziatura uniforme tra sezioni | Medio |
| 5 | 🎨 UX | Header: rimuovere bottone duplicato impostazioni | Medio |
| 6 | 🎨 UX | Canegrate: eliminare titoli ridondanti | Medio |
| 7 | 🎨 UX | Tabelle: scroll indicator su mobile | Medio |
| 8 | 🐛 Fix | Fix 8: aggiungere `~` agli orari stimati | Medio |
| 9 | ⚙️ Code | Funzione generica `calcNextTrain(slots)` | Basso |
| 10 | ⚙️ Code | Separare app.js in moduli | Basso |
| 11 | 🐛 Fix | Fix 10: cache name dinamica | Basso |
| 12 | 🎨 Polish | Progress bar con label | Basso |

---

## 💡 Vuoi che implementi questi miglioramenti?

Posso procedere in ordine di priorità. Dimmi:
1. **Tutti** — applico tutto in sequenza
2. **Solo grafici** — punti 1–7
3. **Solo bug** — punti 8, 11
4. **Cherry-pick** — dimmi quali numeri vuoi
