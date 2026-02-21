import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Shared Components
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";

// Lazy Components
const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));

function UserRoutes() {
  return (
    <>
      <Navbar />

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/home" element={<PublicRoute element={<HomePage />} />} />

        <Route
          path="/product/:id"
          element={<PublicRoute element={<ProductPage />} />}
        />

        <Route
          path="/user/signin"
          element={
            <PublicRoute
              element={<LoginPage />}
              restricted={true}
              redirectTo="/home"
            />
          }
        />

        <Route
          path="/user/register"
          element={
            <PublicRoute
              element={<RegisterPage />}
              restricted={true}
              redirectTo="/home"
            />
          }
        />

        {/* --- PRIVATE ROUTES --- */}
        <Route
          path="/user/account"
          element={<PrivateRoute element={<ProfilePage />} />}
        />

        <Route path="/cart" element={<PrivateRoute element={<CartPage />} />} />

        <Route
          path="/checkout"
          element={<PrivateRoute element={<CheckoutPage />} />}
        />

        <Route
          path="/orders"
          element={<PrivateRoute element={<OrderHistoryPage />} />}
        />

        <Route
          path="/order/:id/details"
          element={<PrivateRoute element={<OrderDetailsPage />} />}
        />

        {/* --- DEFAULT REDIRECT --- */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
