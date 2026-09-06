// dummyimage.com accepts hex background/foreground colors as path segments
// (no leading "#") between the size and the &text= query, so the "no image
// yet" placeholder can be built to match the current theme instead of
// dummyimage's fixed light-grey default, which stayed light regardless of
// the app's own dark mode.
export const GetPlaceholderImageUrl = (theme) => {
  const background = theme.colors.surfaceVariant.replace("#", "");
  const foreground = theme.colors.onSurfaceVariant.replace("#", "");

  return `https://dummyimage.com/300x200/${background}/${foreground}&text=No+image+yet`;
};
