"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import map from "@/lib/morocco.json";
import world from "@/lib/world.json";

gsap.registerPlugin(ScrollTrigger);

const PER_REGION = 0.5; // secondes de tracé par région (voir aussi globals.css)
const { w: W, h: H, m, focus, dots, points: P, labels } = world;
const FULL = `0 0 ${W} ${H}`;
const START = `${focus.x} ${focus.y} ${focus.w} ${focus.h}`;

// repère de la carte détaillée du Maroc -> repère du monde
const toWorld = (x: number, y: number) => ({ x: m.a * x + m.e, y: m.d * y + m.f });

// arc courbe entre deux points, relevé vers le haut
const arc = (a: { x: number; y: number }, b: { x: number; y: number }, lift: number) =>
  `M${a.x} ${a.y}Q${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - lift} ${b.x} ${b.y}`;
const toEurope = arc(P.marrakech, P.paris, 70);
const toGulf = arc(P.marrakech, P.riyadh, 170);

/**
 * Carte du Maroc par régions (données geoBoundaries / OpenStreetMap, ODbL).
 * Un curseur de souris trace le contour région par région ; une fois le Maroc terminé, la vue s'éloigne
 * et les autres pays apparaissent autour (Europe, Arabie saoudite), reliés depuis Marrakech.
 */
export default function MoroccoMap() {
  const svg = useRef<SVGSVGElement>(null);
  const cursor = useRef<SVGGElement>(null);
  const pen1 = useRef<SVGAnimateMotionElement>(null);
  const pen2 = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    const el = svg.current;
    const cur = cursor.current;
    if (!el || !cur) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("viewBox", FULL);
      el.classList.add("drawn", "out", "instant");
      return;
    }

    const lines = [...el.querySelectorAll<SVGPathElement>(".morocco__line")];
    const lens = lines.map((l) => l.getTotalLength());
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let started = false;
    const timers: number[] = [];

    // le curseur suit sa cible avec un léger retard, comme une vraie souris
    const follow = () => {
      pos.x += (target.x - pos.x) * 0.3;
      pos.y += (target.y - pos.y) * 0.3;
      gsap.set(cur, { x: pos.x, y: pos.y });
    };

    const ctx = gsap.context(() => {
      /* parallaxe au scroll : la carte dérive doucement */
      gsap.fromTo(el, { y: 16 }, {
        y: -16, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });

      /* tracé déclenché une seule fois, à l'arrivée sur la section */
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (started) return;
          started = true;
          el.classList.add("drawn");
          const p0 = lines[0].getPointAtLength(0);
          const w0 = toWorld(p0.x, p0.y);
          target.x = pos.x = w0.x;
          target.y = pos.y = w0.y;
          gsap.ticker.add(follow);

          const tl = gsap.timeline();
          tl.to(cur, { opacity: 1, duration: 0.3 });
          lines.forEach((line, i) => {
            const s = { p: 0 };
            tl.to(
              s,
              {
                p: 1, duration: PER_REGION, ease: "power1.inOut",
                onUpdate: () => {
                  line.style.strokeDashoffset = String(1 - s.p);
                  const pt = line.getPointAtLength(s.p * lens[i]);
                  const wp = toWorld(pt.x, pt.y);
                  target.x = wp.x;
                  target.y = wp.y;
                },
                onComplete: () => line.classList.add("cool"),
              },
              i === 0 ? ">" : `>-${PER_REGION * 0.1}`
            );
          });
          // le curseur disparaît, puis la vue s'éloigne pour révéler les pays voisins
          tl.call(() => {
            gsap.ticker.remove(follow);
            gsap.to(cur, { opacity: 0, duration: 0.4 });
          }, [], "+=0.2");
          tl.call(() => {
            el.classList.add("out");
            gsap.to(el, { attr: { viewBox: FULL }, duration: 2, ease: "power3.inOut" });
            timers.push(window.setTimeout(() => pen1.current?.beginElement(), 3000));
            timers.push(window.setTimeout(() => pen2.current?.beginElement(), 3400));
          }, [], "+=1.1");
        },
      });
    }, el);

    return () => {
      gsap.ticker.remove(follow);
      timers.forEach(clearTimeout);
      ctx.revert();
    };
  }, []);

  const { w: mw, h: mh, regions, pin } = map;
  void pin;

  return (
    <svg ref={svg} className="morocco" viewBox={START} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mapFill" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={mw} y2={mh}>
          <stop offset="0" stopColor="#FF3D00" stopOpacity=".62" />
          <stop offset=".55" stopColor="#FF7A00" stopOpacity=".38" />
          <stop offset="1" stopColor="#FFB347" stopOpacity=".2" />
        </linearGradient>
        {/* ne garde que la moitié extérieure du trait : le contour du pays, sans les frontières internes */}
        <mask id="mapOutside" maskUnits="userSpaceOnUse" x="-20" y="-20" width={mw + 40} height={mh + 40}>
          <rect x="-20" y="-20" width={mw + 40} height={mh + 40} fill="#fff" />
          {regions.map((r) => (
            <path key={r.name} d={r.d} fill="#000" stroke="#000" strokeWidth=".8" />
          ))}
        </mask>
      </defs>

      {/* pays autour du Maroc (révélés à la fin) */}
      <g className="world__dots">
        <path className="wd wd--other" d={dots.other} />
        <path className="wd wd--europe" d={dots.europe} />
        <path className="wd wd--saudi" d={dots.saudi} />
      </g>

      <path id="wArcEu" className="world__arc world__arc--eu" d={toEurope} pathLength={1} />
      <path id="wArcSa" className="world__arc world__arc--sa" d={toGulf} pathLength={1} />

      <circle className="world__pen" r="4.5">
        <animateMotion ref={pen1} dur="2.8s" repeatCount="indefinite" begin="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .25 1">
          <mpath href="#wArcEu" />
        </animateMotion>
      </circle>
      <circle className="world__pen" r="4.5">
        <animateMotion ref={pen2} dur="3.6s" repeatCount="indefinite" begin="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .25 1">
          <mpath href="#wArcSa" />
        </animateMotion>
      </circle>

      <g className="world__labels" aria-hidden="true">
        <text x={labels.europe.x} y={labels.europe.y} className="wl wl--europe">EUROPE</text>
        <text x={labels.saudi.x} y={labels.saudi.y} className="wl wl--saudi">ARABIE SAOUDITE</text>
      </g>

      {/* le Maroc, par régions */}
      <g className="morocco__float">
        <g transform={`matrix(${m.a} 0 0 ${m.d} ${m.e} ${m.f})`}>
          <g className="morocco__glow" mask="url(#mapOutside)">
            {regions.map((r) => (
              <path key={r.name} className="morocco__line" d={r.d} pathLength={1} fill="none" strokeWidth="3.8" strokeLinejoin="round" />
            ))}
          </g>
          <g>
            {regions.map((r, i) => (
              <path
                key={r.name}
                className="morocco__region"
                d={r.d}
                fill="url(#mapFill)"
                stroke="#F7F7F5"
                strokeOpacity=".22"
                strokeWidth="1"
                strokeLinejoin="round"
                style={{ "--i": i } as React.CSSProperties}
              />
            ))}
          </g>
        </g>

        <g className="morocco__pin">
          <circle className="morocco__ring" cx={P.marrakech.x} cy={P.marrakech.y} r="8" fill="none" stroke="#FFB347" strokeWidth="1.4" />
          <circle className="morocco__ring morocco__ring--2" cx={P.marrakech.x} cy={P.marrakech.y} r="8" fill="none" stroke="#FFB347" strokeWidth="1.4" />
          <circle cx={P.marrakech.x} cy={P.marrakech.y} r="9" fill="#FF7A00" opacity=".22" />
          <circle cx={P.marrakech.x} cy={P.marrakech.y} r="4" fill="#FFB347" />
          <text x={P.marrakech.x + 9} y={P.marrakech.y + 4} className="wtxt">MARRAKECH</text>
        </g>

        <g className="world__pins" aria-hidden="true">
          <circle cx={P.paris.x} cy={P.paris.y} r="4.5" className="wpin" />
          <text x={P.paris.x + 10} y={P.paris.y + 4} className="wtxt wtxt--sm">PARIS</text>
          <circle cx={P.riyadh.x} cy={P.riyadh.y} r="4.5" className="wpin" />
          <text x={P.riyadh.x + 10} y={P.riyadh.y + 4} className="wtxt wtxt--sm">RIYAD</text>
        </g>

        {/* curseur de souris qui dessine la carte (la pointe est à l'origine) */}
        <g ref={cursor} className="morocco__cursor" opacity="0">
          <path d="M0 0L0 17L4.6 12.9L7.6 20L10.4 18.8L7.5 11.8L13.5 11.8Z" fill="#fff" stroke="#120600" strokeWidth="1.2" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
