import { useAuth } from "../../context/AuthContext.tsx";
import { api } from "../../api/axios.ts";
import { useState } from "react";

function Register() {
  const { seConnecter } = useAuth();
  const [username, setUsername] = useState("");
  const [pwd, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/register", { email: username, password: pwd });
      const token = response.data.token;
      seConnecter(token);
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} placeholder="Entrer votre email" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={pwd} placeholder="Entrer votre mot de passe" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button>S'inscrire</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Register;
