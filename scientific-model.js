// Modello ispirato a Tambuscio & Ruffo (2018/2019).
// Simula diffusione di fake news in rete.
// Stati: S = susceptible, B = believer, F = fact-checker.

// Parametri del modello (configurabili)
const SCIENTIFIC_PARAMS = {
  // α = quanto è credibile la fake news (0-1)
  // se α = 0.1: la gente non la crede molto
  // se α = 0.9: quasi tutti credono che sia vera!
  alpha: 0.2,
  
  // β = quanto velocemente si diffonde (0-1)
  // è la probabilità che se conosci un believer, anche tu diventi believer
  // o se conosci un fact-checker, diventi fact-checker
  beta: 0.7,
  
  // pf = probabilità di dimenticare e tornare neutrale (0-1)
  // se pf = 0.1: le credenze sono molto stabili
  // se pf = 0.8: cambi idea facilmente
  pf: 0.5,
  
  // pv = probabilità che uno che crede si metta a verificare (0-1)
  // se pv = 0: nessuno verifica
  // se pv = 0.5: metà della gente verifica
  pv: 0.4,
  
  // ρ (rho) = quanto è segregata la rete (0.5-1)
  // se ρ = 0.5: la rete ha due gruppi separati (creduli vs scettici)
  // se ρ = 1.0: la rete è tutta mescolata
  rho: 0.6,
  
  // γ (gamma) = percentuale di persone credule nella rete (0-1)
  // se γ = 0.3: il 30% della gente è credulona
  // se γ = 0.8: l'80% della gente è credulona
  gamma: 0.5,
  
  // Quanto è credibile il fake per i creduli (0-1)
  // creduli = persone che credono più facilmente
  alpha_gullible: 0.8,
  
  // Quanto è credibile il fake per gli scettici (0-1)
  // scettici = persone che controllano prima di credere
  alpha_skeptic: 0.3
};

// Implementazione compartimentale S-B-F

class ScientificNodeState {
  constructor(nodeId, community = 'neutral') {
    this.nodeId = nodeId;
    this.community = community; // 'gullible' | 'skeptic' | 'neutral'
    this.state = 'S'; // stato iniziale
    this.timeInState = 0; // contatore temporale (info)
    // alpha varia per comunità
    this.alpha = community === 'gullible' ? SCIENTIFIC_PARAMS.alpha_gullible :
                 community === 'skeptic' ? SCIENTIFIC_PARAMS.alpha_skeptic :
                 SCIENTIFIC_PARAMS.alpha;
    // Eternal FC può avere pf_override = 0 (non dimentica)
    this.pf_override = null;
    this.isEternalFC = false;
  }
  
  // Probabilità S -> B / S -> F basate sui vicini
  calculateTransitionRates(nB, nF) {
    if (this.state !== 'S') return { transitionToB: 0, transitionToF: 0 };
    const beta = SCIENTIFIC_PARAMS.beta;
    const alpha = this.alpha;
    const denominator = nB * (1 + alpha) + nF * (1 - alpha);
    if (denominator === 0) return { transitionToB: 0, transitionToF: 0 };
    const transitionToB = beta * nB * (1 + alpha) / denominator;
    const transitionToF = beta * nF * (1 - alpha) / denominator;
    return { transitionToB, transitionToF };
  }
  
  // Aggiorna stato usando pv/pf e le probabilità calcolate
  updateState(nB, nF) {
    const pf = this.pf_override !== null ? this.pf_override : SCIENTIFIC_PARAMS.pf;
    const pv = SCIENTIFIC_PARAMS.pv;
    switch (this.state) {
      case 'S': {
        const { transitionToB, transitionToF } = this.calculateTransitionRates(nB, nF);
        const rand = Math.random();
        if (rand < transitionToB) { this.state = 'B'; this.timeInState = 0; }
        else if (rand < transitionToB + transitionToF) { this.state = 'F'; this.timeInState = 0; }
        break;
      }
      case 'B': {
        const randB = Math.random();
        if (randB < pv * (1 - pf)) { this.state = 'F'; this.timeInState = 0; }
        else if (randB < pf + pv * (1 - pf)) { this.state = 'S'; this.timeInState = 0; }
        break;
      }
      case 'F': {
        const randF = Math.random();
        if (randF < pf) { this.state = 'S'; this.timeInState = 0; }
        break;
      }
    }
    this.timeInState++;
  }
}

/**
 * Esegue UN GIORNO di simulazione
 * 
 * Cosa succede:
 * 1. Conto quanti believers e fact-checkers conosce ogni persona
 * 2. Chiedo a ogni persona di aggiornare il proprio stato (potrebbe cambiare idea)
 * 3. Conto quanti sono rimasti believers, fact-checkers, neutrali
 * 4. Ritorno il risultato
 * 
 * @param {array} nodes - tutte le persone nella rete
 * @param {array} links - le connessioni tra persone
 * @returns {object} quanti ce ne sono in ogni stato
 */
function simulateOneDay(nodes, links) {
  // Conta vicini B/F per ogni nodo e aggiorna gli stati
  const neighbors = {};
  const nodeMap = {};  // Serve per cercare velocemente i nodi
  
  nodes.forEach(n => {
    neighbors[n.nodeId] = { B: 0, F: 0 };
    nodeMap[n.nodeId] = n;
  });
  
  // Adesso contiamo per ogni link: il source è B o F? Il target è B o F?
  links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    // Cerca velocemente
    const sourceNode = nodeMap[sourceId];
    const targetNode = nodeMap[targetId];
    
    // Se il link non è valido, skip
    if (!sourceNode || !targetNode) return;
    
    const sourceState = sourceNode.state;
    const targetState = targetNode.state;
    
    // Se chi ti manda il messaggio è believer, conti un believer
    if (sourceState === 'B') neighbors[targetId].B++;
    if (sourceState === 'F') neighbors[targetId].F++;
    
    // La rete è bidirezionale (se conosci qualcuno, anche lui conosce te)
    if (targetState === 'B') neighbors[sourceId].B++;
    if (targetState === 'F') neighbors[sourceId].F++;
  });
  
  // Ogni nodo si aggiorna in base ai vicini
  nodes.forEach(node => {
    const nB = neighbors[node.nodeId].B;
    const nF = neighbors[node.nodeId].F;
    node.updateState(nB, nF);
  });
  
  // Contiamo i risultati
  const counts = {
    S: nodes.filter(n => n.state === 'S').length,
    B: nodes.filter(n => n.state === 'B').length,
    F: nodes.filter(n => n.state === 'F').length
  };
  
  const total = nodes.length;
  
  return {
    counts,
    densities: {
      S: counts.S / total,
      B: counts.B / total,
      F: counts.F / total
    }
  };
}

// Strategie per piazzare fact-checkers: RANDOM, HUBS, FRONTIER

/**
 * Strategia 1: RANDOM
 * Metti i fact-checkers in posti casuali
 * È il baseline - peggiore in generale
 */
function strategyRandom(nodes, numFC) {
  const shuffled = [...nodes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numFC).map(n => n.id);
}

/**
 * Strategia 2: HUBS
 * Metti i fact-checkers nei nodi più "centrali" (che conoscono più gente)
 * L'idea: se la persona conosce MOLTI, influenza MOLTI
 * È efficace se il fake si diffonde in una rete con pochi hubs potenti
 */
function strategyHubs(nodes, links, numFC) {
  // Calcoliamo il "grado" di ogni nodo = quante connessioni ha
  const degree = {};
  nodes.forEach(n => degree[n.id] = 0);
  
  links.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    degree[sourceId]++;
    degree[targetId]++;
  });
  
  // Ordina per grado decrescente (chi ha più amici per primo)
  const sorted = nodes.sort((a, b) => degree[b.id] - degree[a.id]);
  
  // Prendi i primi numFC nodi
  return sorted.slice(0, numFC).map(n => n.id);
}

/**
 * Strategia 3: FRONTIER
 * Metti i fact-checkers sui "ponti" tra creduli e scettici
 * 
 * L'idea del paper: se la rete è divisa in due gruppi (creduli vs scettici),
 * il fake si diffonde RAPIDISSIMO dentro ogni gruppo.
 * MA tra i due gruppi, i messaggi devono "attraversare il ponte".
 * Se metti i fact-checkers sui ponti, puoi bloccare la diffusione!
 * 
 * È la strategia più efficace del paper - controintuitiva e potente
 */
function strategyFrontier(nodes, links, numFC) {
  // Calcoliamo una misura di "ponte" = quante comunità diverse conosci
  const betweenness = {};
  nodes.forEach(n => betweenness[n.id] = 0);
  
  // Per ogni nodo, vediamo se conosce persone da comunità diverse
  nodes.forEach(node => {
    // Chi conosco (i miei vicini)?
    const nodeNeighbors = links
      .filter(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return s === node.id || t === node.id;  // Se sei io o sono io?
      })
      .map(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return s === node.id ? t : s;  // Ritorna il "non io"
      });
    
    // Quante comunità diverse sono rappresentate nei miei vicini?
    const communitiesRepresented = new Set(
      nodeNeighbors.map(nId => nodes.find(n => n.id === nId).community)
    );
    
    // Se conosco gente da comunità DIVERSE, allora sono un ponte!
    if (communitiesRepresented.size > 1) {
      betweenness[node.id] = communitiesRepresented.size;
    }
  });
  
  // Prendi i nodi che connettono più comunità diverse (migliori ponti)
  const sorted = nodes.sort((a, b) => betweenness[b.id] - betweenness[a.id]);
  return sorted.slice(0, numFC).map(n => n.id);
}

/**
 * Genera una rete con due comunità separate (creduli e scettici)
 * 
 * 
 * I parametri controllano:
 * - ρ (rho): come sono separate le comunità
 * - γ (gamma): quanti sono creduli vs scettici
 */
function generateSegregatedNetwork(N = 1000, rho = 0.6, gamma = 0.5) {
  const nodes = [];
  const numGullible = Math.floor(N * gamma);
  const numSkeptic = N - numGullible;
  
  // Crea i nodi delle due comunità
  for (let i = 0; i < numGullible; i++) {
    nodes.push(new ScientificNodeState(i, 'gullible'));
  }
  for (let i = numGullible; i < N; i++) {
    nodes.push(new ScientificNodeState(i, 'skeptic'));
  }
  
  // Crea i link: ρ frazione interna alle comunità, (1-ρ) tra comunità diverse
  // Maggiore ρ = più segregato = due bolle separate
  // Minore ρ = più mescolato = reti interconnesse
  const links = [];
  const avgDegree = 6;  // Ogni persona conosce ~6 persone (realistico)
  const targetEdges = Math.floor((N * avgDegree) / 2);
  
  for (let i = 0; i < targetEdges; i++) {
    const isIntraGroup = Math.random() < rho;  // Probabilità di stare nello stesso gruppo
    
    let node1, node2;
    if (isIntraGroup) {
      // Connessione dentro una comunità
      const inCommunity = Math.random() < gamma ? 
        nodes.slice(0, numGullible) : 
        nodes.slice(numGullible);
      node1 = inCommunity[Math.floor(Math.random() * inCommunity.length)];
      node2 = inCommunity[Math.floor(Math.random() * inCommunity.length)];
    } else {
      // Connessione tra comunità diverse (il "ponte"!)
      const g1 = nodes[Math.floor(Math.random() * numGullible)];
      const s1 = nodes[numGullible + Math.floor(Math.random() * numSkeptic)];
      node1 = g1;
      node2 = s1;
    }
    
    // Non collega un nodo con se stesso (logico!)
    if (node1.nodeId !== node2.nodeId) {
      links.push({
        source: node1.nodeId,
        target: node2.nodeId,
        weight: 1
      });
    }
  }
  
  return { nodes, links };
}

/**
 * Misura di quanto è segregata la rete
 * Quanto sono separati i creduli dai scettici?
 * 
 * Ritorna il rapporto tra link inter-comunità e link totali
 */
function calculateSegregationMetrics(nodes, links) {
  // Contiamo i link tra comunità diverse (inter-group)
  let interGroupEdges = 0;
  let totalEdges = 0;
  
  links.forEach(link => {
    totalEdges++;
    const sourceNode = nodes.find(n => n.nodeId === link.source);
    const targetNode = nodes.find(n => n.nodeId === link.target);
    
    // Se i due nodi sono di comunità diverse, è un inter-group link
    if (sourceNode.community !== targetNode.community) {
      interGroupEdges++;
    }
  });
  
  // La segregation ratio = 1 - (inter-group / totali)
  // Se ratio = 0.9: il 90% dei link è dentro le comunità (molto segregato!)
  // Se ratio = 0.1: il 90% dei link è tra comunità (poco segregato)
  return {
    interGroupEdges,
    totalEdges,
    segregationRatio: 1 - (interGroupEdges / Math.max(1, totalEdges)),
    currentRho: 1 - (interGroupEdges / Math.max(1, totalEdges))
  };
}

/**
 * Equazione 7 da Tambuscio & Ruffo (2019):
 * pf ≤ (1-α)² / (1+α²)
 * 

 * Se la tua pf è MINORE della soglia: il fact-checking FUNZIONA! Puoi controllare il fake
 * Se la tua pf è MAGGIORE della soglia: il fake diventa "endemico" - rimane per sempre
 * 
 * nomè sufficiente aggiungere fact-checkers a caso:
 * La frazione di persone che dimentica (pf) è critica.
 * 
 * Se tutti dimenticano molto (pf alto), allora anche i fact-checkers dimenticheranno!
 * E il fake tornerà a diffondersi.
 */
function calculateMeanFieldThreshold() {
  const alpha = SCIENTIFIC_PARAMS.alpha;
  const pf = SCIENTIFIC_PARAMS.pf;
  
  // Calcola la soglia dalla formula del paper
  const threshold = ((1 - alpha) ** 2) / (1 + alpha ** 2);
  
  // Semplicemente: confronta pf con la soglia
  const isSatisfied = pf <= threshold;
  
  return {
    currentPf: pf,
    theoreticalThreshold: threshold,
    isSatisfied,
    status: isSatisfied ? 'ERADICABLE' : 'ENDEMIC',
    message: isSatisfied 
      ? `Debunking funziona! pf (${pf.toFixed(3)}) ≤ soglia (${threshold.toFixed(3)})`
      : `Debunking non basta: pf (${pf.toFixed(3)}) > soglia (${threshold.toFixed(3)})`,
    recommendation: isSatisfied
      ? 'La fake news puoi controllarla se piazzi bene i fact-checkers'
      : 'Se troppa gente dimentica, il fake rimarrà per sempre - aumenta pv o diminuisci pf'
  };
}

/**
 * Stessa formula ma per comunità diverse
 * e il fake rimarrà lì... mentre gli scettici lo controllano bene!
 */
function calculateSegregatedThreshold() {
  const alpha_g = SCIENTIFIC_PARAMS.alpha_gullible;
  const alpha_s = SCIENTIFIC_PARAMS.alpha_skeptic;
  const pf = SCIENTIFIC_PARAMS.pf;
  
  // Stessa formula ma per ogni comunità
  const threshold_gullible = ((1 - alpha_g) ** 2) / (1 + alpha_g ** 2);
  const threshold_skeptic = ((1 - alpha_s) ** 2) / (1 + alpha_s ** 2);
  
  return {
    gullibleCommunity: {
      alpha: alpha_g,
      threshold: threshold_gullible,
      isSatisfied: pf <= threshold_gullible,
      status: pf <= threshold_gullible ? 'Si riesce a controllare' : 'Il fake rimane per sempre'
    },
    skepticCommunity: {
      alpha: alpha_s,
      threshold: threshold_skeptic,
      isSatisfied: pf <= threshold_skeptic,
      status: pf <= threshold_skeptic ? 'Si riesce a controllare' : 'Il fake rimane per sempre'
    },
    bothSatisfied: (pf <= threshold_gullible) && (pf <= threshold_skeptic),
    message: ((pf <= threshold_gullible) && (pf <= threshold_skeptic))
      ? 'Entrambe le comunità: debunking funziona dappertutto'
      : (pf <= threshold_gullible)
        ? 'Solo con i creduli funziona; gli scettici il fake rimarrà'
        : (pf <= threshold_skeptic)
          ? 'Solo con gli scettici funziona; i creduli il fake rimarrà'
          : 'Entrambe le comunità: il fake rimane comunque - pf troppo alta!'
  };
}

/**
 * Analizziamo β (beta) - il parametro di diffusione
 * Se β basso = notizie si diffondono lentamente
 * Se β alto = notizie diventano virali velocemente
 * 
 * Il paper scopre che il balance tra β e pf (dimenticanza) determina
 * se il sistema è stabile o caotico!
 */
function analyzeSpreadingRate() {
  const beta = SCIENTIFIC_PARAMS.beta;
  const alpha = SCIENTIFIC_PARAMS.alpha;
  const pf = SCIENTIFIC_PARAMS.pf;
  
  let assessment = '';
  let riskLevel = 'MEDIO';
  
  if (beta < 0.2) {
    assessment = 'Diffusione molto lenta - il fake si propaga a passo di lumaca';
    riskLevel = 'BASSO';
  } else if (beta < 0.5) {
    assessment = 'Diffusione moderata - equilibrio tra fake e fact-checking';
    riskLevel = 'MEDIO';
  } else if (beta < 0.8) {
    assessment = 'Diffusione veloce - il fake si propaga come fuoco';
    riskLevel = 'ALTO';
  } else {
    assessment = 'Diffusione MASSIMA - il sistema è caotico e instabile';
    riskLevel = 'CRITICO';
  }
  
  // L'interazione tra β e pf determina l'instabilità
  // Se β alto e pf basso = sistema stabile ma con molti believers
  // Se β alto e pf alto = sistema caotico
  const volatility = beta * (1 - pf);
  
  return {
    beta,
    assessment,
    riskLevel,
    volatility,
    volatilityDescription: volatility > 0.6 ? 'ALTA - il sistema è instabile' : 
                          volatility > 0.3 ? 'MEDIA - dinamica interessante' : 'BASSA - il sistema è stabile',
    interaction: `β × (1-pf) = ${(beta * (1 - pf)).toFixed(3)}`
  };
}

/**
 * Lo "score" finale per valutare se il debunking funzionerà
 * 
 * Combiniamo 4 fattori:
 * 1.threshold
 * 2. Quanto la gente verifica (pv)
 * 3. Quanto velocemente si diffonde (beta)
 * 4. Quanto dimentica la gente (pf)
 * 
 * Ogni fattore ha un peso diverso nell'equazione finale.
 * Ritorna un numero 0-100 che dice: "Che probabilità hai di controllare il fake?"
 */
function predictDebunkingOutcome() {
  const threshold = calculateMeanFieldThreshold();
  const spreading = analyzeSpreadingRate();
  const pv = SCIENTIFIC_PARAMS.pv;
  
  let score = 0;  // 0-100
  let factors = [];
  
  // Fattore 1: Threshold è soddisfatto? (peso 40% perché è il più importante!)
  if (threshold.isSatisfied) {
    score += 40;
    factors.push('Formula soddisfatta - il debunking ha fondamenta teoriche');
  } else {
    factors.push('Formula violata - il fake rimarrà anche con fact-checkers');
  }
  
  // Fattore 2: Quanta gente verifica? (peso 30%)
  score += pv * 30;
  factors.push(`${pv > 0.5 ? '[GOOD]' : '[WARNING]'} Verifica: ${(pv * 100).toFixed(0)}% della gente verifica`);
  
  // Fattore 3: Quanto veloce si diffonde? (peso 20%)
  const spreadingScore = (1 - spreading.volatility) * 20;
  score += spreadingScore;
  factors.push(`${spreading.riskLevel === 'BASSO' ? '[GOOD]' : spreading.riskLevel === 'ALTO' ? '[WARNING]' : '[WARNING]'} Velocità di diffusione: ${spreading.riskLevel}`);
  
  // Fattore 4: Quanto dimentica la gente? (peso 10%)
  const pf = SCIENTIFIC_PARAMS.pf;
  const forgetScore = (1 - pf) * 10;  // Minore pf = credenze stabili = migliore!
  score += forgetScore;
  factors.push(`${pf < 0.3 ? '[GOOD]' : pf < 0.6 ? '[WARNING]' : '[BAD]'} Dimenticanza: ${(pf * 100).toFixed(0)}%`);
  
  // Assicurati che il score sia 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Interpretazione del risultato
  let outcome = '';
  if (score >= 80) {
    outcome = 'Il debunking ha altissime probabilità di successo!';
  } else if (score >= 60) {
    outcome = 'Il debunking ha chance, ma dipende da una buona strategia';
  } else if (score >= 40) {
    outcome = 'Potrebbe andare bene o male, dipende dal piazzamento dei fact-checkers';
  } else {
    outcome = 'Il fake dominerà comunque, il debunking non basta';
  }
  
  return {
    successScore: score,
    outcome,
    factors,
    recommendation: score >= 60 
      ? 'Prova la strategia FRONTIER - piazza i fact-checkers sui ponti tra comunità!'
      : 'Dovrai cambiare i parametri o usare Eternal Fact-Checkers molto aggressivamente'
  };
}

// Export per uso globale
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SCIENTIFIC_PARAMS,
    ScientificNodeState,
    simulateOneDay,
    strategyRandom,
    strategyHubs,
    strategyFrontier,
    generateSegregatedNetwork,
    calculateSegregationMetrics,
    calculateMeanFieldThreshold,
    calculateSegregatedThreshold,
    analyzeSpreadingRate,
    predictDebunkingOutcome
  };
}
