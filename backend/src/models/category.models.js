import mongoose from "mongoose";
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      requied: true,
    },
  },
  { timestapms: true }
);
export const Category = mongoose.model("Category", categorySchema, "Category");
