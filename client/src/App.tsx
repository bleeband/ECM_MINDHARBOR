import { BrowserRouter, Route, Routes } from "react-router-dom";
import Acceuil from "./pages/acceuil";
import Login from "./pages/login/login";
import Register from "./pages/register/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
