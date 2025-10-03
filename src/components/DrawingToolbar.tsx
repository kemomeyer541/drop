import React, { useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { 
  Pen, Brush, Droplets, Sparkles, Palette, Square, Circle, Triangle,
  Eraser, Move, Undo, Redo, Download, Eye, Layers, Sliders, Pipette
} from 'lucide-react';
import { ProStickerModule } from '../modules/ProStickerModule.enhanced';

interface DrawingToolbarProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
}

const brushTools = [
  { id: 'pencil', icon: Pen, label: 'Pencil', description: 'Smooth pencil brush' },
  { id: 'marker', icon: Brush, label: 'Marker', description: 'Bold marker stroke' },
  { id: 'airbrush', icon: Droplets, label: 'Airbrush', description: 'Soft spray effect' },
  { id: 'texture', icon: Sparkles, label: 'Texture', description: 'Textured brush' },
  { id: 'crayon', icon: Palette, label: 'Crayon', description: 'Waxy crayon effect' },
  { id: 'oil', icon: Palette, label: 'Oil Paint', description: 'Oil painting brush' },
  { id: 'watercolor', icon: Droplets, label: 'Watercolor', description: 'Watercolor effect' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', description: 'Erase drawing' },
];

const shapeTools = [
  { id: 'rectangle', icon: Square, label: 'Rectangle', description: 'Draw rectangles' },
  { id: 'circle', icon: Circle, label: 'Circle', description: 'Draw circles' },
  { id: 'triangle', icon: Triangle, label: 'Triangle', description: 'Draw triangles' },
];

const utilityTools = [
  { id: 'select', icon: Move, label: 'Select', description: 'Select and move objects' },
  { id: 'undo', icon: Undo, label: 'Undo', description: 'Undo last action' },
  { id: 'redo', icon: Redo, label: 'Redo', description: 'Redo action' },
];

export function DrawingToolbar({ onToolSelect, activeTool }: DrawingToolbarProps) {
  const handleToolClick = (toolId: string) => {
    console.log('[DrawingToolbar] Tool selected:', toolId);
    
    if (toolId === 'undo') {
      ProStickerModule.undo();
      return;
    }
    if (toolId === 'redo') {
      ProStickerModule.redo();
      return;
    }
    
    onToolSelect(toolId);
    ProStickerModule.selectTool(toolId);
  };

  return (
    <div className="fixed left-4 top-24 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-gray-700/50 z-50">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-400 px-2 mb-1">BRUSHES</div>
        <div className="flex flex-col gap-1">
          {brushTools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleToolClick(tool.id)}
                  variant={activeTool === tool.id ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-12 h-12 p-0 ${
                    activeTool === tool.id 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tool.icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs text-gray-400">{tool.description}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="border-t border-gray-700 my-2" />
        
        <div className="text-xs font-semibold text-gray-400 px-2 mb-1">SHAPES</div>
        <div className="flex flex-col gap-1">
          {shapeTools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleToolClick(tool.id)}
                  variant={activeTool === tool.id ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-12 h-12 p-0 ${
                    activeTool === tool.id 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tool.icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs text-gray-400">{tool.description}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="border-t border-gray-700 my-2" />
        
        <div className="text-xs font-semibold text-gray-400 px-2 mb-1">TOOLS</div>
        <div className="flex flex-col gap-1">
          {utilityTools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleToolClick(tool.id)}
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <tool.icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs text-gray-400">{tool.description}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
