import React from "react";
import { render, screen } from "@testing-library/react-native";
import MyListItem from "../../components/MyListItem";

describe("MyButton", () => {
  it("renders the correct title", () => {
    render(<MyListItem title="Tomatoes" />);
    expect(screen.queryByText("Tomatoes")).toBeTruthy();
  });
  it("renders long titles", () => {
    render(
      <MyListItem title="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce. They stayed happily warm forever until they reached my belly." />,
    );
    expect(
      screen.queryByText(
        "10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce. They stayed happily warm forever until they reached my belly.",
      ),
    ).toBeTruthy();
  });

  it("renders red text with given search term", () => {
    render(
      <MyListItem
        title="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
        searchTerm="trillion"
      />,
    );
    expect(screen.getByText("trillion")).toHaveStyle('color: "red"');
  });

  it("renders red text with given search term twice", () => {
    render(
      <MyListItem
        title="10000 million trillion billion trillion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
        searchTerm="trillion"
      />,
    );

    const foundTerms = screen.getAllByText("trillion");

    expect(foundTerms.length).toBe(2);
    expect(foundTerms[0]).toHaveStyle('color: "red"');
    expect(foundTerms[1]).toHaveStyle('color: "red"');
  });
});
