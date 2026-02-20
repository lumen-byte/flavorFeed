import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a buffer (from multer memoryStorage) to Cloudinary
export async function uploadFile(fileBuffer, fileName) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                public_id: fileName,
                folder: "flavorfeed_reels",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error.message);
                    return reject(error);
                }
                console.log("✅ Cloudinary Upload Success:", result.secure_url);
                resolve({ url: result.secure_url });
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const readable = new Readable();
        readable.push(fileBuffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
}

export default cloudinary;