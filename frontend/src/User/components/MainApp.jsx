import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../services/AuthUser"
const Signin = lazy(() => import("./auth/Signin"));
const Signup = lazy(() => import("./auth/Signup"));
const LogoutUser = lazy(() => import("./auth/LogoutUser"));
const Header = lazy(() => import("./mainContext/Header"));
const Home = lazy(() => import("./mainContext/Home"));
const Cart = lazy(() => import("./cart/Cart"));
const Footer = lazy(() => import("./mainContext/Footer"));
const User = lazy(() => import("./userProfile/user"));
const Wishlist = lazy(() => import("./wishlist/Wishlist"));
const Orders = lazy(() => import("./orders/order"));
const ProductLandingPage = lazy(() =>
  import("./productDetails/ProductLandingPage")
);

function MainApp() {
  return (
    <AuthProvider>
      <Router>
        <Suspense
          fallback={
            <div className="w-full h-screen text-black text-2xl flex justify-center items-center">
              Loading...
            </div>
          }
        >
          <Header />
          <Switch>
            <Route path="/home" component={Home} />
            <PrivateRoute path="/login" component={Signin} />
            <PrivateRoute path="/signup" component={Signup} />
            <PrivateRoute path="/cart" component={Cart} />
            <PrivateRoute path="/profile" component={User} />
            <PrivateRoute path="/wishlist" component={Wishlist} />
            <PrivateRoute path="/order" component={Orders} />
            <PrivateRoute path="/info" component={ProductLandingPage} />
            <PrivateRoute path="/logout" component={LogoutUser} />
            <Redirect from="/" to="/home" />
          </Switch>
          <Footer />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default MainApp;
