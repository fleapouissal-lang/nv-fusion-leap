import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

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

const items = partners.map((p) => ({ ...p, logo: findLogo(p.slug) }));
// la seconde rangée reprend les mêmes marques dans un autre ordre
const rowB = [...items.slice(6), ...items.slice(0, 6)];

function Logo({ p }: { p: (typeof items)[number] }) {
  return (
    <li className={`plogo${p.dark ? " plogo--dark" : ""}`}>
      {p.logo ? (
        <span className="plogo__img">
          <Image src={p.logo} alt="" fill sizes="190px" unoptimized={p.logo.endsWith(".svg")} />
        </span>
      ) : (
        <span className="plogo__name">{p.name}</span>
      )}
    </li>
  );
}

function Row({ list, reverse, decorative }: { list: typeof items; reverse?: boolean; decorative?: boolean }) {
  return (
    <div className="prow" aria-hidden={decorative || undefined}>
      <div className={`prow__track${reverse ? " prow__track--rev" : ""}`}>
        {[0, 1].map((copy) => (
          <ul className="prow__set" key={copy} aria-hidden={copy === 1 || undefined}>
            {list.map((p) => <Logo key={p.slug} p={p} />)}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Partners() {
  return (
    <section className="partners" id="partenaires">
      <div className="wrap">
        <div className="sub row">
          <div>
            <span className="eyebrow reveal">Partenaires</span>
            <h2 className="reveal" style={{ marginTop: 22 }}>Des marques qui<br />avancent <span className="grad-text">avec nous.</span></h2>
          </div>
          <p className="lead reveal">Hôtels, entreprises et commerces de Marrakech et d&apos;ailleurs nous confient leur image.</p>
        </div>
      </div>

      <div className="pband reveal" role="group" aria-label={`Clients et partenaires : ${partners.map((p) => p.name).join(", ")}`}>
        <Row list={items} />
        <Row list={rowB} reverse decorative />
      </div>
    </section>
  );
}
