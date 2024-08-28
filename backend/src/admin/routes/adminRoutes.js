import express from "express";
import { verifyJWT } from "../middleware/auth.AdminMiddleware.js";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controller/adminController.js";
const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/auth").post(verifyJWT, getCurrentUser);

export default router;
