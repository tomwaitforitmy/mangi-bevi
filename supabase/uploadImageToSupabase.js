import { supabase } from "./supabase";
import "react-native-get-random-values";
import { v4 } from "uuid";
import imageCompress from "../image_processing/imageCompress";
import { Image } from "react-native";

const bucketName = "mangi-bevi-images";

export const uploadImageToSupabase = async (uri) => {
  try {
    console.log("uri", uri);

    let width = 0,
      height = 0;
    await new Promise((res) =>
      Image.getSize(
        uri,
        (w, h) => {
          width = w;
          height = h;
          res();
        },
        () => {
          console.warn("couldn't get size");
          res();
        },
      ),
    );

    const compressedUri = await imageCompress(uri, { width, height });

    //unique name
    const filename = `${v4()}.jpg`;

    //Read file as base64 and convert to Uint8Array
    const response = await fetch(compressedUri);
    const blob = await response.blob();

    // Use FileReader to convert blob to ArrayBuffer for Supabase
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });

    const uint8Array = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, uint8Array, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Upload error details:", error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    throw error;
  }
};
