import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";
import { User } from "../../models/user.models.js";

// GET /api/admin/dashboard
const getAdminDashboardData = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Count total users
    const totalActiveUsers = await User.countDocuments({ isActive: true }); // Count active users
    const totalProducts = await Product.countDocuments(); // Count total products
    const totalOrders = await Order.countDocuments(); // Count total orders

    const dashboardData = {
      totalUsers,
      totalActiveUsers,
      totalProducts,
      totalOrders,
    };

    res.status(200).json(new ApiResponse(200, dashboardData));
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
});

export { getAdminDashboardData };
