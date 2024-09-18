import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema, "wishlist");
