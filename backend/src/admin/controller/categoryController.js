import { Category } from "../../models/category.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// GET: Fetch all categories
const getCategory = asyncHandler(async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList || categoryList.length === 0) {
    return res.status(404).json(new ApiError(404, "No categories found"));
  }
  return res.status(200).json(new ApiResponse(200, categoryList));
});

// POST: Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = new Category({ name });
  await category.save();
  return res.status(201).json(new ApiResponse(201, category));
});

export { getCategory, createCategory };
