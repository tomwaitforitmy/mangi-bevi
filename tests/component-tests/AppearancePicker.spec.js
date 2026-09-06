import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import ThemeProvider from "../../theme/ThemeProvider";
import AppearancePicker from "../../components/AppearancePicker";
import { DARK, AUTOMATIC, STORAGE_KEY } from "../../theme/AppearanceOptions";

const isSelected = (testId) => screen.getByTestId(testId).props.value === true;

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

    expect(isSelected(`appearance-option-${AUTOMATIC}`)).toBe(true);
    expect(isSelected(`appearance-option-${DARK}`)).toBe(false);
  });

  it("persists a new selection and marks it selected immediately", async () => {
    render(
      <ThemeProvider>
        <AppearancePicker />
      </ThemeProvider>,
    );

    fireEvent(screen.getByTestId(`appearance-option-${DARK}`), "valueChange", true);

    expect(isSelected(`appearance-option-${DARK}`)).toBe(true);
    expect(isSelected(`appearance-option-${AUTOMATIC}`)).toBe(false);

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
      expect(isSelected(`appearance-option-${DARK}`)).toBe(true);
    });
  });

  it("switching the active option off is a no-op", async () => {
    render(
      <ThemeProvider>
        <AppearancePicker />
      </ThemeProvider>,
    );

    fireEvent(screen.getByTestId(`appearance-option-${AUTOMATIC}`), "valueChange", false);

    expect(isSelected(`appearance-option-${AUTOMATIC}`)).toBe(true);
  });
});
