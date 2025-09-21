import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, Upload, Image, Code, Sparkles, Plus, GripVertical, Trash2,
  Eye, EyeOff, Settings, Palette, Layout, Zap, FileText, Youtube,
  Music, MessageSquare, Paintbrush2, Move, Heart, Shield, Star,
  Users, Camera, Video, Link2, Package, TrendingUp, MessageCircle,
  Trophy, Gift, CreditCard, Activity
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

interface Container {
  id: string;
  type: 'text' | 'image' | 'sticker' | 'embed' | 'chalkboard' | 'html' | 'new-drops' | 'user-comments' | 'your-posts' | 'your-activity' | 'photos' | 'videos' | 'links' | 'shared-media' | 'shop' | 'friends' | 'shoutouts';
  title: string;
  content: any;
  visible: boolean;
  isPermanent?: boolean; // For chalkboard/doodle block
}

const tapFlairOptions = [
  { emoji: '🐾', name: 'Paw', color: '#FFB039' },
  { emoji: '💖', name: 'Heart', color: '#FF6BAA' },
  { emoji: '🔥', name: 'Fire', color: '#FF4757' },
  { emoji: '✨', name: 'Sparkles', color: '#5BE9E9' },
  { emoji: '💀', name: 'Skull', color: '#A78BFA' }
];

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState('appearance');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundFit, setBackgroundFit] = useState<'cover' | 'contain' | 'center'>('cover');
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [backgroundDim, setBackgroundDim] = useState(false);
  const [customCSS, setCustomCSS] = useState(`/* Custom Profile Styles */
.profile-container { 
  background-color: #1a1a1a; 
  border-radius: 12px; 
}
h1 { 
  color: hotpink; 
  text-shadow: 0 0 8px cyan; 
}`);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [selectedTapFlair, setSelectedTapFlair] = useState(tapFlairOptions[0]);
  const [showTapAnimation, setShowTapAnimation] = useState(false);
  const [containers, setContainers] = useState<Container[]>([
    {
      id: '1',
      type: 'text',
      title: 'About Me',
      content: 'Welcome to my DropSource profile! I create beats and vibes.',
      visible: true
    },
    {
      id: '2', 
      type: 'sticker',
      title: 'My Collection',
      content: ['legendary-beats', 'rare-synth', 'epic-drums'],
      visible: true
    },
    {
      id: 'chalkboard-permanent',
      type: 'chalkboard',
      title: 'Chalkboard/Doodle',
      content: 'Interactive drawing space for visitors',
      visible: true,
      isPermanent: true
    }
  ]);
  const [draggedContainer, setDraggedContainer] = useState<string | null>(null);

  // Handle background image upload
  const handleBackgroundUpload = () => {
    // Mock file upload - in real app would use file input
    const mockImageUrl = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800';
    setBackgroundImage(mockImageUrl);
  };

  // Generate AI suggestions
  const generateAISuggestions = () => {
    const mockSuggestions = [
      `🌈 Neon Gradient Background with pulsing glow effects`,
      `💜 Dark cyberpunk theme with holographic text overlays`,
      `🌸 Soft pastel colors with floating particle animations`,
      `⚡ Electric blue accents with lightning border effects`,
      `🎵 Music visualizer background that reacts to beats`
    ];
    setAISuggestions(mockSuggestions);
  };

  // Handle tap flair animation
  const triggerTapAnimation = () => {
    setShowTapAnimation(true);
    setTimeout(() => setShowTapAnimation(false), 2000);
  };

  // Add new container
  const addContainer = (type: Container['type']) => {
    const containerTitles = {
      'text': 'Text Block',
      'image': 'Image Block', 
      'sticker': 'Sticker/Card Collection',
      'embed': 'Embed Block',
      'chalkboard': 'Chalkboard/Doodle',
      'html': 'Custom HTML',
      'new-drops': 'New Drops',
      'user-comments': 'User Comments',
      'your-posts': 'Your Posts',
      'your-activity': 'Your Activity',
      'photos': 'Photos',
      'videos': 'Videos',
      'links': 'Links',
      'shared-media': 'Other Shared Media',
      'shop': 'Shop',
      'friends': 'Friends',
      'shoutouts': 'Shoutouts'
    };

    const defaultContent = {
      'text': 'Enter your content here...',
      'sticker': [],
      'html': '<div>Custom HTML content</div>',
      'new-drops': 'Your latest drops will appear here',
      'user-comments': 'Comments from visitors will be shown here',
      'your-posts': 'Your community posts and creations',
      'your-activity': 'Your recent DropSource activity',
      'photos': 'Your photo gallery',
      'videos': 'Your video content',
      'links': 'Your favorite links and resources',
      'shared-media': 'Other media you\'ve shared',
      'shop': 'Your marketplace items',
      'friends': 'Your DropSource friends',
      'shoutouts': 'Shoutouts and testimonials'
    };

    const newContainer: Container = {
      id: Date.now().toString(),
      type,
      title: containerTitles[type] || `New ${type} block`,
      content: defaultContent[type] || '',
      visible: true
    };
    setContainers([...containers, newContainer]);
  };

  // Remove container (prevent removing permanent blocks)
  const removeContainer = (id: string) => {
    setContainers(containers.filter(c => c.id !== id && !c.isPermanent));
  };

  // Toggle container visibility
  const toggleContainerVisibility = (id: string) => {
    setContainers(containers.map(c => 
      c.id === id ? { ...c, visible: !c.visible } : c
    ));
  };

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    // Don't allow dragging permanent blocks
    const container = containers.find(c => c.id === id);
    if (container?.isPermanent) return;
    setDraggedContainer(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedContainer) return;

    const draggedContainer_item = containers.find(c => c.id === draggedContainer);
    const targetContainer = containers.find(c => c.id === targetId);
    
    // Don't allow dropping on or moving permanent blocks
    if (draggedContainer_item?.isPermanent || targetContainer?.isPermanent) {
      setDraggedContainer(null);
      return;
    }

    const draggedIndex = containers.findIndex(c => c.id === draggedContainer);
    const targetIndex = containers.findIndex(c => c.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newContainers = [...containers];
    const [draggedItem] = newContainers.splice(draggedIndex, 1);
    newContainers.splice(targetIndex, 0, draggedItem);
    
    setContainers(newContainers);
    setDraggedContainer(null);
  };

  const renderContainer = (container: Container) => {
    const containerIcon = {
      text: <FileText className="w-4 h-4" />,
      image: <Image className="w-4 h-4" />,
      sticker: <Sparkles className="w-4 h-4" />,
      embed: <Youtube className="w-4 h-4" />,
      chalkboard: <Paintbrush2 className="w-4 h-4" />,
      html: <Code className="w-4 h-4" />,
      'new-drops': <Music className="w-4 h-4" />,
      'user-comments': <MessageCircle className="w-4 h-4" />,
      'your-posts': <FileText className="w-4 h-4" />,
      'your-activity': <Activity className="w-4 h-4" />,
      'photos': <Camera className="w-4 h-4" />,
      'videos': <Video className="w-4 h-4" />,
      'links': <Link2 className="w-4 h-4" />,
      'shared-media': <Package className="w-4 h-4" />,
      'shop': <Package className="w-4 h-4" />,
      'friends': <Users className="w-4 h-4" />,
      'shoutouts': <Heart className="w-4 h-4" />
    };

    return (
      <div
        key={container.id}
        draggable={!container.isPermanent}
        onDragStart={() => handleDragStart(container.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, container.id)}
        className={`dropsource-card p-4 mb-3 transition-all duration-200 ${
          container.visible ? 'opacity-100' : 'opacity-50'
        } ${
          container.isPermanent 
            ? 'cursor-default border-2 border-blue-500/30 bg-blue-500/5' 
            : 'cursor-grab active:cursor-grabbing hover:border-gray-600'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripVertical className={`w-4 h-4 ${container.isPermanent ? 'text-gray-500 cursor-not-allowed' : 'dropsource-text-tertiary cursor-grab'}`} />
            {containerIcon[container.type]}
            <span className="dropsource-text-primary font-medium">{container.title}</span>
            {container.isPermanent && (
              <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 ml-2">
                Permanent
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleContainerVisibility(container.id)}
              className="p-1"
            >
              {container.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            {!container.isPermanent && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeContainer(container.id)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {container.visible && (
          <div className="dropsource-surface p-3 rounded">
            {container.type === 'text' && (
              <p className="dropsource-text-secondary text-sm">{container.content}</p>
            )}
            {container.type === 'sticker' && (
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">🎵</div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded flex items-center justify-center">🔥</div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded flex items-center justify-center">⭐</div>
              </div>
            )}
            {container.type === 'embed' && (
              <div className="bg-gray-800 p-4 rounded text-center">
                <Youtube className="w-8 h-8 mx-auto mb-2 dropsource-text-tertiary" />
                <p className="dropsource-text-tertiary text-sm">YouTube embed placeholder</p>
              </div>
            )}
            {container.type === 'chalkboard' && (
              <div className="bg-slate-800 p-4 rounded border-2 border-dashed border-gray-600">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 dropsource-text-tertiary" />
                <p className="dropsource-text-tertiary text-sm text-center">Visitors can draw or leave messages here</p>
                {container.isPermanent && (
                  <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 mt-2">
                    Permanent Block
                  </Badge>
                )}
              </div>
            )}
            {container.type === 'html' && (
              <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                <code className="text-green-400">{container.content}</code>
              </div>
            )}
            {container.type === 'new-drops' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 dropsource-surface p-2 rounded">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-sm">🎵</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Midnight Vibes</p>
                    <p className="text-xs dropsource-text-tertiary">2 days ago</p>
                  </div>
                </div>
              </div>
            )}
            {container.type === 'user-comments' && (
              <div className="space-y-2">
                <div className="dropsource-surface p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">U</div>
                    <span className="text-sm font-medium">User123</span>
                  </div>
                  <p className="text-sm dropsource-text-secondary">"Amazing beats! Keep it up! 🔥"</p>
                </div>
              </div>
            )}
            {container.type === 'your-posts' && (
              <div className="space-y-2">
                <div className="dropsource-surface p-3 rounded">
                  <p className="text-sm font-medium mb-1">Just dropped a new beat pack!</p>
                  <p className="text-xs dropsource-text-tertiary">Community • 3 days ago</p>
                </div>
              </div>
            )}
            {container.type === 'your-activity' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Earned "Beat Master" badge</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span>Received 50 stars on "Summer Nights"</span>
                </div>
              </div>
            )}
            {container.type === 'photos' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-purple-500 rounded"></div>
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-teal-500 rounded"></div>
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-red-500 rounded"></div>
              </div>
            )}
            {container.type === 'videos' && (
              <div className="space-y-2">
                <div className="aspect-video bg-gray-800 rounded flex items-center justify-center">
                  <Video className="w-8 h-8 dropsource-text-tertiary" />
                </div>
                <p className="text-sm">Studio Session Behind the Scenes</p>
              </div>
            )}
            {container.type === 'links' && (
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 dropsource-surface p-2 rounded hover:dropsource-panel transition-colors">
                  <Link2 className="w-4 h-4" />
                  <span className="text-sm">My SoundCloud</span>
                </a>
                <a href="#" className="flex items-center gap-2 dropsource-surface p-2 rounded hover:dropsource-panel transition-colors">
                  <Link2 className="w-4 h-4" />
                  <span className="text-sm">YouTube Channel</span>
                </a>
              </div>
            )}
            {container.type === 'shared-media' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="dropsource-surface p-3 rounded text-center">
                  <Package className="w-6 h-6 mx-auto mb-1 dropsource-text-tertiary" />
                  <p className="text-xs">Sample Pack</p>
                </div>
                <div className="dropsource-surface p-3 rounded text-center">
                  <FileText className="w-6 h-6 mx-auto mb-1 dropsource-text-tertiary" />
                  <p className="text-xs">Preset File</p>
                </div>
              </div>
            )}
            {container.type === 'shop' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="dropsource-surface p-3 rounded">
                  <div className="w-full h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded mb-2"></div>
                  <p className="text-xs font-medium">Beat Pack Vol. 1</p>
                  <p className="text-xs dropsource-text-tertiary">⭐ 299</p>
                </div>
              </div>
            )}
            {container.type === 'friends' && (
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full border-2 border-gray-800"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-gray-800"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full border-2 border-gray-800"></div>
                <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-xs">+12</span>
                </div>
              </div>
            )}
            {container.type === 'shoutouts' && (
              <div className="dropsource-surface p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">Producer_X</span>
                </div>
                <p className="text-sm dropsource-text-secondary">"This producer has incredible talent and always delivers!"</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
          <h1 className="text-xl font-semibold">Profile Settings</h1>
        </div>
        <Badge className="dropsource-btn-primary">
          Preview Mode
        </Badge>
      </header>

      <div className="flex h-full">
        {/* Left Sidebar - Settings Menu */}
        <div className="w-80 border-r border-gray-700 dropsource-panel p-4 overflow-y-auto">
          {/* Section Navigation */}
          <div className="space-y-2 mb-6">
            {[
              { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
              { id: 'containers', label: 'Containers', icon: <Layout className="w-4 h-4" /> },
              { id: 'flair', label: 'Flair', icon: <Sparkles className="w-4 h-4" /> },
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

          <Separator className="my-4" />

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Background Image</h3>
                <Button
                  onClick={handleBackgroundUpload}
                  className="w-full dropsource-btn-secondary mb-3"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Background Image
                </Button>
                
                {backgroundImage && (
                  <div className="space-y-3">
                    <div className="dropsource-surface p-3 rounded">
                      <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Fit Mode</label>
                      <Select value={backgroundFit} onValueChange={(value: any) => setBackgroundFit(value)}>
                        <SelectTrigger className="dropsource-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dropsource-panel">
                          <SelectItem value="cover">Stretch/Cover</SelectItem>
                          <SelectItem value="contain">Fit</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Blur Background</label>
                      <Switch checked={backgroundBlur} onCheckedChange={setBackgroundBlur} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Dim for Readability</label>
                      <Switch checked={backgroundDim} onCheckedChange={setBackgroundDim} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Containers Section */}
          {activeSection === 'containers' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Add Container</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'text' as const, label: 'Text Block', icon: <FileText className="w-4 h-4" /> },
                    { type: 'image' as const, label: 'Image Block', icon: <Image className="w-4 h-4" /> },
                    { type: 'sticker' as const, label: 'Sticker/Card', icon: <Sparkles className="w-4 h-4" /> },
                    { type: 'embed' as const, label: 'Embed Block', icon: <Youtube className="w-4 h-4" /> },
                    { type: 'html' as const, label: 'Custom HTML', icon: <Code className="w-4 h-4" /> },
                    { type: 'new-drops' as const, label: 'New Drops', icon: <Music className="w-4 h-4" /> },
                    { type: 'user-comments' as const, label: 'User Comments', icon: <MessageCircle className="w-4 h-4" /> },
                    { type: 'your-posts' as const, label: 'Your Posts', icon: <FileText className="w-4 h-4" /> },
                    { type: 'your-activity' as const, label: 'Your Activity', icon: <Activity className="w-4 h-4" /> },
                    { type: 'photos' as const, label: 'Photos', icon: <Camera className="w-4 h-4" /> },
                    { type: 'videos' as const, label: 'Videos', icon: <Video className="w-4 h-4" /> },
                    { type: 'links' as const, label: 'Links', icon: <Link2 className="w-4 h-4" /> },
                    { type: 'shared-media' as const, label: 'Shared Media', icon: <Package className="w-4 h-4" /> },
                    { type: 'shop' as const, label: 'Shop', icon: <Package className="w-4 h-4" /> },
                    { type: 'friends' as const, label: 'Friends', icon: <Users className="w-4 h-4" /> },
                    { type: 'shoutouts' as const, label: 'Shoutouts', icon: <Heart className="w-4 h-4" /> }
                  ].map(containerType => (
                    <Button
                      key={containerType.type}
                      onClick={() => addContainer(containerType.type)}
                      className="dropsource-btn-secondary p-3 h-auto flex flex-col gap-1"
                    >
                      {containerType.icon}
                      <span className="text-xs">{containerType.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Container Order</h3>
                <p className="text-sm dropsource-text-secondary mb-3">
                  Drag containers to reorder them on your profile. Permanent blocks cannot be moved or deleted.
                </p>
                <div className="space-y-2">
                  {containers.map(container => (
                    <div key={container.id} className={`flex items-center gap-2 p-2 rounded ${
                      container.isPermanent 
                        ? 'dropsource-surface border border-blue-500/30 bg-blue-500/5' 
                        : 'dropsource-surface'
                    }`}>
                      <GripVertical className={`w-4 h-4 ${
                        container.isPermanent 
                          ? 'text-gray-500 cursor-not-allowed' 
                          : 'dropsource-text-tertiary cursor-grab'
                      }`} />
                      <span className="flex-1 text-sm">{container.title}</span>
                      {container.isPermanent && (
                        <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Fixed
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleContainerVisibility(container.id)}
                        className="p-1"
                      >
                        {container.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Flair Section */}
          {activeSection === 'flair' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Tap Flair</h3>
                <p className="text-sm dropsource-text-secondary mb-3">
                  Choose an animation that plays when visitors tap your profile
                </p>
                
                <div className="space-y-2">
                  {tapFlairOptions.map(option => (
                    <button
                      key={option.name}
                      onClick={() => setSelectedTapFlair(option)}
                      className={`w-full flex items-center gap-3 p-3 rounded transition-all ${
                        selectedTapFlair.name === option.name
                          ? 'dropsource-btn-primary'
                          : 'dropsource-surface hover:dropsource-panel'
                      }`}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span className="font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
                
                <Button
                  onClick={triggerTapAnimation}
                  className="w-full mt-4 dropsource-btn-secondary"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test Animation
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Section */}
          {activeSection === 'advanced' && (
            <div className="space-y-6">
              {/* Custom CSS Editor */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">Custom Profile Code</h3>
                  <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-sm dropsource-text-secondary mb-3">
                  Add your own HTML/CSS to customize your profile containers, colors, and layouts.
                </p>
                <Textarea
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  className="dropsource-input font-mono text-sm h-32"
                  placeholder="Enter your custom CSS..."
                />
                <p className="text-xs dropsource-text-tertiary mt-2">
                  ⚠️ Code will be sanitized for security before publishing
                </p>
              </div>
              
              <Separator />
              
              {/* AI Profile Helper */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">AI Profile Helper</h3>
                  <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Beta
                  </Badge>
                </div>
                <p className="text-sm dropsource-text-secondary mb-3">
                  Describe your vibe and get AI-generated layout suggestions
                </p>
                
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  placeholder="e.g., neon cyberpunk, cozy cottage, vaporwave cats"
                  className="dropsource-input mb-3"
                />
                
                <Button
                  onClick={generateAISuggestions}
                  className="w-full dropsource-btn-secondary mb-4"
                  disabled={!aiPrompt.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Layout
                </Button>
                
                {aiSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">AI Suggestions:</h4>
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="dropsource-surface p-3 rounded">
                        <p className="text-sm dropsource-text-secondary">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 relative overflow-y-auto" style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: backgroundFit,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          {/* Background overlay */}
          {backgroundImage && (backgroundBlur || backgroundDim) && (
            <div 
              className="absolute inset-0 z-0"
              style={{
                backdropFilter: backgroundBlur ? 'blur(8px)' : 'none',
                backgroundColor: backgroundDim ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
              }}
            />
          )}
          
          {/* Tap Animation Overlay */}
          {showTapAnimation && (
            <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
              <div 
                style={{
                  fontSize: '4rem',
                  animation: 'tapFlair 2s ease-out',
                  color: selectedTapFlair.color
                }}
              >
                {selectedTapFlair.emoji}
              </div>
            </div>
          )}
          
          {/* Profile Content */}
          <div className="relative z-10 p-6 max-w-2xl mx-auto">
            {/* Profile Header - Now clickable for tap flair */}
            <div 
              className="dropsource-card p-6 mb-6 text-center cursor-pointer hover:scale-[1.02] transition-transform duration-200"
              onClick={triggerTapAnimation}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                🎵
              </div>
              <h1 className="text-2xl font-bold mb-2">Your Username</h1>
              <p className="dropsource-text-secondary">Beat Producer • Community Creator</p>
              
              {/* Trust Score */}
              <div className="flex items-center justify-center gap-2 mt-2 mb-3">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Trust Score: 94%</span>
              </div>
              
              {/* DropSource PRO Badge */}
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
                  DropSource PRO (8 months)
                </Badge>
              </div>
              
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <span>⭐ 12,450 Stars</span>
                <span>🏆 Level 23</span>
                <span>👥 1,234 Followers</span>
              </div>
              
              {/* Donate and Monthly Support Buttons */}
              <div className="flex justify-center gap-3 mt-4">
                <Button size="sm" className="dropsource-btn-secondary">
                  <Gift className="w-4 h-4 mr-2" />
                  Donate
                </Button>
                <Button size="sm" className="dropsource-btn-primary">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Monthly Support
                </Button>
              </div>
            </div>
            
            {/* Dynamic Containers */}
            <div className="space-y-4">
              {containers.map(renderContainer)}
            </div>
            
            {/* Tap to Test Button - Now shows selected flair */}
            <button
              onClick={triggerTapAnimation}
              className="fixed bottom-6 right-6 dropsource-btn-primary rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              title="Test tap flair animation"
            >
              <span className="text-2xl">{selectedTapFlair.emoji}</span>
            </button>
          </div>
        </div>
      </div>
      

    </div>
  );
}