import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CalendarCheck, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboard } from "../../api/dashboard";
import { ErrorState, LoadingState } from "../../components/commons";
import type { DashboardData } from "../../types/types";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getDashboard();

        if (!cancelled) {
          setDashboard(data);
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger votre tableau de bord.");
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!dashboard) {
    return <LoadingState label="Chargement de votre tableau de bord..." />;
  }

  const { journalCompleted, suggestion, username, week } = dashboard;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-sky-700">Tableau de bord</p>
          <h1 className="mt-1 text-3xl font-bold">Bonjour {username}</h1>
          <p className="mt-2 text-slate-600">Voici un aperçu basé sur vos propres entrées des 7 derniers jours.</p>
        </section>

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
                  ? "Vous pouvez le consulter ou le mettre à jour."
                  : "Quelques minutes suffisent pour noter ce qui compte pour vous."}
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

        <section className="mb-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold">Votre semaine</h2>
              <p className="mt-1 text-sm text-slate-600">
                {week.entryCount > 0
                  ? `${week.entryCount} entrée${week.entryCount > 1 ? "s" : ""} de journal sur 7 jours.`
                  : "Aucune entrée de journal au cours des 7 derniers jours."}
              </p>
            </div>
            <Link to="/analyse" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
              Voir mes tendances
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Humeur" value={formatAverage(week.humeur)} />
            <StatCard label="Énergie" value={formatAverage(week.energie)} />
            <StatCard label="Sommeil" value={formatAverage(week.qualite_sommeil)} />
            <StatCard label="Anxiété et stress" value={formatAverage(week.anxiete_stress)} />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-emerald-700">Ressource proposée</p>

            {suggestion ? (
              <>
                <h2 className="mt-2 text-xl font-bold">{suggestion.titre}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{suggestion.contenu}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <BookOpen className="h-4 w-4" />
                  <span>{suggestion.type}</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-xl font-bold">Aucune ressource proposée pour le moment</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Consultez les ressources d'aide et de soutien déjà disponibles.</p>
              </>
            )}

            <Link to="/resources" className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900">
              Voir les ressources
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-violet-700">Votre rythme</p>
            <h2 className="mt-2 text-xl font-bold">
              {week.entryCount > 0
                ? `Vous avez pris un moment pour vous ${week.entryCount} jour${week.entryCount > 1 ? "s" : ""} cette semaine.`
                : "Votre première entrée peut commencer aujourd'hui."}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Les indicateurs affichés sont des moyennes personnelles; ils ne constituent pas un avis médical.
            </p>
            <Link to="/analyse" className="mt-5 inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900">
              Explorer mes tendances
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="text-lg font-bold text-rose-900">Besoin de soutien maintenant?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Des ressources d'aide sont disponibles en tout temps. Vous n'avez pas besoin d'avoir rempli votre journal pour y accéder.
          </p>
          <Link to="/resources" className="mt-4 inline-block font-semibold text-rose-700 hover:text-rose-900">
            Accéder aux ressources d'urgence →
          </Link>
        </section>
      </div>
    </main>
  );
}

function formatAverage(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold">{value}</span>
        {value !== "—" && <span className="mb-1 text-sm text-slate-400">/ 5</span>}
      </div>
    </article>
  );
}
