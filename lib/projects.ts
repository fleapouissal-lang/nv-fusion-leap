export type Project = {
  id: string; title: string; cat: string; catLabel: string; year: string; cls: string; seed: number;
  overview: string; challenge: string; approach: string; services: string;
};

export const projects: Project[] = [
  { id: "maison-noir", title: "Maison Noir", cat: "branding", catLabel: "Branding & Identité", year: "2026", cls: "p1", seed: 11, overview: "Identité de marque de luxe pour une maison de mode fictive : logotype, système typographique, direction photo et papeterie.", challenge: "Créer une marque qui exprime le minimalisme sans froideur, et qui résiste au temps.", approach: "Un monogramme architectural, une palette monochrome ponctuée d'un seul accent chaud, une grille éditoriale stricte.", services: "Plateforme de marque, logotype, charte, papeterie, art direction" },
  { id: "atlas-studio", title: "Atlas Studio", cat: "web", catLabel: "Web Design & Dev", year: "2026", cls: "p2", seed: 23, overview: "Site immersif pour un studio d'architecture : portfolio plein écran, navigation cinématique, performance optimisée.", challenge: "Mettre en valeur des projets très visuels sans sacrifier la vitesse de chargement.", approach: "Motion mesuré, images art-dirigées, structure éditoriale et SEO technique soigné.", services: "UX/UI, développement, motion, SEO" },
  { id: "nova", title: "Nova", cat: "ads", catLabel: "Campagne digitale", year: "2025", cls: "p3", seed: 37, overview: "Campagne 360° de lancement pour une application mobile : concept, films courts, social ads et landing page.", challenge: "Générer de la notoriété et des installations sur un marché saturé.", approach: "Un concept créatif unique décliné sur tous les points de contact, piloté à la donnée.", services: "Concept, production, media buying, landing page" },
  { id: "origine", title: "Origine", cat: "packaging", catLabel: "Packaging premium", year: "2025", cls: "p4", seed: 51, overview: "Design packaging pour une gamme de produits naturels : étuis, étiquettes et coffrets cadeaux.", challenge: "Se différencier en linéaire tout en restant fidèle aux valeurs d'authenticité.", approach: "Papiers texturés, dorure à chaud discrète, typographie généreuse.", services: "Design packaging, prépresse, suivi fabrication" },
  { id: "vision", title: "Vision", cat: "branding", catLabel: "Identité corporate", year: "2025", cls: "p5", seed: 67, overview: "Refonte d'identité pour un groupe de services : logo, charte, templates et signalétique.", challenge: "Unifier plusieurs filiales sous une marque mère cohérente.", approach: "Un système modulaire, une architecture de marque claire et des gabarits prêts à l'emploi.", services: "Architecture de marque, identité, charte, signalétique" },
  { id: "eclat", title: "Éclat", cat: "social", catLabel: "Social media", year: "2024", cls: "p6", seed: 89, overview: "Direction artistique et production de contenus social media pour une marque beauté.", challenge: "Construire une communauté engagée avec une ligne visuelle reconnaissable.", approach: "Calendrier éditorial, shootings mensuels, formats courts et reporting.", services: "Stratégie social, DA, production, community management" },
];

export const filters = [
  { f: "all", label: "Tous" },
  { f: "branding", label: "Branding" },
  { f: "web", label: "Web" },
  { f: "social", label: "Social" },
  { f: "packaging", label: "Packaging" },
  { f: "ads", label: "Campagnes" },
];
