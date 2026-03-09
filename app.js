// =============================================================================
// MODALITÀ "SCEGLI IL LATO"
// Database di notizie reali e fake per il gameplay
// =============================================================================

// Variabile globale per la modalità selezionata
let selectedMode = null;

const NEWS_DATABASE = [
  {
    title: "Vaccino COVID-19 contiene microchip per il controllo mentale",
    text: "Secondo fonti anonime, i vaccini COVID-19 conterrebbero microchip sviluppati da una nota azienda tecnologica per monitorare e controllare il comportamento delle persone.",
    source: "FACEBOOK",
    isFake: true
  },
  {
    title: "L'OMS dichiara l'acqua potabile dannosa per la salute",
    text: "Un recente studio dell'Organizzazione Mondiale della Sanità avrebbe dimostrato che bere acqua potabile aumenta il rischio di malattie gravi.",
    source: "BUFALE.NET",
    isFake: true
  },
  {
    title: "Il cambiamento climatico è confermato da 97% degli scienziati",
    text: "Un'analisi di oltre 12.000 articoli scientifici peer-reviewed ha confermato che il 97% degli scienziati concordano sul fatto che il cambiamento climatico è causato dall'attività umana.",
    source: "ANSA",
    isFake: false
  },
  {
    title: "Gli smartphone causano tumori al cervello",
    text: "Studi scientifici dimostrerebbero che l'uso prolungato dello smartphone provoca inevitabilmente tumori cerebrali.",
    source: "IL FATTO QUOTIDIANO",
    isFake: true
  },
  {
    title: "La Terra è piatta secondo nuove ricerche",
    text: "Un gruppo di ricercatori indipendenti avrebbe dimostrato con foto satellitari che la Terra è in realtà piatta e non sferica.",
    source: "YOUTUBE",
    isFake: true
  },
  {
    title: "L'esercizio fisico regolare riduce il rischio di malattie cardiovascolari",
    text: "Studi pubblicati su riviste mediche peer-reviewed dimostrano che 150 minuti di attività fisica moderata a settimana riducono significativamente il rischio di malattie cardiache.",
    source: "SKY TG24",
    isFake: false
  },
  {
    title: "Mangiare carote migliora la vista notturna",
    text: "Consumare grandi quantità di carote permetterebbe di vedere perfettamente al buio grazie al beta-carotene.",
    source: "FACEBOOK",
    isFake: true
  },
  {
    title: "Le mascherine chirurgiche riducono la trasmissione di virus respiratori",
    text: "Studi clinici controllati hanno dimostrato che l'uso corretto di mascherine chirurgiche riduce significativamente la trasmissione di virus respiratori come influenza e coronavirus.",
    source: "RADIO GOLD",
    isFake: false
  }
];

let currentNews = null;
let playerTeam = null; // 'believer' o 'fact_checker'
let currentUser = null; // Dati utente loggato

// =============================================================================
// SISTEMA POWER-UPS E BUDGET PER "SCEGLI IL LATO"
// =============================================================================
const playerState = {
  budget: 500,
  budgetRechargeCounter: 0,
  budgetRechargeTurns: 3,
  activePowerups: [],
  originalParams: null // Salva parametri originali per reset dopo power-up
};

// Configurazione Power-ups
const POWERUPS = {
  // Team Believer
  fakeBurst: {
    id: 'fakeBurst',
    name: 'Fake Burst',
    cost: 120,
    duration: 1,
    team: 'believer',
    description: 'Raddoppia probabilità contagio',
    apply: () => {
      // Converte forzatamente 3-5 nodi Susceptible in Believer
      return { forceConvert: { target: 'B', count: 4, from: 'S' } };
    }
  },
  payInfluencer: {
    id: 'payInfluencer',
    name: 'Paga Influencer',
    cost: 200,
    duration: 4,
    team: 'believer',
    description: '+25% conversione Believer',
    apply: () => {
      // Ogni turno converte 2 nodi Susceptible in Believer
      return { convertPerTurn: { target: 'B', count: 2, from: 'S' } };
    }
  },
  emergencyBeliever: {
    id: 'emergencyBeliever',
    name: 'EMERGENZA',
    cost: 300,
    duration: 5,
    team: 'believer',
    description: 'Inverte il trend',
    apply: () => {
      // Converte 10% dei Fact-Checker in Susceptible + converte 2 nodi S->B per turno
      return { 
        initialEffect: { target: 'S', count: 0.1, from: 'FC', percentage: true },
        convertPerTurn: { target: 'B', count: 3, from: 'S' }
      };
    }
  },
  
  // Team Fact-Checker
  talkFriend: {
    id: 'talkFriend',
    name: 'Parla con un Amico',
    cost: 80,
    duration: 1,
    team: 'fact_checker',
    description: 'Converti 1 vicino casuale',
    apply: () => {
      // Questo power-up converte direttamente un nodo invece di modificare parametri
      return { instantConversion: true, convertCount: 1 };
    }
  },
  nationalDebunk: {
    id: 'nationalDebunk',
    name: 'Smentita Nazionale',
    cost: 200,
    duration: 4,
    team: 'fact_checker',
    description: '+25% conversione FC',
    apply: () => {
      // Ogni turno converte 2 Believer in Fact-Checker
      return { convertPerTurn: { target: 'FC', count: 2, from: 'B' } };
    }
  },
  emergencyFC: {
    id: 'emergencyFC',
    name: 'EMERGENZA',
    cost: 300,
    duration: 5,
    team: 'fact_checker',
    description: 'Inverte il trend',
    apply: () => {
      // Converte 10% dei Believer in Susceptible + converte 3 nodi S->FC per turno
      return { 
        initialEffect: { target: 'S', count: 0.1, from: 'B', percentage: true },
        convertPerTurn: { target: 'FC', count: 3, from: 'S' }
      };
    }
  }
};

// =============================================================================
// PALETTE COLORI PER DALTONISMO
// Palette ottimizzate per diversi tipi di daltonismo
// =============================================================================
const COLORBLIND_PALETTES = {
  normal: {
    believer: '#ef4444',      // Rosso
    factChecker: '#22c55e',   // Verde
    susceptible: '#94a3b8',   // Grigio
    eternal: '#00d4ff'        // Ciano
  },
  protanopia: {
    believer: '#d4a017',      // Oro/Ambra (invece di rosso)
    factChecker: '#4169e1',   // Blu reale (invece di verde)
    susceptible: '#808080',   // Grigio
    eternal: '#00ced1',       // Turchese scuro
    // Colori per il gradiente gullibility
    lowGullibility: '#d4a017',  // Oro (sostituisce rosso)
    highGullibility: '#4169e1'  // Blu reale
  },
  deuteranopia: {
    believer: '#cd853f',      // Marrone chiaro
    factChecker: '#4682b4',   // Blu acciaio
    susceptible: '#778899',   // Grigio ardesia
    eternal: '#20b2aa',       // Verde acqua
    lowGullibility: '#cd853f',  // Marrone
    highGullibility: '#4682b4'  // Blu acciaio
  },
  tritanopia: {
    believer: '#ff1493',      // Rosa intenso
    factChecker: '#00ced1',   // Turchese
    susceptible: '#a9a9a9',   // Grigio scuro
    eternal: '#ff69b4',       // Rosa chiaro
    lowGullibility: '#ff1493',  // Rosa
    highGullibility: '#00ced1'  // Turchese
  },
  achromatopsia: {
    believer: '#2d2d2d',      // Grigio molto scuro (quasi nero)
    factChecker: '#f0f0f0',   // Grigio molto chiaro (quasi bianco)
    susceptible: '#808080',   // Grigio medio
    eternal: '#c0c0c0',       // Grigio argento
    lowGullibility: '#2d2d2d',  // Grigio scuro
    highGullibility: '#f0f0f0'  // Grigio chiaro
  }
};

let currentColorMode = 'normal';

// Ottiene il colore in base alla modalità daltonismo attiva
function getColorForState(stateType) {
  const palette = COLORBLIND_PALETTES[currentColorMode] || COLORBLIND_PALETTES.normal;
  return palette[stateType] || palette.susceptible;
}

// =============================================================================
// SISTEMA STATISTICHE PERSISTENTI
// Traccia e salva statistiche di gioco in localStorage
// =============================================================================

const STATS_KEY = 'hoaxGameStats';

// Struttura statistiche
function getDefaultStats() {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    believerGames: 0,
    believerWins: 0,
    fcGames: 0,
    fcWins: 0,
    powerupsUsed: {
      fakeBurst: 0,
      payInfluencer: 0,
      emergencyBeliever: 0,
      talkFriend: 0,
      nationalDebunk: 0,
      emergencyFC: 0
    },
    totalPlayTime: 0, // in secondi
    averageGameTime: 0,
    longestGame: 0,
    shortestGame: Infinity,
    firstPlayDate: Date.now(),
    lastPlayDate: Date.now(),
    totalTurnsPlayed: 0
  };
}

// Carica statistiche da localStorage
function loadStats() {
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    try {
      return { ...getDefaultStats(), ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Errore caricamento statistiche:', e);
      return getDefaultStats();
    }
  }
  return getDefaultStats();
}

// Salva statistiche in localStorage
function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Errore salvataggio statistiche:', e);
  }
}

// Variabile globale per tracciare tempo di gioco
let gameStartTime = null;

// Inizia tracciamento partita
function startGameTracking() {
  gameStartTime = Date.now();
}

// Registra uso power-up
function trackPowerupUsage(powerupId) {
  const stats = loadStats();
  if (stats.powerupsUsed[powerupId] !== undefined) {
    stats.powerupsUsed[powerupId]++;
    saveStats(stats);
  }
}

// Registra fine partita
function trackGameEnd(won, team) {
  if (!gameStartTime) return;
  
  const stats = loadStats();
  const gameTime = Math.floor((Date.now() - gameStartTime) / 1000); // secondi
  
  stats.gamesPlayed++;
  stats.totalTurnsPlayed += state.currentDay;
  
  if (won) {
    stats.gamesWon++;
  } else {
    stats.gamesLost++;
  }
  
  if (team === 'believer') {
    stats.believerGames++;
    if (won) stats.believerWins++;
  } else if (team === 'fact_checker') {
    stats.fcGames++;
    if (won) stats.fcWins++;
  }
  
  // Aggiorna tempi di gioco
  stats.totalPlayTime += gameTime;
  stats.averageGameTime = Math.floor(stats.totalPlayTime / stats.gamesPlayed);
  stats.longestGame = Math.max(stats.longestGame, gameTime);
  stats.shortestGame = Math.min(stats.shortestGame, gameTime);
  stats.lastPlayDate = Date.now();
  
  saveStats(stats);
  gameStartTime = null;
  
  console.log('📊 Statistiche aggiornate:', stats);
}

// Mostra statistiche nel modale Area Personale
function updateStatsDisplay() {
  const stats = loadStats();
  
  const winRate = stats.gamesPlayed > 0 ? 
    Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  
  const believerWinRate = stats.believerGames > 0 ?
    Math.round((stats.believerWins / stats.believerGames) * 100) : 0;
  
  const fcWinRate = stats.fcGames > 0 ?
    Math.round((stats.fcWins / stats.fcGames) * 100) : 0;
  
  // Formatta tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Power-up più usato
  const mostUsedPowerup = Object.entries(stats.powerupsUsed)
    .sort((a, b) => b[1] - a[1])[0];
  
  const statsHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 20px;">
      <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 8px; border: 1px solid rgba(71,85,105,0.5);">
        <div style="font-size: 24px; font-weight: 700; color: #5ea8ff;">${stats.gamesPlayed}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Partite Giocate</div>
      </div>
      <div style="background: rgba(15,23,42,0.6); padding: 16px; border-radius: 8px; border: 1px solid rgba(71,85,105,0.5);">
        <div style="font-size: 24px; font-weight: 700; color: #22c55e;">${winRate}%</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Win Rate</div>
      </div>
      <div style="background: rgba(239,68,68,0.1); padding: 16px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.3);">
        <div style="font-size: 20px; font-weight: 600; color: #ef4444;">${believerWinRate}%</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">🔴 Believer (${stats.believerWins}/${stats.believerGames})</div>
      </div>
      <div style="background: rgba(34,197,94,0.1); padding: 16px; border-radius: 8px; border: 1px solid rgba(34,197,94,0.3);">
        <div style="font-size: 20px; font-weight: 600; color: #22c55e;">${fcWinRate}%</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">🟢 Fact-Checker (${stats.fcWins}/${stats.fcGames})</div>
      </div>
      <div style="grid-column: 1 / -1; background: rgba(15,23,42,0.6); padding: 16px; border-radius: 8px; border: 1px solid rgba(71,85,105,0.5);">
        <div style="font-size: 14px; color: #e2e8f0; margin-bottom: 8px;">⏱️ <strong>Tempo Medio:</strong> ${formatTime(stats.averageGameTime)}</div>
        <div style="font-size: 12px; color: #94a3b8;">Più lunga: ${formatTime(stats.longestGame)} • Più breve: ${stats.shortestGame === Infinity ? 'N/A' : formatTime(stats.shortestGame)}</div>
      </div>
      <div style="grid-column: 1 / -1; background: rgba(15,23,42,0.6); padding: 16px; border-radius: 8px; border: 1px solid rgba(71,85,105,0.5);">
        <div style="font-size: 14px; color: #e2e8f0; margin-bottom: 8px;">⚡ <strong>Power-up Preferito:</strong></div>
        <div style="font-size: 12px; color: #94a3b8;">${mostUsedPowerup ? `${POWERUPS[mostUsedPowerup[0]]?.name || mostUsedPowerup[0]} (${mostUsedPowerup[1]} volte)` : 'Nessuno ancora'}</div>
      </div>
    </div>
  `;
  
  const statsContainer = document.getElementById('userStatsContainer');
  if (statsContainer) {
    statsContainer.innerHTML = statsHTML;
  }
}

// =============================================================================
// SISTEMA TUTORIAL/ONBOARDING
// Tutorial interattivo per nuovi utenti
// =============================================================================

const TUTORIAL_KEY = 'hoaxTutorialCompleted';

const TUTORIAL_STEPS = [
  {
    title: '👋 Benvenuto nel Simulatore di Hoax!',
    content: `
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">
        Questo è un gioco educativo sulla diffusione delle <strong>fake news</strong> nelle reti sociali.
      </p>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-top: 16px;">
        Imparerai come le notizie false si propagano e come contrastarle con il fact-checking.
      </p>
      <div style="background: rgba(94,168,255,0.1); border-left: 3px solid #5ea8ff; padding: 16px; margin-top: 20px; border-radius: 4px;">
        <p style="font-size: 13px; color: #cbd5e1; margin: 0;">
          💡 <strong>Obiettivo:</strong> Raggiungi il 70% di nodi dalla tua parte prima che lo facciano gli avversari o scada il tempo (51 turni).
        </p>
      </div>
    `,
    icon: '🎮'
  },
  {
    title: '📰 Scegli il Tuo Lato',
    content: `
      <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6;">
        All'inizio riceverai una <strong>notizia</strong>. Dovrai decidere se è:
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px;">
        <div style="background: rgba(239,68,68,0.1); padding: 20px; border-radius: 8px; border: 2px solid rgba(239,68,68,0.3);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔴</div>
          <div style="font-size: 16px; font-weight: 600; color: #ef4444; margin-bottom: 8px;">FAKE</div>
          <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
            Diventerai un <strong>Believer</strong> e dovrai diffondere la fake news
          </div>
        </div>
        <div style="background: rgba(34,197,94,0.1); padding: 20px; border-radius: 8px; border: 2px solid rgba(34,197,94,0.3);">
          <div style="font-size: 32px; margin-bottom: 8px;">🟢</div>
          <div style="font-size: 16px; font-weight: 600; color: #22c55e; margin-bottom: 8px;">VERA</div>
          <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
            Diventerai un <strong>Fact-Checker</strong> e dovrai smascherare le fake
          </div>
        </div>
      </div>
    `,
    icon: '📰'
  },
  {
    title: '🕸️ La Rete Sociale',
    content: `
      <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6; margin-bottom: 16px;">
        Il grafo centrale rappresenta una <strong>rete sociale</strong> con 120 persone (nodi) connesse tra loro.
      </p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0;">
        <div style="text-align: center; padding: 16px; background: rgba(15,23,42,0.6); border-radius: 8px;">
          <div style="font-size: 28px; margin-bottom: 8px;">🔴</div>
          <div style="font-size: 13px; font-weight: 600; color: #ef4444;">Believer</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Crede nella fake</div>
        </div>
        <div style="text-align: center; padding: 16px; background: rgba(15,23,42,0.6); border-radius: 8px;">
          <div style="font-size: 28px; margin-bottom: 8px;">🟢</div>
          <div style="font-size: 13px; font-weight: 600; color: #22c55e;">Fact-Checker</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Smaschera la fake</div>
        </div>
        <div style="text-align: center; padding: 16px; background: rgba(15,23,42,0.6); border-radius: 8px;">
          <div style="font-size: 28px; margin-bottom: 8px;">⚪</div>
          <div style="font-size: 13px; font-weight: 600; color: #94a3b8;">Susceptible</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Non ha ancora deciso</div>
        </div>
      </div>
      <div style="background: rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; padding: 12px; margin-top: 16px; border-radius: 4px;">
        <p style="font-size: 12px; color: #cbd5e1; margin: 0;">
          ⚡ Ogni turno i nodi influenzano i loro vicini connessi da linee
        </p>
      </div>
    `,
    icon: '🕸️'
  },
  {
    title: '⚡ Power-up Strategici',
    content: `
      <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6; margin-bottom: 16px;">
        Hai un <strong>budget di 500 crediti</strong> per usare power-up speciali che accelerano la diffusione.
      </p>
      <div style="display: grid; gap: 12px;">
        <div style="background: rgba(15,23,42,0.6); padding: 12px 16px; border-radius: 8px; border-left: 3px solid #5ea8ff;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 13px; font-weight: 600; color: #5ea8ff;">💥 Fake Burst</div>
            <div style="font-size: 12px; color: #94a3b8;">80 crediti</div>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Converti 5 nodi Susceptible in Believer</div>
        </div>
        <div style="background: rgba(15,23,42,0.6); padding: 12px 16px; border-radius: 8px; border-left: 3px solid #22c55e;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 13px; font-weight: 600; color: #22c55e;">💬 Parla con Amico</div>
            <div style="font-size: 12px; color: #94a3b8;">80 crediti</div>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Un FC converte un vicino casuale</div>
        </div>
        <div style="background: rgba(15,23,42,0.6); padding: 12px 16px; border-radius: 8px; border-left: 3px solid #f59e0b;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 13px; font-weight: 600; color: #f59e0b;">🚨 EMERGENZA</div>
            <div style="font-size: 12px; color: #94a3b8;">300 crediti</div>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Effetto potente che dura 5 turni</div>
        </div>
      </div>
      <div style="background: rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; padding: 12px; margin-top: 16px; border-radius: 4px;">
        <p style="font-size: 12px; color: #cbd5e1; margin: 0;">
          💰 Il budget si ricarica di 50 crediti ogni 5 turni
        </p>
      </div>
    `,
    icon: '⚡'
  },
  {
    title: '🎯 Pronto a Giocare!',
    content: `
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6; margin-bottom: 20px;">
        Ora sei pronto per la tua prima partita!
      </p>
      <div style="background: linear-gradient(135deg, rgba(94,168,255,0.2), rgba(34,197,94,0.2)); padding: 24px; border-radius: 12px; margin: 20px 0;">
        <div style="font-size: 18px; font-weight: 700; color: #e2e8f0; margin-bottom: 12px; text-align: center;">
          Ricorda l'obiettivo:
        </div>
        <div style="font-size: 32px; font-weight: 700; text-align: center; color: #5ea8ff; margin: 12px 0;">
          70%
        </div>
        <div style="font-size: 13px; color: #cbd5e1; text-align: center;">
          Raggiungi il 70% di nodi dalla tua parte<br/>prima degli avversari o del timeout (51 turni)
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;">
        <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Usa i bottoni</div>
          <div style="font-size: 14px; color: #5ea8ff; font-weight: 600;">➡️ Prossimo Giorno</div>
        </div>
        <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">O automatico</div>
          <div style="font-size: 14px; color: #5ea8ff; font-weight: 600;">⏩ Simulazione</div>
        </div>
      </div>
      <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 20px;">
        🍀 Buona fortuna!
      </p>
    `,
    icon: '🎯'
  }
];

let currentTutorialStep = 0;

// Verifica se tutorial già completato
function shouldShowTutorial() {
  return localStorage.getItem(TUTORIAL_KEY) !== 'true';
}

// Mostra tutorial
function showTutorial() {
  currentTutorialStep = 0;
  updateTutorialContent();
  openModal('#tutorialModal');
}

// Aggiorna contenuto tutorial
function updateTutorialContent() {
  const step = TUTORIAL_STEPS[currentTutorialStep];
  const content = document.getElementById('tutorialContent');
  
  if (content) {
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 64px; margin-bottom: 16px;">${step.icon}</div>
        <h3 style="font-size: 24px; color: #e2e8f0; margin: 0;">${step.title}</h3>
      </div>
      ${step.content}
    `;
  }
  
  // Aggiorna contatori
  document.getElementById('tutorialStep').textContent = currentTutorialStep + 1;
  document.getElementById('tutorialTotal').textContent = TUTORIAL_STEPS.length;
  
  // Aggiorna bottoni
  const btnPrev = document.getElementById('btnTutorialPrev');
  const btnNext = document.getElementById('btnTutorialNext');
  
  if (btnPrev) {
    btnPrev.disabled = currentTutorialStep === 0;
  }
  
  if (btnNext) {
    if (currentTutorialStep === TUTORIAL_STEPS.length - 1) {
      btnNext.textContent = '✓ Inizia a Giocare!';
      btnNext.classList.add('primary');
    } else {
      btnNext.textContent = 'Avanti →';
    }
  }
}

// Naviga tutorial
function nextTutorialStep() {
  if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
    currentTutorialStep++;
    updateTutorialContent();
  } else {
    completeTutorial();
  }
}

function prevTutorialStep() {
  if (currentTutorialStep > 0) {
    currentTutorialStep--;
    updateTutorialContent();
  }
}

// Chiude tutorial
function closeTutorial() {
  closeModal('#tutorialModal');
}

// Salta tutorial
function skipTutorial() {
  completeTutorial();
}

// Completa tutorial
function completeTutorial() {
  localStorage.setItem(TUTORIAL_KEY, 'true');
  closeModal('#tutorialModal');
  showToast('🎉 Tutorial completato! Buona partita!');
}

// =============================================================================
// SISTEMA DI GESTIONE UTENTE E SALVATAGGIO PARTITE
// =============================================================================

// Carica i dati utente dal localStorage
function loadUserData() {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    currentUser = JSON.parse(userData);
    updateUserAreaDisplay();
  }
}

// Aggiorna la visualizzazione dell'area personale
function updateUserAreaDisplay() {
  if (currentUser) {
    $("#loginSection").style.display = "none";
    $("#userDataSection").style.display = "block";
    $("#userName").textContent = currentUser.name || currentUser.email;
    
    // Carica statistiche
    const stats = currentUser.stats || { gamesPlayed: 0, gamesWon: 0, believerWins: 0, fcWins: 0 };
    $("#statGamesPlayed").textContent = stats.gamesPlayed;
    $("#statGamesWon").textContent = stats.gamesWon;
    $("#statBelieverWins").textContent = stats.believerWins;
    $("#statFCWins").textContent = stats.fcWins;
    
    // Carica partite salvate
    loadSavedGamesList();
  } else {
    $("#loginSection").style.display = "block";
    $("#userDataSection").style.display = "none";
  }
}

// Gestisce il login (simulato - in produzione usare API)
function handleLogin() {
  const email = $("#loginEmail").value.trim();
  const password = $("#loginPassword").value.trim();
  
  if (!email || !password) {
    showToast("Inserisci email e password");
    return;
  }
  
  // Simulazione login (in produzione: chiamata API)
  currentUser = {
    email: email,
    name: email.split('@')[0],
    provider: 'email',
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      believerWins: 0,
      fcWins: 0
    },
    savedGames: []
  };
  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUserAreaDisplay();
  showToast(`Benvenuto, ${currentUser.name}!`);
}

// Gestisce il login con Google
function handleGoogleLogin() {
  showToast("🔄 Connessione con Google...");
  
  // Simulazione OAuth Google (in produzione: usa Firebase Auth o OAuth 2.0)
  setTimeout(() => {
    currentUser = {
      email: "user@gmail.com",
      name: "Utente Google",
      provider: 'google',
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        believerWins: 0,
        fcWins: 0
      },
      savedGames: []
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserAreaDisplay();
    showToast(`✅ Connesso con Google come ${currentUser.name}!`);
  }, 1000);
}

// Gestisce il login con GitHub
function handleGithubLogin() {
  showToast("🔄 Connessione con GitHub...");
  
  // Simulazione OAuth GitHub (in produzione: usa GitHub OAuth App)
  setTimeout(() => {
    currentUser = {
      email: "user@github.com",
      name: "Utente GitHub",
      provider: 'github',
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        believerWins: 0,
        fcWins: 0
      },
      savedGames: []
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserAreaDisplay();
    showToast(`✅ Connesso con GitHub come ${currentUser.name}!`);
  }, 1000);
}

// Gestisce il logout
function handleLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUserAreaDisplay();
  showToast("Disconnesso con successo");
}

// Salva la partita corrente
function saveCurrentGame() {
  if (!currentUser) {
    showToast("Devi effettuare il login per salvare le partite");
    return;
  }
  
  const gameSave = {
    id: Date.now(),
    date: new Date().toISOString(),
    day: state.currentDay,
    playerTeam: playerTeam,
    nodes: state.nodes,
    links: state.links,
    daily: state.daily,
    stats: {
      believers: state.nodes.filter(n => n.scientificState === 'B').length,
      factCheckers: state.nodes.filter(n => n.scientificState === 'FC').length,
      susceptibles: state.nodes.filter(n => n.scientificState === 'S').length
    }
  };
  
  if (!currentUser.savedGames) currentUser.savedGames = [];
  currentUser.savedGames.push(gameSave);
  
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  loadSavedGamesList();
  showToast("Partita salvata con successo!");
}

// Carica la lista delle partite salvate
function loadSavedGamesList() {
  const container = $("#savedGamesList");
  if (!currentUser || !currentUser.savedGames || currentUser.savedGames.length === 0) {
    container.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 20px;">Nessuna partita salvata</p>';
    return;
  }
  
  container.innerHTML = currentUser.savedGames.map(game => {
    const date = new Date(game.date).toLocaleString('it-IT');
    const teamIcon = game.playerTeam === 'believer' ? '🔴' : '🟢';
    return `
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; color: #1e293b;">${teamIcon} Partita - Giorno ${game.day}/7</div>
          <div style="font-size: 12px; color: #64748b;">${date}</div>
        </div>
        <button class="ghost" onclick="loadSavedGame(${game.id})" style="font-size: 12px; padding: 6px 12px;">Carica</button>
      </div>
    `;
  }).join('');
}

// Carica una partita salvata
window.loadSavedGame = function(gameId) {
  const game = currentUser.savedGames.find(g => g.id === gameId);
  if (!game) return;
  
  state.currentDay = game.day;
  state.nodes = game.nodes;
  state.links = game.links;
  state.daily = game.daily;
  playerTeam = game.playerTeam;
  
  renderGraph();
  updateKPI();
  closeModal("#userAreaModal");
  showToast("Partita caricata!");
};

// Mostra una notizia casuale dal database
function showNewsChoice() {
  currentNews = NEWS_DATABASE[Math.floor(Math.random() * NEWS_DATABASE.length)];
  
  $("#newsTitle").textContent = currentNews.title.toUpperCase();
  $("#newsText").textContent = currentNews.text;
  $("#newsSource").textContent = currentNews.source.toUpperCase();
  
  openModal("#newsChoiceModal");
}

// Gestisce la scelta dell'utente
async function handleNewsChoice(userChoice) {
  // userChoice: 'fake' o 'truth'
  const correct = (userChoice === 'fake' && currentNews.isFake) || 
                  (userChoice === 'truth' && !currentNews.isFake);
  
  if (userChoice === 'fake') {
    playerTeam = 'believer';
    showToast(`Hai scelto FAKE! Interpreterai il team dei Believer 🔴`);
  } else {
    playerTeam = 'fact_checker';
    showToast(`Hai scelto VERA! Interpreterai il team dei Fact-Checker 🟢`);
  }
  
  closeModal("#newsChoiceModal");
  
  // Avvia la simulazione
  await initializeGame();
}

// =============================================================================
// FUNZIONI GESTIONE POWER-UPS
// =============================================================================

// Mostra i power-up del team selezionato
function showTeamPowerups() {
  console.log("🎮 showTeamPowerups chiamato - playerTeam:", playerTeam, "selectedMode:", selectedMode);
  
  // Se siamo in modalità simulazione, nascondi tutti i power-up
  if (selectedMode === "simulazione") {
    const panel = $("#teamPowerupsPanel");
    if (panel) {
      panel.style.display = "none";
    }
    console.log("🔬 Modalità simulazione: power-up nascosti");
    return;
  }
  
  const panel = $("#teamPowerupsPanel");
  const believerPowerups = $("#believerPowerups");
  const fcPowerups = $("#factCheckerPowerups");
  
  if (!panel || !believerPowerups || !fcPowerups) {
    console.error("❌ Elementi power-up non trovati nel DOM");
    return;
  }
  
  // Nascondi il messaggio di benvenuto iniziale
  const welcomeDiv = document.querySelector("#gameBasePanel > div[style*='min-height: 400px']");
  if (welcomeDiv) {
    welcomeDiv.style.display = "none";
  }
  
  panel.style.display = "block";
  
  if (playerTeam === 'believer') {
    believerPowerups.style.display = "block";
    fcPowerups.style.display = "none";
    console.log("✅ Mostrati power-up Believer");
  } else if (playerTeam === 'fact_checker') {
    believerPowerups.style.display = "none";
    fcPowerups.style.display = "block";
    console.log("✅ Mostrati power-up Fact-Checker");
  }
  
  updateBudgetDisplay();
  updatePowerupButtons();
}

// Aggiorna display budget
function updateBudgetDisplay() {
  // In modalità simulazione non mostrare il budget
  if (selectedMode === "simulazione") {
    return;
  }
  
  $("#playerBudget").textContent = playerState.budget;
  const turnsLeft = playerState.budgetRechargeTurns - playerState.budgetRechargeCounter;
  $("#budgetRechargeTimer").textContent = turnsLeft > 0 ? `${turnsLeft} turni` : "Pronto!";
}

// Attiva un power-up
function activatePowerup(powerupId) {
  const powerup = POWERUPS[powerupId];
  
  if (!powerup) {
    console.error(`Power-up ${powerupId} non trovato`);
    return;
  }
  
  // Verifica team
  if (powerup.team !== playerTeam) {
    showToast("⚠️ Questo power-up non è disponibile per il tuo team!");
    return;
  }
  
  // Verifica budget
  if (playerState.budget < powerup.cost) {
    showToast("💰 Budget insufficiente!");
    return;
  }
  
  // Verifica se già attivo
  const alreadyActive = playerState.activePowerups.find(p => p.id === powerupId);
  if (alreadyActive) {
    showToast("⚠️ Power-up già attivo!");
    return;
  }
  
  // Sottrai costo
  playerState.budget -= powerup.cost;
  
  // Traccia uso power-up
  trackPowerupUsage(powerupId);
  
  // Aggiungi ai power-up attivi
  const effect = powerup.apply();
  playerState.activePowerups.push({
    id: powerupId,
    name: powerup.name,
    turnsLeft: powerup.duration,
    effect: effect
  });
  
  // Gestione effetti immediati
  if (effect.instantConversion) {
    convertRandomNeighborToFC();
  }
  
  // Effetto iniziale (per power-up EMERGENZA)
  if (effect.initialEffect) {
    applyPowerupEffect(effect.initialEffect);
  }
  
  // Effetto conversione forzata (per Fake Burst)
  if (effect.forceConvert) {
    applyPowerupEffect(effect.forceConvert);
  }
  
  showToast(`✅ ${powerup.name} attivato!`);
  updateBudgetDisplay();
  updateActivePowerupsDisplay();
  updatePowerupButtons();
}

// Converti un vicino casuale in Fact-Checker (per "Parla con un Amico")
function convertRandomNeighborToFC() {
  // Trova tutti i nodi FC del giocatore
  const fcNodes = state.nodes.filter(n => n.scientificState === 'FC');
  if (fcNodes.length === 0) return;
  
  // Scegli un FC casuale
  const randomFC = fcNodes[Math.floor(Math.random() * fcNodes.length)];
  
  // Trova tutti i vicini Susceptible o Believer
  const neighbors = state.links
    .filter(l => l.source.id === randomFC.id || l.target.id === randomFC.id)
    .map(l => l.source.id === randomFC.id ? l.target : l.source)
    .filter(n => n.scientificState !== 'FC');
  
  if (neighbors.length === 0) {
    showToast("ℹ️ Nessun vicino da convertire");
    return;
  }
  
  // Converti un vicino casuale
  const targetNode = neighbors[Math.floor(Math.random() * neighbors.length)];
  targetNode.scientificState = 'FC';
  targetNode.role = 'fact_checker';
  targetNode.memory = 'truth';
  
  // Aggiorna visualizzazione
  if (typeof gNodes !== 'undefined') {
    gNodes.selectAll("path")
      .filter(d => d.id === targetNode.id)
      .attr('fill', nodeColor(targetNode));
  }
  
  updateKPI();
  showToast(`💬 Convertito nodo #${targetNode.id} in Fact-Checker!`);
}

// Applica effetto power-up sui nodi
function applyPowerupEffect(effect) {
  const { target, count, from, percentage } = effect;
  
  console.log(`⚡ Applicazione effetto: ${from}→${target}, count: ${count}, percentage: ${percentage}`);
  
  // Trova nodi sorgente
  let sourceNodes = state.nodes.filter(n => n.scientificState === from);
  
  console.log(`📊 Nodi ${from} disponibili: ${sourceNodes.length}`);
  
  if (sourceNodes.length === 0) {
    console.log("⚠️ Nessun nodo da convertire");
    showToast(`⚠️ Nessun nodo ${from} disponibile`);
    return;
  }
  
  // Calcola quanti nodi convertire
  let nodesToConvert = percentage ? 
    Math.floor(sourceNodes.length * count) : 
    Math.min(count, sourceNodes.length);
  
  console.log(`🎯 Nodi da convertire: ${nodesToConvert}`);
  
  // Shuffle e prendi i primi N nodi
  const shuffled = sourceNodes.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, nodesToConvert);
  
  // Converti i nodi con animazione
  selected.forEach(node => {
    const oldState = node.scientificState;
    node.scientificState = target;
    node.role = target === 'B' ? 'believer' : 
                target === 'FC' ? 'fact_checker' : 
                'susceptible';
    node.memory = target === 'B' ? 'fake' : 
                  target === 'FC' ? 'truth' : 
                  'neutral';
    
    console.log(`  ✓ Nodo ${node.id}: ${oldState} → ${target}`);
    
    // Animazione flash sul nodo
    animateNodePowerup(node.id, target);
  });
  
  // Aggiorna visualizzazione
  if (typeof gNodes !== 'undefined') {
    gNodes.selectAll("path")
      .attr("d", d => {
        // Aggiorna forma in base allo stato
        if (d.scientificState === 'S' || d.role === 'susceptible') {
          return d3.symbol().type(d3.symbolCircle).size(100)();
        } else if (d.scientificState === 'B' || d.role === 'believer') {
          return d3.symbol().type(d3.symbolSquare).size(100)();
        } else if (d.scientificState === 'FC' || d.role === 'fact_checker') {
          return d3.symbol().type(d3.symbolDiamond).size(100)();
        }
      });
  }
  
  updateKPI();
  
  const targetName = target === 'B' ? 'Believer' : target === 'FC' ? 'Fact-Checker' : 'Susceptible';
  showToast(`⚡ Convertiti ${nodesToConvert} nodi in ${targetName}!`);
  console.log(`✅ Conversione completata: ${nodesToConvert} nodi ${from}→${target}`);
}

// Animazione flash sui nodi affetti da power-up
function animateNodePowerup(nodeId, targetState) {
  if (typeof gNodes === 'undefined') return;
  
  const nodeSelection = gNodes.selectAll("path").filter(d => d.id === nodeId);
  
  if (nodeSelection.empty()) return;
  
  // Flash animation con colore in base al target
  const flashColor = targetState === 'B' ? '#fbbf24' : 
                     targetState === 'FC' ? '#22c55e' : 
                     '#94a3b8';
  
  nodeSelection
    .transition().duration(150)
    .attr('stroke', flashColor)
    .attr('stroke-width', 4)
    .transition().duration(150)
    .attr('stroke', flashColor)
    .attr('stroke-width', 6)
    .transition().duration(300)
    .attr('stroke', 'rgba(0,0,0,0.3)')
    .attr('stroke-width', 1);
  
  // Particelle esplosive
  createParticles(nodeSelection.datum(), flashColor);
  
  // Suono feedback (se audio attivo)
  playPowerupSound(targetState);
}

// Crea effetto particelle esplosive
function createParticles(node, color) {
  if (!node.x || !node.y) return;
  
  const particleCount = 8;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const particle = svg.append('circle')
      .attr('cx', node.x)
      .attr('cy', node.y)
      .attr('r', 3)
      .attr('fill', color)
      .attr('opacity', 0.8);
    
    particle
      .transition()
      .duration(600)
      .ease(d3.easeQuadOut)
      .attr('cx', node.x + Math.cos(angle) * 30)
      .attr('cy', node.y + Math.sin(angle) * 30)
      .attr('r', 0)
      .attr('opacity', 0)
      .remove();
  }
}

// Riproduce suono feedback power-up
function playPowerupSound(targetState) {
  // Verifica se audio è attivo
  const audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
  if (!audioEnabled) return;
  
  // Crea oscillatore per suono sintetico
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Frequenze diverse per stati diversi
  const frequency = targetState === 'B' ? 440 : 
                   targetState === 'FC' ? 554 : 
                   330;
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Aggiorna display power-up attivi
function updateActivePowerupsDisplay() {
  const display = $("#activePowerupsDisplay");
  const list = $("#activePowerupsList");
  
  if (playerState.activePowerups.length === 0) {
    display.style.display = "none";
    return;
  }
  
  display.style.display = "block";
  list.innerHTML = playerState.activePowerups.map(p => 
    `<div>• ${p.name} (${p.turnsLeft} turni rimasti)</div>`
  ).join('');
}

// Aggiorna stato bottoni power-up (disabilita se già attivi o budget insufficiente)
function updatePowerupButtons() {
  // In modalità simulazione non aggiornare i bottoni power-up
  if (selectedMode === "simulazione") {
    return;
  }
  
  // Mapping manuale degli ID (perché i nomi non seguono una convenzione uniforme)
  const buttonMap = {
    fakeBurst: 'btnFakeBurst',
    payInfluencer: 'btnPayInfluencer',
    emergencyBeliever: 'btnEmergencyBeliever',
    talkFriend: 'btnTalkFriend',
    nationalDebunk: 'btnNationalDebunk',
    emergencyFC: 'btnEmergencyFC'
  };
  
  Object.keys(POWERUPS).forEach(powerupId => {
    const btnId = buttonMap[powerupId];
    if (!btnId) return;
    
    const btn = $(`#${btnId}`);
    if (!btn) return;
    
    const powerup = POWERUPS[powerupId];
    const canAfford = playerState.budget >= powerup.cost;
    const alreadyActive = playerState.activePowerups.find(p => p.id === powerupId);
    
    btn.disabled = !canAfford || alreadyActive;
  });
}

// Decrementa durata power-up attivi e rimuovi quelli scaduti
function updateActivePowerups() {
  // In modalità simulazione non aggiornare i power-up
  if (selectedMode === "simulazione") {
    return;
  }
  
  console.log(`🎮 updateActivePowerups - Power-up attivi: ${playerState.activePowerups.length}`);
  
  playerState.activePowerups.forEach(p => {
    console.log(`  ⚡ ${p.name} - Turni rimasti: ${p.turnsLeft}`);
    
    // Applica effetto per turno prima di decrementare
    if (p.effect.convertPerTurn) {
      console.log(`  🔄 Applicazione effetto per turno di: ${p.name}`);
      applyPowerupEffect(p.effect.convertPerTurn);
    }
  });
  
  playerState.activePowerups = playerState.activePowerups.filter(p => {
    p.turnsLeft--;
    if (p.turnsLeft <= 0) {
      showToast(`⏱️ ${p.name} è scaduto`);
      console.log(`⏱️ Power-up scaduto: ${p.name}`);
      return false;
    }
    return true;
  });
  
  updateActivePowerupsDisplay();
  updatePowerupButtons();
}

// Aggiorna contatore ricarica budget
function updateBudgetRecharge() {
  // In modalità simulazione non aggiornare il budget
  if (selectedMode === "simulazione") {
    return;
  }
  
  playerState.budgetRechargeCounter++;
  
  if (playerState.budgetRechargeCounter >= playerState.budgetRechargeTurns) {
    playerState.budget += 150; // Ricarica di 150 ogni 3 turni
    playerState.budgetRechargeCounter = 0;
    showToast("💰 Budget ricaricato! +150");
  }
  
  updateBudgetDisplay();
}

// Calcola il totale di power-up usati
function calculatePowerupsUsed() {
  // Traccia il numero di power-up usati (500 budget iniziale - budget attuale - ricariche)
  const recharges = Math.floor(state.currentDay / playerState.budgetRechargeTurns) * 150;
  const totalAvailable = 500 + recharges;
  const spent = totalAvailable - playerState.budget;
  
  // Stima numero di power-up (media costo ~150)
  return Math.floor(spent / 150);
}

// Mostra modale di fine gioco con risultati
function showGameEndModal(victory, reason, stats) {
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.id = 'gameEndModal';
  modal.style.cssText = 'display: flex; align-items: center; justify-content: center;';
  
  const emoji = victory ? '🎉' : '😔';
  const title = victory ? 'VITTORIA!' : 'SCONFITTA';
  const color = victory ? '#22c55e' : '#ef4444';
  const teamName = playerTeam === 'believer' ? 'Believer 🔴' : 'Fact-Checker 🟢';
  
  modal.innerHTML = `
    <div class="modal-card" style="max-width: 600px; text-align: center;">
      <div style="font-size: 80px; margin-bottom: 20px;">${emoji}</div>
      <h2 style="font-size: 48px; color: ${color}; margin: 0 0 16px 0; font-weight: 800; text-shadow: 0 2px 12px ${color}50;">
        ${title}
      </h2>
      <div style="font-size: 18px; color: #cbd5e1; margin-bottom: 32px;">
        ${reason}
      </div>
      
      <div style="background: rgba(15,23,42,0.6); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <div style="font-size: 14px; color: #94a3b8; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">
          Statistiche Partita
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div style="background: rgba(239,68,68,0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(239,68,68,0.3);">
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Believer</div>
            <div style="font-size: 32px; font-weight: 800; color: #ef4444;">${stats.believerPerc}%</div>
          </div>
          
          <div style="background: rgba(34,197,94,0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(34,197,94,0.3);">
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Fact-Checker</div>
            <div style="font-size: 32px; font-weight: 800; color: #22c55e;">${stats.fcPerc}%</div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 14px;">
          <div>
            <div style="color: #64748b;">Il tuo team</div>
            <div style="color: #e2e8f0; font-weight: 600; margin-top: 4px;">${teamName}</div>
          </div>
          <div>
            <div style="color: #64748b;">Turni giocati</div>
            <div style="color: #e2e8f0; font-weight: 600; margin-top: 4px;">${stats.turns}/${CONST.MAX_TURNS}</div>
          </div>
          <div>
            <div style="color: #64748b;">Budget speso</div>
            <div style="color: #e2e8f0; font-weight: 600; margin-top: 4px;">${stats.budgetSpent}💰</div>
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="closeGameEndModal(); location.reload();" class="primary" style="padding: 16px 32px; font-size: 16px; font-weight: 600;">
          🔄 Nuova Partita
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Play sound effect (se disponibile)
  if (victory) {
    showToast('🎉 HAI VINTO!');
  } else {
    showToast('😔 Hai perso...');
  }
}

// Chiudi modale fine gioco
function closeGameEndModal() {
  const modal = document.getElementById('gameEndModal');
  if (modal) {
    modal.remove();
  }
}

// Calcola i moltiplicatori dai power-up attivi
// Fix: Definisci renderAchievementsUI se non esiste, per evitare ReferenceError
if (typeof window.renderAchievementsUI !== 'function') {
  window.renderAchievementsUI = function() {};
}

// =============================================================================
// INIZIALIZZAZIONE APPLICAZIONE
// Carica le impostazioni salvate e i dati utente
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mostra tutorial per nuovi utenti o se richiesto via URL
  const urlParams = new URLSearchParams(window.location.search);
  const forceTutorial = urlParams.get('tutorial') === 'true';
  
  if (shouldShowTutorial() || forceTutorial) {
    setTimeout(() => showTutorial(), 500);
  }
  
  // Event listeners tutorial
  document.getElementById('btnTutorialNext')?.addEventListener('click', nextTutorialStep);
  document.getElementById('btnTutorialPrev')?.addEventListener('click', prevTutorialStep);
  document.getElementById('btnSkipTutorial')?.addEventListener('click', skipTutorial);
  
  // Carica impostazioni accessibilità
  const highContrast = localStorage.getItem("highContrast") === "true";
  const largeText = localStorage.getItem("largeText") === "true";
  const reduceMotion = localStorage.getItem("reduceMotion") === "true";
  
  if (highContrast) {
    document.body.classList.add("high-contrast");
    if ($("#highContrastMode")) $("#highContrastMode").checked = true;
  }
  if (largeText) {
    document.body.classList.add("large-text");
    if ($("#largeTextMode")) $("#largeTextMode").checked = true;
  }
  if (reduceMotion) {
    document.body.classList.add("reduce-motion");
    if ($("#reduceMotionMode")) $("#reduceMotionMode").checked = true;
  }
  
  // Carica impostazioni audio
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  const volume = localStorage.getItem("volume") || "70";
  if ($("#soundEnabled")) $("#soundEnabled").checked = soundEnabled;
  if ($("#volumeSlider")) $("#volumeSlider").value = volume;
  
  // Carica e applica modalità daltonismo
  const colorblindSelector = document.getElementById('colorblindMode');
  if (colorblindSelector) {
    const savedMode = localStorage.getItem('colorblindMode') || 'normal';
    colorblindSelector.value = savedMode;
    currentColorMode = savedMode;
    
    colorblindSelector.addEventListener('change', () => {
      currentColorMode = colorblindSelector.value;
      localStorage.setItem('colorblindMode', currentColorMode);
      
      // Ricolorazione immediata di tutti i nodi
      if (state && state.nodes) {
        // Usa gNodes.selectAll("path") per selezionare tutti i path dei nodi
        if (typeof gNodes !== 'undefined') {
          gNodes.selectAll("path")
            .attr('fill', d => nodeColor(d));
        }
        
        // Aggiorna anche la legenda
        d3.select('#legend-eternal').attr('fill', getColorForState('eternal'));
      }
    });
  }
  
  // Carica dati utente
  loadUserData();
});

// =============================================================================
// COSTANTI GLOBALI DEL SISTEMA
// Parametri invarianti che definiscono i vincoli temporali e le soglie
// del modello di simulazione epidemiologica della disinformazione.
// =============================================================================
const CONST = {
  DAYS: 999, // Nessun limite fisso - usa stop automatico o manuale
  FORGET_DAYS: 3,
  NEIGHBOR_THR: 0.4,
  SOURCES: { Facebook:0.7, Fanpage:0.6, AIFA:1.0, Reuters:0.95, BlogX:0.35 },
  // Condizioni di stop automatico
  CONVERGENCE_STEPS: 3, // Nessun cambiamento per N step consecutivi
  SATURATION_THRESHOLD: 0.85, // 85% di dominanza = stop
  // Condizioni vittoria per modalità "Scegli il Lato"
  WIN_PERCENTAGE: 0.70, // 70% per vincere
  MAX_TURNS: 51 // Limite massimo di turni
};

// =============================================================================
// SISTEMA DI ACHIEVEMENT (TROFEI)
// Meccanismo di gamification per incentivare l'esplorazione delle dinamiche
// di diffusione dell'informazione attraverso obiettivi progressivi.
// =============================================================================
const TROPHY_SYSTEM = {
  trophies: [
    // Trofei Fake News
    { id: 'fake_rising', name: '🔴 Maestro della Disinformazione', desc: 'Fake news > 70%', icon: '🎯', unlocked: false, category: 'fake' },
    { id: 'fake_dominance', name: '🔴 Dominio Totale', desc: 'Fake news > 85%', icon: '👑', unlocked: false, category: 'fake' },
    { id: 'fake_viral', name: '🔴 Virus Digitale', desc: 'Usa Fake Virus 5 volte', icon: '🦠', unlocked: false, category: 'fake' },
    { id: 'fake_saboteur', name: '🔴 Sabotatore Supremo', desc: 'Sabota CPU 3 volte', icon: '💣', unlocked: false, category: 'fake' },
    { id: 'fake_thief', name: '🔴 Ladro di Monete', desc: 'Ruba 300 monete dal CPU', icon: '💰', unlocked: false, category: 'fake' },
    
    // Trofei Verità
    { id: 'truth_rising', name: '🟢 Difensore della Verità', desc: 'Verità > 70%', icon: '🛡️', unlocked: false, category: 'truth' },
    { id: 'truth_dominance', name: '🟢 Bastione della Verità', desc: 'Verità > 85%', icon: '🏰', unlocked: false, category: 'truth' },
    { id: 'truth_debunker', name: '🟢 Debunker Supremo', desc: 'Usa Mass Debunk 5 volte', icon: '🔬', unlocked: false, category: 'truth' },
    { id: 'truth_guardian', name: '🟢 Guardiano della Rete', desc: 'Aggiungi 10 Eternal FC', icon: '🚨', unlocked: false, category: 'truth' },
    { id: 'truth_prophecy', name: '🟢 Profeta Accurato', desc: 'Previsioni corrette 3 volte', icon: '🔮', unlocked: false, category: 'truth' },
    
    // Trofei Competitivi
    { id: 'comp_victor', name: '⚔️ Vittoria Gloriosa', desc: 'Vinci una partita competitiva', icon: '🏆', unlocked: false, category: 'competitive' },
    { id: 'comp_streak', name: '⚔️ Vincitore Seriale', desc: 'Vinci 3 partite consecutive', icon: '🌟', unlocked: false, category: 'competitive' },
    { id: 'comp_riches', name: '💰 Ricco Sfondato', desc: 'Accumula 1000 monete', icon: '💎', unlocked: false, category: 'competitive' },
    { id: 'comp_strategist', name: '🧠 Stratega Geniale', desc: 'Usa 15 diversi boost/campaign', icon: '♟️', unlocked: false, category: 'competitive' },
    
    // Trofei Exploration
    { id: 'all_modes', name: '🎮 Onnivoro di Modalità', desc: 'Gioca tutte e 3 le modalità', icon: '🎲', unlocked: false, category: 'exploration' },
    { id: 'speedrun', name: '⚡ Velocista', desc: 'Completa 7 giorni in <2 minuti', icon: '🚀', unlocked: false, category: 'exploration' },
    { id: 'perfect_balance', name: '⚖️ Equilibrista', desc: 'Fake ≈ Verità (40-60% ciascuno)', icon: '⚖️', unlocked: false, category: 'exploration' },
    
    // Trofei Rari
    { id: 'chaos_master', name: '🌀 Maestro del Caos', desc: 'Inverti trend 3 giorni consecutivi', icon: '🌪️', unlocked: false, category: 'rare' },
    { id: 'memory_master', name: '🧠 Amnesia Totale', desc: 'Usa Memory Wipe 5 volte', icon: '🧊', unlocked: false, category: 'rare' },
    { id: 'network_god', name: '🔗 Dio della Rete', desc: 'Modifica ρ tra 0.5 e 1 ogni giorno', icon: '⚡', unlocked: false, category: 'rare' },
    { id: 'timing_master', name: '⏰ Maestro del Timing', desc: 'Usa tutte le 5 boosts in una sessione', icon: '⏱️', unlocked: false, category: 'rare' }
  ],
  stats: {
    fakesWon: 0,
    truthsWon: 0,
    competitiveVictories: 0,
    boostsUsed: {},
    fakeVirusCount: 0,
    massDebunkCount: 0,
    memoryWipeCount: 0,
    eternalFCCount: 0,
    sabotageCount: 0,
    stealCount: 0,
    predictionsCorrect: 0,
    maxCoins: 0,
    modesPlayed: new Set()
  },
  unlock: function(trophyId) {
    const trophy = this.trophies.find(t => t.id === trophyId);
    if (trophy && !trophy.unlocked) {
      trophy.unlocked = true;
      showToast(`🏆 Trofeo sbloccato: ${trophy.name}`);
      return true;
    }
    return false;
  },
  checkUnlocks: function() {
    // Verifica di tutti i trofei in base alle statistiche accumulate
    const s = this.stats;
    const c = computeCounts && computeCounts() || {};
    const tot = state.nodes ? state.nodes.length : 1;
    const fakePct = pct(c.fake, tot);
    const truthPct = pct(c.truth, tot);
    
    // Trofei Disinformazione (Fake News)
    if (fakePct > 70) this.unlock('fake_rising');
    if (fakePct > 85) this.unlock('fake_dominance');
    if (s.fakeVirusCount >= 5) this.unlock('fake_viral');
    if (s.sabotageCount >= 3) this.unlock('fake_saboteur');
    if (s.stealCount >= 3) this.unlock('fake_thief');
    
    // Trofei Verita (Fact-Checking)
    if (truthPct > 70) this.unlock('truth_rising');
    if (truthPct > 85) this.unlock('truth_dominance');
    if (s.massDebunkCount >= 5) this.unlock('truth_debunker');
    if (s.eternalFCCount >= 10) this.unlock('truth_guardian');
    if (s.predictionsCorrect >= 3) this.unlock('truth_prophecy');
    
    // Trofei Competitivi
    if (s.competitiveVictories >= 1) this.unlock('comp_victor');
    if (s.competitiveVictories >= 3) this.unlock('comp_streak');
    if (s.maxCoins >= 1000) this.unlock('comp_riches');
    if (Object.keys(s.boostsUsed).length >= 15) this.unlock('comp_strategist');
    
    // Trofei Esplorazione
    if (s.modesPlayed.size >= 3) this.unlock('all_modes');
    if (Math.abs(fakePct - truthPct) <= 10 && fakePct > 30) this.unlock('perfect_balance');
    
    // Trofei Rari
    if (s.memoryWipeCount >= 5) this.unlock('memory_master');
  }
};

// =============================================================================
// GESTORE DEI POTENZIAMENTI (BOOST MANAGER)
// Classe responsabile della gestione centralizzata degli effetti temporanei
// che modificano i parametri della simulazione per periodi limitati.
// Implementa il pattern Observer per notificare lo stato dei boost attivi.
// =============================================================================
class BoostManager {
  constructor() {
    this.boosts = {};
  }
  activate(boostId, daysLeft = 1, multiplier = 1.5, data = {}) {
    this.boosts[boostId] = { active: true, daysLeft, multiplier, ...data };
  }
  isActive(boostId) {
    return this.boosts[boostId] && this.boosts[boostId].active;
  }
  deactivate(boostId) {
    if(this.boosts[boostId]) this.boosts[boostId].active = false;
  }
  getActive() {
    return Object.entries(this.boosts).filter(([k,v]) => v.active).map(([k]) => k);
  }
  tickDay() {
    for(const k in this.boosts) {
      if(this.boosts[k].active && this.boosts[k].daysLeft > 0) {
        this.boosts[k].daysLeft--;
        if(this.boosts[k].daysLeft === 0) this.boosts[k].active = false;
      }
    }
  }
  clear() {
    for(const k in this.boosts) this.boosts[k].active = false;
  }
}

// =============================================================================
// AVVERSARIO CONTROLLATO DALL'INTELLIGENZA ARTIFICIALE
// Implementazione di un agente autonomo che compete contro il giocatore
// nella modalita competitiva. L'algoritmo decisionale si basa su euristiche
// che valutano lo stato corrente della rete e le risorse disponibili.
// =============================================================================
class CPUOpponent {
  constructor(difficulty = 'beginner') {
    this.coins = 400;
    this.difficulty = difficulty; // Livelli: beginner, expert, extreme
    this.boostMgr = new BoostManager();
    this.lastFakeCount = 0;
    this.lastTruthCount = 0;
    this.moveCount = 0;
  }
  
  makeMove(playerFakePct, playerTruthPct, networkTotalNodes) {
    // Difficoltà influenza decisioni
    const aggression = { beginner: 0.3, expert: 0.6, extreme: 0.95 }[this.difficulty] || 0.5;
    
    if(this.coins < 50) return null; // Non ha risorse
    
    // Logica: se il giocatore sta vincendo, contrattacca
    if(playerTruthPct > 60 && Math.random() < aggression){
      // Spendi su FakeVirus per aumentare spread
      if(this.coins >= 100){
        this.coins -= 100;
        this.boostMgr.activate('fakeVirus', 1, 1.5);
        return { type: 'boost', name: 'fakeVirus', cost: 100 };
      }
    }
    
    // Altrimenti se il giocatore ha poche fake, incrementa
    if(playerFakePct < 40 && Math.random() < aggression * 0.7){
      if(this.coins >= 100){
        this.coins -= 100;
        this.boostMgr.activate('fakeVirus', 1, 1.5);
        return { type: 'boost', name: 'fakeVirus', cost: 100 };
      }
    }
    
    // Strategia conservativa: posiziona su community gullible
    if(this.coins >= 60 && Math.random() < 0.4){
      this.coins -= 60;
      return { type: 'campaign', target: 'gullible', cost: 60 };
    }
    
    return null;
  }
}

// =============================================================================
// STATO GLOBALE DELL'APPLICAZIONE
// Struttura dati centralizzata che mantiene lo stato corrente della simulazione,
// inclusi i nodi del grafo, gli archi, lo storico giornaliero e i parametri
// del modello scientifico. Questo oggetto rappresenta la singola fonte di verita
// per l'intera applicazione (pattern Single Source of Truth).
// =============================================================================
const state = {
  appName: "Giancarlo Ruffo",
  // Invariante: currentDay indica il PROSSIMO giorno da simulare (inizia da 1)
  currentDay: 1,
  nodes: [],
  links: [],
  daily: [],
  timeline: [],
  chart: null,
  // Tracking per stop automatico
  simulation: {
    running: false,
    stepsWithoutChanges: 0,
    previousStateHash: null,
    manualStop: false
  },
  scientificModel: {
    enabled: false,  // Attiva il modello scientifico S-B-F
    segregationMetrics: {}  // Metriche di segregazione rete
  },
  // Stato del sistema di gioco - Modalita Strategica e Competitiva
  game: {
    coins: 500,
    movesLeft: 3,
    boostMgr: new BoostManager(),  // Centralizzato - INIZIALIZZATO SUBITO
    campaign: { active: null, targetCommunity: null, multiplier: 1, daysLeft: 0 },
    achievements: [],  // array di unlock
    cpuOpponent: null,  // { coins, strategy, difficultyLevel, boostMgr }
    battleWarsUsedToday: false,  // limite 1/giorno
    predictiveChart: null,  // cache chart previsioni
    movesPerDay: 3,
    totalDaysPlayed: 0
  }
};

// =============================================================================
// CONFIGURAZIONE DEL CANVAS SVG E DEI LAYER DI RENDERING
// Struttura gerarchica degli elementi grafici per la visualizzazione del grafo.
// L'ordine dei layer determina la priorita di rendering (z-index implicito).
// =============================================================================
const svg   = d3.select("#graph");
const root  = svg.append("g");                // Contenitore principale trasformato dallo zoom
const bg    = root.append("rect")             // Sfondo trasparente per intercettare eventi pan/zoom
                 .attr("fill", "transparent")
                 .attr("x", 0).attr("y", 0);
const gLinks= root.append("g").attr("stroke", "#26334a");  // Layer degli archi
const gNodes= root.append("g");                             // Layer dei nodi

let simulation;                               // Riferimento alla simulazione D3 force-directed
let currentNodes = [];                        // Cache dei nodi correnti per aggiornamenti incrementali

// =============================================================================
// FUNZIONI DI UTILITA
// Helper functions per operazioni comuni: selezione DOM, normalizzazione,
// calcolo percentuali e generazione di numeri casuali con distribuzione normale.
// =============================================================================
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const clamp01 = x => Math.max(0, Math.min(1, x));
const pct = (n,t)=> Math.round(n/Math.max(1,t)*100);
function rndNormal(m=0.5,s=0.2){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();const z=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);return clamp01(m+z*s);}



// =============================================================================
// COSTRUZIONE E INIZIALIZZAZIONE DEL GRAFO
// Funzione asincrona che genera il grafo direttamente dall'API backend.
// Il grafo viene creato con un numero di nodi adatto alla visualizzazione
// e i parametri del modello epidemiologico (alpha, beta, p_v, p_f) sono
// determinati dall'API in base alla modalita selezionata.
// =============================================================================

// Configurazione del numero di nodi per la visualizzazione
const GRAPH_CONFIG = {
  numNodes: 120,     // Numero di nodi
  avgDegree: 5,    // Grado medio per comunità ben separate
  clustered: true    // Abilita clustering per comunità visibili
};

async function buildGraph(N=50, useScientificModel=false){
  try {
    // Modalità fissa: "Scegli il Lato" usa sempre modalità "libera" dell'API
    const apiMode = "libera";

    console.log(`🎮 Modalità: Scegli il Lato - API mode: ${apiMode}`);
    console.log(`📊 Generazione grafo: ${GRAPH_CONFIG.numNodes} nodi, grado medio: ${GRAPH_CONFIG.avgDegree}`);

    // Genera il grafo direttamente dall'API invece di caricare graph.json
    const apiResponse = await hoaxClient.generateGraph(
      apiMode, 
      GRAPH_CONFIG.numNodes, 
      GRAPH_CONFIG.avgDegree, 
      GRAPH_CONFIG.clustered
    );

    // Calcola le statistiche dagli stati dei nodi ricevuti dall'API
    const nodeStates = apiResponse.node_states;
    const totalNodes = Object.keys(nodeStates).length;
    const initialBelievers = Object.values(nodeStates).filter(s => s === 'B').length;
    const initialFactCheckers = Object.values(nodeStates).filter(s => s === 'FC').length;
    const initialSusceptible = Object.values(nodeStates).filter(s => s === 'S').length;
    
    // Log dei parametri EFFETTIVI decisi dall'API (calcolati dai risultati)
    console.log(`Risultato dall'API (mode: ${apiMode}):
    - Nodi totali: ${totalNodes}
    - Believers iniziali (B): ${initialBelievers} (${(initialBelievers/totalNodes*100).toFixed(1)}%)
    - Fact-Checkers iniziali (FC): ${initialFactCheckers} (${(initialFactCheckers/totalNodes*100).toFixed(1)}%)
    - Susceptible iniziali (S): ${initialSusceptible} (${(initialSusceptible/totalNodes*100).toFixed(1)}%)`);

    // Converti i dati API nel formato D3 atteso
    state.nodes = Object.entries(apiResponse.node_states).map(([nodeId, nodeState]) => ({
      id: parseInt(nodeId),
      scientificState: nodeState, // S, B, FC
      // Only roles: believer, fact_checker, susceptible
      role: nodeState === 'FC' ? 'fact_checker' : (nodeState === 'B' ? 'believer' : 'susceptible'),
      // Gullibility tra 0.1 e 1 (se non fornita dall'API, random per demo)
      gullibility: apiResponse.gullibility && typeof apiResponse.gullibility[parseInt(nodeId)] === 'number'
        ? apiResponse.gullibility[parseInt(nodeId)]
        : (0.1 + 0.9 * Math.random()),
      memoryTime: 0,
      susceptibility: apiResponse.gullibility && typeof apiResponse.gullibility[parseInt(nodeId)] === 'number'
        ? apiResponse.gullibility[parseInt(nodeId)]
        : (0.1 + 0.9 * Math.random()),
      isEternalFC: false
    }));

    // Converti gli edge
    state.links = apiResponse.edges.map(([src, tgt]) => ({
      source: src,
      target: tgt,
      w: 0.6 + Math.random() * 0.8
    }));

    state.scientificModel.enabled = useScientificModel;
    
    // Salva info base del modello (i parametri reali sono nell'API)
    if (useScientificModel) {
      state.scientificModel.info = {
        mode: apiMode,
        totalNodes: totalNodes,
        initialBelieversCount: initialBelievers,
        initialFactCheckersCount: initialFactCheckers,
        avgDegree: 2 * state.links.length / state.nodes.length
      };
    }
    
    state.gameNodes = state.nodes.slice();
    
    console.log(`Grafo caricato via API: ${state.nodes.length} nodi, ${state.links.length} archi`);
    
    // Aggiorna KPI e conteggi iniziali
    updateKPI();
    
    // Aggiorna il rendering del grafo con i nuovi stati
    if (typeof renderGraph === 'function') {
      renderGraph();
    }
  } catch (error) {
    console.error('Errore buildGraph:', error);
    showToast(`Errore: ${error.message}`);
  }
}

// =============================================================================
// FUNZIONE DI COLORAZIONE DEI NODI
// Mappa lo stato epidemiologico di ciascun nodo al colore corrispondente
// secondo la convenzione visiva del modello SBF (Susceptible-Believer-FactChecker).
// =============================================================================
function colorFill(d){ 
  // Color by gullibility: 1=blue, 0.5=white, 0.01=red
  let gull = typeof d.gullibility === 'number' ? d.gullibility : 0.5;
  gull = Math.max(0.01, Math.min(1, gull));
  function interpColor(val) {
    if (val >= 0.5) {
      // White (255,255,255) to Blue (0,0,255) as val goes from 0.5 to 1
      const t = (val - 0.5) / (1 - 0.5);
      const r = Math.round(255 * (1 - t));
      const g = Math.round(255 * (1 - t));
      const b = 255;
      return `rgb(${r},${g},${b})`;
    } else {
      // Red (255,0,0) to White (255,255,255) as val goes from 0.01 to 0.5
      const t = (val - 0.01) / (0.5 - 0.01);
      const r = 255;
      const g = Math.round(0 + (255 - 0) * t);
      const b = Math.round(0 + (255 - 0) * t);
      return `rgb(${r},${g},${b})`;
    }
  }
  return interpColor(gull);
}


// =============================================================================
// SINCRONIZZAZIONE DELLO STATO CON IL BACKEND (OPERAZIONE PUT)
// Trasmette lo stato epidemiologico di tutti i nodi al server API.
// Questa operazione deve essere invocata dopo modifiche strutturali
// che alterano lo stato della rete (es. debunking massivo, assegnazione
// di Fact-Checker permanenti, applicazione di strategie di immunizzazione).
// =============================================================================
async function syncStateToServer() {
  try {
    if (!state.nodes || state.nodes.length === 0) return;

    const payload = {};
    state.nodes.forEach(n => {
      payload[String(n.id)] = n.scientificState;
    });

    const res = await fetch('http://localhost:8000/api/v1/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`PUT /state failed (${res.status})`);
    }

    console.log('Stato sincronizzato con il backend');
  } catch (err) {
    console.error('Errore syncStateToServer:', err);
    showToast('Errore sincronizzazione con il backend');
  }
}

// =============================================================================
// AGGIORNAMENTO DELLO STATO DAL SERVER (OPERAZIONE GET)
// Recupera lo stato corrente della simulazione dal backend e sincronizza
// la rappresentazione locale. Utile per allineare il frontend dopo
// operazioni eseguite tramite interfacce alternative (es. Swagger UI).
// =============================================================================
async function refreshStateFromServer() {
  try {
    const response = await fetch('http://localhost:8000/api/v1/state');
    if (!response.ok) {
      if (response.status === 404) {
        showToast('⚠️ Nessun grafo sul server. Usa Inizializza prima.');
        return;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const nodeStates = await response.json();
    console.log('Refresh stato dal server:', Object.keys(nodeStates).length, 'nodi');
    
    // Aggiornamento incrementale degli stati dei nodi nella cache locale
    let updated = 0;
    for (const [nodeId, newState] of Object.entries(nodeStates)) {
      const node = state.nodes.find(n => n.id === parseInt(nodeId));
      if (node && node.scientificState !== newState) {
        node.scientificState = newState;
        node.memory = newState === 'B' ? 'fake' : (newState === 'FC' ? 'truth' : 'neutral');
        updated++;
      }
    }
    
    console.log(`Aggiornati ${updated} nodi`);
    
    // Aggiorna grafica
    updateKPI();
    d3.select('#graph').selectAll('circle')
      .attr('fill', d => colorFill(d));
    
    showToast(`🔄 Stato sincronizzato: ${updated} nodi aggiornati`);
  } catch (error) {
    console.error('Errore refresh:', error);
    showToast(`❌ Errore: ${error.message}`);
  }
}

// =============================================================================
// FUNZIONI DI STILE VISIVO PER NODI E ARCHI
// Definiscono l'aspetto grafico degli elementi del grafo in base
// al loro stato epidemiologico e alle proprieta speciali (es. immunita).
// =============================================================================

function colorStroke(d){ 
  // Evidenziazione visiva per i Fact-Checker permanenti (immunita acquisita)
  if (d.isEternalFC) return "#00d4ff";      // Ciano brillante per Fact-Checker permanenti
  return "rgba(255,255,255,0.1)";           // Bordo semi-trasparente per nodi standard
}

function strokeWidth(d) {
  // Spessore del bordo proporzionale all'importanza del nodo
  return d.isEternalFC ? 8 : 0.5;
}

function linkColor(d) {
  // Colore uniforme per gli archi della rete sociale
  return "rgba(255, 255, 255, 0.8)";
}

function linkStrokeWidth(d) {
  // Spessore dell'arco proporzionale al peso della connessione
  return Math.max(2, d.w * 2);
}

// NOTA: graphData e graphDataReady non sono più necessari
// Il grafo viene ora generato direttamente dall'API
let graphData = null;
let graphDataReady = false;

// =============================================================================
// FUNZIONE UNIFICATA DI COLORAZIONE DEI NODI
// Determina il colore di riempimento di un nodo in base alla sua gullibility.
// Il colore è FISSO per ogni nodo e dipende solo dalla gullibility (0.01-1):
// - 0.01 = ROSSO puro (o colore alternativo per daltonismo)
// - 0.5 = BIANCO
// - 1.0 = BLU puro (o colore alternativo per daltonismo)
// La FORMA del nodo cambia in base allo stato (Susceptible=cerchio, FC=rombo, Believer=quadrato)
// I colori del gradiente si adattano in base alla modalità daltonismo selezionata
// =============================================================================
const nodeColor = (d) => {
  // Fact-Checker permanenti: usa sempre il colore eternal dalla palette
  if (d.isEternalFC) return getColorForState('eternal');
  
  // Gradiente basato su gullibility: 0.01=colore basso → 0.5=bianco → 1=colore alto
  let gull = typeof d.gullibility === 'number' ? d.gullibility : 0.5;
  gull = Math.max(0.01, Math.min(1, gull));
  
  // Ottieni i colori estremi del gradiente in base alla modalità daltonismo
  const palette = COLORBLIND_PALETTES[currentColorMode] || COLORBLIND_PALETTES.normal;
  const lowColor = palette.lowGullibility || '#ff0000';  // Default rosso
  const highColor = palette.highGullibility || '#0000ff'; // Default blu
  
  // Converti hex in RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r: 255, g: 0, b: 0};
  }
  
  const lowRgb = hexToRgb(lowColor);
  const highRgb = hexToRgb(highColor);
  
  function interpColor(val) {
    if (val >= 0.5) {
      // White (255,255,255) to highColor as val goes from 0.5 to 1
      const t = (val - 0.5) / (1 - 0.5);
      const r = Math.round(255 * (1 - t) + highRgb.r * t);
      const g = Math.round(255 * (1 - t) + highRgb.g * t);
      const b = Math.round(255 * (1 - t) + highRgb.b * t);
      return `rgb(${r},${g},${b})`;
    } else {
      // lowColor to White (255,255,255) as val goes from 0.01 to 0.5
      const t = (val - 0.01) / (0.5 - 0.01);
      const r = Math.round(lowRgb.r * (1 - t) + 255 * t);
      const g = Math.round(lowRgb.g * (1 - t) + 255 * t);
      const b = Math.round(lowRgb.b * (1 - t) + 255 * t);
      return `rgb(${r},${g},${b})`;
    }
  }
  return interpColor(gull);
};

// =============================================================================
// SELEZIONE DI UN SOTTOGRAFO CONNESSO
// Estrae dalla struttura completa un sottografo di dimensione specificata,
// preservando la connettivita. L'algoritmo utilizza BFS per identificare
// le componenti connesse e seleziona i nodi dalle componenti piu grandi.
// =============================================================================
function selectConnectedSubset(graphData, numNodes) {
  const nodes = graphData.nodes || [];
  const links = graphData.links || [];

  // Costruzione della lista di adiacenza per la ricerca in ampiezza (BFS)
  const adj = new Map();
  nodes.forEach(n => {
    adj.set(n.id, new Set());
  });
  links.forEach(l => {
    if (adj.has(l.source) && adj.has(l.target)) {
      adj.get(l.source).add(l.target);
      adj.get(l.target).add(l.source);
    }
  });

  // Identificazione delle componenti connesse mediante visita in ampiezza
  const visited = new Set();
  const components = [];
  for (const n of nodes) {
    const start = n.id;
    if (visited.has(start)) continue;
    const queue = [start];
    const comp = [];
    visited.add(start);
    while (queue.length) {
      const cur = queue.shift();
      comp.push(cur);
      const neighbors = adj.get(cur) || new Set();
      neighbors.forEach(nb => {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      });
    }
    components.push(comp);
  }

  // Ordinamento decrescente per cardinalita e selezione dei primi numNodes nodi
  components.sort((a, b) => b.length - a.length);
  const selectedIds = [];
  for (const comp of components) {
    for (const id of comp) {
      if (selectedIds.length >= numNodes) break;
      selectedIds.push(id);
    }
    if (selectedIds.length >= numNodes) break;
  }

  // Costruzione dei sottoinsiemi filtrati di nodi e archi
  const idSet = new Set(selectedIds);
  const nodesSubset = nodes.filter(n => idSet.has(n.id));
  const linksSubset = links.filter(l => idSet.has(l.source) && idSet.has(l.target));

  return { nodesSubset, linksSubset, selectedIds };
}

// =============================================================================
// RENDERING DEL GRAFO CON D3.JS FORCE-DIRECTED LAYOUT
// Visualizza la rete sociale utilizzando un algoritmo di layout basato su forze.
// I nodi sono posizionati mediante simulazione fisica che bilancia
// attrazione (archi) e repulsione (forza elettrostatica tra nodi).
// =============================================================================
function renderGraph(){
  // Controlla che i dati del grafo siano disponibili nello state (dall'API)
  if (!state.nodes || state.nodes.length === 0) {
    console.error('Nessun nodo disponibile - attendere inizializzazione API');
    return;
  }
  if (!state.links || state.links.length === 0) {
    console.error('Nessun arco disponibile - attendere inizializzazione API');
    return;
  }

  // Configurazione delle dimensioni del canvas SVG
  const width = svg.node().getBoundingClientRect().width;
  const height = svg.node().getBoundingClientRect().height;
  svg.attr("width", width).attr("height", height).attr("viewBox", [-width/2, -height/2, width, height]);

  // Creazione di copie degli array per evitare mutazioni dell'originale
  // (la simulazione D3 modifica direttamente le coordinate dei nodi)
  const links = state.links.map(d => ({...d}));
  const nodes = state.nodes.map(d => ({
    ...d,
    simId: d.id  // L'ID è già l'identificatore della simulazione API
  }));

  console.log('📊 Grafo API:', nodes.length, 'nodi,', links.length, 'archi');

  // Memorizzazione del riferimento globale per aggiornamenti incrementali
  currentNodes = nodes;

  // Interruzione della simulazione precedente per evitare conflitti
  if(simulation) simulation.stop();

  // Inizializzazione della simulazione force-directed con forze multiple
  // (pattern di layout tipico delle visualizzazioni di reti sociali)
  // Parametri ottimizzati per ~250 nodi con comunità ben separate
  simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(30))  // Distanza archi ridotta
      .force("charge", d3.forceManyBody().strength(-50))  // Forza repulsiva moderata per 250 nodi
      .force("x", d3.forceX().strength(0.03))  // Centra orizzontalmente
      .force("y", d3.forceY().strength(0.03))  // Centra verticalmente
      .force("collision", d3.forceCollide().radius(8));  // Raggio collisione per nodi r=5

  // Creazione degli elementi grafici per gli archi (linee)
  const link = gLinks.selectAll("line")
    .data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`)
    .join("line")
      .attr("stroke", "#667")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1);

  // Creazione degli elementi grafici per i nodi (shapes by role)
  const node = gNodes.selectAll("path")
    .data(nodes, d => d.id)
    .join("path")
      .attr("d", d => {
        // Susceptible: cerchio, Believer: quadrato, Fact-Checker: rombo
        if (d.role === 'susceptible' || d.scientificState === 'S') {
          // Circle
          return d3.symbol().type(d3.symbolCircle).size(100)();
        } else if (d.role === 'believer' || d.scientificState === 'B') {
          // Square
          return d3.symbol().type(d3.symbolSquare).size(100)();
        } else if (d.role === 'fact_checker' || d.scientificState === 'FC') {
          // Diamond (rombo)
          return d3.symbol().type(d3.symbolDiamond).size(100)();
        } else {
          // Default: circle
          return d3.symbol().type(d3.symbolCircle).size(100)();
        }
      })
      .attr("fill", nodeColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .on("click", (ev, d) => {
        if (d.simId === undefined) {
          console.warn("Nodo grafico senza corrispondente nella simulazione", d.id);
          return;
        }
        console.log(`Nodo selezionato: simId=${d.simId}, stato=${d.scientificState}`);
        openNodeModalBySimId(d.simId);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Tooltip informativo per ciascun nodo
  node.append("title")
    .text(d => `ID: ${d.id}\nRuolo: ${d.role}\nGullibility: ${typeof d.gullibility === 'number' ? d.gullibility.toFixed(2) : 'N/A'}`);

  // Callback eseguita ad ogni iterazione della simulazione fisica
  // per aggiornare le posizioni degli elementi grafici
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("transform", d => `translate(${d.x},${d.y})`);
  });

  // Zoom automatico per adattare il grafo alla vista
  setTimeout(() => {
    const bounds = gNodes.node().getBBox();
    if (bounds.width > 0 && bounds.height > 0) {
      const scale = Math.min(width / bounds.width, height / bounds.height) * 0.8;
      svg.call(zoom.transform, d3.zoomIdentity.scale(scale));
    }
    
    // Dopo il layout iniziale, ferma la simulazione e blocca le posizioni
    setTimeout(() => {
      if (simulation) {
        simulation.stop();
        // Fissa le posizioni di tutti i nodi
        nodes.forEach(d => {
          d.fx = d.x;
          d.fy = d.y;
        });
      }
    }, 2000);
  }, 1000);
}

// =============================================================================
// GESTORI DEGLI EVENTI DI TRASCINAMENTO (DRAG)
// Implementano l'interazione utente per il riposizionamento manuale dei nodi.
// =============================================================================
function dragstarted(event) {
  if (!event.active && simulation) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active && simulation) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

// =============================================================================
// CONFIGURAZIONE PAN E ZOOM
// Consente la navigazione interattiva del grafo mediante trascinamento
// e rotella del mouse, con limiti di scala per preservare la leggibilita.
// =============================================================================
const zoom = d3.zoom()
  .scaleExtent([0.4, 3])
  .on("zoom", (ev)=> { root.attr("transform", ev.transform); });
svg.call(zoom);
svg.on("dblclick.zoom", null);
svg.on("dblclick", ()=> { svg.transition().duration(200).call(zoom.transform, d3.zoomIdentity); });

// Gestione del ridimensionamento della finestra per layout responsivo
window.addEventListener("resize", ()=> renderGraph());

// =============================================================================
// GESTIONE OVERLAY DI AVVIO
// =============================================================================
function showOverlay(){ $("#startOverlay").style.display="flex"; }
function hideOverlay(){ $("#startOverlay").style.display="none"; }

// =============================================================================
// FUNZIONI AUSILIARIE PER LA GESTIONE DELLA RETE
// =============================================================================

// Restituisce l'elenco dei nodi adiacenti a un dato nodo nella rete
function neighborsOf(n){
  const ids=new Set();
  state.links.forEach(l=>{
    const s=(typeof l.source==="object"?l.source.id:l.source), t=(typeof l.target==="object"?l.target.id:l.target);
    if(s===n.id) ids.add(t); else if(t===n.id) ids.add(s);
  });
  return Array.from(ids).map(id=> state.nodes.find(x=>x.id===id));
}
function applyEvent(day){
  const ev = state.timeline.find(e=>e.day===day);
  if(!ev) return ev;
  state.nodes.forEach(n=>{ if(Math.random()<0.25){ n.memory=ev.type; n.memoryTime=0; } });
  return ev;
}
function computeCounts(){
  // Conta i nodi per ruolo attuale
  const c = { believer: 0, fact_checker: 0, susceptible: 0 };
  state.nodes.forEach(n => {
    if (n.role === 'believer') c.believer++;
    else if (n.role === 'fact_checker') c.fact_checker++;
    else c.susceptible++;
  });
  return c;
}
function updateKPI(){
  const c = computeCounts(), tot = state.nodes.length;
  
  // Controlli di sicurezza per gli elementi DOM - usa getElementById per maggiore affidabilità
  const kFake = document.getElementById("kFake");
  const kTruth = document.getElementById("kTruth");
  const kNeutral = document.getElementById("kNeutral");
  
  if (!kFake || !kTruth || !kNeutral) {
    console.warn("⚠️ Elementi KPI non disponibili nel DOM");
    return;
  }
  
  kFake.textContent = pct(c.believer, tot) + "%";
  kTruth.textContent = pct(c.fact_checker, tot) + "%";
  kNeutral.textContent = pct(c.susceptible, tot) + "%";
  
  // Mostra progresso vittoria per modalità "Scegli il Lato"
  if (selectedMode === "libera" && playerTeam) {
    const believerPerc = c.believer / tot;
    const fcPerc = c.fact_checker / tot;
    const turnsLeft = CONST.MAX_TURNS - state.currentDay;
    
    let progressHTML = '';
    
    if (playerTeam === 'believer') {
      const progress = (believerPerc / CONST.WIN_PERCENTAGE) * 100;
      const color = believerPerc >= CONST.WIN_PERCENTAGE ? '#22c55e' : '#5ea8ff';
      progressHTML = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(239,68,68,0.1); border-radius: 8px; border: 1px solid rgba(239,68,68,0.3);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
            <span style="color: #94a3b8;">🎯 Obiettivo Believer</span>
            <span style="color: ${color}; font-weight: 600;">${pct(c.believer, tot)}% / 70%</span>
          </div>
          <div style="background: rgba(15,23,42,0.5); border-radius: 4px; height: 8px; overflow: hidden;">
            <div style="width: ${Math.min(progress, 100)}%; height: 100%; background: linear-gradient(90deg, #ef4444, #dc2626); transition: width 0.3s;"></div>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">⏱️ Turni rimasti: ${turnsLeft}</div>
        </div>
      `;
    } else if (playerTeam === 'fact_checker') {
      const progress = (fcPerc / CONST.WIN_PERCENTAGE) * 100;
      const color = fcPerc >= CONST.WIN_PERCENTAGE ? '#22c55e' : '#5ea8ff';
      progressHTML = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(34,197,94,0.1); border-radius: 8px; border: 1px solid rgba(34,197,94,0.3);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
            <span style="color: #94a3b8;">🎯 Obiettivo Fact-Checker</span>
            <span style="color: ${color}; font-weight: 600;">${pct(c.fact_checker, tot)}% / 70%</span>
          </div>
          <div style="background: rgba(15,23,42,0.5); border-radius: 4px; height: 8px; overflow: hidden;">
            <div style="width: ${Math.min(progress, 100)}%; height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a); transition: width 0.3s;"></div>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">⏱️ Turni rimasti: ${turnsLeft}</div>
        </div>
      `;
    }
    
    // Aggiungi o aggiorna il div del progresso
    let progressDiv = document.getElementById('victoryProgress');
    if (!progressDiv) {
      progressDiv = document.createElement('div');
      progressDiv.id = 'victoryProgress';
      const kpiGroup = document.querySelector('.group');
      if (kpiGroup) {
        kpiGroup.appendChild(progressDiv);
      }
    }
    progressDiv.innerHTML = progressHTML;
  }
}

// NOTA: calculateMeanFieldThreshold e updateSegregationMetrics sono state RIMOSSE
// I parametri della simulazione sono gestiti interamente dall'API.
// Non c'è più bisogno di calcoli locali - l'API decide tutto.

// =============================================================================
// SISTEMA DI STOP AUTOMATICO
// Controlla convergenza (nessun cambiamento) e saturazione (dominanza gruppo)
// =============================================================================

// Calcola hash dello stato per rilevare cambiamenti
function getStateHash() {
  return state.nodes.map(n => n.scientificState).join('');
}

// Controlla se la simulazione deve fermarsi (convergenza o saturazione)
function shouldStopSimulation() {
  if (state.simulation.manualStop) {
    return { stop: true, reason: '⏸️ Stop manuale' };
  }
  
  // 1. Check convergenza: nessun cambiamento per N step
  if (state.simulation.stepsWithoutChanges >= CONST.CONVERGENCE_STEPS) {
    return { stop: true, reason: `✅ Convergenza raggiunta (${CONST.CONVERGENCE_STEPS} step senza cambiamenti)` };
  }
  
  // 2. Check saturazione: un gruppo domina
  const totalNodes = state.nodes.length;
  if (totalNodes > 0) {
    const believers = state.nodes.filter(n => n.scientificState === 'B').length;
    const factCheckers = state.nodes.filter(n => n.scientificState === 'FC').length;
    
    const believersRatio = believers / totalNodes;
    const fcRatio = factCheckers / totalNodes;
    
    if (believersRatio >= CONST.SATURATION_THRESHOLD) {
      return { stop: true, reason: `🔴 Believers dominanti (${(believersRatio*100).toFixed(1)}%)` };
    }
    if (fcRatio >= CONST.SATURATION_THRESHOLD) {
      return { stop: true, reason: `🟢 Fact-Checkers dominanti (${(fcRatio*100).toFixed(1)}%)` };
    }
  }
  
  return { stop: false };
}


// Esegue ESATTAMENTE un giorno (state.currentDay), poi imposta currentDay = prossimo giorno.
// La label mostra l’ULTIMO giorno eseguito per chiarezza.
async function stepOneDay(){
  
  // Check condizioni di stop PRIMA di eseguire lo step
  const stopCheck = shouldStopSimulation();
  if (stopCheck.stop) {
    state.simulation.running = false;
    // Reset del flag manuale DOPO aver fermato per evitare loop infinito
    const wasManual = state.simulation.manualStop;
    if (wasManual) {
      state.simulation.manualStop = false;
    }
    showToast(stopCheck.reason);
    console.log(`🛑 Simulazione fermata: ${stopCheck.reason}`);
    return;
  }
  
  if(state.currentDay>CONST.DAYS) return;

  const day = state.currentDay;
  const previousHash = getStateHash();
  
  try {
    // Invocazione dell'endpoint API per l'avanzamento temporale
    const stepResult = await hoaxClient.step();
    const newNodeStates = stepResult.new_node_states;
    const simulationEnded = stepResult.simulation_ended || false;

    // Gestione della condizione di equilibrio (terminazione anticipata)
    if (simulationEnded) {
      showToast('Simulazione terminata: equilibrio raggiunto');
      console.log('Simulazione terminata al giorno', day);
    }

    // Sincronizzazione degli stati dei nodi tra API e rappresentazione locale
    state.nodes.forEach(node => {
      const newState = newNodeStates[String(node.id)] || 'S';
      node.scientificState = newState;
      // Aggiorna anche il ruolo per la visualizzazione coerente
      if (newState === 'B') node.role = 'believer';
      else if (newState === 'FC') node.role = 'fact_checker';
      else node.role = 'susceptible';

      // Sincronizzazione con i nodi della visualizzazione D3
      const d3Node = currentNodes.find(n => n.id === node.id);
      if (d3Node) {
        d3Node.scientificState = newState;
        d3Node.role = node.role;
        d3Node.type = newState === 'B' ? 'Believer (Fake)' : 
                      newState === 'FC' ? 'Fact-Checker (Verita)' : 
                      'Susceptible (Neutrale)';
      }

      // Mappatura dello stato alla memoria per retrocompatibilita
      if (newState === 'B') node.memory = 'fake';
      else if (newState === 'FC') node.memory = 'truth';
      else node.memory = 'neutral';
    });
    
    // Tracking convergenza: check se lo stato è cambiato
    const currentHash = getStateHash();
    if (currentHash === previousHash) {
      state.simulation.stepsWithoutChanges++;
      console.log(`📊 Nessun cambiamento per ${state.simulation.stepsWithoutChanges} step`);
    } else {
      state.simulation.stepsWithoutChanges = 0;
    }

    // Calcolo delle statistiche aggregate per il giorno corrente
    const counts = {
      fake: Object.values(newNodeStates).filter(s => s === 'B').length,
      truth: Object.values(newNodeStates).filter(s => s === 'FC').length,
      neutral: Object.values(newNodeStates).filter(s => s === 'S').length
    };
    
    state.daily.push({day, fake:counts.fake, truth:counts.truth, neutral:counts.neutral, event: ""});

    // Decrementa giorni dei boosts/campaign attivi e pulisci
    state.game.boostMgr.tickDay();
    if(state.game.campaign && state.game.campaign.active){
      state.game.campaign.daysLeft -= 1;
      if(state.game.campaign.daysLeft <= 0) state.game.campaign.active = false;
    }
    state.game.battleWarsUsedToday = false;

    // Aggiornamento degli indicatori chiave di performance (KPI)
    updateKPI();
    
    updateResultsChart(); 
    renderDailyTable();
    
    // Aggiornamento delle FORME del grafo in tempo reale (non i colori!)
    // Mappatura degli stati API agli elementi visuali D3 tramite identificatore
    const stateMap = new Map(Object.entries(newNodeStates).map(([id, state]) => [parseInt(id), state]));
    
    gNodes.selectAll("path")
      .attr("d", d => {
        // Normalizzazione dell'identificatore (supporto per tipi string e int)
        const nodeId = typeof d.id === 'string' ? parseInt(d.id) : d.id;
        const newState = stateMap.get(nodeId);
        if (newState) {
          d.scientificState = newState;
          // Aggiorna anche il ruolo per la forma
          if (newState === 'B') d.role = 'believer';
          else if (newState === 'FC') d.role = 'fact_checker';
          else d.role = 'susceptible';
        }
        
        // Cambia FORMA in base allo stato (il colore rimane fisso basato su gullibility)
        if (d.scientificState === 'S' || d.role === 'susceptible') {
          // Susceptible: cerchio
          return d3.symbol().type(d3.symbolCircle).size(100)();
        } else if (d.scientificState === 'B' || d.role === 'believer') {
          // Believer: quadrato
          return d3.symbol().type(d3.symbolSquare).size(100)();
        } else if (d.scientificState === 'FC' || d.role === 'fact_checker') {
          // Fact-Checker: rombo
          return d3.symbol().type(d3.symbolDiamond).size(100)();
        } else {
          return d3.symbol().type(d3.symbolCircle).size(100)();
        }
      });
    
    // Aggiornamento dei tooltip informativi
    gNodes.selectAll("path").select("title").remove();
    gNodes.selectAll("path").append("title").text(d => `ID: ${d.id}\nStato: ${d.scientificState}\nRuolo: ${d.role}\nGullibility: ${d.gullibility?.toFixed(2) || 'N/A'}`);

    // *** APPLICAZIONE POWER-UP DOPO AGGIORNAMENTO API ***
    // Questo assicura che le conversioni dei power-up sovrascrivano lo stato dell'API
    if (selectedMode === "libera" && playerTeam) {
      console.log("🎮 Applicazione power-up attivi...");
      updateActivePowerups(); // Applica conversioni e decrementa durata
      updateBudgetRecharge(); // Aggiorna ricarica budget
      
      // Ricalcola KPI dopo le conversioni dei power-up
      updateKPI();
      
      // Aggiorna anche il grafico con i nuovi valori
      const newCounts = {
        fake: state.nodes.filter(n => n.scientificState === 'B').length,
        truth: state.nodes.filter(n => n.scientificState === 'FC').length,
        neutral: state.nodes.filter(n => n.scientificState === 'S').length
      };
      
      // Aggiorna l'ultimo entry in daily con i valori corretti post power-up
      if (state.daily.length > 0) {
        state.daily[state.daily.length - 1].fake = newCounts.fake;
        state.daily[state.daily.length - 1].truth = newCounts.truth;
        state.daily[state.daily.length - 1].neutral = newCounts.neutral;
      }
      
      updateResultsChart();
    }

    // *** CONTROLLO VITTORIA/SCONFITTA PER "SCEGLI IL LATO" ***
    if (selectedMode === "libera" && playerTeam) {
      const totalNodes = state.nodes.length;
      const believerCount = state.nodes.filter(n => n.scientificState === 'B').length;
      const fcCount = state.nodes.filter(n => n.scientificState === 'FC').length;
      
      const believerPerc = believerCount / totalNodes;
      const fcPerc = fcCount / totalNodes;
      
      let gameEnded = false;
      let victory = false;
      let reason = "";
      
      // Check vittoria per percentuale
      if (playerTeam === 'believer' && believerPerc >= CONST.WIN_PERCENTAGE) {
        gameEnded = true;
        victory = true;
        reason = `Hai raggiunto il ${(believerPerc * 100).toFixed(1)}% di Believer!`;
      } else if (playerTeam === 'fact_checker' && fcPerc >= CONST.WIN_PERCENTAGE) {
        gameEnded = true;
        victory = true;
        reason = `Hai raggiunto il ${(fcPerc * 100).toFixed(1)}% di Fact-Checker!`;
      }
      
      // Check sconfitta per percentuale avversario
      if (playerTeam === 'believer' && fcPerc >= CONST.WIN_PERCENTAGE) {
        gameEnded = true;
        victory = false;
        reason = `I Fact-Checker hanno raggiunto il ${(fcPerc * 100).toFixed(1)}%!`;
      } else if (playerTeam === 'fact_checker' && believerPerc >= CONST.WIN_PERCENTAGE) {
        gameEnded = true;
        victory = false;
        reason = `I Believer hanno raggiunto il ${(believerPerc * 100).toFixed(1)}%!`;
      }
      
      // Check timeout (50 turni)
      if (day >= CONST.MAX_TURNS) {
        gameEnded = true;
        // Vince chi ha più nodi
        if (playerTeam === 'believer') {
          victory = believerPerc > fcPerc;
          reason = victory ? 
            `Tempo scaduto! Believer ${(believerPerc * 100).toFixed(1)}% vs FC ${(fcPerc * 100).toFixed(1)}%` :
            `Tempo scaduto! Fact-Checker ${(fcPerc * 100).toFixed(1)}% vs Believer ${(believerPerc * 100).toFixed(1)}%`;
        } else {
          victory = fcPerc > believerPerc;
          reason = victory ? 
            `Tempo scaduto! Fact-Checker ${(fcPerc * 100).toFixed(1)}% vs Believer ${(believerPerc * 100).toFixed(1)}%` :
            `Tempo scaduto! Believer ${(believerPerc * 100).toFixed(1)}% vs FC ${(fcPerc * 100).toFixed(1)}%`;
        }
      }
      
      if (gameEnded) {
        state.simulation.running = false;
        
        // Traccia fine partita nelle statistiche
        trackGameEnd(victory, playerTeam);
        
        showGameEndModal(victory, reason, {
          believerPerc: (believerPerc * 100).toFixed(1),
          fcPerc: (fcPerc * 100).toFixed(1),
          turns: day,
          budgetSpent: 500 - playerState.budget,
          powerupsUsed: calculatePowerupsUsed()
        });
        return;
      }
    }

    // Modalita Strategica: calcolo del guadagno in crediti proporzionale alla verita
    if(selectedMode === "Strategica" && day > 1){
      const tot = state.nodes.length;
      const truthPct = pct(counts.truth, tot);
      const fakePct = pct(counts.fake, tot);
      const coinsGained = 30 + Math.floor(truthPct * 0.7) - Math.floor(fakePct * 0.3);
      state.game.coins += Math.max(5, coinsGained);
      if(coinsGained > 0) showToast(`+${Math.max(5, coinsGained)} crediti (${truthPct}% Verita, ${fakePct}% Fake)`);
      updateGameBaseUI();
    }
    
    // Modalita Competitiva: turno dell'avversario AI dopo il giocatore
    if(selectedMode === "Competitiva"){
      makeAIMove();
    }

    // Visualizzazione dell'ultimo giorno simulato
    $("#dayLabel").textContent = day;

    // Preparazione per il giorno successivo
    state.currentDay = day + 1;
    state.game.totalDaysPlayed = day;
    
    // Ripristino delle mosse disponibili per il nuovo giorno (solo Strategica)
    if(selectedMode === "Strategica"){
      state.game.movesLeft = state.game.movesPerDay;
      updateGameBaseUI();
    }
    
    // Verifica delle condizioni di terminazione della partita
    if(day >= CONST.DAYS){
      checkGameEnd();
    }

    TROPHY_SYSTEM.checkUnlocks();

  } catch (error) {
    console.error('Errore stepOneDay:', error);
    showToast(`Errore simulazione: ${error.message}`);
  }
}

// =============================================================================
// GESTIONE DEI RISULTATI E GRAFICI STATISTICI
// Funzioni per la visualizzazione dell'andamento temporale della simulazione
// mediante grafici interattivi (Chart.js) e tabelle riepilogative.
// =============================================================================
function updateResultsChart(reset=false){
  const labels=state.daily.map(d=>`G${d.day}`), tot=state.nodes.length||1;
  const F=state.daily.map(d=>pct(d.fake,tot)), T=state.daily.map(d=>pct(d.truth,tot)), N=state.daily.map(d=>pct(d.neutral,tot));
  const ctx=$("#summaryChart"); if(!ctx) return;
  if(reset || !state.chart){
    if(state.chart) state.chart.destroy();
    state.chart=new Chart(ctx,{type:"line",data:{labels,datasets:[
      {label:"Fake",data:F,borderColor:"#ef4444",fill:false},
      {label:"Verità",data:T,borderColor:"#22c55e",fill:false},
      {label:"Neutrali",data:N,borderColor:"#9aa6bf",fill:false},
    ]},options:{responsive:false,animation:false,plugins:{legend:{position:"bottom"}},scales:{y:{beginAtZero:true,max:100}}}});
  }else{
    state.chart.data.labels=labels; state.chart.data.datasets[0].data=F; state.chart.data.datasets[1].data=T; state.chart.data.datasets[2].data=N; state.chart.update();
  }
}
function renderDailyTable(){
  const tb=$("#dailyTable tbody"); if(!tb) return;
  tb.innerHTML=""; state.daily.forEach(d=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${d.day}</td><td>${d.fake}</td><td>${d.truth}</td><td>${d.neutral}</td><td>${d.event||""}</td>`;tb.appendChild(tr);});
}

// =============================================================================
// GESTIONE DELLE FINESTRE MODALI
// Funzioni per l'apertura e la chiusura delle finestre di dialogo,
// con gestione dell'accessibilita (attributi ARIA).
// =============================================================================
function openModal(id){ const m=$(id); m.classList.add("show"); m.setAttribute("aria-hidden","false"); }
function closeModal(id){ 
  const m=$(id); 
  m.classList.remove("show"); 
  m.setAttribute("aria-hidden","true"); 
  // Rimuovi focus da qualsiasi elemento dentro il modale
  const focused = m.querySelector(":focus");
  if(focused) focused.blur();
}
const btnOpenResults = $("#btnOpenResults"); if(btnOpenResults) btnOpenResults.onclick = ()=>{ updateResultsChart(true); openModal("#resultsModal"); };
const resultsClose = $("#resultsClose"); if(resultsClose) resultsClose.onclick   = ()=> closeModal("#resultsModal");
const btnOpenDetails = $("#btnOpenDetails"); if(btnOpenDetails) btnOpenDetails.onclick = ()=>{ renderDailyTable(); openModal("#detailsModal"); };
const detailsClose = $("#detailsClose"); if(detailsClose) detailsClose.onclick   = ()=> closeModal("#detailsModal");

// =============================================================================
// RENDERING DEL MODALE DEGLI ACHIEVEMENT
// Genera dinamicamente la griglia dei trofei con indicazione visiva
// dello stato di sblocco e della categoria di appartenenza.
// =============================================================================
function renderAchievementsModal(){
  const content = $("#achievementsContent");
  if(!content) return;
  
  content.innerHTML = "";
  
  TROPHY_SYSTEM.trophies.forEach(trophy => {
    const card = document.createElement("div");
    card.className = `achievement-card ${trophy.unlocked ? 'unlocked' : 'locked'}`;
    
    const icon = trophy.unlocked ? trophy.icon : "🔒";
    const progressText = trophy.progress ? `${trophy.progress}` : "";
    
    card.innerHTML = `
      <span class="achievement-icon">${icon}</span>
      <div class="achievement-name">${trophy.name}</div>
      <div class="achievement-desc">${trophy.desc}</div>
      ${progressText ? `<div class="achievement-progress">${progressText}</div>` : ''}
      ${trophy.unlocked ? '<div class="achievement-badge">✓</div>' : ''}
    `;
    
    content.appendChild(card);
  });
}

const btnAchievements = $("#btnAchievements");
if(btnAchievements) btnAchievements.onclick = ()=>{
  renderAchievementsModal();
  openModal("#achievementsModal");
};

// Chiusura del modale degli achievement mediante click sullo sfondo
const achievementsModal = $("#achievementsModal");
if(achievementsModal) achievementsModal.onclick = (e) => {
  if(e.target === achievementsModal) closeModal("#achievementsModal");
};

// =============================================================================
// SISTEMA DI NOTIFICHE (TOAST)
// Visualizza messaggi temporanei non intrusivi per feedback all'utente.
// =============================================================================
function showToast(msg="Sessione salvata"){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=> t.classList.remove("show"), 1600);
}

// =============================================================================
// PERSISTENZA DELLE SESSIONI
// Funzioni per il salvataggio e il caricamento dello stato della simulazione
// mediante localStorage del browser. Consente di riprendere sessioni precedenti.
// =============================================================================
function snapshot(){
  return {
    id:`S${Date.now()}`, when:new Date().toLocaleString(), currentDay:state.currentDay,
    nodes: state.nodes.map(n=>({...n})),
    links: state.links.map(l=> ({source:(typeof l.source==="object"?l.source.id:l.source), target:(typeof l.target==="object"?l.target.id:l.target), w:l.w})),
    daily: state.daily.map(d=>({...d})),
    timeline: state.timeline.map(e=>({...e}))
  };
}
function saveSession(){
  const arr=JSON.parse(localStorage.getItem("gr_sessions_v3")||"[]");
  arr.push(snapshot());
  localStorage.setItem("gr_sessions_v3", JSON.stringify(arr));
  showToast("Sessione salvata");
}
function openLoadModal(){
  const body=$("#loadBody"); const arr=JSON.parse(localStorage.getItem("gr_sessions_v3")||"[]");
  if(arr.length===0){ body.innerHTML="<p class='muted'>Nessuna sessione salvata.</p>"; }
  else{
    body.innerHTML=""; arr.slice().reverse().forEach(s=>{
      const b=document.createElement("button"); b.className="ghost"; b.style.width="100%"; b.style.marginBottom="6px";
      const last = Math.max(0, s.currentDay - 1);
      b.textContent=`${s.when} — Giorno ${last}/${CONST.DAYS} — N=${s.nodes.length}`;
      b.onclick=()=>{ closeModal("#loadModal"); loadSnapshot(s); };
      body.appendChild(b);
    });
  }
  openModal("#loadModal");
}
function loadSnapshot(s){
  state.currentDay=s.currentDay; state.daily=s.daily.map(d=>({...d})); state.timeline=s.timeline.map(e=>({...e}));
  state.nodes=s.nodes.map(n=>({...n})); state.links=s.links.map(l=>({...l}));
  gLinks.selectAll("*").remove(); gNodes.selectAll("*").remove(); renderGraph();
  const last = Math.max(0, state.currentDay - 1);
  $("#dayLabel").textContent = last;
  updateKPI(); updateResultsChart(true); renderDailyTable(); hideOverlay();

  // assicura colori corretti dopo il load
  gNodes.selectAll("circle").attr("fill", colorFill).attr("stroke", colorStroke);
}

// =============================================================================
// MODALE DI DETTAGLIO DEL NODO
// Consente la visualizzazione e la modifica delle proprieta di un singolo nodo,
// incluso lo stato epidemiologico, il ruolo nella rete e la suscettibilita.
// =============================================================================
let modalNode=null;
let selectingEternalFC = false;

// Funzione di collegamento tra identificatore grafico e identificatore simulazione
function openNodeModalBySimId(simId){
  const node = state.nodes.find(n => n.id === simId);
  if (!node) {
    console.warn('Nodo simulazione non trovato:', simId);
    return;
  }
  openNodeModal(node);
}

function openNodeModal(node){
  if (node.susceptibility === undefined) {
    console.warn('Nodo non simulativo, modal bloccato:', node);
    return;
  }

  // Se siamo in modalità selezione Eternal FC
  if(selectingEternalFC){
    selectingEternalFC = false;
    if(node.role === "fact_checker"){
      showToast("Questo nodo è già un Fact-Checker!");
      selectingEternalFC = true;
      return;
    }
    node.role = 'fact_checker';
    node.isEternalFC = true;
    node.scientificState = 'FC';  // Aggiornamento dello stato epidemiologico
    node.memory = 'truth';
    
    // NOTA TECNICA: Il concetto di "Eternal Fact-Checker" e una astrazione
    // dell'interfaccia utente. L'API backend non supporta nativamente nodi
    // immuni alla transizione di stato. La proprieta isEternalFC viene
    // utilizzata esclusivamente per la differenziazione visiva.
    
    state.game.coins -= 40;
    // Decrementa mosse solo in Strategica
    if(selectedMode === "Strategica"){
      state.game.movesLeft--;
    }
    
    // Sincronizza con gameNodes se disponibili
    if(state.gameNodes){
      const gameNode = state.gameNodes.find(n => n.id === node.id);
      if(gameNode){
        gameNode.isEternalFC = true;
      }
    }
    
    updateGameBaseUI();
    // Refresh grafico con nuovo nodeColor
    gNodes.selectAll('circle').attr('stroke', d => d.isEternalFC ? "#00d4ff" : "rgba(255, 255, 255, 0.8)").attr('fill', nodeColor).selectAll("title").remove();
    gNodes.selectAll('circle').append("title").text(d=>`[${d.type}] #${d.id}`);
    showToast('Eternal Fact-checker posizionato (40 crediti)')
  syncStateToServer();;
    return;
  }
  
  // Altrimenti modale normale
  modalNode=node;
  $("#nodeBody").innerHTML=`
    <label>Id <input type="text" value="${node.id}" disabled></label>
    <label>Ruolo
      <select id="mRole">
        <option value="credulone" ${node.role==="credulone"?"selected":""}>Credulone</option>
        <option value="fact_checker" ${node.role==="fact_checker"?"selected":""}>Fact-checker</option>
        <option value="neutral" ${node.role==="neutral"?"selected":""}>Neutrale</option>
      </select>
    </label>
    <label>Stato
      <select id="mMem">
        <option value="neutral" ${node.memory==="neutral"?"selected":""}>Neutrale</option>
        <option value="fake" ${node.memory==="fake"?"selected":""}>Fake</option>
        <option value="truth" ${node.memory==="truth"?"selected":""}>Verità</option>
      </select>
    </label>
    <label>Suscettibilità
      <input id="mSus" type="number" min="0" max="1" step="0.05" value="${node.susceptibility.toFixed(2)}">
    </label>`;
  openModal("#nodeModal");
}
function closeNode(){ closeModal("#nodeModal"); modalNode=null; }
$("#nodeClose").onclick=closeNode; $("#nodeCancel").onclick=closeNode;
$("#nodeApply").onclick=()=>{
  if(!modalNode) return;
  modalNode.role=$("#mRole").value;
  modalNode.memory=$("#mMem").value;
  modalNode.susceptibility=parseFloat($("#mSus").value);

  // refresh immediato del nodo (colore e contorno) + tooltip
  gNodes.selectAll("circle")
    .filter(d=>d.id===modalNode.id)
    .attr("fill", colorFill(modalNode))
    .attr("stroke", colorStroke(modalNode))
    .selectAll("title").remove();
  gNodes.selectAll("circle")
    .filter(d=>d.id===modalNode.id)
    .append("title").text(d=>`#${modalNode.id} • ${modalNode.role}`);

  updateKPI();
  closeNode();
};

// =============================================================================
// GESTORI DEI CONTROLLI PRINCIPALI DELL'INTERFACCIA
// Binding degli eventi per i pulsanti di navigazione temporale,
// reset della simulazione ed esportazione dei dati.
// =============================================================================

// Event listeners per la modalità "Scegli il Lato"
$("#choiceFake")?.addEventListener("click", () => {
  handleNewsChoice('fake');
});

$("#choiceTruth")?.addEventListener("click", () => {
  handleNewsChoice('truth');
});

// Pulsante SET MODE apre il modale di selezione modalità
$("#btnMode")?.addEventListener("click", () => {
  openModal("#modeSelectionModal");
});

// Gestione selezione modalità
document.querySelectorAll('.mode-selection-card').forEach(card => {
  card.addEventListener('click', () => {
    const mode = card.getAttribute('data-mode');
    
    if (mode === 'scegli-lato') {
      selectedMode = "libera"; // Imposta modalità libera per il sistema power-up
      closeModal("#modeSelectionModal");
      showNewsChoice();
    } else if (mode === 'simulazione') {
      selectedMode = "simulazione"; // Modalità senza power-up
      playerTeam = null; // Nessun team selezionato
      closeModal("#modeSelectionModal");
      showToast("🔬 Modalità Simulazione: osserva la diffusione naturale");
      initializeGame();
    } else if (mode === 'crea-notizia') {
      // Modalità non ancora implementata
      showToast("🔒 Modalità in arrivo prossimamente!");
    }
  });
});

// Event listeners per Impostazioni
$("#btnSettings")?.addEventListener("click", () => {
  openModal("#settingsModal");
});

$("#settingsClose")?.addEventListener("click", () => {
  closeModal("#settingsModal");
});

$("#btnShowTutorial")?.addEventListener("click", () => {
  closeModal("#settingsModal");
  showTutorial();
});

$("#settingsApply")?.addEventListener("click", () => {
  // Applica tutte le impostazioni
  applyAllSettings();
  showToast("✅ Impostazioni applicate con successo");
  // Chiudi il modal
  closeModal("#settingsModal");
});

// Funzione per applicare tutte le impostazioni
function applyAllSettings() {
  // Accessibilità
  const highContrast = $("#highContrastMode")?.checked || false;
  const largeText = $("#largeTextMode")?.checked || false;
  const reduceMotion = $("#reduceMotionMode")?.checked || false;
  
  document.body.classList.toggle("high-contrast", highContrast);
  document.body.classList.toggle("large-text", largeText);
  document.body.classList.toggle("reduce-motion", reduceMotion);
  
  localStorage.setItem("highContrast", highContrast);
  localStorage.setItem("largeText", largeText);
  localStorage.setItem("reduceMotion", reduceMotion);
  
  // Modalità daltonismo
  const colorblindSelector = document.getElementById('colorblindMode');
  if (colorblindSelector) {
    currentColorMode = colorblindSelector.value;
    localStorage.setItem('colorblindMode', currentColorMode);
    
    // Ricolora i nodi se il grafo è presente
    if (state && state.nodes && typeof gNodes !== 'undefined') {
      gNodes.selectAll("path")
        .attr('fill', d => nodeColor(d));
      
      // Aggiorna legenda
      d3.select('#legend-eternal').attr('fill', getColorForState('eternal'));
    }
  }
  
  // Audio
  const soundEnabled = $("#soundEnabled")?.checked || false;
  const volume = $("#volumeSlider")?.value || 70;
  
  localStorage.setItem("soundEnabled", soundEnabled);
  localStorage.setItem("volume", volume);
}

// Event listeners per Area Personale
$("#btnUserArea")?.addEventListener("click", () => {
  updateUserAreaDisplay();
  updateStatsDisplay(); // Aggiorna statistiche persistenti
  openModal("#userAreaModal");
});

$("#userAreaClose")?.addEventListener("click", () => {
  closeModal("#userAreaModal");
});

$("#btnLogin")?.addEventListener("click", () => {
  handleLogin();
});

$("#btnGoogleLogin")?.addEventListener("click", () => {
  handleGoogleLogin();
});

$("#btnGithubLogin")?.addEventListener("click", () => {
  handleGithubLogin();
});

$("#btnLogout")?.addEventListener("click", () => {
  handleLogout();
});

$("#linkRegister")?.addEventListener("click", (e) => {
  e.preventDefault();
  showToast("Funzionalità di registrazione in arrivo!");
});

$("#btnSaveCurrentGame")?.addEventListener("click", () => {
  saveCurrentGame();
});

// Gestione accessibilità
$("#highContrastMode")?.addEventListener("change", (e) => {
  document.body.classList.toggle("high-contrast", e.target.checked);
  localStorage.setItem("highContrast", e.target.checked);
});

$("#largeTextMode")?.addEventListener("change", (e) => {
  document.body.classList.toggle("large-text", e.target.checked);
  localStorage.setItem("largeText", e.target.checked);
});

$("#reduceMotionMode")?.addEventListener("change", (e) => {
  document.body.classList.toggle("reduce-motion", e.target.checked);
  localStorage.setItem("reduceMotion", e.target.checked);
});

$("#soundEnabled")?.addEventListener("change", (e) => {
  localStorage.setItem("soundEnabled", e.target.checked);
});

$("#volumeSlider")?.addEventListener("input", (e) => {
  const value = e.target.value;
  localStorage.setItem("volume", value);
  // Aggiorna il display del valore percentuale
  const volumeDisplay = document.getElementById("volumeValue");
  if (volumeDisplay) volumeDisplay.textContent = value + "%";
});

$("#btnNext").addEventListener("click", async ()=>{
  // Per modalità libera, controlla il limite MAX_TURNS
  const maxDays = (selectedMode === "libera" && playerTeam) ? CONST.MAX_TURNS : CONST.DAYS;
  if(state.currentDay <= maxDays) await stepOneDay();
});
$("#btnRunAll").addEventListener("click", async ()=>{
  // Per modalità libera, controlla il limite MAX_TURNS
  const maxDays = (selectedMode === "libera" && playerTeam) ? CONST.MAX_TURNS : CONST.DAYS;
  state.simulation.running = true;
  while(state.currentDay <= maxDays && state.simulation.running){
    await stepOneDay();
    await new Promise(r=> setTimeout(r, 180));
  }
});

// Pulsante di sincronizzazione manuale con il server
// Utile per allineare lo stato dopo operazioni eseguite via API esterna
$("#btnRefresh")?.addEventListener("click", async () => {
  await refreshStateFromServer();
});

// Ripristino completo dello stato dell'applicazione
$("#btnReset")?.addEventListener("click", ()=>{
  state.currentDay=1; state.daily=[];
  $("#dayLabel").textContent=0;
  $("#kFake").textContent=$("#kTruth").textContent=$("#kNeutral").textContent="—";
  gLinks.selectAll("*").remove(); gNodes.selectAll("*").remove();
  if(state.chart){ state.chart.destroy(); state.chart=null; }
  
  // Riabilitazione della selezione modalita per una nuova partita
  const btnMode = $("#btnMode");
  if(btnMode) btnMode.disabled = false;
  
  // Ripristino delle risorse di gioco
  state.game.coins = 400;
  state.game.movesLeft = 3;
  state.game.strategies = { hubs: false, frontiere: false, random: false };
  state.game.playerTeam = null;
  selectedMode = null;
  
  updateGameBaseUI();
  showToast('Partita reimpostata - Seleziona una modalita');
});

// Esportazione dello stato corrente in formato JSON
$("#btnExportJson")?.addEventListener("click", ()=>{
  // Costruzione della struttura dati conforme allo schema graph.json
  const graphJsonContent={
    nodes:state.nodes.map(d=>({
      id:d.id,
      group:d.scientificState||"S",
      scientificState:d.scientificState,
      role:d.role,
      community:d.community,
      isEternalFC:d.isEternalFC,
      susceptibility:d.susceptibility,
      radius:1,
      citing_patents_count:0
    })),
    links:state.links.map(d=>({
      source:typeof d.source==="object"?d.source.id:d.source,
      target:typeof d.target==="object"?d.target.id:d.target,
      value:d.value||1
    }))
  };
  
  // Aggiornamento della cache del grafo in memoria
  graphData=graphJsonContent;
  
  // Export session JSON
  const payload={
    appName:state.appName,
    createdAt:new Date().toISOString(),
    days:CONST.DAYS,
    timeline:state.timeline,
    daily:state.daily,
    currentDay:state.currentDay,
    nodes:graphJsonContent.nodes,
    links:graphJsonContent.links
  };
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"})); const a=document.createElement("a");
  a.href=url; a.download=`giancarlo_ruffo_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
});

// Esportazione del grafico statistico in formato immagine PNG
$("#btnExportPng")?.addEventListener("click", ()=>{
  const canvas=$("#summaryChart");
  if(!canvas){ updateResultsChart(true); openModal("#resultsModal"); return; }
  const url=canvas.toDataURL("image/png"); const a=document.createElement("a");
  a.href=url; a.download=`giancarlo_ruffo_chart_${Date.now()}.png`; a.click();
});
$("#btnSave")?.addEventListener("click", saveSession);
$("#btnLoad")?.addEventListener("click", openLoadModal);
$("#loadClose")?.addEventListener("click", ()=> closeModal("#loadModal"));

// Aggiunta: Event listener per il pulsante "Seleziona Modalità"
const btnMode = $("#btnMode");
if(btnMode) {
  btnMode.addEventListener("click", ()=> openModal("#modeSelectionModal"));
}

// Event listeners per i power-up (modalità Scegli il Lato)
$("#btnFakeBurst")?.addEventListener("click", () => activatePowerup('fakeBurst'));
$("#btnPayInfluencer")?.addEventListener("click", () => activatePowerup('payInfluencer'));
$("#btnEmergencyBeliever")?.addEventListener("click", () => activatePowerup('emergencyBeliever'));
$("#btnTalkFriend")?.addEventListener("click", () => activatePowerup('talkFriend'));
$("#btnNationalDebunk")?.addEventListener("click", () => activatePowerup('nationalDebunk'));
$("#btnEmergencyFC")?.addEventListener("click", () => activatePowerup('emergencyFC'));

// Gestione selezione modalità nel modale (inclusa Prima Pagina)
let selectedModeOption = null;
const modeButtons = [
  $("#modeOptPrimaPagina"),
  $("#modeOptStrategica"),
  $("#modeOptCompetitiva"),
  $("#modeOptLibera")
];
modeButtons.forEach(btn => {
  if(btn) {
    btn.addEventListener("click", function() {
      modeButtons.forEach(b => b && b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedModeOption = btn.getAttribute("data-mode");
    });
  }
});
const modeApply = $("#modeApply");
if(modeApply) {
  modeApply.addEventListener("click", function() {
    if(selectedModeOption) setMode(selectedModeOption);
  });
}
const modeClose = $("#modeClose");
if(modeClose) {
  modeClose.addEventListener("click", function() {
    closeModal("#modeModal");
  });
}

// =============================================================================
// GESTIONE DELLA SELEZIONE DEL TEAM (MODALITA COMPETITIVA)
// Consente al giocatore di scegliere la fazione da rappresentare:
// Team Fake (diffusione disinformazione) o Team Verita (fact-checking).
// =============================================================================
const teamFakeBtn = $("#teamFake");
const teamTruthBtn = $("#teamTruth");
const teamCancelBtn = $("#teamCancel");

if(teamFakeBtn) teamFakeBtn.addEventListener("click", async ()=>{
  // Registrazione della scelta del team nel sistema di stato
  state.game.competitive.playerTeam = "fake";
  state.game.playerTeam = "fake";
  closeModal("#teamModal");
  
  // Inizializzazione del grafo solo al primo avvio della partita
  if(state.currentDay === 1 && state.nodes.length === 0) {
    await initializeGame();
  }
  
  state.game.movesLeft = state.game.movesPerDay;
  stepOneDay();
  showToast("Sei nel team Fake 🔴");
});

if(teamTruthBtn) teamTruthBtn.addEventListener("click", async ()=>{
  // Registrazione della scelta del team nel sistema di stato
  state.game.competitive.playerTeam = "truth";
  state.game.playerTeam = "truth";
  closeModal("#teamModal");
  
  // Inizializzazione del grafo solo al primo avvio della partita
  if(state.currentDay === 1 && state.nodes.length === 0) {
    await initializeGame();
  }
  
  state.game.movesLeft = state.game.movesPerDay;
  stepOneDay();
  showToast("Sei nel team Verità 🟢");
});

if(teamCancelBtn) teamCancelBtn.addEventListener("click", ()=>{
  closeModal("#teamModal");
});

// Gestione del pulsante "Nuova partita" nel modale di fine gioco
const winnerCloseBtn = $("#winnerClose");
if(winnerCloseBtn) winnerCloseBtn.addEventListener("click", ()=>{
  closeModal("#winnerModal");
  // Ripristino completo dello stato
  $("#btnReset").click();
});

// =============================================================================
// GESTIONE DELLE MODALITA DI GIOCO
// Il sistema supporta tre modalita distinte:
// - Libera: sperimentazione senza vincoli
// - Strategica: risorse limitate e obiettivi specifici
// - Competitiva: confronto diretto contro avversario AI
// =============================================================================

// Inizializzazione dello stato di gioco dopo la selezione del team
async function initializeGame(){
  state.currentDay = 1;
  state.daily = [];
  // Reset flags di stop
  state.simulation.manualStop = false;
  state.simulation.running = false;
  state.simulation.stepsWithoutChanges = 0;
  state.simulation.previousStateHash = null;
  
  // Inizia tracciamento partita
  startGameTracking();
  
  // Reset sistema power-up per modalità "Scegli il Lato"
  if (selectedMode === "libera" && playerTeam) {
    playerState.budget = 500;
    playerState.budgetRechargeCounter = 0;
    playerState.activePowerups = [];
    playerState.originalParams = null;
    showTeamPowerups();
  } else if (selectedMode === "simulazione") {
    // Mostra messaggio per modalità simulazione
    const welcomeDiv = document.querySelector("#gameBasePanel > div[style*='min-height: 400px']");
    if (welcomeDiv) {
      welcomeDiv.innerHTML = `
        <div style="text-align: center; max-width: 400px;">
          <div style="font-size: 64px; margin-bottom: 24px; filter: drop-shadow(0 4px 8px rgba(94,168,255,0.3));">
            🔬
          </div>
          <h2 style="font-size: 24px; font-weight: 700; color: #e0e7ff; margin: 0 0 16px 0; line-height: 1.3;">
            Modalità Simulazione
          </h2>
          <p style="font-size: 15px; color: #8b9dc3; line-height: 1.6; margin: 0;">
            Osserva come le notizie si diffondono naturalmente nella rete sociale senza alcun intervento o utilizzo di power-up
          </p>
        </div>
      `;
      welcomeDiv.style.display = "flex";
    }
  }
  
  $("#dayLabel").textContent = 0;
  gLinks.selectAll("*").remove();
  gNodes.selectAll("*").remove();
  
  //usa il modello scientifico tramite API
  const useScientific = true;  // L'API gestisce tutto
  await buildGraph(336, useScientific);
  
  renderGraph();
  
  // Riprova a aggiornare i KPI dopo il rendering (gli elementi potrebbero essere ora disponibili)
  updateKPI();
  
  renderAchievementsUI();
}

// =============================================================================
// VERIFICA DELLE CONDIZIONI DI TERMINAZIONE
// Determina il vincitore in base alle percentuali finali di Believer e
// Fact-Checker. In caso di pareggio nella modalita competitiva,
// viene attivato un prolungamento della partita.
// =============================================================================
function checkGameEnd(){
  const lastDaily = state.daily[state.daily.length - 1];
  if(!lastDaily) return;
  
  const tot = state.nodes.length;
  const fakePct = pct(lastDaily.fake, tot);
  const truthPct = pct(lastDaily.truth, tot);
  
  // Determina il vincitore al giorno 7
  if(state.game.totalDaysPlayed >= CONST.DAYS){
    if(selectedMode === "Competitiva" && fakePct === truthPct){
      // Spareggio! Continua altri 2 giorni
      const originalDays = CONST.DAYS;
      CONST.DAYS = state.game.totalDaysPlayed + 2;
      showToast("Pareggio! Spareggio di 2 giorni...");
      return; // Non finisce ancora
    }
    
    // Proclama vincitore
    const winner = fakePct > truthPct ? "Fake 🔴" : "Verità 🟢";
    $("#winnerTeam").textContent = winner;
    $("#finalFake").textContent = fakePct;
    $("#finalTruth").textContent = truthPct;
    openModal("#winnerModal");
  }
}

// =============================================================================
// CONFIGURAZIONE DELLE MODALITA DI GIOCO
// Definisce i parametri di default per ciascuna modalita.
// NOTA: Questi valori sono solo riferimenti locali; i parametri effettivi
// della simulazione sono determinati dall'API backend.
// =============================================================================
const MODALITY_CONFIG = {
  Strategica: {
    params: { diffusion: 0.7, credibility: 0.2, forgetting: 0.5, verify: 0.4 }
  },
  Competitiva: {
    params: { diffusion: 0.7, credibility: 0.2, forgetting: 0.5, verify: 0.4 }
  },
  Libera: {
    params: { diffusion: 0.7, credibility: 0.2, forgetting: 0.5, verify: 0.4 }
  },
  'Prima Pagina': {
    params: { diffusion: 0.7, credibility: 0.2, forgetting: 0.5, verify: 0.4 }
  }
};

// 1. Definisci setMode base se non esiste
if (typeof setMode !== 'function') {
  window.setMode = async function(mode) {
    selectedMode = mode;
    TROPHY_SYSTEM.stats.modesPlayed.add(mode);
    // UI: aggiorna la topbar
    const currentModeEl = $("#currentMode");
    if(currentModeEl) currentModeEl.textContent = mode;
    // Disabilita il bottone modalità dopo la selezione
    const btnMode = $("#btnMode");
    if(btnMode) btnMode.disabled = true;
    showToast(`Modalità selezionata: ${mode}`);
    closeModal("#modeModal");
    // Avvia la partita normalmente
    await initializeGame();
  };
}
// 2. Modifica setMode per gestire la nuova modalità
const oldSetMode = setMode;
setMode = function(mode) {
  if (mode === 'Prima Pagina') {
    selectedMode = mode;
    TROPHY_SYSTEM.stats.modesPlayed.add(mode);
    // Mostra la notizia come card giornale, poi avvia la partita su quella notizia
    showNewsCard();
    // La funzione startGameAfterChoice() verrà chiamata dopo la scelta
    // e avvierà la giocabilità normalmente
    // UI: aggiorna la topbar
    const currentModeEl = $("#currentMode");
    if(currentModeEl) currentModeEl.textContent = mode;
    // Disabilita il bottone modalità dopo la selezione
    const btnMode = $("#btnMode");
    if(btnMode) btnMode.disabled = true;
    showToast(`Modalità selezionata: ${mode}`);
    closeModal("#modeModal");
    return;
  }
  // ...existing code...
  return oldSetMode.apply(this, arguments);
}

// =============================================================================
// CONFIGURAZIONE DELL'INTERFACCIA PER MODALITA
// Adatta la visibilita delle sezioni dell'interfaccia utente in base
// alla modalita di gioco selezionata, mostrando solo i controlli pertinenti.
// =============================================================================
function updateGameBaseForMode(mode){
  const gbSelectMode = $("#gb-select-mode");
  const gbContent = $("#gb-content");
  
  if(!gbSelectMode || !gbContent) return;

  // Transizione dalla schermata di selezione al contenuto effettivo
  gbSelectMode.style.display = "none";
  gbContent.style.display = "block";

  // Ripristino della visibilita di tutte le sezioni
  const sections = ["gb-strategies", "gb-competitive", "gb-free"];
  const hrs = ["hr-strategies", "hr-competitive", "hr-free"];
  sections.forEach(s => { const el = $("#"+s); if(el) el.style.display="none"; });
  hrs.forEach(h => { const el = $("#"+h); if(el) el.style.display="none"; });

  // Mostra sezioni per modalità
  if(mode === "Strategica"){
    $("#hr-strategies").style.display="block";
    $("#gb-strategies").style.display="block";
    // Attivazione dei pannelli specifici della modalita strategica
    $("#hr-boosts").style.display="block";
    $("#gb-boosts").style.display="block";
    $("#hr-targeted").style.display="block";
    $("#gb-targeted").style.display="block";
    $("#hr-predictive").style.display="block";
    $("#gb-predictive").style.display="block";
    // Gli achievement sono visualizzati in un modale dedicato
    // Inizializzazione dei parametri di gioco per la modalita strategica
    GAME_PARAMS.diffusion = 0.7;
    GAME_PARAMS.credibility = 0.2;
    GAME_PARAMS.forgetting = 0.5;
    GAME_PARAMS.verify = 0.4;
    CONST.FORGET_DAYS = Math.max(1, Math.round(GAME_PARAMS.forgetting * CONST.DAYS));
    state.game.coins = 400;
    state.game.movesPerDay = 3;
    state.game.movesLeft = 0; // Diventa 3 quando premi START
    updateGameBaseUI();
  }else if(mode === "Competitiva"){
    $("#hr-competitive").style.display="block";
    $("#gb-competitive").style.display="block";
    // Attivazione del pannello delle azioni competitive (Broadcast Wars)
    const bw = $("#broadcast-wars"); if(bw) bw.style.display = '';
    // Inizializzazione dei parametri per la modalita competitiva
    GAME_PARAMS.diffusion = 0.7;
    GAME_PARAMS.credibility = 0.2;
    GAME_PARAMS.forgetting = 0.5;
    GAME_PARAMS.verify = 0.4;
    CONST.FORGET_DAYS = Math.max(1, Math.round(GAME_PARAMS.forgetting * CONST.DAYS));
    // Istanziazione dell'avversario AI con il livello di difficolta selezionato
    const difficulty = $("#difficulty") ? $("#difficulty").value : 'expert';
    state.game.cpuOpponent = new CPUOpponent(difficulty);
    state.game.coins = 400;
    state.game.movesPerDay = 3;
    state.game.movesLeft = 0;
    // Visualizzazione del contatore delle mosse disponibili
    const cm = $("#compMoves"); if(cm) cm.textContent = `${state.game.movesPerDay} mosse/giorno`;
    updateCPUStats();
    updateGameBaseUI();

  }else if(mode === "Libera"){
    $("#hr-free").style.display="block";
    $("#gb-free").style.display="block";
    
    // NOTA ARCHITETTURALE: In questa modalita i campi input dell'interfaccia
    // sono puramente informativi. I parametri effettivi del modello
    // epidemiologico sono definiti e gestiti esclusivamente dall'API backend.
    showToast('Modalita Libera: parametri gestiti dall\'API');
    
    updateGameBaseUI();
  }
}

// =============================================================================
// STATO DEL SISTEMA DI GIOCO
// Struttura dati che mantiene le risorse del giocatore (crediti),
// le strategie attivate, i potenziamenti e lo stato dell'avversario AI.
// =============================================================================
state.game = {
  coins: 400,
  movesPerDay: 3,
  movesLeft: 3,
  boostMgr: new BoostManager(),  // Centralizzato
  campaign: { active: null, targetCommunity: null, multiplier: 1, daysLeft: 0 },
  strategies: { hubs: false, frontiere: false, random: false },
  competitive: { type: 'cpu', difficulty: 'beginner', moves: 2, playerTeam: null },
  cpuOpponent: null,
  battleWarsUsedToday: false,
  playerTeam: null, // Team scelto (fake o truth) per tutte le modalità
  currentMode: null,
  totalDaysPlayed: 0
};

const GAME_PARAMS = {
  diffusion: 0.7,
  credibility: 0.2,
  forgetting: 0.5,
  verify: 0.4,
};

function updateGameBaseUI(){
  const coins = $("#coinsValue"); if(coins) coins.textContent = state.game.coins;
  const moves = $("#movesLeft"); if(moves) moves.textContent = state.game.movesLeft;

  // enable/disable strategy buttons - disabilita se non c'è grafo o monete insufficienti
  const hasGraph = state.nodes && state.nodes.length > 0;
  const btnH = $("#btnHubs"), btnF = $("#btnFrontiere"), btnR = $("#btnRandom");
  if(btnH) btnH.disabled = !hasGraph || state.game.coins < 50 || state.game.strategies.hubs;
  if(btnF) btnF.disabled = !hasGraph || state.game.coins < 50 || state.game.strategies.frontiere;
  if(btnR) btnR.disabled = !hasGraph || state.game.coins < 30 || state.game.strategies.random;
}

// Funzione per mostrare la card iniziale con la notizia e la scelta
async function showNewsCard() {
  // Richiedi una notizia casuale all'API (URL assoluto per compatibilità con server statico)
  const res = await fetch('http://localhost:8000/api/v1/news/random');
  currentNews = await res.json();
  // Overlay fullscreen, nessun box, PNG naturale
  const overlay = document.createElement('div');
  overlay.className = 'news-card-overlay';
  overlay.style.background = 'rgba(30,40,60,0.88)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '10000';
  overlay.style.backdropFilter = 'blur(2px)';

  // PNG naturale, testo sopra in posizione assoluta centrata
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.display = 'inline-block';
  container.style.width = 'auto';
  container.style.height = 'auto';

  const img = document.createElement('img');
  img.src = 'assets/news template.png';
  img.alt = 'Prima Pagina';
  img.style.display = 'block';
  img.style.width = 'auto';
  img.style.height = 'auto';
  img.style.maxWidth = '98vw';
  img.style.maxHeight = '92vh';
  img.style.borderRadius = '0';
  img.style.boxShadow = '0 8px 40px #0002';

  // Wrapper per i testi e bottoni, centrato nella parte vuota del PNG
  const textWrap = document.createElement('div');
  textWrap.style.position = 'absolute';
  textWrap.style.top = '8%';
  textWrap.style.left = '0';
  textWrap.style.width = '100%';
  textWrap.style.textAlign = 'center';
  textWrap.style.pointerEvents = 'auto';
  textWrap.style.display = 'flex';
  textWrap.style.flexDirection = 'column';
  textWrap.style.alignItems = 'center';
  textWrap.style.justifyContent = 'flex-start';

  // Fonte
  const fonte = document.createElement('div');
  fonte.className = 'news-header';
  fonte.style.fontSize = '2.2em';
  fonte.style.fontWeight = '900';
  fonte.style.fontFamily = 'Impact, Georgia, serif';
  fonte.style.color = '#111';
  fonte.style.textTransform = 'uppercase';
  fonte.innerText = currentNews.source ? currentNews.source.toUpperCase() : 'TESTATA';

  // Data
  const today = new Date();
  const dateStr = today.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const data = document.createElement('div');
  data.className = 'news-date';
  data.style.fontSize = '1.1em';
  data.style.color = '#222';
  data.style.margin = '8px 0 18px 0';
  data.innerText = dateStr;

  // Notizia
  const headline = document.createElement('div');
  headline.className = 'news-headline';
  headline.style.fontWeight = 'bold';
  headline.style.color = '#111';
  headline.style.margin = '32px auto 0 auto';
  headline.style.lineHeight = '1.22';
  headline.style.fontFamily = 'Georgia, Times New Roman, Times, serif';
  headline.style.maxWidth = '78%';
  headline.style.padding = '0 2vw';
  headline.style.wordBreak = 'break-word';
  headline.style.textAlign = 'center';
  // Font-size dinamico: più testo = più piccolo
  const len = currentNews.text.length;
  let fz = 1.45;
  if (len > 90) fz = 1.18;
  else if (len > 60) fz = 1.32;
  headline.style.fontSize = fz + 'em';
  headline.style.padding = '0 4vw';
  headline.innerText = currentNews.text;

  // Scelte
  const choices = document.createElement('div');
  choices.className = 'news-card-choices';
  choices.style.position = 'static';
  choices.style.margin = '38px auto 0 auto';
  choices.style.display = 'flex';
  choices.style.justifyContent = 'center';
  choices.style.gap = '38px';
  choices.style.pointerEvents = 'auto';

  const btnFake = document.createElement('button');
  btnFake.id = 'btnFake';
  btnFake.className = 'news-choice-btn news-fake-btn';
  btnFake.innerText = 'FAKE';
  const btnTrue = document.createElement('button');
  btnTrue.id = 'btnTrue';
  btnTrue.className = 'news-choice-btn news-true-btn';
  btnTrue.innerText = 'VERA';
  choices.appendChild(btnFake);
  choices.appendChild(btnTrue);

  textWrap.appendChild(fonte);
  textWrap.appendChild(data);
  textWrap.appendChild(headline);
  textWrap.appendChild(choices);

  container.appendChild(img);
  container.appendChild(textWrap);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  btnFake.onclick = () => {
    userTeam = 'believer';
    document.body.removeChild(overlay);
    startGameAfterChoice();
  };
  btnTrue.onclick = () => {
    userTeam = 'factchecker';
    document.body.removeChild(overlay);
    startGameAfterChoice();
  };
}