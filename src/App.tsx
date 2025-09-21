import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Music, Copy, Download, Upload, Trash2, Menu, Save, Trophy, FileText, ShoppingBag, Bell, User, Star, ChevronDown, Home, BookOpen, MessageCircle, TrendingUp } from 'lucide-react';
import { ChatProvider } from './contexts/ChatContext';
import { UnifiedChatPopout } from './components/UnifiedChatPopout';
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
import CommunityHubFeed from './components/CommunityHubFeedEnhanced';
import { ProfilePageEnhanced } from './components/ProfilePageEnhanced';
import { ProfilePageEnhancedNew } from './components/ProfilePageEnhancedNew';
import { LeaderboardPage } from './components/LeaderboardPage';
import { DropSourceBookPage } from './components/DropSourceBookPage';
import { DropSourceBookMenu } from './components/menus/DropSourceBookMenu';
import { StarShop } from './components/StarShop';
// DirectContactPortal moved to DCP page
import { ChallengesMenu } from './components/ChallengesMenu';
import { SecretStar } from './components/SecretStar';
import { DropMenu } from './components/menus/DropMenu';
import { AuctionHouseMenu } from './components/menus/AuctionHouseMenu';
import { NotificationsMenu } from './components/menus/NotificationsMenu';
// NewsMenu moved to News page
import { MintingMenu } from './components/menus/MintingMenu';
import { DMsMenu } from './components/menus/DMsMenu';
import { FriendsListMenu } from './components/menus/FriendsListMenu';
import { ScrapbookMenu } from './components/menus/ScrapbookMenu';
import { DCPPage } from './components/DCPPage';
import { NewsPage } from './components/NewsPage';
import { LiveChatPanel } from './components/LiveChatPanel';
import { CreatorAdWidget } from './components/CreatorAdWidget';
import { CyclingLeaderboardWidget } from './components/CyclingLeaderboardWidget';
import TopNav from './components/TopNav';
import MegaphoneTicker from './components/MegaphoneTicker';

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

type PageType = 'pad' | 'community' | 'community-hub' | 'community-feed' | 'profile' | 'leaderboard' | 'shop' | 'book' | 'dcp' | 'news';

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
  
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
    
    // Standard positioning for floating features
    let initialPosition = { x: 100 + offset, y: 100 + offset };
    
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
    
    // Standard positioning for floating features
    let initialPosition = { x: 100 + offset, y: 100 + offset };
    
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
      'live-chat': 'Live Chat',
      dms: 'Direct Messages',
      friends: 'Friends List',
      scrapbook: 'Scrapbook',
      book: 'Drop Source Book',
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
      'live-chat': { width: 450, height: Math.min(window.innerHeight * 0.8, 650) },
      dms: { width: 400, height: 500 },
      friends: { width: 350, height: 450 },
      scrapbook: { width: 500, height: 600 },
      book: { width: 600, height: 700 },
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
    } else if (page === 'community-feed') {
      setCurrentPage('community-feed');
    } else if (page === 'shop') {
      // For now, just open the shop feature since we don't have a separate shop page
      openFeature('shop');
    } else if (page === 'book') {
      // Open Drop Source Book as a floating modal instead of a page
      openFeature('book');
    } else if (page === 'dcp') {
      setCurrentPage('dcp');
    } else if (page === 'news') {
      setCurrentPage('news');
    } else if (page === 'home') {
      setCurrentPage('community'); // Home page maps to community which has all sections
    } else if (page === 'community') {
      setCurrentPage('community'); // Main home page with all sections
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
      case 'community-feed':
        return <CommunityHubFeed onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePageEnhancedNew key="profile-page" onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={handleNavigate} />;
      case 'book':
        return <DropSourceBookPage onNavigate={handleNavigate} />;
      case 'dcp':
        return <DCPPage onNavigate={handleNavigate} />;
      case 'news':
        return <NewsPage onNavigate={handleNavigate} />;
      case 'pad':
        return (
          <>
            {/* Formatting Toolbar */}
            <FormattingToolbar
              onFormatChange={handleFormatChange}
              onInsertText={handleInsertText}
            />
            
            {/* Megaphone Ticker Bar - Always visible at top */}
            <MegaphoneTicker />

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
        return <CommunityHubFeed onNavigate={handleNavigate} />;
    }
  };

  return (
    <ChatProvider>
      <TooltipProvider>
      <div className="h-screen dropsource-bg dropsource-text-primary flex flex-col overflow-hidden">
      {/* Top Navigation - Hide on home page */}
      {currentPage !== 'community' && (
        <TopNav 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          onOpenFeature={openFeature} 
        />
      )}

      {/* Render Current Page */}
      <div 
        className="flex-1 overflow-hidden transition-all duration-300 ease-out"
        key={currentPage}
        style={{
          animation: 'fadeInSmooth 300ms ease-out'
        }}
      >
        {renderCurrentPage()}
      </div>

      {/* Remove bottom navigation completely */}

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

        // Special handling for live chat
        if (feature.type === 'live-chat') {
          return (
            <LiveChatPanel
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

        // Special handling for other menu types
        if (['auction', 'notifications', 'minting', 'dms', 'friends', 'scrapbook', 'book'].includes(feature.type as string)) {
          const MenuComponent = {
            auction: AuctionHouseMenu,
            notifications: NotificationsMenu,
            minting: MintingMenu,
            dms: DMsMenu,
            friends: FriendsListMenu,
            scrapbook: ScrapbookMenu,
            book: DropSourceBookMenu
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

      {/* Quick Access Toolbar - Adjusted positioning since no bottom nav */}
      {currentPage !== 'pad' && currentPage !== 'community' && currentPage !== 'dcp' && currentPage !== 'news' && (
        <TooltipProvider>
          <div className="fixed z-50 flex flex-col gap-3" style={{
            bottom: 'calc(var(--spacing-unit) * 3)', // Lower positioning since no bottom nav
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

      {/* Unified Chat Popout - Single instance mounted at root */}
      <UnifiedChatPopout />
    </div>
    </TooltipProvider>
    </ChatProvider>
  );
}