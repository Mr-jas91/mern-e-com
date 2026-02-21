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
    paymentmethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      required: true
    },
    // FIX: Standardized Enum to match Order Model
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], 
      default: "PENDING",
      required: true
    },
    paymentLinkId: {
      type: String,
      // FIX: Sparse true zaruri hai, taaki COD orders (jaha linkId null hai) me unique error na aaye
      unique: true,
      sparse: true 
    },
    razorpayPaymentId: {
      type: String
    },
    transactionDate: { // Spelling Fixed
      type: Date,
      default: Date.now, // FIX: Default value de di taaki controller me baar baar na likhna pade
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);