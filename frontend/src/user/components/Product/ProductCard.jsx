import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Product Card Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = (event) => {
    event.stopPropagation();
  };

  

  return (
    <Card
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      onClick={()=>navigate(`/products/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1, cursor: "pointer" }}>
        <Typography gutterBottom variant="h6" component="div">
          {product?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product?.price.toFixed(2)}
        </Typography>
      </CardContent>
      <Button
        size="small"
        sx={{
          m: 1,
          bgcolor: "black",
          color: "white",
          "&:hover": {
            bgcolor: "#424242",
          },
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
