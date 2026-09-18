import React from "react";
import { PaperProvider } from "react-native-paper";
import { render, screen, fireEvent } from "@testing-library/react-native";
import OpenSourceLicensesScreen from "../../screens/OpenSourceLicensesScreen.js";
import lightTheme from "../../theme/lightTheme.js";

function renderScreen(packages) {
  return render(
    <PaperProvider theme={lightTheme}>
      <OpenSourceLicensesScreen
        licenseData={{ generatedAt: "2026-09-18T00:00:00.000Z", packages }}
      />
    </PaperProvider>,
  );
}

describe("OpenSourceLicensesScreen", () => {
  it("shows collapsed rows and expands full license text on tap", () => {
    renderScreen([
      {
        packageName: "some-mit-package",
        version: "1.0.0",
        license: "MIT",
        licenseText: "MIT LICENSE FULL TEXT HERE",
        repository: null,
      },
    ]);

    expect(screen.getByText("some-mit-package")).toBeTruthy();
    expect(screen.getByText("MIT")).toBeTruthy();
    expect(screen.queryByText("MIT LICENSE FULL TEXT HERE")).toBeNull();

    fireEvent.press(screen.getByText("some-mit-package"));

    expect(screen.getByText("MIT LICENSE FULL TEXT HERE")).toBeTruthy();
  });

  it("shows an explicit message when no packages require attribution", () => {
    renderScreen([]);

    expect(
      screen.getByText(/no.*license.*require.*attribution/i),
    ).toBeTruthy();
  });
});
