import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  updateCart,
  removeFromCart,
} from "../../../redux/reducers/cartReducer.js";
import { useSelector, useDispatch } from "react-redux";

const Cart = ({ item }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { updateLoading, deleteLoading } = useSelector((state) => state.cart);
  let { name, price } = item.productId;
  let { _id, quantity: initialQuantity } = item;

  // Local state for quantity to reflect immediate changes
  const [quantity, setQuantity] = useState(initialQuantity);

  // Update quantity and dispatch Redux action
  const updateQuantity = (productId, action) => {
    dispatch(updateCart({ productId, action, accessToken }));
  };

  // Remove item from cart
  const removeItem = (productId) => {
    dispatch(removeFromCart({ productId, accessToken }));
  };

  // Handle quantity changes locally and in the store
  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
      updateQuantity(_id, "increase");
    } else if (action === "decrease" && quantity > 0) {
      setQuantity((prev) => prev - 1);
      updateQuantity(_id, "decrease");
    }
  };

  return (
    <ListItem>
      <ListItemText
        primary={
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            {name}
          </Typography>
        }
        secondary={
          <Typography sx={{ fontWeight: "bold" }}>
            Price: ${price} | Total: ${price * quantity}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            handleQuantityChange("decrease");
          }}
          size="small"
          disabled={updateLoading || quantity === 0}
        >
          <RemoveIcon />
        </IconButton>
        <Typography component="span" sx={{ mx: 1, fontWeight: "bold" }}>
          {quantity}
        </Typography>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            handleQuantityChange("increase");
          }}
          size="small"
          disabled={updateLoading}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            removeItem(_id);
          }}
          size="small"
          disabled={deleteLoading}
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Cart;
