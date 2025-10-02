import { Rnd } from 'react-rnd';
import { GRID, snap, clamp, nextZ } from '../../utils/layout';
import { BlockModel } from '../../types/profile';
import { Volume2 } from 'lucide-react';

type Props = {
  block: BlockModel;
  maxZ: number;
  canvasW: number; 
  canvasH: number;
  onChange(b: BlockModel): void;
  onRemove(id: string): void;
  editMode: boolean;
  children: React.ReactNode;
  onSelect?: (block: BlockModel) => void;
  isSelected?: boolean;
  snapToGrid?: boolean;
};

export default function BlockFrame({
  block, canvasW, canvasH, maxZ, onChange, onRemove, editMode, children, onSelect, isSelected, snapToGrid = true
}: Props) {
  const minW = 260; // Better minimum width
  const minH = 120; // Better minimum height

  // New style system computation
  const style = block.style ?? { kind:'solid', color:'var(--card-bg)' };

  const background =
    style.kind==='solid'  ? style.color :
    style.kind==='linear' ? `linear-gradient(${style.angle ?? 135}deg, ${style.from}, ${style.to})` :
                           `radial-gradient( circle at 35% 30%, ${style.inner}, ${style.outer})`;

  return (
    <Rnd
      bounds="#profile-canvas-inner"
      disableDragging={!editMode}
      enableResizing={editMode ? {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      } : false}
      position={{ x: block.x, y: block.y }}
      size={{ width: block.w, height: block.h }}
      minWidth={block.kind === 'ProfileHeader' ? 720 : 360}
      minHeight={minH}
      maxWidth={block.kind === 'ProfileHeader' ? 1400 : 960}
      dragGrid={snapToGrid ? [GRID, GRID] : undefined}
      resizeGrid={snapToGrid ? [GRID, GRID] : undefined}
      enableUserSelectHack={false}
      cancel=".block-content, .no-drag, input, textarea, button, a"
      onDragStart={() => onChange({ ...block, z: nextZ(block.z, maxZ) })}
      onDragStop={(_, d) => {
        const x = snap(clamp(d.x, 0, canvasW - block.w));
        const y = snap(clamp(d.y, 0, canvasH - block.h));
        onChange({ ...block, x, y });
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        const w = snap(clamp(ref.offsetWidth, minW, canvasW));
        const h = snap(clamp(ref.offsetHeight, minH, canvasH));
        const x = snap(clamp(pos.x, 0, canvasW - w));
        const y = snap(clamp(pos.y, 0, canvasH - h));
        onChange({ ...block, x, y, w, h });
      }}
    >
      <div
        className="card-shell"
        style={{
          background,
          borderRadius: style.radius ?? 18,
          border: isSelected 
            ? '2px solid var(--dropsource-brand)' 
            : style.border ?? '1px solid var(--card-stroke)',
          boxShadow: isSelected 
            ? '0 0 0 1px var(--dropsource-brand), 0 12px 28px rgba(0,174,239,.3)' 
            : style.shadow ?? 'var(--elev-1)',
          height: '100%'
        }}
        onClick={() => editMode && onSelect?.(block)}
      >
        <div className="card-titlebar">
          <span className="opacity-80 flex items-center gap-1">
            {block.kind === 'AudioPlayer' && <Volume2 className="w-3 h-3" />}
            {block.kind}
          </span>
          {editMode && (
            <div className="flex items-center gap-2">
              {block.locked && <span className="opacity-60">Permanent</span>}
              {!block.locked && (
                <>
                  <button
                    className="rounded px-1.5 py-0.5 hover:bg-white/10"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onChange({ ...block, hidden: !block.hidden }); 
                    }}
                    title={block.hidden ? 'Enable block' : 'Disable block'}
                  >
                    {block.hidden ? '🙈' : '👁️'}
                  </button>
                  <button
                    className="rounded px-1.5 py-0.5 hover:bg-red-600/15 text-red-400"
                    onClick={(e) => { e.stopPropagation(); onRemove(block.id); }}
                    title="Remove block"
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="card-content">
          {children}
        </div>
      </div>
    </Rnd>
  );
}