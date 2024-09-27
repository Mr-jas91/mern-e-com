import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema, "Wishlist");
