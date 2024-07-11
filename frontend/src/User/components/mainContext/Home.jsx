import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import axios from "axios";

const Home = () => {
  // const [recommendedProducts, setRecommendedProducts] = useState([]);
  // const [trendingProducts, setTrendingProducts] = useState([]);

 

  const [recommendedProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      image: "https://via.placeholder.com/150",
      price: 10.0,
    },
    {
      id: 2,
      name: "Product 2",
      image: "https://via.placeholder.com/150",
      price: 20.0,
    },
    {
      id: 3,
      name: "Product 3",
      image: "https://via.placeholder.com/150",
      price: 30.0,
    },
    {
      id: 4,
      name: "Product 4",
      image: "https://via.placeholder.com/150",
      price: 40.0,
    },
    {
      id: 5,
      name: "Product 5",
      image: "https://via.placeholder.com/150",
      price: 50.0,
    },
    {
      id: 6,
      name: "Product 6",
      image: "https://via.placeholder.com/150",
      price: 60.0,
    },
    {
      id: 7,
      name: "Product 7",
      image: "https://via.placeholder.com/150",
      price: 70.0,
    },
    {
      id: 8,
      name: "Product 8",
      image: "https://via.placeholder.com/150",
      price: 80.0,
    },
    {
      id: 9,
      name: "Product 9",
      image: "https://via.placeholder.com/150",
      price: 90.0,
    },
    {
      id: 10,
      name: "Product 10",
      image: "https://via.placeholder.com/150",
      price: 100.0,
    },
  ]);

  const [trendingProducts] = useState([
    {
      id: 1,
      name: "Product A",
      image: "https://via.placeholder.com/150",
      price: 15.0,
    },
    {
      id: 2,
      name: "Product B",
      image: "https://via.placeholder.com/150",
      price: 25.0,
    },
    {
      id: 3,
      name: "Product C",
      image: "https://via.placeholder.com/150",
      price: 35.0,
    },
    {
      id: 4,
      name: "Product D",
      image: "https://via.placeholder.com/150",
      price: 45.0,
    },
    {
      id: 5,
      name: "Product E",
      image: "https://via.placeholder.com/150",
      price: 55.0,
    },
    {
      id: 6,
      name: "Product F",
      image: "https://via.placeholder.com/150",
      price: 65.0,
    },
    {
      id: 7,
      name: "Product G",
      image: "https://via.placeholder.com/150",
      price: 75.0,
    },
    {
      id: 8,
      name: "Product H",
      image: "https://via.placeholder.com/150",
      price: 85.0,
    },
    {
      id: 9,
      name: "Product I",
      image: "https://via.placeholder.com/150",
      price: 95.0,
    },
    {
      id: 10,
      name: "Product J",
      image: "https://via.placeholder.com/150",
      price: 105.0,
    },
  ]);

  const scrollLeft = (id) => {
    document.getElementById(id).scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    document.getElementById(id).scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Carousel Section */}
      <div className="relative mb-8">
        <div className="carousel-container overflow-hidden h-64 bg-gray-300 rounded-lg">
          {/* Add your carousel implementation here */}
          <div className="h-full w-full flex items-center justify-center text-2xl">
            Carousel
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Recommended Products
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollLeft("recommended")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg"
          >
            <FaChevronLeft />
          </button>
          <div
            id="recommended"
            className="flex overflow-x-scroll space-x-4 p-4"
          >
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-48 bg-white shadow rounded-lg p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-500">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollRight("recommended")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Trending Products Section */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Trending Products
        </h2>
        <div className="relative">
          <button
            onClick={() => scrollLeft("trending")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg"
          >
            <FaChevronLeft />
          </button>
          <div id="trending" className="flex overflow-x-scroll space-x-4 p-4">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-48 bg-white shadow rounded-lg p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-500">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollRight("trending")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
