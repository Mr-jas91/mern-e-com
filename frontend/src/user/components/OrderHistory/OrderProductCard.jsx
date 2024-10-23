import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrderDetails,getOrderDetails } from "../../../redux/reducers/orderReducer.js";
const OrderProductCard = ({ order, orderDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const handleClick = () => {
    // console.log(orderDetails);
    dispatch(setOrderDetails(orderDetails));
    // dispatch(getOrderDetails(accessToken));
     navigate(`/myorder/${order?._id}/${order?.productId?._id}`);
  };
  // console.log(orderDetails[0]);
  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        cursor: "pointer",
        borderRadius: 2,
        boxShadow: 2,
        "&:hover": {
          boxShadow: 6,
          transform: "scale(1.02)",
          transition: "transform 0.2s"
        }
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        sx={{
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: "4px 0 0 4px"
        }}
        image={order?.productId?.images[0]}
        alt={order?.productId?.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2 }}>
        <CardContent sx={{ flex: "1 0 auto", padding: 0 }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: "bold" }}>
            {order?.productId?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            ${order?.productId?.price?.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ordered on: {new Date(orderDetails.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto" // Push this to the bottom
          }}
        >
          <Chip
            label={order?.deliveryStatus}
            color={
              order.deliveryStatus === "DELIVERED"
                ? "success"
                : order.deliveryStatus === "SHIPPED"
                ? "primary"
                : order.deliveryStatus === "PENDING"
                ? "warning"
                : "default"
            }
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Card>
  );
};

export default OrderProductCard;
