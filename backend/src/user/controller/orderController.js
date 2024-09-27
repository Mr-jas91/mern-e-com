import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";

// @desc Create user's new order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, ShippingAddress } = req.body;
  // Validate that orderItems are provided
  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "No order items provided");
  }
  if (!ShippingAddress) {
    throw new ApiError(404, "Shipping address is required");
  }
  // Calculate the total order price
  let orderPrice = 0;
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(404, `Product not found: ${item.productId}`);
    }
    orderPrice += product.price * item.quantity; // Calculate total price
  }

  // Create a new order
  const newOrder = new Order({
    customer: req.user._id,
    orderItems,
    ShippingAddress,
    orderPrice,
  });

  // Save the new order to the database
  const savedOrder = await newOrder.save();

  res.status(201).json(
    new ApiResponse(201, {
      message: "Order placed successfully",
      order: savedOrder,
    })
  );
});

// @desc Get user's order history
const getUserOrderHistory = asyncHandler(async (req, res) => {
  let orders = await Order.find({ customer: req.user._id })
    .select("orderItems")
    .populate({
      path: "orderItems.productId",
      model: "Product",
      select: "name price images[0]",
    });
  if (!orders) {
    orders = new Order({
      customer: req.user._id,
      orderItems: [],
      ShippingAddress: null,
      orderPrice: 0,
      deliveryStatus: null,
    });
  }
  res.json(new ApiResponse(200, { orders }));
});

// @desc Get order details
const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .select("-customer")
    .populate({
      path: "orderItems.productId",
      model: "Product",
    });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  res.json(new ApiResponse(200, { order }));
});

// @desc Cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { deliveryStatus: "CANCELLED" },
    { new: true }
  );
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  res.json(
    new ApiResponse(200, { message: "Order cancelled successfully", order })
  );
});

// Export the controller functions
export { createOrder, getUserOrderHistory, getOrderDetails, cancelOrder };
