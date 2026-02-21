import { asyncHandler } from "../../utils/asyncHander.js";
import { ApiError } from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.models.js";
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.userAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fixed: select syntax requires a string "-password" or fields separated by space
    const user = await User.findById(decodedToken?._id).select("_id firstName");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // If token is expired, the frontend should catch this 401 and call /refresh-token
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
