import React from "react";
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
  Paper,
  styled
} from "@mui/material";
import SidebarContent from "../components/Sidebar";
import { MainContent } from "../utills/Style";

const StatsCard = styled(Card)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)"
  }
}));

// Stats Cards Component
const StatsCards = () => {
  const stats = [
    { title: "Total Orders This Month", value: "350" },
    { title: "Pending Orders", value: "15" },
    { title: "Revenue This Month", value: "$12,450" }
  ];

  return (
    <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
      {stats.map((stat, index) => (
        <StatsCard key={index}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              {stat.title}
            </Typography>
            <Typography variant="h4" color="primary">
              {stat.value}
            </Typography>
          </CardContent>
        </StatsCard>
      ))}
    </Box>
  );
};

// Recent Orders Table Component
const RecentOrdersTable = () => {
  const recentOrders = [
    {
      id: "#1001",
      customer: "John Doe",
      total: "$120.50",
      status: "Completed"
    },
    { id: "#1002", customer: "Jane Smith", total: "$90.00", status: "Pending" },
    {
      id: "#1003",
      customer: "David Johnson",
      total: "$250.75",
      status: "Shipped"
    }
  ];

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Recent Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// Main Dashboard Component
const DashboardPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent>
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Dashboard
        </Typography>
        <StatsCards />
        <RecentOrdersTable />
      </MainContent>
    </Box>
  );
};

export default DashboardPage;
