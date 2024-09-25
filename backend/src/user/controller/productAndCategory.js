import { Product } from "../../models/product.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Category } from "../../models/category.models.js";
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().limit(10);
    res.status(200).json(new ApiResponse(200, products));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
});
const getProductDetails = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }
    res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
});
const getProductDetailsByCategory = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
    }).limit(10);
    if (!products.length) {
      return res
        .status(404)
        .json(new ApiError(404, "No products found in this category"));
    }
    res.status(200).json(new ApiResponse(200, products));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
});
const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }
    res.status(200).json(new ApiResponse(200, category));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
});
export {
  getProducts,
  getProductDetails,
  getProductDetailsByCategory,
  getCategory,
};
