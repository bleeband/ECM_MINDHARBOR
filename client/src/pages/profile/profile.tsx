import { UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <UserRound className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-sky-700">Mon compte</p>
            <h1 className="text-3xl font-bold">Profil</h1>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Informations du compte</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Pseudonyme</dt>
              <dd className="mt-1 font-semibold">{user.username}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Courriel</dt>
              <dd className="mt-1 font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Rôle</dt>
              <dd className="mt-1 font-semibold">{user.role}</dd>
            </div>
          </dl>
        </section>

        <p className="mt-6 text-sm leading-6 text-slate-600">
          Le modèle Prisma actuel ne contient pas de bio, avatar, nom réel ni
          paramètres de confidentialité. Ces données demandent une migration et
          des routes API avant d'être ajoutées à ce profil.
        </p>
      </div>
    </main>
  );
}
