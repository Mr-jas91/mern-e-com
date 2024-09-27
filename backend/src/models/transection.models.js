import mongoose from "mongoose";
const transectionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentmethod: {
      type: String,
      required: true,
    },
    paymeentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Complete", "Failed"],
    },
    transectionId: {
      type: String,
      required: true,
      unique: true,
    },
    transectionDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transectionSchema);
