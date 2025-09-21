import React from 'react';
import { CardSparkEffect } from './CardSparkEffect';

interface CommunityHubAnimationsProps {
  hoveredPortal: string | null;
}

export function CommunityHubAnimations({ hoveredPortal }: CommunityHubAnimationsProps) {
  return (
    <>
      {/* Animated emojis for cards */}
      <style jsx>{`
        .emoji-rocket { animation: emoji-float 3s ease-in-out infinite; }
        .emoji-pad { animation: emoji-float 3.5s ease-in-out infinite; }
        .emoji-mailbox { animation: emoji-float 4s ease-in-out infinite; }
        .emoji-news { animation: emoji-float 3.2s ease-in-out infinite; }
      `}</style>
      
      {/* Card spark effects */}
      {hoveredPortal === 'community' && (
        <div className="absolute inset-0 pointer-events-none">
          <CardSparkEffect isVisible={true} />
        </div>
      )}
      
      {hoveredPortal === 'pad' && (
        <div className="absolute inset-0 pointer-events-none">
          <CardSparkEffect isVisible={true} />
        </div>
      )}
    </>
  );
}