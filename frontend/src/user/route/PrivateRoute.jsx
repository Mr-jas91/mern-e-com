import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../../redux/reducers/authReducer";
import { getUserToken } from "../../shared/token"; 
import Loader from "../../shared/Loader/Loader"

const PrivateRoute = ({ element, redirectTo = "/user/signin" }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  const token = getUserToken();

  useEffect(() => {
    if (!user && token) {
      // Token exists but user state is empty (Refresh case)
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
            // If token is invalid, it will be handled here or in interceptor
        })
        .finally(() => setIsChecking(false));
    } else {
      // Either user exists OR no token exists
      setIsChecking(false);
    }
  }, [dispatch, user, token]);

  if (loading || isChecking) {
    return <Loader />;
  }

  // If user exists, render element. 
  // If not, redirect to login, passing the current location in state
  return user ? (
    element
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
};

export default PrivateRoute;