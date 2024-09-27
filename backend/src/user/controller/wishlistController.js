import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Wishlist } from "../../models/wishlist.models.js";

// Add to Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  // Find the user's wishlist or create a new one
  let wishlist = await Wishlist.findOne({ userId });
  //if wishlist not found then craete
  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [] });
  }

  // Check if the product is already in the wishlist
  const productExists = wishlist.items.some(
    (item) => item.productId.toString() === productId
  );

  if (productExists) {
   // res.status(400);
    throw new ApiError("Product already in wishlist");
  }

  // Add product to the wishlist
  wishlist.items.push({ productId });
  await wishlist.save();
  res.status(200).json(new ApiResponse(200, wishlist));
});

// Remove from Wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  // Find the user's wishlist
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  // Check if the product exists in the wishlist
  const itemIndex = wishlist.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not found in wishlist");
  }

  // Remove product from wishlist
  wishlist.items.splice(itemIndex, 1);
  await wishlist.save();

  res.status(200).json(new ApiResponse(200, wishlist));
});

// Get Wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find the user's wishlist
  const wishlist = await Wishlist.findOne({ userId }).populate(
    "items.productId",
    "name price images"
  );

  //if wishlist not found then craete
  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [] });
  }

  res.status(200).json(new ApiResponse(200, wishlist));
});

export { addToWishlist, removeFromWishlist, getWishlist };
