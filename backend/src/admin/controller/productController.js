import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../cloudinary.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, stock, category } = req.body;
    const { _id } = req.admin;
    const imagefiles = req.files;

    if (!imagefiles || imagefiles.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Map through imageFiles and upload each one to Cloudinary, then wait for all uploads to complete
    const imagePaths = await Promise.all(
      imagefiles.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);
        return result; // Return the result (e.g., URL) after upload
      })
    );
    // console.log(imagePaths);
    // Create the new product after all images are uploaded
    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      stock,
      category,
      owner: _id,
      images: imagePaths, // Use the resolved image paths here
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created", product: savedProduct });
  } catch (err) {
    // Handle errors, such as upload failure or database issues
    res.status(500).json({ error: err.message });
  }
};
const editProduct = async (req, res) => {
  const { _id, name, description, price, discount, stock, category } = req.body;
  const productToEdit = Product.find(_id);
  if (!productToEdit) {
    return res.status(404).json({ error: "Product not found" });
  }
};
export { createProduct, editProduct };
