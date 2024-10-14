import React from "react";
import { Container, Typography, Box } from "@mui/material";
import WishlistProductCard from "../components/Wishlist/WishlistCard";

const WishlistPage = () => {
  // This would typically come from an API or state management
  const wishlistItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      discount: 20,
      image: "https://via.placeholder.com/400x400",
    },
    {
      id: 2,
      name: "Smartphone",
      price: 599.99,
      discount: 10,
      image: "https://via.placeholder.com/400x400",
    },
    {
      id: 3,
      name: "Laptop",
      price: 1299.99,
      discount: 15,
      image: "https://via.placeholder.com/400x400",
    },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        My Wishlist
      </Typography>
      {wishlistItems.length > 0 ? (
        wishlistItems.map((product) => (
          <WishlistProductCard key={product.id} product={product} />
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Your wishlist is empty.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default WishlistPage;
