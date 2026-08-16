import { HeartHandshake, MessageCircle, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

export default function Messagerie() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl border border-sky-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <MessageCircle className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-semibold text-sky-700">
          Bientôt disponible
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          La messagerie se prépare
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          On prépare un espace privé pour échanger avec respect et à son rythme.
        </p>

        <div className="mt-8 rounded-xl bg-sky-50 p-5 text-left">
          <div className="flex gap-3">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
            <p className="text-sm leading-6 text-slate-700">
              Les messages privés seront ajoutés bientôt. En attendant, les
              ressources d'aide restent accessibles en tout temps.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex justify-center rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
          >
            Retour au tableau de bord
          </Link>
          <Link
            to="/resources"
            className="inline-flex justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Voir les ressources
          </Link>
        </div>
      </section>
    </main>
  );
}
