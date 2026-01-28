import ImageKit from "imagekit";
import dotenv from "dotenv"; // Add this
dotenv.config(); // Add this

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
export async function uploadFile(file, fileName){
    const result = await imagekit.upload({
        file: file,
        fileName: fileName,
    });
    return result;
}
export default imagekit;

// // export { uploadFile };

// export const uploadFile = async (fileBuffer, fileName) => {
//     try {
//         const response = await imagekit.upload({
//             file: fileBuffer,
//             fileName: fileName,
//             folder: "/flavorfeed_reels"
//         });
//         return response;
//     } catch (error) {
//         console.error("ImageKit Upload Error:", error);
//         throw error;
//     }
// };

// // Default export of the instance
// export default imagekit;