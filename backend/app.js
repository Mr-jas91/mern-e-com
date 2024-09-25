import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/user/routes/userRoutes.js";
import adminRoutes from "./src/admin/routes/adminRoutes.js";
import { config } from "dotenv";
import multer from "multer";
config({
  path: "./.env",
});
const app = express();

// Parse allowed origins from the environment variable
// const allowedOrigins = process.env.CORS_ORIGIN.split(",");

// // CORS options delegate function
// const corsOptionsDelegate = (req, callback) => {
//   let corsOptions;

//   // Check if the request's Origin header matches one of the allowed origins
//   if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true, credentials: true }; // Enable CORS for this origin
//   } else {
//     corsOptions = { origin: false }; // Disable CORS for this origin
//   }

//   // Callback with the appropriate CORS options
//   callback(null, corsOptions);
// };

// app.use(cors(corsOptionsDelegate));

app.use(cors({
  origin: ['http://admin.localhost:3000', 'http://localhost:3000'],
  credentials: true,  // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "1024kb" }));
app.use(express.static("public"));
app.use("/api", userRouter);
app.use("/api/admin", adminRoutes);

export { app };
