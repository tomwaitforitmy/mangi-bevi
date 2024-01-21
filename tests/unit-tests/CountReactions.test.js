import { CountReactions } from "../../common_functions/CountReactions";
import Reaction from "../../models/Reaction";

describe("CountReactions", () => {
  it("returns an array of objects with [{emoji: 'emoji', amount: 'int'}]", () => {
    const reactions = [
      new Reaction("tommy", "🥰"),
      new Reaction("kathrin", "🥰"),
      new Reaction("markus", "😋"),
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
      new Reaction("a", "🥰"),
      new Reaction("b", "🥰"),
      new Reaction("c", "🥰"),
      new Reaction("d", "👌"),
      new Reaction("e", "🥰"),
      new Reaction("f", "🥰"),
      new Reaction("g", "🥰"),
      new Reaction("h", "🥰"),
      new Reaction("i", "🥰"),
      new Reaction("j", "❤"),
      new Reaction("k", "😋"),
      new Reaction("l", "😋"),
      new Reaction("m", "😋"),
      new Reaction("n", "😋"),
      new Reaction("o", "😋"),
      new Reaction("p", "😋"),
      new Reaction("q", "😋"),
      new Reaction("r", "😋"),
      new Reaction("s", "😋"),
      new Reaction("t", "😋"),
      new Reaction("u", "😋"),
      new Reaction("v", "😋"),
      new Reaction("w", "😋"),
      new Reaction("x", "🤤"),
      new Reaction("y", "🥰"),
      new Reaction("z", "🤤"),
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
    const reactions = [new Reaction("markus", "😋")];
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
