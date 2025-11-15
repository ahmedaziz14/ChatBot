import React from 'react';

// ✅ Il doit recevoir 'entries', 'onNewEntry', ET 'onEntrySelect'
function JournalHistory({ entries, onNewEntry, onEntrySelect }) {

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Mon Journal Émoji</h1>
      
      {/* --- C'EST CE BOUTON --- */}
      {/* Il se trouve bien ici, dans JournalHistory.jsx */}
      <button 
        onClick={onNewEntry} // Appelle la fonction de App.jsx
        style={{
          display: 'block',
          width: '100%',
          padding: '15px',
          fontSize: '1.2rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        + Nouvelle Entrée
      </button>

      <h3>Historique :</h3>
      {entries.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Aucune entrée pour le moment.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map(entry => (
            // On rend l'entrée cliquable
            <li 
              key={entry.id} 
              onClick={() => onEntrySelect(entry)} // Appelle la fonction de App.jsx
              style={{
                background: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              <span style={{ fontSize: '2rem' }}>{entry.mood}</span>
              <strong style={{ marginLeft: '10px', fontSize: '1.1rem' }}>
                {formatDate(entry.date)}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JournalHistory;