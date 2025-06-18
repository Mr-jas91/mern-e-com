import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Cart } from "../../models/cart.models.js";
import { Product } from "../../models/product.models.js";
import { User } from "../../models/user.models.js";
// Calculate total cart amount
const calculateTotalPrice = async (cart) => {
  if (!cart?.items?.length) {
    return {
      totalPrice: 0,
      discount: 0,
      finalPrice: 0
    };
  }

  const productIds = cart.items
    .map((item) => item?.productId?._id || item?.productId)
    .filter(Boolean);
  if (!productIds.length) {
    return {
      totalPrice: 0,
      discount: 0,
      finalPrice: 0
    };
  }

  const products = await Product.find({ _id: { $in: productIds } }).select(
    "price discount"
  );

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let totalPrice = 0;
  let discount = 0;

  for (const item of cart.items) {
    const product = productMap.get(
      item?.productId?._id?.toString() || item?.productId?.toString()
    );
    if (!product || !item.quantity) continue;

    totalPrice += product.price * item.quantity;
    discount += product.discount * item.quantity;
  }

  const finalPrice = totalPrice - discount;

  return {
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2))
  };
};

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  let cart = await Cart.findOne({ userId }).select(
    "items totalPrice discount finalPrice"
  );
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item?.productId?._id?.toString() === productId ||
      item?.productId?.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  const priceDetails = await calculateTotalPrice(cart);
  cart.totalPrice = priceDetails.totalPrice;
  cart.discount = priceDetails.discount;
  cart.finalPrice = priceDetails.finalPrice;

  await cart.save();

  // Add productId to user's cart history or wishlist etc.
  const user = await User.findById(userId);
  if (!user.cart.includes(productId)) {
    user.cart.push(productId);
  }
  await user.save();

  return res.status(200).json(new ApiResponse(200, cart));
});


// Get cart for the user
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id })
    .populate("items.productId", "name price images discount")
    .select("items totalPrice finalPrice discount");
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }
  res.status(200).json(new ApiResponse(200, cart));
});

// Update quantity of a product in the cart
const updateQuantity = asyncHandler(async (req, res) => {
  const { _id, action } = req.body;
  const userId = req.user._id;

  if (!["increase", "decrease"].includes(action)) {
    return res.status(400).json(new ApiError(400, "Invalid action type"));
  }

  // Fetch the specific item in cart
  const cart = await Cart.findOne(
    { userId, "items._id": _id },
    { "items.$": 1 }
  );

  if (!cart || !cart.items.length) {
    return res.status(404).json(new ApiError(404, "Cart or product not found"));
  }

  const currentQuantity = cart.items[0].quantity;
  if (action === "decrease" && currentQuantity <= 1) {
    return res
      .status(400)
      .json(new ApiError(400, "Quantity cannot be less than 1"));
  }

  const updateOperation =
    action === "increase"
      ? { $inc: { "items.$.quantity": 1 } }
      : { $inc: { "items.$.quantity": -1 } };

  const updatedCart = await Cart.findOneAndUpdate(
    { userId, "items._id": _id },
    updateOperation,
    { new: true }
  ).populate("items.productId", "name price images discount");

  if (!updatedCart) {
    return res
      .status(404)
      .json(new ApiError(404, "Cart not found after update"));
  }

  // ✅ Recalculate all prices
  const priceDetails = await calculateTotalPrice(updatedCart);
  updatedCart.totalPrice = priceDetails.totalPrice;
  updatedCart.discount = priceDetails.discount;
  updatedCart.finalPrice = priceDetails.finalPrice;
  await updatedCart.save();

  return res.status(200).json(new ApiResponse(200, updatedCart));
});

// Remove product from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId })
    .populate("items.productId", "name price images discount")
    .select("items totalPrice discount finalPrice");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Get the productId before removal
  const removedItemProductId = cart.items[itemIndex].productId._id.toString();

  // ❌ Remove item
  cart.items.splice(itemIndex, 1);

  // ✅ Recalculate prices
  const priceDetails = await calculateTotalPrice(cart);
  cart.totalPrice = priceDetails.totalPrice;
  cart.discount = priceDetails.discount;
  cart.finalPrice = priceDetails.finalPrice;

  // ✅ Remove productId from user's cart tracking (if used)
  const user = await User.findById(userId);
  user.cart = user.cart.filter(
    (item) => item._id.toString() !== removedItemProductId
  );  

  await user.save();
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart));
});


export { addToCart, getCart, updateQuantity, removeFromCart };
