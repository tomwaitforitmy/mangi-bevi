import React from "react";
import { Pressable, Text } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import ThemeProvider from "../../theme/ThemeProvider";
import { useAppTheme } from "../../theme/useAppTheme";
import { useAppearanceSelection } from "../../theme/useAppearanceSelection";
import { DARK } from "../../theme/AppearanceOptions";

function ThemeProbe() {
  const theme = useAppTheme();
  const { setSelection } = useAppearanceSelection();

  return (
    <>
      <Text testID="dark-flag">{String(theme.dark)}</Text>
      <Text testID="background">{theme.colors.background}</Text>
      <Pressable testID="switch-to-dark" onPress={() => setSelection(DARK)}>
        <Text>switch to dark</Text>
      </Pressable>
    </>
  );
}

describe("ThemeProvider", () => {
  it("provides a theme to descendants and re-renders them when the selection changes", () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("dark-flag").props.children).toBe("false");
    const lightBackground = screen.getByTestId("background").props.children;

    fireEvent.press(screen.getByTestId("switch-to-dark"));

    expect(screen.getByTestId("dark-flag").props.children).toBe("true");
    const darkBackground = screen.getByTestId("background").props.children;
    expect(darkBackground).not.toBe(lightBackground);
  });
});
