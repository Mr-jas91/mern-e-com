import React from "react";
import { Container, Typography, Box } from "@mui/material";
import OrderProductCard from "../components/Product/OrderProductCard";
const OrderHistoryPage = () => {
  // This would typically come from an API or state management
  const orders = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 99.99,
      image: "https://via.placeholder.com/100x100",
      orderDate: "2023-06-01",
      status: "Delivered",
    },
    {
      id: "2",
      name: "Smartphone",
      price: 599.99,
      image: "https://via.placeholder.com/100x100",
      orderDate: "2023-06-15",
      status: "Shipped",
    },
    {
      id: "3",
      name: "Laptop",
      price: 1299.99,
      image: "https://via.placeholder.com/100x100",
      orderDate: "2023-06-20",
      status: "Processing",
    },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Order History
      </Typography>
      {orders.length > 0 ? (
        orders.map((order) => <OrderProductCard key={order.id} order={order} />)
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
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
