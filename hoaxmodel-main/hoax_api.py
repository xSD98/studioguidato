from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
import networkx as nx
from functools import partial
# Assumendo che questi moduli esistano e contengano le classi/funzioni menzionate
from simulation import Simulation
from hoax_config import HoaxConfig
from hoax_utils import create_graph
from hoax_model_functions import hoax_initial_state, hoax_state_transition, stop_condition


# --- 1. Strutture Dati (Pydantic Models) ---

# Modello per i parametri di creazione del grafo
class GraphParams(BaseModel):
    """
    Parametri per la creazione del grafo e la configurazione della dinamica del modello SBF (Susceptible-Believer-FactChecker).
    """
    n_nodes: int = Field(..., gt=0, description="Numero totale di nodi nel grafo.")
    avg_degree: int = Field(..., gt=0, description="Grado medio desiderato del grafo.")
    # MODIFICA: alpha può essere float o Dict[str, float]
    alpha: Union[float, Dict[str, float]] = Field(
        ..., 
        description=(
            "Probabilità di credibilità (S -> B). "
            "Può essere un singolo float (uniforme) o un dizionario che associa "
            "un'etichetta di gruppo (str, e.g., 'sk', 'gu') a un valore float specifico."
        )
    )    
    beta: float = Field(..., ge=0, le=1, description="Probabilità di diffusione/contagio (usato anche per F -> S).")
    p_v: float = Field(..., ge=0, le=1, description="Probabilità di verifica (B -> FC).")
    p_f: float = Field(..., ge=0, le=1, description="Probabilità di dimenticare (B -> S).")
    initial_believers_perc: float = Field(..., ge=0, le=1, description="Percentuale iniziale di nodi 'Believers' (B).")
    initial_factcheckers_perc: float = Field(..., ge=0, le=1, description="Percentuale iniziale di nodi 'Fact-Checkers' (FC).")
    clustered: bool = Field(..., description="Se True, usa un modello di grafo che favorisce i cluster (e.g., Stochastic Block Model).")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "n_nodes": 6,
                    "avg_degree": 2,
                    "alpha": {"sk": 0.4, "gu": 0.95},
                    "beta": 0.5,
                    "p_v": 0.05,
                    "p_f": 0.4,
                    "initial_believers_perc": 0.05,
                    "initial_factcheckers_perc": 0,
                    "clustered": True
                },
                {
                    "n_nodes": 10,
                    "avg_degree": 2,
                    "alpha": 0.15,
                    "beta": 0.05,
                    "p_v": 0.02,
                    "p_f": 0.8,
                    "initial_believers_perc": 0.02,
                    "initial_factcheckers_perc": 0.02,
                    "clustered": False
                }
                
            ]
        }
    }

# Stato globale del gioco in back end
class HoaxGameState:
    """
    Singleton per mantenere lo stato globale del simulatore sul server:
    parametri, configurazione, oggetto Simulation e stato attuale dei nodi.
    """
    def __init__(self):
        self.params: Optional[GraphParams] = None
        self.sim: Optional[Simulation] = None
        self.node_states: Optional[Dict[int, str]] = None
        self.config: Optional[HoaxConfig] = None
        
# inizializza logger
logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

# Inizializza lo stato globale
GAME = HoaxGameState()
app = FastAPI(title="Fake News Diffusion Game API")

# Configura CORS per permettere richieste dal frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Funzioni di Supporto per la Simulazione ---

def convert_keys_to_int(data: dict) -> dict:
    """
    Converte le chiavi stringa di un dizionario in chiavi intere dove possibile.
    Utile per deserializzare i dati JSON in cui gli ID dei nodi sono stringhe.

    Args:
        data: Dizionario con chiavi potenzialmente stringhe (e.g., {'1': 'S'}).

    Returns:
        Dizionario con chiavi convertite in interi (e.g., {1: 'S'}).
    """
    return {int(k): v for k, v in data.items()}

def init_nodes_state():
    """
    Inizializza l'attributo node_states dell'oggetto GAME con lo stato iniziale
    ottenuto dall'oggetto di simulazione (GAME.sim).
    """
    if GAME.sim:
        initial_state = GAME.sim.state()
        logger.debug(f'initial_state: {initial_state}')
        GAME.node_states = initial_state


# --- 3. Definizione delle Rotte API ---

## 🛠️ Inizializzazione del Simulatore

@app.post("/api/v1/graph", response_model=Dict[str, Any])
def init_game(params: GraphParams):
    """
    Crea il grafo iniziale e inizializza il simulatore con i parametri forniti.
    
    Args:
        params: Oggetto GraphParams contenente tutti i parametri di configurazione.

    Returns:
        Un dizionario contenente i dati del grafo serializzati (nodi, archi) e lo stato iniziale dei nodi.

    Raises:
        HTTPException: Se si verifica un errore durante la creazione o l'inizializzazione.
    """
    try:
        # 1. create the HoaxConfig
        GAME.config = HoaxConfig(
            num_nodes=params.n_nodes,
            average_degree=params.avg_degree,
            alpha=params.alpha,
            beta=params.beta,
            p_v=params.p_v,
            p_f=params.p_f, # Corretto p_f qui
            perc_believers=params.initial_believers_perc,
            perc_factcheckers=params.initial_factcheckers_perc,
            clustered=params.clustered
        )

        logger.debug(f'GAME.config: {GAME.config}')

        # 2. create the graph
        graph = create_graph(GAME.config)

        # 3. init the simulator object
        GAME.sim = Simulation(
            graph,
            partial(hoax_initial_state, config=GAME.config),
            partial(hoax_state_transition, config=GAME.config),
            stop_condition,
            name='hoax model',
            state_labels=['S', 'B', 'FC'],
            state_colors=GAME.config.state_colors
        )

        init_nodes_state()
        
        # 4. Converte i dati del grafo in un formato serializzabile 
        graph_data = {
            "n_nodes": GAME.sim.G.number_of_nodes(),
            "n_edges": GAME.sim.G.number_of_edges(),
            "edges": list(GAME.sim.G.edges()),
            "node_states": GAME.node_states,
            "gullibility": nx.get_node_attributes(GAME.sim.G, 'gullibility'),
            "partition": GAME.sim.G.graph['partition'] if 'partition' in GAME.sim.G.graph else None
        }
        
        return graph_data
    except Exception as e:
        logger.error(f"Errore in init_game: {e}")
        raise HTTPException(status_code=400, detail=f"Errore nella creazione del grafo: {e}")


## 💾 Gestione dello Stato dei Nodi

@app.put("/api/v1/state")
def update_node_states(new_states: Dict[str, str]):
    """
    Aggiorna lo stato dei nodi del simulatore con lo stato fornito dal client.
    Permette al client di 'forzare' o resettare uno stato specifico.

    Args:
        new_states: Dizionario con ID nodo (stringa o int) come chiave e stato ('S', 'B', 'FC') come valore.

    Returns:
        Un dizionario di conferma con il nuovo stato aggiornato.

    Raises:
        HTTPException: Se il simulatore non è inizializzato o se i dati sono malformati.
    """
    if GAME.sim is None or GAME.sim.G is None:
        raise HTTPException(status_code=404, detail="Grafo non ancora creato. Creare prima il grafo tramite POST /api/v1/graph.")

    try:
        new_states = convert_keys_to_int(new_states)
    except ValueError:
        raise HTTPException(status_code=400, detail="Gli ID dei nodi devono essere numeri interi.")

    all_nodes = set(new_states.keys())
    if all_nodes != set(GAME.sim.G.nodes):
        raise HTTPException(status_code=400, detail="L'insieme dei nodi negli stati non corrisponde all'insieme dei nodi del grafo.")
        
    all_values = set(new_states.values())
    valid_states = {'S', 'B', 'FC'}
    if all_values - valid_states:
        raise HTTPException(status_code=400, detail="Lo stato dei nodi deve essere uno tra {'S', 'B', 'FC'}.")
    
    # Aggiorna lo stato nel grafo NetworkX
    nx.set_node_attributes(GAME.sim.G, new_states, 'state')
    # Aggiorna lo stato nel Singleton
    GAME.node_states.update(new_states)
    # Aggiorna la cronologia dello stato nel simulatore
    GAME.sim._append_state(new_states)
    
    return_data =  {
            "message": "stato dei nodi aggiornato con successo",
            "new_node_states": GAME.node_states
        }

    return return_data


@app.get("/api/v1/state", response_model=Dict[int, str] )
def get_node_states():
    """
    Recupera e invia al client lo stato attuale dei nodi (S, B, FC).

    Returns:
        Un dizionario che mappa l'ID del nodo (int) al suo stato (str).

    Raises:
        HTTPException: Se il simulatore non è inizializzato.
    """
    if GAME.sim is None or GAME.sim.G is None:
        raise HTTPException(status_code=404, detail="Grafo non ancora creato. Creare prima il grafo tramite POST /api/v1/graph.")
    
    return GAME.node_states


## 🏃 Simulazione (Esecuzione di un Passo)

@app.post("/api/v1/step", response_model=Dict[str,Any])
def run_simulation_step():
    """
    Esegue un singolo passo di simulazione del modello SBF.
    
    Il metodo 'run()' dell'oggetto Simulation esegue una singola iterazione
    utilizzando la funzione di transizione di stato configurata.

    Returns:
        Un dizionario di conferma che include il nuovo stato dei nodi dopo il passo di simulazione.

    Raises:
        HTTPException: Se il simulatore non è inizializzato.
    """
    if GAME.sim is None or GAME.sim.G is None:
        raise HTTPException(status_code=404, detail="Simulatore non inizializzato. Creare prima il grafo.")
    
    # Esegue il passo di simulazione
    GAME.sim.run()
    new_states = GAME.sim.state()
    
    # Aggiorna lo stato globale con il nuovo stato (GAME.sim.state() è già aggiornato, 
    # ma aggiorniamo esplicitamente GAME.node_states per consistenza)
    GAME.node_states.update(new_states)

    return_data =  {
            "message": "passo di simulazione eseguito con successo",
            "new_node_states": GAME.node_states
        }

    return return_data

# --- 4. Esecuzione del Server ---
# Esegui con: uvicorn hoax_api:app --reload