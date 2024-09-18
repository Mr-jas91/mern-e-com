import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";

//desc craete user's new order
const createOrder = async (req, res) => {
  const { orderItems, address } = req.body;
  try {
    // Validate that orderItems are provided
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json(new ApiError(400, "No order items provided"));
    }

    // Calculate the total order price
    let orderPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json(new ApiError(404, `Product not found: ${item.productId}`));
      }
      orderPrice += product.price * item.quantity; // Calculate total price
    }

    // Create a new order
    const newOrder = new Order({
      customer: req.user._id,
      orderItems,
      address,
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
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json(new ApiError(500, "Error creating order"));
  }
};

// @desc Get user's order history
const getUserOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id });
    res.json(new ApiResponse(200, { orders }));
  } catch (error) {
    console.error("Error getting order history:", error);
    res.status(500).json(new ApiError(500, "Error getting order history"));
  }
};

// @desc Get order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json(new ApiError(404, "Order not found"));
    }
    res.json(new ApiResponse(200, { order }));
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json(new ApiError(500, "Error getting order details"));
  }
};

// @desc Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "cancelled" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json(new ApiError(404, "Order not found"));
    }
    res.json(
      new ApiResponse(200, { message: "Order cancelled successfully", order })
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json(new ApiError(500, "Error cancelling order"));
  }
};

// Export the controller functions
export { createOrder, getUserOrderHistory, getOrderDetails, cancelOrder };
