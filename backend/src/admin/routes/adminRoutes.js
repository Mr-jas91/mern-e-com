import express from "express";
import { verifyJWT } from "../middleware/auth.AdminMiddleware.js";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controller/adminController.js";
const router = express.Router();
import upload from "../middleware/multer.js";
import productController from "../controller/productController.js";
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/auth").post(verifyJWT, getCurrentUser);
router.route("/upload").post(upload, productController.createProduct);

export default router;
