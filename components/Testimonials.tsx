"use client";

import { useRef } from "react";

type Quote = { lang: string; text: string; who: string };

const quotes: Quote[] = [
  { lang: "fr", who: "Salma B.", text: "« Une refonte d'identité qui a changé la perception de notre marque. L'équipe comprend vite, propose juste, et livre dans les temps. »" },
  { lang: "ar-SA-Latn", who: "Abdullah Al-Otaibi", text: "Wallah shughl ihtirafi! Sawwaw lana el hawiya wel mawqe3 ahla b-kteer min elli tawaqqa3na. Fari9 yefham el souq el khaleeji w multazim bil mawa3eed." },
  { lang: "ary-Latn", who: "Youssef Idrissi", text: "Khedma zwina bzzaf! Saybou lia l-identité dial l-restaurant w social media, w walaw l-clients kay3arfouna ghir mn l-logo. Nass professionnels w kaysm3o lik mzyan." },
  { lang: "en", who: "Sarah Mitchell", text: "Fusion Leap rebuilt our website and booking flow. Direct bookings picked up within the first quarter, and the design finally feels like us. Communication was clear from day one." },
  { lang: "en", who: "Noura Al-Qahtani", text: "Our social media campaign delivered excellent engagement. We finally found a partner who thinks strategy before aesthetics, and brings bold ideas with real polish." },
  { lang: "fr", who: "Karim T.", text: "« Le site et la campagne de lancement ont été livrés avec une vraie exigence de détail. Le packaging aussi a été remarqué dès le premier salon. »" },
];

export default function Testimonials() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const t = track.current;
    if (!t) return;
    const step = (t.querySelector<HTMLElement>(".quote")?.offsetWidth || 400) + 18;
    t.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="temoignages" className="testi">
      <div className="wrap">
        <div className="sub row">
          <div><span className="eyebrow reveal">Témoignages</span><h2 className="reveal" style={{ marginTop: 22 }}>Ils nous font <span className="grad-text">confiance.</span></h2></div>
        </div>
        <div className="testi__track" id="testi" ref={track}>
          {quotes.map((q) => (
            <blockquote className="quote reveal" key={q.who} lang={q.lang}>
              <header><b>{q.who}</b><div className="stars"><i /><i /><i /><i /><i /></div></header>
              <p>{q.text}</p>
            </blockquote>
          ))}
        </div>
        <div className="testi__ctrl">
          <button id="tPrev" aria-label="Précédent" onClick={() => scroll(-1)}>←</button>
          <button id="tNext" aria-label="Suivant" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
    </section>
  );
}
