import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    if (!localFilePath) return null;

    // Upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //File has been uploaded successfully
    console.log("File has been uploaded on Cloudinary", response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // File uploaded failed, removed temp file from local
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
