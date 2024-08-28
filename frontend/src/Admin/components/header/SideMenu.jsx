import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const SideNavbar = () => {
  const { isOpen, isAuthenticated, setIsAuthenticated, setIsOpen } = useAuth();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/admin/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <aside
      className={`bg-gray-800 text-white h-[calc(100vh-4rem)] md:w-64 flex flex-col  transition-all duration-300 fixed`}
    >
      <ul
        className={`flex flex-col gap-2 mt-4 ${
          isOpen ? "block z-10" : "hidden md:block"
        }`}
      >
        {" "}
        {/* Show on mobile and always on desktop */}
        <li className="hover:bg-black text-white font-xl text-center p-2 flex items-center justify-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5v2h6V5m2 14H7v-4a5 5 0 015-5h0a5 5 0 015 5v4z"
            ></path>
          </svg>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="hover:bg-black text-white font-xl text-center p-2 flex items-center justify-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h18v18H3z"
            ></path>
          </svg>
          <Link to="/products">Products</Link>
        </li>
        <li className="hover:bg-black text-white font-xl text-center p-2 flex items-center justify-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 9l3 3-3 3M12 9l3 3-3 3"
            ></path>
          </svg>
          <Link to="/orders">Orders</Link>
        </li>
        <li className="hover:bg-black text-white font-xl text-center p-2 flex items-center justify-center">
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/signup">Signup</Link>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default SideNavbar;
