export function ProfileHeaderPermanent({
  user, onDonate, onSupport, onMessage
}:{
  user:{
    name:string; handle:string; avatar?:string; pronouns?:string;
    location?:string; availability?:'Open to collab'|'DMs open'|'Busy'|'Offline';
    bio?:string; trust:number; level:number; stars:number; followers:number; following:number;
    proMonths?:number; links?:{label:string; url:string}[]; badges?:string[];
  };
  onDonate?:()=>void; onSupport?:()=>void; onMessage?:()=>void;
}){
  return (
    <header className="card-shell" style={{padding:14}}>
      <div className="flex gap-12 items-center">
        <div style={{
          width:76,height:76,borderRadius:'50%',overflow:'hidden',
          border:'2px solid #2B3A4E', boxShadow:'0 6px 18px rgba(0,0,0,.35)'
        }}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <div className="w-full h-full grid place-items-center bg-[#1a2434] text-white/60 text-2xl">{user.name[0]}</div>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-white">{user.name}</h1>
            {user.pronouns && <span className="text-xs px-2 py-0.5 rounded bg-[#1f2b3d] text-white/80">{user.pronouns}</span>}
            {typeof user.proMonths==='number' &&
              <span title="DropSource PRO" className="text-[11px] px-2 py-0.5 rounded border"
                style={{background:'rgba(255,176,57,.14)',borderColor:'rgba(255,176,57,.35)',color:'#FFB039'}}>
                DS PRO ({user.proMonths} mo)
              </span>}
          </div>

          <div className="text-sm text-white/70 truncate">
            @{user.handle} · {user.location ?? 'Planet Internet'} · {user.availability ?? 'DMs open'}
          </div>

          {user.bio && <p className="mt-2 text-sm text-white/80">{user.bio}</p>}

          <div className="mt-3 flex gap-6 text-sm text-white/85 flex-wrap">
            <span>⭐ {user.stars.toLocaleString()} Stars</span>
            <span>⬆️ Level {user.level}</span>
            <span>🛡️ Trust {user.trust}%</span>
            <span>👥 {(user.followers).toLocaleString()} followers</span>
            <span>↔ {(user.following).toLocaleString()} following</span>
          </div>

          {user.links?.length ? (
            <div className="mt-3 flex gap-2 flex-wrap">
              {user.links.slice(0,5).map((l,i)=>(
                <a key={i} href={l.url} className="text-xs px-2 py-1 rounded border hover:opacity-90"
                   style={{borderColor:'#2a3a50',color:'#cfe6ff'}} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-[160px] shrink-0">
          <button onClick={onDonate} className="h-9 rounded text-sm font-medium"
            style={{background:'#FFB039',color:'#000'}}>🎁 Donate</button>
          <button onClick={onSupport} className="h-9 rounded text-sm font-medium border"
            style={{borderColor:'#2b3a50',color:'#d8e7ff',background:'linear-gradient(180deg, rgba(20,28,44,.9), rgba(14,20,33,.9))'}}>
            🎁 Monthly Support
          </button>
          <button onClick={onMessage} className="h-9 rounded text-sm font-medium border text-white/90"
            style={{borderColor:'#2b3a50', background:'rgba(18,24,38,.75)'}}>Message</button>
        </div>
      </div>
    </header>
  );
}