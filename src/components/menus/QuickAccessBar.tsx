import React from 'react';
import { ShoppingBag, MessageSquare, FileText, Zap, BookOpen, User, Users } from 'lucide-react';

interface QuickAccessBarProps {
  onDropSourceBook: () => void;
  onShop: () => void;
  onScrapbook: () => void;
  onAuctionHouse: () => void;
  onDMs: () => void;
  onFriends: () => void;
  onProfile: () => void;
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({
  onDropSourceBook,
  onShop,
  onScrapbook,
  onAuctionHouse,
  onDMs,
  onFriends,
  onProfile
}) => {
  return (
    <div 
      className="border-b"
      style={{ 
        backgroundColor: '#0F1520', 
        borderColor: '#1A2531',
        padding: '12px 0'
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-end gap-4">
          <span style={{ color: '#A9B7C6', fontSize: '12px', fontWeight: '500' }}>Quick Access:</span>
          
          <button 
            onClick={onAuctionHouse}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Auction House
          </button>
          
          <button 
            onClick={onDMs}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MessageSquare className="w-4 h-4" />
            DMs
          </button>
          
          <button 
            onClick={onShop}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Zap className="w-4 h-4" />
            Shop
          </button>
          
          <button 
            onClick={onScrapbook}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FileText className="w-4 h-4" />
            Scrapbook
          </button>
          
          <button 
            onClick={onDropSourceBook}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <BookOpen className="w-4 h-4" />
            Drop Source Book
          </button>
          
          <button 
            onClick={onProfile}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          
          <button 
            onClick={onFriends}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-all duration-150"
            style={{ color: '#A9B7C6' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#63B3FF';
              e.currentTarget.style.backgroundColor = 'rgba(99,179,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B7C6';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Users className="w-4 h-4" />
            Friends
          </button>
        </div>
      </div>
    </div>
  );
};