import { GetContrastRatio } from "../../common_functions/GetContrastRatio";
import lightTheme from "../../theme/lightTheme";
import darkTheme from "../../theme/darkTheme";
import colorfulTheme from "../../theme/colorfulTheme";

const NORMAL_TEXT_MIN = 4.5;
const LARGE_TEXT_OR_ICON_MIN = 3;

// [foreground token, background token, minimum ratio]
const TEXT_PAIRS = [
  ["onSurface", "surface", NORMAL_TEXT_MIN],
  ["onBackground", "background", NORMAL_TEXT_MIN],
  ["onPrimary", "primary", NORMAL_TEXT_MIN],
  ["onSurfaceVariant", "surfaceVariant", NORMAL_TEXT_MIN],
  ["hyperlink", "background", NORMAL_TEXT_MIN],
  ["levelViewTexts", "levelViewBackground", NORMAL_TEXT_MIN],
  ["tagText", "tagBackground", NORMAL_TEXT_MIN],
  ["searchTermHighlight", "screenBackGround", NORMAL_TEXT_MIN],
  ["searchTextPlaceholder", "screenBackGround", NORMAL_TEXT_MIN],
  ["speedDialActionText", "speedDialActionBackground", NORMAL_TEXT_MIN],
  ["textInputPlaceholderColor", "textInputBackground", NORMAL_TEXT_MIN],
  // Paired with constants/TextInputStyles.js's `input` (white bg/black text)
  // and `placeholderTextColor` — see white role's file-header note in
  // theme/lightTheme.js for why "white" (not "surface") is the right token.
  ["onSurfaceVariant", "white", NORMAL_TEXT_MIN],
];

const ICON_OR_GRAPHIC_PAIRS = [
  ["speedDialIcon", "speedDialBackground", LARGE_TEXT_OR_ICON_MIN],
  ["levelViewBar", "levelViewBarBackground", LARGE_TEXT_OR_ICON_MIN],
];

describe.each([
  ["light", lightTheme],
  ["dark", darkTheme],
  ["colorful", colorfulTheme],
])("%s theme WCAG AA contrast", (name, theme) => {
  it.each(TEXT_PAIRS)(
    "text pair %s / %s meets 4.5:1",
    (fgKey, bgKey, minRatio) => {
      const ratio = GetContrastRatio(
        theme.colors[fgKey],
        theme.colors[bgKey],
      );
      expect(ratio).toBeGreaterThanOrEqual(minRatio);
    },
  );

  it.each(ICON_OR_GRAPHIC_PAIRS)(
    "icon/graphic pair %s / %s meets 3:1",
    (fgKey, bgKey, minRatio) => {
      const ratio = GetContrastRatio(
        theme.colors[fgKey],
        theme.colors[bgKey],
      );
      expect(ratio).toBeGreaterThanOrEqual(minRatio);
    },
  );
});
