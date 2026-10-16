import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Groupdetails from "./pages/groupdetails";
import Addexpense from "./pages/addexpense";
import Choosesplit from "./pages/choosesplit"
import Creategroup from "./pages/creategroup"
import Settleup from "./pages/settleup"
import Groupsetting from "./pages/groupsetting"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/groupdetails" element={<Groupdetails />} />
      <Route path="/addexpense" element={<Addexpense />} />
       <Route path="/choosesplit" element={<Choosesplit />} />
        <Route path="/creategroup" element={<Creategroup />} />
         <Route path="/settleup" element={<Settleup />} />
          <Route path="/groupsetting" element={<Groupsetting />} />
    </Routes>
  );
}

export default App;