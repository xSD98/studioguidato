# Simulazione della Diffusione di Fake News in Reti Sociali

## Abstract

Questo progetto implementa un modello computazionale per la simulazione della propagazione di disinformazione all'interno di reti sociali. Il sistema si basa su un modello epidemiologico SIS (Susceptible-Infected-Susceptible) adattato, in cui gli agenti possono assumere tre stati distinti: Susceptible (S), Believer (B) e Fact-Checker (FC).

L'architettura del sistema è composta da un backend API RESTful sviluppato in Python con FastAPI e un frontend web per la visualizzazione interattiva della dinamica di rete.

---

## Requisiti di Sistema

### Software

- Python 3.9 o superiore
- pip (gestore pacchetti Python)
- Browser web moderno (Chrome, Firefox, Safari)

### Dipendenze Python

```
fastapi
uvicorn
networkx
numpy
pydantic
```

---

## Installazione

### 1. Installazione delle dipendenze

```bash
cd /Users/simonedagnano/Documents/progetto-sg/progettopRUFFO/hoaxmodel-main
pip3 install fastapi uvicorn networkx numpy pydantic
```

---

## Avvio del Sistema

### 2. Avvio del Server API (Backend)

Aprire un terminale ed eseguire:

```bash
cd /Users/simonedagnano/Documents/progetto-sg/progettopRUFFO/hoaxmodel-main (aprire in console con cartella hoaxmodel-main)
python3 -m uvicorn hoax_api:app --reload --host 127.0.0.1 --port 8000
```

Il server sarà accessibile all'indirizzo `http://localhost:8000`.

La documentazione interattiva dell'API (Swagger UI) è disponibile all'indirizzo `http://localhost:8000/docs`.

### 3. Avvio del Server Frontend

Aprire un secondo terminale ed eseguire:

```bash
cd /Users/simonedagnano/Documents/progetto-sg/progettopRUFFO (aprire in console con cartella root principale)
python3 -m http.server 3000
```

L'interfaccia web sarà accessibile all'indirizzo `http://localhost:3000`.

---

## Architettura del Sistema

### Backend (API REST)

Il backend espone i seguenti endpoint principali:

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/v1/graph` | POST | Genera un grafo casuale con parametri specificati |
| `/api/v1/graph/load` | POST | Carica un grafo predefinito con configurazione |
| `/api/v1/step` | POST | Esegue un passo di simulazione |
| `/api/v1/state` | GET | Restituisce lo stato corrente della simulazione |
| `/api/v1/state` | PUT | Aggiorna lo stato di nodi specifici |

### Frontend

L'interfaccia web utilizza D3.js per la visualizzazione del grafo e Chart.js per i grafici temporali. La comunicazione con il backend avviene tramite chiamate fetch all'API REST.

---

## Parametri del Modello

### Parametri di Propagazione

| Parametro | Simbolo | Descrizione | Intervallo |
|-----------|---------|-------------|------------|
| Alpha | α | Probabilità che un nodo Susceptible diventi Believer quando esposto alla fake news | [0, 1] |
| Beta | β | Probabilità che un Believer torni Susceptible quando esposto a fact-checking | [0, 1] |
| p_v | p_v | Probabilità di verifica prima di credere | [0, 1] |
| p_f | p_f | Probabilità di dimenticare (Fact-Checker torna Susceptible) | [0, 1] |

### Condizioni Iniziali

| Parametro | Descrizione |
|-----------|-------------|
| initial_believers_perc | Percentuale iniziale di nodi Believer |
| initial_factcheckers_perc | Percentuale iniziale di nodi Fact-Checker |

### Modalita Predefinite

Il sistema offre tre configurazioni predefinite (MODE_PRESETS):

**Libera**: Parametri bilanciati per sperimentazione libera.

**Strategica**: Diffusione lenta ma persistente, richiede pianificazione.

**Competitiva**: Scenario difficile con fake news aggressive.

---

## Configurazione per Scenari Specifici

### Scenario: Prevalenza della Disinformazione (fatto da me in base alle prove fatte ma possono essere modificate, ci farò altre prove su campioni più ampi)

Per simulare uno scenario in cui le fake news prevalgono:

- α (alpha): 0.8 - 0.95
- β (beta): 0.1 - 0.3
- p_v: 0.05 - 0.15
- p_f: 0.3 - 0.5
- initial_believers_perc: 0.15 - 0.30
- initial_factcheckers_perc: 0.02 - 0.05

### Scenario: Contenimento della Disinformazione

Per simulare uno scenario in cui il fact-checking prevale:

- α (alpha): 0.3 - 0.5
- β (beta): 0.6 - 0.8
- p_v: 0.4 - 0.6
- p_f: 0.05 - 0.15
- initial_believers_perc: 0.05 - 0.10
- initial_factcheckers_perc: 0.15 - 0.25

---

## Riferimenti Teorici

Il modello implementato si basa sulla letteratura relativa ai modelli epidemiologici applicati alla diffusione dell'informazione nelle reti sociali. In particolare:

1. Modelli SIS/SIR adattati per la propagazione di informazioni
2. Teoria dei grafi per la rappresentazione delle reti sociali
3. Dinamiche di opinione e influenza sociale

---

## Struttura del Progetto

```
progettopRUFFO/
├── hoaxmodel-main/
│   └── hoax_api.py          # Backend API FastAPI
├── app.js                    # Logica frontend
├── hoax-client.js           # Client API per il frontend
├── index.html               # Interfaccia utente
├── styles.css               # Stili CSS
├── graph.json               # Grafo di rete predefinito
└── README.md                # Documentazione
```

---

## Note Tecniche

- Il backend e il frontend devono essere avviati su porte distinte (8000 e 3000 rispettivamente)
- Il frontend effettua richieste verso `http://localhost:8000`
- Il CORS e configurato nel backend per accettare richieste dal frontend locale

---

## Autore
SIMONE D'AGNANO 20054611
Progetto sviluppato per finalita accademiche e di ricerca.


tutti FC
{
  "0": "FC",
  "1": "FC",
  "2": "FC",
  "3": "FC",
  "4": "FC",
  "5": "FC",
  "6": "FC",
  "7": "FC",
  "8": "FC",
  "9": "FC",
  "10": "FC",
  "11": "FC",
  "12": "FC",
  "13": "FC",
  "14": "FC",
  "15": "FC",
  "16": "FC",
  "17": "FC",
  "18": "FC",
  "19": "FC",
  "20": "FC",
  "21": "FC",
  "22": "FC",
  "23": "FC",
  "24": "FC",
  "25": "FC",
  "26": "FC",
  "27": "FC",
  "28": "FC",
  "29": "FC",
  "30": "FC",
  "31": "FC",
  "32": "FC",
  "33": "FC",
  "34": "FC",
  "35": "FC",
  "36": "FC",
  "37": "FC",
  "38": "FC",
  "39": "FC",
  "40": "FC",
  "41": "FC",
  "42": "FC",
  "43": "FC",
  "44": "FC",
  "45": "FC",
  "46": "FC",
  "47": "FC",
  "48": "FC",
  "49": "FC",
  "50": "FC",
  "51": "FC",
  "52": "FC",
  "53": "FC",
  "54": "FC",
  "55": "FC",
  "56": "FC",
  "57": "FC",
  "58": "FC",
  "59": "FC",
  "60": "FC",
  "61": "FC",
  "62": "FC",
  "63": "FC",
  "64": "FC",
  "65": "FC",
  "66": "FC",
  "67": "FC",
  "68": "FC",
  "69": "FC",
  "70": "FC",
  "71": "FC",
  "72": "FC",
  "73": "FC",
  "74": "FC",
  "75": "FC",
  "76": "FC",
  "77": "FC",
  "78": "FC",
  "79": "FC",
  "80": "FC",
  "81": "FC",
  "82": "FC",
  "83": "FC",
  "84": "FC",
  "85": "FC",
  "86": "FC",
  "87": "FC",
  "88": "FC",
  "89": "FC",
  "90": "FC",
  "91": "FC",
  "92": "FC",
  "93": "FC",
  "94": "FC",
  "95": "FC",
  "96": "FC",
  "97": "FC",
  "98": "FC",
  "99": "FC",
  "100": "FC",
  "101": "FC",
  "102": "FC",
  "103": "FC",
  "104": "FC",
  "105": "FC",
  "106": "FC",
  "107": "FC",
  "108": "FC",
  "109": "FC",
  "110": "FC",
  "111": "FC",
  "112": "FC",
  "113": "FC",
  "114": "FC",
  "115": "FC",
  "116": "FC",
  "117": "FC",
  "118": "FC",
  "119": "FC",
  "120": "FC",
  "121": "FC",
  "122": "FC",
  "123": "FC",
  "124": "FC",
  "125": "FC",
  "126": "FC",
  "127": "FC",
  "128": "FC",
  "129": "FC",
  "130": "FC",
  "131": "FC",
  "132": "FC",
  "133": "FC",
  "134": "FC",
  "135": "FC",
  "136": "FC",
  "137": "FC",
  "138": "FC",
  "139": "FC",
  "140": "FC",
  "141": "FC",
  "142": "FC",
  "143": "FC",
  "144": "FC",
  "145": "FC",
  "146": "FC",
  "147": "FC",
  "148": "FC",
  "149": "FC",
  "150": "FC",
  "151": "FC",
  "152": "FC",
  "153": "FC",
  "154": "FC",
  "155": "FC",
  "156": "FC",
  "157": "FC",
  "158": "FC",
  "159": "FC",
  "160": "FC",
  "161": "FC",
  "162": "FC",
  "163": "FC",
  "164": "FC",
  "165": "FC",
  "166": "FC",
  "167": "FC",
  "168": "FC",
  "169": "FC",
  "170": "FC",
  "171": "FC",
  "172": "FC",
  "173": "FC",
  "174": "FC",
  "175": "FC",
  "176": "FC",
  "177": "FC",
  "178": "FC",
  "179": "FC",
  "180": "FC",
  "181": "FC",
  "182": "FC",
  "183": "FC",
  "184": "FC",
  "185": "FC",
  "186": "FC",
  "187": "FC",
  "188": "FC",
  "189": "FC",
  "190": "FC",
  "191": "FC",
  "192": "FC",
  "193": "FC",
  "194": "FC",
  "195": "FC",
  "196": "FC",
  "197": "FC",
  "198": "FC",
  "199": "FC",
  "200": "FC",
  "201": "FC",
  "202": "FC",
  "203": "FC",
  "204": "FC",
  "205": "FC",
  "206": "FC",
  "207": "FC",
  "208": "FC",
  "209": "FC",
  "210": "FC",
  "211": "FC",
  "212": "FC",
  "213": "FC",
  "214": "FC",
  "215": "FC",
  "216": "FC",
  "217": "FC",
  "218": "FC",
  "219": "FC",
  "220": "FC",
  "221": "FC",
  "222": "FC",
  "223": "FC",
  "224": "FC",
  "225": "FC",
  "226": "FC",
  "227": "FC",
  "228": "FC",
  "229": "FC",
  "230": "FC",
  "231": "FC",
  "232": "FC",
  "233": "FC",
  "234": "FC",
  "235": "FC",
  "236": "FC",
  "237": "FC",
  "238": "FC",
  "239": "FC",
  "240": "FC",
  "241": "FC",
  "242": "FC",
  "243": "FC",
  "244": "FC",
  "245": "FC",
  "246": "FC",
  "247": "FC",
  "248": "FC",
  "249": "FC",
  "250": "FC",
  "251": "FC",
  "252": "FC",
  "253": "FC",
  "254": "FC",
  "255": "FC",
  "256": "FC",
  "257": "FC",
  "258": "FC",
  "259": "FC",
  "260": "FC",
  "261": "FC",
  "262": "FC",
  "263": "FC",
  "264": "FC",
  "265": "FC",
  "266": "FC",
  "267": "FC",
  "268": "FC",
  "269": "FC",
  "270": "FC",
  "271": "FC",
  "272": "FC",
  "273": "FC",
  "274": "FC",
  "275": "FC",
  "276": "FC",
  "277": "FC",
  "278": "FC",
  "279": "FC",
  "280": "FC",
  "281": "FC",
  "282": "FC",
  "283": "FC",
  "284": "FC",
  "285": "FC",
  "286": "FC",
  "287": "FC",
  "288": "FC",
  "289": "FC",
  "290": "FC",
  "291": "FC",
  "292": "FC",
  "293": "FC",
  "294": "FC",
  "295": "FC",
  "296": "FC",
  "297": "FC",
  "298": "FC",
  "299": "FC",
  "300": "FC",
  "301": "FC",
  "302": "FC",
  "303": "FC",
  "304": "FC",
  "305": "FC",
  "306": "FC",
  "307": "FC",
  "308": "FC",
  "309": "FC",
  "310": "FC",
  "311": "FC",
  "312": "FC",
  "313": "FC",
  "314": "FC",
  "315": "FC",
  "316": "FC",
  "317": "FC",
  "318": "FC",
  "319": "FC",
  "320": "FC",
  "321": "FC",
  "322": "FC",
  "323": "FC",
  "324": "FC",
  "325": "FC",
  "326": "FC",
  "327": "FC",
  "328": "FC",
  "329": "FC",
  "330": "FC",
  "331": "FC",
  "332": "FC",
  "333": "FC",
  "334": "FC",
  "335": "FC"
}