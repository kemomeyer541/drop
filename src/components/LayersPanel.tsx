import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Plus, Eye, EyeOff, Lock, Unlock, Trash2, Copy } from 'lucide-react';
import { ProStickerModule } from '../modules/ProStickerModule.enhanced';

export function LayersPanel() {
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  useEffect(() => {
    updateLayers();
  }, []);

  const updateLayers = () => {
    const currentLayers = ProStickerModule.getLayers();
    setLayers(currentLayers);
  };

  const handleAddLayer = () => {
    ProStickerModule.addLayer();
    updateLayers();
  };

  const handleSelectLayer = (index: number) => {
    ProStickerModule.selectLayer(index);
    setSelectedLayerIndex(index);
    updateLayers();
  };

  const handleToggleVisibility = (index: number) => {
    ProStickerModule.toggleLayerVisibility(index);
    updateLayers();
  };

  const handleOpacityChange = (index: number, opacity: number) => {
    ProStickerModule.setLayerOpacity(index, opacity);
    updateLayers();
  };

  return (
    <div className="fixed right-4 top-24 w-64 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-700/50 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">LAYERS</h3>
        <Button
          onClick={handleAddLayer}
          size="sm"
          className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {layers.map((layer: any, index: number) => (
          <div
            key={layer.id}
            onClick={() => handleSelectLayer(index)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              layer.active
                ? 'bg-blue-600/30 border-2 border-blue-500'
                : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white truncate">
                {layer.name}
              </span>
              <div className="flex gap-1">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(index);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Opacity</span>
                <span className="text-xs text-gray-300">
                  {Math.round((layer.opacity || 1) * 100)}%
                </span>
              </div>
              <Slider
                value={[layer.opacity || 1]}
                onValueChange={(value) => handleOpacityChange(index, value[0])}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
