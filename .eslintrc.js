var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  rules: {
    "jsx-quotes": [WARN, "prefer-double"],
    "react-native/no-inline-styles": OFF,
    quotes: [WARN, "double"],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        "no-inline-styles": false,
      },
    ],
  },
  extends: "@react-native-community",
};
