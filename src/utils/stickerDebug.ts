// Debug utility for ProStickerModule
export const stickerDebug = {
  // Immediate fixes for gold box and canvas issues
  removeGoldBoxes: () => {
    const removed = document.querySelectorAll('.gold-box, .golden-box, [data-hard-gold]');
    removed.forEach(el => el.remove());
    console.log(`[StickerDebug] Removed ${removed.length} gold box elements`);
    return removed.length;
  },

  // Check canvas count
  getCanvasCount: () => {
    const count = document.querySelectorAll('canvas.prosticker-canvas').length;
    console.log(`[StickerDebug] Canvas count: ${count}`);
    return count;
  },

  // Check drawing mode
  getDrawingMode: () => {
    const canvasEl = document.querySelector('canvas.prosticker-canvas') as HTMLCanvasElement | null;
    const isDrawing = (canvasEl && (canvasEl as any).__fabricInstance__ && (canvasEl as any).__fabricInstance__.isDrawingMode) || false;
    console.log(`[StickerDebug] Drawing mode: ${isDrawing}`);
    return isDrawing;
  },

  // Check pointer events
  getPointerEvents: () => {
    const canvasEl = document.querySelector('canvas.prosticker-canvas') as HTMLCanvasElement | null;
    const pointerEvents = canvasEl ? canvasEl.style.pointerEvents : 'no canvas';
    console.log(`[StickerDebug] Pointer events: ${pointerEvents}`);
    return pointerEvents;
  },

  // Check canvas parent relationships
  checkCanvasParents: () => {
    document.querySelectorAll('canvas.prosticker-canvas').forEach(c => {
      console.log(c, 'parent:', c.parentNode);
    });
  },

  // Run all checks
  runAllChecks: () => {
    console.log('=== ProStickerModule Debug Check ===');
    stickerDebug.removeGoldBoxes();
    stickerDebug.getCanvasCount();
    stickerDebug.getDrawingMode();
    stickerDebug.getPointerEvents();
    stickerDebug.checkCanvasParents();
    console.log('=====================================');
  },

  // Test module import
  testModuleImport: async () => {
    try {
      const mod = await import('../modules/ProStickerModule.enhanced');
      const moduleApi = (mod && mod.ProStickerModule) ? mod.ProStickerModule : (mod && mod.default) ? mod.default : mod;
      console.log('[StickerDebug] Module imported successfully:', !!moduleApi);
      console.log('[StickerDebug] Available methods:', Object.keys(moduleApi));
      
      if (typeof moduleApi.debugStatus === 'function') {
        moduleApi.debugStatus();
      }
      
      return moduleApi;
    } catch (error) {
      console.error('[StickerDebug] Module import failed:', error);
      return null;
    }
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).stickerDebug = stickerDebug;
}
