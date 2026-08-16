import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getStats, getInsights } from "../../api/journal";

import { LoadingState, ErrorState, EmptyState } from "../../components/commons";

import type { TrendInsights, TrendSeriesPoint } from "../../types/types";

type Range = "7d" | "30d" | "90d";

export default function TrendsPage() {
  const [range, setRange] = useState<Range>("30d");

  const [series, setSeries] = useState<TrendSeriesPoint[]>([]);
  const [insights, setInsights] = useState<TrendInsights | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrends() {
      try {
        const [statsData, insightsData] = await Promise.all([
          getStats(range),
          getInsights(),
        ]);

        if (cancelled) return;

        setSeries(statsData.series);
        setInsights(insightsData);
      } catch {
        if (!cancelled) {
          setError("Impossible de charger vos tendances.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTrends();

    return () => {
      cancelled = true;
    };
  }, [range]);

  function handleRangeChange(nextRange: Range) {
    if (nextRange === range) return;

    setLoading(true);
    setError(null);
    setRange(nextRange);
  }

  if (loading) {
    return <LoadingState label="Chargement de vos tendances..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (series.length === 0) {
    return (
      <EmptyState
        title="Pas encore assez de données"
        description="Vos tendances apparaîtront après quelques entrées dans votre journal."
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <header className="mb-8">
          <p className="text-sm font-semibold text-sky-700">Bien-être</p>

          <h1 className="mt-1 text-3xl font-bold">Mes tendances</h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Consultez l'évolution de votre humeur, de votre énergie, de votre
            sommeil et de votre anxiété.
          </p>
        </header>

        {/* CHOIX PÉRIODE */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            <RangeButton
              label="7 jours"
              value="7d"
              activeRange={range}
              onClick={handleRangeChange}
            />

            <RangeButton
              label="30 jours"
              value="30d"
              activeRange={range}
              onClick={handleRangeChange}
            />

            <RangeButton
              label="90 jours"
              value="90d"
              activeRange={range}
              onClick={handleRangeChange}
            />
          </div>
        </section>

        {/* GRAPHIQUE */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Évolution de mon bien-être</h2>

            <p className="mt-1 text-sm text-slate-600">
              Les indicateurs sont évalués sur une échelle de 1 à 5.
            </p>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={series}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatDate}
                />

                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />

                <Tooltip labelFormatter={(date) => formatDate(String(date))} />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="humeur"
                  name="Humeur"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="energie"
                  name="Énergie"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="qualite_sommeil"
                  name="Sommeil"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="anxiete_stress"
                  name="Anxiété"
                  stroke="#e11d48"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="mt-8">
          <h2 className="text-xl font-bold">Mes observations</h2>

          <p className="mt-1 text-sm text-slate-600">
            Ces observations sont calculées à partir de vos données
            personnelles.
          </p>

          {!insights ?
            <div className="mt-4">
              <EmptyState
                title="Aucune observation"
                description="Nous attendons d'avoir suffisamment de données avant de produire une observation."
              />
            </div>
          : <div className="mt-5">
              <InsightsDisplay insights={insights} />
            </div>
          }
        </section>

        {/* AVERTISSEMENT */}
        <section className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-sm leading-6 text-slate-700">
            Les tendances présentées ici servent uniquement à vous aider à
            observer votre bien-être. Elles ne constituent pas un diagnostic ni
            un avis médical.
          </p>
        </section>
      </div>
    </main>
  );
}

// garde juste jour/mois pour pas afficher toute la date ISO
function formatDate(date: string) {
  const cleanDate = date.slice(0, 10);

  return `${cleanDate.slice(8, 10)}/${cleanDate.slice(5, 7)}`;
}

type RangeButtonProps = {
  label: string;
  value: Range;
  activeRange: Range;
  onClick: (range: Range) => void;
};

function RangeButton({ label, value, activeRange, onClick }: RangeButtonProps) {
  const active = activeRange === value;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
        active ?
          "bg-sky-700 text-white"
        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

type InsightsDisplayProps = {
  insights: TrendInsights;
};

function InsightsDisplay({ insights }: InsightsDisplayProps) {
  const hasObservations = insights.observations.length > 0;
  const hasCorrelations = insights.correlations.length > 0;

  if (!hasObservations && !hasCorrelations) {
    return (
      <EmptyState
        title="Aucune observation"
        description="Il faut encore quelques entrées avant de pouvoir observer des tendances."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900">Observations</h3>

        {hasObservations ?
          <ul className="mt-4 space-y-3">
            {insights.observations.map((observation, index) => (
              <li
                key={index}
                className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
              >
                {observation}
              </li>
            ))}
          </ul>
        : <p className="mt-3 text-sm text-slate-600">
            Pas encore assez de données.
          </p>
        }
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="font-bold text-slate-900">Activités et bien-être</h3>

        {hasCorrelations ?
          <ul className="mt-4 space-y-3">
            {insights.correlations.map((correlation, index) => (
              <li
                key={index}
                className="rounded-xl bg-sky-50 p-4 text-sm leading-6 text-slate-700"
              >
                {correlation}
              </li>
            ))}
          </ul>
        : <p className="mt-3 text-sm text-slate-600">
            Pas encore assez de données pour comparer les activités.
          </p>
        }
      </article>
    </div>
  );
}
