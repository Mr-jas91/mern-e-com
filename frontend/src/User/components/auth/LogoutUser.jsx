import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LogoutUser() {
  const { setIsAuthenticated } = useAuth();
  const history = useHistory();

  const redirect = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      history.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    redirect();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center text-xl text-black">
      Redirecting to home page....
    </div>
  );
}

export default LogoutUser;
