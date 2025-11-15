import React, { useState, useEffect } from 'react';
import MoodSelector from './screens/MoodSelector';
import EmojiChat from './screens/EmojiChat';
import JournalHistory from './screens/JournalHistory';
import JournalDetail from './screens/JournalDetail';
import SplashScreen from './screens/SplashScreen'; // ✅ 1. Import ajouté
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('history');
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showSplash, setShowSplash] = useState(true); // ✅ 2. Nouvel état

  // ✅ 3. useEffect modifié pour gérer le Splash Screen
  useEffect(() => {
    // On lance un timer de 3 secondes
    const splashTimer = setTimeout(() => {
      setShowSplash(false); // Après 3s, on cache le splash screen
    }, 4000); // 3000ms = 3 secondes

    // Chargement des données (inchangé)
    const savedEntries = localStorage.getItem('emojiJournalEntries');
    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries));
    }

    // Nettoyage du timer (bonne pratique)
    return () => clearTimeout(splashTimer);
  }, []); // Le tableau vide [] signifie "juste au démarrage"

  useEffect(() => {
    localStorage.setItem('emojiJournalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    setCurrentView('chat');
  };

  const handleChatSave = (mood, chatHistory) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: mood,
      chat: chatHistory
    };
    setJournalEntries([newEntry, ...journalEntries]);
    setCurrentView('history');
    setCurrentMood(null);
  };

  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setSelectedEntry(null);
    setCurrentView('history');
  };

  const renderView = () => {
    // ✅ 4. Affichage prioritaire du Splash Screen
    if (showSplash) {
      return <SplashScreen />;
    }

    // --- Le reste de l'application (inchangé) ---
    if (currentView === 'mood') {
      return <MoodSelector onMoodSelect={handleMoodSelect} />;
    }

    if (currentView === 'chat') {
      return <EmojiChat mood={currentMood} onSave={handleChatSave} />;
    }

    if (currentView === 'detail' && selectedEntry) {
      return <JournalDetail entry={selectedEntry} onBack={handleBack} />;
    }

    return (
      <JournalHistory
        entries={journalEntries}
        onNewEntry={() => setCurrentView('mood')}
        onEntrySelect={handleEntrySelect}
      />
    );
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;