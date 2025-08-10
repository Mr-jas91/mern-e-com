import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy-loaded pages
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));

// Non-lazy (or already loaded) component
import OrderDetailsPage from "./pages/OrderDetailsPage";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";
import Loader from "../shared/Loader/Loader";

function UserRoutes() {
  return (
    <>
      {/* Static UI (no suspense needed) */}
      <Suspense fallback={<Loader />}>
        <Navbar />
      </Suspense>

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
        {/* Public Routes */}
        <Route
          path="/home"
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute element={<HomePage />} />
            </Suspense>
          }
        />
        <Route
          path="/product/:id"
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute element={<ProductPage />} />
            </Suspense>
          }
        />
        <Route
          path="/user/signin"
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute
                element={<LoginPage />}
                restricted
                redirectTo="/home"
              />
            </Suspense>
          }
        />
        <Route
          path="/user/register"
          element={
            <Suspense fallback={<Loader />}>
              <PublicRoute
                element={<RegisterPage />}
                restricted
                redirectTo="/home"
              />
            </Suspense>
          }
        />

        {/* Private Routes */}
        <Route
          path="/user/account"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute
                element={<ProfilePage />}
                redirectTo="/user/signin"
              />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute element={<CartPage />} redirectTo="/user/signin" />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute
                element={<CheckoutPage />}
                redirectTo="/user/signin"
              />
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute
                element={<OrderHistoryPage />}
                redirectTo="/user/signin"
              />
            </Suspense>
          }
        />
        <Route
          path="/order/:id/details"
          element={
            <PrivateRoute
              element={<OrderDetailsPage />}
              redirectTo="/user/signin"
            />
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
