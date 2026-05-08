let orari = [];
let config = {};

// Avvio applicazione
async function init() {
    try {
        const [orariRes, configRes] = await Promise.all([
            fetch('orari.json'),
            fetch('config.json')
        ]);
        
        orari = await orariRes.json();
        config = await configRes.json();
        
        updateDashboard();
        // Aggiorna la dashboard ogni minuto
        setInterval(updateDashboard, 60000); 
    } catch (error) {
        document.getElementById('results').innerHTML = `<p style="color:red">Errore nel caricamento dei dati: ${error.message}</p>`;
    }
}

function updateDashboard() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) + ' - ' + now.toLocaleDateString('it-IT');
    
    const dayTypeInfo = analyzeDayType(now);
    document.getElementById('day-type-info').textContent = `Oggi: ${dayTypeInfo.tipoGiorno} ${dayTypeInfo.note ? '('+dayTypeInfo.note+')' : ''}`;
    
    if (dayTypeInfo.inattivoGlobale) {
        document.getElementById('results').innerHTML = `<p>⚠️ Servizio autobus globalmente sospeso oggi.</p>`;
        return;
    }

    const nextBuses = findNextBuses(now, dayTypeInfo.tipoGiorno);
    renderResults(nextBuses);
}

function analyzeDayType(dateObj) {
    const yyyy_mm_dd = dateObj.toISOString().split('T')[0];
    const mm_dd = yyyy_mm_dd.substring(5);
    const dayOfWeek = dateObj.getDay(); // 0 = Domenica, 1 = Lunedì...
    
    let tipo = "FERIALE";
    if (dayOfWeek === 6) tipo = "SABATO";
    if (dayOfWeek === 0) tipo = "FESTIVO";

    let note = "";
    let inattivoGlobale = false;

    // Controllo Inattività Globale
    const cal = config.calendario_globale;
    if (cal.inattivita_globale_da && cal.inattivita_globale_a) {
        if (yyyy_mm_dd >= cal.inattivita_globale_da && yyyy_mm_dd <= cal.inattivita_globale_a) {
            inattivoGlobale = true;
            note = "Sospensione Estiva";
        }
    }

    // Controllo Festività Extra
    if (cal.giorni_festivi_extra && cal.giorni_festivi_extra.includes(mm_dd)) {
        tipo = "FESTIVO";
        note = "Festività Nazionale";
    }

    return { tipoGiorno: tipo, note: note, inattivoGlobale: inattivoGlobale, dateString: yyyy_mm_dd };
}

function findNextBuses(now, tipoGiornoCorrente) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dateString = now.toISOString().split('T')[0];
    const fermateRicerca = config.fermate_ricerca.map(f => f.toLowerCase());
    
    let prossimi = [];

    orari.forEach(corsa => {
        // 1. Filtra per fermata
        const nomeFermataLow = corsa.Fermata.toLowerCase();
        const matchFermata = fermateRicerca.some(ricerca => nomeFermataLow.includes(ricerca));
        if (!matchFermata) return;

        // 2. Controlla eccezioni linea (es. linea inattiva)
        if (config.eccezioni_per_linea && config.eccezioni_per_linea[corsa.Linea]) {
            const ecc = config.eccezioni_per_linea[corsa.Linea];
            if (ecc.inattiva_da && ecc.inattiva_a && dateString >= ecc.inattiva_da && dateString <= ecc.inattiva_a) {
                return; // Linea inattiva oggi
            }
        }

        // 3. Filtra per tipo di giorno
        if (corsa.Tipo_Giorno !== tipoGiornoCorrente) return;

        // 4. Calcola i minuti all'arrivo
        const [busHH, busMM] = corsa.Orario.split(':').map(Number);
        const busMinutes = busHH * 60 + busMM;
        const diff = busMinutes - currentMinutes;

        // Mostra i bus dalla mezz'ora precedente fino alle prossime 3 ore (per avere un range ragionevole)
        if (diff > -10 && diff < 180) { 
            prossimi.push({ ...corsa, attesa: diff });
        }
    });

    // Ordina per attesa
    prossimi.sort((a, b) => a.attesa - b.attesa);
    return prossimi;
}

function renderResults(buses) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    if (buses.length === 0) {
        container.innerHTML = '<p>Nessun autobus in arrivo a breve dalle tue fermate preferite.</p>';
        return;
    }

    // Mostriamo solo i primi 15 risultati per non appesantire la UI
    buses.slice(0, 15).forEach(bus => {
        const card = document.createElement('div');
        card.className = 'bus-card';
        
        let statoAttesa = "";
        if (bus.attesa < 0) {
            statoAttesa = `<span style="color:#888;">Partito da ${Math.abs(bus.attesa)} min</span>`;
        } else if (bus.attesa === 0) {
            statoAttesa = `<span class="time-alert">In partenza ORA!</span>`;
        } else {
            statoAttesa = `<span class="time-alert">Tra ${bus.attesa} min</span> (${bus.Orario})`;
        }

        card.innerHTML = `
            <h3>Linea ${bus.Linea} - ${bus.Direzione}</h3>
            <p><strong>Fermata:</strong> ${bus.Fermata} ${bus.Comune !== 'nan' ? '('+bus.Comune+')' : ''}</p>
            <p>${statoAttesa}</p>
        `;
        container.appendChild(card);
    });
}

init();
