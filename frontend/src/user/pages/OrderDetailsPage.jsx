import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetails,
  cancelOrder
} from "../../redux/reducers/orderReducer"; // Import cancelOrder action
import Loader from "../../shared/Loader/Loader";

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading } = useSelector((state) => state.orders);
  const { id } = useParams();
  const [isCancelling, setIsCancelling] = useState(false); // Track cancellation state

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (!orderDetails || !orderDetails.orderItems?.length)
    return <Typography>No order details available</Typography>;

  const orderItem = orderDetails.orderItems[0];
  const product = orderItem?.productId;
  const deliveryStatus = orderItem?.deliveryStatus;
  const deliverySteps = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];

  const getStepIndex = (status) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "SHIPPED":
        return 1;
      case "OUT FOR DELIVERY":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(deliveryStatus);

  const statusColors = {
    PENDING: "orange",
    SHIPPED: "blue",
    "OUT FOR DELIVERY": "purple",
    DELIVERED: "green"
  };

  const goToProductPage = () => {
    if (product?._id) {
      navigate(`/product/${product._id}`);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    setIsCancelling(true);
    await dispatch(cancelOrder(id));
    setIsCancelling(false);
    navigate(`/order/${id}/details`);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Order Details
      </Typography>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid
            container
            spacing={4}
            onClick={goToProductPage}
            sx={{ cursor: "pointer" }}
          >
            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
              {product?.images?.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h6" fontWeight="bold">
                Order ID: {orderItem?._id}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {product?.name || "Product Name Unavailable"}
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Typography
                  variant="h6"
                  sx={{
                    color: product?.discount ? "gray" : "primary.main",
                    textDecoration: product?.discount ? "line-through" : "none",
                    fontWeight: product?.discount ? "normal" : "bold"
                  }}
                >
                  ${product?.price ? product.price.toFixed(2) : "N/A"}
                </Typography>

                {product?.discount && (
                  <Typography
                    variant="h5"
                    sx={{ color: "green", fontWeight: "bold" }}
                  >
                    $
                    {product?.price && product?.discount
                      ? (product.price - product.discount).toFixed(2)
                      : "N/A"}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold">
                Order Status:
              </Typography>
              <Chip
                label={deliveryStatus}
                sx={{
                  mt: 1,
                  fontSize: "1rem",
                  p: 1,
                  color: "#fff",
                  backgroundColor: statusColors[deliveryStatus] || "gray"
                }}
                icon={<LocalShippingIcon />}
              />

              <Typography variant="subtitle1" fontWeight="bold" mt={3}>
                Delivery Progress:
              </Typography>
              <Stepper activeStep={currentStep} alternativeLabel sx={{ mt: 1 }}>
                {deliverySteps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={() => {
                        const IconComponent =
                          index === 0
                            ? ShoppingCartIcon
                            : index === 1
                            ? LocalShippingIcon
                            : index === 2
                            ? DeliveryDiningIcon
                            : CheckCircleIcon;

                        return (
                          <IconComponent
                            style={{
                              color:
                                index <= currentStep
                                  ? statusColors[deliveryStatus]
                                  : "gray",
                              fontSize: "2rem"
                            }}
                          />
                        );
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Cancel Order Button */}
              {deliveryStatus !== "DELIVERED" &&
                deliveryStatus !== "CANCELLED" && (
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    sx={{ mt: 3 }}
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 3, borderRadius: 2, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Shipping Address
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            {orderDetails?.shippingAddress?.fullName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {orderDetails?.shippingAddress?.address || "Address not available"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {orderDetails?.shippingAddress?.city},{" "}
            {orderDetails?.shippingAddress?.state},{" "}
            {orderDetails?.shippingAddress?.pincode}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Mobile: {orderDetails?.shippingAddress?.mobileNo}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" fontWeight="bold">
            Payment Details
          </Typography>
          <Box mt={1} display="flex" alignItems="center" gap={2}>
            <Chip
              label={orderDetails?.paymentMethod || "N/A"}
              color="info"
              icon={<PaymentIcon />}
            />
            <Chip
              label={orderDetails?.paymentStatus || "N/A"}
              color={
                orderDetails?.paymentStatus === "PAID" ? "success" : "warning"
              }
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetailsPage;
