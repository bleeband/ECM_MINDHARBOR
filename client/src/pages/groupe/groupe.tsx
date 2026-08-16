import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGroup, getGroups } from "../../api/groupe";
import type { Group } from "../../types/types";

export default function Groupe() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadGroups() {
      const result = await getGroups();

      setGroups(result.data);
    }

    void loadGroups();
  }, []);

  async function onCreate(event: FormEvent) {
    event.preventDefault();

    if (!nom.trim() || !description.trim()) {
      return;
    }

    const group = await createGroup({
      nom: nom.trim(),
      description: description.trim(),
    });

    // ouvre directement le groupe qui vient detre cree
    navigate(`/groupe/${group.id}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-semibold text-sky-700">
            Espaces de soutien
          </p>

          <h1 className="mt-1 text-3xl font-bold">Groupes</h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Créez un groupe ou rejoignez un espace pour échanger avec les
            autres.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Créer un groupe</h2>

            <p className="mt-1 text-sm text-slate-600">
              Créez votre propre espace de discussion.
            </p>

            <form onSubmit={onCreate} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Nom du groupe
                </span>

                <input
                  value={nom}
                  onChange={(event) => setNom(event.target.value)}
                  placeholder="Ex. Mieux vivre avec l'anxiété"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-700"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Description
                </span>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Décrivez rapidement le groupe..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-700"
                />
              </label>

              <button
                type="submit"
                disabled={!nom.trim() || !description.trim()}
                className="w-full rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Créer le groupe
              </button>
            </form>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">Groupes disponibles</h2>

              <p className="mt-1 text-sm text-slate-600">
                Ouvrez un groupe pour voir les publications ou le rejoindre.
              </p>
            </div>

            {groups.length > 0 ?
              <div className="grid gap-4 md:grid-cols-2">
                {groups.map((group) => (
                  <Link
                    key={group.id}
                    to={`/groupe/${group.id}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <h2 className="text-xl font-bold">{group.nom}</h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                      {group.description}
                    </p>

                    <span className="mt-5 inline-block text-sm font-semibold text-sky-700">
                      Ouvrir le groupe →
                    </span>
                  </Link>
                ))}
              </div>
            : <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <h2 className="text-lg font-bold">Aucun groupe</h2>

                <p className="mt-2 text-sm text-slate-600">
                  Créez le premier groupe pour commencer.
                </p>
              </div>
            }
          </section>
        </div>
      </div>
    </main>
  );
}
