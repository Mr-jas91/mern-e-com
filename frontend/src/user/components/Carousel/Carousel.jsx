import React, { useState } from "react";
import { Box, Card, CardMedia, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box sx={{ position: "relative", maxWidth: 1440, margin: "0 auto", mb: 3, mt: 3 }}>
      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ChevronLeft />
      </IconButton>

      <Card sx={{ width: "100%", height: 300 }}> {/* Set height here */}
        <CardMedia
          component="img"
          height="100%" // Set to 100% to fill the card
          image={images[currentIndex].src}
          alt={images[currentIndex].title}
          sx={{ objectFit: "cover" }} // Maintain aspect ratio and cover
        />
        <Typography variant="h6" align="center" sx={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
          {images[currentIndex].title}
        </Typography>
      </Card>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default Carousel;

