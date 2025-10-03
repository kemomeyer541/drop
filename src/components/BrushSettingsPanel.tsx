import React, { useState } from 'react';
import { Slider } from './ui/slider';
import { ProStickerModule } from '../modules/ProStickerModule.enhanced';

const COLOR_PRESETS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#00CED1',
];

export function BrushSettingsPanel() {
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushColor, setBrushColor] = useState('#FF0000');

  const handleSizeChange = (value: number[]) => {
    setBrushSize(value[0]);
    ProStickerModule.setBrushWidth(value[0]);
  };

  const handleOpacityChange = (value: number[]) => {
    setBrushOpacity(value[0]);
    ProStickerModule.setBrushOpacity(value[0]);
  };

  const handleColorChange = (color: string) => {
    setBrushColor(color);
    ProStickerModule.setColor(color);
  };

  return (
    <div className="fixed left-24 top-24 w-72 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-700/50 z-50">
      <h3 className="text-sm font-semibold text-white mb-4">BRUSH SETTINGS</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">Size</label>
            <span className="text-xs text-gray-300">{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            onValueChange={handleSizeChange}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="mt-2 h-12 flex items-center justify-center">
            <div
              className="rounded-full bg-white"
              style={{
                width: `${Math.min(brushSize * 2, 48)}px`,
                height: `${Math.min(brushSize * 2, 48)}px`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">Opacity</label>
            <span className="text-xs text-gray-300">{Math.round(brushOpacity * 100)}%</span>
          </div>
          <Slider
            value={[brushOpacity]}
            onValueChange={handleOpacityChange}
            max={1}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-2 block">Color</label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  brushColor === color
                    ? 'border-white scale-110'
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="color"
              value={brushColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 rounded-lg border-2 border-gray-600 bg-transparent cursor-pointer"
            />
            <div
              className="w-16 h-10 rounded-lg border-2 border-gray-600"
              style={{ backgroundColor: brushColor }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Current Color</span>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border-2 border-gray-600"
                style={{ backgroundColor: brushColor }}
              />
              <span className="text-xs font-mono text-gray-300">{brushColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
