import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Acceuil from "./pages/accueil";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import Admin from "./pages/admin/admin";
//import Journal from "./pages/journal/journal";
//import Analyse from "./pages/analyse/analyse";
//import Groupe from "./pages/groupe/groupe";
//import Messagerie from "./pages/messagerie/messagerie";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Acceuil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authentifié */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin seulement */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

//// REMPLACER PAR LES PAGES
{
  /* <Route path="/journal" element={<Journal />} /> */
}
{
  /* <Route path="/analyse" element={<Analyse />} /> */
}
{
  /* <Route path="/groupe" element={<Groupe />} /> */
}
{
  /* <Route path="/messagerie" element={<Messagerie />} /> */
}
