import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isAdded, setIsAdded] = useState(false);

  // Helper: Format Currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculations
  const originalPrice = product?.price || 0;
  const discount = product?.discount || 0;
  const finalPrice = originalPrice - discount;
  const discountPercentage = Math.round((discount / originalPrice) * 100);

  const handleAddToCart = (event) => {
    event.stopPropagation(); // Stop card click event
    if (!user) {
      navigate("/user/signin");
      return;
    }

    // Dispatch action
    // NOTE: Passing object { productId } as standard convention
    dispatch(addToCart(product._id));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 20px rgba(0,0,0,0.1)"
        },
        cursor: "pointer"
      }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <Chip
          label={`${discountPercentage}% OFF`}
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            fontWeight: "bold",
            zIndex: 1
          }}
        />
      )}

      {/* Image Section */}
      <Box
        sx={{
          width: "100%",
          height: 240,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fff",
          p: 2
        }}
      >
        <CardMedia
          component="img"
          image={product?.images?.[0] || "https://via.placeholder.com/300"}
          alt={product?.name}
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain", // Keeps the whole product visible
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.05)" }
          }}
        />
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          title={product?.name}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Limit to 2 lines
            WebkitBoxOrient: "vertical",
            lineHeight: 1.2,
            mb: 1,
            height: "2.4em" // Fixed height for alignment
          }}
        >
          {product?.name}
        </Typography>

        {/* Pricing */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" color="primary" fontWeight={700}>
            {formatPrice(finalPrice)}
          </Typography>
          {discount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {formatPrice(originalPrice)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Action Button */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={!isAdded && <ShoppingCartIcon />}
          sx={{
            bgcolor: isAdded ? "#2e7d32" : "#1976d2",
            color: "white",
            py: 1.2,
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              bgcolor: isAdded ? "#1b5e20" : "#115293"
            },
            "&.Mui-disabled": {
              bgcolor: "#e0e0e0",
              color: "#9e9e9e"
            }
          }}
          onClick={handleAddToCart}
        >
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
