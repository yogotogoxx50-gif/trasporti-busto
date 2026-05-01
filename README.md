# Trasporti LIVE - Busto Garolfo

Dashboard statica per consultare le partenze bus da Busto Garolfo e le principali coincidenze verso Milano.

Live: [https://yogotogoxx50-gif.github.io/trasporti-busto/](https://yogotogoxx50-gif.github.io/trasporti-busto/)

## Cosa include

- LIVE con prossime partenze, corse partite da poco e alternativa Canegrate FS.
- Tabelle orari per Z649, Z627, Z644, Z625, Z647 e Z642.
- Dati in schema unificato: ogni corsa ha `tripId`, `stops`, `validity`, `flags`, `note`.
- Fermate complete nei file `data/*.js`, con visualizzazione controllata da `js/line-config.js`.
- Impostazioni locali per tempi di percorrenza, import/export JSON e fermate visibili.
- Simulazione di data e ora per verificare LIVE e tabelle come in un momento futuro/passato.
- PWA con service worker e cache degli asset locali.

## Sviluppo locale

I moduli ES non vanno aperti con `file://`. Servi la cartella con un server HTTP:

```bash
npx serve .
```

Oppure:

```bash
python -m http.server 8000
```

Poi apri `http://localhost:8000`.

## Come aggiornare fermate e orari

L'aggiornamento può essere manuale o automatizzato tramite script.

### ⚙️ Metodo Automatizzato (Consigliato)
1. Prepara i CSV nelle cartelle `Orari_ZXXX/`.
2. Esegui lo script: `node tools/csv-to-js.mjs zXXX`.
3. Consulta [tools/README.md](tools/README.md) per i dettagli sul formato e la configurazione.

### ✍️ Metodo Manuale
1. Aggiungi o aggiorna tutte le fermate nei file `data/z*.js`, dentro `stops`.
2. In `js/line-config.js`, imposta:
   - `visibleStops` per le colonne mostrate di default nelle tabelle.
   - `liveStops` per le fermate usate da countdown, timeline e LIVE.
   - `connections` per le coincidenze treno/metropolitana.
3. Se cambi asset o percorsi, aggiorna `sw.js` e fai bump del `CACHE_NAME`.

## Deploy GitHub Pages

Non serve build step. GitHub Pages deve pubblicare direttamente il branch/cartella che contiene `index.html`.

Se dopo un deploy vedi asset vecchi, cambia il nome cache in `sw.js` e ricarica la pagina.
