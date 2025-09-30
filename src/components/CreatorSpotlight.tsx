// src/components/CreatorSpotlight.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "./ui/badge";

type Creator = {
  id: string;
  name: string;
  handle: string;
  trust?: number;
  followers?: number;
  bio?: string;
  avatarUrl?: string;
  ctaUrl?: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  recentWork?: string;
  specialties?: string[];
};

const INTERVAL_MS = 6000; // 6s
const FADE_MS = 450;

interface CreatorSpotlightProps {
  creators: Creator[];
  onCreatorClick?: (creator: Creator) => void;
}

export default function CreatorSpotlight({ creators, onCreatorClick }: CreatorSpotlightProps) {
  const list = useMemo(() => creators?.filter(Boolean) ?? [], [creators]);
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef<number | null>(null);
  const hovering = useRef(false);

  useEffect(() => {
    if (!list.length) return;

    const tick = () => {
      if (hovering.current) return;
      setFading(true);
      window.setTimeout(() => {
        setIdx(prev => (prev + 1) % list.length);
        setFading(false);
      }, FADE_MS);
    };

    timer.current = window.setInterval(tick, INTERVAL_MS) as unknown as number;
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [list.length]);

  if (!list.length) return null;

  const c = list[idx];

  const handleDotClick = (index: number) => {
    if (index === idx) return;
    setFading(true);
    setTimeout(() => {
      setIdx(index);
      setFading(false);
    }, FADE_MS);
  };

  const handleCreatorClick = () => {
    if (onCreatorClick) {
      onCreatorClick(c);
    }
  };

  return (
    <div
      className="rounded border relative overflow-hidden"
      style={{
        backgroundColor: '#0F1520',
        borderColor: '#1A2531',
        minHeight: '280px'
      }}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 style={{ color: '#FFB039', fontSize: '14px', fontWeight: '600' }}>
          Creator Spotlight
        </h3>
        
        <div className="flex items-center gap-2">
          {c.isSponsored && (
  <Badge variant="ad" title="Paid placement">
    Ad
  </Badge>
)}
          
          {/* Dot indicators */}
          <div className="flex gap-1">
            {list.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to ${i + 1}`}
                onClick={() => handleDotClick(i)}
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: i === idx ? '#FFB039' : 'rgba(255, 176, 57, 0.3)',
                  transform: i === idx ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Creator Card */}
      <div
        className="p-4 pt-0 transition-opacity"
        style={{
          transitionDuration: `${FADE_MS}ms`,
          opacity: fading ? 0 : 1
        }}
        onClick={handleCreatorClick}
      >
        {/* Creator Info */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg relative"
            style={{ 
              backgroundColor: c.avatarUrl ? 'transparent' : '#FF6B6B',
              backgroundImage: c.avatarUrl ? `url(${c.avatarUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!c.avatarUrl && c.name.charAt(0)}
            {c.isVerified && (
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
                {c.name}
              </h4>
            </div>
            <p className="text-sm mb-2" style={{ color: '#A9B7C6' }}>
              @{c.handle}
            </p>
            <div className="flex gap-4 text-xs" style={{ color: '#A9B7C6' }}>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {c.trust ?? 85}% Trust
              </span>
              <span>{(c.followers ?? 1500).toLocaleString()} followers</span>
            </div>
          </div>
        </div>

        {/* Quote/Bio */}
        {c.bio && (
          <div
            className="rounded p-3 mb-3 text-sm italic"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#E6ECF3',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            "{c.bio}"
          </div>
        )}

        {/* Specialties */}
        {c.specialties && c.specialties.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1 mb-2">
              {c.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs"
                  title={specialty} // Add tooltip for full text
                  style={{
                    backgroundColor: 'rgba(255, 176, 57, 0.1)',
                    color: '#FFB039',
                    border: '1px solid rgba(255, 176, 57, 0.2)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px'
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
            {c.recentWork && (
              <p className="text-xs" style={{ color: '#A9B7C6' }}>
                Recent: {c.recentWork}
              </p>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="w-full py-2 px-4 rounded text-sm font-medium transition-colors flex items-center justify-center cursor-pointer"
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
        >
          View Profile
        </button>
      </div>
    </div>
  );
}