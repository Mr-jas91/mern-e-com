import React from "react";
import {
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Stack,
  Box,
  Avatar
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
import { useNavigate } from "react-router-dom";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.cart);

  // Destructuring for cleaner code
  const { name, price, discount, images, _id: productId } = item?.productId || {};
  const { _id: cartItemId, quantity } = item;

  const handleQuantityChange = (e, action) => {
    e.stopPropagation(); // Prevents navigation to product page
    if (
      action === "increase" ||
      (action === "decrease" && quantity > 1)
    ) {
      dispatch(updateCart({ _id: cartItemId, action }));
    }
  };

  const handleRemoveItem = (e) => {
    e.stopPropagation(); // Prevents navigation to product page
    dispatch(removeFromCart(cartItemId));
  };

  return (
    <ListItem
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2, 
        py: 2, 
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" } 
      }}
      onClick={() => navigate(`/product/${productId}`)}
    >
      {/* Product Image */}
      <Avatar
        src={images?.[0]}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      {/* Product Info */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          {discount > 0 && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "line-through"
              }}
            >
              ₹{(price * quantity).toFixed(2)}
            </Typography>
          )}
          <Typography
            variant="body1"
            sx={{
              color: "success.main",
              fontWeight: "bold"
            }}
          >
            ₹{((price - discount) * quantity).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Quantity Controls */}
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={1} 
        sx={{ mr: 4 }} // Space for the Delete icon
      >
        <IconButton
          onClick={(e) => handleQuantityChange(e, "decrease")}
          size="small"
          disabled={loading || quantity <= 1}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography variant="body1" fontWeight="bold">
          {quantity}
        </Typography>
        <IconButton
          onClick={(e) => handleQuantityChange(e, "increase")}
          size="small"
          disabled={loading}
        >
          <AddIcon fontSize="small" />
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