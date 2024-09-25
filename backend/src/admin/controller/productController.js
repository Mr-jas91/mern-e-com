import { Product } from "../../models/product.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";
// POST: Add a new product
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  // Input validation
  if (!name || !price || !description || !category || !stock) {
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
    description,
    category,
    stock,
    images: imageUrls,
    owner: req.admin._id,
  });

  // Save product to the database
  await newProduct.save();

  // Return success response
  return res
    .status(201)
    .json(new ApiResponse(201, "Product added successfully", newProduct));
});

//getProducts api
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("owner", "firstName");
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

  // Validate product id
  if (!id) {
    return res.status(400).json(new ApiError(400, "Product id is required"));
  }

  const { name, price, description, discount, stock, category } = req.body;

  // Validate required fields
  if (!name || !price || !description || !discount || !stock || !category) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  // Check if files are uploaded
  const images = req.files;
  if (images && images.length > 0) {
    // Fetch existing images from DB
    const product = await Product.findById(id).select("images");
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // Delete old images from cloud storage
    await Promise.all(
      product.images.map(async (element) => {
        await deleteFromCloudinary(element);
      })
    );

    // Upload new images to cloud storage
    const uploadedImages = await Promise.all(
      images.map(async (img) => {
        const uploadedImageUrl = await uploadOnCloudinary(img.path);
        return uploadedImageUrl;
      })
    );

    // Update product images in the DB
    product.images = uploadedImages;
  }

  // Update product details in the DB
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        price,
        description,
        discount,
        stock,
        category,
        ...(images && images.length > 0 && { images: product.images }),
      },
    },
    { new: true }
  );

  // Check if product exists
  if (!updatedProduct) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  // Success response
  return res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully", updatedProduct));
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
  if (product.image) {
    try {
      await deleteFromCloudinary(product.image);
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Failed to delete image from Cloudinary"));
    }
  }

  // Send success response
  return res
    .status(200)
    .json(new ApiResponse(200, "Product deleted successfully", product));
});

// Export the routes
export {
  addProduct,
  getProducts,
  getProductDetails,
  updateProductDetails,
  deleteProduct,
};
