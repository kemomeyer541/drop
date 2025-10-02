import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AchievementBadgeProps {
  title: string;
  description: string;
  emoji: string;
  reward: string;
  onClaim: () => void;
  onClose: () => void;
  stackIndex?: number;
  position?: 'top-right' | 'top-left';
}

export function AchievementBadge({ title, description, emoji, reward, onClaim, onClose, stackIndex = 0, position = 'top-right' }: AchievementBadgeProps) {
  const [claimed, setClaimed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    setShowAnimation(true);
    onClaim();
    
    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowAnimation(false);
      onClose();
    }, 3000);
  };

  // Show celebration animation
  if (showAnimation) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center" style={{ zIndex: 999999 }}>
        <div className="relative">
          {/* Glow effect behind emoji */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              fontSize: '150px',
              filter: 'blur(40px)',
              color: '#f59e0b',
              animation: 'glowPulse 1s ease-in-out infinite'
            }}
          >
            {emoji}
          </div>
          
          {/* Main emoji */}
          <div 
            className="relative"
            style={{
              fontSize: '150px',
              animation: 'achievementPop 1s ease-out',
              filter: 'drop-shadow(0 0 60px #f59e0b)',
              textShadow: '0 0 40px #f59e0b'
            }}
          >
            {emoji}
          </div>
          
          {/* Success text */}
          <div 
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-yellow-400 text-center"
            style={{
              animation: 'textSlideUp 0.8s ease-out 0.3s both',
              textShadow: '0 0 20px #f59e0b, 2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {reward}
          </div>
        </div>
        
        <style>{`
          @keyframes achievementPop {
            0% { 
              transform: scale(0) rotate(0deg); 
              opacity: 0; 
            }
            50% { 
              transform: scale(1.3) rotate(180deg); 
              opacity: 1; 
            }
            100% { 
              transform: scale(1) rotate(360deg); 
              opacity: 1; 
            }
          }
          
          @keyframes glowPulse {
            0%, 100% { 
              opacity: 0.6; 
              transform: scale(1);
            }
            50% { 
              opacity: 0.9; 
              transform: scale(1.1);
            }
          }
          
          @keyframes textSlideUp {
            0% { 
              transform: translateX(-50%) translateY(60px); 
              opacity: 0; 
            }
            100% { 
              transform: translateX(-50%) translateY(0); 
              opacity: 1; 
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className={`fixed z-[99999] pointer-events-auto animate-float ${
        position === 'top-right' ? 'top-4 right-4' : 'top-4 left-4'
      }`}
      style={{ 
        transform: `translateY(${stackIndex * 120}px)`,
        zIndex: 99999 - stackIndex
      }}
    >
      <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-4 max-w-sm shadow-lg hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{emoji}</div>
            <div>
              <h3 className="font-bold text-yellow-400 text-sm">{title}</h3>
              <p className="text-xs text-gray-300">{description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleClaim}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xs px-3 py-1 h-auto"
            >
              {reward}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              ✕
            </Button>
          </div>
        </div>
      </Card>
      
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-4px) rotate(0.5deg); 
          }
          50% { 
            transform: translateY(-2px) rotate(0deg); 
          }
          75% { 
            transform: translateY(-6px) rotate(-0.5deg); 
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
