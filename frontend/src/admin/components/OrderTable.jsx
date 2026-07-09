// components/OrderTable.jsx
import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Avatar,
  Typography,
  AvatarGroup,
  Tooltip,
  IconButton
} from "@mui/material";
import { CheckCircleOutline, Print, Visibility } from "@mui/icons-material";
import { StatusChip } from "./StatusChip";

const OrdersTable = ({ recentData, getSafeId, handleQuickAccept, handlePrintInvoice, onViewDetails }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "8px", overflowX: "auto" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#fcfcfc" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Products</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total Value</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "right", pr: 3 }}>Quick Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentData?.last10Orders?.length > 0 ? (
            recentData.last10Orders.map((order) => {
              const totalItemsCount = order.orderItems?.length || 0;
              const firstItem = order.orderItems?.[0];
              const currentStatus = firstItem?.status || "PENDING";
              const orderId = getSafeId(order._id);
              const itemId = getSafeId(firstItem?._id);

              return (
                <TableRow key={orderId || Math.random()} hover>
                  <TableCell sx={{ fontWeight: "medium" }}>{orderId}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <AvatarGroup max={2} slotProps={{ avatar: { sx: { width: 32, height: 32, fontSize: "0.75rem" } } }}>
                        {order.orderItems?.map((item, idx) => (
                          <Avatar key={idx} variant="rounded" src={item.image} />
                        ))}
                      </AvatarGroup>
                      <Box sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: "medium" }}>
                          {firstItem?.name || "No Products Listed"}
                        </Typography>
                        {totalItemsCount > 1 && (
                          <Typography variant="caption" color="primary" sx={{ fontWeight: "bold" }}>
                            + {totalItemsCount - 1} more items
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{order.customer?.firstName || "Guest"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>₹{(order.orderValue || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <StatusChip status={currentStatus} />
                  </TableCell>

                  {/* ⚡ Conditional Action Logic Block */}
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Box display="flex" justifyContent="flex-end" gap={0.5}>

                      {/* Condition 1: If current sub-document item status is strictly PENDING */}
                      {currentStatus === "PENDING" ? (
                        <>
                          <Tooltip title="Quick Accept Order" arrow>
                            <IconButton size="small" color="success" onClick={() => handleQuickAccept(orderId, itemId)}>
                              <CheckCircleOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View System Details" arrow>
                            <IconButton size="small" color="inherit" onClick={() => onViewDetails(orderId)} sx={{ opacity: 0.7 }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        // Condition 2: If item is processed into any secondary state (ACCEPTED, SHIPPED, etc.)
                        <>
                          <Tooltip title="Print Premium Invoice" arrow>
                            <IconButton size="small" color="primary" onClick={() => handlePrintInvoice(orderId)}>
                              <Print fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View System Details" arrow>
                            <IconButton size="small" color="inherit" onClick={() => onViewDetails(orderId)} sx={{ opacity: 0.7 }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                No recent orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;