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

Convenzione nomi file CSV (OBBLIGATORIA):
    <LINEA>_<DIREZIONE>_<CADENZA>.csv

    LINEA     = codice linea, es. Z627, Z625, Z644
    DIREZIONE = ANDATA | RITORNO (case-insensitive)
    CADENZA   = FR5 | SC5 | SAB | FI5 | SIS | FES | qualsiasi stringa

    Esempi validi:
        z627_Completa_Andata_FER.csv   -->  weekday_andata  (FER -> FR5)
        z627_Completa_Ritorno_FER.csv  -->  weekday_ritorno
        z627_Completa_Andata_S.csv     -->  saturday_andata
        Z644_ANDATA_FI5.csv            -->  weekday_andata
        Z644_ANDATA_SIS.csv            -->  saturday_andata
        Z647_DOMENICA_FES.csv          -->  sunday_all

    Il file puo' avere prefisso lungo tipo "z627_Completa_":
    lo script cerca ANDATA/RITORNO/DOMENICA ovunque nel nome.

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

# ---------------------------------------------------------------------------
# Mappatura cadenza CSV -> chiave scheduleKey JS
# ---------------------------------------------------------------------------
CADENZA_TO_DAY = {
    'FR5': 'weekday',
    'FER': 'weekday',
    'FI5': 'weekday',   # FR5 Invernale (Z644)
    'F15': 'weekday',
    'SC5': 'weekday',   # scolastico, stesso bucket del feriale
    'SAB': 'saturday',
    'SIS': 'saturday',  # SAB Invernale (Z644)
    'FES': 'sunday',
    'DOM': 'sunday',
}

# Direzione dal nome del file
DIR_KEYWORDS = {
    'andata':   'andata',
    'outbound': 'andata',
    'ritorno':  'ritorno',
    'return':   'ritorno',
    'domenica': 'all',
    'sunday':   'all',
    'festivi':  'all',
}

# ---------------------------------------------------------------------------
# Utilita'
# ---------------------------------------------------------------------------

def hhmm_to_mins(s: str):
    """Converte 'HH:MM' o 'H:MM' in minuti dalla mezzanotte. Ritorna None se vuoto/0."""
    s = s.strip()
    if not s or s == '0':
        return None
    m = re.match(r'^(\d{1,2}):(\d{2})$', s)
    if not m:
        return None
    return int(m.group(1)) * 60 + int(m.group(2))


def normalize_stop_id(raw_code: str, comune: str) -> str:
    """
    Produce un identificatore snake_case stabile per ogni fermata.
    Es: 'BT301', 'Busto G.'  -->  'bt301_busto_g'
    """
    code  = re.sub(r'[^a-z0-9]', '_', raw_code.strip().lower()).strip('_')
    place = re.sub(r'[^a-z0-9]', '_', comune.strip().lower()).strip('_')
    place = re.sub(r'_+', '_', place)
    return f'{code}_{place}' if place else code


def detect_direction(filename: str) -> str:
    """Ricava la direzione dal nome del file."""
    lower = filename.lower()
    for kw, direction in DIR_KEYWORDS.items():
        if kw in lower:
            return direction
    return 'andata'  # default


def detect_day_from_filename(filename: str) -> str | None:
    """Tenta di ricavare il dayType dalla cadenza nel nome del file."""
    lower = filename.upper()
    for cadenza, day in CADENZA_TO_DAY.items():
        if cadenza in lower:
            return day
    return None


def cadenza_to_day(cadenza: str) -> str:
    return CADENZA_TO_DAY.get(cadenza.strip().upper(), 'weekday')


# ---------------------------------------------------------------------------
# Parsing CSV
# ---------------------------------------------------------------------------

def parse_csv(filepath: Path) -> list[dict]:
    """
    Legge un CSV Movibus trasposto e ritorna una lista di trip objects:
    [
      { 'tripId': '102', 'val': 'FR5', 'stops': { 'bt301_busto_g': 372, ... } },
      ...
    ]
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

    # Righe 2+: codice_fermata, comune, indirizzo, orari...
    stop_meta = []  # list of (stop_id, label)
    stop_times = [] # list of list[str]

    for row in rows[2:]:
        # Salta righe completamente vuote
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
    n_trips = len(trip_ids)

    for i in range(n_trips):
        tid = trip_ids[i]
        if not tid:
            continue
        cadenza = cadenze[i] if i < len(cadenze) else ''
        stops = {}
        for j, (stop_id, _) in enumerate(stop_meta):
            val_str = stop_times[j][i] if i < len(stop_times[j]) else ''
            mins = hhmm_to_mins(val_str)
            if mins is not None:
                stops[stop_id] = mins
        if stops:
            trips.append({
                'tripId': tid,
                'val':    cadenza,
                'flags':  [cadenza] if cadenza else [],
                'stops':  stops,
            })

    return trips


def extract_stop_catalog(filepath: Path) -> list[dict]:
    """
    Ritorna il catalogo delle fermate presenti in un CSV:
    [ { 'id': 'bt301_busto_g', 'code': 'BT301', 'comune': 'Busto G.', 'address': '...' } ]
    """
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
# Assemblaggio schedule key
# ---------------------------------------------------------------------------

def build_schedule_key(day: str, direction: str) -> str:
    """
    Combina day + direction nella chiave JS usata dall'app.
    weekday + andata   --> 'weekday_andata'
    saturday + ritorno --> 'saturday_ritorno'
    sunday + all       --> 'sunday_all'
    """
    if direction == 'all':
        return f'{day}_all'
    return f'{day}_{direction}'


# ---------------------------------------------------------------------------
# Rendering JS
# ---------------------------------------------------------------------------

JS_HEADER = """// AUTO-GENERATO da tools/convert_stops.py
// NON modificare manualmente — rieseguire lo script dopo aggiornamenti CSV.
// Fonte: STOPS/{line_upper}/CSV/
// Generato il: {date}
"""

def trips_to_js(trips: list[dict]) -> str:
    """Serializza una lista di trip in JS compatta."""
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


def build_js_module(line_id: str, schedule: dict[str, list], stop_catalog: list[dict]) -> str:
    """
    Costruisce il contenuto del file data/<line>.js
    """
    from datetime import date
    header = JS_HEADER.format(
        line_upper=line_id.upper(),
        date=date.today().isoformat()
    )

    # Catalogo fermate come commento JS strutturato (utile per line-config)
    catalog_lines = ['// FERMATE DISPONIBILI (per aggiornare line-config.js):']
    seen = set()
    for s in stop_catalog:
        if s['id'] not in seen:
            seen.add(s['id'])
            catalog_lines.append(
                f"// {{ key: '{s['id']}', label: '{s['comune']} - {s['address'][:40]}' }},"
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

    # Scorri ogni sottocartella linea (Z627, Z625, ...)
    for line_dir in sorted(stops_root.iterdir()):
        if not line_dir.is_dir():
            continue
        line_id = line_dir.name.lower()  # z627, z625, ...
        csv_dir = line_dir / 'CSV'
        if not csv_dir.exists():
            print(f'  [SKIP] {line_dir.name}: cartella CSV/ non trovata.')
            continue

        csv_files = sorted(csv_dir.glob('*.csv'))
        if not csv_files:
            print(f'  [SKIP] {line_dir.name}: nessun file .csv in CSV/.')
            continue

        print(f'\nLinea {line_dir.name}:')
        schedule: dict[str, list] = defaultdict(list)
        all_stop_catalog: list[dict] = []
        seen_stop_ids = set()

        for csv_path in csv_files:
            filename = csv_path.stem  # nome senza estensione
            direction = detect_direction(filename)

            # Prova a leggere day dal nome file come fallback
            day_from_name = detect_day_from_filename(filename)

            trips = parse_csv(csv_path)
            if not trips:
                continue

            # Costruisci catalogo fermate
            for s in extract_stop_catalog(csv_path):
                if s['id'] not in seen_stop_ids:
                    seen_stop_ids.add(s['id'])
                    all_stop_catalog.append(s)

            # Raggruppa le corse per scheduleKey
            # (le corse nello stesso CSV hanno spesso cadenze miste FR5+SC5)
            key_trips: dict[str, list] = defaultdict(list)
            for trip in trips:
                day = cadenza_to_day(trip['val']) if trip['val'] else (day_from_name or 'weekday')
                skey = build_schedule_key(day, direction)
                key_trips[skey].append(trip)

            for skey, t_list in key_trips.items():
                schedule[skey].extend(t_list)
                print(f'  {csv_path.name}  -->  {skey}  ({len(t_list)} corse)')

        if not schedule:
            print(f'  [SKIP] {line_dir.name}: nessuna corsa estratta.')
            continue

        # Deduplicazione (per tripId, per sicurezza)
        for key in schedule:
            seen_ids = set()
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
        print(f'  --> scritto: {out_path}')
        processed_lines.append(line_id)

    print(f'\n=============================')
    print(f'Completato: {len(processed_lines)} linee convertite.')
    print(f'File scritti in: {output_root.resolve()}')
    if processed_lines:
        print(f'Linee: {', '.join(processed_lines)}')
    print()
    print('PASSI SUCCESSIVI:')
    print('  1. Controlla i file data/<linea>.js generati.')
    print('  2. Verifica i commenti // FERMATE DISPONIBILI in cima a ogni file.')
    print('  3. Aggiorna line-config.js con le colonne reali di ogni linea.')
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

    print(f'STOPS input:  {stops_path.resolve()}')
    print(f'JS output:    {output_path.resolve()}')
    process_stops_folder(stops_path, output_path)
