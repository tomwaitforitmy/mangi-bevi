import * as ImageManipulator from "expo-image-manipulator";

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
    const response = await fetch(image);
    const blob = await response.blob();

    const compress = compressSizer(blob.size);

    let resize;
    if (height === width) resize = { height: 480, width: 480 };
    else if (height > width) resize = { height: 480 };
    else resize = { width: 720 };

    const compressedPhoto = await ImageManipulator.manipulateAsync(
      image,
      [{ resize }],
      {
        compress,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return compressedPhoto.uri;
  };

  try {
    return await imageManipulator(image, { width, height });
  } catch (error) {
    console.log(error);
  }
};

export default imageCompress;
