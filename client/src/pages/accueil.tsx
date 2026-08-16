import { Link } from "react-router-dom";
import { Heart, BookOpen, Users, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
              Un outil simple, à votre rythme
            </span>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Comment ça va aujourd'hui?</h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              MindHarbor vous permet de noter votre journée, de consulter des ressources et de participer à des espaces de soutien.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="rounded-xl bg-sky-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-sky-800">
                Créer mon compte
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold transition hover:bg-slate-100">
                Se connecter
              </Link>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard
                icon={<Heart className="h-6 w-6" />}
                title="Journal de bien-être"
                description="Prenez quelques minutes pour observer votre humeur, votre énergie et votre journée."
              />

              <FeatureCard
                icon={<BookOpen className="h-6 w-6" />}
                title="Ressources"
                description="Découvrez des exercices et contenus adaptés à vos besoins."
              />

              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Groupes de soutien"
                description="Échangez avec des personnes vivant des expériences similaires."
              />

              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Confidentialité"
                description="Vous contrôlez votre profil, vos échanges et la visibilité de vos informations."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ressources */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Quelques pistes utiles</h2>
            <p className="mt-2 text-slate-600">Des outils simples pour les journées plus difficiles ou chargées.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ResourceCard
              title="Respiration 4-7-8"
              category="Anxiété"
              duration="5 min"
              description="Un exercice guidé pour ralentir le rythme et retrouver un peu de calme."
            />

            <ResourceCard
              title="Préparer une meilleure nuit"
              category="Sommeil"
              duration="8 min"
              description="Quelques habitudes simples pour favoriser un sommeil plus reposant."
            />

            <ResourceCard
              title="Faire une pause"
              category="Travail"
              duration="4 min"
              description="Une courte pratique pour prendre du recul lors d'une journée chargée."
            />
          </div>

          <div className="mt-8">
            <Link to="/resources" className="font-semibold text-sky-700 hover:text-sky-900">
              Voir toutes les ressources →
            </Link>
          </div>
        </div>
      </section>

      {/* Groupes */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Groupes de soutien</h2>

          <p className="mt-2 max-w-2xl text-slate-600">Découvrez des espaces d'échange autour de sujets qui vous touchent.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <GroupCard title="Mieux vivre avec l'anxiété" description="Un espace d'écoute et de partage autour de l'anxiété." />

            <GroupCard title="Sommeil et récupération" description="Partager des expériences et stratégies pour mieux récupérer." />

            <GroupCard title="Équilibre travail-vie" description="Discuter du stress professionnel et retrouver un meilleur équilibre." />
          </div>

          <div className="mt-8">
            <Link to="/groupe" className="font-semibold text-sky-700 hover:text-sky-900">
              Explorer les groupes →
            </Link>
          </div>
        </div>
      </section>

      {/* Urgence */}
      <section className="bg-rose-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border border-rose-200 bg-white p-6">
            <h2 className="text-xl font-bold text-rose-900">Besoin d'aide maintenant?</h2>

            <p className="mt-2 max-w-3xl text-slate-700">
              Si vous traversez une situation difficile ou urgente, vous n'avez pas à gérer cela seul. Des ressources d'aide immédiate sont
              disponibles.
            </p>

            <Link to="/urgence" className="mt-4 inline-block rounded-lg bg-rose-700 px-5 py-3 font-semibold text-white hover:bg-rose-800">
              Voir les ressources d'urgence
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="border border-slate-200 p-5">
      <div className="mb-4 inline-flex rounded-lg bg-sky-100 p-3 text-sky-800">{icon}</div>

      <h2 className="font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

type ResourceCardProps = {
  title: string;
  category: string;
  duration: string;
  description: string;
};

function ResourceCard({ title, category, duration, description }: ResourceCardProps) {
  return (
    <article className="border border-slate-200 p-5">
      <div className="flex gap-2 text-sm text-slate-500">
        <span>{category}</span>
        <span>•</span>
        <span>{duration}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

type GroupCardProps = {
  title: string;
  description: string;
};

function GroupCard({ title, description }: GroupCardProps) {
  return (
    <article className="border border-slate-200 bg-white p-5">
      <Users className="h-6 w-6 text-sky-700" />

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
