"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { getLenis, prefersReducedMotion, setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

/** Smooth scroll, intro timeline, scroll-driven animations, magnetic buttons and hash links. */
export default function Motion() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    /* smooth scroll (Lenis + ScrollTrigger sync) */
    let tick: ((t: number) => void) | null = null;
    if (!reduce) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        if (tick) gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      });
    }

    /* hash links */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.getAttribute("href") === "#") return;
      e.preventDefault();
      if (a.dataset.pack) {
        const sel = document.getElementById("f_type") as HTMLSelectElement | null;
        if (sel) {
          sel.value = "Pack " + a.dataset.pack;
          sel.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      const el = document.querySelector(a.getAttribute("href")!);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.4 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    /* magnetic buttons */
    if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
      $$(".magnetic").forEach((b) => {
        const move = (e: MouseEvent) => {
          const r = b.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
          gsap.to(b, { x: x * 0.25, y: y * 0.25, duration: 0.5, ease: "power3.out" });
        };
        const leave = () => gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,.4)" });
        b.addEventListener("mousemove", move);
        b.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          b.removeEventListener("mousemove", move);
          b.removeEventListener("mouseleave", leave);
        });
      });
    }

    /* cartes : inclinaison 3D + halo qui suit la souris */
    if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
      $$(".card,.pack,.quote,.proj,.stat").forEach((card) => {
        const amt = card.matches(".proj") ? 4 : card.matches(".stat") ? 3 : 7;
        const lift = card.matches(".pack") ? -10 : card.matches(".quote") ? 0 : -6;
        const move = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--mx", e.clientX - r.left + "px");
          card.style.setProperty("--my", e.clientY - r.top + "px");
          gsap.to(card, { rotationY: (px - 0.5) * amt * 2, rotationX: (0.5 - py) * amt * 2, y: lift, transformPerspective: 900, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        };
        const leave = () => gsap.to(card, { rotationX: 0, rotationY: 0, y: 0, duration: 0.9, ease: "power3.out", overwrite: "auto" });
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", move);
          card.removeEventListener("mouseleave", leave);
        });
      });
    }

    /* intro + scroll animations */
    const ctx = gsap.context(() => {
      if (reduce) {
        $$("#loader").forEach((l) => l.remove());
        return;
      }
      const loader = document.querySelector("#loader")!;
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .to(loader.querySelector(".bar"), { width: "100%", duration: 0.9, ease: "power2.inOut" })
        .to(loader.querySelector(".mark"), { opacity: 1, scale: 1, duration: 0.6 }, "-=.5")
        .to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.15 })
        .set(loader, { display: "none" })
        .to(".hero h1 .w b", { y: 0, duration: 1.1, stagger: 0.08 }, "-=.5")
        .to("#heroVisual", { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "expo.out" }, "-=.9")
        .to(".hero .lead", { opacity: 1, y: 0, duration: 0.8 }, "-=.9")
        .to(".hero__ctas .btn", { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, "-=.6");

      // hero parallax
      const hero = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
      gsap.to("#h1", { yPercent: 18, ease: "none", scrollTrigger: hero });
      gsap.to("#heroVisual", { yPercent: -10, rotate: 6, ease: "none", scrollTrigger: hero });
      gsap.to(".hero__glow", { opacity: 0.3, ease: "none", scrollTrigger: hero });

      // reveals par lots : les éléments qui entrent ensemble arrivent en cascade
      gsap.set(".card,.pack,.quote,.proj,.stat", { scale: 0.94 });
      ScrollTrigger.batch(".reveal", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out", stagger: 0.12, overwrite: "auto" }),
      });

      // clip reveals
      $$(".about__img,.proj__media").forEach((el) => {
        gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.to("#aboutCanvas", { yPercent: 12, ease: "none", scrollTrigger: { trigger: "#aboutImg", start: "top bottom", end: "bottom top", scrub: true } });

      // line reveals
      ["#statement", "#contactH"].forEach((t) => {
        gsap.to(`${t} .ln b`, { y: 0, duration: 1.1, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: t, start: "top 85%", once: true } });
      });

      // marquees
      const mq = [
        gsap.to("#mq1", { xPercent: -50, duration: 40, ease: "none", repeat: -1 }),
        gsap.to("#mq2", { xPercent: -50, duration: 28, ease: "none", repeat: -1 }),
      ];
      // plus on scrolle vite, plus les bandeaux accélèrent (et ils repartent dans le sens du scroll)
      ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 6);
          gsap.to(mq, { timeScale: self.direction * boost, duration: 0.25, overwrite: true });
          gsap.to(mq, { timeScale: self.direction, duration: 1.2, delay: 0.25, overwrite: false });
        },
      });

      // footer wordmark
      gsap.from(".footer__word", { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".footer", start: "top 90%", once: true } });
    });
    cleanups.push(() => ctx.revert());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
