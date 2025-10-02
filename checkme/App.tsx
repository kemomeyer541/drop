import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Trophy, ChevronDown, FolderOpen } from 'lucide-react';
import { ChatProvider } from './contexts/ChatContext';
import { FeatureType } from './components/FloatingToolbar';
import { UnifiedChatPopout } from './components/UnifiedChatPopout';
import { LyricsEditor } from './components/LyricsEditor';
import { ProjectDrawer } from './components/ProjectDrawer';
import { CategoryToolbar } from './components/CategoryToolbar';
import { ProjectsSidebar } from './components/ProjectsSidebar';
import { FloatingCard } from './components/FloatingCard';
import { MinimizedDock, MinimizedCard } from './components/MinimizedDock';
// Dynamic import for ProStickerModule
import { ProStickerModule } from './modules/ProStickerModule.enhanced';
// import './utils/stickerDebug'; // Import debug utility - DISABLED
// import './utils/testStickerFixes'; // Import test utility - DISABLED

import { AudioNotesPanel } from './components/AudioNotesPanel';
import { RhymeHelperPanel } from './components/RhymeHelperPanel';
import { ChordHelperPanel } from './components/ChordHelperPanel';
import { SyllableCounterPanel } from './components/SyllableCounterPanel';
import { MetronomePanel } from './components/MetronomePanel';
import { AIAssistPanel } from './components/AIAssistPanel';
import { BuddySystemPanel } from './components/BuddySystemPanel';

import { CommunityHub } from './components/CommunityHub';
import { CommunityHubPage } from './components/CommunityHubPage';
import CommunityHubFeed from './components/CommunityHubFeedEnhanced';

import { ProfilePageEnhancedNew } from './components/ProfilePageEnhancedNew';
import { LeaderboardPage } from './components/LeaderboardPage';
import { DropSourceBookPage } from './components/DropSourceBookPage';
import { DropSourceBookMenu } from './components/menus/DropSourceBookMenu';
import { StarShop } from './components/StarShop';
import { ChallengesMenu } from './components/ChallengesMenu';
import { SecretStar } from './components/SecretStar';
import { DropMenu } from './components/menus/DropMenu';
import { AuctionHouseMenu } from './components/menus/AuctionHouseMenu';
import { NotificationsMenu } from './components/menus/NotificationsMenu';
import { MintingMenuFullscreen } from './components/menus/MintingMenuFullscreenUpdated';
import { DMsMenu } from './components/menus/DMsMenu';
import { FriendsListMenu } from './components/menus/FriendsListMenu';
import { ScrapbookMenu } from './components/menus/ScrapbookMenu';
import { DCPPage } from './components/DCPPage';
import { NewsPage } from './components/NewsPage';
import { LiveChatPanel } from './components/LiveChatPanel';
import TopNav from './components/TopNav';

interface Project {
  id: string;
  title: string;
  lastModified: Date;
  bpm: number;
  key: string;
  hasUnreadChanges?: boolean;
}

interface FloatingFeature {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

type PageType = 'pad' | 'community' | 'community-hub' | 'community-feed' | 'profile' | 'leaderboard' | 'shop' | 'book' | 'dcp' | 'news';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('community');
  const [bpm, setBpm] = useState(120);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [floatingFeatures, setFloatingFeatures] = useState<FloatingFeature[]>([]);
  const [minimizedCards, setMinimizedCards] = useState<MinimizedCard[]>([]);
  const [panelZIndex, setPanelZIndex] = useState(1000);

  // Menu states
  const [showDropMenu, setShowDropMenu] = useState(false);
  const [dropMenuPosition, setDropMenuPosition] = useState({ x: 0, y: 0 });
  
  // New feature states
  const [isRhymeHighlightActive, setIsRhymeHighlightActive] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#60A5FA');
  const [brushSize, setBrushSize] = useState(3);
  const [selectedTool, setSelectedTool] = useState<'brush' | 'pencil' | 'highlighter' | 'eraser'>('brush');

  // New UI states
  const [isProjectsSidebarOpen, setIsProjectsSidebarOpen] = useState(false);
  const [isStickerMode, setIsStickerMode] = useState(false);
  const padContainerRef = useRef<HTMLDivElement>(null);

  // ProStickerModule integration
  useEffect(() => {
    if (isStickerMode && padContainerRef.current) {
      ProStickerModule.initStickerModeSafe(padContainerRef.current);
      // No automatic brush - canvas starts empty with no active drawing
    } else if (!isStickerMode && padContainerRef.current) {
      // ProStickerModule doesn't have exitStickerMode method
    }
  }, [isStickerMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (padContainerRef.current) {
        // ProStickerModule doesn't have exitStickerMode method
      }
    };
  }, []);
  const [isMintingFullscreenOpen, setIsMintingFullscreenOpen] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

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

  const openFeature = (feature: string) => {
    // Handle special toggle features
    if (feature === 'rhyme-highlight') {
      handleToggleRhymeHighlight();
      return;
    }
    if (feature === 'drawing' || feature === 'drawing-tools') {
      handleToggleDrawing();
      return;
    }
    if (feature === 'minting') {
      setIsMintingFullscreenOpen(true);
      return;
    }
    if (feature === 'projects') {
      setIsProjectsSidebarOpen(true);
      return;
    }
    // Open AI assist and collaboration directly without menus
    if (feature === 'ai' || feature === 'ai-assist') {
      // Check if already open
      const isOpen = floatingFeatures.some(f => f.type === 'ai');
      if (isOpen) {
        closeFeature('ai');
        return;
      }
      // Open AI assist panel directly
      const offset = floatingFeatures.length * 30;
      const defaultSize = getDefaultSize('ai');
      const newFeature: FloatingFeature = {
        type: 'ai',
        position: { x: 100 + offset, y: 100 + offset },
        size: defaultSize,
        zIndex: panelZIndex + floatingFeatures.length + 10,
      };
      setFloatingFeatures(prev => [...prev, newFeature]);
      return;
    }
    if (feature === 'collaboration' || feature === 'buddy') {
      // Check if already open
      const isOpen = floatingFeatures.some(f => f.type === 'buddy');
      if (isOpen) {
        closeFeature('buddy');
        return;
      }
      // Open buddy system panel directly
      const offset = floatingFeatures.length * 30;
      const defaultSize = getDefaultSize('buddy');
      const newFeature: FloatingFeature = {
        type: 'buddy',
        position: { x: 100 + offset, y: 100 + offset },
        size: defaultSize,
        zIndex: panelZIndex + floatingFeatures.length + 10,
      };
      setFloatingFeatures(prev => [...prev, newFeature]);
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
      zIndex: panelZIndex + floatingFeatures.length + 10,
    };

    setFloatingFeatures(prev => [...prev, newFeature]);
  };

  const closeFeature = (feature: string) => {
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
      zIndex: panelZIndex + prev.length + 10,
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
      projects: 'Projects',
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
      projects: { width: 500, height: 650 },
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
    // Bring panel to front by updating z-index
    const newZIndex = panelZIndex + 50; // Use larger increment to avoid conflicts
    setFloatingFeatures(prev => 
      prev.map(f => 
        f.type === featureType 
          ? { ...f, zIndex: newZIndex }
          : f
      )
    );
    setPanelZIndex(newZIndex);
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
    // Drawing palette positioning can be implemented later
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

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
  };

  // Expose BPM update function globally for metronome
  useEffect(() => {
    (window as any).updateProjectBpm = handleBpmChange;
  }, []);

  // ProStickerModule integration removed to prevent conflicts with original drawing system



  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentPage('community'); // Home maps to community hub
    } else if (page === 'editor' || page === 'pad') {
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
    } else if (page === 'community') {
      setCurrentPage('community'); // Main community page with all sections
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
    // Secret star functionality can be implemented later
  };

  // Sticker mode handlers
  const handleEnterStickerMode = () => {
    setIsStickerMode(true);
    setIsDrawingActive(true);
  };

  const handleExitStickerMode = () => {
    setIsStickerMode(false);
    setIsDrawingActive(false);
  };

  // Handle background click to close overlays
  const handleOverlayBackgroundClick = (featureType: string) => {
    // Overlay background click functionality can be implemented later
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
        return <ProfilePageEnhancedNew onNavigate={handleNavigate} />;
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
              <div
                ref={padContainerRef}
                className="pad-container flex-1 relative transition-all duration-1000 h-full"
              >
            <main className="h-full p-6 relative">
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
              
              {/* ProStickerModule will be dynamically loaded */}
            </main>
          </div>
        );
      default:
        return <CommunityHub onNavigate={handleNavigate} onOpenFeature={openFeature} />;
    }
  };

  return (
    <ChatProvider>
      <TooltipProvider>
        <div className="h-screen dropsource-bg dropsource-text-primary flex flex-col overflow-hidden">
      {/* Top Navigation - Hide on community hub (home page) */}
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

      {/* Category Toolbar - Only show on pad page */}
      {currentPage === 'pad' && (
        <CategoryToolbar
          onOpenFeature={openFeature}
          activeFeatures={activeFeatures as Set<string>}
          onToggleRhymeHighlight={handleToggleRhymeHighlight}
          onToggleDrawing={handleToggleDrawing}
          isRhymeHighlightActive={isRhymeHighlightActive}
          isDrawingActive={isDrawingActive}
          isStickerMode={isStickerMode}
          onEnterStickerMode={handleEnterStickerMode}
          onExitStickerMode={handleExitStickerMode}
          isBarVisible={isToolbarVisible}
          onToggleBarVisibility={() => setIsToolbarVisible(!isToolbarVisible)}
        />
      )}

      {/* Projects Sidebar */}
      <ProjectsSidebar
        isOpen={isProjectsSidebarOpen}
        onClose={() => setIsProjectsSidebarOpen(false)}
        onSelectProject={(projectId) => {
          console.log('Selected project:', projectId);
          // Handle project selection logic here
        }}
      />

      {/* Fullscreen Minting Menu */}
      <MintingMenuFullscreen
        isOpen={isMintingFullscreenOpen}
        onClose={() => setIsMintingFullscreenOpen(false)}
      />

      {/* Floating Feature Cards - Available on all pages */}
      {floatingFeatures.map((feature) => {
        // Special handling for live chat - it has its own FloatingCard implementation
        if (feature.type === 'live-chat') {
          return (
            <React.Fragment key={feature.type}>
              <LiveChatPanel
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
            </React.Fragment>
          );
        }

        // Special handling for menu components that implement their own FloatingCard
        if (['auction', 'notifications', 'dms', 'friends', 'scrapbook', 'book'].includes(feature.type as string)) {
          const MenuComponent = {
            auction: AuctionHouseMenu,
            notifications: NotificationsMenu,
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
        
        // All other features use the standard FloatingCard wrapper
        return (
          <React.Fragment key={feature.type}>
            <FloatingCard
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
          </React.Fragment>
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

      {/* Left Side Projects Button - Show on non-pad pages */}
      {currentPage !== 'pad' && currentPage !== 'community' && (
        <TooltipProvider>
          <div className="fixed z-50" style={{
            bottom: 'calc(var(--spacing-unit) * 3)',
            left: 'calc(var(--spacing-unit) * 3)'
          }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsProjectsSidebarOpen(true)}
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
                  <FolderOpen className="w-5 h-5 dropsource-icon-outlined" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="dropsource-card">
                <p style={{ fontSize: 'var(--text-sm)' }}>Projects</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}

      {/* Drawing Palette removed - using sidebar tools only */}

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