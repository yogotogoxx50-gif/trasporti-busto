#!/usr/bin/env python3
"""
convert_stops.py
================
Converte tutti i CSV nella cartella STOPS/ in moduli JS pronti per
l'app trasporti-busto.

Uso:
    python tools/convert_stops.py

    Oppure specificando un path diverso da STOPS/:
    python tools/convert_stops.py --stops path/alla/cartella/STOPS

Output:
    Per ogni linea (Z627, Z625, ...) viene creato/sovrascritto
    il file  data/<linea_lower>.js
    (es. STOPS/Z627/CSV/*.csv  -->  data/z627.js)

Convenzione nomi file CSV:
    <LINEA>_[qualsiasi]_<DIREZIONE>_[CADENZA].csv

    DIREZIONE = ANDATA | RITORNO | DOMENICA  (obbligatoria nel nome)
    CADENZA   = opzionale nel nome; se assente o UNICA viene letta
                corsa per corsa dalla riga CADENZA del CSV.

    File UNICA = contengono corse con cadenze miste (FR5+SAB+SC5 ecc.)
    nello stesso CSV. La parola UNICA nel nome viene ignorata: lo script
    smista automaticamente ogni corsa nel corretto scheduleKey in base
    alla sua colonna CADENZA.

    Esempi validi:
        z627_Completa_Andata_FER.csv     -->  weekday_andata
        z627_Completa_Ritorno_FER.csv    -->  weekday_ritorno
        z627_Completa_Andata_S.csv       -->  saturday_andata
        Z642_ANDATA_UNICA.csv            -->  mixed (smistato per corsa)
        Z642_RITORNO_UNICA.csv           -->  mixed (smistato per corsa)
        Z644_ANDATA_FI5.csv              -->  weekday_andata
        Z644_ANDATA_SIS.csv              -->  saturday_andata
        Z649_FES_ANDATA.csv              -->  sunday_andata

Struttura CSV attesa:
    Riga 1: CORSA  , , , <id_corsa1>, <id_corsa2>, ...
    Riga 2: CADENZA, , , <cadenza1>,  <cadenza2>,  ...
    Riga 3+: <cod_fermata>, <comune>, <indirizzo>, <HH:MM o 0 o vuoto>, ...
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from collections import defaultdict
from datetime import date

# ---------------------------------------------------------------------------
# Mappatura cadenza -> dayType
# ---------------------------------------------------------------------------
CADENZA_TO_DAY = {
    'FR5': 'weekday',
    'FER': 'weekday',
    'FI5': 'weekday',
    'F15': 'weekday',
    'SC5': 'weekday',   # scolastico, stesso bucket feriale
    'SAB': 'saturday',
    'SIS': 'saturday',  # SAB Invernale (Z644)
    'FES': 'sunday',
    'DOM': 'sunday',
}

# Parole nel nome file che indicano la direzione
DIR_KEYWORDS = {
    'andata':   'andata',
    'outbound': 'andata',
    'ritorno':  'ritorno',
    'return':   'ritorno',
    'domenica': 'all',
    'sunday':   'all',
    'festivi':  'all',
    'fes':      'all',
}

# Parole nel nome file che indicano la cadenza prevalente
# (usato SOLO se il CSV non ha riga CADENZA per colonna)
FILENAME_TO_DAY = {
    'FR5': 'weekday', 'FER': 'weekday',
    'FI5': 'weekday', 'F15': 'weekday',
    'SC5': 'weekday',
    'SAB': 'saturday', 'SIS': 'saturday',
    'FES': 'sunday',   'DOM': 'sunday',
    # 'UNICA' e' volutamente assente: non forza nessun day type
}


# ---------------------------------------------------------------------------
# Utilita'
# ---------------------------------------------------------------------------

def hhmm_to_mins(s: str):
    """Converte 'HH:MM' o 'H:MM' in minuti dalla mezzanotte. None se vuoto/0."""
    s = s.strip()
    if not s or s == '0':
        return None
    m = re.match(r'^(\d{1,2}):(\d{2})$', s)
    if not m:
        return None
    return int(m.group(1)) * 60 + int(m.group(2))


def normalize_stop_id(raw_code: str, comune: str) -> str:
    """Produce un id snake_case stabile per ogni fermata.
    Es: 'BT301', 'Busto G.'  -->  'bt301_busto_g'
    """
    code  = re.sub(r'[^a-z0-9]', '_', raw_code.strip().lower()).strip('_')
    place = re.sub(r'[^a-z0-9]', '_', comune.strip().lower()).strip('_')
    place = re.sub(r'_+', '_', place)
    return f'{code}_{place}' if place else code


def detect_direction(filename: str) -> str:
    """Ricava la direzione dal nome del file (case-insensitive)."""
    lower = filename.lower()
    for kw, direction in DIR_KEYWORDS.items():
        if kw in lower:
            return direction
    return 'andata'  # default sicuro


def detect_day_from_filename(filename: str) -> str | None:
    """Tenta di ricavare dayType dalla cadenza esplicita nel nome.
    Ritorna None per file UNICA o se non trova corrispondenze.
    """
    upper = filename.upper()
    # UNICA = nessun day forzato dal nome, ogni corsa sceglie da sola
    if 'UNICA' in upper:
        return None
    for token, day in FILENAME_TO_DAY.items():
        # match come parola intera (separata da _, . o inizio/fine)
        if re.search(r'(?<![A-Z0-9])' + token + r'(?![A-Z0-9])', upper):
            return day
    return None


def cadenza_to_day(cadenza: str) -> str:
    return CADENZA_TO_DAY.get(cadenza.strip().upper(), 'weekday')


def build_schedule_key(day: str, direction: str) -> str:
    """Combina day + direction nella chiave JS dell'app."""
    if direction == 'all':
        return f'{day}_all'
    return f'{day}_{direction}'


# ---------------------------------------------------------------------------
# Parsing CSV
# ---------------------------------------------------------------------------

def parse_csv(filepath: Path, fallback_day: str | None, direction: str) -> list[dict]:
    """
    Legge un CSV Movibus trasposto.
    - Per file normali: la cadenza del nome file sovrascrive solo se la
      colonna CADENZA e' vuota.
    - Per file UNICA (fallback_day=None): ogni corsa usa ESCLUSIVAMENTE
      la sua colonna CADENZA per determinare lo scheduleKey.

    Ritorna lista di trip: { tripId, val, flags, scheduleKey, stops }
    """
    with open(filepath, encoding='utf-8-sig', newline='') as f:
        rows = list(csv.reader(f))

    if len(rows) < 3:
        print(f'  [SKIP] {filepath.name}: meno di 3 righe, ignorato.')
        return []

    # Riga 0: CORSA , , , id1, id2, ...
    # Riga 1: CADENZA, , , cad1, cad2, ...
    trip_ids = [c.strip() for c in rows[0][3:]]
    cadenze  = [c.strip() for c in rows[1][3:]]

    # Righe 2+: codice, comune, indirizzo, orari...
    stop_meta  = []   # list of (stop_id, label)
    stop_times = []   # list of list[str]

    for row in rows[2:]:
        if not any(c.strip() for c in row):
            continue
        raw_code = row[0].strip() if len(row) > 0 else ''
        comune   = row[1].strip() if len(row) > 1 else ''
        address  = row[2].strip() if len(row) > 2 else ''
        if not raw_code:
            continue
        stop_id = normalize_stop_id(raw_code, comune)
        label   = f'{comune} - {address}' if address else comune
        stop_meta.append((stop_id, label))
        times = row[3:] if len(row) > 3 else []
        stop_times.append(times)

    trips = []
    for i, tid in enumerate(trip_ids):
        if not tid:
            continue

        col_cadenza = cadenze[i] if i < len(cadenze) else ''

        # Determina day: la colonna CADENZA ha priorita' assoluta.
        # fallback_day e' usato solo se la colonna e' vuota E il file
        # non e' UNICA (fallback_day non e' None).
        if col_cadenza:
            day = cadenza_to_day(col_cadenza)
        elif fallback_day is not None:
            day = fallback_day
        else:
            # UNICA senza cadenza nella colonna: default weekday
            day = 'weekday'

        skey = build_schedule_key(day, direction)

        stops = {}
        for j, (stop_id, _) in enumerate(stop_meta):
            val_str = stop_times[j][i] if i < len(stop_times[j]) else ''
            mins = hhmm_to_mins(val_str)
            if mins is not None:
                stops[stop_id] = mins

        if stops:
            trips.append({
                'tripId':      tid,
                'val':         col_cadenza,
                'flags':       [col_cadenza] if col_cadenza else [],
                'scheduleKey': skey,
                'stops':       stops,
            })

    return trips


def extract_stop_catalog(filepath: Path) -> list[dict]:
    """Catalogo fermate presenti in un CSV per generare i commenti in JS."""
    with open(filepath, encoding='utf-8-sig', newline='') as f:
        rows = list(csv.reader(f))
    catalog = []
    for row in rows[2:]:
        if not any(c.strip() for c in row):
            continue
        raw_code = row[0].strip() if len(row) > 0 else ''
        comune   = row[1].strip() if len(row) > 1 else ''
        address  = row[2].strip() if len(row) > 2 else ''
        if not raw_code:
            continue
        catalog.append({
            'id':      normalize_stop_id(raw_code, comune),
            'code':    raw_code.upper(),
            'comune':  comune,
            'address': address,
        })
    return catalog


# ---------------------------------------------------------------------------
# Rendering JS
# ---------------------------------------------------------------------------

JS_HEADER = """// AUTO-GENERATO da tools/convert_stops.py
// NON modificare manualmente — rieseguire lo script dopo aggiornamenti CSV.
// Fonte: STOPS/{line_upper}/CSV/
// Generato il: {gen_date}
"""


def trips_to_js(trips: list[dict]) -> str:
    lines = ['  [']
    for trip in trips:
        stops_js = json.dumps(trip['stops'], ensure_ascii=False)
        flags_js = json.dumps(trip['flags'], ensure_ascii=False)
        lines.append(
            f"    {{ tripId: {json.dumps(trip['tripId'])}, "
            f"val: {json.dumps(trip['val'])}, "
            f"flags: {flags_js}, "
            f"stops: {stops_js} }},"
        )
    lines.append('  ]')
    return '\n'.join(lines)


def build_js_module(line_id: str, schedule: dict, stop_catalog: list[dict]) -> str:
    header = JS_HEADER.format(
        line_upper=line_id.upper(),
        gen_date=date.today().isoformat()
    )

    catalog_lines = ['// FERMATE DISPONIBILI (copia in line-config.js):']
    seen = set()
    for s in stop_catalog:
        if s['id'] not in seen:
            seen.add(s['id'])
            addr_short = s['address'][:45].replace("'", "") if s['address'] else ''
            catalog_lines.append(
                f"// {{ key: '{s['id']}', label: '{s['comune']} — {addr_short}', hideable: true }},"
            )

    schedule_entries = []
    for key in sorted(schedule.keys()):
        trips_js = trips_to_js(schedule[key])
        schedule_entries.append(f"  {json.dumps(key)}: {trips_js},")

    export_name = line_id.upper().replace('-', '_')

    return (
        header
        + '\n'.join(catalog_lines)
        + f'\n\nexport const {export_name} = {{\n'
        + '\n'.join(schedule_entries)
        + '\n};\n'
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def process_stops_folder(stops_root: Path, output_root: Path):
    if not stops_root.exists():
        print(f'ERRORE: cartella STOPS non trovata: {stops_root}', file=sys.stderr)
        sys.exit(1)

    output_root.mkdir(parents=True, exist_ok=True)
    processed_lines = []

    for line_dir in sorted(stops_root.iterdir()):
        if not line_dir.is_dir():
            continue
        line_id = line_dir.name.lower()
        csv_dir = line_dir / 'CSV'
        if not csv_dir.exists():
            print(f'  [SKIP] {line_dir.name}: cartella CSV/ non trovata.')
            continue

        csv_files = sorted(csv_dir.glob('*.csv'))
        if not csv_files:
            print(f'  [SKIP] {line_dir.name}: nessun .csv in CSV/.')
            continue

        print(f'\nLinea {line_dir.name}:')
        schedule: dict[str, list] = defaultdict(list)
        all_stop_catalog: list[dict] = []
        seen_stop_ids: set[str] = set()

        for csv_path in csv_files:
            fname = csv_path.stem
            direction   = detect_direction(fname)
            fallback_day = detect_day_from_filename(fname)
            is_unica     = 'UNICA' in fname.upper()

            tag = 'UNICA (mixed)' if is_unica else (fallback_day or 'auto')
            print(f'  {csv_path.name}  [{tag}, dir={direction}]')

            trips = parse_csv(csv_path, fallback_day, direction)
            if not trips:
                continue

            # Catalogo fermate
            for s in extract_stop_catalog(csv_path):
                if s['id'] not in seen_stop_ids:
                    seen_stop_ids.add(s['id'])
                    all_stop_catalog.append(s)

            # Raggruppa per scheduleKey (gia' calcolato dentro parse_csv)
            key_counts: dict[str, int] = defaultdict(int)
            for trip in trips:
                skey = trip.pop('scheduleKey')  # rimuovi dal trip prima di salvare
                schedule[skey].append(trip)
                key_counts[skey] += 1

            for skey, cnt in sorted(key_counts.items()):
                print(f'    --> {skey}: {cnt} corse')

        if not schedule:
            print(f'  [SKIP] {line_dir.name}: nessuna corsa estratta.')
            continue

        # Deduplicazione per tripId dentro ogni scheduleKey
        for key in schedule:
            seen_ids: set[str] = set()
            deduped = []
            for trip in schedule[key]:
                tid = trip['tripId']
                if tid not in seen_ids:
                    seen_ids.add(tid)
                    deduped.append(trip)
            schedule[key] = deduped

        js_content = build_js_module(line_id, dict(schedule), all_stop_catalog)
        out_path = output_root / f'{line_id}.js'
        out_path.write_text(js_content, encoding='utf-8')
        print(f'  ==> scritto: {out_path}')
        processed_lines.append(line_id)

    print(f'\n=============================')
    print(f'Completato: {len(processed_lines)} linee convertite.')
    print(f'File scritti in: {output_root.resolve()}')
    if processed_lines:
        print(f'Linee: {", ".join(processed_lines)}')
    print()
    print('PASSI SUCCESSIVI:')
    print('  1. Controlla i file data/<linea>.js generati.')
    print('  2. Leggi i commenti // FERMATE DISPONIBILI in cima a ogni file.')
    print('  3. Aggiorna line-config.js con le colonne reali (o chiedi aiuto qui).')
    print('  4. git add data/ && git commit -m "update: orari da CSV" && git push')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Converte i CSV Movibus in moduli JS per trasporti-busto.'
    )
    parser.add_argument(
        '--stops',
        default='STOPS',
        help='Path della cartella STOPS (default: ./STOPS)'
    )
    parser.add_argument(
        '--output',
        default='data',
        help='Cartella di output dei file JS (default: ./data)'
    )
    args = parser.parse_args()

    stops_path  = Path(args.stops)
    output_path = Path(args.output)

    print(f'STOPS input : {stops_path.resolve()}')
    print(f'JS output   : {output_path.resolve()}')
    process_stops_folder(stops_path, output_path)
