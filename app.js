// ===== costanti fisse =====
const CONST = {
  DAYS: 7,
  FORGET_DAYS: 3,
  NEIGHBOR_THR: 0.4,
  SOURCES: { Facebook:0.7, Fanpage:0.6, AIFA:1.0, Reuters:0.95, BlogX:0.35 }
};

// ===== SISTEMA TROFEI (20+ Achievements) =====
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
    // Controlla tutti i trofei in base alle stats
    const s = this.stats;
    const c = computeCounts && computeCounts() || {};
    const tot = state.nodes ? state.nodes.length : 1;
    const fakePct = pct(c.fake, tot);
    const truthPct = pct(c.truth, tot);
    
    // Fake News trophies
    if (fakePct > 70) this.unlock('fake_rising');
    if (fakePct > 85) this.unlock('fake_dominance');
    if (s.fakeVirusCount >= 5) this.unlock('fake_viral');
    if (s.sabotageCount >= 3) this.unlock('fake_saboteur');
    if (s.stealCount >= 3) this.unlock('fake_thief');
    
    // Verità trophies
    if (truthPct > 70) this.unlock('truth_rising');
    if (truthPct > 85) this.unlock('truth_dominance');
    if (s.massDebunkCount >= 5) this.unlock('truth_debunker');
    if (s.eternalFCCount >= 10) this.unlock('truth_guardian');
    if (s.predictionsCorrect >= 3) this.unlock('truth_prophecy');
    
    // Competitivi
    if (s.competitiveVictories >= 1) this.unlock('comp_victor');
    if (s.competitiveVictories >= 3) this.unlock('comp_streak');
    if (s.maxCoins >= 1000) this.unlock('comp_riches');
    if (Object.keys(s.boostsUsed).length >= 15) this.unlock('comp_strategist');
    
    // Exploration
    if (s.modesPlayed.size >= 3) this.unlock('all_modes');
    if (Math.abs(fakePct - truthPct) <= 10 && fakePct > 30) this.unlock('perfect_balance');
    
    // Rari
    if (s.memoryWipeCount >= 5) this.unlock('memory_master');
  }
};

// ===== BOOST MANAGER - Centralizza stato, durata e effetti =====
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

// ===== CPU OPPONENT - AI che gioca in parallelo =====
class CPUOpponent {
  constructor(difficulty = 'beginner') {
    this.coins = 400;
    this.difficulty = difficulty; // beginner, expert, extreme
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

const state = {
  appName: "Giancarlo Ruffo",
  // Invariante: currentDay = PROSSIMO giorno da simulare (parte da 1)
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
  // Game state - Strategica & Competitiva
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

// SVG + layers
const svg   = d3.select("#graph");
const root  = svg.append("g");                // trasformato da zoom
const bg    = root.append("rect")             // background sotto i nodi (cattura pan/zoom)
                 .attr("fill", "transparent")
                 .attr("x", 0).attr("y", 0);
const gLinks= root.append("g").attr("stroke", "#26334a");
const gNodes= root.append("g");

let simulation;

// ===== util =====
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const clamp01 = x => Math.max(0, Math.min(1, x));
const pct = (n,t)=> Math.round(n/Math.max(1,t)*100);
function rndNormal(m=0.5,s=0.2){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();const z=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);return clamp01(m+z*s);}



// ===== build & render grafo =====
function buildGraph(N=120, useScientificModel=false){
  if (useScientificModel && typeof generateSegregatedNetwork !== 'undefined') {
    // MODELLO SCIENTIFICO: Genera rete segregata dal paper
    const rho = SCIENTIFIC_PARAMS.rho || 0.6;
    const gamma = SCIENTIFIC_PARAMS.gamma || 0.5;
    
    const { nodes: scientificNodes, links: scientificLinks } = generateSegregatedNetwork(N, rho, gamma);
    
    // Conserva riferimento agli oggetti ScientificNodeState
    state.scientificNodes = scientificNodes;
    
    // Inizializza seeders: B0 = 10% believers in gullible community, F0 = 10% fact-checkers in skeptic community
    const gullibleNodes = scientificNodes.filter(n => n.community === 'gullible');
    const skepticNodes = scientificNodes.filter(n => n.community === 'skeptic');
    
    const B0 = Math.max(1, Math.floor(gullibleNodes.length * 0.35));
    const F0 = Math.max(1, Math.floor(skepticNodes.length * 0.1));
    
    // Assegna stato iniziale B a believers (gullible community)
    for (let i = 0; i < B0; i++) {
      gullibleNodes[i].state = 'B';
      gullibleNodes[i].timeInState = 0;
    }
    
    // Assegna stato iniziale F a fact-checkers (skeptic community)
    for (let i = 0; i < F0; i++) {
      skepticNodes[i].state = 'F';
      skepticNodes[i].timeInState = 0;
    }
    
    // Converti a formato visualizzazione D3
    state.nodes = scientificNodes.map(sn => ({
      id: sn.nodeId,
      role: sn.community === 'gullible' ? 'credulone' : 'fact_checker',
      community: sn.community,
      memory: "neutral",
      memoryTime: 0,
      scientificState: sn.state,  // S, B, F
      susceptibility: sn.alpha,
      isEternalFC: false  // Flag per eternal fact-checkers
    }));
    
    state.links = scientificLinks.map(l => ({
      source: l.source,
      target: l.target,
      w: 0.6 + Math.random() * 0.8
    }));
    
    // Calcola metriche di segregazione
    state.scientificModel.segregationMetrics = calculateSegregationMetrics(scientificNodes, scientificLinks);
    state.scientificModel.enabled = true;
    
  } else {
    // MODELLO LEGACY: distribuzione casuale dei ruoli
    const fcPct = 0.2, crPct = 0.5;
    state.nodes = d3.range(N).map(i=>{
      const r=Math.random();
      let role="neutral";
      if(r<fcPct) role="fact_checker";
      else if(r<fcPct+crPct) role="credulone";
      return { id:i, role, community:"neutral", memory:"neutral", memoryTime:0, susceptibility:rndNormal(0.5,0.2), scientificState:'S' };
    });

    state.links = [];
    const p = 0.02 + (N>150?0.01:0);
    for(let i=0;i<N;i++) for(let j=i+1;j<N;j++) if(Math.random()<p) state.links.push({source:i,target:j,w:0.6+Math.random()*0.8});
    if(state.links.length===0) for(let i=0;i<N-1;i++) state.links.push({source:i,target:i+1,w:1});
    
    state.scientificModel.enabled = false;
  }
  
  // Sincronizza gameNodes: crea array che mapperà graph.json nodes (336) ai game state nodes
  state.gameNodes = state.nodes.slice();
}

function colorFill(d){ 
  // Usa SOLO lo scientificState per il colore principale
  if (d.scientificState === 'B') return "#ff4757";      // ROSSO per Believer (Fake news)
  if (d.scientificState === 'F') return "#2ed573";      // VERDE per Fact-Checker (Verità)
  return "#c0c8d8";                                      // GRIGIO per Susceptible (Neutrale)
}

function colorStroke(d){ 
  // Usa bordo molto più spesso e vivace per gli Eternal Fact-Checkers
  if (d.isEternalFC) return "#00d4ff";      // CYAN BRILLANTE per Eternal Fact-Checker
  return "rgba(255,255,255,0.1)";           // Bianco quasi trasparente per gli altri
}

function strokeWidth(d) {
  // Bordo SUPER SPESSO per gli Eternal Fact-Checkers - MAXIMAMENTE VISIBILE
  return d.isEternalFC ? 8 : 0.5;
}

function linkColor(d) {
  // Link BIANCHI super visibili nel grafo
  return "rgba(255, 255, 255, 0.8)";
}

function linkStrokeWidth(d) {
  // Link SPESSI e visibili
  return Math.max(2, d.w * 2);
}

let graphData = null;
let graphDataReady = false;

// Load graph.json data
fetch('graph.json')
  .then(response => response.json())
  .then(data => {
    graphData = data;
    graphDataReady = true;
    console.log('graph.json caricato:', graphData.nodes.length, 'nodi');
  })
  .catch(err => console.warn('graph.json non trovato', err));

// Color function: supports game state (Eternal FC / Believer/Fact-Checker/Susceptible)
// Può essere usata sia in renderGraph() che in stepOneDay()
const nodeColor = (d) => {
  // Game state - Eternal Fact-Checkers (massima priorità)
  if (d.isEternalFC) return "#00d4ff"; // Cyan brillante
  
  // Game state nodes (Believer/Fact-Checker/Susceptible)
  if (d.scientificState === 'F') return "#2ed573"; // Truth Green (Fact-Checker)
  if (d.scientificState === 'B') return "#ff4757"; // Fake Red (Believer)
  if (d.scientificState === 'S') return "#c0c8d8"; // Neutral Gray (Susceptible)
  
  // graph.json nodes: classify by radius (citations count = impact)
  if (d.radius !== undefined) {
    // High radius (7+) = Believers (heavily cited, strong influence)
    if (d.radius >= 7) return "#ff4757"; // Red (Believer)
    // Medium radius (3-6) = Fact-Checkers (moderate evidence)
    if (d.radius >= 3) return "#2ed573"; // Green (Fact-Checker)
    // Low radius (1-2) = Susceptible (weak evidence)
    return "#c0c8d8"; // Gray (Susceptible)
  }
  
  return "#c0c8d8"; // Default Neutral Gray
};

function renderGraph(){
  // Aspetta che graph.json sia caricato
  if (!graphDataReady || !graphData) {
    console.warn('graph.json ancora in caricamento, ritentando...');
    setTimeout(renderGraph, 500);
    return;
  }
  
  // Specify the dimensions of the chart.
  const width = svg.node().getBoundingClientRect().width;
  const height = svg.node().getBoundingClientRect().height;

  svg.attr("width", width).attr("height", height);

  // USA SOLO graph.json nodes per la simulazione con 336 nodi
  let nodes, links;
  
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    console.error('graph.json non disponibile!');
    return;
  }
  
  // Copia graph.json nodes e links
  // Sincronizza scientificState dai game nodes (state.nodes) ai graph.json nodes
  nodes = graphData.nodes.map((d, idx) => {
    let scientificState = 'S'; // Default Susceptible
    
    // Distribuisci i game nodes ai graph.json nodes mediante mapping ciclico
    if (state.nodes && state.nodes.length > 0) {
      const gameNodeIdx = idx % state.nodes.length;
      scientificState = state.nodes[gameNodeIdx].scientificState || 'S';
    } else {
      // Fallback: classifica per radius
      if (d.radius >= 7) scientificState = 'B'; // Believer
      else if (d.radius >= 3) scientificState = 'F'; // Fact-Checker
      else scientificState = 'S'; // Susceptible
    }
    
    return {
      ...d,
      id: d.id || idx,
      scientificState,
      radius: d.radius || 5,
      index: idx
    };
  });
  
  links = graphData.links.map(d => ({...d}));

  // Classifica i nodi per tipo (Believer/Fact-Checker/Susceptible)
  nodes.forEach(d => {
    if (d.scientificState === 'B') {
      d.type = 'Believer (Fake)';
      d.group = 'Believer';
    }
    else if (d.scientificState === 'F') {
      d.type = 'Fact-Checker (Verità)';
      d.group = 'Fact-Checker';
    }
    else if (d.scientificState === 'S') {
      d.type = 'Susceptible (Neutrale)';
      d.group = 'Susceptible';
    }
    else if (d.isEternalFC) {
      d.type = 'Eternal Fact-Checker';
      d.group = 'Fact-Checker';
    }
    else if (d.radius !== undefined && d.radius > 0) {
      // Classifica per radius (numero di citazioni)
      if (d.radius >= 7) {
        d.type = 'Believer (Alta influenza)';
        d.group = 'Believer';
      }
      else if (d.radius >= 3) {
        d.type = 'Fact-Checker (Media influenza)';
        d.group = 'Fact-Checker';
      }
      else {
        d.type = 'Susceptible (Bassa influenza)';
        d.group = 'Susceptible';
      }
    }
    else {
      d.type = 'Unknown';
      d.group = 'Susceptible';
    }
  });

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.

  // Stop previous simulation
  if(simulation) simulation.stop();

  // Create a simulation with several forces.
  simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // Add a line for each link, and a circle for each node.
  const link = gLinks.selectAll("line").data(links, d=>`${d.source.id || d.source}-${d.target.id || d.target}`);
  link.exit().remove();
  link.enter()
    .append("line")
    .attr("stroke", "rgba(255, 255, 255, 0.8)")
    .attr("stroke-opacity", 0.6)
    .merge(link)
    .attr("stroke-width", d => Math.sqrt(d.value || d.w || 1));

  const node = gNodes.selectAll("circle").data(nodes, d => d.id);
  node.exit().remove();
  
  const newNodes = node.enter()
    .append("circle")
    .attr("class", "node")
    .on("click", (ev, d) => {
      console.log(`Node clicked: [${d.type}]`, d);
      // Sempre apri il modale, indipendentemente da state.nodes
      // (che potrebbe avere meno nodi rispetto a graph.json)
      openNodeModal(d);
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  // Merge e applica attributi visivi
  const allNodes = node.merge(newNodes)
    .attr("r", d => Math.max(3, d.radius / 2))  // Scala il radius di graph.json
    .attr("fill", nodeColor)
    .attr("stroke", d => d.isEternalFC ? "#00d4ff" : "rgba(255, 255, 255, 0.8)")
    .attr("stroke-width", d => d.isEternalFC ? 8 : 0.5)
    .attr("opacity", 1);  // Tutti completamente visibili

  // Tooltip con tipo di nodo
  newNodes.append("title").text(d => `${d.type}\n${d.id}`);

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    gLinks.selectAll("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    gNodes.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", nodeColor);
  });
  
  // Applica zoom iniziale fisso (0.8x) dopo che la simulazione converge
  // Questo centra il grafo al caricamento
  setTimeout(() => {
    const initialZoom = d3.zoomIdentity.translate(width / 2, height / 2).scale(1.0);
    svg.transition().duration(500).call(zoom.transform, initialZoom);
  }, 1000);
}

// Funzioni drag per trascinare i nodi
function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

// Pan & Zoom
const zoom = d3.zoom()
  .scaleExtent([0.4, 3])
  .on("zoom", (ev)=> { root.attr("transform", ev.transform); });
svg.call(zoom);
svg.on("dblclick.zoom", null);
svg.on("dblclick", ()=> { svg.transition().duration(200).call(zoom.transform, d3.zoomIdentity); });

// resize reattivo
window.addEventListener("resize", ()=> renderGraph());

// ===== overlay =====
function showOverlay(){ $("#startOverlay").style.display="flex"; }
function hideOverlay(){ $("#startOverlay").style.display="none"; }

// ===== simulazione =====
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

function updateSegregationMetrics(){
  if (!state.scientificModel.enabled) return;
  
  const metrics = state.scientificModel.segregationMetrics;
  const interGroup = $("#metricsInterGroup");
  const segratio = $("#metricsSegratio");
  
  if (interGroup) interGroup.textContent = `${metrics.interGroupEdges} / ${metrics.totalEdges}`;
  if (segratio) segratio.textContent = (metrics.segregationRatio * 100).toFixed(1) + "%";
  
  // Calcola e mostra il threshold mean-field
  const threshold = calculateMeanFieldThreshold();
  const thresholdDisplay = $("#thresholdStatus");
  
  if (thresholdDisplay) {
    const statusIcon = threshold.isSatisfied ? '✅' : '⚠️';
    const statusColor = threshold.isSatisfied ? '#22c55e' : '#f97316';
    thresholdDisplay.innerHTML = `
      <div style="margin-top: 10px; padding: 8px; background: rgba(${threshold.isSatisfied ? '34, 197, 94' : '249, 115, 22'}, 0.1); 
                  border-left: 3px solid ${statusColor}; border-radius: 3px;">
        <small><strong>${statusIcon} ${threshold.status}</strong></small>
        <div style="font-size: 0.8em; margin-top: 4px; color: #e5e7eb;">
          <div>pf: ${threshold.currentPf.toFixed(3)}</div>
          <div>Soglia: ${threshold.theoreticalThreshold.toFixed(3)}</div>
        </div>
      </div>
    `;
  }
}

// Esegue ESATTAMENTE un giorno (state.currentDay), poi imposta currentDay = prossimo giorno.
// La label mostra l’ULTIMO giorno eseguito per chiarezza.
function stepOneDay(){
  if(state.currentDay>CONST.DAYS) return; // sicurezza

  const day = state.currentDay;
  
  // ===== 🔬 SCIENTIFIC MODEL (TUTTE LE MODALITÀ) =====
  // Usa il modello scientifico compartimentale per tutte le modalità
  if(state.scientificModel.enabled && state.scientificNodes && state.scientificNodes.length > 0){
    // Applica modificatori temporanei dai boosts / campagne
    const originalParams = { ...SCIENTIFIC_PARAMS };
    const originalAlphas = state.scientificNodes.map(n=>n.alpha);

    // Boost: Truth Amp aumenta probabilità di verifica (pv)
    if(state.game.boostMgr && state.game.boostMgr.isActive('truthAmp')){
      const boost = state.game.boostMgr.boosts.truthAmp;
      SCIENTIFIC_PARAMS.pv = Math.min(1, SCIENTIFIC_PARAMS.pv * (boost.multiplier || 1.5));
    }
    // Boost: Fake Virus aumenta beta
    if(state.game.boostMgr && state.game.boostMgr.isActive('fakeVirus')){
      const boost = state.game.boostMgr.boosts.fakeVirus;
      SCIENTIFIC_PARAMS.beta = Math.min(1, SCIENTIFIC_PARAMS.beta * (boost.multiplier || 1.5));
    }
    // Campaign: riduce credibilità del fake nella community target (temporaneo)
    if(state.game.campaign && state.game.campaign.active){
      const alphaFactor = 1 - (((state.game.campaign.multiplier||1.2)-1) * 0.6);
      state.scientificNodes.forEach(n=>{
        if(state.game.campaign.targetCommunity === 'frontier'){
          // frontiera: applichiamo su metà dei gullible per semplicità
          if(n.community === 'gullible' && Math.random() < 0.5) n.alpha = n.alpha * alphaFactor;
        } else if(n.community === state.game.campaign.targetCommunity){
          n.alpha = n.alpha * alphaFactor;
        }
      });
    }

    // Esegui un passo della simulazione scientifica
    const result = simulateOneDay(state.scientificNodes, state.links);

    // Se reverseTrend è attivo (battle) inverti B <-> F per aumentare impatto
    if(state.game.boostMgr && state.game.boostMgr.isActive('reverseTrend')){
      state.scientificNodes.forEach(n=>{ if(n.state==='B') n.state='F'; else if(n.state==='F') n.state='B'; });
      // disattiva subito
      state.game.boostMgr.deactivate('reverseTrend');
    }

    // Ripristina parametri e alpha originali
    SCIENTIFIC_PARAMS.beta = originalParams.beta;
    SCIENTIFIC_PARAMS.pv = originalParams.pv;
    SCIENTIFIC_PARAMS.pf = originalParams.pf;
    state.scientificNodes.forEach((n,i)=> n.alpha = originalAlphas[i]);

    // Sincronizza gli stati scientifici nei nodi D3
    state.nodes.forEach((d3Node, idx) => {
      const scientificNode = state.scientificNodes[idx];
      d3Node.scientificState = scientificNode.state;  // S, B, o F
      
      // Mappa lo stato scientifico al formato legacy (per compatibilità KPI)
      if (scientificNode.state === 'B') d3Node.memory = 'fake';
      else if (scientificNode.state === 'F') d3Node.memory = 'truth';
      else d3Node.memory = 'neutral';
    });
    
    // Sincronizza anche gameNodes (per graph.json)
    if (state.gameNodes) {
      state.gameNodes.forEach((node, idx) => {
        if (state.scientificNodes[idx]) {
          node.scientificState = state.scientificNodes[idx].state;  // S, B, o F
        }
      });
    }
    
    // Calcola conteggi per il giorno
    const c = {
      fake: result.counts.B,
      truth: result.counts.F,
      neutral: result.counts.S
    };
    
    state.daily.push({day, fake:c.fake, truth:c.truth, neutral:c.neutral, event: ""});
    
    // Decrementa giorni dei boosts/campaign attivi e pulisci
    state.game.boostMgr.tickDay();
    if(state.game.campaign && state.game.campaign.active){
      state.game.campaign.daysLeft -= 1;
      if(state.game.campaign.daysLeft <= 0) state.game.campaign.active = false;
    }
    // reset battle usage per day
    state.game.battleWarsUsedToday = false;
    
  } else {
    // ===== LEGACY MODEL (Fallback - se scientificNodes non disponibile) =====
    const ev = applyEvent(day);
    const srcW = ev ? (CONST.SOURCES[ev.source]||0.5) : 0, thr = CONST.NEIGHBOR_THR;

    state.nodes.forEach(n=>{
      const neigh=neighborsOf(n), deg=Math.max(1,neigh.length);
      const f=neigh.filter(v=>v.memory==="fake").length/deg;
      const t=neigh.filter(v=>v.memory==="truth").length/deg;
    // usa parametri configurabili: pesi neighbor / source / susceptibility
    const neighborW = GAME_PARAMS.diffusion ?? 0.7;
    const srcWeight = GAME_PARAMS.credibility ?? 0.2;
    let suscWeight = 1 - neighborW - srcWeight; if(suscWeight < 0) suscWeight = 0.2;

    const neighCompF = (f>thr?f:f*0.6) * neighborW;
    const neighCompT = (t>thr?t:t*0.6) * neighborW;
    const srcCompF = srcW * srcWeight;
    const srcCompT = srcW * srcWeight;
    const suscCompF = n.susceptibility * suscWeight;
    const suscCompT = (1 - n.susceptibility) * suscWeight;

    const pF = neighCompF + srcCompF + suscCompF;
    const pT = neighCompT + srcCompT + suscCompT;

    // fact_checkers più efficaci in base alla probabilità di verifica
    const fcEff = 0.8 + ((GAME_PARAMS.verify||0) * 0.2);
    if(n.role==="fact_checker"){ if(Math.random()<pT*fcEff) n.memory="truth"; else if(Math.random()<pF*0.15) n.memory="fake"; }
      else if(n.role==="credulone"){ if(Math.random()<pF) n.memory="fake"; else if(Math.random()<pT*0.45) n.memory="truth"; }
      else { if(Math.random()<pF*0.7) n.memory="fake"; else if(Math.random()<pT*0.7) n.memory="truth"; }

      n.memoryTime = (n.memory==="neutral")?0:(n.memoryTime+1);
      if(n.memoryTime>=CONST.FORGET_DAYS){ n.memory="neutral"; n.memoryTime=0; }
    });

    const c = computeCounts();
    state.daily.push({day, fake:c.fake, truth:c.truth, neutral:c.neutral, event: ev?`${ev.type} da ${ev.source}`:""});
  }

  // Sincronizza graph.json nodes con lo scientificState aggiornato
  if (gNodes && state.nodes && state.nodes.length > 0) {
    gNodes.selectAll("circle").data().forEach((d, idx) => {
      // Mappa ciclica da game nodes a graph.json nodes
      const gameNodeIdx = idx % state.nodes.length;
      d.scientificState = state.nodes[gameNodeIdx].scientificState || 'S';
      d.isEternalFC = state.nodes[gameNodeIdx].isEternalFC || false;
    });
  }

  // Aggiorna immediatamente colori e tooltip dopo lo step
  gNodes.selectAll("circle")
    .attr("fill", nodeColor)  // Usa nodeColor() che supporta scientificState
    .attr("stroke", d => d.isEternalFC ? "#00d4ff" : "rgba(255, 255, 255, 0.8)")
    .selectAll("title").remove();
  gNodes.selectAll("circle").append("title").text(d=>`[${d.type}] #${d.id}`);

  // Assicurati che c sia definito (potrebbe non esserlo dal ramo scientific model)
  let displayCounts = computeCounts();
  updateKPI();
  updateSegregationMetrics();
  updateResultsChart(); 
  renderDailyTable();

  // Modalità Strategica: guadagna monete in base alla percentuale di Verità (non il giorno 1)
  if(selectedMode === "Strategica" && day > 1){
    const truthPct = pct(displayCounts.truth, state.nodes.length);
    const fakePct = pct(displayCounts.fake, state.nodes.length);
    // Formula bilanciata: base 30 + bonus verità (fino a 70) - penalità fake (fino a 30)
    const coinsGained = 30 + Math.floor(truthPct * 0.7) - Math.floor(fakePct * 0.3);
    state.game.coins += Math.max(5, coinsGained); // Minimo 5 crediti
    if(coinsGained > 0) showToast(`+${Math.max(5, coinsGained)} crediti (${truthPct}% Verità, ${fakePct}% Fake)`);
    updateGameBaseUI();
  }
  
  // Modalità Competitiva: la CPU gioca dopo il giocatore
  if(selectedMode === "Competitiva"){
    makeAIMove();
  }

  // mostra l'ultimo giorno eseguito
  $("#dayLabel").textContent = day;

  // Aggiorna il grafico in tempo reale (se il grafico è stato aperto)
  if(state.chart) {
    updateResultsChart();
  }

  // PREPARA il prossimo giorno
  state.currentDay = day + 1;
  state.game.totalDaysPlayed = day;
  
  // Reset mosse per il nuovo giorno (solo per Strategica)
  if(selectedMode === "Strategica"){
    state.game.movesLeft = state.game.movesPerDay; // 3 mosse al prossimo giorno
    updateGameBaseUI();
  }
  
  // Controlla se la partita è finita (giorno 7 o oltre in Competitiva)
  if(day >= CONST.DAYS){
    checkGameEnd();
  }
}

// ===== risultati (modali) =====
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

// ===== modali generali =====
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

// ===== ACHIEVEMENTS MODALE =====
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

// Close achievements modal con click su sfondo
const achievementsModal = $("#achievementsModal");
if(achievementsModal) achievementsModal.onclick = (e) => {
  if(e.target === achievementsModal) closeModal("#achievementsModal");
};

// ===== toast =====
function showToast(msg="Sessione salvata"){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=> t.classList.remove("show"), 1600);
}

// ===== salva/carica =====
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

// ===== modale nodo (refresh immediato) =====
let modalNode=null;
let selectingEternalFC = false;

function openNodeModal(node){
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
    
    // Se stiamo usando il modello scientifico, marca il nodo come eternal FC
    if(state.scientificModel.enabled && state.scientificNodes){
      const scientificNode = state.scientificNodes.find(n => n.nodeId === node.id);
      if(scientificNode){
        scientificNode.isEternalFC = true;
        scientificNode.pf_override = 0;  // Non dimentica mai (F→S non avviene mai)
      }
    }
    
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
    showToast('Eternal Fact-checker posizionato (40 crediti)');
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

// ===== overlay/start & controlli header =====
// btnStart rimosso dall'HTML; now initializeGame() gestisce l'auto-inizializzazione

$("#btnNext").addEventListener("click", ()=>{
  if(state.currentDay <= CONST.DAYS) stepOneDay();
});
$("#btnRunAll").addEventListener("click", async ()=>{
  while(state.currentDay <= CONST.DAYS){
    stepOneDay();
    await new Promise(r=> setTimeout(r, 180));
  }
});
$("#btnReset").addEventListener("click", ()=>{
  state.currentDay=1; state.daily=[];
  $("#dayLabel").textContent=0;
  $("#kFake").textContent=$("#kTruth").textContent=$("#kNeutral").textContent="—";
  gLinks.selectAll("*").remove(); gNodes.selectAll("*").remove();
  if(state.chart){ state.chart.destroy(); state.chart=null; }
  
  // Riabilita il bottone modalità per nuova partita
  const btnMode = $("#btnMode");
  if(btnMode) btnMode.disabled = false;
  
  // Reset monete e stato game
  state.game.coins = 400;
  state.game.movesLeft = 3;
  state.game.strategies = { hubs: false, frontiere: false, random: false };
  state.game.playerTeam = null;
  selectedMode = null;
  
  updateGameBaseUI();
  showToast('Partita reimpostata - Seleziona una modalità');
});
$("#btnExportJson").addEventListener("click", ()=>{
  // Create graph.json in-memory with game nodes
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
  
  // Update graphData in memory
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
$("#btnExportPng").addEventListener("click", ()=>{
  const canvas=$("#summaryChart");
  if(!canvas){ updateResultsChart(true); openModal("#resultsModal"); return; }
  const url=canvas.toDataURL("image/png"); const a=document.createElement("a");
  a.href=url; a.download=`giancarlo_ruffo_chart_${Date.now()}.png`; a.click();
});
$("#btnSave").addEventListener("click", saveSession);
$("#btnLoad").addEventListener("click", openLoadModal);
$("#loadClose").addEventListener("click", ()=> closeModal("#loadModal"));

// ===== Gestione selezione team (Competitiva) =====
const teamFakeBtn = $("#teamFake");
const teamTruthBtn = $("#teamTruth");
const teamCancelBtn = $("#teamCancel");

if(teamFakeBtn) teamFakeBtn.addEventListener("click", ()=>{
  // Salva team choice in tutte le modalità
  state.game.competitive.playerTeam = "fake";
  state.game.playerTeam = "fake"; // Salva anche in game generale
  closeModal("#teamModal");
  
  // Initialize game: prepara il grafo solo alla prima volta
  if(state.currentDay === 1 && state.nodes.length === 0) {
    initializeGame();
  }
  
  state.game.movesLeft = state.game.movesPerDay;
  stepOneDay();
  showToast("Sei nel team Fake 🔴");
});

if(teamTruthBtn) teamTruthBtn.addEventListener("click", ()=>{
  // Salva team choice in tutte le modalità
  state.game.competitive.playerTeam = "truth";
  state.game.playerTeam = "truth"; // Salva anche in game generale
  closeModal("#teamModal");
  
  // Initialize game: prepara il grafo solo alla prima volta
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

// Bottone "Nuovo gioco" dal modale vincitore
const winnerCloseBtn = $("#winnerClose");
if(winnerCloseBtn) winnerCloseBtn.addEventListener("click", ()=>{
  closeModal("#winnerModal");
  // Reset completo
  $("#btnReset").click();
});

// ===== Gestione modalità =====
let selectedMode = null;

// Initialize game: prepara il grafo quando inizia la partita (dopo selezione team)
function initializeGame(){
  state.currentDay = 1;
  state.daily = [];
  $("#dayLabel").textContent = 0;
  gLinks.selectAll("*").remove();
  gNodes.selectAll("*").remove();
  
  // 🔬 SEMPRE usa il modello scientifico (tutte le modalità)
  const useScientific = typeof SCIENTIFIC_PARAMS !== 'undefined';
  buildGraph(120, useScientific);
  
  renderGraph();
  updateKPI();
  updateSegregationMetrics();
  renderAchievementsUI();
}

// Controlla se il gioco è finito e mostra il vincitore
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

function setMode(mode) {
  const cfg = MODALITY_CONFIG[mode];
  if (!cfg) return;

  selectedMode = mode;
  TROPHY_SYSTEM.stats.modesPlayed.add(mode);
  
  // Aggiorna il Game Base in base alla modalità
  updateGameBaseForMode(mode);

  // Aggiorna el currentMode nella topbar
  const currentModeEl = $("#currentMode");
  if(currentModeEl) currentModeEl.textContent = mode;

  // Disabilita il bottone modalità dopo la selezione
  const btnMode = $("#btnMode");
  if(btnMode) btnMode.disabled = true;

  showToast(`Modalità selezionata: ${mode}`);
  closeModal("#modeModal");
  
  // Auto-init: mostra selezione team per iniziare il gioco
  setTimeout(() => {
    openModal("#teamModal");
  }, 300);
}

// Mostra/nasconde le sezioni del Game Base in base alla modalità
function updateGameBaseForMode(mode){
  const gbSelectMode = $("#gb-select-mode");
  const gbContent = $("#gb-content");
  
  if(!gbSelectMode || !gbContent) return;

  // Nascondi messaggio iniziale, mostra contenuto
  gbSelectMode.style.display = "none";
  gbContent.style.display = "block";

  // Nascondi tutto
  const sections = ["gb-strategies", "gb-competitive", "gb-free"];
  const hrs = ["hr-strategies", "hr-competitive", "hr-free"];
  sections.forEach(s => { const el = $("#"+s); if(el) el.style.display="none"; });
  hrs.forEach(h => { const el = $("#"+h); if(el) el.style.display="none"; });

  // Mostra sezioni per modalità
  if(mode === "Strategica"){
    $("#hr-strategies").style.display="block";
    $("#gb-strategies").style.display="block";
    // Mostra sezioni aggiuntive Strategica
    $("#hr-boosts").style.display="block";
    $("#gb-boosts").style.display="block";
    $("#hr-targeted").style.display="block";
    $("#gb-targeted").style.display="block";
    $("#hr-predictive").style.display="block";
    $("#gb-predictive").style.display="block";
    // ✅ Rimosso achievements dalla game base (ora in modale separata)
    // Imposta parametri fissi
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
    // mostra azioni Broadcast Wars
    const bw = $("#broadcast-wars"); if(bw) bw.style.display = '';
    // Imposta parametri fissi
    GAME_PARAMS.diffusion = 0.7;
    GAME_PARAMS.credibility = 0.2;
    GAME_PARAMS.forgetting = 0.5;
    GAME_PARAMS.verify = 0.4;
    CONST.FORGET_DAYS = Math.max(1, Math.round(GAME_PARAMS.forgetting * CONST.DAYS));
    // Crea CPU opponent con difficoltà selezionata
    const difficulty = $("#difficulty") ? $("#difficulty").value : 'expert';
    state.game.cpuOpponent = new CPUOpponent(difficulty);
    state.game.coins = 400;
    state.game.movesPerDay = 3;
    state.game.movesLeft = 0;
    // Mostra riepilogo mosse competitive
    const cm = $("#compMoves"); if(cm) cm.textContent = `${state.game.movesPerDay} mosse/giorno`;
    updateCPUStats();
    updateGameBaseUI();

  }else if(mode === "Libera"){
    $("#hr-free").style.display="block";
    $("#gb-free").style.display="block";
    
    // Carica i valori attuali dei parametri scientifici nei campi
    const pAlpha = $("#paramAlpha"); if(pAlpha) pAlpha.value = SCIENTIFIC_PARAMS.alpha;
    const pBeta = $("#paramBeta"); if(pBeta) pBeta.value = SCIENTIFIC_PARAMS.beta;
    const pPf = $("#paramPf"); if(pPf) pPf.value = SCIENTIFIC_PARAMS.pf;
    const pPv = $("#paramPv"); if(pPv) pPv.value = SCIENTIFIC_PARAMS.pv;
    const pRho = $("#paramRho"); if(pRho) pRho.value = SCIENTIFIC_PARAMS.rho;
    const pGamma = $("#paramGamma"); if(pGamma) pGamma.value = SCIENTIFIC_PARAMS.gamma;
    const pAG = $("#paramAlphaGullible"); if(pAG) pAG.value = SCIENTIFIC_PARAMS.alpha_gullible;
    const pAS = $("#paramAlphaSkeptic"); if(pAS) pAS.value = SCIENTIFIC_PARAMS.alpha_skeptic;
    
    updateGameBaseUI();
  }
}

// ===== Game state (coins, strategies, modalità) =====
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

function buyStrategy(name, cost){
  if(!state.nodes || state.nodes.length === 0) return showToast('Premi START per generare il grafo prima');
  if(state.game.coins < cost) return showToast('Monete insufficienti');
  if(selectedMode === "Strategica" && state.game.movesLeft <= 0) return showToast('Non hai più mosse per oggi!');
  
  state.game.coins -= cost; 
  state.game.strategies[name]=true; 
  
  // Decrementa mosse solo in Strategica
  if(selectedMode === "Strategica"){
    state.game.movesLeft--;
  }
  
  updateGameBaseUI();
  showToast(`Strategia ${name} acquistata`);
  
  // Assegna 8 fact-checker in base alla strategia
  applyStrategy(name);
}

function applyStrategy(strategyName){
  if(strategyName === "hubs"){
    // Hubs: seleziona nodi con grado più alto
    const degrees = state.nodes.map(n => ({
      node: n,
      degree: state.links.filter(l => {
        const src = typeof l.source === "object" ? l.source.id : l.source;
        const tgt = typeof l.target === "object" ? l.target.id : l.target;
        return src === n.id || tgt === n.id;
      }).length
    }));
    degrees.sort((a, b) => b.degree - a.degree);
    // Assegna i primi 16 come fact-checker
    for(let i = 0; i < Math.min(16, degrees.length); i++){
      if(degrees[i].node.role !== "fact_checker") {
        degrees[i].node.role = "fact_checker";
        degrees[i].node.isEternalFC = true;
        
        // Se modello scientifico, setta pf_override=0
        if(state.scientificModel.enabled && state.scientificNodes){
          const scientificNode = state.scientificNodes.find(n => n.nodeId === degrees[i].node.id);
          if(scientificNode){
            scientificNode.isEternalFC = true;
            scientificNode.pf_override = 0;
          }
        }
      }
    }
  }else if(strategyName === "frontiere"){
    // Frontiere: seleziona nodi bridge (ponte tra cluster)
    // Semplificato: nodi con connessioni diverse
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
        
        // Se modello scientifico, setta pf_override=0
        if(state.scientificModel.enabled && state.scientificNodes){
          const scientificNode = state.scientificNodes.find(sn => sn.nodeId === n.id);
          if(scientificNode){
            scientificNode.isEternalFC = true;
            scientificNode.pf_override = 0;
          }
        }
      }
    });
  }else if(strategyName === "random"){
    // Random: seleziona 16 nodi casuali
    const shuffled = [...state.nodes].sort(() => Math.random() - 0.5);
    for(let i = 0; i < Math.min(16, shuffled.length); i++){
      if(shuffled[i].role !== "fact_checker") {
        shuffled[i].role = "fact_checker";
        shuffled[i].isEternalFC = true;
        
        // Se modello scientifico, setta pf_override=0
        if(state.scientificModel.enabled && state.scientificNodes){
          const scientificNode = state.scientificNodes.find(n => n.nodeId === shuffled[i].id);
          if(scientificNode){
            scientificNode.isEternalFC = true;
            scientificNode.pf_override = 0;
          }
        }
      }
    }
  }
  
  // Refresh grafico
  gNodes.selectAll('circle').attr('stroke', colorStroke).attr('fill', colorFill);
  showToast(`16 Fact-checker assegnati (${strategyName})`);
}

function addEternalFactChecker(){
  if(!state.nodes || state.nodes.length === 0) return showToast('Premi START per generare il grafo prima');
  if(selectedMode === "Strategica" && state.game.movesLeft <= 0) return showToast('Non hai più mosse per oggi!');
  if(state.game.coins < 40) return showToast('Crediti insufficienti per aggiungere un Eternal FC (costo 40)');
  
  // Abilita selezione: chiedi di cliccare su un nodo
  selectingEternalFC = true;
  showToast('Clicca su un nodo per posizionare l\'Eternal Fact-Checker');
}

function initGameBaseHandlers(){
  const bH = $("#btnHubs"), bF=$("#btnFrontiere"), bR=$("#btnRandom");
  if(bH) bH.addEventListener('click', ()=> buyStrategy('hubs',500));
  if(bF) bF.addEventListener('click', ()=> buyStrategy('frontiere',350));
  if(bR) bR.addEventListener('click', ()=> buyStrategy('random',175));

  const btnAddFC = $("#btnAddEternal"); if(btnAddFC) btnAddFC.addEventListener('click', ()=> addEternalFactChecker());

  // Legacy params change (Libera modalità)
  const pDiff = $("#paramDiffusion"); if(pDiff) pDiff.addEventListener('change', ()=> { GAME_PARAMS.diffusion = parseFloat(pDiff.value); });
  const pCred = $("#paramCredibility"); if(pCred) pCred.addEventListener('change', ()=> { GAME_PARAMS.credibility = parseFloat(pCred.value); });
  const pFor = $("#paramForgetting"); if(pFor) pFor.addEventListener('change', ()=> { GAME_PARAMS.forgetting = parseFloat(pFor.value); CONST.FORGET_DAYS = Math.max(1, Math.round(GAME_PARAMS.forgetting * CONST.DAYS)); });
  const pVer = $("#paramVerify"); if(pVer) pVer.addEventListener('change', ()=> { GAME_PARAMS.verify = parseFloat(pVer.value); });

  // SCIENTIFIC PARAMS (Libera modalità - modello Tambuscio & Ruffo)
  const pAlpha = $("#paramAlpha"); if(pAlpha) pAlpha.addEventListener('change', ()=> { 
    SCIENTIFIC_PARAMS.alpha = parseFloat(pAlpha.value);
    updateSegregationMetrics();  // Aggiorna threshold
  });
  const pBeta = $("#paramBeta"); if(pBeta) pBeta.addEventListener('change', ()=> { 
    SCIENTIFIC_PARAMS.beta = parseFloat(pBeta.value);
    updateSegregationMetrics();  // Aggiorna threshold
  });
  const pPf = $("#paramPf"); if(pPf) pPf.addEventListener('change', ()=> { 
    SCIENTIFIC_PARAMS.pf = parseFloat(pPf.value);
    updateSegregationMetrics();  // Aggiorna threshold
  });
  const pPv = $("#paramPv"); if(pPv) pPv.addEventListener('change', ()=> { 
    SCIENTIFIC_PARAMS.pv = parseFloat(pPv.value);
    updateSegregationMetrics();  // Aggiorna threshold
  });
  
  // Segregation params
  const pRho = $("#paramRho"); if(pRho) pRho.addEventListener('change', ()=> { SCIENTIFIC_PARAMS.rho = parseFloat(pRho.value); });
  const pGamma = $("#paramGamma"); if(pGamma) pGamma.addEventListener('change', ()=> { SCIENTIFIC_PARAMS.gamma = parseFloat(pGamma.value); });
  const pAG = $("#paramAlphaGullible"); if(pAG) pAG.addEventListener('change', ()=> { 
    SCIENTIFIC_PARAMS.alpha_gullible = parseFloat(pAG.value);
    updateSegregationMetrics();  // Aggiorna threshold
  });
  const pAS = $("#paramAlphaSkeptic"); if(pAS) pAS.addEventListener('change', ()=> { 
    SCIENTIFIC_PARAMS.alpha_skeptic = parseFloat(pAS.value);
    updateSegregationMetrics();  // Aggiorna threshold
  });
}

// Bottone Mode
const btnMode = $("#btnMode");
if(btnMode){
  btnMode.addEventListener("click", ()=>{
    // Quando si apre il modal, ripristina il bottone selezionato
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

// Gestione modale Modalità con selezione e applica
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

// bootstrap
(function init(){
  const daysTotal = $("#daysTotal");
  if(daysTotal) daysTotal.textContent = CONST.DAYS;
  // imposta parametri iniziali
  CONST.FORGET_DAYS = Math.max(1, Math.round(GAME_PARAMS.forgetting * CONST.DAYS));
  // renderGraph() viene chiamato DOPO initializeGame() quando è selezionata la modalità
  initGameBaseHandlers();
  // Inizializza handlers per le nuove funzionalità Strategica/Competitiva
  initStrategicHandlers();
  initCompetitiveHandlers();
  // Game Base mostra solo il messaggio iniziale, nessuna modalità ancora scelta
})();

// ===== FUNZIONI STRATEGICHE (BOOSTS, CAMPAIGNS, PREDICTIVE) =====
function initStrategicHandlers(){
  // mostra/nascondi sezioni quando modalità Strategica selezionata
  const show = () => {
    const ids = ['#hr-strategies','#gb-strategies','#hr-boosts','#gb-boosts','#hr-targeted','#gb-targeted','#hr-predictive','#gb-predictive'];
    ids.forEach(id=>{ const el=$(id); if(el) el.style.display=''; });
  };
  // bind boost buttons
  const boostIds = ['#boostTruthAmp','#boostFakeVirus','#boostMassDebunk','#boostMemoryWipe','#boostSegregation'];
  boostIds.forEach(id=>{
    const el = $(id);
    if(!el) return;
    el.addEventListener('click', ()=> purchaseBoost(el.id, parseInt(el.dataset.cost,10)));
  });

  // campaigns
  const camps = ['#campGullible','#campSkeptic','#campFrontier'];
  camps.forEach(s=>{ const el = $(s); if(!el) return; el.addEventListener('click', ()=> purchaseCampaign(el)); });

  // predictive
  const btnPredict = $('#btnPredictNext3');
  if(btnPredict) btnPredict.addEventListener('click', ()=> showPredictiveNext3());

  // achievements grid skeleton
  renderAchievementsUI();
  
  // Update button states on coin change
  updateButtonStates();
}

// Aggiorna stato disabilitazione dei bottoni in base alle monete disponibili
function updateButtonStates(){
  // Boost buttons
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
  
  // Campaign buttons
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
  
  // Battle buttons
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

function purchaseBoost(boostId, cost){
  if(!state.game.boostMgr) return showToast('Sistema non inizializzato');
  if(state.game.coins < cost) return showToast('Monete insufficienti');
  state.game.coins -= cost;
  
  // 🏆 Track per trofei
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

function applyMassDebunk(frac){
  const believers = state.scientificNodes ? state.scientificNodes.filter(n=>n.state==='B') : [];
  const toConvert = Math.max(1, Math.floor(believers.length * frac));
  
  // Anima i nodi che vengono convertiti
  believers.slice(0, toConvert).forEach(scientificNode => {
    const d3Node = state.nodes.find(n => n.id === scientificNode.nodeId);
    if(d3Node) {
      d3Node.isConverting = true; // flag per animazione
      setTimeout(() => {
        d3Node.isConverting = false;
      }, 600);
    }
    scientificNode.state = 'F';
  });
  
  // Aggiorna visualmente subito
  gNodes.selectAll("circle")
    .attr("fill", d=> colorFill(d))
    .attr("stroke", d=> colorStroke(d))
    .classed("highlight-debunk", d => d.isConverting);
  
  setTimeout(() => {
    gNodes.selectAll("circle").classed("highlight-debunk", false);
  }, 600);
}

function applyMemoryWipe(frac){
  const arr = state.scientificNodes || [];
  const total = arr.length;
  const count = Math.max(1, Math.floor(total * frac));
  const shuffled = [...arr].sort(()=>Math.random()-0.5);
  
  // Anima
  shuffled.slice(0, count).forEach(scientificNode => {
    const d3Node = state.nodes.find(n => n.id === scientificNode.nodeId);
    if(d3Node) d3Node.isWiping = true;
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

function renderBoostsActive(){
  if(!state.game.boostMgr) return; // Sicurezza
  const active = state.game.boostMgr.getActive();
  const el = $("#boosts-active-list"); 
  if(el) el.textContent = active.length ? active.join(', ') : '—';
}

function renderAchievementsUI(){
  const grid = $("#achievements-grid"); if(!grid) return;
  grid.innerHTML = '';
  
  // Raggruppa trofei per categoria
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

function showPredictiveNext3(){
  if(!state.scientificModel.enabled) return showToast('Solo in modalità con modello scientifico');
  
  // Crea nuove istanze ScientificNodeState per la simulazione predittiva
  const simNodes = (state.scientificNodes || []).map(n => {
    const newNode = new ScientificNodeState(n.nodeId, n.community);
    newNode.state = n.state;
    newNode.alpha = n.alpha;
    newNode.pf_override = n.pf_override;
    newNode.isEternalFC = n.isEternalFC;
    return newNode;
  });
  const simLinks = [...state.links];
  const results = [];
  
  // Salva parametri originali
  const origParams = { ...SCIENTIFIC_PARAMS };
  const origAlphas = simNodes.map(n=>n.alpha);
  
  // Algoritmo strategico: favorisce il team del giocatore in Strategica/Competitiva
  const playerTeam = selectedMode === "Strategica" ? null : state.game.playerTeam; // null = non strategico
  const strategyMultiplier = playerTeam ? 1.3 : 1.0; // Boost 30% per il team del giocatore
  
  for(let d=0; d<3; d++){
    // Applica boost/campaign temporaneamente per previsione accurata
    if(state.game.boostMgr && state.game.boostMgr.isActive('truthAmp')){
      SCIENTIFIC_PARAMS.pv = Math.min(1, SCIENTIFIC_PARAMS.pv * 1.5);
      if(playerTeam === 'truth') SCIENTIFIC_PARAMS.pv = Math.min(1, SCIENTIFIC_PARAMS.pv * strategyMultiplier);
    }
    if(state.game.boostMgr && state.game.boostMgr.isActive('fakeVirus')){
      SCIENTIFIC_PARAMS.beta = Math.min(1, SCIENTIFIC_PARAMS.beta * 1.5);
      if(playerTeam === 'fake') SCIENTIFIC_PARAMS.beta = Math.min(1, SCIENTIFIC_PARAMS.beta * strategyMultiplier);
    }
    if(state.game.campaign && state.game.campaign.active){
      const alphaFactor = 1 - (((state.game.campaign.multiplier||1.2)-1) * 0.6);
      simNodes.forEach(n=>{
        if(state.game.campaign.targetCommunity === 'frontier'){
          if(n.community === 'gullible') n.alpha = n.alpha * alphaFactor;
        } else if(n.community === state.game.campaign.targetCommunity){
          n.alpha = n.alpha * alphaFactor;
        }
      });
    }
    
    const r = simulateOneDay(simNodes, simLinks);
    
    // Strategic outcome: se in competitiva, applica effetto team favorito
    let adjR = { ...r };
    if(playerTeam === 'fake' && selectedMode === "Competitiva"){
      // Fake vincono: redistribuisci un po' di verità verso fake
      const truthToFake = Math.floor(r.counts.F * 0.15);
      adjR.counts.B += truthToFake;
      adjR.counts.F = Math.max(0, adjR.counts.F - truthToFake);
    } else if(playerTeam === 'truth' && selectedMode === "Competitiva"){
      // Verità vincono: redistribuisci un po' di fake verso verità
      const fakeToTruth = Math.floor(r.counts.B * 0.15);
      adjR.counts.F += fakeToTruth;
      adjR.counts.B = Math.max(0, adjR.counts.B - fakeToTruth);
    }
    
    // Ricalcola densità
    const total = adjR.counts.S + adjR.counts.B + adjR.counts.F;
    adjR.densities = {
      S: adjR.counts.S / total,
      B: adjR.counts.B / total,
      F: adjR.counts.F / total
    };
    
    results.push(adjR.densities);
    
    // Ripristina per iterazione successiva
    SCIENTIFIC_PARAMS.pv = origParams.pv;
    SCIENTIFIC_PARAMS.beta = origParams.beta;
    simNodes.forEach((n,i)=> n.alpha = origAlphas[i]);
    
    // Aggiorna stato per step successivo
    simNodes.forEach((sn, idx)=> sn.state = adjR.counts.B> adjR.counts.F ? 'B' : (adjR.counts.F> adjR.counts.B? 'F' : 'S'));
  }
  
  const canvas = $("#predictiveChart");
  if(canvas){
    canvas.style.display = '';
    const labels = ['+1','+2','+3'];
    const dataFake = results.map(r=> Math.round(r.B*100));
    const dataTruth = results.map(r=> Math.round(r.F*100));
    const ctx = canvas.getContext('2d');
    if(state.game.predictiveChart) state.game.predictiveChart.destroy();
    state.game.predictiveChart = new Chart(ctx, {
      type: 'line', 
      data: { 
        labels, 
        datasets:[
          {label:'🔴 Fake %', data:dataFake, borderColor:'#ef4444', tension: 0.4, fill: false, borderWidth: 2},
          {label:'🟢 Truth %', data:dataTruth, borderColor:'#22c55e', tension: 0.4, fill: false, borderWidth: 2}
        ] 
      }, 
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom', labels:{font:{size:12}}}}, scales:{y:{max:100}}}
    });
  }
}

// ===== HANDLERS COMPETITIVA =====
function initCompetitiveHandlers(){
  const show = ()=>{
    const ids = ['#hr-competitive','#gb-competitive']; ids.forEach(id=>{ const el=$(id); if(el) el.style.display=''; });
  };
  ["#battleSabotage","#battleSteal","#battleReverse"].forEach(id=>{ const el=$(id); if(!el) return; el.addEventListener('click', ()=> performBattleAction(id)); });
}

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

// Aggiorna visivamente le statistiche del CPU
function updateCPUStats(){
  if(!state.game.cpuOpponent) return;
  const counts = computeCounts();
  const total = state.nodes.length || 1;
  const playerFakePct = pct(counts.fake, total);
  const playerTruthPct = pct(counts.truth, total);
  
  // Mostra stats 
  const pfC = $("#playerFakeComp"); if(pfC) pfC.textContent = playerFakePct;
  const ptC = $("#playerTruthComp"); if(ptC) ptC.textContent = playerTruthPct;
  
  // CPU stats (simulato)
  const cpuCounts = { fake: Math.floor(counts.fake * (0.8 + Math.random()*0.4)), truth: Math.floor(counts.truth * (1.2 + Math.random()*0.3)) };
  const cpuFakePct = pct(cpuCounts.fake, total);
  const cpuTruthPct = pct(cpuCounts.truth, total);
  
  const cfC = $("#cpuFakeComp"); if(cfC) cfC.textContent = cpuFakePct;
  const ctC = $("#cpuTruthComp"); if(ctC) ctC.textContent = cpuTruthPct;
}

// AI fa una mossa nel stepOneDay (dopo che il giocatore ha giocato)
function makeAIMove(){
  if(!state.game.cpuOpponent || selectedMode !== "Competitiva") return;
  
  const counts = computeCounts();
  const total = state.nodes.length || 1;
  const playerFakePct = pct(counts.fake, total);
  const playerTruthPct = pct(counts.truth, total);
  
  // AI delibera mossa
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


function updateGameBaseUI(){
  const coins = $("#coinsValue"); if(coins) coins.textContent = state.game.coins;
  const moves = $("#movesLeft"); if(moves) moves.textContent = state.game.movesLeft;
  renderBoostsActive();
  updateButtonStates();
}