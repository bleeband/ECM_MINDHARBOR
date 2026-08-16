import { ArrowLeft, ExternalLink, HeartHandshake, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const suicideChatUrl = "https://suicide.ca/fr/clavarder-avec-un-intervenant";
const crisisCentersUrl = "https://resicq.ca/liste-centres-crise/";
const infoSocialUrl = "https://www.quebec.ca/sante/trouver-une-ressource/info-social-811";
const quebecResourcesUrl =
  "https://www.quebec.ca/sante/sante-mentale/trouver-aide-et-soutien-en-sante-mentale/trouver-ressource-aide-et-soutien-en-sante-mentale/ressources-aide-et-soutien-sante-mentale-par-besoin";

export default function Urgence() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-800">
          <ArrowLeft className="h-4 w-4" />
          Retour aux ressources
        </Link>

        <section className="mt-5 rounded-[2rem] border border-rose-200 bg-rose-50 p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-700 text-white">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-rose-700">Aide immédiate</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-rose-950 sm:text-4xl">Tu n'as pas à traverser ça seul·e.</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
                Si tu crains pour ta sécurité ou celle d'un proche, appelle les services d'urgence. Pour du soutien, des intervenant·es peuvent
                aussi t'écouter et t'orienter.
              </p>

              <a
                href="tel:911"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-5 py-3 font-bold text-white transition hover:bg-rose-800">
                <Phone className="h-5 w-5" />
                Appeler le 911
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2" aria-label="Ressources d'aide immédiate">
          <HelpCard
            icon={<HeartHandshake className="h-6 w-6" />}
            title="Prévention du suicide"
            description="Si tu penses au suicide ou si tu t'inquiètes pour un proche, appelle, texte ou clavarde avec la Ligne québécoise de prévention du suicide."
            tone="rose">
            <div className="flex flex-wrap gap-2">
              <ActionLink href="tel:18662773553" label="1 866 APPELLE" />
              <ActionLink href="sms:535353" label="Texto 535353" icon={<MessageCircle className="h-4 w-4" />} />
              <ExternalLinkButton href={suicideChatUrl} label="Clavarder" />
            </div>
          </HelpCard>

          <HelpCard
            icon={<Phone className="h-6 w-6" />}
            title="Info-Social 811"
            description="Un service gratuit et confidentiel pour parler à un professionnel en intervention psychosociale, pour toi ou pour un proche."
            tone="sky">
            <div className="flex flex-wrap gap-2">
              <ActionLink href="tel:811" label="Appeler le 811" />
              <ExternalLinkButton href={infoSocialUrl} label="En savoir plus" />
            </div>
          </HelpCard>

          <HelpCard
            icon={<ShieldAlert className="h-6 w-6" />}
            title="Centre de crise près de chez toi"
            description="Trouve un centre offrant des services gratuits et spécialisés en intervention de crise."
            tone="violet">
            <ExternalLinkButton href={crisisCentersUrl} label="Trouver un centre" />
          </HelpCard>

          <HelpCard
            icon={<HeartHandshake className="h-6 w-6" />}
            title="Plus de ressources au Québec"
            description="Explore les ressources selon ton besoin : anxiété, deuil, proches, troubles de l'humeur et plus encore."
            tone="emerald">
            <ExternalLinkButton href={quebecResourcesUrl} label="Voir Québec.ca" />
          </HelpCard>
        </section>

        <section className="mt-8 rounded-3xl border border-sky-200 bg-sky-50 p-6 text-center">
          <p className="text-sm leading-6 text-slate-700">
            Cette page oriente vers des ressources d'aide. Elle ne remplace pas les services d'urgence ni l'avis d'un professionnel de la santé.
          </p>
        </section>
      </div>
    </main>
  );
}

function HelpCard({
  icon,
  title,
  description,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: "rose" | "sky" | "violet" | "emerald";
  children: React.ReactNode;
}) {
  const tones = {
    rose: "bg-rose-100 text-rose-700",
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>{icon}</div>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 min-h-20 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function ActionLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700">
      {icon}
      {label}
    </a>
  );
}

function ExternalLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-sky-800 hover:bg-sky-50">
      {label}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
