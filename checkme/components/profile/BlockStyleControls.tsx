import { BlockStyle } from '../../types/profile';

const GRADIENT_PRESETS: BlockStyle[] = [
  {kind:'linear', from:'#6DC7FF', to:'#E6ABFF', angle:135},
  {kind:'linear', from:'#FFB56B', to:'#FD5E53', angle:135},
  {kind:'linear', from:'#00D2FF', to:'#3A47D5', angle:135},
  {kind:'radial', inner:'rgba(255,240,200,.25)', outer:'rgba(20,26,40,.9)'},
];

const SOLIDS = ['#121A26','#0F172A','#1E293B','#111827','#0B1220','#101828'];

export function BlockStyleControls({block, onChange}:{block:{style?: BlockStyle}; onChange:(s:BlockStyle)=>void}){
  return (
    <div className="grid gap-2 w-full max-w-full overflow-hidden">
      <div className="text-xs opacity-70">Solid</div>
      <div className="flex gap-1.5 flex-wrap max-w-full overflow-hidden">
        {SOLIDS.map(c=>(
          <button key={c} aria-label={c}
            onClick={()=>onChange({kind:'solid', color:c})}
            className="flex-shrink-0"
            style={{width:24,height:24,borderRadius:6,background:c,border:'1px solid #223042'}}/>
        ))}
      </div>
      <div className="text-xs mt-3 opacity-70">Gradients</div>
      <div className="flex gap-2 flex-wrap max-w-full overflow-hidden">
        {GRADIENT_PRESETS.map((g,i)=>(
          <button key={i}
            onClick={()=>onChange(g)}
            className="flex-shrink-0"
            style={{
              width:80,height:24,borderRadius:6,border:'1px solid #223042',
              background: g.kind==='linear'
                ? `linear-gradient(${g.angle ?? 135}deg, ${g.from}, ${g.to})`
                : `radial-gradient(circle at 35% 30%, ${g.inner}, ${g.outer})`
            }}/>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 max-w-full">
        <label className="text-xs opacity-70 flex-shrink-0">Radius</label>
        <input 
          type="range" 
          min={8} 
          max={28} 
          defaultValue={block.style?.radius ?? 18}
          onChange={e=>onChange({...block.style!, radius:Number(e.target.value)})}
          className="flex-1 min-w-0"
        />
      </div>
    </div>
  );
}