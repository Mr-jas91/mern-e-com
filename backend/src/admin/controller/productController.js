import { Product } from "../models/product.models";

exports.createProduct = (req, res) => {
  // The `upload` middleware will handle the images
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  // Extract image paths from the uploaded files
  const imagePaths = files.map((file) => file.path);

  // Create a new product with the image paths and other details
  const {
    name,
    description,
    productImage,
    price,
    discount,
    stock,
    category,
    owner,
  } = req.body;
  const newProduct = new Product({
    name,
    description,
    productImage: imagePaths,
    price,
    discount,
    stock,
    category,
    owner,
  });

  // Save the product in the database
  newProduct
    .save()
    .then((product) =>
      res.status(201).json({ message: "Product created", product })
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};
