import React, { useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import SidebarContent from "../components/Sidebar";
import { MainContent } from "../utills/Style";
import { useDispatch, useSelector } from "react-redux";
import { recentOrders } from "../../redux/reducers/orderReducer";
import Loader from "../../shared/Loader/Loader";

// Reusable Stat Card
const StatCard = ({ title, value }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" color="primary">
        {value ?? 0}
      </Typography>
    </CardContent>
  </Card>
);

// Reusable Table Component
const OrdersTable = ({ orders }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Order ID
          </TableCell>
          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Customer
          </TableCell>
          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Total
          </TableCell>
          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Status
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders?.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.customer?.firstName || "N/A"}</TableCell>
              <TableCell>{order.orderPrice}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center">
              No recent orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const DashboardPage = () => {
  const { recentOrder, loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recentOrders());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent>
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          <StatCard
            title="Total Orders This Month"
            value={recentOrder?.lastMonth?.totalOrders}
          />
          <StatCard
            title="Pending Orders"
            value={recentOrder?.pendingDeliveries}
          />
          <StatCard
            title="Revenue This Month"
            value={recentOrder?.lastMonth?.totalAmount}
          />
        </Box>

        {/* Recent Orders Table */}
        <Typography variant="h5" gutterBottom>
          Recent Orders
        </Typography>
        <OrdersTable orders={recentOrder?.last10Orders} />
      </MainContent>
    </Box>
  );
};

export default DashboardPage;
