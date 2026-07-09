// pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Card, Tooltip, IconButton, CircularProgress } from "@mui/material";
import { Print, Visibility } from "@mui/icons-material";
import SidebarContent from "../components/Sidebar";
import { StatusChip } from "../components/StatusChip";
import OrderDetailsModal from "../components/OrderDetailsModel";
import { printOrderInvoice } from "../components/PrintInvoice";
import { useSelector, useDispatch } from "react-redux";
import { getAdminOrders, getAdminOrderDetails, updateDeliveryStatus } from "../../redux/reducers/orderReducer";
import showToast from "../../shared/toastMsg/showToast";

const drawerWidth = 240;

const OrdersPage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orderDetailsChange, setOrderDetailsChange] = useState({});

  const { adminOrders, adminOrderDetails, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);
  
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const getSafeId = (idObj) => (idObj && typeof idObj === "object" && idObj.$oid ? idObj.$oid : idObj?.toString());

  const handleOpenDetailsModal = async (orderId) => {
    if (!orderId) return;
    await dispatch(getAdminOrderDetails(orderId));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOrderDetailsChange({});
  };

  const handleOrderDetailsChange = (e, itemId) => {
    const { name, value } = e.target;
    setOrderDetailsChange((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], itemId, [name]: value }
    }));
  };

  const handleSave = async () => {
    try {
      const updates = Object.values(orderDetailsChange);
      for (let update of updates) {
        if (update.deliveryStatus || update.tracking) {
          await dispatch(updateDeliveryStatus({
            orderId: adminOrderDetails._id,
            itemId: update.itemId,
            deliveryStatus: update.deliveryStatus,
            tracking: update.tracking
          })).unwrap();
        }
      }
      showToast("success", "Delivery status updated successfully");
      handleClose();
      dispatch(getAdminOrders());
    } catch (error) {
      showToast("error", error || "Failed to update delivery status");
    }
  };

  // Triggers our clean externalized invoice design helper
  const handleTriggerPrint = (orderId) => {
    const targetOrder = adminOrders?.find((o) => getSafeId(o._id) === orderId);
    printOrderInvoice(targetOrder, orderId); // 🚀 Direct Utility Execution Call
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", width: "100%" }}>
      <CssBaseline />
      <SidebarContent mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, minWidth: 0, boxSizing: "border-box" }}>
        <Toolbar sx={{ display: { xs: "block", sm: "none" } }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, mt: { xs: 1, sm: 4 } }}>Order Manifest Adjustments</Typography>

        <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}>
          <Box p={2}>
            {loading && adminOrders.length === 0 ? (
              <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#fcfcfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "600" }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Order Date</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Customer Name</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Order Value</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "600", pr: 4 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminOrders?.map((order) => {
                      const safeOrderId = getSafeId(order._id);
                      return (
                        <TableRow key={safeOrderId} hover>
                          <TableCell sx={{ fontWeight: "500" }}>{safeOrderId}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell>{`${order.customer?.firstName} ${order?.customer?.lastName}` || "Guest User"}</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>₹{(order?.orderValue || 0).toLocaleString("en-IN")}</TableCell>
                          <TableCell><StatusChip status={order?.orderItems?.[0]?.status} /></TableCell>
                          <TableCell align="right" sx={{ pr: 2 }}>
                            <Box display="flex" justifyContent="flex-end" gap={0.5}>
                              <Tooltip title="Print Premium Invoice"><IconButton size="small" color="primary" onClick={() => handleTriggerPrint(safeOrderId)}><Print fontSize="small" /></IconButton></Tooltip>
                              <Tooltip title="Manage Order Parameters"><IconButton size="small" color="inherit" onClick={() => handleOpenDetailsModal(safeOrderId)}><Visibility fontSize="small" /></IconButton></Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Card>

        {/* Reusable Details Pop-Up */}
        <OrderDetailsModal
          open={open}
          onClose={handleClose}
          orderDetails={adminOrderDetails}
          orderDetailsChange={orderDetailsChange}
          onChange={handleOrderDetailsChange}
          onSave={handleSave}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default OrdersPage;