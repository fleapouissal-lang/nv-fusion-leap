export default function Packs() {
  return (
    <section className="packs" id="packs">
      <div className="packs__aura" aria-hidden="true" />
      <div className="wrap">
        <div className="sub">
          <span className="eyebrow reveal">Packs</span>
          <h2 className="reveal">Le bon pack pour passer<br />au niveau <span className="grad-text">supérieur.</span></h2>
          <p className="lead reveal">Des solutions pensées pour accompagner chaque étape de votre croissance.</p>
        </div>
        <div className="packs__grid">
          <article className="pack reveal"><div className="pack__in">
            <span className="pack__num">Pack 01</span><h3>Essential</h3>
            <p className="for">Pour les startups et petites entreprises qui posent leurs fondations.</p>
            <div className="price">Sur devis<small>Tarif à confirmer</small></div>
            <ul><li>Consultation de marque</li><li>Identité visuelle de base</li><li>Templates social media</li><li>Guide de communication</li><li>Direction créative initiale</li></ul>
            <a className="btn btn--ghost magnetic" href="#devis" data-pack="Essential">Choisir Essential</a>
          </div></article>
          <article className="pack pack--hot reveal"><div className="pack__in">
            <span className="pack__label">Le plus populaire</span>
            <span className="pack__num">Pack 02</span><h3>Growth</h3>
            <p className="for">Pour les entreprises ambitieuses prêtes à accélérer.</p>
            <div className="price">Sur devis<small>Tarif à confirmer</small></div>
            <ul><li>Identité de marque complète</li><li>Stratégie social media</li><li>Création de contenus mensuelle</li><li>Assets créatifs de campagne</li><li>Reporting de performance</li><li>Consultation stratégique</li></ul>
            <a className="btn btn--grad magnetic" href="#devis" data-pack="Growth">Choisir Growth</a>
          </div></article>
          <article className="pack reveal"><div className="pack__in">
            <span className="pack__num">Pack 03</span><h3>Signature</h3>
            <p className="for">Pour les marques qui exigent une expérience premium complète.</p>
            <div className="price">Sur devis<small>Tarif à confirmer</small></div>
            <ul><li>Stratégie de marque intégrale</li><li>Direction créative avancée</li><li>Site web premium</li><li>Stratégie marketing digital</li><li>Production photo &amp; vidéo</li><li>Support créatif dédié</li></ul>
            <a className="btn btn--light magnetic" href="#devis" data-pack="Signature">Demander une offre</a>
          </div></article>
        </div>
      </div>
    </section>
  );
}
