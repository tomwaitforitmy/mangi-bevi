import React from "react";
import { render, screen } from "@testing-library/react-native";
import AuthorBox from "../../components/AuthorBox.js";
import Colors from "../../constants/Colors.js";

describe("AuthorBox", () => {
  const expectedColor = Colors.primary;
  const creationDate = "2023-02-04T09:31:33.274Z";
  const editDate = "2023-02-05T09:50:37.219Z";

  it("renders the author if there is no editor", () => {
    render(
      <AuthorBox
        authorName="Tom"
        editorName=""
        creationDate={creationDate}
        editDate=""
      />,
    );
    expect(screen.queryByText("Tom")).toBeTruthy();
    expect(screen.getByText("Tom").props.style.color).toBe(expectedColor);

    screen.debug();
  });

  it("renders author and editor", () => {
    render(
      <AuthorBox
        authorName="Tom"
        editorName="Kathy"
        creationDate={creationDate}
        editDate={editDate}
      />,
    );
    expect(screen.queryByText("Tom")).toBeTruthy();
    expect(screen.queryByText("Kathy")).toBeTruthy();

    expect(screen.getByText("Tom").props.style.color).toBe(expectedColor);
    expect(screen.getByText("Kathy").props.style.color).toBe(expectedColor);
  });
});
