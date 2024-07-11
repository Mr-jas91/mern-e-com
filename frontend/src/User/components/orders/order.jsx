import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      name: 'Product 1',
      image: 'https://via.placeholder.com/48',
      price: 30.0,
      status: 'Delivered'
    },
    {
      id: 2,
      name: 'Product 2',
      image: 'https://via.placeholder.com/48',
      price: 50.0,
      status: 'In Transit'
    },
    {
      id: 3,
      name: 'Product 3',
      image: 'https://via.placeholder.com/48',
      price: 20.0,
      status: 'Cancelled'
    }
  ]);

  const statusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'In Transit':
        return <FaTruck className="text-yellow-500" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">My Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={order.image} alt={order.name} className="w-12 h-12" />
                <div>
                  <h2 className="text-lg font-bold">{order.name}</h2>
                  <p className="text-gray-500">${order.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{order.status}</span>
                {statusIcon(order.status)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500">You have no orders.</p>
      )}
    </div>
  );
};

export default Orders;
