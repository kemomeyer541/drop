import React, { useState } from 'react';
import { Block } from '../../types/profile';

interface BlockStyleControlsProps {
  value: Block['style'];
  onChange: (style: Block['style']) => void;
}

export function BlockStyleControls({ value, onChange }: BlockStyleControlsProps) {
  const [showPanel, setShowPanel] = useState(false);
  
  const SOLIDS = [
    '#1E1A26',
    '#0C172A', 
    '#06172F',
    '#101828',
    'rgba(16,22,36,.92)',
    'rgba(67,163,255,.15)'
  ];

  const GRADIENTS = [
    { kind: 'linear' as const, from: '#615CFF', to: '#8F63FF', angle: 135, label: 'Purple' },
    { kind: 'linear' as const, from: '#00F5D4', to: '#A78BFA', angle: 135, label: 'Mint' },
    { kind: 'linear' as const, from: '#FFD700', to: '#FFB347', angle: 135, label: 'Gold' },
    { kind: 'linear' as const, from: '#FF6B9D', to: '#C06BFF', angle: 135, label: 'Pink' }
  ];

  return (
    <div className="color-controls">
      <button
        className="icon-btn"
        onClick={() => setShowPanel(!showPanel)}
        title="Change style"
      >
        🎨
      </button>
      
      {showPanel && (
        <div className="absolute top-8 right-0 bg-gray-800 border border-gray-600 rounded p-3 z-50 min-w-[200px]">
          {/* Solid Colors */}
          <div className="mb-3">
            <h4 className="text-xs font-medium mb-2">Solid Colors</h4>
            <div className="swatch-row">
              {SOLIDS.map((color) => (
                <button
                  key={color}
                  aria-label={color}
                  className={`swatch ${value?.color === color ? 'is-active' : ''}`}
                  style={{ background: color }}
                  onClick={() => onChange({ 
                    ...value, 
                    kind: 'solid', 
                    color 
                  })}
                />
              ))}
            </div>
          </div>

          {/* Gradients */}
          <div>
            <h4 className="text-xs font-medium mb-2">Gradients</h4>
            <div className="swatch-row">
              {GRADIENTS.map((gradient, i) => (
                <button
                  key={i}
                  aria-label={gradient.label}
                  className={`swatch ${
                    value?.kind === 'linear' && 
                    value?.from === gradient.from && 
                    value?.to === gradient.to ? 'is-active' : ''
                  }`}
                  style={{ 
                    background: `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})` 
                  }}
                  onClick={() => onChange({
                    ...value,
                    kind: gradient.kind,
                    from: gradient.from,
                    to: gradient.to,
                    angle: gradient.angle
                  })}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}