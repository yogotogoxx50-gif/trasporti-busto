# Documentazione Script: CSV -> JS Converter

Lo script `tools/csv-to-js.mjs` automatizza la conversione degli orari bus da file CSV (estratti da Excel) al formato JavaScript utilizzato dall'applicazione (Schema v4.0.0).

## 🚀 Utilizzo
Dalla cartella principale del progetto:
```bash
node tools/csv-to-js.mjs <linea>
```
*Esempio:* `node tools/csv-to-js.mjs z627`

---

## 📂 Struttura Cartelle e File
Per ogni linea, lo script cerca una cartella chiamata `Orari_<LINEA>` (tutto maiuscolo).

### Mappatura Nomi File
I file CSV devono essere rinominati secondo questa convenzione per essere riconosciuti:
- `Completa_Andata_FER.csv` ➔ feriale andata (`weekday_outbound`)
- `Completa_Andata_S.csv` ➔ sabato andata (`saturday_outbound`)
- `Completa_Ritorno_FER.csv` ➔ feriale ritorno (`weekday_return`)
- `Completa_Ritorno_S.csv` ➔ sabato ritorno (`saturday_return`)
- `Completa_Andata_DOM.csv` ➔ domenica (`sunday`)

---

## 📋 Formato del CSV (Obbligatorio)
Il CSV deve rispettare questa struttura:

1.  **Riga 1 (ID Corse):** Gli ID numerici delle corse devono iniziare dalla **quarta colonna** (Colonna D). Le prime 3 colonne sono ignorate.
2.  **Riga 2 (Validità):** I codici cadenza (es. `FR5`, `SC5`, `SAB`) devono essere nella stessa colonna dell'ID corsa corrispondente.
3.  **Righe 3+ (Fermate):**
    *   **Colonna A:** Codice Fermata (es. `BT301`, `LG090`). **Nota:** Questo codice DEVE corrispondere a quello usato in `line-config.js`.
    *   **Colonna B:** Comune (Ignorato dallo script).
    *   **Colonna C:** Nome Fermata (Ignorato dallo script).
    *   **Colonne D+:** Orari nel formato `HH:MM`.
        *   Usa `0` o lascia la cella vuota se la corsa non effettua quella fermata.

---

## ⚙️ Configurazione Linee (`LINE_DEFS`)
I metadati (nomi, descrizioni, mappature file) sono definiti nell'oggetto `LINE_DEFS` all'interno dello script `tools/csv-to-js.mjs`. Quando si aggiunge una nuova linea, è necessario inserire un nuovo blocco di configurazione in quell'oggetto.

---

## 🔄 Processo di Trasformazione
Lo script esegue automaticamente le seguenti operazioni:
1.  **Filtraggio**: Elimina le corse che non hanno alcun orario valido.
2.  **Conversione**: Trasforma tutti gli orari `HH:MM` in **minuti totali da mezzanotte** (es. `06:15` -> `375`).
3.  **Normalizzazione**: Inserisce i codici di validità nell'array `flags` come richiesto dallo schema dati v4.0.0.
4.  **Output**: Genera il file `data/<linea>.js` pronto per l'importazione.

---

## ⚠️ Note Post-Conversione
Dopo aver generato il file JS per una nuova linea o aver aggiornato una esistente:
1.  Assicurarsi che `js/line-config.js` utilizzi gli stessi **stop codes** presenti nel CSV.
2.  Verificare nel browser che la tabella della linea mostri i dati correttamente.
