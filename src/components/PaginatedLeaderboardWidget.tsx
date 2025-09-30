import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Star, TrendingUp, Users, Zap, Heart, MessageCircle, ShoppingBag, Palette, Play } from 'lucide-react';
import { generateUsername, getRandomStaticUsername } from '../utils/contentData';

const CREATOR_QUOTES = [
  "Daily pixel practice. Comms open.",
  "Free sticker every Friday—come grab one.",
  "Portfolio revamped—critique welcome!",
  "Turning ideas into interactive art since 2020.",
  "Beats that hit different. DM for collabs.",
  "Cursed content creator. You've been warned.",
  "Lowkey the best sticker dealer on this site.",
  "Making memes that cure depression.",
  "Professional shitposter. Amateur artist.",
  "Your mom's favorite content creator.",
  "Accidentally famous. Send help.",
  "Chaotic neutral energy only.",
  "Making art that makes your therapist concerned.",
  "Turning trauma into content since forever.",
  "Feral but in a cute way.",
  "Basement dweller with good WiFi.",
  "Chronically online and proud.",
  "Making weird stuff for weird people.",
  "Certified disaster bisexual.",
  "Goblin mode: permanently activated.",
  "Unhinged but harmless.",
  "Your local cryptid artist.",
  "Making content that shouldn't exist.",
  "Blessed and cursed simultaneously.",
  "Vibes are immaculate. Content is questionable.",
  "Professional disappointment.",
  "Making art with my remaining brain cell.",
  "Chaos incarnate. Tips appreciated.",
  "Local menace to society.",
  "Accidentally started three art movements."
];

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', 
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9',
  '#D7BDE2', '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB', '#AED6F1'
];

const LEADERBOARD_CATEGORIES = [
  { name: "Most Hours This Week", icon: Star, suffix: "hrs" },
  { name: "Top Stars", icon: Star, suffix: "⭐" },
  { name: "Top Donations", icon: Heart, suffix: "⭐" },
  { name: "Top Stickers Purchased", icon: ShoppingBag, suffix: "" },
  { name: "Top Stickers Created", icon: Palette, suffix: "" },
  { name: "Top Monthly Supporters", icon: Users, suffix: "" },
  { name: "Top Community Actions", icon: Zap, suffix: "" },
  { name: "Top Followers Gained", icon: TrendingUp, suffix: "" },
  { name: "Top Posts", icon: MessageCircle, suffix: "" },
  { name: "New Users", icon: Users, suffix: "days ago" },
  { name: "Most Active Streamers", icon: Play, suffix: "hrs" },
  { name: "Top Content Creators", icon: Trophy, suffix: "drops" },
  { name: "Rising Stars", icon: TrendingUp, suffix: "⭐" },
  { name: "Community Champions", icon: Heart, suffix: "actions" },
  { name: "Collaboration Kings", icon: Users, suffix: "collabs" },
  { name: "Marketplace MVPs", icon: ShoppingBag, suffix: "sales" },
  { name: "Feedback Heroes", icon: MessageCircle, suffix: "reviews" },
  { name: "Innovation Leaders", icon: Zap, suffix: "features" },
  { name: "Support Squad", icon: Heart, suffix: "helped" }
];

type LeaderboardEntry = {
  name: string;
  handle: string;
  value: number;
  avatarBg: string;
  quote: string;
  trustScore: number;
};

type LeaderboardData = {
  category: typeof LEADERBOARD_CATEGORIES[0];
  entries: LeaderboardEntry[];
};

interface PaginatedLeaderboardWidgetProps {
  widgetIndex?: number;
}

export function PaginatedLeaderboardWidget({ widgetIndex = 0 }: PaginatedLeaderboardWidgetProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [leaderboards, setLeaderboards] = useState<LeaderboardData[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredEntry, setHoveredEntry] = useState<LeaderboardEntry | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Intersection Observer for visibility detection
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (widgetRef.current) {
      observer.observe(widgetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-cycle every 12s with pause on hover and when off-screen
  useEffect(() => {
    if (isHovered || !isVisible || leaderboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % leaderboards.length);
    }, 12000); // 12 second interval

    return () => clearInterval(interval);
  }, [isHovered, isVisible, leaderboards.length]);

  const generateLeaderboardData = (): LeaderboardData => {
    // Use widget index to offset category selection to avoid duplicates
    const categoryIndex = (Math.floor(Math.random() * LEADERBOARD_CATEGORIES.length) + (widgetIndex * 10)) % LEADERBOARD_CATEGORIES.length;
    const category = LEADERBOARD_CATEGORIES[categoryIndex];
    
    // Safety check to ensure category exists
    if (!category || !category.name) {
      console.error('Invalid category selected:', categoryIndex, category);
      // Fallback to first category if something goes wrong
      const fallbackCategory = LEADERBOARD_CATEGORIES[0];
      return {
        category: fallbackCategory,
        entries: []
      };
    }
    
    const entries: LeaderboardEntry[] = [];
    const usedNames = new Set<string>();
    
    // Generate 5 unique entries using contentData functions
    while (entries.length < 5) {
      const creator = Math.random() > 0.5 ? generateUsername() : getRandomStaticUsername();
      if (usedNames.has(creator)) continue;
      
      usedNames.add(creator);
      
      // Use creator name as seed for consistent values
      let seed = 0;
      for (let i = 0; i < creator.length; i++) {
        seed += creator.charCodeAt(i);
      }
      
      const baseValue = seed % 1000;
      let value: number;
      
      // Different value ranges based on category
      switch (category.name) {
        case "Most Hours This Week":
        case "Most Active Streamers":
          value = 10 + (baseValue % 150); // 10-160 hours
          break;
        case "Top Stars":
        case "Top Donations":
        case "Rising Stars":
          value = 1000 + (baseValue % 49000); // 1k-50k stars
          break;
        case "New Users":
          value = 1 + (baseValue % 30); // 1-30 days ago
          break;
        default:
          value = 5 + (baseValue % 495); // 5-500 for most categories
      }
      
      entries.push({
        name: creator,
        handle: creator.toLowerCase().replace(/([A-Z])/g, (match, letter, index) => 
          index > 0 ? '_' + letter.toLowerCase() : letter.toLowerCase()),
        value,
        avatarBg: AVATAR_COLORS[seed % AVATAR_COLORS.length],
        quote: CREATOR_QUOTES[seed % CREATOR_QUOTES.length],
        trustScore: 75 + (seed % 20) // 75-95 range
      });
    }
    
    // Sort by value (descending for most categories, ascending for "New Users")
    entries.sort((a, b) => {
      if (category.name === "New Users") {
        return a.value - b.value; // Ascending for "days ago"
      }
      return b.value - a.value; // Descending for everything else
    });
    
    return { category, entries };
  };

  const generateAllLeaderboards = () => {
    const boards: LeaderboardData[] = [];
    
    // Safety check for required arrays
    if (LEADERBOARD_CATEGORIES.length === 0 || AVATAR_COLORS.length === 0) {
      console.error('Required data arrays are empty');
      return [];
    }
    
    // Generate 6 different leaderboards for pagination
    for (let i = 0; i < 6; i++) {
      const board = generateLeaderboardData();
      if (board && board.entries.length > 0) {
        boards.push(board);
      }
    }
    
    return boards;
  };

  useEffect(() => {
    setLeaderboards(generateAllLeaderboards());
  }, [widgetIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    setHoveredEntry(null); // Clear any hover state
    
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsTransitioning(false);
    }, 200); // Half of transition duration for crossfade effect
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentPage > 0) {
      handlePageChange(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < leaderboards.length - 1) {
      handlePageChange(currentPage + 1);
    } else if (e.key === 'Enter' && e.target instanceof HTMLElement) {
      e.target.click();
    }
  };

  const handleMouseEnter = (entry: LeaderboardEntry, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredEntry(entry);
    // Position tooltip to the left of the widget with some spacing
    setHoverPosition({ 
      x: rect.left - 280, 
      y: Math.max(20, rect.top - 50) // Prevent tooltip from going off-screen at top
    });
  };

  const handleMouseLeave = () => {
    setHoveredEntry(null);
    setHoverPosition(null);
  };

  if (leaderboards.length === 0) return null;

  const currentLeaderboard = leaderboards[currentPage];
  if (!currentLeaderboard || !currentLeaderboard.category || !currentLeaderboard.entries) {
    return null;
  }
  
  const { category, entries } = currentLeaderboard;
  const Icon = category.icon;

  return (
    <>
      <div
        className="rounded border"
        style={{
          backgroundColor: '#0F1520',
          borderColor: '#1A2531',
          height: '400px', // Fixed height
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={widgetRef}
      >
        {/* Content Container - Fixed Height */}
        <div 
          className="p-4 flex-1"
          style={{
            transform: isTransitioning ? 'translateY(-8px)' : 'translateY(0)',
            opacity: isTransitioning ? 0.7 : 1,
            transition: 'all 400ms ease-in-out',
            willChange: 'transform, opacity'
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-4 h-4" style={{ color: '#00AEEF' }} />
            <h3 style={{ color: '#E6ECF3', fontSize: '14px', fontWeight: '600' }}>
              {category.name}
            </h3>
          </div>

          {/* Entries */}
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={`${entry.name}-${index}`}
                className="flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-200 hover:bg-opacity-50"
                style={{
                  backgroundColor: index === 0 ? 'rgba(255, 176, 57, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => handleMouseEnter(entry, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Rank */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-200 flex-shrink-0"
                  style={{
                    backgroundColor: index === 0 ? '#FFB039' : '#1A2531',
                    color: index === 0 ? '#000' : '#A9B7C6'
                  }}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold transition-transform duration-200 hover:scale-110 flex-shrink-0"
                  style={{ backgroundColor: entry.avatarBg }}
                >
                  {entry.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-sm truncate"
                    style={{ color: '#E6ECF3' }}
                  >
                    {entry.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: '#A9B7C6' }}
                  >
                    @{entry.handle}
                  </div>
                </div>

                {/* Value with Proper Spacing */}
                <div
                  className="text-sm font-semibold flex-shrink-0"
                  style={{ 
                    color: index === 0 ? '#FFB039' : '#63B3FF',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '60px',
                    textAlign: 'right'
                  }}
                >
                  {entry.value.toLocaleString()}
                  {category.suffix && <span style={{ marginLeft: '2px' }}>{category.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Controls - Fixed Position */}
        <div 
          className="flex items-center justify-center gap-2 p-3 border-t"
          style={{ 
            borderColor: '#1A2531',
            height: '48px',
            flexShrink: 0
          }}
        >
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-1 rounded transition-opacity duration-200 hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#A9B7C6' }}
            aria-label="Previous leaderboard"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center gap-2">
            {leaderboards.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className="transition-all duration-400 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  width: currentPage === index ? '12px' : '8px',
                  height: currentPage === index ? '12px' : '8px',
                  backgroundColor: currentPage === index ? '#00AEEF' : '#A9B7C6',
                  opacity: currentPage === index ? 1 : 0.5,
                  willChange: 'transform, background-color'
                }}
                aria-label={`Go to leaderboard ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(Math.min(leaderboards.length - 1, currentPage + 1))}
            disabled={currentPage === leaderboards.length - 1}
            className="p-1 rounded transition-opacity duration-200 hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#A9B7C6' }}
            aria-label="Next leaderboard"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Enhanced Profile Preview on Hover */}
      {hoveredEntry && hoverPosition && (
        <div
          className="fixed z-50 animate-fadeInSmooth"
          style={{
            left: hoverPosition.x,
            top: hoverPosition.y,
            minWidth: '280px'
          }}
        >
          <div
            className="rounded border p-4 shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(15, 21, 32, 0.95)',
              borderColor: '#1A2531',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold border-2"
                style={{ 
                  backgroundColor: hoveredEntry.avatarBg,
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {hoveredEntry.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: '#E6ECF3' }}>
                  {hoveredEntry.name}
                </h3>
                <p className="text-sm" style={{ color: '#A9B7C6' }}>
                  @{hoveredEntry.handle}
                </p>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-xs mb-1 opacity-70" style={{ color: '#A9B7C6' }}>Quote</div>
              <div 
                className="text-sm italic p-2 rounded"
                style={{ 
                  color: '#E6ECF3',
                  backgroundColor: 'rgba(0, 174, 239, 0.1)',
                  borderLeft: '3px solid #00AEEF'
                }}
              >
                "{hoveredEntry.quote}"
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="text-xs opacity-70" style={{ color: '#A9B7C6' }}>Trust Score</div>
                <div 
                  className="font-semibold"
                  style={{ 
                    color: hoveredEntry.trustScore >= 90 ? '#2EA043' : '#63B3FF'
                  }}
                >
                  {hoveredEntry.trustScore}%
                </div>
              </div>
              <div>
                <div className="text-xs opacity-70" style={{ color: '#A9B7C6' }}>
                  {category.name}
                </div>
                <div 
                  className="font-semibold"
                  style={{ 
                    color: '#FFB039',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {hoveredEntry.value.toLocaleString()}
                  {category.suffix && <span style={{ marginLeft: '2px' }}>{category.suffix}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                style={{
                  backgroundColor: '#00AEEF',
                  color: '#000'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0099CC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00AEEF';
                }}
              >
                View Profile
              </button>
              {currentLeaderboard?.category.name.includes('Stream') && (
                <button
                  className="px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: '#FFB039',
                    color: '#000'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E69A2E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFB039';
                  }}
                >
                  Watch Stream
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}