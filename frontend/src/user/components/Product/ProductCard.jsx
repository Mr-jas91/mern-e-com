import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer.js";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (!user) {
      navigate("/user/signin");
    } else {
      dispatch(addToCart(product._id));
      setAdded(true);

      // Reset the "Added" state after 3 seconds
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.02)" },
      }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: "100%",
          height: 220,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={product?.images?.[0] || "/placeholder.jpg"}
          alt={product?.name || "Product Image"}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease-in-out",
            "&:hover": { opacity: 0.9 },
          }}
        />
      </Box>

      {/* Product Info */}
      <CardContent sx={{ textAlign: "center", paddingBottom: "8px" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product?.name || "Product Name"}
        </Typography>
      </CardContent>

      {/* Price Section */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textDecoration: "line-through" }}
        >
          ${product?.price?.toFixed(2) || "0.00"}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight={600}>
          ${(product?.price - (product?.discount || 0)).toFixed(2)}
        </Typography>
      </Box>

      {/* Add to Cart Button */}
      <Button
        variant="contained"
        sx={{
          width: "100%",
          bgcolor: added ? "#4caf50" : "black",
          color: "white",
          fontWeight: "bold",
          "&:hover": { bgcolor: added ? "#66bb6a" : "#424242" },
          transition: "background 0.3s ease-in-out",
        }}
        onClick={handleAddToCart}
      >
        {added ? "Added!" : "Add to Cart"}
      </Button>
    </Card>
  );
};

export default ProductCard;
