import { deleteImage } from "../../firebase/deleteImage";
import { uploadImageToBucket } from "../../firebase/uploadImageToBucket";

describe("UploadImageAndDeleteImage", () => {
  it("returns the url of the image", async () => {
    const url = await uploadImageToBucket(".\\assets\\testImage.jpg");
    expect(url).toBeTruthy();
    await expect(deleteImage(url)).resolves();
  });
});
