// Sistema di internazionalizzazione (i18n)
// Dizionario completo delle traduzioni per IT, EN, FR, DE

const translations = {
  it: {
    // Header
    'header.title': 'Simulatore Diffusione Informazione',
    'header.achievements': 'Trofei',
    'header.nextDay': 'Prossimo Giorno',
    'header.runAll': 'Simulazione Completa',
    'header.settings': 'Impostazioni',
    'header.userArea': 'Area Personale',
    
    // Sidebar - KPI
    'sidebar.kpi': 'Indicatori',
    'sidebar.day': 'Giorno',
    'sidebar.believers': 'Believer',
    'sidebar.factCheckers': 'Fact-Checker',
    'sidebar.susceptible': 'Susceptible',
    'sidebar.victory': 'Obiettivo',
    'sidebar.turnsLeft': 'Turni Rimanenti',
    
    // Sidebar - Budget
    'sidebar.budget': 'Budget',
    'sidebar.recharge': 'Ricarica tra',
    'sidebar.turns': 'turni',
    
    // Sidebar - Buttons
    'sidebar.setMode': 'SET MODE',
    
    // Power-ups Believer
    'powerup.fakeBurst': 'Fake Burst',
    'powerup.fakeBurst.desc': 'Converti 4 S→B immediatamente',
    'powerup.payInfluencer': 'Paga Influencer',
    'powerup.payInfluencer.desc': '2 S→B per turno (4 turni)',
    'powerup.emergencyBeliever': 'EMERGENZA',
    'powerup.emergencyBeliever.desc': '10% FC→S + 3 S→B/turno (5 turni)',
    
    // Power-ups Fact-Checker
    'powerup.talkFriend': 'Parla con un Amico',
    'powerup.talkFriend.desc': 'Converti 1 vicino casuale',
    'powerup.nationalDebunk': 'Smentita Nazionale',
    'powerup.nationalDebunk.desc': '2 B→FC per turno (4 turni)',
    'powerup.emergencyFC': 'EMERGENZA',
    'powerup.emergencyFC.desc': '10% B→S + 3 S→FC/turno (5 turni)',
    
    // Mode Selection
    'mode.title': 'Seleziona Modalità',
    'mode.explore': 'Modalità Esplorazione',
    'mode.explore.desc': 'Osserva la diffusione delle informazioni senza intervento',
    'mode.strategic': 'Modalità Strategica',
    'mode.strategic.desc': 'Gestisci le risorse e influenza la rete',
    'mode.chooseSide': 'Scegli il Lato',
    'mode.chooseSide.desc': 'Diventa Believer o Fact-Checker e lotta per la vittoria',
    
    // Team Selection
    'team.title': 'Scegli la Tua Squadra',
    'team.believer': 'Believer',
    'team.believer.desc': 'Diffondi fake news e converti la rete',
    'team.factChecker': 'Fact-Checker',
    'team.factChecker.desc': 'Combatti la disinformazione con la verità',
    'team.confirm': 'Conferma Scelta',
    
    // Game End Modal
    'gameEnd.victory': 'VITTORIA!',
    'gameEnd.defeat': 'SCONFITTA',
    'gameEnd.stats': 'Statistiche Finali',
    'gameEnd.believers': 'Believer',
    'gameEnd.factCheckers': 'Fact-Checker',
    'gameEnd.turns': 'Turni Giocati',
    'gameEnd.budgetSpent': 'Budget Speso',
    'gameEnd.powerupsUsed': 'Power-up Usati',
    'gameEnd.newGame': 'Nuova Partita',
    
    // Settings
    'settings.title': 'Impostazioni',
    'settings.accessibility': 'Accessibilità',
    'settings.highContrast': 'Alto Contrasto',
    'settings.highContrast.desc': 'Aumenta il contrasto dei colori per una migliore leggibilità',
    'settings.largeText': 'Testo Grande',
    'settings.largeText.desc': 'Ingrandisce il testo in tutta l\'applicazione',
    'settings.reduceMotion': 'Riduci Animazioni',
    'settings.reduceMotion.desc': 'Riduce gli effetti di movimento e transizioni',
    'settings.colorblind': 'Modalità Daltonismo',
    'settings.colorblind.select': 'Seleziona la modalità di visualizzazione',
    'settings.language': 'Lingua / Language',
    'settings.audio': 'Audio',
    'settings.soundEffects': 'Effetti Sonori',
    'settings.soundEffects.desc': 'Attiva suoni di feedback durante l\'interazione',
    'settings.volume': 'Volume',
    'settings.apply': 'Applica',
    'settings.close': 'Chiudi',
    
    // User Area
    'user.title': 'Area Personale',
    'user.login': 'Accedi per salvare i tuoi progressi',
    'user.email': 'Email',
    'user.password': 'Password',
    'user.loginBtn': 'Accedi',
    'user.or': 'oppure',
    'user.googleLogin': 'Accedi con Google',
    'user.githubLogin': 'Accedi con GitHub',
    'user.noAccount': 'Non hai un account?',
    'user.register': 'Registrati',
    'user.welcome': 'Benvenuto',
    'user.logout': 'Disconnetti',
    'user.stats': 'Statistiche',
    'user.gamesPlayed': 'Partite Giocate',
    'user.wins': 'Vittorie',
    'user.believerWins': 'Vittorie Believer',
    'user.fcWins': 'Vittorie Fact-Checker',
    'user.savedGames': 'Partite Salvate',
    'user.noSavedGames': 'Nessuna partita salvata',
    'user.saveGame': 'Salva Partita Corrente',
    'user.close': 'Chiudi'
  },
  
  en: {
    // Header
    'header.title': 'Information Spread Simulator',
    'header.achievements': 'Achievements',
    'header.nextDay': 'Next Day',
    'header.runAll': 'Complete Simulation',
    'header.settings': 'Settings',
    'header.userArea': 'User Area',
    
    // Sidebar - KPI
    'sidebar.kpi': 'Indicators',
    'sidebar.day': 'Day',
    'sidebar.believers': 'Believers',
    'sidebar.factCheckers': 'Fact-Checkers',
    'sidebar.susceptible': 'Susceptible',
    'sidebar.victory': 'Objective',
    'sidebar.turnsLeft': 'Turns Left',
    
    // Sidebar - Budget
    'sidebar.budget': 'Budget',
    'sidebar.recharge': 'Recharge in',
    'sidebar.turns': 'turns',
    
    // Sidebar - Buttons
    'sidebar.setMode': 'SET MODE',
    
    // Power-ups Believer
    'powerup.fakeBurst': 'Fake Burst',
    'powerup.fakeBurst.desc': 'Convert 4 S→B immediately',
    'powerup.payInfluencer': 'Pay Influencer',
    'powerup.payInfluencer.desc': '2 S→B per turn (4 turns)',
    'powerup.emergencyBeliever': 'EMERGENCY',
    'powerup.emergencyBeliever.desc': '10% FC→S + 3 S→B/turn (5 turns)',
    
    // Power-ups Fact-Checker
    'powerup.talkFriend': 'Talk to a Friend',
    'powerup.talkFriend.desc': 'Convert 1 random neighbor',
    'powerup.nationalDebunk': 'National Debunk',
    'powerup.nationalDebunk.desc': '2 B→FC per turn (4 turns)',
    'powerup.emergencyFC': 'EMERGENCY',
    'powerup.emergencyFC.desc': '10% B→S + 3 S→FC/turn (5 turns)',
    
    // Mode Selection
    'mode.title': 'Select Mode',
    'mode.explore': 'Exploration Mode',
    'mode.explore.desc': 'Observe information spread without intervention',
    'mode.strategic': 'Strategic Mode',
    'mode.strategic.desc': 'Manage resources and influence the network',
    'mode.chooseSide': 'Choose Your Side',
    'mode.chooseSide.desc': 'Become Believer or Fact-Checker and fight for victory',
    
    // Team Selection
    'team.title': 'Choose Your Team',
    'team.believer': 'Believer',
    'team.believer.desc': 'Spread fake news and convert the network',
    'team.factChecker': 'Fact-Checker',
    'team.factChecker.desc': 'Fight misinformation with truth',
    'team.confirm': 'Confirm Choice',
    
    // Game End Modal
    'gameEnd.victory': 'VICTORY!',
    'gameEnd.defeat': 'DEFEAT',
    'gameEnd.stats': 'Final Statistics',
    'gameEnd.believers': 'Believers',
    'gameEnd.factCheckers': 'Fact-Checkers',
    'gameEnd.turns': 'Turns Played',
    'gameEnd.budgetSpent': 'Budget Spent',
    'gameEnd.powerupsUsed': 'Power-ups Used',
    'gameEnd.newGame': 'New Game',
    
    // Settings
    'settings.title': 'Settings',
    'settings.accessibility': 'Accessibility',
    'settings.highContrast': 'High Contrast',
    'settings.highContrast.desc': 'Increase color contrast for better readability',
    'settings.largeText': 'Large Text',
    'settings.largeText.desc': 'Enlarge text throughout the application',
    'settings.reduceMotion': 'Reduce Motion',
    'settings.reduceMotion.desc': 'Reduce movement effects and transitions',
    'settings.colorblind': 'Colorblind Mode',
    'settings.colorblind.select': 'Select display mode',
    'settings.language': 'Language / Lingua',
    'settings.audio': 'Audio',
    'settings.soundEffects': 'Sound Effects',
    'settings.soundEffects.desc': 'Enable feedback sounds during interaction',
    'settings.volume': 'Volume',
    'settings.apply': 'Apply',
    'settings.close': 'Close',
    
    // User Area
    'user.title': 'User Area',
    'user.login': 'Login to save your progress',
    'user.email': 'Email',
    'user.password': 'Password',
    'user.loginBtn': 'Login',
    'user.or': 'or',
    'user.googleLogin': 'Login with Google',
    'user.githubLogin': 'Login with GitHub',
    'user.noAccount': 'Don\'t have an account?',
    'user.register': 'Register',
    'user.welcome': 'Welcome',
    'user.logout': 'Logout',
    'user.stats': 'Statistics',
    'user.gamesPlayed': 'Games Played',
    'user.wins': 'Wins',
    'user.believerWins': 'Believer Wins',
    'user.fcWins': 'Fact-Checker Wins',
    'user.savedGames': 'Saved Games',
    'user.noSavedGames': 'No saved games',
    'user.saveGame': 'Save Current Game',
    'user.close': 'Close'
  },
  
  fr: {
    // Header
    'header.title': 'Simulateur de Diffusion d\'Information',
    'header.achievements': 'Trophées',
    'header.nextDay': 'Jour Suivant',
    'header.runAll': 'Simulation Complète',
    'header.settings': 'Paramètres',
    'header.userArea': 'Espace Utilisateur',
    
    // Sidebar - KPI
    'sidebar.kpi': 'Indicateurs',
    'sidebar.day': 'Jour',
    'sidebar.believers': 'Believers',
    'sidebar.factCheckers': 'Fact-Checkers',
    'sidebar.susceptible': 'Susceptible',
    'sidebar.victory': 'Objectif',
    'sidebar.turnsLeft': 'Tours Restants',
    
    // Sidebar - Budget
    'sidebar.budget': 'Budget',
    'sidebar.recharge': 'Recharge dans',
    'sidebar.turns': 'tours',
    
    // Sidebar - Buttons
    'sidebar.setMode': 'CHOISIR MODE',
    
    // Power-ups Believer
    'powerup.fakeBurst': 'Fake Burst',
    'powerup.fakeBurst.desc': 'Convertir 4 S→B immédiatement',
    'powerup.payInfluencer': 'Payer Influenceur',
    'powerup.payInfluencer.desc': '2 S→B par tour (4 tours)',
    'powerup.emergencyBeliever': 'URGENCE',
    'powerup.emergencyBeliever.desc': '10% FC→S + 3 S→B/tour (5 tours)',
    
    // Power-ups Fact-Checker
    'powerup.talkFriend': 'Parler à un Ami',
    'powerup.talkFriend.desc': 'Convertir 1 voisin aléatoire',
    'powerup.nationalDebunk': 'Démenti National',
    'powerup.nationalDebunk.desc': '2 B→FC par tour (4 tours)',
    'powerup.emergencyFC': 'URGENCE',
    'powerup.emergencyFC.desc': '10% B→S + 3 S→FC/tour (5 tours)',
    
    // Mode Selection
    'mode.title': 'Sélectionner Mode',
    'mode.explore': 'Mode Exploration',
    'mode.explore.desc': 'Observer la diffusion sans intervention',
    'mode.strategic': 'Mode Stratégique',
    'mode.strategic.desc': 'Gérer les ressources et influencer le réseau',
    'mode.chooseSide': 'Choisir Son Camp',
    'mode.chooseSide.desc': 'Devenir Believer ou Fact-Checker et se battre pour la victoire',
    
    // Team Selection
    'team.title': 'Choisissez Votre Équipe',
    'team.believer': 'Believer',
    'team.believer.desc': 'Diffuser des fake news et convertir le réseau',
    'team.factChecker': 'Fact-Checker',
    'team.factChecker.desc': 'Combattre la désinformation avec la vérité',
    'team.confirm': 'Confirmer le Choix',
    
    // Game End Modal
    'gameEnd.victory': 'VICTOIRE!',
    'gameEnd.defeat': 'DÉFAITE',
    'gameEnd.stats': 'Statistiques Finales',
    'gameEnd.believers': 'Believers',
    'gameEnd.factCheckers': 'Fact-Checkers',
    'gameEnd.turns': 'Tours Joués',
    'gameEnd.budgetSpent': 'Budget Dépensé',
    'gameEnd.powerupsUsed': 'Power-ups Utilisés',
    'gameEnd.newGame': 'Nouvelle Partie',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.accessibility': 'Accessibilité',
    'settings.highContrast': 'Contraste Élevé',
    'settings.highContrast.desc': 'Augmenter le contraste des couleurs pour une meilleure lisibilité',
    'settings.largeText': 'Texte Grand',
    'settings.largeText.desc': 'Agrandir le texte dans toute l\'application',
    'settings.reduceMotion': 'Réduire Animations',
    'settings.reduceMotion.desc': 'Réduire les effets de mouvement et transitions',
    'settings.colorblind': 'Mode Daltonien',
    'settings.colorblind.select': 'Sélectionner le mode d\'affichage',
    'settings.language': 'Langue / Language',
    'settings.audio': 'Audio',
    'settings.soundEffects': 'Effets Sonores',
    'settings.soundEffects.desc': 'Activer les sons de feedback pendant l\'interaction',
    'settings.volume': 'Volume',
    'settings.apply': 'Appliquer',
    'settings.close': 'Fermer',
    
    // User Area
    'user.title': 'Espace Utilisateur',
    'user.login': 'Connectez-vous pour sauvegarder vos progrès',
    'user.email': 'Email',
    'user.password': 'Mot de passe',
    'user.loginBtn': 'Se connecter',
    'user.or': 'ou',
    'user.googleLogin': 'Se connecter avec Google',
    'user.githubLogin': 'Se connecter avec GitHub',
    'user.noAccount': 'Pas de compte?',
    'user.register': 'S\'inscrire',
    'user.welcome': 'Bienvenue',
    'user.logout': 'Déconnexion',
    'user.stats': 'Statistiques',
    'user.gamesPlayed': 'Parties Jouées',
    'user.wins': 'Victoires',
    'user.believerWins': 'Victoires Believer',
    'user.fcWins': 'Victoires Fact-Checker',
    'user.savedGames': 'Parties Sauvegardées',
    'user.noSavedGames': 'Aucune partie sauvegardée',
    'user.saveGame': 'Sauvegarder Partie Actuelle',
    'user.close': 'Fermer'
  },
  
  de: {
    // Header
    'header.title': 'Informationsverbreitungs-Simulator',
    'header.achievements': 'Erfolge',
    'header.nextDay': 'Nächster Tag',
    'header.runAll': 'Vollständige Simulation',
    'header.settings': 'Einstellungen',
    'header.userArea': 'Benutzerbereich',
    
    // Sidebar - KPI
    'sidebar.kpi': 'Indikatoren',
    'sidebar.day': 'Tag',
    'sidebar.believers': 'Believers',
    'sidebar.factCheckers': 'Fact-Checkers',
    'sidebar.susceptible': 'Anfällige',
    'sidebar.victory': 'Ziel',
    'sidebar.turnsLeft': 'Verbleibende Runden',
    
    // Sidebar - Budget
    'sidebar.budget': 'Budget',
    'sidebar.recharge': 'Aufladen in',
    'sidebar.turns': 'Runden',
    
    // Sidebar - Buttons
    'sidebar.setMode': 'MODUS WÄHLEN',
    
    // Power-ups Believer
    'powerup.fakeBurst': 'Fake Burst',
    'powerup.fakeBurst.desc': '4 S→B sofort konvertieren',
    'powerup.payInfluencer': 'Influencer Bezahlen',
    'powerup.payInfluencer.desc': '2 S→B pro Runde (4 Runden)',
    'powerup.emergencyBeliever': 'NOTFALL',
    'powerup.emergencyBeliever.desc': '10% FC→S + 3 S→B/Runde (5 Runden)',
    
    // Power-ups Fact-Checker
    'powerup.talkFriend': 'Mit Freund Sprechen',
    'powerup.talkFriend.desc': '1 zufälligen Nachbarn konvertieren',
    'powerup.nationalDebunk': 'Nationale Entlarvung',
    'powerup.nationalDebunk.desc': '2 B→FC pro Runde (4 Runden)',
    'powerup.emergencyFC': 'NOTFALL',
    'powerup.emergencyFC.desc': '10% B→S + 3 S→FC/Runde (5 Runden)',
    
    // Mode Selection
    'mode.title': 'Modus Auswählen',
    'mode.explore': 'Erkundungsmodus',
    'mode.explore.desc': 'Informationsverbreitung ohne Eingriff beobachten',
    'mode.strategic': 'Strategischer Modus',
    'mode.strategic.desc': 'Ressourcen verwalten und Netzwerk beeinflussen',
    'mode.chooseSide': 'Seite Wählen',
    'mode.chooseSide.desc': 'Believer oder Fact-Checker werden und für den Sieg kämpfen',
    
    // Team Selection
    'team.title': 'Wählen Sie Ihr Team',
    'team.believer': 'Believer',
    'team.believer.desc': 'Fake News verbreiten und das Netzwerk konvertieren',
    'team.factChecker': 'Fact-Checker',
    'team.factChecker.desc': 'Desinformation mit Wahrheit bekämpfen',
    'team.confirm': 'Auswahl Bestätigen',
    
    // Game End Modal
    'gameEnd.victory': 'SIEG!',
    'gameEnd.defeat': 'NIEDERLAGE',
    'gameEnd.stats': 'Endstatistiken',
    'gameEnd.believers': 'Believers',
    'gameEnd.factCheckers': 'Fact-Checkers',
    'gameEnd.turns': 'Gespielte Runden',
    'gameEnd.budgetSpent': 'Ausgegebenes Budget',
    'gameEnd.powerupsUsed': 'Verwendete Power-ups',
    'gameEnd.newGame': 'Neues Spiel',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.accessibility': 'Barrierefreiheit',
    'settings.highContrast': 'Hoher Kontrast',
    'settings.highContrast.desc': 'Farbkontrast für bessere Lesbarkeit erhöhen',
    'settings.largeText': 'Großer Text',
    'settings.largeText.desc': 'Text in der gesamten Anwendung vergrößern',
    'settings.reduceMotion': 'Animationen Reduzieren',
    'settings.reduceMotion.desc': 'Bewegungseffekte und Übergänge reduzieren',
    'settings.colorblind': 'Farbenblindheitsmodus',
    'settings.colorblind.select': 'Anzeigemodus auswählen',
    'settings.language': 'Sprache / Language',
    'settings.audio': 'Audio',
    'settings.soundEffects': 'Soundeffekte',
    'settings.soundEffects.desc': 'Feedback-Sounds während der Interaktion aktivieren',
    'settings.volume': 'Lautstärke',
    'settings.apply': 'Anwenden',
    'settings.close': 'Schließen',
    
    // User Area
    'user.title': 'Benutzerbereich',
    'user.login': 'Anmelden, um Ihren Fortschritt zu speichern',
    'user.email': 'E-Mail',
    'user.password': 'Passwort',
    'user.loginBtn': 'Anmelden',
    'user.or': 'oder',
    'user.googleLogin': 'Mit Google Anmelden',
    'user.githubLogin': 'Mit GitHub Anmelden',
    'user.noAccount': 'Kein Konto?',
    'user.register': 'Registrieren',
    'user.welcome': 'Willkommen',
    'user.logout': 'Abmelden',
    'user.stats': 'Statistiken',
    'user.gamesPlayed': 'Gespielte Spiele',
    'user.wins': 'Siege',
    'user.believerWins': 'Believer Siege',
    'user.fcWins': 'Fact-Checker Siege',
    'user.savedGames': 'Gespeicherte Spiele',
    'user.noSavedGames': 'Keine gespeicherten Spiele',
    'user.saveGame': 'Aktuelles Spiel Speichern',
    'user.close': 'Schließen'
  }
};

// Lingua corrente (default: italiano)
let currentLang = localStorage.getItem('language') || 'it';

// Funzione per ottenere una traduzione
function t(key) {
  return translations[currentLang][key] || translations['it'][key] || key;
}

// Funzione per cambiare lingua
function setLanguage(lang) {
  if (!translations[lang]) {
    console.error(`Lingua ${lang} non supportata`);
    return;
  }
  
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Aggiorna tutti gli elementi con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    
    // Se l'elemento è un input placeholder
    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.setAttribute('placeholder', translation);
    } 
    // Se l'elemento ha un title
    else if (el.hasAttribute('title') && el.getAttribute('data-i18n-attr') === 'title') {
      el.setAttribute('title', translation);
    }
    // Altrimenti aggiorna il textContent
    else {
      el.textContent = translation;
    }
  });
  
  // Traduzioni specifiche per elementi senza data-i18n (mantenendo emoji e formattazione)
  translateSpecificElements();
  
  // Aggiorna classe active sui pulsanti lingua
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  console.log(`✅ Lingua cambiata: ${lang}`);
}

// Funzione per tradurre elementi specifici che hanno emoji o formattazione complessa
function translateSpecificElements() {
  // SET MODE button
  const btnMode = document.getElementById('btnMode');
  if (btnMode) btnMode.textContent = t('sidebar.setMode');
  
  // Header buttons (mantieni emoji)
  const btnAchievements = document.getElementById('btnAchievements');
  if (btnAchievements) btnAchievements.innerHTML = `🏆 ${t('header.achievements')}`;
  
  const btnNext = document.getElementById('btnNext');
  if (btnNext) btnNext.innerHTML = `➡️ ${t('header.nextDay')}`;
  
  const btnRunAll = document.getElementById('btnRunAll');
  if (btnRunAll) btnRunAll.innerHTML = `⏩ ${t('header.runAll')}`;
  
  const btnSettings = document.getElementById('btnSettings');
  if (btnSettings) btnSettings.innerHTML = `⚙️ ${t('header.settings')}`;
  
  const btnUserArea = document.getElementById('btnUserArea');
  if (btnUserArea) btnUserArea.innerHTML = `👤 ${t('header.userArea')}`;
  
  // KPI sidebar labels - aggiorna solo le etichette, NON ricreare gli elementi strong
  const kpiSpans = document.querySelectorAll('.kpi span');
  if (kpiSpans[0]) {
    const label = kpiSpans[0].querySelector('span[data-i18n]');
    if (label) label.textContent = t('sidebar.believers');
  }
  if (kpiSpans[1]) {
    const label = kpiSpans[1].querySelector('span[data-i18n]');
    if (label) label.textContent = t('sidebar.factCheckers');
  }
  if (kpiSpans[2]) {
    const label = kpiSpans[2].querySelector('span[data-i18n]');
    if (label) label.textContent = t('sidebar.susceptible');
  }
  if (kpiSpans[3]) {
    const label = kpiSpans[3].querySelector('span[data-i18n]');
    if (label) label.textContent = t('sidebar.day');
  }
  
  // Budget panel
  translateElement('Budget Disponibile', t('sidebar.budget'));
  translateElement('Ricarica tra', t('sidebar.recharge'));
  
  // Power-up Believer titles (cerca e sostituisci il testo, mantieni emoji)
  const believerTitle = document.querySelector('#believerPowerups h4 span');
  if (believerTitle) believerTitle.textContent = `Power-up ${t('team.believer')}`;
  
  // Power-up Fact-Checker titles
  const fcTitle = document.querySelector('#factCheckerPowerups h4 span');
  if (fcTitle) fcTitle.textContent = `Power-up ${t('team.factChecker')}`;
  
  // Power-up buttons Believer
  const btnFakeBurst = document.getElementById('btnFakeBurst');
  if (btnFakeBurst) {
    const title = btnFakeBurst.querySelector('.powerup-title');
    const desc = btnFakeBurst.querySelector('.powerup-desc');
    if (title) title.textContent = t('powerup.fakeBurst');
    if (desc) desc.textContent = t('powerup.fakeBurst.desc');
  }
  
  const btnPayInfluencer = document.getElementById('btnPayInfluencer');
  if (btnPayInfluencer) {
    const title = btnPayInfluencer.querySelector('.powerup-title');
    const desc = btnPayInfluencer.querySelector('.powerup-desc');
    if (title) title.textContent = t('powerup.payInfluencer');
    if (desc) desc.textContent = t('powerup.payInfluencer.desc');
  }
  
  const btnEmergencyBeliever = document.getElementById('btnEmergencyBeliever');
  if (btnEmergencyBeliever) {
    const title = btnEmergencyBeliever.querySelector('.powerup-title');
    const desc = btnEmergencyBeliever.querySelector('.powerup-desc');
    if (title) title.textContent = t('powerup.emergencyBeliever');
    if (desc) desc.textContent = t('powerup.emergencyBeliever.desc');
  }
  
  // Power-up buttons Fact-Checker
  const btnTalkFriend = document.getElementById('btnTalkFriend');
  if (btnTalkFriend) {
    const title = btnTalkFriend.querySelector('.powerup-title');
    const desc = btnTalkFriend.querySelector('.powerup-desc');
    if (title) title.textContent = t('powerup.talkFriend');
    if (desc) desc.textContent = t('powerup.talkFriend.desc');
  }
  
  const btnNationalDebunk = document.getElementById('btnNationalDebunk');
  if (btnNationalDebunk) {
    const title = btnNationalDebunk.querySelector('.powerup-title');
    const desc = btnNationalDebunk.querySelector('.powerup-desc');
    if (title) title.textContent = t('powerup.nationalDebunk');
    if (desc) desc.textContent = t('powerup.nationalDebunk.desc');
  }
  
  const btnEmergencyFC = document.getElementById('btnEmergencyFC');
  if (btnEmergencyFC) {
    const title = btnEmergencyFC.querySelector('.powerup-title');
    const desc = btnEmergencyFC.querySelector('.powerup-desc');
    if (title) title.textContent = t('powerup.emergencyFC');
    if (desc) desc.textContent = t('powerup.emergencyFC.desc');
  }
  
  // Settings Modal
  const settingsTitle = document.querySelector('#settingsModal h3');
  if (settingsTitle) settingsTitle.innerHTML = `⚙️ ${t('settings.title')}`;
  
  translateElement('Accessibilità', t('settings.accessibility'));
  translateElement('Alto Contrasto', t('settings.highContrast'));
  translateElement('Aumenta il contrasto dei colori per una migliore leggibilità', t('settings.highContrast.desc'));
  translateElement('Testo Grande', t('settings.largeText'));
  translateElement('Ingrandisce il testo in tutta l\'applicazione', t('settings.largeText.desc'));
  translateElement('Riduci Animazioni', t('settings.reduceMotion'));
  translateElement('Riduce gli effetti di movimento e transizioni', t('settings.reduceMotion.desc'));
  translateElement('Modalità Daltonismo', t('settings.colorblind'));
  translateElement('Seleziona la modalità di visualizzazione', t('settings.colorblind.select'));
  translateElement('Audio', t('settings.audio'));
  translateElement('Effetti Sonori', t('settings.soundEffects'));
  translateElement('Attiva suoni di feedback durante l\'interazione', t('settings.soundEffects.desc'));
  translateElement('Volume', t('settings.volume'));
  
  const settingsApply = document.getElementById('settingsApply');
  if (settingsApply) settingsApply.textContent = t('settings.apply');
  
  // User Area Modal
  const userAreaTitle = document.querySelector('#userAreaModal h3');
  if (userAreaTitle) userAreaTitle.innerHTML = `👤 ${t('user.title')}`;
  
  const loginSection = document.querySelector('#loginSection h4');
  if (loginSection) loginSection.textContent = t('user.login');
  
  const loginEmail = document.getElementById('loginEmail');
  if (loginEmail) loginEmail.placeholder = t('user.email');
  
  const loginPassword = document.getElementById('loginPassword');
  if (loginPassword) loginPassword.placeholder = t('user.password');
  
  const btnLogin = document.getElementById('btnLogin');
  if (btnLogin) btnLogin.textContent = t('user.loginBtn');
  
  translateElement('oppure', t('user.or'));
  
  const btnGoogleLogin = document.getElementById('btnGoogleLogin');
  if (btnGoogleLogin) {
    const text = btnGoogleLogin.childNodes[2];
    if (text) text.textContent = t('user.googleLogin');
  }
  
  const btnGithubLogin = document.getElementById('btnGithubLogin');
  if (btnGithubLogin) {
    const text = btnGithubLogin.childNodes[2];
    if (text) text.textContent = t('user.githubLogin');
  }
  
  translateElement('Non hai un account?', t('user.noAccount'));
  
  const linkRegister = document.getElementById('linkRegister');
  if (linkRegister) linkRegister.textContent = t('user.register');
  
  translateElement('Benvenuto,', t('user.welcome'));
  
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) btnLogout.textContent = t('user.logout');
  
  translateElement('Statistiche', t('user.stats'));
  translateElement('Partite Giocate', t('user.gamesPlayed'));
  translateElement('Vittorie', t('user.wins'));
  translateElement('Vittorie Believer', t('user.believerWins'));
  translateElement('Vittorie Fact-Checker', t('user.fcWins'));
  translateElement('Partite Salvate', t('user.savedGames'));
  translateElement('Nessuna partita salvata', t('user.noSavedGames'));
  
  const btnSaveCurrentGame = document.getElementById('btnSaveCurrentGame');
  if (btnSaveCurrentGame) btnSaveCurrentGame.innerHTML = `💾 ${t('user.saveGame')}`;
  
  const userAreaClose = document.getElementById('userAreaClose');
  if (userAreaClose) userAreaClose.textContent = t('user.close');
  
  // Legenda (cerca tutte le label nella sidebar)
  const legendItems = document.querySelectorAll('.legend-item');
  legendItems.forEach(item => {
    const text = item.textContent.trim();
    if (text.includes('Believer')) {
      item.innerHTML = item.innerHTML.replace('Believer', t('sidebar.believers'));
    }
    if (text.includes('Fact-Checker')) {
      item.innerHTML = item.innerHTML.replace('Fact-Checker', t('sidebar.factCheckers'));
    }
    if (text.includes('Susceptible')) {
      item.innerHTML = item.innerHTML.replace('Susceptible', t('sidebar.susceptible'));
    }
  });
}

// Helper function per tradurre testo in modo sicuro
function translateElement(oldText, newText) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const nodesToReplace = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.nodeValue.trim() === oldText) {
      nodesToReplace.push(node);
    }
  }
  
  nodesToReplace.forEach(node => {
    node.nodeValue = node.nodeValue.replace(oldText, newText);
  });
}

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  // Rileva lingua del browser se è la prima volta
  if (!localStorage.getItem('language')) {
    const browserLang = navigator.language.split('-')[0]; // es: 'it' da 'it-IT'
    if (translations[browserLang]) {
      currentLang = browserLang;
      localStorage.setItem('language', browserLang);
    }
  }
  
  // Applica la lingua iniziale
  setLanguage(currentLang);
  
  // Event listeners per i pulsanti lingua
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      if (typeof showToast === 'function') {
        showToast(`🌍 ${btn.textContent.trim()}`);
      }
    });
  });
  
  // Traduci elementi comuni senza data-i18n
  translateCommonElements();
});

// Funzione per tradurre elementi comuni che non hanno data-i18n
function translateCommonElements() {
  // Traduci "SET MODE" button
  const btnMode = document.getElementById('btnMode');
  if (btnMode && btnMode.textContent.includes('SET MODE')) {
    btnMode.textContent = t('sidebar.setMode');
  }
  
  // Aggiorna traduzioni dinamiche ogni volta che cambia lingua
  window.updateDynamicTranslations = function() {
    // Budget labels
    const budgetLabels = document.querySelectorAll('[data-translate="budget"]');
    budgetLabels.forEach(el => el.textContent = t('sidebar.budget'));
    
    // Ricarica labels  
    const rechargeLabels = document.querySelectorAll('[data-translate="recharge"]');
    rechargeLabels.forEach(el => el.textContent = t('sidebar.recharge'));
    
    // Altri elementi dinamici possono essere aggiunti qui
  };
}

