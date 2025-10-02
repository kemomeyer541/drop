import React from 'react';

interface DopamineEffectsProps {
  children: React.ReactNode;
}

export function DopamineEffects({ children }: DopamineEffectsProps) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function HoverGlow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function AttentionPulse({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
}

export function FloatingCollectible({ emoji, delay = 0 }: { emoji: string; delay?: number }) {
  return (
    <>
      <div
        className="absolute pointer-events-none text-3xl z-40"
        style={{
          left: `${20 + Math.random() * 60}%`,
          top: `${20 + Math.random() * 60}%`,
          animation: `floatCollectible ${4 + Math.random() * 2}s ease-in-out infinite`,
          animationDelay: `${delay}s`
        }}
      >
        {emoji}
      </div>
      
      <style>{`
        @keyframes floatCollectible {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-30px) rotate(-5deg);
            opacity: 0.9;
          }
        }
      `}</style>
    </>
  );
}