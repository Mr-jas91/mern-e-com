import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash, FaCreditCard } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Item 1",
      image: "https://via.placeholder.com/48",
      price: 10.0,
      quantity: 1,
    },
    {
      id: 2,
      name: "Item 2",
      image: "https://via.placeholder.com/48",
      price: 20.0,
      quantity: 2,
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12" />
                  <div>
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="bg-red-500 text-white p-2 rounded-full"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="bg-green-500 text-white p-2 rounded-full"
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl md:text-2xl font-bold">
              Total: ${totalAmount.toFixed(2)}
            </h2>
            <button className="mt-4 md:mt-0 bg-blue-500 text-white p-3 rounded-md flex items-center space-x-2">
              <FaCreditCard />
              <span>Make Payment</span>
            </button>
          </div>
        </>
      ) : (
        <p className="text-lg text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
