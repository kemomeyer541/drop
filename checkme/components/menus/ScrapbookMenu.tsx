import React, { useState } from 'react';
import { X, Minimize2, Gavel, RefreshCw, ShoppingCart, Sparkles, Star, Zap } from 'lucide-react';
import { 
  Collectible, 
  getScrapbookCollectibles, 
  getRarityColor, 
  getRarityBgColor,
  buildImagePath
} from '../../utils/collectibles';

interface ScrapbookMenuProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  width: number;
  height: number;
  zIndex: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onFocus: () => void;
}

export function ScrapbookMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: ScrapbookMenuProps) {
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
    alert(`Listing ${item.name} for auction! 🔨`);
  };

  const handleTrade = (item: Collectible) => {
    alert(`Opening trade window for ${item.name}! 🔄`);
  };

  const handlePurchasePhysical = (item: Collectible) => {
    if (item.priceDollars) {
      alert(`Purchasing physical ${item.name} for $${item.priceDollars}! 📦`);
    }
  };

  const getRarityIcon = (rarity: string) => {
    if (rarity === 'legendary' || rarity === 'special') {
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
          <span className="text-sm text-gray-400">
            {filteredCollection.length} items
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onMinimize}
            className="p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <Minimize2 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all hover:rotate-90"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex gap-2">
          {['all', 'stickers', 'cards'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
              style={{
                backgroundColor: activeFilter === filter 
                  ? 'rgba(167, 139, 250, 0.2)' 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeFilter === filter ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
                color: activeFilter === filter ? '#A78BFA' : '#9ca3af',
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Collection Grid */}
      <div 
        className="flex-1 p-4 overflow-y-auto scrapbook-content"
        style={{ backgroundColor: '#0a0f1a' }}
      >
        <div className="grid grid-cols-3 gap-4">
          {filteredCollection.map((item) => {
            const isHovered = hoveredItem === item.id;
            const rarityColor = getRarityColor(item.rarity);
            const rarityBg = getRarityBgColor(item.rarity);
            // Use flexible sizing - container will adapt to available space

            return (
              <div
                key={item.id}
                className="relative rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: '#1a1f2e',
                  border: `2px solid ${isHovered ? rarityColor : 'rgba(255,255,255,0.1)'}`,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isHovered 
                    ? `0 15px 30px ${rarityBg}`
                    : '0 4px 12px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Fixed Container - defines panel boundaries */}
                <div 
                  className="relative aspect-square w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${rarityBg}, rgba(255,255,255,0.05))`,
                  }}
                >
                  {isHovered && (
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `radial-gradient(circle at center, ${rarityColor} 0%, transparent 70%)`,
                        animation: 'pulse 2s infinite',
                      }}
                    />
                  )}
                  
                  {/* Image Container - absolutely positioned to fill container */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    {(() => {
                      const imgSrc = item.image ? item.image : buildImagePath(item);
                      return imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          style={{ 
                            filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                            imageRendering: item.name === 'Pixel Art' ? 'pixelated' : 'auto'
                          }}
                          onLoad={() => console.log('Checkme Scrapbook SUCCESS:', item.id, imgSrc)}
                          onError={() => console.log('Checkme Scrapbook ERROR:', item.id, imgSrc)}
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-4xl"
                              style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}>
                          {item.type === 'sticker' ? '🎨' : item.type === 'card' ? '🃏' : item.type === 'megaphone' ? '📢' : '❔'}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Rarity Badge */}
                  <div 
                    className="absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold z-40"
                    style={{
                      backgroundColor: rarityBg,
                      border: `1px solid ${rarityColor}`,
                      color: rarityColor,
                    }}
                  >
                    {getRarityIcon(item.rarity)}
                    {getRarityLabel(item.rarity)}
                  </div>

                  {/* Serial Number */}
                  {isHovered && (
                    <div 
                      className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: rarityColor,
                      }}
                    >
                      {item.serial}
                    </div>
                  )}

                  {/* Shine effect for rare items */}
                  {(item.rarity === 'epic' || item.rarity === 'legendary') && (
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                        animation: 'shine 3s infinite',
                      }}
                    />
                  )}
                </div>

                {/* Item Info & Actions */}
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-2 truncate" style={{ color: '#F5F7FF' }}>
                    {item.name}
                  </h4>

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

                    {item.priceDollars && (
                      <button
                        onClick={() => handlePurchasePhysical(item)}
                        className="px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 w-full"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          color: '#22c55e',
                        }}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Buy Physical ${item.priceDollars}
                      </button>
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
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
