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
    "firstName lastName"
  );
  const cookieOptions = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(201)
    .cookie("userAccessToken", accessToken, cookieOptions)
    .cookie("userRefreshToken", refreshToken, cookieOptions)
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
    "firstName lastName"
  );
  const cookieOptions = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(200)
    .cookie("userAccessToken", accessToken, cookieOptions)
    .cookie("userRefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
          refreshToken: refreshToken
        },
        "Logged in successfully"
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndUpdate(userId, { refreshToken: "", accessToken: "" });

  const cookieOptions = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(200)
    .clearCookie("userAccessToken", cookieOptions)
    .clearCookie("userRefreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "firstName lastName email phone address"
  );

  if (!user) {
    return res.status(400).json(new ApiError(400, "Please login"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    userId
  );
  const Options = { httpOnly: true, secure: false, sameSite: "Strict" };

  return res
    .status(200)
    .cookie("userAccessToken", accessToken, Options)
    .cookie("userRefreshToken", refreshToken, Options)
    .json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken,
          refreshToken
        },
        "User fetched successfully"
      )
    );
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "firstName lastName email phone address"
  );
  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist."));
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
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
          user: user,
          accessToken,
          refreshToken
        },
        "User profile fetched successfully"
      )
    );
});

// update user details

const updateUserDetails = asyncHandler(async (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json(new ApiError(400, "Please input all fields"));
  }

  const user = await User.findByIdAndUpdate(data._id, data).select(
    "firstName lastName email phone address"
  );

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User details updated successfully"));
});
export {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  updateUserDetails
};
