import React from 'react';

const MOODS = ['😄', '😊', '😐', '😔', '😠'];

// Il reçoit 'onMoodSelect' en "prop"
function MoodSelector({ onMoodSelect }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Comment te sens-tu aujourd'hui ?</h2>
      
      <div>
        {MOODS.map((moodEmoji) => (
          <span
            key={moodEmoji}
            style={{
              fontSize: '3rem',
              margin: '10px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '10px',
              // Simple effet au survol
              transition: 'transform 0.2s',
            }}
            // Au survol, l'émoji grossit un peu
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            // Au clic, on appelle la fonction du parent (App.jsx)
            onClick={() => onMoodSelect(moodEmoji)}
          >
            {moodEmoji}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;