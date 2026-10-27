import GlobeLoader from "./GlobeLoader";
export default function Hero() {
  return (
    <section className="hero" id="accueil">
      <div className="hero__glow" aria-hidden="true">
        <i /><i />
        <span className="hero__spot" />
        <span className="hero__beam hero__beam--1" />
        <span className="hero__beam hero__beam--2" />
        <span className="hero__beam hero__beam--3" />
      </div>
      <div className="wrap">
        <div className="hero__grid">
          <div className="hero__text">
            <span className="eyebrow reveal-now">Agence de communication · Marrakech</span>
            <h1 id="h1" style={{ marginTop: 28 }}>
              <span className="w"><b>Nous</b></span> <span className="w"><b>créons</b></span><br />
              <span className="w"><b>des</b></span> <span className="w"><b>marques</b></span><br />
              <span className="w"><b>qui</b></span> <span className="w"><b className="grad-text">marquent.</b></span>
            </h1>
            <p className="lead">Fusion Leap est une agence de communication créative qui transforme vos ambitions en identités fortes, expériences digitales et résultats mesurables.</p>
            <div className="hero__ctas">
              <a className="btn btn--grad magnetic" href="#realisations">Découvrir nos réalisations <span className="arr">↗</span></a>
              <a className="btn btn--ghost magnetic" href="#devis">Parlons de votre projet <span className="arr">↗</span></a>
            </div>
          </div>
          <div className="hero__visual" id="heroVisual">
            <GlobeLoader />
          </div>
        </div>
        <a className="scroll-hint" href="#agence" aria-label="Défiler vers la suite">
          <span className="scroll-hint__mouse"><i /></span>
          <span className="scroll-hint__txt">Scroll</span>
          <span className="scroll-hint__chev" aria-hidden="true"><b /><b /></span>
        </a>
      </div>
    </section>
  );
}
