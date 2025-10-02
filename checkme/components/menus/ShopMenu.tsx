import React, { useState, useMemo } from 'react';
import { X, Sparkles, Star, RefreshCw, Volume2, Zap } from 'lucide-react';
import { 
  Collectible, 
  getShopItems, 
  getRarityColor, 
  getRarityBgColor 
} from '../../utils/collectibles';

interface ShopMenuProps {
  onClose: () => void;
}

export const ShopMenu: React.FC<ShopMenuProps> = ({ onClose }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);

  // Get random selection of shop items
  const shopItems = useMemo(() => {
    const allItems = getShopItems();
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 12); // Show 12 items in shop
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePurchase = (item: Collectible) => {
    setPurchasingItem(item.id);
    setTimeout(() => {
      setPurchasingItem(null);
      alert(`Purchased ${item.name} for ${item.priceStars} Stars! ⭐`);
    }, 600);
  };

  const getRarityIcon = (rarity: string) => {
    if (rarity === 'legendary' || rarity === 'special') {
      return <Star className="w-4 h-4" fill="currentColor" />;
    }
    if (rarity === 'epic') {
      return <Zap className="w-4 h-4" fill="currentColor" />;
    }
    return <Sparkles className="w-4 h-4" />;
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
        style={{
          backgroundColor: '#0F1520',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 60px rgba(0, 245, 212, 0.15)',
        }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0f1a 100%)',
            borderBottom: '1px solid rgba(0, 245, 212, 0.2)',
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ 
                background: 'linear-gradient(90deg, #00F5D4, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ⭐ Drop Source Shop
              </h2>
              <p className="text-gray-400 text-sm">
                Purchase stickers, cards, and megaphones with Stars
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="p-3 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: 'rgba(0, 245, 212, 0.1)',
                  border: '1px solid rgba(0, 245, 212, 0.3)',
                }}
              >
                <RefreshCw className="w-5 h-5" style={{ color: '#00F5D4' }} />
              </button>
              
              <button
                onClick={onClose}
                className="p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
                style={{
                  backgroundColor: 'rgba(255, 107, 170, 0.1)',
                  border: '1px solid rgba(255, 107, 170, 0.3)',
                }}
              >
                <X className="w-5 h-5" style={{ color: '#FF6BAA' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Shop Grid */}
        <div 
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(95vh - 120px)' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shopItems.map((item) => {
              const isHovered = hoveredItem === item.id;
              const isPurchasing = purchasingItem === item.id;
              const rarityColor = getRarityColor(item.rarity);
              const rarityBg = getRarityBgColor(item.rarity);

              return (
                <div
                  key={item.id}
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: '#1a1f2e',
                    border: `2px solid ${isHovered ? rarityColor : 'rgba(255,255,255,0.1)'}`,
                    transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered 
                      ? `0 20px 40px ${rarityBg}, 0 0 30px ${rarityBg}`
                      : '0 4px 12px rgba(0,0,0,0.3)',
                    animation: isPurchasing ? 'purchase-pulse 0.6s ease-in-out' : 'none',
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Item Image Placeholder */}
                  <div 
                    className="relative h-40 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${rarityBg}, rgba(255,255,255,0.05))`,
                    }}
                  >
                    {/* Animated background effect */}
                    {isHovered && (
                      <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle at center, ${rarityColor} 0%, transparent 70%)`,
                          animation: 'pulse-glow 2s infinite',
                        }}
                      />
                    )}
                    
                    {/* Icon or emoji placeholder */}
                    <div className="relative z-10 text-6xl">
                      {item.type === 'sticker' && '🎨'}
                      {item.type === 'card' && '🃏'}
                      {item.type === 'megaphone' && '📢'}
                    </div>

                    {/* Rarity badge */}
                    <div 
                      className="absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold"
                      style={{
                        backgroundColor: rarityBg,
                        border: `1px solid ${rarityColor}`,
                        color: rarityColor,
                      }}
                    >
                      {getRarityIcon(item.rarity)}
                      {getRarityLabel(item.rarity)}
                    </div>

                    {/* Shine effect for epic/legendary */}
                    {(item.rarity === 'epic' || item.rarity === 'legendary') && (
                      <div 
                        className="absolute inset-0 opacity-40"
                        style={{
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                          animation: 'shine-sweep 3s infinite',
                        }}
                      />
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="p-4">
                    <h3 
                      className="font-bold text-sm mb-1 truncate"
                      style={{ color: '#F5F7FF' }}
                    >
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>{item.serial}</span>
                      <span>{item.totalSupply} total</span>
                    </div>

                    {item.description && isHovered && (
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={isPurchasing}
                      className="w-full py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      style={{
                        background: isPurchasing 
                          ? 'rgba(0, 245, 212, 0.5)'
                          : 'linear-gradient(135deg, #00F5D4, #A78BFA)',
                        color: '#0F1520',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {isPurchasing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Purchasing...
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4" fill="currentColor" />
                          {item.priceStars} Stars
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes shine-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes purchase-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
