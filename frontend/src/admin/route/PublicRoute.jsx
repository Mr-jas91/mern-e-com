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

  useEffect(() => {
    if (!admin && getAdminToken()) {
      dispatch(currentAdmin()); 
    }
  }, []);

  if (loading) {
    return <Loader />;
  }
  return shouldRedirect ? <Navigate to={redirectTo} /> : element;
};

export default PublicRoute;
