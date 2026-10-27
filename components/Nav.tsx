"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getLenis } from "@/lib/lenis";

const links = [
  { id: "accueil", label: "Accueil" },
  { id: "agence", label: "Agence" },
  { id: "services", label: "Services" },
  { id: "realisations", label: "Réalisations" },
  { id: "packs", label: "Packs" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [shrunk, setShrunk] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const progress = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
    getLenis()?.start();
  }, []);

  const toggle = () => {
    if (open) return closeMobile();
    setOpen(true);
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShrunk(y > 60);
      if (progress.current) {
        progress.current.style.width = (y / (document.documentElement.scrollHeight - innerHeight)) * 100 + "%";
      }
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    document.addEventListener("keydown", onKey);
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => {
      removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      io.disconnect();
    };
  }, [closeMobile]);

  return (
    <>
      <div id="progress" ref={progress} aria-hidden="true" />
      <header className={`nav${shrunk ? " nav--shrunk" : ""}`}>
        <div className={`nav__pill${shrunk ? " shrunk" : ""}`} id="pill">
          <div className="nav__in">
          <a className="nav__logo" href="#accueil" aria-label="Fusion Leap — accueil">
            <Image src="/logo.png" alt="Fusion Leap" width={1146} height={228} priority sizes="170px" />
          </a>
          <ul className="nav__links">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={active === l.id ? "active" : undefined}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn btn--grad btn--sm magnetic" href="#devis">Démarrer un projet <span className="arr">↗</span></a>
          <button className={`burger${open ? " open" : ""}`} id="burger" aria-label="Menu" aria-expanded={open} onClick={toggle}><i /></button>
          </div>
        </div>
      </header>
      <div className={`mobile__backdrop${open ? " open" : ""}`} onClick={closeMobile} aria-hidden="true" />
      <nav className={`mobile${open ? " open" : ""}`} id="mobile" aria-hidden={!open} aria-label="Menu" onClick={(e) => (e.target as HTMLElement).closest("a") && closeMobile()}>
        <span className="mobile__eyebrow">Menu</span>
        <ul className="mobile__links">
          {links.map((l, i) => (
            <li key={l.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${l.id}`} className={active === l.id ? "active" : undefined}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                <span>{l.label}</span>
                <b aria-hidden="true">↗</b>
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--grad mobile__cta" href="#devis">Démarrer un projet <span className="arr">↗</span></a>
        <div className="mobile__foot">
          <a href="tel:+212660678569">+212 660-678569</a>
          <a href="mailto:contact@fusionleap.ma">contact@fusionleap.ma</a>
          <span>Marrakech, Maroc</span>
        </div>
      </nav>
    </>
  );
}
