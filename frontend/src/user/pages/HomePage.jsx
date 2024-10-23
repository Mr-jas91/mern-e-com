import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import { toast } from "react-toastify";
import Carousel from "../components/Carousel/Carousel";
import ProductGrid from "../components/Product/ProductGrid";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../redux/reducers/productReducer";
import { resetCartNotification } from "../../redux/reducers/cartReducer";

// Main HomePage Component
export default function HomePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { addCartError, addCartSuccess } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [user]);

  // Show toast messages based on the result of the addToCart action
  useEffect(() => {
    if (addCartSuccess) {
      toast.success("Product added to cart successfully!", {
        autoClose: 5000,
      });
      dispatch(resetCartNotification());
    } else if (addCartError) {
      toast.error("Unable to add product to cart.", {
        autoClose: 5000,
      });
      dispatch(resetCartNotification());
    }
  }, [addCartSuccess, addCartError, dispatch]);
  let productItem = products;
  const carouselItems = [
    {
      src: "https://via.placeholder.com/1440x400",
      title: "Summer Sale",
      description: "Up to 50% off on selected items",
    },
    {
      src: "https://via.placeholder.com/1440x400",
      title: "New Arrivals",
      description: "Check out our latest collection",
    },
    {
      src: "https://via.placeholder.com/1440x400",
      title: "Free Shipping",
      description: "On orders over $50",
    },
  ];

  const topSellingProducts = [
    {
      id: 5,
      name: "Product 5",
      price: 59.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 6,
      name: "Product 6",
      price: 69.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 7,
      name: "Product 7",
      price: 79.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 8,
      name: "Product 8",
      price: 89.99,
      image: "https://via.placeholder.com/300x300",
    },
  ];

  const featuredProducts = [
    {
      id: 9,
      name: "Product 9",
      price: 99.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 10,
      name: "Product 10",
      price: 109.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 11,
      name: "Product 11",
      price: 119.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 12,
      name: "Product 12",
      price: 129.99,
      image: "https://via.placeholder.com/300x300",
    },
  ];

  const categories = [
    { id: "electronics", name: "Electronics", products: "" },
    { id: "clothing", name: "Clothing", products: topSellingProducts },
    { id: "home", name: "Home & Garden", products: featuredProducts },
  ];
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: { xs: "none", md: "block" } }}>
        <Carousel images={carouselItems} />
      </Box>

      <ProductGrid title="Recommended Products" products={products} />
      {/* <ProductGrid title="Top Selling Products" products={topSellingProducts} />
    <ProductGrid title="Featured Products" products={featuredProducts} /> */}

      {/* <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Shop by Category
        </Typography>
        {categories.map((category) => (
          <Box key={category?.id} sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              {category?.name}
            </Typography>
            <Grid container spacing={2}>
              {category?.products?.slice(0, 4)?.map((product) => (
                <Grid item key={product?.id} xs={12} sm={6} md={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box> */}
    </Container>
  );
}
