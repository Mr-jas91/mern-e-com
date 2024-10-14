import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const WishlistProductCard = ({ product }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      sx={{ display: "flex", mb: 2, cursor: "pointer" }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: "cover" }}
        image={product.image}
        alt={product.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through", mr: 1 }}
            >
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="error">
              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="error" sx={{ ml: 1 }}>
              ({product.discount}% off)
            </Typography>
          </Box>
          <Button variant="contained" color="primary" size="small">
            Order Now
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default WishlistProductCard;
