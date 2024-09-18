import mongoose from "mongoose";
const cartSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    totalPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema, "Cart");
