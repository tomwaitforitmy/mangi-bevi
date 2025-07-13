import { storage } from "./appwriteClient";
import Constants from "expo-constants";

export async function deleteImageFromAppwrite(imageUrl) {
  try {
    const fileId = extractFileIdFromUrl(imageUrl);

    if (!fileId) {
      throw new Error("Invalid image URL: Could not extract file ID");
    }

    const response = await storage.deleteFile(
      Constants.expoConfig.extra.appwriteBucketId,
      fileId,
    );

    console.log("Delete success:", response);
    return true;
  } catch (error) {
    console.log("Delete failed:", error);
    throw error;
  }
}

// Helper function to extract file ID from Appwrite URL
function extractFileIdFromUrl(url) {
  try {
    // Expected URL format: https://fra.cloud.appwrite.io/v1/storage/buckets/<BUCKET_ID>/files/<FILE_ID>/view
    const regex = /\/files\/([^\/]+)\/view/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.log("Error extracting file ID from URL:", error);
    return null;
  }
}

export async function deleteImages(imageUrls) {
  const results = [];

  for (const url of imageUrls) {
    try {
      await deleteImageFromAppwrite(url);
      results.push({ url, success: true });
    } catch (error) {
      results.push({ url, success: false, error: error.message });
    }
  }

  return results;
}
