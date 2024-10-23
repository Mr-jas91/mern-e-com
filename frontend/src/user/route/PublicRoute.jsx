// PublicRoute.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/reducers/authReducer.js";

const PublicRoute = ({ element, restricted, redirectTo }) => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const shouldRedirect = user && restricted;
  useEffect(() => {
    if (!user && accessToken) {
      dispatch(getCurrentUser(accessToken));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return shouldRedirect ? <Navigate to={redirectTo} /> : element;
};

export default PublicRoute;
