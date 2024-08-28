import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/user/routes/userRoutes.js"
import adminRoutes from "./src/admin/routes/adminRoutes.js";
import { config } from "dotenv";
config({
  path: "./.env",
});
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN;

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true, maxAge: 600 };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api", userRouter);
app.use("/api/admin", adminRoutes);

export { app };
