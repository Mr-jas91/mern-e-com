import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";
import { Types } from "mongoose";
const { ObjectId } = Types;
// @desc Create user's new order
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, orderPrice } = req.body;
  // Validate that orderItems are provided
  if (orderItems.length === 0) {
    return res.status(400).json(new ApiError(400, "No order items provided"));
  }
  if (!shippingAddress) {
    return res
      .status(404)
      .json(new ApiError(404, "Shipping address is required"));
  }
  if (!orderPrice) {
    return res
      .status(404)
      .json(new ApiError(404, "Order price must be required."));
  }

  // Create a new order
  const newOrder = new Order({
    customer: req.user._id,
    orderItems,
    shippingAddress,
    orderPrice
  });

  // Save the new order to the database
  const savedOrder = await newOrder.save();

  res.status(201).json(
    new ApiResponse(201, {
      message: "fetched successfully",
      order: savedOrder
    })
  );
});

// @desc Get user's order history
const getUserOrderHistory = asyncHandler(async (req, res) => {
  let orders = await Order.find({ customer: req.user._id }).populate({
    path: "orderItems.productId",
    model: "Product",
    select: "name price images"
  }).limit(10);
  if (!orders) {
    orders = new Order({
      customer: req.user._id,
      orderItems: [],
      ShippingAddress: null,
      orderPrice: 0,
      deliveryStatus: null
    });
  }
  res.status(201).json(
    new ApiResponse(201, {
      message: "Order fetched successfully",
      order: orders
    })
  );
});

// @desc Get order details
const getOrderDetails = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;

  const orderDetails = await Order.findOne({
    "orderItems._id": orderId
  }).populate({
    path: "orderItems.productId",
    model: "Product",
    select: "name price images"
  });

  // console.log("Order ID:", orderId);
  // const productId = new ObjectId(req.body.productId);

  // const orderDetails = await Order.aggregate([
  //   {
  //     $match: {
  //       _id: new ObjectId(orderId)
  //     }
  //   },
  //   {
  //     $unwind: "$orderItems"
  //   },
  //   {
  //     $match: {
  //       "orderItems.productId": new ObjectId(req.body.productId)
  //     }
  //   },
  //   {
  //     $lookup: {
  //       from: "Products",
  //       localField: "orderItems.productId",
  //       foreignField: "_id",
  //       as: "productDetails"
  //     }
  //   },
  //   {
  //     $unwind: "$productDetails"
  //   },
  //   {
  //     $project: {
  //       shippingAddress: 1,
  //       paymentMethod: 1,
  //       paymentStatus: 1,
  //       createdAt: 1,
  //       orderItems: 1,
  //       productDetails: {
  //         name: "$productDetails.name",
  //         price: "$productDetails.price",
  //         images: "$productDetails.images",
  //         discount: "$productDetails.discount"
  //       }
  //     }
  //   }
  // ]);

  // // // Check if orderDetails array is empty
  if (orderDetails.length === 0) {
    throw new ApiError(404, "Order not found"); // Return a 404 error if not found
  }

  res.json(new ApiResponse(200, orderDetails));
});

// @desc Cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  // Validate that productId is provided
  const { orderId } = req.params;
  const { productId } = req.body;
  const order = await Order.findOne({ _id: orderId, customer: req.user._id });
  const orderItemIndex = order.orderItems.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (orderItemIndex === -1) {
    throw new ApiError(404, "Order item not found");
  }
  const orderItem = order.orderItems[orderItemIndex];
  // Check if the product can be canceled
  if (orderItem.deliveryStatus === "CANCELLED") {
    return res.status(400).json({ message: "Product is already canceled" });
  }

  if (["DELIVERED"].includes(orderItem.deliveryStatus)) {
    return res
      .status(400)
      .json({ message: "Product cannot be canceled at this stage" });
  }
  // Update delivery status to CANCELLED using findByIdAndUpdate
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        [`orderItems.${orderItemIndex}.deliveryStatus`]: "CANCELLED"
      }
    },
    { new: true } // This option returns the updated document
  );

  res.status(200).json(new ApiResponse(200, updatedOrder));
});

// Export the controller functions
export { createOrder, getUserOrderHistory, getOrderDetails, cancelOrder };
