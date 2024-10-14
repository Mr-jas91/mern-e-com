import React from 'react';
import { Box, Typography } from '@mui/material';
import OrderItem from './OrderItem';

const OrderHistory = ({ orders }) => {
  return (
    <Box>
      <Typography variant="h4">Order History</Typography>
      {orders.length > 0 ? (
        orders.map(order => <OrderItem key={order.id} order={order} />)
      ) : (
        <Typography variant="body1">You have no previous orders</Typography>
      )}
    </Box>
  );
};

export default OrderHistory;