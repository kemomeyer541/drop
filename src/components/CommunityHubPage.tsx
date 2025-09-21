import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, BookOpen, MessageCircle, Users, Mail, Gavel, Archive, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { FloatingCard } from './FloatingCard';
import { EmojiPickerMenu } from './menus/EmojiPickerMenu';

interface CommunityHubPageProps {
  onNavigate: (page: string) => void;
}

interface DropCard {
  id: string;
  title: string;
  username: string;
  price: number;
  priceType: 'stars' | 'dollar';
  reactions: { emoji: string; count: number }[];
}

interface GlobalFeedItem {
  id: string;
  type: 'status' | 'reaction' | 'donation' | 'event';
  username: string;
  action: string;
  target?: string;
  timestamp: string;
}

interface FloatingFeature {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

const mockDrops: DropCard[] = [
  {
    id: '1',
    title: 'Midnight Memories',
    username: 'beatmaker_pro',
    price: 50,
    priceType: 'stars',
    reactions: [
      { emoji: '🔥', count: 12 },
      { emoji: '💎', count: 8 },
      { emoji: '🎵', count: 15 }
    ]
  },
  {
    id: '2',
    title: 'Summer Vibes Loop',
    username: 'lo_fi_queen',
    price: 25,
    priceType: 'dollar',
    reactions: [
      { emoji: '☀️', count: 20 },
      { emoji: '🌊', count: 6 },
      { emoji: '💝', count: 4 }
    ]
  },
  {
    id: '3',
    title: 'Dark Synthwave',
    username: 'synth_master',
    price: 75,
    priceType: 'stars',
    reactions: [
      { emoji: '🌙', count: 18 },
      { emoji: '⚡', count: 11 },
      { emoji: '🖤', count: 9 }
    ]
  },
  {
    id: '4',
    title: 'Acoustic Dreams',
    username: 'guitar_soul',
    price: 40,
    priceType: 'dollar',
    reactions: [
      { emoji: '🎸', count: 22 },
      { emoji: '✨', count: 13 },
      { emoji: '🎶', count: 7 }
    ]
  }
];

const mockGlobalFeed: GlobalFeedItem[] = [
  {
    id: '1',
    type: 'status',
    username: 'UserX',
    action: 'Just posted a new status!',
    timestamp: '2 min ago'
  },
  {
    id: '2',
    type: 'reaction',
    username: 'UserY',
    action: 'reacted 😂 to',
    target: 'UserZ\'s post',
    timestamp: '5 min ago'
  },
  {
    id: '3',
    type: 'donation',
    username: 'UserA',
    action: 'donated $5 to',
    target: 'UserB',
    timestamp: '12 min ago'
  },
  {
    id: '4',
    type: 'event',
    username: 'beatmaker_supreme',
    action: 'joined the community',
    timestamp: '18 min ago'
  },
  {
    id: '5',
    type: 'status',
    username: 'lo_fi_goddess',
    action: 'shared a new track preview',
    timestamp: '25 min ago'
  },
  {
    id: '6',
    type: 'reaction',
    username: 'synth_lover',
    action: 'reacted 🔥 to',
    target: 'VibeMaster\'s drop',
    timestamp: '32 min ago'
  }
];

export function CommunityHubPage({ onNavigate }: CommunityHubPageProps) {
  const [starBalance] = useState(1234);
  const [floatingFeatures, setFloatingFeatures] = useState<FloatingFeature[]>([]);
  const [panelZIndex, setPanelZIndex] = useState(100);
  const [showEmojiPicker, setShowEmojiPicker] = useState<{show: boolean, dropId?: string, position?: {x: number, y: number}}>({show: false});

  const sidebarButtons = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'dms', label: 'DMs', icon: Mail },
    { id: 'auction', label: 'Auction House', icon: Gavel },
    { id: 'scrapbook', label: 'Scrapbook', icon: Archive }
  ];

  const openPanel = (panelType: string) => {
    // Check if panel is already open
    const isOpen = floatingFeatures.some(f => f.type === panelType);
    if (isOpen) return;

    const offset = floatingFeatures.length * 30;
    const newPanel: FloatingFeature = {
      type: panelType,
      position: { x: 100 + offset, y: 100 + offset },
      size: { width: 400, height: 500 },
      zIndex: panelZIndex + floatingFeatures.length,
    };

    setFloatingFeatures(prev => [...prev, newPanel]);
  };

  const closePanel = (panelType: string) => {
    setFloatingFeatures(prev => prev.filter(f => f.type !== panelType));
  };

  const minimizePanel = (panelType: string) => {
    // For now, just close the panel - can implement minimization later
    closePanel(panelType);
  };

  const updatePanelPosition = (panelType: string, position: { x: number; y: number }) => {
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === panelType ? { ...f, position } : f
      )
    );
  };

  const updatePanelSize = (panelType: string, size: { width: number; height: number }) => {
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === panelType ? { ...f, size } : f
      )
    );
  };

  const handlePanelFocus = (panelType: string) => {
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === panelType 
          ? { ...f, zIndex: panelZIndex + 20 }
          : f
      )
    );
    setPanelZIndex(prev => prev + 1);
  };

  const handleEmojiPickerOpen = (dropId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setShowEmojiPicker({
      show: true,
      dropId,
      position: { x: rect.left + rect.width / 2, y: rect.top }
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    if (showEmojiPicker.dropId) {
      console.log(`Added ${emoji} to drop ${showEmojiPicker.dropId}`);
      // Add emoji to drop reactions logic here
    }
    setShowEmojiPicker({ show: false });
  };

  const renderPanelContent = (panelType: string) => {
    const titles = {
      chat: 'Community Chat',
      friends: 'Friends List',
      dms: 'Direct Messages',
      auction: 'Auction House',
      scrapbook: 'My Scrapbook'
    };

    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-4">
          {panelType === 'chat' && '💬'}
          {panelType === 'friends' && '👥'}
          {panelType === 'dms' && '📨'}
          {panelType === 'auction' && '🏛️'}
          {panelType === 'scrapbook' && '📚'}
        </div>
        <h3 className="text-lg font-semibold dropsource-text-primary mb-2">
          {titles[panelType as keyof typeof titles]}
        </h3>
        <p className="dropsource-text-tertiary text-sm">
          Coming soon - this feature is under development
        </p>
      </div>
    );
  };

  return (
    <div 
      className="h-full overflow-hidden flex flex-col relative"
      style={{ 
        background: 'linear-gradient(180deg, #0D0D0D 0%, #121212 100%)',
        color: 'white'
      }}
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between" style={{ 
        background: 'rgba(18, 23, 35, 0.8)',
        borderBottom: '1px solid var(--dropsource-border)',
        padding: 'calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3)',
        zIndex: '20',
        backdropFilter: 'blur(12px)'
      }}>
        {/* Left: Back Button */}
        <div className="flex items-center">
          <Button
            onClick={() => onNavigate('community')}
            className="dropsource-nav-pill flex items-center gap-2"
            style={{ 
              background: 'transparent',
              color: 'var(--dropsource-secondary)',
              border: 'none',
              padding: 'calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Center: Community Hub Title with Premium Glow */}
        <div className="flex-1 text-center">
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              textAlign: "center",
              background: "linear-gradient(90deg, #00AEEF 0%, #63B3FF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `
                0 0 8px rgba(0, 174, 239, 0.6),
                0 0 16px rgba(0, 174, 239, 0.4),
                0 0 24px rgba(99, 179, 255, 0.3)
              `,
              filter: "drop-shadow(0 0 12px rgba(0, 174, 239, 0.5))"
            }}
          >
            Community Hub
          </h1>
          
          {/* Welcome Message */}
          <div className="mt-2 flex items-center justify-center gap-3" style={{ marginTop: '8px' }}>
            <p 
              style={{ 
                fontSize: '16px',
                fontWeight: '400',
                color: '#A9B7C6',
                letterSpacing: '-0.01em'
              }}
            >
              Welcome to DropSource! Share your creation with the community!
            </p>
            <button
              className="dropsource-btn-primary flex items-center gap-2"
              style={{
                fontSize: '14px',
                padding: '8px 16px',
                background: 'linear-gradient(90deg, #00AEEF 0%, #63B3FF 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sharp)',
                fontWeight: '600',
                boxShadow: '0 0 12px rgba(0, 174, 239, 0.3)',
                transition: 'all 150ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 174, 239, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 174, 239, 0.3)';
              }}
            >
              Create Drop
            </button>
          </div>
        </div>

        {/* Right: Star Balance, Shop, and Book buttons */}
        <div className="flex items-center gap-4">
          {/* Star Balance */}
          <div className="flex items-center gap-2 dropsource-surface px-3 py-2 rounded-lg">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="dropsource-text-primary font-semibold">
              {starBalance.toLocaleString()}
            </span>
          </div>

          {/* Shop Button */}
          <Button
            onClick={() => onNavigate('shop')}
            className="dropsource-btn-secondary flex items-center gap-2"
            style={{ padding: 'calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)' }}
          >
            <ShoppingBag className="w-4 h-4" />
            Shop
          </Button>

          {/* Drop Source Book Button */}
          <Button
            onClick={() => onNavigate('book')}
            className="dropsource-btn-secondary flex items-center gap-2"
            style={{ padding: 'calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)' }}
          >
            <BookOpen className="w-4 h-4" />
            Drop Source Book
          </Button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Global Feed (30%) - Split into User Updates and Activity */}
        <div 
          className="dropsource-surface border-r border-dropsource-border overflow-y-auto dropsource-custom-scrollbar"
          style={{ width: '30%', minWidth: '280px' }}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold dropsource-text-primary mb-4">
              Global Feed
            </h2>
            
            {/* Two Sub-columns */}
            <div className="grid grid-cols-2 gap-3 h-full">
              {/* User Status Updates */}
              <div>
                <h3 className="text-sm font-semibold dropsource-text-secondary mb-3">Status Updates</h3>
                <div className="space-y-2">
                  {mockGlobalFeed.filter(item => item.type === 'status').map((item) => (
                    <div key={item.id} className="dropsource-feed-card p-2">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs dropsource-text-secondary">
                            <span className="font-semibold dropsource-text-primary">
                              {item.username}
                            </span>
                            <br />
                            {item.action}
                          </p>
                          <p className="text-xs dropsource-text-tertiary mt-1">
                            {item.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Activity Feed */}
              <div>
                <h3 className="text-sm font-semibold dropsource-text-secondary mb-3">Activity</h3>
                <div className="space-y-2">
                  {mockGlobalFeed.filter(item => item.type !== 'status').map((item) => (
                    <div key={item.id} className="dropsource-feed-card p-2">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs dropsource-text-secondary">
                            <span className="font-semibold dropsource-text-primary">
                              {item.username}
                            </span>
                            <br />
                            {item.action}
                            {item.target && (
                              <span className="font-semibold dropsource-text-primary">
                                {' '}{item.target}
                              </span>
                            )}
                          </p>
                          <p className="text-xs dropsource-text-tertiary mt-1">
                            {item.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Drops Feed (40%) */}
        <div 
          className="flex-1 overflow-y-auto dropsource-custom-scrollbar"
          style={{ width: '40%', minWidth: '320px' }}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold dropsource-text-primary mb-4">
              Latest Drops
            </h2>
            <div className="space-y-4">
              {mockDrops.map((drop) => (
                <div key={drop.id} className="dropsource-card dropsource-clickable p-4" style={{ overflow: 'visible' }}>
                  <div className="flex gap-3">
                    {/* Preview Thumbnail */}
                    <div 
                      className="w-16 h-16 flex-shrink-0 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                      style={{ 
                        borderRadius: 'var(--radius-sharp)',
                        background: 'linear-gradient(135deg, #7C5CFF 0%, #2D81F7 50%, #25BFA6 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 16px rgba(124, 92, 255, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.1)';
                      }}
                    >
                      {/* Subtle gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg" />
                      
                      {/* Logo/Content placeholder */}
                      <div className="relative w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        🎵
                      </div>
                      
                      {/* Hover glow effect */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
                        }}
                      />
                    </div>
                    
                    {/* Drop Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold dropsource-text-primary truncate">
                        {drop.title}
                      </h3>
                      
                      {/* Username with profile bubble */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500" />
                        <span className="text-sm dropsource-text-secondary">
                          {drop.username}
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-1 mt-2">
                        {drop.priceType === 'stars' ? (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        ) : (
                          <span className="text-green-400 font-semibold">$</span>
                        )}
                        <span className="font-semibold dropsource-text-primary">
                          {drop.price}
                        </span>
                      </div>
                      
                      {/* Reaction Icons */}
                      <div className="flex gap-2 mt-3" style={{ overflow: 'visible' }}>
                        {drop.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="dropsource-reaction-pill hover:scale-105 transition-transform"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs">{reaction.count}</span>
                          </button>
                        ))}
                        <button
                          onClick={(e) => handleEmojiPickerOpen(drop.id, e)}
                          className="dropsource-reaction-pill hover:scale-105 transition-transform border-dashed"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="text-xs">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Panels (30%) */}
        <div 
          className="dropsource-surface border-l border-dropsource-border overflow-y-auto dropsource-custom-scrollbar"
          style={{ width: '30%', minWidth: '280px' }}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold dropsource-text-primary mb-4">
              Quick Access
            </h2>
            <div className="space-y-2">
              {sidebarButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={() => openPanel(button.id)}
                    className="w-full dropsource-toolbar-button text-left flex items-center gap-3 p-3 rounded"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{button.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Panels */}
      {floatingFeatures.map((feature) => (
        <FloatingCard
          key={feature.type}
          title={sidebarButtons.find(b => b.id === feature.type)?.label || 'Panel'}
          onClose={() => closePanel(feature.type)}
          onMinimize={() => minimizePanel(feature.type)}
          initialPosition={feature.position}
          width={feature.size.width}
          height={feature.size.height}
          zIndex={feature.zIndex}
          onPositionChange={(position) => updatePanelPosition(feature.type, position)}
          onSizeChange={(size) => updatePanelSize(feature.type, size)}
          onFocus={() => handlePanelFocus(feature.type)}
        >
          {renderPanelContent(feature.type)}
        </FloatingCard>
      ))}

      {/* Emoji Picker */}
      {showEmojiPicker.show && showEmojiPicker.position && (
        <EmojiPickerMenu
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker({ show: false })}
          position={showEmojiPicker.position}
        />
      )}
    </div>
  );
}