import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../../models/order.models.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Types } from "mongoose";

// @desc    Get all admin orders with minimal clean response
// @route   GET /api/admin/orders
const getOrders = asyncHandler(async (req, res) => {
  // Fixed fields: orderPrice -> orderValue, paymentMethod -> paymentOption
  const orders = await Order.find()
    .select("orderValue orderItems paymentOption shippingAddress createdAt").populate("customer", "firstName lastName phone email")
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found");
  }

  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// @desc    Get complete order details with safe population targeting snapshotting data
// @route   GET /api/admin/orders/:id
const getOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Order ID parameter is required");

  const order = await Order.findById(id).populate("customer", "firstName lastName email phone");

  if (!order) throw new ApiError(404, "Requested order entry not found");

  return res.status(200).json(new ApiResponse(200, order, "Order detail payload processed"));
});

// @desc    Update single specific item lifecycle state inside array block
// @route   PUT /api/admin/orders/update-status
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { orderId, itemId, deliveryStatus, tracking } = req.body;

  if (!orderId || !itemId) {
    throw new ApiError(400, "Both orderId and sub-document itemId are required");
  }

  // Generate atomic update object dynamically based on values provided
  const updateFields = {};
  if (deliveryStatus) updateFields["orderItems.$.status"] = deliveryStatus;
  if (tracking) updateFields["orderItems.$.tracking"] = tracking;

  // Atomically find array targeting item reference to avoid read-modify loops
  const order = await Order.findOneAndUpdate(
    { _id: orderId, "orderItems._id": itemId },
    { $set: updateFields },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Target order or item document matching filters not found");
  }

  return res.status(200).json(new ApiResponse(200, order, "Item status indices updated seamlessly"));
});

// @desc    Fast confirmation targeting item payload index
// @route   PUT /api/admin/orders/:id/accept
// @desc    Fast confirmation targeting sub-document item ID inside an order array
// @route   PUT /api/admin/orders/:id/accept
const acceptOrderItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // This is the main orderId
  const { itemId } = req.body; // Precise item document _id from the array

  if (!itemId) {
    throw new ApiError(400, "Target item sub-document ID is required");
  }
  const objectItemId = new Types.ObjectId(itemId)
  // Atomically target and update the array item matching both IDs
  const order = await Order.findOneAndUpdate(
    { _id: id, "orderItems._id": objectItemId },
    { $set: { "orderItems.$.status": "ACCEPTED" } },
    { new: true } // Returns the fresh updated document
  );

  if (!order) {
    throw new ApiError(404, "No matching order or item found with the provided IDs");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Item status successfully changed to ACCEPTED"));
});

// @desc    Optimized analytics aggregation with synced schema properties
// @route   GET /api/admin/orders/dashboard-metrics
const recentOrders = asyncHandler(async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const stats = await Order.aggregate([
    {
      $facet: {
        last10Orders: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "Users",
              localField: "customer",
              foreignField: "_id",
              as: "customer"
            }
          },
          { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
          {
            // Modified to project structural orderItems matrix layout explicitly
            $project: {
              orderValue: 1,
              paymentOption: 1,
              paymentStatus: 1,
              shippingAddress: 1,
              orderItems: 1,
              createdAt: 1,
              "customer.firstName": 1,
              "customer.lastName": 1,
              "customer.phone": 1,
              "customer.email": 1,
            }
          }
        ],
        lastMonthStats: [
          { $match: { createdAt: { $gte: oneMonthAgo } } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalAmount: { $sum: "$orderValue" }
            }
          }
        ],
        pendingDeliveries: [
          { $unwind: "$orderItems" },
          { $match: { "orderItems.status": "PENDING" } },
          { $count: "pendingCount" }
        ]
      }
    }
  ]);


  const outputMetrics = {
    last10Orders: stats[0]?.last10Orders || [],
    lastMonth: stats[0]?.lastMonthStats?.[0] || { totalOrders: 0, totalAmount: 0 },
    pendingDeliveries: stats[0]?.pendingDeliveries?.[0]?.pendingCount || 0
  };

  return res.status(200).json(new ApiResponse(200, outputMetrics, "Dashboard pipeline metrics computed successfully"));
});
export {
  getOrders,
  getOrderDetails,
  updateDeliveryStatus,
  acceptOrderItem,
  recentOrders
};