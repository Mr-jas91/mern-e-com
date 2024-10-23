import React, { useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
} from "../../../redux/reducers/cartReducer.js";
import { useDispatch, useSelector } from "react-redux";


// Product Card Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  
  const handleAddToCart = (event) => {
    event.stopPropagation();
    dispatch(addToCart({ productId: product._id, accessToken }));
  };

  

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Distribute sections evenly
        alignItems: "center",
        padding: "16px", // Add padding to avoid overflow
      }}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: "100%", // Full width of the card
          height: "200px", // Fixed height for image section
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <CardMedia
          component="img"
          image={product?.images[0]}
          alt={product?.name}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </Box>

      {/* Product Name Section */}
      <CardContent sx={{ textAlign: "center", padding: 0 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product?.name}
        </Typography>
      </CardContent>

      {/* Price Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: "16px",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          ${product?.price.toFixed(2)}
        </Typography>
      </Box>

      {/* Add to Cart Button Section */}
      <Button
        size="small"
        sx={{
          bgcolor: "black",
          color: "white",
          "&:hover": {
            bgcolor: "#424242",
          },
          width: "100%",
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
