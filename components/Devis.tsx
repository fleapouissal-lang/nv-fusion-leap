"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Select from "./Select";

const TOTAL = 3;
const steps = ["01 · Votre projet", "02 · Votre budget", "03 · Vos coordonnées"];
const services = ["Branding & Identité Visuelle", "Création de Site Web", "Social Media Management", "Marketing Digital & Ads", "Production Photo & Vidéo", "Stratégie & Communication"];
const types = ["Nouvelle marque", "Refonte", "Campagne ponctuelle", "Accompagnement mensuel", "Pack Essential", "Pack Growth", "Pack Signature"];
const budgets = ["Moins de 5 000 MAD", "5 000 – 15 000 MAD", "15 000 – 30 000 MAD", "Plus de 30 000 MAD", "À définir ensemble"];

type Errors = Record<string, boolean>;

export default function QuoteForm() {
  const form = useRef<HTMLFormElement>(null);
  const mounted = useRef(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = form.current?.querySelector(".fstep.on");
    if (el) gsap.fromTo(el, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
  }, [step]);

  function validate(n: number) {
    const sec = form.current?.querySelectorAll(".fstep")[n - 1];
    if (!sec) return false;
    const next: Errors = {};
    let ok = true;
    if (n === 2) {
      ok = !!sec.querySelector("input:checked");
      next.budget = !ok;
    } else {
      sec.querySelectorAll<HTMLInputElement>("input,select,textarea").forEach((i) => {
        const valid = i.checkValidity();
        next[i.id] = !valid;
        if (!valid) ok = false;
      });
    }
    setErrors((e) => ({ ...e, ...next }));
    return ok;
  }

  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    const key = t.name === "budget" ? "budget" : t.id;
    if (errors[key] && t.checkValidity()) setErrors((er) => ({ ...er, [key]: false }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || !validate(3)) return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const first = (data.name || "").trim().split(" ")[0];
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // inclut le champ piège « website » : le serveur ignore les robots
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "L'envoi a échoué. Réessayez dans un instant.");
      setSuccess(`Merci ${first}. Votre demande (${data.service}, budget ${data.budget}) a bien été envoyée. Nous revenons vers vous sous 48 h ouvrées.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'envoi a échoué. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  }

  const err = (k: string) => (errors[k] ? " err" : "");

  return (
    <div id="devis" className="devis__form">
          <form className="form reveal" id="quoteForm" ref={form} noValidate onInput={onInput} onSubmit={onSubmit}>
            <div className="stepper" id="stepper" hidden={success !== null}>
              {steps.map((s, i) => (
                <div key={s} className={i + 1 === step ? "on" : i + 1 < step ? "done" : undefined}>{s}</div>
              ))}
            </div>
            <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className={`fstep${step === 1 && success === null ? " on" : ""}`} data-step="1">
              <div className="two">
                <div className={`field${err("f_service")}`}><label htmlFor="f_service">Type de service</label>
                  <Select id="f_service" name="service" label="Type de service" options={services} />
                  <span className="msg">Choisissez un service.</span></div>
                <div className={`field${err("f_type")}`}><label htmlFor="f_type">Type de projet</label>
                  <Select id="f_type" name="type" label="Type de projet" options={types} />
                  <span className="msg">Choisissez un type de projet.</span></div>
              </div>
              <div className={`field${err("f_desc")}`}><label htmlFor="f_desc">Description du besoin</label>
                <textarea id="f_desc" name="desc" required minLength={20} placeholder="Décrivez votre projet, vos objectifs, vos délais…" />
                <span className="msg">Décrivez votre besoin en quelques phrases (20 caractères minimum).</span></div>
            </div>

            <div className={`fstep${step === 2 && success === null ? " on" : ""}`} data-step="2">
              <div className={`field budget${err("budget")}`} role="radiogroup" aria-label="Budget">
                {budgets.map((b, i) => (
                  <label key={b}><input type="radio" name="budget" value={b} required={i === 0} />{b}</label>
                ))}
                <span className="msg">Indiquez une fourchette de budget.</span>
              </div>
            </div>

            <div className={`fstep${step === 3 && success === null ? " on" : ""}`} data-step="3">
              <div className="two">
                <div className={`field${err("f_name")}`}><label htmlFor="f_name">Nom complet</label><input id="f_name" name="name" required autoComplete="name" /><span className="msg">Votre nom est requis.</span></div>
                <div className="field"><label htmlFor="f_company">Entreprise</label><input id="f_company" name="company" autoComplete="organization" /></div>
              </div>
              <div className="two">
                <div className={`field${err("f_email")}`}><label htmlFor="f_email">Adresse e-mail</label><input id="f_email" name="email" type="email" required autoComplete="email" /><span className="msg">Entrez une adresse e-mail valide.</span></div>
                <div className={`field${err("f_phone")}`}><label htmlFor="f_phone">Téléphone</label><input id="f_phone" name="phone" type="tel" required autoComplete="tel" placeholder="+212 …" /><span className="msg">Votre téléphone est requis.</span></div>
              </div>
              <div className="field"><label htmlFor="f_date">Date de lancement souhaitée</label><input id="f_date" name="date" type="date" /></div>
            </div>

            <div className={`success${success !== null ? " on" : ""}`} id="success">
              <span className="ok"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#120600" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L19 7" /></svg></span>
              <h3>Demande prête.</h3>
              <p id="successMsg">{success}</p>
            </div>

            {error && <p className="form__error" role="alert">{error}</p>}

            <div className="form__nav" id="formNav" hidden={success !== null}>
              <button type="button" className="btn btn--ghost" id="prevBtn" hidden={step === 1} onClick={() => setStep((s) => s - 1)}>← Retour</button>
              <button type="button" className="btn btn--light" id="nextBtn" style={{ marginLeft: "auto" }} hidden={step === TOTAL} onClick={() => validate(step) && setStep((s) => s + 1)}>Continuer <span className="arr">→</span></button>
              <button type="submit" className="btn btn--grad magnetic" id="sendBtn" hidden={step !== TOTAL} disabled={sending} style={{ marginLeft: "auto" }}>{sending ? "Envoi en cours…" : <>Envoyer ma demande <span className="arr">↗</span></>}</button>
            </div>
          </form>
    </div>
  );
}
