import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Array,
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);
export const Product = mongoose.model("Product", productSchema, "Products");
