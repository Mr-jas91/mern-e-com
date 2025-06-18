import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/reducers/authReducer";
import { getCart, clearCart } from "../../../redux/reducers/cartReducer";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

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
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/home");
  };

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  return (
    <div className="navbar bg-black">
      <div className="flex-1">
        <Link to="/home" className="btn btn-ghost text-xl text-black bg-white">
          Myshop918
        </Link>
      </div>

      {/* Cart Dropdown */}
      <div className="flex-none">
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
                {cartItems?.items?.length ? cartItems?.items?.length : 0}
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
                  {cartItems?.items?.length
                    ? `${cartItems?.items?.length} Items`
                    : "Empty cart"}
                </span>

                <span className="text-info">
                  {cartItems?.finalPrice
                    ? `Subtotal: ₹ ${cartItems?.finalPrice.toFixed(2)}`
                    : ""}
                </span>
                <div className="card-actions">
                  <Link
                    to="/cart"
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
                <Link to="/home">Home</Link>
              </li>
              <li onClick={handleListItemClick}>
                <Link to="/orders">My Orders</Link>
              </li>
              <li onClick={handleListItemClick}>
                <Link to="/cart">My Cart</Link>
              </li>
              <li onClick={handleListItemClick}>
                <Link to="/user/account">Profile</Link>
              </li>
              <li onClick={handleListItemClick}>
                <Link to="/admin/dashboard">Admin</Link>
              </li>
              <li onClick={handleListItemClick}>
                {user ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <Link to="/user/signin">Sign in</Link>
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
