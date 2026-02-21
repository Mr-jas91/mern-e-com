import crypto from "crypto";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Order } from "../../models/order.models.js";
import { Transaction } from "../../models/transaction.models.js"; // Updated name
import { ApiError } from "../../utils/ApiError.js";

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  // Security Check
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new ApiError(400, "Invalid Webhook Signature");
  }

  const { event, payload } = req.body;

  // Common Data Extraction
  // Note: Failure events me payload structure same hota hai
  const paymentLink = payload.payment_link?.entity;
  const orderId = paymentLink?.notes?.orderId;

  if (!orderId) {
    return res.status(200).json({ status: "ignored_no_order_id" });
  }

  // --- CASE 1: Payment Success ---
  if (event === "payment_link.paid") {
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        paymentStatus: "PAID",
        "orderItems.$[].status": "PROCESSING"
      },
      
    });

    await Transaction.findOneAndUpdate(
      { order: orderId },
      {
        paymentStatus: "PAID", // Matching Enum
        razorpayPaymentId: payload.payment.entity.id
      }
    );
  }

  // --- CASE 2: Payment Failed / Cancelled / Expired (THE FIX) ---
  else if (
    event === "payment_link.cancelled" ||
    event === "payment_link.expired"
  ) {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "FAILED"
      // Note: Main status ko 'PENDING' hi rehne de sakte hain ya 'CANCELLED' kar sakte hain
    });

    await Transaction.findOneAndUpdate(
      { order: orderId },
      { paymentStatus: "FAILED" }
    );
  }

  // Always return 200
  res.status(200).json({ status: "ok" });
});
