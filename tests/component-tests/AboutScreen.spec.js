import React from "react";
import { PaperProvider } from "react-native-paper";
import { render, screen } from "@testing-library/react-native";
import AboutScreen from "../../screens/AboutScreen.js";
import lightTheme from "../../theme/lightTheme.js";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("expo-constants", () => ({
  expoConfig: { name: "Mangi & Bevi", version: "9.9.9" },
}));

describe("AboutScreen", () => {
  it("renders the app name and current version", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <AboutScreen />
      </PaperProvider>,
    );
    expect(screen.getByText("Mangi & Bevi")).toBeTruthy();
    expect(screen.getByText(/9\.9\.9/)).toBeTruthy();
  });
});
