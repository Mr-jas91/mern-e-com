import { User } from "../../models/user.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// Helper function to generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Create user
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if ([firstName, lastName, email, password].some((field) => !field?.trim())) {
    return res.status(400).json(new ApiError(400, "Please input all fields"));
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res
      .status(400)
      .json(new ApiError(400, "User already exists, please login"));
  }

  const user = new User({ firstName, lastName, email, password });
  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const registeredUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const cookieOptions = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: registeredUser, accessToken, refreshToken },
        "Registered successfully"
      )
    );
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => !field?.trim())) {
    return res.status(400).json(new ApiError(400, "Please input all fields"));
  }

  const existUser = await User.findOne({ email });
  if (!existUser || !(await existUser.isPasswordCorrect(password))) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid email or password."));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existUser._id
  );
  const loggedInUser = await User.findById(existUser._id).select(
    "-password -refreshToken"
  );
  const cookieOptions = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "Logged in successfully"
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

  const cookieOptions = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("firstName lastName");

  if (!user) {
    return res.status(400).json(new ApiError(400, "Please login"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    req.user._id
  );
  const Options = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, Options)
    .cookie("accessToken", accessToken, Options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User fetched successfully"
      )
    );
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "firstName lastName email"
  );
  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export { createUser, loginUser, logoutUser, getCurrentUser, getUserProfile };
