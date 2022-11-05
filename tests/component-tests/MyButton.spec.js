import React from "react";
import { render, screen } from "@testing-library/react-native";
import MyButton from "../../components/MyButton";

describe("MyButton", () => {
  it("renders the correct message", () => {
    render(<MyButton>{"Create Tag"}</MyButton>);
    expect(screen.getByRole("button", "Create Tag")).toBeTruthy();
  });
});
