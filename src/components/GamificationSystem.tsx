import React, { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalXP: number;
  streak: number;
  achievements: Achievement[];
}

export function GamificationSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 5,
    xp: 1250,
    xpToNext: 500,
    totalXP: 5000,
    streak: 7,
    achievements: [
      {
        id: 'first_purchase',
        name: 'First Purchase',
        description: 'Make your first shop purchase',
        icon: '🛒',
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        rarity: 'common'
      },
      {
        id: 'collector',
        name: 'Collector',
        description: 'Collect 10 different items',
        icon: '📦',
        progress: 7,
        maxProgress: 10,
        unlocked: false,
        rarity: 'rare'
      },
      {
        id: 'artist',
        name: 'Digital Artist',
        description: 'Create 5 drawings',
        icon: '🎨',
        progress: 3,
        maxProgress: 5,
        unlocked: false,
        rarity: 'epic'
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Get 50 likes on posts',
        icon: '🦋',
        progress: 23,
        maxProgress: 50,
        unlocked: false,
        rarity: 'rare'
      },
      {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a 30-day streak',
        icon: '🔥',
        progress: 7,
        maxProgress: 30,
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'big_spender',
        name: 'Big Spender',
        description: 'Spend 1000 stars',
        icon: '💎',
        progress: 450,
        maxProgress: 1000,
        unlocked: false,
        rarity: 'epic'
      }
    ]
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20';
      case 'rare': return 'bg-blue-500/20';
      case 'epic': return 'bg-purple-500/20';
      case 'legendary': return 'bg-yellow-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
      <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        Gamification
      </h3>
      
      {/* Level & XP */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Level {userStats.level}</span>
          <span className="text-sm text-yellow-400">{userStats.xp}/{userStats.xpToNext} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {userStats.xpToNext - userStats.xp} XP to next level
        </div>
      </div>

      {/* Streak */}
      <div className="mb-4 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <div className="text-sm font-bold text-orange-300">{userStats.streak} Day Streak</div>
            <div className="text-xs text-gray-400">Keep it going!</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-300 mb-2">Achievements</h4>
        {userStats.achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`p-2 rounded-lg border transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-green-500/20 border-green-500/50' 
                : getRarityBg(achievement.rarity)
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{achievement.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${achievement.unlocked ? 'text-green-300' : getRarityColor(achievement.rarity)}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-400">{achievement.description}</div>
                {!achievement.unlocked && (
                  <div className="text-xs text-gray-500 mt-1">
                    {achievement.progress}/{achievement.maxProgress}
                  </div>
                )}
              </div>
              {achievement.unlocked && (
                <span className="text-green-400 text-lg">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-bold text-gray-300">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg p-2 text-xs text-blue-300 transition-all duration-300 hover:scale-105">
            View Leaderboard
          </button>
          <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg p-2 text-xs text-purple-300 transition-all duration-300 hover:scale-105">
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}