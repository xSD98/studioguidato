/**
 * HoaxAPIClient
 * Client HTTP per comunicare con l'API FastAPI del modello Hoax
 */
class HoaxAPIClient {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.isReady = false;
  }

  /**
   * Inizializza il grafo e la simulazione con i parametri forniti
   */
  async initGraph(params) {
    const response = await fetch(`${this.baseUrl}/api/v1/graph`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore init grafo: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    this.isReady = true;
    return data;
  }

  /**
   * Carica un grafo esterno (es. graph.json) nel simulatore.
   * TUTTI i parametri (alpha, beta, p_v, p_f, initial_believers_perc, initial_factcheckers_perc)
   * vengono determinati dall'API in base alla modalità scelta.
   * 
   * @param {Object} graphData - Dati del grafo (nodes, links)
   * @param {Object} simParams - Solo 'mode' è necessario (strategica, competitiva, libera)
   */
  async loadGraph(graphData, simParams = {}) {
    // Passa SOLO la modalità - l'API gestisce tutti i parametri!
    const payload = {
      nodes: graphData.nodes,
      links: graphData.links,
      mode: simParams.mode || "libera"  // Solo la mode! API decide il resto
    };

    console.log(`📡 Invio richiesta API con mode: ${payload.mode}`);

    const response = await fetch(`${this.baseUrl}/api/v1/graph/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore caricamento grafo: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    this.isReady = true;
    this.idMap = data.id_map; // Salva la mappa degli ID
    return data;
  }

  /**
   * Esegue un passo di simulazione
   */
  async step() {
    if (!this.isReady) {
      throw new Error('Grafo non inizializzato. Chiama initGraph prima di step.');
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore step: ${error.detail || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Legge lo stato attuale dei nodi
   */
  async getState() {
    const response = await fetch(`${this.baseUrl}/api/v1/state`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore get state: ${error.detail || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Aggiorna lo stato dei nodi (forza uno stato specifico)
   */
  async setState(newStates) {
    const response = await fetch(`${this.baseUrl}/api/v1/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore set state: ${error.detail || response.statusText}`);
    }

    return await response.json();
  }
}

// Istanza globale del client
const hoaxClient = new HoaxAPIClient();
