export type PaintOpts = { dark?: boolean; blobs?: number; ribbons?: number; shape?: boolean };

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function paint(canvas: HTMLCanvasElement, seed: number, opts: PaintOpts = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width, H = canvas.height, r = rng(seed);
  const dark = opts.dark ?? true;
  ctx.fillStyle = dark ? "#0c0c0c" : "#f3f1ec";
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, dark ? "#161616" : "#e8e4dc");
  g.addColorStop(1, dark ? "#050505" : "#d8d2c6");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const n = opts.blobs ?? 5;
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * H, rad = (0.25 + r() * 0.45) * Math.max(W, H);
    const hot = r() < 0.6;
    const rg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const col = hot ? (r() < 0.5 ? "255,90,31" : "255,122,0") : dark ? "255,179,71" : "255,61,0";
    rg.addColorStop(0, `rgba(${col},${hot ? 0.85 : 0.35})`);
    rg.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  // ribbon
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  for (let k = 0; k < (opts.ribbons ?? 3); k++) {
    const y0 = r() * H;
    ctx.beginPath();
    ctx.moveTo(-50, y0);
    for (let x = 0; x <= W + 50; x += W / 6) {
      ctx.quadraticCurveTo(x + W / 12, y0 + (r() - 0.5) * H * 0.8, x + W / 6, y0 + (r() - 0.5) * H * 0.5);
    }
    const lg = ctx.createLinearGradient(0, 0, W, 0);
    lg.addColorStop(0, "rgba(255,61,0,0)");
    lg.addColorStop(0.5, "rgba(255,179,71,.55)");
    lg.addColorStop(1, "rgba(255,122,0,0)");
    ctx.strokeStyle = lg;
    ctx.lineWidth = (0.05 + r() * 0.12) * Math.min(W, H);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
  // vignette + grain
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.8);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, dark ? "rgba(0,0,0,.65)" : "rgba(0,0,0,.15)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 16) {
    const gr = (r() - 0.5) * 22;
    d[i] += gr; d[i + 1] += gr; d[i + 2] += gr;
  }
  ctx.putImageData(img, 0, 0);
  // geometric accent
  if (opts.shape !== false) {
    ctx.strokeStyle = "rgba(247,247,245,.18)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(W * 0.72, H * 0.3, Math.min(W, H) * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W * 0.1, H * 0.85);
    ctx.lineTo(W * 0.4, H * 0.85);
    ctx.stroke();
  }
}
