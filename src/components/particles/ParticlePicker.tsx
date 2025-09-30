import React from 'react';
import { ParticlePreset } from './ParticleLayer';
import { PARTICLE_CATALOG } from './catalog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ParticlePickerProps {
  value: ParticlePreset;
  onChange: (preset: ParticlePreset) => void;
  density?: "low" | "medium" | "high";
  onDensityChange?: (density: "low" | "medium" | "high") => void;
}

export function ParticlePicker({ value, onChange, density = "medium", onDensityChange }: ParticlePickerProps) {
  const groups = ["Calm", "Playful", "Sci-Fi", "Nature"] as const;

  return (
    <div className="space-y-4">
      {/* Intensity Controls */}
      {onDensityChange && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide opacity-70 mb-2 dropsource-text-tertiary">
            Intensity
          </div>
          <div className="flex gap-1">
            {(["low", "medium", "high"] as const).map(level => (
              <button
                key={level}
                onClick={() => onDensityChange(level)}
                className={`
                  flex-1 px-3 py-2 border rounded transition-all text-sm capitalize
                  ${density === level 
                    ? "border-white/30 bg-white/5 dropsource-text-primary" 
                    : "border-white/10 hover:bg-white/5 dropsource-text-secondary hover:dropsource-text-primary"
                  }
                `}
                style={{ borderRadius: 'var(--radius-sharp)' }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Particle Effects Grid */}
      {groups.map(groupName => {
        const items = PARTICLE_CATALOG.filter(item => item.group === groupName);
        if (items.length === 0) return null;

        return (
          <div key={groupName}>
            <div className="text-xs uppercase tracking-wide opacity-70 mb-2 dropsource-text-tertiary">
              {groupName}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onChange(item.key)}
                      className={`
                        flex items-center gap-2 rounded-md px-3 py-2 border transition-all
                        ${value === item.key 
                          ? "border-white/30 bg-white/5 dropsource-text-primary" 
                          : "border-white/10 hover:bg-white/5 dropsource-text-secondary hover:dropsource-text-primary"
                        }
                      `}
                      style={{
                        borderRadius: 'var(--radius-sharp)',
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      <span className="text-lg leading-none">{item.emoji}</span>
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="dropsource-card">
                    <p style={{ fontSize: 'var(--text-sm)' }}>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}