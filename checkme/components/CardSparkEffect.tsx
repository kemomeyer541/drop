import React, { useEffect, useState } from 'react';

interface CardSparkEffectProps {
  isVisible: boolean;
  className?: string;
}

export function CardSparkEffect({ isVisible, className }: CardSparkEffectProps) {
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number; side: string; drift: number }>>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setSparks([]);
      return;
    }

    const interval = setInterval(() => {
      // Create new spark
      const sides = ['left', 'right', 'top', 'bottom'];
      const side = sides[Math.floor(Math.random() * sides.length)];
      
      let x, y;
      switch (side) {
        case 'left':
          x = 0;
          y = Math.random() * 100;
          break;
        case 'right':
          x = 100;
          y = Math.random() * 100;
          break;
        case 'top':
          x = Math.random() * 100;
          y = 0;
          break;
        case 'bottom':
          x = Math.random() * 100;
          y = 100;
          break;
        default:
          x = 50;
          y = 50;
      }

      const newSpark = {
        id: nextId,
        x,
        y,
        side,
        drift: (Math.random() - 0.5) * 20 // -10px to +10px horizontal drift
      };

      setSparks(prev => [...prev, newSpark]);
      setNextId(prev => prev + 1);

      // Remove spark after animation completes
      setTimeout(() => {
        setSparks(prev => prev.filter(spark => spark.id !== newSpark.id));
      }, 1200);
    }, 200); // Create new spark every 200ms

    return () => clearInterval(interval);
  }, [isVisible, nextId]);

  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            background: 'linear-gradient(45deg, #63B3FF 0%, #A987FC 100%)', // DropSource gradient colors
            boxShadow: '0 0 4px rgba(99, 179, 255, 0.8), 0 0 8px rgba(169, 135, 252, 0.4)', // Updated shadow colors
            animation: 'spark-fall 1.2s ease-out forwards',
            '--spark-drift': `${spark.drift}px`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}