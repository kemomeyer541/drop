import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Creator profiles for spotlight cycling
const FEATURED_CREATORS = [
  {
    id: 1,
    name: "PixelSmith",
    handle: "pixel_smith",
    quote: "Turning pixels into poetry, one frame at a time.",
    avatarBg: '#FF6B6B',
    trustScore: 94,
    followers: 28400,
    specialties: ['Digital Art', 'Animation', 'Game Assets'],
    recentWork: '🎮 Indie game sprites',
    isVerified: true
  },
  {
    id: 2,
    name: "BeatHarderThnMyMeat",
    handle: "beatharderthanmymeat",
    quote: "Cursed beats for blessed ears. Your mom's favorite producer.",
    avatarBg: '#4ECDC4',
    trustScore: 87,
    followers: 15200,
    specialties: ['Hip-Hop', 'Trap', 'Lo-Fi'],
    recentWork: '🔥 Fire beat pack vol.3',
    isVerified: false
  },
  {
    id: 3,
    name: "GothGF",
    handle: "gothgf",
    quote: "Making dark art for darker souls. Commissions open.",
    avatarBg: '#BB8FCE',
    trustScore: 91,
    followers: 34600,
    specialties: ['Digital Portraits', 'Gothic Art', 'Character Design'],
    recentWork: '🖤 Gothic portrait series',
    isVerified: true
  },
  {
    id: 4,
    name: "SynthMaster",
    handle: "synth_master",
    quote: "Synthesizing dreams into reality since the 80s never ended.",
    avatarBg: '#45B7D1',
    trustScore: 96,
    followers: 42100,
    specialties: ['Synthwave', 'Ambient', 'Electronic'],
    recentWork: '🌴 Retrowave album',
    isVerified: true
  },
  {
    id: 5,
    name: "tax_evasion_420",
    handle: "tax_evasion_420",
    quote: "Professional disappointment. Making memes that shouldn't exist.",
    avatarBg: '#FFA07A',
    trustScore: 69,
    followers: 8900,
    specialties: ['Memes', 'Cursed Content', 'Chaos'],
    recentWork: '😈 Cursed meme pack',
    isVerified: false
  }
];

interface CyclingCreatorSpotlightProps {
  onCreatorClick?: (creator: any) => void;
}

export function CyclingCreatorSpotlight({ onCreatorClick }: CyclingCreatorSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentCreator = FEATURED_CREATORS[currentIndex];

  // Auto-cycle every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_CREATORS.length);
      setIsAnimating(false);
    }, 400);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + FEATURED_CREATORS.length) % FEATURED_CREATORS.length);
      setIsAnimating(false);
    }, 400);
  };

  const goToIndex = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div
      className="rounded border relative overflow-hidden"
      style={{
        backgroundColor: '#0F1520',
        borderColor: '#1A2531',
        minHeight: '280px'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 style={{ color: '#FFB039', fontSize: '14px', fontWeight: '600' }}>
          Creator Spotlight
        </h3>
        <div className="flex items-center gap-2">
          {/* Dot indicators */}
          <div className="flex gap-1">
            {FEATURED_CREATORS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: index === currentIndex ? '#FFB039' : 'rgba(255, 176, 57, 0.3)',
                  transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <div className="flex gap-1 ml-2">
            <button
              onClick={goToPrevious}
              className="p-1 rounded hover:bg-gray-800 transition-colors"
              style={{ color: '#FFB039' }}
              disabled={isAnimating}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-1 rounded hover:bg-gray-800 transition-colors"
              style={{ color: '#FFB039' }}
              disabled={isAnimating}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Creator Card */}
      <div
        className={`p-4 pt-0 transition-opacity duration-400 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Creator Info */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg relative"
            style={{ backgroundColor: currentCreator.avatarBg }}
          >
            {currentCreator.name.charAt(0)}
            {currentCreator.isVerified && (
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ backgroundColor: '#FFB039', color: '#000' }}
              >
                ✓
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-lg" style={{ color: '#E6ECF3' }}>
                {currentCreator.name}
              </h4>
            </div>
            <p className="text-sm mb-2" style={{ color: '#A9B7C6' }}>
              @{currentCreator.handle}
            </p>
            <div className="flex gap-4 text-xs" style={{ color: '#A9B7C6' }}>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {currentCreator.trustScore}% Trust
              </span>
              <span>{currentCreator.followers.toLocaleString()} followers</span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div
          className="rounded p-3 mb-3 text-sm italic"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#E6ECF3',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          "{currentCreator.quote}"
        </div>

        {/* Specialties */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {currentCreator.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: 'rgba(255, 176, 57, 0.1)',
                  color: '#FFB039',
                  border: '1px solid rgba(255, 176, 57, 0.2)'
                }}
              >
                {specialty}
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: '#A9B7C6' }}>
            Recent: {currentCreator.recentWork}
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="w-full py-2 px-4 rounded text-sm font-medium transition-colors flex items-center justify-center"
          style={{
            backgroundColor: '#FFB039',
            color: '#000',
            border: 'none',
            minHeight: '36px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E09A2B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFB039';
          }}
          onClick={() => onCreatorClick?.(currentCreator)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}