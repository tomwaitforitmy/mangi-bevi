import { GetImagesToUpload } from "../../common_functions/GetImagesToUpload";

describe("Given list with no firebase url", () => {
  it("returns same list", () => {
    const images = ["https://not.uploaded.image", "\\not\\uploaded\\image"];
    const expected = ["https://not.uploaded.image", "\\not\\uploaded\\image"];
    const result = GetImagesToUpload(images);
    expect(result).toEqual(expected);
  });
});

describe("Given list with only firebase urls", () => {
  it("returns empty list", () => {
    const images = [
      "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/008f73de-7ac6-49c3-9920-08582a085ed1?alt=media&token=0094f827-eca4-49a9-89b7-15e8714a7910",
      "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/0a27bc3a-641f-4976-ad97-81c69de4bba1?alt=media&token=76af1b30-6a08-47d3-9b51-f48d7e87ab08",
    ];
    const expected = [];
    const result = GetImagesToUpload(images);
    expect(result).toEqual(expected);
  });
});

describe("Given list with one firebase url", () => {
  it("returns list with that one url", () => {
    const images = [
      "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/008f73de-7ac6-49c3-9920-08582a085ed1?alt=media&token=0094f827-eca4-49a9-89b7-15e8714a7910",
      "https://someOtherUrl.googleapis.com/v0/b/testshop-39aae.appspot.com/o/0a27bc3a-641f-4976-ad97-81c69de4bba1?alt=media&token=76af1b30-6a08-47d3-9b51-f48d7e87ab08",
    ];
    const expected = [
      "https://someOtherUrl.googleapis.com/v0/b/testshop-39aae.appspot.com/o/0a27bc3a-641f-4976-ad97-81c69de4bba1?alt=media&token=76af1b30-6a08-47d3-9b51-f48d7e87ab08",
    ];
    const result = GetImagesToUpload(images);
    expect(result).toEqual(expected);
  });
});
