export function makeAurora() {
  let t = 0;
  
  const band = (ctx: CanvasRenderingContext2D, w: number, h: number, hue: number, amp: number, yoff: number) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, `hsla(${hue},85%,70%,0)`);
    g.addColorStop(.25, `hsla(${hue},85%,70%,.25)`);
    g.addColorStop(.5, `hsla(${hue},85%,70%,.35)`);
    g.addColorStop(1, `hsla(${hue},85%,70%,0)`);
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(0, h * .25 + yoff);
    for (let x = 0; x <= w; x += 8) {
      const y = h * .25 + yoff + Math.sin(x * .01 + t * .6) * amp * (0.6 + Math.cos(t * .2) * 0.4);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
  };

  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random() * .5,
    s: Math.random() * 1.5 + .3
  }));

  return {
    draw(ctx: CanvasRenderingContext2D, dt: number, w: number, h: number, dpr: number) {
      t += dt / 1000;

      // Background night gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0b1222');
      sky.addColorStop(1, '#1a1130');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Stars with twinkling
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      stars.forEach(s => {
        const tw = (Math.sin(t * 4 + s.x * 20) + 1) / 2; // twinkle 0..1
        ctx.globalAlpha = 0.25 + tw * 0.75;
        ctx.fillRect(Math.floor(s.x * w), Math.floor(s.y * h), s.s, s.s);
      });
      ctx.globalAlpha = 1;

      // Aurora bands (screen for glow)
      ctx.globalCompositeOperation = 'screen';
      band(ctx, w, h, 175, 60, h * 0.05);
      band(ctx, w, h, 135, 45, h * 0.12);
      band(ctx, w, h, 205, 50, h * 0.18);
      ctx.globalCompositeOperation = 'source-over';
    },
    dispose() {}
  };
}