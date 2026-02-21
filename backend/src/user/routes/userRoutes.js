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
  updateUserDetails,
  refreshAccessToken,
  addAddress,
  updateAddress,
  getAddress,
  deleteAddress
} from "../controller/userController.js";
// Product controller
import {
  getProducts,
  getProductDetails,
  getProductDetailsByCategory,
  getCategory,
  searchProducts
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
// Webhook controller
import { razorpayWebhook } from "../controller/webhookController.js";

//Authentication and user API
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/auth").get(verifyJWT, getCurrentUser);
router
  .route("/me")
  .get(verifyJWT, getUserProfile)
  .put(verifyJWT, updateUserDetails);
router.route("/address").get(verifyJWT, getAddress).post(verifyJWT, addAddress);
router
  .route("/address/:addressId")
  .put(verifyJWT, updateAddress)
  .delete(verifyJWT, deleteAddress);
router.route("/refresh-token").get(refreshAccessToken);
// Products and category API
router.route("/products/categories").get(getCategory);
router.route("/products/category/:categoryId").get(getProductDetailsByCategory);
router.route("/product/search").get(searchProducts);
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProductDetails);
//Order API
router.route("/createorder").post(verifyJWT, createOrder);
router.route("/myorders").get(verifyJWT, getUserOrderHistory);
router
  .route("/myorder/:orderId/:orderItemId")
  .get(verifyJWT, getOrderDetails)
  .put(verifyJWT, cancelOrder);

//Cart API
router
  .route("/cart")
  .get(verifyJWT, getCart)
  .post(verifyJWT, addToCart)
  .put(verifyJWT, updateQuantity);
router.route("/cart/:_id").delete(verifyJWT, removeFromCart);

// Wishlist API
router
  .route("/wishlist")
  .post(verifyJWT, addToWishlist)
  .get(verifyJWT, getWishlist)
  .delete(verifyJWT, removeFromWishlist);
// Webhook API
router.route("/webhook").post(razorpayWebhook);
export default router;
