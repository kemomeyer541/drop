import { useLayoutEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Rnd } from 'react-rnd';
import { toast } from 'sonner@2.0.3';
import { Block } from '../../types/profile';
import { useSmartGuides } from '../../utils/useSmartGuides';
import ChalkboardCanvas from './ChalkboardCanvas';
import { ProfileHeaderPermanent } from './ProfileHeaderPermanent';
import { ProfileHeader } from './ProfileHeader';
import ParticleLayer from '../particles/ParticleLayer';
import { VideoPlayer } from './blocks/VideoPlayer';
import { StreamBlock } from './blocks/StreamBlock';
import { 
  Music, MessageCircle, FileText, Activity, Camera, Video, Link2, 
  Package, Users, Heart, Volume2, User, Star, Trophy 
} from 'lucide-react';

interface ProfileCanvasProps {
  initialBlocks?: Block[];
  onBlocksChange?: (blocks: Block[]) => void;
  snapToGrid?: boolean;
  editMode?: boolean;
  backgroundCSS?: string;
  particleEffect?: string;
  currentSheet?: any;
  onDrop?: (blockKind: string, x: number, y: number) => void;
  onBlockSelect?: (block: Block | null) => void;
  showGridLines?: boolean;
  canvasBackground?: string;
}

export interface ProfileCanvasRef {
  addBlock: (type: string, x: number, y: number) => void;
  updateBlock: (block: Block) => void;
  getBlocks: () => Block[];
}

// Clean two-column preset layout using new Block type
export const CLEAN_TWO_COL_PRESET: Block[] = [
  {
    id: 'profile-header',
    type: 'header',
    x: 24,
    y: 24,
    w: 980,
    h: 180,
    locked: true,
    movable: true,
    resizable: true,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'new-drops',
    type: 'new-drops',
    x: 24,
    y: 220,
    w: 520,
    h: 160,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'your-posts',
    type: 'your-posts',
    x: 560,
    y: 220,
    w: 520,
    h: 160,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'comments',
    type: 'comments',
    x: 24,
    y: 388,
    w: 520,
    h: 144,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'links',
    type: 'links',
    x: 560,
    y: 388,
    w: 520,
    h: 144,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'collection',
    type: 'collection',
    x: 24,
    y: 544,
    w: 1056,
    h: 160,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'chalk',
    type: 'chalkboard',
    x: 24,
    y: 712,
    w: 1056,
    h: 190,
    locked: true,
    movable: true,
    resizable: true,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'shop',
    type: 'shop',
    x: 24,
    y: 914,
    w: 520,
    h: 150,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  },
  {
    id: 'friends',
    type: 'friends',
    x: 560,
    y: 914,
    w: 520,
    h: 150,
    style: {
      kind: 'solid',
      color: 'rgba(16,22,36,.92)',
      radius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      shadow: '0 12px 30px rgba(0,0,0,.24)'
    }
  }
];

// Save/Load functions for demo
function saveLayout(blocks: Block[]) {
  localStorage.setItem('profile.blocks', JSON.stringify(blocks));
}

function loadLayout(): Block[] {
  try {
    return JSON.parse(localStorage.getItem('profile.blocks') || '[]');
  } catch {
    return [];
  }
}

function ProfileCanvasSheet() {
  return <div className="canvas-sheet" />;
}

function getCanvasBackground(bg: string) {
  switch (bg) {
    case 'purple':
      return 'linear-gradient(135deg, #615CFF, #8F63FF)';
    case 'mint':
      return 'linear-gradient(135deg, #00F5D4, #A78BFA)';
    case 'gold':
      return 'linear-gradient(135deg, #FFD700, #FFB347)';
    case 'dark':
    default:
      return 'radial-gradient(1200px 800px at 25% 0%, #0e1626 0%, #0b1322 45%, #091021 100%)';
  }
}

// Block Frame Component
interface BlockFrameProps {
  block: Block;
  onDelete: () => void;
  onStyleChange: (style: Block['style']) => void;
  children: React.ReactNode;
}

function BlockFrame({ block, onDelete, onStyleChange, children }: BlockFrameProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Initialize visibility state properly
  useLayoutEffect(() => {
    setIsVisible(block.visible !== false);
  }, [block.visible]);
  
  const handleDelete = () => {
    // Immediate delete with undo toast
    onDelete();
  };
  
  const toggleVisible = () => {
    setIsVisible(!isVisible);
    // In a real implementation, you'd update the block's visible property
  };
  const { style = {} } = block;
  const bg = style.kind === 'linear'
    ? `linear-gradient(${style.angle ?? 135}deg, ${style.from}, ${style.to})`
    : (style.color ?? 'rgba(16,22,36,.92)');

  return (
    <div 
      className="block-frame" 
      style={{
        background: bg,
        borderRadius: (style.radius ?? 16) + 'px',
        border: style.border ?? '1px solid rgba(255,255,255,.08)',
        boxShadow: style.shadow ?? '0 12px 30px rgba(0,0,0,.24)',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <div className="block-toolbar">
        <span className="block-drag-handle">⋮⋮</span>
        <button 
          className={`eye ${isVisible ? 'on':'off'}`} 
          onClick={toggleVisible}
          title={isVisible ? 'Hide block' : 'Show block'}
          style={{ 
            background: 'rgba(255,255,255,.06)', 
            border: '1px solid rgba(255,255,255,.15)', 
            color: isVisible ? '#5af5d0' : '#ff6b6b',
            borderRadius: '8px', 
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isVisible ? '👁️' : '🙈'}
        </button>
        {block.type !== 'header' && block.type !== 'chalkboard' && (
          <button className="icon-btn" title="Delete" onClick={handleDelete}>
            🗑️
          </button>
        )}
        <StyleChip current={style} onChange={onStyleChange} />
      </div>

      <div className="block-content">
        {children}
      </div>
    </div>
  );
}

// Simple Style Chip for quick style changes
interface StyleChipProps {
  current: Block['style'];
  onChange: (style: Block['style']) => void;
}

function StyleChip({ current, onChange }: StyleChipProps) {
  const [showPanel, setShowPanel] = useState(false);

  const presetStyles = [
    { kind: 'solid' as const, color: 'rgba(16,22,36,.92)', label: 'Dark' },
    { kind: 'solid' as const, color: 'rgba(67,163,255,.15)', label: 'Blue' },
    { kind: 'linear' as const, from: '#615CFF', to: '#8F63FF', angle: 135, label: 'Purple' },
    { kind: 'linear' as const, from: '#00F5D4', to: '#A78BFA', angle: 135, label: 'Mint' }
  ];

  return (
    <div className="relative">
      <button
        className="icon-btn"
        onClick={() => setShowPanel(!showPanel)}
        title="Change style"
      >
        🎨
      </button>
      {showPanel && (
        <div className="absolute top-8 right-0 bg-gray-800 border border-gray-600 rounded p-2 z-50">
          <div className="grid grid-cols-2 gap-1">
            {presetStyles.map((preset, i) => (
              <button
                key={i}
                className="w-8 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                style={{
                  background: preset.kind === 'solid' 
                    ? preset.color
                    : `linear-gradient(${preset.angle}deg, ${preset.from}, ${preset.to})`
                }}
                onClick={() => {
                  onChange({
                    ...current,
                    kind: preset.kind,
                    color: preset.color,
                    from: preset.from,
                    to: preset.to,
                    angle: preset.angle
                  });
                  setShowPanel(false);
                }}
                title={preset.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ProfileCanvas = forwardRef<ProfileCanvasRef, ProfileCanvasProps>(({ 
  initialBlocks = CLEAN_TWO_COL_PRESET, 
  onBlocksChange,
  snapToGrid = false,
  editMode = true,
  backgroundCSS,
  particleEffect,
  currentSheet,
  onDrop,
  onBlockSelect,
  showGridLines = false,
  canvasBackground = 'dark'
}, ref) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [zoom, setZoom] = useState(1); // Add zoom state to prevent first-drag jump
  const innerRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smart guides system
  const { guides, snapRect, clearGuides } = useSmartGuides(
    blocks.map(b => ({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h }))
  );

  // Expand canvas after drag/resize completes
  const ensureFits = () => {
    if (!innerRef.current || !blocks.length) return;
    const pad = 120;
    const maxRight = Math.max(...blocks.map(b => b.x + b.w), 1200);
    const maxBottom = Math.max(...blocks.map(b => b.y + b.h), 900);
    innerRef.current.style.width = `${maxRight + pad}px`;
    innerRef.current.style.height = `${maxBottom + pad}px`;
  };

  useLayoutEffect(() => {
    // Set up zoom transform on the inner canvas
    if (innerRef.current) {
      innerRef.current.style.transformOrigin = '0 0';
    }
  }, []); // Initial setup

  // Separate effect for canvas sizing to prevent render-time updates
  useLayoutEffect(() => {
    ensureFits();
  }, [blocks.length]); // Only when blocks count changes

  // Cleanup effect to prevent memory leaks
  useLayoutEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    addBlock: (type: string, x: number, y: number) => {
      addBlock(type, x, y);
    },
    updateBlock: (block: Block) => {
      updateBlock(block.id, block);
    },
    getBlocks: () => blocks
  }), [blocks]);

  // Handle zoom changes
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (innerRef.current) {
      innerRef.current.style.transform = `scale(${newZoom})`;
    }
  };

  const updateBlock = (id: string, patch: Partial<Block>) => {
    setBlocks(prev => {
      const updated = prev.map(b => (b.id === id ? { ...b, ...patch } : b));
      // Clear any pending update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      // Defer onBlocksChange to prevent render-time updates
      updateTimeoutRef.current = setTimeout(() => {
        onBlocksChange?.(updated);
        updateTimeoutRef.current = null;
      }, 0);
      return updated;
    });
  };

  // Grid quantization - snap to 16px grid after guide snap
  const GRID = 16;
  const GUIDE_THRESH = 8;

  const quantizeToGrid = (x: number, y: number) => {
    const snappedX = Math.round(x / GRID) * GRID;
    const snappedY = Math.round(y / GRID) * GRID;
    return { x: snappedX, y: snappedY };
  };

  const removeBlock = (id: string) => {
    // Store the block for undo functionality
    const blockToDelete = blocks.find(b => b.id === id);
    if (!blockToDelete) return;
    
    setBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id);
      // Defer onBlocksChange to prevent render-time updates
      setTimeout(() => onBlocksChange?.(filtered), 0);
      return filtered;
    });

    // Show undo toast
    toast('Block deleted', {
      action: {
        label: 'Undo',
        onClick: () => {
          setBlocks(prev => {
            const restored = [...prev, blockToDelete];
            setTimeout(() => onBlocksChange?.(restored), 0);
            return restored;
          });
        }
      },
      duration: 3000
    });
  };

  const addBlock = (type: Block['type'], x: number, y: number) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      w: 360,
      h: 200,
      style: {
        kind: 'solid',
        color: 'rgba(14,19,28,.78)',
        radius: 16,
        border: '1px solid rgba(148,163,184,.18)',
        shadow: '0 8px 24px rgba(0,0,0,.35)'
      }
    };

    setBlocks(prev => {
      const updated = [...prev, newBlock];
      // Defer onBlocksChange to prevent render-time updates
      setTimeout(() => onBlocksChange?.(updated), 0);
      return updated;
    });
  };

  const resetToPreset = () => {
    setBlocks(CLEAN_TWO_COL_PRESET);
    // Defer onBlocksChange to prevent render-time updates
    setTimeout(() => onBlocksChange?.(CLEAN_TWO_COL_PRESET), 0);
  };

  const handleSaveLayout = () => {
    saveLayout(blocks);
    console.log('Layout saved!');
  };

  const handleLoadLayout = () => {
    const savedBlocks = loadLayout();
    if (savedBlocks.length > 0) {
      setBlocks(savedBlocks);
      // Defer onBlocksChange to prevent render-time updates
      setTimeout(() => onBlocksChange?.(savedBlocks), 0);
    } else {
      resetToPreset();
    }
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'header':
        return <ProfileHeader />;

      case 'chalkboard':
        return <ChalkboardCanvas blockId={block.id} />;

      case 'new-drops':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Music className="w-4 h-4" /> New Drops
            </h4>
            <div className="space-y-2">
              {['Midnight Vibes', 'Summer Heat'].map((track, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-sm">
                    {i === 0 ? '🎵' : '🔥'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{track}</p>
                    <p className="text-xs opacity-70">{i === 0 ? '2 days ago' : '5 days ago'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'your-posts':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Your Posts
            </h4>
            <div className="bg-gray-800/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Just dropped a new beat pack!</p>
              <p className="text-xs opacity-70">Community • 3 days ago</p>
            </div>
          </div>
        );

      case 'comments':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Comments
            </h4>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">U</div>
                <span className="text-sm font-medium">User123</span>
              </div>
              <p className="text-sm opacity-80">"Amazing beats! Keep it up! 🔥"</p>
            </div>
          </div>
        );

      case 'links':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Links
            </h4>
            <div className="space-y-2">
              {['My SoundCloud', 'YouTube Channel'].map((link, i) => (
                <a key={i} href="#" className="flex items-center gap-2 bg-gray-800/50 p-2 rounded hover:bg-gray-700/50 transition-colors">
                  <Link2 className="w-4 h-4" />
                  <span className="text-sm">{link}</span>
                </a>
              ))}
            </div>
          </div>
        );

      case 'collection':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Music className="w-4 h-4" /> My Collection
            </h4>
            <div className="flex-1 flex items-center">
              <div className="flex gap-2 flex-wrap">
                {['🎵', '🔥', '⭐', '💎'].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'shop':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Shop
            </h4>
            <div className="bg-gray-800/50 p-3 rounded">
              <div className="w-full h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded mb-2"></div>
              <p className="text-xs font-medium">Beat Pack Vol. 1</p>
              <p className="text-xs opacity-70">⭐ 299</p>
            </div>
          </div>
        );

      case 'friends':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Friends
            </h4>
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full border-2 border-gray-800" />
              ))}
              <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                <span className="text-xs">+12</span>
              </div>
            </div>
          </div>
        );

      case 'donators':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4" /> Donators
            </h4>
            <div className="space-y-2">
              {['MusicLover42', 'BeatFan2024'].map((donor, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xs">
                    🎁
                  </div>
                  <div>
                    <p className="text-sm font-medium">{donor}</p>
                    <p className="text-xs opacity-70">⭐ {i === 0 ? '500' : '250'} stars</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'monthly-supporters':
        return (
          <div className="h-full flex flex-col">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" /> Monthly Supporters
            </h4>
            <div className="space-y-2">
              {['ProducerPro', 'SynthLover', 'Collaborator1'].map((supporter, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs">
                    💚
                  </div>
                  <div>
                    <p className="text-sm font-medium">{supporter}</p>
                    <p className="text-xs opacity-70">{i < 2 ? 'Active' : '2 months'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'videos':
        return <VideoPlayer width={block.w} height={block.h} />;

      case 'stream':
        return <StreamBlock />;

      default:
        return (
          <div className="h-full flex items-center justify-center opacity-70">
            <p className="text-sm">Content for {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Top Controls */}
      <div className="top-controls">
        <div className="flex items-center gap-3">
          <button onClick={handleSaveLayout} className="dropsource-btn-secondary text-xs">
            Save Layout
          </button>
          <button onClick={resetToPreset} className="dropsource-btn-secondary text-xs">
            Reset Layout
          </button>
          <button onClick={handleLoadLayout} className="dropsource-btn-secondary text-xs">
            Load Layout
          </button>
          
          {/* Zoom Control */}
          <div className="flex items-center gap-2 ml-4">
            <label className="text-xs opacity-70">Zoom:</label>
            <input 
              type="range"
              min="70"
              max="130"
              value={zoom * 100}
              onChange={(e) => handleZoomChange(parseInt(e.target.value) / 100)}
              className="w-16"
            />
            <span className="text-xs opacity-70">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div 
        id="profile-canvas" 
        className="profile-canvas"
        style={{
          background: getCanvasBackground(canvasBackground),
          backgroundImage: showGridLines ? 
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)' : 
            undefined,
          backgroundSize: showGridLines ? '16px 16px' : undefined
        }}
      >
        <div id="profile-canvas-inner" ref={innerRef} className="profile-canvas-inner">
          {/* Background image layer - z-index: 0 */}
          {backgroundCSS && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: backgroundCSS,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0
              }} 
            />
          )}
          
          {/* Single background sheet layer - z-index: 1 */}
          <div className="canvas-sheet" style={{ zIndex: 1 }} />
          
          {/* Particle layer - z-index: 2 */}
          {particleEffect && particleEffect !== 'none' && (
            <ParticleLayer
              preset={particleEffect as any}
              density="medium"
              opacity={1}
              zIndex={2}
            />
          )}
          
          {/* Smart Guide Lines - z-index: 9999 */}
          {guides.v !== undefined && <div className="guide-v" style={{ left: guides.v, zIndex: 9999 }} />}
          {guides.h !== undefined && <div className="guide-h" style={{ top: guides.h, zIndex: 9999 }} />}
          
          {blocks.map(block => (
            <Rnd
              key={block.id}
              bounds="#profile-canvas-inner"
              size={{ width: block.w, height: block.h }}
              position={{ x: block.x, y: block.y }}
              scale={zoom} // Critical: prevents first-drag jump when zoomed
              enableResizing={block.resizable !== false}
              disableDragging={block.movable === false}
              dragHandleClassName="block-drag-handle"
              onDrag={(e, d) => {
                // Show live guides while moving
                snapRect(block.id, { id: block.id, x: d.x, y: d.y, w: block.w, h: block.h });
              }}
              onDragStop={(e, d) => {
                const snapped = snapRect(block.id, { id: block.id, x: d.x, y: d.y, w: block.w, h: block.h });
                // Apply grid quantization after guide snap
                const gridSnapped = quantizeToGrid(snapped.x, snapped.y);
                updateBlock(block.id, { x: gridSnapped.x, y: gridSnapped.y });
                clearGuides();
                // Defer ensureFits to avoid render-time updates
                setTimeout(() => ensureFits(), 0);
              }}
              onResizeStop={(e, dir, ref, delta, pos) => {
                const snapped = snapRect(block.id, { 
                  id: block.id, 
                  x: pos.x, 
                  y: pos.y, 
                  w: ref.offsetWidth, 
                  h: ref.offsetHeight 
                });
                // Apply grid quantization after guide snap
                const gridSnapped = quantizeToGrid(snapped.x, snapped.y);
                updateBlock(block.id, { 
                  w: snapped.w ?? ref.offsetWidth, 
                  h: snapped.h ?? ref.offsetHeight, 
                  x: gridSnapped.x, 
                  y: gridSnapped.y 
                });
                clearGuides();
                // Defer ensureFits to avoid render-time updates
                setTimeout(() => ensureFits(), 0);
              }}
              minWidth={360}
              minHeight={120}
              dragGrid={snapToGrid ? [16, 16] : undefined}
              resizeGrid={snapToGrid ? [16, 16] : undefined}
            >
              <BlockFrame
                block={block}
                onDelete={() => !block.locked && removeBlock(block.id)}
                onStyleChange={(style) => updateBlock(block.id, { style })}
              >
                {renderBlockContent(block)}
              </BlockFrame>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProfileCanvas;
export type { ProfileCanvasRef };