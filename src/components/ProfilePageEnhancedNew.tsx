import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, Palette, Layout, Sparkles, Settings, Eye, EyeOff, 
  RotateCcw, Save, Grid3X3, Shuffle, Plus, X, Trophy, Star, Zap, Crown, Target, Award, Flame, Diamond
} from 'lucide-react';
import { ProfileFlairProvider, useProfileFlair, type FlairType } from '../contexts/ProfileFlair';
import { FlairBurst, type FlairBurstHandle } from './profile/FlairBurst';
import ProfileCanvas, { CLEAN_TWO_COL_PRESET, ProfileCanvasRef } from './profile/ProfileCanvas';
import { BackgroundPicker } from './profile/BackgroundPicker';
import BlockStyleEditor from './profile/BlockStyleEditor';
import ParticlePicker from './profile/ParticlePicker';
import { AdvancedPanel } from './profile/AdvancedPanel';
import ParticleLayer from './particles/ParticleLayer';
import { Block } from '../types/profile';
import { applyTheme, ThemeName } from '../utils/themes';
import { DopamineEffects, HoverGlow, AttentionPulse, FloatingCollectible } from './DopamineEffects';
import { GamificationSystem } from './GamificationSystem';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const tapFlairOptions = [
  { emoji: '🐾', name: 'paw' as FlairType, color: '#FFB039', label: 'Paw' },
  { emoji: '💖', name: 'heart' as FlairType, color: '#FF6BAA', label: 'Heart' },
  { emoji: '🔥', name: 'fire' as FlairType, color: '#FF4757', label: 'Fire' },
  { emoji: '✨', name: 'sparkles' as FlairType, color: '#5BE9E9', label: 'Sparkles' },
  { emoji: '💀', name: 'skull' as FlairType, color: '#A78BFA', label: 'Skull' }
];

// Available block types for the sidebar - About removed from palette
const AVAILABLE_BLOCKS: Array<{
  type: Block['type'];
  icon: string; 
  label: string; 
  category: string;
}> = [
  { type: 'collection', icon: '🎵', label: 'Collection', category: 'Core' },
  { type: 'new-drops', icon: '📄', label: 'New Drops', category: 'Content' },
  { type: 'comments', icon: '💬', label: 'Comments', category: 'Social' },
  { type: 'your-posts', icon: '📝', label: 'Your Posts', category: 'Content' },
  { type: 'links', icon: '🔗', label: 'Links', category: 'Social' },
  { type: 'shop', icon: '🛒', label: 'Shop', category: 'Commerce' },
  { type: 'friends', icon: '👥', label: 'Friends', category: 'Social' },
  { type: 'donators', icon: '🎁', label: 'Donators', category: 'Social' },
  { type: 'monthly-supporters', icon: '💚', label: 'Monthly Supporters', category: 'Social' },
  // New blocks
  { type: 'photos', icon: '📸', label: 'Photo Grid', category: 'Media' },
  { type: 'videos', icon: '📹', label: 'Video Player', category: 'Media' },
  { type: 'stream', icon: '📺', label: 'Live Stream', category: 'Media' },
  { type: 'music-player', icon: '🎶', label: 'Music Player', category: 'Media' },
  { type: 'pinned-note', icon: '📌', label: 'Pinned Note', category: 'Content' },
  { type: 'stats', icon: '📊', label: 'Stats Block', category: 'Core' },
  { type: 'events', icon: '📅', label: 'Events', category: 'Content' },
  { type: 'poll', icon: '📊', label: 'Poll/Question', category: 'Social' },
  { type: 'mini-games', icon: '🎮', label: 'Mini Games', category: 'Media' },
];

function ProfileCanvasInner({ onNavigate }: ProfilePageProps) {
  const ref = useRef<FlairBurstHandle>(null);
  const canvasRef = useRef<ProfileCanvasRef>(null);
  const { flair } = useProfileFlair();
  const [activeSection, setActiveSection] = useState('blocks');
  const [editMode, setEditMode] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [particleEffect, setParticleEffect] = useState<string | undefined>();
  const [particleIntensity, setParticleIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [profileBlocks, setProfileBlocks] = useState<Block[]>(CLEAN_TWO_COL_PRESET);
  const [snapToGrid, setSnapToGrid] = useState(true); // Default ON for 16px grid
  const [showGridLines, setShowGridLines] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [canvasBackground, setCanvasBackground] = useState('dark');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [globalTheme, setGlobalTheme] = useState('calm');

  // Enhanced gamification features
  const [showAchievement, setShowAchievement] = useState(false);
  const [profileViews, setProfileViews] = useState(1247);
  const [profileLikes, setProfileLikes] = useState(89);
  const [showGamification, setShowGamification] = useState(false);
  const [userLevel, setUserLevel] = useState(12);
  const [userXP, setUserXP] = useState(2340);

  const handleSaveLayout = () => {
    // Save current blocks to localStorage
    localStorage.setItem('profile.blocks', JSON.stringify(profileBlocks));
    console.log('Layout saved!');
    
    // Trigger achievement for saving
    setShowAchievement(true);
    setUserXP(prev => prev + 50);
    setTimeout(() => setShowAchievement(false), 3000);
    
    toast.success('Profile saved! +50 XP earned!', {
      description: 'Your profile layout has been saved successfully.',
      duration: 3000,
    });
  };

  const handleResetLayout = () => {
    setProfileBlocks(CLEAN_TWO_COL_PRESET);
  };

  const handleLoadLayout = () => {
    try {
      const saved = localStorage.getItem('profile.blocks');
      if (saved) {
        const blocks = JSON.parse(saved);
        setProfileBlocks(blocks);
      } else {
        handleResetLayout();
      }
    } catch {
      handleResetLayout();
    }
  };

  const handleGridLayout = () => {
    canvasRef.current?.applyGridLayout();
  };

  const handleApplyTheme = (themeName: ThemeName) => {
    // Apply theme immutably to all blocks
    const currentBlocks = canvasRef.current?.getBlocks() || [];
    const themedBlocks = applyTheme(themeName, currentBlocks);
    
    // Update blocks immutably in canvas
    themedBlocks.forEach(block => {
      canvasRef.current?.updateBlock(block);
    });
    
    setGlobalTheme(themeName);
    console.log(`Applied ${themeName} theme to ${themedBlocks.length} blocks`);
  };

  const handleCanvasBackgroundChange = (bg: string, customImage?: string) => {
    setCanvasBackground(bg);
    if (customImage) {
      setCustomBackgroundImage(customImage);
    }
    
    // Update CSS custom property
    const canvasEl = document.getElementById('profile-canvas');
    if (canvasEl) {
      if (bg === 'custom' && customImage) {
        canvasEl.style.setProperty('--canvas-bg', `url(${customImage})`);
        canvasEl.style.backgroundSize = 'cover';
        canvasEl.style.backgroundPosition = 'center';
        canvasEl.style.backgroundRepeat = 'no-repeat';
      } else {
        canvasEl.style.backgroundSize = '';
        canvasEl.style.backgroundPosition = '';
        canvasEl.style.backgroundRepeat = '';
        switch (bg) {
          case 'dark':
            canvasEl.style.setProperty('--canvas-bg', 'radial-gradient(1200px 800px at 25% 0%, #0e1626 0%, #0b1322 45%, #091021 100%)');
            break;
          case 'purple':
            canvasEl.style.setProperty('--canvas-bg', 'linear-gradient(135deg, #615CFF, #8F63FF)');
            break;
          case 'mint':
            canvasEl.style.setProperty('--canvas-bg', 'linear-gradient(135deg, #00F5D4, #A78BFA)');
            break;
          case 'gold':
            canvasEl.style.setProperty('--canvas-bg', 'linear-gradient(135deg, #FFD700, #FFB347)');
            break;
        }
      }
    }
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    document.body.setAttribute('data-theme', enabled ? 'dark' : 'light');
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleCanvasBackgroundChange('custom', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-hidden dropsource-bg dropsource-text-primary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-black/20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('community')}
            className="dropsource-toolbar-button"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Enhanced Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            className={previewMode ? "dropsource-btn-primary" : "dropsource-btn-secondary"}
          >
            {previewMode ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            {previewMode ? 'Preview Mode' : 'Edit Mode'}
          </Button>
        </div>
      </header>

      <div className="flex h-full">
        {/* Left Sidebar - Block Library & Settings */}
        {!previewMode && (
          <div className="profile-sidebar border-r border-gray-700 dropsource-panel overflow-y-auto flex flex-col">
            {/* Section Navigation */}
            <div className="p-4">
              <div className="space-y-2 mb-6">
                {[
                  { id: 'blocks', label: 'Add Blocks', icon: <Layout className="w-4 h-4" /> },
                  { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
                  { id: 'particles', label: 'Particles', icon: <Sparkles className="w-4 h-4" /> },
                  { id: 'gamification', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
                  { id: 'advanced', label: 'Advanced', icon: <Settings className="w-4 h-4" /> }
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded text-left transition-all ${
                      activeSection === section.id 
                        ? 'dropsource-btn-primary' 
                        : 'dropsource-btn-ghost hover:dropsource-surface'
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex-1 p-4 dropsource-custom-scrollbar">
              {/* Add Blocks Section */}
              {activeSection === 'blocks' && (
                <div className="space-y-6">
                  {/* Available Blocks - Drag to Add */}
                  <div>
                    <h3 className="font-semibold mb-3">Drag Blocks to Canvas</h3>
                    <p className="text-xs opacity-70 mb-4">
                      Drag any block from below onto your profile canvas to add it. Each block can be individually styled and positioned.
                    </p>
                    
                    {/* Group blocks by category */}
                    {['Core', 'Content', 'Social', 'Media', 'Commerce'].map(category => {
                      const categoryBlocks = AVAILABLE_BLOCKS.filter(block => block.category === category);
                      if (categoryBlocks.length === 0) return null;
                      
                      return (
                        <div key={category} className="mb-4">
                          <h4 className="text-xs font-medium opacity-60 mb-2 uppercase tracking-wide">{category}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {categoryBlocks.map(({ type, icon, label }) => (
                              <div
                                key={type}
                                draggable
                                onDragStart={(e) => {
                                  setDraggedBlockType(type);
                                  e.dataTransfer.setData('blockKind', type);
                                }}
                                onDragEnd={() => setDraggedBlockType(null)}
                                className={`dropsource-btn-secondary p-3 h-auto text-xs flex flex-col items-center gap-1 cursor-grab hover:scale-105 transition-all ${
                                  draggedBlockType === type ? 'scale-95 opacity-50' : ''
                                }`}
                              >
                                <span className="text-sm">{icon}</span>
                                <span className="text-center leading-tight">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Canvas Background</h3>
                    <p className="text-xs opacity-70 mb-3">
                      Choose a background for your profile canvas.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {/* Simple background presets */}
                      <button
                        className={`h-12 rounded border transition-all hover:scale-105 ${
                          canvasBackground === 'dark' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : 'border-white/10'
                        }`}
                        style={{ background: 'radial-gradient(1200px 800px at 25% 0%, #0e1626 0%, #0b1322 45%, #091021 100%)' }}
                        title="Dark theme"
                        onClick={() => handleCanvasBackgroundChange('dark')}
                      />
                      <button
                        className={`h-12 rounded border transition-all hover:scale-105 ${
                          canvasBackground === 'purple' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : 'border-white/10'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #615CFF, #8F63FF)' }}
                        title="Purple gradient"
                        onClick={() => handleCanvasBackgroundChange('purple')}
                      />
                      <button
                        className={`h-12 rounded border transition-all hover:scale-105 ${
                          canvasBackground === 'mint' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : 'border-white/10'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #00F5D4, #A78BFA)' }}
                        title="Mint gradient"
                        onClick={() => handleCanvasBackgroundChange('mint')}
                      />
                      <button
                        className={`h-12 rounded border transition-all hover:scale-105 ${
                          canvasBackground === 'gold' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : 'border-white/10'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #FFD700, #FFB347)' }}
                        title="Gold gradient"
                        onClick={() => handleCanvasBackgroundChange('gold')}
                      />
                    </div>
                    
                    {/* Custom Background Upload - Separate from Particles */}
                    <div className="mt-4">
                      <label className="dropsource-btn-secondary cursor-pointer block text-center p-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          className="hidden"
                        />
                        Upload Custom Image
                      </label>
                      {customBackgroundImage && (
                        <p className="text-xs opacity-70 mt-2">Custom background uploaded</p>
                      )}
                    </div>
                  </div>

                  {/* Theme Controls */}
                  <div>
                    <h3 className="font-semibold mb-3">Global Themes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleApplyTheme('calm')}
                        className={`p-3 rounded border text-sm hover:bg-white/5 ${
                          globalTheme === 'calm' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : ''
                        }`}
                        style={{borderColor: globalTheme === 'calm' ? 'var(--dropsource-brand)' : 'var(--card-stroke)'}}
                      >
                        Calm
                      </button>
                      <button 
                        onClick={() => handleApplyTheme('vibrant')}
                        className={`p-3 rounded border text-sm hover:bg-white/5 ${
                          globalTheme === 'vibrant' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : ''
                        }`}
                        style={{borderColor: globalTheme === 'vibrant' ? 'var(--dropsource-brand)' : 'var(--card-stroke)'}}
                      >
                        Vibrant
                      </button>
                      <button 
                        onClick={() => handleApplyTheme('cosmic')}
                        className={`p-3 rounded border text-sm hover:bg-white/5 ${
                          globalTheme === 'cosmic' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : ''
                        }`}
                        style={{borderColor: globalTheme === 'cosmic' ? 'var(--dropsource-brand)' : 'var(--card-stroke)'}}
                      >
                        Cosmic
                      </button>
                      <button 
                        onClick={() => handleApplyTheme('minimal')}
                        className={`p-3 rounded border text-sm hover:bg-white/5 ${
                          globalTheme === 'minimal' ? 'ring-2 ring-cyan-400/40 border-cyan-400/50' : ''
                        }`}
                        style={{borderColor: globalTheme === 'minimal' ? 'var(--dropsource-brand)' : 'var(--card-stroke)'}}
                      >
                        Minimal
                      </button>
                    </div>
                  </div>

                  {/* Block Style Editor */}
                  {selectedBlock && (
                    <div>
                      <h3 className="font-semibold mb-3">Selected Block Style</h3>
                      <BlockStyleEditor 
                        block={selectedBlock} 
                        onChange={(updatedBlock) => {
                          setSelectedBlock(updatedBlock);
                          // Update the actual block in the canvas
                          canvasRef.current?.updateBlock(updatedBlock);
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold mb-3">Theme Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Snap to Grid (16px)</label>
                        <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Grid Lines</label>
                        <Switch checked={showGridLines} onCheckedChange={setShowGridLines} />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Dark Mode</label>
                        <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Particles Section */}
              {activeSection === 'particles' && (
                <div className="space-y-6">
                  <ParticlePicker 
                    value={particleEffect as any}
                    onChange={(effect) => setParticleEffect(effect)}
                    density={particleIntensity}
                    onDensityChange={setParticleIntensity}
                  />

                  {/* Tap Flair */}
                  <div>
                    <FlairSection />
                  </div>
                </div>
              )}

              {/* Gamification Section */}
              {activeSection === 'gamification' && (
                <div className="space-y-6">
                  {/* Profile Stats */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-400" />
                      Profile Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{profileViews}</div>
                        <div className="text-xs text-gray-400">Profile Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{profileLikes}</div>
                        <div className="text-xs text-gray-400">Profile Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">Level {userLevel}</div>
                        <div className="text-xs text-gray-400">Current Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{userXP}</div>
                        <div className="text-xs text-gray-400">Total XP</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setProfileViews(prev => prev + 1);
                          toast.success('Profile viewed! +1 view');
                        }}
                        className="w-full dropsource-btn-secondary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile (+1)
                      </Button>
                      <Button
                        onClick={() => {
                          setProfileLikes(prev => prev + 1);
                          setUserXP(prev => prev + 10);
                          toast.success('Profile liked! +10 XP');
                        }}
                        className="w-full dropsource-btn-secondary"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Like Profile (+10 XP)
                      </Button>
                    </div>
                  </div>

                  {/* Achievements Preview */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-400" />
                      Recent Achievements
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-green-900/20 rounded border border-green-500/30">
                        <div className="text-lg">🎨</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-green-400">Profile Designer</div>
                          <div className="text-xs text-gray-400">Customized your profile layout</div>
                        </div>
                        <div className="text-xs text-green-400">+50 XP</div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-blue-900/20 rounded border border-blue-500/30">
                        <div className="text-lg">👀</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-400">Profile Viewer</div>
                          <div className="text-xs text-gray-400">Viewed your profile 10 times</div>
                        </div>
                        <div className="text-xs text-blue-400">+25 XP</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Section */}
              {activeSection === 'advanced' && (
                <div className="space-y-4">
                  <AdvancedPanel />
                  
                  {/* Layout Presets */}
                  <div>
                    <h3 className="font-semibold mb-3">Layout Presets</h3>
                    <p className="text-xs opacity-70 mb-3">
                      Three professionally designed layouts that work great out of the box.
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => {
                          const canvasEl = document.getElementById('profile-canvas-inner');
                          if (canvasEl && canvasRef.current) {
                            // Import and use the balanced layout
                            import('../utils/defaultLayouts').then(({ layoutBalanced, convertLayoutToBlocks }) => {
                              const width = canvasEl.clientWidth || 1400;
                              const rects = layoutBalanced(width);
                              const blocks = convertLayoutToBlocks(rects);
                              setProfileBlocks(blocks);
                              console.log('Applied Balanced layout with', blocks.length, 'blocks');
                            });
                          }
                        }}
                        className="w-full dropsource-btn-primary"
                      >
                        Balanced Layout
                      </Button>
                      <Button 
                        onClick={() => {
                          const canvasEl = document.getElementById('profile-canvas-inner');
                          if (canvasEl && canvasRef.current) {
                            // Import and use the creator layout
                            import('../utils/defaultLayouts').then(({ layoutCreator, convertLayoutToBlocks }) => {
                              const width = canvasEl.clientWidth || 1400;
                              const rects = layoutCreator(width);
                              const blocks = convertLayoutToBlocks(rects);
                              setProfileBlocks(blocks);
                              console.log('Applied Creator layout with', blocks.length, 'blocks');
                            });
                          }
                        }}
                        className="w-full dropsource-btn-secondary"
                      >
                        Creator Layout
                      </Button>
                      <Button 
                        onClick={() => {
                          const canvasEl = document.getElementById('profile-canvas-inner');
                          if (canvasEl && canvasRef.current) {
                            // Import and use the storefront layout
                            import('../utils/defaultLayouts').then(({ layoutStorefront, convertLayoutToBlocks }) => {
                              const width = canvasEl.clientWidth || 1400;
                              const rects = layoutStorefront(width);
                              const blocks = convertLayoutToBlocks(rects);
                              setProfileBlocks(blocks);
                              console.log('Applied Storefront layout with', blocks.length, 'blocks');
                            });
                          }
                        }}
                        className="w-full dropsource-btn-secondary"
                      >
                        Storefront Layout
                      </Button>
                      <div className="text-xs opacity-50 space-y-1 mt-3">
                        <p><strong>Balanced:</strong> Hero → activity → social → tools</p>
                        <p><strong>Creator:</strong> Dense feed on left, tools on right</p>
                        <p><strong>Storefront:</strong> Commerce blocks prioritized</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Public Profile</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Allow Comments</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Show Activity</label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Export Options</h3>
                    <div className="space-y-2">
                      <Button className="w-full dropsource-btn-secondary">
                        Export Profile as Image
                      </Button>
                      <Button className="w-full dropsource-btn-secondary">
                        Share Profile Link
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Profile Canvas */}
        <div 
          className="flex-1 p-6"
          onDrop={(e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('blockKind');
            if (blockType) {
              const canvasRect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - canvasRect.left - 24; // Offset for canvas padding
              const y = e.clientY - canvasRect.top - 24;
              
              // Apply 16px snap to drop coordinates
              const GRID = 16;
              const snappedX = Math.round(x / GRID) * GRID;
              const snappedY = Math.round(y / GRID) * GRID;
              
              canvasRef.current?.addBlock(blockType, snappedX, snappedY);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault(); // Allow drop
          }}
        >
          <div
            id="profile-root"
            className="relative h-full"
            style={{ minHeight: 720 }}
            onPointerDown={(e) => {
              const host = e.currentTarget.getBoundingClientRect();
              ref.current?.burst(e.clientX - host.left, e.clientY - host.top, flair);
            }}
          >
            <div id="bg-layer" className="absolute inset-0" style={{ zIndex: 0 }} />
            
            {/* Particle Effects Layer - Mount as canvas directly under background layer */}
            {particleEffect && particleEffect !== 'none' && (
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <ParticleLayer 
                  key={`${particleEffect}-${particleIntensity}`}
                  preset={particleEffect as any} 
                  density={particleIntensity}
                  zIndex={1} 
                  opacity={particleIntensity === 'low' ? 0.6 : particleIntensity === 'medium' ? 0.8 : 1} 
                />
              </div>
            )}
            
            <div id="profile-canvas-inner" className="relative" style={{ zIndex: 10 }}>
              <ProfileCanvas 
                key={`profile-canvas-${previewMode ? 'preview' : 'edit'}-${canvasBackground}-${globalTheme}`}
                ref={canvasRef}
                initialBlocks={profileBlocks}
                onBlocksChange={setProfileBlocks}
                snapToGrid={snapToGrid}
                editMode={editMode && !previewMode}
                onBlockSelect={setSelectedBlock}
                showGridLines={showGridLines}
                canvasBackground={canvasBackground}
              />
            </div>
            
            <FlairBurst ref={ref} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlairSection() {
  const { flair, setFlair } = useProfileFlair();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Tap Flair Animation</h3>
        <p className="text-sm dropsource-text-secondary mb-3">
          Choose an animation that plays when visitors tap anywhere on your profile
        </p>
        
        <div className="space-y-2">
          {tapFlairOptions.map(option => (
            <button
              key={option.name}
              onClick={() => setFlair(option.name)}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all ${
                flair === option.name
                  ? 'dropsource-btn-primary'
                  : 'dropsource-surface hover:dropsource-panel'
              }`}
            >
              <span className="text-lg">{option.emoji}</span>
              <span className="flex-1 text-left">{option.label}</span>
              {flair === option.name && (
                <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Active
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3">Animation Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Animation Speed</label>
            <select className="dropsource-input w-20 text-sm">
              <option>Slow</option>
              <option defaultValue="">Normal</option>
              <option>Fast</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Particle Count</label>
            <select className="dropsource-input w-20 text-sm">
              <option>Low</option>
              <option defaultValue="">Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePageEnhancedNew({ onNavigate }: ProfilePageProps) {
  return (
    <ProfileFlairProvider>
      <DopamineEffects trigger={false} type="achievement">
        <ProfileCanvasInner onNavigate={onNavigate} />
      </DopamineEffects>
      <Toaster />
    </ProfileFlairProvider>
  );
}