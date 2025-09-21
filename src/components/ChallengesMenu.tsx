import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  X, CheckCircle, Circle, Star, Clock, Calendar, 
  Trophy, Target, Users, Music, Palette, MessageCircle 
} from 'lucide-react';

interface ChallengesMenuProps {
  onClose: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft?: string;
}

const dailyChallenges: Challenge[] = [
  {
    id: 'd1',
    title: 'Write 10 lines today',
    description: 'Add 10 lines of lyrics to any project',
    reward: 50,
    progress: 7,
    maxProgress: 10,
    completed: false,
    icon: <Music className="w-5 h-5" />,
    difficulty: 'easy',
    timeLeft: '18h 42m'
  },
  {
    id: 'd2',
    title: 'Visit an old project',
    description: 'Open and edit a project older than 7 days',
    reward: 25,
    progress: 1,
    maxProgress: 1,
    completed: true,
    icon: <Clock className="w-5 h-5" />,
    difficulty: 'easy'
  },
  {
    id: 'd3',
    title: 'Vote on 3 posts',
    description: 'Vote on community posts in the hub',
    reward: 30,
    progress: 1,
    maxProgress: 3,
    completed: false,
    icon: <MessageCircle className="w-5 h-5" />,
    difficulty: 'easy',
    timeLeft: '18h 42m'
  },
  {
    id: 'd4',
    title: 'Collaborate with a buddy',
    description: 'Work on a project with another user',
    reward: 100,
    progress: 0,
    maxProgress: 1,
    completed: false,
    icon: <Users className="w-5 h-5" />,
    difficulty: 'medium',
    timeLeft: '18h 42m'
  }
];

const weeklyChallenges: Challenge[] = [
  {
    id: 'w1',
    title: 'Complete 5 daily challenges',
    description: 'Finish your daily challenges 5 times this week',
    reward: 500,
    progress: 3,
    maxProgress: 5,
    completed: false,
    icon: <Target className="w-5 h-5" />,
    difficulty: 'medium',
    timeLeft: '4d 18h'
  },
  {
    id: 'w2',
    title: 'Create 3 songs',
    description: 'Publish 3 complete songs this week',
    reward: 750,
    progress: 1,
    maxProgress: 3,
    completed: false,
    icon: <Music className="w-5 h-5" />,
    difficulty: 'hard',
    timeLeft: '4d 18h'
  },
  {
    id: 'w3',
    title: 'Use drawing tools',
    description: 'Add drawings to 2 different projects',
    reward: 200,
    progress: 2,
    maxProgress: 2,
    completed: true,
    icon: <Palette className="w-5 h-5" />,
    difficulty: 'easy'
  }
];

const monthlyChallenges: Challenge[] = [
  {
    id: 'm1',
    title: 'Master of the Month',
    description: 'Earn 5,000 stars this month',
    reward: 2500,
    progress: 3420,
    maxProgress: 5000,
    completed: false,
    icon: <Star className="w-5 h-5" />,
    difficulty: 'hard',
    timeLeft: '12d 18h'
  },
  {
    id: 'm2',
    title: 'Community Champion',
    description: 'Get 50 upvotes on your posts this month',
    reward: 1000,
    progress: 23,
    maxProgress: 50,
    completed: false,
    icon: <Trophy className="w-5 h-5" />,
    difficulty: 'medium',
    timeLeft: '12d 18h'
  },
  {
    id: 'm3',
    title: 'Streak Master',
    description: 'Maintain a 30-day login streak',
    reward: 1500,
    progress: 18,
    maxProgress: 30,
    completed: false,
    icon: <Calendar className="w-5 h-5" />,
    difficulty: 'medium',
    timeLeft: '12d 18h'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'text-green-400 border-green-400';
    case 'medium': return 'text-yellow-400 border-yellow-400';
    case 'hard': return 'text-red-400 border-red-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

export function ChallengesMenu({ onClose }: ChallengesMenuProps) {
  const [activeTab, setActiveTab] = useState('daily');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(
    [...dailyChallenges, ...weeklyChallenges, ...monthlyChallenges]
      .filter(c => c.completed)
      .map(c => c.id)
  );

  const markComplete = (challengeId: string) => {
    setCompletedChallenges(prev => [...prev, challengeId]);
  };

  const calculateTotalRewards = (challenges: Challenge[]) => {
    return challenges
      .filter(c => completedChallenges.includes(c.id) || c.completed)
      .reduce((total, c) => total + c.reward, 0);
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const isCompleted = completedChallenges.includes(challenge.id) || challenge.completed;
    const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;

    return (
      <Card className={`dropsource-panel border-gray-700 p-4 transition-all ${
        isCompleted ? 'opacity-60 bg-green-900/10' : 'hover:dropsource-glow-cyan'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            isCompleted ? 'bg-green-900/30' : 'bg-gray-800/50'
          }`}>
            {challenge.icon}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium dropsource-text-primary">{challenge.title}</h3>
                <p className="text-sm dropsource-text-secondary">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 dropsource-text-secondary" />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="dropsource-text-secondary">
                  {challenge.progress}/{challenge.maxProgress}
                </span>
                <span className="dropsource-text-secondary">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3" />
                  <span className="text-xs">{challenge.reward}⭐</span>
                </div>
              </div>
              
              {challenge.timeLeft && !isCompleted && (
                <div className="text-xs dropsource-text-secondary">
                  {challenge.timeLeft} left
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="dropsource-floating-card rounded-lg w-[700px] h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold dropsource-text-primary">Challenges & Goals</h2>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="dropsource-text-secondary hover:text-red-400"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 px-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Monthly
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="daily" className="h-full">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-medium dropsource-text-primary">Daily Challenges</h3>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{calculateTotalRewards(dailyChallenges)}⭐ earned</span>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {dailyChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="h-full">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-medium dropsource-text-primary">Weekly Challenges</h3>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{calculateTotalRewards(weeklyChallenges)}⭐ earned</span>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {weeklyChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="h-full">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-medium dropsource-text-primary">Monthly Challenges</h3>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{calculateTotalRewards(monthlyChallenges)}⭐ earned</span>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {monthlyChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Summary */}
      <div className="border-t border-gray-700 p-4 bg-gray-800/20">
        <div className="flex items-center justify-between">
          <div className="text-sm dropsource-text-secondary">
            Track your progress and earn stars by completing challenges!
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm dropsource-text-secondary">
              Total Stars Earned:
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-medium">
              <Star className="w-4 h-4" />
              <span>
                {calculateTotalRewards([...dailyChallenges, ...weeklyChallenges, ...monthlyChallenges])}⭐
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}