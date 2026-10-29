"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { filters, projects } from "@/lib/projects";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const sizes = (cls: string) =>
  cls === "p6" ? "(max-width: 900px) 100vw, 1280px" : cls === "p1" ? "(max-width: 900px) 100vw, 60vw" : cls === "p2" ? "(max-width: 900px) 100vw, 44vw" : "(max-width: 900px) 100vw, 36vw";

export default function Work() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstFilter = useRef(true);
  const p = projects[current];
  const next = projects[(current + 1) % projects.length];
  const prev = projects[(current - 1 + projects.length) % projects.length];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  const openDetail = (i: number) => {
    setCurrent(i);
    setOpened(true);
    setOpen(true);
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    if (detailRef.current) detailRef.current.scrollTop = 0;
    requestAnimationFrame(() => closeRef.current?.focus());
  };
  const closeDetail = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
    getLenis()?.start();
  }, []);

  const goTo = (dir: 1 | -1) => {
    setOpen(false);
    setTimeout(() => openDetail((current + dir + projects.length) % projects.length), 500);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDetail();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDetail]);

  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false;
      return;
    }
    const shown = gridRef.current?.querySelectorAll(".proj:not(.hide)");
    if (shown?.length) gsap.fromTo(shown, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    ScrollTrigger.refresh();
  }, [filter]);

  return (
    <>
      <section className="work" id="realisations">
        <div className="wrap">
          <div className="sub row">
            <div>
              <span className="eyebrow reveal">Réalisations</span>
              <h2 className="reveal" style={{ marginTop: 22 }}>Des projets qui<br />parlent <span className="grad-text">d&apos;eux-mêmes.</span></h2>
              <p className="lead reveal" style={{ marginTop: 20 }}>Chaque projet est une rencontre entre stratégie, créativité et ambition.</p>
            </div>
            <div className="filters reveal" id="filters" role="group" aria-label="Filtrer les projets">
              {filters.map((f) => (
                <button key={f.f} className={filter === f.f ? "on" : undefined} onClick={() => setFilter(f.f)}>{f.label}</button>
              ))}
            </div>
          </div>
          <div className="work__grid" id="workGrid" ref={gridRef}>
            {projects.map((pr, i) => {
              const show = filter === "all" || pr.cat === filter;
              return (
                <button key={pr.id} type="button" className={`proj ${pr.cls} reveal${show ? "" : " hide"}`} data-cat={pr.cat} onClick={() => openDetail(i)}>
                  <div className="proj__media">
                    <Image src={pr.image} alt={pr.alt} fill sizes={sizes(pr.cls)} quality={85} />
                    <span className="proj__idx">0{i + 1}</span>
                    <span className="proj__cat">{pr.catLabel}</span>
                  </div>
                  <div className="proj__meta"><h3>{pr.title}</h3><span>{pr.catLabel} · {pr.year}</span></div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`detail${open ? " open" : ""}`} id="detail" ref={detailRef} data-lenis-prevent aria-hidden={!open} role="dialog" aria-label="Détail du projet">
        <div className="detail__bar">
          <button type="button" className="detail__back" onClick={closeDetail}><span aria-hidden="true">←</span> Réalisations</button>
          <span className="detail__count"><b>{num(current)}</b> / {num(projects.length - 1)}</span>
          <button className="detail__close" id="detailClose" ref={closeRef} aria-label="Fermer" onClick={closeDetail}>×</button>
        </div>

        <div className="detail__hero">
          {opened && <Image key={p.id} src={p.image} alt={p.alt} fill sizes="100vw" quality={85} priority />}
          <div className="detail__title">
            <div className="wrap">
              <span className="eyebrow">{p.catLabel}</span>
              <h2>{p.title}</h2>
              <div className="detail__meta"><span>{p.catLabel}</span><span>{p.year}</span><span>Projet {num(current)}</span></div>
            </div>
          </div>
        </div>

        <div className="wrap detail__layout">
          <aside className="detail__side">
            <dl>
              <div><dt>Catégorie</dt><dd>{p.catLabel}</dd></div>
              <div><dt>Année</dt><dd>{p.year}</dd></div>
              <div><dt>Services livrés</dt><dd className="detail__chips">{p.services.split(",").map((s) => <span key={s.trim()}>{s.trim()}</span>)}</dd></div>
            </dl>
            <a className="btn btn--grad" href="#devis" onClick={closeDetail}>Lancer un projet similaire <span className="arr">↗</span></a>
          </aside>
          <div className="detail__main">
            <p className="detail__lead">{p.overview}</p>
            <div className="detail__blocks">
              <div className="detail__block"><b>01</b><div><strong>Le défi</strong><p>{p.challenge}</p></div></div>
              <div className="detail__block"><b>02</b><div><strong>L&apos;approche créative</strong><p>{p.approach}</p></div></div>
            </div>
            <figure className="detail__gal">
              {opened && <Image key={p.id} src={p.image} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 900px) 100vw, 60vw" quality={90} />}
              <figcaption>Aperçu complet du projet</figcaption>
            </figure>
          </div>
        </div>

        <nav className="detail__nav" aria-label="Navigation entre projets">
          <button type="button" onClick={() => goTo(-1)}><small>← Projet précédent</small><strong>{prev.title}</strong></button>
          <button type="button" onClick={() => goTo(1)}><small>Projet suivant →</small><strong>{next.title}</strong></button>
        </nav>
      </div>
    </>
  );
}
