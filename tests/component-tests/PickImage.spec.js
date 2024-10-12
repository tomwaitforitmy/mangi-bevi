import { pickImage } from "../../common_functions/PickImage";
import * as ImagePicker from "expo-image-picker";

jest.mock("expo-image-picker");

describe("pickImage", () => {
  it("should dispatch image URI if image picking is not canceled", async () => {
    const mockDispatchFn = jest.fn();
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "test-uri" }],
    });

    await pickImage(mockDispatchFn);
    expect(mockDispatchFn).toHaveBeenCalledWith("test-uri");
  });

  it("should not dispatch anything if image picking is canceled", async () => {
    const mockDispatchFn = jest.fn();
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true });

    await pickImage(mockDispatchFn);
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });
});
