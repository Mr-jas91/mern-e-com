import React, { useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import OrderProductCard from "../components/OrderHistory/OrderProductCard";
import { getOrders } from "../../redux/reducers/orderReducer.js";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { myorders, loading } = useSelector((state) => state.orders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  // Use useEffect to fetch orders only once when component mounts
  useEffect(() => {
    if (!myorders || myorders.length === 0) {
      dispatch(getOrders(accessToken));
    }
  }, [dispatch, myorders, accessToken]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Order History
      </Typography>
      {myorders?.length > 0 ? (
        myorders.map((orders) =>
          orders?.orderItems?.map((item) => (
            <OrderProductCard
              key={item._id}
              order={item}
              orderDetails={[orders]}
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
