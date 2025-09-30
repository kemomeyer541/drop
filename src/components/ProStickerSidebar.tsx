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
  Plus,
  Eye,
  EyeOff,
  Move,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProStickerSidebarProps {
  isActive: boolean;
  onExport?: (imageData: string) => void;
}

const BRUSH_TYPES = [
  { id: 'pencil', name: 'Pencil', icon: '✏️', description: 'Smooth drawing' },
  { id: 'marker', name: 'Marker', icon: '🖍️', description: 'Bold strokes' },
  { id: 'texture', name: 'Texture', icon: '🎨', description: 'Textured brush' },
  { id: 'smudge', name: 'Smudge', icon: '👆', description: 'Blend colors' }
];

const COLOR_PRESETS = [
  '#FFB039', '#FF6BAA', '#5AF5D0', '#A78BFA', '#FF4757',
  '#2ED573', '#FFA502', '#3742FA', '#FF3838', '#2F3542',
  '#FFFFFF', '#000000', '#FFD700', '#FF69B4', '#00CED1',
  '#FF1493', '#32CD32', '#FF4500', '#8A2BE2', '#00BFFF'
];

export function ProStickerSidebar({ isActive, onExport }: ProStickerSidebarProps) {
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushColor, setBrushColor] = useState('#FFB039');
  const [brushType, setBrushType] = useState<'pencil' | 'marker' | 'texture' | 'smudge'>('pencil');
  const [layers, setLayers] = useState<any[]>([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  // Update ProStickerModule when settings change
  useEffect(() => {
    if (!isActive || !(window as any).ProStickerModule) return;

    const module = (window as any).ProStickerModule;
    module.setBrush(brushColor, brushSize, brushOpacity, brushType);
  }, [brushSize, brushOpacity, brushColor, brushType, isActive]);

  // Load layers from ProStickerModule
  useEffect(() => {
    if (isActive && (window as any).ProStickerModule) {
      const module = (window as any).ProStickerModule;
      const layersData = module.getLayers();
      setLayers(layersData);
      setActiveLayerIndex(layersData.findIndex((l: any) => l.active));
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

  const handleBrushTypeChange = (type: 'pencil' | 'marker' | 'texture' | 'smudge') => {
    setBrushType(type);
  };

  const handleShapeTool = (shape: 'rect' | 'circle' | 'polygon' | 'freeform') => {
    if (!(window as any).ProStickerModule) return;
    (window as any).ProStickerModule.addShape(shape);
  };

  const handleUndo = () => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.undo();
    }
  };

  const handleRedo = () => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.redo();
    }
  };

  const handleClear = () => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.clear();
    }
  };

  const handleAddLayer = () => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.addLayer();
      const layersData = (window as any).ProStickerModule.getLayers();
      setLayers(layersData);
    }
  };

  const handleSelectLayer = (index: number) => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.selectLayer(index);
      setActiveLayerIndex(index);
    }
  };

  const handleToggleLayerVisibility = (index: number) => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.toggleLayerVisibility(index);
      setLayers(prev => prev.map((layer, i) => 
        i === index ? { ...layer, visible: !layer.visible } : layer
      ));
    }
  };

  const handleLayerOpacityChange = (index: number, opacity: number) => {
    if ((window as any).ProStickerModule) {
      (window as any).ProStickerModule.setLayerOpacity(index, opacity);
      setLayers(prev => prev.map((layer, i) => 
        i === index ? { ...layer, opacity } : layer
      ));
    }
  };

  const handleExport = () => {
    if ((window as any).ProStickerModule && onExport) {
      const imageData = (window as any).ProStickerModule.exportPNG();
      if (imageData) {
        onExport(imageData);
      }
    }
  };

  if (!isActive) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="brush" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
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
          <TabsTrigger value="actions" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brush" className="space-y-4">
          {/* Brush Types */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Brush Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {BRUSH_TYPES.map((brush) => (
                <Button
                  key={brush.id}
                  variant={brushType === brush.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBrushTypeChange(brush.id as any)}
                  className="text-xs justify-start"
                >
                  <span className="mr-2">{brush.icon}</span>
                  {brush.name}
                </Button>
              ))}
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
        </TabsContent>

        <TabsContent value="shapes" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Shape Tools</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShapeTool('rect')}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShapeTool('freeform')}
                className="text-xs justify-start"
              >
                <Brush className="w-3 h-3 mr-2" />
                Freeform
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Layers</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddLayer}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {layers.map((layer, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border transition-all ${
                    activeLayerIndex === index 
                      ? 'bg-blue-600/20 border-blue-500' 
                      : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => handleSelectLayer(index)}
                      className="flex items-center gap-2 text-xs text-gray-300 hover:text-white"
                    >
                      <Move className="w-3 h-3" />
                      {layer.name}
                    </button>
                    <button
                      onClick={() => handleToggleLayerVisibility(index)}
                      className="text-gray-400 hover:text-white"
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Opacity: {Math.round(layer.opacity * 100)}%</label>
                    <Slider
                      value={[layer.opacity]}
                      onValueChange={(value) => handleLayerOpacityChange(index, value[0])}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Click a layer to select it. Toggle visibility and adjust opacity for each layer.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Actions</h3>
            
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
      </Tabs>
    </div>
  );
}

export default ProStickerSidebar;
