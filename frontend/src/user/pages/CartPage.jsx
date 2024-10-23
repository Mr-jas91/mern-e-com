import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../redux/reducers/cartReducer";
import { ADD_TO_CHECKOUT } from "../../redux/reducers/checkoutReducer";
import { toast } from "react-toastify";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart(accessToken));
  }, [dispatch, accessToken]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }
  const handleAddToCheckout = () => {
    const itemsToCheckout = cartItems.map((item) => ({
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      discount: item.productId.discount,
      images: item.productId.images,
      quantity: item.quantity,
    }));
    dispatch(ADD_TO_CHECKOUT(itemsToCheckout));
    toast.success("Product added to checkout!", { autoClose: 3000 });
    navigate("/checkout");
  };

  return (
    <Container maxWidth="md">
      {cartItems.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", my: 4 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
            My Cart
          </Typography>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item?._id}>
                <Cart item={item} />
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
            <Typography variant="h6">Total: ${totalPrice}</Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAddToCheckout}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
