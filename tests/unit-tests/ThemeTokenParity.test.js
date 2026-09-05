import lightTheme from "../../theme/lightTheme";
import darkTheme from "../../theme/darkTheme";
import colorfulTheme from "../../theme/colorfulTheme";

const sortedKeys = (obj) => Object.keys(obj).sort();

describe("ThemeTokenParity", () => {
  it("light and dark themes expose identical color token keys", () => {
    expect(sortedKeys(lightTheme.colors)).toEqual(sortedKeys(darkTheme.colors));
  });

  it("colorful theme exposes the same color token keys as light/dark", () => {
    expect(sortedKeys(colorfulTheme.colors)).toEqual(sortedKeys(lightTheme.colors));
    expect(sortedKeys(colorfulTheme.colors)).toEqual(sortedKeys(darkTheme.colors));
  });
});
