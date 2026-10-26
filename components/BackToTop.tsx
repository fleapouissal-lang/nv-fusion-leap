"use client";

import { useEffect, useRef, useState } from "react";

const R = 24;
const C = 2 * Math.PI * R;

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      setShow(y > 500);
      // l'anneau se remplit au fil du scroll
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - Math.min(1, y / (max || 1))));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a className={`totop${show ? " show" : ""}`} href="#accueil" aria-label="Retour en haut" tabIndex={show ? 0 : -1}>
      <svg className="totop__ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={R} className="totop__track" />
        <circle ref={ring} cx="26" cy="26" r={R} className="totop__fill" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <svg className="totop__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </a>
  );
}
