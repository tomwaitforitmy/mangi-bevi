import { CountReactions } from "../../common_functions/CountReactions";
import Reaction from "../../models/Reaction";

describe("CountReactions", () => {
  it("returns an array of objects with [{emoji: 'emoji', amount: 'int'}]", () => {
    const reactions = [
      Reaction("tommy", "🥰"),
      Reaction("kathrin", "🥰"),
      Reaction("markus", "😋"),
    ];
    const expected = [
      { emoji: "🥰", amount: 2 },
      { emoji: "😋", amount: 1 },
    ];
    const result = CountReactions(reactions);
    expect(result).toEqual(expected);
  });
  it("returns expected for slightly more complex input", () => {
    const reactions = [
      Reaction("a", "🥰"),
      Reaction("b", "🥰"),
      Reaction("c", "🥰"),
      Reaction("d", "👌"),
      Reaction("e", "🥰"),
      Reaction("f", "🥰"),
      Reaction("g", "🥰"),
      Reaction("h", "🥰"),
      Reaction("i", "🥰"),
      Reaction("j", "❤"),
      Reaction("k", "😋"),
      Reaction("l", "😋"),
      Reaction("m", "😋"),
      Reaction("n", "😋"),
      Reaction("o", "😋"),
      Reaction("p", "😋"),
      Reaction("q", "😋"),
      Reaction("r", "😋"),
      Reaction("s", "😋"),
      Reaction("t", "😋"),
      Reaction("u", "😋"),
      Reaction("v", "😋"),
      Reaction("w", "😋"),
      Reaction("x", "🤤"),
      Reaction("y", "🥰"),
      Reaction("z", "🤤"),
    ];
    const expected = [
      { emoji: "😋", amount: 13 },
      { emoji: "🥰", amount: 9 },
      { emoji: "🤤", amount: 2 },
      { emoji: "👌", amount: 1 },
      { emoji: "❤", amount: 1 },
    ];
    const result = CountReactions(reactions);
    expect(result).toEqual(expected);
  });
  it("returns expected", () => {
    const reactions = [Reaction("markus", "😋")];
    const expected = [{ emoji: "😋", amount: 1 }];
    const result = CountReactions(reactions);
    expect(result).toEqual(expected);
  });
  it("handles empty lists", () => {
    const reactions = [];
    const expected = [];
    const result = CountReactions(reactions);
    expect(result).toEqual(expected);
  });
  it("handles undefined", () => {
    const reactions = undefined;
    const expected = [];
    const result = CountReactions(reactions);
    expect(result).toEqual(expected);
  });
  it("handles null", () => {
    const reactions = null;
    const expected = [];
    const result = CountReactions(reactions);
    expect(result).toEqual(expected);
  });
});
