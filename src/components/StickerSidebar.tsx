import React, { useState, useEffect } from 'react';
import { 
  Brush, 
  Eraser, 
  Square, 
  Circle, 
  Triangle, 
  Undo, 
  Redo, 
  Trash2, 
  Palette,
  Layers,
  Download,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface StickerSidebarProps {
  isActive: boolean;
  onExport?: (imageData: string) => void;
}

const BRUSH_PRESETS = [
  { name: 'Smooth', value: 'smooth', icon: '🖌️' },
  { name: 'Rough', value: 'rough', icon: '🖍️' },
  { name: 'Spray', value: 'spray', icon: '💨' }
];

const COLOR_PRESETS = [
  '#FFB039', '#FF6BAA', '#5AF5D0', '#A78BFA', '#FF4757',
  '#2ED573', '#FFA502', '#3742FA', '#FF3838', '#2F3542',
  '#FFFFFF', '#000000', '#FFD700', '#FF69B4', '#00CED1'
];

export function StickerSidebar({ isActive, onExport }: StickerSidebarProps) {
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushColor, setBrushColor] = useState('#FFB039');
  const [brushTexture, setBrushTexture] = useState<'smooth' | 'rough' | 'spray'>('smooth');
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'Background', visible: true, locked: false },
    { id: 'layer-2', name: 'Main', visible: true, locked: false },
    { id: 'layer-3', name: 'Details', visible: true, locked: false }
  ]);

  // Update StickerModule when settings change
  useEffect(() => {
    if (!isActive || !(window as any).stickerModule) return;

    const module = (window as any).stickerModule;
    module.setBrushSize(brushSize);
    module.setBrushOpacity(brushOpacity);
    module.setBrushColor(brushColor);
    module.setBrushTexture(brushTexture);
    
    // Guard: only set drawing mode if ProStickerModule doesn't have a current tool
    if (!(window as any).ProStickerModule?._currentTool) {
      module.setDrawingMode(isDrawingMode);
    }
  }, [brushSize, brushOpacity, brushColor, brushTexture, isDrawingMode, isActive]);

  // Load layers from StickerModule
  useEffect(() => {
    if (isActive && (window as any).stickerModule) {
      const module = (window as any).stickerModule;
      setLayers(module.getLayers());
    }
  }, [isActive]);

  const handleBrushSizeChange = (value: number[]) => {
    setBrushSize(value[0]);
  };

  const handleOpacityChange = (value: number[]) => {
    setBrushOpacity(value[0]);
  };

  const handleColorChange = (color: string) => {
    setBrushColor(color);
  };

  const handleTextureChange = (texture: 'smooth' | 'rough' | 'spray') => {
    setBrushTexture(texture);
    setIsDrawingMode(true);
  };

  const handleShapeTool = (shape: 'rectangle' | 'circle' | 'polygon') => {
    if (!(window as any).stickerModule) return;
    
    const module = (window as any).stickerModule;
    setIsDrawingMode(false);
    
    switch (shape) {
      case 'rectangle':
        module.addRectangle();
        break;
      case 'circle':
        module.addCircle();
        break;
      case 'polygon':
        module.addPolygon();
        break;
    }
  };

  const handleUndo = () => {
    if ((window as any).stickerModule) {
      (window as any).stickerModule.undo();
    }
  };

  const handleRedo = () => {
    if ((window as any).stickerModule) {
      (window as any).stickerModule.redo();
    }
  };

  const handleClear = () => {
    if ((window as any).stickerModule) {
      (window as any).stickerModule.clear();
    }
  };

  const handleExport = () => {
    if ((window as any).stickerModule && onExport) {
      const imageData = (window as any).stickerModule.exportToPNG();
      onExport(imageData);
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    if ((window as any).stickerModule) {
      (window as any).stickerModule.toggleLayerVisibility(layerId);
      setLayers(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ));
    }
  };

  if (!isActive) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="brush" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="brush" className="text-xs">
            <Brush className="w-3 h-3 mr-1" />
            Brush
          </TabsTrigger>
          <TabsTrigger value="shapes" className="text-xs">
            <Square className="w-3 h-3 mr-1" />
            Shapes
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-xs">
            <Layers className="w-3 h-3 mr-1" />
            Layers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brush" className="space-y-4">
          {/* Brush Tools */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={isDrawingMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsDrawingMode(true)}
                className="flex-1 text-xs"
              >
                <Brush className="w-3 h-3 mr-1" />
                Brush
              </Button>
              <Button
                variant={!isDrawingMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsDrawingMode(false)}
                className="flex-1 text-xs"
              >
                <Eraser className="w-3 h-3 mr-1" />
                Select
              </Button>
            </div>

            {/* Brush Size */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Size: {brushSize}px</label>
              <Slider
                value={[brushSize]}
                onValueChange={handleBrushSizeChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Brush Opacity */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Opacity: {Math.round(brushOpacity * 100)}%</label>
              <Slider
                value={[brushOpacity]}
                onValueChange={handleOpacityChange}
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Brush Textures */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Texture</label>
              <div className="grid grid-cols-3 gap-1">
                {BRUSH_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={brushTexture === preset.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTextureChange(preset.value as any)}
                    className="text-xs p-1 h-8"
                  >
                    {preset.icon}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Color</label>
              <div className="grid grid-cols-5 gap-1">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-6 h-6 rounded border-2 ${
                      brushColor === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-8 rounded border border-gray-600 bg-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                className="text-xs"
              >
                <Undo className="w-3 h-3 mr-1" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                className="text-xs"
              >
                <Redo className="w-3 h-3 mr-1" />
                Redo
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-full text-xs text-red-400 border-red-600 hover:bg-red-600/20"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              className="w-full text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Download className="w-3 h-3 mr-1" />
              Export Sticker
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="shapes" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Shape Tools</h3>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShapeTool('rectangle')}
                className="text-xs justify-start"
              >
                <Square className="w-3 h-3 mr-2" />
                Rectangle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShapeTool('circle')}
                className="text-xs justify-start"
              >
                <Circle className="w-3 h-3 mr-2" />
                Circle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShapeTool('polygon')}
                className="text-xs justify-start"
              >
                <Triangle className="w-3 h-3 mr-2" />
                Triangle
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Click a shape to add it to the canvas. Use the select tool to move and resize shapes.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="layers" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Layers</h3>
            
            <div className="space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className={`w-4 h-4 rounded border ${
                        layer.visible ? 'bg-green-500 border-green-400' : 'bg-gray-600 border-gray-500'
                      }`}
                    >
                      {layer.visible && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                    </button>
                    <span className="text-xs text-gray-300">{layer.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className={`w-4 h-4 rounded border ${
                        layer.locked ? 'bg-red-500 border-red-400' : 'bg-gray-600 border-gray-500'
                      }`}
                    >
                      {layer.locked && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Toggle layer visibility and lock layers to prevent accidental edits.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StickerSidebar;
