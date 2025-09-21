import { makeAurora } from './engines/aurora';

// Import other engines as they exist
// import { makeStarfield } from './engines/starfield';
// import { makeMatrix } from './engines/matrix';
// import { makeSakura } from './engines/sakura';

export const REGISTRY = {
  none: () => ({ 
    draw() {},
    dispose() {} 
  }),
  aurora: makeAurora,
  // Add other engines here as they're implemented
  // starfield: makeStarfield,
  // matrix: makeMatrix,
  // sakura: makeSakura,
};