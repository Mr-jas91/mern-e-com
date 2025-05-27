import React from "react";
import UserRoutes from "./user/UserRoutes";
import AdminRoutes from "./admin/AdminRoutes";

function App() {
  const subdomain = window.location.hostname.split(".")[0];

  return (
    <>
      {subdomain === "admin" ? <AdminRoutes /> : <UserRoutes />}
    </>
  );
}

export default App;
