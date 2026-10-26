"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import map from "@/lib/morocco.json";

gsap.registerPlugin(ScrollTrigger);

const PER_REGION = 0.5; // secondes de tracé par région (voir aussi globals.css)

/**
 * Carte du Maroc par régions (données geoBoundaries / OpenStreetMap, ODbL).
 * Quand la section entre à l'écran, un curseur de souris trace le contour région par région
 * (du nord au sud), chaque région se remplit derrière lui, et la carte suit le scroll en douceur.
 */
export default function MoroccoMap() {
  const svg = useRef<SVGSVGElement>(null);
  const cursor = useRef<SVGGElement>(null);
  const scroller = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = svg.current;
    const cur = cursor.current;
    if (!el || !cur) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("drawn", "instant");
      return;
    }

    const lines = [...el.querySelectorAll<SVGPathElement>(".morocco__line")];
    const lens = lines.map((l) => l.getTotalLength());
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let started = false;

    // le curseur suit sa cible avec un léger retard, comme une vraie souris
    const follow = () => {
      pos.x += (target.x - pos.x) * 0.3;
      pos.y += (target.y - pos.y) * 0.3;
      gsap.set(cur, { x: pos.x, y: pos.y });
    };

    const ctx = gsap.context(() => {
      /* parallaxe au scroll : la carte dérive et s'incline légèrement */
      gsap.fromTo(
        scroller.current,
        { y: 22, rotate: -2, svgOrigin: `${map.w / 2} ${map.h / 2}` },
        {
          y: -22, rotate: 2, svgOrigin: `${map.w / 2} ${map.h / 2}`, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );

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
          target.x = pos.x = p0.x;
          target.y = pos.y = p0.y;
          gsap.ticker.add(follow);

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.ticker.remove(follow);
              gsap.to(cur, { opacity: 0, scale: 0.6, duration: 0.5, svgOrigin: `${pos.x} ${pos.y}` });
            },
          });
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
                  target.x = pt.x;
                  target.y = pt.y;
                },
                onComplete: () => line.classList.add("cool"),
              },
              i === 0 ? ">" : `>-${PER_REGION * 0.1}`
            );
          });
        },
      });
    }, el);

    return () => {
      gsap.ticker.remove(follow);
      ctx.revert();
    };
  }, []);

  const { w, h, regions, pin } = map;

  return (
    <svg ref={svg} className="morocco" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mapFill" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
          <stop offset="0" stopColor="#FF3D00" stopOpacity=".62" />
          <stop offset=".55" stopColor="#FF7A00" stopOpacity=".38" />
          <stop offset="1" stopColor="#FFB347" stopOpacity=".2" />
        </linearGradient>
        {/* ne garde que la moitié extérieure du trait : le contour du pays, sans les frontières internes */}
        <mask id="mapOutside" maskUnits="userSpaceOnUse" x="-20" y="-20" width={w + 40} height={h + 40}>
          <rect x="-20" y="-20" width={w + 40} height={h + 40} fill="#fff" />
          {regions.map((r) => (
            <path key={r.name} d={r.d} fill="#000" stroke="#000" strokeWidth=".8" />
          ))}
        </mask>
      </defs>

      <g ref={scroller} className="morocco__scroll">
        <g className="morocco__float">
          <g className="morocco__glow" mask="url(#mapOutside)">
            {regions.map((r) => (
              <path key={r.name} className="morocco__line" d={r.d} pathLength={1} fill="none" strokeWidth="3.4" strokeLinejoin="round" />
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
                strokeWidth=".8"
                strokeLinejoin="round"
                style={{ "--i": i } as React.CSSProperties}
              />
            ))}
          </g>

          <g className="morocco__pin">
            <circle className="morocco__ring" cx={pin.x} cy={pin.y} r="10" fill="none" stroke="#FFB347" strokeWidth="1.2" />
            <circle className="morocco__ring morocco__ring--2" cx={pin.x} cy={pin.y} r="10" fill="none" stroke="#FFB347" strokeWidth="1.2" />
            <circle cx={pin.x} cy={pin.y} r="14" fill="#FF7A00" opacity=".22" />
            <circle cx={pin.x} cy={pin.y} r="4.5" fill="#FFB347" />
            <text x={pin.x + 12} y={pin.y + 4} fill="#F7F7F5" fillOpacity=".8" fontSize="12" letterSpacing="2">MARRAKECH</text>
          </g>

          {/* curseur de souris qui dessine la carte (la pointe est à l'origine) */}
          <g ref={cursor} className="morocco__cursor" opacity="0">
            <path d="M0 0L0 17L4.6 12.9L7.6 20L10.4 18.8L7.5 11.8L13.5 11.8Z" fill="#fff" stroke="#120600" strokeWidth="1.2" strokeLinejoin="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}
