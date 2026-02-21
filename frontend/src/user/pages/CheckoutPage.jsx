import React, { useState, useEffect, useMemo } from "react";
import {
  Container, Typography, Grid, Paper, Button, List, Divider,
  Stack, Box, Radio, FormControlLabel, TextField, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  Checkbox
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux Actions
import { createOrder } from "../../redux/reducers/orderReducer";
import { getAddresses, addAddress } from "../../redux/reducers/authReducer";

// Components & Shared
import CheckoutProducts from "../components/Checkout/CheckoutProducts";
import showToast from "../../shared/toastMsg/showToast";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { selectedItems: products } = useSelector((state) => state.checkout);
  const { loading: orderLoading } = useSelector((state) => state.orders);
  const { address: savedAddresses, loading: addressLoading } = useSelector((state) => state.auth);

  // UI State
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    phone: "",
    isDefault: false
  });

  // 1. Fetch Addresses on Mount
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  // 2. Set Initial Selected Address (FIXES INFINITE LOOP)
  useEffect(() => {
    if (savedAddresses?.length > 0 && !selectedAddress) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [savedAddresses, selectedAddress]);

  // 3. Redirect if cart is empty
  useEffect(() => {
    if (!products || products.length === 0) {
      navigate("/home");
    }
  }, [products, navigate]);

  // 4. Calculations Memo
  const totals = useMemo(() => {
    const subtotal = products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    const itemDiscount = products.reduce((sum, item) => sum + (item.productId.discount || 0) * item.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over 1000
    const finalPrice = subtotal - itemDiscount - couponDiscount + shipping;
    
    return { subtotal, itemDiscount, shipping, finalPrice };
  }, [products, couponDiscount]);

  // 5. Handlers
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE100") {
      setCouponDiscount(100);
      showToast("success", "Coupon Applied!");
    } else {
      showToast("error", "Invalid Coupon");
    }
  };

  const handleSaveAddress = async () => {
    const result = await dispatch(addAddress(newAddress));
    if (addAddress.fulfilled.match(result)) {
      setOpenDialog(false);
      showToast("success", "Address added successfully");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return showToast("error", "Please select a delivery address");

    const orderData = {
      orderItems: products.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      addressId: selectedAddress._id,
      orderPrice: totals.finalPrice,
      paymentOption
    };

    const response = await dispatch(createOrder(orderData));

    if (createOrder.fulfilled.match(response)) {
      if (paymentOption === "ONLINE" && response.payload.paymentUrl) {
        // Redirect to Stripe/Razorpay/Paypal Link
        window.location.href = response.payload.paymentUrl;
      } else {
        showToast("success", "Order Placed Successfully!");
        navigate("/orders"); // or home
      }
    } else {
      showToast("error", response.payload?.message || "Order Failed");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        
        {/* LEFT SIDE: Address & Items */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="bold" mb={3}>Checkout</Typography>
          
          {/* Address Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Delivery Address</Typography>
              {savedAddresses?.length > 0 && (
                <Button size="small" onClick={() => setShowAllAddresses(!showAllAddresses)}>
                  {showAllAddresses ? "Close" : "Change Address"}
                </Button>
              )}
            </Box>

            {addressLoading ? <Skeleton variant="rectangular" height={60} /> : (
              !savedAddresses || savedAddresses.length === 0 ? (
                <Button variant="outlined" fullWidth onClick={() => setOpenDialog(true)}>
                  + Add New Address to Continue
                </Button>
              ) : (
                <Box>
                  {!showAllAddresses ? (
                    <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                      <Typography fontWeight="bold">{selectedAddress?.city}</Typography>
                      <Typography variant="body2">{selectedAddress?.address}, {selectedAddress?.state}</Typography>
                      <Typography variant="body2">Phone: {selectedAddress?.phone}</Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {savedAddresses.map((addr) => (
                        <Paper 
                          key={addr._id} 
                          variant="outlined" 
                          sx={{ p: 2, cursor: "pointer", borderColor: selectedAddress?._id === addr._id ? "primary.main" : "#e0e0e0" }}
                          onClick={() => { setSelectedAddress(addr); setShowAllAddresses(false); }}
                        >
                          <Typography fontWeight="bold">{addr.address}</Typography>
                          <Typography variant="body2">{addr.city}, {addr.state} - {addr.pincode}</Typography>
                        </Paper>
                      ))}
                      <Button onClick={() => setOpenDialog(true)}>+ Add Another Address</Button>
                    </Stack>
                  )
                )}
              </Box>
            )}
          </Paper>

          {/* Items Summary */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
            <Typography variant="h6" mb={2}>Review Items</Typography>
            <List disablePadding>
              {products.map((item) => (
                <CheckoutProducts key={item.productId._id} item={item} />
              ))}
            </List>
          </Paper>
        </Grid>

        {/* RIGHT SIDE: Summary & Payment */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: "sticky", top: 20 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
            
            <Stack spacing={2} sx={{ my: 3 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Total Items Cost</Typography>
                <Typography>₹{totals.subtotal}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Discount</Typography>
                <Typography color="error">-₹{totals.itemDiscount}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Shipping Charge</Typography>
                <Typography color={totals.shipping === 0 ? "success.main" : "text.primary"}>
                  {totals.shipping === 0 ? "FREE" : `₹${totals.shipping}`}
                </Typography>
              </Box>
              {couponDiscount > 0 && (
                <Box display="flex" justifyContent="space-between">
                  <Typography color="primary">Coupon Applied</Typography>
                  <Typography color="primary">-₹{couponDiscount}</Typography>
                </Box>
              )}
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">Total to Pay</Typography>
                <Typography variant="h6" fontWeight="bold">₹{totals.finalPrice}</Typography>
              </Box>
            </Stack>

            {/* Coupon Code Input */}
            <Box display="flex" gap={1} mb={3}>
              <TextField 
                size="small" 
                fullWidth 
                placeholder="Promo Code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outlined" onClick={handleApplyCoupon}>Apply</Button>
            </Box>

            <Typography variant="subtitle2" mb={1}>Payment Method</Typography>
            <Stack direction="row" spacing={2} mb={3}>
              <Button 
                fullWidth 
                variant={paymentOption === "COD" ? "contained" : "outlined"}
                onClick={() => setPaymentOption("COD")}
              >COD</Button>
              <Button 
                fullWidth 
                variant={paymentOption === "ONLINE" ? "contained" : "outlined"}
                onClick={() => setPaymentOption("ONLINE")}
              >Online</Button>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              disabled={orderLoading || !selectedAddress}
              onClick={handlePlaceOrder}
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              {orderLoading ? "Processing..." : `Place Order (₹${totals.finalPrice})`}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* ADD ADDRESS DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Shipping Address</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField 
              label="Street Address" 
              fullWidth 
              onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} 
            />
            <Box display="flex" gap={2}>
              <TextField 
                label="City" 
                fullWidth 
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} 
              />
              <TextField 
                select 
                label="State" 
                fullWidth 
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
              >
                {INDIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
            <Box display="flex" gap={2}>
              <TextField 
                label="Pincode" 
                fullWidth 
                onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} 
              />
              <TextField label="Country" fullWidth value="India" disabled />
            </Box>
            <TextField 
              label="Phone Number" 
              fullWidth 
              onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} 
            />
            <FormControlLabel
              control={<Checkbox onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})} />}
              label="Set as default address"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress}>Save & Use</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}