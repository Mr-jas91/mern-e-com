import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/auth",
          {},
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
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
            return <Redirect to="/home" />;
          } else {
            if (props.location.pathname === "/home") {
              return <Component {...props} />;
            }
            return <Component {...props} />;
          }
        } else {
          if (isAuthRoute || props.location.pathname === "/home") {
            return <Component {...props} />;
          }
          return <Redirect to="/home" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
