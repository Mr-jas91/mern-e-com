import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { currentAdmin } from "../../redux/reducers/adminReducer";
import { getAdminToken } from "../../shared/token";
import Loader from "../../shared/Loader/Loader";
const PrivateRoute = ({ element, redirectTo }) => {
  const dispatch = useDispatch();
  const { admin, loading, error } = useSelector((state) => state.admin);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const token = getAdminToken();
  // console.log(admin)
  useEffect(() => {
    // 🟢 If token exists but admin is not in store, fetch user info
    if (token && !admin) {
      dispatch(currentAdmin()).finally(() => setCheckingAuth(false));
    } else {
      // ❌ Don't try to check auth if no token exists at all
      setCheckingAuth(false);
    }
  }, [dispatch, admin, token]);
  

  // Display a loader while authentication is being verified
  if (checkingAuth || loading) {
    return <Loader />;
  }

  // Redirect if an authentication error occurs
  if (error) {
    return <Navigate to={redirectTo} />;
  }

  // Render the element only if user exists, otherwise redirect
  return admin ? element : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
