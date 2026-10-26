"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "Découverte", text: "Immersion dans votre marché, vos cibles et vos objectifs. Nous posons les bonnes questions avant de proposer." },
  { n: "02", title: "Stratégie", text: "Positionnement, territoire créatif et plan d'action priorisé. Une feuille de route partagée et mesurable." },
  { n: "03", title: "Création", text: "Design, contenus, développement. Itérations rapides, validation à chaque étape, exigence sur le détail." },
  { n: "04", title: "Lancement & Optimisation", text: "Mise en ligne, diffusion, suivi des performances et amélioration continue." },
];

export default function Process() {
  const [on, setOn] = useState(-1);
  const fill = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOn(steps.length);
      if (fill.current) fill.current.style.width = "100%";
      return;
    }
    const ctx = gsap.context(() => {
      gsap.to(fill.current, {
        width: "100%", ease: "none",
        scrollTrigger: {
          trigger: list.current, start: "top 70%", end: "bottom 50%", scrub: 0.4,
          onUpdate: (st) => setOn(Math.min(4, Math.floor(st.progress * 4.999))),
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="process">
      <div className="wrap">
        <div className="sub">
          <span className="eyebrow reveal">Méthode</span>
          <h2 className="reveal">Une méthode claire.<br />Des idées <span className="grad-text">sans limites.</span></h2>
        </div>
        <div className="process__track">
          <div className="process__line" /><div className="process__fill" id="pfill" ref={fill} />
          <ol className="steps" id="steps" ref={list}>
            {steps.map((s, i) => (
              <li className={`step${i <= on ? " on" : ""}`} key={s.n}><b>{s.n}</b><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
