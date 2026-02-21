import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductGrid = ({ title, products }) => {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No products available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        {title}
      </Typography>
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
