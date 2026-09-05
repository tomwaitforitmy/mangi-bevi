const HEX_PATTERN = /^#?([a-f\d]{3}|[a-f\d]{6})$/i;

const expandShortHex = (hex) =>
  hex.length === 3
    ? hex
        .split("")
        .map((c) => c + c)
        .join("")
    : hex;

const hexToRgb = (color) => {
  const match = HEX_PATTERN.exec(color.trim());
  if (!match) {
    throw new Error(`GetContrastRatio: unsupported color format "${color}"`);
  }
  const hex = expandShortHex(match[1]);
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
};

const toLinear = (channel) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const relativeLuminance = ({ r, g, b }) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

export const GetContrastRatio = (colorA, colorB) => {
  const luminanceA = relativeLuminance(hexToRgb(colorA));
  const luminanceB = relativeLuminance(hexToRgb(colorB));
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
};
