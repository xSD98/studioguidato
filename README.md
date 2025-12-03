# Giancarlo Ruffo - Simulazione Fake News

**Simulazione basata su ricerche accademiche, con obiettivi e trofei.**

---

## Quick Start

1. **Apri** `index.html` nel browser
2. **Clicca** "🎮 Seleziona Modalità"
3. **Scegli** una modalità (Strategica/Competitiva/Libera)
4. **Seleziona** il tuo team (Fake 🔴 o Verità 🟢)
5. **Gioca** 7 giorni di simulazione
6. **Sblocca** trofei e raggiungi il massimo punteggio!

---

## 🎯 Tre Modalità di Gioco

### 1. STRATEGICA
Controlla la diffusione di notizie con **strategie e boosts**

**Features:**
- 💰 500 monete iniziali
- ⚡ 5 Power-ups (Truth Amp, Fake Virus, Mass Debunk, Memory Wipe, Quarantine)
- 🎯 3 Campagne mirate (Creduli, Scettici, Frontiera)
- 📊 Previsioni 3 giorni con visualizzazione chart
- 🏆 10 trofei specifici

**Strategy Tips:**
- Usa Fake Virus per accelerare spread
- Truth Amp per aumentare verifiche
- Campagne mirate su comunità gullible

### 2. COMPETITIVA
Sfida il CPU opponent in tempo reale

**Features:**
- 🤖 CPU Opponent con 3 difficoltà (Beginner/Expert/Extreme)
- 💣 3 Broadcast Wars Actions (Sabotage/Steal/Reverse)
- 📱 Live stats CPU vs Player
- 🎯 Algoritmo predittivo bilanciato (il tuo team può vincere!)
- ⚔️ 5 trofei competitivi

**Strategy Tips:**
- Livello Beginner: Facile, perfetto per imparare
- Sabotage blocca 1 mossa CPU
- Steal prende 30 monete
- Reverse inverte B↔F per 1 giorno

### 3. LIBERA
Esperimento scientifico con parametri personalizzabili

**Features:**
- 🔬 8 parametri dal paper Tambuscio & Ruffo 2019:
  - α (credibilità leggenda)
  - β (spreading rate)
  - pf (probabilità dimenticanza)
  - pv (probabilità verifica)
  - ρ (segregazione rete)
  - γ (frazione gullible)
  - α_gullible / α_skeptic (credibilità per comunità)
- 📈 Metriche segregazione rete
- 🎓 Mean-Field Threshold Analysis
- 📚 5 trofei esplorazione

**Science Tips:**
- ρ = 0.5: Massima segregazione (2 comunità separate)
- ρ → 1: Minima segregazione (rete ben mescolata)
- pv alto = fact-checking efficace
- α alto = fake news molto credibile

---

## 🏆 Sistema 20+ Trofei

### 🔴 DISINFORMAZIONE (5)
- **Maestro della Disinformazione**: Fake > 70%
- **Dominio Totale**: Fake > 85%
- **Virus Digitale**: Usa Fake Virus 5 volte
- **Sabotatore Supremo**: Sabota CPU 3 volte
- **Ladro di Monete**: Ruba 300 monete

### 🟢 VERITÀ (5)
- **Difensore della Verità**: Verità > 70%
- **Bastione della Verità**: Verità > 85%
- **Debunker Supremo**: Mass Debunk 5 volte
- **Guardiano della Rete**: Aggiungi 10 Eternal FC
- **Profeta Accurato**: 3 previsioni corrette

### ⚔️ COMPETITIVA (4)
- **Vittoria Gloriosa**: Vinci 1 partita
- **Vincitore Seriale**: Vinci 3 di fila
- **Ricco Sfondato**: 1000 monete
- **Stratega Geniale**: Usa 15 boost/campaign diversi

### 🎮 ESPLORAZIONE (3)
- **Onnivoro di Modalità**: Gioca tutte e 3
- **Velocista**: Completa 7 giorni in <2 minuti
- **Equilibrista**: Fake ≈ Verità (40-60%)

### ⭐ RARI (4)
- **Maestro del Caos**: Inverti trend 3 giorni di fila
- **Amnesia Totale**: Memory Wipe 5 volte
- **Dio della Rete**: Modifica ρ ogni giorno
- **Maestro del Timing**: Usa tutti 5 boosts in una sessione

---

## 💰 Economia di Gioco

### Guadagni
- **Strategica**: 50-100 monete per giorno (basato su % Verità)
- **Competitiva**: Bonus finali per vittoria (200-500)
- **Steal Action**: +30 monete (da CPU)

### Costi
| Azione | Costo | Durata |
|--------|-------|--------|
| Truth Amp | 80 | 1 giorno |
| Fake Virus | 100 | 1 giorno |
| Mass Debunk | 120 | Immediato |
| Memory Wipe | 90 | Immediato |
| Quarantine | 110 | 1 giorno |
| Campagna Creduli | 60 | 2 giorni |
| Campagna Scettici | 60 | 2 giorni |
| Campagna Frontiera | 70 | 2 giorni |
| Sabotage | 50 | 1 azione |
| Steal | 75 | 1 azione |
| Reverse | 100 | 1 giorno |

---

## 🎨 Grafica & Design

### Colori
- 🔴 **Fake News**: #ef4444 (Rosso)
- 🟢 **Verità**: #22c55e (Verde)
- ⚪ **Neutrali**: #9aa6bf (Blu-Grigio)
- 🔵 **Primary**: #6ea8fe (Blu)

### Game Base Features
- **KPI Live**: Monete e Mosse in grande
- **Boost Grid**: 2 colonne, hover animations
- **Campaign Buttons**: Singlecolumn, text-based
- **Battle Actions**: Con icone descrittive
- **Trophy Display**: Categorizzato per tipo

### Animazioni
- **Pulse Glow**: Effetto debunk sui nodi
- **Shake**: Vibrazione durante conversione
- **Flip**: Inversione di stato (Reverse boost)
- **Hover**: Sollevamento dei pulsanti

---

## 🔬 Modello Scientifico

Basato su: **Tambuscio & Ruffo (2019, 2018)**
- "Fact-checking strategies to limit urban legends spreading"
- "Network segregation in a model of misinformation"

### Stati Compartimentali
- **S (Susceptible)**: Ignora la notizia
- **B (Believer)**: Crede alla fake news
- **F (Fact-Checker)**: Sa che è falsa

### Equazioni di Transizione (Eq. 4-5)
```
f(t) = β · nB(1+α) / [nB(1+α) + nF(1-α)]  // S→B
g(t) = β · nF(1-α) / [nB(1+α) + nF(1-α)] // S→F
```

### Mean-Field Threshold (Eq. 7)
```
pf ≤ (1-α)² / (1+α²)  // Soglia eradicazione fake news
```

---

## 🎮 Consigli di Gioco

### Per Team FAKE 🔴
1. Attiva Fake Virus il prima possibile
2. Usa campagne su comunità gullible
3. Sabota le mosse CPU quando necessario
4. Accumula credibilità (α alto)

### Per Team TRUTH 🟢
1. Investirai in fact-checkers (Eternal FC)
2. Usa Truth Amp per potenz. verifica
3. Mass Debunk negli ultimi giorni
4. Targettizza scettici per efficienza

### Generale
- **Previsioni** sono accurate: usa il chart!
- **Boosts** durano 1 giorno, pianificali
- **Campagne** durano 2 giorni, usa con saggezza
- **CPU Expert** usa strategie sofisticate

---

## 📊 Salva & Carica

**Salva Sessione**: Pulsante "Salva" → LocalStorage
**Carica Sessione**: Pulsante "Carica" → Modale selezione
**Export JSON**: Scarica dati completi della partita
**Export PNG**: Scarica grafico andamenti

---

## 🛠️ Controlli Tastiera

| Tasto | Azione |
|-------|--------|
| Spacebar | Prossimo giorno |
| Ctrl+S | Salva sessione |
| Ctrl+Z | Reset partita |
| Doppio click su grafo | Zoom reset |

---

## 📱 Responsiveness

- **Desktop** (1920px+): Layout 420px panel + graph
- **Large Screen** (1440px): Full width ottimizzato
- **Tablet** (768px+): Sidebar collapsibile
- **Mobile**: Stack verticale (future)

---

## 🐛 Troubleshooting

**Il grafo non appare?**
- Apri console (F12) e cerca errori
- Assicurati che D3.js e Chart.js siano caricati

**I trofei non si sbloccano?**
- Gioca fino al giorno 7
- Click "Calcola previsioni" per aggiornare
- Reset e riprova

**CPU non fa mosse?**
- Cambia difficoltà nella selezione match
- Assicurati che CPU abbia monete (>50)

---

## 📚 Referenze Accademiche

1. **Tambuscio, M., Ruffo, G., et al. (2019)**
   - "Fact-checking strategies to limit urban legends spreading in a segregated society"
   - Proceedings ACM/IEEE

2. **Tambuscio, M., Ruffo, G., et al. (2018)**
   - "Network segregation in a model of misinformation and fact-checking"
   - Journal of Computational Social Science

---

## 🎓 Per Ricercatori

Il modello è perfettamente configurabile:

```javascript
// Cambia parametri in LIBERA modalità
SCIENTIFIC_PARAMS.alpha = 0.7;  // Credibilità fake news
SCIENTIFIC_PARAMS.beta = 0.5;   // Spreading rate
SCIENTIFIC_PARAMS.pv = 0.3;     // Probabilità verifica
// ... e altri 5 parametri
```

Usa **Export JSON** per esportare i dati completi di ogni run!

---

## 🎉 Credits

**Sviluppo**: Game Design + Scientific Model Integration
**Ricerca**: Basato su Tambuscio & Ruffo 2019/2018
**Tech Stack**: D3.js + Chart.js + Vanilla JavaScript

**Enjoy the game! 🚀**
