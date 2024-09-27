import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Cart } from "../../models/cart.models.js";
import { Product } from "../../models/product.models.js";
//calculate total cart amout
const calculateTotalPrice = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) return 0;

  const productIds = cart.items.map((item) => item.productId);
  if (!productIds.length) return 0;
  const products = await Product.find({ _id: { $in: productIds } }).select(
    "price"
  );
  let totalAmout = 0;
  cart.items.forEach((item) => {
    const product = products.find((p) => p._id.equals(item.productId));
    if (product) {
      totalAmout += product.price * item.quantity;
    }
  });
  return totalAmout;
};
// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // Assuming you have user authentication

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ userId });

  // If no cart, create a new one
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }
  // console.log(cart);
  // Check if product already exists in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    // If product exists in the cart, update the quantity
    cart.items[itemIndex].quantity += 1;
  } else {
    // If product doesn't exist, add new item to cart
    cart.items.push({ productId });
  }

  // Recalculate total price
  const totalprice = await calculateTotalPrice(cart);
  cart.totalPrice = totalprice;
  await cart.save();
  res.status(200).json(new ApiResponse(200, cart));
});

//getcart of the product in the cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }
  return res.status(200).json(new ApiResponse(cart));
});

// Update quantity of a product in the cart
const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (quantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be greater than zero");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  // Update quantity of the product in the cart
  cart.items[itemIndex].quantity = quantity;

  // Recalculate total price
  const totalprice = await calculateTotalPrice(cart);
  cart.totalPrice = totalprice;

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart));
});

// Remove product from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  // Remove product from cart
  cart.items.splice(itemIndex, 1);

  // Recalculate total price
  const totalprice = await calculateTotalPrice();
  cart.totalPrice = totalprice;
  await cart.save();
  res.status(200).json(new ApiResponse(200, cart));
});

export { addToCart, getCart, updateQuantity, removeFromCart };
