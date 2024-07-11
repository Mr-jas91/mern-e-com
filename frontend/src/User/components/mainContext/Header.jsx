import React, { useState, useEffect, useRef } from "react";
import { CiUser, CiHeart, CiShoppingCart, CiPower } from "react-icons/ci";
import { FaRegUserCircle, FaBars } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayMobileMenu, setDisplayMobileMenu] = useState(false);
  const { isAuthenticated } = useAuth();
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setDisplayMenu(false);
    }
  };

  useEffect(() => {
    if (displayMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayMenu]);

  const handleMenuLinkClick = () => {
    setDisplayMenu(false);
    setDisplayMobileMenu(false);
  };

  return (
    <nav className="h-16 items-center justify-between bg-gray-600 py-2 px-4 md:px-12 flex">
      <div className="flex items-center">
        <button
          className="text-white text-3xl md:hidden mr-4"
          onClick={() => setDisplayMobileMenu(!displayMobileMenu)}
        >
          <FaBars />
        </button>
        <Link to="/" className="text-white text-2xl font-bold">
          BrandName
        </Link>
      </div>
      <div className="flex flex-1 justify-center">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-32 md:w-64 mr-2 rounded-md"
        />
        <button className="text-white bg-orange-500 py-2 px-2 font-bold rounded-md">
          Search
        </button>
      </div>
      <div className="hidden md:flex flex-row items-center">
        <Link to="/home" className="ml-2 text-white text-xl">
          Home
        </Link>
        <Link
          to="/login"
          className={`${
            isAuthenticated ? "hidden" : "block"
          } ml-2 text-white text-xl`}
        >
          Login
        </Link>
        <button className="ml-2 text-white text-3xl">
          <Link to="/wishlist">
            <CiHeart />
          </Link>
        </button>
        <button className="ml-2 text-white text-3xl">
          <Link to="/cart">
            <CiShoppingCart />
          </Link>
        </button>
        <button
          className="ml-2 text-white text-3xl"
          onClick={() => setDisplayMenu(!displayMenu)}
        >
          <CiUser />
        </button>
        <div
          ref={menuRef}
          className={`bg-Zinc-700 bg-opacity-75 rounded-md w-48 h-48 fixed top-12 z-10 right-14 flex-col items-center justify-center grid gap-2 ${
            displayMenu ? "block" : "hidden"
          }`}
        >
          <Link
            to="/profile"
            className="text-white text-xl flex items-center"
            onClick={handleMenuLinkClick}
          >
            <FaRegUserCircle />
            <p className="text-white text-xl ml-2">My Profile</p>
          </Link>
          <Link
            to="/order"
            className="text-white text-xl flex items-center"
            onClick={handleMenuLinkClick}
          >
            <LuShoppingBag />
            <p className="text-white text-xl ml-2">Orders</p>
          </Link>
          <Link
            to="/wishlist"
            className="text-white text-xl flex items-center"
            onClick={handleMenuLinkClick}
          >
            <CiHeart />
            <p className="text-xl ml-2">Wishlist</p>
          </Link>
          <Link
            to={isAuthenticated ? "/logout" : "/signup"}
            className="text-white text-xl"
            onClick={handleMenuLinkClick}
          >
            {isAuthenticated ? (
              <div className="flex items-center">
                <CiPower />
                <p className="ml-2">Logout</p>
              </div>
            ) : (
              <p className="ml-2">SignUp</p>
            )}
          </Link>
        </div>
      </div>
      <div
        className={`${
          displayMobileMenu ? "block" : "hidden"
        } absolute top-16 left-0 w-full bg-gray-600 z-10 md:hidden`}
      >
        <Link
          to="/home"
          className="block py-2 px-4 text-white text-xl"
          onClick={handleMenuLinkClick}
        >
          Home
        </Link>

        <Link
          to="/wishlist"
          className="block py-2 px-4 text-white text-xl"
          onClick={handleMenuLinkClick}
        >
          Wishlist
        </Link>
        <Link
          to="/cart"
          className="block py-2 px-4 text-white text-xl"
          onClick={handleMenuLinkClick}
        >
          Cart
        </Link>
        <Link
          to="/profile"
          className="block py-2 px-4 text-white text-xl"
          onClick={handleMenuLinkClick}
        >
          Profile
        </Link>
        <Link
          to="/order"
          className="block py-2 px-4 text-white text-xl"
          onClick={handleMenuLinkClick}
        >
          Orders
        </Link>
        <Link
          to="/login"
          className={`${
            isAuthenticated ? "hidden" : "block"
          } py-2 px-4 text-white text-xl`}
          onClick={handleMenuLinkClick}
        >
          Login
        </Link>
        <Link
          to={isAuthenticated ? "/logout" : "/signup"}
          className="block py-2 px-4 text-white text-xl"
          onClick={handleMenuLinkClick}
        >
          {isAuthenticated ? <p>Logout</p> : <p>SignUp</p>}
        </Link>
      </div>
    </nav>
  );
}

export default Header;
