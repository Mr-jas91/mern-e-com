import { Admin } from "../../models/admin.models.js";
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
      password
    });

    await admin.save();

    const createdUser = await Admin.findById(admin._id).select("firstName");

    if (!createdUser) {
      return res.status(500).json(new ApiError(500, "Regitration failed"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id
    );
    const options = { httpOnly: true, secure: false, sameSite: "Strict" };

    return res
      .status(201)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new ApiResponse(200, {
          message: "user registered successfully",
          refreshToken: refreshToken,
          accessToken: accessToken,
          admin: createdUser
        })
      );
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

    const options = { httpOnly: true, secure: false, sameSite: "Strict" };
    res
      .status(200)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new ApiResponse(200, {
          message: "user verify",
          refreshToken: refreshToken,
          accessToken: accessToken
        })
      );
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Please try again!"));
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(400).json({ message: "Admin doesn't exist." });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id
    );
    const options = { httpOnly: true, secure: false, sameSite: "Strict" };

    return res
      .status(200)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new ApiResponse(200, {
          messsss: "Authorized",
          refreshToken: refreshToken,
          accessToken: accessToken
        })
      );
  } catch (error) {
    console.log("error", error);
    return res.status(400).json(new ApiError(400, "Please login", error));
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
      req.admin._id,
      {
        $set: {
          refreshToken: "" // this removes the field from the document
        }
      },
      {
        new: true
      }
    );
    const options = { httpOnly: true, secure: false, sameSite: "Lax" };
    res
      .status(200)
      .clearCookie("adminAccessToken", options)
      .clearCookie("adminRefreshToken", options)
      .json(new ApiResponse(200, "Logged out successfully!"));
  } catch (error) {
    res
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
      return res.status(400).json({ message: "User doesn't exist." });
    }
    return res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    console.log("error", error);
    return res.status(400).json(new ApiError(400, "Please login", error));
  }
});
export { createUser, loginUser, logoutUser, getCurrentUser, getAdminProfile };
