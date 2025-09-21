import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Star, Users, Trophy, Clock, Target, MessageCircle, User, ShoppingCart } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenFeature: (feature: string) => void;
}

const fakeNews = [
  "🎵 New AI Chord Generator now live!",
  "🏆 Weekly competition: Best love song wins 1000⭐",
  "🎨 Drawing tools update - now with sparkle brush!",
  "🤝 Buddy system pairs have written 847 songs this week",
  "📱 Mobile app coming soon™",
  "🎤 Voice memo feature in beta testing",
  "🔥 Hot trending: Lo-fi hip hop beats are back",
];

const fakeUsers = [
  'xX_BeatMaster_Xx', 'rhyme_time_99', 'melody_queen', 'bass_drop_lord',
  'synth_wizard', 'guitar_hero_420', 'piano_fingers', 'drum_machine',
  'auto_tune_andy', 'vinyl_collector', 'beat_boxer_bob', 'sample_sage',
];

const userCallouts = [
  { user: 'melody_queen', action: 'hit 1 million plays!', stars: 5000 },
  { user: 'bass_drop_lord', action: 'completed 50 collaborations', stars: 2500 },
  { user: 'synth_wizard', action: 'discovered rare chord progression', stars: 1000 },
  { user: 'piano_fingers', action: 'taught 100 new users', stars: 3000 },
];

const staffPicks = [
  { title: 'Midnight Memories', user: 'dream_weaver', genre: 'Lo-Fi', stars: 12450 },
  { title: 'Electric Storm', user: 'thunder_god', genre: 'EDM', stars: 8920 },
  { title: 'Heartbreak Cafe', user: 'coffee_soul', genre: 'Indie', stars: 15670 },
  { title: 'Cosmic Journey', user: 'space_cadet', genre: 'Ambient', stars: 7340 },
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

const dailyUser = {
  username: 'CoolUser',
  avatar: '🎧',
  stars: 13547,
  status: 'Currently checking out the best app ever',
  joinedDays: 127,
  songsCreated: 34,
};

export function HomePage({ onNavigate, onOpenFeature }: HomePageProps) {
  const [newsIndex, setNewsIndex] = useState(0);
  const [isDrawingOnCard, setIsDrawingOnCard] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const nextNews = () => {
    setNewsIndex((prev) => (prev + 1) % fakeNews.length);
  };

  const prevNews = () => {
    setNewsIndex((prev) => (prev - 1 + fakeNews.length) % fakeNews.length);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLastPos({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearGraffiti = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="h-full dropsource-bg dropsource-text-primary overflow-hidden flex flex-col">
      {/* Header with navigation */}
      <div className="dropsource-padding-lg border-b" style={{ borderBottomColor: 'var(--dropsource-border)' }}>
        <div className="flex items-center justify-between dropsource-spacing-md">
          <h1 className="dropsource-text-primary" style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', letterSpacing: '-0.02em' }}>DropSource Home</h1>
          <div className="flex dropsource-spacing-sm">
            <button
              onClick={() => onNavigate('profile')}
              className="dropsource-nav-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
            >
              <User className="w-4 h-4 dropsource-icon-outlined" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => onOpenFeature('contact')}
              className="dropsource-nav-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
            >
              <MessageCircle className="w-4 h-4 dropsource-icon-outlined" />
              <span>Contact</span>
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="dropsource-nav-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
            >
              <Users className="w-4 h-4 dropsource-icon-outlined" />
              <span>Community</span>
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="dropsource-nav-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
            >
              <Trophy className="w-4 h-4 dropsource-icon-outlined" />
              <span>Leaderboards</span>
            </button>
            <button
              onClick={() => onOpenFeature('shop')}
              className="dropsource-nav-pill dropsource-focus-visible flex items-center dropsource-spacing-xs"
            >
              <ShoppingCart className="w-4 h-4 dropsource-icon-outlined" />
              <span>Star Shop</span>
            </button>
          </div>
        </div>

        {/* Project News Strip */}
        <div className="dropsource-surface flex items-center justify-between" style={{
          padding: 'calc(var(--spacing-unit) * 2)',
          marginTop: 'calc(var(--spacing-unit) * 2)'
        }}>
          <button
            onClick={prevNews}
            className="dropsource-btn-ghost dropsource-focus-visible"
            style={{ padding: 'calc(var(--spacing-unit) * 1)' }}
          >
            ←
          </button>
          <div className="text-center flex-1 dropsource-spacing-md">
            <span className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)' }}>{fakeNews[newsIndex]}</span>
          </div>
          <button
            onClick={nextNews}
            className="dropsource-btn-ghost dropsource-focus-visible"
            style={{ padding: 'calc(var(--spacing-unit) * 1)' }}
          >
            →
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 dropsource-padding-lg overflow-auto">
        <div className="dropsource-grid dropsource-grid-3 h-full" style={{ 
          gridTemplateColumns: 'repeat(3, 1fr)',
          alignItems: 'start'
        }}>
          {/* Left Column */}
          <div className="dropsource-spacing-lg flex flex-col">
            {/* Weekly User Signup Dump */}
            <div className="dropsource-card h-fit">
              <div className="dropsource-card-header">
                <h3 className="flex items-center dropsource-spacing-xs" style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  <Users className="w-5 h-5 dropsource-icon-outlined" />
                  <span>Weekly Signups</span>
                </h3>
              </div>
              <div className="dropsource-card-content" style={{ paddingTop: '0' }}>
                <ScrollArea className="dropsource-custom-scrollbar" style={{ height: '160px' }}>
                  <div className="dropsource-spacing-xs flex flex-col">
                    {fakeUsers.map((user, i) => (
                      <div key={i} className="dropsource-text-secondary hover:dropsource-text-primary dropsource-clickable cursor-pointer" style={{ 
                        fontSize: 'var(--text-sm)',
                        padding: 'calc(var(--spacing-unit) * 0.5) 0'
                      }}>
                        {user}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="dropsource-divider" />

            {/* User Callouts */}
            <div className="dropsource-card h-fit">
              <div className="dropsource-card-header">
                <h3 className="flex items-center dropsource-spacing-xs" style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  <Star className="w-5 h-5 dropsource-icon-outlined" />
                  <span>User Callouts</span>
                </h3>
              </div>
              <div className="dropsource-card-content" style={{ paddingTop: '0' }}>
                <div className="dropsource-spacing-lg flex flex-col">
                  {userCallouts.map((callout, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{callout.user}</div>
                        <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{callout.action}</div>
                      </div>
                      <span className="dropsource-reaction-pill">
                        +{callout.stars}⭐
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="dropsource-spacing-lg flex flex-col">
            {/* Staff Picks */}
            <div className="dropsource-card h-fit">
              <div className="dropsource-card-header">
                <h3 className="flex items-center dropsource-spacing-xs" style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  <Trophy className="w-5 h-5 dropsource-icon-outlined" />
                  <span>Staff Picks</span>
                </h3>
              </div>
              <div className="dropsource-card-content" style={{ paddingTop: '0' }}>
                <div className="dropsource-spacing-md flex flex-col">
                  {staffPicks.map((pick, i) => (
                    <div key={i} className="dropsource-surface border border-opacity-50 dropsource-clickable cursor-pointer" style={{ 
                      padding: 'calc(var(--spacing-unit) * 1.5)',
                      borderRadius: '12px',
                      borderColor: 'var(--dropsource-border)',
                      transition: 'all 60ms ease-out'
                    }}>
                      <div className="flex items-center justify-between dropsource-spacing-xs">
                        <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{pick.title}</div>
                        <div className="flex items-center dropsource-spacing-xs" style={{ color: 'var(--accent-mint)' }}>
                          <Star className="w-3 h-3 dropsource-icon-outlined" />
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600' }}>{pick.stars.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                        by {pick.user} • {pick.genre}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dropsource-divider" />

            {/* Daily User Card */}
            <div className="dropsource-card h-fit relative">
              <div className="dropsource-card-header">
                <h3 className="flex items-center dropsource-spacing-xs" style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  <User className="w-5 h-5 dropsource-icon-outlined" />
                  <span>Daily User Spotlight</span>
                </h3>
              </div>
              <div className="dropsource-card-content relative" style={{ paddingTop: '0' }}>
                
                <div className="flex items-center dropsource-spacing-md" style={{ marginBottom: 'calc(var(--spacing-unit) * 2)' }}>
                  <div className="flex items-center justify-center" style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: 'var(--card-gradient)',
                    fontSize: '24px'
                  }}>
                    {dailyUser.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-md)', fontWeight: '600' }}>{dailyUser.username}</div>
                    <div className="flex items-center dropsource-spacing-xs" style={{ fontSize: 'var(--text-sm)' }}>
                      <Star className="w-4 h-4 dropsource-icon-outlined" style={{ color: 'var(--accent-mint)' }} />
                      <span className="dropsource-text-secondary">{dailyUser.stars.toLocaleString()}⭐</span>
                    </div>
                    <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                      {dailyUser.joinedDays} days • {dailyUser.songsCreated} songs
                    </div>
                  </div>
                </div>
                
                <div className="dropsource-text-secondary italic" style={{ 
                  fontSize: 'var(--text-sm)',
                  marginBottom: 'calc(var(--spacing-unit) * 2)'
                }}>
                  "{dailyUser.status}"
                </div>

                <div className="flex dropsource-spacing-xs" style={{ marginBottom: 'calc(var(--spacing-unit) * 2)' }}>
                  <button
                    onClick={() => setIsDrawingOnCard(!isDrawingOnCard)}
                    className={`${isDrawingOnCard ? 'dropsource-btn-primary' : 'dropsource-btn-secondary'} dropsource-focus-visible`}
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {isDrawingOnCard ? 'Stop Drawing' : 'Add Graffiti'} ✏️
                  </button>
                  <button
                    onClick={clearGraffiti}
                    className="dropsource-btn-secondary dropsource-focus-visible"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    Clear 🧹
                  </button>
                </div>

                {/* Graffiti Canvas */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={200}
                  className={`absolute inset-0 w-full h-full pointer-events-${isDrawingOnCard ? 'auto' : 'none'} ${isDrawingOnCard ? 'cursor-crosshair' : ''}`}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ background: 'transparent' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dropsource-spacing-lg flex flex-col">
            {/* Time Spent Leaders */}
            <div className="dropsource-card h-fit">
              <div className="dropsource-card-header">
                <h3 className="flex items-center dropsource-spacing-xs" style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  <Clock className="w-5 h-5 dropsource-icon-outlined" />
                  <span>Time Spent Leaders</span>
                </h3>
              </div>
              <div className="dropsource-card-content" style={{ paddingTop: '0' }}>
                <div className="dropsource-spacing-lg flex flex-col">
                  {timeSpentUsers.map((user, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{user.user}</div>
                        <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>🔥 {user.streak} day streak</div>
                      </div>
                      <div className="text-right">
                        <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--accent-mint)' }}>{user.hours}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dropsource-divider" />

            {/* Completionists */}
            <div className="dropsource-card h-fit">
              <div className="dropsource-card-header">
                <h3 className="flex items-center dropsource-spacing-xs" style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: '600',
                  margin: 0
                }}>
                  <Target className="w-5 h-5 dropsource-icon-outlined" />
                  <span>Top Completionists</span>
                </h3>
              </div>
              <div className="dropsource-card-content" style={{ paddingTop: '0' }}>
                <div className="dropsource-spacing-lg flex flex-col">
                  {completionists.map((user, i) => (
                    <div key={i} className="dropsource-spacing-xs flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{user.user}</div>
                        <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                          {user.completed}/{user.total}
                        </div>
                      </div>
                      <div className="dropsource-progress-bar" style={{ backgroundColor: 'var(--dropsource-panel)' }}>
                        <div
                          className="dropsource-progress-fill"
                          style={{ 
                            width: `${user.percentage}%`,
                            background: 'linear-gradient(90deg, var(--accent-mint), var(--brand-purple))'
                          }}
                        />
                      </div>
                      <div className="text-right dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                        {user.percentage}% 🏆
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}