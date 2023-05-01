import React from "react";
import { render, screen } from "@testing-library/react-native";
import MyListItem from "../../components/MyListItem";
import Colors from "../../constants/Colors";

describe("MyButton", () => {
  const expectedSearchTermStyle = "color: " + Colors.searchTermHighlights;

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
    expect(screen.getByText("trillion")).toHaveStyle(expectedSearchTermStyle);
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
    expect(foundTerms[0]).toHaveStyle(expectedSearchTermStyle);
    expect(foundTerms[1]).toHaveStyle(expectedSearchTermStyle);
  });

  it("renders everything red, if full string matches", () => {
    render(<MyListItem title="trillion" searchTerm="trillion" />);

    expect(screen.getByText("trillion")).toHaveStyle(expectedSearchTermStyle);
  });

  it("renders nothing red, if nothing matches", () => {
    render(<MyListItem title="million" searchTerm="trillion" />);

    expect(screen.queryByText("trillion")).toBeFalsy();
    expect(screen.getByText("million")).toBeTruthy();
  });
});
