import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { deleteProduct, fetchProducts } from "../services/authServices";
function ProductList({ product, index, button }) {
  const { setFormData, setIsUpdate, setProducts } = useAuth();
  // Handle Delete Product
  const handleDelete = async (productId) => {
    console.log(productId)
    await deleteProduct(productId);
    await fetchProducts(setProducts);
  };

  // Handle Update Product (Dummy function for now)
  const handleUpdate = async () => {
    setIsUpdate(true);
    button.showModal();
    // Implement your update logic here
    setFormData({
      ...product,
    });
  };

  return (
    <tr key={index} className="hover:bg-gray-100">
      <td className="py-2 px-4 border">{index}</td>
      <td className="py-2 px-4 border">{product.name}</td>
      <td className="py-2 px-4 border">
        <img src={product.images[0]} alt={product.name} className="w-16 h-16" />
      </td>
      <td className="py-2 px-4 border"> ₹{product.price}</td>
      <td className="py-2 px-4 border"> ₹{product.discount}</td>
      <td className="py-2 px-4 border">{product.stock}</td>
      <td className="py-2 px-4 border flex flex-col">
        <button
          onClick={() => handleUpdate()}
          className="bg-blue-500 text-white px-4 py-2  rounded-lg hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={() => handleDelete(product.productId)}
          className="bg-red-500 text-white px-4 py-2  rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ProductList;
