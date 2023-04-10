import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import TinyMealItem from "../../components/TinyMealItem";
import Meal from "../../models/Meal";

describe("TinyMealItem", () => {
  const expectedTitle = "My nice title 😊";
  const niceInput = new Meal(
    "My nice title 😊",
    "-N6nqAyvPZDY5N6fQHWo",
    "https:/some/url",
    ["Sugar", "Salt"],
    ["Mix it all together"],
    [],
    null,
    null,
    "-N7fTSUz_WVEjEruisQV",
    null,
    null,
    null,
    null,
  );
  const selectedIcon = "🍕";

  it("renders the title", () => {
    render(<TinyMealItem meal={niceInput} />);
    screen.getByText(expectedTitle);
  });

  it("is a button", () => {
    render(<TinyMealItem meal={niceInput} />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("renders the selected icon", () => {
    niceInput.isSelected = true;
    render(<TinyMealItem meal={niceInput} />);
    screen.getByText(selectedIcon);
  });

  it("does not render the selected icon", () => {
    niceInput.isSelected = false;
    render(<TinyMealItem meal={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
  });

  it("changes the selected state upon re-render", () => {
    niceInput.isSelected = false;
    render(<TinyMealItem meal={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
    niceInput.isSelected = true;
    render(<TinyMealItem meal={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeTruthy();
  });

  it("can have a custom onPresMeal", () => {
    const mockOnPress = jest.fn();
    niceInput.isSelected = true;
    render(<TinyMealItem meal={niceInput} onPressMeal={mockOnPress} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
    fireEvent(screen.getByText(expectedTitle), "onPress");
    expect(mockOnPress).toBeCalledTimes(1);
  });
});
