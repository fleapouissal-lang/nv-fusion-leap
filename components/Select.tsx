"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = { id: string; name: string; label: string; options: string[]; placeholder?: string };

/**
 * Liste déroulante personnalisée. Un <select> natif reste dans le DOM (masqué) : validation, FormData
 * et changements programmatiques (ex. choix d'un pack) continuent de fonctionner comme avant.
 */
export default function Select({ id, name, label, options, placeholder = "Sélectionner…" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const native = useRef<HTMLSelectElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = `${id}-list`;

  // suit les changements faits depuis l'extérieur (ex. clic sur un pack)
  useEffect(() => {
    const el = native.current;
    if (!el) return;
    const sync = () => setValue(el.value);
    el.addEventListener("change", sync);
    return () => el.removeEventListener("change", sync);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  const show = () => {
    const r = btn.current?.getBoundingClientRect();
    const need = Math.min(options.length, 7) * 48 + 24;
    setUp(!!r && innerHeight - r.bottom < need && r.top > need);
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const choose = (v: string) => {
    const el = native.current;
    if (el) {
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setValue(v);
    close();
    btn.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "Tab") return close();
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (active >= 0) choose(options[active]); }
  };

  return (
    <div className={`sel${open ? " open" : ""}${up ? " up" : ""}`} ref={root}>
      <select className="sel__native" id={id} name={name} required defaultValue="" ref={native} tabIndex={-1} aria-hidden="true">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <button
        ref={btn} type="button" className={`sel__btn${value ? " has" : ""}`}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-label={`${label} : ${value || placeholder}`}
        onClick={() => (open ? close() : show())} onKeyDown={onKey}
      >
        <span>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <ul className="sel__panel" id={listId} role="listbox" aria-label={label}>
        {options.map((o, i) => (
          <li
            key={o} role="option" aria-selected={o === value}
            className={`${o === value ? "sel" : ""}${i === active ? " act" : ""}`.trim()}
            onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(o)}
          >
            <span>{o}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
