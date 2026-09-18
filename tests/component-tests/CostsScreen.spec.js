import React from "react";
import { PaperProvider } from "react-native-paper";
import { render, screen } from "@testing-library/react-native";
import CostsScreen from "../../screens/CostsScreen.js";
import lightTheme from "../../theme/lightTheme.js";

const costsConfig = {
  hourlyRateEur: 25,
  asOf: "2026-09-18",
  monetaryCosts: [
    { label: "Apple Developer Program (4 years)", amountEur: 396 },
    { label: "Google Play Console (one-time)", amountEur: 25 },
    { label: "Claude Code (2 months)", amountEur: 44 },
  ],
};

const devHoursEstimate = {
  estimatedHours: 423.3,
  sessionCount: 329,
  commitCount: 1264,
  generatedAt: "2026-09-18T00:00:00.000Z",
  methodology:
    "Estimated from commit history by grouping commits into work sessions.",
};

function renderScreen() {
  return render(
    <PaperProvider theme={lightTheme}>
      <CostsScreen costsConfig={costsConfig} devHoursEstimate={devHoursEstimate} />
    </PaperProvider>,
  );
}

describe("CostsScreen", () => {
  it("renders each monetary line item and their sum", () => {
    renderScreen();

    expect(
      screen.getByText(/Apple Developer Program \(4 years\)/),
    ).toBeTruthy();
    expect(screen.getByText(/396/)).toBeTruthy();
    expect(screen.getByText(/Google Play Console/)).toBeTruthy();
    expect(screen.getAllByText(/25/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Claude Code/)).toBeTruthy();
    expect(screen.getByText(/44/)).toBeTruthy();
    // monetary sum: 396 + 25 + 44 = 465
    expect(screen.getByText(/465/)).toBeTruthy();
  });

  it("renders the hours-based estimate computed from devHoursEstimate * hourlyRateEur", () => {
    renderScreen();

    // 423.3 * 25 = 10582.5 -> rendered rounded to the nearest euro
    expect(screen.getByText(/10[.,]58[23]/)).toBeTruthy();
  });

  it("renders the methodology text, as-of date, and the free/ad-free statement", () => {
    renderScreen();

    expect(
      screen.getByText(/Estimated from commit history/),
    ).toBeTruthy();
    expect(screen.getByText(/2026-09-18/)).toBeTruthy();
    expect(screen.getByText(/free.*ad-free|free of charge/i)).toBeTruthy();
  });
});
