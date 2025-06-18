import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  deliveryStatus: {
    type: String,
    enum: ["PENDING", "CANCELLED", "ACCEPTED", "SHIPPED", "DELIVERED"],
    default: "PENDING"
  },
  tracking: {
    type: String,
    required: false
  }
});

// Schema for the whole order
const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
      min: [0, "Order price must be positive"]
    },
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
      type: Object,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["ONLINE_UPI", "DEBIT_CARD", "COD"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "UNPAID"
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length > 0;
}

export const Order = mongoose.model("Order", orderSchema, "Orders");
