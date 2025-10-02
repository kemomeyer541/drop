import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function DailyReward() {
  const [dailyReward, setDailyReward] = useState(false);
  const [userStreak, setUserStreak] = useState(7);
  const [showTrophyAnimation, setShowTrophyAnimation] = useState(false);

  // console.log('DailyReward component rendered, dailyReward:', dailyReward);

  const claimDailyReward = () => {
    // Show trophy animation
    setShowTrophyAnimation(true);
    
    // Hide the reward card
    setDailyReward(true);
    setUserStreak(prev => prev + 1);
    
    // Hide trophy animation after 4 seconds
    setTimeout(() => {
      setShowTrophyAnimation(false);
    }, 4000);
  };

  // Show trophy animation overlay
  if (showTrophyAnimation) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center" style={{ zIndex: 999999 }}>
        {/* Main Trophy */}
        <div className="relative">
          {/* Glow effect behind trophy */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              fontSize: '200px',
              filter: 'blur(60px)',
              color: '#f59e0b',
              animation: 'glowPulse 2s ease-in-out infinite'
            }}
          >
            🏆
          </div>
          
          {/* Trophy */}
          <div 
            className="relative"
            style={{
              fontSize: '200px',
              animation: 'trophyEpic 1.5s ease-out',
              filter: 'drop-shadow(0 0 80px #f59e0b) drop-shadow(0 0 160px #f59e0b)',
              textShadow: '0 0 50px #f59e0b, 0 0 100px #f59e0b'
            }}
          >
            🏆
          </div>
          
          {/* Success text */}
          <div 
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-yellow-400 text-center"
            style={{
              animation: 'textSlideUp 1s ease-out 0.5s both',
              textShadow: '0 0 30px #f59e0b, 2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            +50⭐ Welcome Bonus!
          </div>
        </div>
        
        <style>{`
          @keyframes trophyEpic {
            0% { 
              transform: scale(0) rotate(0deg); 
              opacity: 0; 
            }
            20% { 
              transform: scale(1.8) rotate(90deg); 
              opacity: 0.9; 
            }
            40% { 
              transform: scale(0.7) rotate(180deg); 
              opacity: 1; 
            }
            60% { 
              transform: scale(1.4) rotate(270deg); 
              opacity: 1; 
            }
            80% { 
              transform: scale(0.8) rotate(360deg); 
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
              transform: translateX(-50%) translateY(80px); 
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

  // Don't show the reward card if it's been claimed
  if (dailyReward) return null;

  return (
    <div className="fixed top-4 right-4 z-[99999] pointer-events-auto animate-float">
      <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-3 max-w-sm shadow-lg hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-xl">🎁</div>
            <div>
              <h3 className="font-bold text-yellow-400 text-sm">Welcome!</h3>
              <p className="text-xs text-gray-300">Welcome to the Drop Source Beta!</p>
            </div>
          </div>
          <Button
            onClick={claimDailyReward}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xs px-3 py-1 h-auto"
          >
            +50⭐
          </Button>
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
