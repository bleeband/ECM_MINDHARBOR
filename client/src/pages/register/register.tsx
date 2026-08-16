import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { register } from "../../api/auth";

type RegisterForm = {
  email: string;
  pseudonyme: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    pseudonyme: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validateForm(): string | null {
    if (!form.email.trim() || !form.pseudonyme.trim() || !form.password || !form.confirmPassword) {
      return "Veuillez remplir tous les champs.";
    }
    if (form.pseudonyme.trim().length < 2) {
      return "Le pseudonyme doit contenir au moins 2 caractères.";
    }
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return "Le mot de passe doit contenir 8 caractères, une majuscule et un chiffre.";
    }
    if (form.password !== form.confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      await register({
        email: form.email.trim(),
        pseudonyme: form.pseudonyme.trim(),
        password: form.password,
      });
      navigate("/login");
    } catch {
      setError("La création du compte n'a pas fonctionné. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-sky-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">MH</span>
            MindHarbor
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">Créer votre espace</h1>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Pseudonyme</span>
              <input
                name="pseudonyme"
                autoComplete="nickname"
                value={form.pseudonyme}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Courriel</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Confirmer le mot de passe</span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            {error && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white disabled:opacity-60">
              <UserPlus className="h-5 w-5" />
              {isLoading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="font-semibold text-sky-700">
              Se connecter
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
