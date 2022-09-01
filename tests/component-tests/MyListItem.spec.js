import React from "react";
import { render, screen } from "@testing-library/react-native";
import MyListItem from "../../components/MyListItem";

describe("MyButton", () => {
  it("renders the correct message", () => {
    render(<MyListItem title="Tomatoes" />);
    expect(screen.queryByText("Tomatoes")).toBeTruthy();
  });
});
