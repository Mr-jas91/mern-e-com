import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHander";
import { Wishlist } from "../../models/wishlist.models";
import { Product } from "../../models/product.models";
const addProductToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user_id;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(400).json(new ApiError(400, "Invalid Product ID"));
  }

  try {
    const existingWishlist = await Wishlist.findOne({ userId });
    if (existingWishlist) {
      existingWishlist.products.push(product._id);
      await existingWishlist.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Product added to Wishlist"));
    } else {
      const newWishlist = new Wishlist({ userId, products: [productId] });
      await newWishlist.save();
      return res.status(201).json(new ApiResponse(201, "New Wishlist created"));
    }
  } catch (error) {
    return ApiResponse.error(res, error);
  }
});
const getWishlist = asyncHandler(async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json(new ApiError(404, "Wishlist Empty"));
    }
    return res.status(200).json(new ApiResponse(200, wishlist));
  } catch (error) {
    return ApiResponse.error(res, error);
  }
});
const deleteProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;
  if (!productId) {
    return res.status(400).json(new ApiError(400, "Invalid Product ID"));
  }
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );
    if (!wishlist) {
      return res.status(404).json(new ApiError(404, "Wishlist Empty"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Product deleted from Wishlist"));
  } catch (error) {
    return ApiResponse.error(res, error);
  }
});

export { addProductToWishlist, getWishlist, deleteProductFromWishlist };
