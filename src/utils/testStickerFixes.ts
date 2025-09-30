// Test script to verify sticker fixes
export const testStickerFixes = {
  // Run immediate console fixes
  runImmediateFixes: () => {
    console.log('=== Running Immediate Fixes ===');
    
    // 1. Remove any stray gold box right now
    const goldBoxes = document.querySelectorAll('.gold-box, .golden-box, [data-hard-gold]');
    goldBoxes.forEach(el => el.remove());
    console.log(`Removed ${goldBoxes.length} gold box elements`);
    
    // 2. Show how many prosticker canvases currently exist
    const canvasCount = document.querySelectorAll('canvas.prosticker-canvas').length;
    console.log(`Prosticker canvases: ${canvasCount}`);
    
    // 3. If a stuck canvas exists but not child of pad container, list it
    document.querySelectorAll('canvas.prosticker-canvas').forEach(c => {
      console.log('Canvas:', c, 'Parent:', c.parentNode);
    });
    
    console.log('=== Immediate Fixes Complete ===');
    return { goldBoxesRemoved: goldBoxes.length, canvasCount };
  },

  // Test initialization
  testInit: async () => {
    console.log('=== Testing Initialization ===');
    
    try {
      const mod = await import('../modules/ProStickerModule.enhanced');
      const moduleApi = mod.ProStickerModule || mod.default || mod;
      
      const padContainer = document.querySelector('.pad-container') as HTMLElement;
      if (!padContainer) {
        console.error('No .pad-container found');
        return false;
      }
      
      // Test safe initialization
      if (typeof moduleApi.initStickerModeSafe === 'function') {
        moduleApi.initStickerModeSafe(padContainer, { 
          width: padContainer.clientWidth, 
          height: padContainer.clientHeight 
        });
        console.log('✅ Safe initialization successful');
        
        // Check results
        const canvasCount = document.querySelectorAll('canvas.prosticker-canvas').length;
        const canvas = document.querySelector('canvas.prosticker-canvas') as HTMLCanvasElement;
        const pointerEvents = canvas ? canvas.style.pointerEvents : 'no canvas';
        const isDrawing = canvas && (canvas as any).__fabricInstance__ ? (canvas as any).__fabricInstance__.isDrawingMode : false;
        
        console.log(`Canvas count: ${canvasCount}`);
        console.log(`Pointer events: ${pointerEvents}`);
        console.log(`Drawing mode: ${isDrawing}`);
        
        return canvasCount === 1 && pointerEvents === 'none' && !isDrawing;
      } else {
        console.error('❌ initStickerModeSafe not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Initialization test failed:', error);
      return false;
    }
  },

  // Test tool selection
  testToolSelection: async (toolId: string = 'pencil') => {
    console.log(`=== Testing Tool Selection: ${toolId} ===`);
    
    try {
      const mod = await import('../modules/ProStickerModule.enhanced');
      const moduleApi = mod.ProStickerModule || mod.default || mod;
      
      if (typeof moduleApi.selectTool === 'function') {
        moduleApi.selectTool(toolId);
        console.log(`✅ Tool selection successful: ${toolId}`);
        
        // Check if drawing mode is enabled for drawing tools
        const drawingTools = ['pencil', 'marker', 'airbrush', 'crayon', 'oil', 'watercolor', 'texture', 'eraser', 'draw'];
        const canvas = document.querySelector('canvas.prosticker-canvas') as HTMLCanvasElement;
        
        if (canvas && (canvas as any).__fabricInstance__) {
          const isDrawing = (canvas as any).__fabricInstance__.isDrawingMode;
          const pointerEvents = canvas.style.pointerEvents;
          
          console.log(`Drawing mode: ${isDrawing}`);
          console.log(`Pointer events: ${pointerEvents}`);
          
          if (drawingTools.includes(toolId)) {
            return isDrawing && pointerEvents === 'auto';
          } else {
            return !isDrawing && pointerEvents === 'none';
          }
        }
        
        return true;
      } else {
        console.error('❌ selectTool not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Tool selection test failed:', error);
      return false;
    }
  },

  // Test cleanup
  testCleanup: async () => {
    console.log('=== Testing Cleanup ===');
    
    try {
      const mod = await import('../modules/ProStickerModule.enhanced');
      const moduleApi = mod.ProStickerModule || mod.default || mod;
      
      const padContainer = document.querySelector('.pad-container') as HTMLElement;
      if (!padContainer) {
        console.error('No .pad-container found');
        return false;
      }
      
      if (typeof moduleApi.exitStickerMode === 'function') {
        moduleApi.exitStickerMode(padContainer);
        console.log('✅ Cleanup successful');
        
        // Check results
        const canvasCount = document.querySelectorAll('canvas.prosticker-canvas').length;
        const hasGoldenBorder = padContainer.classList.contains('golden-border');
        
        console.log(`Canvas count after cleanup: ${canvasCount}`);
        console.log(`Golden border removed: ${!hasGoldenBorder}`);
        
        return canvasCount === 0 && !hasGoldenBorder;
      } else {
        console.error('❌ exitStickerMode not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Cleanup test failed:', error);
      return false;
    }
  },

  // Run all tests
  runAllTests: async () => {
    console.log('🧪 Starting Comprehensive Sticker Tests...');
    
    const results = {
      immediateFixes: testStickerFixes.runImmediateFixes(),
      init: await testStickerFixes.testInit(),
      toolSelection: await testStickerFixes.testToolSelection('pencil'),
      cleanup: await testStickerFixes.testCleanup()
    };
    
    console.log('📊 Test Results:', results);
    
    const allPassed = Object.values(results).every(result => 
      typeof result === 'boolean' ? result : true
    );
    
    console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
    return results;
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testStickerFixes = testStickerFixes;
}
