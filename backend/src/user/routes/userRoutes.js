import express from "express";
import {
  getCurrentUser,
  createUser,
  loginUser,
  logoutUser,
} from "../controller/userController.js";
import { verifyJWT } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.route("/users").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/auth").post(verifyJWT, getCurrentUser);

export default router;
