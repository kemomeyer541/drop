// src/components/TopNav.tsx
import React from 'react';
import { useChat } from '../contexts/ChatContext';

interface TopNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenFeature: (feature: string) => void;
}

const LINKS = [
  { to: "home", label: "Home" },
  { to: "shop", label: "Shop" },
  { to: "profile", label: "Profile" },
  { to: "dms", label: "DMs" },
  { to: "friends", label: "Friends" },
  { to: "scrapbook", label: "Scrapbook" },
  { to: "book", label: "DropSource Book" },
  { to: "auction", label: "Auction" },
  { to: "live-chat", label: "Chat" },
];

export default function TopNav({ currentPage, onNavigate, onOpenFeature }: TopNavProps) {
  const { open: openChat, focus: focusChat, state: chatState } = useChat();

  const handleLinkClick = (link: typeof LINKS[0]) => {
    if (['home', 'profile', 'book'].includes(link.to)) {
      onNavigate(link.to);
    } else if (link.to === 'live-chat') {
      // Use chat service instead of opening feature
      if (chatState.isOpen) {
        focusChat(); // Focus existing chat
      } else {
        openChat(); // Open chat with last active channel
      }
    } else {
      onOpenFeature(link.to);
    }
  };

  return (
    <nav 
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(11, 15, 20, 0.9)',
        borderBottomColor: '#1A2531',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Centered Navigation Container */}
      <div className="mx-auto h-12 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {LINKS.map(l => {
            const isActive = (['home', 'profile', 'book'].includes(l.to) && currentPage === l.to) || 
                             (l.to === 'home' && ['community', 'community-feed', 'community-hub'].includes(currentPage));
            
            return (
              <button
                key={l.to}
                onClick={() => handleLinkClick(l)}
                className="px-4 py-2 text-sm font-medium transition-all duration-200 relative"
                style={{
                  color: isActive ? '#E6ECF3' : '#A9B7C6',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#E6ECF3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#A9B7C6';
                  }
                }}
              >
                {l.label}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ backgroundColor: '#3BA7FF' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}