import { ExternalLink, MapPin, MessageCircle, Phone, ShieldAlert, Users } from "lucide-react";

type OfficialResource = {
  titre: string;
  description: string;
  url: string;
  categorie: string;
};

const officialResources: OfficialResource[] = [
  {
    titre: "Info-Social 811",
    description: "Parlez gratuitement et confidentiellement à un professionnel en intervention psychosociale.",
    url: "https://www.quebec.ca/sante/trouver-une-ressource/info-social-811",
    categorie: "Aide et orientation",
  },
  {
    titre: "Trouver un centre de crise",
    description: "Repérez une ressource gratuite et spécialisée en intervention de crise près de chez vous.",
    url: "https://resicq.ca/liste-centres-crise/",
    categorie: "Crise",
  },
  {
    titre: "Tel-jeunes",
    description: "Soutien confidentiel pour les jeunes par téléphone, texto ou clavardage.",
    url: "https://www.teljeunes.com/",
    categorie: "Jeunes",
  },
];

export default function Urgence() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-rose-700">Urgence</p>
          <h1 className="mt-1 text-3xl font-bold">Aide immédiate et soutien</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Des ressources fiables pour répondre rapidement à une situation de détresse.</p>
        </header>

        <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-6" aria-labelledby="urgence-title">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-700">Besoin d'aide maintenant?</p>
              <h2 id="urgence-title" className="mt-1 text-xl font-bold text-rose-950">
                Vous n'avez pas à traverser ça seul·e.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                En cas de danger immédiat pour vous ou un proche, appelez le 911. Pour du soutien concernant le suicide, la ligne québécoise est
                disponible au 1 866 APPELLE (277-3553), par texto au 535353 ou par clavardage.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-800">
                  <Phone className="h-4 w-4" />
                  Appeler le 911
                </a>
                <a
                  href="tel:18662773553"
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-800 hover:bg-rose-100">
                  <Phone className="h-4 w-4" />1 866 APPELLE
                </a>
                <a
                  href="sms:535353"
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-800 hover:bg-rose-100">
                  <MessageCircle className="h-4 w-4" />
                  Texto 535353
                </a>
                <ExternalResourceLink href="https://suicide.ca/fr/clavarder-avec-un-intervenant" label="Clavarder" danger />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="quebec-title">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-rose-700">Références fiables</p>
              <h2 id="quebec-title" className="mt-1 text-2xl font-bold">
                Ressources d'urgence et de soutien
              </h2>
            </div>
            <ExternalResourceLink
              href="https://www.quebec.ca/sante/sante-mentale/trouver-aide-et-soutien-en-sante-mentale/trouver-ressource-aide-et-soutien-en-sante-mentale/ressources-aide-et-soutien-sante-mentale-par-besoin"
              label="Voir la liste complète Québec.ca"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {officialResources.map((resource) => (
              <article key={resource.titre} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">{resource.categorie}</span>
                  <MapPin className="h-5 w-5 text-rose-700" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{resource.titre}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{resource.description}</p>
                <ExternalResourceLink href={resource.url} label="Accéder à la ressource" />
              </article>
            ))}
          </div>
        </section>

        <p className="mt-10 flex items-center gap-2 text-xs leading-5 text-slate-500">
          <Users className="h-4 w-4 shrink-0" />
          Cette page oriente vers des ressources; elle ne remplace pas une aide médicale ou d'urgence.
        </p>
      </div>
    </main>
  );
}

function ExternalResourceLink({ href, label, danger = false }: { href: string; label: string; danger?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${danger ? "text-rose-800" : "text-sky-700"}`}>
      {label}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
