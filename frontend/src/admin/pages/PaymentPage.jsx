import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { MainContent } from "../utills/Style";
import SidebarContent from "../components/Sidebar";

/**
 * PaymentPage
 * -------------------------------------------------------------------------
 * Displays payment records with the following fields:
 *  • Order ID
 *  • Payment Method
 *  • Status (e.g., Paid, Failed, Refunded, Pending)
 *  • Date (ISO string or locale date)
 *  • Customer Name
 * -------------------------------------------------------------------------
 * Uses Material‑UI for styling and is responsive out of the box because it
 * relies on the flex-based layout already used across the admin pages.
 */

const PaymentPage = () => {
  const payments = [
    {
      id: "pay1",
      orderId: "ORD123456",
      customerName: "John Doe",
      paymentMethod: "Credit Card",
      status: "Paid",
      date: "2025-06-08"
    },
    {
      id: "pay2",
      orderId: "ORD123789",
      customerName: "Jane Smith",
      paymentMethod: "UPI",
      status: "Pending",
      date: "2025-06-09"
    }
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent>
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: "black" }}>
          Payment Details
        </Typography>

        <Box p={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "black" }}>Order ID</TableCell>
                <TableCell sx={{ color: "black" }}>Payment Method</TableCell>
                <TableCell sx={{ color: "black" }}>Status</TableCell>
                <TableCell sx={{ color: "black" }}>Date</TableCell>
                <TableCell sx={{ color: "black" }}>Customer Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell sx={{ color: "black" }}>{pay.orderId}</TableCell>
                  <TableCell sx={{ color: "black" }}>{pay.paymentMethod}</TableCell>
                  <TableCell sx={{ color: "black" }}>{pay.status}</TableCell>
                  <TableCell sx={{ color: "black" }}>{pay.date}</TableCell>
                  <TableCell sx={{ color: "black" }}>{pay.customerName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </MainContent>
    </Box>
  );
};

export default PaymentPage;
