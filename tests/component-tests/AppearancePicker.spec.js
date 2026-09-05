import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import ThemeProvider from "../../theme/ThemeProvider";
import AppearancePicker from "../../components/AppearancePicker";
import { DARK, AUTOMATIC, STORAGE_KEY } from "../../theme/AppearanceOptions";

const isMarkedSelected = (testId) => {
  const style = screen.getByTestId(testId).props.style;
  // style is [baseStyle, isSelected && selectedStyle]
  return Boolean(style[1]);
};

describe("AppearancePicker", () => {
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it("defaults to Automatic selected when nothing is stored", () => {
    render(
      <ThemeProvider>
        <AppearancePicker />
      </ThemeProvider>,
    );

    expect(isMarkedSelected(`appearance-option-${AUTOMATIC}`)).toBe(true);
    expect(isMarkedSelected(`appearance-option-${DARK}`)).toBe(false);
  });

  it("persists a new selection and marks it selected immediately", async () => {
    render(
      <ThemeProvider>
        <AppearancePicker />
      </ThemeProvider>,
    );

    fireEvent.press(screen.getByTestId(`appearance-option-${DARK}`));

    expect(isMarkedSelected(`appearance-option-${DARK}`)).toBe(true);
    expect(isMarkedSelected(`appearance-option-${AUTOMATIC}`)).toBe(false);

    await waitFor(async () => {
      expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe(DARK);
    });
  });

  it("reflects a previously-stored selection on mount", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, DARK);

    render(
      <ThemeProvider>
        <AppearancePicker />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(isMarkedSelected(`appearance-option-${DARK}`)).toBe(true);
    });
  });
});
