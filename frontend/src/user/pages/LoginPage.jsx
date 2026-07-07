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
import showToast from "../../shared/toastMsg/showToast"
import { loginUser } from "../../redux/reducers/authReducer.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
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
    e.preventDefault(); // ब्राउज़र रिफ्रेश रोकता है
    try {
      const res = await dispatch(loginUser(formData));
      console.log("API Response:", res);
      
      // फ़िक्स: सुरक्षित चेकिंग (Optional Chaining) ताकि undefined होने पर कोड क्रैश न हो
      if (res?.payload?.success) {
        showToast("success", "Successfully logged in!");
        setFormData({
          email: "",
          password: ""
        });
        // navigate("/home"); 
      } else {
        // अगर API से एरर मैसेज आया है या payload नहीं मिला
        const errMsg = res?.payload?.message || res?.payload?.data || "Login failed!";
        showToast("error", errMsg);
      }
    } catch (error) {
      showToast("error", error?.message || "Something went wrong!");
    }
  };

  // Redirect to register page
  const handleRegisterRedirect = () => {
    navigate("/user/register");
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
                value={formData.email} // फ़िक्स: value बाइंड की
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
                value={formData.password} // फ़िक्स: value बाइंड की
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegisterRedirect}
            disabled={loading}
            type="button" // फ़िक्स: इसे स्पष्ट रूप से button टाइप दिया ताकि यह फॉर्म सबमिट न करे
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;