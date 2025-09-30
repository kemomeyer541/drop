import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';

interface StickerModuleProps {
  isActive: boolean;
  onExport?: (imageData: string) => void;
  onClose?: () => void;
}

interface BrushSettings {
  size: number;
  opacity: number;
  color: string;
  texture: 'smooth' | 'rough' | 'spray';
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

export class StickerModule {
  private canvas: fabric.Canvas | null = null;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private containerRef: React.RefObject<HTMLDivElement>;
  private history: string[] = [];
  private historyIndex: number = -1;
  private layers: Layer[] = [];
  private currentLayerId: string = 'layer-1';
  private brushSettings: BrushSettings = {
    size: 10,
    opacity: 1,
    color: '#FFB039',
    texture: 'smooth'
  };

  constructor(canvasRef: React.RefObject<HTMLCanvasElement>, containerRef: React.RefObject<HTMLDivElement>) {
    this.canvasRef = canvasRef;
    this.containerRef = containerRef;
    this.initializeLayers();
  }

  private initializeLayers() {
    this.layers = [
      { id: 'layer-1', name: 'Background', visible: true, locked: false },
      { id: 'layer-2', name: 'Main', visible: true, locked: false },
      { id: 'layer-3', name: 'Details', visible: true, locked: false }
    ];
  }

  public initialize() {
    if (!this.canvasRef.current || !this.containerRef.current) return;

    // Check if ProStickerModule already has a canvas
    const existingCanvas = document.querySelector('#stickerCanvas[data-managed]');
    if (existingCanvas) {
      console.log('[StickerModule] Reusing existing ProStickerModule canvas');
      // Try to get the existing canvas instance
      this.canvas = (existingCanvas as any).__fabricInstance__ || (window as any).fabricCanvas;
      if (this.canvas) {
        this.setupEventListeners();
        this.saveState();
        return;
      }
    }

    // Create Fabric.js canvas only if no existing canvas
    this.canvas = new fabric.Canvas(this.canvasRef.current, {
      width: this.containerRef.current.clientWidth,
      height: this.containerRef.current.clientHeight,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true
    });

    // Set up brush only if ProStickerModule doesn't have a current tool
    if (!(window as any).ProStickerModule?._currentTool) {
      this.setupBrush();
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Save initial state
    this.saveState();
  }

  private setupBrush() {
    if (!this.canvas) return;

    // Guard: only set brush if ProStickerModule doesn't have a current tool
    if ((window as any).ProStickerModule?._currentTool) {
      console.log('[StickerModule] Skipping brush setup - ProStickerModule has active tool:', (window as any).ProStickerModule._currentTool);
      return;
    }

    // Configure brush
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = this.brushSettings.size;
    this.canvas.freeDrawingBrush.color = this.brushSettings.color;
    this.canvas.freeDrawingBrush.opacity = this.brushSettings.opacity;
  }

  private setupEventListeners() {
    if (!this.canvas) return;

    // Save state on object added/modified
    this.canvas.on('object:added', () => this.saveState());
    this.canvas.on('object:modified', () => this.saveState());
    this.canvas.on('path:created', () => this.saveState());

    // Handle drawing events
    this.canvas.on('mouse:down', (opt) => {
      if (opt.target) {
        this.saveState();
      }
    });
  }

  private saveState() {
    if (!this.canvas) return;
    
    const state = JSON.stringify(this.canvas.toJSON());
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(state);
    this.historyIndex = this.history.length - 1;
    
    // Limit history to 50 states
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  public setBrushSize(size: number) {
    this.brushSettings.size = size;
    // Guard: only update brush if ProStickerModule doesn't have a current tool
    if (!(window as any).ProStickerModule?._currentTool && this.canvas && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = size;
    }
  }

  public setBrushOpacity(opacity: number) {
    this.brushSettings.opacity = opacity;
    // Guard: only update brush if ProStickerModule doesn't have a current tool
    if (!(window as any).ProStickerModule?._currentTool && this.canvas && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.opacity = opacity;
    }
  }

  public setBrushColor(color: string) {
    this.brushSettings.color = color;
    // Guard: only update brush if ProStickerModule doesn't have a current tool
    if (!(window as any).ProStickerModule?._currentTool && this.canvas && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = color;
    }
  }

  public setBrushTexture(texture: 'smooth' | 'rough' | 'spray') {
    this.brushSettings.texture = texture;
    if (!this.canvas) return;

    // Guard: only set brush texture if ProStickerModule doesn't have a current tool
    if ((window as any).ProStickerModule?._currentTool) {
      console.log('[StickerModule] Skipping brush texture change - ProStickerModule has active tool:', (window as any).ProStickerModule._currentTool);
      return;
    }

    switch (texture) {
      case 'smooth':
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        break;
      case 'rough':
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
          color: this.brushSettings.color,
          blur: 2,
          offsetX: 1,
          offsetY: 1
        });
        break;
      case 'spray':
        this.canvas.freeDrawingBrush = new fabric.SprayBrush(this.canvas);
        break;
    }
    
    this.setupBrush();
  }

  public setDrawingMode(enabled: boolean) {
    if (!this.canvas) return;
    
    // Guard: only set drawing mode if ProStickerModule doesn't have a current tool
    if ((window as any).ProStickerModule?._currentTool) {
      console.log('[StickerModule] Skipping drawing mode change - ProStickerModule has active tool:', (window as any).ProStickerModule._currentTool);
      return;
    }
    
    this.canvas.isDrawingMode = enabled;
  }

  public addRectangle() {
    if (!this.canvas) return;
    
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: this.brushSettings.color,
      stroke: this.brushSettings.color,
      strokeWidth: 2
    });
    
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.saveState();
  }

  public addCircle() {
    if (!this.canvas) return;
    
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: this.brushSettings.color,
      stroke: this.brushSettings.color,
      strokeWidth: 2
    });
    
    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.saveState();
  }

  public addPolygon() {
    if (!this.canvas) return;
    
    const triangle = new fabric.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: this.brushSettings.color,
      stroke: this.brushSettings.color,
      strokeWidth: 2
    });
    
    this.canvas.add(triangle);
    this.canvas.setActiveObject(triangle);
    this.saveState();
  }

  public undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.loadState(this.history[this.historyIndex]);
    }
  }

  public redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.loadState(this.history[this.historyIndex]);
    }
  }

  private loadState(state: string) {
    if (!this.canvas) return;
    
    this.canvas.loadFromJSON(state, () => {
      this.canvas?.renderAll();
    });
  }

  public clear() {
    if (!this.canvas) return;
    this.canvas.clear();
    this.saveState();
  }

  public exportToPNG(): string {
    if (!this.canvas) return '';
    
    // Export only the Fabric.js canvas content
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // Higher resolution
    });
    
    return dataURL;
  }

  public getLayers(): Layer[] {
    return [...this.layers];
  }

  public setCurrentLayer(layerId: string) {
    this.currentLayerId = layerId;
  }

  public toggleLayerVisibility(layerId: string) {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.visible = !layer.visible;
    }
  }

  public destroy() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
    this.history = [];
    this.historyIndex = -1;
  }
}

export function StickerModuleComponent({ isActive, onExport, onClose }: StickerModuleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickerModuleRef = useRef<StickerModule | null>(null);

  useEffect(() => {
    if (isActive && canvasRef.current && containerRef.current) {
      // Initialize StickerModule
      stickerModuleRef.current = new StickerModule(canvasRef, containerRef);
      stickerModuleRef.current.initialize();
      
      // Make module globally accessible for sidebar integration
      (window as any).stickerModule = stickerModuleRef.current;
    } else if (!isActive && stickerModuleRef.current) {
      // Clean up when deactivating
      stickerModuleRef.current.destroy();
      stickerModuleRef.current = null;
      delete (window as any).stickerModule;
    }

    return () => {
      if (stickerModuleRef.current) {
        stickerModuleRef.current.destroy();
        stickerModuleRef.current = null;
        delete (window as any).stickerModule;
      }
    };
  }, [isActive]);

  // Handle export when requested
  useEffect(() => {
    if (isActive && stickerModuleRef.current && onExport) {
      const exportData = stickerModuleRef.current.exportToPNG();
      onExport(exportData);
    }
  }, [isActive, onExport]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-40 pointer-events-auto"
      style={{ 
        backgroundColor: 'transparent',
        cursor: 'crosshair'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          backgroundColor: 'transparent',
          cursor: 'crosshair'
        }}
      />
    </div>
  );
}

export default StickerModuleComponent;
