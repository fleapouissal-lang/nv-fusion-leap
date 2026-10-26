"use client";

import { useEffect, useRef } from "react";
import { paint } from "@/lib/paint";

type Props = {
  width: number;
  height: number;
  seed: number;
  blobs?: number;
  ribbons?: number;
  dark?: boolean;
  id?: string;
  role?: string;
  label?: string;
  /** false : ne peint pas encore (ex. fenêtre de détail jamais ouverte) */
  active?: boolean;
};

/** Peint le canvas seulement quand il approche de l'écran : évite des centaines de milliers de pixels calculés au chargement. */
export default function ArtCanvas({ width, height, seed, blobs, ribbons, dark, id, role, label, active = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const draw = () => paint(el, seed, { blobs, ribbons, dark });
    if (!("IntersectionObserver" in window)) return draw();
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        draw();
        io.disconnect();
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seed, blobs, ribbons, dark, active]);

  return <canvas ref={ref} id={id} width={width} height={height} role={role} aria-label={label} />;
}
