"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/lenis";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !matchMedia("(hover:hover) and (pointer:fine)").matches || prefersReducedMotion()) return;
    document.body.classList.add("has-cursor");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      cursor.classList.toggle("is-label", !!t.closest(".proj"));
      cursor.classList.toggle("is-link", !t.closest(".proj") && !!t.closest("a,button,.faq__q"));
    };
    addEventListener("mousemove", onMove);
    const loop = () => {
      const dx = tx - cx, dy = ty - cy;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        cx += dx * 0.18;
        cy += dy * 0.18;
        cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div id="cursor" ref={ref} aria-hidden="true"><span>VOIR LE PROJET</span></div>
  );
}
