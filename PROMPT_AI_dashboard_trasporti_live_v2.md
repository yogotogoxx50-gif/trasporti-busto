# PROMPT AI — Dashboard Trasporti LIVE (Upgrade v2.0)
# Dashboard giornaliera: Via Giacomo Rossini 35, Busto Garolfo → Milano

## File da fornire all'AI

1. `busto_garolfo_transport_data-2.json` — dataset linee e fermate (base)
2. `journey_planner_data_v2.json` — orari reali Z649, M1, S5/S6, destinazioni ← PRIORITÀ
3. `PROMPT_AI_dashboard_trasporti_live_v2.md` — questo file

---

## Obiettivo principale (URGENTE)

Costituisci una **single-file dashboard HTML premium, 100% offline** che risponda OGNI GIORNO a questa domanda:

> **"Parto adesso da Via Rossini 35 — quando parte il prossimo Z649 e dove posso arrivare con quel bus?"**

Gerarchia di priorità:
1. Utilità quotidiana immediata
2. Estetica premium
3. Completezza dati
4. Editing dati

---

## Cambio paradigma UX (CRITICO)

- ❌ **Vecchio approccio**: griglia di card per destinazione → ogni card mostra la soluzione
- ✅ **Nuovo approccio**: **bus-centric** → mostra IL BUS che parte, poi TUTTO ciò che puoi fare con quel bus

---

## Wireframe di riferimento

```
+-----------------------------------------------------------+
|  17:10:43 | GIOVEDÌ | FERIALE              [ SETTINGS ⚙️ ] |
+-----------------------------------------------------------+
|  ⚡ Z649 PARTE TRA  >> 07 min <<  (alle 17:17)           |
|  [||||||||||..........] ✅ Ottimo timing                 |
+-----------------------------------------------------------+
|  CON QUESTO BUS PUOI:                                     |
|  🔄 SCENDI A PREGNANA FS  (arr. 17:49)                    |
|    └ S5/S6 ~17:51 → P.ta Garibaldi  18:09  (20m)         |
|    └ S5/S6 ~17:51 → Repubblica      18:14  (25m)         |
|  🔵 CAPOLINEA MOLINO DORINO  (arr. 18:03) → M1 🔴         |
|    └ M1 → Cadorna               ~18:13  (10m)            |
|    └ M1 → Duomo / Repubblica    ~18:15  (12m)  [RAPIDO⚡] |
|  🚗 VIA CANEGRATE  (auto ~8 min)                          |
|    └ Treno 17:55 → Cadorna 18:20                         |
+-----------------------------------------------------------+
| [ 🏠 LIVE ] [ 📅 ORARI ] [ ⚙️ DATI ]                    |
+-----------------------------------------------------------+
```

---

Vedi il file completo per tutta la logica JS, le regole di business e il design system.
