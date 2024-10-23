import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Cart } from "../../models/cart.models.js";
import { Product } from "../../models/product.models.js";

// Calculate total cart amount
const calculateTotalPrice = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) return 0;
  const productIds = cart.items.map((item) => item?.productId?._id);
  if (!productIds.length) return 0;

  const products = await Product.find({ _id: { $in: productIds } }).select(
    "price"
  );

  let totalAmount = 0;
  cart.items.forEach((item) => {
    const product = products.find((p) => p._id.equals(item?.productId?._id));
    if (product) {
      totalAmount += product.price * item.quantity;
    }
  });
  return parseFloat(totalAmount.toFixed(2));
};

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  let cart = await Cart.findOne({ userId }).select("items totalPrice");
  // Create a new cart if none exists
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Check if product already exists in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item?.productId?._id.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }
  // Recalculate total price
  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();
  return res.status(200).json(new ApiResponse(200, cart));
});

// Get cart for the user
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id })
    .populate("items.productId", "name price images discount")
    .select("items totalPrice");
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }
  res.status(200).json(new ApiResponse(200, cart));
});

// Update quantity of a product in the cart
const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, action } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId })
    .populate("items.productId", "name price images discount")
    .select("items totalPrice");

  if (!cart) {
    return res.status(404).json(new ApiError(404, "Cart not found"));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json(new ApiError(404, "Product not found in cart"));
  }

  // Determine the current quantity
  let currentQuantity = cart.items[itemIndex].quantity;

  // Handle increase and decrease logic
  if (action === "increase") {
    cart.items[itemIndex].quantity = currentQuantity + 1;
  } else if (action === "decrease") {
    if (currentQuantity === 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = currentQuantity - 1;
    }
  } else {
    return res.status(400).json(new ApiError(400, "Invalid action type"));
  }

  // Recalculate total price
  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  // Return the updated cart directly without making another DB call
  return res.status(200).json(new ApiResponse(200, cart));
});

// Remove product from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId })
    .populate("items.productId", "name price images discount")
    .select("items totalPrice");
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item?._id.toString() === productId
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Remove product from cart
  cart.items.splice(itemIndex, 1);

  // Recalculate total price
  cart.totalPrice = await calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart));
});

export { addToCart, getCart, updateQuantity, removeFromCart };
