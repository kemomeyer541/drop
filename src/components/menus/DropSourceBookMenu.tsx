import React, { useState, useEffect } from 'react';
import { X, Minimize2, Star, BookOpen, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { COLLECTIBLES_POOL, getRarityColor, getRarityBgColor, buildImagePath, imageRegistry } from '../../utils/collectibles';
import { ImageBlock } from '../SmartImage';

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
  // Add CSS animation for shine effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.book-content')) return;
    
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

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const getTypeIcon = (type: string) => {
    return type === 'sticker' ? '🎨' : '♦️';
  };

  return (
    <TooltipProvider>
      <div
        className="fixed bg-gray-900 border border-gray-700 rounded-lg shadow-2xl dropsource-window flex flex-col"
        style={{
          left: position.x,
          top: position.y,
          width: Math.max(width, 800),
          height: Math.max(height, 600),
          zIndex: zIndex,
          backgroundColor: '#0F1520',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b flex-shrink-0" style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0a0f1a 100%)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            <h3 className="text-xl font-bold" style={{
              background: 'linear-gradient(90deg, #00AEEF 0%, #8F63FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Drop Source Book</h3>
            <Badge 
              className="text-xs"
              style={{
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                color: '#FBBF24',
                border: '1px solid rgba(251, 191, 36, 0.3)'
              }}
            >
              {COLLECTIBLES_POOL.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={onMinimize}
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Sticky Description */}
        <div className="sticky top-0 z-10 bg-[#1a1f2e] p-4 text-center border-b border-white/5">
          <p className="dropsource-text-secondary">
            Master catalog of all DropSource collectibles • Stickers = purchasable • Cards = collection only
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 book-content dropsource-custom-scrollbar">

          <div className="grid grid-cols-3 gap-6">
            {COLLECTIBLES_POOL.filter(item => item.image || imageRegistry[item.id]).map((item) => {
              const rarityColor = getRarityColor(item.rarity);
              const rarityBg = getRarityBgColor(item.rarity);
              
              return (
                <div
                  key={item.id}
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: '#1a1f2e',
                    border: `2px solid ${rarityColor}`,
                    transform: 'scale(1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 15px 30px ${rarityBg}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Fixed Container - defines panel boundaries */}
                  <div 
                    className="relative w-full overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${rarityBg}, rgba(255,255,255,0.05))`,
                    }}
                  >
                    {/* Image Container - let ImageBlock handle the square aspect ratio */}
                    <div className="relative z-20">
                      {(() => {
                        const src = item.image || buildImagePath(item);
                        console.log('DropSourceBook rendering:', item.id, 'src:', src);
                        
                        if (!src) return null;
                        
                        const isPixel = item.name?.toLowerCase().includes('pixel');
                        
                        return (
                          <ImageBlock
                            src={src}
                            alt={item.name}
                            pixelated={isPixel}
                          />
                        );
                      })()}
                    </div>

                    {/* Shine effect - covers full container */}
                    {(item.rarity === 'legendary') && (
                      <div 
                        className="absolute inset-0 opacity-40 z-30"
                        style={{
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                          animation: 'shine 2s ease-in-out infinite',
                        }}
                      />
                    )}

                    {/* Overlays - absolutely positioned on top */}
                    {/* Rarity Badge */}
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
                      {item.rarity === 'legendary' ? <Star className="w-4 h-4" fill="currentColor" /> : <Sparkles className="w-4 h-4" />}
                      {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                    </div>

                    {/* Serial Number - BOTTOM RIGHT */}
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

                  {/* Item Info */}
                  <div className="p-3">
                    <h4 className="font-bold text-sm mb-2 truncate" style={{ color: '#F5F7FF' }}>
                      {item.name}
                    </h4>
                    
                    {/* Creator Info - Show for all cards */}
                    <div className="mb-2">
                      {item.creator ? (
                        <>
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
                        </>
                      ) : (
                        <p className="text-xs text-gray-400">
                          by Unknown Creator
                        </p>
                      )}
                    </div>

                    {/* Description - Show for all cards */}
                    <div className="mb-2">
                      <p className="text-xs text-gray-300">
                        {item.name === 'Pixel Art' 
                          ? 'The FIRST DESIGN FOR DROP SOURCE❤️❤️❤️❤️'
                          : item.name === 'Luca'
                          ? 'ask me about my elmo impression'
                          : 'A unique collectible card from Drop Source'
                        }
                      </p>
                    </div>

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
                          className="px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                          style={{
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                            color: '#fbbf24',
                          }}
                        >
                          <Star className="w-3 h-3" />
                          View
                        </button>

                        <a
                          href={item.creator?.portfolio || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3b82f6',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BookOpen className="w-3 h-3" />
                          Info
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes ds-shine {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }
      `}</style>
    </TooltipProvider>
  );
}