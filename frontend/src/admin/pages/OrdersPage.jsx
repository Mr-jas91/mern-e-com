import React from "react";
import { MainContent } from "../utills/Style";
import SidebarContent from "../components/Sidebar";
import { Box, CssBaseline, Toolbar, Typography } from "@mui/material";
const OrdersPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent>
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Orders
        </Typography>
      </MainContent>
    </Box>
  );
};

export default OrdersPage;
