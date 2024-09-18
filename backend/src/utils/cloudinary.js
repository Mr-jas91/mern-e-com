import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Configuration
try {
  cloudinary.config({
    cloud_name: "dy5vms6wh",
    api_key: "947336797196983",
    api_secret: "5lyOmajz5i6h6MGwcR8rLO88JLQ",
  });
} catch (error) {
  console.log(error);
}

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudnary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    // console.log("File uploaded", response.url);
    fs.unlinkSync(localFilePath);
    return response.url;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
const deleteFromCloudinary = (public_id) => {
  // delete the file from cloudinary
  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log("File deleted from cloudinary", result);
      return true;
    }
  });
};
export { uploadOnCloudinary, deleteFromCloudinary };
