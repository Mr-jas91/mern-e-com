// pages/PaymentPage.jsx
import React, { useEffect } from "react";
import Loader from "../../shared/Loader/Loader";
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
  TableContainer,
  Paper,
  Card,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import SidebarContent from "../components/Sidebar";
import { getTransaction, updateTransactionStatus } from "../../redux/reducers/transactionReducer"; 
import { useDispatch, useSelector } from "react-redux";
import showToast from "../../shared/toastMsg/showToast";

const drawerWidth = 240;

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(getTransaction());
  }, [dispatch]);

  // ⚡ एकीकृत हैंडलर: जो स्टेटस और मेथड दोनों को स्वतंत्र रूप से अपडेट कर सकता है
  const handleLiveUpdate = async (transactionId, fieldName, updatedValue, currentPayload) => {
    if (!transactionId) return;
    
    // वर्तमान रो का डेटा सुरक्षित रखें ताकि जो फील्ड नहीं बदला जा रहा, वह पुराना ही जाए
    const payload = {
      transactionId,
      paymentMethod: fieldName === "paymentMethod" ? updatedValue : (currentPayload.paymentMethod || "ONLINE"),
      paymentStatus: fieldName === "paymentStatus" ? updatedValue : (currentPayload.paymentStatus || "PENDING")
    };

    try {
      await dispatch(updateTransactionStatus(payload)).unwrap();
      showToast("success", `Transaction ${fieldName} updated successfully`);
    } catch (err) {
      showToast("error", err || `Failed to update ${fieldName}`);
    }
  };

  if (loading && transactions?.length === 0) return <Loader />;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", width: "100%" }}>
      <CssBaseline />
      <SidebarContent />

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

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, mt: { xs: 1, sm: 4 }, color: "#1a1a1a" }}
        >
          Payment Ledger Logs
        </Typography>

        <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", width: "100%" }}>
          <Box p={2}>
            <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto", borderRadius: "8px" }}>
              <Table stickyHeader sx={{ minWidth: 950 }}>
                <TableHead sx={{ "& .MuiTableCell-head": { backgroundColor: "#fcfcfc", fontWeight: "bold" } }}>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Order Value</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Status Selector</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions?.length > 0 ? (
                    transactions.map((pay) => {
                      const transId = pay._id?.$oid || pay._id?.toString() || pay.transactionId;
                      const currentMethod = pay.paymentMethod || "COD";
                      const currentStatus = pay.paymentStatus || "PENDING";

                      return (
                        <TableRow key={transId} hover>
                          <TableCell sx={{ fontWeight: "medium" }}>{transId}</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>
                            ₹{(pay.amount || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>
                            ₹{(pay?.order?.orderValue || 0).toLocaleString("en-IN")}
                          </TableCell>
                          
                          {/* 🛠️ फिक्स 1: पेमेंट मेथड को एडिटेबल ड्रॉपडाउन बनाया */}
                          <TableCell sx={{ width: "140px" }}>
                            <FormControl fullWidth size="small">
                              <Select
                                value={currentMethod}
                                onChange={(e) => handleLiveUpdate(transId, "paymentMethod", e.target.value, pay)}
                                sx={{ fontSize: "0.85rem", borderRadius: "6px" }}
                              >
                                <MenuItem value="ONLINE">ONLINE</MenuItem>
                                <MenuItem value="COD">COD</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          
                          {/* ⚡ इनलाइन स्टेटस ड्रॉपडाउन */}
                          <TableCell sx={{ width: "160px" }}>
                            <FormControl fullWidth size="small">
                              <Select
                                value={currentStatus}
                                onChange={(e) => handleLiveUpdate(transId, "paymentStatus", e.target.value, pay)}
                                sx={{
                                  fontSize: "0.85rem",
                                  fontWeight: "600",
                                  borderRadius: "6px",
                                  backgroundColor: currentStatus === "PAID" ? "#e6f4ea" : currentStatus === "FAILED" ? "#fce8e6" : "#fef7e0",
                                  color: currentStatus === "PAID" ? "#137333" : currentStatus === "FAILED" ? "#c5221f" : "#b06000",
                                  "& .MuiSelect-select": { paddingY: "6px" }
                                }}
                              >
                                <MenuItem value="PENDING">PENDING</MenuItem>
                                <MenuItem value="PAID">PAID</MenuItem>
                                <MenuItem value="FAILED">FAILED</MenuItem>
                                <MenuItem value="REFUNDED">REFUNDED</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            {pay.transactionDate || pay.createdAt
                              ? new Date(pay.transactionDate || pay.createdAt).toLocaleDateString("en-IN")
                              : "N/A"}
                          </TableCell>
                          
                          {/* 🛠️ फिक्स 2: बैकएंड पॉपुलेशन के कारण नाम अब सुरक्षित रहेगा */}
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {pay.user?.firstName || "Guest Customer"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                        No financial ledger logs recorded in this cycle.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentPage;