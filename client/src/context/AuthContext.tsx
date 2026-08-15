import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { me } from "../api/auth";
import type { AuthUser } from "../types/types";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!localStorage.getItem("accessToken")) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await me();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  return context;
}
