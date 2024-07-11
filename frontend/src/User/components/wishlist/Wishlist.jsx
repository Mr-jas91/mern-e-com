import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wishlist Item 1',
      image: 'https://via.placeholder.com/48',
      price: 15.0
    },
    {
      id: 2,
      name: 'Wishlist Item 2',
      image: 'https://via.placeholder.com/48',
      price: 25.0
    }
  ]);

  const handleRemove = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">My Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <div className="space-y-4">
          {wishlistItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-12 h-12" />
                <div>
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="text-gray-500">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => handleRemove(item.id)} className="text-red-500 p-2">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
