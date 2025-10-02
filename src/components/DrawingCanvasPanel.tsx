import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Pen, Eraser, Undo, Trash2, Grid3X3 } from 'lucide-react';

interface DrawingTool {
  type: 'pen' | 'eraser';
  size: number;
  color: string;
}

export function DrawingCanvasPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [tool, setTool] = useState<DrawingTool>({
    type: 'pen',
    size: 3,
    color: '#06b6d4'
  });
  const [paths, setPaths] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Dark background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
  }, [showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    const gridSize = 20;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);
    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    e.preventDefault(); // Prevent scrolling on touch devices
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getEventPos(e);

    if (tool.type === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = tool.color;
      ctx.lineWidth = tool.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Add glow effect
      ctx.shadowColor = tool.color;
      ctx.shadowBlur = 8;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = tool.size;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 0;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save state for undo
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setPaths(prev => [...prev, imageData].slice(-10)); // Keep last 10 states
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || paths.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastPath = paths[paths.length - 2];
    if (lastPath) {
      ctx.putImageData(lastPath, 0, 0);
    } else {
      // Clear canvas and redraw background
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (showGrid) {
        drawGrid(ctx, canvas.width, canvas.height);
      }
    }
    
    setPaths(prev => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
    setPaths([]);
  };

  return (
    <div className="pt-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <Button
              variant={tool.type === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool(prev => ({ ...prev, type: 'pen' }))}
              className={tool.type === 'pen' ? 'dropsource-gradient dropsource-glow-blue' : 'dropsource-border-glow hover:dropsource-glow-cyan'}
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              variant={tool.type === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool(prev => ({ ...prev, type: 'eraser' }))}
              className={tool.type === 'eraser' ? 'dropsource-gradient dropsource-glow-blue' : 'dropsource-border-glow hover:dropsource-glow-cyan'}
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="dropsource-text-secondary text-sm">Size:</span>
            <div className="w-24">
              <Slider
                value={[tool.size]}
                onValueChange={(value) => setTool(prev => ({ ...prev, size: value[0] }))}
                min={1}
                max={20}
                step={1}
              />
            </div>
            <span className="dropsource-text-secondary text-sm w-6">{tool.size}</span>
          </div>

          {/* Color Selection (for pen only) */}
          {tool.type === 'pen' && (
            <div className="flex items-center gap-2">
              <span className="dropsource-text-secondary text-sm">Color:</span>
              <div className="flex gap-2">
                {['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setTool(prev => ({ ...prev, color }))}
                    className={`w-6 h-6 rounded-full border-2 ${
                      tool.color === color ? 'border-white' : 'border-gray-600'
                    } hover:scale-110 transition-transform`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={`dropsource-text-secondary hover:dropsource-glow-cyan ${showGrid ? 'text-cyan-400' : ''}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={paths.length === 0}
            className="dropsource-text-secondary hover:dropsource-glow-cyan disabled:opacity-50"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            className="text-red-400 hover:dropsource-glow-red"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-gray-700 rounded-lg overflow-hidden dropsource-border-glow">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-96 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 dropsource-text-secondary text-sm">
        Click/touch and drag to draw. Use the toolbar to switch between pen and eraser, adjust size, and change colors.
        <br />
        <span className="text-xs text-gray-500">Optimized for both mouse and touch devices</span>
      </div>
    </div>
  );
}