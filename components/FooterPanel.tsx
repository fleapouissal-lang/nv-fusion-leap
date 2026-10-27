"use client";

import { useId, useState } from "react";

/** Colonne du footer : simple colonne sur grand écran, panneau dépliable (comme les listes du formulaire) sur mobile. */
export default function FooterPanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className={`fpanel${open ? " open" : ""}`}>
      <button type="button" className="fpanel__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <h4>{title}</h4>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className="fpanel__body" id={id}>
        <div className="fpanel__inner">{children}</div>
      </div>
    </div>
  );
}
