import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  blur: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
}

export function BackgroundParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [activeStars, setActiveStars] = useState(0);

  useEffect(() => {
    // Generate static background particles
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = 80; // Subtle amount
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // Percentage
          y: Math.random() * 100, // Percentage
          size: Math.random() * 2 + 1, // 1-3px
          blur: Math.random() * 2 + 0.5 // 0.5-2.5px blur for depth
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  useEffect(() => {
    // Generate shooting stars at random intervals
    const createShootingStar = () => {
      if (activeStars >= 2) return; // Max 2 at a time
      
      const id = Date.now() + Math.random();
      const duration = Math.random() * 2000 + 3000; // 3-5s
      
      const newStar: ShootingStar = {
        id,
        startX: Math.random() * 20 - 10, // Start slightly offscreen top-left
        startY: Math.random() * 20 - 10,
        endX: Math.random() * 20 + 90, // End slightly offscreen bottom-right
        endY: Math.random() * 20 + 90,
        duration,
        delay: 0
      };
      
      setShootingStars(prev => [...prev, newStar]);
      setActiveStars(prev => prev + 1);
      
      // Remove star after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
        setActiveStars(prev => prev - 1);
      }, duration + 500);
    };

    const scheduleNextStar = () => {
      const delay = Math.random() * 10000 + 10000; // 10-20s intervals
      setTimeout(() => {
        createShootingStar();
        scheduleNextStar();
      }, delay);
    };

    // Start the cycle
    scheduleNextStar();
  }, [activeStars]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 0.3,
            filter: `blur(${particle.blur}px)`,
            mixBlendMode: 'screen'
          }}
        />
      ))}
      
      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
            animation: `shootingStar ${star.duration}ms linear`,
            '--deltaX': `${star.endX - star.startX}vw`,
            '--deltaY': `${star.endY - star.startY}vh`,
            borderRadius: '1px',
            pointerEvents: 'none'
          } as React.CSSProperties & {
            '--deltaX': string;
            '--deltaY': string;
          }}
        />
      ))}
      

    </div>
  );
}