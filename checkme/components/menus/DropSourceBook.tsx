import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Star, Sparkles, ShoppingCart } from 'lucide-react';

export type StickerRarity = 'common' | 'rare' | 'legendary';
export type CardRarity = 'premium' | 'elite';

export interface StickerItem {
  id: string;
  name: string;
  creator: string;
  rarity: StickerRarity;
  color: string;
  price: number;
  description?: string;
  isDropSourceMinted?: boolean;
}

export interface CardItem {
  id: string;
  name: string;
  creator: string;
  rarity: CardRarity;
  color: string;
  price: number;
  description?: string;
  isDropSourceMinted?: boolean;
}

// Global registry - all items referenced across the app (expanded for infinite scroll feel)
export const STICKER_REGISTRY: StickerItem[] = [
  // DropSource Official
  { id: 'ds1', name: 'Sad Frog Supreme', creator: 'DropSource', rarity: 'legendary', color: '#7C5CFF', price: 45, description: 'The ultimate depression frog', isDropSourceMinted: true },
  { id: 'ds2', name: 'Tax Fraud Cat', creator: 'DropSource', rarity: 'rare', color: '#FF6B9D', price: 25, description: 'Definitely not hiding money', isDropSourceMinted: true },
  { id: 'ds3', name: 'Cheese God 3000', creator: 'DropSource', rarity: 'common', color: '#FFD700', price: 12, description: 'Blessed by dairy', isDropSourceMinted: true },
  { id: 'ds4', name: 'Anxiety Hamster', creator: 'DropSource', rarity: 'rare', color: '#25BFA6', price: 20, description: 'Spinning wheel of worry', isDropSourceMinted: true },
  { id: 'ds5', name: 'Big Chungus Energy', creator: 'DropSource', rarity: 'legendary', color: '#4ECDC4', price: 55, description: 'Maximum chonk achieved', isDropSourceMinted: true },
  { id: 'ds6', name: 'Bonk Horny Jail', creator: 'DropSource', rarity: 'common', color: '#8B5CF6', price: 8, description: 'Go to timeout', isDropSourceMinted: true },
  { id: 'ds7', name: 'This Is Fine Dog', creator: 'DropSource', rarity: 'legendary', color: '#F87171', price: 60, description: 'Everything is totally fine', isDropSourceMinted: true },
  { id: 'ds8', name: 'Stonks Only Go Up', creator: 'DropSource', rarity: 'rare', color: '#22C55E', price: 28, description: 'Number go brrr', isDropSourceMinted: true },
  // Community Created
  { id: 's1', name: 'Neon Vibes Pack', creator: 'PixelSmith', rarity: 'common', color: '#7C5CFF', price: 5, description: 'Electric neon aesthetic' },
  { id: 's2', name: 'Retro Wave Collection', creator: 'VectorVoid', rarity: 'rare', color: '#FF6B9D', price: 15, description: '80s synthwave nostalgia' },
  { id: 's3', name: 'Cosmic Dreams', creator: 'StarGazer', rarity: 'legendary', color: '#FFD700', price: 50, description: 'Mystical space journey' },
  { id: 's4', name: 'Lo-Fi Garden', creator: 'NovaMuse', rarity: 'common', color: '#25BFA6', price: 8, description: 'Chill botanical vibes' },
  { id: 's5', name: 'Pixel Forest', creator: 'GameGarden', rarity: 'rare', color: '#4ECDC4', price: 18, description: '8-bit nature adventure' },
  { id: 's6', name: 'Digital Sunflower', creator: 'BrushBloom', rarity: 'common', color: '#FFEAA7', price: 6, description: 'Warm summer energy' },
  { id: 's7', name: 'Quantum Postcards', creator: 'CloudCarver', rarity: 'legendary', color: '#8B5CF6', price: 75, description: 'Interdimensional messages' },
  { id: 's8', name: 'Paper Moon Zine', creator: 'ZineZebra', rarity: 'rare', color: '#F1948A', price: 22, description: 'Handcrafted storytelling' },
  { id: 's9', name: 'Midnight Coffee Club', creator: 'ByteBarista', rarity: 'common', color: '#8B4513', price: 7, description: 'Late night coding fuel' },
  { id: 's10', name: 'Error 404 Vibes', creator: 'DebugDeer', rarity: 'rare', color: '#FF4444', price: 16, description: 'Page not found energy' },
];

export const CARD_REGISTRY: CardItem[] = [
  // DropSource Official  
  { id: 'dsc1', name: 'CEO of Vibes', creator: 'DropSource', rarity: 'elite', color: '#FFD700', price: 85, description: 'Executive mood management', isDropSourceMinted: true },
  { id: 'dsc2', name: 'Master of Disaster', creator: 'DropSource', rarity: 'premium', color: '#60A5FA', price: 45, description: 'Chaos coordinator', isDropSourceMinted: true },
  { id: 'dsc3', name: 'Meme Lord Supreme', creator: 'DropSource', rarity: 'elite', color: '#A78BFA', price: 95, description: 'Peak internet culture', isDropSourceMinted: true },
  { id: 'dsc4', name: 'Professional Overthinker', creator: 'DropSource', rarity: 'premium', color: '#F87171', price: 42, description: 'Anxiety level: Expert', isDropSourceMinted: true },
  // Community Created
  { id: 'c1', name: 'Golden Producer', creator: 'SynthMaster', rarity: 'elite', color: '#FFD700', price: 100, description: 'Master of all genres' },
  { id: 'c2', name: 'Beat Master', creator: 'BeatBuddy', rarity: 'premium', color: '#60A5FA', price: 40, description: 'Rhythm perfection' },
  { id: 'c3', name: 'Synth Lord', creator: 'EchoKnox', rarity: 'elite', color: '#A78BFA', price: 120, description: 'Electronic music deity' },
  { id: 'c4', name: 'Mix Legend', creator: 'AudioArk', rarity: 'premium', color: '#F87171', price: 35, description: 'Mixing board wizard' },
  { id: 'c5', name: 'Drop King', creator: 'LoopLord', rarity: 'elite', color: '#34D399', price: 85, description: 'Bass drop royalty' },
  { id: 'c6', name: 'Sound Sage', creator: 'DesignDragon', rarity: 'premium', color: '#FBBF24', price: 45, description: 'Audio wisdom keeper' },
  { id: 'c7', name: 'Harmony Keeper', creator: 'MelodyMoon', rarity: 'premium', color: '#EC4899', price: 38, description: 'Musical balance master' },
  { id: 'c8', name: 'Rhythm Wizard', creator: 'TempoTiger', rarity: 'elite', color: '#10B981', price: 92, description: 'Time signature sorcerer' },
];

const getRarityColor = (rarity: StickerRarity | CardRarity): string => {
  switch (rarity) {
    case 'common': return '#22C55E';      // Green
    case 'rare': return '#8B5CF6';        // Purple  
    case 'legendary': return '#FFD700';   // Gold
    case 'premium': return '#8B5CF6';     // Purple
    case 'elite': return '#FFD700';       // Gold
    default: return '#A9B7C6';
  }
};

const getRarityIcon = (rarity: StickerRarity | CardRarity) => {
  if (rarity === 'legendary' || rarity === 'elite') {
    return <Star className="w-4 h-4" fill="currentColor" />;
  }
  return <Sparkles className="w-4 h-4" />;
};

interface DropSourceBookProps {
  onClose: () => void;
}

export const DropSourceBook: React.FC<DropSourceBookProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'cards'>('stickers');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [creatorFilter, setCreatorFilter] = useState<string>('all');
  const [displayedItems, setDisplayedItems] = useState(20);

  // Get unique creators
  const allCreators = useMemo(() => {
    const creators = new Set<string>();
    [...STICKER_REGISTRY, ...CARD_REGISTRY].forEach(item => creators.add(item.creator));
    return Array.from(creators).sort();
  }, []);

  const filteredStickers = useMemo(() => {
    return STICKER_REGISTRY.filter(sticker => {
      const matchesSearch = sticker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sticker.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || sticker.rarity === rarityFilter;
      const matchesCreator = creatorFilter === 'all' || sticker.creator === creatorFilter;
      return matchesSearch && matchesRarity && matchesCreator;
    }).slice(0, displayedItems);
  }, [searchQuery, rarityFilter, creatorFilter, displayedItems]);

  const filteredCards = useMemo(() => {
    return CARD_REGISTRY.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter;
      const matchesCreator = creatorFilter === 'all' || card.creator === creatorFilter;
      return matchesSearch && matchesRarity && matchesCreator;
    }).slice(0, displayedItems);
  }, [searchQuery, rarityFilter, creatorFilter, displayedItems]);

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setDisplayedItems(prev => prev + 20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div 
        className="rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
        style={{
          backgroundColor: '#0F1520',
          border: '1px solid #1A2531',
          animation: 'fadeInSmooth 300ms ease-out'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#1A2531' }}>
          <div className="flex items-center gap-3">
            <h2 style={{ 
              color: '#63B3FF', 
              fontSize: '24px', 
              fontWeight: '600',
              textShadow: '0 0 12px rgba(99, 179, 255, 0.4)'
            }}>
              Drop Source Book
            </h2>
            <span style={{ color: '#A9B7C6', fontSize: '14px' }}>
              Master catalog of all items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#E6ECF3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A9B7C6';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 py-4 border-b" style={{ borderColor: '#1A2531' }}>
          <button
            onClick={() => setActiveTab('stickers')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeTab === 'stickers' ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
              color: activeTab === 'stickers' ? '#60A5FA' : '#A9B7C6',
              border: `1px solid ${activeTab === 'stickers' ? '#60A5FA' : 'transparent'}`
            }}
          >
            Stickers ({STICKER_REGISTRY.length})
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeTab === 'cards' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: activeTab === 'cards' ? '#8B5CF6' : '#A9B7C6',
              border: `1px solid ${activeTab === 'cards' ? '#8B5CF6' : 'transparent'}`
            }}
          >
            Cards ({CARD_REGISTRY.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: '#1A2531' }}>
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4" style={{ color: '#A9B7C6' }} />
            <input
              type="text"
              placeholder="Search by name or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-2 py-1"
              style={{ color: '#E6ECF3' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: '#A9B7C6' }} />
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="bg-transparent border rounded px-2 py-1 text-sm"
              style={{ 
                borderColor: '#1A2531',
                color: '#E6ECF3'
              }}
            >
              <option value="all">All Rarities</option>
              {activeTab === 'stickers' ? (
                <>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="legendary">Legendary</option>
                </>
              ) : (
                <>
                  <option value="premium">Premium</option>
                  <option value="elite">Elite</option>
                </>
              )}
            </select>
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="bg-transparent border rounded px-2 py-1 text-sm"
              style={{ 
                borderColor: '#1A2531',
                color: '#E6ECF3'
              }}
            >
              <option value="all">All Creators</option>
              {allCreators.map(creator => (
                <option key={creator} value={creator}>{creator}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1" style={{ maxHeight: 'calc(95vh - 300px)' }} onScroll={handleScroll}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'stickers' ? filteredStickers.map(sticker => (
              <div
                key={sticker.id}
                className="rounded-lg border-2 p-4 transition-all duration-300 group cursor-pointer relative"
                style={{
                  backgroundColor: '#121721',
                  borderColor: getRarityColor(sticker.rarity),
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${getRarityColor(sticker.rarity)}40`,
                  minHeight: '320px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 16px ${getRarityColor(sticker.rarity)}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${getRarityColor(sticker.rarity)}40`;
                }}
              >
                {/* Rarity Badge - Top Right */}
                <div 
                  className="absolute -top-2 -right-2 px-3 py-1 rounded text-xs font-bold z-10"
                  style={{
                    backgroundColor: getRarityColor(sticker.rarity),
                    color: sticker.rarity === 'common' ? '#000' : '#fff',
                    boxShadow: `0 0 12px ${getRarityColor(sticker.rarity)}80`,
                    textTransform: 'uppercase'
                  }}
                >
                  {sticker.rarity}
                </div>

                {/* Sticker Preview */}
                <div 
                  className="w-full h-28 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: sticker.color, opacity: 0.9 }}
                >
                  <span className="text-white font-bold text-3xl">🎨</span>
                </div>
                
                {/* Info */}
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 style={{ color: '#E6ECF3', fontSize: '15px', fontWeight: '600' }}>
                      {sticker.name}
                    </h4>
                    <p style={{ 
                      color: sticker.isDropSourceMinted ? '#63B3FF' : '#A9B7C6', 
                      fontSize: '12px',
                      textShadow: sticker.isDropSourceMinted ? '0 0 8px rgba(99, 179, 255, 0.4)' : 'none'
                    }}>
                      by {sticker.creator}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#A9B7C6', fontSize: '12px', textTransform: 'capitalize' }}>
                      {sticker.rarity}
                    </span>
                    <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: '600' }}>
                      Value: ⭐{sticker.rarity === 'legendary' ? 25 : sticker.rarity === 'rare' ? 10 : 5}
                    </span>
                  </div>
                  
                  {sticker.description && (
                    <p style={{ color: '#A9B7C6', fontSize: '11px', lineHeight: '1.4' }}>
                      {sticker.description}
                    </p>
                  )}
                </div>

                {/* Purchase Physical Button - Only for Stickers */}
                <button
                  className="w-full px-3 py-2 rounded text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: '#22C55E',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#16A34A';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#22C55E';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShoppingCart className="w-3 h-3" />
                  Purchase Physical ${sticker.rarity === 'legendary' ? 40 : sticker.rarity === 'rare' ? 25 : 20}
                </button>
              </div>
            )) : filteredCards.map(card => (
              <div
                key={card.id}
                className="rounded-lg border-2 p-4 transition-all duration-300 group cursor-pointer relative"
                style={{
                  backgroundColor: '#121721',
                  borderColor: getRarityColor(card.rarity),
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${getRarityColor(card.rarity)}40`,
                  minHeight: '320px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 16px ${getRarityColor(card.rarity)}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${getRarityColor(card.rarity)}40`;
                }}
              >
                {/* Rarity Badge - Top Right */}
                <div 
                  className="absolute -top-2 -right-2 px-3 py-1 rounded text-xs font-bold z-10"
                  style={{
                    backgroundColor: getRarityColor(card.rarity),
                    color: card.rarity === 'common' ? '#000' : '#fff',
                    boxShadow: `0 0 12px ${getRarityColor(card.rarity)}80`,
                    textTransform: 'uppercase'
                  }}
                >
                  {card.rarity}
                </div>

                {/* Card Preview */}
                <div 
                  className="w-full h-28 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: card.color, opacity: 0.9 }}
                >
                  <span className="text-white font-bold text-3xl">♦</span>
                </div>
                
                {/* Info */}
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 style={{ color: '#E6ECF3', fontSize: '15px', fontWeight: '600' }}>
                      {card.name}
                    </h4>
                    <p style={{ 
                      color: card.isDropSourceMinted ? '#63B3FF' : '#A9B7C6', 
                      fontSize: '12px',
                      textShadow: card.isDropSourceMinted ? '0 0 8px rgba(99, 179, 255, 0.4)' : 'none'
                    }}>
                      by {card.creator}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#A9B7C6', fontSize: '12px', textTransform: 'capitalize' }}>
                      {card.rarity}
                    </span>
                    <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: '600' }}>
                      Value: ⭐{card.rarity === 'elite' ? 25 : 10}
                    </span>
                  </div>
                  
                  {card.description && (
                    <p style={{ color: '#A9B7C6', fontSize: '11px', lineHeight: '1.4' }}>
                      {card.description}
                    </p>
                  )}
                </div>

                {/* Informational Only - Cards Cannot Be Purchased */}
                <div className="w-full px-3 py-2 rounded text-sm text-center" 
                     style={{ 
                       backgroundColor: 'rgba(96, 165, 250, 0.1)', 
                       color: '#60A5FA',
                       border: '1px solid rgba(96, 165, 250, 0.3)'
                     }}>
                  ℹ️ Cards available in Scrapbook only
                </div>
              </div>
            ))}
          </div>

          {((activeTab === 'stickers' && filteredStickers.length === 0) || 
            (activeTab === 'cards' && filteredCards.length === 0)) && (
            <div className="text-center py-12">
              <p style={{ color: '#A9B7C6' }}>
                No {activeTab} found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};