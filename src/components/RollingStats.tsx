import React, { useState, useEffect } from 'react';

interface StatItem {
  label: string;
  value: number;
  isOnline?: boolean;
}

export function RollingStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Creators', value: 12847 },
    { label: 'Drops', value: 45692 },
    { label: 'Stickers Created', value: 89431 },
    { label: 'Users Online', value: 342, isOnline: true }
  ]);

  const [flashingIndex, setFlashingIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly choose which stat to update (20% chance per tick)
      if (Math.random() < 0.2) {
        const randomIndex = Math.floor(Math.random() * stats.length);
        setFlashingIndex(randomIndex);
        
        // Flash effect duration
        setTimeout(() => {
          setFlashingIndex(null);
          
          // Update the stat value after flash
          setStats(prev => prev.map((stat, index) => {
            if (index === randomIndex) {
              let newValue;
              if (stat.isOnline) {
                // Users online can go up or down by 1-5
                const change = Math.floor(Math.random() * 5) + 1;
                const direction = Math.random() < 0.6 ? 1 : -1; // 60% chance to go up
                newValue = Math.max(1, stat.value + (change * direction));
              } else {
                // Other stats only increase by 1-3
                const increase = Math.floor(Math.random() * 3) + 1;
                newValue = stat.value + increase;
              }
              return { ...stat, value: newValue };
            }
            return stat;
          }));
        }, 300); // Flash duration
      }
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div 
      className="flex justify-center gap-8"
      style={{ 
        marginTop: '20px',
        marginBottom: '20px'
      }}
    >
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="text-center relative"
          style={{
            transition: 'all 300ms ease-out',
            transform: flashingIndex === index ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <div 
            className="flex items-center justify-center gap-2 mb-1"
            style={{
              color: flashingIndex === index ? '#5BE9E9' : 'rgba(255, 255, 255, 0.9)',
              textShadow: flashingIndex === index ? '0 0 10px #5BE9E9' : 'none',
              transition: 'all 300ms ease-out'
            }}
          >
            <span 
              style={{ 
                fontFamily: 'Inter',
                fontWeight: '700',
                fontSize: '18px',
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums' // Ensures numbers align properly during changes
              }}
            >
              {stat.value.toLocaleString()}
            </span>
            {stat.isOnline && (
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#22C55E',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                  animation: 'pulse 2s infinite'
                }}
              />
            )}
          </div>
          <div 
            style={{ 
              fontFamily: 'Inter',
              fontWeight: '400',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}