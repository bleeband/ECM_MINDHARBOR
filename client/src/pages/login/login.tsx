import { useAuth } from "../../context/AuthContext.tsx";
import { api } from "../../api/axios.ts";
import { useState } from "react";

function Login() {
  const { seConnecter } = useAuth();
  const [username, setUsername] = useState("");
  const [pwd, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`/auth/login`, { email: username, password: pwd });
      seConnecter(data.token);
    } catch (e) {
      setError("Erreur lors de la connexion");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} placeholder="Entrer votre email" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={pwd} placeholder="Entrer votre mot de passe" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button>Se connecter</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
