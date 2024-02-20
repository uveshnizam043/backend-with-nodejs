import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_SECRET,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (locationFilePath) => {
    try {
        if (!locationFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(locationFilePath, {
            resource_type: 'auto'
        })
        // file has been uploaded successfully
        console.log("file is uploaded on clooudinary", response.url);
        return response
    } catch (error) {
        fs.unlink(locationFilePath)
        // remove the locally saved temporary file as the uploaded 
    }
}
export {uploadOnCloudinary}