import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  CircularProgress
} from "@mui/material";
import { MainContent } from "../utills/Style";
import SidebarContent from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  getAdminOrders,
  getAdminOrderDetails,
  updateDeliveryStatus
} from "../../redux/reducers/orderReducer";
import showToast from "../../shared/toastMsg/showToast";
import Loader from "../../shared/Loader/Loader";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [orderDetailsChange, setOrderDetailsChange] = useState({});

  const { adminOrders, adminOrderDetails, loading } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const handleOpen = async (orderId) => {
    await dispatch(getAdminOrderDetails(orderId));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOrderDetailsChange({});
  };

  const handleSave = async () => {
    try {
      const updates = Object.values(orderDetailsChange);
      for (let update of updates) {
        if (update.deliveryStatus || update.tracking) {
          await dispatch(updateDeliveryStatus(update));
        }
      }
      showToast("success", "Delivery status updated");
      handleClose();
      dispatch(getAdminOrders());
    } catch (error) {
      showToast("error", "Failed to update delivery status");
    }
  };

  const handleOrderDetailsChange = (e, productId) => {
    const { name, value } = e.target;
    setOrderDetailsChange((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        productId,
        [name]: value
      }
    }));
  };
  const isAllStatusFinal = adminOrderDetails?.orderItems.every((item) => {
    const currentStatus = item.deliveryStatus;
    return ["DELIVERED", "CANCELLED"].includes(currentStatus);
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent>
        <Toolbar />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", color: "black" }}
        >
          Orders
        </Typography>
        <Box p={2}>
          {loading ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "black" }}>Order ID</TableCell>
                  <TableCell sx={{ color: "black" }}>Customer Name</TableCell>
                  <TableCell sx={{ color: "black" }}>Order Value</TableCell>
                  <TableCell sx={{ color: "black" }}>Payment Method</TableCell>
                  <TableCell sx={{ color: "black" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell sx={{ color: "black" }}>{order._id}</TableCell>
                    <TableCell sx={{ color: "black" }}>
                      {order.shippingAddress.fullName}
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      ₹{order.orderPrice.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpen(order._id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        {adminOrderDetails && (
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: "black" }}>Order Details</DialogTitle>
            <DialogContent sx={{ color: "black" }}>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "black" }}>
                    Customer Info
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Order ID"
                    fullWidth
                    value={adminOrderDetails._id}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={adminOrderDetails.shippingAddress.fullName}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Mobile"
                    fullWidth
                    value={adminOrderDetails.shippingAddress.mobileNo}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    fullWidth
                    value={adminOrderDetails.shippingAddress.address}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pincode"
                    fullWidth
                    value={adminOrderDetails.shippingAddress.pincode}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Order Date"
                    fullWidth
                    value={new Date(
                      adminOrderDetails.createdAt
                    ).toLocaleDateString()}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Payment Method"
                    fullWidth
                    value={adminOrderDetails.paymentMethod}
                    disabled
                    sx={{ input: { color: "black" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: "black" }}>
                    Product Info
                  </Typography>
                </Grid>

                {adminOrderDetails.orderItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.productId?.images?.slice(0, 1).map((img, i) => (
                      <Grid item xs={2} key={i}>
                        <Avatar
                          variant="rounded"
                          src={img}
                          alt={`product-${i}`}
                          sx={{ width: 60, height: 60 }}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        value={item.productId?.name || ""}
                        label="Product Name"
                        disabled
                        sx={{ input: { color: "black" } }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        value={item.productId?.price || 0}
                        label="Price"
                        disabled
                        sx={{ input: { color: "black" } }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        value={
                          (item.productId?.price || 0) -
                          (item.productId?.discount || 0)
                        }
                        label="Discount Price"
                        disabled
                        sx={{ input: { color: "black" } }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        value={item.quantity}
                        label="Quantity"
                        disabled
                        sx={{ input: { color: "black" } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="tracking"
                        label="Tracking Link"
                        value={
                          orderDetailsChange[item._id]?.tracking ||
                          item.tracking ||
                          ""
                        }
                        onChange={(e) => handleOrderDetailsChange(e, item._id)}
                        disabled={!!item.tracking}
                        sx={{ input: { color: "black" } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="deliveryStatus"
                          value={
                            orderDetailsChange[item._id]?.deliveryStatus ||
                            item.deliveryStatus ||
                            ""
                          }
                          onChange={(e) =>
                            handleOrderDetailsChange(e, item._id)
                          }
                          sx={{ color: "black" }}
                          disabled={["DELIVERED", "CANCELLED"].includes(
                            item.deliveryStatus
                          )}
                        >
                          <MenuItem
                            value="PENDING"
                            disabled={[
                              "ACCEPTED",
                              "SHIPPED",
                              "DELIVERED",
                              "CANCELLED"
                            ].includes(item.deliveryStatus)}
                          >
                            PENDING
                          </MenuItem>

                          <MenuItem
                            value="ACCEPTED"
                            disabled={[
                              "SHIPPED",
                              "DELIVERED",
                              "CANCELLED"
                            ].includes(item.deliveryStatus)}
                          >
                            Accepted
                          </MenuItem>
                          <MenuItem
                            value="SHIPPED"
                            disabled={["DELIVERED", "CANCELLED"].includes(
                              item.deliveryStatus
                            )}
                          >
                            Shipped
                          </MenuItem>
                          <MenuItem
                            value="DELIVERED"
                            disabled={["DELIVERED", "CANCELLED"].includes(
                              item.deliveryStatus
                            )}
                          >
                            Delivered
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ color: "black" }}>
              <Button onClick={handleClose}>Close</Button>
              <Button
                variant="contained"
                disabled={loading || isAllStatusFinal}
                onClick={handleSave}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </MainContent>
    </Box>
  );
};

export default OrdersPage;
