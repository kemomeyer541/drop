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
    id: 'pixel-art',
    name: 'Pixel Art',
    emoji: '🎨',
    creator: 'BridgetGlenn',
    rarities: ['legendary'],
    minted: 1,
    physicalPrice: 10000000,
    type: 'card',
    serialNumber: 1,
    dateMinted: '2025-10-01'
  },
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BookItem | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseAnimation, setPurchaseAnimation] = useState(false);
  const [userCollection, setUserCollection] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'price' | 'minted'>('name');

  const handlePurchasePhysical = (item: BookItem) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (selectedItem) {
      setPurchaseAnimation(true);
      setUserCollection(prev => [...prev, selectedItem.id]);
      
      // Show success animation
      setTimeout(() => {
        setPurchaseAnimation(false);
        setShowPurchaseModal(false);
        setSelectedItem(null);
        
        // Show success notification
        alert(`🎉 Successfully purchased ${selectedItem.name}! Check your scrapbook.`);
      }, 2000);
    }
  };

  const filteredAndSortedItems = bookItems
    .filter(item => filterRarity === 'all' || item.rarities.includes(filterRarity))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rarity': return a.rarities[0].localeCompare(b.rarities[0]);
        case 'price': return a.physicalPrice - b.physicalPrice;
        case 'minted': return b.minted - a.minted;
        default: return 0;
      }
    });

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
            {/* Enhanced Header with Stats */}
            <div className="mb-6 text-center">
              <p className="dropsource-text-secondary mb-4">
                Collectible stickers and cards from the Drop Source universe
              </p>
              
              {/* Collection Stats */}
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{userCollection.length}</div>
                  <div className="text-sm text-gray-400">Owned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{bookItems.length}</div>
                  <div className="text-sm text-gray-400">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((userCollection.length / bookItems.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Collection</div>
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex gap-2">
                  {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => setFilterRarity(rarity)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filterRarity === rarity
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rarity">Sort by Rarity</option>
                    <option value="price">Sort by Price</option>
                    <option value="minted">Sort by Minted</option>
                  </select>
                  
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm hover:bg-gray-600"
                  >
                    {viewMode === 'grid' ? '📋 List' : '🔲 Grid'}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Items */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredAndSortedItems.map((item) => {
                const isOwned = userCollection.includes(item.id);
                const isHovered = hoveredItem === item.id;
                
                return (
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
                        
                        {/* Enhanced Purchase Section */}
                        {item.type === 'sticker' && (
                          <div className="pt-2 border-t border-gray-700">
                            {isOwned ? (
                              <div className="w-full px-4 py-2 bg-green-500/20 text-green-400 text-xs font-medium text-center rounded">
                                ✅ Owned
                              </div>
                            ) : (
                              <Button 
                                className="w-full dropsource-btn-primary text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                                onClick={() => handlePurchasePhysical(item)}
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Purchase Physical (${item.physicalPrice})
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Purchase Confirmation Modal */}
        {showPurchaseModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedItem.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
                <p className="text-gray-400 mb-4">{selectedItem.description}</p>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="text-2xl font-bold text-green-400 mb-2">${selectedItem.physicalPrice}</div>
                  <div className="text-sm text-gray-400">Physical {selectedItem.type}</div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmPurchase}
                    className={`flex-1 ${purchaseAnimation ? 'animate-pulse' : ''}`}
                    style={{
                      background: purchaseAnimation 
                        ? 'linear-gradient(45deg, #10b981, #059669)' 
                        : undefined
                    }}
                  >
                    {purchaseAnimation ? 'Processing...' : 'Confirm Purchase'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}