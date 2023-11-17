import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import InputListViewContainer from "../../components/InputListViewContainer";
// Source to this fix: https://stackoverflow.com/questions/75934507/after-upgrading-to-expo48-meeting-this-error-typeerror-cannot-read-properties
jest.mock("expo-font");
jest.mock("expo-asset");

describe("InputListViewContainer", () => {
  const sampleData = ["lemon", "pie", "tomato", "sauce"];

  it("renders a custom placeholder", () => {
    render(<InputListViewContainer placeholder="text" />);
    screen.queryByPlaceholderText("Enter text");
  });
  it("renders title and sample data", () => {
    render(
      <InputListViewContainer placeholder="your data here" data={sampleData} />,
    );
    screen.queryByPlaceholderText("Enter your data here");
    screen.getByText("lemon");
    screen.getByText("pie");
    screen.getByText("tomato");
    screen.getByText("sauce");
  });

  it("activates onLongPress", () => {
    const mockOnLongPress = jest.fn();
    render(
      <InputListViewContainer
        placeholder="your data here"
        data={sampleData}
        onLongPress={mockOnLongPress}
      />,
    );
    fireEvent(screen.getByText("tomato"), "onLongPress");
    expect(mockOnLongPress).toBeCalledTimes(1);
  });

  it("activates onPress icon with correct text", () => {
    const mockOnIconPress = jest.fn();
    render(
      <InputListViewContainer
        placeholder="your data here"
        data={sampleData}
        onPressIcon={mockOnIconPress}
      />,
    );
    fireEvent.press(screen.getByTestId("tomato-icon"));
    expect(mockOnIconPress).toBeCalledWith("tomato");
  });

  it("activates onChangeText with correct text", () => {
    const mockOnChangeText = jest.fn();
    render(
      <InputListViewContainer
        placeholder="your data here"
        data={sampleData}
        onChangeText={mockOnChangeText}
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Enter text"), "garlic");
    expect(mockOnChangeText).toBeCalledWith("garlic");
  });
});
