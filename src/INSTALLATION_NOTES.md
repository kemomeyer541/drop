# Installation Notes

## Required Dependencies

To complete the profile builder implementation, you need to install:

```bash
npm install react-rnd
```

## Features Implemented

✅ **Solid Drag & Resize System**
- Uses react-rnd with grid snapping (16px grid)
- No auto-delete on resize
- Minimum block sizes prevent accidental deletion
- Proper bounds clamping

✅ **Clean Block Management**
- Only explicit trash icon deletion
- Enable/Disable blocks (hide without losing content)
- Individual block styling (color, gradients, corner radius)
- Layer management (z-index controls)

✅ **Real Grid Organization**
- `organizeGrid()` function auto-packs blocks into columns
- Smart column height balancing
- Preserves locked blocks (Chalkboard)

✅ **Clean Default Layout**
- `defaultProfileLayout()` provides organized starter template
- Two-column layout with logical block placement
- No overlapping chaos on first load

✅ **Per-Block Customization**
- Individual gradient/solid color pickers
- Corner radius sliders
- Background presets with hover previews
- Style persistence

✅ **Particle Effects System**
- 10 different particle effects with rarity system
- Common to Legendary tier effects
- Lightweight DOM/CSS-based animations
- Hover preview functionality

✅ **Left Sidebar Block Library**
- Drag-and-drop block addition
- Organized by categories (Core, Content, Social, Media, Commerce)
- Visual feedback during drag operations
- Smart block placement on drop

✅ **Audio Player Blocks**
- HTML5 audio controls
- URL input for MP3/WAV files
- Track title editing
- Album art placeholder support

✅ **Professional Styling**
- Sharp 4px border radius design system
- Transparent canvas background by default
- Clean typography and spacing
- Responsive grid layouts

## Component Structure

```
/components/profile/
├── ProfileCanvasNew.tsx      # New main canvas with grid system
├── BlockFrame.tsx           # Solid drag/resize wrapper
├── BlockStyleEditor.tsx     # Per-block customization
├── ParticlePicker.tsx       # Effects selection UI
├── ParticleLayer.tsx        # Lightweight effects renderer
└── blocks/
    └── AudioPlayer.tsx      # Audio block component

/utils/
├── layout.ts               # Grid snap utilities
├── organize.ts             # Auto-layout functions  
└── templates.ts            # Default layouts

/data/
└── particleEffects.ts      # Particle catalog with rarity
```

## Usage

The new profile system is now available at `/profile` route and includes:
- Drag blocks from left sidebar to canvas
- Individual block styling and positioning
- Grid-based organization tools
- Particle effects with rarity system
- Save/load layout functionality
- Professional styling throughout

All existing functionality is preserved while adding the requested professional canvas editor capabilities.