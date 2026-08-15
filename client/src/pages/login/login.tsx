import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Veuillez remplir votre courriel et votre mot de passe.");
      return;
    }

    setIsLoading(true);

    try {
      /*
       * TEMPORAIRE
       *
       * À remplacer ensuite par :
       *
       * await login({
       *   email: form.email,
       *   password: form.password,
       * });
       */

      console.log("Connexion :", form);

      navigate("/dashboard");
    } catch {
      setError("La connexion n'a pas fonctionné. Vérifiez vos informations et réessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / titre */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-sky-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">MH</span>
            MindHarbor
          </Link>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">Bon retour</h1>

          <p className="mt-2 text-slate-600">Connectez-vous pour accéder à votre espace personnel.</p>
        </div>

        {/* Formulaire */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Courriel */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Courriel
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* Erreur */}
            {error && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60">
              <LogIn className="h-5 w-5" />

              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Vous n'avez pas encore de compte?{" "}
            <Link to="/register" className="font-semibold text-sky-700 hover:text-sky-900">
              Créer un compte
            </Link>
          </div>
        </section>

        {/* Aide */}
        <p className="mt-6 text-center text-sm text-slate-500">MindHarbor ne remplace pas l'aide d'un professionnel.</p>

        <div className="mt-3 text-center">
          <Link to="/urgence" className="text-sm font-semibold text-rose-700 hover:text-rose-900">
            Besoin d'aide maintenant?
          </Link>
        </div>
      </div>
    </main>
  );
}
