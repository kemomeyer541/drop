import { useEffect, useRef, useState } from 'react';

interface ChalkboardCanvasProps {
  onClear?: () => void;
  blockId?: string;
}

export default function ChalkboardCanvas({ onClear, blockId = 'chalk' }: ChalkboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [pen, setPen] = useState({ 
    color: '#b7cdfc', 
    size: 3, 
    alpha: 0.95 
  });
  const [strokes, setStrokes] = useState<any[]>([]);

  // Color palette for quick selection
  const colorPalette = [
    '#b7cdfc', '#ff6b9d', '#ffd166', '#5af5d0', 
    '#ff8a65', '#a78bfa', '#67e8f9', '#84cc16'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // Set initial background
    ctx.fillStyle = '#0c1424';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [blockId]);

  // Separate effect for loading strokes to prevent render conflicts
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStrokes();
    }, 150);
    
    return () => clearTimeout(timer);
  }, [blockId]);

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = pen.color;
    ctx.globalAlpha = pen.alpha;
    ctx.lineWidth = pen.size;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const getPointerPosition = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return { 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const { x, y } = getPointerPosition(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const { x, y } = getPointerPosition(e);
    draw(x, y);
  };

  const handlePointerUp = () => {
    setDrawing(false);
    // Autosave strokes to localStorage
    saveStrokes();
  };

  const saveStrokes = () => {
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataURL = canvas.toDataURL();
        localStorage.setItem(`chalkboard-${blockId}`, dataURL);
      }
    } catch (e) {
      console.warn('Failed to save chalkboard:', e);
    }
  };

  const loadStrokes = () => {
    try {
      const saved = localStorage.getItem(`chalkboard-${blockId}`);
      if (saved && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = saved;
      }
    } catch (e) {
      console.warn('Failed to load chalkboard:', e);
    }
  };

  const handlePointerLeave = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#0c1424';
    ctx.fillRect(0, 0, rect.width, rect.height);
    onClear?.();
  };

  return (
    <div className="ds-card chalkboard-card">
      <div className="ds-body">
        <div className="flex flex-wrap gap-2 items-center max-w-full">
          <span className="text-xs">Colors:</span>
          <div className="flex flex-wrap gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => setPen(p => ({ ...p, color }))}
                className={`w-8 h-8 rounded border hover:scale-110 transition-transform ${
                  pen.color === color ? 'border-white/60' : 'border-white/20'
                }`}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`choose ${color}`}
              />
            ))}
            <input 
              type="color" 
              value={pen.color} 
              onChange={(e) => setPen(p => ({ ...p, color: e.target.value }))}
              className="w-8 h-8 rounded border border-white/20"
              title="Custom color"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs">Size:</span>
            <input 
              type="range" 
              min={1} 
              max={12} 
              value={pen.size} 
              onChange={(e) => setPen(p => ({ ...p, size: +e.target.value }))}
              className="w-16"
            />
            <span className="text-xs opacity-70">{pen.size}px</span>
          </div>
          
          <button 
            onClick={clearCanvas}
            className="dropsource-btn-secondary text-xs px-3 py-1"
          >
            Clear
          </button>
        </div>
        
        <canvas
          ref={canvasRef}
          className="chalk-canvas mt-2"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
}