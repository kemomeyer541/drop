import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { 
  ArrowLeft, Palette, Layout, Sparkles, Settings, Eye, EyeOff, RotateCcw, Save, Plus, Trash2, Grid3X3, Shuffle
} from 'lucide-react';
import { ProfileFlairProvider, useProfileFlair, type FlairType } from '../contexts/ProfileFlair';
import { FlairBurst, type FlairBurstHandle } from './profile/FlairBurst';
import { ProfileCanvas } from './profile/ProfileCanvas';
import { BackgroundPicker } from './profile/BackgroundPicker';

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

// Available block types for the sidebar
const AVAILABLE_BLOCKS = [
  { type: 'about', icon: '👤', label: 'About', category: 'Core' },
  { type: 'collection', icon: '🎵', label: 'Collection', category: 'Core' },
  { type: 'newDrops', icon: '📄', label: 'New Drops', category: 'Content' },
  { type: 'userComments', icon: '💬', label: 'Comments', category: 'Social' },
  { type: 'yourPosts', icon: '📝', label: 'Your Posts', category: 'Content' },
  { type: 'yourActivity', icon: '⚡', label: 'Activity', category: 'Content' },
  { type: 'photos', icon: '📸', label: 'Photos', category: 'Media' },
  { type: 'videos', icon: '🎥', label: 'Videos', category: 'Media' },
  { type: 'links', icon: '🔗', label: 'Links', category: 'Social' },
  { type: 'otherMedia', icon: '📦', label: 'Media', category: 'Media' },
  { type: 'shop', icon: '🛒', label: 'Shop', category: 'Commerce' },
  { type: 'friends', icon: '👥', label: 'Friends', category: 'Social' },
  { type: 'shoutouts', icon: '💝', label: 'Shoutouts', category: 'Social' },
  { type: 'audioPlayer', icon: '🎵', label: 'Audio Player', category: 'Media' }
];

function ProfileCanvasInner({ onNavigate }: ProfilePageProps) {
  const ref = useRef<FlairBurstHandle>(null);
  const canvasRef = useRef<any>(null);
  const { flair } = useProfileFlair();
  const [activeSection, setActiveSection] = useState('layout');
  const [editMode, setEditMode] = useState(true);
  const [backgroundCSS, setBackgroundCSS] = useState("transparent");
  const [previewMode, setPreviewMode] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(false);
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);

  return (
    <div className="h-full overflow-hidden dropsource-bg dropsource-text-primary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
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
          <div className="w-80 border-r border-gray-700 dropsource-panel overflow-y-auto flex flex-col">
            {/* Section Navigation */}
            <div className="p-4">
              <div className="space-y-2 mb-6">
                {[
                  { id: 'layout', label: 'Add Blocks', icon: <Layout className="w-4 h-4" /> },
                  { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
                  { id: 'flair', label: 'Tap Flair', icon: <Sparkles className="w-4 h-4" /> },
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

            <div className="flex-1 p-4">
              {/* Layout Section - Add Blocks */}
              {activeSection === 'layout' && (
                <div className="space-y-6">
                  {/* Layout Controls */}
                  <div>
                    <h3 className="font-semibold mb-3">Layout Controls</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button 
                        className="dropsource-btn-secondary p-3 h-auto"
                        onClick={() => canvasRef.current?.applyGridLayout()}
                      >
                        <div className="text-center">
                          <Grid3X3 className="w-4 h-4 mx-auto mb-1" />
                          <div className="text-xs font-medium">Grid</div>
                          <div className="text-xs opacity-70">Organized</div>
                        </div>
                      </Button>
                      <Button 
                        className="dropsource-btn-secondary p-3 h-auto"
                        onClick={() => canvasRef.current?.applyFreeCreativeLayout()}
                      >
                        <div className="text-center">
                          <Shuffle className="w-4 h-4 mx-auto mb-1" />
                          <div className="text-xs font-medium">Free</div>
                          <div className="text-xs opacity-70">Creative</div>
                        </div>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        className="dropsource-btn-secondary flex items-center gap-2 text-xs"
                        onClick={() => canvasRef.current?.resetToCleanLayout()}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Layout
                      </Button>
                      <Button 
                        className="dropsource-btn-secondary flex items-center gap-2 text-xs"
                        onClick={() => canvasRef.current?.saveLayout()}
                      >
                        <Save className="w-3 h-3" />
                        Save Layout
                      </Button>
                    </div>
                  </div>

                  {/* Available Blocks - Drag to Add */}
                  <div>
                    <h3 className="font-semibold mb-3">Drag Blocks to Canvas</h3>
                    <p className="text-xs opacity-70 mb-3">
                      Drag any block from below onto your profile canvas to add it. Each block can be individually colored, positioned, and configured.
                    </p>
                    
                    {/* Group blocks by category */}
                    {['Core', 'Content', 'Social', 'Media', 'Commerce'].map(category => {
                      const categoryBlocks = AVAILABLE_BLOCKS.filter(block => block.category === category);
                      
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
                                  e.dataTransfer.setData('blockType', type);
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
                    <h3 className="font-semibold mb-3">Profile Background</h3>
                    <p className="text-xs opacity-70 mb-3">
                      Choose a background for your entire profile. Individual blocks have their own color settings.
                    </p>
                    <BackgroundPicker onChange={setBackgroundCSS} />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Theme Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Dark Mode</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Particle Effects</label>
                        <Switch 
                          checked={particlesEnabled} 
                          onCheckedChange={setParticlesEnabled} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Animated Gradients</label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Flair Section */}
              {activeSection === 'flair' && (
                <FlairSection />
              )}

              {/* Advanced Section */}
              {activeSection === 'advanced' && (
                <div className="space-y-4">
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
        <div className="flex-1 p-6">
          <div
            className="relative h-full"
            onPointerDown={(e) => {
              const host = e.currentTarget.getBoundingClientRect();
              ref.current?.burst(e.clientX - host.left, e.clientY - host.top, flair);
            }}
          >
            <ProfileCanvas 
              ref={canvasRef}
              editMode={editMode && !previewMode} 
              setEditMode={setEditMode} 
              backgroundCSS={backgroundCSS}
              particlesEnabled={particlesEnabled}
              useCleanLayout={true}
              showBlockLibrary={false}
            />
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
              <option selected>Normal</option>
              <option>Fast</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Particle Count</label>
            <select className="dropsource-input w-20 text-sm">
              <option>Low</option>
              <option selected>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePageEnhanced({ onNavigate }: ProfilePageProps) {
  return (
    <ProfileFlairProvider>
      <ProfileCanvasInner onNavigate={onNavigate} />
    </ProfileFlairProvider>
  );
}