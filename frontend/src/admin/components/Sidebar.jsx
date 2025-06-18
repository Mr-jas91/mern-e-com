import React, { useCallback } from "react";
import {
  Dashboard,
  ShoppingCart,
  Payment,
  Inventory,
  Logout
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearBothAdminToken } from "../../shared/token";
import { logout } from "../../redux/reducers/adminReducer";
const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { text: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
  { text: "Payments", icon: <Payment />, path: "/admin/payments" },
  { text: "Products", icon: <Inventory />, path: "/admin/products" },
  { text: "Logout", icon: <Logout />, path: "/admin/login", isLogout: true }
];

const SidebarContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = async () => {
    clearBothAdminToken();
    await dispatch(logout());
    navigate("/admin/login");
  };

  const handleItemClick = useCallback(
    (item) => {
      if (item.isLogout) {
        handleLogout();
      } else {
        navigate(item.path);
      }
    },
    [navigate, dispatch]
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white
        }
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={index}
              onClick={() => handleItemClick(item)}
              sx={{
                color: "inherit",
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "inherit",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.25)"
                }
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default SidebarContent;
