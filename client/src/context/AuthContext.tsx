import { useState, useContext, createContext } from "react";

type AuthType = {
    token: string | null
    estConnecte : boolean
    seConnecter: (token: string) => void
    seDeconnecter: () => void
};


const AuthContext = createContext<AuthType>(null as any);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    function seConnecter(token: string) {
        localStorage.setItem("token", token);
        setToken(token);
    }

    function seDeconnecter() {
        localStorage.removeItem("token");
        setToken(null);
    }

    const estConnecte = !!token;

    return (
        <AuthContext.Provider value={{ token, estConnecte, seConnecter, seDeconnecter }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}