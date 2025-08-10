import { Transection } from "../../models/transection.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHander.js";

const getTransection = asyncHandler(async (req, res) => {
  const transections = await Transection.find();
  if (!trasection) {
    throw new ApiError(400, "No transection found!");
  }
  res.status(200).json(new ApiResponse(200, transections));
});

export { getTransection };
