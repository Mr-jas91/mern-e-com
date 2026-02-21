import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { MainContent } from "../utills/Style";
import SidebarContent from "../components/Sidebar";
import { getTransection } from "../../redux/reducers/transectionReducer";
import { useDispatch, useSelector } from "react-redux";

const PaymentPage = () => {
  const { transections, loading } = useSelector((state) => state.transections);
  const dispatch = useDispatch();
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    dispatch(getTransection());
  }, [dispatch]);

  useEffect(() => {
    setPayments(transections);
  }, [transections]);

  if (loading || payments === null) return <Loader />;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}> {/* Full viewport height */}
      <CssBaseline />
      <SidebarContent />
      <MainContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Toolbar />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", color: "black" }}
        >
          Payment Details
        </Typography>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
          <TableContainer
            component={Paper}
            sx={{
              flex: 1, // takes remaining height
              overflowX: "auto",
              overflowY: "auto",
              "&::-webkit-scrollbar": { height: 8, width: 8 },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc" },
            }}
          >
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "black", whiteSpace: "nowrap" }}>Transection ID</TableCell>
                  <TableCell sx={{ color: "black" }}>Amount</TableCell>
                  <TableCell sx={{ color: "black", whiteSpace: "nowrap" }}>Order ID</TableCell>
                  <TableCell sx={{ color: "black", whiteSpace: "nowrap" }}>Payment Method</TableCell>
                  <TableCell sx={{ color: "black" }}>Status</TableCell>
                  <TableCell sx={{ color: "black", whiteSpace: "nowrap" }}>Date</TableCell>
                  <TableCell sx={{ color: "black", whiteSpace: "nowrap" }}>Customer Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((pay) => (
                  <TableRow key={pay._id}>
                    <TableCell sx={{ color: "black" }}>
                      {pay.transectionId}
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>{pay.amount}</TableCell>
                    <TableCell sx={{ color: "black" }}>{pay.order}</TableCell>
                    <TableCell sx={{ color: "black" }}>
                      {pay.paymentmethod}
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      {pay.paymentStatus}
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      {pay.transectionDate}
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      {pay.user?.firstName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainContent>
    </Box>
  );
};

export default PaymentPage;
