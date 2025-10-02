import React, { useState } from 'react';
import { X, Minimize2, BookOpen, ShoppingCart, Sparkles, Star, Zap } from 'lucide-react';
import { 
  COLLECTIBLES_POOL, 
  getRarityColor, 
  getRarityBgColor,
  buildImagePath
} from '../../utils/collectibles';

interface DropSourceBookMenuProps {
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

export function DropSourceBookMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: DropSourceBookMenuProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'stickers' | 'cards'>('all');

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    if (target.closest('.book-content')) return;
    
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

  const handlePurchasePhysical = (item: typeof COLLECTIBLES_POOL[0]) => {
    if (item.priceDollars && item.type === 'sticker') {
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

  // Filter all collectibles
  const filteredItems = COLLECTIBLES_POOL.filter(item => {
    if (activeFilter === 'all') return item.type !== 'megaphone'; // Exclude megaphones from book
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
        border: '1px solid rgba(0, 245, 212, 0.3)',
        boxShadow: '0 0 40px rgba(0, 245, 212, 0.2)',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onClick={onFocus}
    >
      {/* Header */}
      <div 
        className="h-14 px-4 flex items-center justify-between border-b cursor-move select-none"
        style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0f1a 100%)',
          borderBottom: '1px solid rgba(0, 245, 212, 0.2)',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6" style={{ color: '#00F5D4' }} />
          <div>
            <h3 className="text-xl font-bold" style={{ 
              background: 'linear-gradient(90deg, #00F5D4, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Drop Source Book
            </h3>
            <p className="text-xs text-gray-400">Complete catalog of all collectibles</p>
          </div>
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
                  ? 'rgba(0, 245, 212, 0.2)' 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeFilter === filter ? '#00F5D4' : 'rgba(255,255,255,0.1)'}`,
                color: activeFilter === filter ? '#00F5D4' : '#9ca3af',
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-2 text-xs opacity-60">
                ({filter === 'all' 
                  ? COLLECTIBLES_POOL.filter(i => i.type !== 'megaphone').length 
                  : COLLECTIBLES_POOL.filter(i => i.type === (filter === 'stickers' ? 'sticker' : 'card')).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Book Catalog */}
      <div 
        className="flex-1 p-4 overflow-y-auto book-content"
        style={{ backgroundColor: '#0a0f1a' }}
      >
        <div className="grid grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const isHovered = hoveredItem === item.id;
            const rarityColor = getRarityColor(item.rarity);
            const rarityBg = getRarityBgColor(item.rarity);
            const canPurchasePhysical = item.type === 'sticker' && item.priceDollars;

            return (
              <div
                key={item.id}
                className="relative rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: '#1a1f2e',
                  border: `2px solid ${isHovered ? rarityColor : 'rgba(255,255,255,0.1)'}`,
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered 
                    ? `0 12px 24px ${rarityBg}`
                    : '0 2px 8px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Item Preview */}
                <div 
                  className="relative flex items-center justify-center aspect-square w-full"
                  style={{
                    background: `linear-gradient(135deg, ${rarityBg}, rgba(255,255,255,0.03))`,
                  }}
                >
                  {isHovered && (
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(circle, ${rarityColor} 0%, transparent 70%)`,
                        animation: 'pulse 2s infinite',
                      }}
                    />
                  )}
                  
                  {(() => {
                    const imgSrc = item.image || buildImagePath(item);
                    return imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="z-10 w-full h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                          imageRendering: item.name === 'Pixel Art' ? 'pixelated' : 'auto'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null;
                  })()}
                  <span
                    className="z-10 hidden w-full h-full flex items-center justify-center text-4xl"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}
                  >
                    {item.type === 'sticker' ? '🎨' : item.type === 'card' ? '🃏' : '❔'}
                  </span>

                  {/* Rarity Badge */}
                  <div 
                    className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold"
                    style={{
                      backgroundColor: rarityBg,
                      border: `1px solid ${rarityColor}`,
                      color: rarityColor,
                      fontSize: '10px',
                    }}
                  >
                    {getRarityIcon(item.rarity)}
                    {getRarityLabel(item.rarity)}
                  </div>

                  {/* Serial Number (shown on hover) */}
                  {isHovered && (
                    <div 
                      className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: rarityColor,
                        fontSize: '10px',
                      }}
                    >
                      {item.serial}
                    </div>
                  )}

                  {/* Shine effect */}
                  {(item.rarity === 'epic' || item.rarity === 'legendary') && (
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        animation: 'shine 4s infinite',
                      }}
                    />
                  )}
                </div>

                {/* Item Info */}
                <div className="p-2">
                  <h4 
                    className="font-bold text-xs mb-1 truncate" 
                    style={{ color: '#F5F7FF' }}
                    title={item.name}
                  >
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{item.type}</span>
                    <span className="text-xs">{item.totalSupply} exist</span>
                  </div>

                  {/* Purchase Button (only for stickers) */}
                  {canPurchasePhysical ? (
                    <button
                      onClick={() => handlePurchasePhysical(item)}
                      className="w-full py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                      }}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Physical ${item.priceDollars}
                    </button>
                  ) : (
                    <div 
                      className="w-full py-1.5 px-2 rounded-md text-xs text-center"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        color: '#6b7280',
                      }}
                    >
                      {item.type === 'card' ? 'Not for physical sale' : 'Digital only'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
      `}</style>
    </div>
  );
}
