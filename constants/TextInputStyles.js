import { StyleSheet } from "react-native";
import Colors from "./Colors";

export const textInputStyles = StyleSheet.create({
  input: {
    color: Colors.black,
    backgroundColor: Colors.white,
    width: "100%",
    minHeight: 40,
    fontSize: 20,
    borderRadius: 10,
    paddingHorizontal: 6, //to align text with rounded corners
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginHorizontal: 5,
    marginBottom: 5,
  },
});
