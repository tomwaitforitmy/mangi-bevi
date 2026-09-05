export const getDefaultScreenOptions = (theme) => ({
  headerShown: true,
  headerStyle: {
    backgroundColor: theme.colors.primary,
  },
  headerTintColor: theme.colors.onPrimary,
  headerTitleStyle: {
    fontWeight: "bold",
  },
});
