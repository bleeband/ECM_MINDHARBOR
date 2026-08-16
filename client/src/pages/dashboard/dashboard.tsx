import { ArrowRight, BookOpen, CalendarCheck, Heart, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  // Données temporaires.
  // Elles seront remplacées par les appels Axios.
  const journalCompleted = false;
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* En-tête */}
        <section className="mb-8">
          <p className="text-sm font-medium text-sky-700">Tableau de bord</p>

          <h1 className="mt-1 text-3xl font-bold">{user?.username}</h1>

          <p className="mt-2 text-slate-600">Voici un aperçu de votre semaine. Prenez ce qui vous est utile aujourd'hui.</p>
        </section>

        {/* Journal aujourd'hui */}
        <section className="mb-8 rounded-3xl bg-sky-700 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />

                <span className="text-sm font-medium">Journal d'aujourd'hui</span>
              </div>

              <h2 className="text-2xl font-bold">
                {journalCompleted ? "Votre journal est rempli pour aujourd'hui." : "Comment allez-vous aujourd'hui?"}
              </h2>

              <p className="mt-2 max-w-xl text-sky-100">
                {journalCompleted
                  ? "Vous pourrez le modifier jusqu'à minuit."
                  : "Quelques minutes suffisent. Vous pouvez répondre seulement à ce qui vous convient."}
              </p>
            </div>

            <Link
              to="/journal"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-sky-800 transition hover:bg-sky-50">
              {journalCompleted ? "Voir mon journal" : "Remplir mon journal"}

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Statistiques */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Votre semaine</h2>

              <p className="mt-1 text-sm text-slate-600">Résumé des 7 derniers jours.</p>
            </div>

            <Link to="/trends" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
              Voir mes tendances
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Humeur" value="3.7" maximum="/ 5" />

            <StatCard label="Énergie" value="3.2" maximum="/ 5" />

            <StatCard label="Sommeil" value="3.5" maximum="/ 5" />

            <StatCard label="Anxiété" value="2.8" maximum="/ 5" />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Suggestion */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Heart className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-emerald-700">Suggestion du jour</p>

            <h2 className="mt-2 text-xl font-bold">Respiration 4-7-8</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Un exercice guidé de quelques minutes pour ralentir le rythme et vous offrir un moment de calme.
            </p>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
              <BookOpen className="h-4 w-4" />
              <span>Anxiété</span>
              <span>•</span>
              <span>5 minutes</span>
            </div>

            <Link to="/resources" className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900">
              Voir la ressource
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Insight */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <TrendingUp className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-violet-700">Une tendance observée</p>

            <h2 className="mt-2 text-xl font-bold">Vos journées avec une marche semblent plus positives.</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Votre humeur moyenne est plus élevée les jours où vous indiquez avoir marché.
            </p>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Cette observation est basée sur vos données personnelles et ne constitue pas un avis médical.
            </p>

            <Link to="/trends" className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900">
              Explorer mes tendances
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Groupes */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Mes groupes</h2>

                <p className="mt-1 text-sm text-slate-600">Vos espaces de soutien.</p>
              </div>

              <Users className="h-6 w-6 text-sky-700" />
            </div>

            <div className="space-y-3">
              <GroupItem name="Mieux vivre avec l'anxiété" info="2 nouvelles publications" />

              <GroupItem name="Équilibre travail-vie" info="1 nouvelle publication" />
            </div>

            <Link to="/groups" className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900">
              Voir mes groupes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Notifications */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Notifications récentes</h2>

            <div className="mt-5 space-y-4">
              <NotificationItem title="Votre demande a été acceptée" description="Vous avez rejoint le groupe Sommeil et récupération." />

              <NotificationItem title="Nouveau commentaire" description="Une personne a répondu à votre publication." />
            </div>
          </section>
        </div>

        {/* Aide */}
        <section className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="text-lg font-bold text-rose-900">Besoin de soutien maintenant?</h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Des ressources d'aide sont disponibles à tout moment. Vous n'avez pas besoin d'avoir rempli votre journal pour y accéder.
          </p>

          <Link to="/urgence" className="mt-4 inline-block font-semibold text-rose-700 hover:text-rose-900">
            Accéder aux ressources d'urgence →
          </Link>
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  maximum: string;
};

function StatCard({ label, value, maximum }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold">{value}</span>

        <span className="mb-1 text-sm text-slate-400">{maximum}</span>
      </div>
    </article>
  );
}

type GroupItemProps = {
  name: string;
  info: string;
};

function GroupItem({ name, info }: GroupItemProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="font-medium text-slate-900">{name}</p>

      <p className="mt-1 text-sm text-slate-500">{info}</p>
    </div>
  );
}

type NotificationItemProps = {
  title: string;
  description: string;
};

function NotificationItem({ title, description }: NotificationItemProps) {
  return (
    <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <p className="font-medium">{title}</p>

      <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
    </div>
  );
}
