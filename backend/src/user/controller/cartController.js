import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHander";
import { Cart } from "../../models/cart.models.js";
import { Product } from "../../models/product.models";

const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id });
      await cart.save();
    }

    const alreadyInCart = cart.items.some(
      (p) => p._id.toString() === productId
    );
    if (alreadyInCart) {
      return res.status(400).json(new ApiError(400, "Product already in cart"));
    }

    cart.items.push(product._id);
    await cart.save();
    return res.status(201).json(new ApiResponse(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});
const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }
    return res.status(200).json(new ApiResponse(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

const updateQuantity = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }
    const product = cart.items._id(productId);
    if (!product) {
      return res
        .status(404)
        .json(new ApiError(404, "Product not found in cart"));
    }
    product.quantity = quantity;
    await cart.save();
    return res.status(200).json(new ApiResponse(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }
    cart.items.pull({ _id: productId });
    await cart.save();
    return res.status(200).json(new ApiResponse(cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

export { addToCart, getCart, removeFromCart, updateQuantity };
