import React, { useState, useMemo } from 'react';
import { X, Sparkles, Star, RefreshCw, Volume2 } from 'lucide-react';
import { RARITY_COLORS, getRarityStyle, getRarityLabel } from '../../utils/rarityColors';

export type StickerRarity = 'Common' | 'Rare' | 'Legendary';
export type CardRarity = 'Premium' | 'Elite';

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

export interface MegaphoneItem {
  id: string;
  name: string;
  creator: string;
  price: number;
  description: string;
  isDropSourceMinted: boolean;
}

// Memey sticker names for DropSource
const MEMEY_STICKER_NAMES = [
  "Sad Frog Supreme", "Tax Fraud Cat", "Cheese God 3000", "Anxiety Hamster", "Confused Stonks",
  "Big Chungus Energy", "No Brain Cells Left", "Sus Impostor Vibes", "Crying Laughing Tears",
  "Bonk Horny Jail", "Stonks Only Go Up", "This Is Fine Dog", "Drip Too Hard", "Simp Detection",
  "Monday Morning Mood", "Coffee or Death", "Sleep is for Weak", "Procrastination King",
  "WiFi Password Please", "Battery at 1%", "Left on Read", "Zoom Meeting Panic"
];

const MEMEY_CARD_NAMES = [
  "CEO of Vibes", "Master of Disaster", "Chaos Controller", "Meme Lord Supreme", "Certified Bruh",
  "Professional Overthinker", "Captain Obvious", "Expert Procrastinator", "Social Media Addict"
];

// DropSource shop registry with memey names
const SHOP_STICKERS: StickerItem[] = [
  { id: 'ds1', name: 'Sad Frog Supreme', creator: 'DropSource', rarity: 'Legendary', color: '#7C5CFF', price: 25, description: 'The ultimate depression frog', isDropSourceMinted: true },
  { id: 'ds2', name: 'Tax Fraud Cat', creator: 'DropSource', rarity: 'Rare', color: '#FF6B9D', price: 15, description: 'Definitely not hiding money', isDropSourceMinted: true },
  { id: 'ds3', name: 'Cheese God 3000', creator: 'DropSource', rarity: 'Common', color: '#FFD700', price: 8, description: 'Blessed by dairy', isDropSourceMinted: true },
  { id: 'ds4', name: 'Anxiety Hamster', creator: 'DropSource', rarity: 'Rare', color: '#25BFA6', price: 12, description: 'Spinning wheel of worry', isDropSourceMinted: true },
  { id: 'ds5', name: 'Confused Stonks', creator: 'DropSource', rarity: 'Legendary', color: '#4ECDC4', price: 30, description: 'Number go up???', isDropSourceMinted: true },
  { id: 'ds6', name: 'Big Chungus Energy', creator: 'DropSource', rarity: 'Common', color: '#FFEAA7', price: 6, description: 'Maximum chonk achieved', isDropSourceMinted: true },
  { id: 'ds7', name: 'Bonk Horny Jail', creator: 'DropSource', rarity: 'Rare', color: '#8B5CF6', price: 18, description: 'Go to timeout', isDropSourceMinted: true },
  { id: 'ds8', name: 'This Is Fine Dog', creator: 'DropSource', rarity: 'Legendary', color: '#F87171', price: 35, description: 'Everything is totally fine', isDropSourceMinted: true },
];

const SHOP_CARDS: CardItem[] = [
  { id: 'dsc1', name: 'CEO of Vibes', creator: 'DropSource', rarity: 'Elite', color: '#FFD700', price: 50, description: 'Executive mood management', isDropSourceMinted: true },
  { id: 'dsc2', name: 'Master of Disaster', creator: 'DropSource', rarity: 'Premium', color: '#60A5FA', price: 25, description: 'Chaos coordinator', isDropSourceMinted: true },
  { id: 'dsc3', name: 'Meme Lord Supreme', creator: 'DropSource', rarity: 'Elite', color: '#A78BFA', price: 60, description: 'Peak internet culture', isDropSourceMinted: true },
  { id: 'dsc4', name: 'Professional Overthinker', creator: 'DropSource', rarity: 'Premium', color: '#F87171', price: 30, description: 'Anxiety level: Expert', isDropSourceMinted: true },
];

const MEGAPHONE_ITEMS: MegaphoneItem[] = [
  { id: 'mega1', name: 'DropSource Megaphone Classic', creator: 'DropSource', price: 75, description: 'Amplify your voice across the platform', isDropSourceMinted: true },
  { id: 'mega2', name: 'Golden Megaphone Deluxe', creator: 'DropSource', price: 150, description: 'Premium gold-plated amplification', isDropSourceMinted: true },
];

const getRarityColor = (rarity: StickerRarity | CardRarity): string => {
  const rarityKey = rarity as keyof typeof RARITY_COLORS;
  return RARITY_COLORS[rarityKey]?.border || '#A9B7C6';
};

const getRarityGradient = (rarity: StickerRarity | CardRarity): string => {
  const rarityKey = rarity as keyof typeof RARITY_COLORS;
  return RARITY_COLORS[rarityKey]?.background || 'linear-gradient(135deg, #A9B7C6, #94A3B8)';
};

const getRarityIcon = (rarity: StickerRarity | CardRarity) => {
  if (rarity === 'Legendary' || rarity === 'Elite') {
    return <Star className="w-4 h-4" fill="currentColor" />;
  }
  return <Sparkles className="w-4 h-4" />;
};

interface ShopMenuProps {
  onClose: () => void;
}

export const ShopMenu: React.FC<ShopMenuProps> = ({ onClose }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Generate random selection of items for shop including megaphone
  const shopItems = useMemo(() => {
    const allItems = [...SHOP_STICKERS, ...SHOP_CARDS];
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 8); // Show 8 items for 3-4 per row
    
    // Randomly include a megaphone item
    if (Math.random() > 0.5) {
      const megaphone = MEGAPHONE_ITEMS[Math.floor(Math.random() * MEGAPHONE_ITEMS.length)];
      selectedItems.push(megaphone);
    }
    
    return selectedItems;
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
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
            <h2 style={{ color: '#E6ECF3', fontSize: '20px', fontWeight: '600' }}>
              DropSource Shop
            </h2>
            <span style={{ color: '#A9B7C6', fontSize: '14px' }}>
              Random DropSource-minted items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#A9B7C6' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#63B3FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A9B7C6';
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
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
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1" style={{ maxHeight: 'calc(95vh - 200px)' }}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {shopItems.map((item, index) => {
              const isSticker = 'id' in item && item.id.startsWith('ds');
              const isMegaphone = 'id' in item && item.id.startsWith('mega');
              const rarity = isMegaphone ? 'Legendary' : item.rarity as StickerRarity | CardRarity;
              
              return (
                <div
                  key={`${item.id}-${refreshKey}`}
                  className="rounded-lg p-4 border-2 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  style={{
                    backgroundColor: isMegaphone ? '#1A1A1A' : '#121721', // Darker bg for megaphone
                    borderColor: getRarityColor(rarity),
                    background: isMegaphone 
                      ? 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)' // Metallic gradient for megaphone
                      : '#121721',
                    boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${getRarityColor(rarity)}40`,
                    minHeight: '280px',
                    border: isMegaphone 
                      ? '2px solid #C0C0C0' // Silver border for megaphone
                      : `2px solid ${getRarityColor(rarity)}`
                  }}
                  onMouseEnter={(e) => {
                    // Updated hover effect: subtle lift + outer glow based on rarity color
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = isMegaphone
                      ? '0 8px 24px rgba(192,192,192,0.4), 0 0 16px rgba(192,192,192,0.6)'
                      : `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${getRarityColor(rarity)}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isMegaphone
                      ? '0 4px 16px rgba(0,0,0,0.4), 0 0 8px rgba(192,192,192,0.4)'
                      : `0 4px 16px rgba(0,0,0,0.4), 0 0 8px ${getRarityColor(rarity)}40`;
                  }}
                >
                  {/* Rarity Badge - Fixed to top-right with proper padding, always visible */}
                  <div 
                    className="absolute px-3 py-1 rounded text-xs font-bold transition-all duration-200 group-hover:animate-pulse"
                    style={{
                      top: '6px',
                      right: '6px',
                      zIndex: 3,
                      background: isMegaphone 
                        ? 'linear-gradient(135deg, #C0C0C0, #E5E5E5)' // Silver gradient for megaphone
                        : getRarityGradient(rarity),
                      color: isMegaphone ? '#000' : (rarity === 'Common' ? '#000' : '#fff'),
                      boxShadow: isMegaphone
                        ? '0 0 16px rgba(192,192,192,0.8), 0 0 0 2px rgba(192,192,192,0.4)'
                        : `0 0 16px ${getRarityColor(rarity)}80, 0 0 0 2px ${getRarityColor(rarity)}40`,
                      textTransform: 'uppercase'
                    }}
                  >
                    {isMegaphone ? 'SPECIAL' : rarity}
                  </div>

                  {/* Item Preview */}
                  <div 
                    className="w-full h-24 rounded-lg mb-4 flex items-center justify-center relative"
                    style={{ 
                      backgroundColor: isMegaphone ? 'rgba(192,192,192,0.2)' : item.color, 
                      opacity: 0.9,
                      background: isMegaphone 
                        ? 'linear-gradient(135deg, rgba(192,192,192,0.3), rgba(169,169,169,0.2))'
                        : item.color
                    }}
                  >
                    <span className={`font-bold text-3xl ${isMegaphone ? 'text-silver-300' : 'text-white'}`}>
                      {isMegaphone ? '📢' : isSticker ? '🎨' : '♦'}
                    </span>
                    {/* Enhanced sparkle effect */}
                    {(rarity === 'Legendary' || rarity === 'Elite') && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="animate-pulse text-yellow-300 text-lg">✨</div>
                      </div>
                    )}
                    {/* Special metallic sheen for megaphone */}
                    {isMegaphone && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:animate-pulse"></div>
                    )}
                    {/* Serial Number Overlay on Hover */}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs font-mono">
                      #{1000 + Math.floor(Math.random() * 9000)}
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-3">
                    <div>
                      <h4 style={{ 
                        color: isMegaphone ? '#E5E5E5' : '#E6ECF3', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        textShadow: isMegaphone ? '0 0 6px rgba(192,192,192,0.4)' : 'none'
                      }}>
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1" style={{ color: isMegaphone ? '#C0C0C0' : getRarityColor(rarity) }}>
                        {getRarityIcon(rarity)}
                      </div>
                    </div>
                    
                    {/* Creator with DropSource blue glow */}
                    <div className="flex flex-col gap-1">
                      <p style={{ 
                        color: item.isDropSourceMinted ? '#63B3FF' : '#A9B7C6', 
                        fontSize: '12px',
                        textShadow: item.isDropSourceMinted ? '0 0 8px rgba(99, 179, 255, 0.4)' : 'none'
                      }}>
                        by {item.creator}
                      </p>
                    </div>
                    
                    <p style={{ color: '#A9B7C6', fontSize: '11px' }}>
                      {isMegaphone ? 'Platform Tool' : isSticker ? 'Sticker Pack' : 'Collectible Card'}
                    </p>
                    {item.description && (
                      <p style={{ color: '#A9B7C6', fontSize: '11px', lineHeight: '1.4' }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Purchase Button with Stars */}
                  <button
                    className="w-full mt-4 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isMegaphone ? '#C0C0C0' : '#22C55E',
                      color: isMegaphone ? '#000' : 'white',
                      boxShadow: isMegaphone 
                        ? '0 2px 8px rgba(192, 192, 192, 0.3)'
                        : '0 2px 8px rgba(34, 197, 94, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (isMegaphone) {
                        e.currentTarget.style.backgroundColor = '#E5E5E5';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(192, 192, 192, 0.6)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#16A34A';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.6)';
                      }
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      if (isMegaphone) {
                        e.currentTarget.style.backgroundColor = '#C0C0C0';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(192, 192, 192, 0.3)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#22C55E';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                      }
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Purchasing:', item.name);
                    }}
                  >
                    <span>Purchase</span>
                    <span className="flex items-center gap-1">
                      ⭐{item.price}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Shop Footer */}
          <div className="text-center mt-6 pt-4 border-t" style={{ borderColor: '#1A2531' }}>
            <p style={{ color: '#A9B7C6', fontSize: '12px' }}>
              Items refresh every hour. Cross-reference with Drop Source Book for full catalog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};