import { Admin } from "../models/admin.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    res.status(400).json(new ApiError(400, "refreshToken not generate", error));
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
    const existedUser = await Admin.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User already exists  please login"));
    }

    const admin = new Admin({
      firstName,
      lastName,
      email,
      password,
    });

    await admin.save();

    const createdUser = await Admin.findById(admin._id).select("firstName");

    if (!createdUser) {
      return res.status(500).json(new ApiError(500, "Regitration failed"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id
    );
    const options = { httpOnly: true, secure: false, sameSite: "None" };

    return res
      .status(201)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(201, `${createdUser} Registered successfully`));
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
    const existUser = await Admin.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const validUser = await existUser.isPasswordCorrect(password);
    if (!validUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
      existUser._id
    );
    const options = { httpOnly: true, secure: false, sameSite: "None" };
    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "Login suceessFully"));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Please try again!"));
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
      req.admin._id,
      {
        $set: {
          refreshToken: "", // this removes the field from the document
        },
      },
      {
        new: true,
      }
    );
    const options = { httpOnly: true, secure: false, sameSite: "None" };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "Logged out successfully!"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, `${error.message} || Internal server error`));
  }
});
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await Admin.findById(req.admin._id);

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist." });
    }

    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
      req.admin._id
    );
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    };
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "Authorized"));
  } catch (error) {
    console.log("error", error);
    return res.status(400).json(new ApiError(400, "Please login", error));
  }
});

export { createUser, loginUser, logoutUser, getCurrentUser };
