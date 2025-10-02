import React, { useState, useEffect } from 'react';
import { AchievementBadge } from './AchievementBadge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  reward: string;
  condition: () => boolean;
  claimed: boolean;
}

export function GamificationManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'konami_code',
      title: 'Secret Code Master',
      description: 'You discovered the Konami code!',
      emoji: '🎮',
      reward: '+100⭐',
      condition: () => {
        // Check if Konami code was entered
        return localStorage.getItem('konami_code_unlocked') === 'true';
      },
      claimed: false
    },
    {
      id: 'rapid_clicker',
      title: 'Click Master',
      description: 'You clicked rapidly 5 times!',
      emoji: '⚡',
      reward: '+75⭐',
      condition: () => {
        return localStorage.getItem('rapid_click_unlocked') === 'true';
      },
      claimed: false
    },
    {
      id: 'hover_master',
      title: 'Hover Master',
      description: 'You hovered 10 times!',
      emoji: '🎯',
      reward: '+60⭐',
      condition: () => {
        return localStorage.getItem('hover_master_unlocked') === 'true';
      },
      claimed: false
    },
    {
      id: 'time_secret',
      title: 'Time Keeper',
      description: 'You visited at the magic hour!',
      emoji: '🕐',
      reward: '+80⭐',
      condition: () => {
        return localStorage.getItem('time_secret_unlocked') === 'true';
      },
      claimed: false
    }
  ]);

  const [currentAchievements, setCurrentAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Check for achievements on component mount
    checkAchievements();
    
    // Check every 1 second for new achievements (more frequent for testing)
    const interval = setInterval(checkAchievements, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAchievements = () => {
    // console.log('Checking achievements...');
    // console.log('localStorage konami_code_unlocked:', localStorage.getItem('konami_code_unlocked'));
    // console.log('localStorage rapid_click_unlocked:', localStorage.getItem('rapid_click_unlocked'));
    
    const unclaimedAchievements = achievements.filter(achievement => 
      !achievement.claimed && achievement.condition()
    );

    // console.log('Unclaimed achievements:', unclaimedAchievements);

    // Add new achievements to the current list, but only if they haven't been shown before
    const newAchievements = unclaimedAchievements.filter(achievement => 
      !currentAchievements.some(current => current.id === achievement.id) &&
      !localStorage.getItem(`${achievement.id}_shown`)
    );

    if (newAchievements.length > 0) {
      console.log('New achievements found:', newAchievements);
      // Mark as shown immediately to prevent duplicates
      newAchievements.forEach(achievement => {
        localStorage.setItem(`${achievement.id}_shown`, 'true');
      });
      
      setCurrentAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const handleClaimAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, claimed: true }
          : achievement
      )
    );
    
    // Remove from current achievements
    setCurrentAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
    
    // Store in localStorage
    localStorage.setItem(`${achievementId}_claimed`, 'true');
  };

  const handleCloseAchievement = (achievementId: string) => {
    setCurrentAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
  };

  if (currentAchievements.length === 0) return null;

  return (
    <>
      {currentAchievements.map((achievement, index) => (
        <AchievementBadge
          key={achievement.id}
          title={achievement.title}
          description={achievement.description}
          emoji={achievement.emoji}
          reward={achievement.reward}
          stackIndex={index}
          position="top-left"
          onClaim={() => handleClaimAchievement(achievement.id)}
          onClose={() => handleCloseAchievement(achievement.id)}
        />
      ))}
    </>
  );
}
