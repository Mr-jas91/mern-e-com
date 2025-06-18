import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  updateUserProfile
} from "../../redux/reducers/authReducer";
import showToast from "../../shared/toastMsg/showToast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(user);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(userData)).unwrap();
      setIsEditing(false);
      showToast("success", "Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast("error", "Failed to update profile");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          User Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {["firstName", "lastName", "phone", "address"].map((field) => (
              <Grid item xs={12} sm={field === "address" ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  id={field}
                  label={
                    field === "firstName"
                      ? "First Name"
                      : field === "lastName"
                      ? "Last Name"
                      : field === "phone"
                      ? "Phone Number"
                      : "Address"
                  }
                  name={field}
                  value={userData[field] || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={userData?.email || ""}
                disabled
              />
            </Grid>
          </Grid>
          <Button
            type={isEditing ? "submit" : "button"}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={(e) => {
              if (!isEditing) {
                e.preventDefault();
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
