import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";
import Loader from "./shared/Loader/Loader";
function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Suspense>
  );
}

export default App;
