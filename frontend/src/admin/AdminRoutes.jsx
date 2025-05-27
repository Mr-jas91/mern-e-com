import React, { Suspense } from "react";
import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentPage from "./pages/PaymentPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PublicRoute from "./route/PublicRoute";
import PrivateRoute from "../user/route/PrivateRoute";
import Loader from "../shared/Loader/Loader";
const AdminRoutes = () => {
  return (
    <Router>
    <Suspense fallback={<Loader />}>
    <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          theme="light"
        />
      <Routes>
        // Public Route
        <Route
          exact
          path="/login"
          element={
            <PublicRoute
              element={<LoginPage />}
              restricted={true}
              redirectTo="/dashboard"
            />
          }
        />
        <Route
          exact
          path="/register"
          element={
            <PublicRoute
              element={<SignupPage />}
              restricted={true}
              redirectTo="/dashboard"
            />
          }
        />
        // Private Route
        <Route
          exact
          path="/dashboard"
          // element={<DashboardPage />}
          element={
            <PrivateRoute element={<DashboardPage />} redirectTo="/login" />
          }
        />
        <Route
          exact
          path="/orders"
          element={
            <PrivateRoute element={<OrdersPage />} redirectTo="/login" />
          }
        />
        <Route
          exact
          path="/payments"
          element={
            <PrivateRoute element={<PaymentPage />} redirectTo="/login" />
          }
        />
        <Route
          exact
          path="/products"
          element={
            <PrivateRoute element={<ProductsPage />} redirectTo="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
};

export default AdminRoutes;
