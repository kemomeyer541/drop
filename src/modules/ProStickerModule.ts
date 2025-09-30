import * as fabric from 'fabric';

// DISABLED - Using ProStickerModule.enhanced.ts instead
export const ProStickerModule_DISABLED = (() => {
  let canvas: fabric.Canvas | null = null;
  let layers: fabric.Group[] = [];
  let activeLayerIndex = 0;
  let history: string[] = [];
  let historyIndex = -1;

  // Default brush settings
  let brushColor = '#FFB039';
  let brushWidth = 5;
  let brushOpacity = 1.0;
  let brushType: 'pencil' | 'marker' | 'texture' | 'smudge' = 'pencil';

  /** Initialize Fabric.js canvas on top of pad */
  const initStickerMode = (container: HTMLElement) => {
    if (canvas) return;

    const canvasEl = document.createElement('canvas');
    canvasEl.classList.add('absolute', 'inset-0', 'z-40', 'pointer-events-auto');
    canvasEl.style.backgroundColor = 'transparent';
    canvasEl.style.cursor = 'crosshair';
    container.appendChild(canvasEl);

    canvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: true,
      selection: true,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      width: container.clientWidth,
      height: container.clientHeight,
    });

    setupBrush();
    addLayer();
    toggleGoldenBorder(container, true);
    saveState();
    
    // Set up event listeners
    canvas.on('object:added', saveState);
    canvas.on('object:modified', saveState);
    canvas.on('path:created', saveState);
  };

  /** Remove Fabric.js layer safely */
  const exitStickerMode = (container: HTMLElement) => {
    if (!canvas) return;
    toggleGoldenBorder(container, false);
    canvas.dispose();
    canvas = null;
    layers.length = 0;
    activeLayerIndex = 0;
    history.length = 0;
    historyIndex = -1;
    const canvasEl = container.querySelector('canvas');
    if (canvasEl) container.removeChild(canvasEl);
  };

  /** Setup brush based on current type */
  const setupBrush = () => {
    if (!canvas) return;
    let brush: fabric.BaseBrush;
    
    switch (brushType) {
      case 'pencil':
        brush = new fabric.PencilBrush(canvas);
        break;
      case 'marker':
        brush = new fabric.PencilBrush(canvas);
        (brush as fabric.PencilBrush).shadow = new fabric.Shadow({
          color: brushColor,
          blur: 3,
          offsetX: 1,
          offsetY: 1,
        });
        break;
      case 'texture':
        brush = new fabric.PatternBrush(canvas);
        break;
      case 'smudge':
        brush = new fabric.PencilBrush(canvas);
        (brush as fabric.PencilBrush).shadow = new fabric.Shadow({
          color: brushColor,
          blur: 8,
          offsetX: 0,
          offsetY: 0,
        });
        break;
    }
    
    brush.color = brushColor;
    brush.width = brushWidth;
    (brush as any).opacity = brushOpacity;
    canvas.freeDrawingBrush = brush as any;
    canvas.isDrawingMode = true;
  };

  /** Set brush properties */
  const setBrush = (color: string, width: number, opacity: number, type: 'pencil' | 'marker' | 'texture' | 'smudge') => {
    brushColor = color;
    brushWidth = width;
    brushOpacity = opacity;
    brushType = type;
    setupBrush();
  };

  /** Add a new layer */
  const addLayer = () => {
    if (!canvas) return;
    const group = new fabric.Group([], { 
      selectable: true,
      name: `Layer ${layers.length + 1}`,
      opacity: 1,
      visible: true
    });
    canvas.add(group);
    layers.push(group);
    activeLayerIndex = layers.length - 1;
    saveState();
  };

  /** Select layer by index */
  const selectLayer = (index: number) => {
    if (index < 0 || index >= layers.length) return;
    activeLayerIndex = index;
  };

  /** Toggle layer visibility */
  const toggleLayerVisibility = (index: number) => {
    if (!canvas || index < 0 || index >= layers.length) return;
    layers[index].visible = !layers[index].visible;
    canvas.renderAll();
  };

  /** Change layer opacity */
  const setLayerOpacity = (index: number, opacity: number) => {
    if (!canvas || index < 0 || index >= layers.length) return;
    layers[index].opacity = opacity;
    canvas.renderAll();
  };

  /** Reorder layers */
  const reorderLayer = (fromIndex: number, toIndex: number) => {
    if (!canvas || fromIndex < 0 || fromIndex >= layers.length || toIndex < 0 || toIndex >= layers.length) return;
    
    const layer = layers.splice(fromIndex, 1)[0];
    layers.splice(toIndex, 0, layer);
    
    // Reorder objects in canvas
    canvas.getObjects().forEach((obj, index) => {
      if (obj === layer) {
        canvas.moveTo(obj, toIndex);
      }
    });
    
    canvas.renderAll();
    saveState();
  };

  /** Add basic shapes */
  const addShape = (type: 'rect' | 'circle' | 'polygon' | 'freeform') => {
    if (!canvas) return;
    let obj: fabric.Object;
    
    switch (type) {
      case 'rect':
        obj = new fabric.Rect({
          width: 100,
          height: 100,
          left: 100,
          top: 100,
          fill: 'transparent',
          stroke: brushColor,
          strokeWidth: brushWidth,
          opacity: brushOpacity,
        });
        break;
      case 'circle':
        obj = new fabric.Circle({
          radius: 50,
          left: 100,
          top: 100,
          fill: 'transparent',
          stroke: brushColor,
          strokeWidth: brushWidth,
          opacity: brushOpacity,
        });
        break;
      case 'polygon':
        obj = new fabric.Triangle({
          width: 100,
          height: 100,
          left: 100,
          top: 100,
          fill: 'transparent',
          stroke: brushColor,
          strokeWidth: brushWidth,
          opacity: brushOpacity,
        });
        break;
      case 'freeform':
        canvas.isDrawingMode = true;
        return;
    }
    
    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      saveState();
    }
  };

  /** Save state for undo/redo */
  const saveState = () => {
    if (!canvas) return;
    
    const state = JSON.stringify(canvas.toJSON());
    history = history.slice(0, historyIndex + 1);
    history.push(state);
    historyIndex = history.length - 1;
    
    // Limit history to 50 states
    if (history.length > 50) {
      history.shift();
      historyIndex--;
    }
  };

  /** Undo last action */
  const undo = () => {
    if (!canvas || historyIndex <= 0) return;
    
    historyIndex--;
    const state = history[historyIndex];
    canvas.loadFromJSON(state, () => {
      canvas?.renderAll();
    });
  };

  /** Redo last undone action */
  const redo = () => {
    if (!canvas || historyIndex >= history.length - 1) return;
    
    historyIndex++;
    const state = history[historyIndex];
    canvas.loadFromJSON(state, () => {
      canvas?.renderAll();
    });
  };

  /** Clear all objects */
  const clear = () => {
    if (!canvas) return;
    canvas.clear();
    layers.length = 0;
    addLayer();
    saveState();
  };

  /** Export PNG for Sticker Minting Menu */
  const exportPNG = (): string | null => {
    if (!canvas) return null;
    return canvas.toDataURL({ 
      format: 'png', 
      quality: 1,
      multiplier: 2, // Higher resolution
      transparent: true 
    });
  };

  /** Golden pulsing border */
  const toggleGoldenBorder = (container: HTMLElement, active: boolean) => {
    if (active) {
      container.classList.add('golden-border');
    } else {
      container.classList.remove('golden-border');
    }
  };

  /** Get current brush settings */
  const getBrushSettings = () => ({
    color: brushColor,
    width: brushWidth,
    opacity: brushOpacity,
    type: brushType
  });

  /** Get layers info */
  const getLayers = () => layers.map((layer, index) => ({
    index,
    name: (layer as any).name || `Layer ${index + 1}`,
    visible: layer.visible,
    opacity: layer.opacity,
    active: index === activeLayerIndex
  }));

  /** Sidebar tools definition */
  const tools = [
    { id: 'brush-pencil', label: 'Pencil', icon: '✏️', onClick: () => setBrush(brushColor, brushWidth, brushOpacity, 'pencil') },
    { id: 'brush-marker', label: 'Marker', icon: '🖍️', onClick: () => setBrush(brushColor, brushWidth, brushOpacity, 'marker') },
    { id: 'brush-texture', label: 'Texture', icon: '🎨', onClick: () => setBrush(brushColor, brushWidth, brushOpacity, 'texture') },
    { id: 'brush-smudge', label: 'Smudge', icon: '👆', onClick: () => setBrush(brushColor, brushWidth, brushOpacity, 'smudge') },
    { id: 'eraser', label: 'Eraser', icon: '🧽', onClick: () => setBrush('#ffffff', brushWidth, 1, 'pencil') },
    { id: 'rect', label: 'Rectangle', icon: '⬜', onClick: () => addShape('rect') },
    { id: 'circle', label: 'Circle', icon: '⭕', onClick: () => addShape('circle') },
    { id: 'polygon', label: 'Triangle', icon: '🔺', onClick: () => addShape('polygon') },
    { id: 'freeform', label: 'Freeform', icon: '✋', onClick: () => addShape('freeform') },
    { id: 'addLayer', label: 'Add Layer', icon: '📄', onClick: () => addLayer() },
    { id: 'undo', label: 'Undo', icon: '↶', onClick: () => undo() },
    { id: 'redo', label: 'Redo', icon: '↷', onClick: () => redo() },
    { id: 'clear', label: 'Clear All', icon: '🗑️', onClick: () => clear() },
    { id: 'export', label: 'Export PNG', icon: '💾', onClick: () => exportPNG() },
  ];

  return {
    initStickerMode,
    exitStickerMode,
    setBrush,
    addShape,
    addLayer,
    selectLayer,
    toggleLayerVisibility,
    setLayerOpacity,
    reorderLayer,
    undo,
    redo,
    clear,
    exportPNG,
    getBrushSettings,
    getLayers,
    tools,
  };
})();
