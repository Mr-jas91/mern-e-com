import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";
import Loader from "./shared/Loader/Loader";
function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Admin Routes - Matches /admin/* */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* User Routes - Matches everything else */}
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Suspense>
  );
}

export default App;
