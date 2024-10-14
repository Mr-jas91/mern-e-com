import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { User } from "../../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken;

  // console.log(accessToken);
  if (!accessToken) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }

  let decodedToken = await jwt
    .verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .catch(() => null);

  const user = await User.findById(decodedToken._id);
  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid refresh token"));
  }

  const newAccessToken = user.generateAccessToken();
  const Options = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  };
  res.cookie("accessToken", newAccessToken, Options);
  req.user = user;
  next();
});
