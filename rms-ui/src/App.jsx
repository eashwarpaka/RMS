import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Cashier from "./pages/Cashier";
import Kitchen from "./pages/Kitchen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/cashier" element={<Cashier />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
