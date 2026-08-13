// src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Role = "USER" | "ADMIN";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [user, setUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>({
    id: "dev-1",
    email: "admin@mindharbor.ca",
    displayName: "Admin Dev",
    role: "ADMIN",
  });

  // temporaire pour simuler le chargement de l'utilisateur
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  //// A remettre quand les endpoints seront disponibles
  // useEffect(() => {
  //   async function loadUser() {
  //     try {
  //       /*
  //        * Plus tard :
  //        *
  //        * const currentUser = await getMe();
  //        * setUser(currentUser);
  //        */

  //       setUser(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   void loadUser();
  // }, []);

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
      }}>
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
