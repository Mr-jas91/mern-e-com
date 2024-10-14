import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Profile = ({ user }) => {
  return (
    <Box>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="body1">Name: {user.name}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">Address: {user.address}</Typography>
      <Button variant="contained" color="primary">Edit Profile</Button>
    </Box>
  );
};

export default Profile;