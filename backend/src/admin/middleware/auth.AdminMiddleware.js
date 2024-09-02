import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken || // Check for the refreshToken cookie
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);
console.log(token);
    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    let decodedToken;
    try {
      decodedToken = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log("Error", err.message);
      return res
        .status(401)
        .json(new ApiError(401, "Invalid access token found"));
    }
    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!admin) {
      return res.status(401).json(new ApiError(401, "Invalid Access Token"));
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});
