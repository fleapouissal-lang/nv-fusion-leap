import fs from "node:fs";
import path from "node:path";
import PartnerGrid, { type PartnerItem } from "./PartnerGrid";

type Partner = { name: string; slug: string; dark?: boolean };

const partners: Partner[] = [
  { name: "Natus Marrakech", slug: "natus-marrakech" },
  { name: "Asir", slug: "asir" },
  { name: "Pixcel", slug: "pixcel", dark: true },
  { name: "Evana Hotel", slug: "evana-hotel" },
  { name: "Autolog", slug: "autolog" },
  { name: "Laurence D'Arabie", slug: "laurence-darabie" },
  { name: "ADK Ahsahel", slug: "adk-ahsahel" },
  { name: "Marrakech Moto", slug: "marrakech-moto" },
  { name: "Clima Solaire", slug: "clima-solaire" },
  { name: "Rafnationnal", slug: "rafnationnal" },
  { name: "Service Time", slug: "service-time" },
  { name: "MyLine Medical", slug: "myline-medical" },
  { name: "SMC", slug: "smc" },
];

const EXTS = ["svg", "webp", "png", "jpg", "jpeg", "avif"];

/** Cherche public/clients/<slug>.<ext> : si le logo existe il est affiché, sinon le nom du partenaire sert de repli. */
function findLogo(slug: string) {
  const dir = path.join(process.cwd(), "public", "clients");
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(dir, `${slug}.${ext}`))) return `/clients/${slug}.${ext}`;
  }
  return null;
}

export default function Partners() {
  const items: PartnerItem[] = partners.map((p) => ({ ...p, logo: findLogo(p.slug) }));

  return (
    <section className="partners" id="partenaires">
      <div className="wrap">
        <div className="sub row">
          <div>
            <span className="eyebrow reveal">Partenaires</span>
            <h2 className="reveal" style={{ marginTop: 22 }}>Des marques qui<br />avancent <span className="grad-text">avec nous.</span></h2>
            <span className="pstat reveal"><i aria-hidden="true" />{items.length} marques · Maroc · Golfe · Europe</span>
          </div>
          <p className="lead reveal">Hôtels, entreprises et commerces de Marrakech et d&apos;ailleurs nous confient leur image.</p>
        </div>
        <PartnerGrid items={items} />
      </div>
    </section>
  );
}
