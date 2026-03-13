// @Isanchezv
// src/components/CelebrateButton.tsx
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

interface Props {
  label: string;
}

export default function CelebrateButton({ label }: Props) {
  const [isCelebrated, setIsCelebrated] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCelebrate = () => {
    setIsCelebrated(true);
    setTimeout(() => setIsCelebrated(false), 5000);
  };

  return (
    <>
      {isCelebrated && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={['#fbbf24', '#3b82f6', '#ffffff', '#22c55e']}
          style={{ position: 'fixed', zIndex: 1000, top: 0, left: 0, pointerEvents: 'none' }}
        />
      )}
      <button 
        onClick={handleCelebrate}
        className="bg-white text-black px-10 py-4 rounded-full font-black uppercase italic text-xs hover:bg-yellow-400 hover:scale-105 transition-all shadow-2xl active:scale-95 border-b-4 border-gray-200 active:border-b-0"
      >
        {label}
      </button>
    </>
  );
}