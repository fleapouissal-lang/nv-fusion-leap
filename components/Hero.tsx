"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/lenis";

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const W = c.width, H = c.height, reduce = prefersReducedMotion();
    let t = 0, raf = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#121212");
      bg.addColorStop(1, "#050505");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W * 0.55, H * 0.45, 0, W * 0.55, H * 0.45, W * 0.7);
      glow.addColorStop(0, "rgba(255,90,31,.55)");
      glow.addColorStop(1, "rgba(255,90,31,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let k = 0; k < 7; k++) {
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const p = i / 80, ang = p * Math.PI * 3 + t * 0.5 + k * 0.35, rad = W * 0.22 + Math.sin(p * 6 + t + k) * W * 0.07;
          const x = W / 2 + Math.cos(ang) * rad, y = H * 0.5 + Math.sin(ang) * rad * 0.72 + Math.sin(p * 4 + t * 0.8) * H * 0.05;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        const lg = ctx.createLinearGradient(0, 0, W, H);
        lg.addColorStop(0, `rgba(255,61,0,${0.08 + k * 0.05})`);
        lg.addColorStop(0.5, `rgba(255,122,0,${0.18 + k * 0.04})`);
        lg.addColorStop(1, `rgba(255,179,71,${0.1 + k * 0.05})`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = W * (0.085 - k * 0.009);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(247,247,245,.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.5, W * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.5, W * 0.46, W * 0.2, -0.5 + t * 0.1, 0, Math.PI * 2);
      ctx.stroke();
      t += reduce ? 0 : 0.008;
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    draw();
    // l'animation ne tourne que si l'onglet est visible ET que le hero est à l'écran
    let onScreen = true;
    const sync = () => {
      cancelAnimationFrame(raf);
      if (!reduce && onScreen && !document.hidden) draw();
    };
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting === onScreen) return;
      onScreen = en.isIntersecting;
      sync();
    });
    io.observe(c);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} id="heroCanvas" width={720} height={792} aria-label="Sculpture abstraite orange, signature visuelle de Fusion Leap" role="img" />;
}

export default function Hero() {
  return (
    <section className="hero" id="accueil">
      <div className="hero__glow" aria-hidden="true"><i /><i /></div>
      <div className="wrap">
        <div className="hero__grid">
          <div className="hero__text">
            <span className="eyebrow reveal-now">Agence de communication · Marrakech</span>
            <h1 id="h1" style={{ marginTop: 28 }}>
              <span className="w"><b>Nous</b></span> <span className="w"><b>créons</b></span><br />
              <span className="w"><b>des</b></span> <span className="w"><b>marques</b></span><br />
              <span className="w"><b>qui</b></span> <span className="w"><b className="grad-text">marquent.</b></span>
            </h1>
            <p className="lead">Fusion Leap est une agence de communication créative qui transforme vos ambitions en identités fortes, expériences digitales et résultats mesurables.</p>
            <div className="hero__ctas">
              <a className="btn btn--grad magnetic" href="#realisations">Découvrir nos réalisations <span className="arr">↗</span></a>
              <a className="btn btn--ghost magnetic" href="#devis">Parlons de votre projet <span className="arr">↗</span></a>
            </div>
          </div>
          <div className="hero__visual" id="heroVisual">
            <HeroCanvas />
            <span className="tag tag--1"><i />Branding</span>
            <span className="tag tag--2"><i />Expériences digitales</span>
            <span className="tag tag--3"><i />Est. Marrakech</span>
          </div>
        </div>
        <a className="scroll-hint" href="#agence" aria-label="Défiler vers la suite">
          <span className="scroll-hint__mouse"><i /></span>
          <span className="scroll-hint__txt">Scroll</span>
          <span className="scroll-hint__chev" aria-hidden="true"><b /><b /></span>
        </a>
      </div>
    </section>
  );
}
