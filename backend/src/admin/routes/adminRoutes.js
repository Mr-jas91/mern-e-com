import express from "express";
import { verifyJWT } from "../middleware/auth.AdminMiddleware.js";
import { upload } from "../middleware/multer.js";

// Admin controller
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAdminProfile
} from "../controller/adminController.js";

// Category controller
import {
  createCategory,
  getCategory
} from "../controller/categoryController.js";

// Dashboard controller
import { getAdminDashboardData } from "../controller/dashboardController.js";

// Inventory controller
import {
  getProductStock,
  updateInventory
} from "../controller/inventryController.js";

// Order controller
import {
  getOrders,
  getOrderDetails,
  updateDeliveryStatus,
  acceptOrderItem
} from "../controller/orderController.js";

// Product controller
import {
  addProduct,
  getProducts,
  getProductDetails,
  updateProductDetails,
  deleteProduct
} from "../controller/productController.js";

// Review controller
import {
  getReviewsByProduct,
  deleteReview
} from "../controller/reviewController.js";

// User controller
import {
  getAllUsers,
  getActiveUsersCount
} from "../controller/userController.js";

// Create router
const router = express.Router();

// Admin routes
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/auth").get(verifyJWT, getCurrentUser);
router.route("/profile").get(verifyJWT, getAdminProfile);

// Category routes
router.route("/category").get(verifyJWT, getCategory);
router.route("/newcategory").post(verifyJWT, createCategory);

// Dashboard routes
router.route("/dashboard").get(verifyJWT, getAdminDashboardData);

// Inventory routes
router.route("/productstock/:id").get(verifyJWT, getProductStock);
router.route("/updateinventry/:id").put(verifyJWT, updateInventory);

// Order routes
router.route("/orders").get(verifyJWT, getOrders);
router.route("/order/:id").get(verifyJWT, getOrderDetails);
router.route("/updatedeliverystatus").post(verifyJWT, updateDeliveryStatus);
router.route("/accept-order/:id").put(verifyJWT, acceptOrderItem);

// Product routes
router
  .route("/addproduct")
  .post(verifyJWT, upload.array("images", 10), addProduct);
router.route("/products").get(verifyJWT, getProducts);
router
  .route("/product/:id")
  .get(verifyJWT, getProductDetails)
  .post(verifyJWT, upload.array("images", 10), updateProductDetails)
  .delete(verifyJWT, deleteProduct);

// Review routes
router.route("/review/:productId").get(verifyJWT, getReviewsByProduct);
router.route("/review/:reviewId").delete(verifyJWT, deleteReview);

// User routes
router.route("/users").get(verifyJWT, getAllUsers);
router.route("/activeuser").get(verifyJWT, getActiveUsersCount);

export default router;
