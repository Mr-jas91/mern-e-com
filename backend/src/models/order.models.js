import mongoose from "mongoose";
import { addressSchema } from "./user.models.js";
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING"
  },
  // Added missing tracking field to allow updates from admin panel
  tracking: {
    type: String,
    default: ""
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
    paymentLinkId: {
      type: String
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length > 0;
}

export const Order = mongoose.model("Order", orderSchema, "Orders");