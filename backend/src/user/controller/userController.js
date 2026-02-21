import jwt from "jsonwebtoken";
import { User } from "../../models/user.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// --- CONFIGURATION ---
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict"
};

// --- REUSABLE HELPERS ---

/**
 * Generates tokens and saves refresh token to DB
 * Optimization: Pass the user object directly to avoid extra findById calls
 */
const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // DB Call 1: Saving token
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

/**
 * Sends tokens via cookies and returns sanitized user response
 * Optimization: Uses .toObject() to clean sensitive data without extra DB fetch
 */
const sendTokenResponse = async (user, statusCode, res, message) => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  // Security: Convert to JS object and delete sensitive fields locally
  const loggedInUser = user.toObject();
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;
  return res
    .status(statusCode)
    .cookie("userAccessToken", accessToken, COOKIE_OPTIONS)
    .cookie("userRefreshToken", refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        statusCode,
        { user: loggedInUser, accessToken, refreshToken },
        message
      )
    );
};

// --- CONTROLLERS ---

const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  if (
    [firstName, lastName, phone, email, password].some(
      (field) => !field?.trim()
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existedUser) {
    const conflict = existedUser.email === email ? "email" : "phone";
    throw new ApiError(409, `User with this ${conflict} already exists`);
  }

  const user = await User.create({
    firstName,
    lastName,
    phone,
    email,
    password
  });
  // Convert to JS object and remove sensitive/heavy fields
  const userResponse = user.toObject();
  delete userResponse.addresses; // addresses exclude karna
  delete userResponse.isActive; // isActive exclude karna
  return sendTokenResponse(
    userResponse,
    201,
    res,
    "User registered successfully"
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  if (!password) throw new ApiError(400, "Password is required");
  if (!email && !phone) throw new ApiError(400, "Email or Phone is required");

  // DB Call: Fetch user
  const user = await User.findOne({
    $or: [{ email: email }, { phone: phone }]
  }).select("-isActive -addresses");

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials");
  }
  return sendTokenResponse(user, 200, res, "Logged in successfully");
});

const logoutUser = asyncHandler(async (req, res) => {
  // Security: Remove refreshToken from DB so it can't be reused
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("userAccessToken", COOKIE_OPTIONS)
    .clearCookie("userRefreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.userRefreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Security Priority: Check DB to ensure token hasn't been revoked/changed
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    return sendTokenResponse(user, 200, res, "Access token refreshed");
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  // Fetch fresh data for profile page, excluding heavy/sensitive fields
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -isActive"
  );

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  // Security: Protect critical fields from being updated via this route
  delete updates.password;
  delete updates.refreshToken;
  delete updates._id;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-isActive -addresses -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return sendTokenResponse(user, 200, res, "User details updated successfully");
});

// ✅ GET ADDRESSES
const getAddress = asyncHandler(async (req, res) => {
  // .select("addresses") returns an object { _id: ..., addresses: [...] }
  const user = await User.findById(req.user._id).select("addresses");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Improved Logic: Don't throw error if empty, just return empty array.
  // Frontend handles empty states better than 400 errors.
  return res
    .status(200)
    .json(
      new ApiResponse(200, user.addresses, "Addresses fetched successfully")
    );
});

// ✅ ADD ADDRESS
const addAddress = asyncHandler(async (req, res) => {
  const addressData = req.body;

  if (!addressData || typeof addressData !== "object") {
    throw new ApiError(400, "Address object required");
  }

  // Normalize
  const newAddress = {
    address: addressData.address?.trim(),
    city: addressData.city?.trim(),
    state: addressData.state?.trim(),
    pincode: addressData.pincode?.trim(),
    country: addressData.country?.trim(),
    phone: addressData.phone?.trim(),
    isDefault: Boolean(addressData.isDefault)
  };

  // Validation
  if (
    !newAddress.address ||
    !newAddress.city ||
    !newAddress.state ||
    !newAddress.pincode ||
    !newAddress.country ||
    !newAddress.phone
  ) {
    throw new ApiError(400, "All address fields are required");
  }

  const ops = [];

  if (newAddress.isDefault) {
    ops.push({
      updateOne: {
        filter: { _id: req.user._id },
        update: { $set: { "addresses.$[].isDefault": false } }
      }
    });
  }

  ops.push({
    updateOne: {
      filter: { _id: req.user._id },
      update: { $push: { addresses: newAddress } }
    }
  });

  await User.bulkWrite(ops);

  const user = await User.findById(req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, user.addresses, "Address added successfully"));
});

// ✅ UPDATE ADDRESS
const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const addressData = req.body;

  if (!addressId) throw new ApiError(400, "Address ID required");

  // Normalize
  const isDefault = Boolean(addressData.isDefault);

  const ops = [];

  // 1. अगर Default बनाना है, तो बाकियों को हटाओ
  if (isDefault) {
    ops.push({
      updateOne: {
        filter: { _id: req.user._id },
        update: { $set: { "addresses.$[].isDefault": false } }
      }
    });
  }

  // 2️⃣ Prepare specific update fields
  // Using dot notation for nested fields to update only what is sent
  const updateFields = {};
  if (addressData.address)
    updateFields["addresses.$.address"] = addressData.address.trim();
  if (addressData.city)
    updateFields["addresses.$.city"] = addressData.city.trim();
  if (addressData.state)
    updateFields["addresses.$.state"] = addressData.state.trim();
  if (addressData.pincode)
    updateFields["addresses.$.pincode"] = addressData.pincode.trim();
  if (addressData.country)
    updateFields["addresses.$.country"] = addressData.country.trim();
  if (addressData.phone)
    updateFields["addresses.$.phone"] = addressData.phone.trim();

  // Always update isDefault (whether true or false)
  updateFields["addresses.$.isDefault"] = isDefault;

  // 3️⃣ Perform the update
  ops.push({
    updateOne: {
      filter: { _id: req.user._id, "addresses._id": addressId },
      update: { $set: updateFields }
    }
  });

  await User.bulkWrite(ops);

  const user = await User.findById(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, user.addresses, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  // 1. Check if addressId is provided
  if (!addressId) {
    throw new ApiError(400, "Address ID is required");
  }

  // 2. Use $pull to remove the specific address object from the addresses array
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        addresses: { _id: addressId } // addresses array में से वो object हटाओ जिसकी ID addressId है
      }
    },
    { new: true } // ताकि हमें अपडेटेड लिस्ट मिले
  );

  // 3. If user not found or something went wrong
  if (!user) {
    throw new ApiError(404, "User not found or error while deleting address");
  }

  // 4. Return the updated addresses list
  return res
    .status(200)
    .json(new ApiResponse(200, user.addresses, "Address deleted successfully"));
});
export {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  getUserProfile,
  updateUserDetails,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress
};
