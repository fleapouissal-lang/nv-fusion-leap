"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import data from "@/lib/globe.json";

const W = 900, H = 990, CX = W / 2, CY = 470, R = 395;
const RAD = Math.PI / 180;

type Region = { name: string; rings: number[][][] };
type CountryData = { key: string; label: string; city: { name: string; lon: number; lat: number }; cam: { lon: number; lat: number }; regions: Region[] };
const countries = data.countries as CountryData[];
const land = data.land as number[];

// longueur de chaque anneau (en degrés), pour tracer un pourcentage du contour
const lens = countries.map((c) =>
  c.regions.map((r) =>
    r.rings.map((ring) => {
      let t = 0;
      for (let i = 1; i < ring.length; i++) t += Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
      return t;
    })
  )
);

type RegState = { p: number; f: number };
type CState = { a: number; pin: number; regs: RegState[] };

/**
 * Globe en points : il se tourne vers le Maroc, le trace région par région au curseur de souris, puis pivote
 * vers l'Arabie saoudite, la France et l'Espagne et les trace de la même façon. Les pays terminés restent allumés.
 */
export default function Globe() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const lab = label.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || !lab) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const view = { lon: countries[0].cam.lon, lat: countries[0].cam.lat };
    const states: CState[] = countries.map((c) => ({ a: 0, pin: 0, regs: c.regions.map(() => ({ p: 0, f: 0 })) }));
    const cursor = { a: 0, lon: 0, lat: 0, show: false };

    const fillGrad = ctx.createLinearGradient(CX - R, CY - R, CX + R, CY + R);
    fillGrad.addColorStop(0, "rgba(255,61,0,.85)");
    fillGrad.addColorStop(0.55, "rgba(255,122,0,.6)");
    fillGrad.addColorStop(1, "rgba(255,179,71,.4)");

    let sinP0 = 0, cosP0 = 1, lon0 = 0;
    // projection orthographique ; c > 0 = face visible
    const proj = (lon: number, lat: number) => {
      const l = (lon - lon0) * RAD, p = lat * RAD;
      const cp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l);
      const c = sinP0 * sp + cosP0 * cp * cl;
      return { x: cp * Math.sin(l), y: cosP0 * sp - sinP0 * cp * cl, c };
    };
    const sx = (x: number) => CX + R * x;
    const sy = (y: number) => CY - R * y;

    const polyline = (pts: number[][], upTo: number) => {
      let pen = false, last = false;
      for (let i = 0; i < upTo; i++) {
        const q = proj(pts[i][0], pts[i][1]);
        if (q.c <= 0) { pen = false; continue; }
        if (!pen) ctx.moveTo(sx(q.x), sy(q.y)); else ctx.lineTo(sx(q.x), sy(q.y));
        pen = true; last = true;
      }
      return last;
    };

    const draw = () => {
      lon0 = view.lon;
      sinP0 = Math.sin(view.lat * RAD);
      cosP0 = Math.cos(view.lat * RAD);
      ctx.clearRect(0, 0, W, H);

      // halo
      const halo = ctx.createRadialGradient(CX, CY, R * 0.8, CX, CY, R * 1.4);
      halo.addColorStop(0, "rgba(255,90,31,.3)");
      halo.addColorStop(1, "rgba(255,90,31,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      // sphère
      const sphere = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.1, CX, CY, R);
      sphere.addColorStop(0, "#232323");
      sphere.addColorStop(1, "#060606");
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();

      // graticule
      ctx.strokeStyle = "rgba(247,247,245,.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let lo = -180; lo < 180; lo += 30) {
        const m: number[][] = [];
        for (let la = -85; la <= 85; la += 5) m.push([lo, la]);
        polyline(m, m.length);
      }
      for (let la = -60; la <= 60; la += 30) {
        const m: number[][] = [];
        for (let lo = -180; lo <= 180; lo += 5) m.push([lo, la]);
        polyline(m, m.length);
      }
      ctx.stroke();

      // terres en points
      ctx.fillStyle = "#F7F7F5";
      for (let i = 0; i < land.length; i += 2) {
        const q = proj(land[i], land[i + 1]);
        if (q.c < 0.05) continue;
        const s = 1.1 + 1.5 * q.c;
        ctx.globalAlpha = 0.1 + 0.28 * q.c;
        ctx.fillRect(sx(q.x) - s / 2, sy(q.y) - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      // pays tracés
      countries.forEach((c, ci) => {
        const st = states[ci];
        if (st.a < 0.01) return;
        c.regions.forEach((reg, ri) => {
          const rs = st.regs[ri];
          // remplissage
          if (rs.f > 0.01) {
            ctx.globalAlpha = st.a * rs.f * 0.55;
            ctx.fillStyle = fillGrad;
            ctx.beginPath();
            reg.rings.forEach((ring) => {
              ring.forEach(([lo, la], i) => {
                const q = proj(lo, la);
                let x = q.x, y = q.y;
                if (q.c < 0) { const d = Math.hypot(x, y) || 1; x /= d; y /= d; } // point caché : ramené sur l'horizon
                if (i) ctx.lineTo(sx(x), sy(y)); else ctx.moveTo(sx(x), sy(y));
              });
              ctx.closePath();
            });
            ctx.fill();
          }
          // contour tracé
          if (rs.p > 0.001) {
            const total = lens[ci][ri].reduce((a, b) => a + b, 0);
            let left = rs.p * total;
            const hot = rs.p < 0.999;
            const strokeRings = (width: number, color: string, alpha: number) => {
              ctx.lineWidth = width;
              ctx.strokeStyle = color;
              ctx.globalAlpha = alpha * st.a;
              ctx.beginPath();
              let rem = left;
              reg.rings.forEach((ring, k) => {
                if (rem <= 0) return;
                const L = lens[ci][ri][k];
                let upTo = ring.length;
                if (rem < L) {
                  let acc = 0; upTo = 1;
                  while (upTo < ring.length && acc < rem) { acc += Math.hypot(ring[upTo][0] - ring[upTo - 1][0], ring[upTo][1] - ring[upTo - 1][1]); upTo++; }
                }
                polyline(ring, upTo);
                rem -= L;
              });
              ctx.stroke();
            };
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            strokeRings(7, "rgba(255,122,0,1)", 0.16);
            strokeRings(hot ? 2.6 : 1.5, hot ? "#FFD9A0" : "#FF8A1F", hot ? 1 : 0.85);
          }
        });
        ctx.globalAlpha = 1;
      });
      ctx.restore();

      // bord de la sphère
      const rim = ctx.createRadialGradient(CX, CY, R * 0.9, CX, CY, R);
      rim.addColorStop(0, "rgba(255,122,0,0)");
      rim.addColorStop(1, "rgba(255,122,0,.35)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(247,247,245,.16)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // villes
      const now = performance.now() / 1000;
      countries.forEach((c, ci) => {
        const st = states[ci];
        if (st.pin < 0.01) return;
        const q = proj(c.city.lon, c.city.lat);
        if (q.c <= 0.05) return;
        const x = sx(q.x), y = sy(q.y);
        const pulse = (now % 2.4) / 2.4;
        ctx.globalAlpha = st.pin * st.a * (1 - pulse);
        ctx.strokeStyle = "#FFB347";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 8 + pulse * 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = st.pin * st.a;
        ctx.fillStyle = "rgba(255,122,0,.3)";
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#FFB347";
        ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#F7F7F5";
        ctx.font = "600 17px var(--font-display), sans-serif";
        ctx.fillText(c.city.name.split("").join(String.fromCharCode(8202)), x + 16, y + 6);
        ctx.globalAlpha = 1;
      });

      // curseur de souris
      if (cursor.a > 0.01) {
        const q = proj(cursor.lon, cursor.lat);
        if (q.c > 0) {
          const x = sx(q.x), y = sy(q.y);
          ctx.save();
          ctx.globalAlpha = cursor.a;
          ctx.translate(x, y);
          ctx.scale(1.35, 1.35);
          ctx.shadowColor = "rgba(255,179,71,.9)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "#120600";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(0, 17); ctx.lineTo(4.6, 12.9); ctx.lineTo(7.6, 20); ctx.lineTo(10.4, 18.8); ctx.lineTo(7.5, 11.8); ctx.lineTo(13.5, 11.8);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }
      }
    };

    /* ---------- rendu statique (mouvement réduit) : le Maroc, déjà tracé ---------- */
    if (reduce) {
      states[0].a = 1; states[0].pin = 1;
      states[0].regs.forEach((r) => { r.p = 1; r.f = 1; });
      lab.textContent = countries[0].label;
      lab.style.opacity = "1";
      draw();
      return;
    }

    /* ---------- séquence animée ---------- */
    const point = (ci: number, ri: number, p: number) => {
      const reg = countries[ci].regions[ri];
      let rem = p * lens[ci][ri].reduce((a, b) => a + b, 0);
      for (let k = 0; k < reg.rings.length; k++) {
        const L = lens[ci][ri][k];
        const ring = reg.rings[k];
        if (rem <= L || k === reg.rings.length - 1) {
          let acc = 0;
          for (let i = 1; i < ring.length; i++) {
            const d = Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
            if (acc + d >= rem) { const t = d ? (rem - acc) / d : 0; return [ring[i - 1][0] + (ring[i][0] - ring[i - 1][0]) * t, ring[i - 1][1] + (ring[i][1] - ring[i - 1][1]) * t]; }
            acc += d;
          }
          return ring[ring.length - 1];
        }
        rem -= L;
      }
      return reg.rings[0][0];
    };

    const ctxG = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, paused: true });
      tl.set(lab, { opacity: 0 });

      countries.forEach((c, ci) => {
        const st = states[ci];
        const n = c.regions.length;
        const per = Math.min(0.42, Math.max(0.2, 4.2 / n));
        const base = 0.35;

        tl.to(view, { lon: c.cam.lon, lat: c.cam.lat, duration: ci === 0 ? 1.4 : 1.9, ease: "power3.inOut" });
        tl.call(() => { lab.textContent = c.label; });
        tl.to(lab, { opacity: 1, duration: 0.5 }, "<+0.9");
        const start = tl.duration();
        tl.set(st, { a: 1, pin: 0 }, start);
        tl.set(st.regs, { p: 0, f: 0 }, start);
        tl.to(cursor, { a: 1, duration: 0.25 }, start);

        c.regions.forEach((_, ri) => {
          const at = start + base + ri * per * 0.9;
          tl.to(st.regs[ri], {
            p: 1, duration: per, ease: "power1.inOut",
            onUpdate: () => { const [lo, la] = point(ci, ri, st.regs[ri].p); cursor.lon = lo; cursor.lat = la; },
          }, at);
          tl.to(st.regs[ri], { f: 1, duration: 0.7, ease: "power2.out" }, at + 0.15);
        });

        const end = start + base + (n - 1) * per * 0.9 + per;
        tl.to(cursor, { a: 0, duration: 0.3 }, end);
        tl.to(st, { pin: 1, duration: 0.6 }, end + 0.1);
        tl.set({}, {}, end + 1.9); // pause : le pays reste allumé
        if (ci < countries.length - 1) tl.to(lab, { opacity: 0, duration: 0.35 }, end + 1.5);
      });

      // fin de boucle : tout s'éteint avant de recommencer
      tl.to(lab, { opacity: 0, duration: 0.4 });
      tl.to(states, { a: 0, duration: 1, ease: "power2.in" }, "<");

      let running = false;
      const run = (on: boolean) => {
        if (on === running) return;
        running = on;
        if (on) { gsap.ticker.add(draw); tl.play(); } else { gsap.ticker.remove(draw); tl.pause(); }
      };
      let visible = true;
      const sync = () => run(visible && !document.hidden);
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); });
      io.observe(cv);
      document.addEventListener("visibilitychange", sync);
      sync();

      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
        gsap.ticker.remove(draw);
      };
    });

    return () => ctxG.revert();
  }, []);

  return (
    <>
      <canvas ref={canvas} id="heroCanvas" width={W} height={H} role="img" aria-label="Globe qui se tourne vers le Maroc, l'Arabie saoudite, la France et l'Espagne et trace leurs régions" />
      <div className="globe__label" ref={label} aria-hidden="true" />
    </>
  );
}
