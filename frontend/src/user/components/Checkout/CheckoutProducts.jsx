import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
  Divider
} from "@mui/material";

const CheckoutProducts = ({ item }) => {
  return (
    <React.Fragment key={item.productId._id}>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            src={item.productId.images[0]}
            alt={item.productId.name}
            variant="square"
          />
        </ListItemAvatar>
        <ListItemText
          primary={item.productId.name}
          secondary={`Quantity: ${item.quantity}`}
        />
        <Typography
          variant="body2"
          sx={{
            textDecoration: "line-through",
            mr: 2,
            color: "text.secondary"
          }}
        >
          ₹{(item.productId.price * item.quantity).toFixed(2)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "error.main", fontWeight: "bold" }}
        >
          ₹
          {(
            (item.productId.price - item.productId.discount) *
            item.quantity
          ).toFixed(2)}
        </Typography>
      </ListItem>
      <Divider />
    </React.Fragment>
  );
};

export default CheckoutProducts;
