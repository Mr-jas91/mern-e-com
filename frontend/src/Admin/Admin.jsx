import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

const SignIn = lazy(() => import("./components/Auth/SignIn"));
const SignUp = lazy(() => import("./components/Auth/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Order"));
const Header = lazy(() => import("./components/header/Header"));
const SideMenu = lazy(() => import("./components/header/SideMenu"));

function Admin() {
  return (
    <div>
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
            <div className="flex flex-1 pt-16">
              <SideMenu />
              <Switch>
                <Route path="/login" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/products" component={Products} />
                <Route path="/orders" component={Orders} />
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </div>
          </Suspense>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default Admin;

{
  /*<PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/products" component={Products} />
            <PrivateRoute path="/orders" component={Orders} /> */
}
