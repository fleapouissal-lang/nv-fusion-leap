const socials = [
  { name: "Facebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
  { name: "LinkedIn", icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></> },
  { name: "Instagram", icon: <><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z" /><path d="M17.5 6.5h.01" /></> },
  { name: "TikTok", icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /> },
];

import ContactIcon from "./ContactIcon";
import FooterPanel from "./FooterPanel";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__word" aria-hidden="true">Fusion Leap</div>
        <div className="footer__grid">
          <div><h4>Agence</h4><p>Agence de communication créative à Marrakech. Branding, digital, contenus et campagnes pour des marques qui marquent.</p>
            <div className="footer__social">
              {socials.map((x) => (
                <span key={x.name} className="sbtn" role="img" aria-label={x.name}><svg viewBox="0 0 24 24" aria-hidden="true">{x.icon}</svg></span>
              ))}
            </div>
          </div>
          <FooterPanel title="Navigation"><ul><li><a href="#accueil">Accueil</a></li><li><a href="#agence">Agence</a></li><li><a href="#services">Services</a></li><li><a href="#realisations">Réalisations</a></li><li><a href="#packs">Packs</a></li><li><a href="#contact">Contact</a></li></ul></FooterPanel>
          <FooterPanel title="Services"><ul><li><a href="#services">Branding</a></li><li><a href="#services">Sites web</a></li><li><a href="#services">Social media</a></li><li><a href="#services">Ads &amp; performance</a></li><li><a href="#services">Photo &amp; vidéo</a></li><li><a href="#services">Stratégie</a></li></ul></FooterPanel>
          <FooterPanel title="Contact"><ul><li className="footer__c"><ContactIcon name="mail" />contact@fusionleap.ma</li><li className="footer__c"><ContactIcon name="phone" /><a href="tel:+212660678569">+212 660-678569</a></li><li className="footer__c"><ContactIcon name="pin" /><a href="https://www.google.com/maps/search/?api=1&query=Espace%20El%20Mostapha%2C%20N%C2%B0%204%2C%20Lamhita%2C%20Semlalia%2C%20Gu%C3%A9liz%2C%20Marrakech" target="_blank" rel="noopener noreferrer">Espace El Mostapha, N° 4, Lamhita, Semlalia, Guéliz, Marrakech</a></li></ul></FooterPanel>
        </div>
        <div className="footer__bot">
          <span>© {new Date().getFullYear()} Fusion Leap SARL AU — Tous droits réservés.</span>
          <nav><span>Mentions légales</span><span>Confidentialité</span></nav>
        </div>
      </div>
    </footer>
  );
}
