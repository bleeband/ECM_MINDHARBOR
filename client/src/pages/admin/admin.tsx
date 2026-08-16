import { BookOpen, ShieldAlert } from "lucide-react";
import { EmptyState } from "../../components/commons";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-sky-700">Administration</p>
          <h1 className="mt-1 text-3xl font-bold">Tableau de bord administrateur</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Les données affichées doivent respecter le modèle Prisma actuel.</p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-sky-700" />
            <div>
              <h2 className="text-xl font-bold">Signalements</h2>
              <p className="mt-1 text-sm text-slate-600">
                Un `Report` contient `emetteurId`, `reportedUserId`, `postId`, `commentId` et `contenu`.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <EmptyState
              title="Aucun signalement chargé"
              description="L'API d'administration n'est pas encore implantée. Le schéma ne contient ni catégorie, ni statut, ni priorité de traitement."
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-sky-700" />
            <div>
              <h2 className="text-xl font-bold">Ressources</h2>
              <p className="mt-1 text-sm text-slate-600">Une ressource utilise seulement `type`, `titre`, `url` et `contenu`.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
