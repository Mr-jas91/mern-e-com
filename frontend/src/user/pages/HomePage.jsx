import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import ProductCard from "../components/Product/ProductCard";
import Carousel from "../components/Carousel/Carousel";
import ProductGrid from "../components/Product/ProductGrid";
import { useSelector, useDispatch } from "react-redux";

// Main HomePage Component
export default function HomePage() {
  const count = useSelector((state) => state.auth.loading);
  console.log(count);

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

  const recommendedProducts = [
    {
      id: 1,
      name: "Product 1",
      price: 19.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 2,
      name: "Product 2",
      price: 29.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 3,
      name: "Product 3",
      price: 39.99,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 4,
      name: "Product 4",
      price: 49.99,
      image: "https://via.placeholder.com/300x300",
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
    { id: "electronics", name: "Electronics", products: recommendedProducts },
    { id: "clothing", name: "Clothing", products: topSellingProducts },
    { id: "home", name: "Home & Garden", products: featuredProducts },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: { xs: "none", md: "block" } }}>
        <Carousel images={carouselItems} />
      </Box>

      <ProductGrid
        title="Recommended Products"
        products={recommendedProducts}
      />
      <ProductGrid title="Top Selling Products" products={topSellingProducts} />
      <ProductGrid title="Featured Products" products={featuredProducts} />

      <Box sx={{ my: 4 }}>
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
      </Box>
    </Container>
  );
}
