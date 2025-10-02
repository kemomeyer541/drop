import { useEffect, useRef } from 'react';

// Simple particle components
function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

function Bubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-blue-300/30 bg-blue-400/5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 50}%`,
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            animation: `float-up ${8 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(0px) scale(0.5); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Snow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - Math.random() * 50}%`,
            animation: `snow-fall ${5 + Math.random() * 5}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes snow-fall {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px); }
        }
      `}</style>
    </div>
  );
}

function Fireflies() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60 shadow-lg shadow-yellow-300/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `firefly-dance ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes firefly-dance {
          0%, 100% { transform: translate(0px, 0px) scale(0.8); opacity: 0.3; }
          25% { transform: translate(20px, -15px) scale(1.2); opacity: 1; }
          50% { transform: translate(-10px, -30px) scale(1); opacity: 0.8; }
          75% { transform: translate(-20px, 10px) scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function FloatNotes() {
  const notes = ['♪', '♫', '♬', '♭', '♯'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-lg text-blue-400 opacity-60 font-bold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
            animation: `notes-float ${6 + Math.random() * 3}s ease-out infinite`,
            animationDelay: `${Math.random() * 4}s`
          }}
        >
          {notes[Math.floor(Math.random() * notes.length)]}
        </div>
      ))}
      <style jsx>{`
        @keyframes notes-float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-80vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Petals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-lg opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - Math.random() * 20}%`,
            animation: `petals-fall ${4 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          🌸
        </div>
      ))}
      <style jsx>{`
        @keyframes petals-fall {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          100% { transform: translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(720deg); }
        }
      `}</style>
    </div>
  );
}

function Triangles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute border-2 border-cyan-400/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 30}px`,
            height: `${20 + Math.random() * 30}px`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            animation: `triangle-glow ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes triangle-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

function PixelSparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pixel-sparkle ${1 + Math.random()}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pixel-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

function EmojiConfetti() {
  const confetti = ['🎉', '🎊', '✨', '🌟', '💫', '⭐'];
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTap = () => {
      if (!confettiRef.current) return;
      
      // Create burst of confetti
      for (let i = 0; i < 15; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = confetti[Math.floor(Math.random() * confetti.length)];
        emoji.className = 'absolute text-lg pointer-events-none';
        emoji.style.left = '50%';
        emoji.style.top = '50%';
        emoji.style.animation = `confetti-burst 2s ease-out forwards`;
        emoji.style.setProperty('--deltaX', `${(Math.random() - 0.5) * 300}px`);
        emoji.style.setProperty('--deltaY', `${(Math.random() - 0.5) * 300}px`);
        
        confettiRef.current.appendChild(emoji);
        
        setTimeout(() => {
          if (emoji.parentNode) {
            emoji.parentNode.removeChild(emoji);
          }
        }, 2000);
      }
    };

    document.addEventListener('click', handleTap);
    return () => document.removeEventListener('click', handleTap);
  }, []);

  return (
    <div ref={confettiRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes confetti-burst {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--deltaX)), calc(-50% + var(--deltaY))) scale(1) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, rgba(147,51,234,0.1), rgba(59,130,246,0.1), rgba(16,185,129,0.1), rgba(245,158,11,0.1))',
          animation: 'aurora-flow 12s ease-in-out infinite',
          backgroundSize: '400% 400%'
        }}
      />
      <style jsx>{`
        @keyframes aurora-flow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 0%; }
          75% { background-position: 0% 0%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default function ParticleLayer({ effectId }: { effectId?: string }) {
  if (!effectId) return null;
  
  switch (effectId) {
    case 'starfield':   return <Stars />;
    case 'bubbles':     return <Bubbles />;
    case 'snow':        return <Snow />;
    case 'fireflies':   return <Fireflies />;
    case 'notes':       return <FloatNotes />;
    case 'petals':      return <Petals />;
    case 'triangles':   return <Triangles />;
    case 'pixels':      return <PixelSparkles />;
    case 'emojiConfetti': return <EmojiConfetti />;
    case 'aurora':      return <Aurora />;
    default: return null;
  }
}