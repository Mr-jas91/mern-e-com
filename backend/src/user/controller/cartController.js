import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Cart } from "../../models/cart.models.js";
import { Product } from "../../models/product.models.js";
import { User } from "../../models/user.models.js";
// Calculate total cart amount
const calculateTotalPriceOptimized = async (cart, currentProduct = null) => {
  if (!cart.items.length) {
    return { totalPrice: 0, discount: 0, finalPrice: 0 };
  }

  // Identify which product details we need to fetch
  const currentProductId = currentProduct?._id?.toString();
  const productIdsToFetch = cart.items
    .map((item) => item.productId._id?.toString() || item.productId.toString())
    .filter((id) => id !== currentProductId);

  // Fetch only the products not already provided in 'currentProduct'
  const otherProducts = await Product.find({ _id: { $in: productIdsToFetch } })
    .select("price discount")
    .lean();

  const productMap = new Map(otherProducts.map((p) => [p._id.toString(), p]));
  if (currentProduct) productMap.set(currentProductId, currentProduct);

  let totalPrice = 0;
  let totalDiscount = 0;

  for (const item of cart.items) {
    const pId = item.productId._id?.toString() || item.productId.toString();
    const p = productMap.get(pId);
    if (p) {
      totalPrice += p.price * item.quantity;
      totalDiscount += (p.discount || 0) * item.quantity;
    }
  }

  return {
    totalPrice: Number(totalPrice.toFixed(2)),
    discount: Number(totalDiscount.toFixed(2)),
    finalPrice: Number((totalPrice - totalDiscount).toFixed(2))
  };
};
// 1. ADD TO CART
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const [cart, product] = await Promise.all([
    Cart.findOne({ userId }),
    Product.findById(productId).select("price discount stock").lean()
  ]);

  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < 1) throw new ApiError(400, "Out of stock");

  let activeCart = cart || new Cart({ userId, items: [] });

  const itemIndex = activeCart.items.findIndex(
    (i) => i.productId.toString() === productId
  );
  if (itemIndex > -1) {
    activeCart.items[itemIndex].quantity += 1;
  } else {
    activeCart.items.push({ productId, quantity: 1 });
  }

  const prices = await calculateTotalPriceOptimized(activeCart, product);
  Object.assign(activeCart, prices);

  await activeCart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, activeCart, "Added to cart"));
});

// 2. GET CART
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id })
    .populate("items.productId", "name price images discount")
    .lean();

  if (!cart) cart = { items: [], totalPrice: 0, finalPrice: 0, discount: 0 };

  return res.status(200).json(new ApiResponse(200, cart));
});

// 3. UPDATE QUANTITY
const updateQuantity = asyncHandler(async (req, res) => {
  const { _id, action } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId, "items._id": _id });
  if (!cart) throw new ApiError(404, "Item not found in cart");

  const item = cart.items.id(_id);
  if (action === "decrease" && item.quantity < 1) {
    throw new ApiError(400, "Minimum quantity is 1");
  }

  item.quantity += action === "increase" ? 1 : -1;

  // Recalculate using our optimized helper
  const prices = await calculateTotalPriceOptimized(cart);
  Object.assign(cart, prices);

  await cart.save();
  // Return populated for frontend immediate update
  const populatedCart = await cart.populate(
    "items.productId",
    "name price images discount"
  );

  return res.status(200).json(new ApiResponse(200, populatedCart));
});

// 4. REMOVE FROM CART
const removeFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.params; // Item sub-doc ID
  const userId = req.user._id;

  // 1. Atomic Pull: Remove the item and get the updated cart in one trip
  // We use populate here so we have the prices immediately for recalculation
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { _id } } },
    { new: true }
  ).populate("items.productId", "name images price discount");

  if (!cart) throw new ApiError(404, "Cart not found");

  // 2. Optimized Calculation
  // Since 'cart' is already populated, our helper doesn't need to call Product.find() at all!
  let totalPrice = 0;
  let totalDiscount = 0;

  cart.items.forEach((item) => {
    const p = item.productId; // This is the populated product object
    if (p) {
      totalPrice += p.price * item.quantity;
      totalDiscount += (p.discount || 0) * item.quantity;
    }
  });

  // 3. Final Update: Save the new totals
  cart.totalPrice = Number(totalPrice.toFixed(2));
  cart.discount = Number(totalDiscount.toFixed(2));
  cart.finalPrice = Number((totalPrice - totalDiscount).toFixed(2));

  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Item removed"));
});

export { addToCart, getCart, updateQuantity, removeFromCart };
