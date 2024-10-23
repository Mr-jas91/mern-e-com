import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PublicRoute from "./route/PublicRoute";
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
// const SearchPage = lazy(() => import("./pages/SearchResultPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));
import OrderDetailsPage from "./pages/OrderDetailsPage";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";
function UserRoutes() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicRoute element={<HomePage />} />} />
          <Route
            path="/products/:id"
            element={<PublicRoute element={<ProductPage />} />}
          />
          <Route
            path="/login"
            element={
              <PublicRoute
                element={<LoginPage />}
                restricted={true}
                redirectTo="/"
              />
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute
                element={<RegisterPage />}
                restricted={true}
                redirectTo="/"
              />
            }
          />

          {/* Private routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute element={<ProfilePage />} redirectTo="/login" />
            }
          />
          <Route
            path="/mycart"
            element={
              <PrivateRoute element={<CartPage />} redirectTo="/login" />
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute element={<CheckoutPage />} redirectTo="/login" />
            }
          />
          <Route
            path="/myorders"
            element={
              <PrivateRoute
                element={<OrderHistoryPage />}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/myorder/:id/:productid"
            element={
              <PrivateRoute
                element={<OrderDetailsPage />}
                redirectTo="/login"
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute element={<WishlistPage />} redirectTo="/login" />
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<PublicRoute element={<HomePage />} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default UserRoutes;
