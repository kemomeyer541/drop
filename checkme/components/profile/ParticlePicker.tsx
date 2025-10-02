import { PARTICLE_CATALOG } from '../particles/catalog';
import { ParticlePreset } from '../particles/ParticleLayer';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ParticlePickerProps {
  value?: ParticlePreset;
  onChange: (preset?: ParticlePreset) => void;
  density?: "low" | "medium" | "high";
  onDensityChange?: (density: "low" | "medium" | "high") => void;
}

export default function ParticlePicker({ value, onChange, density = "medium", onDensityChange }: ParticlePickerProps) {
  const groups = ["Calm", "Playful", "Sci-Fi", "Nature"] as const;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Particle Effects</h4>
      
      {/* Intensity Controls */}
      {onDensityChange && (
        <div>
          <div className="text-xs mb-2 opacity-70">Intensity</div>
          <div className="flex gap-1">
            {(["low", "medium", "high"] as const).map(level => (
              <button
                key={level}
                onClick={() => onDensityChange(level)}
                className={`flex-1 px-2 py-1 border rounded text-xs capitalize transition-all ${
                  density === level 
                    ? "border-white/30 bg-white/5 text-white" 
                    : "border-white/10 hover:bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <button
          className={`h-10 rounded border text-sm font-medium transition-all ${
            !value ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400' : 'border-white/10 hover:border-cyan-400/50 text-white/70 hover:text-white'
          }`}
          onClick={() => onChange(undefined)}
          title="Disable particles"
        >
          None
        </button>

        {groups.map(groupName => {
          const items = PARTICLE_CATALOG.filter(item => item.group === groupName);
          return items.map(item => (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
                <div
                  className={`rounded border p-2 cursor-pointer transition-all ${
                    value === item.key ? 'border-cyan-400/50 bg-cyan-400/5 text-cyan-400' : 'border-white/10 hover:border-cyan-400/50 hover:bg-white/5 text-white/70 hover:text-white'
                  }`}
                  onClick={() => onChange(item.key)}
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{item.emoji} {item.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">
                      {item.group}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="dropsource-card">
                <p style={{ fontSize: 'var(--text-sm)' }}>{item.description}</p>
              </TooltipContent>
            </Tooltip>
          ));
        })}
      </div>
    </div>
  );
}