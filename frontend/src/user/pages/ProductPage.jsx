import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  TextField,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { ShoppingCart, LocalShipping } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../../redux/reducers/productReducer.js";
import {
  addToCart,
  resetCartNotification,
} from "../../redux/reducers/cartReducer.js";
import { ADD_TO_CHECKOUT } from "../../redux/reducers/checkoutReducer.js";
import { toast } from "react-toastify";

const ProductLandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [pincode, setPincode] = useState("");
  const { id } = useParams();
  const { products, selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const { accessToken } = useSelector((state) => state.auth);
  const { addCartSuccess, addCartError } = useSelector((state) => state.cart);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products?.length > 0) {
      const foundProduct = products.find((product) => product?._id === id);
      setProduct(foundProduct);
    } else {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // Handle toast notifications for cart actions
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
  }, [addCartSuccess, addCartError]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !product) {
    return <h1>Product not found</h1>;
  }

  const productImages =
    product?.images?.length > 0
      ? product.images
      : [
          "https://via.placeholder.com/400x400",
          "https://via.placeholder.com/400x400",
          "https://via.placeholder.com/400x400",
        ];

  const reviews = [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "These headphones are amazing! The sound quality is top-notch.",
      image: "https://via.placeholder.com/100x100",
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      comment: "Great product, but the battery life could be better.",
      image: "https://via.placeholder.com/100x100",
    },
  ];

  const finalPrice = product?.price * (1 - product.discount / 100);

  const handlePincodeCheck = () => {
    setTimeout(() => {
      const date = new Date();
      date.setDate(date.getDate() + 3); // Delivery in 3 days
      setDeliveryDate(date.toDateString());
    }, 1000);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: id, accessToken }));
  };

  const handleAddToCheckout = () => {
    dispatch(ADD_TO_CHECKOUT([{ ...product, quantity: 1 }]));
    toast.success("Product added to checkout!", { autoClose: 3000 });
    navigate("/checkout");
  };
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={productImages[0]}
              alt={product?.name}
              sx={{ borderBottom: "1px solid #ccc" }}
            />
            <CardContent sx={{ borderTop: "1px solid #ccc" }}>
              <Grid container spacing={2}>
                {productImages.map((image, index) => (
                  <Grid item key={index} xs={4}>
                    <img
                      src={image}
                      alt={`${product?.name} ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Category: {product?.category}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating value={product?.rating?.rate} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product?.rating?.rate})
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {product?.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ textDecoration: "line-through", mr: 2 }}
            >
              ${product?.price.toFixed(2)}
            </Typography>
            <Typography variant="h5" color="error">
              ${finalPrice.toFixed(2)}
            </Typography>
            <Chip
              label={`${product?.discount}% OFF`}
              color="error"
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddToCheckout}
            >
              Order Now
            </Button>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Check Delivery Date
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label="Enter Pincode"
                variant="outlined"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <Button variant="outlined" onClick={handlePincodeCheck}>
                Check
              </Button>
            </Box>
            {deliveryDate && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <LocalShipping sx={{ mr: 1, verticalAlign: "middle" }} />
                Estimated delivery by {deliveryDate}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        <List>
          {reviews?.map((review) => (
            <React.Fragment key={review.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={review.user} src={review.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{ mr: 1 }}
                      >
                        {review.user}
                      </Typography>
                      <Rating value={review.rating} size="small" readOnly />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {review.comment}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ProductLandingPage;
