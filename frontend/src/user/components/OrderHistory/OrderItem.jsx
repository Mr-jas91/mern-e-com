import React from 'react';
import { Box, Typography } from '@mui/material';

const OrderItem = ({ order }) => {
  return (
    <Box borderBottom={1} borderColor="grey.300" py={2}>
      <Typography variant="h6">Order #{order.id}</Typography>
      <Typography variant="body2">Date: {order.date}</Typography>
      <Typography variant="body2">Total: ${order.total}</Typography>
      <Typography variant="body2">Status: {order.status}</Typography>
    </Box>
  );
};

export default OrderItem;