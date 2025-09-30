/* ProStickerModule.enhanced.ts
   Defensive single-file implementation:
   - single fabric canvas instance (window.fabricCanvas)
   - applyBrushType(...) for real brush instances
   - selectTool(...) wiring for many tools
   - simple layer, history, undo/redo, copy/paste
   - watchers and guards to detect/restore overwrites
*/

import * as fabric from 'fabric';

type AnyBrush = any;
  let canvas: fabric.Canvas | null = null;

// history
const undoStack: string[] = [];
const redoStack: string[] = [];

// brush state + color history
const brushState = {
  color: '#000000',
  width: 4,
  opacity: 1,
  lastColors: [] as string[],
  _currentTool: '' as string,
};

// tool selection state
let selectedTool: string | null = null;

// clipboard
let clipboard: any[] = [];

// utility: ensure single canvas
export function initStickerModeSafe(container: HTMLElement) {
  try {
    if (!container) throw new Error('initStickerModeSafe: no container');

    // Remove stray canvases we created previously (defensive)
    const existing = container.querySelectorAll('#stickerCanvas');
    existing.forEach((el, i) => {
      // keep only first if it's already a valid managed canvas
      if (i > 0) el.remove();
    });

    // If there's a global fabric canvas stored, reuse it
    if ((window as any).fabricCanvas) {
      canvas = (window as any).fabricCanvas as fabric.Canvas;
      // reparent canvas element into container (if needed)
      const el = canvas.getElement();
      if (el && el.parentElement !== container) container.appendChild(el);
      console.log('[ProStickerModule] reused window.fabricCanvas');
    } else {
      // create a single canvas element
      const cEl = document.querySelector('#stickerCanvas') as HTMLCanvasElement | null
                    || document.createElement('canvas');

      cEl.id = 'stickerCanvas';
      cEl.width = container.clientWidth || 1200;
      cEl.height = container.clientHeight || 800;
      cEl.style.position = 'absolute';
      cEl.style.top = '0';
      cEl.style.left = '0';
      cEl.style.zIndex = '10';
      cEl.style.pointerEvents = 'auto';
      cEl.style.cursor = 'crosshair';
      if (!cEl.parentElement) container.appendChild(cEl);
      
      // Ensure the canvas element can receive events
      console.log('[ProStickerModule] Canvas element setup:', {
        element: cEl,
        parentElement: cEl.parentElement,
        pointerEvents: cEl.style.pointerEvents,
        zIndex: cEl.style.zIndex,
        position: cEl.style.position
      });
      
      // Note: Don't add raw DOM event listeners - Fabric.js handles its own events

      // create fabric canvas
      canvas = new fabric.Canvas(cEl, {
        preserveObjectStacking: true,
        isDrawingMode: false,
        selection: true,
        backgroundColor: 'transparent',
        width: container.clientWidth || 1200,
        height: container.clientHeight || 800,
      });

      // store global reference so other modules can detect it but WILL NOT overwrite if guard exists
      (window as any).fabricCanvas = canvas;
      // also give access to this module
      (window as any).ProStickerModule = (window as any).ProStickerModule || {};
      (window as any).ProStickerModule._currentTool = '';
      (window as any).ProStickerModule._canvas = canvas;
      console.log('[ProStickerModule] Canvas initialized successfully', {
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        element: canvas.getElement(),
        isDrawingMode: canvas.isDrawingMode
      });
    }

    // attach events
    canvas.off(); // remove prior event handlers defensively
    canvas.on('path:created', saveCanvasStateSafely);
    canvas.on('object:modified', saveCanvasStateSafely);
    canvas.on('object:added', saveCanvasStateSafely);
    canvas.on('object:removed', saveCanvasStateSafely);
    
    // Essential drawing events - these are required for free drawing to work
    canvas.on('mouse:down', (opt) => {
      console.log('[ProStickerModule] mouse:down', opt.pointer);
    });
    canvas.on('mouse:move', (opt) => {
      if (canvas.isDrawingMode) {
        console.log('[ProStickerModule] mouse:move (drawing)', opt.pointer);
      }
    });
    canvas.on('mouse:up', (opt) => {
      console.log('[ProStickerModule] mouse:up', opt.pointer);
    });
    
    // Check if Fabric.js events are bound (using proper API)
    console.log('[ProStickerModule] Fabric.js canvas ready:', {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      isDrawingMode: canvas.isDrawingMode,
      selection: canvas.selection,
      freeDrawingBrush: !!canvas.freeDrawingBrush
    });
    
    // Check for elements that might be covering the canvas
    const canvasEl = canvas.getElement();
    const rect = canvasEl.getBoundingClientRect();
    const elementsAtCenter = document.elementsFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
    console.log('[ProStickerModule] Elements at canvas center:', elementsAtCenter.map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className,
      zIndex: window.getComputedStyle(el).zIndex
    })));

    // ensure we have a clean first state
    canvas.clear();
    saveCanvasStateSafely();

    return canvas;
  } catch (err) {
    console.error('[ProStickerModule] initStickerModeSafe error', err);
    return null;
  }
}

// ----------------------------- history -----------------------------
function saveCanvasStateSafely() {
    if (!canvas) return;
  try {
    const s = JSON.stringify(canvas.toJSON(['selectable', 'lockMovementX']));
    undoStack.push(s);
    if (undoStack.length > 50) undoStack.shift();
    // clear redo on new action
    redoStack.length = 0;
  } catch (e) {
    console.warn('[ProStickerModule] saveCanvasStateSafely failed', e);
  }
}

export function undo() {
  if (!canvas || undoStack.length === 0) return;
  try {
    const state = undoStack.pop()!;
    redoStack.push(JSON.stringify(canvas.toJSON()));
    canvas.loadFromJSON(state, () => {
      canvas!.renderAll();
    });
  } catch (e) {
    console.error('[ProStickerModule] undo failed', e);
  }
}

export function redo() {
  if (!canvas || redoStack.length === 0) return;
  try {
    const state = redoStack.pop()!;
    undoStack.push(JSON.stringify(canvas.toJSON()));
    canvas.loadFromJSON(state, () => {
      canvas!.renderAll();
    });
  } catch (e) {
    console.error('[ProStickerModule] redo failed', e);
  }
}

// --------------------------- brush factory ---------------------------
export function applyBrushType(resolvedName: string, options: any = {}) {
  // Standardize canvas access
  const canvas = window.ProStickerModule?._canvas || (window as any).fabricCanvas;
  if (!canvas) return console.warn('[ProStickerModule] applyBrushType: no canvas');

  const name = (resolvedName || 'pencil').toLowerCase();
  const opt = Object.assign({ color: brushState.color, width: brushState.width, opacity: brushState.opacity, density: 30 }, options);

  const setDebug = (brush: AnyBrush, id: string) => {
    try { (brush as any).__proStickerDebug = id; } catch (e) { }
  };

  let brush: AnyBrush | null = null;
  switch (name) {
    case 'marker':
      brush = new fabric.PencilBrush(canvas);
      brush.width = opt.width || 8;
      brush.color = opt.color;
      brush.opacity = opt.opacity ?? 1;
      setDebug(brush, 'marker');
      break;

    case 'airbrush':
    case 'spray':
      brush = new fabric.SprayBrush(canvas);
      brush.width = opt.width || 14;
      brush.color = opt.color;
      brush.density = opt.density || 30;
      brush.opacity = opt.opacity ?? 0.9;
      setDebug(brush, 'airbrush');
      break;

    case 'texture':
      brush = new fabric.PatternBrush(canvas);
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 40;
      const pctx = patternCanvas.getContext('2d');
      if (pctx) {
        pctx.fillStyle = opt.color || '#000';
        pctx.fillRect(0, 0, 40, 40);
        pctx.fillStyle = 'rgba(255,255,255,0.06)';
        pctx.fillRect(8, 8, 24, 24);
      }
      brush.source = patternCanvas;
      brush.width = opt.width || 8;
      setDebug(brush, 'texture');
      break;

    case 'crayon':
    case 'charcoal':
      brush = new fabric.PencilBrush(canvas);
      brush.width = opt.width || 6;
      brush.color = opt.color;
      brush.opacity = 0.75;
      brush.shadow = new fabric.Shadow({ color: 'rgba(0,0,0,0.12)', blur: 2, offsetX: 1, offsetY: 1 });
      setDebug(brush, 'crayon');
      break;

    case 'oil':
      brush = new fabric.PencilBrush(canvas);
      brush.width = opt.width || 10;
      brush.color = opt.color;
      brush.opacity = 0.95;
      brush.shadow = new fabric.Shadow({ color: opt.color, blur: 6, offsetX: 0, offsetY: 0 });
      setDebug(brush, 'oil');
      break;

    case 'watercolor':
      brush = new fabric.PencilBrush(canvas);
      brush.width = opt.width || 10;
      brush.color = opt.color;
      brush.opacity = 0.45;
      brush.shadow = new fabric.Shadow({ color: opt.color, blur: 12, offsetX: 0, offsetY: 0 });
      setDebug(brush, 'watercolor');
      break;

    case 'eraser':
      brush = new fabric.PencilBrush(canvas);
      brush.width = opt.width || 20;
      // Eraser: destination-out to actually remove pixels
      try { (brush as any).globalCompositeOperation = 'destination-out'; } catch (e) { }
      setDebug(brush, 'eraser');
      break;

    case 'pencil':
    default:
      brush = new fabric.PencilBrush(canvas);
      brush.width = opt.width || 4;
      brush.color = opt.color || '#000000';
      brush.opacity = opt.opacity ?? 1;
      setDebug(brush, 'pencil');
      break;
  }

  // apply brush with defensive swaps
  try {
    canvas.isDrawingMode = false; // disable while swapping
    canvas.freeDrawingBrush = brush as any;
    if (brush) {
      if (typeof brush.width !== 'undefined') brush.width = brush.width;
      if (typeof brush.color !== 'undefined') brush.color = brush.color;
      if (typeof brush.opacity !== 'undefined') brush.opacity = brush.opacity;
    }
    canvas.isDrawingMode = true;
    canvas.requestRenderAll();

    // save state of current tool to a global guard
    brushState._currentTool = name;
    (window as any).ProStickerModule = (window as any).ProStickerModule || {};
    (window as any).ProStickerModule._currentTool = name;

    // push recent color
    pushRecentColor(opt.color);

    console.log('[ProStickerModule] applyBrushType ->', name, 'color:', (brush as any).color, 'width:', (brush as any).width, 'ctor:', (brush as any).constructor?.name);
    console.log('[ProStickerModule] Canvas state after brush apply:', {
      isDrawingMode: canvas.isDrawingMode,
      canvasWidth: canvas.getWidth(),
      canvasHeight: canvas.getHeight(),
      brushSet: !!canvas.freeDrawingBrush,
      brushDebug: (canvas.freeDrawingBrush as any)?.__proStickerDebug
    });
    
    // Start brush watcher to detect overwrites
    startBrushWatcher();
  } catch (e) {
    console.error('[ProStickerModule] applyBrushType error', e);
  }
}

function pushRecentColor(color?: string) {
  if (!color) return;
  brushState.lastColors = [color, ...brushState.lastColors.filter(c => c !== color)].slice(0, 5);
}

// accessible getter for last colors
export function getLastColors() {
  return brushState.lastColors.slice();
}

export function setColor(hex: string) {
  brushState.color = hex;
  pushRecentColor(hex);
  const canvas = window.ProStickerModule?._canvas || (window as any).fabricCanvas;
  if (canvas && canvas.isDrawingMode && canvas.freeDrawingBrush) {
    try { (canvas.freeDrawingBrush as any).color = hex; } catch (e) { }
  }
}

export function setBrushWidth(width: number) {
  brushState.width = width;
  const canvas = window.ProStickerModule?._canvas || (window as any).fabricCanvas;
  if (canvas && canvas.freeDrawingBrush) {
    try { (canvas.freeDrawingBrush as any).width = width; } catch (e) { }
  }
}

export function setBrushOpacity(op: number) {
  brushState.opacity = op;
  const canvas = window.ProStickerModule?._canvas || (window as any).fabricCanvas;
  if (canvas && canvas.freeDrawingBrush) {
    try { (canvas.freeDrawingBrush as any).opacity = op; } catch (e) { }
  }
}

// --------------------------- selectTool wiring ---------------------------
export function selectTool(toolName: string, options: any = {}) {
  // Standardize canvas access
  const canvas = window.ProStickerModule?._canvas || (window as any).fabricCanvas;
  if (!canvas) {
    console.warn('[ProStickerModule] selectTool: no canvas');
    return;
  }

  // Prevent redundant tool selection
  if (selectedTool === toolName) {
    console.log('[ProStickerModule] Tool already selected:', toolName);
    return;
  }

  try {
    console.log('[ProStickerModule] selectTool called with:', toolName, options);
    selectedTool = toolName;
    switch ((toolName || '').toString()) {
      // drawing brushes
      case 'pencil':
      case 'brush-pencil':
        applyBrushType('pencil', options);
        break;
      case 'marker':
      case 'brush-marker':
        applyBrushType('marker', options);
        break;
      case 'airbrush':
      case 'brush-airbrush':
      case 'spray':
        applyBrushType('airbrush', options);
        break;
      case 'texture':
      case 'brush-texture':
        applyBrushType('texture', options);
        break;
      case 'crayon':
      case 'brush-crayon':
      case 'charcoal':
        applyBrushType('crayon', options);
        break;
      case 'oil':
      case 'brush-oil':
        applyBrushType('oil', options);
        break;
      case 'watercolor':
      case 'brush-watercolor':
        applyBrushType('watercolor', options);
        break;
      case 'eraser':
      case 'tool-eraser':
        applyBrushType('eraser', options);
        break;

      // shapes (starts interactive drawing mode for shapes)
      case 'rectangle':
      case 'shape-rect':
        startShapeInteractive('rectangle');
        break;
      case 'circle':
      case 'shape-circle':
        startShapeInteractive('circle');
        break;
      case 'triangle':
      case 'shape-triangle':
        startShapeInteractive('triangle');
        break;
      case 'polygon':
      case 'shape-polygon':
        startShapeInteractive('polygon');
        break;
      case 'arrow':
      case 'shape-arrow':
        startShapeInteractive('arrow');
        break;

      // layers & utility
      case 'layer-add':
        addLayer();
        break;
      case 'layer-duplicate':
        duplicateLayer();
        break;
      case 'layer-merge':
        mergeLayer();
        break;
      case 'layer-flatten':
        flattenLayers();
        break;
      case 'layer-visibility':
      case 'layer-opacity':
        toggleCurrentLayerVisibility();
        break;

      // transforms
      case 'move':
      case 'tool-select':
      case 'transform-move':
        setMoveMode();
        break;
      case 'rotate':
      case 'transform-rotate':
        rotateActive(15);
        break;
      case 'scale':
      case 'transform-scale':
        scaleActive(1.1);
        break;
      case 'flip':
      case 'transform-flip':
        flipActive();
        break;
      case 'transform-skew':
        applySkewToActive(0.1);
        break;

      // effects
      case 'blur':
      case 'effect-blur':
        applyBlurToActive(2);
        break;
      case 'sharpen':
      case 'effect-sharpen':
        applySharpenToActive();
        break;
      case 'glow':
      case 'effect-glow':
        applyGlowToActive();
        break;
      case 'shadow':
      case 'effect-shadow':
        applyShadowToActive();
        break;
      case 'noise':
        applyNoiseToActive();
        break;
      case 'fill':
      case 'color-fill':
        fillCanvas(options.color || brushState.color);
        break;

      // clipboard & history
      case 'copy':
      case 'tool-copy':
        doCopy();
        break;
      case 'paste':
      case 'tool-paste':
        doPaste();
        break;
      case 'undo':
      case 'tool-undo':
        undo();
        break;
      case 'redo':
      case 'tool-redo':
        redo();
        break;
      case 'clear':
      case 'tool-clear':
        clearCanvas();
        break;

      // Additional tool cases
      case 'color-gradient':
        console.log('[ProStickerModule] color-gradient requested (placeholder)');
        break;
      case 'color-swatches':
        console.log('[ProStickerModule] color-swatches requested (placeholder)');
        break;
      case 'color-history':
        console.log('[ProStickerModule] color-history requested (placeholder)');
        break;
      case 'color-palette':
        console.log('[ProStickerModule] color-palette requested (placeholder)');
        break;
      case 'smudge':
        console.log('[ProStickerModule] smudge requested (placeholder)');
        break;
      case 'crop':
        console.log('[ProStickerModule] crop requested (placeholder)');
        break;
      case 'effect-gradient':
        console.log('[ProStickerModule] effect-gradient requested (placeholder)');
        break;
      case 'select':
        setMoveMode();
        break;

      default:
        console.warn('[ProStickerModule] selectTool unknown:', toolName);
    }
  } catch (e) {
    console.error('[ProStickerModule] selectTool error', e);
  }
}

// --------------------------- stubs / helpers ---------------------------

function startShapeInteractive(kind: string) {
  if (!canvas) return;
  console.log('[ProStickerModule] started shape interactive:', kind);
  // simple click-drag: we add a temporary rect/circle/triangle and allow transform
  let activeTemp: fabric.Object | null = null;
  let startX = 0, startY = 0;
  canvas.isDrawingMode = false;
  canvas.selection = false;

  const down = (opt: any) => {
    const ev = opt.e;
    startX = ev.offsetX;
    startY = ev.offsetY;
    if (kind === 'rectangle') {
      activeTemp = new fabric.Rect({ left: startX, top: startY, width: 1, height: 1, fill: 'rgba(0,0,0,0)', stroke: brushState.color || '#000', strokeWidth: 2 });
    } else if (kind === 'circle') {
      activeTemp = new fabric.Ellipse({ left: startX, top: startY, rx: 1, ry: 1, fill: 'rgba(0,0,0,0)', stroke: brushState.color || '#000', strokeWidth: 2 });
    } else if (kind === 'triangle') {
      activeTemp = new fabric.Triangle({ left: startX, top: startY, width: 1, height: 1, fill: 'rgba(0,0,0,0)', stroke: brushState.color || '#000', strokeWidth: 2 });
    } else if (kind === 'arrow' || kind === 'polygon') {
      activeTemp = new fabric.Line([startX, startY, startX + 1, startY + 1], { stroke: brushState.color || '#000', strokeWidth: 3 });
    }
    if (activeTemp) {
      canvas!.add(activeTemp);
    }
  };

  const move = (opt: any) => {
    if (!activeTemp) return;
    const ev = opt.e;
    const w = Math.abs(ev.offsetX - startX);
    const h = Math.abs(ev.offsetY - startY);
    if ((activeTemp as any).set) {
      if (kind === 'rectangle' || kind === 'triangle') {
        (activeTemp as any).set({ left: Math.min(ev.offsetX, startX), top: Math.min(ev.offsetY, startY), width: w, height: h });
      } else if (kind === 'circle') {
        (activeTemp as any).set({ left: Math.min(ev.offsetX, startX), top: Math.min(ev.offsetY, startY), rx: w / 2, ry: h / 2 });
      } else if (kind === 'arrow' || kind === 'polygon') {
        (activeTemp as any).set({ x2: ev.offsetX, y2: ev.offsetY });
      }
      canvas!.renderAll();
    }
  };

  const up = () => {
    // finalize
    canvas!.off('mouse:down', down);
    canvas!.off('mouse:move', move);
    canvas!.off('mouse:up', up);
    if (activeTemp) {
      (activeTemp as any).setCoords();
      saveCanvasStateSafely();
    }
    canvas!.selection = true;
  };

  canvas.on('mouse:down', down);
  canvas.on('mouse:move', move);
  canvas.on('mouse:up', up);
}

// --------------------------- layers simple API ---------------------------
function addLayer() { console.log('[ProStickerModule] added layer 1'); /* placeholder, multi-layer system needs editor UI */ }
function duplicateLayer() { console.log('[ProStickerModule] duplicate layer'); }
function mergeLayer() { console.log('[ProStickerModule] merge layer'); }
function flattenLayers() { console.log('[ProStickerModule] flatten layers'); }
function toggleCurrentLayerVisibility() { console.log('[ProStickerModule] toggle layer visibility'); }

// --------------------------- transforms & effects (basic) ---------------------------
function setMoveMode() {
  if (!canvas) return;
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.forEachObject(o => o.selectable = true);
  console.log('[ProStickerModule] Move/select mode enabled');
}
function rotateActive(deg = 15) {
  const obj = canvas?.getActiveObject();
  if (!obj) return console.log('[ProStickerModule] rotateActive: no active');
  obj.rotate((obj.angle || 0) + deg);
  canvas!.renderAll();
  saveCanvasStateSafely();
}
function scaleActive(factor = 1.1) {
  const obj = canvas?.getActiveObject();
  if (!obj) return console.log('[ProStickerModule] scaleActive: no active');
  obj.scale((obj.scaleX || 1) * factor);
  obj.setCoords();
  canvas!.renderAll();
}
function flipActive() {
  const obj = canvas?.getActiveObject();
  if (!obj) return console.log('[ProStickerModule] flipActive: no active');
  obj.set('flipX', !obj.get('flipX'));
  canvas!.renderAll();
}
function applySkewToActive(val = 0.1) {
  const obj = canvas?.getActiveObject();
  if (!obj) return console.log('[ProStickerModule] applySkewToActive: no active object');
  obj.set('skewX', (obj as any).skewX ? (obj as any).skewX + val : val);
  canvas!.renderAll();
}
function applyBlurToActive(radius = 2) {
  const obj = canvas?.getActiveObject();
  if (!obj) return console.log('[ProStickerModule] applyBlurToActive: no active');
  // only basic simulation for shapes; image filters require fabric.Image.filters
  (obj as any).set('opacity', (obj as any).opacity * 0.95);
  canvas!.renderAll();
}
function applySharpenToActive() { console.log('[ProStickerModule] applySharpenToActive (placeholder)'); }
function applyGlowToActive() {
  const obj = canvas?.getActiveObject();
  if (!obj) return;
  obj.set('shadow', new fabric.Shadow({ color: brushState.color || '#fff', blur: 12, offsetX: 0, offsetY: 0 }));
  canvas!.renderAll();
}
function applyShadowToActive() {
  const obj = canvas?.getActiveObject();
  if (!obj) return;
  obj.set('shadow', new fabric.Shadow({ color: 'rgba(0,0,0,0.35)', blur: 6, offsetX: 4, offsetY: 4 }));
  canvas!.renderAll();
}
function applyNoiseToActive() { console.log('[ProStickerModule] applyNoiseToActive (placeholder)'); }

// --------------------------- clipboard / clear ---------------------------
function doCopy() {
  if (!canvas) return;
  const active = canvas.getActiveObject();
  if (!active) return console.log('[ProStickerModule] copy: no active object');
  active.clone((cloned: any) => {
    clipboard = [cloned];
    console.log('[ProStickerModule] copied to clipboard');
  });
}
function doPaste() {
  if (!canvas) return;
  if (!clipboard || clipboard.length === 0) return console.log('[ProStickerModule] paste: clipboard empty');
  clipboard.forEach(obj => {
    obj.clone((cloned: any) => {
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
      canvas!.add(cloned);
      canvas!.renderAll();
      saveCanvasStateSafely();
    });
  });
}
function clearCanvas() {
  if (!canvas) return;
  canvas.clear();
  saveCanvasStateSafely();
  console.log('[ProStickerModule] canvas cleared');
}
function fillCanvas(color: string) {
  if (!canvas) return;
  canvas.backgroundColor = color;
  canvas.renderAll();
  saveCanvasStateSafely();
  console.log('[ProStickerModule] canvas filled with', color);
}

// --------------------------- guards & watcher ---------------------------
let brushWatcherInterval: number | null = null;
let currentBrushType: string | null = null;

function startBrushWatcher() {
  if (brushWatcherInterval) return;
  
  brushWatcherInterval = window.setInterval(() => {
    // Standardize canvas access
    const canvas = window.ProStickerModule?._canvas || (window as any).fabricCanvas;
    if (!canvas || !canvas.isDrawingMode) return;
    
    const brushName = canvas.freeDrawingBrush?.constructor?.name;
    if (brushName !== currentBrushType) {
      currentBrushType = brushName;
      console.log(`[ProStickerModule] freeDrawingBrush applied: ${currentBrushType}`);
      
      // Only reapply if brush type actually changed and we have a current tool
      if (brushState._currentTool && brushName !== brushState._currentTool) {
        console.warn('[ProStickerModule] freeDrawingBrush was overwritten. Reapplying currentTool:', brushState._currentTool);
        applyBrushType(brushState._currentTool);
      }
    }
  }, 100);
}
function stopBrushWatcher() {
  if (brushWatcherInterval) {
    clearInterval(brushWatcherInterval);
    brushWatcherInterval = null;
  }
}

// --------------------------- exports used by toolbar ---------------------------
export { canvas as _canvas };
export { brushState as _brushState };
export { startBrushWatcher as _startBrushWatcher };

export const ProStickerModule = {
    initStickerModeSafe,
    selectTool,
  applyBrushType,
  setColor,
  setBrushWidth,
  setBrushOpacity,
    undo,
    redo,
  getLastColors,
  _startBrushWatcher: startBrushWatcher
};

export default {
  initStickerModeSafe,
  selectTool,
  applyBrushType,
  setColor,
  setBrushWidth,
  setBrushOpacity,
  undo,
  redo,
  getLastColors,
  _startBrushWatcher: startBrushWatcher
};
