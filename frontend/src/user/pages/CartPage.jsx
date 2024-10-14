import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  Button,
  Box,
  Divider,
} from "@mui/material";
import Cart from "../components/Cart/Cart";
export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Product 1", price: 19.99, quantity: 2 },
    { id: 2, name: "Product 2", price: 29.99, quantity: 1 },
    { id: 3, name: "Product 3", price: 39.99, quantity: 3 },
  ]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        My Cart
      </Typography>
      <List>
        {cartItems.map((item) => (
          <React.Fragment key={item.id}>
            <Cart item={item} setCartItems={setCartItems} />
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </Button>
      </Box>
    </Container>
  );
}
