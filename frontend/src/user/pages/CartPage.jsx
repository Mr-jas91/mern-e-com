import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  Button,
  Box,
  Divider,
  Grid,
  Paper
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../components/Cart/Cart";
import { getCart } from "../../redux/reducers/cartReducer";
import { ADD_TO_CHECKOUT } from "../../redux/reducers/checkoutReducer";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  // Fetch cart details when the page loads (on refresh)
  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  // Handle checkout process
  const handleCheckout = () => {
    if (user) {
      dispatch(ADD_TO_CHECKOUT(cartItems?.items));
      navigate("/checkout");
    } else {
      navigate("/user/signin");
    }
  };

  // Show empty cart message
  if (!cartItems?.items?.length) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Your cart is empty.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Shopping Cart
      </Typography>

      {/* Cart Items List */}
      <List>
        {cartItems?.items?.map((item) => (
          <React.Fragment key={item._id}>
            <Cart item={item} />
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Price Summary & Checkout */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Price Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Total Price:</Typography>
              <Typography
                variant="body1"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                ₹{(cartItems?.totalPrice ?? 0).toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body1">Discount:</Typography>
              <Typography variant="body1" color="error">
                - ₹{(cartItems?.discount ?? 0).toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">
                Final Price:
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ₹{(cartItems?.finalPrice ?? 0).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Checkout Button */}
        <Grid item xs={12} md={6} display="flex" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
