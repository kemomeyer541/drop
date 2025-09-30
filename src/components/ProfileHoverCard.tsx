import React from 'react';
import { Star, Users, Shield, TrendingUp } from 'lucide-react';

interface ProfileHoverCardProps {
  user: string;
  handle?: string;
  avatar: string;
  color: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function ProfileHoverCard({ user, handle, avatar, color, position, onClose }: ProfileHoverCardProps) {
  // Mock profile data
  const mockProfileData = {
    trustPercent: Math.floor(Math.random() * 30) + 70, // 70-100%
    followers: Math.floor(Math.random() * 5000) + 100,
    following: Math.floor(Math.random() * 1000) + 50,
    posts: Math.floor(Math.random() * 200) + 20,
    stars: Math.floor(Math.random() * 10000) + 500,
    level: Math.floor(Math.random() * 20) + 1,
    badges: ['🎨 Creator', '⭐ Supporter', '🔥 Top Contributor'].slice(0, Math.floor(Math.random() * 3) + 1)
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50"
        onClick={onClose}
        style={{ background: 'transparent' }}
      />
      
      {/* Hover Card */}
      <div
        className="fixed z-[60] rounded-lg border shadow-lg p-4 min-w-[280px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          backgroundColor: '#0F1520',
          borderColor: '#1A2531',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          transform: 'translateX(-50%)', // Center horizontally on cursor
          animation: 'fadeInSmooth 200ms ease-out'
        }}
      >
        {/* Profile Header */}
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: color }}
          >
            {avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold" style={{ color: '#E6ECF3' }}>
                {user}
              </h3>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" style={{ color: '#4CAF50' }} />
                <span style={{ color: '#4CAF50', fontSize: '12px' }}>
                  {mockProfileData.trustPercent}%
                </span>
              </div>
            </div>
            {handle && (
              <div style={{ color: '#A9B7C6', fontSize: '13px' }}>
                {handle}
              </div>
            )}
            <div style={{ color: '#FFB039', fontSize: '12px', fontWeight: '500' }}>
              Level {mockProfileData.level} • {mockProfileData.stars.toLocaleString()} ⭐
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div style={{ color: '#E6ECF3', fontSize: '16px', fontWeight: '600' }}>
              {mockProfileData.followers.toLocaleString()}
            </div>
            <div style={{ color: '#A9B7C6', fontSize: '11px' }}>Followers</div>
          </div>
          <div className="text-center">
            <div style={{ color: '#E6ECF3', fontSize: '16px', fontWeight: '600' }}>
              {mockProfileData.following.toLocaleString()}
            </div>
            <div style={{ color: '#A9B7C6', fontSize: '11px' }}>Following</div>
          </div>
          <div className="text-center">
            <div style={{ color: '#E6ECF3', fontSize: '16px', fontWeight: '600' }}>
              {mockProfileData.posts}
            </div>
            <div style={{ color: '#A9B7C6', fontSize: '11px' }}>Posts</div>
          </div>
        </div>

        {/* Badges */}
        {mockProfileData.badges.length > 0 && (
          <div className="mb-3">
            <div style={{ color: '#A9B7C6', fontSize: '11px', marginBottom: '6px' }}>
              Badges
            </div>
            <div className="flex flex-wrap gap-1">
              {mockProfileData.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: 'rgba(255, 176, 57, 0.12)',
                    color: '#FFB039',
                    border: '1px solid rgba(255, 176, 57, 0.3)',
                    fontSize: '10px'
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: '#00AEEF',
              color: '#fff',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0099CC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00AEEF';
            }}
          >
            Follow
          </button>
          <button
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: '#A9B7C6',
              border: '1px solid #1A2531'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#161B2E';
              e.currentTarget.style.color = '#E6ECF3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#A9B7C6';
            }}
          >
            Message
          </button>
        </div>
      </div>
    </>
  );
}