// src/components/MegaphoneTicker.tsx
import { useEffect, useRef, useState } from "react";
import { 
  ACTIVE_MEGAPHONE_MESSAGES, 
  MEGAPHONE_TEMPLATES,
  STATIC_USERNAMES,
  MUSIC_GENRES,
  MUSIC_ADJECTIVES,
  COLLECTIBLE_TYPES,
  RARITY_TYPES,
  getRandomStaticUsername,
  type MegaphoneMessage 
} from "../utils/contentData";

interface MegaphoneTickerProps {
  messages?: string[];
  scope?: 'global' | 'community' | 'pad';
}

const DEFAULT_MESSAGES = [
  "📢 Welcome to DropSource Community Hub! Connect, create, and showcase your work",
  "🎵 New Creator Spotlight: Check out today's featured artists",
  "⭐ Star Economy is live! Earn stars by participating in the community",
  "🏆 Weekly challenges now available - compete for exclusive rewards",
  "🎨 Featured: Latest pixel art drops from the community",
  "💫 Join the conversation in our live chat channels"
];

// Function to generate dynamic megaphone messages from templates
function generateDynamicMessage(): string {
  const template = MEGAPHONE_TEMPLATES[Math.floor(Math.random() * MEGAPHONE_TEMPLATES.length)];
  
  return template
    .replace(/{user}/g, getRandomStaticUsername())
    .replace(/{genre}/g, MUSIC_GENRES[Math.floor(Math.random() * MUSIC_GENRES.length)])
    .replace(/{adjective}/g, MUSIC_ADJECTIVES[Math.floor(Math.random() * MUSIC_ADJECTIVES.length)])
    .replace(/{collectible}/g, COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)])
    .replace(/{type}/g, COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)])
    .replace(/{rarity}/g, RARITY_TYPES[Math.floor(Math.random() * RARITY_TYPES.length)])
    .replace(/{number}/g, String(Math.floor(Math.random() * 100) + 1))
    .replace(/{challenge}/g, 'Beat Battle')
    .replace(/{software}/g, 'FL Studio')
    .replace(/{topic}/g, '#DropSource');
}

export default function MegaphoneTicker({ messages = DEFAULT_MESSAGES, scope = 'global' }: MegaphoneTickerProps) {
  const [idx, setIdx] = useState(0);
  const hovering = useRef(false);
  const INTERVAL = 6500; // 6.5 second intervals (6-8s as specified)

  // Get active manual messages first, then fall back to default/provided messages
  const activeManualMessages = ACTIVE_MEGAPHONE_MESSAGES
    .filter(msg => msg.active && (!msg.scope || msg.scope === scope || msg.scope === 'global') && (!msg.expiresAt || new Date() < msg.expiresAt))
    .map(msg => msg.message);
  
  // Generate some dynamic messages to mix in
  const dynamicMessages = Array.from({ length: 5 }, () => generateDynamicMessage());
  
  const allMessages = activeManualMessages.length > 0 
    ? [...activeManualMessages, ...dynamicMessages, ...messages] 
    : [...dynamicMessages, ...messages];

  // Deduplicate messages by content hash to prevent template repeats
  const uniqueMessages = allMessages.filter((message, index, arr) => 
    arr.findIndex(m => m === message) === index
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      if (hovering.current) return; // Pause when hovering
      setIdx(i => (i + 1) % uniqueMessages.length);
    }, INTERVAL + Math.random() * 2000); // 6.5-8.5s random interval
    return () => window.clearInterval(id);
  }, [uniqueMessages.length]);

  const msg = uniqueMessages[idx] ?? "";

  return (
    <div
      className="h-8 flex items-center gap-2 px-3 text-sm border-b"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      title={msg} // Native tooltip on hover
      style={{
        background: 'linear-gradient(90deg, #FFB039 0%, #FF8C42 100%)',
        borderBottomColor: 'rgba(255, 176, 57, 0.3)',
        transition: 'all 200ms ease-out'
      }}
    >
      <span className="text-black">📣</span>
      <div 
        className="truncate text-black font-medium flex-1"
        style={{
          transform: 'translateX(0px)',
          transition: 'transform 300ms ease-out, opacity 300ms ease-out'
        }}
        dangerouslySetInnerHTML={{
          __html: msg
            // Bold emoji first - using a simpler emoji detection
            .replace(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}])/u, '<strong>$1</strong>')
            // Highlight links with cyan
            .replace(/(https?:\/\/[^\s]+)/g, '<span style="color: #5BE9E9; text-decoration: underline;">$1</span>')
            // Highlight @mentions with cyan
            .replace(/(@\w+)/g, '<span style="color: #5BE9E9;">$1</span>')
            // Highlight #hashtags with cyan
            .replace(/(#\w+)/g, '<span style="color: #5BE9E9;">$1</span>')
        }}
      />
      {hovering.current && (
        <span 
          className="text-black/60 text-xs"
          style={{ fontSize: '10px' }}
        >
          ⏸ PAUSED
        </span>
      )}
    </div>
  );
}