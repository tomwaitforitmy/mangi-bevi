import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { GetImageSize, LogSize } from "./GetImageSize";

const imageCompress = async (image, { width, height }) => {
  const compressSizer = (size) => {
    const MB = size / Math.pow(1024, 2);
    if (Math.round(MB) === 0) return 1;
    if (Math.round(MB) === 1) return 0.9;
    if (Math.round(MB) === 2) return 0.8;
    if (Math.round(MB) === 3) return 0.7;
    if (Math.round(MB) === 4) return 0.6;
    if (Math.round(MB) >= 5) return 0.5;
    if (Math.round(MB) >= 10) return 0.4;
    if (Math.round(MB) >= 15) return 0.3;
    if (Math.round(MB) >= 20) return 0.2;
    if (Math.round(MB) >= 25) return 0.1;
  };

  const imageManipulator = async (image, { width, height }) => {
    const size = await GetImageSize(image);
    LogSize(size, "input image (MB)");

    const compress = compressSizer(size);

    let resize;
    if (height === width) resize = { height: 480, width: 480 };
    else if (height > width) resize = { height: 480 };
    else resize = { width: 720 };

    const context = ImageManipulator.manipulate(image);
    context.resize(resize);
    // Render the image with transformations
    const processedImage = await context.renderAsync();

    // Save the image with compression and format
    const result = await processedImage.saveAsync({
      compress,
      format: SaveFormat.JPEG,
    });

    const sizeCompressed = await GetImageSize(result.uri);
    LogSize(sizeCompressed, "compressed image (MB)");

    return result.uri;
  };

  try {
    return await imageManipulator(image, { width, height });
  } catch (error) {
    console.log(error);
  }
};

export default imageCompress;
