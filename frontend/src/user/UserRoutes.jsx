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
const SearchPage = lazy(() => import("./pages/SearchResultPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const Navbar = lazy(() => import("./components/Navbar/Navbar"));

function UserRoutes() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route
                      path="/register"
                      element={
                        <PublicRoute
                          element={<RegisterPage />}
                          restricted={true}
                        />
                      }
                    />
                    <Route
                      path="/search-results"
                      element={<PublicRoute element={<SearchPage />} />}
                    /> */}

          {/* Private routes */}
          {/* <Route
                      path="/mycart"
                      element={<PrivateRoute element={<CartPage />} />}
                    />
                    <Route
                      path="/checkout"
                      element={<PrivateRoute element={<CheckoutPage />} />}
                    />
                    <Route
                      path="/profile"
                      element={<PrivateRoute element={<ProfilePage />} />}
                    />
                    <Route
                      path="/myorders"
                      element={<PrivateRoute element={<OrderHistoryPage />} />}
                    />
                    <Route
                      path="/products/:productId"
                      element={<PrivateRoute element={<ProductPage />} />}
                    />
                    <Route
                      path="/wishlist"
                      element={<PrivateRoute element={<WishlistPage />} />}
                    /> */}

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        <ToastContainer /> {/* Add the ToastContainer component */}
      </Suspense>
    </Router>
  );
}

export default UserRoutes;
