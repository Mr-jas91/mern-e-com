import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { loginUser } from "../../redux/reducers/authReducer.js";
import { useDispatch, useSelector } from "react-redux";
const LoginPage = () => {
  const count = useSelector((state) => state.auth.user);
  console.log(count);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(formData);
  };

  // Redirect to register page
  const handleRegisterRedirect = () => {
    navigate("/register");
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
                // disabled={loading} // Disable inputs while loading
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
                // disabled={loading} // Disable inputs while loading
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            // disabled={loading} // Disable the button when loading
          >
            {/* {loading ? "Logging in..." : "Login"} */}
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegisterRedirect}
            // disabled={loading} // Disable register button while loading
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default LoginPage;
