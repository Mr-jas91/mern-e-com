import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/user/routes/userRoutes.js";
import adminRoutes from "./src/admin/routes/adminRoutes.js";
import { config } from "dotenv";
config({
  path: "./.env"
});
const allowedOrigin = process.env.FRONTEND_URL;
const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if ((!origin || allowedOrigin.includes(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb"
  })
);

app.use(express.urlencoded({ extended: false, limit: "1024kb" }));
app.use(express.static("public"));
app.use("/api", userRouter);
app.use("/api/admin", adminRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  // Agar error hamara banaya hua "ApiError" hai, toh uske values lo
  // Nahi toh 500 (Internal Server Error) set karo
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);

  // Frontend ko ek standard JSON response bhejna
  return res.status(statusCode).json({
      success: false,
      statusCode: statusCode,
      message: message,
      errors: err.errors || [],
      // Stack trace sirf development mode mein dikhayenge taaki security bani rahe
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
export { app };
