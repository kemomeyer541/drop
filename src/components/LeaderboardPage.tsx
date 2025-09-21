import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Star, Trophy, Clock, Target, Home, Crown, Medal, Award } from 'lucide-react';
import { PaginatedCreatorAdWidget } from './PaginatedCreatorAdWidget';

interface LeaderboardPageProps {
  onNavigate: (page: string) => void;
}

const starLeaderboard = [
  { rank: 1, username: 'l34d3rb04rdpwnm4st3r', stars: 1250000, change: '+125k', avatar: '👑' },
  { rank: 2, username: 'idontlik3l34d3rb04rdz', stars: 847300, change: '+420k', avatar: '🎸' },
  { rank: 3, username: 'wetbeaver', stars: 623400, change: '+23k', avatar: '⚡' },
  { rank: 4, username: 'makemusicordie', stars: 501200, change: '+15k', avatar: '🎵' },
  { rank: 5, username: 'bassdropharderthanmycock', stars: 387600, change: '+8k', avatar: '💎' },
  { rank: 6, username: 'crybaby', stars: 298400, change: '+12k', avatar: '🎹' },
  { rank: 7, username: 'prisonwallet', stars: 245100, change: '+6k', avatar: '🔊' },
  { rank: 8, username: 'synth_wave_king', stars: 198700, change: '+9k', avatar: '🌊' },
  { rank: 9, username: 'drum_machine_god', stars: 167200, change: '+4k', avatar: '🥁' },
  { rank: 10, username: 'harmony_wizard', stars: 145800, change: '+7k', avatar: '🪄' },
  { rank: 11, username: 'beat_master_2024', stars: 134200, change: '+3k', avatar: '🎶' },
  { rank: 12, username: 'melody_maker_pro', stars: 128600, change: '+5k', avatar: '🎼' },
  { rank: 13, username: 'bass_lord_supreme', stars: 122400, change: '+2k', avatar: '🎸' },
  { rank: 14, username: 'rhythm_rider', stars: 117800, change: '+4k', avatar: '🚴' },
  { rank: 15, username: 'sound_sculptor', stars: 112300, change: '+6k', avatar: '🗿' },
  { rank: 16, username: 'beat_architect', stars: 108700, change: '+3k', avatar: '🏗️' },
  { rank: 17, username: 'music_maven', stars: 104200, change: '+2k', avatar: '🎯' },
  { rank: 18, username: 'frequency_wizard', stars: 99800, change: '+5k', avatar: '🧙' },
  { rank: 19, username: 'audio_alchemist', stars: 95600, change: '+1k', avatar: '⚗️' },
  { rank: 20, username: 'sonic_surgeon', stars: 91400, change: '+4k', avatar: '⚕️' },
  { rank: 69, username: 'diaperlover1979', stars: 42069, change: '+420', avatar: '👶' },
];

const timeLeaderboard = [
  { rank: 1, username: 'studio_hermit_24_7', hours: 2847, streak: 156, avatar: '🏠' },
  { rank: 2, username: 'insomniac_producer', hours: 2134, streak: 98, avatar: '🌙' },
  { rank: 3, username: 'grind_machine_pro', hours: 1876, streak: 123, avatar: '⚙️' },
  { rank: 4, username: 'beat_obsessed_user', hours: 1654, streak: 87, avatar: '🎧' },
  { rank: 5, username: 'rhythm_addict_99', hours: 1432, streak: 76, avatar: '💫' },
  { rank: 6, username: 'music_marathon_man', hours: 1298, streak: 65, avatar: '🏃' },
  { rank: 7, username: 'endless_creativity', hours: 1156, streak: 54, avatar: '∞' },
  { rank: 8, username: 'session_warrior', hours: 1034, streak: 43, avatar: '⚔️' },
  { rank: 9, username: 'beat_lab_scientist', hours: 923, streak: 38, avatar: '🧪' },
  { rank: 10, username: 'sound_architect', hours: 876, streak: 32, avatar: '🏗️' },
];

const achievementLeaderboard = [
  { rank: 1, username: 'achievement_hunter_supreme', completed: 156, total: 160, percentage: 97.5, avatar: '🏆' },
  { rank: 2, username: 'goal_crusher_elite', completed: 143, total: 160, percentage: 89.4, avatar: '💪' },
  { rank: 3, username: 'task_master_pro_max', completed: 138, total: 160, percentage: 86.3, avatar: '✅' },
  { rank: 4, username: 'completion_king_2024', completed: 134, total: 160, percentage: 83.8, avatar: '👑' },
  { rank: 5, username: 'perfectionist_player', completed: 129, total: 160, percentage: 80.6, avatar: '💯' },
  { rank: 6, username: 'challenge_champion', completed: 124, total: 160, percentage: 77.5, avatar: '🏅' },
  { rank: 7, username: 'quest_queen_beats', completed: 118, total: 160, percentage: 73.8, avatar: '👸' },
  { rank: 8, username: 'mission_master_music', completed: 112, total: 160, percentage: 70.0, avatar: '🎯' },
  { rank: 9, username: 'objective_overlord', completed: 107, total: 160, percentage: 66.9, avatar: '👁️' },
  { rank: 10, username: 'progress_pioneer', completed: 103, total: 160, percentage: 64.4, avatar: '🚀' },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2: return <Medal className="w-5 h-5 text-gray-300" />;
    case 3: return <Award className="w-5 h-5 text-amber-600" />;
    default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold dropsource-text-secondary">#{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-yellow-400/50';
    case 2: return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/50';
    case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/50';
    default: return 'bg-gray-800/30 border-gray-700';
  }
};

export function LeaderboardPage({ onNavigate }: LeaderboardPageProps) {
  const LeaderboardList = ({ 
    data, 
    type 
  }: { 
    data: any[], 
    type: 'stars' | 'time' | 'achievements' 
  }) => (
    <ScrollArea className="h-full">
      <div className="dropsource-spacing-sm flex flex-col">
        {data.map((user, i) => {
          const maxValue = type === 'stars' ? data[0].stars : 
                          type === 'time' ? data[0].hours : 
                          data[0].percentage;
          const currentValue = type === 'stars' ? user.stars : 
                              type === 'time' ? user.hours : 
                              user.percentage;
          const progressWidth = Math.max((currentValue / maxValue) * 100, 5);

          return (
            <div key={i} className={`dropsource-collectible-card ${user.rank <= 3 ? 'dropsource-card-glow' : ''}`}>
              <div className="flex items-center dropsource-spacing-md">
                {/* Rank */}
                <div className="flex items-center dropsource-spacing-xs" style={{ minWidth: '40px' }}>
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <div className="flex items-center justify-center" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sharp)',
                  background: user.rank <= 3 ? 'linear-gradient(135deg, var(--dropsource-brand), var(--dropsource-brand-hover))' : 'var(--dropsource-surface)',
                  fontSize: 'var(--text-lg)'
                }}>
                  {user.avatar}
                </div>

                {/* User Info with Progress Bar */}
                <div className="flex-1 dropsource-spacing-xs flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="dropsource-text-primary" style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                      {user.username}
                    </span>
                    <span className="dropsource-text-primary" style={{ fontSize: 'var(--text-lg)', fontWeight: '600' }}>
                      {type === 'stars' && <span style={{ color: 'var(--dropsource-brand)' }}>{(user.stars / 1000).toFixed(0)}k⭐</span>}
                      {type === 'time' && <span style={{ color: 'var(--dropsource-brand)' }}>{user.hours}h</span>}
                      {type === 'achievements' && <span style={{ color: 'var(--dropsource-success)' }}>{user.percentage}%</span>}
                    </span>
                  </div>

                  {/* Modern Progress Bar */}
                  <div className="dropsource-progress-bar">
                    <div 
                      className="dropsource-progress-fill" 
                      style={{ 
                        width: `${progressWidth}%`,
                        background: type === 'achievements' ? 
                          'linear-gradient(90deg, var(--dropsource-brand), var(--dropsource-success))' :
                          'linear-gradient(90deg, var(--dropsource-brand), var(--dropsource-brand-hover))'
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center dropsource-spacing-xs">
                    {type === 'stars' && (
                      <>
                        <Star className="w-3 h-3 dropsource-icon-outlined" style={{ color: 'var(--dropsource-brand)' }} />
                        <span className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                          {user.stars.toLocaleString()}⭐ ({user.change} this week)
                        </span>
                      </>
                    )}
                    {type === 'time' && (
                      <>
                        <Clock className="w-3 h-3 dropsource-icon-outlined" style={{ color: 'var(--dropsource-brand)' }} />
                        <span className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                          {user.hours}h total • {user.streak} day streak
                        </span>
                      </>
                    )}
                    {type === 'achievements' && (
                      <>
                        <Target className="w-3 h-3 dropsource-icon-outlined" style={{ color: 'var(--dropsource-success)' }} />
                        <span className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                          {user.completed}/{user.total} completed ({user.percentage}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  return (
    <div className="h-full dropsource-bg dropsource-text-primary overflow-hidden">
      {/* Header */}
      <div className="dropsource-padding-lg border-b" style={{ borderBottomColor: 'var(--dropsource-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center dropsource-spacing-md">
            <Trophy className="w-8 h-8 dropsource-icon-outlined" style={{ color: 'var(--dropsource-brand)' }} />
            <h1 className="dropsource-text-primary" style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', letterSpacing: '-0.02em' }}>Leaderboards</h1>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="dropsource-btn-secondary dropsource-focus-visible flex items-center dropsource-spacing-xs"
          >
            <Home className="w-4 h-4 dropsource-icon-outlined" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Creator Ad Section - Above Leaderboards */}
      <div className="dropsource-padding-lg pb-0">
        <div className="max-w-md mx-auto mb-6">
          <PaginatedCreatorAdWidget />
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div className="flex-1 dropsource-padding-lg overflow-hidden">
        <Tabs defaultValue="stars" className="h-full flex flex-col">
          <TabsList className="dropsource-toolbar flex w-full" style={{ marginBottom: 'calc(var(--spacing-unit) * 3)' }}>
            <TabsTrigger value="stars" className="dropsource-btn-ghost flex items-center dropsource-spacing-xs flex-1">
              <Star className="w-4 h-4 dropsource-icon-outlined" />
              <span>Top Stars</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="dropsource-btn-ghost flex items-center dropsource-spacing-xs flex-1">
              <Clock className="w-4 h-4 dropsource-icon-outlined" />
              <span>Time Spent</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="dropsource-btn-ghost flex items-center dropsource-spacing-xs flex-1">
              <Target className="w-4 h-4 dropsource-icon-outlined" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="stars" className="h-full">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between" style={{ marginBottom: 'calc(var(--spacing-unit) * 2)' }}>
                  <h3 className="dropsource-text-primary" style={{ fontSize: 'var(--text-lg)', fontWeight: '500' }}>Star Collectors</h3>
                  <span className="dropsource-surface px-2 py-1" style={{ 
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-sharp)',
                    color: 'var(--dropsource-brand)'
                  }}>
                    Updated every hour
                  </span>
                </div>
                <LeaderboardList data={starLeaderboard} type="stars" />
              </div>
            </TabsContent>

            <TabsContent value="time" className="h-full">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between" style={{ marginBottom: 'calc(var(--spacing-unit) * 2)' }}>
                  <h3 className="dropsource-text-primary" style={{ fontSize: 'var(--text-lg)', fontWeight: '500' }}>Time Champions</h3>
                  <span className="dropsource-surface px-2 py-1" style={{ 
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-sharp)',
                    color: 'var(--dropsource-brand)'
                  }}>
                    All-time stats
                  </span>
                </div>
                <LeaderboardList data={timeLeaderboard} type="time" />
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="h-full">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between" style={{ marginBottom: 'calc(var(--spacing-unit) * 2)' }}>
                  <h3 className="dropsource-text-primary" style={{ fontSize: 'var(--text-lg)', fontWeight: '500' }}>Completionists</h3>
                  <span className="dropsource-surface px-2 py-1" style={{ 
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-sharp)',
                    color: 'var(--dropsource-success)'
                  }}>
                    Challenge masters
                  </span>
                </div>
                <LeaderboardList data={achievementLeaderboard} type="achievements" />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="dropsource-divider" />

      {/* Footer Stats */}
      <div className="dropsource-surface dropsource-padding-md">
        <div className="dropsource-grid-3 text-center">
          <div>
            <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>847</div>
            <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Active Users</div>
          </div>
          <div>
            <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--dropsource-brand)' }}>12.4M</div>
            <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Total Stars Earned</div>
          </div>
          <div>
            <div className="dropsource-text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>3,421</div>
            <div className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Songs Created</div>
          </div>
        </div>
      </div>
    </div>
  );
}