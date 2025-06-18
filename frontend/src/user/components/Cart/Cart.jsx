import React from "react";
import {
  ListItem,
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

  const { name, price, discount } = item?.productId;
  const { _id } = item;

  const handleQuantityChange = (action) => {
    if (action === "increase" || (action === "decrease" && item?.quantity > 1)) {
      dispatch(updateCart({ _id, action }));
    }
  };

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
        <Box display="flex" gap={1} alignItems="center">
          <Typography
            variant="body2"
            sx={{
              color: "error.main",
              textDecoration: "line-through"
            }}
          >
           ₹{(price * item?.quantity).toFixed(2)}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "green",
              fontWeight: "bold"
            }}
          >
           Final Price ₹{((price - discount) * item?.quantity).toFixed(2)}
          </Typography>
        </Box>
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
