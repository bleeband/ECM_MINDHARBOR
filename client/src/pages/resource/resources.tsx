import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, ExternalLink, Heart, MapPin, MessageCircle, Phone, Search, ShieldAlert, Users } from "lucide-react";
import { addFavorite, getResources, removeFavorite } from "../../api/resources";
import { EmptyState, ErrorState, LoadingState, Pagination } from "../../components/commons";
import type { Resource, TypeResource } from "../../types/types";

type OfficialResource = {
  titre: string;
  description: string;
  url: string;
  categorie: string;
};

const officialResources: OfficialResource[] = [
  {
    titre: "Info-Social 811",
    description: "Parlez gratuitement et confidentiellement à un professionnel en intervention psychosociale.",
    url: "https://www.quebec.ca/sante/trouver-une-ressource/info-social-811",
    categorie: "Aide et orientation",
  },
  {
    titre: "Trouver un centre de crise",
    description: "Repérez une ressource gratuite et spécialisée en intervention de crise près de chez vous.",
    url: "https://resicq.ca/liste-centres-crise/",
    categorie: "Crise",
  },
  {
    titre: "Tel-jeunes",
    description: "Soutien confidentiel pour les jeunes par téléphone, texto ou clavardage.",
    url: "https://www.teljeunes.com/",
    categorie: "Jeunes",
  },
  {
    titre: "Relief",
    description: "Information et soutien pour vivre avec l'anxiété, la dépression ou la bipolarité.",
    url: "https://relief.ca/",
    categorie: "Anxiété et humeur",
  },
  {
    titre: "Phobies-Zéro",
    description: "Soutien et groupes d'entraide pour les troubles anxieux, incluant le TOC.",
    url: "https://www.phobies-zero.qc.ca/",
    categorie: "Anxiété",
  },
  {
    titre: "CAP santé mentale",
    description: "Information et soutien pour les proches d'une personne vivant avec un trouble mental.",
    url: "https://www.capsantementale.ca/portail-information/",
    categorie: "Proches",
  },
  {
    titre: "Aire ouverte",
    description: "Services de santé et de bien-être pour les jeunes de 12 à 25 ans.",
    url: "https://www.quebec.ca/sante/trouver-une-ressource/aire-ouverte",
    categorie: "Jeunes",
  },
];

export default function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeResource | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      try {
        const data = await getResources({
          page,
          q: search,
          type: type || undefined,
        });

        if (cancelled) return;

        setItems(data.data);
        setTotalPages(data.meta.totalPages);
      } catch {
        if (!cancelled) {
          setError("Impossible de charger les ressources proposées.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadResources();

    return () => {
      cancelled = true;
    };
  }, [page, search, type]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleTypeChange(value: TypeResource | "") {
    setLoading(true);
    setError(null);
    setPage(1);
    setType(value);
  }

  function handlePageChange(nextPage: number) {
    setLoading(true);
    setError(null);
    setPage(nextPage);
  }

  async function handleFavorite(resource: Resource) {
    try {
      setFavoriteLoading(resource.id);

      if (resource.isFavorite) {
        await removeFavorite(resource.id);
      } else {
        await addFavorite(resource.id);
      }

      setItems((current) => current.map((item) => (item.id === resource.id ? { ...item, isFavorite: !item.isFavorite } : item)));
    } catch {
      setError("Impossible de modifier les favoris.");
    } finally {
      setFavoriteLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-sky-700">Ressources</p>
          <h1 className="mt-1 text-3xl font-bold">Trouver de l'aide au Québec</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Des ressources officielles et communautaires pour vous ou un proche.</p>
        </header>

        <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-6" aria-labelledby="urgence-title">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-700">Besoin d'aide maintenant?</p>
              <h2 id="urgence-title" className="mt-1 text-xl font-bold text-rose-950">
                Vous n'avez pas à traverser ça seul·e.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                En cas de danger immédiat pour vous ou un proche, appelez le 911. Pour du soutien concernant le suicide, la ligne québécoise est
                disponible au 1 866 APPELLE (277-3553), par texto au 535353 ou par clavardage.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-800">
                  <Phone className="h-4 w-4" />
                  Appeler le 911
                </a>
                <a
                  href="tel:18662773553"
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-800 hover:bg-rose-100">
                  <Phone className="h-4 w-4" />1 866 APPELLE
                </a>
                <a
                  href="sms:535353"
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-800 hover:bg-rose-100">
                  <MessageCircle className="h-4 w-4" />
                  Texto 535353
                </a>
                <ExternalResourceLink href="https://suicide.ca/fr/clavarder-avec-un-intervenant" label="Clavarder" danger />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="quebec-title">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-sky-700">Références fiables</p>
              <h2 id="quebec-title" className="mt-1 text-2xl font-bold">
                Ressources d'aide et de soutien
              </h2>
            </div>
            <ExternalResourceLink
              href="https://www.quebec.ca/sante/sante-mentale/trouver-aide-et-soutien-en-sante-mentale/trouver-ressource-aide-et-soutien-en-sante-mentale/ressources-aide-et-soutien-sante-mentale-par-besoin"
              label="Voir la liste complète Québec.ca"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {officialResources.map((resource) => (
              <article key={resource.titre} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">{resource.categorie}</span>
                  <MapPin className="h-5 w-5 text-sky-700" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{resource.titre}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{resource.description}</p>
                <ExternalResourceLink href={resource.url} label="Accéder à la ressource" />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-10" aria-labelledby="bibliotheque-title">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="bibliotheque-title" className="text-2xl font-bold">
                Bibliothèque MindHarbor
              </h2>
              <p className="mt-1 text-slate-600">Explorez aussi les ressources ajoutées par l'équipe.</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Rechercher dans la bibliothèque..."
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800">
                <Search className="h-4 w-4" />
                Rechercher
              </button>
            </div>

            <select
              value={type}
              onChange={(event) => handleTypeChange(event.target.value as TypeResource | "")}
              className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-3">
              <option value="">Tous les types</option>
              <option value="ARTICLE">Article</option>
              <option value="EXERCICE">Exercice</option>
              <option value="FICHE_PRATIQUE">Fiche pratique</option>
            </select>
          </form>

          <div className="mt-6">
            {loading ? (
              <LoadingState label="Chargement de la bibliothèque..." />
            ) : error ? (
              <ErrorState message={error} />
            ) : items.length === 0 ? (
              <EmptyState
                title="Aucune ressource dans la bibliothèque"
                description="Les ressources officielles ci-dessus demeurent disponibles en tout temps."
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((resource) => (
                  <article key={resource.id} className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-3">
                      <BookOpen className="h-6 w-6 text-sky-700" />
                      <button
                        type="button"
                        disabled={favoriteLoading === resource.id}
                        onClick={() => void handleFavorite(resource)}
                        aria-label="Ajouter ou retirer des favoris"
                        className="rounded-xl p-2 hover:bg-slate-100 disabled:opacity-50">
                        <Heart className={`h-5 w-5 ${resource.isFavorite ? "fill-rose-600 text-rose-600" : "text-slate-400"}`} />
                      </button>
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase text-sky-700">{resource.type}</p>
                    <h3 className="mt-2 text-xl font-bold">{resource.titre}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{resource.contenu}</p>
                    {resource.url && <ExternalResourceLink href={resource.url} label="Ouvrir la ressource" />}
                  </article>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && !loading && !error && (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onPage={handlePageChange} />
            </div>
          )}
        </section>

        <p className="mt-10 flex items-center gap-2 text-xs leading-5 text-slate-500">
          <Users className="h-4 w-4 shrink-0" />
          Cette page oriente vers des ressources; elle ne remplace pas une aide médicale ou d'urgence.
        </p>
      </div>
    </main>
  );
}

function ExternalResourceLink({ href, label, danger = false }: { href: string; label: string; danger?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${danger ? "text-rose-800" : "text-sky-700"}`}>
      {label}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}
