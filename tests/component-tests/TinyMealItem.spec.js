import React from "react";
import { render, screen } from "@testing-library/react-native";
import TinyMealItem from "../../components/TinyMealItem";
import Meal from "../../models/Meal";

describe("TinyMealItem", () => {
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
    screen.getByText("My nice title 😊");
  });

  it("renders is a button", () => {
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

  it("changes the state upon re-render", () => {
    niceInput.isSelected = false;
    render(<TinyMealItem meal={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
    niceInput.isSelected = true;
    render(<TinyMealItem meal={niceInput} />);
    expect(screen.queryByText(selectedIcon)).toBeTruthy();
  });
});
