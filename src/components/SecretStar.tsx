import React, { useState } from 'react';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface SecretStarProps {
  onFound: () => void;
}

export function SecretStar({ onFound }: SecretStarProps) {
  const [isFound, setIsFound] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const handleClick = () => {
    if (isFound) return;
    
    setIsFound(true);
    setShowReward(true);
    onFound();

    // Hide the reward popup after 3 seconds and reset for next discovery
    setTimeout(() => {
      setShowReward(false);
      setTimeout(() => {
        setIsFound(false);
      }, 1000);
    }, 3000);
  };

  const handleAccept = () => {
    setShowReward(false);
    // Add puking cat sticker to backpack (in a real app)
    console.log('Added puking cat sticker to backpack!');
    
    setTimeout(() => {
      setIsFound(false);
    }, 1000);
  };

  return (
    <>
      {/* Secret Star Icon - positioned absolutely in bottom left corner */}
      <div 
        className={`fixed bottom-4 left-4 transition-all duration-300 ${
          isFound ? 'opacity-50 cursor-not-allowed' : 'opacity-70 hover:opacity-100 cursor-pointer hover:scale-110'
        }`}
        onClick={handleClick}
        style={{
          zIndex: 1000,
          transform: isFound ? 'scale(0.8)' : 'scale(1)',
        }}
      >
        <div className={`relative ${!isFound ? 'hover:dropsource-glow-cyan animate-pulse' : ''}`}>
          <Star 
            className={`w-6 h-6 ${
              isFound ? 'text-gray-500' : 'text-yellow-400'
            } transition-colors duration-300`}
            fill={isFound ? 'currentColor' : 'none'}
          />
          {!isFound && (
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-full animate-ping" />
          )}
        </div>
      </div>

      {/* Reward Popup */}
      {showReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001]">
          <div className="dropsource-floating-card rounded-lg p-6 w-80 text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold dropsource-text-primary mb-2">
                ⭐ You found a Secret Prize Star!
              </h3>
              <p className="dropsource-text-secondary text-sm mb-4">
                Congratulations! You discovered our hidden easter egg.
              </p>
              
              {/* Reward Preview */}
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <div className="text-2xl mb-1">🤮</div>
                <div className="text-sm dropsource-text-primary font-medium">Puking Cat Sticker</div>
                <div className="text-xs dropsource-text-secondary">Added to your backpack</div>
              </div>
            </div>

            <Button
              onClick={handleAccept}
              className="w-full dropsource-gradient text-white"
            >
              Accept Reward
            </Button>
          </div>
        </div>
      )}
    </>
  );
}