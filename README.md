# 🚌 Trasporti LIVE — Busto Garolfo → Milano

Dashboard giornaliera per **Via Giacomo Rossini 35, Busto Garolfo** → Milano.

## 🌐 Link live

> **[https://yogotogoxx50-gif.github.io/trasporti-busto/](https://yogotogoxx50-gif.github.io/trasporti-busto/)**

*(GitHub Pages attivo dopo ~1-2 minuti dal primo push)*

## Cosa fa

- ⏱ Mostra il prossimo Z649 in tempo reale (aggiornamento ogni secondo)
- 🗺 **Logica bus-centric**: dato il bus che parte, mostra tutte le destinazioni raggiungibili
  - 🔵 Via Molino Dorino → M1 (Cadorna, Duomo, Repubblica, Centrale...)
  - 🔄 Via Pregnana FS → S5/S6 Trenord (Garibaldi, Repubblica...)
  - 🚗 Via Canegrate FS → Trenord Milano
- 📅 Orari completi Z649 feriale/sabato/domenica
- ⚙️ Impostazioni: tempo a piedi fino alla fermata, tempo auto fino a Canegrate

## File

| File | Descrizione |
|------|-------------|
| `index.html` | Dashboard completa (self-contained, zero dipendenze esterne) |


## Come aggiornare i dati

Modifica direttamente la sezione `Z649_ORARI` dentro `index.html`.
Gli orari sono in minuti dall'inizio della giornata (es. `1037` = 17:17).

## Stack

- HTML + CSS + JS vanilla, zero dipendenze
- Google Fonts (Inter)
- Hostato su GitHub Pages
