import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Groupdetails from "./pages/groupdetails";
import Addexpense from "./pages/addexpense";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/groupdetails" element={<Groupdetails />} />
      <Route path="/addexpense" element={<Addexpense />} />
    </Routes>
  );
}

export default App;