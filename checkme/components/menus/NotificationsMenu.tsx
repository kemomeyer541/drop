import React, { useState } from 'react';
import { FloatingCard } from '../FloatingCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Star, Users, MessageCircle, Trophy, Gift, Settings, X } from 'lucide-react';

interface NotificationsMenuProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  width: number;
  height: number;
  zIndex: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onFocus: () => void;
}

interface Notification {
  id: string;
  type: 'star' | 'social' | 'message' | 'achievement' | 'gift';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'star',
    title: 'Stars Earned!',
    message: 'You earned 25 stars from "Summer Vibes" drop',
    timestamp: '2 hours ago',
    read: false,
    actionable: false
  },
  {
    id: '2',
    type: 'social',
    title: 'New Follower',
    message: 'beat_master_99 started following you',
    timestamp: '4 hours ago',
    read: false,
    actionable: true
  },
  {
    id: '3',
    type: 'message',
    title: 'Collaboration Request',
    message: 'melody_queen wants to collaborate on a track',
    timestamp: '1 day ago',
    read: true,
    actionable: true
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You unlocked "First Collab" - 50 bonus stars!',
    timestamp: '1 day ago',
    read: true,
    actionable: false
  },
  {
    id: '5',
    type: 'gift',
    title: 'Gift Received',
    message: 'synth_lord sent you a Premium badge gift',
    timestamp: '2 days ago',
    read: true,
    actionable: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'star': return <Star className="w-4 h-4 text-yellow-400" />;
    case 'social': return <Users className="w-4 h-4 text-blue-400" />;
    case 'message': return <MessageCircle className="w-4 h-4 text-green-400" />;
    case 'achievement': return <Trophy className="w-4 h-4 text-purple-400" />;
    case 'gift': return <Gift className="w-4 h-4 text-pink-400" />;
    default: return <Bell className="w-4 h-4 dropsource-text-secondary" />;
  }
};

export function NotificationsMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: NotificationsMenuProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || !notif.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <FloatingCard
      title="Notifications"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      width={width}
      height={height}
      zIndex={zIndex}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onFocus={onFocus}
    >
      <div className="absolute inset-0 flex flex-col" data-no-drag>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 flex-shrink-0 border-b dropsource-divider">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 dropsource-text-primary" />
            <span className="font-medium dropsource-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="dropsource-toolbar-button"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="dropsource-toolbar-button hover:bg-red-500/20 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs - Fixed */}
        <div className="flex gap-2 p-4 flex-shrink-0 border-b dropsource-divider">
          <Button
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'dropsource-btn-primary' : 'dropsource-btn-secondary'}
          >
            All
          </Button>
          <Button
            size="sm"
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'dropsource-btn-primary' : 'dropsource-btn-secondary'}
          >
            Unread ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button
              size="sm"
              onClick={markAllAsRead}
              className="dropsource-btn-ghost ml-auto"
            >
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List - Fills remaining space */}
        <div className="flex-1 min-h-0 overflow-y-auto dropsource-custom-scrollbar">
          <div className="p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 mx-auto mb-2 dropsource-text-tertiary opacity-50" />
                <p className="dropsource-text-tertiary">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`dropsource-surface p-3 rounded cursor-pointer transition-all ${
                    !notification.read ? 'border-l-2 border-teal-400' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`font-medium text-sm ${
                          !notification.read ? 'dropsource-text-primary' : 'dropsource-text-secondary'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs dropsource-text-tertiary ml-2 flex-shrink-0">
                          {notification.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-sm dropsource-text-secondary mb-2">
                        {notification.message}
                      </p>
                      
                      {notification.actionable && (
                        <Button
                          size="sm"
                          className="dropsource-btn-pill text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Action clicked for', notification.id);
                          }}
                        >
                          {notification.type === 'social' ? 'View Profile' :
                           notification.type === 'message' ? 'Reply' :
                           notification.type === 'gift' ? 'Accept Gift' : 'Action'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t dropsource-divider p-4 flex-shrink-0">
          <p className="text-xs dropsource-text-tertiary text-center">
            Stay connected with the Drop Source community! 🔔
          </p>
        </div>
      </div>
    </FloatingCard>
  );
}