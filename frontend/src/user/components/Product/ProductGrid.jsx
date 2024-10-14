import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "./ProductCard";
// Product Grid Component
const ProductGrid = ({ title, products }) => (
  <Box sx={{ my: 4 }}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Grid container spacing={2}>
      {products?.map((product) => (
        <Grid item key={product?.id} xs={12} sm={6} md={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  </Box>
);
export default ProductGrid;
