import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Shield, Star, Users, TrendingUp, MessageCircle, Heart, ShoppingBag, MessageSquare, FileText, Zap, BookOpen, User, X, Megaphone, ChevronUp, ChevronDown, Menu, Home, Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { PaginatedCreatorAdWidget } from "./PaginatedCreatorAdWidget";
import { PaginatedLeaderboardWidget } from "./PaginatedLeaderboardWidget";
import { IndependentMegaphoneTicker } from "./IndependentMegaphoneTicker";
import { ChatPopout } from "./ChatPopout";
import { upsertPrepend, normalize, FeedItem, FeedItemRaw } from "../utils/feed";

// Enhanced category tag styling with emojis and better colors
const getCategoryTagStyle = (category: string) => {
  const styles = {
    'questions': { backgroundColor: 'rgba(69, 181, 209, 0.18)', color: '#45B7D1', border: '1px solid rgba(69, 181, 209, 0.4)', emoji: '❓' },
    'sticker': { backgroundColor: 'rgba(255, 107, 107, 0.18)', color: '#FF6B6B', border: '1px solid rgba(255, 107, 107, 0.4)', emoji: '🧩' },
    'collab req': { backgroundColor: 'rgba(130, 224, 170, 0.18)', color: '#82E0AA', border: '1px solid rgba(130, 224, 170, 0.4)', emoji: '���' },
    'trade': { backgroundColor: 'rgba(139, 195, 74, 0.18)', color: '#8BC34A', border: '1px solid rgba(139, 195, 74, 0.4)', emoji: '🔁' },
    'drop': { backgroundColor: 'rgba(255, 176, 57, 0.18)', color: '#FFB039', border: '1px solid rgba(255, 176, 57, 0.4)', emoji: '💧' },
    'sale': { backgroundColor: 'rgba(76, 175, 80, 0.18)', color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.4)', emoji: '💸' },
    'help': { backgroundColor: 'rgba(244, 67, 54, 0.18)', color: '#F44336', border: '1px solid rgba(244, 67, 54, 0.4)', emoji: '🆘' },
    'showcase': { backgroundColor: 'rgba(255, 193, 7, 0.18)', color: '#FFC107', border: '1px solid rgba(255, 193, 7, 0.4)', emoji: '🌟' }
  };
  return styles[category as keyof typeof styles] || styles['questions'];
};

// Enhanced action type styling with background colors and borders
const getActionTypeStyle = (actionType: string) => {
  const styles = {
    'follow': { 
      color: '#4ECDC4', 
      backgroundColor: 'rgba(78, 205, 196, 0.12)', 
      border: '1px solid rgba(78, 205, 196, 0.3)' 
    },
    'like': { 
      color: '#FF6B6B', 
      backgroundColor: 'rgba(255, 107, 107, 0.12)', 
      border: '1px solid rgba(255, 107, 107, 0.3)' 
    },
    'drop': { 
      color: '#FFB039', 
      backgroundColor: 'rgba(255, 176, 57, 0.12)', 
      border: '1px solid rgba(255, 176, 57, 0.3)' 
    },
    'join': { 
      color: '#82E0AA', 
      backgroundColor: 'rgba(130, 224, 170, 0.12)', 
      border: '1px solid rgba(130, 224, 170, 0.3)' 
    },
    'live': { 
      color: '#FF4757', 
      backgroundColor: 'rgba(255, 71, 87, 0.12)', 
      border: '1px solid rgba(255, 71, 87, 0.3)' 
    },
    'donate': { 
      color: '#FFC107', 
      backgroundColor: 'rgba(255, 193, 7, 0.12)', 
      border: '1px solid rgba(255, 193, 7, 0.3)' 
    },
    'support': { 
      color: '#8BC34A', 
      backgroundColor: 'rgba(139, 195, 74, 0.12)', 
      border: '1px solid rgba(139, 195, 74, 0.3)' 
    },
    'mint': { 
      color: '#9C27B0', 
      backgroundColor: 'rgba(156, 39, 176, 0.12)', 
      border: '1px solid rgba(156, 39, 176, 0.3)' 
    },
    'share': { 
      color: '#A78BFA', 
      backgroundColor: 'rgba(167, 139, 250, 0.12)', 
      border: '1px solid rgba(167, 139, 250, 0.3)' 
    },
    'post': { 
      color: '#BB8FCE', 
      backgroundColor: 'rgba(187, 143, 206, 0.12)', 
      border: '1px solid rgba(187, 143, 206, 0.3)' 
    },
    'create': { 
      color: '#F8C471', 
      backgroundColor: 'rgba(248, 196, 113, 0.12)', 
      border: '1px solid rgba(248, 196, 113, 0.3)' 
    },
    'update': { 
      color: '#85C1E9', 
      backgroundColor: 'rgba(133, 193, 233, 0.12)', 
      border: '1px solid rgba(133, 193, 233, 0.3)' 
    }
  };
  return styles[actionType as keyof typeof styles] || { 
    color: '#E6ECF3', 
    backgroundColor: 'rgba(230, 236, 243, 0.12)', 
    border: '1px solid rgba(230, 236, 243, 0.3)' 
  };
};

interface CommunityHubFeedProps {
  onNavigate: (page: string) => void;
}

// Enhanced action type that extends FeedItem
interface SiteAction extends FeedItem {
  user: string;
  action: string;
  time: string;
  avatar: string;
  color: string;
  actionType?: string;
  icon?: string;
  viewerCount?: number; // For live actions
  donationAmount?: string; // For donation actions
  stickerData?: { // For sticker-related actions
    name: string;
    serial: string;
    thumbnail: string;
  };
}

// Enhanced post type that extends FeedItem
interface CommunityPost extends FeedItem {
  user: string;
  handle: string;
  content: string;
  avatar: string;
  color: string;
  category?: string;
  reactions: Array<{ emoji: string; count: number }>;
  stickerData?: { // For posts that include stickers
    name: string;
    serial: string;
    thumbnail: string;
  };
}

// Enhanced mock data with new action types and sticker support
const ALL_SITE_ACTIONS_RAW = [
  { id: '1', user: 'PixelSmith', action: 'dropped new sticker', time: '2m ago', avatar: 'P', color: '#FF6B6B', actionType: 'drop', icon: '🎨',
    stickerData: { name: 'Pixel Dragon', serial: '#001234', thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=64&h=64&fit=crop' }
  },
  { id: '2', user: 'CraftyCrow', action: 'started following ZineZebra', time: '5m ago', avatar: 'C', color: '#4ECDC4', actionType: 'follow', icon: '👥' },
  { id: '3', user: 'BeatBuddy', action: 'is live', time: '8m ago', avatar: 'B', color: '#FF4757', actionType: 'live', icon: '🔴', viewerCount: 42 },
  { id: '4', user: 'MemeDealer', action: 'donated to CharityStream', time: '12m ago', avatar: 'M', color: '#FFC107', actionType: 'donate', icon: '💝', donationAmount: '$25' },
  { id: '5', user: 'SynthMaster', action: 'became a supporter', time: '15m ago', avatar: 'S', color: '#8BC34A', actionType: 'support', icon: '⭐' },
  { id: '6', user: 'VerseWriter', action: 'minted a sticker', time: '18m ago', avatar: 'V', color: '#9C27B0', actionType: 'mint', icon: '✨',
    stickerData: { name: 'Verse Cat', serial: '#005678', thumbnail: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=64&h=64&fit=crop' }
  },
  { id: '7', user: 'AudioArk', action: 'joined community', time: '25m ago', avatar: 'A', color: '#82E0AA', actionType: 'join', icon: '🎉' },
  { id: '8', user: 'NovaMuse', action: 'liked a track', time: '30m ago', avatar: 'N', color: '#FF6B6B', actionType: 'like', icon: '❤️' },
  { id: '9', user: 'CodeCrafter', action: 'is live', time: '35m ago', avatar: 'CC', color: '#FF4757', actionType: 'live', icon: '🔴', viewerCount: 128 },
  { id: '10', user: 'ArtisanAva', action: 'minted a sticker', time: '40m ago', avatar: 'A', color: '#9C27B0', actionType: 'mint', icon: '✨',
    stickerData: { name: 'Neon Dreams', serial: '#009876', thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=64&h=64&fit=crop' }
  }
];

const COMMUNITY_POSTS_RAW = [
  { 
    id: '1',
    user: 'MemeDealer', 
    handle: '@meme_dealer', 
    content: 'Just finished my latest cursed creation. The internet was a mistake.',
    avatar: 'M',
    color: '#BB8FCE',
    category: 'sticker',
    reactions: [{ emoji: '🔥', count: 12 }, { emoji: '💀', count: 8 }],
    stickerData: { name: 'Cursed Cat', serial: '#123456', thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&h=120&fit=crop' }
  },
  { 
    id: '2',
    user: 'BeatMaker', 
    handle: '@beat_maker_pro', 
    content: 'New lo-fi track dropping tonight! 🎵 Perfect for those late night study sessions.',
    avatar: 'B',
    color: '#4ECDC4',
    category: 'collab req',
    reactions: [{ emoji: '🎵', count: 24 }, { emoji: '💙', count: 15 }]
  },
  { 
    id: '3',
    user: 'PixelArtist', 
    handle: '@pixel_perfect', 
    content: 'Working on a new 8-bit character series. First sketch attached!',
    avatar: 'P',
    color: '#FF6B6B',
    category: 'showcase',
    reactions: [{ emoji: '🎨', count: 18 }, { emoji: '✨', count: 9 }]
  },
  { 
    id: '4',
    user: 'CodeWizard', 
    handle: '@code_wizard', 
    content: 'Anyone know why my CSS is crying? Asking for a friend... 😅',
    avatar: 'C',
    color: '#82E0AA',
    category: 'help',
    reactions: [{ emoji: '😂', count: 31 }, { emoji: '💻', count: 12 }]
  },
  { 
    id: '5',
    user: 'StickerQueen', 
    handle: '@sticker_queen', 
    content: 'New holographic sticker drop! Limited edition of 100. Get them while they\'re hot! ✨',
    avatar: 'SQ',
    color: '#FFB039',
    category: 'drop',
    reactions: [{ emoji: '✨', count: 45 }, { emoji: '🔥', count: 28 }],
    stickerData: { name: 'Holo Dragon', serial: '#789012', thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop' }
  },
  { 
    id: '6',
    user: 'TradeKing', 
    handle: '@trade_master', 
    content: 'Looking to trade my rare pixel art sticker for vintage music collectibles. DMs open!',
    avatar: 'TK',
    color: '#8BC34A',
    category: 'trade',
    reactions: [{ emoji: '🔄', count: 19 }, { emoji: '💎', count: 7 }]
  },
  { 
    id: '7',
    user: 'ArtCollector', 
    handle: '@art_collector_99', 
    content: 'Selling my entire vintage sticker collection. Serious buyers only. Prices negotiable.',
    avatar: 'AC',
    color: '#4CAF50',
    category: 'sale',
    reactions: [{ emoji: '💸', count: 33 }, { emoji: '👀', count: 21 }]
  }
];

export default function CommunityHubFeed({ onNavigate }: CommunityHubFeedProps) {
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Updated state using feed utility with proper normalization - start with 5 actions and 3 posts
  const [siteActions, setSiteActions] = useState<SiteAction[]>(() => {
    return ALL_SITE_ACTIONS_RAW.slice(0, 5).map(action => ({
      ...normalize({
        type: "site_action",
        id: action.id,
        ts: Date.now() - parseInt(action.id) * 60000,
        payload: action
      }),
      ...action
    } as SiteAction));
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    return COMMUNITY_POSTS_RAW.slice(0, 3).map(post => ({
      ...normalize({
        type: "community_post",
        id: post.id,
        ts: Date.now() - parseInt(post.id) * 30000,
        payload: post
      }),
      ...post
    } as CommunityPost));
  });

  const [isActionsHovered, setIsActionsHovered] = useState(false);
  const [isPostsHovered, setIsPostsHovered] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Mock WebSocket for demonstration
  const mockSocket = useRef<{ addEventListener: () => void; removeEventListener: () => void }>({
    addEventListener: () => {},
    removeEventListener: () => {}
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Page visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Simulate new site actions arriving with proper normalization - Allow up to 25
  useEffect(() => {
    if (isActionsHovered || !isPageVisible) return;

    const interval = setInterval(() => {
      // Create a new action with random data
      const randomAction = ALL_SITE_ACTIONS_RAW[Math.floor(Math.random() * ALL_SITE_ACTIONS_RAW.length)];
      const normalized = normalize({
        type: "site_action",
        id: `action-${Date.now()}`,
        ts: Date.now(),
        payload: { ...randomAction, hash: Math.random().toString(36) }
      });

      const newAction: SiteAction = {
        ...normalized,
        ...randomAction,
        time: 'now'
      };

      // Use functional setter with upsertPrepend - max 25 items before trimming
      setSiteActions(prev => upsertPrepend(prev, newAction, 25));
    }, Math.random() * 4000 + 6000); // 6-10s random interval

    return () => clearInterval(interval);
  }, [isActionsHovered, isPageVisible]);

  // Simulate new community posts arriving with proper normalization - Allow up to 25
  useEffect(() => {
    if (isPostsHovered || !isPageVisible) return;

    const interval = setInterval(() => {
      // Create a new post with random data
      const randomPost = COMMUNITY_POSTS_RAW[Math.floor(Math.random() * COMMUNITY_POSTS_RAW.length)];
      const normalized = normalize({
        type: "community_post", 
        id: `post-${Date.now()}`,
        ts: Date.now(),
        payload: { ...randomPost, hash: Math.random().toString(36) }
      });

      const newPost: CommunityPost = {
        ...normalized,
        ...randomPost,
        content: `${randomPost.content} (Updated)`
      };

      // Use functional setter with upsertPrepend - max 25 items
      setCommunityPosts(prev => upsertPrepend(prev, newPost, 25));
    }, Math.random() * 4000 + 6000); // 6-10s random interval

    return () => clearInterval(interval);
  }, [isPostsHovered, isPageVisible]);

  // Handle creator clicks from the independent ticker
  const handleTickerCreatorClick = useCallback((creator: string, position: { x: number; y: number }) => {
    // Handle creator profile preview
  }, []);

  return (
    <TooltipProvider>
      <div 
        className="min-h-screen"
        style={{ 
          background: '#0B0F14',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Independent Megaphone Ticker */}
        <IndependentMegaphoneTicker onCreatorClick={handleTickerCreatorClick} />

        {/* Centered Main Content Container */}
        <div 
          className="flex justify-center flex-1"
          style={{ 
            paddingTop: '44px', // Account for ticker height
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          {/* Desktop: Full 3-Column Layout */}
          <div className="hidden lg:flex w-full justify-center gap-6">
            {/* Left Column - All Site Actions */}
            <div style={{ width: '350px', flexShrink: 0 }}>
              <div 
                className="rounded border p-4"
                style={{
                  backgroundColor: '#0F1520',
                  borderColor: '#1A2531',
                  height: 'calc(100vh - 120px)'
                }}
                onMouseEnter={() => setIsActionsHovered(true)}
                onMouseLeave={() => setIsActionsHovered(false)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5" style={{ color: '#00AEEF' }} />
                  <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>All Site Actions</h2>
                </div>
                <div className="space-y-3 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                  {siteActions.map((item) => {
                    const actionStyle = getActionTypeStyle(item.actionType || '');
                    return (
                      <div 
                        key={item.uid}
                        className="p-3 rounded border" 
                        style={{ 
                          backgroundColor: actionStyle.backgroundColor || '#161B2E', 
                          borderColor: actionStyle.border?.split(' ')[3] || '#1A2531',
                          opacity: 1,
                          transform: 'translateY(0)',
                          transition: 'all 500ms ease-in-out'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: item.color }}
                            title={`View ${item.user}'s profile`}
                          >
                            {item.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {item.icon && (
                                <span style={{ color: actionStyle.color }}>{item.icon}</span>
                              )}
                              <div style={{ color: '#E6ECF3', fontSize: '13px' }}>
                                <span 
                                  className="cursor-pointer hover:underline font-medium"
                                  style={{ color: actionStyle.color }}
                                  title={`View ${item.user}'s profile`}
                                >
                                  {item.user}
                                </span>
                                {' '}{item.action}
                                {item.viewerCount && (
                                  <span style={{ color: '#A9B7C6' }}> ({item.viewerCount} viewers)</span>
                                )}
                                {item.donationAmount && (
                                  <span style={{ color: actionStyle.color, fontWeight: 'bold' }}> {item.donationAmount}</span>
                                )}
                              </div>
                            </div>
                            <div style={{ color: '#A9B7C6', fontSize: '11px' }}>{item.time}</div>
                            
                            {/* Sticker preview for sticker-related actions */}
                            {item.stickerData && (
                              <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={item.stickerData.thumbnail} 
                                    alt={item.stickerData.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                  <div>
                                    <div style={{ color: '#E6ECF3', fontSize: '12px', fontWeight: '500' }}>
                                      {item.stickerData.name}
                                    </div>
                                    <div style={{ color: '#A9B7C6', fontSize: '10px', fontFamily: 'monospace' }}>
                                      {item.stickerData.serial}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Center Column - Community Posts */}
            <div style={{ width: '450px', flexShrink: 0 }}>
              <div 
                className="rounded border p-4"
                style={{
                  backgroundColor: '#0F1520',
                  borderColor: '#1A2531',
                  height: 'calc(100vh - 120px)'
                }}
                onMouseEnter={() => setIsPostsHovered(true)}
                onMouseLeave={() => setIsPostsHovered(false)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5" style={{ color: '#00AEEF' }} />
                  <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>Community Posts</h2>
                </div>
                <div className="space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                  {communityPosts.map((post) => (
                    <div 
                      key={post.uid}
                      className="p-4 rounded border" 
                      style={{ 
                        backgroundColor: '#161B2E', 
                        borderColor: '#1A2531',
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 500ms ease-in-out'
                      }}
                    >
                      {/* Category Tag */}
                      {post.category && (
                        <div className="mb-3">
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={getCategoryTagStyle(post.category)}
                          >
                            [{post.category}]
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: post.color }}
                        >
                          {post.avatar}
                        </div>
                        <div>
                          <div style={{ color: '#E6ECF3', fontWeight: '600' }}>{post.user}</div>
                          <div style={{ color: '#A9B7C6', fontSize: '12px' }}>{post.handle}</div>
                        </div>
                      </div>
                      <div style={{ color: '#E6ECF3', marginBottom: '12px' }}>
                        {post.content}
                      </div>
                      <div className="flex gap-2">
                        {post.reactions.map((reaction, reactionIndex) => (
                          <span 
                            key={reactionIndex}
                            className="px-2 py-1 rounded text-xs" 
                            style={{ backgroundColor: `rgba(255, 107, 107, 0.1)`, color: '#FF6B6B' }}
                          >
                            {reaction.emoji} {reaction.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div style={{ width: '350px', flexShrink: 0 }}>
              <div className="space-y-6">
                {/* Enhanced Creator Spotlight */}
                <PaginatedCreatorAdWidget />
                
                {/* Paginated Leaderboard */}
                <PaginatedLeaderboardWidget widgetIndex={0} />
              </div>
            </div>
          </div>

          {/* Tablet: 2-Column Layout */}
          <div className="hidden md:flex lg:hidden w-full max-w-4xl gap-6 px-4">
            <div style={{ width: '60%' }}>
              <div className="space-y-6">
                <div style={{ height: '300px', backgroundColor: '#0F1520', borderColor: '#1A2531' }} className="rounded border p-4">
                  <h3 style={{ color: '#E6ECF3' }}>Actions & Posts</h3>
                </div>
              </div>
            </div>
            <div style={{ width: '40%' }}>
              <div className="space-y-6">
                <PaginatedCreatorAdWidget />
                <PaginatedLeaderboardWidget widgetIndex={0} />
              </div>
            </div>
          </div>

          {/* Mobile: Single Column Layout */}
          <div className="md:hidden flex-1 overflow-y-auto px-4 space-y-6">
            <div style={{ height: '300px' }}>
              <PaginatedCreatorAdWidget />
            </div>

            <div style={{ height: '400px' }}>
              <PaginatedLeaderboardWidget widgetIndex={0} />
            </div>

            <div style={{ height: '100px' }} />
          </div>
        </div>

        {/* Chat Pop-out Portal */}
        <ChatPopout isOpen={showChat} onClose={() => setShowChat(false)} />
      </div>
    </TooltipProvider>
  );
}