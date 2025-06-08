import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));
import OrderDetailsPage from "./pages/OrderDetailsPage";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";
import Loader from "../shared/Loader/Loader";

function UserRoutes() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Navbar />
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
          <Route
            path="/home"
            element={<PublicRoute element={<HomePage />} />}
          />
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

          {/* Private routes */}
          <Route
            path="/user/account"
            element={
              <PrivateRoute
                element={<ProfilePage />}
                redirectTo="/user/signin"
              />
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute element={<CartPage />} redirectTo="/user/signin" />
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute
                element={<CheckoutPage />}
                redirectTo="/user/signin"
              />
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute
                element={<OrderHistoryPage />}
                redirectTo="/user/signin"
              />
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

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default UserRoutes;
