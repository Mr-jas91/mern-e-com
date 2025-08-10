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
import isEqual from "lodash.isequal";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchData = async () => {
        setLocalLoading(true);
        try {
          await dispatch(getUserProfile()).unwrap();
        } catch (error) {
          showToast("error", "Failed to fetch user profile");
        } finally {
          setLocalLoading(false);
          hasFetched.current = true;
        }
      };
      fetchData();
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && !isEqual(userData, user)) {
      setUserData(user);
    }
  }, [user]);

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

  if (localLoading) {
    return <Typography align="center">Loading profile...</Typography>;
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
