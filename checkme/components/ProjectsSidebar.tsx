import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  FolderOpen,
  FolderPlus, 
  FileText, 
  Clock, 
  Music, 
  Star,
  Copy,
  Trash2,
  Search,
  X,
  ChevronRight
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  lastModified: Date;
  bpm: number;
  key: string;
  hasUnreadChanges?: boolean;
  genre?: string;
  duration?: string;
}

interface ProjectsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

// Mock project data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    lastModified: new Date('2024-01-15'),
    bpm: 110,
    key: 'G',
    hasUnreadChanges: true,
    genre: 'Pop',
    duration: '3:24'
  },
  {
    id: '2', 
    title: 'Midnight Dreams',
    lastModified: new Date('2024-01-14'),
    bpm: 85,
    key: 'Am',
    genre: 'R&B',
    duration: '2:58'
  },
  {
    id: '3',
    title: 'Electric Soul',
    lastModified: new Date('2024-01-13'),
    bpm: 128,
    key: 'Em',
    hasUnreadChanges: true,
    genre: 'Electronic',
    duration: '4:12'
  },
  {
    id: '4',
    title: 'Coffee Shop Acoustic',
    lastModified: new Date('2024-01-12'),
    bpm: 95,
    key: 'D',
    genre: 'Folk',
    duration: '2:45'
  },
  {
    id: '5',
    title: 'City Lights',
    lastModified: new Date('2024-01-11'),
    bpm: 120,
    key: 'F#m',
    genre: 'Hip-Hop',
    duration: '3:38'
  }
];

export function ProjectsSidebar({ isOpen, onClose, onSelectProject }: ProjectsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'starred'>('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (selectedFilter) {
      case 'recent':
        return matchesSearch && project.lastModified > new Date('2024-01-14');
      case 'starred':
        return matchesSearch && project.hasUnreadChanges; // Using unread changes as "starred" for demo
      default:
        return matchesSearch;
    }
  });

  const formatLastModified = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 z-50"
            style={{
              background: 'var(--dropsource-panel)',
              borderRight: '1px solid var(--dropsource-border)',
              backdropFilter: 'blur(12px)'
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: 'var(--dropsource-border)' }}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" style={{ color: 'var(--dropsource-brand)' }} />
                <span 
                  className="font-semibold"
                  style={{ 
                    fontSize: 'var(--text-lg)', 
                    color: 'var(--dropsource-primary)' 
                  }}
                >
                  Projects
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--dropsource-secondary)' }} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 h-full overflow-auto dropsource-custom-scrollbar">
              {/* Search and Filter */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 dropsource-input"
                    style={{ fontSize: 'var(--text-sm)' }}
                  />
                </div>
                
                <div className="flex gap-2">
                  {(['all', 'recent', 'starred'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedFilter === filter 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter === 'recent' ? 'Recent' : 'Starred'}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Project Button */}
              <Button 
                className="w-full mb-4 dropsource-btn-primary flex items-center gap-2"
                style={{ height: '40px' }}
              >
                <FolderPlus className="w-4 h-4" />
                New Project
              </Button>

              {/* Projects List */}
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dropsource-card p-3 hover:scale-[1.02] transition-all cursor-pointer group"
                    onClick={() => {
                      onSelectProject?.(project.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-medium text-sm"
                            style={{ color: 'var(--dropsource-primary)' }}
                          >
                            {project.title}
                          </h3>
                          {project.hasUnreadChanges && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                        <div 
                          className="flex items-center gap-3 text-xs"
                          style={{ color: 'var(--dropsource-tertiary)' }}
                        >
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatLastModified(project.lastModified)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            {project.bpm} BPM • {project.key}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action buttons - show on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          className="p-1 rounded hover:bg-gray-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle copy
                          }}
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                        <button 
                          className="p-1 rounded hover:bg-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {project.genre && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5"
                            style={{ backgroundColor: 'rgba(99, 179, 255, 0.1)', color: '#63B3FF' }}
                          >
                            {project.genre}
                          </Badge>
                        )}
                        {project.duration && (
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--dropsource-tertiary)' }}
                          >
                            {project.duration}
                          </span>
                        )}
                      </div>
                      
                      {project.hasUnreadChanges && (
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-8" style={{ color: 'var(--dropsource-tertiary)' }}>
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No projects found</p>
                  <p className="text-xs opacity-75">Try adjusting your search or filter</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}