import React, { useState, useEffect } from 'react';
import { Clock, Users, Star, TrendingUp, Trophy, User, Zap, Filter, ChevronDown, ChevronUp, Shield, X, Minimize2, Timer, Sparkles, Gavel } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { FloatingCard } from '../FloatingCard';
import { upsertPrepend, normalize, FeedItem } from '../../utils/feed';
import { getAuctionCollectibles, getRarityColor, getRarityBgColor } from '../../utils/collectibles';

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
  id: (index + 1).toString(),
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
          
          // Simulate new bids occasionally
          const shouldReceiveNewBid = Math.random() < 0.02; // 2% chance per second
          
          if (shouldReceiveNewBid && newTimeLeft > 10) {
            const bidIncrements = [5, 10, 15]; // Clear increments
            const bidIncrement = bidIncrements[Math.floor(Math.random() * bidIncrements.length)];
            const oldBid = item.currentBid;
            const newBid = oldBid + bidIncrement;
            const bidder = BIDDER_NAMES[Math.floor(Math.random() * BIDDER_NAMES.length)];
            
            // Add to live ticker with clear increment display
            setLiveTicker(prev => [
              `${bidder} raised bid on ${item.name} ⭐${oldBid} → ⭐${newBid} (+⭐${bidIncrement})`,
              ...prev.slice(0, 4) // Keep last 5 activities
            ]);
            
            return {
              ...item,
              timeLeft: newTimeLeft,
              currentBid: newBid,
              highestBidder: bidder,
              bidCount: item.bidCount + 1
            };
          }
          
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
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
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
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const bidIncrement = 5; // User bids ⭐5 more
          const oldBid = item.currentBid;
          const newBid = oldBid + bidIncrement;
          
          // Add to live ticker with increment
          setLiveTicker(prev => [
            `You raised bid on ${item.name} ⭐${oldBid} → ⭐${newBid} (+⭐${bidIncrement})`,
            ...prev.slice(0, 4)
          ]);
          
          return {
            ...item,
            currentBid: newBid,
            highestBidder: 'You',
            bidCount: item.bidCount + 1
          };
        }
        return item;
      })
    );
  };

  return (
    <FloatingCard
      title="Live Auction House"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      width={width}
      height={height}
      zIndex={zIndex}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onFocus={onFocus}
    >
      <div className="h-full flex flex-col auction-content" data-no-drag>
        {/* Header with live indicator */}
        <div className="flex items-center gap-3 mb-4">
          <Gavel className="w-5 h-5" style={{ color: '#F59E0B' }} />
          <div className="flex items-center gap-1 px-2 py-1 rounded text-xs dropsource-btn-primary">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto dropsource-custom-scrollbar">
          {/* Live Activity Ticker */}
          <div className="dropsource-panel mb-4 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="dropsource-text-primary text-sm font-semibold">Live Activity</span>
            </div>
            <div className="h-6 overflow-hidden">
              {liveTicker.length > 0 ? (
                <div className="animate-slideUp">
                  <p className="dropsource-text-secondary text-xs">
                    {liveTicker[0]}
                  </p>
                </div>
              ) : (
                <p className="dropsource-text-tertiary text-xs opacity-60">
                  Waiting for bid activity...
                </p>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="dropsource-panel mb-4 p-3 rounded">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="dropsource-text-primary text-lg font-semibold">
                  {items.length}
                </div>
                <div className="dropsource-text-tertiary text-xs">Active</div>
              </div>
              <div>
                <div className="text-yellow-400 text-lg font-semibold">
                  ⭐{items.reduce((sum, item) => sum + item.currentBid, 0)}
                </div>
                <div className="dropsource-text-tertiary text-xs">Total Bids</div>
              </div>
              <div>
                <div className="text-orange-400 text-lg font-semibold">
                  {Math.max(...items.map(item => item.bidCount))}
                </div>
                <div className="dropsource-text-tertiary text-xs">Most Bids</div>
              </div>
              <div>
                <div className="text-red-400 text-lg font-semibold">
                  {items.filter(item => item.timeLeft <= 60).length}
                </div>
                <div className="dropsource-text-tertiary text-xs">Ending Soon</div>
              </div>
            </div>
          </div>

          {/* Auction Items Grid */}
          <div className="grid grid-cols-2 gap-3">
            {items.map(item => {
              const timeLeftColor = getTimeLeftColor(item.timeLeft);
              const isEnding = item.timeLeft <= 60;
              
              return (
                <div
                  key={item.id}
                  className={`dropsource-card p-3 transition-all duration-200 ${isEnding ? 'animate-pulse' : ''} group cursor-pointer`}
                  style={{
                    borderColor: isEnding ? '#EF4444' : getRarityColor(item.rarity),
                    borderWidth: '2px',
                    boxShadow: isEnding 
                      ? '0 0 20px rgba(239, 68, 68, 0.4), 0 2px 8px rgba(0,0,0,0.4)'
                      : `0 2px 8px rgba(0,0,0,0.4), 0 0 6px ${getRarityColor(item.rarity)}30`,
                    minHeight: '180px',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isEnding) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${getRarityColor(item.rarity)}80`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isEnding) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 2px 8px rgba(0,0,0,0.4), 0 0 6px ${getRarityColor(item.rarity)}30`;
                    }
                  }}
                >
                  {/* Rarity Color Bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                    style={{ backgroundColor: getRarityColor(item.rarity) }}
                  />

                  {/* Time Left Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" style={{ color: timeLeftColor }} />
                      <span style={{ color: timeLeftColor, fontSize: '12px', fontWeight: '600' }}>
                        {formatTimeLeft(item.timeLeft)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: getRarityColor(item.rarity) }}>
                      {getRarityIcon(item.rarity)}
                    </div>
                  </div>

                  {/* Item Preview */}
                  <div 
                    className="w-full h-12 rounded-lg mb-2 flex items-center justify-center relative"
                    style={{ 
                      backgroundColor: getRarityColor(item.rarity), 
                      opacity: 0.9 
                    }}
                  >
                    <span className="text-white font-bold text-lg">
                      {getTypeIcon(item.type)}
                    </span>
                    {/* Serial Number Overlay - Shows on hover */}
                    <div className="absolute inset-0 rounded-lg bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs">
                      <div>Serial {item.serial}</div>
                      <div>/{item.totalSupply} minted</div>
                    </div>
                    {isEnding && (
                      <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-pulse"></div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="space-y-1 mb-3">
                    <h4 className="dropsource-text-primary text-sm font-semibold">
                      {item.name}
                    </h4>
                    <p style={{ 
                      color: getRarityColor(item.rarity), 
                      fontSize: '10px',
                      textShadow: `0 0 6px ${getRarityColor(item.rarity)}40`
                    }}>
                      {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} {item.type}
                    </p>
                  </div>

                  {/* Bidding Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="dropsource-text-tertiary text-xs">Current Bid</span>
                      <span className="text-yellow-400 text-sm font-bold">
                        ⭐{item.currentBid}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="dropsource-text-tertiary text-xs">Highest Bidder</span>
                      <span style={{ 
                        color: item.highestBidder === 'You' ? '#22C55E' : 'var(--dropsource-primary)', 
                        fontSize: '10px',
                        fontWeight: item.highestBidder === 'You' ? '600' : '400'
                      }}>
                        {item.highestBidder}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="dropsource-text-tertiary text-xs">Bids</span>
                      <span className="text-blue-400 text-xs font-medium">
                        {item.bidCount}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {item.timeLeft > 0 ? (
                      <button
                        onClick={() => handlePlaceBid(item.id)}
                        className="dropsource-btn-primary w-full py-2 rounded text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        Bid ⭐{item.currentBid + 5}
                      </button>
                    ) : (
                      <div className="flex-1 px-4 py-2 rounded text-xs font-bold text-center bg-red-500 text-white">
                        AUCTION ENDED
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-white/5">
            <p className="dropsource-text-tertiary text-xs">
              🔴 Live bidding • Only Rare/Epic/Legendary items • All serials verified
            </p>
          </div>
        </div>
      </div>
    </FloatingCard>
  );
};