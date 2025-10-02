import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  baseOpacity: number;
  blur: number;
  shouldTwinkle: boolean;
  twinkleSpeed: number;
  twinkleStartDelay: number;
  shouldDrift: boolean;
  driftRangeX: number;
  driftRangeY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeed: number;
}

export function StarfieldBackground({ className }: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use refs to prevent any possible re-render interference
    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
    }

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      
      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingEnabled = true;
    };

    // Star layer definitions: 70 stars total
    const layers = [
      // Far stars: 2-3px, opacity 20-30%, drift ±3px X, ±2px Y, blur 1px
      {
        count: 28,
        minSize: 2,
        maxSize: 3,
        minOpacity: 0.2,
        maxOpacity: 0.3,
        blur: 1,
        twinkleRate: 0,
        driftRangeX: 3,
        driftRangeY: 2,
        drift: true
      },
      // Mid stars: 3-4px, opacity 35-45%, drift ±2px X, no blur
      {
        count: 24,
        minSize: 3,
        maxSize: 4,
        minOpacity: 0.35,
        maxOpacity: 0.45,
        blur: 0,
        twinkleRate: 0,
        driftRangeX: 2,
        driftRangeY: 0,
        drift: true
      },
      // Near stars: 4-5px, opacity 50-70%, 15% twinkle, no drift
      {
        count: 18,
        minSize: 4,
        maxSize: 5,
        minOpacity: 0.5,
        maxOpacity: 0.7,
        blur: 0,
        twinkleRate: 0.15,
        driftRangeX: 0,
        driftRangeY: 0,
        drift: false
      }
    ];

    const generateStars = (): Star[] => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const allStars: Star[] = [];

      layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
          const baseX = Math.random() * width;
          const baseY = Math.random() * height;
          
          const star: Star = {
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            size: layer.minSize + Math.random() * (layer.maxSize - layer.minSize),
            baseOpacity: layer.minOpacity + Math.random() * (layer.maxOpacity - layer.minOpacity),
            blur: layer.blur,
            
            // Twinkle properties - Enhanced for more sparkle
            shouldTwinkle: Math.random() < Math.max(layer.twinkleRate, 0.3), // Minimum 30% sparkle chance
            twinkleSpeed: (Math.PI * 2) / (2000 + Math.random() * 3000), // 2-5s varied sparkle
            twinkleStartDelay: Math.random() * 2000, // Faster start for more immediate sparkle
            
            // Drift properties
            shouldDrift: layer.drift,
            driftRangeX: layer.driftRangeX,
            driftRangeY: layer.driftRangeY,
            driftPhaseX: Math.random() * Math.PI * 2,
            driftPhaseY: Math.random() * Math.PI * 2,
            driftSpeed: (Math.PI * 2) / (6000 + Math.random() * 4000) // 6-10s varied drift for natural movement
          };
          
          allStars.push(star);
        }
      });

      return allStars;
    };

    let stars = generateStars();

    const animate = (currentTime: number) => {
      if (!isAnimatingRef.current) return;
      
      const elapsedTime = currentTime - startTimeRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw all stars
      stars.forEach(star => {
        // Calculate current opacity (with twinkle)
        let opacity = star.baseOpacity;
        if (star.shouldTwinkle && elapsedTime > star.twinkleStartDelay) {
          const adjustedTime = elapsedTime - star.twinkleStartDelay;
          const phase = adjustedTime * star.twinkleSpeed;
          // Enhanced sparkle: 40% → 120% → 40% opacity range for more dramatic sparkle
          const twinkleFactor = 0.4 + 0.8 * (0.5 + 0.5 * Math.sin(phase));
          opacity = Math.min(1, star.baseOpacity * twinkleFactor); // Cap at 100% opacity
        }

        // Calculate current position (with drift + constant rightward movement)
        let currentX = star.baseX;
        let currentY = star.baseY;
        
        // Add constant slow rightward movement for all stars
        const rightwardSpeed = 0.005; // 0.005px per millisecond = very slow
        const rightwardOffset = (elapsedTime * rightwardSpeed) % (window.innerWidth + 50);
        currentX = (star.baseX + rightwardOffset) % (window.innerWidth + 50);
        
        // If star has moved off the right edge, wrap it around to the left
        if (currentX > window.innerWidth + 25) {
          currentX = -25;
          star.baseX = currentX - rightwardOffset; // Update baseX to maintain continuity
        }
        
        if (star.shouldDrift) {
          const driftPhaseX = elapsedTime * star.driftSpeed + star.driftPhaseX;
          const driftPhaseY = elapsedTime * star.driftSpeed + star.driftPhaseY;
          
          currentX = currentX + Math.sin(driftPhaseX) * star.driftRangeX;
          currentY = star.baseY + Math.sin(driftPhaseY) * star.driftRangeY;
        }

        // Update star position
        star.x = currentX;
        star.y = currentY;

        // Set filter for blur
        ctx.filter = star.blur > 0 ? `blur(${star.blur}px)` : 'none';

        // Draw star
        ctx.globalCompositeOperation = 'normal';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Reset filter
      ctx.filter = 'none';
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      stars = generateStars(); // Regenerate stars for new canvas size
    };

    // Initialize
    resizeCanvas();
    isAnimatingRef.current = true;
    console.log('Starting starfield animation with', stars.length, 'stars');
    animationRef.current = requestAnimationFrame(animate);
    
    window.addEventListener('resize', handleResize);

    return () => {
      isAnimatingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency - completely independent

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}