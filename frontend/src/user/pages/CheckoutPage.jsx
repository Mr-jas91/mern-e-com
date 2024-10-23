import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../../redux/reducers/orderReducer";


export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { products } = useSelector((state) => state.checkout);
  const { loading, success } = useSelector((state) => state.orders);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    mobileNo: ""
  });

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const subtotal = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = products.reduce(
    (sum, item) => sum + item.discount * item.quantity,
    0
  );
  const finalPrice = subtotal - discount;

  const handlePlaceOrder = () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.landmark ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode ||
      !shippingAddress.mobileNo
    ) {
      toast.error("All field is required", {
        autoClose: 2000,
        position: "top-center"
      });
    } else {
      const orderItems = products.map((item) => ({
        productId: item._id,
        quantity: item.quantity
      }));
      // console.log("Order placed", { orderItems, shippingAddress, finalPrice });
      dispatch(
        createOrder({
          orderItems,
          shippingAddress,
          orderPrice: finalPrice,
          accessToken
        })
      );
      if (success) {
        toast.success("Order placed successfully.", {
          autoClose: 2000,
          position: "top-center"
        });
        navigate("/");
      }
    }
  };
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Checkout
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {products.map((item) => (
                <React.Fragment key={item?._id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        src={item?.images[0]}
                        alt={item?.name}
                        variant="square"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item?.name}
                      secondary={`Quantity: ${item?.quantity}`}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        mr: 2,
                        color: "text.secondary"
                      }}
                    >
                      ${(item?.price * item?.quantity).toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "error.main",
                        fontWeight: "bold"
                      }}
                    >
                      $
                      {(
                        item?.price * item?.quantity -
                        item?.discount * item?.quantity
                      ).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Landmark"
                  name="landmark"
                  value={shippingAddress.landmark}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="PIN CODE"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Mobile No."
                  name="mobileNo"
                  value={shippingAddress.mobileNo}
                  onChange={handleAddressChange}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Total
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Subtotal" />
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Discount" />
                <Typography variant="body2">-${discount.toFixed(2)}</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="h6">${finalPrice.toFixed(2)}</Typography>
              </ListItem>
            </List>

            {/* Payment Methods */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="ONLINE UPI"
                  control={<Radio />}
                  label="ONLINE UPI"
                />
                <FormControlLabel
                  value="DEBIT CARD"
                  control={<Radio />}
                  label="Debit Card"
                />
                <FormControlLabel
                  value="COD"
                  control={<Radio />}
                  label="Cash on Delivery (COD)"
                />
              </RadioGroup>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
