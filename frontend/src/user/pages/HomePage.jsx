import React, { useEffect } from "react";
import { Container } from "@mui/material";
import ProductGrid from "../components/Product/ProductGrid";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../redux/reducers/productReducer";

// Main HomePage Component
export default function HomePage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchAllProducts());
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <ProductGrid title="Tranding Products" products={products} />
      {/* <ProductGrid title="Recommended Products" products={products} /> */}
    </Container>
  );
}
