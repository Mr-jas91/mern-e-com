import express from "express";
import { verifyJWT } from "../middleware/auth.AdminMiddleware.js";
import { upload } from "../middleware/multer.js";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controller/adminController.js";
const router = express.Router();
import { createProduct } from "../controller/productController.js";
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/auth").get(verifyJWT, getCurrentUser);
router
  .route("/upload")
  .post(verifyJWT, upload.array("imagefiles", 10), createProduct);

export default router;
