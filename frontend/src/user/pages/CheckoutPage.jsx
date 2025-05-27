import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  Divider,
  Stack,
  Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../redux/reducers/orderReducer";
import Addressform from "../components/Checkout/Addressform";
import CheckoutProducts from "../components/Checkout/CheckoutProducts";
import showToast from "../components/toastMsg/showToast";
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.checkout);
  const { loading, success } = useSelector((state) => state.orders);
  const [selectedOption, setSelectedOption] = useState("COD");
  const [errors, setErrors] = useState({});

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    mobileNo: ""
  });

  useEffect(() => {
    if (!products || products.length === 0) {
      navigate("/home");
    }
  }, [products, navigate]);

  const subtotal = (products ?? []).reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const discount = (products ?? []).reduce(
    (sum, item) => sum + item.productId.discount * item.quantity,
    0
  );
  const finalPrice = subtotal - discount;

  const validateFields = () => {
    let newErrors = {};
    if (!/^\d{6}$/.test(shippingAddress.pincode))
      newErrors.pincode = "PIN code must be exactly 6 digits";
    if (!/^\d{10}$/.test(shippingAddress.mobileNo))
      newErrors.mobileNo = "Mobile number must be exactly 10 digits";
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state
    )
      newErrors.general = "All fields are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateFields()) return;

    const orderItems = products
      .map((item) => ({
        productId: item.productId?._id,
        quantity: item.quantity
      }))
      .filter((item) => item.productId); // Ensure only valid items are included

    dispatch(
      createOrder({
        orderItems,
        shippingAddress,
        orderPrice: finalPrice,
        paymentOption: selectedOption
      })
    );
  };
  useEffect(() => {
    if (success) {
      console.log(success);
      showToast("success", "Order placed successfully.");
      navigate("/home");
    }
  }, [success, navigate]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ my: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Items Summary</Typography>
            <List>
              {products.map((item) => (
                <CheckoutProducts key={item.productId._id} item={item} />
              ))}
            </List>
          </Paper>

          <Addressform
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            errors={errors}
            setErrors={setErrors}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>

            <Stack spacing={1.5}>
              {/* Justified row for each item */}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  ${subtotal}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" color="error">
                  Discount:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="error">
                  -${discount}
                </Typography>
              </Box>

              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${finalPrice}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
              onClick={handlePlaceOrder}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
