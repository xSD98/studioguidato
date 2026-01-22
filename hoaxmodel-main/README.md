# 📰 Fake News Diffusion Game API

Questa API, costruita con **FastAPI** in Python, funge da back-end per un simulatore di diffusione di bufale su una rete complessa. Utilizza un modello di contagio basato sugli stati **S** (Susceptible), **B** (Believer) e **FC** (Fact-Checker).

## 🚀 Requisiti

Per eseguire l'API, sono necessari Python 3.8+ (meglio 3.11+) e le seguenti librerie:

* `fastapi`
* `uvicorn`
* `pydantic`
* `networkx`
* **Moduli custom:** `simulation`, `hoax_config`, `hoax_utils`, `hoax_model_functions` (Questi devono essere presenti nel tuo progetto).

### Installazione

```bash
pip install fastapi uvicorn pydantic networkx matplotlib imageio pandas
```


###  Avvio del Server

Assicurati che il file API sia chiamato main.py e che le dipendenze custom (simulation.py, ecc.) siano nella stessa directory.

Esegui il server in modalità di sviluppo:
Bash
```
uvicorn hoax_api:app --reload
```

L'API sarà disponibile all'indirizzo http://127.0.0.1:8000.

### Documentazione API

FastAPI genera automaticamente una documentazione interattiva (Swagger UI) che puoi consultare all'indirizzo:

http://127.0.0.1:8000/docs

### Endpoint API

Il flusso tipico di interazione con l'API è: Inizializzazione → Recupero Stato → Esecuzione Passo (ripetuto).

1. Inizializzazione del Simulatore


| Parametri | Tipo | Descrizione |
| :--- | :--- | :--- |
| n_nodes | int | Numero di nodi nel grafo. |
| avg_degree | int | Grado medio per la generazione della rete.
| alpha | float o Dict[str, float] | Prob. di credibilità (S → B). Può essere un valore uniforme (float) o un dizionario che specifica la credibilità per diversi gruppi (e.g., {"sk": 0.4, "gu": 0.95}). |
| beta | float | Prob. di diffusione/contagio (usato anche per F → S). |
| p_v | float | Prob. di verifica (B → FC). |
| p_f | float | Prob. di dimenticare (B → S). |
| initial_believers_perc | float | % iniziale di Believers (B). |
| initial_factcheckers_perc | float | % iniziale di Fact-Checkers (FC). |
| clustered | bool | True per grafi che favoriscono i cluster. |


Risposta: Struttura del grafo (edges, n_nodes, ecc.), stato iniziale dei nodi, le proprietà di gullibility (credulità) dei nodi, e l'eventuale partition (partizione) del grafo se sono stati creati cluster.

2. Gestione dello Stato dei Nodi

Recupera Stato Attuale

```
GET /api/v1/state
```

Risposta: Dizionario dello stato attuale dei nodi (es. {"1": "S", "2": "B", ...}).

Aggiorna/Forza Stato

```
PUT /api/v1/state
```

Permette di sovrascrivere o inizializzare lo stato dei nodi con un payload esterno. Corpo Richiesta: Dizionario completo dello stato dei nodi (es. {"1": "S", "2": "FC", ...}).

Risposta: Conferma e nuovo stato dei nodi.

3. Simulazione

Esegui un Passo di Simulazione

```
POST /api/v1/step
```

Esegue la logica di transizione del modello SBF per un singolo time step. Non richiede corpo di richiesta.

Risposta: Conferma e il nuovo stato dei nodi dopo il passo di simulazione.

### Esempio di Utilizzo con cURL

Di seguito sono riportati alcuni esempi su come interagire con gli endpoint API utilizzando il tool da riga di comando curl.

Passo 1: Inizializzare il Simulatore (POST /api/v1/graph)

Questo comando crea un grafo da 50 nodi con un grado medio di 4 e parametri di diffusione iniziali.

Bash
```
curl -X POST "[http://127.0.0.1:8000/api/v1/graph](http://127.0.0.1:8000/api/v1/graph)" \
     -H "Content-Type: application/json" \
     -d '{
           "n_nodes": 50,
           "avg_degree": 6,
           "alpha": {"sk": 0.4, "gu": 0.95},
           "beta": 0.5,
           "p_v": 0.05,
           "p_f": 0.4,
           "initial_believers_perc": 0.05,
           "initial_factcheckers_perc": 0.05,
           "clustered": true
         }'
```

Passo 2: Eseguire un Passo di Simulazione (POST /api/v1/step)

Questo comando esegue un'iterazione del modello SBF e restituisce il nuovo stato dei nodi.


Bash
```
curl -X POST "[http://127.0.0.1:8000/api/v1/step](http://127.0.0.1:8000/api/v1/step)" \
     -H "Content-Type: application/json"
```

Passo 3: Ottenere lo Stato Attuale (GET /api/v1/state)

Questo comando recupera lo stato attuale dei nodi dal server.

Bash
```
curl -X GET "[http://127.0.0.1:8000/api/v1/state](http://127.0.0.1:8000/api/v1/state)"
```

Passo 4: Aggiornare/Forzare uno Stato (PUT /api/v1/state)

Nota: Devi fornire lo stato completo di tutti i nodi (0 a n_nodes-1).

Bash
```
curl -X PUT "[http://127.0.0.1:8000/api/v1/state](http://127.0.0.1:8000/api/v1/state)" \
     -H "Content-Type: application/json" \
     -d '{
           "0": "B",
           "1": "S",
           "2": "S",
           "3": "FC",
           "4": "B",
           "...": "..."
         }'
```
(Sostituisci "..." con lo stato di tutti i 50 nodi in questo esempio).

