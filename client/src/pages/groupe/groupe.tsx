import { HeartHandshake, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

export default function Groupe() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl border border-sky-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Wrench className="h-9 w-9" />
        </div>

        <p className="mt-6 text-sm font-semibold text-sky-700">
          Bientôt disponible
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Les groupes se préparent
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          On construit un petit coin bienveillant pour échanger, s'encourager et
          avancer ensemble, à son rythme.
        </p>

        <div className="mt-8 rounded-xl bg-sky-50 p-5 text-left">
          <div className="flex gap-3">
            <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
            <p className="text-sm leading-6 text-slate-700">
              Reviens bientôt : les premiers espaces de soutien arrivent très
              prochainement.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
        >
          Retour au tableau de bord
        </Link>
      </section>
    </main>
  );
}
