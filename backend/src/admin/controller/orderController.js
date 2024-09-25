import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../../models/order.models.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().select("customer orderItems ");
  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found");
  }
  res.status(200).json(new ApiResponse(200, orders));
});

// GET /api/orders/:orderId
const getOrderDetails = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(400).json(new ApiError(400, "Order ID is required"));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(400).json(new ApiError(404, "Order not found"));
  }

  res.status(200).json(new ApiResponse(200, order));
});

// PUT /api/orders/:orderId/delivery-status
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { deliveryStatus } = req.body;

  if (!orderId) {
    return res.status(400).json(new ApiError(400, "Order ID is required"));
  }
  if (!deliveryStatus) {
    return res
      .status(400)
      .json(new ApiError(400, "Delivery status is required"));
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { deliveryStatus },
    { new: true }
  );

  if (!updatedOrder) {
    return res.status(400).json(new ApiError(404, "Order not found"));
  }

  res.status(200).json(new ApiResponse(200, updatedOrder));
});

export { getOrders, getOrderDetails, updateDeliveryStatus };
