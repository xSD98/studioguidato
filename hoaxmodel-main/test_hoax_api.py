from fastapi.testclient import TestClient
from typing import Dict, Any
import pytest
import networkx as nx

# Importa l'app e lo stato globale dal tuo file principale (es. hoax_api.py)
# Assicurati che il tuo file principale si chiami 'hoax_api.py'
from hoax_api import app, GAME
# Sostituisci 'your_module' con il nome effettivo del tuo file Python (es. 'hoax_api')

# Inizializza il client di test
client = TestClient(app)

# Dati di esempio validi per l'inizializzazione del grafo
VALID_GRAPH_PARAMS = {
    "n_nodes": 5,
    "avg_degree": 2,
    "alpha": {'sk': 0.4, 'gu': 0.95},
    "beta": 0.5,
    "p_v": 0.1,
    "p_f": 0.1,
    "initial_believers_perc": 0.4,
    "initial_factcheckers_perc": 0.2,
    "clustered": True
}

@pytest.fixture(scope="module", autouse=True)
def setup_teardown():
    """Fixture per resettare lo stato GAME tra i moduli di test, se necessario."""
    # Inizializzazione (prima di tutti i test)
    # Nessuna azione specifica richiesta qui
    yield
    # Pulizia (dopo tutti i test)
    # Resetta lo stato globale per isolare i test
    GAME.sim.G = None
    GAME.sim = None
    GAME.node_states = None
    GAME.config = None

# --- 1. Test della rotta di Inizializzazione (POST /api/v1/graph) ---

def test_init_game_success():
    """Verifica l'inizializzazione corretta del gioco."""
    response = client.post("/api/v1/graph", json=VALID_GRAPH_PARAMS)
    
    assert response.status_code == 200
    data = response.json()
    
    # 1. Verifica che i dati del grafo siano presenti
    assert "n_nodes" in data
    assert data["n_nodes"] == VALID_GRAPH_PARAMS["n_nodes"]
    assert "n_edges" in data
    assert "edges" in data
    assert "node_states" in data
    
    # 2. Verifica che lo stato globale sia stato aggiornato
    assert GAME.sim.G is not None
    assert GAME.sim is not None
    assert GAME.node_states is not None
    
    # 3. Verifica che gli stati iniziali siano stati assegnati
    # I nodi sono interi (0, 1, 2, 3, 4) e gli stati sono stringhe ('S', 'B', 'FC')
    assert isinstance(data["node_states"], dict)
    for node_id, state in data["node_states"].items():
        assert int(node_id) in range(VALID_GRAPH_PARAMS["n_nodes"]) # Le chiavi JSON sono stringhe
        assert state in ['S', 'B', 'FC']


def test_init_game_invalid_params():
    """Verifica che la validazione Pydantic funzioni per parametri non validi (e.g., n_nodes <= 0)."""
    invalid_params = VALID_GRAPH_PARAMS.copy()
    invalid_params["n_nodes"] = 0 # Non valido (deve essere > 0)
    
    response = client.post("/api/v1/graph", json=invalid_params)
    
    assert response.status_code == 422 # 422 Unprocessable Entity per errori di validazione Pydantic

# --- 2. Test della rotta di Aggiornamento Stato (PUT /api/v1/state) ---

# Usa un fixture per inizializzare il gioco prima di testare PUT/GET/POST successivi
@pytest.fixture
def initialized_game():
    """Inizializza il gioco e restituisce lo stato iniziale."""
    # Resetta lo stato per assicurare l'isolamento del test
    GAME.sim.G = None
    GAME.sim = None
    GAME.node_states = None
    GAME.config = None
    
    response = client.post("/api/v1/graph", json=VALID_GRAPH_PARAMS)
    assert response.status_code == 200
    return response.json()


def test_update_node_states_success(initialized_game):
    """Verifica l'aggiornamento dello stato dei nodi con dati validi."""
    
    # Prepara il nuovo stato: 0 e 1 Believer, gli altri Susceptible
    new_states_payload = {
        "0": "B",
        "1": "B",
        "2": "S",
        "3": "S",
        "4": "FC"
    }

    response = client.put("/api/v1/state", json=new_states_payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # 1. Verifica il messaggio e la nuova chiave
    assert data["message"] == "stato dei nodi aggiornato con successo"
    new_node_states = data["new_node_states"]
    
    # 2. Verifica che gli stati aggiornati corrispondano
    # Nota: Le chiavi di `new_node_states` nello stato globale sono INT, ma il JSON di risposta le ha convertite in STRINGA
    assert new_node_states["0"] == "B" 
    assert new_node_states["1"] == "B"
    
    # 3. Verifica che lo stato globale sia aggiornato (usando le chiavi INT)
    assert GAME.node_states[0] == "B"
    assert GAME.node_states[1] == "B"
    
    # 4. Verifica che lo stato nel grafo networkx sia aggiornato
    assert nx.get_node_attributes(GAME.sim.G, 'state')[0] == "B"

    assert nx.get_node_attributes(GAME.sim.G, 'state') == GAME.node_states

def test_update_node_states_no_graph():
    """Verifica l'errore se si tenta di aggiornare lo stato senza inizializzare il grafo."""
    # Resetta lo stato globale per assicurare che il grafo non sia presente
    GAME.sim.G = None 
    
    payload = {"0": "B"}
    response = client.put("/api/v1/state", json=payload)
    
    assert response.status_code == 404
    assert "Grafo non ancora creato" in response.json()["detail"]


def test_update_node_states_invalid_nodeset(initialized_game):
    """Verifica l'errore se il payload non contiene l'esatto set di nodi del grafo."""
    
    # Payload mancante del nodo '4' (il grafo ha 5 nodi: 0, 1, 2, 3, 4)
    invalid_payload = {
        "0": "B",
        "1": "B",
        "2": "S",
        "3": "S",
        # Nodo '4' mancante
    }
    
    response = client.put("/api/v1/state", json=invalid_payload)
    
    assert response.status_code == 400
    assert "L'insieme dei nodi negli stati non corrisponde" in response.json()["detail"]

    # Payload mancante del nodo '4' (il grafo ha 5 nodi: 0, 1, 2, 3, 4)
    invalid_payload2 = {
        "0": "B",
        "1": "B",
        "2": "S",
        "3": "S",
        "5": "S",
        # Nodo '5' invece di '4'
    }
    
    response = client.put("/api/v1/state", json=invalid_payload2)
    
    assert response.status_code == 400
    assert "L'insieme dei nodi negli stati non corrisponde" in response.json()["detail"]

    # Payload mancante del nodo '4' (il grafo ha 5 nodi: 0, 1, 2, 3, 4)
    invalid_payload3 = {
        "0": "B",
        "1": "B",
        "2": "S",
        "3": "S",
        "4": "F",
        # Stato 'F' non valido
    }
    
    response = client.put("/api/v1/state", json=invalid_payload3)
    
    assert response.status_code == 400
    assert "Lo stato dei nodi deve essere uno tra {'S', 'B', 'FC'}." in response.json()["detail"]

# --- 3. Test della rotta GET /api/v1/state ---

def test_get_node_states_success(initialized_game):
    """Verifica il recupero dello stato dei nodi dopo l'inizializzazione."""
    response = client.get("/api/v1/state")
    
    assert response.status_code == 200
    states = response.json()
    
    # Verifica che il formato di risposta sia corretto (chiavi stringa, valori stato)
    assert isinstance(states, dict)
    assert len(states) == VALID_GRAPH_PARAMS["n_nodes"]
    
    # Controlla che le chiavi siano stringhe di interi
    for node_id_str, state in states.items():
        assert isinstance(node_id_str, str)
        assert int(node_id_str) in range(VALID_GRAPH_PARAMS["n_nodes"])
        assert state in ['S', 'B', 'FC']
        
# --- 4. Test della rotta POST /api/v1/step ---

def test_run_simulation_step_success(initialized_game):
    """Verifica l'esecuzione di un passo di simulazione."""
    
    response = client.post("/api/v1/step")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "message" in data
    assert "new_node_states" in data
    
    # Il numero di nodi deve rimanere lo stesso
    assert len(data["new_node_states"]) == VALID_GRAPH_PARAMS["n_nodes"]
    
    # La lunghezza della lista degli stati deve essere avanzata a 2 (iniziale + 1 passo) 
    assert len(GAME.sim._states) == 2
    
    # Verifica che lo stato globale sia aggiornato con il nuovo stato appena simulato

    assert GAME.node_states == GAME.sim._states[-1]

    assert nx.get_node_attributes(GAME.sim.G, 'state') == GAME.node_states