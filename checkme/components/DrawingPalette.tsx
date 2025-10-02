import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Eraser, Undo, Trash2, Brush, PenTool, Highlighter, Palette, X, Minus } from 'lucide-react';

interface DrawingPaletteProps {
  position: { x: number; y: number };
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onToolChange: (tool: 'brush' | 'pencil' | 'highlighter' | 'eraser') => void;
  onUndo: () => void;
  onClear: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  selectedColor: string;
  brushSize: number;
  selectedTool: 'brush' | 'pencil' | 'highlighter' | 'eraser';
}

export function DrawingPalette({
  position,
  onColorChange,
  onBrushSizeChange,
  onToolChange,
  onUndo,
  onClear,
  onClose,
  onMinimize,
  selectedColor,
  brushSize,
  selectedTool,
}: DrawingPaletteProps) {
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const colors = [
    '#F87171', // Red
    '#84CC16', // Lime
    '#60A5FA', // Blue
    '#A78BFA', // Purple
    '#FB923C', // Orange
    '#06B6D4', // Cyan
    '#FBBF24', // Yellow
    '#F3F4F6', // White
    '#9CA3AF', // Gray
    '#1F2937', // Dark Gray
    '#EF4444', // Bright Red
    '#10B981', // Green
  ];

  const tools = [
    { id: 'brush' as const, icon: Brush, label: 'Brush', opacity: 1 },
    { id: 'pencil' as const, icon: PenTool, label: 'Pencil', opacity: 1 },
    { id: 'highlighter' as const, icon: Highlighter, label: 'Highlighter', opacity: 0.5 },
    { id: 'eraser' as const, icon: Eraser, label: 'Eraser', opacity: 1 },
  ];

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) onMinimize();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Constrain to viewport
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - 320));
    const constrainedY = Math.max(64, Math.min(newY, window.innerHeight - 400)); // 64px for header
    
    setCurrentPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Immediately apply tool changes to canvas context
  const handleToolChange = (tool: typeof selectedTool) => {
    onToolChange(tool);
    
    // Apply tool-specific cursor changes to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      switch (tool) {
        case 'eraser':
          canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'><circle cx=\'10\' cy=\'10\' r=\'8\' fill=\'none\' stroke=\'white\' stroke-width=\'2\'/><path d=\'M6 6l8 8M14 6l-8 8\' stroke=\'white\' stroke-width=\'2\'/></svg>") 10 10, auto';
          break;
        case 'pencil':
        case 'brush':
        case 'highlighter':
        default:
          canvas.style.cursor = 'crosshair';
          break;
      }
    }
  };

  const handleColorChange = (color: string) => {
    onColorChange(color);
    
    // Immediately apply color change to canvas if not eraser
    if (selectedTool !== 'eraser') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = color;
        }
      }
    }
  };

  const handleBrushSizeChange = (size: number) => {
    onBrushSizeChange(size);
    
    // Immediately apply brush size to canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = size;
      }
    }
  };

  return (
    <div
      className={`fixed z-50 dropsource-floating-card rounded-lg shadow-lg select-none transition-all duration-200 ${isDragging ? 'shadow-cyan-500/30' : ''}`}
      style={{ left: currentPosition.x, top: currentPosition.y, width: isMinimized ? '200px' : '320px' }}
    >
      {/* Header with controls */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-700 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm font-medium dropsource-text-primary">Drawing Tools</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="p-1 h-6 w-6 dropsource-text-secondary hover:text-cyan-400"
          >
            <Minus className="w-3 h-3" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-6 w-6 dropsource-text-secondary hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content - hide when minimized */}
      {!isMinimized && (
        <div className="p-4">
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-800/50">
              <TabsTrigger value="tools" className="text-white">Tools</TabsTrigger>
              <TabsTrigger value="colors" className="text-white">Colors</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4">
              {/* Drawing Tools */}
              <div>
                <h4 className="text-sm dropsource-text-secondary mb-2">Drawing Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        variant="ghost"
                        onClick={() => handleToolChange(tool.id)}
                        className={`p-3 h-auto flex flex-col gap-1 transition-all ${
                          selectedTool === tool.id 
                            ? 'dropsource-gradient text-white shadow-lg' 
                            : 'dropsource-text-secondary hover:text-cyan-400 border border-gray-600 hover:border-cyan-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{tool.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Brush Size */}
              <div>
                <h4 className="text-sm dropsource-text-secondary mb-2">
                  Brush Size: {brushSize}px
                </h4>
                <Slider
                  value={[brushSize]}
                  onValueChange={(value) => handleBrushSizeChange(value[0])}
                  max={selectedTool === 'highlighter' ? 40 : selectedTool === 'eraser' ? 30 : 20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs dropsource-text-secondary mt-1">
                  <span>1px</span>
                  <span>{selectedTool === 'highlighter' ? '40px' : selectedTool === 'eraser' ? '30px' : '20px'}</span>
                </div>
              </div>

              {/* Current Tool Preview */}
              <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                <div 
                  className="w-8 h-8 rounded-md border border-gray-600 flex items-center justify-center"
                  style={{ 
                    backgroundColor: selectedTool === 'eraser' ? '#374151' : selectedColor,
                    opacity: selectedTool === 'highlighter' ? 0.6 : 1
                  }}
                >
                  {selectedTool === 'eraser' && <Eraser className="w-4 h-4 text-gray-300" />}
                </div>
                <div>
                  <p className="text-sm dropsource-text-primary capitalize">{selectedTool}</p>
                  <p className="text-xs dropsource-text-secondary">{brushSize}px</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  className="flex-1 border-gray-600 dropsource-text-secondary hover:text-cyan-400 hover:border-cyan-400"
                >
                  <Undo className="w-4 h-4 mr-1" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  className="flex-1 border-red-600 text-red-400 hover:dropsource-glow-red hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              {/* Preset Colors */}
              <div>
                <h4 className="text-sm dropsource-text-secondary mb-2">Preset Colors</h4>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
                        selectedColor === color 
                          ? 'border-cyan-400 scale-110 shadow-lg' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Color Wheel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm dropsource-text-secondary">Custom Color</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColorWheel(!showColorWheel)}
                    className={`p-1 transition-all ${
                      showColorWheel 
                        ? 'text-cyan-400' 
                        : 'dropsource-text-secondary hover:text-cyan-400'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </div>
                {showColorWheel && (
                  <div className="space-y-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full h-12 rounded-md border border-gray-600 bg-transparent cursor-pointer"
                    />
                    <div className="text-xs dropsource-text-secondary text-center">
                      {selectedColor}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Color Preview */}
              <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-md">
                <div 
                  className="w-8 h-8 rounded-md border border-gray-600"
                  style={{ backgroundColor: selectedColor }}
                />
                <div>
                  <p className="text-sm dropsource-text-primary">Current Color</p>
                  <p className="text-xs dropsource-text-secondary">{selectedColor}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}