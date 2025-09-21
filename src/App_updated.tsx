import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Music, Copy, Download, Upload, Trash2, Menu, Save, Trophy, FileText, ShoppingBag, Bell, User, Star, ChevronDown, Home } from 'lucide-react';
import { LyricsEditor } from './components/LyricsEditor';
import { ProjectDrawer } from './components/ProjectDrawer';
import { FloatingToolbar, FeatureType } from './components/FloatingToolbar';
import { FloatingCard } from './components/FloatingCard';
import { MinimizedDock } from './components/MinimizedDock';
import { DrawingPalette } from './components/DrawingPalette';
import { FormattingToolbar } from './components/FormattingToolbar';
import { AudioNotesPanel } from './components/AudioNotesPanel';
import { RhymeHelperPanel } from './components/RhymeHelperPanel';
import { ChordHelperPanel } from './components/ChordHelperPanel';
import { SyllableCounterPanel } from './components/SyllableCounterPanel';
import { MetronomePanel } from './components/MetronomePanel';
import { DrawingCanvasPanel } from './components/DrawingCanvasPanel';
import { AIAssistPanel } from './components/AIAssistPanel';
import { BuddySystemPanel } from './components/BuddySystemPanel';
import { HomePage } from './components/HomePage';
import { CommunityHub } from './components/CommunityHub';
import { CommunityHubPage } from './components/CommunityHubPage';
import { ProfilePage } from './components/ProfilePage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { DropSourceBookPage } from './components/DropSourceBookPage';
import { StarShop } from './components/StarShop';
import { DirectContactPortal } from './components/DirectContactPortal';
import { ChallengesMenu } from './components/ChallengesMenu';
import { SecretStar } from './components/SecretStar';
import { DropMenu } from './components/menus/DropMenu';
import { AuctionHouseMenu } from './components/menus/AuctionHouseMenu';
import { NotificationsMenu } from './components/menus/NotificationsMenu';
import { NewsMenu } from './components/menus/NewsMenu';
import { MintingMenu } from './components/menus/MintingMenu';

interface Project {
  id: string;
  title: string;
  lastModified: Date;
  bpm: number;
  key: string;
  hasUnreadChanges?: boolean;
}

interface FloatingFeature {
  type: FeatureType | string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface MinimizedCard {
  type: FeatureType | string;
  title: string;
}

type PageType = 'pad' | 'community' | 'community-hub' | 'profile' | 'leaderboard' | 'shop' | 'book';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('community');
  const [projectTitle, setProjectTitle] = useState('Untitled Song');
  const [bpm, setBpm] = useState(120);
  const [key, setKey] = useState('C');
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [floatingFeatures, setFloatingFeatures] = useState<FloatingFeature[]>([]);
  const [minimizedCards, setMinimizedCards] = useState<MinimizedCard[]>([]);
  const [isSaved, setIsSaved] = useState(true);
  const [secretStarsFound, setSecretStarsFound] = useState(0);
  const [panelZIndex, setPanelZIndex] = useState(100);
  const [focusedPanel, setFocusedPanel] = useState<string | null>(null);
  
  // Menu states
  const [showDropMenu, setShowDropMenu] = useState(false);
  const [dropMenuPosition, setDropMenuPosition] = useState({ x: 0, y: 0 });
  
  // New feature states
  const [isRhymeHighlightActive, setIsRhymeHighlightActive] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [drawingPalettePosition, setDrawingPalettePosition] = useState({ x: 100, y: 200 });
  const [selectedColor, setSelectedColor] = useState('#60A5FA');
  const [brushSize, setBrushSize] = useState(3);
  const [selectedTool, setSelectedTool] = useState<'brush' | 'pencil' | 'highlighter' | 'eraser'>('brush');
  const [showStats, setShowStats] = useState(false);

  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Summer Vibes',
      lastModified: new Date('2024-01-15'),
      bpm: 110,
      key: 'G',
      hasUnreadChanges: true,
    },
    {
      id: '2',
      title: 'Midnight Dreams',
      lastModified: new Date('2024-01-14'),
      bpm: 85,
      key: 'Am',
    },
    {
      id: '3',
      title: 'Electric Soul',
      lastModified: new Date('2024-01-13'),
      bpm: 128,
      key: 'Em',
      hasUnreadChanges: true,
    },
  ]);

  const openFeature = (feature: FeatureType | string) => {
    // Handle special toggle features
    if (feature === 'rhyme-highlight') {
      handleToggleRhymeHighlight();
      return;
    }
    if (feature === 'drawing') {
      handleToggleDrawing();
      return;
    }
    if (feature === 'syllable') {
      // Only toggle the floating panel, no persistent stats
      // The stats will only show in the floating panel
    }

    
    // Check if feature is already open or minimized
    const isOpen = floatingFeatures.some(f => f.type === feature);
    const isMinimized = minimizedCards.some(c => c.type === feature);
    
    if (isOpen) {
      // If clicking on active feature, close it
      closeFeature(feature);
      return;
    }
    
    if (isMinimized) {
      // If minimized, restore it
      restoreFeature(feature);
      return;
    }

    // Calculate position with some offset for multiple cards
    const offset = floatingFeatures.length * 30;
    const defaultSize = getDefaultSize(feature);
    
    // Special positioning for news and contact to appear higher up on screen and avoid clipping
    let initialPosition = { x: 100 + offset, y: 100 + offset };
    if (feature === 'news' || feature === 'contact') {
      // Position closer to center-right, much higher up, with room for both panels
      const rightOffset = feature === 'news' ? 0 : 520; // News on right, contact to the left of it
      initialPosition = { x: window.innerWidth - 520 - rightOffset, y: 80 }; // Even higher position for above fold fit
    }
    
    const newFeature: FloatingFeature = {
      type: feature,
      position: initialPosition,
      size: defaultSize,
      zIndex: panelZIndex + floatingFeatures.length,
    };

    setFloatingFeatures(prev => [...prev, newFeature]);
  };

  const closeFeature = (feature: FeatureType | string) => {
    setFloatingFeatures(prev => prev.filter(f => f.type !== feature));
    setMinimizedCards(prev => prev.filter(c => c.type !== feature));
  };

  const minimizeFeature = (feature: FeatureType | string) => {
    const featureTitle = getFeatureTitle(feature);
    setFloatingFeatures(prev => prev.filter(f => f.type !== feature));
    setMinimizedCards(prev => [...prev, { type: feature, title: featureTitle }]);
  };

  const restoreFeature = (feature: FeatureType | string) => {
    setMinimizedCards(prev => prev.filter(c => c.type !== feature));
    const offset = floatingFeatures.length * 30;
    const defaultSize = getDefaultSize(feature);
    
    // Special positioning for news and contact to appear higher up on screen and avoid clipping
    let initialPosition = { x: 100 + offset, y: 100 + offset };
    if (feature === 'news' || feature === 'contact') {
      // Position closer to center-right, much higher up, with room for both panels
      const rightOffset = feature === 'news' ? 0 : 520; // News on right, contact to the left of it
      initialPosition = { x: window.innerWidth - 520 - rightOffset, y: 80 }; // Even higher position for above fold fit
    }
    
    setFloatingFeatures(prev => [...prev, {
      type: feature,
      position: initialPosition,
      size: defaultSize,
      zIndex: panelZIndex + prev.length,
    }]);
  };

  const getFeatureTitle = (feature: FeatureType | string): string => {
    const titles = {
      'rhyme-highlight': 'Highlight Rhymes',
      rhyme: 'Rhyme Helper',
      chord: 'Chord Helper',
      syllable: 'Syllable Counter',
      metronome: 'Metronome & Tap',
      audio: 'Audio Notes',
      drawing: 'Drawing',
      ai: 'AI Assist',
      buddy: 'Buddy',
      shop: 'Star Shop',
      contact: 'Direct Contact',
      challenges: 'Challenges & Goals',
      auction: 'Auction House',
      notifications: 'Notifications',
      news: 'News',
      minting: 'Mint Collectible',
    };
    return titles[feature as keyof typeof titles] || 'Unknown Feature';
  };

  const getDefaultSize = (feature: FeatureType | string): { width: number; height: number } => {
    const sizes = {
      'rhyme-highlight': { width: 400, height: 500 },
      rhyme: { width: 400, height: 500 },
      chord: { width: 450, height: 550 },
      syllable: { width: 350, height: 400 },
      metronome: { width: 300, height: 350 },
      audio: { width: 500, height: 600 },
      drawing: { width: 600, height: 500 },
      ai: { width: 500, height: 700 },
      buddy: { width: 400, height: 600 },
      shop: { width: 800, height: 700 },
      contact: { width: 500, height: 600 },
      challenges: { width: 600, height: 700 },
      auction: { width: 500, height: 600 },
      notifications: { width: 400, height: 500 },
      news: { width: 500, height: 600 },
      minting: { width: 400, height: 650 },
    };
    return sizes[feature as keyof typeof sizes] || { width: 400, height: 500 };
  };

  const handlePanelFocus = (featureType: string) => {
    setFocusedPanel(featureType);
    // Bring panel to front by updating z-index
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === featureType 
          ? { ...f, zIndex: panelZIndex + 20 }
          : f
      )
    );
    setPanelZIndex(prev => prev + 1);
  };

  const updatePanelPosition = (featureType: string, position: { x: number; y: number }) => {
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === featureType ? { ...f, position } : f
      )
    );
  };

  const updatePanelSize = (featureType: string, size: { width: number; height: number }) => {
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === featureType ? { ...f, size } : f
      )
    );
  };

  const renderFeatureContent = (feature: FeatureType | string) => {
    const components = {
      rhyme: () => <RhymeHelperPanel />,
      chord: () => <ChordHelperPanel />,
      syllable: () => <SyllableCounterPanel />,
      metronome: () => <MetronomePanel currentBpm={bpm} onBpmChange={handleBpmChange} />,
      audio: () => <AudioNotesPanel />,
      ai: () => <AIAssistPanel />,
      buddy: () => <BuddySystemPanel />,
      shop: () => <StarShop onClose={() => closeFeature('shop')} />,
      challenges: () => <ChallengesMenu onClose={() => closeFeature('challenges')} />,
    };
    
    const Component = components[feature as keyof typeof components];
    return Component ? Component() : null;
  };

  const activeFeatures = new Set(floatingFeatures.map(f => f.type));

  const handleToggleRhymeHighlight = () => {
    setIsRhymeHighlightActive(!isRhymeHighlightActive);
  };

  const handleToggleDrawing = () => {
    setIsDrawingActive(!isDrawingActive);
  };

  const handleDrawingStart = () => {
    // Position drawing palette near cursor
    setDrawingPalettePosition({ x: 150, y: 150 });
  };

  const handleDrawingUndo = () => {
    // Call the undo function exposed by LyricsEditor
    if ((window as any).undoDrawing) {
      (window as any).undoDrawing();
    }
  };

  const handleDrawingClear = () => {
    // Call the clear function exposed by LyricsEditor
    if ((window as any).clearDrawing) {
      (window as any).clearDrawing();
    }
  };

  const handleCloseDrawingPalette = () => {
    setIsDrawingActive(false);
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    setIsSaved(false);
  };

  // Expose BPM update function globally for metronome
  useEffect(() => {
    (window as any).updateProjectBpm = handleBpmChange;
  }, []);

  const handleFormatChange = (format: {
    textSize?: string;
    textAlign?: string;
    textColor?: string;
  }) => {
    // In a real app, this would apply formatting to selected text
    console.log('Format change:', format);
  };

  const handleInsertText = (text: string, type: 'verse' | 'chorus' | 'bridge' | 'chord') => {
    // In a real app, this would insert text at cursor position
    console.log('Insert text:', text, type);
  };

  const handleNavigate = (page: string) => {
    if (page === 'editor' || page === 'pad') {
      setCurrentPage('pad');
    } else if (page === 'community-hub') {
      setCurrentPage('community-hub');
    } else if (page === 'shop') {
      // For now, just open the shop feature since we don't have a separate shop page
      openFeature('shop');
    } else if (page === 'book') {
      setCurrentPage('book');
    } else if (page === 'home' || page === 'community') {
      setCurrentPage('community');
    } else {
      setCurrentPage(page as PageType);
    }
  };

  const handleDropButtonClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropMenuPosition({ x: rect.left + rect.width / 2, y: rect.top });
    setShowDropMenu(true);
  };

  const handleSecretStarFound = () => {
    setSecretStarsFound(prev => prev + 1);
  };

  // Handle background click to close overlays
  const handleOverlayBackgroundClick = (featureType: string) => {
    closeFeature(featureType);
  };

  // Render different pages
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'community':
        return <CommunityHub onNavigate={handleNavigate} onOpenFeature={openFeature} />;
      case 'community-hub':
        return <CommunityHubPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={handleNavigate} />;
      case 'book':
        return <DropSourceBookPage onNavigate={handleNavigate} />;
      case 'pad':
        return (
          <>
            {/* Formatting Toolbar */}
            <FormattingToolbar
              onFormatChange={handleFormatChange}
              onInsertText={handleInsertText}
            />

            {/* Main Workspace */}
            <main className="flex-1 p-6 relative overflow-hidden">
              <LyricsEditor 
                isRhymeHighlightEnabled={isRhymeHighlightActive}
                isDrawingMode={isDrawingActive}
                onDrawingStart={handleDrawingStart}
                showStats={false}
                selectedColor={selectedColor}
                brushSize={brushSize}
                selectedTool={selectedTool}
                onUndo={handleDrawingUndo}
                onClearDrawing={handleDrawingClear}
              />
            </main>
          </>
        );
      default:
        return <CommunityHub onNavigate={handleNavigate} onOpenFeature={openFeature} />;
    }
  };

  return (
    <TooltipProvider>
    <div className="h-screen dropsource-bg dropsource-text-primary flex flex-col overflow-hidden">
      {/* Top Navbar - Show on all pages */}
      <header className="flex items-center justify-between" style={{ 
        background: 'rgba(18, 23, 35, 0.8)',
        borderBottom: '1px solid var(--dropsource-border)',
        padding: 'calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3)',
        zIndex: '20',
        backdropFilter: 'blur(12px)'
      }}>
        {/* Left: Home Button */}
        <div className="flex items-center dropsource-spacing-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNavigate('community')}
                className="dropsource-nav-pill dropsource-focus-visible flex items-center gap-2"
                style={{ 
                  padding: 'calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)'
                }}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Back to Home</TooltipContent>
          </Tooltip>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1"></div>

        {/* Right: Bubble Navigation (Shop | Notifications | Profile) */}
        <div className="flex items-center" style={{ gap: 'calc(var(--spacing-unit) * 1)' }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => openFeature('shop')}
                className="dropsource-focus-visible transition-all duration-150 ease-out flex items-center justify-center" 
                style={{ 
                  height: '32px',
                  minWidth: '32px',
                  padding: '0',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  background: 'rgba(24, 24, 24, 0.7)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid transparent',
                  borderRadius: '50px',
                  backdropFilter: 'blur(12px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 24, 24, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                  e.currentTarget.style.color = 'var(--dropsource-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 209, 102, 0.3), 0 0 20px rgba(91, 233, 233, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 24, 24, 0.7)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <ShoppingBag 
                  className="w-5 h-5" 
                  style={{ 
                    strokeWidth: '2px',
                    opacity: '0.8'
                  }} 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>Shop</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => openFeature('notifications')}
                className="dropsource-focus-visible transition-all duration-150 ease-out flex items-center justify-center relative" 
                style={{ 
                  height: '32px',
                  minWidth: '32px',
                  padding: '0',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  background: 'rgba(24, 24, 24, 0.7)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid transparent',
                  borderRadius: '50px',
                  backdropFilter: 'blur(12px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 24, 24, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                  e.currentTarget.style.color = 'var(--dropsource-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 209, 102, 0.3), 0 0 20px rgba(91, 233, 233, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 24, 24, 0.7)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Bell 
                  className="w-5 h-5" 
                  style={{ 
                    strokeWidth: '2px',
                    opacity: '0.8'
                  }} 
                />
                {/* Gold dot badge for unread notifications */}
                <div 
                  className="absolute -top-1 -right-1" 
                  style={{ 
                    width: '3px', 
                    height: '3px', 
                    background: 'linear-gradient(45deg, #FFD700, #FFB347)', 
                    borderRadius: '50%',
                    boxShadow: '0 0 6px rgba(255, 215, 0, 0.6)'
                  }}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => handleNavigate('profile')}
                className="dropsource-focus-visible transition-all duration-150 ease-out flex items-center justify-center" 
                style={{ 
                  height: '32px',
                  minWidth: '32px',
                  padding: '0',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  background: 'rgba(24, 24, 24, 0.7)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid transparent',
                  borderRadius: '50px',
                  backdropFilter: 'blur(12px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 24, 24, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(0, 245, 212, 0.3)';
                  e.currentTarget.style.color = 'var(--dropsource-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 209, 102, 0.3), 0 0 20px rgba(91, 233, 233, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 24, 24, 0.7)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Star 
                  className="w-5 h-5" 
                  style={{ 
                    strokeWidth: '2px',
                    opacity: '0.8'
                  }} 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Old Editor Header - Only show on pad page for project controls */}
      {currentPage === 'pad' && (
        <div className="flex items-center justify-between" style={{ 
          background: 'rgba(11, 15, 26, 0.5)',
          borderBottom: '1px solid var(--dropsource-border)',
          padding: 'calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 3)',
          zIndex: '19'
        }}>
          {/* Left: Menu */}
          <div className="flex items-center dropsource-spacing-md">
            <button
              onClick={() => setIsProjectDrawerOpen(true)}
              className="dropsource-nav-pill dropsource-focus-visible"
              style={{ padding: 'calc(var(--spacing-unit) * 1)' }}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Project Title */}
          <div className="flex-1 max-w-md" style={{ margin: '0 calc(var(--spacing-unit) * 4)' }}>
            <input
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.target.value);
                setIsSaved(false);
              }}
              className="dropsource-input text-center border-none bg-transparent dropsource-focus-visible w-full"
              style={{ 
                color: 'var(--dropsource-brand)',
                fontSize: 'var(--text-md)',
                fontWeight: '500'
              }}
              placeholder="Project Title"
            />
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center dropsource-spacing-lg">
            {/* BPM */}
            <div className="flex items-center dropsource-spacing-xs">
              <label className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>BPM</label>
              <div className="dropsource-surface flex items-center" style={{ 
                padding: 'calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1)',
                borderRadius: 'var(--radius-sharp)'
              }}>
                <input
                  type="number"
                  value={bpm}
                  onChange={(e) => {
                    setBpm(Number(e.target.value));
                    setIsSaved(false);
                  }}
                  className="bg-transparent border-none text-center dropsource-text-primary dropsource-focus-visible"
                  style={{ 
                    width: '48px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500'
                  }}
                  min="60"
                  max="200"
                />
              </div>
            </div>

            {/* Key */}
            <div className="flex items-center dropsource-spacing-xs">
              <label className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>Key</label>
              <Select value={key} onValueChange={(value) => {
                setKey(value);
                setIsSaved(false);
              }}>
                <SelectTrigger className="dropsource-surface dropsource-focus-visible" style={{
                  width: '64px',
                  padding: 'calc(var(--spacing-unit) * 0.5) calc(var(--spacing-unit) * 1)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500'
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dropsource-panel dropsource-fade-in" style={{ borderColor: 'var(--dropsource-border)' }}>
                  {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                    <SelectItem key={note} value={note} className="dropsource-text-primary hover:dropsource-surface" style={{ fontSize: 'var(--text-sm)' }}>{note}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save Indicator */}
            <div className="flex items-center dropsource-spacing-xs">
              <div 
                className={`rounded-full ${isSaved ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: '6px', height: '6px' }}
              />
              <span className="dropsource-text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                {isSaved ? 'Saved' : 'Unsaved'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center dropsource-spacing-xs">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="dropsource-toolbar-button dropsource-focus-visible" style={{ padding: 'calc(var(--spacing-unit) * 1)' }}>
                    <Copy className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Copy project</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => openFeature('minting')}
                    className="dropsource-toolbar-button dropsource-focus-visible" 
                    style={{ padding: 'calc(var(--spacing-unit) * 1)' }}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Mint Collectible</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="dropsource-toolbar-button dropsource-focus-visible" style={{ padding: 'calc(var(--spacing-unit) * 1)' }}>
                    <Download className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Export project</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="dropsource-toolbar-button dropsource-focus-visible" style={{ padding: 'calc(var(--spacing-unit) * 1)' }}>
                    <Upload className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Import project</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="dropsource-toolbar-button dropsource-focus-visible hover:border-red-500 hover:text-red-400" style={{ padding: 'calc(var(--spacing-unit) * 1)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete project</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Render Current Page */}
      <div className="flex-1 overflow-hidden">
        {renderCurrentPage()}
      </div>

      {/* Project Drawer */}
      <ProjectDrawer
        isOpen={isProjectDrawerOpen}
        onClose={() => setIsProjectDrawerOpen(false)}
        projects={projects}
        currentProjectId="1"
        onSelectProject={(id) => {
          console.log('Select project:', id);
          setIsProjectDrawerOpen(false);
        }}
        onCreateProject={() => {
          console.log('Create new project');
          setIsProjectDrawerOpen(false);
        }}
        onDuplicateProject={(id) => console.log('Duplicate project:', id)}
        onDeleteProject={(id) => console.log('Delete project:', id)}
      />

      {/* Floating Toolbar - Only show on pad page */}
      {currentPage === 'pad' && (
        <FloatingToolbar
          onOpenFeature={openFeature}
          activeFeatures={activeFeatures}
          onToggleRhymeHighlight={handleToggleRhymeHighlight}
          onToggleDrawing={handleToggleDrawing}
          isRhymeHighlightActive={isRhymeHighlightActive}
          isDrawingActive={isDrawingActive}
        />
      )}

      {/* Floating Feature Cards - Available on all pages */}
      {floatingFeatures.map((feature) => {
        // Special handling for shop and challenges - they render their own content
        if (['shop', 'challenges'].includes(feature.type as string)) {
          return (
            <div key={feature.type} style={{ 
              position: 'fixed', 
              left: feature.position.x, 
              top: feature.position.y,
              zIndex: 1000 
            }}>
              {renderFeatureContent(feature.type)}
            </div>
          );
        }

        // Special handling for contact and news - use overlay system with background dimming
        if (feature.type === 'contact') {
          return createPortal(
            <div key={feature.type}>
              {/* Background Overlay with Dimming - Click to close */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-300"
                style={{ zIndex: feature.zIndex - 1 }}
                onClick={() => handleOverlayBackgroundClick(feature.type)}
              />
              {/* Draggable Panel */}
              <DirectContactPortal
                onClose={() => closeFeature(feature.type)}
                onMinimize={() => minimizeFeature(feature.type)}
                initialPosition={feature.position}
                width={feature.size.width}
                height={feature.size.height}
                zIndex={feature.zIndex}
                onPositionChange={(position) => updatePanelPosition(feature.type as string, position)}
                onSizeChange={(size) => updatePanelSize(feature.type as string, size)}
                onFocus={() => handlePanelFocus(feature.type as string)}
              />
            </div>,
            document.body
          );
        }
        
        if (feature.type === 'news') {
          return createPortal(
            <div key={feature.type}>
              {/* Background Overlay with Dimming - Click to close */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-300"
                style={{ zIndex: feature.zIndex - 1 }}
                onClick={() => handleOverlayBackgroundClick(feature.type)}
              />
              {/* Draggable Panel */}
              <NewsMenu
                onClose={() => closeFeature(feature.type)}
                onMinimize={() => minimizeFeature(feature.type)}
                initialPosition={feature.position}
                width={feature.size.width}
                height={feature.size.height}
                zIndex={feature.zIndex}
                onPositionChange={(position) => updatePanelPosition(feature.type as string, position)}
                onSizeChange={(size) => updatePanelSize(feature.type as string, size)}
                onFocus={() => handlePanelFocus(feature.type as string)}
              />
            </div>,
            document.body
          );
        }

        // Special handling for other menu types
        if (['auction', 'notifications', 'minting'].includes(feature.type as string)) {
          const MenuComponent = {
            auction: AuctionHouseMenu,
            notifications: NotificationsMenu,
            minting: MintingMenu
          }[feature.type as string];

          if (MenuComponent) {
            return (
              <MenuComponent
                key={feature.type}
                onClose={() => closeFeature(feature.type)}
                onMinimize={() => minimizeFeature(feature.type)}
                initialPosition={feature.position}
                width={feature.size.width}
                height={feature.size.height}
                zIndex={feature.zIndex}
                onPositionChange={(position) => updatePanelPosition(feature.type as string, position)}
                onSizeChange={(size) => updatePanelSize(feature.type as string, size)}
                onFocus={() => handlePanelFocus(feature.type as string)}
              />
            );
          }
        }
        
        return (
          <FloatingCard
            key={feature.type}
            title={getFeatureTitle(feature.type)}
            onClose={() => closeFeature(feature.type)}
            onMinimize={() => minimizeFeature(feature.type)}
            initialPosition={feature.position}
            width={feature.size.width}
            height={feature.size.height}
            zIndex={feature.zIndex}
            onPositionChange={(position) => updatePanelPosition(feature.type as string, position)}
            onSizeChange={(size) => updatePanelSize(feature.type as string, size)}
            onFocus={() => handlePanelFocus(feature.type as string)}
          >
            {renderFeatureContent(feature.type)}
          </FloatingCard>
        );
      })}

      {/* Minimized Cards Dock */}
      <MinimizedDock
        minimizedCards={minimizedCards}
        onRestoreCard={restoreFeature}
        onCloseCard={closeFeature}
      />

      {/* Secret Star Easter Egg */}
      <SecretStar onFound={handleSecretStarFound} />

      {/* Quick Access Toolbar - Available on all pages except pad */}
      {currentPage !== 'pad' && (
        <TooltipProvider>
          <div className="fixed z-50 flex flex-col gap-3" style={{
            bottom: 'calc(var(--spacing-unit) * 16)', // Moved up much more to leave extra space for floating panels
            right: 'calc(var(--spacing-unit) * 3)'
          }}>
            {/* Challenges Button (Top) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => openFeature('challenges')}
                  className="dropsource-toolbar-button dropsource-focus-visible dropsource-clickable flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    padding: '0',
                    backgroundColor: 'var(--dropsource-panel)',
                    border: '1px solid var(--dropsource-border)',
                    borderRadius: 'var(--radius-sharp)'
                  }}
                >
                  <Trophy className="w-5 h-5 dropsource-icon-outlined" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="dropsource-card">
                <p style={{ fontSize: 'var(--text-sm)' }}>Challenges</p>
              </TooltipContent>
            </Tooltip>

            {/* Drop Button (Below) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDropButtonClick}
                  className="dropsource-focus-visible dropsource-clickable flex items-center justify-center relative drop-button"
                  style={{
                    width: '48px',
                    height: '48px',
                    padding: '0',
                    background: 'linear-gradient(135deg, #00AEEF 0%, #8F63FF 100%)', // Branded Blue to Purple
                    border: 'none',
                    borderRadius: 'var(--radius-sharp)',
                    color: '#fff',
                    transition: 'all 250ms ease-out',
                    boxShadow: '0 0 20px rgba(0, 174, 239, 0.3)', // Blue glow
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(143, 99, 255, 0.6)'; // Purple glow on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 174, 239, 0.3)';
                  }}
                >
                  <ChevronDown 
                    className="w-6 h-6" 
                    style={{ 
                      strokeWidth: '2.5px', // Slightly thick outline
                      strokeLinecap: 'round', // Rounded edges
                      strokeLinejoin: 'round'
                    }} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="dropsource-card">
                <p style={{ fontSize: 'var(--text-sm)' }}>Drop</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}

      {/* Drawing Palette - Only show on pad page */}
      {currentPage === 'pad' && isDrawingActive && (
        <DrawingPalette
          position={drawingPalettePosition}
          onColorChange={setSelectedColor}
          onBrushSizeChange={setBrushSize}
          onToolChange={setSelectedTool}
          onUndo={handleDrawingUndo}
          onClear={handleDrawingClear}
          onClose={handleCloseDrawingPalette}
          selectedColor={selectedColor}
          brushSize={brushSize}
          selectedTool={selectedTool}
        />
      )}

      {/* Drop Menu */}
      {showDropMenu && (
        <DropMenu
          onClose={() => setShowDropMenu(false)}
          position={dropMenuPosition}
        />
      )}
    </div>
    </TooltipProvider>
  );
}