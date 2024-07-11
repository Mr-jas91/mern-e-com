import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHander.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return "somethings went wrong";
  }
};

const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "Please input all feild"));
  }

  try {
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User already exists  please login"));
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

    const createdUser = await User.findById(user._id).select("firstName");

    if (!createdUser) {
      return res.status(500).json(new ApiError(500, "Regitration failed"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Registered successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "", error));
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "Please input all feild" });
  }
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const validUser = await existUser.isPasswordCorrect(password);
    if (!validUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      existUser._id
    );
    const options = { httpOnly: true, secure: false, sameSite: "Strict" };

    // .cookie("accessToken", accessToken, options)
    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .json({ refreshToken, message: "verified user" });
  } catch (error) {
    return res.status(400).json({ message: "Please try again!" });
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: "", // this removes the field from the document
        },
      },
      {
        new: true,
      }
    );
    const options = { httpOnly: true, secure: false, sameSite: "Strict" };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});
const AuthUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist." });
    }

    const { refreshToken } = await generateAccessAndRefereshTokens(
      req.user._id
    );
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    };
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, "Authorized"));
  } catch (error) {
    console.log("error", error);
    return res.status(400).json(new ApiError(400, "Please login", error));
  }
});

export { createUser, loginUser, logoutUser, AuthUser };
