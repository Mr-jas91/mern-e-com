import mongoose from "mongoose";
// Schema for each item in the order
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true, // Ensures productId is always provided
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensures at least 1 item is ordered
  },
});

// Schema for the whole order
const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
      min: [0, "Order price must be positive"], // Validation for positive price
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Makes sure an order cannot be created without a customer
    },
    orderItems: {
      type: [orderItemSchema],
      required: true, // At least one item must be in the order
      validate: [arrayLimit, "{PATH} must have at least 1 order item"], // Custom validation to ensure non-empty
    },
    address: {
      type: String,
      required: true, // Shipping address is mandatory
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "ACCEPTED", "SHIPPED", "DELIVERED"],
      default: "PENDING", // Default status is PENDING
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

// Custom validator to ensure at least one item is ordered
function arrayLimit(val) {
  return val.length > 0;
}

export const Order = mongoose.model("Order", orderSchema, "Orders");