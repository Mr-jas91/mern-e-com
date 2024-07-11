import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated,setIsAuthenticated] = useState(false)

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const user = await getCurrentUser();
  //     setUser(user);
  //   };
  //   fetchUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isOpen, setIsOpen, isAuthenticated,setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
