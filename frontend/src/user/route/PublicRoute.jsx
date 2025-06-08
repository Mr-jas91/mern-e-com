import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/reducers/authReducer";
import { getUserToken } from "../../shared/token"; // Utility for token check
import Loader from "../../shared/Loader/Loader";
const PublicRoute = ({ element, restricted, redirectTo }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const shouldRedirect = user && restricted;

  useEffect(() => {
   
    if (!user && getUserToken()) {
      dispatch(getCurrentUser()); 
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  // If restricted and user is logged in, redirect
  return shouldRedirect ? <Navigate to={redirectTo} /> : element;
};

export default PublicRoute;
