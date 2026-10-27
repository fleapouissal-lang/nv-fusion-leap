"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export type PartnerItem = { name: string; slug: string; dark?: boolean; logo: string | null };

/** Vitrine des partenaires : les tuiles se matérialisent en cascade (balayage + ligne de scan) à l'arrivée sur l'écran. */
export default function PartnerGrid({ items }: { items: PartnerItem[] }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        el.classList.add("on");
        io.disconnect();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul className="pgrid" ref={ref} aria-label="Clients et partenaires">
      {items.map((p, i) => (
        <li key={p.slug} className={`ptile${p.dark ? " ptile--dark" : ""}`} style={{ "--i": i } as React.CSSProperties}>
          <div className="ptile__in">
            <div className="ptile__top">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <i aria-hidden="true" />
            </div>
            <div className="ptile__plate">
              {p.logo ? (
                <span className="ptile__logo">
                  <Image src={p.logo} alt={p.name} fill sizes="(max-width: 560px) 45vw, (max-width: 1000px) 30vw, 220px" unoptimized={p.logo.endsWith(".svg")} />
                </span>
              ) : (
                <span className="ptile__fallback">{p.name}</span>
              )}
            </div>
            <span className="ptile__name">{p.name}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
