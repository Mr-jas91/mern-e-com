import React, { useEffect, useState, useRef } from "react";
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
import Loader from "../../shared/Loader/Loader";
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile ONLY on initial mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Update userData when profile changes (no API call)
  useEffect(() => {
    if (profile) {
      setUserData(profile);
    }
  }, [profile]); // Only update when profile changes
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
      showToast("error", "Failed to update profile");
    }
  };
  if (!profile) {
    return <Loader />;
  }

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
