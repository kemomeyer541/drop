export type Sheet =
  | { kind:'color'; color:string }
  | { kind:'gradient'; from:string; to:string; angle?:number }
  | { kind:'image'; url:string; fit:'cover'|'contain'|'tile'; blur?:number; tint?:string };

export function ProfileCanvasSheet({sheet}:{sheet:Sheet}) {
  const style: React.CSSProperties = { position:'absolute', inset:0, zIndex:0 };
  
  if (sheet.kind==='color') {
    style.background = sheet.color;
  } else if (sheet.kind==='gradient') {
    style.background = `linear-gradient(${sheet.angle ?? 135}deg, ${sheet.from}, ${sheet.to})`;
  } else {
    style.backgroundImage = `url(${sheet.url})`;
    style.backgroundSize = sheet.fit==='tile' ? 'auto' : sheet.fit;
    style.backgroundRepeat = sheet.fit==='tile' ? 'repeat' : 'no-repeat';
    style.backgroundPosition = 'center';
    style.filter = sheet.blur ? `blur(${sheet.blur}px)` : undefined;
  }
  
  return (
    <div style={style}>
      {/* optional subtle noise */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'url(/textures/noise-8.png)', opacity:.08, mixBlendMode:'overlay'
      }}/>
      {/* optional tint */}
      {'tint' in sheet && sheet.tint
        ? <div style={{position:'absolute', inset:0, background:sheet.tint, pointerEvents:'none'}}/>
        : null}
    </div>
  );
}

export const SHEET_PRESETS: Sheet[] = [
  {kind:'color', color:'#0B1220'},
  {kind:'gradient', from:'#0B1220', to:'#1E2742', angle:135},
  {kind:'gradient', from:'#0F172A', to:'#312E81', angle:135},
  {kind:'gradient', from:'#1a1a2e', to:'#16213e', angle:135},
  {kind:'gradient', from:'#2d1b69', to:'#11998e', angle:135},
];