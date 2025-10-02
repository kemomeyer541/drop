import React, { useEffect, useState } from 'react';

interface FloatingReactionProps {
  emoji: string;
  x: number;
  y: number;
  onComplete: () => void;
}

export const FloatingReaction: React.FC<FloatingReactionProps> = ({ emoji, x, y, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  const randomOffset = Math.random() * 40 - 20; // Random horizontal offset

  return (
    <div
      className="floating-reaction"
      style={{
        position: 'fixed',
        left: `${x + randomOffset}px`,
        top: `${y}px`,
        fontSize: '2rem',
        zIndex: 10000,
        pointerEvents: 'none',
        animation: 'float-up 2s ease-out forwards',
      }}
    >
      {emoji}
    </div>
  );
};

interface ConfettiProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ x, y, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; x: number; y: number; rotation: number }>>([]);

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#A78BFA', '#FF6BAA'];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100 - 50,
      y: Math.random() * -100 - 50,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: particle.color,
            borderRadius: '2px',
            animation: `confetti-fall 1.5s ease-out forwards`,
            transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// Global styles for animations
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    @keyframes float-up {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      50% {
        opacity: 1;
        transform: translateY(-80px) scale(1.3);
      }
      100% {
        opacity: 0;
        transform: translateY(-150px) scale(0.8);
      }
    }

    @keyframes confetti-fall {
      0% {
        opacity: 1;
        transform: translate(0, 0) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translate(var(--x, 0), 150px) rotate(720deg);
      }
    }

    .floating-reaction {
      user-select: none;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
  `;
  document.head.appendChild(styleElement);
}

// Hook for managing floating reactions
export const useFloatingReactions = () => {
  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [confettiList, setConfettiList] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const addReaction = (emoji: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setReactions((prev) => [...prev, { id, emoji, x, y }]);
  };

  const addConfetti = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setConfettiList((prev) => [...prev, { id, x, y }]);
  };

  const removeReaction = (id: number) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  };

  const removeConfetti = (id: number) => {
    setConfettiList((prev) => prev.filter((c) => c.id !== id));
  };

  const ReactionsRenderer = () => (
    <>
      {reactions.map((reaction) => (
        <FloatingReaction
          key={reaction.id}
          emoji={reaction.emoji}
          x={reaction.x}
          y={reaction.y}
          onComplete={() => removeReaction(reaction.id)}
        />
      ))}
      {confettiList.map((confetti) => (
        <Confetti
          key={confetti.id}
          x={confetti.x}
          y={confetti.y}
          onComplete={() => removeConfetti(confetti.id)}
        />
      ))}
    </>
  );

  return {
    addReaction,
    addConfetti,
    ReactionsRenderer,
  };
};
