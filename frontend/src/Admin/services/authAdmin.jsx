import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUser } from "./authServices";
import { useHistory } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...rest }) => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    setLoading,
    setMessage,
    loading,
  } = useAuth();
  const history = useHistory();
  useEffect(() => {
    const checkAuth = async () => {
      await getCurrentUser(setIsAuthenticated, setMessage, setLoading, history);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen text-black text-2xl flex justify-center items-center">
        Checking Authentication...
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        const isAuthRoute = ["/login", "/signup"].includes(
          props.location.pathname
        );
        if (isAuthenticated) {
          if (isAuthRoute) {
            return <Redirect to="/dashboard" />;
          } else {
            if (props.location.pathname === "/dashboard") {
              return <Component {...props} />;
            }
            return <Component {...props} />;
          }
        } else {
          if (isAuthRoute || props.location.pathname === "/dashboard") {
            return <Component {...props} />;
          }
          return <Redirect to="/dashboard" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
