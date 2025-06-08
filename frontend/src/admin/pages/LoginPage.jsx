import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid
} from "@mui/material";
import showToast from "../../shared/toastMsg/showToast.jsx";
import { loginAdmin } from "../../redux/reducers/adminReducer.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin,loading } = useSelector((state) => state.admin);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginAdmin(formData));
      console.log(res,admin)
      if (res.payload.success) {
        showToast("success", "Successfully logged in!");
        setFormData({
          email: "",
          password: ""
        });
        navigate("/admin/dashboard");
      } else {
        showToast("error", res.payload?.data);
      }
    } catch (error) {
      showToast("error", error?.message);
    }
  };

  // Redirect to register page
  const handleRegisterRedirect = () => {
    navigate("/admin/register");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading} // Disable the button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegisterRedirect}
            disabled={loading}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
