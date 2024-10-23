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
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../redux/reducers/orderReducer";

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.orders);
  const { accessToken } = useSelector((state) => state.auth);
  const [productList, setProductList] = useState({});
  const { productid } = useParams();

  useEffect(() => {
    if (orderDetails?.length > 0) {
      setProductList(
        orderDetails[0]?.orderItems.find(
          (order) => order?.productId?._id === productid
        )
      );
    } else {
      dispatch(getOrderDetails(accessToken));
    }
  }, [orderDetails, dispatch, accessToken, productid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!productList || !orderDetails?.length) {
    return <div>No order details available</div>;
  }

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

  const currentStep = getStepIndex(productList?.deliveryStatus);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Typography
          variant="h4"
          className="font-bold text-center text-black mb-6"
        >
          Order Details
        </Typography>

        <Card className="shadow-lg">
          <CardContent>
            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                sm={4}
                className="flex justify-center items-center"
              >
                <img
                  src={productList?.productId?.images[0]}
                  alt={productList?.productId?.name}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <Typography variant="h6" className="font-semibold">
                  {productList?.productId?.name}
                </Typography>
                <Typography
                  variant="h6"
                  className="text-black text-xl font-bold mt-2"
                >
                  {`₹${productList?.productId?.price}`}
                </Typography>

                <Divider className="my-4" />

                <div className="mb-4">
                  <Typography variant="body1" className="font-semibold mb-1">
                    Order Status
                  </Typography>
                  <Chip
                    label={productList?.deliveryStatus}
                    color={
                      productList?.deliveryStatus === "DELIVERED"
                        ? "success"
                        : "primary"
                    }
                    icon={<LocalShippingIcon />}
                  />
                </div>

                <div className="mb-4">
                  <Typography variant="body1" className="font-semibold mb-1">
                    Delivery Progress
                  </Typography>
                  <Stepper activeStep={currentStep} alternativeLabel>
                    {deliverySteps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel
                          icon={
                            index === 0 ? (
                              <ShoppingCartIcon />
                            ) : index === 1 ? (
                              <LocalShippingIcon />
                            ) : index === 2 ? (
                              <DeliveryDiningIcon />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>

                <div className="mb-4">
                  <Typography variant="body1" className="font-semibold mb-1">
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {`Address: ${orderDetails[0]?.shippingAddress?.address}, City: ${orderDetails[0]?.shippingAddress?.city},
                    Pincode: ${orderDetails[0]?.shippingAddress?.pincode}, State: ${orderDetails[0]?.shippingAddress?.state}, Mobile: ${orderDetails[0]?.shippingAddress?.mobileNo}`}
                  </Typography>
                </div>

                <div>
                  <Typography variant="body1" className="font-semibold mb-1">
                    Payment Method
                  </Typography>
                  <Chip
                    label={orderDetails[0]?.paymentMethod}
                    color="info"
                    icon={<PaymentIcon />}
                    className="mr-2"
                  />
                  <Chip
                    label={orderDetails[0]?.paymentStatus}
                    color={
                      orderDetails[0]?.paymentStatus === "PAID"
                        ? "success"
                        : "warning"
                    }
                  />
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
