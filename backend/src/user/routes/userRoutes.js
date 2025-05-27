import express from "express";
import { verifyJWT } from "../middleware/auth.Middleware.js";
const router = express.Router();

// User controller
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  updateUserDetails
} from "../controller/userController.js";
// Product controller
import {
  getProducts,
  getProductDetails,
  getProductDetailsByCategory,
  getCategory
} from "../controller/productAndCategory.js";
//order controller
import {
  createOrder,
  getUserOrderHistory,
  getOrderDetails,
  cancelOrder
} from "../controller/orderController.js";
//Cart controller
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
} from "../controller/cartController.js";

// Wishlist controller
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controller/wishlistController.js";

//Authentication and user API
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/auth").get(verifyJWT, getCurrentUser);
router
  .route("/me")
  .get(verifyJWT, getUserProfile)
  .put(verifyJWT, updateUserDetails);

// Products and category API
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/products/category/:categoryId").get(getProductDetailsByCategory);
router.route("/products/categories").get(getCategory);

//Order API
router.route("/createorder").post(verifyJWT, createOrder);
router.route("/myorders").get(verifyJWT, getUserOrderHistory);
router
  .route("/myorder/:orderId")
  .get(verifyJWT, getOrderDetails)
  .put(verifyJWT, cancelOrder);

//Cart API
router
  .route("/cart")
  .post(verifyJWT, addToCart)
  .get(verifyJWT, getCart)
  .put(verifyJWT, updateQuantity);
router.route("/cart/:productId").delete(verifyJWT, removeFromCart);

// Wishlist API
router
  .route("/wishlist")
  .post(verifyJWT, addToWishlist)
  .get(verifyJWT, getWishlist)
  .delete(verifyJWT, removeFromWishlist);
export default router;
