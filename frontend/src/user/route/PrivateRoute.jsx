import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/reducers/authReducer";
import { getUserToken } from "../../shared/token"; 
import Loader from "../../shared/Loader/Loader";
const PrivateRoute = ({ element, redirectTo }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!user && getUserToken()) {
      dispatch(getCurrentUser()).finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [dispatch, user]);

  // Display a loader while authentication is being verified
  if (loading || checkingAuth) {
    return <Loader />;
  }

  // Redirect if an authentication error occurs
  if (error) {
    return <Navigate to={redirectTo} />;
  }

  // Render the element only if user exists, otherwise redirect
  return user ? element : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
