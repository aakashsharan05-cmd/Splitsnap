
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Groupdetails from "./pages/groupdetails";
import Addexpense from "./pages/addexpense";
import Choosesplit from "./pages/choosesplit";
import Creategroup from "./pages/creategroup";
import Settleup from "./pages/settleup";
import Groupsetting from "./pages/groupsetting";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Group-specific pages */}
      <Route path="/groups/:groupId" element={<Groupdetails />} />
      <Route path="/groups/:groupId/add-expense" element={<Addexpense />} />
      <Route path="/groups/:groupId/choose-split" element={<Choosesplit />} />
      <Route path="/groups/:groupId/settle-up" element={<Settleup />} />
      <Route path="/groups/:groupId/settings" element={<Groupsetting />} />

      {/* Create group */}
      <Route path="/create-group" element={<Creategroup />} />
    </Routes>
  );
}

export default App;
