import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });

const TITLE = "Fusion Leap — Agence de communication créative à Marrakech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Fusion Leap" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "agence de communication Marrakech",
    "agence créative Maroc",
    "branding Marrakech",
    "création de site web Marrakech",
    "social media management Maroc",
    "marketing digital Maroc",
    "production photo vidéo Marrakech",
    "identité visuelle",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "fr_MA",
    title: "Fusion Leap — Nous créons des marques qui marquent.",
    description: "Agence de communication créative à Marrakech. Identités fortes, expériences digitales, résultats mesurables.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Leap — Nous créons des marques qui marquent.",
    description: "Agence de communication créative à Marrakech. Identités fortes, expériences digitales, résultats mesurables.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  appleWebApp: { capable: true, title: "Fusion Leap", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: true, email: true, address: true },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#080808",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
