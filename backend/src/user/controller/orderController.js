import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Order } from "../../models/order.models.js";
import { Product } from "../../models/product.models.js";
import { User } from "../../models/user.models.js";
import { Transaction } from "../../models/transaction.models.js";
import { razorpayInstance } from "../../config/razorpay.config.js";
import { Types } from "mongoose";

// --- REUSABLE HELPER: Calculate Totals ---
const validateAndCalculateOrderValue = async (orderItems) => {
  const productIds = orderItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).select(
    "name price discount images stock"
  );

  const productMap = {};
  products.forEach((p) => (productMap[p._id.toString()] = p));

  let totalValue = 0;
  const validatedItems = [];

  for (const item of orderItems) {
    const product = productMap[item.productId.toString()];

    // 1. Existence Check
    if (!product) {
      throw new ApiError(404, `Product ${item.productId} no longer exists.`);
    }

    // 2. Stock Check
    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for ${product.name}. Only ${product.stock} left.`
      );
    }

    // 3. Price Calculation (Snapshotting)
    const unitPrice = product.price - (product.discount || 0);
    const itemTotal = unitPrice * item.quantity;

    totalValue += itemTotal;

    // We return this list so the controller doesn't have to map items again
    validatedItems.push({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      discount: product.discount,
      quantity: item.quantity
    });
  }

  return { totalValue, validatedItems };
};

// --- CONTROLLERS ---
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, addressId, orderPrice, paymentOption } = req.body;
  const userId = req.user._id;

  if (!orderItems?.length || !addressId || !orderPrice || !paymentOption) {
    throw new ApiError(400, "Invalid order details provided");
  }
  // 1. Validate, Check Stock, and Calculate Price in one go
  const { totalValue, validatedItems } = await validateAndCalculateOrderValue(
    orderItems
  );
  // 1. Validation & Price Check
  if (Math.round(totalValue) !== Math.round(orderPrice)) {
    throw new ApiError(400, "Price mismatch detected.");
  }

  // 2. Get Shipping Address (Simplified logic for brevity)
  const user = await User.findById(userId);
  const fullName = user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Customer";

  const selectedAddress = user.addresses.id(addressId);
  if (!selectedAddress) throw new ApiError(404, "Address not found");

  // Create Order
  const newOrder = await Order.create({
    customer: userId,
    orderItems: validatedItems,
    shippingAddress: selectedAddress,
    orderValue: totalValue, // Schema me field ka naam orderValue hai, apne orderPrice likha tha variable me
    paymentOption,
    paymentStatus: "PENDING"
  });

  let paymentData = { url: null, paymentLinkId: null };

  if (paymentOption === "ONLINE") {
    try {
      const response = await razorpayInstance.paymentLink.create({
        amount: orderPrice * 100,
        currency: "INR",
        accept_partial: false,
        description: `Payment for Order #${newOrder._id}`,
        customer: {
          name: fullName, // Fixed Name
          email: user.email,
          contact: selectedAddress.phone || "9999999999"
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        notes: { orderId: newOrder._id.toString() },
        callback_url: "https://www.google.com",
        callback_method: "get"
      });

      paymentData.url = response.short_url;
      paymentData.paymentLinkId = response.id;

      newOrder.paymentLinkId = response.id;
      await newOrder.save();
    } catch (error) {
      console.log(error);
      // ROLLBACK: Agar link generate nahi hua to order delete karo, warna 'Ghost Order' ban jayega
      await Order.findByIdAndDelete(newOrder._id);
      throw new ApiError(500, "Failed to generate payment link");
    }
  }

  // Create Transaction
  await Transaction.create({
    order: newOrder._id,
    user: userId,
    paymentmethod: paymentOption,
    paymentStatus: "PENDING", // Unified Enum
    amount: orderPrice,
    paymentLinkId: paymentData.paymentLinkId // Can be null for COD
    // transactionDate: Date.now() // Model me default laga diya hai to yaha zarurat nahi
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { orderId: newOrder._id, paymentUrl: paymentData.url },
        "Order Created"
      )
    );
});
const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId, orderItemId } = req.params;

  if (!orderId || !orderItemId) {
    throw new ApiError(400, "Order ID and Order Item ID are required");
  }

  // 1. Single DB Call with Projection
  const order = await Order.findOne(
    {
      _id: orderId,
      "orderItems._id": orderItemId,
      customer: req.user._id
    },
    {
      "orderItems.$": 1,
      createdAt: 1,
      customer: 1,
      shippingAddress: 1,
      totalPrice: 1
    }
  ).populate("customer", "firstName lastName email phone");

  // 2. Error Handling
  if (!order) {
    throw new ApiError(404, "Order not found or unauthorized access");
  }

  // 3. Response
  return res
    .status(200)
    .json(
      new ApiResponse(200, order, "Order item details fetched successfully")
    );
});
const getUserOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .select("orderItems paymentStatus createdAt")
    .sort({ createdAt: -1 }) // Latest orders first
    .limit(10)
    .lean();

  if (!orders?.length) throw new ApiError(404, "No orders found");

  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId, orderItemId } = req.params;

  if (!orderId || !orderItemId) throw new ApiError(400, "Orderid is required");

  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      customer: req.user._id,
      "orderItems._id": orderItemId,
      "orderItems.status": { $ne: "DELIVERED" }
    },
    {
      $set: { "orderItems.$.status": "CANCELLED" }
    },
    { new: true }
  );

  // 2. Error Handling
  if (!order) {
    throw new ApiError(
      400,
      "Order item cannot be cancelled (Either not found or already delivered)"
    );
  }

  // 3. Response
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order item cancelled successfully"));
});

export { createOrder, getOrderDetails, getUserOrderHistory, cancelOrder };
