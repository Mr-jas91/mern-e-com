import React, { useState } from "react";
import { Container, Typography, TextField, Grid } from "@mui/material";
import ProductCard from "../components/ProductCard/ProductCard";
const items = {
  name: "This is the first product",
  description: "This is product one description",
  img: "https://via.placeholder.com/300x300",
  price: 399,
};
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <Typography variant="h4">Search Products</Typography>
      <TextField
        label="Search"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Grid container spacing={3}>
        {/* Map through filtered products based on searchTerm */}
        <ProductCard product={items} />
      </Grid>
    </Container>
  );
};

export default SearchPage;
