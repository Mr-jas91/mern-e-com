import { Product } from "../../models/product.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// GET /api/products/:productId
const getProductStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select("stock");
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  return res.status(200).json(new ApiResponse(200, product));
});

// PUT /api/products/:productId
const updateInventory = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select("stock");
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  return res.status(200).json(new ApiResponse(200, product));
});

export { getProductStock, updateInventory };
