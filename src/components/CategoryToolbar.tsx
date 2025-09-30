import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
// Removed ProStickerSidebar import to use original sidebar
import { ProStickerModule } from '../modules/ProStickerModule.enhanced';
import { 
  Music2, 
  Pen, 
  Bot,
  Users,
  Sticker,
  Hash,
  Calculator,
  Timer,
  Mic,
  Highlighter,
  Type,
  Palette,
  Eraser,
  Circle,
  Minus,
  Coins,
  FolderOpen,
  Brush,
  Square,
  Triangle,
  Layers,
  Undo,
  Redo,
  Download,
  Settings,
  Sliders,
  Droplets,
  Zap,
  Sparkles,
  Target,
  Move,
  RotateCcw,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star
} from 'lucide-react';

export type CategoryType = 'music' | 'writing' | 'drawing' | 'ai' | 'collaboration' | 'stickers';
export type ToolType = 'rhyme-highlight' | 'rhyme' | 'syllable' | 'formatting' | 
  'metronome' | 'chord' | 'audio' | 'drawing-tools' | 'color-wheel' | 'pen' | 'eraser' | 
  'thickness' | 'ai-assist' | 'buddy' | 'minting' | 'brush-pencil' | 'brush-marker' | 'brush-texture' | 
  'brush-smudge' | 'brush-airbrush' | 'brush-watercolor' | 'brush-oil' | 'brush-charcoal' | 'brush-crayon' |
  'shape-rect' | 'shape-circle' | 'shape-triangle' | 'shape-polygon' | 'shape-line' | 'shape-arrow' |
  'layer-add' | 'layer-duplicate' | 'layer-merge' | 'layer-flatten' | 'layer-opacity' | 'layer-visibility' |
  'transform-move' | 'transform-rotate' | 'transform-scale' | 'transform-flip' | 'transform-skew' |
  'effect-blur' | 'effect-sharpen' | 'effect-glow' | 'effect-shadow' | 'effect-gradient' | 'effect-noise' |
  'color-picker' | 'color-fill' | 'color-gradient' | 'color-palette' | 'color-history' | 'color-swatches' |
  'tool-undo' | 'tool-redo' | 'tool-copy' | 'tool-paste' | 'tool-clear' | 'tool-select' | 'tool-crop' |
  'export-png' | 'export-jpg' | 'export-svg' | 'export-pdf' | 'settings-brush' | 'settings-canvas';

interface CategoryToolbarProps {
  onOpenFeature: (feature: string) => void;
  activeFeatures: Set<string>;
  onToggleRhymeHighlight?: () => void;
  onToggleDrawing?: () => void;
  isRhymeHighlightActive?: boolean;
  isDrawingActive?: boolean;
  isStickerMode?: boolean;
  onEnterStickerMode?: () => void;
  onExitStickerMode?: () => void;
  isBarVisible?: boolean;
  onToggleBarVisibility?: () => void;
}

const categories = [
  { id: 'music' as CategoryType, icon: Music2, label: 'Music' },
  { id: 'writing' as CategoryType, icon: Pen, label: 'Writing' },
  { id: 'drawing' as CategoryType, icon: Palette, label: 'Drawing' },
  { id: 'stickers' as CategoryType, icon: Sticker, label: 'Stickers' },
];

const categoryTools: Record<CategoryType, Array<{
  id: ToolType | string;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  isToggle?: boolean;
}>> = {
  music: [
    { id: 'metronome', icon: Timer, label: 'Metronome', description: 'Keep time and tap BPM' },
    { id: 'chord', icon: Music2, label: 'Chord Helper', description: 'Guitar & piano chords' },
    { id: 'audio', icon: Mic, label: 'Audio Notes', description: 'Record and upload audio' },
  ],
  writing: [
    { id: 'rhyme-highlight', icon: Highlighter, label: 'Highlight Rhymes', description: 'Highlight rhyming words inline', isToggle: true },
    { id: 'rhyme', icon: Hash, label: 'Rhyme Helper', description: 'Find rhymes and suggestions' },
    { id: 'syllable', icon: Calculator, label: 'Syllable Counter', description: 'Count syllables and words' },
    { id: 'formatting', icon: Type, label: 'Formatting', description: 'Text formatting options' },
  ],
  drawing: [
    // Brush Tools - Functional
    { id: 'brush-pencil', icon: Pen, label: 'Pencil', description: 'Smooth pencil brush' },
    { id: 'brush-marker', icon: Brush, label: 'Marker', description: 'Bold marker brush' },
    { id: 'brush-texture', icon: Sparkles, label: 'Texture', description: 'Textured brush' },
    { id: 'brush-smudge', icon: Zap, label: 'Smudge', description: 'Blend colors' },
    { id: 'brush-airbrush', icon: Droplets, label: 'Airbrush', description: 'Soft airbrush' },
    { id: 'brush-watercolor', icon: Droplets, label: 'Watercolor', description: 'Watercolor effect' },
    { id: 'brush-oil', icon: Palette, label: 'Oil Paint', description: 'Oil painting brush' },
    { id: 'brush-charcoal', icon: Minus, label: 'Charcoal', description: 'Charcoal drawing' },
    { id: 'brush-crayon', icon: Square, label: 'Crayon', description: 'Waxy crayon effect' },
    
    // Gradient Brushes
    { id: 'gradient-red-yellow', icon: Palette, label: 'Red→Yellow', description: 'Linear gradient brush' },
    { id: 'gradient-green-blue', icon: Palette, label: 'Green→Blue', description: 'Linear gradient brush' },
    { id: 'gradient-pink-cyan', icon: Palette, label: 'Pink→Cyan', description: 'Linear gradient brush' },
    
    // Particle Brushes
    { id: 'sparkle', icon: Sparkles, label: 'Sparkle', description: 'Sparkle particle brush' },
    { id: 'star', icon: Star, label: 'Star', description: 'Star particle brush' },
    { id: 'confetti', icon: Sparkles, label: 'Confetti', description: 'Confetti particle brush' },
    
    // Shape Tools
    { id: 'shape-rect', icon: Square, label: 'Rectangle', description: 'Draw rectangles' },
    { id: 'shape-circle', icon: Circle, label: 'Circle', description: 'Draw circles' },
    { id: 'shape-triangle', icon: Triangle, label: 'Triangle', description: 'Draw triangles' },
    { id: 'shape-polygon', icon: Target, label: 'Polygon', description: 'Draw polygons' },
    { id: 'shape-line', icon: Minus, label: 'Line', description: 'Draw straight lines' },
    { id: 'shape-arrow', icon: Target, label: 'Arrow', description: 'Draw arrows' },
    
    // Layer Tools
    { id: 'layer-add', icon: Layers, label: 'Add Layer', description: 'Add new layer' },
    { id: 'layer-duplicate', icon: Copy, label: 'Duplicate', description: 'Duplicate layer' },
    { id: 'layer-merge', icon: Layers, label: 'Merge', description: 'Merge layers' },
    { id: 'layer-flatten', icon: Layers, label: 'Flatten', description: 'Flatten all layers' },
    { id: 'layer-opacity', icon: Sliders, label: 'Opacity', description: 'Adjust layer opacity' },
    { id: 'layer-visibility', icon: Eye, label: 'Visibility', description: 'Toggle layer visibility' },
    
    // Transform Tools
    { id: 'transform-move', icon: Move, label: 'Move', description: 'Move objects' },
    { id: 'transform-rotate', icon: RotateCcw, label: 'Rotate', description: 'Rotate objects' },
    { id: 'transform-scale', icon: Square, label: 'Scale', description: 'Resize objects' },
    { id: 'transform-flip', icon: RotateCcw, label: 'Flip', description: 'Flip objects' },
    { id: 'transform-skew', icon: Square, label: 'Skew', description: 'Skew objects' },
    
    // Effect Tools
    { id: 'effect-blur', icon: Zap, label: 'Blur', description: 'Apply blur effect' },
    { id: 'effect-sharpen', icon: Zap, label: 'Sharpen', description: 'Sharpen details' },
    { id: 'effect-glow', icon: Sparkles, label: 'Glow', description: 'Add glow effect' },
    { id: 'effect-shadow', icon: Square, label: 'Shadow', description: 'Add drop shadow' },
    { id: 'effect-gradient', icon: Droplets, label: 'Gradient', description: 'Create gradients' },
    { id: 'effect-noise', icon: Sparkles, label: 'Noise', description: 'Add texture noise' },
    
    // Color Tools
    { id: 'color-picker', icon: Target, label: 'Color Picker', description: 'Pick colors from canvas' },
    { id: 'color-fill', icon: Droplets, label: 'Fill', description: 'Fill with color' },
    { id: 'color-gradient', icon: Droplets, label: 'Gradient', description: 'Create color gradients' },
    { id: 'color-palette', icon: Palette, label: 'Palette', description: 'Color palette' },
    { id: 'color-history', icon: RotateCcw, label: 'History', description: 'Color history' },
    { id: 'color-swatches', icon: Square, label: 'Swatches', description: 'Color swatches' },
    
    // Utility Tools
    { id: 'tool-undo', icon: Undo, label: 'Undo', description: 'Undo last action' },
    { id: 'tool-redo', icon: Redo, label: 'Redo', description: 'Redo last action' },
    { id: 'tool-copy', icon: Copy, label: 'Copy', description: 'Copy selection' },
    { id: 'tool-paste', icon: Copy, label: 'Paste', description: 'Paste clipboard' },
    { id: 'tool-clear', icon: Trash2, label: 'Clear', description: 'Clear canvas' },
    { id: 'tool-select', icon: Target, label: 'Select', description: 'Select objects' },
    { id: 'tool-crop', icon: Square, label: 'Crop', description: 'Crop canvas' },
    
    // Settings
    { id: 'settings-brush', icon: Settings, label: 'Brush Settings', description: 'Configure brush' },
    { id: 'settings-canvas', icon: Settings, label: 'Canvas Settings', description: 'Configure canvas' },
  ],

  stickers: [
    // Minting - Golden button at the top
    { id: 'minting', icon: Coins, label: 'Mint Sticker', description: 'Create collectible stickers' },
    
    // Brush Tools - Functional
    { id: 'brush-pencil', icon: Pen, label: 'Pencil', description: 'Smooth pencil brush' },
    { id: 'brush-marker', icon: Brush, label: 'Marker', description: 'Bold marker brush' },
    { id: 'brush-texture', icon: Sparkles, label: 'Texture', description: 'Textured brush' },
    { id: 'brush-smudge', icon: Zap, label: 'Smudge', description: 'Blend colors' },
    { id: 'brush-airbrush', icon: Droplets, label: 'Airbrush', description: 'Soft airbrush' },
    { id: 'brush-watercolor', icon: Droplets, label: 'Watercolor', description: 'Watercolor effect' },
    { id: 'brush-oil', icon: Palette, label: 'Oil Paint', description: 'Oil painting brush' },
    { id: 'brush-charcoal', icon: Minus, label: 'Charcoal', description: 'Charcoal drawing' },
    { id: 'brush-crayon', icon: Square, label: 'Crayon', description: 'Waxy crayon effect' },
    
    // Shape Tools - Functional
    { id: 'shape-rect', icon: Square, label: 'Rectangle', description: 'Draw rectangles' },
    { id: 'shape-circle', icon: Circle, label: 'Circle', description: 'Draw circles' },
    { id: 'shape-triangle', icon: Triangle, label: 'Triangle', description: 'Draw triangles' },
    { id: 'shape-polygon', icon: Target, label: 'Polygon', description: 'Draw polygons' },
    { id: 'shape-line', icon: Minus, label: 'Line', description: 'Draw straight lines' },
    { id: 'shape-arrow', icon: Target, label: 'Arrow', description: 'Draw arrows' },
    
    // Layer Tools - Functional
    { id: 'layer-add', icon: Layers, label: 'Add Layer', description: 'Add new layer' },
    { id: 'layer-duplicate', icon: Copy, label: 'Duplicate', description: 'Duplicate layer' },
    { id: 'layer-merge', icon: Layers, label: 'Merge', description: 'Merge layers' },
    { id: 'layer-flatten', icon: Layers, label: 'Flatten', description: 'Flatten all layers' },
    { id: 'layer-opacity', icon: Sliders, label: 'Opacity', description: 'Adjust layer opacity' },
    { id: 'layer-visibility', icon: Eye, label: 'Visibility', description: 'Toggle layer visibility' },
    
    // Transform Tools - Functional
    { id: 'transform-move', icon: Move, label: 'Move', description: 'Move objects' },
    { id: 'transform-rotate', icon: RotateCcw, label: 'Rotate', description: 'Rotate objects' },
    { id: 'transform-scale', icon: Square, label: 'Scale', description: 'Resize objects' },
    { id: 'transform-flip', icon: RotateCcw, label: 'Flip', description: 'Flip objects' },
    { id: 'transform-skew', icon: Square, label: 'Skew', description: 'Skew objects' },
    
    // Effect Tools - Functional
    { id: 'effect-blur', icon: Zap, label: 'Blur', description: 'Apply blur effect' },
    { id: 'effect-sharpen', icon: Zap, label: 'Sharpen', description: 'Sharpen details' },
    { id: 'effect-glow', icon: Sparkles, label: 'Glow', description: 'Add glow effect' },
    { id: 'effect-shadow', icon: Square, label: 'Shadow', description: 'Add drop shadow' },
    { id: 'effect-gradient', icon: Droplets, label: 'Gradient', description: 'Create gradients' },
    { id: 'effect-noise', icon: Sparkles, label: 'Noise', description: 'Add texture noise' },
    
    // Color Tools - Functional
    { id: 'color-picker', icon: Target, label: 'Color Picker', description: 'Pick colors from canvas' },
    { id: 'color-fill', icon: Droplets, label: 'Fill', description: 'Fill with color' },
    { id: 'color-gradient', icon: Droplets, label: 'Gradient', description: 'Create color gradients' },
    { id: 'color-palette', icon: Palette, label: 'Palette', description: 'Color palette' },
    { id: 'color-history', icon: RotateCcw, label: 'History', description: 'Color history' },
    { id: 'color-swatches', icon: Square, label: 'Swatches', description: 'Color swatches' },
    
    // Utility Tools - Functional
    { id: 'tool-undo', icon: Undo, label: 'Undo', description: 'Undo last action' },
    { id: 'tool-redo', icon: Redo, label: 'Redo', description: 'Redo last action' },
    { id: 'tool-copy', icon: Copy, label: 'Copy', description: 'Copy selection' },
    { id: 'tool-paste', icon: Copy, label: 'Paste', description: 'Paste clipboard' },
    { id: 'tool-clear', icon: Trash2, label: 'Clear', description: 'Clear canvas' },
    { id: 'tool-select', icon: Target, label: 'Select', description: 'Select objects' },
    { id: 'tool-crop', icon: Square, label: 'Crop', description: 'Crop canvas' },
    
    // Settings - Functional
    { id: 'settings-brush', icon: Settings, label: 'Brush Settings', description: 'Configure brush' },
    { id: 'settings-canvas', icon: Settings, label: 'Canvas Settings', description: 'Configure canvas' },
  ],
};

export function CategoryToolbar({ 
  onOpenFeature, 
  activeFeatures, 
  onToggleRhymeHighlight,
  onToggleDrawing,
  isRhymeHighlightActive = false,
  isDrawingActive = false,
  isStickerMode = false,
  onEnterStickerMode,
  onExitStickerMode,
  isBarVisible = true,
  onToggleBarVisibility
}: CategoryToolbarProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1.0);
  const [layerOpacity, setLayerOpacity] = useState(1.0);
  const [currentBrushType, setCurrentBrushType] = useState<string>('gradient-red-yellow');
  const [panelPosition, setPanelPosition] = useState({ x: 320, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleCategoryClick = (categoryId: CategoryType) => {
    if (categoryId === 'stickers' && !isStickerMode) {
      onEnterStickerMode?.();
      setSelectedCategory(categoryId);
    } else if (selectedCategory === categoryId) {
      if (categoryId === 'stickers' && isStickerMode) {
        onExitStickerMode?.();
      }
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleToolClick = async (tool: typeof categoryTools.music[0]) => {
    // Set active tool for visual feedback
    setActiveTool(tool.id);
    
    if (tool.id === 'rhyme-highlight' && onToggleRhymeHighlight) {
      onToggleRhymeHighlight();
    } else if (tool.id === 'minting') {
      // Open minting menu directly
      onOpenFeature('minting');
    } else if (isStickerMode) {
      // In sticker mode, use ProStickerModule with centralized selectTool
      try {
        // Dynamic import - NO initialization here, that's handled by App.tsx
        const mod = await import('../modules/ProStickerModule.enhanced');
        const moduleApi = mod.ProStickerModule || mod.default || mod;
        console.log('[CategoryToolbar] Module imported:', moduleApi);
        console.log('[CategoryToolbar] selectTool function available:', typeof moduleApi.selectTool);
        
        // call selectTool if present, else fall back to toolActions
        let toolId = tool.id; // ensure this matches the module IDs
        
        // Map tool IDs to what ProStickerModule expects
        const toolIdMap: Record<string, string> = {
          // Brush tools
          'brush-pencil': 'pencil',
          'brush-marker': 'marker',
          'brush-texture': 'texture',
          'brush-smudge': 'smudge',
          'brush-airbrush': 'airbrush',
          'brush-watercolor': 'watercolor',
          'brush-oil': 'oil',
          'brush-charcoal': 'crayon',
          'brush-crayon': 'crayon',
          
          // Shape tools
          'shape-rect': 'rectangle',
          'shape-circle': 'circle',
          'shape-triangle': 'triangle',
          'shape-polygon': 'polygon',
          'shape-line': 'line',
          'shape-arrow': 'arrow',
          
          // Effect tools
          'effect-blur': 'blur',
          'effect-sharpen': 'sharpen',
          'effect-glow': 'glow',
          'effect-shadow': 'shadow',
          'effect-noise': 'noise',
          
          // Utility tools
          'tool-undo': 'undo',
          'tool-redo': 'redo',
          'tool-copy': 'copy',
          'tool-paste': 'paste',
          'tool-clear': 'clear',
          'tool-select': 'select',
          'tool-crop': 'crop',
          
          // Color tools
          'color-picker': 'colorpicker',
          'color-fill': 'fill',
          
          // Transform tools
          'transform-move': 'move',
          'transform-rotate': 'rotate',
          'transform-scale': 'scale',
          'transform-flip': 'flip'
        };
        
        toolId = toolIdMap[toolId] || toolId;
        console.log('[CategoryToolbar] Original tool ID:', tool.id, 'Mapped to:', toolId);
        
        if (typeof moduleApi.selectTool === 'function') {
          // Handle color picker specially
          if (toolId === 'colorpicker') {
            openColorPicker(moduleApi);
            return;
          }
          
          moduleApi.selectTool(toolId);
          // Set activeTool to the original tool.id for proper button highlighting
          setActiveTool(tool.id);
          setCurrentBrushType(toolId);
          showToolFeedback(`Applied: ${tool.label}`);
        } else if (moduleApi.toolActions && typeof moduleApi.toolActions[toolId] === 'function') {
          moduleApi.toolActions[toolId]();
          setActiveTool(tool.id);
          setCurrentBrushType(toolId);
          showToolFeedback(`Applied: ${tool.label}`);
        } else {
          console.warn('[CategoryToolbar] no tool handler for', toolId);
          // Fallback to original behavior
          handleOriginalToolBehavior(tool);
        }
        
        // debug
        if (typeof moduleApi.debugStatus === 'function') moduleApi.debugStatus();
      } catch (error) {
        console.error('Tool action failed:', error);
        showToolFeedback(`Error: ${tool.label}`);
      }
    } else {
      // Original behavior when not in sticker mode
      handleOriginalToolBehavior(tool);
    }
  };

  const handleOriginalToolBehavior = async (tool: typeof categoryTools.music[0]) => {
    // Try to use ProStickerModule if available, even when not in sticker mode
    try {
      const padContainer = document.querySelector('.pad-container') as HTMLElement;
      if (padContainer) {
        const mod = await import('../modules/ProStickerModule.enhanced');
        const moduleApi = mod.ProStickerModule || mod.default || mod;
        
        if (typeof moduleApi.selectTool === 'function') {
          let toolId = tool.id;
          
          // Map brush- prefixed tools to their actual IDs
          if (toolId.startsWith('brush-')) {
            toolId = toolId.replace('brush-', '');
          }
          
          // Map shape- prefixed tools to their actual IDs
          if (toolId.startsWith('shape-')) {
            toolId = toolId.replace('shape-', '');
          }
          
          // Map layer- prefixed tools to their actual IDs
          if (toolId.startsWith('layer-')) {
            toolId = toolId.replace('layer-', '');
            if (toolId === 'add') toolId = 'addLayer';
            if (toolId === 'visibility') toolId = 'toggleVisibility';
            if (toolId === 'opacity') toolId = 'setOpacity';
          }
          
          // Map transform- prefixed tools to their actual IDs
          if (toolId.startsWith('transform-')) {
            toolId = toolId.replace('transform-', '');
            if (toolId === 'rotate-cw') toolId = 'rotateCW';
            if (toolId === 'rotate-ccw') toolId = 'rotateCCW';
            if (toolId === 'flip-x') toolId = 'flipX';
            if (toolId === 'flip-y') toolId = 'flipY';
          }
          
          // Map effect- prefixed tools to their actual IDs
          if (toolId.startsWith('effect-')) {
            toolId = toolId.replace('effect-', '');
          }
          
          moduleApi.selectTool(toolId);
          setActiveTool(tool.id);
          setCurrentBrushType(toolId);
          showToolFeedback(`Applied: ${tool.label}`);
          return;
        }
      }
    } catch (error) {
      console.warn('ProStickerModule not available, using fallback behavior');
    }
    
    // Fallback behavior for when ProStickerModule is not available
    if (tool.id.startsWith('brush-')) {
      // Brush tools - show brush controls panel
      const brushType = tool.id.replace('brush-', '');
      console.log(`Switched to ${brushType} brush`);
      
      // Enable drawing mode when selecting a brush
      if (onToggleDrawing) {
        onToggleDrawing();
      }
      
      // Set brush type in global state
      (window as any).currentBrushType = brushType;
      
      // Show brush controls panel
      setShowToolPanel(true);
      
      // Apply brush settings
      applyBrushSettings(brushType);
      
    } else if (tool.id.startsWith('shape-')) {
      // Shape tools - show shape controls panel
      const shapeType = tool.id.replace('shape-', '');
      console.log(`Drawing ${shapeType} shape`);
      
      // Enable drawing mode for shapes
      if (onToggleDrawing) {
        onToggleDrawing();
      }
      
      // Set shape type in global state
      (window as any).currentShapeType = shapeType;
      
      // Show shape controls panel
      setShowToolPanel(true);
      
      // Enable shape mode
      enableShapeMode(shapeType);
      
    } else if (tool.id.startsWith('layer-')) {
      // Layer tools - show layer controls panel
      const layerAction = tool.id.replace('layer-', '');
      console.log(`Layer action: ${layerAction}`);
      
      // Show layer controls panel
      setShowToolPanel(true);
      
      // Perform immediate actions
      if (layerAction === 'add') {
        addNewLayer();
      } else if (layerAction === 'duplicate') {
        duplicateLayer();
      } else if (layerAction === 'merge') {
        mergeLayers();
      } else if (layerAction === 'flatten') {
        flattenLayers();
      } else if (layerAction === 'visibility') {
        toggleLayerVisibility();
      }
      
    } else if (tool.id.startsWith('transform-')) {
      // Transform tools - show transform controls panel
      const transformType = tool.id.replace('transform-', '');
      console.log(`Transform mode: ${transformType}`);
      
      // Set transform mode
      (window as any).currentTransformMode = transformType;
      
      // Show transform controls panel
      setShowToolPanel(true);
      
      // Enable transform mode
      enableTransformMode(transformType);
      
    } else if (tool.id.startsWith('effect-')) {
      // Effect tools - show effect controls panel
      const effectType = tool.id.replace('effect-', '');
      console.log(`Applying ${effectType} effect`);
      
      // Show effect controls panel
      setShowToolPanel(true);
      
      // Apply immediate effects
      if (effectType === 'blur') {
        applyBlurEffect();
      } else if (effectType === 'sharpen') {
        applySharpenEffect();
      } else if (effectType === 'glow') {
        applyGlowEffect();
      } else if (effectType === 'shadow') {
        applyShadowEffect();
      } else if (effectType === 'gradient') {
        applyGradientEffect();
      } else if (effectType === 'noise') {
        applyNoiseEffect();
      }
      
    } else if (tool.id.startsWith('color-')) {
      // Color tools - show color controls panel
      const colorAction = tool.id.replace('color-', '');
      console.log(`Color action: ${colorAction}`);
      
      // Show color controls panel
      setShowToolPanel(true);
      
      // Perform immediate actions
      if (colorAction === 'picker') {
        // Color picker will be handled by the new openColorPicker function
        console.log('Color picker selected');
      } else if (colorAction === 'fill') {
        fillSelection();
      } else if (colorAction === 'gradient') {
        createGradient();
      } else if (colorAction === 'palette') {
        openColorPalette();
      } else if (colorAction === 'history') {
        showColorHistory();
      } else if (colorAction === 'swatches') {
        openColorSwatches();
      }
      
    } else if (tool.id.startsWith('tool-')) {
      // Utility tools - perform immediate actions
      const toolAction = tool.id.replace('tool-', '');
      console.log(`Tool action: ${toolAction}`);
      
      if (toolAction === 'undo') {
        // Call undo function
        if ((window as any).undoDrawing) {
          (window as any).undoDrawing();
          showToolFeedback('Undid last action');
        }
      } else if (toolAction === 'redo') {
        // Call redo function
        if ((window as any).redoDrawing) {
          (window as any).redoDrawing();
          showToolFeedback('Redid last action');
        }
      } else if (toolAction === 'clear') {
        // Call clear function
        if ((window as any).clearDrawing) {
          (window as any).clearDrawing();
          showToolFeedback('Cleared canvas');
        }
      } else if (toolAction === 'copy') {
        copySelection();
      } else if (toolAction === 'paste') {
        pasteFromClipboard();
      } else if (toolAction === 'select') {
        enableSelectionMode();
      } else if (toolAction === 'crop') {
        enableCropMode();
      }
      
    } else if (tool.id.startsWith('settings-')) {
      // Settings tools - show settings panel
      const settingsType = tool.id.replace('settings-', '');
      console.log(`Opening ${settingsType} settings`);
      
      // Show settings panel
      setShowToolPanel(true);
      
    } else {
      // Default behavior for other tools
      console.log(`Tool clicked: ${tool.label}`);
      showToolFeedback(`Tool: ${tool.label}`);
    }
  };

  // Drag functionality for tool panel
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanelPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Apply brush settings to canvas with current values
  const applyBrushSettings = (brushType: string) => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set brush properties based on type and current settings
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.globalAlpha = brushOpacity;
        
        switch (brushType) {
          case 'pencil':
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
          case 'marker':
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';
            break;
          case 'airbrush':
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
          default:
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
        
        // Store settings globally for drawing functions
        (window as any).brushSettings = {
          color: currentColor,
          size: brushSize,
          opacity: brushOpacity,
          type: brushType
        };
      }
    }
  };

  // Update brush settings when controls change
  const updateBrushSettings = () => {
    if (activeTool && activeTool.startsWith('brush-')) {
      const brushType = activeTool.replace('brush-', '');
      applyBrushSettings(brushType);
    }
  };

  const enableShapeMode = (shapeType: string) => {
    // Enable shape drawing mode
    (window as any).drawingMode = 'shape';
    (window as any).currentShape = shapeType;
  };

  const addNewLayer = () => {
    // Add new drawing layer
    console.log('Creating new drawing layer');
  };

  const duplicateLayer = () => {
    // Duplicate current layer
    console.log('Duplicating current layer');
  };

  const mergeLayers = () => {
    // Merge all layers
    console.log('Merging all layers');
  };

  const flattenLayers = () => {
    // Flatten all layers
    console.log('Flattening all layers');
  };

  const adjustLayerOpacity = () => {
    // Adjust layer opacity
    console.log('Adjusting layer opacity');
  };

  const toggleLayerVisibility = () => {
    // Toggle layer visibility
    console.log('Toggling layer visibility');
  };

  const enableTransformMode = (transformType: string) => {
    // Enable transform mode
    (window as any).transformMode = transformType;
  };

  const applyBlurEffect = () => {
    // Apply blur effect to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = 'blur(2px)';
      setTimeout(() => canvas.style.filter = '', 1000);
    }
  };

  const applySharpenEffect = () => {
    // Apply sharpen effect to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = 'contrast(1.5) brightness(1.1)';
      setTimeout(() => canvas.style.filter = '', 1000);
    }
  };

  const applyGlowEffect = () => {
    // Apply glow effect to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))';
      setTimeout(() => canvas.style.filter = '', 1000);
    }
  };

  const applyShadowEffect = () => {
    // Apply shadow effect to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))';
      setTimeout(() => canvas.style.filter = '', 1000);
    }
  };

  const applyGradientEffect = () => {
    // Apply gradient effect to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = 'hue-rotate(90deg) saturate(1.5)';
      setTimeout(() => canvas.style.filter = '', 1000);
    }
  };

  const applyNoiseEffect = () => {
    // Apply noise effect to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.filter = 'contrast(1.2) brightness(0.9)';
      setTimeout(() => canvas.style.filter = '', 1000);
    }
  };


  const fillSelection = () => {
    // Fill selection with color
    console.log('Filling selection with current color');
  };

  const createGradient = () => {
    // Create color gradient
    console.log('Creating color gradient');
  };

  const openColorPalette = () => {
    // Open color palette
    console.log('Opening color palette');
  };

  const showColorHistory = () => {
    // Show color history
    console.log('Showing color history');
  };

  const openColorSwatches = () => {
    // Open color swatches
    console.log('Opening color swatches');
  };

  const copySelection = () => {
    // Copy selection to clipboard
    console.log('Copying selection to clipboard');
  };

  const pasteFromClipboard = () => {
    // Paste from clipboard
    console.log('Pasting from clipboard');
  };

  const enableSelectionMode = () => {
    // Enable selection mode
    (window as any).selectionMode = true;
  };

  const enableCropMode = () => {
    // Enable crop mode
    (window as any).cropMode = true;
  };

  const openBrushSettings = () => {
    // Open brush settings panel
    console.log('Opening brush settings panel');
  };

  const openCanvasSettings = () => {
    // Open canvas settings panel
    console.log('Opening canvas settings panel');
  };

  // Function to show visual feedback
  const showToolFeedback = (message: string) => {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      pointer-events: none;
      animation: fadeInOut 2s ease-in-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#tool-feedback-styles')) {
      const style = document.createElement('style');
      style.id = 'tool-feedback-styles';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  };

  const getToolPreview = (toolId: string) => {
    if (toolId.startsWith('gradient-')) {
      const gradientMap: Record<string, { start: string; end: string }> = {
        'gradient-red-yellow': { start: '#FF6B35', end: '#FFD700' },
        'gradient-green-blue': { start: '#00B4DB', end: '#4ECDC4' },
        'gradient-pink-cyan': { start: '#FF69B4', end: '#00CED1' }
      };
      const gradient = gradientMap[toolId];
      if (gradient) {
        return (
          <div 
            className="gradient-preview"
            style={{
              '--gradient-start': gradient.start,
              '--gradient-end': gradient.end
            } as React.CSSProperties}
          />
        );
      }
    }
    
    if (['sparkle', 'star', 'confetti'].includes(toolId)) {
      return <div className="particle-preview" />;
    }
    
    return null;
  };

  const openColorPicker = async (moduleApi: any) => {
    try {
      // Create color picker input
      const input = document.createElement('input');
      input.type = 'color';
      input.value = currentColor;
      
      input.onchange = (e) => {
        const color = (e.target as HTMLInputElement).value;
        setCurrentColor(color);
        if (typeof moduleApi.setColor === 'function') {
          moduleApi.setColor(color);
        }
        showToolFeedback(`Color set to ${color}`);
      };
      
      input.click();
    } catch (error) {
      console.error('Color picker failed:', error);
    }
  };

  const currentTools = selectedCategory ? categoryTools[selectedCategory] : [];

  // Tool Panel Component
  const renderToolPanel = () => {
    if (!showToolPanel || !activeTool) return null;

    const getToolType = (toolId: string) => {
      if (toolId.startsWith('brush-')) return 'brush';
      if (toolId.startsWith('shape-')) return 'shape';
      if (toolId.startsWith('layer-')) return 'layer';
      if (toolId.startsWith('transform-')) return 'transform';
      if (toolId.startsWith('effect-')) return 'effect';
      if (toolId.startsWith('color-')) return 'color';
      if (toolId.startsWith('settings-')) return 'settings';
      return 'default';
    };

    const toolType = getToolType(activeTool);

    return (
      <div 
        className="fixed w-64 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-lg p-4 z-50 cursor-move"
        style={{
          left: `${panelPosition.x}px`,
          top: `${panelPosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium select-none">
            {activeTool.replace(/^(brush-|shape-|layer-|transform-|effect-|color-|settings-)/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <button
            onClick={() => setShowToolPanel(false)}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {toolType === 'brush' && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={async (e) => {
                    setCurrentColor(e.target.value);
                    // Update ProStickerModule brush settings
                    if (isStickerMode) {
                      try {
                        const mod = await import('../modules/ProStickerModule.enhanced');
                        const moduleApi = (mod && mod.ProStickerModule) ? mod.ProStickerModule : (mod && mod.default) ? mod.default : mod;
                        if (typeof moduleApi.setBrush === 'function') {
                          moduleApi.setBrush(e.target.value, brushSize, brushOpacity);
                        }
                      } catch (error) {
                        console.error('Failed to update brush color:', error);
                      }
                    } else {
                      updateBrushSettings();
                    }
                  }}
                  className="w-8 h-8 rounded border border-gray-600"
                />
                <span className="text-white text-sm">{currentColor}</span>
              </div>
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Brush Size: {brushSize}px</label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={async (e) => {
                  setBrushSize(Number(e.target.value));
                  // Update ProStickerModule brush settings
                  if (isStickerMode) {
                    try {
                      const mod = await import('../modules/ProStickerModule.enhanced');
                      const moduleApi = (mod && mod.ProStickerModule) ? mod.ProStickerModule : (mod && mod.default) ? mod.default : mod;
                      if (typeof moduleApi.setBrushWidth === 'function') {
                        moduleApi.setBrushWidth(Number(e.target.value));
                      }
                    } catch (error) {
                      console.error('Failed to update brush size:', error);
                    }
                  } else {
                    updateBrushSettings();
                  }
                }}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Opacity: {Math.round(brushOpacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={brushOpacity}
                onChange={async (e) => {
                  setBrushOpacity(Number(e.target.value));
                  // Update ProStickerModule brush settings
                  if (isStickerMode) {
                    try {
                      const mod = await import('../modules/ProStickerModule.enhanced');
                      const moduleApi = (mod && mod.ProStickerModule) ? mod.ProStickerModule : (mod && mod.default) ? mod.default : mod;
                      if (typeof moduleApi.setBrushOpacity === 'function') {
                        moduleApi.setBrushOpacity(Number(e.target.value));
                      }
                    } catch (error) {
                      console.error('Failed to update brush opacity:', error);
                    }
                  } else {
                    updateBrushSettings();
                  }
                }}
                className="w-full"
              />
            </div>
            
            <div className="pt-2">
              <div 
                className="w-full h-8 rounded border border-gray-600 flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: currentColor, opacity: brushOpacity }}
              >
                Preview: {activeTool.replace('brush-', '')} brush
              </div>
            </div>
          </div>
        )}

        {toolType === 'shape' && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    setCurrentColor(e.target.value);
                    // Store shape settings globally
                    (window as any).shapeSettings = {
                      fillColor: e.target.value,
                      strokeWidth: brushSize,
                      fillOpacity: brushOpacity,
                      type: activeTool.replace('shape-', '')
                    };
                  }}
                  className="w-8 h-8 rounded border border-gray-600"
                />
                <span className="text-white text-sm">{currentColor}</span>
              </div>
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Stroke Width: {brushSize}px</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => {
                  setBrushSize(Number(e.target.value));
                  // Update shape settings
                  if ((window as any).shapeSettings) {
                    (window as any).shapeSettings.strokeWidth = Number(e.target.value);
                  }
                }}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Fill Opacity: {Math.round(brushOpacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={brushOpacity}
                onChange={(e) => {
                  setBrushOpacity(Number(e.target.value));
                  // Update shape settings
                  if ((window as any).shapeSettings) {
                    (window as any).shapeSettings.fillOpacity = Number(e.target.value);
                  }
                }}
                className="w-full"
              />
            </div>
            
            <div className="pt-2">
              <div 
                className="w-full h-8 rounded border border-gray-600 flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: currentColor, opacity: brushOpacity }}
              >
                Shape: {activeTool.replace('shape-', '')}
              </div>
            </div>
          </div>
        )}

        {toolType === 'layer' && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Layer Opacity: {Math.round(layerOpacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                Add New Layer
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm">
                Duplicate Layer
              </button>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm">
                Merge Layers
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm">
                Flatten All
              </button>
            </div>
          </div>
        )}

        {toolType === 'effect' && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Effect Intensity: {brushSize}%</label>
              <input
                type="range"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Effect Opacity: {Math.round(brushOpacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="pt-2">
              <div className="w-full h-8 rounded border border-gray-600 flex items-center justify-center text-white text-sm">
                Effect: {activeTool.replace('effect-', '')}
              </div>
            </div>
          </div>
        )}

        {toolType === 'color' && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={async (e) => {
                    setCurrentColor(e.target.value);
                    // Update ProStickerModule brush settings
                    if (isStickerMode) {
                      try {
                        const mod = await import('../modules/ProStickerModule.enhanced');
                        const moduleApi = (mod && mod.ProStickerModule) ? mod.ProStickerModule : (mod && mod.default) ? mod.default : mod;
                        if (typeof moduleApi.setBrush === 'function') {
                          moduleApi.setBrush(e.target.value, brushSize, brushOpacity);
                        }
                      } catch (error) {
                        console.error('Failed to update color:', error);
                      }
                    } else {
                      // Update global color for all tools
                      (window as any).currentColor = e.target.value;
                      updateBrushSettings();
                    }
                  }}
                  className="w-8 h-8 rounded border border-gray-600"
                />
                <span className="text-white text-sm">{currentColor}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#000000'].map(color => (
                <button
                  key={color}
                  onClick={async () => {
                    setCurrentColor(color);
                    // Update ProStickerModule brush settings
                    if (isStickerMode) {
                      try {
                        const mod = await import('../modules/ProStickerModule.enhanced');
                        const moduleApi = (mod && mod.ProStickerModule) ? mod.ProStickerModule : (mod && mod.default) ? mod.default : mod;
                        if (typeof moduleApi.setBrush === 'function') {
                          moduleApi.setBrush(color, brushSize, brushOpacity);
                        }
                      } catch (error) {
                        console.error('Failed to update color:', error);
                      }
                    } else {
                      (window as any).currentColor = color;
                      updateBrushSettings();
                    }
                  }}
                  className="w-8 h-8 rounded border border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <div className="pt-2">
              <div 
                className="w-full h-8 rounded border border-gray-600 flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: currentColor }}
              >
                Color: {activeTool.replace('color-', '')}
              </div>
            </div>
          </div>
        )}

        {toolType === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Canvas Quality</label>
              <select className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2">
                <option>High (2x)</option>
                <option>Medium (1.5x)</option>
                <option>Low (1x)</option>
              </select>
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Grid Size</label>
              <input
                type="range"
                min="5"
                max="50"
                value="20"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-white text-sm">
                <input type="checkbox" className="mr-2" />
                Show Grid
              </label>
              <label className="flex items-center text-white text-sm">
                <input type="checkbox" className="mr-2" />
                Snap to Grid
              </label>
              <label className="flex items-center text-white text-sm">
                <input type="checkbox" className="mr-2" />
                Show Rulers
              </label>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Show restore handle when bar is hidden
  if (!isBarVisible) {
    return (
      <TooltipProvider>
        <div 
          className="fixed z-30 cursor-pointer"
          style={{
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={onToggleBarVisibility}
        >
          <div className="w-1 h-24 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60 hover:opacity-100 transition-opacity rounded-l" />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      {/* Tool Panel */}
      {renderToolPanel()}
      
      {/* Golden border around pad content when in sticker mode */}
      {/* Gold border now handled by ProStickerModule.enhanced.ts */}



      <div 
        className="fixed z-30 transition-all duration-300"
        style={{
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {/* Main Toolbar with AI and Collab integrated */}
        <div 
          className={`dropsource-toolbar-enhanced flex flex-col transition-all duration-300 ${
            isStickerMode ? 'border-2 border-yellow-400 shadow-lg shadow-yellow-400/20' : ''
          }`}
          style={{
            gap: 'calc(var(--spacing-unit) * 0.75)',
            width: selectedCategory ? '80px' : '64px',
            padding: 'calc(var(--spacing-unit) * 1.5)',
            maxHeight: '80vh',
            overflow: 'hidden'
          }}
        >
          {/* Hide Bar Button */}
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={onToggleBarVisibility}
              className="dropsource-toolbar-button p-1"
              style={{ 
                width: '24px', 
                height: '8px',
                borderRadius: '4px',
                padding: '0'
              }}
            >
              <div className="w-3 h-1 rounded-full bg-current mx-auto"></div>
            </button>
          </div>

          {/* Categories or Tools */}
          <div className="flex flex-col gap-2 overflow-y-auto dropsource-custom-scrollbar">
            {!selectedCategory ? (
              // Show categories + AI/Collab buttons
              <>
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = category.id === 'stickers' && isStickerMode;
                  
                  return (
                    <Tooltip key={category.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCategoryClick(category.id)}
                          className={`dropsource-toolbar-button ${isActive ? 'active' : ''}`}
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
                          <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>{category.label}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                
                {/* Divider */}
                <div className="w-full h-px bg-gray-600 my-2 opacity-30"></div>
                
                {/* AI Assist Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onOpenFeature('ai')}
                      className={`dropsource-toolbar-button ${activeFeatures.has('ai') ? 'active' : ''}`}
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
                      <Bot className="w-5 h-5 dropsource-icon-outlined" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="dropsource-card">
                    <div>
                      <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>AI Assist</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Collaborate Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onOpenFeature('buddy')}
                      className={`dropsource-toolbar-button ${activeFeatures.has('buddy') ? 'active' : ''}`}
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
                      <Users className="w-5 h-5 dropsource-icon-outlined" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="dropsource-card">
                    <div>
                      <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>Collaborate</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Sticker Minting Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onOpenFeature('minting')}
                      className={`dropsource-toolbar-button ${activeFeatures.has('minting') ? 'active' : ''}`}
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
                      <Coins className="w-5 h-5 dropsource-icon-outlined" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="dropsource-card">
                    <div>
                      <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>Mint Sticker</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Projects Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onOpenFeature('projects')}
                      className={`dropsource-toolbar-button ${activeFeatures.has('projects') ? 'active' : ''}`}
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
                      <FolderOpen className="w-5 h-5 dropsource-icon-outlined" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="dropsource-card">
                    <div>
                      <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>Projects</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              // Show tools for selected category
              <>
                {/* Back button */}
                <button
                  onClick={() => {
                    if (selectedCategory === 'stickers' && isStickerMode) {
                      onExitStickerMode?.();
                    }
                    setSelectedCategory(null);
                  }}
                  className="dropsource-toolbar-button mb-2"
                  style={{
                    width: '48px',
                    height: '32px',
                    padding: '0',
                    borderRadius: '8px',
                    fontSize: 'var(--text-xs)'
                  }}
                >
                  ←
                </button>

                {/* Tools for selected category */}
                {currentTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = tool.isToggle 
                    ? (tool.id === 'rhyme-highlight' ? isRhymeHighlightActive : 
                       tool.id === 'drawing-tools' ? isDrawingActive : false)
                    : activeFeatures.has(tool.id);

                  // Check if this tool is the currently active tool
                  const isCurrentlyActive = activeTool === tool.id;

                  // Special styling for minting button
                  const isMintingButton = tool.id === 'minting';
                  const buttonStyle = isMintingButton ? {
                    width: '48px',
                    height: '48px',
                    padding: '0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.2)',
                    animation: 'golden-pulse 2s ease-in-out infinite'
                  } : {
                    width: '48px',
                    height: '48px',
                    padding: '0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCurrentlyActive ? '#4A5568' : 'transparent', // Darker grey for active tool
                    border: isCurrentlyActive ? '2px solid #718096' : '2px solid transparent'
                  };

                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleToolClick(tool)}
                          className={`dropsource-toolbar-button ${isActive ? 'active dropsource-pulse-border' : ''} ${isCurrentlyActive ? 'tool-active' : ''}`}
                          style={buttonStyle}
                        >
                          <div className="flex items-center justify-center w-full h-full">
                            {getToolPreview(tool.id)}
                            <Icon className={`w-5 h-5 ${isMintingButton ? 'text-white' : 'dropsource-icon-outlined'}`} />
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="dropsource-card">
                        <div>
                          <p className="font-medium" style={{ fontSize: 'var(--text-sm)' }}>{tool.label}</p>
                          <p className="text-xs opacity-75">{tool.description}</p>
                          {isCurrentlyActive && (
                            <p className="text-xs text-green-400 mt-1">✓ Active</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Removed duplicate sidebar - keeping original sidebar only */}
      </div>
    </TooltipProvider>
  );
}