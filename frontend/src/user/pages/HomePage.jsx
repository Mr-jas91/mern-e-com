import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import { toast } from "react-toastify";
// import Carousel from "../components/Carousel/Carousel";
import ProductGrid from "../components/Product/ProductGrid";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../redux/reducers/productReducer";
import { resetCartNotification } from "../../redux/reducers/cartReducer";

// Main HomePage Component
export default function HomePage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { addCartError, addCartSuccess } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [user]);

  // Show toast messages based on the result of the addToCart action
  useEffect(() => {
    if (addCartSuccess) {
      toast.success("Product added to cart successfully!", {
        autoClose: 5000,
      });
      dispatch(resetCartNotification());
    } else if (addCartError) {
      toast.error("Unable to add product to cart.", {
        autoClose: 5000,
      });
      dispatch(resetCartNotification());
    }
  }, [addCartSuccess, addCartError, dispatch]);
 
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Container maxWidth="lg">
      {/* <Box sx={{ my: 4, display: { xs: "none", md: "block" } }}>
        <Carousel images={carouselItems} />
      </Box> */}

      <ProductGrid title="Recommended Products" products={products} />
      {/* <ProductGrid title="Top Selling Products" products={topSellingProducts} />
    <ProductGrid title="Featured Products" products={featuredProducts} /> */}

      {/* <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Shop by Category
        </Typography>
        {categories.map((category) => (
          <Box key={category?.id} sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              {category?.name}
            </Typography>
            <Grid container spacing={2}>
              {category?.products?.slice(0, 4)?.map((product) => (
                <Grid item key={product?.id} xs={12} sm={6} md={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box> */}
    </Container>
  );
}
