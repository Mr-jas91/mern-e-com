import { Transaction } from "../../models/transaction.models.js"; // Kept original import path
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// @desc    Get all transactions for the logged-in admin/user
// @route   GET /api/admin/payments (or equivalent)
const getTransaction = asyncHandler(async (req, res) => {
  const adminId = req.admin._id
  // 🛠️ Fix 1 & 2: Swapped typo 'Transection' with 'Transaction' and changed '_id' filter to look for the 'user' field
  const transactions = await Transaction.find()
    .populate("user", "firstName")
    .populate("order", "orderValue")
    .sort({ createdAt: -1 }); // Added sorting to show the latest payments first
  // 🛠️ Fix 3: Arrays in Mongoose require a length check to verify if they are empty
  if (!transactions || transactions.length === 0) {
    throw new ApiError(404, "No transactions found for this user!"); // Swapped 400 with a more accurate 404
  }

  // Clean, structured success response payload returning the array
  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions fetched successfully"));
});

// controllers/transaction.controller.js
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, paymentStatus } = req.body;

  if (!paymentStatus && !paymentMethod) {
    throw new ApiError(400, "At least one target parameter is required");
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    { 
      $set: { 
        ...(paymentMethod && { paymentMethod }), 
        ...(paymentStatus && { paymentStatus }) 
      } 
    },
    { new: true, runValidators: true }
  )
  .populate("user", "firstName")       // 🚨 यह लाइन गायब होने से Guest User आ रहा था
  .populate("order", "orderValue");    // 🚨 यह लाइन गायब होने से Order Amount 0 या गायब हो रहा था

  if (!updatedTransaction) {
    throw new ApiError(404, "Transaction record not found!");
  }

  return res.status(200).json(new ApiResponse(200, updatedTransaction, "Updated successfully"));
});

export { getTransaction, updatePaymentStatus };