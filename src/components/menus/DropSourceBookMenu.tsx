import React, { useState, useEffect } from 'react';
import { X, Minimize2, Star, BookOpen, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { COLLECTIBLES_POOL, getRarityColor, getRarityBgColor } from '../../utils/collectibles';

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
        className={`fixed rounded-2xl border border-white/8 bg-zinc-950/90 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] max-h-[72vh] w-[720px] overflow-hidden flex flex-col ${isDragging ? 'dragging' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          zIndex,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={onFocus}
      >
        {/* Header */}
        <div 
          className="h-12 px-4 flex items-center justify-between border-b border-white/5 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" style={{ color: '#00AEEF' }} />
            <h3 style={{ color: '#E6ECF3', fontSize: '16px', fontWeight: '600' }}>
              Drop Source Book
            </h3>
            <Badge 
              style={{ 
                backgroundColor: 'rgba(0, 174, 239, 0.1)',
                color: '#00AEEF',
                border: '1px solid rgba(0, 174, 239, 0.2)'
              }}
            >
              {COLLECTIBLES_POOL.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="text-gray-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 book-content dropsource-custom-scrollbar">
          <div className="p-4 text-center border-b border-white/5 -m-4 mb-4">
            <p className="dropsource-text-secondary">
              Master catalog of all DropSource collectibles • Stickers = purchasable • Cards = collection only
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COLLECTIBLES_POOL.map((item) => (
              <div
                key={item.id}
                className="relative group"
              >
                <Card 
                  className="dropsource-card p-4 text-center dropsource-clickable transition-all relative"
                  style={{
                    borderColor: getRarityColor(item.rarity),
                    borderWidth: '2px',
                    minHeight: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${getRarityColor(item.rarity)}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Serial Number Overlay */}
                  <div 
                    className="dropsource-serial-overlay"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(8px)',
                      color: getRarityColor(item.rarity),
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono, Fira Code, monospace',
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      border: `1px solid ${getRarityColor(item.rarity)}`,
                      boxShadow: `0 0 8px ${getRarityColor(item.rarity)}40`
                    }}
                  >
                    Serial {item.serial}
                  </div>

                  {/* Item Display */}
                  <div className="text-4xl mb-3 relative">
                    {getTypeIcon(item.type)}
                  </div>
                  <h4 className="font-semibold dropsource-text-primary mb-2 text-sm">
                    {item.name}
                  </h4>
                  <Badge 
                    className="text-xs mb-3"
                    style={{
                      backgroundColor: getRarityBgColor(item.rarity),
                      color: getRarityColor(item.rarity),
                      border: `1px solid ${getRarityColor(item.rarity)}`
                    }}
                  >
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} {item.type}
                  </Badge>

                  {/* Hover Metadata */}
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center p-3 z-10">
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="dropsource-text-tertiary">Type: </span>
                        <span className="dropsource-text-primary font-medium">
                          {item.type === 'sticker' ? 'Sticker (Purchasable)' : 'Card (Collection Only)'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="dropsource-text-tertiary">Rarity: </span>
                        <Badge 
                          className="text-xs ml-1"
                          style={{
                            backgroundColor: getRarityBgColor(item.rarity),
                            color: getRarityColor(item.rarity),
                            border: `1px solid ${getRarityColor(item.rarity)}`
                          }}
                        >
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="dropsource-text-tertiary">Total Supply: </span>
                        <span className="dropsource-text-primary font-medium">
                          {item.totalSupply.toLocaleString()}
                        </span>
                      </div>
                      
                      <div>
                        <span className="dropsource-text-tertiary">Serial: </span>
                        <span 
                          className="font-mono font-medium"
                          style={{ 
                            color: getRarityColor(item.rarity),
                            textShadow: `0 0 8px ${getRarityColor(item.rarity)}40`
                          }}
                        >
                          {item.serial}
                        </span>
                      </div>
                      
                      {item.type === 'sticker' && (
                        <div className="pt-2 border-t border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold" style={{ color: '#00AEEF' }}>
                                {item.rarity === 'common' ? '$5' : 
                                 item.rarity === 'rare' ? '$10' :
                                 item.rarity === 'epic' ? '$15' : 
                                 item.rarity === 'legendary' ? '$20' : '$5'}
                              </span>
                            </div>
                          </div>
                          <Button 
                            className="w-full dropsource-btn-primary text-xs flex items-center gap-2"
                            onClick={() => console.log(`Buy ${item.name}`)}
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Buy Sticker
                          </Button>
                        </div>
                      )}
                      
                      {item.type === 'card' && (
                        <div className="pt-2 border-t border-gray-700">
                          <span 
                            className="text-xs px-3 py-1 rounded block text-center"
                            style={{ 
                              backgroundColor: 'rgba(168, 85, 247, 0.1)',
                              color: '#A855F7',
                              border: '1px solid rgba(168, 85, 247, 0.2)'
                            }}
                          >
                            View Only - Available via Auction/Trade
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}