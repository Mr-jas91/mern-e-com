import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;
