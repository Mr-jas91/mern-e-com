import { Admin } from "../../models/admin.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    if (!user) {
      throw new ApiError(404, "Admin not found");
    }
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    await Admin.findByIdAndUpdate(userId, {
      $set: { refreshToken: refreshToken }
    });

    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Something went wrong while generating tokens", error);
  }
};
const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" };
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "Please input all fields"));
  }

  try {
    const existedUser = await Admin.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User already exists please login"));
    }

    const admin = new Admin({
      firstName,
      lastName,
      email,
      password
    });

    await admin.save();

    const createdUser = await Admin.findById(admin._id).select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json(new ApiError(500, "Registration failed"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id
    );


    return res
      .status(201)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new ApiResponse(201, {
          message: "User registered successfully",
          refreshToken,
          accessToken,
          admin: createdUser
        })
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message || "Internal server error", error));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "Please input all fields" });
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


    return res
      .status(200)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new ApiResponse(200, {
          message: "User verified successfully",
          refreshToken,
          accessToken
        })
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message || "Please try again!"));
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin doesn't exist." });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id
    );

    return res
      .status(200)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new ApiResponse(200, {
          message: "Authorized",
          refreshToken,
          accessToken
        })
      );
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Please login", error));
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
      req.admin._id,
      {
        $set: {
          refreshToken: ""
        }
      },
      {
        new: true
      }
    );
    return res
      .status(200)
      .clearCookie("adminAccessToken", options)
      .clearCookie("adminRefreshToken", options)
      .json(new ApiResponse(200, {}, "Logged out successfully!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, `${error.message} || Internal server error`));
  }
});

const getAdminProfile = asyncHandler(async (req, res) => {
  try {
    const user = await Admin.findById(req.admin._id).select(
      "-_id -password -refreshToken -createdAt -updatedAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    return res.status(200).json(new ApiResponse(200, user, "Admin profile fetched"));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Please login", error));
  }
});

export { createUser, loginUser, logoutUser, getCurrentUser, getAdminProfile };