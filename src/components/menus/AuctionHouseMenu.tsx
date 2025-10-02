import React, { useState, useEffect } from 'react';
import { Clock, Users, Star, TrendingUp, Trophy, User, Zap, Filter, ChevronDown, ChevronUp, Shield, X, Minimize2, Timer, Sparkles, Gavel } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FloatingCard } from '../FloatingCard';
import { upsertPrepend, normalize, FeedItem } from '../../utils/feed';
import { getAuctionCollectibles, getRarityColor, getRarityBgColor, buildImagePath, imageRegistry } from '../../utils/collectibles';
import { ImageBlock } from '../SmartImage';

interface AuctionHouseMenuProps {
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

// Mock auction data with the new rarity system - Only Rare/Epic/Legendary items
const AUCTION_ITEMS = getAuctionCollectibles().map((item, index) => ({
  id: item.id, // Keep original ID for image registry lookup
  name: item.name,
  sticker: item.name,
  rarity: item.rarity,
  type: item.type,
  serial: item.serial,
  totalSupply: item.totalSupply,
  currentBid: Math.floor(Math.random() * 500) + 100,
  timeLeft: Math.floor(Math.random() * 3600) + 300, // 5 minutes to 1 hour
  bidCount: Math.floor(Math.random() * 15) + 3,
  thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop',
  highestBidder: ['MegaCollector', 'StickerKing', 'RareHunter', 'EliteTrader'][Math.floor(Math.random() * 4)]
}));

const BIDDER_NAMES = ['MegaCollector', 'StickerKing', 'RareHunter', 'EliteTrader', 'CardMaster', 'EpicSeeker', 'LegendHunter'];

export const AuctionHouseMenu: React.FC<AuctionHouseMenuProps> = ({ 
  onClose, 
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [liveTicker, setLiveTicker] = useState<string[]>([]);
  const [items, setItems] = useState(AUCTION_ITEMS);

  // Update timers and simulate live bidding
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      
      setItems(prevItems => 
        prevItems.map(item => {
          const newTimeLeft = item.timeLeft - 1;
          
          // No automatic bidding - only show activity when user bids
          
          return {
            ...item,
            timeLeft: newTimeLeft
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return 'ENDED';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${remainingSeconds}s`;
  };

  const getTimeLeftColor = (seconds: number): string => {
    if (seconds <= 30) return '#EF4444'; // Red - urgent
    if (seconds <= 120) return '#F59E0B'; // Orange - warning
    return '#22C55E'; // Green - safe
  };

  const getRarityIcon = (rarity: string) => {
    if (rarity === 'legendary' || rarity === 'epic') {
      return <Star className="w-4 h-4" fill="currentColor" />;
    }
    return <Sparkles className="w-4 h-4" />;
  };

  const getTypeIcon = (type: string) => {
    return type === 'sticker' ? '🎨' : '♦️';
  };

  const handlePlaceBid = (itemId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const bidIncrement = 5; // User bids ⭐5 more
          const newBid = item.currentBid + bidIncrement;
          
          // Only add to ticker if this item has an image (is visible)
          if (item.image || imageRegistry[item.id]) {
            setLiveTicker(prev => [
              `You bid ⭐${newBid} on ${item.name}`,
              ...prev.slice(0, 4)
            ]);
          }
          
          return {
            ...item,
            currentBid: newBid,
            highestBidder: 'You',
            bidCount: item.bidCount + 1
          };
        }
        return item;
      });
      
      return updatedItems;
    });
  };

  return (
    <FloatingCard
      title={
        <>
          <span className="text-2xl">🏛️</span>{' '}
          <span 
            className="font-bold text-xl"
            style={{
              background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Live Auction House
          </span>
        </>
      }
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      width={width ? width + 50 : 650}
      height={height}
      zIndex={zIndex}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onFocus={onFocus}
      noBorder={true}
    >
      <div className="h-full flex flex-col auction-content" data-no-drag style={{ 
        backgroundColor: '#0a0f1a',
        padding: '0',
        border: 'none',
        outline: 'none'
      }}>
        {/* Header with live indicator */}
        <div className="flex items-center justify-between mb-3 px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)'
            }}>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 text-xs font-bold">LIVE</span>
            </div>
          </div>
          <div className="text-xs" style={{ color: '#FBBF24' }}>
            🏆 Live Auctions
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto dropsource-custom-scrollbar" style={{ 
          padding: '0 20px 16px 20px'
        }}>
          {/* Live Activity Ticker */}
          <div className="mb-4 p-3 rounded-xl" style={{
            backgroundColor: 'rgba(26, 31, 46, 0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 text-xs font-bold">Activity</span>
            </div>
            <div className="h-4 overflow-hidden">
              {liveTicker.length > 0 ? (
                <div className="animate-slideUp">
                  <p className="text-gray-300 text-xs">
                    {liveTicker[0]}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-xs opacity-60">
                  No recent activity
                </p>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mb-4 p-3 rounded-xl" style={{
            backgroundColor: 'rgba(26, 31, 46, 0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-white text-sm font-bold">
                  {items.length}
                </div>
                <div className="text-gray-400 text-xs">Active</div>
              </div>
              <div>
                <div className="text-yellow-400 text-sm font-bold">
                  ⭐{items.reduce((sum, item) => sum + item.currentBid, 0)}
                </div>
                <div className="text-gray-400 text-xs">Value</div>
              </div>
              <div>
                <div className="text-blue-400 text-sm font-bold">
                  {Math.max(...items.map(item => item.bidCount))}
                </div>
                <div className="text-gray-400 text-xs">Bids</div>
              </div>
              <div>
                <div className="text-red-400 text-sm font-bold">
                  {items.filter(item => item.timeLeft <= 60).length}
                </div>
                <div className="text-gray-400 text-xs">Ending</div>
              </div>
            </div>
          </div>

          {/* Auction Items Grid - Scrapbook Style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" style={{ margin: '0 -4px' }}>
            {items.filter(item => item.image || imageRegistry[item.id]).map(item => {
              const timeLeftColor = getTimeLeftColor(item.timeLeft);
              const isEnding = item.timeLeft <= 60;
              
              const rarityColor = getRarityColor(item.rarity);
              const rarityBg = getRarityBgColor(item.rarity);
              
              return (
                <div
                  key={item.id}
                  className="relative rounded-xl overflow-hidden transition-all duration-300 group"
                  style={{
                    backgroundColor: '#1a1f2e',
                    border: `2px solid ${isEnding ? '#EF4444' : rarityColor}`,
                    transform: 'scale(1)',
                    boxShadow: isEnding 
                      ? '0 0 20px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
                      : `0 4px 12px ${rarityBg}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = isEnding 
                      ? '0 0 30px rgba(239, 68, 68, 0.6), 0 15px 30px rgba(0,0,0,0.4)'
                      : `0 15px 30px ${rarityBg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = isEnding 
                      ? '0 0 20px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
                      : `0 4px 12px ${rarityBg}`;
                  }}
                >
                  {/* Fixed Container - defines panel boundaries */}
                  <div 
                    className="relative w-full overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${rarityBg}, rgba(255,255,255,0.03))`,
                    }}
                  >
                    {/* Background Hover Effect (subtle) - behind shine */}
                    <div 
                      className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${rarityColor}22 0%, transparent 60%)`,
                        animation: 'pulse 2s infinite',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Image Container - let ImageBlock handle the square aspect ratio */}
                    <div 
                      className="relative z-20"
                      style={{ pointerEvents: 'none' }}
                    >
                      {(() => {
                        const imgSrc = item.image || buildImagePath(item);
                        if (!imgSrc) return null;
                        
                        const lowerName = item.name?.toLowerCase() || '';
                        const isPixel = lowerName.includes('pixel');
                        
                        return (
                          <ImageBlock
                            src={imgSrc}
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


                    {/* Ending Soon Overlay */}
                    {isEnding && (
                      <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-pulse z-40 pointer-events-none"></div>
                    )}
                  </div>

                  {/* Rarity Badge - TOP LEFT of image area */}
                  <div 
                    className="absolute py-0.5 rounded flex items-center gap-1 text-xs font-bold z-50"
                    style={{
                      top: '4px',
                      left: '4px',
                      paddingLeft: '4px',
                      paddingRight: '6px',
                      minWidth: item.rarity === 'legendary' ? '65px' : '45px',
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: `1px solid ${rarityColor}`,
                      color: rarityColor,
                      backdropFilter: 'blur(4px)',
                      fontSize: '8px'
                    }}
                  >
                    {getRarityIcon(item.rarity)}
                    {item.rarity === 'legendary' ? 'Legendary' : item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </div>

                  {/* Serial Number - BOTTOM LEFT of image area */}
                  <div 
                    className="absolute px-1.5 py-0.5 rounded text-xs font-bold z-50"
                    style={{
                      bottom: '100px', // Moved up more
                      left: '2px', // Moved slightly left
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: `1px solid ${rarityColor}`,
                      color: rarityColor,
                      backdropFilter: 'blur(4px)',
                      fontSize: '8px'
                    }}
                  >
                    {item.serial}
                  </div>

                  {/* Time Left Badge - BOTTOM RIGHT of image area */}
                  <div 
                    className={`absolute px-1.5 py-0.5 rounded flex items-center gap-1 text-xs font-bold z-50 ${
                      isEnding ? 'animate-pulse' : ''
                    }`}
                    style={{
                      bottom: '100px', // Moved up more
                      right: '2px', // Moved slightly right
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: `1px solid ${timeLeftColor}`,
                      color: timeLeftColor,
                      backdropFilter: 'blur(4px)',
                      fontSize: '8px'
                    }}
                  >
                    <Timer className="w-2 h-2" />
                    {formatTimeLeft(item.timeLeft)}
                  </div>

                  {/* Item Info & Actions */}
                  <div className="p-2">
                    <style>{`
                      @keyframes shine {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                      }
                      
                      
                      /* Force remove unwanted borders */
                      .auction-content,
                      .auction-content *:not(.group) {
                        border: none !important;
                        outline: none !important;
                      }
                    `}</style>
                    <h4 className="font-bold text-xs mb-1 truncate" style={{ color: '#F5F7FF' }}>
                      {item.name}
                    </h4>
                    
                    {/* Bidding Info - Compact */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Bid</span>
                        <span className="text-yellow-400 text-xs font-bold">
                          ⭐{item.currentBid}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Leader</span>
                        <span style={{ 
                          color: item.highestBidder === 'You' ? '#22C55E' : '#A78BFA', 
                          fontSize: '10px',
                          fontWeight: item.highestBidder === 'You' ? '600' : '400'
                        }}>
                          {item.highestBidder}
                        </span>
                      </div>
                    </div>

                    {/* Action Button - Compact */}
                    <div className="w-full">
                      {item.timeLeft > 0 ? (
                        <button
                          onClick={() => handlePlaceBid(item.id)}
                          className="w-full px-2 py-1 rounded text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            color: '#fbbf24',
                          }}
                        >
                          <Gavel className="w-3 h-3" />
                          ⭐{item.currentBid + 5}
                        </button>
                      ) : (
                        <div 
                          className="w-full px-2 py-1 rounded text-xs font-bold text-center"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                          }}
                        >
                          ENDED
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 pb-2" style={{ 
            background: 'linear-gradient(180deg, transparent 0%, rgba(26, 31, 46, 0.3) 100%)'
          }}>
            <p className="text-xs font-medium" style={{ color: '#A9B7C6' }}>
              Powered by DropSource Auction Engine
            </p>
          </div>
        </div>
      </div>
    </FloatingCard>
  );
};