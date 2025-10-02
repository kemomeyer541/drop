import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Star, X, Move, Square } from 'lucide-react';
import { RARITY_COLORS, getRarityStyle, getRarityLabel } from '../utils/rarityColors';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StarShopProps {
  onClose: () => void;
  onMinimize?: () => void;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  zIndex?: number;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onFocus?: () => void;
}

const shopItems = [
  {
    id: 1,
    name: "Drake's Condom Sauce",
    price: 42,
    imageUrl: 'https://images.unsplash.com/photo-1609344553637-ee6623677e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGphciUyMGdvbGRlbnxlbnwxfHx8fDE3NTc5Mjg3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'buyer: drakeshotsauce',
    rarity: 'legendary',
    description: 'The secret sauce that makes everything smooth',
    serialNumber: 69,
    dateMinted: '2024-01-15'
  },
  {
    id: 2,
    name: 'True Bruh Moment',
    price: 404,
    imageUrl: 'https://images.unsplash.com/photo-1629875832611-c14e072d7380?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4JTIwYnV0dG9uJTIwZXJyb3IlMjByZWR8ZW58MXx8fHwxNzU3OTg1MTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'buyer: imaginepaying4stickers',
    rarity: 'epic',
    description: 'For when the code just refuses to work',
    serialNumber: 404,
    dateMinted: '2024-01-12'
  },
  {
    id: 3,
    name: 'Weeb Crack',
    price: 177013,
    imageUrl: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwb3BlbiUyMGFjYWRlbWljfGVufDF8fHx8MTc1Nzk4NTE0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'buyer: hentaiwthetentacles',
    rarity: 'mythic',
    description: 'Highly addictive reading material (age restricted)',
    serialNumber: 177013,
    dateMinted: '2024-01-01'
  },
  {
    id: 4,
    name: 'Virgin Hotline',
    price: 911,
    imageUrl: 'https://images.unsplash.com/photo-1535882743347-fa16a8c3e48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHZpbnRhZ2UlMjByZXRyb3xlbnwxfHx8fDE3NTc5ODUxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'buyer: robloxrealgirl',
    rarity: 'rare',
    description: 'Emergency contact for desperate times',
    serialNumber: 911,
    dateMinted: '2024-01-10'
  },
  {
    id: 5,
    name: 'Golden Flare: [Bussin Bussin]',
    price: 123456,
    imageUrl: 'https://images.unsplash.com/photo-1574547887997-904252c06ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwc3RhciUyMHNwYXJrbGV8ZW58MXx8fHwxNzU3OTg1MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'buyer: starshopper',
    rarity: 'legendary',
    description: 'When your beats are absolutely bussin',
    serialNumber: 1,
    dateMinted: '2024-01-02'
  },
  {
    id: 6,
    name: 'LOUDER THAN UR MOM',
    price: 69420,
    imageUrl: 'https://images.unsplash.com/photo-1722171098271-185f35942797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWdhcGhvbmUlMjBzcGVha2VyJTIwbG91ZHxlbnwxfHx8fDE3NTc5ODUxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'buyer: momsgarage',
    rarity: 'legendary',
    description: 'Warning: May cause permanent hearing damage',
    serialNumber: 420,
    dateMinted: '2024-01-08'
  },
  {
    id: 7,
    name: 'Secret Sauce Packet (Do Not Open)',
    price: 42,
    imageUrl: 'https://images.unsplash.com/photo-1609344553637-ee6623677e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGphciUyMGdvbGRlbnxlbnwxfHx8fDE3NTc5Mjg3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'seriously, do not open this',
    rarity: 'common',
    description: 'Contents unknown. Warranty void if opened.',
    serialNumber: 42,
    dateMinted: '2024-01-14'
  },
  {
    id: 8,
    name: 'Forbidden Manga Collector\'s Badge',
    price: 177013,
    imageUrl: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwb3BlbiUyMGFjYWRlbWljfGVufDF8fHx8MTc1Nzk4NTE0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'shows everyone your questionable taste',
    rarity: 'epic',
    description: 'Marks you as a person of culture (derogatory)',
    serialNumber: 1337,
    dateMinted: '2023-12-31'
  },
  {
    id: 9,
    name: 'Emergency Phone-a-Member Credit',
    price: 911,
    imageUrl: 'https://images.unsplash.com/photo-1535882743347-fa16a8c3e48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHZpbnRhZ2UlMjByZXRyb3xlbnwxfHx8fDE3NTc5ODUxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tooltip: 'when you need backup ASAP',
    rarity: 'common',
    description: 'Call in reinforcements when things get rough',
    serialNumber: 2024,
    dateMinted: '2024-01-05'
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return '#6B7280'; // gray
    case 'rare': return '#60A5FA'; // blue
    case 'epic': return '#A855F7'; // purple
    case 'legendary': return '#F59E0B'; // gold
    case 'mythic': return '#EF4444'; // red
    default: return '#6B7280';
  }
};

const getRarityTextColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'text-gray-400 border-gray-400';
    case 'rare': return 'text-blue-400 border-blue-400';
    case 'epic': return 'text-purple-400 border-purple-400';
    case 'legendary': return 'text-yellow-400 border-yellow-400';
    case 'mythic': return 'text-red-400 border-red-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

const currentStars = 15420; // Mock user's current stars

// Enhanced dopamine features
const DAILY_BONUS_MULTIPLIER = 1.5;
const STREAK_BONUS_MULTIPLIER = 2.0;
const RARE_PURCHASE_BONUS = 100;

export function StarShop({ 
  onClose, 
  onMinimize,
  initialPosition = { x: 100, y: 100 },
  width = 500,
  height = 600,
  zIndex = 1000,
  onPositionChange,
  onSizeChange,
  onFocus
}: StarShopProps) {
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Enhanced dopamine features
  const [userStars, setUserStars] = useState(currentStars);
  const [purchaseStreak, setPurchaseStreak] = useState(0);
  const [lastPurchaseTime, setLastPurchaseTime] = useState<Date | null>(null);
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false);
  const [recentPurchase, setRecentPurchase] = useState<string | null>(null);

  const purchaseItem = (itemId: number) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.price <= userStars && !purchasedItems.includes(itemId)) {
      // Calculate bonus stars based on rarity and streak
      let bonusStars = 0;
      if (item.rarity === 'legendary' || item.rarity === 'mythic') {
        bonusStars = RARE_PURCHASE_BONUS;
      }
      
      // Check for daily bonus
      const now = new Date();
      const isDailyBonus = !lastPurchaseTime || 
        (now.getTime() - lastPurchaseTime.getTime()) > 24 * 60 * 60 * 1000;
      
      if (isDailyBonus) {
        bonusStars += Math.floor(item.price * (DAILY_BONUS_MULTIPLIER - 1));
      }
      
      // Check for streak bonus
      if (purchaseStreak > 0) {
        bonusStars += Math.floor(item.price * (STREAK_BONUS_MULTIPLIER - 1));
      }
      
      // Update state
      setPurchasedItems(prev => [...prev, itemId]);
      setUserStars(prev => prev - item.price + bonusStars);
      setPurchaseStreak(prev => prev + 1);
      setLastPurchaseTime(now);
      setRecentPurchase(item.name);
      setShowPurchaseAnimation(true);
      
      // Show enhanced purchase confirmation with dopamine boost
      const bonusText = bonusStars > 0 ? ` +${bonusStars} bonus stars!` : '';
      const streakText = purchaseStreak > 0 ? ` (${purchaseStreak + 1} streak!)` : '';
      alert(`🎉 Successfully purchased ${item.name}!${bonusText}${streakText} Check your backpack.`);
      
      // Hide animation after 3 seconds
      setTimeout(() => setShowPurchaseAnimation(false), 3000);
    } else if (purchasedItems.includes(itemId)) {
      alert('You already own this item!');
    } else {
      alert('Not enough stars!');
    }
  };

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.shop-content')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus?.();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
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

  return (
    <TooltipProvider>
      <div 
        className={`fixed dropsource-floating-card ${isDragging ? 'dragging' : ''} flex flex-col`}
        style={{
          left: position.x,
          top: position.y,
          width,
          height,
          zIndex,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={onFocus}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between border-b cursor-move" 
          style={{ 
            padding: 'calc(var(--spacing-unit) * 2)',
            borderBottomColor: 'var(--dropsource-border)'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center dropsource-spacing-md">
            <Star className="w-6 h-6 dropsource-icon-outlined" style={{ color: 'var(--dropsource-brand)' }} />
            <h2 className="dropsource-text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600', letterSpacing: '-0.02em' }}>Star Shop</h2>
          </div>
          <div className="flex items-center dropsource-spacing-lg">
            <div className="flex items-center dropsource-spacing-xs">
              <Star className="w-5 h-5 dropsource-icon-outlined" style={{ color: 'var(--dropsource-brand)' }} />
              <span className="dropsource-text-primary" style={{ fontSize: 'var(--text-md)', fontWeight: '600' }}>
                {userStars.toLocaleString()}⭐
              </span>
              {purchaseStreak > 0 && (
                <span className="ml-2 px-2 py-1 rounded text-xs font-bold" style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  🔥 {purchaseStreak} streak
                </span>
              )}
            </div>
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="dropsource-toolbar-button dropsource-focus-visible hover:border-blue-500 hover:text-blue-400"
                style={{ width: '32px', height: '32px', padding: '0' }}
              >
                <Square className="w-4 h-4 dropsource-icon-outlined" />
              </button>
            )}
            <button
              onClick={onClose}
              className="dropsource-toolbar-button dropsource-focus-visible hover:border-red-500 hover:text-red-400"
              style={{ width: '32px', height: '32px', padding: '0' }}
            >
              <X className="w-5 h-5 dropsource-icon-outlined" />
            </button>
          </div>
        </div>

        {/* Shop Content */}
        <div className="flex-1 overflow-hidden shop-content" style={{ padding: 'calc(var(--spacing-unit) * 2)' }}>
          <ScrollArea className="h-full dropsource-custom-scrollbar">
            <div className="dropsource-grid dropsource-grid-3">
              {shopItems.map((item) => (
                <div 
                  key={item.id} 
                  className="dropsource-collectible-card dropsource-clickable relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    transform: hoveredItem === item.id ? 'translateY(-2px) rotateX(2deg)' : 'translateY(0) rotateX(0deg)',
                    boxShadow: hoveredItem === item.id 
                      ? `0 8px 32px ${getRarityColor(item.rarity)}40` 
                      : undefined,
                    transition: 'all 200ms ease-out',
                    borderColor: getRarityColor(item.rarity)
                  }}
                >
                  {/* Serial Number Overlay - Show on Hover */}
                  {hoveredItem === item.id && item.serialNumber && (
                    <div
                      className="absolute top-2 right-2 z-10"
                      style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: getRarityColor(item.rarity),
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sharp)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: '600',
                        boxShadow: `0 0 12px ${getRarityColor(item.rarity)}`,
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${getRarityColor(item.rarity)}`,
                        animation: 'fadeInSmooth 200ms ease-out'
                      }}
                    >
                      #{item.serialNumber}
                    </div>
                  )}

                  <div className="dropsource-spacing-md flex flex-col">
                    {/* Item Header */}
                    <div className="flex items-start dropsource-spacing-md">
                      <div style={{ minWidth: '48px', height: '48px' }}>
                        <ImageWithFallback 
                          src={item.imageUrl}
                          alt={item.name}
                          width={48}
                          height={48}
                          style={{
                            borderRadius: 'var(--radius-sharp)',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="dropsource-text-primary" style={{ 
                          fontSize: 'var(--text-sm)', 
                          fontWeight: '600',
                          lineHeight: '1.3'
                        }}>
                          {item.name}
                        </h3>
                        <span className={`dropsource-surface px-2 py-1 ${getRarityTextColor(item.rarity)}`} style={{ 
                          fontSize: 'var(--text-xs)',
                          borderRadius: 'var(--radius-sharp)',
                          display: 'inline-block',
                          marginTop: 'calc(var(--spacing-unit) * 0.5)',
                          border: '1px solid'
                        }}>
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)', lineHeight: '1.4' }}>
                      {item.description}
                    </p>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center dropsource-spacing-xs">
                        <Star className="w-4 h-4 dropsource-icon-outlined" style={{ color: 'var(--dropsource-brand)' }} />
                        <span className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                          {item.price >= 1000 ? `${(item.price / 1000).toFixed(0)}k` : item.price}⭐
                        </span>
                      </div>
                      
                      <div className="flex dropsource-spacing-xs">
                        {purchasedItems.includes(item.id) ? (
                          <span className="dropsource-surface px-2 py-1 text-green-400" style={{ 
                            fontSize: 'var(--text-xs)',
                            borderRadius: 'var(--radius-sharp)',
                            fontWeight: '600'
                          }}>
                            Owned
                          </span>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => purchaseItem(item.id)}
                                disabled={item.price > userStars}
                                className="dropsource-btn-primary dropsource-focus-visible"
                                style={{ 
                                  fontSize: 'var(--text-xs)', 
                                  padding: 'calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5)',
                                  opacity: item.price > userStars ? '0.5' : '1',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                              >
                                {showPurchaseAnimation && recentPurchase === item.name && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"></div>
                                )}
                                <span className="relative z-10">Buy</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>



        {/* Special Offers Footer */}
        <div className="border-t text-center" style={{ 
          borderTopColor: 'var(--dropsource-border)',
          padding: 'calc(var(--spacing-unit) * 2)',
          background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(219, 39, 119, 0.1))'
        }}>
          <p className="dropsource-text-secondary" style={{ 
            fontSize: 'var(--text-xs)',
            marginBottom: 'calc(var(--spacing-unit) * 0.5)'
          }}>
            🔥 Limited Time: Double XP Weekend! 🔥
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--dropsource-brand)' }}>
            ⭐ Earn 2x stars on all completed challenges ⭐
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}