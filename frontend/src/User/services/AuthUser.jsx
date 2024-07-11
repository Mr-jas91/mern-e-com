import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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
        const isAuthRoute = ["/login", "/signup", "logout"].includes(
          props.location.pathname
        );
        if (isAuthenticated) {
          if (isAuthRoute) {
            return <Redirect to="/home" />;
          } else {
            return <Component {...props} />;
          }
        } else {
          if (isAuthRoute) {
            return <Component {...props} />;
          } else {
            return <Redirect to="/home" />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
