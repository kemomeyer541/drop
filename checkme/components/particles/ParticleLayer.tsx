import React, { useEffect, useRef } from "react";

export type ParticlePreset =
  | "none" | "starfield" | "snow" | "fireflies" | "confetti" | "bubbles" | "meteors" | "matrixDigits"
  | "sakura" | "aurora" | "smoke" | "electric" | "neonTriangles" | "paperPlanes" | "emojiRain"
  | "rain" | "butterflies" | "musicNotes" | "sparkles" | "heartsRain" | "coinsRain" | "starsRain";

export default function ParticleLayer({
  preset, density="medium", opacity=1, zIndex=1, colors,
}:{
  preset: ParticlePreset;
  density?: "low"|"medium"|"high";
  opacity?: number;
  zIndex?: number;
  colors?: string[];
}) {
  const ref = useRef<HTMLCanvasElement|null>(null);
  const raf = useRef<number>();

  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d", {alpha:true})!;
    Object.assign(c.style, {position:"absolute", inset:"0", width:"100%", height:"100%", pointerEvents:"none", zIndex:String(zIndex)});
    const fit = () => {
      const r = c.getBoundingClientRect(), dpr = Math.max(1, window.devicePixelRatio||1);
      c.width = Math.max(1, Math.round(r.width*dpr)); c.height = Math.max(1, Math.round(r.height*dpr));
      ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr);
    };
    fit(); const ro = new ResizeObserver(fit); ro.observe(c);

    const R = () => c.getBoundingClientRect();
    const D = density==="low"? 40 : density==="high"? 160 : 90;
    const theme = colors ?? ["#86E1FF","#A78BFA","#FDE68A","#34D399"];
    
    // ===== helpers =====
    const rnd = (a:number,b:number)=>Math.random()*(b-a)+a;
    const clamp = (n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
    function noiseHash(x:number,y:number){ return Math.sin(x*127.1 + y*311.7)*43758.5453 % 1; }
    function vnoise(x:number,y:number){
      const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
      const s=noiseHash(xi,yi), t=noiseHash(xi+1,yi), u=noiseHash(xi,yi+1), v=noiseHash(xi+1,yi+1);
      const lerp=(A:number,B:number,t:number)=>A+(B-A)*t, sx=xf*xf*(3-2*xf), sy=yf*yf*(3-2*yf);
      return lerp(lerp(s,t,sx), lerp(u,v,sx), sy);
    }

    // ---------- utilities ----------
    const twinkle = (t:number, s=3)=> (Math.sin(t*s)+1)/2;

    // ---------- ENGINES (only changed ones shown short) ----------

    // Starfield (no jitter; streaks behave)
    const makeStarfield = () => {
      const layers = [
        {n:Math.floor(D*0.45), sp: 12, size:[0.6,1.1], col:"rgba(255,255,255,0.9)"},
        {n:Math.floor(D*0.35), sp: 28, size:[0.8,1.6], col:"rgba(185,205,255,0.8)"},
        {n:Math.floor(D*0.20), sp: 50, size:[1.0,2.0], col:"rgba(150,180,255,0.75)"},
      ].map(l=>({ ...l, pts:Array.from({length:l.n},()=>({x:rnd(0,R().width), y:rnd(0,R().height), r:rnd(l.size[0],l.size[1])})) }));

      let streak: {x:number;y:number;vx:number;vy:number;len:number;life:number}|null=null;

      return {
        draw(dt:number){
          const {width,height}=R(); ctx.clearRect(0,0,width,height);

          layers.forEach(l=>{
            ctx.fillStyle=l.col; l.pts.forEach(p=>{
              p.x -= l.sp*dt; if(p.x<0) p.x = width; // wrap
              const x = Math.round(p.x)+0.5; const y = Math.round(p.y)+0.5; // crisp
              ctx.beginPath(); ctx.arc(x,y,p.r,0,Math.PI*2); ctx.fill();
            });
          });

          // controlled streaks
          if(!streak && Math.random()<0.015){
            streak = { x:rnd(width*0.3,width), y:rnd(0,height*0.6), vx:rnd(-360,-240), vy:rnd(-40,40), len:rnd(50,90), life:0.24 };
          }
          if(streak){
            streak.life -= dt;
            streak.x += streak.vx*dt; streak.y += streak.vy*dt;
            const a = clamp(streak.life/0.24,0,1);
            const ang=Math.atan2(streak.vy,streak.vx);
            const tx=streak.x-Math.cos(ang)*streak.len, ty=streak.y-Math.sin(ang)*streak.len;
            const g=ctx.createLinearGradient(streak.x,streak.y,tx,ty);
            g.addColorStop(0,`rgba(255,255,255,${0.95*opacity*a})`); g.addColorStop(1,"rgba(255,255,255,0)");
            ctx.strokeStyle=g; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(streak.x,streak.y); ctx.lineTo(tx,ty); ctx.stroke();
            if(a<=0 || streak.x<-120 || streak.y<-80 || streak.y>height+80) streak=null;
          }
        }
      };
    };

    // DISTINCT Snow: soft drift + swirl, blurred alpha (not dots)
    const makeSnow = () => {
      const f = Array.from({length:D},()=>({
        x:rnd(0,R().width), y:rnd(-R().height,R().height), r:rnd(1.8,3.4),
        vy:rnd(25,55), phase:rnd(0,Math.PI*2), sway:rnd(10,30)
      }));
      return {
        draw(dt:number){
          ctx.clearRect(0,0,R().width,R().height);
          f.forEach(s=>{
            s.phase+=dt; s.y+=s.vy*dt; s.x+=Math.sin(s.phase)*s.sway*dt;
            if(s.y>R().height+4){ s.y=-4; s.x=rnd(0,R().width); }
            ctx.beginPath(); ctx.fillStyle="rgba(255,255,255,0.85)";
            ctx.shadowColor="rgba(255,255,255,0.6)"; ctx.shadowBlur=4;
            ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
            ctx.shadowBlur=0;
          });
        }
      };
    };

    // DISTINCT Fireflies: few, large glow + gentle wander + pulse
    const makeFireflies = () => {
      const n = Math.floor(D*0.35);
      const flies = Array.from({length:n},()=>({
        x:rnd(0,R().width), y:rnd(0,R().height), r:rnd(2.2,3.6),
        t:rnd(0,Math.PI*2), s:rnd(0.6,1.2), hue:rnd(40,90)
      }));
      return {
        draw(dt:number){
          ctx.clearRect(0,0,R().width,R().height);
          flies.forEach(f=>{
            f.t+=dt*f.s; f.x+=Math.cos(f.t)*12*dt; f.y+=Math.sin(f.t*1.3)*12*dt;
            if(f.x<0)f.x=R().width; if(f.x>R().width)f.x=0;
            if(f.y<0)f.y=R().height; if(f.y>R().height)f.y=0;
            const pulse=0.35+0.65*twinkle(f.t,2.2);
            ctx.beginPath();
            ctx.fillStyle=`hsla(${f.hue},80%,70%,${pulse})`;
            ctx.shadowColor=`hsla(${f.hue},100%,70%,${pulse})`; ctx.shadowBlur=10;
            ctx.arc(f.x,f.y,f.r*(1+pulse*0.4),0,Math.PI*2); ctx.fill();
            ctx.shadowBlur=0;
          });
        }
      };
    };

    // Sakura (clean petals — not hearts)
    const makeSakura = () => {
      type P={x:number;y:number;z:number;r:number;rot:number;vr:number;vx:number;vy:number;wob:number;h:number;shape:number};
      const petals:P[]=Array.from({length:D},()=>({
        x:rnd(0,R().width), y:rnd(-R().height,R().height),
        z:rnd(0.6,1.5), r:rnd(7,14), rot:rnd(0,Math.PI*2), vr:rnd(-1,1),
        vx:rnd(10,22), vy:rnd(24,46), wob:rnd(0.8,1.4), h:rnd(330,355), shape:(Math.random()*3)|0
      }));
      const petal = (ctx:CanvasRenderingContext2D, s:number, shape:number)=>{
        ctx.beginPath();
        if(shape===0){ // classic teardrop
          ctx.moveTo(0,-s*0.05);
          ctx.bezierCurveTo( s*0.70,-s*0.60,  s*0.92,s*0.10,  0,s*0.88);
          ctx.bezierCurveTo(-s*0.92,s*0.10, -s*0.70,-s*0.60,  0,-s*0.05);
        } else if(shape===1){ // slightly pointy
          ctx.moveTo(0,-s*0.18);
          ctx.bezierCurveTo( s*0.65,-s*0.55,  s*0.85,s*0.15,  0,s*0.90);
          ctx.bezierCurveTo(-s*0.85,s*0.15, -s*0.65,-s*0.55,  0,-s*0.18);
        } else { // notch variant
          ctx.moveTo(0,-s*0.06);
          ctx.bezierCurveTo( s*0.55,-s*0.62,  s*0.95,s*0.15,  0,s*0.92);
          ctx.bezierCurveTo(-s*0.95,s*0.15, -s*0.55,-s*0.62,  0,-s*0.06);
          ctx.save(); ctx.globalCompositeOperation="destination-out";
          ctx.arc(0,-s*0.04,s*0.16,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        ctx.closePath();
      };

      let t=0;
      return {
        draw(dt:number){
          const {width,height}=R(); t+=dt;
          ctx.clearRect(0,0,width,height);
          const wind = Math.sin(t*0.4)*18;

          petals.forEach(p=>{
            p.x += (p.vx + wind) * dt * (0.6 + p.z*0.4);
            p.y +=  p.vy        * dt * (0.7 + p.z*0.3);
            p.rot += p.vr*dt;
            p.x += Math.sin((t+p.rot)*p.wob) * 5 * dt; // flutter

            if(p.y>height+24){ p.y=-24; p.x=rnd(0,width); }  // recycle
            if(p.x>width+24){ p.x=-24; }

            const s = p.r * (0.65 + p.z*0.45);
            ctx.save();
            ctx.translate(p.x,p.y); ctx.rotate(p.rot);
            ctx.scale(1, 0.9 + Math.sin(t*1.2+p.rot)*0.1); // subtle flip

            const g = ctx.createRadialGradient(0,0,0,0,0,s);
            g.addColorStop(0, `hsla(${p.h},90%,92%,${0.95*opacity})`);
            g.addColorStop(1, `hsla(${p.h},75%,82%,${0.65*opacity})`);
            ctx.fillStyle=g; petal(ctx,s,p.shape); ctx.fill();

            ctx.strokeStyle="rgba(255,255,255,0.45)"; ctx.lineWidth=0.7; ctx.stroke();
            ctx.restore();
          });
        }
      };
    };

    // Matrix numeric columns with glow
    const makeMatrix = () => {
      const cols = Math.max(20, Math.floor(R().width / 14));
      const streams = Array.from({ length: cols }, (_, i) => ({
        x: Math.floor(i * (R().width / cols)),
        y: rnd(-R().height, 0),
        speed: rnd(90, 160),
        len: Math.floor(rnd(12, 26)),
        t: 0
      }));
      const glyphs = "0123456789";
      return {
        draw(dt: number) {
          const { width, height } = R();
          ctx.fillStyle = "rgba(0,0,0,0.12)";
          ctx.fillRect(0, 0, width, height);
          streams.forEach(s => {
            s.t += dt; s.y += s.speed * dt;
            if (s.y - s.len * 16 > height) {
              s.y = -rnd(0, height * 0.5); s.speed = rnd(90, 160); s.len = Math.floor(rnd(12, 26));
            }
            for (let i = 0; i < s.len; i++) {
              const y = s.y - i * 16;
              if (y < -16 || y > height + 16) continue;
              const a = Math.max(0, 1 - i / s.len);
              const head = i === 0;
              ctx.fillStyle = head ? "rgba(180,255,180,1)" : `rgba(0,255,128,${0.15 + a * 0.6})`;
              ctx.font = "14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
              ctx.fillText(glyphs[(Math.floor((s.t * 20 + i) % glyphs.length))], s.x, y);
            }
          });
        }
      };
    };

    // Confetti
    const makeConfetti = () => {
      const parts = Array.from({ length: D }, () => ({
        x: rnd(0, R().width), y: rnd(-R().height, 0),
        w: rnd(3, 7), h: rnd(6, 12),
        vy: rnd(60, 120), vx: rnd(-20, 20),
        rot: rnd(0, Math.PI * 2), vr: rnd(-1.2, 1.2),
        col: theme[Math.floor(rnd(0, theme.length))]
      }));
      return {
        draw(dt: number) {
          ctx.clearRect(0, 0, R().width, R().height);
          parts.forEach(p => {
            p.y += p.vy * dt; p.x += p.vx * dt; p.rot += p.vr * dt;
            if (p.y > R().height + 16) { p.y = -16; p.x = rnd(0, R().width); }
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
            ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
          });
        }
      };
    };

    // Bubbles
    const makeBubbles = () => {
      const b = Array.from({ length: Math.floor(D * 0.5) }, () => ({
        x: rnd(0, R().width), y: rnd(0, R().height), r: rnd(6, 14), vy: rnd(-16, -40)
      }));
      return {
        draw(dt: number) {
          ctx.clearRect(0, 0, R().width, R().height);
          b.forEach(o => {
            o.y += o.vy * dt;
            if (o.y < -o.r) { o.y = R().height + o.r; o.x = rnd(0, R().width); }
            ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1.2;
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke();
          });
        }
      };
    };

    // Meteors
    const makeMeteors = () => {
      const m = Array.from({ length: Math.floor(D * 0.2) }, () => ({
        x: rnd(-R().width * 0.2, R().width * 0.8),
        y: rnd(-R().height * 0.2, R().height * 0.5),
        vx: rnd(180, 260), vy: rnd(80, 140), len: rnd(40, 80)
      }));
      return {
        draw(dt: number) {
          ctx.clearRect(0, 0, R().width, R().height);
          m.forEach(s => {
            s.x += s.vx * dt; s.y += s.vy * dt;
            if (s.x > R().width + 40 || s.y > R().height + 40) {
              s.x = rnd(-R().width * 0.2, R().width * 0.1);
              s.y = rnd(-R().height * 0.2, R().height * 0.1);
            }
            const ang = Math.atan2(s.vy, s.vx);
            const tx = s.x - Math.cos(ang) * s.len;
            const ty = s.y - Math.sin(ang) * s.len;
            const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
            grad.addColorStop(0, "rgba(255,255,255,0.9)");
            grad.addColorStop(1, "rgba(255,255,255,0.0)");
            ctx.strokeStyle = grad; ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty); ctx.stroke();
          });
        }
      };
    };

    // Aurora (dark sky + stars + visible ribbons)
    const makeAurora = () => {
      const stars = Array.from({length:90},()=>({ x:rnd(0,R().width), y:rnd(0,R().height), r:rnd(0.7,1.5), tw:rnd(0,Math.PI*2) }));
      let T=0;
      return {
        draw(dt:number){
          T += dt*0.25;
          const {width,height}=R();

          // night sky
          const sky = ctx.createLinearGradient(0,0,0,height);
          sky.addColorStop(0,"#08101c"); sky.addColorStop(1,"#0a0d15");
          ctx.fillStyle=sky; ctx.fillRect(0,0,width,height);

          // twinkling stars
          stars.forEach(s=>{
            s.tw += dt*1.6; const a = 0.35 + 0.65*((Math.sin(s.tw)+1)/2);
            ctx.globalAlpha = opacity * a;
            ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
          });

          // aurora bands (additive glow)
          ctx.globalCompositeOperation="lighter";
          const bands = 3;
          for(let i=0;i<bands;i++){
            const col = colors[i%colors.length] || ["#7ef3ff","#a78bfa","#34d399"][i%3];
            ctx.strokeStyle=col; ctx.shadowColor=col; ctx.shadowBlur=26;
            ctx.lineWidth=30; ctx.globalAlpha = opacity * 0.28;

            ctx.beginPath();
            for(let x=0;x<=width;x+=16){
              const n = vnoise(x*0.012 + i*1.8, T + i*7.3);
              const y = height*0.22 + i*90 + (n-0.5)*160;
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke();

            // crisp inner line
            ctx.lineWidth=2; ctx.shadowBlur=0; ctx.globalAlpha = opacity * 0.85; ctx.stroke();
          }
          ctx.globalCompositeOperation="source-over"; ctx.globalAlpha=1;
        }
      };
    };

    // Mystic Smoke (ambient haze — no "worms")
    const makeSmoke = () => {
      const puffs = Array.from({length: Math.floor(D*0.55)}, ()=>({
        x:rnd(0,R().width), y:rnd(0,R().height), r:rnd(16,28), a:rnd(0.05,0.10)
      }));
      let t=0;
      return {
        draw(dt:number){
          t+=dt*0.23;
          const {width,height}=R();
          ctx.clearRect(0,0,width,height); // clear each frame so it's soft, not streaky

          puffs.forEach(p=>{
            const vx=(vnoise(p.x*0.006, p.y*0.006 + t)-0.5)*18;
            const vy=(vnoise(p.x*0.006+100, p.y*0.006 + t)-0.5)*16;
            p.x+=vx*dt; p.y+=vy*dt;
            if(p.x<-40) p.x=width+40; if(p.x>width+40) p.x=-40;
            if(p.y<-40) p.y=height+40; if(p.y>height+40) p.y=-40;

            const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
            g.addColorStop(0,`rgba(255,255,255,${p.a*opacity})`);
            g.addColorStop(1,`rgba(255,255,255,0)`);
            ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
          });
        }
      };
    };

    // Electric: random bolts that flash and fade
    const makeElectric = () => {
      let segs:any[]=[]; let cool=0;
      const newBolt=()=>{
        const x1=rnd(0,R().width), y1=rnd(0,R().height*0.5);
        const x2=rnd(0,R().width), y2=rnd(R().height*0.4,R().height);
        const n=12; const pts=[{x:x1,y:y1}];
        for(let i=1;i<n-1;i++){
          const t=i/(n-1);
          const x=x1+(x2-x1)*t + rnd(-14,14);
          const y=y1+(y2-y1)*t + rnd(-14,14);
          pts.push({x,y});
        }
        pts.push({x:x2,y:y2});
        segs.push({pts, life:0.18});
      };
      return {
        draw(dt:number){
          cool-=dt; if(cool<=0){ newBolt(); cool=rnd(0.25,0.6); }
          ctx.fillStyle="rgba(0,0,0,0.12)"; ctx.fillRect(0,0,R().width,R().height);
          segs.forEach(s=>{
            s.life-=dt;
            const a=clamp(s.life/0.18,0,1);
            ctx.strokeStyle=`rgba(173,216,255,${0.7*a})`; ctx.lineWidth=2.2;
            ctx.beginPath(); ctx.moveTo(s.pts[0].x,s.pts[0].y);
            for(let i=1;i<s.pts.length;i++) ctx.lineTo(s.pts[i].x,s.pts[i].y);
            ctx.stroke();
          });
          segs=segs.filter(s=>s.life>0);
        }
      };
    };

    const makeNeonTriangles = () => {
      const tris = Array.from({length:Math.floor(D*0.4)},()=>({
        x:rnd(0,R().width), y:rnd(0,R().height), r:rnd(10,24),
        vr:rnd(-0.6,0.6), rot:rnd(0,Math.PI*2), hue:rnd(170,320)
      }));
      return {
        draw(dt:number){
          ctx.clearRect(0,0,R().width,R().height);
          tris.forEach(t=>{
            t.rot+=t.vr*dt;
            ctx.save(); ctx.translate(t.x,t.y); ctx.rotate(t.rot);
            ctx.strokeStyle=`hsla(${t.hue},90%,60%,0.8)`; ctx.lineWidth=1.5; ctx.shadowBlur=8;
            ctx.shadowColor=`hsla(${t.hue},90%,60%,0.9)`;
            ctx.beginPath();
            ctx.moveTo(0,-t.r); ctx.lineTo(t.r*0.866,t.r*0.5); ctx.lineTo(-t.r*0.866,t.r*0.5); ctx.closePath();
            ctx.stroke(); ctx.restore(); ctx.shadowBlur=0;
          });
        }
      };
    };

    const makePaperPlanes = () => {
      const p = Array.from({length:Math.floor(D*0.25)},()=>({
        x:rnd(-R().width*0.2, R().width), y:rnd(-R().height*0.1, R().height*0.6),
        vx:rnd(60,110), vy:rnd(10,40), len:rnd(16,28), rot:rnd(-0.2,0.2)
      }));
      return {
        draw(dt:number){
          ctx.clearRect(0,0,R().width,R().height);
          p.forEach(o=>{
            o.x+=o.vx*dt; o.y+=o.vy*dt;
            if(o.x>R().width+40) { o.x=-40; o.y=rnd(0,R().height*0.5); }
            ctx.save(); ctx.translate(o.x,o.y); ctx.rotate(o.rot);
            ctx.fillStyle="rgba(255,255,255,0.9)";
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(o.len, o.len*0.4); ctx.lineTo(0, o.len*0.2); ctx.closePath(); ctx.fill();
            ctx.restore();
          });
        }
      };
    };

    // Emoji & Glyph rains (Emoji Rain back + more)
    const makeGlyphRain = (glyphs:string[], conf?:{vy:[number,number], font?:string}) => {
      const [vyMin, vyMax] = conf?.vy ?? [80,160];
      const font = conf?.font ?? "18px system-ui, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji";
      const drops = Array.from({length: Math.floor(D*0.6)},()=>({
        x: rnd(0,R().width), y: rnd(-R().height,0), vy: rnd(vyMin,vyMax), g: glyphs[Math.floor(Math.random()*glyphs.length)], rot: rnd(-0.25,0.25)
      }));
      return {
        draw(dt:number){
          const {width,height}=R(); ctx.clearRect(0,0,width,height);
          ctx.font = font; ctx.textBaseline = "middle";
          drops.forEach(d=>{
            d.y += d.vy*dt; if(d.y>height+24){ d.y=-24; d.x=rnd(0,width); }
            ctx.save(); ctx.translate(d.x,d.y); ctx.rotate(d.rot);
            ctx.globalAlpha = 0.9*opacity; ctx.fillText(d.g, 0, 0); ctx.restore();
          });
        }
      };
    };

    // Presets using the glyph engine
    const EMOJI_MAIN = ["🎵","✨","💜","🔥","🪙","⭐️","🎧","💎","🌸"];
    const EMOJI_HEARTS = ["💗","💘","💖","💝","💕"];
    const EMOJI_COINS  = ["🪙","💰","💵"];
    const EMOJI_STARS  = ["⭐️","🌟","✨"];

    const makeEmojiRain = () => makeGlyphRain(EMOJI_MAIN);
    const makeHeartsRain = () => makeGlyphRain(EMOJI_HEARTS, {vy:[70,130]});
    const makeCoinsRain = () => makeGlyphRain(EMOJI_COINS, {vy:[110,200]});
    const makeStarsRain = () => makeGlyphRain(EMOJI_STARS, {vy:[80,150]});

    // --- Rain (fast, layered drops + occasional splash)
    const makeRain = () => {
      const drops = Array.from({length: Math.floor(D*1.2)}, ()=>({
        x: rnd(0, R().width), y: rnd(-R().height, 0), vy: rnd(280, 420), len: rnd(10, 20)
      }));
      return {
        draw(dt:number){
          const {width,height}=R(); ctx.clearRect(0,0,width,height);
          ctx.globalAlpha = opacity * 0.8; ctx.strokeStyle="rgba(200,220,255,0.9)"; ctx.lineWidth=1;
          drops.forEach(d=>{
            d.y += d.vy*dt; if(d.y>height){ d.y = -10; d.x = Math.random()*width; }
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.len); ctx.stroke();
          });
        }
      };
    };

    // Butterflies (clear silhouette)
    const makeButterflies = () => {
      const n=Math.max(8, Math.floor(D*0.22));
      const bugs=Array.from({length:n},()=>({ x:rnd(0,R().width), y:rnd(0,R().height*0.6), t:rnd(0,Math.PI*2), s:rnd(0.55,1.1), hue:rnd(290,350) }));
      return {
        draw(dt:number){
          const {width,height}=R(); ctx.clearRect(0,0,width,height);
          bugs.forEach(b=>{
            b.t += dt*b.s;
            b.x += Math.cos(b.t*1.2)*22*dt; b.y += Math.sin(b.t*1.4)*16*dt;
            if(b.x<0) b.x=width; if(b.x>width) b.x=0; if(b.y<0) b.y=height; if(b.y>height) b.y=0;
            const flap = (Math.sin(b.t*10)+1)/2; // faster flap

            ctx.save(); ctx.translate(b.x,b.y);
            // wings
            ctx.fillStyle=`hsla(${b.hue},90%,70%,${0.85*opacity})`;
            ctx.beginPath(); ctx.ellipse(-7,0,10,6+flap*3,0,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse( 7,0,10,6+flap*3,0,0,Math.PI*2); ctx.fill();
            // body
            ctx.fillStyle=`hsla(${b.hue},60%,35%,${0.9*opacity})`;
            ctx.fillRect(-1.5,-5,3,10);
            // antennae
            ctx.strokeStyle=`hsla(${b.hue},60%,35%,${0.9*opacity})`; ctx.lineWidth=1;
            ctx.beginPath(); ctx.moveTo(0,-5); ctx.quadraticCurveTo(-3,-9,-4,-11);
            ctx.moveTo(0,-5); ctx.quadraticCurveTo( 3,-9, 4,-11); ctx.stroke();
            ctx.restore();
          });
        }
      };
    };

    // --- Music notes (fits your brand)
    const makeMusicNotes = () => {
      const NOTES = ["♪","♫","♬","♩","♭","♯"];
      const drops = Array.from({length: Math.floor(D*0.6)},()=>({
        x: rnd(0,R().width), y: rnd(-R().height,0), vy: rnd(60,120), ch: NOTES[Math.floor(Math.random()*NOTES.length)], rot: rnd(-0.3,0.3)
      }));
      return {
        draw(dt:number){
          const {width,height}=R(); ctx.clearRect(0,0,width,height);
          drops.forEach(d=>{
            d.y += d.vy*dt; if(d.y>height+20){ d.y=-20; d.x=Math.random()*width; }
            ctx.save(); ctx.translate(d.x,d.y); ctx.rotate(d.rot);
            ctx.font="18px ui-serif, Georgia, Times New Roman, serif";
            ctx.fillStyle=`rgba(255,255,255,${0.85*opacity})`;
            ctx.fillText(d.ch, 0, 0);
            ctx.restore();
          });
        }
      };
    };

    // --- Sparkles (quick celebratory shimmer)
    const makeSparkles = () => {
      const s = Array.from({length: D},()=>({
        x: rnd(0,R().width), y: rnd(0,R().height),
        t: rnd(0,Math.PI*2), s: rnd(0.6,1.4)
      }));
      return {
        draw(dt:number){
          ctx.clearRect(0,0,R().width,R().height);
          s.forEach(p=>{
            p.t += dt*2;
            const a = 0.25 + 0.75*((Math.sin(p.t*4)+1)/2);
            const r = 2 + 2*Math.sin(p.t)*p.s;
            ctx.save(); ctx.translate(p.x,p.y);
            ctx.globalAlpha = a*opacity;
            ctx.strokeStyle = "rgba(255,255,255,0.9)";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(r,0); ctx.moveTo(0,-r); ctx.lineTo(0,r); ctx.stroke();
            ctx.restore();
          });
        }
      };
    };

    // Engine registry
    const engines: Record<ParticlePreset, ()=>{draw:(dt:number)=>void}> = {
      none: () => ({ draw:()=>{} }),
      starfield: makeStarfield,
      snow: makeSnow,
      fireflies: makeFireflies,
      confetti: makeConfetti,
      bubbles: makeBubbles,
      meteors: makeMeteors,
      matrixDigits: makeMatrix,
      sakura: makeSakura,
      aurora: makeAurora,
      smoke: makeSmoke,
      electric: makeElectric,
      neonTriangles: makeNeonTriangles,
      paperPlanes: makePaperPlanes,
      emojiRain: makeEmojiRain,
      heartsRain: makeHeartsRain,
      coinsRain: makeCoinsRain,
      starsRain: makeStarsRain,
      rain: makeRain,
      butterflies: makeButterflies,
      musicNotes: makeMusicNotes,
      sparkles: makeSparkles,
    };

    const engine = (engines[preset] ?? engines.starfield)();
    let last = performance.now();
    const tick = (t:number)=>{ const dt=Math.min(0.05,(t-last)/1000); last=t; ctx.globalAlpha=opacity; engine.draw(dt); raf.current=requestAnimationFrame(tick); };
    raf.current=requestAnimationFrame(tick);
    return ()=>{ if(raf.current) cancelAnimationFrame(raf.current); ro.disconnect(); };
  }, [preset, density, opacity, zIndex, colors]);

  return <canvas ref={ref} />;
}