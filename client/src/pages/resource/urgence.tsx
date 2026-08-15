import { Link } from "react-router-dom";

export default function Urgence() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Urgence */}
      <section className="bg-rose-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-rose-200 bg-white p-6">
            <h2 className="text-xl font-bold text-rose-900">Besoin d'aide maintenant?</h2>

            <p className="mt-2 text-slate-600">
              Si vous traversez une situation difficile ou urgente, vous n'avez pas à gérer cela seul. Des ressources d'aide immédiate sont
              disponibles.
            </p>

            <Link
              to="https://www.quebec.ca/sante/sante-mentale/trouver-aide-et-soutien-en-sante-mentale/trouver-ressource-aide-et-soutien-en-sante-mentale/ressources-aide-et-soutien-sante-mentale-par-besoin"
              className="mt-4 inline-block rounded-lg bg-rose-700 px-5 py-3 font-semibold text-white hover:bg-rose-800">
              Voir les ressources d'urgence
            </Link>
          </div>
        </div>
      </section>

      {/* Ressources */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Ressources pour vous accompagner</h2>
            <p className="mt-2 text-slate-600">Des outils simples pour vous aider à travers différentes situations.</p>
          </div>

          <div className="mt-8">
            <Link to="https://www.quebec.ca/sante/sante-mentale" className="font-semibold text-sky-700 hover:text-sky-900">
              Voir toutes les ressources →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
