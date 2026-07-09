import React from "react";
import {
  Dashboard,
  ShoppingCart,
  Payment,
  Inventory,
  Logout,
  Menu as MenuIcon
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Box,
  AppBar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearBothAdminToken } from "../../shared/token";
import { logout } from "../../redux/reducers/adminReducer";
import showToast from "../../shared/toastMsg/showToast";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { text: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
  { text: "Payments", icon: <Payment />, path: "/admin/payments" },
  { text: "Products", icon: <Inventory />, path: "/admin/products" },
  { text: "Logout", icon: <Logout />, path: "/admin/login", isLogout: true }
];

// Added dynamic mobile state toggling properties directly into the sidebar parameters
const SidebarContent = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = async () => {
    clearBothAdminToken();
    await dispatch(logout());
    showToast("success", "Successfully logged out!");
    navigate("/admin/login");
  };

  const handleItemClick = (item) => {
    if (item.isLogout) {
      handleLogout();
    } else {
      navigate(item.path);
    }
    if (handleDrawerToggle) handleDrawerToggle(); // Close mobile drawer automatically on click
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ justifyContent: "center", background: "rgba(0,0,0,0.05)", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", tracking: 1, letterSpacing: "1px" }}>
          ADMIN STORE
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={index}
              onClick={() => handleItemClick(item)}
              sx={{
                borderRadius: "8px",
                mb: 0.5,
                color: isActive ? theme.palette.common.white : "rgba(255, 255, 255, 0.7)",
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
                borderLeft: isActive ? `4px solid ${theme.palette.common.white}` : "4px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: theme.palette.common.white
                },
                transition: "all 0.2s ease"
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? "bold" : "medium" }} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Dynamic Header Toolbar to allow opening and closing the menu on smaller devices */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#background.paper",
          color: "text.primary",
          display: { sm: "none" } // Only display header bar on mobile devices
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Temporary Slide-Out Drawer View */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              boxShadow: 4
            }
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer View Layout */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              borderRight: "none"
            }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default SidebarContent;