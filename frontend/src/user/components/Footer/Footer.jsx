import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box mt={4} py={2} bgcolor="grey.800" color="white" textAlign="center">
      <Typography variant="body2">&copy; 2024 Your E-commerce Site</Typography>
      <Link href="/privacy-policy" color="inherit" underline="hover">Privacy Policy</Link> | 
      <Link href="/terms" color="inherit" underline="hover">Terms of Service</Link>
    </Box>
  );
};

export default Footer;