export type Project = {
  id: string; title: string; cat: string; catLabel: string; year: string; cls: string;
  image: string; width: number; height: number; alt: string;
  overview: string; challenge: string; approach: string; services: string;
};

export const projects: Project[] = [
  {
    id: "identite-de-marque", title: "Identités de marque", cat: "branding", catLabel: "Branding & Identité", year: "2026", cls: "p1",
    image: "/work/identite-de-marque.png", width: 1448, height: 1086, alt: "Charte graphique Thekra Home Studio et identité Soul Car : logos, supports print, merchandising et application mobile",
    overview: "Création d'identités visuelles complètes pour Thekra Home Studio (photographie famille) et Soul Car (accessoires automobile) : logotype, charte graphique, supports print et déclinaisons digitales.",
    challenge: "Donner à chaque marque un univers reconnaissable au premier regard, cohérent du logo jusqu'aux étiquettes produits et aux posts Instagram.",
    approach: "Une palette et une typographie propres à chaque marque, un système de déclinaisons (papeterie, textile, roll-up, packaging, réseaux sociaux) et une charte prête à l'emploi.",
    services: "Logotype, charte graphique, papeterie, merchandising, packaging, templates social media",
  },
  {
    id: "sites-web", title: "Sites web sur mesure", cat: "web", catLabel: "Web Design & Développement", year: "2026", cls: "p2",
    image: "/work/sites-web.png", width: 900, height: 1125, alt: "Sélection de sites web réalisés : concession automobile, Yugen Weddings, hôtel Evana et plateforme de services auto",
    overview: "Sélection de sites vitrines et plateformes conçus et développés pour des clients au Maroc et en Arabie saoudite : automobile, mariage, hôtellerie et services.",
    challenge: "Concevoir des expériences bilingues (arabe / français) immersives et rapides, qui convertissent sur mobile comme sur desktop.",
    approach: "Direction artistique sur mesure, interfaces RTL soignées, animations mesurées, performance et SEO technique intégrés dès la conception.",
    services: "UX/UI design, développement, intégration RTL, SEO, hébergement",
  },
  {
    id: "natus-gestion-stock", title: "Natus — Gestion de stock", cat: "app", catLabel: "Solution métier", year: "2025", cls: "p3",
    image: "/work/natus-gestion-stock.png", width: 1254, height: 1254, alt: "Tableau de bord de gestion de stock et de caisse multi-magasins pour Natus Marrakech",
    overview: "Application métier pour Natus Marrakech : caisse, gestion des stocks multi-magasins, clients fidélité et pro, facturation et tableaux de bord en temps réel.",
    challenge: "Centraliser le suivi de plusieurs points de vente avec des milliers de références, sans alourdir le quotidien des équipes en magasin.",
    approach: "Une interface sombre et lisible, des indicateurs clés visibles en un coup d'œil, des alertes de rupture et une navigation pensée pour la caisse.",
    services: "Analyse des besoins, UX/UI, développement web, tableaux de bord, formation",
  },
  {
    id: "applications-mobiles", title: "Applications mobiles", cat: "app", catLabel: "Applications iOS & Android", year: "2025", cls: "p4",
    image: "/work/applications-mobiles.png", width: 1254, height: 1254, alt: "Applications mobiles développées sur mesure : livraison de repas, tourisme, finance, e-commerce",
    overview: "Développement d'applications mobiles et web sur mesure : livraison de repas, réservation touristique, suivi d'activité, e-commerce et gestion financière.",
    challenge: "Livrer des applications performantes et évolutives, publiées sur l'App Store et Google Play, avec une expérience utilisateur fluide.",
    approach: "Stack moderne (Flutter, React, Laravel), design system commun, architecture scalable et maintenance continue après la mise en ligne.",
    services: "UX/UI mobile, Flutter, React, Laravel, publication stores, maintenance",
  },
  {
    id: "montage-video-ia", title: "Montage vidéo & vidéos IA", cat: "video", catLabel: "Production vidéo", year: "2025", cls: "p5",
    image: "/work/montage-video-ia.png", width: 1254, height: 1254, alt: "Processus de production vidéo : storyboard, tournage, montage, étalonnage, effets et vidéos générées par IA",
    overview: "Production vidéo complète, du concept au format final : publicités, reels, films corporate, animation 3D et vidéos générées par intelligence artificielle.",
    challenge: "Produire des contenus premium à un rythme soutenu, adaptés à chaque plateforme (YouTube, Instagram, TikTok, publicité).",
    approach: "Un pipeline en six étapes (concept, tournage, montage, étalonnage, effets & IA, export) et des outils IA pour accélérer sans perdre en qualité.",
    services: "Storyboard, tournage, montage, étalonnage, motion design, vidéos IA, avatars IA",
  },
  {
    id: "social-media", title: "Contenu social media", cat: "social", catLabel: "Social media", year: "2024", cls: "p6",
    image: "/work/social-media.png", width: 1672, height: 941, alt: "Contenus social media : posts, stories, reels et animations pour Instagram, TikTok, Facebook, YouTube et LinkedIn",
    overview: "Stratégie et production de contenus pour les réseaux sociaux : posts, stories, reels et animations pour des marques lifestyle, food, mode, voyage et automobile.",
    challenge: "Construire une ligne visuelle reconnaissable et un flux de publication régulier qui fait grandir la communauté.",
    approach: "Stratégie de contenu, direction artistique, calendrier éditorial, montage reels, rédaction des textes et reporting mensuel.",
    services: "Stratégie de contenu, design créatif, reels, stories animées, rédaction, analyse & reporting",
  },
];

export const filters = [
  { f: "all", label: "Tous" },
  { f: "web", label: "Web" },
  { f: "app", label: "Applications" },
  { f: "branding", label: "Branding" },
  { f: "video", label: "Vidéo" },
  { f: "social", label: "Social" },
];
