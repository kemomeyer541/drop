import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { FeatureType } from './FloatingToolbar';

export interface MinimizedCard {
  type: FeatureType | string;
  title: string;
}

interface MinimizedDockProps {
  minimizedCards: MinimizedCard[];
  onRestoreCard: (type: FeatureType | string) => void;
  onCloseCard: (type: FeatureType | string) => void;
}

export function MinimizedDock({ minimizedCards, onRestoreCard, onCloseCard }: MinimizedDockProps) {
  if (minimizedCards.length === 0) return null;

  return (
    <div className="fixed z-30" style={{
      bottom: 'calc(var(--spacing-unit) * 3)',
      left: '50%',
      transform: 'translateX(-50%)'
    }}>
      <div className="dropsource-minimize-dock dropsource-fade-in">
        {minimizedCards.map((card) => (
          <div
            key={card.type}
            className="dropsource-dock-tab"
            onClick={() => onRestoreCard(card.type)}
          >
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{card.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseCard(card.type);
              }}
              className="dropsource-dock-tab-close dropsource-focus-visible"
              style={{
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}