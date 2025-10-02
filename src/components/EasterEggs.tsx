import React, { useState, useEffect } from 'react';

interface EasterEggProps {
  children: React.ReactNode;
}

export function EasterEggs({ children }: EasterEggProps) {
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [hoverCount, setHoverCount] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [showTimeSecret, setShowTimeSecret] = useState(false);

  // Konami Code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
      
      setKonamiCode(prev => {
        const newSequence = [...prev, e.code].slice(-10);
        if (JSON.stringify(newSequence) === JSON.stringify(konamiSequence)) {
          // Konami code activated!
          console.log('Konami code activated! Setting localStorage...');
          localStorage.setItem('konami_code_unlocked', 'true');
          setShowSecretMessage(true);
          setTimeout(() => setShowSecretMessage(false), 5000);
          return [];
        }
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click sequence detection
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      setClickSequence(prev => {
        const recentClicks = prev.filter(time => now - time < 2000);
        const newSequence = [...recentClicks, now];
        
        if (newSequence.length >= 5) {
          // Rapid clicking detected!
          console.log('Rapid clicking detected! Setting localStorage...');
          localStorage.setItem('rapid_click_unlocked', 'true');
          setShowSecretMessage(true);
          setTimeout(() => setShowSecretMessage(false), 3000);
          return [];
        }
        return newSequence;
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Time-based secret
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      // Special at 3:33 AM/PM
      if ((hour === 3 || hour === 15) && minute === 33) {
        localStorage.setItem('time_secret_unlocked', 'true');
        setShowTimeSecret(true);
        setTimeout(() => setShowTimeSecret(false), 10000);
      }
    };

    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {children}
      
      {/* Secret Messages */}
      {showSecretMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-2xl z-50 animate-bounce">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold">Secret Discovered!</div>
            <div className="text-sm opacity-90">You found an easter egg!</div>
          </div>
        </div>
      )}
      
      {showTimeSecret && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-4 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕐</span>
            <div>
              <div className="font-bold">Time Secret!</div>
              <div className="text-sm">You're here at the magic hour!</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden hover counter */}
      <div 
        className="fixed bottom-4 left-4 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        onMouseEnter={() => {
          setHoverCount(prev => {
            const newCount = prev + 1;
            if (newCount === 10) {
              localStorage.setItem('hover_master_unlocked', 'true');
              setShowSecretMessage(true);
              setTimeout(() => setShowSecretMessage(false), 2000);
              return 0;
            }
            return newCount;
          });
        }}
      >
        <div className="text-xs text-gray-500">Hover me 10 times...</div>
      </div>
      
      {/* Scroll reveal */}
      <div 
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300"
        onMouseEnter={() => {
          if (window.scrollY > window.innerHeight * 2) {
            setShowSecretMessage(true);
            setTimeout(() => setShowSecretMessage(false), 2000);
          }
        }}
      >
        <div className="text-xs text-gray-500 mb-2">Scroll secrets await...</div>
      </div>
    </div>
  );
}

export function SecretButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [clickCount, setClickCount] = useState(0);
  
  const handleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 7) {
        onClick();
        return 0;
      }
      return newCount;
    });
  };
  
  return (
    <button 
      onClick={handleClick}
      className="transition-all duration-300 hover:scale-105"
    >
      {children}
    </button>
  );
}

export function HiddenAchievement({ trigger, children }: { trigger: boolean; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (trigger && !show) {
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }
  }, [trigger, show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-6 rounded-lg shadow-2xl z-50 animate-bounce">
      <div className="text-center">
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-xl font-bold">Hidden Achievement!</div>
        <div className="text-sm opacity-90">You've unlocked a secret!</div>
      </div>
    </div>
  );
}