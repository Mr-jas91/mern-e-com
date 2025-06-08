import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentAdmin } from "../../redux/reducers/adminReducer";
import { getAdminToken } from "../../shared/token";

const useAdminAuthCheck = () => {
  const dispatch = useDispatch();
  const { admin, loading, error } = useSelector((state) => state.admin);
  const [authChecked, setAuthChecked] = useState(false);
  const token = getAdminToken();

  useEffect(() => {
    if (token && !admin && !authChecked) {
      dispatch(currentAdmin()).finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { admin, loading, error, authChecked };
};

export default useAdminAuthCheck;