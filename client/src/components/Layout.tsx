import { useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type LayoutProps = {
  children: ReactNode;
};

type MenuLink = {
  to: string;
  label: string;
  protected?: boolean;
};

const menuLinks: MenuLink[] = [
  { to: "/", label: "Accueil" },
  { to: "/resources", label: "Ressources" },
  { to: "/dashboard", label: "Tableau de bord", protected: true },
  { to: "/journal", label: "Journal", protected: true },
  { to: "/analyse", label: "Tendances", protected: true },
  { to: "/groupe", label: "Groupes", protected: true },
];

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const visibleLinks = menuLinks.filter((link) => !link.protected || user);

  function closeMenu() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={closeMenu}
            className="inline-flex shrink-0 items-center gap-2 text-lg font-bold text-sky-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sm">
              ECM
            </span>
            MindHarbor
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {visibleLinks.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}
            {user && <NavItem to="/profile" label="Profil" />}
            {user?.role === "ADMINISTRATEUR" && (
              <NavItem to="/admin" label="Admin" />
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/urgence"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              Urgence
            </Link>
            {!isLoading &&
              (user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              ) : (
                <>
                  <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Connexion
                  </Link>
                  <Link to="/register" className="rounded-xl bg-sky-700 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-800">
                    Créer un compte
                  </Link>
                </>
              ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <span className="sr-only">Ouvrir le menu</span>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Navigation mobile">
              {visibleLinks.map((link) => (
                <NavItem
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  onClick={closeMenu}
                />
              ))}
              {user && <NavItem to="/profile" label="Profil" onClick={closeMenu} />}
              {user?.role === "ADMINISTRATEUR" && (
                <NavItem to="/admin" label="Admin" onClick={closeMenu} />
              )}
              <Link
                to="/urgence"
                onClick={closeMenu}
                className="mt-2 rounded-xl px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50"
              >
                Urgence
              </Link>
              {!isLoading &&
                (user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 font-semibold text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={closeMenu} className="rounded-xl border border-slate-300 px-3 py-2 text-center font-semibold">
                      Connexion
                    </Link>
                    <Link to="/register" onClick={closeMenu} className="rounded-xl bg-sky-700 px-3 py-2 text-center font-semibold text-white">
                      Créer un compte
                    </Link>
                  </div>
                ))}
            </nav>
          </div>
        )}
      </header>

      {children}
    </div>
  );
}

function NavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-sky-100 text-sky-800"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
