import React from "react";
import { render, screen } from "@testing-library/react-native";
import HighlightedText from "../../components/HighlightedText.js";
import Colors from "../../constants/Colors";

describe("HighlightedText", () => {
  const expectedColor = Colors.searchTermHighlight;

  it("renders the correct text", () => {
    render(<HighlightedText text="Tomatoes" />);
    expect(screen.queryByText("Tomatoes")).toBeTruthy();
  });
  it("renders long texts", () => {
    render(
      <HighlightedText text="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce. They stayed happily warm forever until they reached my belly." />,
    );
    expect(
      screen.queryByText(
        "10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce. They stayed happily warm forever until they reached my belly.",
      ),
    ).toBeTruthy();
  });

  it("renders red text with given search term", () => {
    render(
      <HighlightedText
        text="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
        searchTerm="trillion"
        highlightColor={Colors.searchTermHighlight}
      />,
    );
    expect(screen.getByText("trillion").props.style.color).toBe(expectedColor);
  });

  it("has default color red", () => {
    render(
      <HighlightedText
        text="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
        searchTerm="trillion"
      />,
    );
    expect(screen.getByText("trillion").props.style.color).toBe("red");
  });

  it("color can be set", () => {
    render(
      <HighlightedText
        text="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
        searchTerm="trillion"
        highlightColor={"blue"}
      />,
    );
    expect(screen.getByText("trillion").props.style.color).toBe("blue");
  });

  it("renders red text with given search term twice", () => {
    render(
      <HighlightedText
        text="10000 million trillion billion trillion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
        searchTerm="trillion"
        highlightColor={Colors.searchTermHighlight}
      />,
    );

    const foundTerms = screen.getAllByText("trillion");

    expect(foundTerms.length).toBe(2);
    expect(foundTerms[0].props.style.color).toBe(expectedColor);
    expect(foundTerms[1].props.style.color).toBe(expectedColor);
  });

  it("renders everything red, if full string matches", () => {
    render(
      <HighlightedText
        text="trillion"
        searchTerm="trillion"
        highlightColor={Colors.searchTermHighlight}
      />,
    );

    expect(screen.getByText("trillion").props.style.color).toBe(expectedColor);
  });

  it("renders nothing red, if nothing matches", () => {
    render(<HighlightedText text="million" searchTerm="trillion" />);

    expect(screen.queryByText("trillion")).toBeFalsy();
    expect(screen.getByText("million").props.style.color).not.toBe(
      expectedColor,
    );

    expect(screen.getByText("million")).toBeTruthy();
  });
});
