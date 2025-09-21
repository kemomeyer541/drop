import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface SparkleLayerProps {
  count?: number;
  containerWidth?: number;
  containerHeight?: number;
  className?: string;
}

export function SparkleLayer({ 
  count = 8, 
  containerWidth = 420, 
  containerHeight = 600,
  className = ""
}: SparkleLayerProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      
      for (let i = 0; i < count; i++) {
        // Position sparkles around the edges
        const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;
        
        switch (edge) {
          case 0: // top edge
            x = Math.random() * containerWidth;
            y = Math.random() * 40;
            break;
          case 1: // right edge
            x = containerWidth - Math.random() * 40;
            y = Math.random() * containerHeight;
            break;
          case 2: // bottom edge
            x = Math.random() * containerWidth;
            y = containerHeight - Math.random() * 40;
            break;
          case 3: // left edge
            x = Math.random() * 40;
            y = Math.random() * containerHeight;
            break;
          default:
            x = Math.random() * containerWidth;
            y = Math.random() * containerHeight;
        }
        
        newSparkles.push({
          id: i,
          x,
          y,
          size: Math.random() * 4 + 2, // 2-6px
          delay: Math.random() * 2000 // 0-2s delay
        });
      }
      
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, [count, containerWidth, containerHeight]);

  // DropSource brand colors array
  const brandColors = [
    '#00F5D4', // Accent teal
    '#A78BFA', // Accent lavender
    '#FFD700', // Gold
    '#5AF5D0', // Mint
    '#00AEEF', // Brand blue
    '#8F63FF'  // Brand purple
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((sparkle, index) => {
        const color = brandColors[index % brandColors.length];
        return (
          <div
            key={sparkle.id}
            className="absolute rounded-full sparkle-pulse"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: color,
              opacity: 0.8,
              mixBlendMode: 'screen',
              animationDelay: `${sparkle.delay}ms`,
              animationDuration: '2000ms',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
              boxShadow: `0 0 ${sparkle.size * 2}px ${color}40`
            }}
          />
        );
      })}
      
      <style>{`
        @keyframes sparkle-pulse {
          0%, 100% { 
            opacity: 0;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
        
        .sparkle-pulse {
          animation-name: sparkle-pulse;
        }
      `}</style>
    </div>
  );
}