import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import OrderProductCard from "../components/Order/OrderProductCard";
import { getMyOrders } from "../../redux/reducers/orderReducer";
import Loader from "../../shared/Loader/Loader"

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);
  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Order History
      </Typography>
      {Array.isArray(myOrders) && myOrders.length > 0 ? (
        myOrders.map(
          (order) =>
            Array.isArray(order?.orderItems) &&
            order?.orderItems.map((item) => (
              <OrderProductCard
                key={item?._id} // Ensuring key is always unique
                orderDate={order?.createdAt}
                orderDetails={item}
                orderId={order._id}
              />
            ))
        )
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh"
          }}
        >
          <Typography variant="h6" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
