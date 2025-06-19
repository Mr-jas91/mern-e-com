import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicRoute from "./route/PublicRoute";
import PrivateRoute from "./route/PrivateRoute";
import Loader from "../shared/Loader/Loader";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));


const AdminRoutes = () => {
  return (
    <>
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
          {/* Public Route */}
          <Route
            exact
            path="/login"
            element={
              <PublicRoute
                element={<LoginPage />}
                restricted={true}
                redirectTo="/admin/dashboard"
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
                redirectTo="/admin/dashboard"
              />
            }
          />
          {/* Private Route */}
          <Route
            exact
            path="/dashboard"
            element={
              <PrivateRoute
                element={<DashboardPage />}
                redirectTo="/admin/login"
              />
            }
          />
          <Route
            exact
            path="/orders"
            element={
              <PrivateRoute
                element={<OrdersPage />}
                redirectTo="/admin/login"
              /> // Update redirect path
            }
          />
          <Route
            exact
            path="/payments"
            element={
              <PrivateRoute
                element={<PaymentPage />}
                redirectTo="/admin/login"
              /> // Update redirect path
            }
          />
          <Route
            exact
            path="/products"
            element={
              <PrivateRoute
                element={<ProductsPage />}
                redirectTo="/admin/login"
              /> // Update redirect path
            }
          />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AdminRoutes;
