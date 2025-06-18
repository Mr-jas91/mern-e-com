import { Product } from "../../models/product.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Category } from "../../models/category.models.js";

//getProduct API
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .select("name price description  images discount category ratings")
    .limit(12);
  if (!products) {
    return res.status(404).json(new ApiError(404, "Products not found"));
  }
  res.status(200).json(new ApiResponse(200, products));
});

//getProductDetails API
const getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .select("name price description  images discount category ratings")
    .populate("category", "name");
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  res.status(200).json(new ApiResponse(200, product));
});

//getProductsByCategory API
const getProductDetailsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: req.params.categoryId
  })
    .select("name price description  images discount category ratings")
    .limit(10);
  if (!products.length) {
    return res
      .status(404)
      .json(new ApiError(404, "No products found in this category"));
  }
  res.status(200).json(new ApiResponse(200, products));
});

//getCategory API
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.find();
  if (!category) {
    return res.status(404).json(new ApiError(404, "Category not found"));
  }
  res.status(200).json(new ApiResponse(200, category));
});
export {
  getProducts,
  getProductDetails,
  getProductDetailsByCategory,
  getCategory
};
