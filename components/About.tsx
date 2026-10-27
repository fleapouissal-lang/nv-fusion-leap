import Image from "next/image";

export default function About() {
  return (
    <section id="agence">
      <div className="wrap">
        <div className="about__grid">
          <div className="about__img" id="aboutImg">
            <div className="about__photo" id="aboutCanvas">
              <Image
                src="/agence.jpg"
                alt="Touche de clavier orange lumineuse portant le logo Fusion Leap, entourée de touches « create your edge »"
                fill
                sizes="(max-width: 900px) 90vw, 560px"
                quality={85}
              />
            </div>
            <div className="about__badge" aria-hidden="true">Creative · Studio · Marrakech ·</div>
          </div>
          <div className="about__text">
            <span className="eyebrow reveal">L&apos;agence</span>
            <h2 className="reveal" style={{ marginTop: 22 }}>Plus qu&apos;une agence.<br />Un partenaire <span className="grad-text">de croissance.</span></h2>
            <p className="lead reveal">Nous accompagnons les marques ambitieuses du Maroc et d&apos;ailleurs, de la stratégie à l&apos;exécution : identité, web, social media, campagnes et production. Une équipe resserrée, une exigence d&apos;atelier, une obsession du résultat.</p>
            <div className="about__cols reveal">
              <div><strong>Mission</strong><p>Donner aux marques les outils créatifs et digitaux pour se démarquer, convaincre et grandir.</p></div>
              <div><strong>Philosophie</strong><p>Chaque pixel sert un objectif. Le beau n&apos;a de valeur que s&apos;il performe.</p></div>
            </div>
            <a className="btn btn--light magnetic reveal" href="#services">Découvrir notre agence <span className="arr">↗</span></a>
          </div>
        </div>
        <p className="statement" id="statement">
          <span className="ln"><b>Nous ne suivons pas les tendances.</b></span>
          <span className="ln"><b>Nous créons <em>ce qui vient après.</em></b></span>
        </p>
      </div>
    </section>
  );
}
