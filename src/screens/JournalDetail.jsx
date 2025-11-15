import React from 'react';

// Fonction pour formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function JournalDetail({ entry, onBack }) {
  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <button
        onClick={onBack} // Appelle la fonction pour revenir en arrière
        style={{
          background: '#6c757d', // Gris
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        ⬅️ Retour à l'historique
      </button>

      {/* En-tête de l'entrée */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '3rem' }}>{entry.mood}</span>
        <h2 style={{ margin: '5px 0' }}>{formatDate(entry.date)}</h2>
      </div>

      {/* Copie de la zone de chat (similaire à EmojiChat) */}
      <div style={{
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        overflowY: 'auto',
        background: '#f9f9f9',
      }}>
        {entry.chat.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            margin: '5px 0'
          }}>
            <span style={{
              background: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'inline-block',
              maxWidth: '80%',
              wordWrap: "break-word"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JournalDetail;