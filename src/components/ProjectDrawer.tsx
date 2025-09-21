import React from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Music, Copy, Trash2, Plus, X, Sparkles, FolderPlus, Dice6, MoreHorizontal, Circle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  lastModified: Date;
  bpm: number;
  key: string;
  hasUnreadChanges?: boolean;
  isFolder?: boolean;
}

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectDrawer({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
}: ProjectDrawerProps) {
  if (!isOpen) return null;

  return (
    <TooltipProvider>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 dropsource-panel border-r border-gray-700 z-50 transform transition-transform duration-300 ease-out dropsource-floating-card">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-400" />
            <h2 className="dropsource-text-primary font-medium">Projects</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="dropsource-text-secondary hover:dropsource-glow-cyan"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Utility Toolbar */}
        <div className="p-4 border-b border-gray-700 space-y-3">
          <div className="flex justify-between gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 dropsource-text-secondary hover:dropsource-glow-cyan"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI organize projects</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 dropsource-text-secondary hover:dropsource-glow-cyan"
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New folder</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 dropsource-text-secondary hover:dropsource-glow-cyan"
                >
                  <Dice6 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open random project</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 dropsource-text-secondary hover:dropsource-glow-cyan"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
          </div>
          
          <Button
            onClick={onCreateProject}
            className="w-full dropsource-gradient hover:dropsource-glow-blue"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects List */}
        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div className="p-2 space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`group p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:border-cyan-500/50 ${
                  project.id === currentProjectId
                    ? 'bg-cyan-900/20 border-cyan-500/50 dropsource-glow-cyan'
                    : 'border-gray-700 hover:bg-gray-800/50'
                }`}
                onClick={() => onSelectProject(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="dropsource-text-primary font-medium truncate">
                        {project.title}
                      </h3>
                      {project.hasUnreadChanges && (
                        <Circle className="w-2 h-2 fill-cyan-400 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm dropsource-text-secondary">
                      <span>{project.bpm} BPM</span>
                      <span>•</span>
                      <span>{project.key}</span>
                    </div>
                    <p className="text-xs dropsource-text-secondary mt-1">
                      {project.lastModified.toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateProject(project.id);
                          }}
                          className="h-6 w-6 p-0 dropsource-text-secondary hover:dropsource-glow-cyan"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Duplicate project</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                          }}
                          className="h-6 w-6 p-0 text-red-400 hover:dropsource-glow-red"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete project</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}