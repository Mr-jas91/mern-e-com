import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import jwt from "jsonwebtoken";
import { Admin } from "../../models/admin.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.adminAccessToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.log("JWT Error:", err.message);
      return res
        .status(401)
        .json(new ApiError(401, "Invalid or expired access token"));
    }

    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!admin || !admin.isAdmin) {
      return res
        .status(403)
        .json(new ApiError(403, "Access denied. Admin privileges required."));
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});
