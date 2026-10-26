import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { faqItems } from "@/lib/faq";

const services = [
  "Branding et identité visuelle",
  "Création de sites web",
  "Social media management",
  "Marketing digital et publicité",
  "Production photo et vidéo",
  "Stratégie et communication",
];

/** Données structurées (schema.org) : entreprise locale, site web et FAQ, pour les résultats enrichis de Google. */
export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/opengraph-image.png`,
        description: SITE_DESCRIPTION,
        email: CONTACT.email,
        telephone: CONTACT.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: CONTACT.street,
          addressLocality: CONTACT.city,
          addressCountry: CONTACT.country,
        },
        areaServed: ["Maroc", "Europe", "Golfe"],
        knowsAbout: services,
        availableLanguage: ["fr", "ar", "en"],
        makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "fr-MA",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // "<" échappé pour éviter toute fermeture prématurée de la balise script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
