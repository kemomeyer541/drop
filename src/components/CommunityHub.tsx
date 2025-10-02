import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  MessageCircle, Users, ShoppingCart, UserPlus, Backpack, 
  Trophy, User, ArrowUp, ArrowDown, Star, Send, Megaphone, Home, FileText, Sparkles,
  Heart, Zap, Crown, Target, TrendingUp, Award, Flame, Diamond
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { SparkleLayer } from './SparkleLayer';
import { StarfieldBackground } from './StarfieldBackground';
import { ShootingStars } from './ShootingStars';
import { CardSparkEffect } from './CardSparkEffect';
import { RollingStats } from './RollingStats';
import { DopamineEffects, HoverGlow, AttentionPulse } from './DopamineEffects';

interface CommunityHubProps {
  onNavigate: (page: string) => void;
  onOpenFeature: (feature: string) => void;
}

const mockPosts = [
  {
    id: 1,
    user: 'beatmaster_supreme',
    stars: 15420,
    title: 'Sick Beat Drop',
    image: '🎵',
    votes: 47,
    comments: 12,
    genre: 'EDM'
  },
  {
    id: 2,
    user: 'lo_fi_goddess',
    stars: 8920,
    title: 'Rainy Day Vibes',
    image: '🌧️',
    votes: -3,
    comments: 8,
    genre: 'Lo-Fi'
  },
  {
    id: 3,
    user: 'guitar_shredder_99',
    stars: 23100,
    title: 'Metal Mayhem',
    image: '🎸',
    votes: 156,
    comments: 45,
    genre: 'Metal'
  },
  {
    id: 4,
    user: 'jazz_cat_cool',
    stars: 12750,
    title: 'Smooth Jazz Night',
    image: '🎷',
    votes: 23,
    comments: 6,
    genre: 'Jazz'
  },
];

const timeSpentUsers = [
  { user: 'grind_master_3000', hours: 847, streak: 92 },
  { user: 'insomniac_producer', hours: 623, streak: 67 },
  { user: 'studio_hermit', hours: 501, streak: 45 },
  { user: 'beat_obsessed', hours: 387, streak: 38 },
];

const completionists = [
  { user: 'achievement_hunter', completed: 156, total: 160, percentage: 97.5 },
  { user: 'goal_crusher', completed: 143, total: 160, percentage: 89.4 },
  { user: 'task_master_pro', completed: 138, total: 160, percentage: 86.3 },
  { user: 'completion_king', completed: 134, total: 160, percentage: 83.8 },
];

const leaderboardUsers = [
  { rank: 1, name: 'l34d3rb04rdpwnm4st3r', stars: 1250000 },
  { rank: 2, name: 'idontlik3l34d3rb04rdz', stars: 847300 },
  { rank: 3, name: 'wetbeaver', stars: 623400 },
  { rank: 4, name: 'makemusicordie', stars: 501200 },
  { rank: 5, name: 'bassdropharderthanmycock', stars: 387600 },
];

const announcements = [
  "🎉 NEW FEATURE: Voice memo recording now available!",
  "🏆 Weekly beat battle starts in 2 hours!",
  "🔥 Hot trending: Drill beats are taking over!",
  "💫 Special event: Double star weekend!",
  "🎵 Community playlist updated with your submissions!",
  "📢 Welcome to DropSource Community Hub! Connect, create, and showcase your work",
  "🎵 New Creator Spotlight: Check out today's featured artists",
  "⭐ Star Economy is live! Earn stars by participating in the community",
  "🏆 Weekly challenges now available - compete for exclusive rewards"
];

export function CommunityHub({ onNavigate, onOpenFeature }: CommunityHubProps) {
  const [postVotes, setPostVotes] = useState<{[key: number]: number}>({});
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const [chatUnreadCount, setChatUnreadCount] = useState(3);
  const [showChatPulse, setShowChatPulse] = useState(true);
  
  // Enhanced dopamine features
  const [showLikeAnimation, setShowLikeAnimation] = useState<number | null>(null);
  const [userStreak, setUserStreak] = useState(7);
  const [dailyReward, setDailyReward] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([1, 3]); // Post IDs that are trending
  const [showAchievement, setShowAchievement] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  const handleVote = (postId: number, direction: 'up' | 'down') => {
    setPostVotes(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (direction === 'up' ? 1 : -1)
    }));
    
    // Trigger dopamine effect for upvotes
    if (direction === 'up') {
      setShowLikeAnimation(postId);
      setTimeout(() => setShowLikeAnimation(null), 1000);
      
      // Add to recent activity
      setRecentActivity(prev => [
        `👍 You upvoted "${mockPosts.find(p => p.id === postId)?.title}"`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  const claimDailyReward = () => {
    setDailyReward(true);
    setUserStreak(prev => prev + 1);
    setShowAchievement(true);
    
    // Add to recent activity
    setRecentActivity(prev => [
      `🎁 Daily reward claimed! ${userStreak + 1} day streak!`,
      ...prev.slice(0, 4)
    ]);
    
    setTimeout(() => {
      setShowAchievement(false);
    }, 3000);
  };

  const handleChatLaunch = () => {
    onOpenFeature('live-chat');
    setChatUnreadCount(0);
    setShowChatPulse(false);
  };

  return (
    <DopamineEffects>
      <div 
        className="h-full overflow-hidden flex flex-col relative"
        style={{ 
          background: 'linear-gradient(180deg, #0D0D0D 0%, #121212 100%)',
          color: 'white',
          position: 'relative'
        }}
      >

      {/* Starfield Background */}
      <StarfieldBackground />
      
      {/* Shooting Stars */}
      <ShootingStars />
      
      {/* Grain texture overlay - 5% opacity as specified */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
          zIndex: 3
        }}
      />
      
      {/* Main Content Container - Centered and Locked for 1440×900 */}
      <div className="flex-1 flex flex-col items-center justify-start relative" style={{ 
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 40px 20px 40px',
        zIndex: 4
      }}>
        
        {/* Brand Name - Center Top */}
        <div className="text-center" style={{ marginTop: '0px', marginBottom: '8px' }}>
          <div 
            className="dropsource-logo-enhanced"
            style={{ 
              fontSize: '54px', 
              fontWeight: '900',
              fontFamily: 'Inter',
              background: 'linear-gradient(90deg, #B8E6F0 0%, #98C1F5 20%, #7DA8F7 40%, #B19CD9 60%, #C8A2C8 80%, #DDA0DD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              textShadow: '0 0 30px rgba(184, 230, 240, 0.4), 0 0 60px rgba(177, 156, 217, 0.3)',
              filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.15))',
              margin: 0,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.2em'
            }}
          >
            <motion.span
              initial={{ y: -200, opacity: 0, rotateX: -90, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.5
              }}
            >
              Drop
            </motion.span>
            <motion.span
              initial={{ y: -200, opacity: 0, rotateX: -90, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 1.0
              }}
            >
              Source
            </motion.span>
          </div>
          
          {/* Rolling Stats Component */}
          <RollingStats />
        </div>


        {/* Recent Activity Feed */}
        {recentActivity.length > 0 && (
          <div className="mb-6 w-full max-w-4xl">
            <Card className="bg-gray-900/50 border-gray-700 p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Your Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    {activity}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        
        {/* Hero Grid - Exactly 5 Cards - Locked Center/Top Constraints for 1440×900 */}
        <div className="flex gap-10" style={{ 
          marginTop: '8px', // Minimal top margin to ensure all cards above fold at 1440×900
          marginBottom: '16px', 
          gap: '40px',
          justifyContent: 'center' // Center alignment constraints
        }}>
          {/* Community Portal Card - Updated per spec with Animated Halo */}
          <div className="relative">
            {/* Complementary Cyan Glow for Community HUB (purple card) */}
            <div 
              className="absolute"
              style={{
                width: '456px', // 10-16px larger than card (420px + 36px)
                height: '636px', // 10-16px larger than card (600px + 36px)
                left: '-18px', // Center the glow
                top: '-18px',
                borderRadius: '16px',
                background: 'radial-gradient(ellipse at 50% 50%, #5BE9E9 0%, transparent 70%)', // Cyan glow
                // opacity animated in CSS keyframes
                filter: 'blur(55px)', // 50-60px blur
                animation: 'community-halo-animate 14s ease-in-out infinite',
                zIndex: 0,
                maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 90%)'
              }}
            />
            
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredPortal('community')}
              onMouseLeave={() => setHoveredPortal(null)}
              onClick={() => onNavigate('community-feed')}
              style={{
                width: '420px',
                height: '600px',
                borderRadius: '12px', // Changed from 32px to 12px per spec
                background: 'linear-gradient(180deg, #1A1033 0%, #2A1F4D 100%)', // Flipped Community HUB gradient per spec
                border: '1px solid transparent',
                borderImage: 'linear-gradient(180deg, rgba(30, 144, 255, 0.4), rgba(91, 233, 233, 0.4)) 1', // HUB gets blue/cyan trim
                backdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 6px 30px rgba(0, 0, 0, 0.12), 0 0 1px rgba(138, 43, 226, 0.3)', // Inner shadow + subtle purple trim glow
                transform: hoveredPortal === 'community' ? 'scale(1.03)' : 'scale(1)', // Changed from 1.05 to 1.03 per spec
                transition: '250ms ease-out', // Updated timing per spec
                filter: hoveredPortal === 'community' ? 'brightness(1.08)' : 'brightness(1)', // Updated brightness per spec
                position: 'relative',
                zIndex: 2
              }}
            >
            {/* Grain/Noise Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)' opacity='0.08'/%3E%3C/svg%3E")`,
                borderRadius: '12px', // Updated to match new corner radius
                opacity: 0.7,
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Card Spark Effect on Hover */}
            <CardSparkEffect isVisible={hoveredPortal === 'community'} />
            
            {/* Content */}
            <div className="relative z-10 p-12 h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-8 dropsource-emoji-float" style={{ '--emoji-delay': '0ms' } as React.CSSProperties}>✨🫂✨</div>
              <h2 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '800', // Changed to ExtraBold per spec
                  fontSize: '36px', // Updated to 34-36px per spec
                  color: 'white',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.25), 0 0 24px rgba(255, 209, 102, 0.18), 0 0 24px rgba(91, 233, 233, 0.18), inset 0 0 4px rgba(0, 0, 0, 0.1)', // Drop shadow + gold→cyan glow + optional inner shadow for engraved look
                  marginBottom: '24px'
                }}
              >
                Community HUB
              </h2>
              <p 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '400', // Regular per spec
                  fontSize: '16px', // Body 16 per spec
                  color: '#B0B0B0',
                  lineHeight: '1.5',
                  maxWidth: '280px'
                }}
              >
                Welcome to DropSource! Share your creation with the community!
              </p>
            </div>
          </div>
          </div>

          {/* Pad Portal Card - Updated per spec with Animated Halo */}
          <div className="relative">
            {/* Complementary Gold Glow for Pad (blue card) */}
            <div 
              className="absolute"
              style={{
                width: '456px', // 10-16px larger than card (420px + 36px)
                height: '636px', // 10-16px larger than card (600px + 36px)
                left: '-18px', // Center the glow
                top: '-18px',
                borderRadius: '16px',
                background: 'radial-gradient(ellipse at 50% 50%, #FFD166 0%, transparent 70%)', // Gold glow
                opacity: 0.2, // 20% opacity
                filter: 'blur(55px)', // 50-60px blur
                animation: 'pad-halo-animate 15s ease-in-out infinite', // Slightly different timing for variation
                zIndex: 0,
                maskImage: 'radial-gradient(ellipse at center, black 70%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 90%)'
              }}
            />
            
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredPortal('pad')}
              onMouseLeave={() => setHoveredPortal(null)}
              onClick={() => onNavigate('pad')}
              style={{
                width: '420px',
                height: '600px',
                borderRadius: '12px', // Changed from 32px to 12px per spec
                background: 'linear-gradient(180deg, #081526 0%, #0F244F 100%)', // Darker top to match nav bar  
                border: '1px solid transparent',
                borderImage: 'linear-gradient(180deg, rgba(138, 43, 226, 0.4), rgba(255, 215, 0, 0.3)) 1', // Pad gets purple trim
                backdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 6px 30px rgba(0, 0, 0, 0.12), 0 0 1px rgba(30, 144, 255, 0.3)', // Inner shadow + subtle blue trim glow
                transform: hoveredPortal === 'pad' ? 'scale(1.03)' : 'scale(1)', // Changed from 1.05 to 1.03 per spec
                transition: '250ms ease-out', // Updated timing per spec
                filter: hoveredPortal === 'pad' ? 'brightness(1.08)' : 'brightness(1)', // Updated brightness per spec
                position: 'relative',
                zIndex: 2
              }}
            >
            {/* Grain/Noise Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)' opacity='0.08'/%3E%3C/svg%3E")`,
                borderRadius: '12px', // Updated to match new corner radius
                opacity: 0.7,
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Card Spark Effect on Hover */}
            <CardSparkEffect isVisible={hoveredPortal === 'pad'} />
            
            {/* Content */}
            <div className="relative z-10 p-12 h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-8 dropsource-emoji-float" style={{ '--emoji-delay': '800ms' } as React.CSSProperties}>📝</div>
              <h2 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '800', // Changed to ExtraBold per spec
                  fontSize: '36px', // Updated to 34-36px per spec
                  color: 'white',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.25), 0 0 24px rgba(255, 209, 102, 0.18), 0 0 24px rgba(91, 233, 233, 0.18), inset 0 0 4px rgba(0, 0, 0, 0.1)', // Drop shadow + gold→cyan glow + optional inner shadow for engraved look
                  marginBottom: '24px'
                }}
              >
                Pad
              </h2>
              <p 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '400', // Regular per spec
                  fontSize: '16px', // Body 16 per spec
                  color: '#B0B0B0',
                  lineHeight: '1.5',
                  maxWidth: '280px'
                }}
              >
                Your creative workspace
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* Secondary Row - Exactly 3 Cards (DCP, Drop NEWS, Kickstarter) - Locked positioning */}
        <div className="flex gap-8" style={{ 
          marginBottom: '20px', // Final margin for clean ending
          gap: '40px',
          justifyContent: 'center' // Center alignment constraints
        }}>
          {/* Direct Contact Portal */}
          <div
            className="relative group cursor-pointer"
            onClick={() => onNavigate('dcp')}
            onMouseEnter={() => setHoveredPortal('dcp')}
            onMouseLeave={() => setHoveredPortal(null)}
            style={{
              width: '300px',
              height: '400px',
              borderRadius: '10px', // Changed from 24px to 10px per spec
              background: '#1a1a1a',
              border: '1px solid rgba(91, 233, 233, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(255, 209, 102, 0.15)', // Brand gradient glow @ 15% blur 40 per spec
              transition: 'all 250ms ease-out',
              transform: hoveredPortal === 'dcp' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            {/* Card Spark Effect on Hover */}
            <CardSparkEffect isVisible={hoveredPortal === 'dcp'} />
            <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-6 dropsource-emoji-float" style={{ '--emoji-delay': '400ms' } as React.CSSProperties}>📬</div>
              <h3 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '600', 
                  fontSize: '22px', // Updated to 20-22px per spec
                  color: 'white',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.25), 0 0 18px rgba(255, 209, 102, 0.18), 0 0 18px rgba(91, 233, 233, 0.18)', // Enhanced depth with stacked shadows
                  marginBottom: '16px'
                }}
              >
                DCP
              </h3>
              <p 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '400', 
                  fontSize: '16px', // 14-16px per spec
                  color: '#B0B0B0',
                  lineHeight: '1.5',
                  textAlign: 'center'
                }}
              >
                Direct Contact Portal - Message creators directly. No gatekeeping.
              </p>
            </div>
          </div>

          {/* Drop NEWS */}
          <div
            className="relative group cursor-pointer"
            onClick={() => onNavigate('news')}
            onMouseEnter={() => setHoveredPortal('news')}
            onMouseLeave={() => setHoveredPortal(null)}
            style={{
              width: '300px',
              height: '400px',
              borderRadius: '10px', // Changed from 24px to 10px per spec
              background: '#1a1a1a',
              border: '1px solid rgba(255, 209, 102, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(91, 233, 233, 0.15)', // Brand gradient glow @ 15% blur 40 per spec
              transition: 'all 250ms ease-out',
              transform: hoveredPortal === 'news' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            {/* Card Spark Effect on Hover */}
            <CardSparkEffect isVisible={hoveredPortal === 'news'} />
            <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-6 dropsource-emoji-float" style={{ '--emoji-delay': '1200ms' } as React.CSSProperties}>📰</div>
              <h3 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '600', 
                  fontSize: '22px', // Updated to 20-22px per spec
                  color: 'white',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.25), 0 0 18px rgba(255, 209, 102, 0.18), 0 0 18px rgba(91, 233, 233, 0.18)', // Enhanced depth with stacked shadows
                  marginBottom: '16px'
                }}
              >
                Drop NEWS
              </h3>
              <p 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '400', 
                  fontSize: '16px', // 14-16px per spec
                  color: '#B0B0B0',
                  lineHeight: '1.5',
                  textAlign: 'center'
                }}
              >
                Platform updates + spotlighted creators.
              </p>
            </div>
          </div>

          {/* Kickstarter Card - Matching trending/collab style with red gradient */}
          <div
            className="relative group cursor-pointer"
            onClick={() => window.open('https://kickstarter.com', '_blank')}
            onMouseEnter={() => setHoveredPortal('kickstarter')}
            onMouseLeave={() => setHoveredPortal(null)}
            style={{
              width: '300px',
              height: '400px',
              borderRadius: '10px',
              background: '#1a1a1a',
              border: '1px solid rgba(255, 107, 170, 0.3)', // Red highlight like trending card
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(255, 107, 170, 0.15)', // Red glow to match
              transition: 'all 250ms ease-out',
              transform: hoveredPortal === 'kickstarter' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            {/* Card Spark Effect on Hover */}
            <CardSparkEffect isVisible={hoveredPortal === 'kickstarter'} />
            <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-6 dropsource-emoji-float" style={{ '--emoji-delay': '1600ms' } as React.CSSProperties}>🚀</div>
              <h3 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '600', 
                  fontSize: '22px',
                  color: 'white',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.25), 0 0 18px rgba(255, 209, 102, 0.18), 0 0 18px rgba(91, 233, 233, 0.18)',
                  marginBottom: '16px'
                }}
              >
                Kickstarter
              </h3>
              <p 
                style={{ 
                  fontFamily: 'Inter', 
                  fontWeight: '400', 
                  fontSize: '16px',
                  color: '#B0B0B0',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}
              >
                Fund the community-owned creator hub
              </p>
              <div 
                style={{
                  background: 'linear-gradient(90deg, #FF6BAA 0%, #FFD166 100%)', // Red gradient like trending
                  color: '#000',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'inline-block'
                }}
              >
                🎯 Back Us Now
              </div>
            </div>
          </div>
        </div>

        {/* REMOVED: Bottom Row Cards - Deleted Spotlight, Stars Counter, Trending per requirements */}
        {/* Hero Grid now contains exactly 5 cards total: Community HUB, Pad, DCP, Drop NEWS, Kickstarter */}
        
      </div>

      {/* REMOVED: Chat Launcher Button - No longer showing on home screen */}
    </div>
    </DopamineEffects>
  );
}