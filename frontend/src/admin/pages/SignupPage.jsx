import React, { useState } from "react";
import { registerAdmin } from "../../redux/reducers/adminReducer";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import showToast from "../../shared/toastMsg/showToast";


const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin, loading, error } = useSelector((state) => state.admin);
  // console.log("Admin:", admin);
  // console.log("Error:", error);
  // console.log("Loading:",loading);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }

    const { confirmPassword, ...adminData } = formData;

    try {
      const res = await dispatch(registerAdmin(adminData));

      if (res.error) {
        showToast("error", res.payload || "Registration failed");
        return;
      }

      showToast("success", "Admin account created!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin"
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      showToast("error", error?.message || "Something went wrong!");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/admin/login");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Signup
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
          </Grid>

          <TextField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            sx={{ mb: 2 }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Create Admin Account"}
          </Button>
        </Box>
        <Button fullWidth variant="outlined" onClick={handleLoginRedirect}>
          Already have an account? Log In!
        </Button>
      </Paper>
    </Container>
  );
};

export default SignupPage;
