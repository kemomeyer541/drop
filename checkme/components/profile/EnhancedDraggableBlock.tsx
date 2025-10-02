import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { 
  Pin, PinOff, ChevronUp, ChevronDown, Eye, EyeOff, 
  Palette, Settings, Volume2, Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { ProfileBlock, BackgroundType } from '../../types/profile';

interface EnhancedDraggableBlockProps {
  block: ProfileBlock;
  onChange: (patch: Partial<ProfileBlock>) => void;
  onLayerUp: () => void;
  onLayerDown: () => void;
  onRemove: () => void;
  editable: boolean;
  children: React.ReactNode;
  maxZIndex: number;
}

export default function EnhancedDraggableBlock({
  block, 
  onChange, 
  onLayerUp, 
  onLayerDown, 
  onRemove,
  editable, 
  children,
  maxZIndex
}: EnhancedDraggableBlockProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const rndRef = useRef<Rnd>(null);

  const getBackgroundStyle = () => {
    const opacity = block.opacity ?? 1;
    
    if (block.backgroundType === 'gradient' && block.gradientColors) {
      const angle = block.gradientAngle ?? 135;
      const [start, end] = block.gradientColors;
      return {
        background: `linear-gradient(${angle}deg, ${start}, ${end})`,
        opacity
      };
    }
    
    return {
      background: block.bg ?? 'var(--card-bg-darker)',
      opacity
    };
  };

  const togglePin = () => {
    onChange({ pinned: !block.pinned });
  };

  const toggleEnabled = () => {
    onChange({ enabled: !block.enabled });
  };

  const updateOpacity = (value: number[]) => {
    onChange({ opacity: value[0] });
  };

  const updateBackgroundType = (type: BackgroundType) => {
    if (type === 'gradient' && !block.gradientColors) {
      onChange({ 
        backgroundType: type,
        gradientColors: [block.bg ?? '#0f1520', '#1a2531'],
        gradientAngle: 135
      });
    } else {
      onChange({ backgroundType: type });
    }
  };

  const updateGradientColor = (index: 0 | 1, color: string) => {
    const colors = block.gradientColors ?? [block.bg ?? '#0f1520', '#1a2531'];
    colors[index] = color;
    onChange({ gradientColors: [...colors] as [string, string] });
  };

  const updateGradientAngle = (angle: number) => {
    onChange({ gradientAngle: angle });
  };

  // Don't render if disabled
  if (block.enabled === false) {
    return null;
  }

  return (
    <div 
      className="absolute"
      onMouseEnter={() => editable && setShowToolbar(true)}
      onMouseLeave={() => {
        setShowToolbar(false);
        setShowColorPicker(false);
      }}
      style={{ zIndex: block.zIndex ?? 1 }}
    >
      <Rnd
        ref={rndRef}
        size={{ width: block.w, height: block.h }}
        position={{ x: block.x, y: block.y }}
        onDragStop={(e, d) => {
          if (!editable || block.pinned) return;
          onChange({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          if (!editable) return;
          onChange({
            w: ref.offsetWidth,
            h: ref.offsetHeight,
            x: position.x,
            y: position.y,
          });
        }}
        disableDragging={!editable || block.pinned}
        enableResizing={editable ? {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        } : false}
        bounds="parent"
        className="dropsource-rnd-block"
      >
        <div
          className="w-full h-full rounded-md border border-gray-700 overflow-hidden relative"
          style={getBackgroundStyle()}
        >
          {/* Floating Toolbar */}
          {showToolbar && editable && (
            <div className="absolute -top-12 left-0 right-0 z-50">
              <div className="flex items-center justify-center">
                <div className="dropsource-toolbar px-2 py-1 flex items-center gap-1">
                  {/* Pin/Unpin */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePin}
                    className="p-1 h-6 w-6 dropsource-toolbar-button"
                    title={block.pinned ? "Unpin" : "Pin"}
                  >
                    {block.pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
                  </Button>

                  {/* Layer Up */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onLayerUp}
                    className="p-1 h-6 w-6 dropsource-toolbar-button"
                    title="Layer Up"
                    disabled={(block.zIndex ?? 1) >= maxZIndex}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>

                  {/* Layer Down */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onLayerDown}
                    className="p-1 h-6 w-6 dropsource-toolbar-button"
                    title="Layer Down"
                    disabled={(block.zIndex ?? 1) <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>

                  {/* Color Picker Toggle */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1 h-6 w-6 dropsource-toolbar-button"
                    title="Background & Opacity"
                  >
                    <Palette className="w-3 h-3" />
                  </Button>

                  {/* Enable/Disable (except for locked blocks) */}
                  {!block.locked && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleEnabled}
                      className="p-1 h-6 w-6 dropsource-toolbar-button"
                      title="Enable/Disable"
                    >
                      {block.enabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                  )}

                  {/* Remove Block (except for locked blocks) */}
                  {!block.locked && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onRemove}
                      className="p-1 h-6 w-6 dropsource-toolbar-button hover:bg-red-500/20 hover:text-red-400"
                      title="Remove Block"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Color Picker Panel */}
          {showColorPicker && editable && (
            <div 
              className="absolute z-50 w-64"
              style={{
                top: block.y < 200 ? '100%' : '-200px', // Position below if near top, above if near bottom
                left: block.x + 264 > window.innerWidth - 50 ? '-220px' : '0px', // Position left if would overflow right
                marginTop: block.y < 200 ? '8px' : '0px'
              }}
            >
              <div className="dropsource-card p-3 space-y-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {/* Background Type Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium">Type:</label>
                  <Select
                    value={block.backgroundType ?? 'solid'}
                    onValueChange={(value: BackgroundType) => updateBackgroundType(value)}
                  >
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Controls */}
                {block.backgroundType === 'gradient' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium w-12">Start:</label>
                      <input
                        type="color"
                        value={block.gradientColors?.[0] ?? '#0f1520'}
                        onChange={(e) => updateGradientColor(0, e.target.value)}
                        className="w-8 h-6 rounded border-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium w-12">End:</label>
                      <input
                        type="color"
                        value={block.gradientColors?.[1] ?? '#1a2531'}
                        onChange={(e) => updateGradientColor(1, e.target.value)}
                        className="w-8 h-6 rounded border-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium w-12">Angle:</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={block.gradientAngle ?? 135}
                        onChange={(e) => updateGradientAngle(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs w-8">{block.gradientAngle ?? 135}°</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium">Color:</label>
                    <input
                      type="color"
                      value={block.bg ?? '#0f1520'}
                      onChange={(e) => onChange({ bg: e.target.value })}
                      className="w-8 h-6 rounded border-0 cursor-pointer"
                    />
                  </div>
                )}

                {/* Opacity Slider */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Opacity</label>
                  <Slider
                    value={[block.opacity ?? 1]}
                    onValueChange={updateOpacity}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-center opacity-70">
                    {Math.round((block.opacity ?? 1) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Block Header */}
          <div className="flex items-center justify-between text-xs px-2 py-1 border-b border-gray-700/50 bg-black/20">
            <div className="opacity-80 capitalize flex items-center gap-2">
              {block.type === 'audioPlayer' && <Volume2 className="w-3 h-3" />}
              {block.type}
              {block.locked && (
                <span className="text-blue-400 bg-blue-500/20 px-1 rounded text-[10px]">
                  LOCKED
                </span>
              )}
              {block.pinned && (
                <Pin className="w-3 h-3 text-yellow-400" />
              )}
            </div>
            <div className="text-[10px] opacity-60">
              z:{block.zIndex ?? 1}
            </div>
          </div>

          {/* Block Content */}
          <div className="p-3 h-[calc(100%-28px)] overflow-auto">
            {children}
          </div>
        </div>
      </Rnd>
    </div>
  );
}