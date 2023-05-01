import { SplitTextToHighlight } from "../../common_functions/SplitTextToHighlight.js";

describe("SplitTextToHighlight", () => {
  it("creates an array with each search term as single item", () => {
    const inputText = "Pasta with tomato sauce is the best pasta.";
    const searchTerm = "Pasta";
    const expected = ["Pasta", " with tomato sauce is the best ", "pasta", "."];

    const result = SplitTextToHighlight(inputText, searchTerm);
    expect(result).toEqual(expected);
  });

  it("matches in the middle", () => {
    const inputText = "My self-made pasta with tomato sauce is the best pasta.";
    const searchTerm = "Pasta";
    const expected = [
      "My self-made ",
      "pasta",
      " with tomato sauce is the best ",
      "pasta",
      ".",
    ];

    const result = SplitTextToHighlight(inputText, searchTerm);
    expect(result).toEqual(expected);
  });

  it("matches single word", () => {
    const inputText = "pasta";
    const searchTerm = "Pasta";
    const expected = ["pasta"];

    const result = SplitTextToHighlight(inputText, searchTerm);
    expect(result).toEqual(expected);
  });

  it("matches two words", () => {
    const inputText = "pasta pasta";
    const searchTerm = "Pasta";
    const expected = ["pasta", " ", "pasta"];

    const result = SplitTextToHighlight(inputText, searchTerm);
    expect(result).toEqual(expected);
  });

  it("matches case insensitive", () => {
    const inputText = "pasta PASTA and something pAsTa and pasta!";
    const searchTerm = "Pasta";
    const expected = [
      "pasta",
      " ",
      "PASTA",
      " and something ",
      "pAsTa",
      " and ",
      "pasta",
      "!",
    ];

    const result = SplitTextToHighlight(inputText, searchTerm);
    expect(result).toEqual(expected);
  });

  it("handles ? as well", () => {
    const inputText = "Who doesn't like pasta?";
    const searchTerm = "Pasta?";
    const expected = ["Who doesn't like ", "pasta?"];

    const result = SplitTextToHighlight(inputText, searchTerm);
    expect(result).toEqual(expected);
  });
});
