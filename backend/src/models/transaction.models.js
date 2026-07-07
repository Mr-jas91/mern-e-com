import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], 
      default: "PENDING",
      required: true
    },
    paymentLinkId: {
      type: String,
      unique: true,
      sparse: true 
    },
    razorpayPaymentId: {
      type: String
    },
    transactionDate: { 
      type: Date,
      default: Date.now, 
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema,"Transactions");