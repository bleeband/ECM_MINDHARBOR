import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import { Layout } from "./components/Layout";

import Acceuil from "./pages/accueil";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Profile from "./pages/profile/profile";
import Admin from "./pages/admin/admin";
import Groupe from "./pages/groupe/groupe";
import DetailGroupe from "./pages/groupe/detail";
import Resources from "./pages/resource/resources";
import Urgence from "./pages/resource/urgence";
import Journal from "./pages/journal/journal";
import Analyse from "./pages/analyse/analyse";
//import Messagerie from "./pages/messagerie/messagerie";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
        {/* Public */}
        <Route path="/" element={<Acceuil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/urgence" element={<Urgence />} />

        {/* Authentifié */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/groupe" element={<Groupe />} />
          <Route path="/groupe/:id" element={<DetailGroupe />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/analyse" element={<Analyse />} />
        </Route>

        {/* Admin seulement */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
