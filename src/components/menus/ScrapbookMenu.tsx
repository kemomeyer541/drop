import React, { useState, useEffect } from 'react';
import { X, Minimize2, Search, FileText, Plus, Star, Heart, Calendar, Filter, Grid, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getScrapbookCollectibles, getRarityColor, getRarityBgColor, getStickerCollectibles, getCardCollectibles } from '../../utils/collectibles';

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

// Use the new collectibles system - all items with buy buttons
const SCRAPBOOK_ITEMS = getScrapbookCollectibles();

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('stickers');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header bar, not from interactive content
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) return;
    if (target.closest('.scrapbook-content')) return;
    if (target.closest('[data-no-drag]')) return;
    
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

  // Filter items by tab
  const filteredItems = SCRAPBOOK_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by collectible type
    const matchesFilter = (activeTab === 'stickers' && item.type === 'sticker') ||
                         (activeTab === 'cards' && item.type === 'card');
    
    return matchesSearch && matchesFilter;
  });

  return (
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
        className="h-12 px-4 flex items-center justify-between border-b border-white/5 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" style={{ color: '#00AEEF' }} />
          <h3 style={{ color: '#E6ECF3', fontSize: '16px', fontWeight: '600' }}>
            Scrapbook
          </h3>
          <Badge 
            style={{ 
              backgroundColor: 'rgba(0, 174, 239, 0.1)',
              color: '#00AEEF',
              border: '1px solid rgba(0, 174, 239, 0.2)'
            }}
          >
            {SCRAPBOOK_ITEMS.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="text-gray-400 hover:text-white"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          
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
      <div className="min-h-0 flex-1 overflow-y-auto scrapbook-content" data-no-drag>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-white/5">
            <TabsList 
              className="grid w-full grid-cols-2 m-0 rounded-none"
              style={{ 
                backgroundColor: '#0F1520',
                borderColor: '#1A2531',
                height: '48px'
              }}
            >
              <TabsTrigger 
                value="stickers"
                className="data-[state=active]:text-white data-[state=active]:bg-transparent"
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#A9B7C6'
                }}
              >
                🎨 Stickers ({getStickerCollectibles().length})
              </TabsTrigger>
              <TabsTrigger 
                value="cards"
                className="data-[state=active]:text-white data-[state=active]:bg-transparent"
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#A9B7C6'
                }}
              >
                ♦️ Cards ({getCardCollectibles().length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stickers" className="flex-1 overflow-hidden m-0">
            {/* Search */}
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stickers..."
                  className="pl-9 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 dropsource-custom-scrollbar">
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="dropsource-collectible-card dropsource-clickable relative group"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{ 
                      borderColor: getRarityColor(item.rarity),
                      borderWidth: '2px',
                      transform: hoveredItem === item.id ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: hoveredItem === item.id 
                        ? `0 8px 32px ${getRarityColor(item.rarity)}40` 
                        : undefined,
                      transition: 'all 200ms ease-out'
                    }}
                  >
                    {/* Serial Number Overlay - Show on Hover */}
                    {hoveredItem === item.id && (
                      <div
                        className="dropsource-serial-overlay"
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
                        Serial {item.serial}
                      </div>
                    )}

                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 
                            className="font-medium truncate"
                            style={{ color: '#E6ECF3' }}
                          >
                            {item.name}
                          </h4>
                        </div>
                        
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium border"
                          style={{
                            color: getRarityColor(item.rarity),
                            borderColor: getRarityColor(item.rarity),
                            backgroundColor: getRarityBgColor(item.rarity),
                            display: 'inline-block',
                            marginBottom: '8px'
                          }}
                        >
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1 flex-wrap">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: 'rgba(99, 179, 255, 0.1)',
                            color: '#63B3FF'
                          }}
                        >
                          {item.type}
                        </span>
                      </div>
                      
                      <span 
                        className="text-xs"
                        style={{ color: '#A9B7C6' }}
                      >
                        {item.totalSupply} minted
                      </span>
                    </div>

                    {/* All items in Scrapbook have Buy buttons (for trading/purchasing) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold" style={{ color: '#00AEEF' }}>
                          {item.rarity === 'common' ? '$5' : 
                           item.rarity === 'rare' ? '$10' :
                           item.rarity === 'epic' ? '$15' : 
                           item.rarity === 'legendary' ? '$20' : 'Trade'}
                        </span>
                      </div>
                      <button
                        className="dropsource-btn-primary"
                        style={{ 
                          fontSize: 'var(--text-xs)', 
                          padding: 'calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1)'
                        }}
                        onClick={() => console.log(`Buy/Trade ${item.name}`)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div 
                    className="p-8 text-center col-span-2"
                    style={{ color: '#A9B7C6' }}
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No stickers found</p>
                    <p className="text-sm mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="flex-1 overflow-hidden m-0">
            {/* Search */}
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards..."
                  className="pl-9 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 dropsource-custom-scrollbar">
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="dropsource-collectible-card dropsource-clickable relative group"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{ 
                      borderColor: getRarityColor(item.rarity),
                      borderWidth: '2px',
                      transform: hoveredItem === item.id ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: hoveredItem === item.id 
                        ? `0 8px 32px ${getRarityColor(item.rarity)}40` 
                        : undefined,
                      transition: 'all 200ms ease-out'
                    }}
                  >
                    {/* Serial Number Overlay - Show on Hover */}
                    {hoveredItem === item.id && (
                      <div
                        className="dropsource-serial-overlay"
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
                        Serial {item.serial}
                      </div>
                    )}

                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 
                            className="font-medium truncate"
                            style={{ color: '#E6ECF3' }}
                          >
                            {item.name}
                          </h4>
                        </div>
                        
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium border"
                          style={{
                            color: getRarityColor(item.rarity),
                            borderColor: getRarityColor(item.rarity),
                            backgroundColor: getRarityBgColor(item.rarity),
                            display: 'inline-block',
                            marginBottom: '8px'
                          }}
                        >
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1 flex-wrap">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: 'rgba(99, 179, 255, 0.1)',
                            color: '#63B3FF'
                          }}
                        >
                          {item.type}
                        </span>
                      </div>
                      
                      <span 
                        className="text-xs"
                        style={{ color: '#A9B7C6' }}
                      >
                        {item.totalSupply} minted
                      </span>
                    </div>

                    {/* All cards in Scrapbook also have Buy buttons (for trading) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold" style={{ color: '#00AEEF' }}>
                          {item.rarity === 'epic' ? '$15' : '$20'}
                        </span>
                      </div>
                      <button
                        className="dropsource-btn-primary"
                        style={{ 
                          fontSize: 'var(--text-xs)', 
                          padding: 'calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1)'
                        }}
                        onClick={() => console.log(`Buy ${item.name}`)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div 
                    className="p-8 text-center col-span-2"
                    style={{ color: '#A9B7C6' }}
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No cards found</p>
                    <p className="text-sm mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}