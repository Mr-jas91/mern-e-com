import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";
import { User } from "../../models/user.models.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

// @desc Create user's new order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, orderPrice, paymentOption } = req.body;
  //console.log(orderItems, shippingAddress, orderPrice, paymentOption);

  if (
    !Array.isArray(orderItems) ||
    orderItems.length === 0 ||
    !shippingAddress ||
    !orderPrice
  ) {
    return res.status(400).json(new ApiError(400, "Invalid order provided"));
  }

  // Step 1: Get all product IDs
  const productIds = orderItems.map((item) => item.productId);

  // Step 2: Fetch all products in one query
  const products = await Product.find({ _id: { $in: productIds } }).select(
    "price discount"
  );

  // Step 3: Map product ID to its price/discount for quick lookup
  const productMap = {};
  products.forEach((p) => {
    productMap[p._id.toString()] = p;
  });

  // Step 4: Calculate order value
  let orderValue = 0;
  for (const item of orderItems) {
    const product = productMap[item.productId.toString()];
    if (!product) {
      return res
        .status(400)
        .json(new ApiError(400, `Product ${item.productId} not found`));
    }
    const itemPrice = (product.price - product.discount) * (item.quantity || 1);
    orderValue += itemPrice;
  }

  // Step 5: Compare orderValue with orderPrice sent by client
  if (Math.round(orderValue * 100) !== Math.round(orderPrice * 100)) {
    return res.status(400).json(new ApiError(400, "Order price mismatch"));
  }

  // Create a new order
  const newOrder = new Order({
    customer: req.user._id,
    orderItems,
    shippingAddress,
    orderPrice,
    paymentOption,
    paymentStatus: ["ONLINE_UPI", "DEBIT_CARD"].includes(paymentOption)
      ? "PAID"
      : "UNPAID"
  });

  await newOrder.save();

  const user = await User.findById(req.user._id);
  user.orderHistory.push(newOrder._id);
  await user.save();

  res.status(201).json(
    new ApiResponse(201, {
      message: "ordered successfully"
    })
  );
});

// @desc Get user's order history
const getUserOrderHistory = asyncHandler(async (req, res) => {
  let orders = await Order.find({ customer: req.user._id })
    .select("orderItems createdAt orderPrice") // Include all necessary fields
    .populate({
      path: "orderItems.productId",
      model: "Product",
      select: "name price images discount"
    })
    .limit(10);
  if (!orders) {
    return res.status(404).json(new ApiError(404, "No orders found"));
  }
  res.status(201).json(
    new ApiResponse(201, {
      message: "Order fetched successfully",
      orders
    })
  );
});

// @desc Get order details
const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    return res.status(400).json(new ApiError(400, "Invalid order id"));
  }
  let orderDetails = await Order.findOne({
    "orderItems._id": new ObjectId(orderId)
  })
    .select("-customer")
    .populate({
      path: "orderItems.productId",
      model: "Product",
      select: "name price images discount"
    });
  if (!orderDetails) {
    return res.status(404).json(new ApiError(404, "Order not found"));
  }
  res.json(new ApiResponse(200, orderDetails));
});

// @desc Cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params; // Using orderItemId to find the specific item

  try {
    // Find the order that contains the specific orderItem
    const order = await Order.findOne({
      "orderItems._id": new ObjectId(orderId)
    });
    if (!order) {
      return res.status(404).json(new ApiError(404, "Order not found"));
    }

    // Find the specific order item within the order
    const orderItem = order.orderItems.find(
      (item) => item._id.toString() === orderId
    );

    if (!orderItem) {
      return res.status(404).json(new ApiError(404, "Order item not found"));
    }

    // Prevent cancellation if the order item is already delivered
    if (orderItem.deliveryStatus === "DELIVERED") {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Order item has already been delivered and cannot be cancelled"
          )
        );
    }

    // Update the delivery status of the specific order item
    orderItem.deliveryStatus = "CANCELLED";

    // Save the updated order
    await order.save();

    res.json(
      new ApiResponse(200, order, {
        message: "Order item cancelled successfully"
      })
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});
// Export the controller functions
export { createOrder, getUserOrderHistory, getOrderDetails, cancelOrder };
