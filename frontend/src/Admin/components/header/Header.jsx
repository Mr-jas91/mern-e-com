import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
function Header() {
  const { isOpen,setIsOpen } = useAuth();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-300 w-full h-16 pl-1 md:pl-12 pr-12 m-0 justify-between flex flex-row items-center fixed z-10">
      <div className="flex items-center">
        <button
          className="p-4 focus:outline-none block md:hidden" // Hide on tablets and larger screens
          onClick={toggleNavbar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <p className="text-2xl">logo</p>
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Search"
          className="rounded-lg mr-2 block w-48"
        />
        <button type="submit" className="bg-orange-500 rounded-lg p-2 w-32">
          Search
        </button>
      </div>
      <div className="flex flex-row items-center">
        <p className="text-3xl mr-2">User</p>
        <Link to='/signup' className="text-3xl bg-orange-600 py-2 px-1 rounded-lg">sign Up</Link>
      </div>
    </nav>
  );
}

export default Header;
