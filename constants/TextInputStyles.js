import { StyleSheet } from "react-native";

export const getTextInputStyles = (theme) => ({
  ...StyleSheet.create({
    input: {
      color: theme.colors.black,
      backgroundColor: theme.colors.white,
      width: "100%",
      minHeight: 40,
      fontSize: 20,
      borderRadius: 10,
      paddingHorizontal: 6, //to align text with rounded corners
      borderWidth: 1,
      borderColor: theme.colors.gray,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginHorizontal: 5,
      marginBottom: 5,
    },
  }),
  // Paired with `input`'s white/black background+text — NOT
  // theme.colors.textInputPlaceholderColor, which is calibrated for the
  // differently-colored textInputBackground (see InputListViewContainer.js)
  // and is unreadable against this white/black pairing.
  placeholderTextColor: theme.colors.onSurfaceVariant,
});
