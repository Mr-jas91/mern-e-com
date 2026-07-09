import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import SidebarContent from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { recentOrders, acceptOrderItem, getAdminOrderDetails } from "../../redux/reducers/orderReducer";
import showToast from "../../shared/toastMsg/showToast";
import OrdersTable from "../components/OrderTable";
import { printOrderInvoice } from "../components/PrintInvoice";
import OrderDetailsModal from "../components/OrderDetailsModel";
const drawerWidth = 240;

// --- 📊 Reusable Stat Card Component ---
const StatCard = ({ title, value, prefix = "" }) => (
  <Card sx={{ height: "100%", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </Typography>
      <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", mt: 1 }}>
        {prefix}{value ?? 0}
      </Typography>
    </CardContent>
  </Card>
);

// --- 🏠 MASTER DASHBOARD PAGE SHELL ---
const DashboardPage = () => {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderDetailsChange, setOrderDetailsChange] = useState({});
  const { recentOrders: recentData, adminOrderDetails, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(recentOrders());
  }, [dispatch]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Helper to extract MongoDB ObjectIDs safely (Handles both String and $oid object types)
  const getSafeId = (idObj) => {
    if (!idObj) return null;
    return typeof idObj === "object" && idObj.$oid ? idObj.$oid : idObj.toString();
  };

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
      dispatch(recentOrders());
    } catch (error) {
      showToast("error", error || "Failed to update delivery status");
    }
  };

  // 1. Quick Accept Handler
  const handleQuickAccept = async (orderId, itemId) => {
    if (!orderId || !itemId) {
      showToast("error", "Cannot resolve Order ID or Item ID reference.");
      return;
    }
    try {
      await dispatch(acceptOrderItem({ orderId, itemId })).unwrap();
      showToast("success", "Order item status updated to ACCEPTED");
      dispatch(recentOrders());
    } catch (error) {
      showToast("error", error || "Failed to accept order item");
    }
  };

  // 2. Transformed Print Engine capturing direct data target reference
  const handleTriggerPrint = (orderId) => {
    const targetOrder = recentData?.last10Orders?.find((o) => getSafeId(o._id) === orderId);
    if (!targetOrder) {
      showToast("error", "Failed to print: Order entry not found in active list");
      return;
    }
    printOrderInvoice(targetOrder, orderId); 
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", width: "100%" }}>
      <CssBaseline />
      <SidebarContent mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0,
          boxSizing: "border-box"
        }}
      >
        <Toolbar sx={{ display: { xs: "block", sm: "none" } }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={{ xs: 1, sm: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
            Overview Dashboard
          </Typography>
        </Box>

        {loading && !recentData ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflow: "hidden" }}>

            {/* Stat Summary Cards Row */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Volume This Month" value={recentData?.lastMonth?.totalOrders} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Pending Queue Deliveries" value={recentData?.pendingDeliveries} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Revenue This Month" value={recentData?.lastMonth?.totalAmount} prefix="₹" />
              </Grid>
            </Grid>

            {/* Main Interactive Logs Section Table Container */}
            <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", width: "100%" }}>
              <Box p={{ xs: 2, sm: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Recent Orders Queue Log
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Substituted with the Newly Decoupled Component Passing Complete Prop Handlers */}
                <OrdersTable
                  recentData={recentData}
                  getSafeId={getSafeId}
                  handleQuickAccept={handleQuickAccept}
                  handlePrintInvoice={handleTriggerPrint}
                  onViewDetails={handleOpenDetailsModal}
                />
              </Box>
            </Card>

          </Box>
        )}
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

export default DashboardPage;