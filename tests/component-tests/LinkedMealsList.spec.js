import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import Meal from "../../models/Meal";
import LinkedMealsList from "../../components/LinkedMealsList";

describe("LinkedMealsList", () => {
  const m1 = Meal(
    "My nice title 😊",
    "m1",
    "https:/some/url",
    ["Sugar", "Salt"],
    ["Mix it all together"],
  );

  const m2 = Meal(
    "My nice title 😊 2",
    "m2",
    "https:/some/url",
    ["Sugar", "Salt"],
    ["Mix it all together"],
  );

  const m3 = Meal(
    "My nice title 😊 3",
    "m3",
    "https:/some/url",
    ["Sugar", "Salt"],
    ["Mix it all together"],
  );

  const meals = [m1, m2, m3];

  it("renders the title", () => {
    render(<LinkedMealsList meals={meals} />);
    screen.getByText("My nice title 😊");
    screen.getByText("My nice title 😊 2");
    screen.getByText("My nice title 😊 3");
  });

  it("does not render selected meals icon", () => {
    m3.isSelected = true;
    render(<LinkedMealsList meals={meals} />);
    const selectedIcon = "🍕";
    expect(screen.queryByText(selectedIcon)).toBeFalsy();
  });
});
