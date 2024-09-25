import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.models.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find(); // Fetch all users
  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }
  res.status(200).json(new ApiResponse(200, users));
});

// GET /api/admin/users/active
const getActiveUsersCount = asyncHandler(async (req, res) => {
  const activeUsersCount = await User.countDocuments({ isActive: true }); // Count active users
  res.status(200).json(new ApiResponse(200, { activeUsersCount }));
});

// Other admin-related user APIs can be added here...

export { getAllUsers, getActiveUsersCount };
