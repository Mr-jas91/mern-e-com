import React from "react";
import {
  Dashboard,
  ShoppingCart,
  Payment,
  Inventory,
  Logout,
  
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const SidebarContent = () => {
  const navigate = useNavigate();
  const theme = useTheme(); 

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
    { text: "Payments", icon: <Payment />, path: "/admin/payments" },
    { text: "Products", icon: <Inventory />, path: "/admin/products" },
    { text: "Logout", icon: <Logout />, path: "/admin/login" }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.primary.main, // ✅ Theme applied correctly
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
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            component="div" // ✅ Prevents <a> behavior, keeps routing smooth
            sx={{
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.preventDefault(); // ✅ Prevents default anchor behavior
              navigate(item.path);
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SidebarContent;
