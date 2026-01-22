// =============================================================================
// COSTANTI GLOBALI DEL SISTEMA
// Parametri invarianti che definiscono i vincoli temporali e le soglie
// del modello di simulazione epidemiologica della disinformazione.
// =============================================================================
const CONST = {
  DAYS: 7,
  FORGET_DAYS: 3,
  NEIGHBOR_THR: 0.4,
  SOURCES: { Facebook:0.7, Fanpage:0.6, AIFA:1.0, Reuters:0.95, BlogX:0.35 }
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
// Funzione asincrona che carica la struttura del grafo dal file JSON locale
// e la invia all'API backend per l'inizializzazione della simulazione.
// I parametri del modello epidemiologico (alpha, beta, p_v, p_f) sono
// determinati esclusivamente dall'API in base alla modalita selezionata.
// =============================================================================
async function buildGraph(N=336, useScientificModel=false){
  try {
    // Aspetta che graph.json sia caricato
    if (!graphDataReady || !graphData) {
      console.log('In attesa del caricamento di graph.json...');
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (graphDataReady && graphData) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    // Mappa modalità UI → modalità API
    const modeMap = {
      "Strategica": "strategica",
      "Competitiva": "competitiva", 
      "Libera": "libera"
    };
    
    const apiMode = modeMap[selectedMode] || "libera";
    
    // Passa SOLO la modalità - TUTTI i parametri vengono dall'API!
    const simParams = {
      mode: apiMode
    };

    console.log(`Modalita selezionata: ${selectedMode} - API mode: ${simParams.mode}`);
    console.log(`Parametri delegati all'API (mode: ${apiMode})`);

    // Carica IL TUO graph.json nell'API (stesso grafo del sito!)
    const apiResponse = await hoaxClient.loadGraph(graphData, simParams);

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
      role: nodeState === 'FC' ? 'fact_checker' : (nodeState === 'B' ? 'credulone' : 'neutral'),
      community: apiResponse.gullibility && apiResponse.gullibility[parseInt(nodeId)] > 0.5 ? 'gullible' : 'skeptic',
      memory: nodeState === 'B' ? 'fake' : (nodeState === 'FC' ? 'truth' : 'neutral'),
      memoryTime: 0,
      susceptibility: 0.5,
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
  // Lo stato scientifico determina univocamente il colore del nodo
  if (d.scientificState === 'B') return "#ff4757";      // Rosso: Believer (diffusore di disinformazione)
  if (d.scientificState === 'FC') return "#2ed573";     // Verde: Fact-Checker (verificatore)
  return "#c0c8d8";                                     // Grigio: Susceptible (suscettibile)
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

let graphData = null;
let graphDataReady = false;

// =============================================================================
// CARICAMENTO ASINCRONO DEL GRAFO STRUTTURALE
// Recupera la topologia della rete sociale dal file JSON predefinito.
// Il grafo contiene le coordinate spaziali dei nodi e le relazioni di vicinato.
// =============================================================================
fetch('graph.json')
  .then(response => response.json())
  .then(data => {
    graphData = data;
    graphDataReady = true;
    console.log('graph.json caricato:', graphData.nodes.length, 'nodi (posizioni e cluster)');
    // Rendering automatico al completamento del caricamento
    renderGraph();
  })
  .catch(err => console.warn('graph.json non trovato', err));

// =============================================================================
// FUNZIONE UNIFICATA DI COLORAZIONE DEI NODI
// Determina il colore di riempimento di un nodo in base al suo stato
// epidemiologico corrente. Supporta sia lo stato proveniente dall'API
// che la classificazione basata su attributi locali del grafo.
// =============================================================================
const nodeColor = (d) => {
  // Stato di gioco - Fact-Checker permanenti (massima priorita)
  if (d.isEternalFC) return "#00d4ff"; // Ciano brillante
  
  // Classificazione in base allo stato epidemiologico (Believer/Fact-Checker/Susceptible)
  if (d.scientificState === 'FC') {
    return "#2ed573"; // Verde: Fact-Checker (verificatore)
  }
  if (d.scientificState === 'B') {
    return "#ff4757"; // Rosso: Believer (diffusore di disinformazione)
  }
  if (d.scientificState === 'S') {
    return "#c0c8d8"; // Grigio: Susceptible (suscettibile)
  }
  
  // Classificazione alternativa basata sul raggio (grado di influenza)
  // Utilizzata quando lo stato epidemiologico non e disponibile
  if (d.radius !== undefined) {
    // Raggio elevato (>=7): nodi ad alta influenza, classificati come Believer
    if (d.radius >= 7) return "#ff4757";
    // Raggio medio (3-6): nodi moderatamente influenti, classificati come Fact-Checker
    if (d.radius >= 3) return "#2ed573";
    // Raggio basso (<3): nodi a bassa influenza, classificati come Susceptible
    return "#c0c8d8";
  }
  
  return "#c0c8d8"; // Colore predefinito: grigio neutrale
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
  if (!graphDataReady || !graphData) {
    console.error('graph.json non caricato');
    return;
  }

  // Configurazione delle dimensioni del canvas SVG
  const width = svg.node().getBoundingClientRect().width;
  const height = svg.node().getBoundingClientRect().height;
  svg.attr("width", width).attr("height", height).attr("viewBox", [-width/2, -height/2, width, height]);

  // Creazione di copie degli array per evitare mutazioni dell'originale
  // (la simulazione D3 modifica direttamente le coordinate dei nodi)
  const links = graphData.links.map(d => ({...d}));
  const nodes = graphData.nodes.map(d => ({...d}));

  console.log('graph.json:', nodes.length, 'nodi,', links.length, 'archi');

  // Costruzione della mappa di corrispondenza tra ID nodo e stato epidemiologico
  const stateMap = new Map();
  if (state.nodes && state.nodes.length > 0) {
    state.nodes.forEach((n) => {
      // Mappa per ID del nodo (non per indice)
      stateMap.set(n.id, n.scientificState);
    });
    console.log('Overlay stati API:', state.nodes.length, 'nodi');

// =============================================================================
// MAPPING TRA NODI GRAFICI E NODI DELLA SIMULAZIONE
// Associa a ciascun nodo del grafo visuale l'identificatore corrispondente
// nella simulazione API, consentendo la sincronizzazione bidirezionale.
// =============================================================================
if (state.nodes && state.nodes.length) {
  nodes.forEach((d, i) => {
    const simNode = state.nodes[i];
    if (simNode) {
      d.simId = simNode.id;                 // Identificatore numerico dell'API
      d.scientificState = simNode.scientificState;
    } else {
      d.simId = null;
    }
  });
}
  }

  // Memorizzazione del riferimento globale per aggiornamenti incrementali
  currentNodes = nodes;

  // Interruzione della simulazione precedente per evitare conflitti
  if(simulation) simulation.stop();

  // Inizializzazione della simulazione force-directed con forze multiple
  // (pattern di layout tipico delle visualizzazioni di reti sociali)
  simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // Creazione degli elementi grafici per gli archi (linee)
  const link = gLinks.selectAll("line")
    .data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`)
    .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

  // Creazione degli elementi grafici per i nodi (cerchi)
  const node = gNodes.selectAll("circle")
    .data(nodes, d => d.id)
    .join("circle")
      .attr("r", 5)
      .attr("fill", nodeColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (ev, d) => {
        // Gestione del click sui nodi: apre il modale solo per nodi
        // effettivamente presenti nella simulazione (con simId valido)
        if (d.simId === undefined) {
          console.warn(
            "Nodo grafico senza corrispondente nella simulazione",
            d.id
          );
          return;
        }

        console.log(
          `Nodo selezionato: simId=${d.simId}, stato=${d.scientificState}`
        );

        openNodeModalBySimId(d.simId);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Tooltip informativo per ciascun nodo
  node.append("title")
  .text(d => `ID: ${d.id}\nStato: ${d.scientificState}`);

  // Callback eseguita ad ogni iterazione della simulazione fisica
  // per aggiornare le posizioni degli elementi grafici
  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });
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
  const c={fake:0,truth:0,neutral:0}; state.nodes.forEach(n=> c[n.memory]++); return c;
}
function updateKPI(){
  const c=computeCounts(), tot=state.nodes.length;
  $("#kFake").textContent=pct(c.fake,tot)+"%";
  $("#kTruth").textContent=pct(c.truth,tot)+"%";
  $("#kNeutral").textContent=pct(c.neutral,tot)+"%";
}

// NOTA: calculateMeanFieldThreshold e updateSegregationMetrics sono state RIMOSSE
// I parametri della simulazione sono gestiti interamente dall'API.
// Non c'è più bisogno di calcoli locali - l'API decide tutto.


// Esegue ESATTAMENTE un giorno (state.currentDay), poi imposta currentDay = prossimo giorno.
// La label mostra l’ULTIMO giorno eseguito per chiarezza.
async function stepOneDay(){
  if(state.currentDay>CONST.DAYS) return;

  const day = state.currentDay;
  
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
      
      // Sincronizzazione con i nodi della visualizzazione D3
      const d3Node = currentNodes.find(n => n.id === node.id);
      if (d3Node) {
        d3Node.scientificState = newState;
        d3Node.type = newState === 'B' ? 'Believer (Fake)' : 
                      newState === 'FC' ? 'Fact-Checker (Verita)' : 
                      'Susceptible (Neutrale)';
      }
      
      // Mappatura dello stato alla memoria per retrocompatibilita
      if (newState === 'B') node.memory = 'fake';
      else if (newState === 'FC') node.memory = 'truth';
      else node.memory = 'neutral';
    });

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
    
    // Aggiornamento dei colori del grafo in tempo reale
    // Mappatura degli stati API agli elementi visuali D3 tramite identificatore
    const stateMap = new Map(Object.entries(newNodeStates).map(([id, state]) => [parseInt(id), state]));
    
    gNodes.selectAll("circle")
      .attr("fill", d => {
        // Normalizzazione dell'identificatore (supporto per tipi string e int)
        const nodeId = typeof d.id === 'string' ? parseInt(d.id) : d.id;
        const newState = stateMap.get(nodeId);
        if (newState) {
          d.scientificState = newState;
        }
        return nodeColor(d);
      });
    
    // Aggiornamento dei tooltip informativi
    gNodes.selectAll("circle").select("title").remove();
    gNodes.selectAll("circle").append("title").text(d => `${d.scientificState}\n${d.id}`);

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

$("#btnNext").addEventListener("click", async ()=>{
  if(state.currentDay <= CONST.DAYS) await stepOneDay();
});
$("#btnRunAll").addEventListener("click", async ()=>{
  while(state.currentDay <= CONST.DAYS){
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
$("#btnReset").addEventListener("click", ()=>{
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
$("#btnExportJson").addEventListener("click", ()=>{
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
$("#btnExportPng").addEventListener("click", ()=>{
  const canvas=$("#summaryChart");
  if(!canvas){ updateResultsChart(true); openModal("#resultsModal"); return; }
  const url=canvas.toDataURL("image/png"); const a=document.createElement("a");
  a.href=url; a.download=`giancarlo_ruffo_chart_${Date.now()}.png`; a.click();
});
$("#btnSave").addEventListener("click", saveSession);
$("#btnLoad").addEventListener("click", openLoadModal);
$("#loadClose").addEventListener("click", ()=> closeModal("#loadModal"));

// =============================================================================
// GESTIONE DELLA SELEZIONE DEL TEAM (MODALITA COMPETITIVA)
// Consente al giocatore di scegliere la fazione da rappresentare:
// Team Fake (diffusione disinformazione) o Team Verita (fact-checking).
// =============================================================================
const teamFakeBtn = $("#teamFake");
const teamTruthBtn = $("#teamTruth");
const teamCancelBtn = $("#teamCancel");

if(teamFakeBtn) teamFakeBtn.addEventListener("click", ()=>{
  // Registrazione della scelta del team nel sistema di stato
  state.game.competitive.playerTeam = "fake";
  state.game.playerTeam = "fake";
  closeModal("#teamModal");
  
  // Inizializzazione del grafo solo al primo avvio della partita
  if(state.currentDay === 1 && state.nodes.length === 0) {
    initializeGame();
  }
  
  state.game.movesLeft = state.game.movesPerDay;
  stepOneDay();
  showToast("Sei nel team Fake 🔴");
});

if(teamTruthBtn) teamTruthBtn.addEventListener("click", ()=>{
  // Registrazione della scelta del team nel sistema di stato
  state.game.competitive.playerTeam = "truth";
  state.game.playerTeam = "truth";
  closeModal("#teamModal");
  
  // Inizializzazione del grafo solo al primo avvio della partita
  if(state.currentDay === 1 && state.nodes.length === 0) {
    initializeGame();
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
let selectedMode = null;

// Inizializzazione dello stato di gioco dopo la selezione del team
function initializeGame(){
  state.currentDay = 1;
  state.daily = [];
  $("#dayLabel").textContent = 0;
  gLinks.selectAll("*").remove();
  gNodes.selectAll("*").remove();
  
  //usa il modello scientifico tramite API
  const useScientific = true;  // L'API gestisce tutto
  buildGraph(336, useScientific);
  
  renderGraph();
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
};

// Applica la configurazione della modalita selezionata e inizializza il gioco
function setMode(mode) {
  const cfg = MODALITY_CONFIG[mode];
  if (!cfg) return;

  selectedMode = mode;
  TROPHY_SYSTEM.stats.modesPlayed.add(mode);
  
  // Configurazione dell'interfaccia in base alla modalita selezionata
  updateGameBaseForMode(mode);

  // Aggiorna el currentMode nella topbar
  const currentModeEl = $("#currentMode");
  if(currentModeEl) currentModeEl.textContent = mode;

  // Disabilita il bottone modalità dopo la selezione
  const btnMode = $("#btnMode");
  if(btnMode) btnMode.disabled = true;

  showToast(`Modalità selezionata: ${mode}`);
  closeModal("#modeModal");
  
  // Ricaricamento del grafo con i parametri corrispondenti alla modalita
  console.log(`Ricaricamento grafo per modalita: ${mode}`);
  buildGraph(336, true).then(() => {
    console.log(`Grafo ricaricato con parametri modalita ${mode}`);
  });
  
  // Visualizzazione automatica del modale di selezione team
  setTimeout(() => {
    openModal("#teamModal");
  }, 300);
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
  if(btnH) btnH.disabled = !hasGraph || state.game.coins < 500;
  if(btnF) btnF.disabled = !hasGraph || state.game.coins < 350;
  if(btnR) btnR.disabled = !hasGraph || state.game.coins < 175;

  // libera: show params
  const pDiff = $("#paramDiffusion"), pCred = $("#paramCredibility"), pFor = $("#paramForgetting"), pVer = $("#paramVerify");
  if(pDiff && pCred && pFor && pVer){ pDiff.value = GAME_PARAMS.diffusion; pCred.value = GAME_PARAMS.credibility; pFor.value = GAME_PARAMS.forgetting; pVer.value = GAME_PARAMS.verify; }
}

// =============================================================================
// ACQUISTO E APPLICAZIONE DELLE STRATEGIE DI IMMUNIZZAZIONE
// Le strategie consentono di posizionare Fact-Checker in posizioni
// strategiche della rete secondo diversi criteri topologici.
// =============================================================================
function buyStrategy(name, cost){
  if(!state.nodes || state.nodes.length === 0) return showToast('Premi START per generare il grafo prima');
  if(state.game.coins < cost) return showToast('Monete insufficienti');
  if(selectedMode === "Strategica" && state.game.movesLeft <= 0) return showToast('Non hai più mosse per oggi!');
  
  state.game.coins -= cost; 
  state.game.strategies[name]=true; 
  
  // Nella modalita strategica, ogni azione consuma una mossa giornaliera
  if(selectedMode === "Strategica"){
    state.game.movesLeft--;
  }
  
  updateGameBaseUI();
  showToast(`Strategia ${name} acquistata`);
  
  // Applicazione della strategia: posizionamento di 16 Fact-Checker
  applyStrategy(name);
}

// Implementazione delle strategie di posizionamento dei Fact-Checker
function applyStrategy(strategyName){
  if(strategyName === "hubs"){
    // Strategia Hub: selezione dei nodi con il grado (numero di connessioni) piu elevato
    // Questi nodi hanno maggiore influenza nella propagazione dell'informazione
    const degrees = state.nodes.map(n => ({
      node: n,
      degree: state.links.filter(l => {
        const src = typeof l.source === "object" ? l.source.id : l.source;
        const tgt = typeof l.target === "object" ? l.target.id : l.target;
        return src === n.id || tgt === n.id;
      }).length
    }));
    degrees.sort((a, b) => b.degree - a.degree);
    // Conversione dei 16 nodi piu connessi in Fact-Checker
    for(let i = 0; i < Math.min(16, degrees.length); i++){
      if(degrees[i].node.role !== "fact_checker") {
        degrees[i].node.role = "fact_checker";
        degrees[i].node.isEternalFC = true;
        degrees[i].node.scientificState = 'FC';
        degrees[i].node.memory = 'truth';
        // NOTA: Questo aggiornamento e puramente visivo; la simulazione backend
        // non viene modificata direttamente da questa operazione
      }
    }
  }else if(strategyName === "frontiere"){
    // Strategia Frontiera: selezione dei nodi ponte tra comunita diverse
    // Implementazione semplificata basata sull'eterogeneita dei vicini
    const candidates = state.nodes.filter(n => {
      const neighbors = neighborsOf(n);
      if(neighbors.length === 0) return false;
      const roles = new Set(neighbors.map(nb => nb.role));
      return roles.size > 1; // ponte tra ruoli diversi
    });
    candidates.slice(0, 16).forEach(n => {
      if(n.role !== "fact_checker") {
        n.role = "fact_checker";
        n.isEternalFC = true;
        n.scientificState = 'FC';
        n.memory = 'truth';
        // NOTA: La simulazione è gestita dall'API - questo cambia solo la visualizzazione
      }
    });
  }else if(strategyName === "random"){
    // Strategia Random: selezione casuale uniforme di 16 nodi
    // Questa strategia serve come baseline per il confronto con strategie mirate
    const shuffled = [...state.nodes].sort(() => Math.random() - 0.5);
    for(let i = 0; i < Math.min(16, shuffled.length); i++){
      if(shuffled[i].role !== "fact_checker") {
        shuffled[i].role = "fact_checker";
        shuffled[i].isEternalFC = true;
        shuffled[i].scientificState = 'FC';
        shuffled[i].memory = 'truth';
        // NOTA: La simulazione è gestita dall'API - questo cambia solo la visualizzazione
      }
    }
  }
  
  // Aggiornamento della visualizzazione con i nuovi stati
  gNodes.selectAll('circle').attr('stroke', colorStroke).attr('fill', colorFill);
  showToast(`16 Fact-checker assegnati (${strategyName})`);
}

// =============================================================================
// AGGIUNTA MANUALE DI UN FACT-CHECKER PERMANENTE
// Consente al giocatore di selezionare interattivamente un nodo specifico
// da convertire in Fact-Checker con immunita visiva (bordo evidenziato).
// =============================================================================
function addEternalFactChecker(){
  if(!state.nodes || state.nodes.length === 0) return showToast('Premi START per generare il grafo prima');
  if(selectedMode === "Strategica" && state.game.movesLeft <= 0) return showToast('Non hai più mosse per oggi!');
  if(state.game.coins < 40) return showToast('Crediti insufficienti per aggiungere un Eternal FC (costo 40)');
  
  // Abilita selezione: chiedi di cliccare su un nodo
  selectingEternalFC = true;
  showToast('Clicca su un nodo per posizionare l\'Eternal Fact-Checker');
}

// Inizializzazione dei gestori eventi per i controlli dell'interfaccia di gioco
function initGameBaseHandlers(){
  const bH = $("#btnHubs"), bF=$("#btnFrontiere"), bR=$("#btnRandom");
  if(bH) bH.addEventListener('click', ()=> buyStrategy('hubs',500));
  if(bF) bF.addEventListener('click', ()=> buyStrategy('frontiere',350));
  if(bR) bR.addEventListener('click', ()=> buyStrategy('random',175));

  const btnAddFC = $("#btnAddEternal"); if(btnAddFC) btnAddFC.addEventListener('click', ()=> addEternalFactChecker());

  // NOTA ARCHITETTURALE: I gestori per la modifica dei parametri scientifici
  // (alpha, beta, p_v, p_f) sono stati rimossi in quanto questi parametri
  // sono ora gestiti esclusivamente dal backend API. L'interfaccia utente
  // puo visualizzare valori di riferimento ma non modificare la simulazione.
}

// =============================================================================
// GESTIONE DEL MODALE DI SELEZIONE MODALITA
// =============================================================================
const btnMode = $("#btnMode");
if(btnMode){
  btnMode.addEventListener("click", ()=>{
    // Ripristino dello stato di selezione al momento dell'apertura
    setTimeout(()=>{
      if(selectedMode) {
        const selected = $(`[data-mode="${selectedMode}"]`);
        if(selected) {
          // Rimuovi da tutti
          $$("[data-mode]").forEach(o => o.classList.remove("selected"));
          // Aggiungi al selezionato
          selected.classList.add("selected");
        }
      }
      openModal("#modeModal");
    }, 100);
  });
}
const modeClose = $("#modeClose");
if(modeClose) modeClose.addEventListener("click", ()=> closeModal("#modeModal"));

// Configurazione della logica di selezione nel modale delle modalita
(function setupModeModal(){
  const modeOpts = $$("[data-mode]");
  modeOpts.forEach(opt => {
    opt.addEventListener("click", function() {
      // Rimuovi selezione precedente
      modeOpts.forEach(o => o.classList.remove("selected"));
      // Marca questo come selezionato
      this.classList.add("selected");
      selectedMode = this.dataset.mode;
    });
  });

  const modeApply = $("#modeApply");
  if(modeApply){
    modeApply.addEventListener("click", ()=>{
      if(!selectedMode){
        showToast("Per favore seleziona una modalità");
        return;
      }
      setMode(selectedMode);
    });
  }
})();

// =============================================================================
// INIZIALIZZAZIONE DELL'APPLICAZIONE
// Funzione IIFE (Immediately Invoked Function Expression) che configura
// lo stato iniziale dell'applicazione e registra i gestori degli eventi.
// =============================================================================
(function init(){
  const daysTotal = $("#daysTotal");
  if(daysTotal) daysTotal.textContent = CONST.DAYS;
  // Calcolo del parametro di dimenticanza basato sulla durata della simulazione
  CONST.FORGET_DAYS = Math.max(1, Math.round(GAME_PARAMS.forgetting * CONST.DAYS));
  // Il rendering del grafo viene posticipato fino alla selezione della modalita
  initGameBaseHandlers();
  // Registrazione dei gestori per le funzionalita avanzate
  initStrategicHandlers();
  initCompetitiveHandlers();
  // L'interfaccia iniziale mostra solo il messaggio di benvenuto
})();

// =============================================================================
// FUNZIONI PER LA MODALITA STRATEGICA
// Gestione dei potenziamenti (boost), delle campagne mirate e delle
// previsioni sull'evoluzione della simulazione.
// =============================================================================
function initStrategicHandlers(){
  // Configurazione della visibilita delle sezioni specifiche
  const show = () => {
    const ids = ['#hr-strategies','#gb-strategies','#hr-boosts','#gb-boosts','#hr-targeted','#gb-targeted','#hr-predictive','#gb-predictive'];
    ids.forEach(id=>{ const el=$(id); if(el) el.style.display=''; });
  };
  // Registrazione degli eventi per i pulsanti dei potenziamenti
  const boostIds = ['#boostTruthAmp','#boostFakeVirus','#boostMassDebunk','#boostMemoryWipe','#boostSegregation'];
  boostIds.forEach(id=>{
    const el = $(id);
    if(!el) return;
    el.addEventListener('click', ()=> purchaseBoost(el.id, parseInt(el.dataset.cost,10)));
  });

  // Registrazione degli eventi per le campagne mirate
  const camps = ['#campGullible','#campSkeptic','#campFrontier'];
  camps.forEach(s=>{ const el = $(s); if(!el) return; el.addEventListener('click', ()=> purchaseCampaign(el)); });

  // Pulsante per le previsioni (funzionalita disabilitata)
  const btnPredict = $('#btnPredictNext3');
  if(btnPredict) btnPredict.addEventListener('click', ()=> showPredictiveNext3());

  // Inizializzazione della griglia degli achievement
  renderAchievementsUI();
  
  // Aggiornamento dello stato dei pulsanti in base alle risorse disponibili
  updateButtonStates();
}

// =============================================================================
// AGGIORNAMENTO DELLO STATO DEI CONTROLLI
// Abilita o disabilita i pulsanti in base alle risorse disponibili (crediti)
// e alle restrizioni della modalita di gioco corrente.
// =============================================================================
function updateButtonStates(){
  // Verifica disponibilita per i pulsanti dei potenziamenti
  const boostIds = ['#boostTruthAmp','#boostFakeVirus','#boostMassDebunk','#boostMemoryWipe','#boostSegregation'];
  boostIds.forEach(id=>{
    const el = $(id);
    if(!el) return;
    const cost = parseInt(el.dataset.cost, 10) || 0;
    const canAfford = state.game.coins >= cost;
    el.disabled = !canAfford;
    el.style.opacity = canAfford ? '1' : '0.5';
    el.style.cursor = canAfford ? 'pointer' : 'not-allowed';
  });
  
  // Verifica disponibilita per i pulsanti delle campagne
  const camps = ['#campGullible','#campSkeptic','#campFrontier'];
  camps.forEach(id=>{
    const el = $(id);
    if(!el) return;
    const cost = parseInt(el.dataset.cost, 10) || 0;
    const canAfford = state.game.coins >= cost;
    el.disabled = !canAfford;
    el.style.opacity = canAfford ? '1' : '0.5';
    el.style.cursor = canAfford ? 'pointer' : 'not-allowed';
  });
  
  // Verifica disponibilita per le azioni competitive (limite giornaliero)
  const battles = ['#battleSabotage','#battleSteal','#battleReverse'];
  battles.forEach(id=>{
    const el = $(id);
    if(!el) return;
    const cost = parseInt(el.dataset.cost, 10) || 0;
    const canAfford = state.game.coins >= cost;
    el.disabled = !canAfford || state.game.battleWarsUsedToday;
    el.style.opacity = (canAfford && !state.game.battleWarsUsedToday) ? '1' : '0.5';
    el.style.cursor = (canAfford && !state.game.battleWarsUsedToday) ? 'pointer' : 'not-allowed';
  });
}

// =============================================================================
// ACQUISTO E ATTIVAZIONE DEI POTENZIAMENTI
// Gestisce la transazione economica e l'effetto del potenziamento selezionato.
// Ciascun boost ha un effetto specifico sulla dinamica della simulazione.
// =============================================================================
function purchaseBoost(boostId, cost){
  if(!state.game.boostMgr) return showToast('Sistema non inizializzato');
  if(state.game.coins < cost) return showToast('Monete insufficienti');
  state.game.coins -= cost;
  
  // Aggiornamento delle statistiche per il sistema di achievement
  state.game.coins > TROPHY_SYSTEM.stats.maxCoins && (TROPHY_SYSTEM.stats.maxCoins = state.game.coins);
  TROPHY_SYSTEM.stats.boostsUsed[boostId] = (TROPHY_SYSTEM.stats.boostsUsed[boostId] || 0) + 1;
  
  switch(boostId){
    case 'boostTruthAmp':
      state.game.boostMgr.activate('truthAmp', 1, 1.5);
      showToast('Truth Amp attivato (1 giorno)');
      break;
    case 'boostFakeVirus':
      state.game.boostMgr.activate('fakeVirus', 1, 1.5);
      TROPHY_SYSTEM.stats.fakeVirusCount++;
      showToast('Fake Virus attivato (1 giorno)');
      break;
    case 'boostMassDebunk':
      applyMassDebunk(0.3);
      TROPHY_SYSTEM.stats.massDebunkCount++;
      showToast('Mass Debunk eseguito su 30% della rete');
      break;
    case 'boostMemoryWipe':
      applyMemoryWipe(0.2);
      TROPHY_SYSTEM.stats.memoryWipeCount++;
      showToast('Memory Wipe: 20% nodi tornano S');
      break;
    case 'boostSegregation':
      state.game.boostMgr.activate('quarantine', 1, 1, { deltaRho: -0.15 });
      showToast('Quarantine attivata: ridotta mixing per 1 giorno');
      break;
  }
  updateGameBaseUI();
  renderBoostsActive();
  TROPHY_SYSTEM.checkUnlocks();
}

// Acquisto di una campagna mirata su una specifica comunita della rete
function purchaseCampaign(el){
  const cost = parseInt(el.dataset.cost,10) || 0;
  if(state.game.coins < cost) return showToast('Monete insufficienti');
  state.game.coins -= cost;
  const tgt = el.dataset.target;
  const mult = parseFloat(el.dataset.mult) || 1.2;
  state.game.campaign = { active:true, targetCommunity:tgt, multiplier:mult, daysLeft:2 };
  showToast(`Campagna attiva su ${tgt} (${Math.round((mult-1)*100)}% effect)`);
  updateGameBaseUI();
}

// =============================================================================
// APPLICAZIONE DEL DEBUNKING MASSIVO
// Converte una frazione dei Believer in Fact-Checker.
// NOTA: Questa operazione ha effetto solo sulla visualizzazione locale;
// l'API backend potrebbe ripristinare gli stati originali al passo successivo.
// =============================================================================
function applyMassDebunk(frac){
  // Selezione dei nodi attualmente nello stato Believer
  const believers = state.nodes.filter(n => n.scientificState === 'B');
  const toConvert = Math.max(1, Math.floor(believers.length * frac));
  
  // Applicazione dell'effetto visivo di transizione
  believers.slice(0, toConvert).forEach(node => {
    node.isConverting = true; // Flag per l'animazione di conversione
    setTimeout(() => {
      node.isConverting = false;
    }, 600);
    
    // Aggiornamento dello stato visuale (non sincronizzato con l'API)
    node.scientificState = 'FC';
    node.memory = 'truth';
  });
  
  // Aggiorna visualmente subito
  gNodes.selectAll("circle")
    .attr("fill", d=> colorFill(d))
    .attr("stroke", d=> colorStroke(d))
    .classed("highlight-debunk", d => d.isConverting);
  
  setTimeout(() => {
    gNodes.selectAll("circle").classed("highlight-debunk", false);
  }, 600);
  
  // AVVERTENZA: La modifica dello stato e puramente visiva e temporanea.
  // Il backend API mantiene lo stato autoritativo della simulazione.
  showToast(`Mass Debunk: ${toConvert} nodi convertiti (effetto visivo)`);
}

// =============================================================================
// APPLICAZIONE DEL MEMORY WIPE
// Riporta una frazione casuale di nodi allo stato Susceptible,
// simulando la perdita di memoria dell'informazione precedente.
// =============================================================================
function applyMemoryWipe(frac){
  // Operazione sulla cache locale dei nodi
  const arr = state.nodes;
  const total = arr.length;
  const count = Math.max(1, Math.floor(total * frac));
  const shuffled = [...arr].sort(()=>Math.random()-0.5);
  
  // Applicazione dell'effetto visivo di reset
  shuffled.slice(0, count).forEach(node => {
    node.isWiping = true;
    // Transizione visuale allo stato Susceptible
    node.scientificState = 'S';
    node.memory = 'neutral';
  });
  
  gNodes.selectAll("circle")
    .classed("highlight-debunk", d => d.isWiping);
    
  for(let i=0;i<count;i++) shuffled[i].state = 'S';
  
  setTimeout(() => {
    shuffled.forEach(n => {
      const d3 = state.nodes.find(d => d.id === n.nodeId);
      if(d3) d3.isWiping = false;
    });
    gNodes.selectAll("circle").classed("highlight-debunk", false);
  }, 400);
}

// Visualizzazione dell'elenco dei potenziamenti attualmente attivi
function renderBoostsActive(){
  if(!state.game.boostMgr) return; // Verifica di sicurezza
  const active = state.game.boostMgr.getActive();
  const el = $("#boosts-active-list"); 
  if(el) el.textContent = active.length ? active.join(', ') : '—';
}

// =============================================================================
// RENDERING DELL'INTERFACCIA DEGLI ACHIEVEMENT
// Genera dinamicamente la griglia dei trofei organizzati per categoria,
// con indicazione visiva dello stato di sblocco.
// =============================================================================
function renderAchievementsUI(){
  const grid = $("#achievements-grid"); if(!grid) return;
  grid.innerHTML = '';
  
  // Definizione delle categorie con relativi attributi visivi
  const categories = {
    fake: { label: '🔴 Disinformazione', color: '#ef4444' },
    truth: { label: '🟢 Verità', color: '#22c55e' },
    competitive: { label: '⚔️ Competitiva', color: '#f97316' },
    exploration: { label: 'Esplorazione', color: '#a78bfa' },
    rare: { label: '⭐ Rari', color: '#fbbf24' }
  };
  
  for(const [catKey, catInfo] of Object.entries(categories)){
    const catTrophies = TROPHY_SYSTEM.trophies.filter(t => t.category === catKey);
    if(catTrophies.length === 0) continue;
    
    const catDiv = document.createElement('div');
    catDiv.style.marginBottom = '12px';
    catDiv.innerHTML = `<div style="font-size:0.9em; font-weight:bold; color:${catInfo.color}; margin-bottom:6px;">${catInfo.label}</div>`;
    
    const trophyContainer = document.createElement('div');
    trophyContainer.style.display = 'grid';
    trophyContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    trophyContainer.style.gap = '6px';
    
    catTrophies.forEach(trophy => {
      const tDiv = document.createElement('div');
      tDiv.style.cssText = `
        border: 1px solid ${trophy.unlocked ? catInfo.color : 'rgba(255,255,255,0.1)'};
        padding: 8px;
        border-radius: 8px;
        background: ${trophy.unlocked ? `rgba(${catInfo.color === '#ef4444' ? '239,68,68' : catInfo.color === '#22c55e' ? '34,197,94' : '249,115,22'},0.1)` : 'rgba(255,255,255,0.02)'};
        opacity: ${trophy.unlocked ? 1 : 0.6};
        font-size: 0.8em;
        cursor: pointer;
        transition: all 0.3s;
      `;
      tDiv.innerHTML = `<strong>${trophy.name}</strong><br><small>${trophy.desc}</small>`;
      tDiv.title = trophy.unlocked ? 'Sbloccato!' : 'Non ancora sbloccato';
      trophyContainer.appendChild(tDiv);
    });
    
    catDiv.appendChild(trophyContainer);
    grid.appendChild(catDiv);
  }
}

// =============================================================================
// FUNZIONALITA PREDITTIVA (DISABILITATA)
// La simulazione predittiva locale e stata disabilitata in quanto tutti
// i calcoli del modello epidemiologico sono ora delegati all'API backend.
// Per implementare questa funzionalita sarebbe necessario un endpoint
// API dedicato che restituisca le proiezioni future.
// =============================================================================
function showPredictiveNext3(){
  showToast('Previsioni disabilitate: utilizza l\'API per la simulazione');
  return;
}

// =============================================================================
// GESTORI DELLA MODALITA COMPETITIVA
// Funzioni per le azioni speciali disponibili nella competizione contro l'AI.
// =============================================================================
function initCompetitiveHandlers(){
  const show = ()=>{
    const ids = ['#hr-competitive','#gb-competitive']; ids.forEach(id=>{ const el=$(id); if(el) el.style.display=''; });
  };
  ["#battleSabotage","#battleSteal","#battleReverse"].forEach(id=>{ const el=$(id); if(!el) return; el.addEventListener('click', ()=> performBattleAction(id)); });
}

// Esecuzione di un'azione competitiva contro l'avversario AI
function performBattleAction(id){
  const el = $(id); if(!el) return;
  const cost = parseInt(el.dataset.cost,10) || 0;
  if(state.game.coins < cost) return showToast('Monete insufficienti');
  if(state.game.battleWarsUsedToday) return showToast('Azione già consumata oggi');
  state.game.coins -= cost; state.game.battleWarsUsedToday = true;
  switch(id){
    case '#battleSabotage':
      if(state.game.cpuOpponent) state.game.cpuOpponent.moveCount = Math.max(0,(state.game.cpuOpponent.moveCount||3)-1);
      showToast('Sabotage eseguito: CPU avrà 1 mossa in meno');
      break;
    case '#battleSteal':
      if(state.game.cpuOpponent){ 
        const stolen = Math.min(30, state.game.cpuOpponent.coins); 
        state.game.coins += stolen; 
        state.game.cpuOpponent.coins = Math.max(0, state.game.cpuOpponent.coins - stolen);
        showToast(`Ruba eseguito: +${stolen} 💰`);
      }
      break;
    case '#battleReverse':
      state.game.boostMgr.activate('reverseTrend', 1);
      showToast('Trend invertito per 1 giorno');
      break;
  }
  updateGameBaseUI();
  updateCPUStats();
}

// =============================================================================
// AGGIORNAMENTO DELLE STATISTICHE DELL'AVVERSARIO AI
// Calcola e visualizza i contatori di performance per entrambi i giocatori.
// =============================================================================
function updateCPUStats(){
  if(!state.game.cpuOpponent) return;
  const counts = computeCounts();
  const total = state.nodes.length || 1;
  const playerFakePct = pct(counts.fake, total);
  const playerTruthPct = pct(counts.truth, total);
  
  // Mostra stats 
  const pfC = $("#playerFakeComp"); if(pfC) pfC.textContent = playerFakePct;
  const ptC = $("#playerTruthComp"); if(ptC) ptC.textContent = playerTruthPct;
  
  // Statistiche dell'AI (stimate con variazione stocastica)
  const cpuCounts = { fake: Math.floor(counts.fake * (0.8 + Math.random()*0.4)), truth: Math.floor(counts.truth * (1.2 + Math.random()*0.3)) };
  const cpuFakePct = pct(cpuCounts.fake, total);
  const cpuTruthPct = pct(cpuCounts.truth, total);
  
  const cfC = $("#cpuFakeComp"); if(cfC) cfC.textContent = cpuFakePct;
  const ctC = $("#cpuTruthComp"); if(ctC) ctC.textContent = cpuTruthPct;
}

// =============================================================================
// DECISIONE DELL'AVVERSARIO AI
// Invocata al termine di ogni turno del giocatore nella modalita competitiva.
// L'algoritmo valuta lo stato corrente e seleziona l'azione ottimale.
// =============================================================================
function makeAIMove(){
  if(!state.game.cpuOpponent || selectedMode !== "Competitiva") return;
  
  const counts = computeCounts();
  const total = state.nodes.length || 1;
  const playerFakePct = pct(counts.fake, total);
  const playerTruthPct = pct(counts.truth, total);
  
  // Calcolo della mossa ottimale dell'AI
  const move = state.game.cpuOpponent.makeMove(playerFakePct, playerTruthPct, total);
  
  if(move){
    switch(move.type){
      case 'boost':
        showToast(`CPU attiva ${move.name}`);
        break;
      case 'campaign':
        showToast(`CPU lancia campagna su ${move.target}`);
        break;
    }
  }
  
  updateCPUStats();
}

// Aggiornamento sincronizzato di tutti gli elementi dell'interfaccia di gioco
function updateGameBaseUI(){
  const coins = $("#coinsValue"); if(coins) coins.textContent = state.game.coins;
  const moves = $("#movesLeft"); if(moves) moves.textContent = state.game.movesLeft;
  renderBoostsActive();
  updateButtonStates();
}

// =============================================================================
// INIZIALIZZAZIONE AUTOMATICA AL CARICAMENTO DELLA PAGINA
// Configura l'ambiente di simulazione appena il DOM e completamente caricato.
// =============================================================================
window.addEventListener('DOMContentLoaded', async () => {
  console.log('Inizializzazione automatica del grafo...');
  try {
    // Caricamento del grafo e inizializzazione della comunicazione con l'API
    await buildGraph(336, true);
    // Rendering della visualizzazione basata sui dati di graph.json
    renderGraph();
    updateKPI();
    console.log('Grafo inizializzato con successo');
  } catch (error) {
    console.error('Errore durante l\'inizializzazione automatica:', error);
    showToast('Errore inizializzazione grafo. Ricarica la pagina.');
  }
});