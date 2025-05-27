import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Stack,
  Box
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCart,
  removeFromCart
} from "../../../redux/reducers/cartReducer.js";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  // Extract product details
  const { name, price, discount } = item?.productId;
  const { _id } = item;

  // Handle quantity changes
  const handleQuantityChange = (action) => {
    if (action === "increase") {
      dispatch(updateCart({ _id, action }));
    } else if (action === "decrease" && item?.quantity > 1) {
      dispatch(updateCart({ _id, action }));
    }
  };

  // Remove item from cart
  const handleRemoveItem = () => {
    dispatch(removeFromCart(_id));
  };

  return (
    <ListItem sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
      {/* Product Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {name}
        </Typography>
        <Typography color="textSecondary">
          Price: <b>${(price * item?.quantity).toFixed(2)}</b> | Discount Price:{" "}
          <b>${((price - discount) * item?.quantity).toFixed(2)}</b>
        </Typography>
      </Box>

      {/* Quantity Controls */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => handleQuantityChange("decrease")}
          size="small"
          disabled={loading || item?.quantity <= 1}
        >
          <RemoveIcon />
        </IconButton>

        <Typography variant="body1" fontWeight="bold">
          {item?.quantity}
        </Typography>

        <IconButton
          onClick={() => handleQuantityChange("increase")}
          size="small"
          disabled={loading}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      {/* Delete Button */}
      <ListItemSecondaryAction>
        <IconButton
          onClick={handleRemoveItem}
          size="small"
          disabled={loading}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default CartItem;
