import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/reducers/authReducer.js";

const PrivateRoute = ({ element, redirectTo }) => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { user, loading, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && accessToken) {
      dispatch(getCurrentUser(accessToken));
    }
  }, [dispatch, user, accessToken]);

  // Display a loader while waiting for the response
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no access token or user is not authenticated, redirect to login
  if (!user && !loading) {
    return <Navigate to={redirectTo} />;
  }

  // If user is authenticated, render the protected component
  return user ? element : null; // Fallback to avoid rendering issues
};

export default PrivateRoute;
