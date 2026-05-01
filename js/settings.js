import { CFG, Z649, Z627, Z644, Z625, Z647, Z642 } from './main.js';
import { tick } from './main.js';
import { renderVisibleStopsSettings } from './stop-settings.js';

function refreshApp() {
  if (window.forceRefresh) window.forceRefresh();
  else tick();
}

export function exportTimetables() {
  const data = {
    Z649,
    Z627,
    Z644,
    Z625,
    Z647,
    Z642,
    _meta: { exportDate: new Date().toISOString(), version: CFG.version }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trasporti_busto_export_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importTimetables(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  const status = document.getElementById('importStatus');
  if (status) {
    status.style.display = 'block';
    status.textContent = 'Caricamento...';
  }

  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.Z649) throw new Error('Formato non valido: manca Z649');

      localStorage.setItem('userTimetables', JSON.stringify(parsed));
      if (status) {
        status.textContent = 'Import completato. Riavvio...';
        status.style.color = 'var(--ok)';
      }
      setTimeout(() => { location.reload(); }, 1200);
    } catch (err) {
      if (status) {
        status.textContent = `Errore: ${err.message}`;
        status.style.color = 'var(--bad)';
      }
    }
  };
  reader.readAsText(file);
}

export function initSettings() {
  const walkRossini = document.getElementById('walkRossini');
  const walkCanegrate = document.getElementById('walkCanegrate');

  if (walkRossini) {
    walkRossini.addEventListener('change', e => {
      localStorage.setItem('walkRossini', e.target.value);
      refreshApp();
    });
  }

  if (walkCanegrate) {
    walkCanegrate.addEventListener('change', e => {
      localStorage.setItem('driveCanegrate', e.target.value);
      refreshApp();
    });
  }

  renderVisibleStopsSettings(refreshApp);
}
