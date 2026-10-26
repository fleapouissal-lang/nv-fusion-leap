import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Payload = Record<string, unknown>;

const FIELDS = {
  service: "Type de service",
  type: "Type de projet",
  desc: "Description du besoin",
  budget: "Budget",
  name: "Nom complet",
  company: "Entreprise",
  email: "E-mail",
  phone: "Téléphone",
  date: "Date de lancement souhaitée",
} as const;

const MAX = { service: 120, type: 120, desc: 4000, budget: 80, name: 120, company: 160, email: 200, phone: 40, date: 20 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// limitation simple par IP (en mémoire) : 5 demandes / 10 minutes
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
// empêche l'injection d'en-têtes dans le sujet / l'adresse de réponse
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const json = (body: object, status = 200) => Response.json(body, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return json({ ok: false, error: "Trop de demandes. Réessayez dans quelques minutes." }, 429);

  let raw: Payload;
  try {
    raw = (await req.json()) as Payload;
  } catch {
    return json({ ok: false, error: "Requête invalide." }, 400);
  }

  // honeypot : les robots remplissent ce champ, on répond « ok » sans rien envoyer
  if (typeof raw.website === "string" && raw.website.trim()) return json({ ok: true });

  const data = {} as Record<keyof typeof FIELDS, string>;
  for (const key of Object.keys(FIELDS) as Array<keyof typeof FIELDS>) {
    const v = raw[key];
    data[key] = typeof v === "string" ? v.trim().slice(0, MAX[key]) : "";
  }

  const missing = (["service", "type", "budget", "name", "email", "phone"] as const).filter((k) => !data[k]);
  if (missing.length || data.desc.length < 20 || !EMAIL_RE.test(data.email)) {
    return json({ ok: false, error: "Veuillez vérifier les champs du formulaire." }, 400);
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
    console.error("[contact] Configuration SMTP incomplète (SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO).");
    return json({ ok: false, error: "L'envoi d'e-mails n'est pas encore configuré. Écrivez-nous directement par e-mail ou par téléphone." }, 503);
  }

  const port = Number(SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = TLS direct, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = (Object.keys(FIELDS) as Array<keyof typeof FIELDS>).filter((k) => data[k]);
  const text = rows.map((k) => `${FIELDS[k]} : ${data[k]}`).join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111">
      <h2 style="margin:0 0 4px">Nouvelle demande de devis</h2>
      <p style="margin:0 0 20px;color:#666">Reçue depuis le site Fusion Leap</p>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            (k) =>
              `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#666;width:210px;vertical-align:top">${esc(FIELDS[k])}</td>` +
              `<td style="padding:10px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(data[k])}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  try {
    await transporter.sendMail({
      from: MAIL_FROM || `"Site Fusion Leap" <${SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: `"${oneLine(data.name).replace(/"/g, "")}" <${oneLine(data.email)}>`,
      subject: oneLine(`Nouveau devis — ${data.service} — ${data.name}`).slice(0, 180),
      text,
      html,
    });
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] Échec de l'envoi SMTP :", err);
    return json({ ok: false, error: "L'envoi a échoué. Réessayez dans un instant ou contactez-nous directement." }, 502);
  }
}
