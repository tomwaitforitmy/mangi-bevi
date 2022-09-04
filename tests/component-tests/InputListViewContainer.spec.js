import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import InputListViewContainer from "../../components/InputListViewContainer";

describe("InputListViewContainer", () => {
  const sampleData = ["lemon", "pie", "tomato", "sauce"];

  it("renders a title", () => {
    render(<InputListViewContainer title="Insert your data here" />);
    screen.getByText("Insert your data here");
  });
  it("renders title and sample data", () => {
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
      />,
    );
    screen.getByText("Insert your data here");
    screen.getByText("lemon");
    screen.getByText("pie");
    screen.getByText("tomato");
    screen.getByText("sauce");
  });

  it("activates onLongPress", () => {
    const mockOnLongPress = jest.fn();
    render(
      <InputListViewContainer
        title="Insert your data here"
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
        title="Insert your data here"
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
        title="Insert your data here"
        data={sampleData}
        onChangeText={mockOnChangeText}
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Enter text"), "garlic");
    expect(mockOnChangeText).toBeCalledWith("garlic");
  });
});
