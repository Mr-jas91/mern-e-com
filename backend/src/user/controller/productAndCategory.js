import { Product } from "../../models/product.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
import { Category } from "../../models/category.models.js";

// Global constant for projection to avoid repeating strings
const PRODUCT_FIELDS =
  "name price description images discount category ratings";

// 1. Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .select({
      name: 1,
      price: 1,
      discount: 1,
      ratings: 1,
      // $slice: 1 ka matlab hai array ka pehla element (index 0)
      images: { $slice: 1 }
    })
    .limit(12)
    .lean();

  if (!products?.length) {
    throw new ApiError(404, "No products found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched"));
});
// 2. Get Product Details
const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // populate category only if needed
  const product = await Product.findById(id)
    .select(PRODUCT_FIELDS)
    .populate("category", "name")
    .lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product details fetched"));
});

// 3. Get Products By Category
const getProductDetailsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Optimization: find queries on indexed fields like 'category' are very fast
  const products = await Product.find({ category: categoryId })
    .select({
      name: 1,
      price: 1,
      discount: 1,
      ratings: 1,
      // $slice: 1 ka matlab hai array ka pehla element (index 0)
      images: { $slice: 1 }
    })
    .limit(10)
    .lean();

  if (!products.length) {
    throw new ApiError(404, "No products found in this category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Category products fetched"));
});

// 4. Get All Categories
const getCategory = asyncHandler(async (req, res) => {
  // select only name and id to keep response light
  const categories = await Category.find();

  if (!categories || categories.length === 0) {
    throw new ApiError(404, "Categories not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched"));
});

// 5. Seach product
const searchProducts = asyncHandler(async (req, res) => {
  // Extract filters from req.query
  const {
    query,
    category,
    minPrice,
    maxPrice,
    rating,
    brand,
    stock, // 'in-stock' or 'out-of-stock'
    isFeatured,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  // 1. Initialize dynamic filter object
  const mongoQuery = {};

  // Text Search
  if (query) mongoQuery.$text = { $search: query };

  // Exact Category Match
  if (category) mongoQuery.category = category;

  // Price Range
  if (minPrice || maxPrice) {
    mongoQuery.price = {};
    if (minPrice) mongoQuery.price.$gte = Number(minPrice);
    if (maxPrice) mongoQuery.price.$lte = Number(maxPrice);
  }

  // Rating Filter (e.g., 4 stars and up)
  if (rating) {
    // Assuming ratings is an array of numbers, we calculate the avg or use a stored avgRating field
    mongoQuery.avgRating = { $gte: Number(rating) };
  }

  // Brand/Owner Filter
  if (brand) mongoQuery.owner = brand;

  // Availability Filter
  if (stock === "in-stock") {
    mongoQuery.stock = { $gt: 0 };
  } else if (stock === "out-of-stock") {
    mongoQuery.stock = { $eq: 0 };
  }

  // Status Filters
  if (isFeatured) mongoQuery.isFeatured = isFeatured === "true";

  // 2. Sorting Logic
  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    ratingHigh: { avgRating: -1 }
  };
  const sortOrder = sortMap[sort] || sortMap.latest;

  // 3. Execution (Parallel Count and Find)
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find(mongoQuery)
      .select("name price discount images stock avgRating isFeatured")
      .sort(sortOrder)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(mongoQuery)
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page)
      },
      "Search results filtered successfully"
    )
  );
});
export {
  getProducts,
  getProductDetails,
  getProductDetailsByCategory,
  getCategory,
  searchProducts
};
