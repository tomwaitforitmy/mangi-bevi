import { AddOrUpdateReaction } from "../../common_functions/AddOrUpdateReaction.js";
import Reaction from "../../models/Reaction";

describe("AddOrUpdateReaction", () => {
  it("adds a new reaction, if the user has none", () => {
    const reactions = [
      new Reaction("tommy", "🥰"),
      new Reaction("kathrin", "🥰"),
      new Reaction("markus", "😋"),
    ];
    const expected = [
      new Reaction("tommy", "🥰"),
      new Reaction("kathrin", "🥰"),
      new Reaction("markus", "😋"),
      new Reaction("someOther", "😋"),
    ];
    const newReaction = new Reaction("someOther", "😋");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("updates the value, if the user has a reaction", () => {
    const reactions = [
      new Reaction("tommy", "🥰"),
      new Reaction("kathrin", "🥰"),
      new Reaction("markus", "😋"),
    ];
    const expected = [
      new Reaction("tommy", "😋"),
      new Reaction("kathrin", "🥰"),
      new Reaction("markus", "😋"),
    ];
    const newReaction = new Reaction("tommy", "😋");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("removes the reaction, if the value is empty", () => {
    const reactions = [
      new Reaction("tommy", "😋"),
      new Reaction("kathrin", "🥰"),
    ];
    const expected = [new Reaction("tommy", "😋")];
    const newReaction = new Reaction("kathrin", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("does nothing, if user didn't have any reaction and the reaction is empty", () => {
    const reactions = [new Reaction("tommy", "😋")];
    const expected = [new Reaction("tommy", "😋")];
    const newReaction = new Reaction("kathrin", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("adds a reaction, if there are none", () => {
    const reactions = [];
    const expected = [new Reaction("tommy", "😋")];
    const newReaction = new Reaction("tommy", "😋");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("removes the last reaction, if the value is empty", () => {
    const reactions = [new Reaction("tommy", "😋")];
    const expected = [];
    const newReaction = new Reaction("tommy", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("handles empty values", () => {
    const reactions = [];
    const expected = [];
    const newReaction = new Reaction("tommy", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
});
