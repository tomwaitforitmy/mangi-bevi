import { GetReward, GetNextReward } from "../../common_functions/GetReward";
import Reward from "../../models/Reward";
import { RECIPE_REWARDS } from "../../data/RecipeRewards";

describe("GetReward", () => {
  it("returns first reward from given array where threshold is still smaller than value", () => {
    const expectedReward = new Reward("Koch mit modernen Techniken", 7, 13);
    const result = GetReward(14, RECIPE_REWARDS);
    expect(result).toEqual(expectedReward);
  });
  it("returns first reward for 0", () => {
    const expectedReward = new Reward("Fertigsuppen-Koch", 1, 0);
    const result = GetReward(0, RECIPE_REWARDS);
    expect(result).toEqual(expectedReward);
  });
});

describe("GetNextReward", () => {
  it("returns first reward from given array where threshold is greater than value", () => {
    const expectedReward = new Reward("Koch mit modernen Techniken", 7, 13);
    const result = GetNextReward(12, RECIPE_REWARDS);
    expect(result).toEqual(expectedReward);
  });
  it("returns first reward for 0", () => {
    const expectedReward = new Reward("Dönerbudenstempelkartenbesitzer", 2, 2);
    const result = GetNextReward(0, RECIPE_REWARDS);
    expect(result).toEqual(expectedReward);
  });
  it("returns first reward from given array where threshold is greater than value (high value)", () => {
    const expectedReward = new Reward("Sous Chef Level 22", 16, 50);
    const result = GetNextReward(47, RECIPE_REWARDS);
    expect(result).toEqual(expectedReward);
  });
});
