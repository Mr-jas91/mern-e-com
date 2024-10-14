import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderProductCard = ({ order }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/myorder/${order.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: "cover" }}
        image={order.image}
        alt={order.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {order.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            ${order.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ordered on: {new Date(order.orderDate).toLocaleDateString()}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Chip
              label={order.status}
              color={
                order.status === "Delivered"
                  ? "success"
                  : order.status === "Shipped"
                  ? "primary"
                  : order.status === "Processing"
                  ? "warning"
                  : "default"
              }
              size="small"
            />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default OrderProductCard;
