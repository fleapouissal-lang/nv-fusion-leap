"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { to: 120, plus: true, label: "Projets livrés", text: "Identités, sites, campagnes et contenus livrés de bout en bout." },
  { to: 8, plus: false, label: "Années d'expertise", text: "Une expérience de terrain au service des marques ambitieuses." },
  { to: 64, plus: true, label: "Clients accompagnés", text: "Startups, PME et groupes, au Maroc et à l'international." },
  { to: 6, plus: false, label: "Disciplines créatives", text: "Une seule équipe pour toute la chaîne de valeur de votre marque." },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const counts = root.current?.querySelectorAll<HTMLElement>(".count");
    if (!counts) return;
    if (prefersReducedMotion()) {
      counts.forEach((c) => (c.textContent = c.dataset.to ?? "0"));
      return;
    }
    const ctx = gsap.context(() => {
      // le compteur démarre quand la grille entre à l'écran, chiffre après chiffre
      ScrollTrigger.create({
        trigger: ".stats__grid",
        start: "top 85%",
        once: true,
        onEnter: () => {
          counts.forEach((c, i) => {
            const o = { v: 0 };
            gsap.to(o, {
              v: +(c.dataset.to ?? 0), duration: 2.6, delay: i * 0.18, ease: "power2.out",
              onUpdate: () => { c.textContent = String(Math.round(o.v)); },
            });
            gsap.fromTo(c.parentElement, { scale: 0.9 }, { scale: 1, duration: 1.2, delay: i * 0.18, ease: "expo.out", transformOrigin: "50% 60%" });
          });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="stats" id="expertise" ref={root}>
      <div className="stats__glow" aria-hidden="true" />
      <div className="wrap">
        <header className="stats__head">
          <span className="eyebrow reveal">Expertise</span>
          <h2 className="reveal">La créativité rencontre<br />la <span className="grad-text">performance.</span></h2>
          <p className="lead reveal">Une équipe resserrée, des méthodes éprouvées et des résultats que l&apos;on peut mesurer, projet après projet.</p>
        </header>

        <ul className="stats__grid">
          {stats.map((s) => (
            <li className="stat reveal" key={s.label}>
              <b><span className="count" data-to={s.to}>0</span>{s.plus && <small>+</small>}</b>
              <span className="stat__orn" aria-hidden="true"><i /></span>
              <strong>{s.label}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
