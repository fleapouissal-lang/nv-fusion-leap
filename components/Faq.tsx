"use client";

import { useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faqItems } from "@/lib/faq";

const items = faqItems;

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const answer = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpen((o) => !o);
    setTimeout(() => ScrollTrigger.refresh(), 520);
  };

  return (
    <div className={`faq__item reveal${open ? " open" : ""}`}>
      <button className="faq__q" aria-expanded={open} onClick={toggle}>{q}<i>+</i></button>
      <div className="faq__a" ref={answer} style={{ maxHeight: open ? (answer.current?.scrollHeight ?? 0) : 0 }}><p>{a}</p></div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="wrap">
        <div className="sub">
          <span className="eyebrow reveal">FAQ</span>
          <h2 className="reveal">Vous avez des questions ?<br />Nous avons <span className="grad-text">des réponses.</span></h2>
        </div>
        <div className="faq__list" id="faqList">
            {items.map((it) => <Item key={it.q} {...it} />)}
          </div>
      </div>
    </section>
  );
}
