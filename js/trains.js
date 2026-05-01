// ── Utility: calcolo prossimo treno (generica) ─────────────────
// slots = minuti dentro l'ora in cui il treno parte (es. [1,16,31,46])
export function calcNextTrain(afterMinutes, slots) {
  const hour = Math.floor(afterMinutes / 60);
  const min  = afterMinutes % 60;
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] > min) return hour * 60 + slots[i];
  }
  return (hour + 1) * 60 + slots[0];
}

export const SLOTS_S5S6       = [1, 16, 31, 46];
export const SLOTS_S5_LEGNANO = [3, 33];
export const SLOTS_S5_PARABI  = [13, 43];
export const SLOTS_S5_BUSTO   = [3, 33];
export const SLOTS_RE_BUSTO   = [20, 50];

export const calcNextS5S6 = (a)           => calcNextTrain(a, SLOTS_S5S6);
export const calcNextS5Legnano = (a)      => calcNextTrain(a, SLOTS_S5_LEGNANO);
export const calcNextS5Parabiago = (a)    => calcNextTrain(a, SLOTS_S5_PARABI);
export const calcNextS5BustoArsizio = (a) => calcNextTrain(a, SLOTS_S5_BUSTO);
export const calcNextREBustoArsizio = (a) => calcNextTrain(a, SLOTS_RE_BUSTO);
