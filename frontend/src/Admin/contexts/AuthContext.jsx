import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <AuthContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isAuthenticated,
        setIsAuthenticated,
        message,
        setMessage,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
