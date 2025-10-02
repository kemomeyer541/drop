import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { RARITY_COLORS, getRarityLabel } from '../utils/rarityColors';

interface DropSourceBookPageProps {
  onNavigate: (page: string) => void;
}

interface BookItem {
  id: string;
  name: string;
  emoji: string;
  creator: string;
  rarities: string[];
  minted: number;
  physicalPrice: number;
  type: 'sticker' | 'card';
  serialNumber?: number;
  dateMinted?: string;
}

const bookItems: BookItem[] = [
  {
    id: '1',
    name: 'Fire Track',
    emoji: '🔥',
    creator: 'Drop Source Official',
    rarities: ['common', 'rare', 'epic'],
    minted: 2547,
    physicalPrice: 15,
    type: 'sticker',
    serialNumber: 1247,
    dateMinted: '2024-01-15'
  },
  {
    id: '2',
    name: 'Diamond Producer',
    emoji: '💎',
    creator: 'Drop Source Official',
    rarities: ['premium', 'legendary'],
    minted: 892,
    physicalPrice: 25,
    type: 'card',
    serialNumber: 567,
    dateMinted: '2024-01-12'
  },
  {
    id: '3',
    name: 'Beat Master',
    emoji: '🥁',
    creator: 'community_beats',
    rarities: ['common', 'rare'],
    minted: 1834,
    physicalPrice: 12,
    type: 'sticker',
    serialNumber: 892,
    dateMinted: '2024-01-10'
  },
  {
    id: '4',
    name: 'Synth Lord',
    emoji: '🎛️',
    creator: 'Drop Source Official',
    rarities: ['rare', 'elite', 'legendary'],
    minted: 654,
    physicalPrice: 30,
    type: 'card',
    serialNumber: 234,
    dateMinted: '2024-01-08'
  },
  {
    id: '5',
    name: 'Rhythm King',
    emoji: '👑',
    creator: 'beat_royalty',
    rarities: ['elite', 'legendary'],
    minted: 321,
    physicalPrice: 45,
    type: 'card',
    serialNumber: 89,
    dateMinted: '2024-01-05'
  },
  {
    id: '6',
    name: 'Melody Maker',
    emoji: '🎵',
    creator: 'Drop Source Official',
    rarities: ['common', 'premium', 'rare'],
    minted: 3421,
    physicalPrice: 10,
    type: 'sticker',
    serialNumber: 1456,
    dateMinted: '2024-01-03'
  },
  {
    id: '7',
    name: 'Bass Drop',
    emoji: '🔊',
    creator: 'bass_legends',
    rarities: ['common', 'rare', 'elite'],
    minted: 1967,
    physicalPrice: 18,
    type: 'sticker',
    serialNumber: 743,
    dateMinted: '2024-01-02'
  },
  {
    id: '8',
    name: 'Studio Genius',
    emoji: '🎙️',
    creator: 'Drop Source Official',
    rarities: ['legendary'],
    minted: 150,
    physicalPrice: 75,
    type: 'card',
    serialNumber: 42,
    dateMinted: '2024-01-01'
  }
];

const getRarityColor = (rarity: string) => {
  const formattedRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
  const rarityData = RARITY_COLORS[formattedRarity as keyof typeof RARITY_COLORS];
  return rarityData ? rarityData.border : '#A9B7C6';
};

const getRarityBadgeColors = (rarity: string) => {
  const formattedRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
  const rarityData = RARITY_COLORS[formattedRarity as keyof typeof RARITY_COLORS];
  if (!rarityData) return 'text-gray-400 border-gray-400';
  
  switch (formattedRarity) {
    case 'Common': return 'text-green-400 border-green-400';
    case 'Rare': return 'text-pink-400 border-pink-400';
    case 'Premium': return 'text-sky-400 border-sky-400';
    case 'Elite': return 'text-blue-600 border-blue-600';
    case 'Legendary': return 'text-orange-400 border-orange-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

export function DropSourceBookPage({ onNavigate }: DropSourceBookPageProps) {

  return (
    <TooltipProvider>
      <div className="h-full overflow-hidden" style={{ background: 'var(--dropsource-bg)', color: 'var(--dropsource-primary)' }}>
        {/* Header */}
        <div 
          className="flex items-center justify-between"
          style={{ 
            background: 'rgba(18, 23, 35, 0.8)',
            borderBottom: '1px solid var(--dropsource-border)',
            padding: 'calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3)',
            zIndex: '20',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Left: Back Button */}
          <div className="flex items-center">
            <Button
              onClick={() => onNavigate('community')}
              className="dropsource-nav-pill flex items-center gap-2"
              style={{ 
                background: 'transparent',
                color: 'var(--dropsource-secondary)',
                border: 'none',
                padding: 'calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center">
            <h1 
              style={{ 
                fontSize: '32px', 
                fontWeight: '800',
                fontFamily: 'Inter',
                background: 'linear-gradient(90deg, #FFD166 0%, #5BE9E9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}
            >
              Drop Source Book
            </h1>
          </div>

          {/* Right: Spacer */}
          <div className="w-20"></div>
        </div>

        {/* Main Content */}
        <div className="p-6 h-full overflow-y-auto dropsource-custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <p className="dropsource-text-secondary text-center">
                Collectible stickers and cards from the Drop Source universe
              </p>
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bookItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                >
                  <Card 
                    className={`dropsource-card p-6 text-center dropsource-clickable transition-all group relative ${
                      item.type === 'card' ? 'border-2 border-dashed' : ''
                    }`}
                    style={{
                      borderColor: item.type === 'card' ? 'var(--accent-gold-start)' : getRarityColor(item.rarities[0]),
                      borderWidth: '2px',
                      minHeight: '240px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) rotateX(2deg) rotateY(2deg)';
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${getRarityColor(item.rarities[0])}80`;
                      e.currentTarget.style.borderColor = getRarityColor(item.rarities[0]);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = item.type === 'card' ? 'var(--accent-gold-start)' : getRarityColor(item.rarities[0]);
                    }}
                  >
                    {/* Serial Number Overlay - Always visible in top-left */}
                    <div 
                      className="absolute top-2 left-2 px-2 py-1 rounded z-20 dropsource-serial-overlay"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(8px)',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontFamily: 'JetBrains Mono, Fira Code, monospace',
                        fontWeight: '500',
                        opacity: '0.8',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      #{item.serialNumber} / 1000
                    </div>
                    {/* Item Display */}
                    <div className="text-6xl mb-4 relative">
                      {item.emoji}
                      {/* Serial Number Overlay - Shows on hover */}
                      <div className="absolute inset-0 rounded-lg bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs">
                        <div>Serial #{item.serialNumber}</div>
                        <div>{item.dateMinted}</div>
                      </div>
                    </div>
                    <h3 className="font-semibold dropsource-text-primary mb-2">
                      {item.name}
                    </h3>
                    <Badge 
                      className={`text-xs mb-3 ${
                        item.type === 'card' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'dropsource-btn-secondary'
                      }`}
                    >
                      {item.type === 'card' ? 'Card' : 'Sticker'}
                    </Badge>

                    {/* Hover Metadata - No longer using hoveredItem state, show on card hover */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center p-4 z-10">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="dropsource-text-tertiary">Creator: </span>
                          <span className="dropsource-text-primary font-medium">
                            {item.creator}
                          </span>
                        </div>
                        
                        <div>
                          <span className="dropsource-text-tertiary">Rarities: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.rarities.map((rarity, index) => (
                              <Badge 
                                key={index}
                                className={`text-xs ${getRarityBadgeColors(rarity)}`}
                              >
                                {getRarityLabel(rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase() as keyof typeof RARITY_COLORS, item.type === 'card')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="dropsource-text-tertiary">Serial #: </span>
                          <span className="dropsource-text-primary font-medium">
                            #{item.serialNumber}
                          </span>
                        </div>
                        
                        <div>
                          <span className="dropsource-text-tertiary"># Minted: </span>
                          <span className="dropsource-text-primary font-medium">
                            {item.minted.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Catalog Only - No "Worth" or "Purchase Physical" on cards, Stickers can show "Purchase Physical ($)" button, Cards = informational only unless user owns it */}
                        {item.type === 'sticker' && (
                          <div className="pt-2 border-t border-gray-700">
                            <Button 
                              className="w-full dropsource-btn-primary text-xs flex items-center gap-2"
                              onClick={() => console.log(`Buy physical ${item.name}`)}
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Purchase Physical (${item.physicalPrice})
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}