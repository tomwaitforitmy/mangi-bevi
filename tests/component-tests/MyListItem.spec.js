import React from "react";
import { PaperProvider } from "react-native-paper";
import { render, screen } from "@testing-library/react-native";
import MyListItem from "../../components/MyListItem";
import lightTheme from "../../theme/lightTheme";

describe("MyListItem", () => {
  const expectedColor = lightTheme.colors.searchTermHighlight;

  it("renders the correct title", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem title="Tomatoes" />
      </PaperProvider>,
    );
    expect(screen.queryByText("Tomatoes")).toBeTruthy();
  });
  it("renders long titles", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem title="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce. They stayed happily warm forever until they reached my belly." />
      </PaperProvider>,
    );
    expect(
      screen.queryByText(
        "10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce. They stayed happily warm forever until they reached my belly.",
      ),
    ).toBeTruthy();
  });

  it("renders red text with given search term", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem
          title="10000 million trillion billion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
          searchTerm="trillion"
        />
      </PaperProvider>,
    );
    expect(screen.getByText("trillion").props.style.color).toBe(expectedColor);
  });

  it("renders red text with given search term twice", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem
          title="10000 million trillion billion trillion tomatoes went on a long trip into a hot pan to get sweet nice tomato sauce"
          searchTerm="trillion"
        />
      </PaperProvider>,
    );

    const foundTerms = screen.getAllByText("trillion");

    expect(foundTerms.length).toBe(2);
    expect(foundTerms[0].props.style.color).toBe(expectedColor);
    expect(foundTerms[1].props.style.color).toBe(expectedColor);
  });

  it("renders red text with given search term twice even if that's the only text", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem title="trillion trillion" searchTerm="trillion" />
      </PaperProvider>,
    );

    const foundTerms = screen.getAllByText("trillion");

    expect(foundTerms.length).toBe(2);
    expect(foundTerms[0].props.style.color).toBe(expectedColor);
    expect(foundTerms[1].props.style.color).toBe(expectedColor);
  });

  it("renders red text with given search term twice if that's start and end of the text", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem
          title="trillion some stuff between trillion"
          searchTerm="trillion"
        />
      </PaperProvider>,
    );

    const foundTerms = screen.getAllByText("trillion");

    expect(foundTerms.length).toBe(2);
    expect(foundTerms[0].props.style.color).toBe(expectedColor);
    expect(foundTerms[1].props.style.color).toBe(expectedColor);
  });

  it("renders everything red, if full string matches", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem title="trillion" searchTerm="trillion" />
      </PaperProvider>,
    );

    expect(screen.getByText("trillion").props.style.color).toBe(expectedColor);
  });

  it("renders nothing red, if nothing matches", () => {
    render(
      <PaperProvider theme={lightTheme}>
        <MyListItem title="million" searchTerm="trillion" />
      </PaperProvider>,
    );

    expect(screen.queryByText("trillion")).toBeFalsy();
    expect(screen.getByText("million")).toBeTruthy();
    //Small hack, because I didn't now how check that color is not set
    expect(screen.getByText("million").props.style).toStrictEqual({
      fontSize: 16,
    });
  });
});
