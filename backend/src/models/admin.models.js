import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const AdminSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password required"]
    },
    refreshToken: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  { timestamps: true }
);
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      isAdmin: true
    },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY
    }
  );
};
AdminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: true
    },
    process.env.ADMIN_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY
    }
  );
};
export const Admin = mongoose.model("Admin", AdminSchema, "Admin");
