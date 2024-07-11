import React, { useState } from "react";
import { FaStar, FaRegStar, FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
const product = {
  title:
    "SAMSUNG 80 cm (32 Inch) HD Ready LED Smart Tizen TV with Bezel-free Design  (UA32T4380AKXXL)",
  description:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
  price: 123,
  images: [
    "https://via.placeholder.com/400x400",
    "https://via.placeholder.com/100x100",
    "https://via.placeholder.com/100x100",
    "https://via.placeholder.com/100x100",
  ],
  similarProducts: [
    {
      title: "Similar Product 1",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 2",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 3",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 4",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 5",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 6",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 7",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 8",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 9",
      image: "https://via.placeholder.com/100x100",
    },
    {
      title: "Similar Product 10",
      image: "https://via.placeholder.com/100x100",
    },
  ],
  reviews: [],
  rating: 3,
};

const ProductLandingPage = () => {
  const {
    title,
    description,
    price,
    images,
    similarProducts,
    reviews,
    rating,
  } = product;
  const [SelectedImage, setSelectedImage] = useState(images[0]);
  


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Product Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={SelectedImage} // Main product image
            alt={title}
            className="w-full h-auto mb-4 md:mb-0 md:max-h-full md:max-w-full md:object-contain"
          />
          <div className="flex justify-center space-x-4 md:justify-start mt-2">
            {images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image} // Additional product images
                alt={title}
                className="w-16 h-16 object-cover cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 md:pl-8 ">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="mb-4">
            <span className="md:text-3xl text-2xl font-semibold mr-2">
              Price ${price}
            </span>
            <div className="flex items-center mb-2">
              <button className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2 w-1/2">
                Add to Cart
              </button>
              <button className="bg-green-500 text-white py-1 px-3 rounded-md w-1/2">
                Buy Now
              </button>
            </div>
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < rating ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-yellow-500" />
                  )}
                </span>
              ))}
              <span className="ml-2 text-xl">{reviews} rating...</span>
            </div>
          </div>
          <div className="mb-4 md:flex md:justify-between">
            {/* Description (either below or beside the image) */}
            <div className="mb-4 w-full md:mb-0">
              <h3 className="text-3xl font-semibold mb-2">Description</h3>
              <p className="text-sm">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="mt-8">
        <h3 className="text-3xl font-semibold mb-4">Similar Products</h3>
        <div className="flex flex-wrap justify-center space-x-4">
          {similarProducts.slice(0, 10).map((product, index) => (
            <Link to="/info" className="w-10/12 md:w-1/5 mb-4" onClick={(e)=>e}>
              <div key={index}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-auto mb-2 object-contain"
                />
                <p className="text-lg">{product.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-3xl font-semibold mb-4">Reviews</h3>
        <p>Review section implementation goes here...</p>
      </div>
    </div>
  );
};

export default ProductLandingPage;
