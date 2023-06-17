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

  it("renders Sommerrollen recipe with term Somm (corrupt data!)", () => {
    const sommerrollen = {
      authorId: "-N7fTSUz_WVEjEruisQV",
      creationDate: "2023-01-15T15:29:17.522Z",
      editDate: "2023-01-15T15:29:17.522Z",
      editorId: "-N7fTSUz_WVEjEruisQV",
      id: "-N7lwQChetcwIDKAMgFG",
      imageUrls: [
        "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/1ec2bf40-4af3-481f-b2f9-801221a57297?alt=media&token=2bd151e4-8165-4f22-80f0-656aa684e03f",
        "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/f9cb5db6-fb8e-4a67-b9c4-6eae3e6758c6?alt=media&token=87810324-1764-4794-8113-3cd2c4dffc20",
        "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/99378e3a-cb1f-4094-88bd-23e8e13cb7d9?alt=media&token=9b95132b-0c96-4b93-943e-fa4a1d9b70de",
      ],
      ingredients: [
        ["Für 2 Personen"],
        "Dips aus anderen Mangis vorbereiten",
        "Mögliche Gemüse",
        "2 Karotten",
        "1/2 Gurke",
        "5 Blätter Eisbergsalat",
        "100g Austernpilze, gebraten",
        "75g Tofu, gebraten",
        "15 - 20 Stück Reispapier",
        "1 Kiwi",
        "1 Nektarine",
        "Etwas Koriander, Minze und/oder Thai Basilikum ",
        "Ca. 50g sehr dünne (1mm) Reisnudeln auch als Füllung",
      ],
      isSelected: false,
      links: [
        "-NEfyZHDYLuCZPMmdXTJ",
        "-N7ltfC3Ry5XaxBGrVSZ",
        "-N7ls2X3Gz3XIgOuisaU",
      ],
      primaryImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/testshop-39aae.appspot.com/o/1ec2bf40-4af3-481f-b2f9-801221a57297?alt=media&token=2bd151e4-8165-4f22-80f0-656aa684e03f",
      rating: 0,
      steps: [
        "Alles für die Füllung in feine Streifen schneiden. ",
        "Das Reispapier kurz nass machen z.B. in einem Teller. Dann noch kurz warten bis es gut faltbar ist. ",
        "Zutaten nach Belieben einrollen. Man kann z.B. ein Blatt Salat um die Füllung wickeln, damit alles besser zusammen hält. ",
        "Tipps gibt's hier https://www.kitchenstories.com/de/stories/sommerrollen-selber-machen-von-der-fullung-bis-zum-dip",
      ],
      tags: [
        "-MxzwG0puDQZm6Ro_3p7",
        "-MwxE9Xaei0yFU-Mreqe",
        "-MwTDLWYGPssWA_vsQqg",
        "-MwNSaYvWOqOCUz_5wb1",
        "-MwMo4HhescwqBiKTh05",
        "-MyavIJe0MYykk1i2zmy",
      ],
      title: "Sommerrollen",
    };

    sommerrollen.ingredients.forEach((i) => {
      render(<HighlightedText text={i} searchTerm="somm" />);
    });

    sommerrollen.steps.forEach((i) => {
      render(<HighlightedText text={i} searchTerm="somm" />);
    });
  });
});
