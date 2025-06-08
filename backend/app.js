import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/user/routes/userRoutes.js";
import adminRoutes from "./src/admin/routes/adminRoutes.js";
import { config } from "dotenv";
config({
  path: "./.env"
});
const allowedOrigin = process.env.allowedOrigins;
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

export { app };
