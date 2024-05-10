import React from "react";
import { render, screen } from "@testing-library/react-native";
import CookedByUserList from "../../components/CookedByUserList.js";
import MealCookedByUser from "../../models/MealCookedByUser.js";

describe("CookedByUserList", () => {
  it("renders one cook", () => {
    const cookedByUser = [MealCookedByUser("1", "m1", "u1")];
    const users = [{ id: "u1", name: "Tommy" }];

    render(<CookedByUserList cookedByUser={cookedByUser} users={users} />);
    expect(screen.queryByText("Tommy cooked this")).toBeTruthy();
  });

  it("groups a cook", () => {
    const users = [
      { id: "u1", name: "Tommy" },
      { id: "u2", name: "Kathrine" },
      { id: "u3", name: "John" },
    ];

    const cookedByUser = [
      MealCookedByUser("1", "m1", "u1"),
      MealCookedByUser("2", "m1", "u2"),
      MealCookedByUser("3", "m1", "u1"),
    ];

    render(<CookedByUserList cookedByUser={cookedByUser} users={users} />);

    expect(screen.queryByText("Tommy cooked this 2 times")).toBeTruthy();
    expect(screen.queryByText("Kathrine cooked this")).toBeTruthy();
  });
});
