import { useState, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import { BlockModel } from "../../types/profile";
import { organizeGrid } from "../../utils/organize";
import { defaultProfileLayout } from "../../utils/templates";
import { getGridSpec, calibrateOuter, snapX, compact, type Rect } from "../../utils/gridLive";
import BlockFrame from "./BlockFrame";
import ParticleLayer from "../particles/ParticleLayer";
import AudioPlayer from "./blocks/AudioPlayer";
import { ProfileHeaderPermanent } from "./ProfileHeaderPermanent";
import { ProfileCanvasSheet, Sheet, SHEET_PRESETS } from './ProfileCanvasSheet';
import { 
  Music, MessageCircle, FileText, Activity, Camera, Video, Link2, 
  Package, Users, Heart, Volume2, User, Star, Trophy
} from "lucide-react";

interface ProfileCanvasProps {
  editMode: boolean;
  backgroundCSS: string;
  particleEffect?: string;
  onDrop?: (blockKind: string, x: number, y: number) => void;
  onBlockSelect?: (block: BlockModel | null) => void;
  currentSheet?: Sheet;
  snapToGrid?: boolean;
}

const ProfileCanvasNew = forwardRef<any, ProfileCanvasProps>(({ 
  editMode, 
  backgroundCSS, 
  particleEffect,
  onDrop,
  onBlockSelect,
  currentSheet,
  snapToGrid = true
}, ref) => {
  const [blocks, setBlocks] = useState<BlockModel[]>(defaultProfileLayout());
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasW = 1200;
  const canvasH = 800;

  // Default sheet if none provided
  const sheet = currentSheet ?? SHEET_PRESETS[0];

  // Auto-grow inner width/height to fit all blocks
  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const pad = 64;
    const maxRight = Math.max(...blocks.map(b => b.x + b.w), 1200);
    const maxBottom = Math.max(...blocks.map(b => b.y + b.h), 800);
    innerRef.current.style.width = `${Math.max(maxRight + pad, innerRef.current.clientWidth)}px`;
    innerRef.current.style.height = `${Math.max(maxBottom + pad, innerRef.current.clientHeight)}px`;
  }, [blocks]);

  const updateBlock = (block: BlockModel) => {
    setBlocks(prev => prev.map(b => b.id === block.id ? block : b));
  };

  const handleBlockSelect = (block: BlockModel) => {
    setSelectedBlockId(block.id);
    onBlockSelect?.(block);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const addBlock = (kind: BlockModel['kind'], x: number = 0, y: number = 0) => {
    // Import preset layout and reset to clean layout when adding blocks
    import('../../utils/presetLayouts').then(({ clonePresetLayout }) => {
      setBlocks(clonePresetLayout());
    });
  };

  const getDefaultSize = (kind: BlockModel['kind']) => {
    const sizes = {
      ProfileHeader: { w: 880, h: 180 }, // Header default, adjustable
      About: { w: 540, h: 160 }, // Reduced width
      Collection: { w: 540, h: 160 },
      Chalkboard: { w: 880, h: 176 }, // Keep wide for chalkboard
      NewDrops: { w: 540, h: 160 },
      UserComments: { w: 540, h: 160 },
      YourPosts: { w: 540, h: 160 },
      Activity: { w: 540, h: 160 },
      Photos: { w: 540, h: 180 },
      Videos: { w: 540, h: 180 },
      Links: { w: 540, h: 160 },
      OtherMedia: { w: 540, h: 160 },
      Shop: { w: 540, h: 200 },
      Friends: { w: 540, h: 160 },
      AudioPlayer: { w: 540, h: 140 }
    };
    return sizes[kind] || { w: 540, h: 160 };
  };

  const getMaxZ = () => Math.max(...blocks.map(b => b.z ?? 1), 0);

  // Grid calibration functions
  const onStop = (id: string, pageRect: {x: number; y: number; w: number; h: number}) => {
    const canvas = document.getElementById("profile-root") || document.getElementById("profile-canvas-inner");
    if (!canvas) return;

    // 1) live grid
    let g = getGridSpec(canvas);

    // 2) CALIBRATE to header's actual X in your state (col 0 = header.x)
    const header = blocks.find(r => r.id === "profile-header" || r.kind === "ProfileHeader");
    if (header) g = calibrateOuter(g, header.x);

    // 3) snap + compact
    const local = toLocal(pageRect, canvas);
    const x = snapX(local.x, local.w, g);
    const next: Rect = { id, ...local, x };
    
    // Convert blocks to Rect format for compaction
    const rects = blocks.map(b => ({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h }));
    const merged = compact([next, ...rects.filter(r => r.id !== id)], g, header?.id, 8);
    
    // Update the block with the new position
    const updatedRect = merged.find(r => r.id === id);
    if (updatedRect) {
      setBlocks(prev => prev.map(b => 
        b.id === id ? { ...b, x: updatedRect.x, y: updatedRect.y } : b
      ));
    }
  };

  const toLocal = (pageRect: {x: number; y: number; w: number; h: number}, canvas: HTMLElement) => {
    const r = canvas.getBoundingClientRect();
    const cs = getComputedStyle(canvas);
    const padX = parseFloat(cs.paddingLeft || "0");
    const padY = parseFloat(cs.paddingTop || "0");
    const scale = parseFloat((cs as any).zoom || "1") || 1;
    return {
      x: (pageRect.x - r.left - window.scrollX - padX) / scale,
      y: (pageRect.y - r.top  - window.scrollY - padY) / scale,
      w: pageRect.w / scale,
      h: pageRect.h / scale,
    };
  };

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    applyGridLayout: () => setBlocks(prev => organizeGrid(prev, canvasW)),
    resetLayout: () => setBlocks(defaultProfileLayout()),
    addBlock,
    updateBlock: (updatedBlock: BlockModel) => {
      setBlocks(prev => prev.map(b => b.id === updatedBlock.id ? updatedBlock : b));
    },
    getBlocks: () => blocks
  }));

  // Handle drag and drop from sidebar
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockKind = e.dataTransfer.getData('blockKind') as BlockModel['kind'];
    if (!blockKind) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - 150); // Center the block
    const y = Math.max(0, e.clientY - rect.top - 50);
    
    addBlock(blockKind, x, y);
    onDrop?.(blockKind, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const renderBlockContent = (block: BlockModel) => {
    switch (block.kind) {
      case "ProfileHeader":
        return (
          <ProfileHeaderPermanent
            user={{
              name: "BeatMaster Pro",
              handle: "beatmaster_pro",
              avatar: undefined,
              pronouns: "they/them",
              location: "Los Angeles, CA",
              availability: "Open to collab",
              bio: "Producer and beatmaker creating vibes since 2019. Always looking for fresh collaborations and pushing musical boundaries.",
              trust: 94,
              level: 47,
              stars: 12847,
              followers: 2341,
              following: 892,
              proMonths: 6,
              links: [
                { label: "SoundCloud", url: "https://soundcloud.com/beatmaster" },
                { label: "YouTube", url: "https://youtube.com/beatmaster" },
                { label: "Spotify", url: "https://spotify.com/artist/beatmaster" }
              ]
            }}
            onDonate={() => console.log('Donate clicked')}
            onSupport={() => console.log('Support clicked')}
            onMessage={() => console.log('Message clicked')}
          />
        );

      case "About":
        return (
          <div className="h-full flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">BeatMaster Pro</h3>
                  <p className="text-sm opacity-70">Producer • Level 47</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Creating beats and vibes since 2019. Always pushing boundaries and exploring new sounds.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="dropsource-btn-primary text-xs">🎁 Donate</button>
              <button className="dropsource-btn-secondary text-xs">🎁 Monthly Support</button>
            </div>
          </div>
        );

      case "Collection":
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

      case "Chalkboard":
        return (
          <div className="bg-slate-800 p-4 rounded border-2 border-dashed border-gray-600 h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">🖍️</div>
              <span className="font-medium">Interactive Chalkboard</span>
              <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                Permanent
              </div>
            </div>
            <p className="text-sm opacity-70 text-center">Visitors can draw or leave messages here</p>
          </div>
        );

      case "NewDrops":
        return (
          <div className="p-3">
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

      case "UserComments":
        return (
          <div className="p-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> User Comments
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

      case "YourPosts":
        return (
          <div className="p-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Your Posts
            </h4>
            <div className="bg-gray-800/50 p-3 rounded">
              <p className="text-sm font-medium mb-1">Just dropped a new beat pack!</p>
              <p className="text-xs opacity-70">Community • 3 days ago</p>
            </div>
          </div>
        );

      case "Activity":
        return (
          <div className="p-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Your Activity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Earned "Beat Master" badge</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-blue-400" />
                <span>Received 50 stars</span>
              </div>
            </div>
          </div>
        );

      case "Photos":
        return (
          <div className="p-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Photos
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-pink-500 to-purple-500 rounded" />
              ))}
            </div>
          </div>
        );

      case "Videos":
        return (
          <div className="p-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" /> Videos
            </h4>
            <div className="aspect-video bg-gray-800 rounded flex items-center justify-center mb-2">
              <Video className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">Studio Session Behind the Scenes</p>
          </div>
        );

      case "Links":
        return (
          <div className="p-3">
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

      case "Shop":
        return (
          <div className="p-3">
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

      case "Friends":
        return (
          <div className="p-3">
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

      case "OtherMedia":
        return (
          <div className="p-3">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Other Media
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800/50 p-3 rounded text-center">
                <Package className="w-6 h-6 mx-auto mb-1 opacity-70" />
                <p className="text-xs">Sample Pack</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded text-center">
                <FileText className="w-6 h-6 mx-auto mb-1 opacity-70" />
                <p className="text-xs">Preset File</p>
              </div>
            </div>
          </div>
        );

      case "AudioPlayer":
        return (
          <AudioPlayer 
            src={block.audioUrl}
            title="My Latest Track"
            onUpdate={(data) => updateBlock({ ...block, audioUrl: data.src })}
          />
        );

      default:
        return (
          <div className="p-3 opacity-70 text-center">
            <p className="text-sm">Content for <b>{block.kind}</b></p>
          </div>
        );
    }
  };

  const visibleBlocks = blocks.filter(b => !b.hidden);

  return (
    <div className="w-full h-full relative">
      {/* Canvas */}
      <div id="profile-canvas" ref={canvasRef}>
        <div 
          id="profile-canvas-inner" 
          ref={innerRef}
          className="profile-shell"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Background Sheet Layer */}
          <ProfileCanvasSheet sheet={sheet} />
          
          {/* Particle Effects Layer - Updated for full coverage */}
          {particleEffect && particleEffect !== 'none' && (
            <ParticleLayer 
              preset={particleEffect as any} 
              zIndex={1} 
              opacity={0.7} 
            />
          )}

          {/* Blocks container should be positioned above */}
          <div style={{position:'relative', zIndex:1}}>

          {/* Drop Zone Indicator */}
          {editMode && (
            <div className="absolute inset-4 border-2 border-dashed border-gray-600/30 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="bg-gray-800/80 px-4 py-2 rounded text-sm opacity-50">
                Drag blocks from the sidebar to add them to your profile
              </div>
            </div>
          )}

            {/* Profile Blocks */}
            {visibleBlocks.map((block) => (
              <BlockFrame
                key={block.id}
                block={block}
                maxZ={getMaxZ()}
                canvasW={canvasW}
                canvasH={canvasH}
                onChange={updateBlock}
                onRemove={removeBlock}
                editMode={editMode}
                onSelect={handleBlockSelect}
                isSelected={selectedBlockId === block.id}
                snapToGrid={snapToGrid}
              >
                {renderBlockContent(block)}
              </BlockFrame>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileCanvasNew.displayName = 'ProfileCanvasNew';

export default ProfileCanvasNew;