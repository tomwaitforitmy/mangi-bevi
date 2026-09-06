import { GetPlaceholderImageUrl } from "../../common_functions/GetPlaceholderImageUrl";
import lightTheme from "../../theme/lightTheme";
import darkTheme from "../../theme/darkTheme";

describe("GetPlaceholderImageUrl", () => {
  it("embeds the theme's surfaceVariant/onSurfaceVariant colors without a #", () => {
    const url = GetPlaceholderImageUrl(lightTheme);

    expect(url).toBe(
      "https://dummyimage.com/300x200/E7ECF5/43474E&text=No+image+yet",
    );
  });

  it("uses different colors per theme", () => {
    const lightUrl = GetPlaceholderImageUrl(lightTheme);
    const darkUrl = GetPlaceholderImageUrl(darkTheme);

    expect(lightUrl).not.toBe(darkUrl);
  });
});
