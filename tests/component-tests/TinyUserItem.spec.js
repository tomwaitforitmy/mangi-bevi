import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import TinyUserItem from "../../components/TinyUserItem.js";
import User from "../../models/User.js";

describe("TinyUserItem", () => {
  const expectedTitle = "My nice name 😊";
  const niceInput = new User(
    "-N6nqAyvPZDY5N6fQHWo",
    "My nice name 😊",
    "user1@users.com",
    [],
    "some id",
  );
  const selectedIcon = "🍕";

  it("renders the name", () => {
    render(<TinyUserItem user={niceInput} />);
    screen.getByText(expectedTitle);
  });

  it("is a button", () => {
    render(<TinyUserItem user={niceInput} />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("renders the selected icon", () => {
    niceInput.isSelected = true;
    render(<TinyUserItem user={niceInput} />);
    screen.getByText(selectedIcon);
  });

  it("does not render the selected icon", () => {
    niceInput.isSelected = false;
    render(<TinyUserItem user={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
  });

  it("changes the selected state upon re-render", () => {
    niceInput.isSelected = false;
    render(<TinyUserItem user={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
    niceInput.isSelected = true;
    render(<TinyUserItem user={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeTruthy();
  });

  it("can have a custom onPressUser", () => {
    const mockOnPress = jest.fn();
    niceInput.isSelected = true;
    render(<TinyUserItem user={niceInput} onPressUser={mockOnPress} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
    fireEvent(screen.getByText(expectedTitle), "onPress");
    expect(mockOnPress).toBeCalledTimes(1);
  });
});
