import ContactIcon from "./ContactIcon";
import QuoteForm from "./Devis";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="wrap">
        <span className="eyebrow reveal">Contact</span>
        <h2 id="contactH" style={{ marginTop: 28 }}>
          <span className="ln"><b>Let&apos;s make</b></span>
          <span className="ln"><b>something</b></span>
          <span className="ln"><b className="grad-text">extraordinary.</b></span>
        </h2>
        <div className="contact__grid">
          <div className="contact__left">
            <p className="lead reveal">Parlez-nous de votre idée. Nous construirons ensemble une solution à votre image. Réponse sous 48 h ouvrées.</p>
            <div className="contact__info reveal">
            <div><ContactIcon name="mail" /><div><small>E-mail</small><span className="v" id="mail">contact@fusionleap.ma</span></div></div>
            <div><ContactIcon name="phone" /><div><small>Téléphone</small><a href="tel:+212660678569" className="v">+212 660-678569</a></div></div>
            <div><ContactIcon name="pin" /><div><small>Studio</small><a className="v" href="https://www.google.com/maps/search/?api=1&query=Espace%20El%20Mostapha%2C%20N%C2%B0%204%2C%20Lamhita%2C%20Semlalia%2C%20Gu%C3%A9liz%2C%20Marrakech" target="_blank" rel="noopener noreferrer">Espace El Mostapha, N° 4, Lamhita, Semlalia, Guéliz, Marrakech</a></div></div>
            </div>
          </div>
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
