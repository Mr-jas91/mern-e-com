import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../../../redux/reducers/authReducer.js";
import { getCart, clearCart } from "../../../redux/reducers/cartReducer.js";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, accessToken, error } = useSelector((state) => state.auth);
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleAvatarClick = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsCartOpen(false);
  };

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const handleListItemClick = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logoutUser(accessToken));
      await dispatch(clearCart());
      toast.success("Successfully logged out!", {
        autoClose: 5000,
        position: "top-center"
      });
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.", {
        autoClose: 5000,
        position: "top-center"
      });
    }
  };
  useEffect(() => {
    if (user) {
      dispatch(getCart(accessToken));
    }
  }, [user]);
  return (
    <div className="navbar bg-black">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl bg-white">
          daisyUI
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-none mx-4 relative">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full max-w-xs z-10"
          style={{ transition: "all 0.3s ease" }}
        />
      </div>

      <div className="flex-none">
        {/* Cart Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle bg-white"
            onClick={handleCartClick}
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">
                {cartItems?.length ? cartItems?.length : 0}
              </span>
            </div>
          </div>
          {isCartOpen && (
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">
                  {cartItems?.length
                    ? `${cartItems.length} Items`
                    : "Empty cart"}
                </span>

                <span className="text-info">
                  {totalPrice ? `Subtotal: $ ${totalPrice.toFixed(2)}` : ""}
                </span>
                <div className="card-actions">
                  <Link
                    to="/mycart"
                    className="btn btn-primary btn-block"
                    onClick={handleCartClick}
                  >
                    View cart
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
            onClick={handleAvatarClick}
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li onClick={handleListItemClick}>
                <Link to="/">Home</Link>
              </li>
              <li onClick={handleListItemClick}>
                <Link to="/myorders">My Orders</Link>
              </li>
              <li onClick={handleListItemClick}>
                <Link to="/mycart">My Cart</Link>
              </li>
              {/* <li onClick={handleListItemClick}>
                <Link to="/wishlist">Wishlist</Link>
              </li> */}
              <li onClick={handleListItemClick}>
                <Link to="/profile">Profile</Link>
              </li>
              {/* <li onClick={handleListItemClick}>
                <Link to="/settings">Settings</Link>
              </li> */}
              <li onClick={handleListItemClick}>
                {user ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <Link to="/register">Register</Link>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
