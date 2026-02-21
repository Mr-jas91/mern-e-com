import React, { useEffect } from "react";
import { Container, Alert, Box } from "@mui/material";
import ProductGrid from "../components/Product/ProductGrid";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../redux/reducers/productReducer";
import Loader from "../../shared/Loader/Loader"; 

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  useEffect(() => {
    // Only fetch if we don't have products to save bandwidth on navigation
    if (!products.length) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products.length]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load products: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Passing products to grid. You can filter them here for "Trending" logic if needed */}
      <ProductGrid title="Trending Products" products={products} />

      {/* Example of filtering for another section */}
      {/* <ProductGrid title="New Arrivals" products={products.slice(0, 4)} /> */}
    </Container>
  );
}
