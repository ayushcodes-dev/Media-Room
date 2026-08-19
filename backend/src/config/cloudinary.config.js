import { v2 as cloudinary } from "cloudinary";
import env_config from "./env.js";

// Ensure environment variables are loaded
env_config();

export const configureCloudinary = () => {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cloudinary;
};

// Initial configuration
configureCloudinary();

export default cloudinary;
