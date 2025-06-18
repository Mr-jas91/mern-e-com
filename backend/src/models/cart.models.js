import mongoose from "mongoose";
import { Product } from "./product.models.js";
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    finalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema, "Cart");
