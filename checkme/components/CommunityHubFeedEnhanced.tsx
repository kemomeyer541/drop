import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Shield, Star, Users, TrendingUp, MessageCircle, Heart, ShoppingBag, MessageSquare, FileText, Zap, BookOpen, User, X, Megaphone, ChevronUp, ChevronDown, Menu, Home, Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { PaginatedCreatorAdWidget } from "./PaginatedCreatorAdWidget";
import { PaginatedLeaderboardWidget } from "./PaginatedLeaderboardWidget";
import { IndependentMegaphoneTicker } from "./IndependentMegaphoneTicker";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { UserLink } from "./UserLink";
import { ActivityText } from "./ActivityText";
import { useChat } from "../contexts/ChatContext";
import { upsertPrepend, normalize, FeedItem, FeedItemRaw } from "../utils/feed";
import { getRandomSticker, getRandomCard, getRarityColor } from "../utils/collectibles";
import { 
  generateEnhancedActionWithCooldowns,
  generateEnhancedPostWithCooldowns,
  resetEnhancedContentSystem,
  getContentSystemStats,
  POST_REACTIONS,
  STATIC_USERNAMES
} from "../utils/enhancedContentData";

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
    'comment': { 
      color: '#87CEEB', 
      backgroundColor: 'rgba(135, 206, 235, 0.12)', 
      border: '1px solid rgba(135, 206, 235, 0.3)' 
    },
    'supporter': { 
      color: '#FFD700', 
      backgroundColor: 'rgba(255, 215, 0, 0.12)', 
      border: '1px solid rgba(255, 215, 0, 0.3)' 
    },
    'tip': { 
      color: '#FFA500', 
      backgroundColor: 'rgba(255, 165, 0, 0.12)', 
      border: '1px solid rgba(255, 165, 0, 0.3)' 
    },
    'challenge': { 
      color: '#9370DB', 
      backgroundColor: 'rgba(147, 112, 219, 0.12)', 
      border: '1px solid rgba(147, 112, 219, 0.3)' 
    },
    'chalkboard': { 
      color: '#20B2AA', 
      backgroundColor: 'rgba(32, 178, 170, 0.12)', 
      border: '1px solid rgba(32, 178, 170, 0.3)' 
    },
    'mint': { 
      color: '#9C27B0', 
      backgroundColor: 'rgba(156, 39, 176, 0.12)', 
      border: '1px solid rgba(156, 39, 176, 0.3)' 
    },
    'collect': { 
      color: '#FF1493', 
      backgroundColor: 'rgba(255, 20, 147, 0.12)', 
      border: '1px solid rgba(255, 20, 147, 0.3)' 
    },
    'auction': { 
      color: '#FFB347', 
      backgroundColor: 'rgba(255, 179, 71, 0.12)', 
      border: '1px solid rgba(255, 179, 71, 0.3)' 
    },
    'stream': { 
      color: '#FF4757', 
      backgroundColor: 'rgba(255, 71, 87, 0.12)', 
      border: '1px solid rgba(255, 71, 87, 0.3)' 
    },
    'stream_milestone': { 
      color: '#FF6B6B', 
      backgroundColor: 'rgba(255, 107, 107, 0.15)', 
      border: '1px solid rgba(255, 107, 107, 0.4)' 
    },
    'collab': { 
      color: '#32CD32', 
      backgroundColor: 'rgba(50, 205, 50, 0.12)', 
      border: '1px solid rgba(50, 205, 50, 0.3)' 
    },
    'join': { 
      color: '#82E0AA', 
      backgroundColor: 'rgba(130, 224, 170, 0.12)', 
      border: '1px solid rgba(130, 224, 170, 0.3)' 
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
  viewerCount?: number;
  donationAmount?: string;
  targetUser?: {
    name: string;
    avatar: string;
    color: string;
  };
  stickerData?: {
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
  stickerData?: {
    name: string;
    serial: string;
    thumbnail: string;
  };
  cardData?: {
    name: string;
    serial: string;
    thumbnail: string;
  };
}

export default function CommunityHubFeedEnhanced({ onNavigate }: CommunityHubFeedProps) {
  const { open: openChat, focus: focusChat, state: chatState } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  
  // Profile hover card state
  const [hoveredProfile, setHoveredProfile] = useState<{
    user: string;
    handle?: string;
    avatar: string;
    color: string;
    position: { x: number; y: number };
  } | null>(null);

  // Enhanced state using new content generation system
  const [siteActions, setSiteActions] = useState<SiteAction[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  const [isActionsHovered, setIsActionsHovered] = useState(false);
  const [isPostsHovered, setIsPostsHovered] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Content generation counters for staggered timing
  const [actionCounter, setActionCounter] = useState(0);
  const [postCounter, setPostCounter] = useState(0);

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

  // Initialize with some starting content
  useEffect(() => {
    const initialActions: SiteAction[] = [];
    const initialPosts: CommunityPost[] = [];

    // Generate initial actions
    for (let i = 0; i < 5; i++) {
      const actionData = generateEnhancedActionWithCooldowns(`initial-action-${i}`);
      const normalized = normalize({
        type: "site_action",
        id: actionData.id,
        ts: Date.now() - i * 60000,
        payload: actionData
      });

      initialActions.push({
        ...normalized,
        ...actionData
      } as SiteAction);
    }

    // Generate initial posts
    for (let i = 0; i < 3; i++) {
      const postData = generateEnhancedPostWithCooldowns(`initial-post-${i}`);
      const normalized = normalize({
        type: "community_post",
        id: postData.id,
        ts: Date.now() - i * 30000,
        payload: postData
      });

      initialPosts.push({
        ...normalized,
        ...postData
      } as CommunityPost);
    }

    setSiteActions(initialActions);
    setCommunityPosts(initialPosts);
  }, []);

  // Enhanced site actions with staggered intervals (2-4s as requested)
  useEffect(() => {
    if (isActionsHovered || !isPageVisible) return;

    const interval = setInterval(() => {
      const newActionData = generateEnhancedActionWithCooldowns(`action-${Date.now()}-${actionCounter}`);
      
      const normalized = normalize({
        type: "site_action",
        id: newActionData.id,
        ts: Date.now(),
        payload: newActionData
      });

      const newAction: SiteAction = {
        ...normalized,
        ...newActionData
      };

      // Use functional setter with upsertPrepend - max 25 items before trimming
      setSiteActions(prev => upsertPrepend(prev, newAction, 25));
      setActionCounter(c => c + 1);
    }, Math.random() * 2000 + 2000); // 2-4s random interval as requested

    return () => clearInterval(interval);
  }, [isActionsHovered, isPageVisible, actionCounter]);

  // Enhanced community posts with staggered intervals (2-4s as requested)
  useEffect(() => {
    if (isPostsHovered || !isPageVisible) return;

    const interval = setInterval(() => {
      const newPostData = generateEnhancedPostWithCooldowns(`post-${Date.now()}-${postCounter}`);
      
      const normalized = normalize({
        type: "community_post", 
        id: newPostData.id,
        ts: Date.now(),
        payload: newPostData
      });

      const newPost: CommunityPost = {
        ...normalized,
        ...newPostData
      };

      // Use functional setter with upsertPrepend - max 25 items
      setCommunityPosts(prev => upsertPrepend(prev, newPost, 25));
      setPostCounter(c => c + 1);
    }, Math.random() * 2000 + 2000); // 2-4s random interval as requested

    return () => clearInterval(interval);
  }, [isPostsHovered, isPageVisible, postCounter]);

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

        {/* Community Hub Header */}
        <div 
  className="flex justify-center py-3"
  style={{ 
    borderBottom: '1px solid #1A2531',
    backgroundColor: 'rgba(15, 21, 32, 0.8)',
    backdropFilter: 'blur(12px)',
    marginTop: '-6px' // moves it up slightly
  }}
>
  <h1 
    className="text-2xl font-semibold community-hub-pulse"
    style={{ 
      color: '#4DA6FF', 
      textShadow: '0 0 6px rgba(77,166,255,0.8), 0 0 14px rgba(77,166,255,0.6)' 
    }}
  >
    Community Hub
  </h1>
</div>

        {/* Centered Main Content Container */}
        <div 
          className="flex justify-center flex-1"
          style={{ 
            paddingTop: '24px', // Increased from 44px to give more space
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
                  height: 'calc(100vh - 160px)' // Adjusted for new header
                }}
                onMouseEnter={() => setIsActionsHovered(true)}
                onMouseLeave={() => setIsActionsHovered(false)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5" style={{ color: '#00AEEF' }} />
                  <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>All Site Actions</h2>
                </div>
                <div className="space-y-3 overflow-y-auto dropsource-custom-scrollbar" style={{ height: 'calc(100% - 60px)' }}>
                  {siteActions.map((item) => {
                    const actionStyle = getActionTypeStyle(item.actionType || '');
                    return (
                      <div 
                        key={item.uid}
                        className="p-3 rounded border feed-item-enter" 
                        style={{ 
                          backgroundColor: actionStyle.backgroundColor || '#161B2E', 
                          borderColor: actionStyle.border?.split(' ')[3] || '#1A2531',
                          opacity: 1,
                          transform: 'translateY(0)',
                          transition: 'all 300ms ease-in-out'
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
                            <div style={{ color: '#E6ECF3', fontSize: '13px' }}>
                              <ActivityText
                                text={item.action}
                                actorUser={{
                                  name: item.user,
                                  avatar: item.avatar,
                                  color: item.color
                                }}
                                targetUser={item.targetUser}
                                stickerData={item.stickerData}
                                onUserClick={handleProfileClick}
                                onCollectibleClick={(collectible, event) => {
                                  event.stopPropagation();
                                  // Handle collectible sheet opening
                                  console.log('Open collectible sheet:', collectible);
                                }}
                                onChallengeClick={(challengeName, event) => {
                                  event.stopPropagation();
                                  // Handle challenge opening
                                  console.log('Open challenge:', challengeName);
                                }}
                                onHashtagClick={(hashtag, event) => {
                                  event.stopPropagation();
                                  // Handle hashtag filter
                                  console.log('Filter by hashtag:', hashtag);
                                }}
                                onCtaClick={(cta, event) => {
                                  event.stopPropagation();
                                  // Handle CTA actions
                                  console.log('CTA clicked:', cta);
                                }}
                              />
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
                  height: 'calc(100vh - 160px)' // Adjusted for new header
                }}
                onMouseEnter={() => setIsPostsHovered(true)}
                onMouseLeave={() => setIsPostsHovered(false)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5" style={{ color: '#00AEEF' }} />
                  <h2 className="font-semibold" style={{ color: '#E6ECF3' }}>Community Feed</h2>
                </div>
                <div className="space-y-4 overflow-y-auto dropsource-custom-scrollbar" style={{ height: 'calc(100% - 60px)' }}>
                  {communityPosts.map((post) => {
                    const tagStyle = getCategoryTagStyle(post.category || '');
                    return (
                      <div 
                        key={post.uid}
                        className="p-4 rounded border feed-item-enter"
                        style={{
                          backgroundColor: '#161B2E',
                          borderColor: '#1A2531',
                          transition: 'all 300ms ease-in-out'
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
                              <UserLink
                                userId={`user-${post.user}`}
                                username={post.user}
                                handle={post.handle}
                                className="font-medium"
                                style={{ color: '#E6ECF3', fontSize: '14px' }}
                                onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                              />
                              <UserLink
                                userId={`user-${post.user}`}
                                username={post.user}
                                handle={post.handle}
                                style={{ color: '#A9B7C6', fontSize: '13px' }}
                                onClick={(e) => handleProfileClick(post.user, post.handle, post.avatar, post.color, e)}
                              >
                                {post.handle}
                              </UserLink>
                              {post.category && (
                                <span 
                                  className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                                  title={post.category} // Add tooltip
                                  style={{
                                    backgroundColor: tagStyle.backgroundColor,
                                    color: tagStyle.color,
                                    border: tagStyle.border,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '160px'
                                  }}
                                >
                                  {tagStyle.emoji}
                                  {post.category}
                                </span>
                              )}
                            </div>
                            <div style={{ color: '#E6ECF3', fontSize: '14px', lineHeight: '1.4' }}>
                              <ActivityText
                                text={post.content}
                                actorUser={{
                                  name: post.user,
                                  avatar: post.avatar,
                                  color: post.color
                                }}
                                stickerData={post.stickerData}
                                cardData={post.cardData}
                                onUserClick={handleProfileClick}
                                onCollectibleClick={(collectible, event) => {
                                  event.stopPropagation();
                                  console.log('Open collectible sheet:', collectible);
                                }}
                                onChallengeClick={(challengeName, event) => {
                                  event.stopPropagation();
                                  console.log('Open challenge:', challengeName);
                                }}
                                onHashtagClick={(hashtag, event) => {
                                  event.stopPropagation();
                                  console.log('Filter by hashtag:', hashtag);
                                }}
                                onCtaClick={(cta, event) => {
                                  event.stopPropagation();
                                  console.log('CTA clicked:', cta);
                                }}
                              />
                            </div>
                            
                            {/* Reactions */}
                            <div className="flex items-center gap-2 mt-3">
                              {post.reactions.map((reaction, index) => (
                                <button
                                  key={index}
                                  className="dropsource-reaction-pill hover:scale-105 transition-transform"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Sticker/Card preview if present */}
                        {post.stickerData && (
                          <div className="mt-3 p-3 rounded border" style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                            borderColor: 'rgba(255, 255, 255, 0.1)' 
                          }}>
                            <div className="flex items-center gap-3">
                              <div className="relative group">
                                <img 
                                  src={post.stickerData.thumbnail} 
                                  alt={post.stickerData.name}
                                  className="w-12 h-12 rounded object-cover dropsource-thumbnail"
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Widgets */}
            <div style={{ width: '350px', flexShrink: 0 }}>
              <div className="space-y-6">
                {/* Creator Ad Widget */}
                <PaginatedCreatorAdWidget />
                
                {/* Leaderboard Widget */}
                <PaginatedLeaderboardWidget />
              </div>
            </div>
          </div>

          {/* Mobile & Tablet: Responsive Layout */}
          <div className="lg:hidden flex flex-col h-full">
            {/* Mobile content would go here */}
          </div>
        </div>

        {/* Profile Hover Card */}
        {hoveredProfile && (
          <ProfileHoverCard
            user={hoveredProfile.user}
            handle={hoveredProfile.handle}
            avatar={hoveredProfile.avatar}
            color={hoveredProfile.color}
            position={hoveredProfile.position}
            onClose={() => setHoveredProfile(null)}
            onNavigateToProfile={() => handleProfileRoute(hoveredProfile.user)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}