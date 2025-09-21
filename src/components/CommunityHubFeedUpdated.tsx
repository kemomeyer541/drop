import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Shield, Star, Users, TrendingUp, MessageCircle, Heart, ShoppingBag, MessageSquare, FileText, Zap, BookOpen, User, X, Megaphone, ChevronUp, ChevronDown, Menu, Home, Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { PaginatedCreatorAdWidget } from "./PaginatedCreatorAdWidget";
import { PaginatedLeaderboardWidget } from "./PaginatedLeaderboardWidget";
import { IndependentMegaphoneTicker } from "./IndependentMegaphoneTicker";
import { ChatPopout } from "./ChatPopout";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { upsertPrepend, normalize, FeedItem, FeedItemRaw } from "../utils/feed";
import { getRandomSticker, getRandomCard, getRarityColor } from "../utils/collectibles";
import { 
  generateUsername, 
  getRandomStaticUsername, 
  getRandomAdjective, 
  getRandomGenre, 
  generatePostContent, 
  getRandomReaction, 
  getRandomTimePeriod,
  POST_REACTIONS,
  STATIC_USERNAMES
} from "../utils/contentData";

// Enhanced category tag styling with emojis and better colors - matching requirements
const getCategoryTagStyle = (category: string) => {
  const styles = {
    'Questions': { backgroundColor: 'rgba(69, 181, 209, 0.18)', color: '#45B7D1', border: '1px solid rgba(69, 181, 209, 0.4)', emoji: '❓' },
    'Sticker': { backgroundColor: 'rgba(255, 107, 107, 0.18)', color: '#FF6B6B', border: '1px solid rgba(255, 107, 107, 0.4)', emoji: '🧩' },
    'Collab Req': { backgroundColor: 'rgba(130, 224, 170, 0.18)', color: '#82E0AA', border: '1px solid rgba(130, 224, 170, 0.4)', emoji: '🤝' },
    'Trade': { backgroundColor: 'rgba(139, 195, 74, 0.18)', color: '#8BC34A', border: '1px solid rgba(139, 195, 74, 0.4)', emoji: '🔁' },
    'Drop': { backgroundColor: 'rgba(255, 176, 57, 0.18)', color: '#FFB039', border: '1px solid rgba(255, 176, 57, 0.4)', emoji: '💧' },
    'Sale': { backgroundColor: 'rgba(76, 175, 80, 0.18)', color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.4)', emoji: '💸' },
    'Help': { backgroundColor: 'rgba(244, 67, 54, 0.18)', color: '#F44336', border: '1px solid rgba(244, 67, 54, 0.4)', emoji: '🆘' },
    'Showcase': { backgroundColor: 'rgba(255, 193, 7, 0.18)', color: '#FFC107', border: '1px solid rgba(255, 193, 7, 0.4)', emoji: '🌟' }
  };
  return styles[category as keyof typeof styles] || styles['Questions'];
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
  targetUser?: { // For follow/donate/support actions
    name: string;
    avatar: string;
    color: string;
  };
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
  cardData?: { // For posts that include cards
    name: string;
    serial: string;
    thumbnail: string;
  };
}

const generateActionData = () => {
  const targetUser = {
    name: getRandomStaticUsername(),
    avatar: getRandomStaticUsername().slice(0, 2).toUpperCase(),
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  };
  // Use specific functions for stickers vs cards
  const randomSticker = getRandomSticker(); // For sticker-related actions
  const randomCard = getRandomCard(); // For card-related content
  
  return { 
    targetUser, 
    stickerName: randomSticker.name, 
    stickerSerial: randomSticker.serial,
    cardName: randomCard.name,
    cardSerial: randomCard.serial
  };
};

// Generate mock data using contentData
const generateSiteAction = (id: string) => {
  const user = generateUsername();
  const actionTypes = ['create', 'follow', 'live', 'donate', 'support', 'join', 'like', 'collaborate', 'mint'];
  const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
  const { targetUser, stickerName, stickerSerial } = generateActionData();
  
  const actions = {
    create: { action: `created ${getRandomGenre()} track`, icon: '🎨' },
    follow: { action: 'started following', icon: '👥', hasTarget: true },
    live: { action: 'is live', icon: '🔴', hasViewers: true },
    donate: { action: 'donated to', icon: '💝', hasTarget: true, hasDonation: true },
    support: { action: 'became a supporter of', icon: '⭐', hasTarget: true },
    join: { action: 'joined community', icon: '🎉' },
    like: { action: 'liked a track', icon: '❤️' },
    collaborate: { action: 'started a collab', icon: '🤝' },
    mint: { action: 'created Sticker', icon: '✨', hasSticker: true }
  };
  
  const actionConfig = actions[actionType as keyof typeof actions] || actions.create;
  
  return {
    id,
    user,
    action: actionConfig.action,
    time: getRandomTimePeriod(),
    avatar: user.slice(0, 2).toUpperCase(),
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    actionType,
    icon: actionConfig.icon,
    viewerCount: actionConfig.hasViewers ? Math.floor(Math.random() * 100) + 10 : undefined,
    donationAmount: actionConfig.hasDonation ? `$${Math.floor(Math.random() * 50) + 5}` : undefined,
    targetUser: actionConfig.hasTarget ? targetUser : undefined,
    stickerData: actionConfig.hasSticker ? {
      name: stickerName,
      serial: stickerSerial,
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=64&h=64&fit=crop'
    } : undefined
  };
};

const generateCommunityPost = (id: string) => {
  const user = generateUsername();
  const categories = ['Sticker', 'Collab Req', 'Showcase', 'Help', 'Drop', 'Sale', 'Questions'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const { stickerName, stickerSerial, cardName, cardSerial } = generateActionData();
  
  // Generate reactions using contentData
  const reactionCount = Math.floor(Math.random() * 3) + 1;
  const reactions = [];
  for (let i = 0; i < reactionCount; i++) {
    const reaction = getRandomReaction();
    reactions.push({
      emoji: reaction.emoji,
      count: Math.floor(Math.random() * 50) + 1
    });
  }
  
  const content = generatePostContent({
    genre: getRandomGenre(),
    adjective: getRandomAdjective(),
    collectible: Math.random() > 0.5 ? stickerName : cardName
  });
  
  return {
    id,
    user,
    handle: `@${user.toLowerCase().replace(/[^a-z]/g, '_')}`,
    content,
    avatar: user.slice(0, 2).toUpperCase(),
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    category,
    reactions,
    stickerData: category === 'Sticker' || category === 'Drop' ? {
      name: stickerName,
      serial: stickerSerial,
      thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&h=120&fit=crop'
    } : undefined,
    cardData: category === 'Showcase' && Math.random() > 0.7 ? {
      name: cardName,
      serial: cardSerial,
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop'
    } : undefined
  };
};

// Generate initial data
const ALL_SITE_ACTIONS_RAW = Array.from({ length: 11 }, (_, i) => generateSiteAction((i + 1).toString()));
const COMMUNITY_POSTS_RAW = Array.from({ length: 7 }, (_, i) => generateCommunityPost((i + 1).toString()));

export default function CommunityHubFeed({ onNavigate }: CommunityHubFeedProps) {
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Profile hover card state
  const [hoveredProfile, setHoveredProfile] = useState<{
    user: string;
    handle?: string;
    avatar: string;
    color: string;
    position: { x: number; y: number };
  } | null>(null);

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
      // Create a new action with random data and fresh name
      const randomAction = ALL_SITE_ACTIONS_RAW[Math.floor(Math.random() * ALL_SITE_ACTIONS_RAW.length)];
      const { targetUser, stickerName, stickerSerial } = generateActionData();
      
      const normalized = normalize({
        type: "site_action",
        id: `action-${Date.now()}`,
        ts: Date.now(),
        payload: { ...randomAction, hash: Math.random().toString(36) }
      });

      const newAction: SiteAction = {
        ...normalized,
        ...randomAction,
        user: generateUsername(), // Generate fresh name for each new action
        time: 'now',
        // Add variety to prevent spam by randomizing target users and sticker data
        targetUser: randomAction.targetUser ? targetUser : undefined,
        stickerData: randomAction.stickerData ? {
          name: stickerName,
          serial: stickerSerial,
          thumbnail: randomAction.stickerData.thumbnail
        } : undefined
      };

      // Use functional setter with upsertPrepend - max 25 items before trimming
      setSiteActions(prev => upsertPrepend(prev, newAction, 25));
    }, Math.random() * 2000 + 3000); // 3-5s random interval as requested

    return () => clearInterval(interval);
  }, [isActionsHovered, isPageVisible]);

  // Simulate new community posts arriving with proper normalization - Allow up to 25
  useEffect(() => {
    if (isPostsHovered || !isPageVisible) return;

    const interval = setInterval(() => {
      // Create a new post with random data and fresh name
      const randomPost = COMMUNITY_POSTS_RAW[Math.floor(Math.random() * COMMUNITY_POSTS_RAW.length)];
      const { stickerName, stickerSerial, cardName, cardSerial } = generateActionData();
      
      const normalized = normalize({
        type: "community_post", 
        id: `post-${Date.now()}`,
        ts: Date.now(),
        payload: { ...randomPost, hash: Math.random().toString(36) }
      });

      const newPost: CommunityPost = {
        ...normalized,
        ...randomPost,
        user: generateUsername(), // Generate fresh name for each new post
        content: randomPost.content, // Remove "(Updated)" suffix for cleaner posts
        // Add variety to sticker/card data to prevent spam
        stickerData: randomPost.stickerData ? {
          name: stickerName,
          serial: stickerSerial,
          thumbnail: randomPost.stickerData.thumbnail
        } : undefined,
        cardData: randomPost.cardData ? {
          name: cardName,
          serial: cardSerial,
          thumbnail: randomPost.cardData.thumbnail
        } : undefined
      };

      // Use functional setter with upsertPrepend - max 25 items
      setCommunityPosts(prev => upsertPrepend(prev, newPost, 25));
    }, Math.random() * 2000 + 3000); // 3-5s random interval as requested

    return () => clearInterval(interval);
  }, [isPostsHovered, isPageVisible]);

  // Handle creator clicks from the independent ticker
  const handleTickerCreatorClick = useCallback((creator: string, position: { x: number; y: number }) => {
    // Handle creator profile preview
  }, []);

  // Handle profile interactions
  const handleProfileClick = (user: string, handle: string | undefined, avatar: string, color: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredProfile({
      user,
      handle,
      avatar,
      color,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      }
    });
  };

  const handleProfileRoute = (user: string) => {
    // Close hover card and navigate to full profile
    setHoveredProfile(null);
    onNavigate('profile');
  };

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
                            onClick={(e) => handleProfileClick(item.user, undefined, item.avatar, item.color, e)}
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
                                  onClick={(e) => handleProfileClick(item.user, undefined, item.avatar, item.color, e)}
                                >
                                  {item.user}
                                </span>
                                {' '}
                                {item.actionType === 'live' ? (
                                  <>
                                    is live
                                    {item.viewerCount && (
                                      <span style={{ color: '#FF4757', fontWeight: 'bold' }}> ({item.viewerCount} viewers)</span>
                                    )}
                                  </>
                                ) : item.actionType === 'donate' ? (
                                  <>
                                    donated
                                    {item.donationAmount && (
                                      <span style={{ color: actionStyle.color, fontWeight: 'bold' }}> {item.donationAmount}</span>
                                    )}
                                    {' '}to{' '}
                                    {item.targetUser ? (
                                      <span 
                                        className="cursor-pointer hover:underline font-medium"
                                        style={{ color: item.targetUser.color }}
                                        title={`View ${item.targetUser.name}'s profile`}
                                        onClick={(e) => handleProfileClick(item.targetUser.name, undefined, item.targetUser.avatar, item.targetUser.color, e)}
                                      >
                                        {item.targetUser.name}
                                      </span>
                                    ) : 'CharityStream'}
                                  </>
                                ) : item.actionType === 'support' ? (
                                  <>
                                    became a supporter of{' '}
                                    {item.targetUser && (
                                      <span 
                                        className="cursor-pointer hover:underline font-medium"
                                        style={{ color: item.targetUser.color }}
                                        title={`View ${item.targetUser.name}'s profile`}
                                        onClick={(e) => handleProfileClick(item.targetUser.name, undefined, item.targetUser.avatar, item.targetUser.color, e)}
                                      >
                                        {item.targetUser.name}
                                      </span>
                                    )}
                                  </>
                                ) : item.actionType === 'follow' ? (
                                  <>
                                    started following{' '}
                                    {item.targetUser && (
                                      <span 
                                        className="cursor-pointer hover:underline font-medium"
                                        style={{ color: item.targetUser.color }}
                                        title={`View ${item.targetUser.name}'s profile`}
                                        onClick={(e) => handleProfileClick(item.targetUser.name, undefined, item.targetUser.avatar, item.targetUser.color, e)}
                                      >
                                        {item.targetUser.name}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  item.action
                                )}
                              </div>
                            </div>
                            <div style={{ color: '#A9B7C6', fontSize: '11px' }}>{item.time}</div>
                            
                            {/* Sticker preview for sticker-related actions */}
                            {item.stickerData && (
                              <div className="mt-2 p-2 rounded border" style={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                                borderColor: 'rgba(255, 255, 255, 0.1)' 
                              }}>
                                <div className="flex items-center gap-2">
                                  <div className="relative group">
                                    <img 
                                      src={item.stickerData.thumbnail} 
                                      alt={item.stickerData.name}
                                      className="w-8 h-8 rounded object-cover dropsource-thumbnail"
                                    />
                                    <div className="dropsource-serial-overlay group-hover:opacity-100">
                                      {item.stickerData.serial}
                                    </div>
                                  </div>
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
                  <MessageSquare className="w-5 h-5" style={{ color: '#00AEEF' }} />
                  <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>Community Feed</h2>
                </div>
                <div className="space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                  {communityPosts.map((post) => {
                    const tagStyle = getCategoryTagStyle(post.category || '');
                    return (
                      <div 
                        key={post.uid}
                        className="p-4 rounded border"
                        style={{
                          backgroundColor: '#161B2E',
                          borderColor: '#1A2531',
                          transition: 'all 500ms ease-in-out'
                        }}
                      >
                        {/* Post Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: post.color }}
                            title={`View ${post.user}'s profile`}
                            onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                          >
                            {post.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span 
                                className="font-medium cursor-pointer hover:underline"
                                style={{ color: '#E6ECF3' }}
                                title={`View ${post.user}'s profile`}
                                onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                              >
                                {post.user}
                              </span>
                              <span 
                                className="text-sm cursor-pointer hover:underline"
                                style={{ color: '#A9B7C6' }}
                                title={`View ${post.user}'s profile`}
                                onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                              >
                                {post.handle}
                              </span>
                              {post.category && (
                                <span 
                                  className="px-2 py-1 rounded text-xs"
                                  style={{
                                    backgroundColor: tagStyle.backgroundColor,
                                    color: tagStyle.color,
                                    border: tagStyle.border
                                  }}
                                >
                                  {tagStyle.emoji} {post.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-3">
                          <p style={{ color: '#E6ECF3', fontSize: '14px', lineHeight: '1.5' }}>
                            {post.content}
                          </p>
                        </div>

                        {/* Sticker Preview */}
                        {post.stickerData && (
                          <div className="mb-3 p-3 rounded border" style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                            borderColor: 'rgba(255, 255, 255, 0.1)' 
                          }}>
                            <div className="flex items-center gap-3">
                              <div className="relative group">
                                <img 
                                  src={post.stickerData.thumbnail} 
                                  alt={post.stickerData.name}
                                  className="w-16 h-16 rounded object-cover dropsource-thumbnail"
                                />
                                <div className="dropsource-serial-overlay group-hover:opacity-100">
                                  {post.stickerData.serial}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#E6ECF3', fontSize: '14px', fontWeight: '500' }}>
                                  {post.stickerData.name}
                                </div>
                                <div style={{ color: '#A9B7C6', fontSize: '12px', fontFamily: 'monospace' }}>
                                  {post.stickerData.serial}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Card Preview */}
                        {post.cardData && (
                          <div className="mb-3 p-3 rounded border" style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                            borderColor: 'rgba(255, 255, 255, 0.1)' 
                          }}>
                            <div className="flex items-center gap-3">
                              <div className="relative group">
                                <img 
                                  src={post.cardData.thumbnail} 
                                  alt={post.cardData.name}
                                  className="w-16 h-16 rounded object-cover dropsource-thumbnail"
                                />
                                <div className="dropsource-serial-overlay group-hover:opacity-100">
                                  {post.cardData.serial}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#E6ECF3', fontSize: '14px', fontWeight: '500' }}>
                                  {post.cardData.name}
                                </div>
                                <div style={{ color: '#A9B7C6', fontSize: '12px', fontFamily: 'monospace' }}>
                                  {post.cardData.serial}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reactions */}
                        <div className="flex items-center gap-4">
                          {post.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <span>{reaction.emoji}</span>
                              <span style={{ color: '#A9B7C6', fontSize: '12px' }}>
                                {reaction.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Creator Spotlight + Leaderboards */}
            <div style={{ width: '350px', flexShrink: 0 }}>
              <div className="space-y-6" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {/* Creator Spotlight - ABOVE leaderboards as requested */}
                <div>
                  <PaginatedCreatorAdWidget />
                </div>

                {/* Leaderboards - BELOW Creator Spotlight */}
                <div>
                  <PaginatedLeaderboardWidget />
                </div>
              </div>
            </div>
          </div>

          {/* Tablet: 2-Column Layout */}
          <div className="hidden md:flex lg:hidden w-full justify-center gap-4">
            {/* Left Column - Community Posts */}
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
                  <MessageSquare className="w-5 h-5" style={{ color: '#00AEEF' }} />
                  <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>Community Feed</h2>
                </div>
                <div className="space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                  {communityPosts.map((post) => {
                    const tagStyle = getCategoryTagStyle(post.category || '');
                    return (
                      <div 
                        key={post.uid}
                        className="p-4 rounded border"
                        style={{
                          backgroundColor: '#161B2E',
                          borderColor: '#1A2531'
                        }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: post.color }}
                            title={`View ${post.user}'s profile`}
                            onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                          >
                            {post.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span 
                                className="font-medium cursor-pointer hover:underline"
                                style={{ color: '#E6ECF3' }}
                                title={`View ${post.user}'s profile`}
                                onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                              >
                                {post.user}
                              </span>
                              <span 
                                className="text-sm cursor-pointer hover:underline"
                                style={{ color: '#A9B7C6' }}
                                title={`View ${post.user}'s profile`}
                                onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                              >
                                {post.handle}
                              </span>
                              {post.category && (
                                <span 
                                  className="px-2 py-1 rounded text-xs"
                                  style={{
                                    backgroundColor: tagStyle.backgroundColor,
                                    color: tagStyle.color,
                                    border: tagStyle.border
                                  }}
                                >
                                  {tagStyle.emoji} {post.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p style={{ color: '#E6ECF3', fontSize: '14px', lineHeight: '1.5' }}>
                            {post.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {post.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <span>{reaction.emoji}</span>
                              <span style={{ color: '#A9B7C6', fontSize: '12px' }}>
                                {reaction.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Creator Spotlight + Leaderboards */}
            <div style={{ width: '350px', flexShrink: 0 }}>
              <div className="space-y-6" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {/* Creator Spotlight - ABOVE leaderboards */}
                <div>
                  <PaginatedCreatorAdWidget />
                </div>

                {/* Leaderboards */}
                <div>
                  <PaginatedLeaderboardWidget />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Single Column Layout */}
          <div className="flex md:hidden w-full flex-col gap-4 p-4" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            {/* Creator Spotlight at top on mobile */}
            <div>
              <PaginatedCreatorAdWidget />
            </div>

            {/* Community Posts */}
            <div 
              className="rounded border p-4"
              style={{
                backgroundColor: '#0F1520',
                borderColor: '#1A2531'
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" style={{ color: '#00AEEF' }} />
                <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>Community Feed</h2>
              </div>
              <div className="space-y-4">
                {communityPosts.slice(0, 5).map((post) => {
                  const tagStyle = getCategoryTagStyle(post.category || '');
                  return (
                    <div 
                      key={post.uid}
                      className="p-4 rounded border"
                      style={{
                        backgroundColor: '#161B2E',
                        borderColor: '#1A2531'
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: post.color }}
                          title={`View ${post.user}'s profile`}
                          onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                        >
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span 
                              className="font-medium cursor-pointer hover:underline"
                              style={{ color: '#E6ECF3' }}
                              title={`View ${post.user}'s profile`}
                              onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                            >
                              {post.user}
                            </span>
                            <span 
                              className="text-sm cursor-pointer hover:underline"
                              style={{ color: '#A9B7C6' }}
                              title={`View ${post.user}'s profile`}
                              onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                            >
                              {post.handle}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p style={{ color: '#E6ECF3', fontSize: '14px', lineHeight: '1.5' }}>
                          {post.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {post.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 rounded transition-colors"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <span>{reaction.emoji}</span>
                            <span style={{ color: '#A9B7C6', fontSize: '12px' }}>
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboards */}
            <div>
              <PaginatedLeaderboardWidget />
            </div>
          </div>
        </div>

        {/* Chat Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowChat(!showChat)}
              className="fixed bottom-6 right-6 p-4 rounded-full transition-all duration-300 z-50"
              style={{
                background: 'linear-gradient(135deg, #00AEEF 0%, #8F63FF 100%)',
                boxShadow: showChat ? '0 0 30px rgba(143, 99, 255, 0.6)' : '0 0 20px rgba(0, 174, 239, 0.4)',
                animation: showChat ? 'none' : 'pulse 2s infinite'
              }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="dropsource-card">
            <p style={{ fontSize: 'var(--text-sm)' }}>Live Chat</p>
          </TooltipContent>
        </Tooltip>

        {/* Live Chat */}
        {showChat && (
          <ChatPopout onClose={() => setShowChat(false)} />
        )}

        {/* Profile Hover Card */}
        {hoveredProfile && (
          <ProfileHoverCard
            user={hoveredProfile.user}
            handle={hoveredProfile.handle}
            avatar={hoveredProfile.avatar}
            color={hoveredProfile.color}
            position={hoveredProfile.position}
            onClose={() => setHoveredProfile(null)}
            onViewProfile={() => handleProfileRoute(hoveredProfile.user)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}