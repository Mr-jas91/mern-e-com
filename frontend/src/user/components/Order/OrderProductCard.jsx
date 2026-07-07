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
import { useDispatch } from "react-redux";
import { getOrderDetails } from "../../../redux/reducers/orderReducer.js";
const OrderProductCard = ({ orderDate, orderDetails, orderId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    dispatch(getOrderDetails({ orderId, itemId: orderDetails?._id }));
    navigate(`/orderdetails/${orderId}/${orderDetails?._id}`);
  };
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
        image={orderDetails?.image}
        alt={orderDetails?.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2 }}>
        <CardContent sx={{ flex: "1 0 auto", padding: 0 }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: "bold" }}>
            {orderDetails?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{
              textDecoration: orderDetails?.discount > 0 ? "line-through" : "none",
              fontSize: "1rem"
            }}
          >
            ${orderDetails?.price.toFixed(2)}
          </Typography>
          {orderDetails?.discount > 0 && (
            <Typography
              variant="h6"
              sx={{
                color: "green",
                fontWeight: "bold",
                fontSize: "1.2rem"
              }}
            >
              ${(orderDetails?.price - orderDetails.discount).toFixed(2)}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ordered on: {new Date(orderDate).toLocaleDateString()}
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
            label={orderDetails?.status}
            color={
              orderDetails.status === "DELIVERED"
                ? "success"
                : orderDetails.status === "SHIPPED"
                  ? "primary"
                  : orderDetails.status === "PENDING"
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
