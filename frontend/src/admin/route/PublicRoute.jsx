import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { currentAdmin } from "../../redux/reducers/adminReducer";
import { getAdminToken } from "../../shared/token";
import Loader from "../../shared/Loader/Loader";
const PublicRoute = ({ element, restricted, redirectTo }) => {
  const dispatch = useDispatch();
  const { admin, loading } = useSelector((state) => state.admin);
  const shouldRedirect = admin && restricted;
  const token = getAdminToken();
  useEffect(() => {
    if (!admin && token) {
      dispatch(currentAdmin());  
    }
  }, [dispatch, admin]);            

  if (loading) {
    return <Loader />;
  }

  // If restricted and user is logged in, redirect
  return shouldRedirect ? <Navigate to={redirectTo} /> : element;
};

export default PublicRoute;
