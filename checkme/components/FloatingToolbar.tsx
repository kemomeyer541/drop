import React from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Mic, 
  Hash, 
  Music2, 
  Calculator, 
  Timer, 
  Pen, 
  Bot,
  Users,
  FileText,
  Highlighter,
  FolderOpen
} from 'lucide-react';

export type FeatureType = 'rhyme-highlight' | 'rhyme' | 'chord' | 'syllable' | 'metronome' | 'audio' | 'drawing' | 'ai' | 'buddy' | 'projects';

interface FloatingToolbarProps {
  onOpenFeature: (feature: FeatureType | string) => void;
  activeFeatures: Set<FeatureType | string>;
  onToggleRhymeHighlight?: () => void;
  onToggleDrawing?: () => void;
  isRhymeHighlightActive?: boolean;
  isDrawingActive?: boolean;
}

const features = [
  { id: 'projects' as FeatureType, icon: FolderOpen, label: 'Projects', description: 'Manage your projects' },
  { id: 'rhyme-highlight' as FeatureType, icon: Highlighter, label: 'Highlight Rhymes', description: 'Highlight rhyming words inline', isToggle: true },
  { id: 'rhyme' as FeatureType, icon: Hash, label: 'Rhyme Helper', description: 'Find rhymes and suggestions' },
  { id: 'chord' as FeatureType, icon: Music2, label: 'Chord Helper', description: 'Guitar & piano chords' },
  { id: 'syllable' as FeatureType, icon: Calculator, label: 'Syllable Counter', description: 'Count syllables and words' },
  { id: 'metronome' as FeatureType, icon: Timer, label: 'Metronome', description: 'Keep time and tap BPM' },
  { id: 'audio' as FeatureType, icon: Mic, label: 'Audio Notes', description: 'Record and upload audio' },
  { id: 'drawing' as FeatureType, icon: Pen, label: 'Drawing', description: 'Draw over lyrics', isToggle: true },
  { id: 'ai' as FeatureType, icon: Bot, label: 'AI Assist', description: 'Get creative suggestions' },
  { id: 'buddy' as FeatureType, icon: Users, label: 'Buddy', description: 'Invite collaborator' },
  { id: 'minting' as FeatureType, icon: FileText, label: 'Mint Sticker', description: 'Create collectible stickers' },
];

export function FloatingToolbar({ 
  onOpenFeature, 
  activeFeatures, 
  onToggleRhymeHighlight,
  onToggleDrawing,
  isRhymeHighlightActive = false,
  isDrawingActive = false
}: FloatingToolbarProps) {
  const [isHidden, setIsHidden] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.id === 'rhyme-highlight' && onToggleRhymeHighlight) {
      onToggleRhymeHighlight();
    } else if (feature.id === 'drawing' && onToggleDrawing) {
      onToggleDrawing();
    } else {
      onOpenFeature(feature.id);
    }
  };

  const handleSwipeAway = () => {
    setIsHidden(!isHidden);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (isHidden) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsHidden(false); // Show when dragged back
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleDragEnd);
      return () => document.removeEventListener('mouseup', handleDragEnd);
    }
  }, [isDragging]);

  return (
    <TooltipProvider>
      {/* Hidden Indicator Line */}
      {isHidden && (
        <div 
          className="dropsource-toolbar-hidden-indicator"
          onClick={handleSwipeAway}
          onMouseDown={handleDragStart}
        />
      )}

      {/* Main Toolbar */}
      <div className={`fixed z-30 ${isHidden ? 'dropsource-toolbar-collapsed' : ''}`} style={{
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'all var(--transition-smooth)',
      }}>
        {/* Enhanced Floating Toolbar */}
        <div className="dropsource-toolbar-enhanced flex flex-col" style={{
          gap: 'calc(var(--spacing-unit) * 0.75)',
          width: '64px',
          padding: 'calc(var(--spacing-unit) * 1.5)'
        }}>
          {/* Swipe Handle */}
          <div className="flex justify-center mb-2">
            <button
              onClick={handleSwipeAway}
              className="dropsource-toolbar-rail-handle"
              style={{ 
                width: '32px', 
                height: '8px',
                borderRadius: '4px',
                padding: '0'
              }}
            >
              <div className="w-4 h-1 rounded-full bg-current mx-auto"></div>
            </button>
          </div>

          {/* Feature Tools */}
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.isToggle 
              ? (feature.id === 'rhyme-highlight' ? isRhymeHighlightActive : isDrawingActive)
              : activeFeatures.has(feature.id);

            return (
              <Tooltip key={feature.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleFeatureClick(feature)}
                    className={`dropsource-toolbar-button ${isActive ? 'active dropsource-pulse-border' : ''}`}
                    style={{
                      width: '48px',
                      height: '48px',
                      padding: '0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon className="w-5 h-5 dropsource-icon-outlined" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="dropsource-card">
                  <div>
                    <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>{feature.label}</p>
                    <p className="text-xs opacity-75">{feature.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}