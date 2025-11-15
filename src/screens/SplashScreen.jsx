import React from 'react';
import Lottie from 'lottie-react';
// Assure-toi que ce chemin pointe vers ton animation Lottie
// (ex: '/lottie/emoji_loader.json')
import animationData from '../../public/lottifile/mood.json'; 

function SplashScreen() {
  return (
    <div style={{
      // ✅ Modifications pour couvrir tout l'écran
      position: 'fixed', // Se positionne par rapport à la fenêtre
      top: 0,
      left: 0,
      width: '100%',  // Occupe toute la largeur
      height: '100%', // Occupe toute la hauteur
      
      // Styles pour centrer l'animation (comme avant)
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
      
      // S'assure qu'il est au-dessus de tout autre contenu
      zIndex: 9999 
    }}>
      <Lottie 
        animationData={animationData} 
        loop={false} 
        autoplay={true} 
        style={{ width: 300, height: 300 }} 
      />
    </div>
  );
}

export default SplashScreen;