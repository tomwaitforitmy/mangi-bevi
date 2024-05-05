import { AddOrUpdateReaction } from "../../common_functions/AddOrUpdateReaction.js";
import Reaction from "../../models/Reaction";

describe("AddOrUpdateReaction", () => {
  it("adds a Reaction, if the user has none", () => {
    const reactions = [
      Reaction("tommy", "🥰"),
      Reaction("kathrin", "🥰"),
      Reaction("markus", "😋"),
    ];
    const expected = [
      Reaction("tommy", "🥰"),
      Reaction("kathrin", "🥰"),
      Reaction("markus", "😋"),
      Reaction("someOther", "😋"),
    ];
    const newReaction = Reaction("someOther", "😋");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("updates the value, if the user has a reaction", () => {
    const reactions = [
      Reaction("tommy", "🥰"),
      Reaction("kathrin", "🥰"),
      Reaction("markus", "😋"),
    ];
    const expected = [
      Reaction("tommy", "😋"),
      Reaction("kathrin", "🥰"),
      Reaction("markus", "😋"),
    ];
    const newReaction = Reaction("tommy", "😋");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("removes the reaction, if the value is empty", () => {
    const reactions = [Reaction("tommy", "😋"), Reaction("kathrin", "🥰")];
    const expected = [Reaction("tommy", "😋")];
    const newReaction = Reaction("kathrin", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("does nothing, if user didn't have any reaction and the reaction is empty", () => {
    const reactions = [Reaction("tommy", "😋")];
    const expected = [Reaction("tommy", "😋")];
    const newReaction = Reaction("kathrin", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("adds a reaction, if there are none", () => {
    const reactions = [];
    const expected = [Reaction("tommy", "😋")];
    const newReaction = Reaction("tommy", "😋");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("removes the last reaction, if the value is empty", () => {
    const reactions = [Reaction("tommy", "😋")];
    const expected = [];
    const newReaction = Reaction("tommy", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
  it("handles empty values", () => {
    const reactions = [];
    const expected = [];
    const newReaction = Reaction("tommy", "");

    const result = AddOrUpdateReaction(reactions, newReaction);
    expect(result).toEqual(expected);
  });
});
