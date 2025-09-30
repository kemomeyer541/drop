import React, { useEffect, useRef, useState } from "react";
import { Megaphone } from "lucide-react";
import { generateUsername, getRandomStaticUsername, ACTIVE_MEGAPHONE_MESSAGES } from '../utils/contentData';

// User megaphone announcements - real creator posts only
const USER_MEGAPHONE_TEMPLATES = [
  "🔥 @{user}: FIRST DROP OF 2025 IS LIVE! My debut EP 'Midnight Chaos' just dropped - limited edition vinyl available!",
  "🎨 @{user}: COLLAB CALL! Looking for producers to work on my new synthwave project. DM me if you're interested!",
  "💎 @{user}: RARE CARD ALERT! Just minted 'Golden Frequency' - only 100 copies exist. Auction starts in 1 hour!",
  "🎵 @{user}: FREE SAMPLE PACK! Dropping 50 lo-fi beats for the community. First come, first served!",
  "⚡ @{user}: REMIX CONTEST! Best remix of my track 'Digital Dreams' wins 500 stars + feature on my profile!",
  "🚀 @{user}: BIG NEWS! My track just hit 10K plays! Celebrating with a FREE sticker pack for everyone!",
  "🎯 @{user}: CHALLENGE ACCEPTED! Attempting to create 30 beats in 30 days. Follow my journey!",
  "👑 @{user}: LEGENDARY CARD DROP! 'Phoenix Rising' collectible now available - hand-drawn artwork included!",
  "🌟 @{user}: MILESTONE REACHED! 1000 followers celebration stream starting NOW. Come hang out!",
  "🎪 @{user}: SURPRISE COLLAB! Just finished an epic track with @{collaborator} - dropping tomorrow at midnight!",
  "💰 @{user}: AUCTION ALERT! My rare 'Vintage Synth' card is up for bidding. Starting at 100 stars!",
  "🔊 @{user}: LIVESTREAM STARTING! Working on a new beat live - come watch the magic happen!",
  "🎁 @{user}: GIVEAWAY TIME! Giving away 3 premium cards to celebrate my latest single. Repost to enter!",
  "⭐ @{user}: STARS FOR FEEDBACK! First 10 people to review my new track get 50 stars each!",
  "🎼 @{user}: MUSIC THEORY TIPS! Sharing my chord progression secrets in tonight's live tutorial!",
  "🔥 @{user}: BEAT BATTLE! Challenging @{collaborator} to a live production battle. Winner takes all!",
  "💎 @{user}: EXCLUSIVE PREVIEW! Get early access to my upcoming album by joining my supporter tier!",
  "🎨 @{user}: ARTWORK REVEAL! Check out the stunning cover art for my new single 'Neon Nights'!",
  "⚡ @{user}: FLASH SALE! All my beats 50% off for the next hour only. Don't sleep on this!",
  "🌊 @{user}: GENRE FUSION! Experimenting with trap-jazz. What unexpected combos should I try next?"
];

interface IndependentMegaphoneTickerProps {
  onCreatorClick?: (creator: string, position: { x: number; y: number }) => void;
}

export function IndependentMegaphoneTicker({ onCreatorClick }: IndependentMegaphoneTickerProps) {
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);

  // Generate user-driven ticker content with manual megaphones prioritized
  useEffect(() => {
    const generateMessages = () => {
      const messages: string[] = [];
      
      // FIRST: Add active manual megaphone messages
      const activeManualMessages = ACTIVE_MEGAPHONE_MESSAGES
        .filter(msg => msg.active && (!msg.expiresAt || new Date() < msg.expiresAt))
        .map(msg => msg.message);
      
      messages.push(...activeManualMessages);
      
      // THEN: Generate user megaphone announcements (auto-generated)
      for (let i = 0; i < 15; i++) {
        const randomUser = Math.random() > 0.5 ? generateUsername() : getRandomStaticUsername();
        const template = USER_MEGAPHONE_TEMPLATES[Math.floor(Math.random() * USER_MEGAPHONE_TEMPLATES.length)];
        
        // Replace placeholders with actual users
        let message = template.replace('{user}', randomUser);
        
        // Add collaborator if template includes one
        if (message.includes('{collaborator}')) {
          const collaborator = Math.random() > 0.5 ? generateUsername() : getRandomStaticUsername();
          message = message.replace('{collaborator}', collaborator);
        }
        
        // Deduplicate against manual messages by content hash
        const messageHash = message.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isDuplicate = activeManualMessages.some(manual => 
          manual.toLowerCase().replace(/[^a-z0-9]/g, '').includes(messageHash) ||
          messageHash.includes(manual.toLowerCase().replace(/[^a-z0-9]/g, ''))
        );
        
        if (!isDuplicate) {
          messages.push(message);
        }
      }
      
      setTickerMessages(messages);
    };

    generateMessages();
    
    // Refresh messages every 2 minutes (not tied to feed updates)
    const interval = setInterval(generateMessages, 120000);
    return () => clearInterval(interval);
  }, []);

  // Handle username clicks
  const handleUsernameClick = (username: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (onCreatorClick) {
      const rect = event.currentTarget.getBoundingClientRect();
      onCreatorClick(username, { 
        x: rect.left + rect.width / 2, 
        y: rect.bottom + 10 
      });
    }
  };

  // Render message with clickable usernames
  const renderMessage = (message: string, index: number) => {
    const parts = message.split(/(@\w+)/g);
    return (
      <span 
        key={`msg-${index}`} 
        className="inline-flex items-center whitespace-nowrap"
        style={{ marginRight: '60px' }} // Fixed spacing between messages
      >
        {parts.map((part, partIndex) => {
          if (part.startsWith('@') && part.length > 1) {
            const username = part.substring(1);
            return (
              <button
                key={`${index}-${partIndex}`}
                onClick={(e) => handleUsernameClick(username, e)}
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: '#000' }}
              >
                {part}
              </button>
            );
          }
          return <span key={`${index}-${partIndex}`}>{part}</span>;
        })}
      </span>
    );
  };

  if (tickerMessages.length === 0) return null;

  // Create seamless loop content
  const doubledMessages = [...tickerMessages, ...tickerMessages];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        backgroundColor: '#63B3FF',
        color: '#000',
        padding: '10px 0',
        overflow: 'hidden',
        height: window.innerWidth < 768 ? '36px' : '44px', // Responsive height
        marginTop: '80px' // Push below the navigation header
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 flex items-center gap-2 md:gap-4 h-full">
        {/* Responsive Icon */}
        <Megaphone 
          className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" 
          style={{ minWidth: window.innerWidth < 768 ? '16px' : '20px' }}
        />
        
        {/* Responsive Scrolling Content */}
        <div 
          className="overflow-hidden flex-1"
          style={{ height: window.innerWidth < 768 ? '20px' : '24px' }}
        >
          <div
            ref={tickerRef}
            className="flex items-center"
            style={{
              animationName: 'scroll-left',
              animationDuration: window.innerWidth < 768 ? '120s' : '180s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
              fontSize: window.innerWidth < 768 ? '13px' : '15px',
              fontWeight: '500',
              height: window.innerWidth < 768 ? '20px' : '24px',
              willChange: 'transform' // Optimize for animations
            }}
          >
            {doubledMessages.map((message, index) => 
              renderMessage(message, index)
            )}
          </div>
        </div>

        {/* Mobile: Show pause/play indicator */}
        {window.innerWidth < 768 && (
          <div 
            className="text-xs opacity-50 flex-shrink-0"
            style={{ minWidth: '30px', fontSize: '10px' }}
          >
            {isPaused ? '⏸️' : '▶️'}
          </div>
        )}
      </div>
    </div>
  );
}