import React from "react";
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

const Cart = ({ item, setCartItems }) => {
  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  
  return (
    <ListItem>
      <ListItemText
        primary={item.name}
        secondary={`Price: $${item.price.toFixed(2)}`}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => updateQuantity(item.id, -1)} size="small">
          <RemoveIcon />
        </IconButton>
        <Typography component="span" sx={{ mx: 1 }}>
          {item.quantity}
        </Typography>
        <IconButton onClick={() => updateQuantity(item.id, 1)} size="small">
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => removeItem(item.id)}
          size="small"
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Cart;
