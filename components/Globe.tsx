"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import data from "@/lib/globe.json";

const W = 900, H = 990, CX = W / 2, CY = 475, R = 422;
const RAD = Math.PI / 180;
const ZOOM_IN = 3.3; // gros plan sur le Maroc au départ

type Ring = number[][];
type Item = { rings: Ring[]; lens: number[]; total: number; p: number; f: number };

const ringLen = (ring: Ring) => {
  let t = 0;
  for (let i = 1; i < ring.length; i++) t += Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
  return t;
};
const makeItem = (rings: Ring[]): Item => {
  const lens = rings.map(ringLen);
  return { rings, lens, total: lens.reduce((a, b) => a + b, 0), p: 0, f: 0 };
};

const land = data.land as number[];
const morocco = data.morocco as { label: string; city: { name: string; lon: number; lat: number }; cam: { lon: number; lat: number }; regions: { name: string; rings: Ring[] }[] };
const world = data.world as { name: string; lon: number; rings: Ring[] }[];

/**
 * Globe en points. Il démarre en gros plan sur le Maroc, qu'un curseur de souris trace région par région.
 * Puis la vue s'éloigne, le globe tourne sur lui-même et tous les autres pays se dessinent avec la même logique.
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
    const view = { lon: morocco.cam.lon, lat: morocco.cam.lat, zoom: ZOOM_IN };
    const mItems = morocco.regions.map((r) => makeItem(r.rings));
    const wItems = world.map((c) => makeItem(c.rings));
    const group = { m: 1, w: 1, pin: 0 };
    const cursor = { a: 0, lon: 0, lat: 0 };
    const fillGrad = ctx.createLinearGradient(CX - R, CY - R, CX + R, CY + R);
    fillGrad.addColorStop(0, "rgba(255,61,0,.85)");
    fillGrad.addColorStop(0.55, "rgba(255,122,0,.6)");
    fillGrad.addColorStop(1, "rgba(255,179,71,.4)");

    let sinP0 = 0, cosP0 = 1, lon0 = 0, Rz = R;
    // projection orthographique ; c > 0 = face visible
    const proj = (lon: number, lat: number) => {
      const l = (lon - lon0) * RAD, p = lat * RAD;
      const cp = Math.cos(p), sp = Math.sin(p), cl = Math.cos(l);
      return { x: cp * Math.sin(l), y: cosP0 * sp - sinP0 * cp * cl, c: sinP0 * sp + cosP0 * cp * cl };
    };
    const sx = (x: number) => CX + Rz * x;
    const sy = (y: number) => CY - Rz * y;

    const polyline = (pts: Ring, upTo: number) => {
      let pen = false;
      for (let i = 0; i < upTo; i++) {
        const q = proj(pts[i][0], pts[i][1]);
        if (q.c <= 0) { pen = false; continue; }
        if (!pen) ctx.moveTo(sx(q.x), sy(q.y)); else ctx.lineTo(sx(q.x), sy(q.y));
        pen = true;
      }
    };

    const fillItem = (it: Item, alpha: number) => {
      if (it.f < 0.01) return;
      ctx.globalAlpha = alpha * it.f * 0.55;
      ctx.fillStyle = fillGrad;
      ctx.beginPath();
      it.rings.forEach((ring) => {
        ring.forEach(([lo, la], i) => {
          const q = proj(lo, la);
          let x = q.x, y = q.y;
          if (q.c < 0) { const d = Math.hypot(x, y) || 1; x /= d; y /= d; } // point caché : ramené sur l'horizon
          if (i) ctx.lineTo(sx(x), sy(y)); else ctx.moveTo(sx(x), sy(y));
        });
        ctx.closePath();
      });
      ctx.fill();
    };

    const strokeItem = (it: Item, alpha: number, w: number, glow = true) => {
      if (it.p < 0.001) return;
      const hot = it.p < 0.999;
      const pass = (width: number, color: string, a: number) => {
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.globalAlpha = a * alpha;
        ctx.beginPath();
        let rem = it.p * it.total;
        it.rings.forEach((ring, k) => {
          if (rem <= 0) return;
          let upTo = ring.length;
          if (rem < it.lens[k]) {
            let acc = 0; upTo = 1;
            while (upTo < ring.length && acc < rem) { acc += Math.hypot(ring[upTo][0] - ring[upTo - 1][0], ring[upTo][1] - ring[upTo - 1][1]); upTo++; }
          }
          polyline(ring, upTo);
          rem -= it.lens[k];
        });
        ctx.stroke();
      };
      if (glow) {
        pass(w * 2.6, "rgba(255,122,0,1)", 0.16);
        pass(hot ? w * 1.2 : w * 0.7, hot ? "#FFD9A0" : "#FF8A1F", hot ? 1 : 0.85);
      } else {
        pass(hot ? w * 1.1 : w * 0.8, hot ? "#FFD9A0" : "#FFB347", hot ? 0.9 : 0.42);
      }
    };

    // fin cercle fixe autour du globe
    const orbit = (front: boolean) => {
      if (front) return;
      ctx.save();
      ctx.strokeStyle = "rgba(247,247,245,.11)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CX, CY, R * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      lon0 = view.lon;
      sinP0 = Math.sin(view.lat * RAD);
      cosP0 = Math.cos(view.lat * RAD);
      Rz = R * view.zoom;
      const detail = Math.sqrt(view.zoom);
      ctx.clearRect(0, 0, W, H);
      orbit(false);

      // sphère (la fenêtre circulaire reste fixe, le globe s'agrandit à l'intérieur)
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();
      const sphere = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.1, CX, CY, R);
      sphere.addColorStop(0, "#4a2310");
      sphere.addColorStop(0.55, "#1d0d06");
      sphere.addColorStop(1, "#060302");
      ctx.fillStyle = sphere;
      ctx.fillRect(0, 0, W, H);

      // graticule
      ctx.strokeStyle = "rgba(255,170,90,.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let lo = -180; lo < 180; lo += 30) {
        const m: Ring = [];
        for (let la = -85; la <= 85; la += 5) m.push([lo, la]);
        polyline(m, m.length);
      }
      for (let la = -60; la <= 60; la += 30) {
        const m: Ring = [];
        for (let lo = -180; lo <= 180; lo += 5) m.push([lo, la]);
        polyline(m, m.length);
      }
      ctx.stroke();

      // terres en points
      ctx.fillStyle = "#F7F7F5";
      for (let i = 0; i < land.length; i += 2) {
        const q = proj(land[i], land[i + 1]);
        if (q.c < 0.05) continue;
        const s = (0.9 + 1.3 * q.c) * detail;
        ctx.globalAlpha = 0.1 + 0.28 * q.c;
        ctx.fillRect(sx(q.x) - s / 2, sy(q.y) - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      // pays du monde
      if (group.w > 0.01) wItems.forEach((it) => strokeItem(it, group.w, 1, false));
      // le Maroc, par régions
      if (group.m > 0.01) {
        mItems.forEach((it) => fillItem(it, group.m));
        mItems.forEach((it) => strokeItem(it, group.m, detail));
      }
      ctx.globalAlpha = 1;
      // relief : la sphere s assombrit vers le bas a droite, comme eclairee en haut a gauche
      const shade = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.25, CX, CY, R * 1.05);
      shade.addColorStop(0, "rgba(0,0,0,0)");
      shade.addColorStop(0.6, "rgba(0,0,0,.16)");
      shade.addColorStop(1, "rgba(0,0,0,.6)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // bord lumineux de la sphère
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

      orbit(true);

      // Marrakech
      if (group.pin > 0.01) {
        const q = proj(morocco.city.lon, morocco.city.lat);
        if (q.c > 0.05) {
          const x = sx(q.x), y = sy(q.y);
          const k = Math.sqrt(view.zoom);
          ctx.globalAlpha = group.pin;
          ctx.fillStyle = "rgba(255,122,0,.3)";
          ctx.beginPath(); ctx.arc(x, y, 12 * k, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#FFB347";
          ctx.beginPath(); ctx.arc(x, y, 5.5 * k, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#F7F7F5";
          ctx.font = `600 ${Math.round(15 * k)}px var(--font-display), sans-serif`;
          ctx.fillText(morocco.city.name.split("").join(String.fromCharCode(8202)), x + 16 * k, y + 6 * k);
          ctx.globalAlpha = 1;
        }
      }

      // curseur de souris
      if (cursor.a > 0.01) {
        const q = proj(cursor.lon, cursor.lat);
        if (q.c > 0) {
          ctx.save();
          ctx.globalAlpha = cursor.a;
          ctx.translate(sx(q.x), sy(q.y));
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
      mItems.forEach((it) => { it.p = 1; it.f = 1; });
      group.pin = 1;
      lab.textContent = morocco.label;
      lab.style.opacity = "1";
      draw();
      return;
    }

    /* ---------- séquence animée ---------- */
    const point = (it: Item, p: number): number[] => {
      let rem = p * it.total;
      for (let k = 0; k < it.rings.length; k++) {
        const ring = it.rings[k];
        if (rem <= it.lens[k] || k === it.rings.length - 1) {
          let acc = 0;
          for (let i = 1; i < ring.length; i++) {
            const d = Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
            if (acc + d >= rem) { const t = d ? (rem - acc) / d : 0; return [ring[i - 1][0] + (ring[i][0] - ring[i - 1][0]) * t, ring[i - 1][1] + (ring[i][1] - ring[i - 1][1]) * t]; }
            acc += d;
          }
          return ring[ring.length - 1];
        }
        rem -= it.lens[k];
      }
      return it.rings[0][0];
    };

    const ctxG = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      /* 1. gros plan sur le Maroc, tracé au curseur */
      tl.set(lab, { opacity: 0 });
      tl.set(group, { m: 1, w: 1, pin: 0 });
      tl.set(mItems, { p: 0, f: 0 });
      tl.set(wItems, { p: 0, f: 0 });
      tl.to(view, { lon: morocco.cam.lon, lat: morocco.cam.lat, zoom: ZOOM_IN, duration: 0.8, ease: "power3.inOut" });
      tl.call(() => { lab.textContent = morocco.label; });
      tl.to(lab, { opacity: 1, duration: 0.5 });
      const start = tl.duration();
      const n = mItems.length, per = Math.min(0.42, Math.max(0.22, 4.4 / n)), base = 0.4;
      tl.to(cursor, { a: 1, duration: 0.25 }, start);
      mItems.forEach((it, i) => {
        const at = start + base + i * per * 0.9;
        tl.to(it, {
          p: 1, duration: per, ease: "power1.inOut",
          onUpdate: () => { const [lo, la] = point(it, it.p); cursor.lon = lo; cursor.lat = la; },
        }, at);
        tl.to(it, { f: 1, duration: 0.7, ease: "power2.out" }, at + 0.15);
      });
      const end = start + base + (n - 1) * per * 0.9 + per;
      tl.to(cursor, { a: 0, duration: 0.3 }, end);
      tl.to(group, { pin: 1, duration: 0.6 }, end + 0.1);

      /* 2. la vue s'éloigne, le globe tourne, tous les pays se dessinent */
      const t2 = end + 1.8;
      const T = 16, lonS = morocco.cam.lon;
      tl.to(lab, { opacity: 0, duration: 0.4 }, t2 - 0.2);
      tl.call(() => { lab.textContent = "PARTOUT DANS LE MONDE"; }, [], t2 + 0.3);
      tl.to(lab, { opacity: 1, duration: 0.6 }, t2 + 0.5);
      tl.to(view, { zoom: 1, lat: 22, duration: 2.4, ease: "power3.inOut" }, t2);
      tl.to(view, { lon: lonS + 360, duration: T, ease: "none" }, t2);

      const order = world
        .map((c, i) => {
          let d = (((c.lon - lonS) % 360) + 360) % 360;
          if (d > 320) d -= 360; // juste à l'ouest du Maroc : visible tout de suite
          return { i, t: Math.max(0.9, (d - 38) / (360 / T)) };
        })
        .sort((a, b) => a.t - b.t);
      order.forEach(({ i, t }, k) => {
        const at = t2 + t + (k % 4) * 0.05;
        tl.to(wItems[i], { p: 1, duration: 0.9, ease: "power1.inOut" }, at);
      });

      /* 3. fin : plus de boucle, le globe continue de tourner doucement et les pays restent allumes */
      const t3 = t2 + T + 1.2;
      tl.to(lab, { opacity: 0, duration: 0.6 }, t3);
      tl.call(() => {
        ctxG.add(() => {
          gsap.to(view, { lon: "+=360", duration: 150, ease: "none", repeat: -1 });
        });
      }, [], t3);

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
      <canvas ref={canvas} id="heroCanvas" width={W} height={H} role="img" aria-label="Globe : gros plan sur le Maroc tracé région par région, puis tous les pays du monde" />
      <div className="globe__label" ref={label} aria-hidden="true" />
    </>
  );
}
