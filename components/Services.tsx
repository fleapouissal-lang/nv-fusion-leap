const Arrow = () => <span className="card__arrow" aria-hidden="true">↗</span>;

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="sub row">
          <div>
            <span className="eyebrow reveal">Services</span>
            <h2 className="reveal" style={{ marginTop: 22 }}>Des idées audacieuses.<br />Des solutions <span className="grad-text">concrètes.</span></h2>
          </div>
          <p className="lead reveal">Six expertises, une seule équipe. Nous concevons des systèmes de marque complets, pensés pour durer et pour convertir.</p>
        </div>
        <div className="bento">
          <article className="card c1 reveal">
            <div className="card__head"><span className="card__num">01</span><span className="card__icon"><svg viewBox="0 0 24 24"><path d="M4 20l6-16 6 16M7 14h6" /><circle cx="18" cy="7" r="2.5" /></svg></span></div>
            <div><h3>Branding &amp; Identité Visuelle</h3><p>Plateforme de marque, logotype, système graphique, chartes et déclinaisons. Une identité qui raconte une histoire et tient dans le temps.</p></div>
            <Arrow />
          </article>
          <article className="card c2 card--feature reveal">
            <div className="card__head"><span className="card__num">02</span><span className="card__icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M8 21h8" /></svg></span></div>
            <div><h3>Création de Sites Web</h3><p>Sites vitrines, e-commerce et expériences immersives. Design sur mesure, motion soigné, performance et SEO intégrés dès la conception.</p></div>
            <Arrow />
          </article>
          <article className="card c3 card--outline reveal">
            <div className="card__head"><span className="card__num">03</span><span className="card__icon"><svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M12 7v5l3 2" /></svg></span></div>
            <div><h3>Social Media Management</h3><p>Ligne éditoriale, contenus, communauté et reporting.</p></div>
            <Arrow />
          </article>
          <article className="card c4 reveal">
            <div className="card__head"><span className="card__num">04</span><span className="card__icon"><svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg></span></div>
            <div><h3>Marketing Digital &amp; Ads</h3><p>Campagnes Meta, Google et TikTok pilotées à la donnée.</p></div>
            <Arrow />
          </article>
          <article className="card c5 card--outline reveal">
            <div className="card__head"><span className="card__num">05</span><span className="card__icon"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg></span></div>
            <div><h3>Production Photo &amp; Vidéo</h3><p>Shootings, films de marque, formats courts et motion design.</p></div>
            <Arrow />
          </article>
          <article className="card c6 reveal">
            <div className="card__body">
              <div className="card__head"><span className="card__num">06</span><span className="card__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></svg></span></div>
              <h3>Stratégie &amp; Communication</h3><p>Positionnement, messages clés, plans de communication 360° et accompagnement des équipes. La boussole de toutes nos créations.</p>
            </div>
            <Arrow />
          </article>
        </div>
      </div>
    </section>
  );
}
