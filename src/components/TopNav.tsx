// src/components/TopNav.tsx
import React from 'react';
import { motion } from 'motion/react';
import { useChat } from '../contexts/ChatContext';
import { Bell, Star } from 'lucide-react';

interface TopNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenFeature: (feature: string) => void;
}

const LINKS = [
  { to: "community", label: "Home" },
  { to: "community-feed", label: "Community Hub" },
  { to: "pad", label: "Pad" },
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
  const [animationKey, setAnimationKey] = React.useState(0);

  // Trigger animation on page change
  React.useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentPage]);

  const handleLinkClick = (link: typeof LINKS[0]) => {
    if (['community', 'community-feed', 'pad', 'profile', 'book'].includes(link.to)) {
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
      {/* Full Width Container */}
      <div className="mx-auto h-12 flex items-center justify-between px-6">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <div 
            className="cursor-pointer flex"
            onClick={() => onNavigate('community')}
          >
            <motion.span 
              key={`drop-${animationKey}`}
              className="text-lg font-bold dropsource-logo-enhanced"
              initial={{ y: -80, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.1
              }}
              style={{ 
                background: 'linear-gradient(90deg, #9fc5e8 0%, #7fa4cf 25%, #6b8dd6 50%, #5a7bc8 75%, #4a6fa5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Drop
            </motion.span>
            <motion.span 
              key={`source-${animationKey}`}
              className="text-lg font-bold dropsource-logo-enhanced"
              initial={{ y: -80, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.4
              }}
              style={{ 
                background: 'linear-gradient(90deg, #9fc5e8 0%, #7fa4cf 25%, #6b8dd6 50%, #5a7bc8 75%, #4a6fa5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Source
            </motion.span>
          </div>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex items-center gap-2">
          {LINKS.map(l => {
            const isActive = currentPage === l.to;
            
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

        {/* Right side - User info and notifications */}
        <div className="flex items-center gap-4">
          {/* User Balance */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255, 176, 57, 0.1)', border: '1px solid rgba(255, 176, 57, 0.3)' }}>
            <Star className="w-4 h-4" style={{ color: '#FFB039' }} />
            <span className="text-sm font-medium" style={{ color: '#FFB039' }}>2,847</span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => onOpenFeature('notifications')}
            className="p-2 rounded-full transition-all duration-200 relative"
            style={{
              backgroundColor: 'rgba(99, 179, 255, 0.1)',
              border: '1px solid rgba(99, 179, 255, 0.3)',
              color: '#63B3FF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(99, 179, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(99, 179, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Bell className="w-4 h-4" />
            {/* Notification badge */}
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FF6B6B' }}
            >
              <span className="text-xs font-bold text-white">3</span>
            </div>
          </button>

          {/* User Name */}
          <span className="text-sm font-medium" style={{ color: '#E6ECF3' }}>Test User</span>
        </div>
      </div>
    </nav>
  );
}