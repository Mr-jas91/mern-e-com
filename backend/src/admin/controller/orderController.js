// --- CONTROLLER UPDATES ---
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../../models/order.models.js";
import { asyncHandler } from "../../utils/asyncHander.js";
// GET all orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().select(
    "orderPrice orderItems paymentMethod shippingAddress.fullName"
  );
  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found");
  }
  res.status(200).json(new ApiResponse(200, orders));
});

// GET order details
const getOrderDetails = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) throw new ApiError(400, "Order ID is required");

  const order = await Order.findById(orderId).populate(
    "orderItems.productId",
    "name price discount"
  );

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, order));
});

// Post update specific product delivery status and tracking link
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { productId, deliveryStatus, tracking } = req.body;
  console.log(productId, deliveryStatus, tracking);
  if (!productId) throw new ApiError(400, "Product ID is required");

  const order = await Order.findOne({ "orderItems._id": productId });
  if (!order) throw new ApiError(404, "Order not found");

  let itemFound = false;

  order.orderItems.forEach((item) => {
    if (item._id.toString() === productId.toString()) {
      if (deliveryStatus) item.deliveryStatus = deliveryStatus;
      if (tracking) item.tracking = tracking;
      itemFound = true;
    }
  });

  if (!itemFound) {
    throw new ApiError(404, "Order item not found in the order");
  }

  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, "Delivery status updated successfully"));
});

// PUT accept order item
const acceptOrderItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { itemIndex } = req.body;

  const order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order not found");

  order.orderItems[itemIndex].deliveryStatus = "ACCEPTED";
  await order.save();

  res.status(200).json(new ApiResponse(200, order));
});

const recentOrders = asyncHandler(async (req, res) => {
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Aggregation pipeline
  const stats = await Order.aggregate([
    {
      $facet: {
        last10Orders: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "Users", // MongoDB collection name for your users
              localField: "customer",
              foreignField: "_id",
              as: "customer"
            }
          },
          { $unwind: "$customer" },
          {
            $project: {
              orderPrice: 1,
              paymentMethod: 1,
              paymentStatus: 1,
              createdAt: 1,
              "customer.firstName": 1
            }
          }
        ],

        lastMonthStats: [
          { $match: { createdAt: { $gte: oneMonthAgo } } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalAmount: { $sum: "$orderPrice" }
            }
          }
        ],

        pendingDeliveries: [
          { $unwind: "$orderItems" },
          { $match: { "orderItems.deliveryStatus": "PENDING" } },
          { $count: "pendingCount" }
        ]
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      last10Orders: stats[0].last10Orders,
      lastMonth: stats[0].lastMonthStats[0] || {
        totalOrders: 0,
        totalAmount: 0
      },
      pendingDeliveries: stats[0].pendingDeliveries[0]?.pendingCount || 0
    })
  );
});

// Export
export {
  getOrders,
  getOrderDetails,
  updateDeliveryStatus,
  acceptOrderItem,
  recentOrders
};
