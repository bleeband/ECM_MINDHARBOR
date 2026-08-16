import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPost,
  deleteGroup,
  getGroup,
  getGroupPosts,
  joinGroup,
  leaveGroup,
} from "../../api/groupe";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Pagination,
} from "../../components/commons";
import { FormField } from "../../components/Formulaire";
import type { Group, Post } from "../../types/types";

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadGroup() {
      try {
        const [g, p] = await Promise.all([
          getGroup(id as string),
          getGroupPosts(id as string, page),
        ]);

        if (cancelled) return;

        setGroup(g);
        setPosts(p.data);
        setTotalPages(p.meta.totalPages);
      } catch {
        if (!cancelled) {
          setError("Impossible d'ouvrir ce groupe.");
        }
      }
    }

    void loadGroup();

    return () => {
      cancelled = true;
    };
  }, [id, page]);

  async function reloadPosts() {
    if (!id) return;

    const result = await getGroupPosts(id as string, page);
    setPosts(result.data);
    setTotalPages(result.meta.totalPages);
  }

  async function onPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !titre.trim() || !contenu.trim() || isPosting) return;

    try {
      setIsPosting(true);
      setError(null);
      await createPost(id, { titre: titre.trim(), contenu: contenu.trim() });
      setTitre("");
      setContenu("");
      await reloadPosts();
    } catch {
      setError("Impossible de publier le message.");
    } finally {
      setIsPosting(false);
    }
  }

  async function onJoin() {
    if (!id || isJoining) return;

    try {
      setIsJoining(true);
      setError(null);
      await joinGroup(id);
      // update le groupe direct pour afficher les boutons sans refresh la page
      setGroup((current) =>
        current ?
          {
            ...current,
            isMember: true,
          }
        : current,
      );
    } catch {
      setError("Impossible d'envoyer la demande d'adhésion.");
    } finally {
      setIsJoining(false);
    }
  }

  async function onLeave() {
    if (!id) return;

    try {
      await leaveGroup(id);

      const updatedGroup = await getGroup(id);
      setGroup(updatedGroup);
    } catch {
      setError("Impossible de quitter le groupe.");
    }
  }

  async function onDeleteGroup() {
    if (!id) return;

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce groupe?",
    );

    if (!confirmation) return;

    try {
      await deleteGroup(id);

      navigate("/groupe");
    } catch {
      setError("Impossible de supprimer le groupe.");
    }
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!group) {
    return <LoadingState label="Chargement du groupe..." />;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold text-sky-700">
            Groupe de soutien
          </p>

          <h1 className="mt-2 text-3xl font-bold">{group.nom}</h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            {group.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {group.isMember ?
              <button
                type="button"
                onClick={() => void onLeave()}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Quitter le groupe
              </button>
            : <button
                type="button"
                disabled={isJoining}
                onClick={() => void onJoin()}
                className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50"
              >
                {isJoining ? "Connexion..." : "Rejoindre le groupe"}
              </button>
            }

            {group.isOwner && (
              <button
                type="button"
                onClick={() => void onDeleteGroup()}
                className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 font-semibold text-rose-800 transition hover:bg-rose-100"
              >
                Supprimer le groupe
              </button>
            )}
          </div>
        </section>

        {group.isMember && (
          <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold">Nouvelle publication</h2>

            <p className="mt-1 text-sm text-slate-600">
              Partagez quelque chose avec les membres du groupe.
            </p>

            <form onSubmit={onPost} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Titre</span>

                <input
                  value={titre}
                  onChange={(event) => setTitre(event.target.value)}
                  placeholder="Titre de la publication"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-700"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Message
                </span>

                <textarea
                  value={contenu}
                  onChange={(event) => setContenu(event.target.value)}
                  placeholder="Écrivez votre message..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-700"
                />
              </label>

              <button
                type="submit"
                disabled={isPosting || !titre.trim() || !contenu.trim()}
                className="rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPosting ? "Publication..." : "Publier"}
              </button>
            </form>
          </section>
        )}

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold">Publications</h2>

            <p className="mt-1 text-sm text-slate-600">
              Les derniers messages du groupe.
            </p>
          </div>

          {posts.length > 0 ?
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-bold">{post.titre}</h2>

                    <span className="text-sm text-slate-500">
                      {post.author?.username ?? "Utilisateur"}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
                    {post.contenu}
                  </p>
                </article>
              ))}
            </div>
          : <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="text-lg font-bold">Aucune publication</h2>

              <p className="mt-2 text-sm text-slate-600">
                Ce groupe n'a pas encore de publication.
              </p>
            </div>
          }

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPage={setPage}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
