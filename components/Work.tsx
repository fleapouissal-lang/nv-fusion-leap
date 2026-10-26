"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArtCanvas from "./ArtCanvas";
import { filters, projects } from "@/lib/projects";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const dims = (cls: string) =>
  cls === "p6" ? { w: 1200, h: 514 } : cls === "p2" ? { w: 720, h: 900 } : cls === "p1" ? { w: 800, h: 600 } : { w: 640, h: 640 };

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

  const goNext = () => {
    setOpen(false);
    setTimeout(() => openDetail((current + 1) % projects.length), 500);
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
              const { w, h } = dims(pr.cls);
              const show = filter === "all" || pr.cat === filter;
              return (
                <button key={pr.id} type="button" className={`proj ${pr.cls} reveal${show ? "" : " hide"}`} data-cat={pr.cat} onClick={() => openDetail(i)}>
                  <div className="proj__media">
                    <ArtCanvas width={w} height={h} seed={pr.seed} blobs={4 + (i % 3)} ribbons={2 + (i % 2)} />
                    <span className="proj__idx">0{i + 1}</span>
                    <span className="proj__cat">{pr.catLabel}</span>
                  </div>
                  <div className="proj__meta"><h3>{pr.title}</h3><span>{pr.catLabel} · {pr.year}</span></div>
                </button>
              );
            })}
          </div>
          <p className="work__note">Projets de démonstration — remplacés par vos études de cas réelles dès réception des assets.</p>
        </div>
      </section>

      <div className={`detail${open ? " open" : ""}`} id="detail" ref={detailRef} aria-hidden={!open} role="dialog" aria-label="Détail du projet">
        <button className="detail__close" id="detailClose" ref={closeRef} aria-label="Fermer" onClick={closeDetail}>×</button>
        <div className="detail__hero"><ArtCanvas id="detailCanvas" width={1280} height={549} seed={p.seed} blobs={5} ribbons={3} active={opened} /></div>
        <div className="wrap detail__body">
          <span className="eyebrow" id="dCat">{p.catLabel}</span>
          <h2 id="dTitle" style={{ marginTop: 20 }}>{p.title}</h2>
          <p className="lead" id="dOverview">{p.overview}</p>
          <div className="detail__cols">
            <div><strong>Le défi</strong><p>{p.challenge}</p></div>
            <div><strong>L&apos;approche créative</strong><p>{p.approach}</p></div>
            <div><strong>Services livrés</strong><p>{p.services}</p></div>
          </div>
          <div className="detail__gal">
            <ArtCanvas width={640} height={480} seed={p.seed + 7} blobs={3} ribbons={1} active={opened} />
            <ArtCanvas width={640} height={480} seed={p.seed + 13} blobs={4} ribbons={2} dark={false} active={opened} />
          </div>
          <div className="detail__next">
            <span className="eyebrow">Projet suivant</span>
            <button className="btn btn--light" id="dNext" onClick={goNext}>{next.title} <span className="arr">↗</span></button>
          </div>
        </div>
      </div>
    </>
  );
}
