import React, { useEffect, useRef } from 'react';

interface ShootingStarsProps {
  className?: string;
}

export function ShootingStars({ className }: ShootingStarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fast white dot configuration
    const shootingStarConfig = {
      maxConcurrent: 3, // Max 3 on screen
      duration: Math.random() * 800 + 1200, // 1.2-2s duration (much faster)
      delays: [8000, 10000, 12000, 15000], // 8-15s staggered delays
      directions: [
        { name: 'TL→BR', startX: -10, startY: -10, endX: 110, endY: 110, rotation: 45 },
        { name: 'TR→BL', startX: 110, startY: -10, endX: -10, endY: 110, rotation: 135 },
        { name: 'L→R', startX: -10, startY: 50, endX: 110, endY: 50, rotation: 0 },
        { name: 'R→L', startX: 110, startY: 50, endX: -10, endY: 50, rotation: 180 }
      ]
    };

    let activeStars = 0;
    const starInstances: HTMLElement[] = [];

    const createShootingStar = () => {
      if (activeStars >= shootingStarConfig.maxConcurrent) return;

      const star = document.createElement('div');
      const direction = shootingStarConfig.directions[Math.floor(Math.random() * shootingStarConfig.directions.length)];
      const streakWidth = Math.random() * 10 + 40; // 40-50px wide
      
      // Simple white dot styling
      star.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
        left: ${direction.startX}vw;
        top: ${direction.startY}vh;
        opacity: 0;
        z-index: 2;
        pointer-events: none;
      `;
      container.appendChild(star);
      starInstances.push(star);
      activeStars++;

      // Use CSS transform for smooth animation
      star.style.transition = `transform ${shootingStarConfig.duration}ms linear, opacity ${shootingStarConfig.duration}ms ease-out`;
      star.style.transform = `translate(${direction.startX}vw, ${direction.startY}vh) rotate(${direction.rotation}deg) scale(0.97)`;
      star.style.opacity = '0';

      // Start animation after a brief delay to ensure styles are applied
      requestAnimationFrame(() => {
        star.style.opacity = '0.8';
        star.style.transform = `translate(${direction.endX}vw, ${direction.endY}vh) rotate(${direction.rotation}deg) scale(0.95)`;
      });

      // Clean up after animation
      const cleanup = setTimeout(() => {
        star.remove();
        const index = starInstances.indexOf(star);
        if (index > -1) starInstances.splice(index, 1);
        activeStars--;
        
        // Schedule next shooting star with random delay (12-20s)
        const nextDelay = shootingStarConfig.delays[Math.floor(Math.random() * shootingStarConfig.delays.length)];
        setTimeout(createShootingStar, nextDelay);
      }, shootingStarConfig.duration);


    };

    // Start initial shooting stars with staggered timing
    const initialDelays = [3000, 8000, 15000];
    initialDelays.forEach(delay => {
      setTimeout(createShootingStar, delay);
    });

    return () => {
      // Clean up any remaining stars
      starInstances.forEach(star => {
        if (star.parentNode) {
          star.remove();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
}