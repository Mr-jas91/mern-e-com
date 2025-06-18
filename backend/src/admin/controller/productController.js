import { Product } from "../../models/product.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary
} from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
// POST: Add a new product
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, discountPrice, description, categoryId, stock } =
    req.body;

  // Input validation
  if (
    !name ||
    !price ||
    !discountPrice ||
    !description ||
    !categoryId ||
    !stock
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  // Handle image uploads if present
  const images = req.files || [];
  // Upload images to Cloudinary or any other service
  const imageUrls = await Promise.all(
    images.map(async (img) => {
      const uploadedImageUrl = await uploadOnCloudinary(img.path);
      return uploadedImageUrl;
    })
  );

  // Create the new product
  const newProduct = new Product({
    name,
    price,
    discount: price - discountPrice,
    description,
    category: categoryId,
    stock,
    images: imageUrls,
    owner: req.admin._id
  });

  // Save product to the database
  await newProduct.save();

  // Return success response
  return res
    .status(201)
    .json(new ApiResponse(201, "Product added successfully"));
});

//getProducts api
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("category", "name");
  if (!products) {
    return res.status(400).json(new ApiError(400, "No products found"));
  }
  return res.status(200).json(new ApiResponse(200, products));
});

// get product details api
const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiError(400, "Product id is required"));
  }
  const product = await Product.findById(id).populate("owner", "firstName");
  if (!product) {
    return res.status(400).json(new ApiError(400, "Product not found"));
  }
  return res.status(200).json(new ApiResponse(200, product));
});

// updateProduct api
const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiError(400, "Product id is required"));
  }

  // Get fields from form-data
  const { name, price, description, discountPrice, stock, categoryId } =
    req.body;

  if (
    !name ||
    !price ||
    !description ||
    !discountPrice ||
    !stock ||
    !categoryId
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  let product = await Product.findById(id);
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  // Handle image upload if files are present
  if (req.files && req.files.length > 0) {
    // Delete old images from cloud storage
    await Promise.all(
      product.images.map(async (element) => {
        await deleteFromCloudinary(element);
      })
    );

    // Upload new images
    const uploadedImages = await Promise.all(
      req.files.map(async (img) => {
        const uploadedImageUrl = await uploadOnCloudinary(img.path);
        return uploadedImageUrl;
      })
    );

    product.images = uploadedImages;
  }

  // Update product
  product.name = name;
  product.price = price;
  product.description = description;
  product.discount = price - discountPrice;
  product.stock = stock;
  product.category = categoryId;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully"));
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate product id
  if (!id) {
    return res.status(400).json(new ApiError(400, "Product id is required"));
  }

  // Find and delete product
  const product = await Product.findByIdAndDelete(id);

  // Check if product exists
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  // If the product has an image, delete it from Cloudinary
  if (product.images) {
    try {
      await Promise.all(
        product.images.map(async (element) => {
          await deleteFromCloudinary(element);
        })
      );
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Failed to delete image from Cloudinary"));
    }
  }

  // Send success response
  return res
    .status(200)
    .json(new ApiResponse(200, "Product deleted successfully"));
});

// Export the routes
export {
  addProduct,
  getProducts,
  getProductDetails,
  updateProductDetails,
  deleteProduct
};
