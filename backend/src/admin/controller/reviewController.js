import { Review } from "../../models/review.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHander.js";

// GET /api/reviews/:productId
const getReviewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json(new ApiError(400, "Product ID is required"));
  }

  const reviews = await Review.find({ productId }).populate("userId", "name"); // Assuming you want to show the user's name
  if (!reviews || reviews.length === 0) {
    return res
      .status(400)
      .json(new ApiError(404, "No reviews found for this product"));
    f;
  }

  res.status(200).json(new ApiResponse(200, reviews));
});

// DELETE /api/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return res.status(400).json(new ApiError(400, "Review ID is required"));
  }

  const deletedReview = await Review.findByIdAndDelete(reviewId);
  if (!deletedReview) {
    return res.status(404).json(new ApiError(404, "Review not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Review deleted successfully", deletedReview));
});

export { getReviewsByProduct, deleteReview };
