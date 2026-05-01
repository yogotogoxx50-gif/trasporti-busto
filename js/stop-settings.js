import { LINE_CONFIG, getColumns, getDirection, isHideableStopColumn } from './line-config.js';

const STORAGE_KEY = 'visibleStopsOverrides';

function readOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function getVisibleStopKeys(lineId, scheduleKey) {
  const config = LINE_CONFIG[lineId];
  const direction = getDirection(scheduleKey);
  const defaults = config?.visibleStops?.[direction] || config?.visibleStops?.all || config?.visibleStops?.outbound || [];
  const override = readOverrides()?.[lineId]?.[direction];
  if (!Array.isArray(override) || !override.length) return defaults;

  const allowed = new Set(getColumns(lineId, scheduleKey).filter(isHideableStopColumn).map(col => col.key));
  const clean = override.filter(key => allowed.has(key));
  return clean.length ? clean : defaults;
}

export function getVisibleColumns(lineId, scheduleKey) {
  const visibleStops = new Set(getVisibleStopKeys(lineId, scheduleKey));
  return getColumns(lineId, scheduleKey).filter(col => {
    if (!isHideableStopColumn(col)) return true;
    return visibleStops.has(col.key);
  });
}

export function renderVisibleStopsSettings(onChange) {
  const host = document.getElementById('visibleStopsSettings');
  if (!host) return;

  const overrides = readOverrides();
  host.innerHTML = Object.entries(LINE_CONFIG).map(([lineId, config]) => {
    const sections = (config.directions || ['all']).map(direction => {
      const scheduleKey = config.scheduleKeys.find(key => getDirection(key) === direction) || config.scheduleKeys[0];
      const columns = getColumns(lineId, scheduleKey).filter(isHideableStopColumn);
      if (!columns.length) return '';

      const defaults = config.visibleStops?.[direction] || config.visibleStops?.all || columns.map(col => col.key);
      const active = overrides?.[lineId]?.[direction] || defaults;
      const activeSet = new Set(active);
      const title = direction === 'outbound' ? 'Andata' : direction === 'return' ? 'Ritorno' : 'Principale';

      return `
        <div class="stop-settings-group">
          <div class="stop-settings-title">${config.label} - ${title}</div>
          <div class="stop-settings-grid">
            ${columns.map(col => `
              <label class="stop-check">
                <input type="checkbox" data-line="${lineId}" data-direction="${direction}" data-stop="${col.key}" ${activeSet.has(col.key) ? 'checked' : ''}>
                <span>${col.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    return sections;
  }).join('');

  host.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const next = readOverrides();
      const { line, direction } = input.dataset;
      const checked = [...host.querySelectorAll(`input[data-line="${line}"][data-direction="${direction}"]:checked`)]
        .map(el => el.dataset.stop);
      if (!checked.length) {
        input.checked = true;
        return;
      }

      if (!next[line]) next[line] = {};
      next[line][direction] = checked;
      writeOverrides(next);
      onChange?.();
    });
  });

  const resetBtn = document.getElementById('resetVisibleStops');
  if (resetBtn) {
    resetBtn.onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      renderVisibleStopsSettings(onChange);
      onChange?.();
    };
  }
}
