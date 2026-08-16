import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { createPost, getGroup, getGroupPosts, joinGroup } from "../../api/groupe";
import { EmptyState, ErrorState, LoadingState, Pagination } from "../../components/commons";
import { FormField } from "../../components/Formulaire";
import type { Group, Post } from "../../types/types";

export default function GroupDetailPage() {
  const { id } = useParams();
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
        const [g, p] = await Promise.all([getGroup(id as string), getGroupPosts(id as string, page)]);

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
    } catch {
      setError("Impossible d'envoyer la demande d'adhésion.");
    } finally {
      setIsJoining(false);
    }
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!group) {
    return <LoadingState label="Chargement du groupe..." />;
  }

  return (
    <section className="page">
      <h1>{group.nom}</h1>
      <p>{group.description}</p>

      <button type="button" disabled={isJoining} onClick={() => void onJoin()}>
        {isJoining ? "Demande..." : "Demander à rejoindre"}
      </button>

      <form onSubmit={onPost} className="card">
        <FormField label="Titre" name="titre" value={titre} onChange={setTitre} />
        <FormField label="Nouvelle publication" name="contenu" value={contenu} onChange={setContenu} as="textarea" />
        <button type="submit" disabled={isPosting || !titre.trim() || !contenu.trim()}>
          {isPosting ? "Publication..." : "Publier"}
        </button>
      </form>

      {posts.length > 0 ? (
        <div className="grid">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h2>{post.titre}</h2>
              <p>{post.contenu}</p>
              <p>{post.author?.username ?? "Utilisateur"}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Aucune publication" description="Ce groupe n'a pas encore de contenu visible." />
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} />}
    </section>
  );
}
