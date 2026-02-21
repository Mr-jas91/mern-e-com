import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/reducers/authReducer";
import { getUserToken } from "../../shared/token"; 
import Loader from "../../shared/Loader/Loader";

const PublicRoute = ({ element, restricted, redirectTo = "/home" }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const token = getUserToken();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user && token) {
      dispatch(getCurrentUser()).finally(() => setIsChecking(false));
    } else {
      setIsChecking(false);
    }
  }, [dispatch, user, token]);

  if (loading || isChecking) {
    return <Loader />;
  }

  // If restricted (true for Login/Register) AND user is logged in -> Redirect to Home
  if (restricted && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return element;
};

export default PublicRoute;
