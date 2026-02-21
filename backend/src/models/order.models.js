import mongoose from "mongoose";
import { addressSchema } from "./user.models.js";
// Reuse the address schema structure for consistency

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  // --- SNAPSHOT FIELDS (Crucial) ---
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  // ---------------------------------
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING"
  }
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: [arrayLimit, "{PATH} must have at least 1 order item"]
    },
    shippingAddress: {
      type: addressSchema,
      required: true
    },
    orderValue: {
      type: Number,
      required: true,
      min: [0, "Order price must be positive"]
    },
    paymentOption: {
      type: String,
      required: true,
      enum: ["ONLINE", "COD"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "PAID", "REFUNDED", "FAILED"],
      default: "PENDING"
    },
    // Store the Gateway ID (e.g., Razorpay/Stripe ID) for refunds/tracking
    paymentLinkId: {
      type: String
    }
    // Main Order Status (Easier for filtering "Active" vs "Past" orders)
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length > 0;
}

export const Order = mongoose.model("Order", orderSchema, "Orders");
