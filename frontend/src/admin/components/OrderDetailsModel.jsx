// components/OrderDetailsModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Divider,
  Button
} from "@mui/material";
import { StatusChip } from "./StatusChip";

const OrderDetailsModal = ({
  open,
  onClose,
  orderDetails,
  orderDetailsChange,
  onChange,
  onSave,
  loading
}) => {
  if (!orderDetails) return null;

  const isAllStatusFinal = orderDetails?.orderItems?.every((item) =>
    ["DELIVERED", "CANCELLED"].includes(item.status)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>Update Processing Parameters</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} mt={0.5}>
          {/* Section: Customer Profile */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ textTransform: "uppercase" }}>
              Customer Shipping Profile
            </Typography>
            <Divider sx={{ mt: 0.5 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Order ID" fullWidth value={orderDetails._id} disabled size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Order Placement Date" fullWidth value={orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : ""} disabled size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Customer Name" 
              fullWidth 
              value={orderDetails?.customer ? `${orderDetails.customer.firstName} ${orderDetails.customer.lastName || ""}`.trim() : orderDetails?.shippingAddress?.fullName || ""} 
              disabled 
              size="small" 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Mobile Contact" fullWidth value={orderDetails?.shippingAddress?.phone || orderDetails?.shippingAddress?.mobileNo || ""} disabled size="small" />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField label="Full Delivery Destination" fullWidth value={orderDetails?.shippingAddress?.address || ""} disabled size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Postal Zip Pincode" fullWidth value={orderDetails?.shippingAddress?.pincode || ""} disabled size="small" />
          </Grid>

          {/* Section: Product Matrix */}
          <Grid item xs={12} mt={1}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ textTransform: "uppercase" }}>
              Consolidated Product Items Line
            </Typography>
            <Divider sx={{ mt: 0.5 }} />
          </Grid>

          {orderDetails?.orderItems?.map((item, index) => (
            <React.Fragment key={item._id || index}>
              <Grid item xs={12}>
                <Box display="flex" gap={2} alignItems="center" p={2} sx={{ backgroundColor: "#fcfcfc", border: "1px solid #f0f0f0", borderRadius: "8px" }}>
                  <Avatar variant="rounded" src={item?.image || ""} sx={{ width: 64, height: 64, border: "1px solid #e0e0e0" }} />
                  <Box flexGrow={1}>
                    <Typography variant="body1" fontWeight="bold">{item?.name || "Product Record Missing"}</Typography>
                    <Typography variant="body2" color="textSecondary">Price: ₹{item?.price} | Qty: {item?.quantity}</Typography>
                  </Box>
                  <Box><StatusChip status={item.status} /></Box>
                </Box>
              </Grid>

              {/* Dynamic Action Inputs */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="tracking"
                  label="Live Courier Tracking URL/Link"
                  size="small"
                  value={orderDetailsChange[item._id]?.tracking !== undefined ? orderDetailsChange[item._id]?.tracking : item.tracking || ""}
                  onChange={(e) => onChange(e, item._id)}
                  disabled={!!item.tracking || ["DELIVERED", "CANCELLED"].includes(item.status)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Item Tracking Delivery Status</InputLabel>
                  <Select
                    name="deliveryStatus"
                    label="Item Tracking Delivery Status"
                    value={orderDetailsChange[item._id]?.status || item.status || "PENDING"}
                    onChange={(e) => onChange(e, item._id)}
                    disabled={["DELIVERED", "CANCELLED"].includes(item.status)}
                  >
                    <MenuItem value="PENDING" disabled={["ACCEPTED", "SHIPPED", "DELIVERED"].includes(item.status)}>PENDING</MenuItem>
                    <MenuItem value="ACCEPTED" disabled={["SHIPPED", "DELIVERED", "CANCELLED"].includes(item.status)}>ACCEPTED</MenuItem>
                    <MenuItem value="SHIPPED" disabled={["DELIVERED", "CANCELLED"].includes(item.status)}>SHIPPED</MenuItem>
                    <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
        <Button variant="contained" disabled={loading || isAllStatusFinal} onClick={onSave} sx={{ textTransform: "none" }}>
          Save Manifest Updates
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;