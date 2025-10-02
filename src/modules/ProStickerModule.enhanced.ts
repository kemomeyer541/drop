import * as fabric from 'fabric';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  objects: fabric.Object[];
}

interface BrushSettings {
  color: string;
  width: number;
  opacity: number;
  smoothing: number;
  pressureEnabled: boolean;
}

class ProStickerModuleClass {
  private canvas: fabric.Canvas | null = null;
  private layers: Layer[] = [];
  private activeLayerIndex: number = 0;
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private brushSettings: BrushSettings = {
    color: '#FFB039',
    width: 5,
    opacity: 1,
    smoothing: 0.5,
    pressureEnabled: true
  };
  private lastColors: string[] = [];
  private currentTool: string = '';
  private isInitialized: boolean = false;
  
  private smoothingPoints: { x: number; y: number; pressure?: number }[] = [];
  private currentPath: any = null;
  private pressureMultiplier: number = 1;

  initStickerModeSafe(container: HTMLElement): fabric.Canvas | null {
    try {
      if (!container) {
        console.error('[ProStickerModule] No container provided');
        return null;
      }

      const existing = container.querySelectorAll('#stickerCanvas');
      existing.forEach((el, i) => {
        if (i > 0) el.remove();
      });

      if ((window as any).fabricCanvas && this.isInitialized) {
        this.canvas = (window as any).fabricCanvas as fabric.Canvas;
        const el = this.canvas.getElement();
        if (el && el.parentElement !== container) {
          container.appendChild(el);
        }
        console.log('[ProStickerModule] Reused existing canvas');
        return this.canvas;
      }

      const canvasEl = document.querySelector('#stickerCanvas') as HTMLCanvasElement 
                      || document.createElement('canvas');
      
      canvasEl.id = 'stickerCanvas';
      const width = container.clientWidth || 1200;
      const height = container.clientHeight || 800;
      
      canvasEl.width = width;
      canvasEl.height = height;
      canvasEl.style.position = 'absolute';
      canvasEl.style.top = '0';
      canvasEl.style.left = '0';
      canvasEl.style.zIndex = '10';
      canvasEl.style.pointerEvents = 'auto';
      canvasEl.style.cursor = 'crosshair';
      canvasEl.style.touchAction = 'none';
      
      if (!canvasEl.parentElement) {
        container.appendChild(canvasEl);
      }

      this.canvas = new fabric.Canvas(canvasEl, {
        width: width,
        height: height,
        backgroundColor: 'transparent',
        isDrawingMode: false,
        selection: true,
        preserveObjectStacking: true,
        enableRetinaScaling: true,
        renderOnAddRemove: true,
        stateful: true
      });

      (window as any).fabricCanvas = this.canvas;
      (window as any).ProStickerModule = this;

      this.setupEventListeners();
      
      if (this.layers.length === 0) {
        this.layers.push({
          id: 'layer-1',
          name: 'Background',
          visible: true,
          locked: false,
          opacity: 1,
          objects: []
        });
        this.activeLayerIndex = 0;
      }

      this.canvas.clear();
      this.saveState();
      this.isInitialized = true;

      console.log('[ProStickerModule] Canvas initialized', {
        width: this.canvas.getWidth(),
        height: this.canvas.getHeight(),
        layers: this.layers.length
      });

      return this.canvas;
    } catch (err) {
      console.error('[ProStickerModule] Initialization error:', err);
      return null;
    }
  }

  private setupEventListeners(): void {
    if (!this.canvas) return;

    this.canvas.off();
    
    this.canvas.on('path:created', (e: any) => {
      if (e.path) {
        const layer = this.layers[this.activeLayerIndex];
        if (layer && !layer.locked) {
          layer.objects.push(e.path);
        }
      }
      this.saveState();
    });

    this.canvas.on('object:modified', () => this.saveState());
    this.canvas.on('object:added', () => this.saveState());
    this.canvas.on('object:removed', () => this.saveState());

    this.canvas.on('mouse:down', (opt: any) => {
      if (this.canvas?.isDrawingMode) {
        this.smoothingPoints = [];
        
        const event = opt.e;
        const pressure = this.getPressure(event);
        if (this.brushSettings.pressureEnabled && pressure > 0) {
          this.pressureMultiplier = pressure;
          this.updateBrushSize();
        }
      }
    });

    this.canvas.on('mouse:move', (opt: any) => {
      if (this.canvas?.isDrawingMode) {
        const event = opt.e;
        const pressure = this.getPressure(event);
        if (this.brushSettings.pressureEnabled && pressure > 0) {
          this.pressureMultiplier = pressure;
          this.updateBrushSize();
        }
      }
    });

    this.canvas.on('mouse:up', () => {
      this.smoothingPoints = [];
      this.currentPath = null;
      this.pressureMultiplier = 1;
      if (this.brushSettings.pressureEnabled) {
        this.updateBrushSize();
      }
    });
  }

  private saveState(): void {
    if (!this.canvas) return;
    
    try {
      const state = JSON.stringify({
        canvas: this.canvas.toJSON(),
        layers: this.layers,
        activeLayerIndex: this.activeLayerIndex
      });
      
      this.undoStack.push(state);
      if (this.undoStack.length > 50) {
        this.undoStack.shift();
      }
      this.redoStack = [];
    } catch (e) {
      console.warn('[ProStickerModule] Failed to save state:', e);
    }
  }

  selectTool(toolName: string, options: any = {}): void {
    if (!this.canvas) {
      console.warn('[ProStickerModule] Canvas not initialized');
      return;
    }

    console.log('[ProStickerModule] Selecting tool:', toolName);
    this.currentTool = toolName;

    const opts = {
      color: this.brushSettings.color,
      width: this.brushSettings.width,
      opacity: this.brushSettings.opacity,
      ...options
    };

    switch (toolName.toLowerCase()) {
      case 'pencil':
      case 'brush-pencil':
        this.applyBrush('pencil', opts);
        break;
      case 'marker':
      case 'brush-marker':
        this.applyBrush('marker', opts);
        break;
      case 'airbrush':
      case 'spray':
        this.applyBrush('airbrush', opts);
        break;
      case 'texture':
      case 'brush-texture':
        this.applyBrush('texture', opts);
        break;
      case 'crayon':
      case 'charcoal':
        this.applyBrush('crayon', opts);
        break;
      case 'oil':
        this.applyBrush('oil', opts);
        break;
      case 'watercolor':
        this.applyBrush('watercolor', opts);
        break;
      case 'eraser':
        this.applyBrush('eraser', opts);
        break;
      case 'rectangle':
      case 'circle':
      case 'triangle':
      case 'polygon':
      case 'arrow':
        this.startShapeDrawing(toolName);
        break;
      case 'select':
      case 'move':
        this.enableSelectMode();
        break;
      case 'undo':
        this.undo();
        break;
      case 'redo':
        this.redo();
        break;
      case 'clear':
        this.clear();
        break;
      default:
        console.warn('[ProStickerModule] Unknown tool:', toolName);
    }
  }

  private applyBrush(type: string, options: any = {}): void {
    if (!this.canvas) return;

    const {color = this.brushSettings.color, width = this.brushSettings.width, opacity = this.brushSettings.opacity} = options;

    let brush: any;

    switch (type.toLowerCase()) {
      case 'pencil':
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width;
        brush.color = color;
        brush.opacity = opacity;
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
        break;

      case 'marker':
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width * 1.5;
        brush.color = color;
        brush.opacity = opacity * 0.9;
        brush.shadow = new fabric.Shadow({
          color: color,
          blur: 3,
          offsetX: 0,
          offsetY: 0
        });
        break;

      case 'airbrush':
        brush = new fabric.SprayBrush(this.canvas);
        brush.width = width * 2;
        brush.color = color;
        brush.density = 30;
        brush.dotWidth = 2;
        brush.opacity = opacity * 0.8;
        brush.randomOpacity = true;
        break;

      case 'texture':
        brush = new fabric.PatternBrush(this.canvas);
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 50;
        const pctx = patternCanvas.getContext('2d');
        if (pctx) {
          pctx.fillStyle = color;
          pctx.fillRect(0, 0, 50, 50);
          pctx.fillStyle = 'rgba(255,255,255,0.1)';
          for (let i = 0; i < 50; i += 10) {
            pctx.fillRect(i, i, 5, 5);
          }
        }
        brush.source = patternCanvas;
        brush.width = width;
        break;

      case 'crayon':
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width * 1.2;
        brush.color = color;
        brush.opacity = 0.75;
        brush.shadow = new fabric.Shadow({
          color: 'rgba(0,0,0,0.15)',
          blur: 2,
          offsetX: 1,
          offsetY: 1
        });
        break;

      case 'oil':
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width * 1.3;
        brush.color = color;
        brush.opacity = 0.95;
        brush.shadow = new fabric.Shadow({
          color: color,
          blur: 6,
          offsetX: 0,
          offsetY: 0
        });
        break;

      case 'watercolor':
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width * 1.4;
        brush.color = color;
        brush.opacity = 0.45;
        brush.shadow = new fabric.Shadow({
          color: color,
          blur: 12,
          offsetX: 0,
          offsetY: 0
        });
        break;

      case 'eraser':
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width * 2;
        brush.globalCompositeOperation = 'destination-out';
        break;

      default:
        brush = new fabric.PencilBrush(this.canvas);
        brush.width = width;
        brush.color = color;
        brush.opacity = opacity;
    }

    this.canvas.freeDrawingBrush = brush;
    this.canvas.isDrawingMode = true;
    this.canvas.selection = false;

    console.log('[ProStickerModule] Brush applied:', type, {
      isDrawingMode: this.canvas.isDrawingMode,
      brushType: brush.constructor.name,
      color: (brush as any).color,
      width: (brush as any).width
    });
  }

  private startShapeDrawing(shape: string): void {
    if (!this.canvas) return;

    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    let shapeObject: fabric.Object | null = null;
    let startX = 0, startY = 0;

    const onMouseDown = (opt: any) => {
      const pointer = this.canvas!.getPointer(opt.e);
      startX = pointer.x;
      startY = pointer.y;

      const shapeOptions = {
        left: startX,
        top: startY,
        fill: 'transparent',
        stroke: this.brushSettings.color,
        strokeWidth: 2,
        selectable: true
      };

      switch (shape.toLowerCase()) {
        case 'rectangle':
          shapeObject = new fabric.Rect({
            ...shapeOptions,
            width: 1,
            height: 1
          });
          break;
        case 'circle':
          shapeObject = new fabric.Ellipse({
            ...shapeOptions,
            rx: 1,
            ry: 1
          });
          break;
        case 'triangle':
          shapeObject = new fabric.Triangle({
            ...shapeOptions,
            width: 1,
            height: 1
          });
          break;
        case 'polygon':
          const points = [
            { x: 0, y: 0 },
            { x: 50, y: -50 },
            { x: 100, y: 0 },
            { x: 75, y: 75 },
            { x: 25, y: 75 }
          ];
          shapeObject = new fabric.Polygon(points, {
            ...shapeOptions,
            left: startX,
            top: startY
          });
          break;
        case 'arrow':
          shapeObject = new fabric.Line([startX, startY, startX + 1, startY + 1], {
            stroke: this.brushSettings.color,
            strokeWidth: 3,
            selectable: true
          });
          break;
      }

      if (shapeObject) {
        this.canvas!.add(shapeObject);
      }
    };

    const onMouseMove = (opt: any) => {
      if (!shapeObject) return;

      const pointer = this.canvas!.getPointer(opt.e);
      const width = Math.abs(pointer.x - startX);
      const height = Math.abs(pointer.y - startY);
      const left = Math.min(pointer.x, startX);
      const top = Math.min(pointer.y, startY);

      if (shape === 'rectangle' || shape === 'triangle') {
        shapeObject.set({ left, top, width, height });
      } else if (shape === 'circle') {
        (shapeObject as fabric.Ellipse).set({ left, top, rx: width / 2, ry: height / 2 });
      } else if (shape === 'arrow') {
        (shapeObject as fabric.Line).set({ x2: pointer.x, y2: pointer.y });
      }

      this.canvas!.renderAll();
    };

    const onMouseUp = () => {
      this.canvas!.off('mouse:down', onMouseDown);
      this.canvas!.off('mouse:move', onMouseMove);
      this.canvas!.off('mouse:up', onMouseUp);
      
      if (shapeObject) {
        shapeObject.setCoords();
        const layer = this.layers[this.activeLayerIndex];
        if (layer && !layer.locked) {
          layer.objects.push(shapeObject);
        }
        this.saveState();
      }
      
      this.canvas!.selection = true;
    };

    this.canvas.on('mouse:down', onMouseDown);
    this.canvas.on('mouse:move', onMouseMove);
    this.canvas.on('mouse:up', onMouseUp);
  }

  private enableSelectMode(): void {
    if (!this.canvas) return;
    
    this.canvas.isDrawingMode = false;
    this.canvas.selection = true;
    this.canvas.forEachObject(obj => {
      obj.selectable = true;
      obj.evented = true;
    });
    console.log('[ProStickerModule] Select mode enabled');
  }

  setBrush(color: string, width: number, opacity: number, type?: string): void {
    this.brushSettings.color = color;
    this.brushSettings.width = width;
    this.brushSettings.opacity = opacity;

    if (color) {
      this.pushColor(color);
    }

    if (this.canvas?.isDrawingMode && this.canvas.freeDrawingBrush) {
      const brush = this.canvas.freeDrawingBrush as any;
      if (brush.color !== undefined) brush.color = color;
      if (brush.width !== undefined) brush.width = width;
      if (brush.opacity !== undefined) brush.opacity = opacity;
    }

    if (type && this.currentTool) {
      this.selectTool(type);
    }
  }

  setColor(color: string): void {
    this.brushSettings.color = color;
    this.pushColor(color);
    if (this.canvas?.freeDrawingBrush && (this.canvas.freeDrawingBrush as any).color !== undefined) {
      (this.canvas.freeDrawingBrush as any).color = color;
    }
  }

  setBrushWidth(width: number): void {
    this.brushSettings.width = width;
    if (this.canvas?.freeDrawingBrush && (this.canvas.freeDrawingBrush as any).width !== undefined) {
      (this.canvas.freeDrawingBrush as any).width = width;
    }
  }

  setBrushOpacity(opacity: number): void {
    this.brushSettings.opacity = opacity;
    if (this.canvas?.freeDrawingBrush && (this.canvas.freeDrawingBrush as any).opacity !== undefined) {
      (this.canvas.freeDrawingBrush as any).opacity = opacity;
    }
  }

  private pushColor(color: string): void {
    this.lastColors = [color, ...this.lastColors.filter(c => c !== color)].slice(0, 5);
  }

  getLastColors(): string[] {
    return [...this.lastColors];
  }

  addLayer(): void {
    const newLayer: Layer = {
      id: `layer-${this.layers.length + 1}`,
      name: `Layer ${this.layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 1,
      objects: []
    };
    this.layers.push(newLayer);
    this.activeLayerIndex = this.layers.length - 1;
    console.log('[ProStickerModule] Layer added:', newLayer.name);
  }

  getLayers(): Layer[] {
    return this.layers.map((layer, index) => ({
      ...layer,
      active: index === this.activeLayerIndex
    })) as any;
  }

  selectLayer(index: number): void {
    if (index >= 0 && index < this.layers.length) {
      this.activeLayerIndex = index;
      console.log('[ProStickerModule] Selected layer:', this.layers[index].name);
    }
  }

  toggleLayerVisibility(index: number): void {
    if (index >= 0 && index < this.layers.length) {
      const layer = this.layers[index];
      layer.visible = !layer.visible;
      
      layer.objects.forEach(obj => {
        obj.visible = layer.visible;
      });
      
      this.canvas?.renderAll();
      console.log('[ProStickerModule] Toggled layer visibility:', layer.name, layer.visible);
    }
  }

  setLayerOpacity(index: number, opacity: number): void {
    if (index >= 0 && index < this.layers.length) {
      const layer = this.layers[index];
      layer.opacity = opacity;
      
      layer.objects.forEach(obj => {
        obj.opacity = opacity;
      });
      
      this.canvas?.renderAll();
      console.log('[ProStickerModule] Set layer opacity:', layer.name, opacity);
    }
  }

  undo(): void {
    if (!this.canvas || this.undoStack.length <= 1) {
      console.log('[ProStickerModule] Nothing to undo');
      return;
    }

    try {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);

      const prevState = this.undoStack[this.undoStack.length - 1];
      const state = JSON.parse(prevState);

      this.canvas.loadFromJSON(state.canvas, () => {
        this.canvas!.renderAll();
      });
      
      this.layers = state.layers;
      this.activeLayerIndex = state.activeLayerIndex;

      console.log('[ProStickerModule] Undo complete, stack size:', this.undoStack.length);
    } catch (e) {
      console.error('[ProStickerModule] Undo failed:', e);
    }
  }

  redo(): void {
    if (!this.canvas || this.redoStack.length === 0) {
      console.log('[ProStickerModule] Nothing to redo');
      return;
    }

    try {
      const nextState = this.redoStack.pop()!;
      const state = JSON.parse(nextState);

      this.canvas.loadFromJSON(state.canvas, () => {
        this.canvas!.renderAll();
      });
      
      this.layers = state.layers;
      this.activeLayerIndex = state.activeLayerIndex;
      
      this.undoStack.push(nextState);

      console.log('[ProStickerModule] Redo complete, stack size:', this.undoStack.length);
    } catch (e) {
      console.error('[ProStickerModule] Redo failed:', e);
    }
  }

  clear(): void {
    if (!this.canvas) return;
    
    this.canvas.clear();
    this.layers.forEach(layer => {
      layer.objects = [];
    });
    this.saveState();
    console.log('[ProStickerModule] Canvas cleared');
  }

  addShape(shape: string): void {
    this.startShapeDrawing(shape);
  }

  exportPNG(): string | null {
    if (!this.canvas) return null;
    
    try {
      return this.canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2
      });
    } catch (e) {
      console.error('[ProStickerModule] Export failed:', e);
      return null;
    }
  }

  private getPressure(event: any): number {
    if (event.pressure !== undefined && event.pressure > 0 && event.pressure < 1) {
      return event.pressure;
    }
    
    if ((window as any).PointerEvent && event instanceof PointerEvent) {
      if (event.pressure !== undefined && event.pressure > 0 && event.pressure < 1) {
        return event.pressure;
      }
    }
    
    return 1.0;
  }

  private updateBrushSize(): void {
    if (!this.canvas?.freeDrawingBrush) return;
    
    const baseSize = this.brushSettings.width;
    const adjustedSize = baseSize * this.pressureMultiplier;
    
    (this.canvas.freeDrawingBrush as any).width = Math.max(1, adjustedSize);
  }

  enablePressureSensitivity(enabled: boolean): void {
    this.brushSettings.pressureEnabled = enabled;
    console.log('[ProStickerModule] Pressure sensitivity:', enabled);
  }

  setSmoothingLevel(level: number): void {
    this.brushSettings.smoothing = Math.max(0, Math.min(1, level));
    console.log('[ProStickerModule] Smoothing level:', this.brushSettings.smoothing);
  }

  debugStatus(): void {
    console.log('[ProStickerModule] Status:', {
      initialized: this.isInitialized,
      canvas: !!this.canvas,
      isDrawingMode: this.canvas?.isDrawingMode,
      layers: this.layers.length,
      activeLayer: this.activeLayerIndex,
      undoStack: this.undoStack.length,
      redoStack: this.redoStack.length,
      currentTool: this.currentTool,
      brushSettings: this.brushSettings,
      pressureMultiplier: this.pressureMultiplier
    });
  }
}

export const ProStickerModule = new ProStickerModuleClass();

export const initStickerModeSafe = (container: HTMLElement) => 
  ProStickerModule.initStickerModeSafe(container);

export const selectTool = (toolName: string, options?: any) => 
  ProStickerModule.selectTool(toolName, options);

export const setColor = (color: string) => 
  ProStickerModule.setColor(color);

export const setBrushWidth = (width: number) => 
  ProStickerModule.setBrushWidth(width);

export const setBrushOpacity = (opacity: number) => 
  ProStickerModule.setBrushOpacity(opacity);

export const undo = () => 
  ProStickerModule.undo();

export const redo = () => 
  ProStickerModule.redo();

export const getLastColors = () => 
  ProStickerModule.getLastColors();

export default ProStickerModule;
