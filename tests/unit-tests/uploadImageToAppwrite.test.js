import { Image } from "react-native";

// jest-expo's own Image.getSize mock crashes ("success is not a function"),
// so replace it outright instead of relying on it.
jest.mock("../../appwrite/appwriteClient", () => ({
  storage: {
    createFile: jest.fn(),
    client: { config: { endpoint: "https://fra.cloud.appwrite.io/v1" } },
  },
}));
jest.mock("../../image_processing/imageCompress", () => jest.fn());
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: { appwriteBucketId: "test-bucket", appwriteProjectId: "test-project" },
  },
}));
// uuid ships ESM-only and isn't in the jest transformIgnorePatterns allowlist.
jest.mock("uuid", () => ({ v4: () => "test-uuid" }));

import { uploadImageToAppwrite } from "../../appwrite/uploadImageToAppwrite";
import { storage } from "../../appwrite/appwriteClient";
import imageCompress from "../../image_processing/imageCompress";

describe("uploadImageToAppwrite", () => {
  beforeEach(() => {
    jest.spyOn(Image, "getSize").mockImplementation((uri, success) => success(800, 600));
    imageCompress.mockResolvedValue("file://compressed.jpg");
    global.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(["fake-bytes"], { type: "image/jpeg" })),
    });
    storage.createFile.mockResolvedValue({ $id: "abc123" });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Regression test for the Prio-1 bug: Expo's patched FormData only accepts
  // real Blob instances, not a plain {uri,name,type} object. If this ever
  // regresses, uploads will silently fail in production while this test
  // keeps passing with mocks that don't care about the type - so we assert
  // the exact object shape Appwrite's SDK is given.
  it("uploads a real Blob instance, not a plain {uri,name,type} object", async () => {
    await uploadImageToAppwrite("file://original.jpg");

    expect(storage.createFile).toHaveBeenCalledTimes(1);
    const { file } = storage.createFile.mock.calls[0][0];

    expect(file).toBeInstanceOf(Blob);
    expect(file.name).toMatch(/\.jpg$/);
  });

  it("returns the constructed view URL on success", async () => {
    const url = await uploadImageToAppwrite("file://original.jpg");

    expect(url).toBe(
      "https://fra.cloud.appwrite.io/v1/storage/buckets/test-bucket/files/abc123/view?project=test-project",
    );
  });

  it("throws if Appwrite returns no file ID", async () => {
    // uploadImageToAppwrite logs this error before rethrowing it - expected, silence it.
    jest.spyOn(console, "error").mockImplementation(() => {});
    storage.createFile.mockResolvedValue({});

    await expect(uploadImageToAppwrite("file://original.jpg")).rejects.toThrow();
  });
});
