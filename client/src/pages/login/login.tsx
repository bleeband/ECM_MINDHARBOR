import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Veuillez remplir votre courriel et votre mot de passe.");
      return;
    }

    try {
      setIsLoading(true);
      const session = await login({
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem("accessToken", session.accessToken);
      localStorage.setItem("refreshToken", session.refreshToken);
      setUser(session.user);
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
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-sky-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">ECM</span>
            MindHarbor
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">Bon retour</h1>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                autoComplete="current-password"
                value={form.password}
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
              <LogIn className="h-5 w-5" />
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            Vous n'avez pas encore de compte?{" "}
            <Link to="/register" className="font-semibold text-sky-700">
              Créer un compte
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
