import React, { useState } from 'react';
import { X, Minimize2, Gavel, RefreshCw, ShoppingCart, Sparkles, Star, Zap } from 'lucide-react';
import { 
  Collectible, 
  getScrapbookCollectibles, 
  getRarityColor, 
  getRarityBgColor,
  buildImagePath,
  imageRegistry
} from '../../utils/collectibles';
import { ImageBlock } from '../SmartImage';

interface ScrapbookMenuProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onFocus: () => void;
  width: number;
  height: number;
  zIndex: number;
}

export const ScrapbookMenu: React.FC<ScrapbookMenuProps> = ({
  onClose,
  onMinimize,
  initialPosition,
  onPositionChange,
  onFocus,
  width,
  height,
  zIndex
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'stickers' | 'cards'>('all');

  // Simulate user's collection (in real app, this would come from user data)
  const userCollection = getScrapbookCollectibles();

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    if (target.closest('.scrapbook-content')) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleAuction = (item: Collectible) => {
    console.log('Auction item:', item);
  };

  const handleTrade = (item: Collectible) => {
    console.log('Trade item:', item);
  };

  const getRarityIcon = (rarity: string) => {
    if (rarity === 'legendary') {
      return <Star className="w-3 h-3" fill="currentColor" />;
    }
    if (rarity === 'epic') {
      return <Zap className="w-3 h-3" fill="currentColor" />;
    }
    return <Sparkles className="w-3 h-3" />;
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  const filteredCollection = userCollection.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'stickers') return item.type === 'sticker';
    if (activeFilter === 'cards') return item.type === 'card';
    return true;
  });


  return (
    <div
      className="fixed rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        backgroundColor: '#0F1520',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        boxShadow: '0 0 40px rgba(167, 139, 250, 0.2)',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onClick={onFocus}
    >
      {/* Header */}
      <div 
        className="h-14 px-4 flex items-center justify-between border-b cursor-move select-none"
        style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0f1a 100%)',
          borderBottom: '1px solid rgba(167, 139, 250, 0.2)',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📔</span>
          <h3 className="text-xl font-bold" style={{ 
            background: 'linear-gradient(90deg, #A78BFA, #FF6BAA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            My Scrapbook
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: 'rgba(167, 139, 250, 0.1)',
              border: '1px solid rgba(167, 139, 250, 0.2)',
              color: '#A78BFA',
            }}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b" style={{ borderColor: 'rgba(167, 139, 250, 0.2)' }}>
        {(['all', 'stickers', 'cards'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 capitalize"
            style={{
              backgroundColor: activeFilter === filter ? 'rgba(167, 139, 250, 0.1)' : 'transparent',
              color: activeFilter === filter ? '#A78BFA' : '#9CA3AF',
              borderBottom: activeFilter === filter ? '2px solid #A78BFA' : '2px solid transparent',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Collection Grid */}
      <div 
        className="flex-1 p-4 overflow-y-auto scrapbook-content"
        style={{ backgroundColor: '#0a0f1a' }}
      >
        <div className="grid grid-cols-3 gap-4">
          {filteredCollection.filter(item => item.image || imageRegistry[item.id]).map((item) => {
            const isHovered = hoveredItem === item.id;
            const rarityColor = getRarityColor(item.rarity);
            const rarityBg = getRarityBgColor(item.rarity);

            return (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: '#1a1f2e',
                  border: `2px solid ${rarityColor}`,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered 
                    ? `0 15px 30px ${rarityBg}`
                    : `0 4px 12px ${rarityBg}`,
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Fixed Container - defines panel boundaries */}
                <div 
                  className="relative w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${rarityBg}, rgba(255,255,255,0.03))`,
                  }}
                >
                  {/* Background Hover Effect (subtle) - behind shine */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 z-10"
                      style={{
                        background: `radial-gradient(circle at center, ${rarityColor}22 0%, transparent 60%)`, // 22 hex = low alpha
                        animation: 'pulse 2s infinite',
                        pointerEvents: 'none'
                      }}
                    />
                  )}

                  {/* Image Container - let ImageBlock handle the square aspect ratio */}
                  <div 
                    className="relative z-20"
                    style={{ pointerEvents: 'none' }}
                  >
                    {(() => {
                      const src = item.image || buildImagePath(item);

                      if (!src) return null;

                      const lowerName = item.name?.toLowerCase() || '';
                      const isPixel = lowerName.includes('pixel');
                      const isLuca = lowerName.includes('luca');

                      return (
                        <ImageBlock
                          src={src}
                          alt={item.name}
                          pixelated={isPixel}
                        />
                      );
                    })()}
                  </div>

                  {/* Shine effect - always visible for legendary items */}
                  {(item.rarity === 'legendary') && (
                    <div 
                      className="absolute inset-0 opacity-40 z-30"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        animation: 'shine 2s ease-in-out infinite',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Rarity Badge - TOP LEFT with colored border like DropSourceBook */}
                  <div 
                    className="absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold z-40"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: `2px solid ${rarityColor}`,
                      color: rarityColor,
                      backdropFilter: 'blur(4px)',
                      boxShadow: `0 0 8px ${rarityColor}80`
                    }}
                  >
                    {getRarityIcon(item.rarity)}
                    {getRarityLabel(item.rarity)}
                  </div>

                  {/* Serial Number - BOTTOM RIGHT with colored border - UPDATED */}
                  <div 
                    className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold z-40"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: `2px solid ${rarityColor}`,
                      color: rarityColor,
                      backdropFilter: 'blur(4px)',
                      boxShadow: `0 0 8px ${rarityColor}80`
                    }}
                  >
                    {item.serial}
                  </div>
                </div>

                {/* Item Info & Actions */}
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-2 truncate" style={{ color: '#F5F7FF' }}>
                    {item.name}
                  </h4>
                  
                  {item.creator && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-400">
                        by {item.creator.displayName}
                      </p>
                      {item.creator.portfolio && (
                        <a
                          href={item.creator.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          @{item.creator.redditUsername}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {(item.name === 'Pixel Art' || item.name === 'Luca') && (
                    <p className="text-xs text-gray-300 mb-2">
                      {item.name === 'Pixel Art' 
                        ? 'The FIRST DESIGN FOR DROP SOURCE❤️❤️❤️❤️'
                        : 'ask me about my elmo impression'
                      }
                    </p>
                  )}

                  {/* Value Display */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#A9B7C6', fontSize: '11px', textTransform: 'capitalize' }}>
                        {item.type}
                      </span>
                      <span style={{ color: '#00FF00', fontSize: '11px', fontWeight: '600' }}>
                        ${item.rarity === 'legendary' ? 15 : item.rarity === 'epic' ? 12 : item.rarity === 'rare' ? 10 : 5}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAuction(item)}
                        className="px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                          color: '#fbbf24',
                        }}
                      >
                        <Gavel className="w-3 h-3" />
                        Auction
                      </button>

                      <button
                        onClick={() => handleTrade(item)}
                        className="px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#3b82f6',
                        }}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Trade
                      </button>
                    </div>

                    {(item.price || item.rarity === 'legendary') && (
                      <a
                        href={item.creator?.portfolio || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 w-full cursor-pointer"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          color: '#22c55e',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Buy Physical {item.price ? `$${item.price}` : 'Contact Creator'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.5; }
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes ds-shine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        /* apply the animation */
        .legendary-shine {
          animation: ds-shine 2.0s linear infinite;
        }

        /* optional: make card hover pop nicer */
        .scrap-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 18px 40px rgba(2,6,23,0.7); }
      `}</style>
    </div>
  );
};