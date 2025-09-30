import React, { useState } from 'react';
import { FloatingCard } from '../FloatingCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Newspaper, TrendingUp, Calendar, ExternalLink, Star } from 'lucide-react';

interface NewsMenuProps {
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

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'update' | 'feature' | 'community' | 'event';
  date: string;
  readTime: string;
  featured: boolean;
  url?: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Drop Source 2.0: Major Platform Update',
    summary: 'New collaboration tools, enhanced audio quality, and premium features now live!',
    category: 'update',
    date: '2024-01-20',
    readTime: '3 min read',
    featured: true
  },
  {
    id: '2',
    title: 'Community Spotlight: Rising Stars',
    summary: 'Meet this month\'s top creators and their breakthrough tracks that are taking the platform by storm.',
    category: 'community',
    date: '2024-01-18',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '3',
    title: 'New Feature: AI-Powered Mixing Assistant',
    summary: 'Get professional-quality mixes with our new AI assistant. Beta access available for Premium users.',
    category: 'feature',
    date: '2024-01-15',
    readTime: '4 min read',
    featured: true
  },
  {
    id: '4',
    title: 'Drop Source Music Festival Announcement',
    summary: 'Join us for the first-ever Drop Source virtual music festival featuring community artists.',
    category: 'event',
    date: '2024-01-12',
    readTime: '6 min read',
    featured: false
  },
  {
    id: '5',
    title: 'Weekly Beat Challenge Winner',
    summary: 'Congratulations to @synth_master for winning this week\'s Lo-Fi challenge with "Midnight Dreams".',
    category: 'community',
    date: '2024-01-10',
    readTime: '2 min read',
    featured: false
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'update': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
    case 'feature': return <TrendingUp className="w-4 h-4 text-blue-400" />;
    case 'community': return <Newspaper className="w-4 h-4 text-green-400" />;
    case 'event': return <Calendar className="w-4 h-4 text-purple-400" />;
    default: return <Newspaper className="w-4 h-4 dropsource-text-secondary" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'update': return 'text-yellow-400 border-yellow-400';
    case 'feature': return 'text-blue-400 border-blue-400';
    case 'community': return 'text-green-400 border-green-400';
    case 'event': return 'text-purple-400 border-purple-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

export function NewsMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: NewsMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredNews = selectedCategory 
    ? mockNews.filter(item => item.category === selectedCategory)
    : mockNews;

  const categories = ['update', 'feature', 'community', 'event'];

  return (
    <FloatingCard
      title="Drop Source News"
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
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="w-5 h-5 dropsource-text-primary" />
          <h3 className="font-semibold dropsource-text-primary">Latest News</h3>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={!selectedCategory ? 'dropsource-btn-primary' : 'dropsource-btn-secondary'}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'dropsource-btn-primary' : 'dropsource-btn-secondary'}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* News Feed */}
        <div className="space-y-4 overflow-y-auto dropsource-custom-scrollbar" style={{ height: 'calc(100% - 120px)' }}>
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className={`dropsource-surface p-4 rounded cursor-pointer transition-all hover:border-teal-400 ${
                item.featured ? 'border-l-4 border-yellow-400' : ''
              }`}
              onClick={() => console.log('Open article', item.id)}
            >
              {/* Article Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(item.category)}
                  <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                  {item.featured && (
                    <Badge className="text-xs bg-yellow-400 text-black">
                      Featured
                    </Badge>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 dropsource-text-tertiary opacity-50" />
              </div>

              {/* Article Content */}
              <h4 className="font-semibold dropsource-text-primary mb-2 line-clamp-2">
                {item.title}
              </h4>
              
              <p className="text-sm dropsource-text-secondary mb-3 line-clamp-2">
                {item.summary}
              </p>

              {/* Article Meta */}
              <div className="flex items-center justify-between text-xs dropsource-text-tertiary">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span>{item.readTime}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <Button
              className="dropsource-btn-secondary text-sm"
              onClick={() => console.log('View all news')}
            >
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </FloatingCard>
  );
}