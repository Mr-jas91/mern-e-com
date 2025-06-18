import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@mui/material";
import { ShoppingCart, LocalShipping, CheckCircle } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../../redux/reducers/productReducer.js";
import { addToCart } from "../../redux/reducers/cartReducer.js";
import { ADD_TO_CHECKOUT } from "../../redux/reducers/checkoutReducer.js";
import Loader from "../../shared/Loader/Loader.jsx";

const ProductLandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState("");
  const [added, setAdded] = useState(false);

  const {
    singleProduct: product,
    loading,
    error
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (loading) return <Loader />;
  if (error || !product)
    return (
      <Typography variant="h5" color="error">
        Product not found
      </Typography>
    );

  const handleAddToCart = () => {
    dispatch(addToCart(id));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    dispatch(ADD_TO_CHECKOUT([{ productId: product, quantity: 1 }]));
    navigate("/checkout");
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ my: 4 }}>
        {/* Product Image Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
            <img
              src={selectedImage}
              alt={product?.name}
              style={{
                width: "100%",
                maxHeight: "450px",
                objectFit: "contain",
                borderRadius: "8px"
              }}
            />
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              {product?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    margin: "5px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: selectedImage === image ? "2px solid black" : "none"
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Product Info Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold">
            {product?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Category: {product?.category.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {product?.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ textDecoration: "line-through", mr: 2 }}
            >
              ₹{product?.price.toFixed(2)}
            </Typography>
            <Typography variant="h5" color="error">
            ₹{(product.price - product.discount).toFixed(2)}
            </Typography>
            <Chip
              label={`${product?.discount.toFixed(2)}% OFF`}
              color="error"
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={added ? <CheckCircle /> : <ShoppingCart />}
              sx={{
                backgroundColor: added ? "#4caf50" : "black",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: added ? "#66bb6a" : "#424242" },
                transition: "background 0.3s ease-in-out"
              }}
              onClick={handleAddToCart}
            >
              {added ? "Added!" : "Add to Cart"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBuyNow}
            >
              Order Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductLandingPage;
